import { Injectable } from '@angular/core';
import { takeLast } from 'rxjs/operators';
import { Item } from '../interfaces/item';
import { BaseSkill, EliteUnlockReqs, Module, ModuleMission, Operator, OperatorBaseSkill, Skill, SkillLevel, SkillUnlockReqs, StatBreakpoint, Summon, Talent } from '../interfaces/operator';
import { Grid } from '../interfaces/range';
import { DatabaseService } from './database.service';
import { ManualJsonParserService } from './manual-json-parser.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseJsonParserService {

  constructor(
    private database: DatabaseService,
    private manualParser: ManualJsonParserService
  ) { }

  getStats(operator): StatBreakpoint[] {
    let opStats: StatBreakpoint[] = [];

    let eliteCount: number = 0;

    // since every elite needs max level of last, keep track of it
    let lastMaxLevel: number = 0;
    
    operator.phases.forEach(elite => {

      const eliteStats = elite.attributesKeyFrames;

      let minStats = eliteStats[0].data
      this.renameStats(minStats);

      let maxStats = eliteStats[1].data 
      this.renameStats(maxStats);

      let eliteUnlockReqs: EliteUnlockReqs;
      if(elite.evolveCost) {

        let items: Item[] = [];

        // get LMD cost of this elite
        const itemFromDb = this.database.items.find(thisItem => '4001' == thisItem.id)
        const lmd: Item = {
          id: '4001',
          name: itemFromDb.name,
          imgId: itemFromDb.imgId,
          rarity: itemFromDb.rarity,
          amount: this.getEliteLmdUnlockReq(operator.rarity+1, eliteCount).toLocaleString()
        }
        items.push(lmd);

        // get item costs of this elite
        elite.evolveCost.forEach(item => {
          const itemFromDb = this.database.items.find(thisItem => item.id == thisItem.id)

          const newItem: Item = {
            id: item.id,
            name: itemFromDb.name,
            imgId: itemFromDb.imgId,
            rarity: itemFromDb.rarity,
            amount: item.count
          }
          items.push(newItem);
        })

        eliteUnlockReqs = {
          level: lastMaxLevel,
          items: items
        }
      }

      const newBreakpoint: StatBreakpoint = {
        elite: eliteCount,
        minLevel: eliteStats[0].level,
        maxLevel: eliteStats[1].level,
        minStats: minStats,
        maxStats: maxStats,
        rangeId: elite.rangeId,
        eliteUnlockReqs: eliteUnlockReqs
      }
      opStats.push(newBreakpoint)
      lastMaxLevel = newBreakpoint.maxLevel;
      eliteCount++;
    })

    return opStats;
  }
  
  getPotentials(operator: any): string[] {
    if(!operator.potentialRanks) {
      return [];
    }

    let potentials: string[] = [];

    operator.potentialRanks.forEach(potential => {
      potentials.push(potential.description);
    })

    return potentials;
  }

  getSkillLevelUnlockReqs(operator: any) {
    const unlockReqs: SkillUnlockReqs[] = [];

    operator.allSkillLvlup.forEach(skill => {
      if(!skill.lvlUpCost) {
        return;
      }
      
      const newUnlockReq: SkillUnlockReqs = {
        items: [],
        level: skill.unlockCond.level,
        elite: skill.unlockCond.phase
      };

      // get item costs of this skill level
      skill.lvlUpCost.forEach(item => {
        const newItem: Item = {
          name: this.getItem(item.id).name,
          id: item.id,
          amount: item.count,
          imgId: this.getItem(item.id).imgId,
          rarity: this.getItem(item.id).rarity
        }
        newUnlockReq.items.push(newItem)
      })

      unlockReqs.push(newUnlockReq);
    
    })

    return unlockReqs;
  }

  getSkillMasteryUnlockReqs(skill: any) {
    const masteryReqs: SkillUnlockReqs[] = [];

    skill.levelUpCostCond.forEach(level => {
      const newMasteryReq: SkillUnlockReqs = {
        items: [],
        level: level.unlockCond.level,
        elite: level.unlockCond.phase,
        duration: level.lvlUpTime
      }
      if(level.levelUpCost == null) {
        return;
      }

      // get item costs of this mastery
      level.levelUpCost.forEach(item => {
        const newItem: Item = {
          name: this.getItem(item.id).name,
          id: this.getItem(item.id).id,
          imgId: this.getItem(item.id).imgId,
          rarity: this.getItem(item.id).rarity,
          amount: item.count
        }
        newMasteryReq.items.push(newItem);
      })

      masteryReqs.push(newMasteryReq);
    })

    return masteryReqs;
  }

  getSkillLevels(skill: Skill, jsonSkill: any, operator: Operator): SkillLevel[] {

    jsonSkill.levels.forEach(level => {

      level.blackboard.forEach(stat => {
        stat = this.replaceKey(stat, 'key', 'name');
      })

      const newLevel: SkillLevel = {
        duration: level.duration,
        spCost: level.spData.spCost,
        initialSp: level.spData.initSp,
        stats: level.blackboard,
        range: level.rangeId
    }

      skill.levels.push(newLevel);
    })

    return skill.levels;
  }

  getTalents(entry: any): Talent[] {
    if(!entry.talents) {
      return [];
    }

    let talents: Talent[] = [];

    entry.talents.forEach(talent => {

      let newTalent: Talent = {
        name: '',
        descriptions: [],
        unlockConditions: []
      };

      // candidate = level
      talent.candidates.forEach(candidate => {
        
        // add required potential to unlockCondition
        candidate.unlockCondition.potential = candidate.requiredPotentialRank;

        candidate.unlockCondition = this.replaceKey(candidate.unlockCondition, 'phase', 'elite')
        
        newTalent.descriptions.push(this.stylizeText(candidate.description));

        newTalent.unlockConditions.push(candidate.unlockCondition);
        newTalent.name = candidate.name;
      })
      newTalent.maxLevel = newTalent.descriptions.length;

      talents.push(newTalent);
    })

    // separate elite upgrades
    let talentIndex = 0;
    talents.forEach(talent => {
      let currentElite = -1;
      let startingEliteIndex = 0;
      let startingElite2Index = 0;
      let hasEliteUpgrade: boolean;
      let hasElite2Upgrade: boolean;
      talent.unlockConditions.forEach(condition => {
        if(condition.elite == 1 && condition.level == 55) {
          hasEliteUpgrade = true;
          return;
        }

        // check if there are elite and/or elite 2 upgrades
        if(currentElite != condition.elite) {
          if(currentElite == -1) {
            currentElite = condition.elite;
          } else if(!hasEliteUpgrade) {
            currentElite = condition.elite;
            hasEliteUpgrade = true;
          } else {
            hasElite2Upgrade = true;
            return;
          }
        }

        startingElite2Index++;
        if(!hasEliteUpgrade) {
          startingEliteIndex++;
        }
      })

      if(hasEliteUpgrade) {

        // create new upgraded talent

        // offset prevents elite 2 descriptions from being included
        let offset = 0;
        if(hasElite2Upgrade) {
          offset = startingEliteIndex;
        }

        let newTalent: Talent = {
          name: talent.name,
          descriptions: talent.descriptions.slice(startingEliteIndex, talent.descriptions.length - offset),

          // since it gets the exact unlock conditions, this parsing is compatible with elite upgrades from e0 to e2 (eg Amiya)
          unlockConditions: talent.unlockConditions.slice(startingEliteIndex, talent.descriptions.length - offset)
        };
        talents.splice(talentIndex+1, 0, newTalent)

      }
      if(hasElite2Upgrade) {

        // create new upgraded talent
        let newTalent: Talent = {
          name: talent.name,
          descriptions: talent.descriptions.slice(startingElite2Index, talent.descriptions.length),
          unlockConditions: talent.unlockConditions.slice(startingElite2Index, talent.descriptions.length)
        };
        talents.splice(talentIndex+2, 0, newTalent)

      }

      // original talent should only keep original descriptions
      talent.descriptions = talent.descriptions.slice(0, startingEliteIndex);
      talentIndex++;
    })

    return talents;

  }

  getRangeGrid(grid: any) {
    const newGrid: Grid = {
      maxCols: 0,
      startingSquare: {
        row: 0,
        col: 0
      },
      squares: [],
    };

    // get the number to raise all cols by, so they start at 0
    let minCol: number = 0;
    grid.forEach(element => {
      minCol = Math.min(minCol, element.col);
    })

    // starting square column should be raised as well    
    newGrid.startingSquare.col += Math.abs(minCol);

    // create square array
    let currentRow: number = -99;
    grid.forEach(element => {

      // raise all cols to start from 0
      if(minCol < 0) {
        element.col += Math.abs(minCol);
      }

      newGrid.maxCols = Math.max(newGrid.maxCols, element.col);

      // entering new row
      if(currentRow != element.row) {
        currentRow = element.row;
        newGrid.squares.push([element.col]);
      } else {

        // adding col to current row
        newGrid.squares[newGrid.squares.length-1].push(element.col);
      
      }
    })

    // starting square's row is always the middle one
    newGrid.startingSquare.row = Math.floor(newGrid.squares.length / 2);

    return newGrid;
  }

  getModule(jsonModule: any, entireModuleJson: any) {
    const module: Module = {
      id: jsonModule.uniEquipId,
      imgLink: jsonModule.uniEquipIcon,
      description: jsonModule.uniEquipDesc,
      name: jsonModule.uniEquipName,
      typeName: jsonModule.typeName,
      missions: [],
      levels: []
    }

    jsonModule.missionList.forEach(missionId => {
      const mission: ModuleMission = {
        id: <string>missionId,
        description: entireModuleJson.missionList[missionId].desc
      }
      module.missions.push(mission);
    })

    // itemCost in EN is an array of level 1 items, while in CN it's an array of each level containing the items
    // The change is therefore automatically detected so site doesn't break when EN updates
    if(jsonModule.itemCost) {
      try {
        Object.keys(jsonModule.itemCost).forEach(phase => {
          module.levels.push({
            itemCosts: [],
            stats: []
          })
          jsonModule.itemCost[phase].forEach(item => {
            const newItem = this.getItem(item.id);
            newItem.amount = item.count;
            if(newItem.amount == '80000') {
              newItem.amount = '80k'
            }
            module.levels[module.levels.length - 1].itemCosts.push(newItem);
          })
        })
      } catch (error) {
        // delete stray level created from top
        module.levels.pop();

        module.levels.push({
          itemCosts: [],
          stats: []
        })
        Object.keys(jsonModule.itemCost).forEach(item => {
          const newItem = this.getItem(jsonModule.itemCost[item].id);
          if(newItem != null) {
            newItem.amount = jsonModule.itemCost[item].count;
            if(newItem.amount == '80000') {
              newItem.amount = '80k'
            }
            module.levels[0].itemCosts.push(newItem);
          }
        })
      }
    }
    
    return module;
  }

  getModuleLevelStats(jsonModule: any, module: Module) {
    for(let i = 0; i < jsonModule.phases.length; i++) {
      module.levels[i].stats = this.renameStats(jsonModule.phases[i].attributeBlackboard);

      // summon stats
      if(jsonModule.phases[i].tokenAttributeBlackboard != null) {
        module.levels[i].summonStats = [];
        Object.keys(jsonModule.phases[i].tokenAttributeBlackboard).forEach(stats => {
          module.levels[i].summonStats.push(jsonModule.phases[i].tokenAttributeBlackboard[stats])
        })
      }

      // replace max_hp with hp
      if(module.levels[i].stats.find(stat => stat.key == 'max_hp')) {
        const index = module.levels[i].stats.findIndex(stat => stat.key == 'max_hp');
        module.levels[i].stats[index].key = 'hp';
      }
    }

    module.traitStats = jsonModule.phases[0].parts[0].overrideTraitDataBundle.candidates[0].blackboard;

    // one or the other has the description 
    const additionalDescription = jsonModule.phases[0].parts[0].overrideTraitDataBundle.candidates[0].additionalDescription;
    const overrideDescription = jsonModule.phases[0].parts[0].overrideTraitDataBundle.candidates[0].overrideDescripton; // yes it's misspelt
    
    if(additionalDescription == null) {
      module.trait = this.stylizeText(overrideDescription);
    } else {
      module.trait = this.stylizeText(additionalDescription);
    }

    return module
  }

  getSummons(charJson: any, tokenKey: string) {
    if(tokenKey == null) {
      return null;
    }

    let summons: Summon[] = [];

    // get the only summon
    if(tokenKey[tokenKey.length - 1] != '1') {
      const jsonSummon = charJson[tokenKey];

      const newSummon: Summon = {
        name: jsonSummon.name,
        id: tokenKey,
        statBreakpoints: this.getStats(charJson[tokenKey]),
        associatedSkillIndex: 0
      }

      summons.push(newSummon)
    } else { 
      
      // get all summons
      
      let index = 1;
      while(charJson[tokenKey.slice(0, tokenKey.length - 1) + index] != null) {
        const jsonSummon = charJson[tokenKey.slice(0, tokenKey.length - 1) + index]

        const newSummon: Summon = {
          name: jsonSummon.name,
          id: tokenKey.slice(0, tokenKey.length - 1) + index,
          statBreakpoints: this.getStats(charJson[tokenKey.slice(0, tokenKey.length - 1) + index]),
          associatedSkillIndex: index
        }
  
        summons.push(newSummon)

        index++;
      }
    }

    return summons;
  }

  replaceKey(object: any, keyToRename: string, newName: string) {
    if(object[keyToRename] != null) {
      object[newName] = object[keyToRename];
      delete(object[keyToRename]);
    }
    
    return object;
  }

  getItem(id: string) {
    return this.database.items.find(thisItem => id == thisItem.id)
  }

  getBaseSkills(buffJson: any) {
    Object.keys(buffJson).forEach(buffName => {
      const buff = buffJson[buffName];

      const newBaseSkill: BaseSkill = {
        name: buff.buffName,
        id: buff.buffId,
        description: buff.description,
        iconId: buff.skillIcon,
        color: buff.buffColor
      }

      this.database.baseSkills.push(newBaseSkill);
    })
  }

  getOperatorBaseSkills(operatorId: string, baseSkillJson: any) {
    const op = this.database.operators.find(operator => operator.id.slice(2, operator.id.length) == operatorId);
    if(op) {

      baseSkillJson.forEach(skill => {

        // even without an actual base skill, they will have a slot but no levels
        if(skill.buffData.length == 0) {
          return;
        }

        skill.buffData.forEach(level => {
          const dbBaseSkill = this.database.baseSkills.find(baseSkill => baseSkill.id == level.buffId);
          let newBaseSkill: OperatorBaseSkill = {
            name: dbBaseSkill.name,
            id: dbBaseSkill.id,
            iconId: dbBaseSkill.iconId,
            description: this.stylizeText(dbBaseSkill.description),
            requirements: {
              elite: level.cond.phase,
              level: level.cond.level
            }
          };

          op.baseSkills.push(newBaseSkill);
        })
      })
    }
  }

  getTrustStats(operator: any) {
    return this.renameStats(operator.favorKeyFrames[1].data);
  }

  renameStats(stats) {
    stats = this.replaceKey(stats, 'magicResistance', 'res');
    stats = this.replaceKey(stats, 'blockCnt', 'blockCount');
    stats = this.replaceKey(stats, 'maxHp', 'hp');
    stats = this.replaceKey(stats, 'baseAttackTime', 'attackInterval');
    stats = this.replaceKey(stats, 'respawnTime', 'time');
    return stats;
  }

  stylizeText(text: string) {

    text = text.replace(/<@ba.vdown>/g, '<span class="negative-effect"> ')
    text = text.replace(/<@cc.vdown>/g, '<span class="negative-effect"> ')

    text = text.replace(/<@ba.rem>/g, '<br> <span class="info"> ')
    
    text = text.replace(/<@ba.talpu>/g, ' <span class="positive-effect"> ')
    text = text.replace(/<@ba.vup>/g, ' <span class="positive-effect"> ')
    text = text.replace(/<@ba.kw>/g, ' <span class="positive-effect"> ')
    text = text.replace(/<@cc.vup>/g, ' <span class="positive-effect"> ')
    text = text.replace(/<@cc.kw>/g, ' <span class="positive-effect"> ')
    text = text.replace(/<@cc.rem>/g, ' <span class="positive-effect"> ')
    
    text = text.replace(/<\$ba.shield>/g, '<span class="special" data-tip="Each stack of shield can block 1 instance of damage"> ')
    text = text.replace(/<\$ba.buffres>/g, '<span class="special" data-tip="Reduce duration of abnormal effects such as Stun, Cold, Freeze by 50% (Does not stack)"> ')
    text = text.replace(/<\$ba.fragile>/g, '<span class="special" data-tip="Increase all damage taken by the stated percentage (Does not stack, strongest effect takes precedence)"> ')
    text = text.replace(/<\$ba.sluggish>/g, '<span class="special" data-tip="Movement Speed reduced by 80%"> ')
    text = text.replace(/<\$ba.stun>/g, '<span class="special" data-tip="Unable to move, block, attack, or use skills"> ')
    text = text.replace(/<\$ba.cold>/g, '<span class="special" data-tip="Attack Speed -30. If Cold effect is stacked, effect changes to Frozen"> ')
    text = text.replace(/<\$ba.camou>/g, '<span class="special" data-tip="When not blocking, will not be targeted by enemy normal attacks (unable to avoid splash-type attacks)"> ')
    text = text.replace(/<\$ba.frozen>/g, '<span class="special" data-tip="Unable to move, attack or use skills (Activated through Cold effect); When enemies are Frozen, RES -15"> ')
    text = text.replace(/<\$ba.root>/g, '<span class="special" data-tip="Unable to move"> ')
    text = text.replace(/<\$ba.invisible>/g, '<span class="special" data-tip="When unblocked/not blocking, will not be attacked by enemies"> ')
    text = text.replace(/<\$cc.bd_b1>/g, '<span class="special" data-tip="Provided by the following Operator:\nDusk\nMr.Nothing"> ')
    text = text.replace(/<\$cc.bd_a1>/g, '<span class="special" data-tip="Affects Chain of Thought\nProvided by the following Operator(s):\nRosmontis\nDusk\nWhisperain\nIris" > ')
    text = text.replace(/<\$cc.g.sui>/g, '<span class="special" data-tip="Includes the following Operators:\nNian\nDusk\nLing"> ')
    text = text.replace(/<\$cc.g.lgd>/g, '<span class="special" data-tip="Includes the following operators:\nChen\nHoshiguma\nSwire"> ')
    text = text.replace(/<\$cc.bd_ash>/g, '<span class="special" data-tip="Provided by the following Operator:\nAsh"> ')
    text = text.replace(/<\$cc.bd_tachanka>/g, '<span class="special" data-tip="Provided by the following Operator:\nTachanka"> ')
    text = text.replace(/<\$cc.g.ussg>/g, '<span class="special" data-tip="Includes the following Operators:\nRosa\nZima\nIstina\nGummy"> ')
    text = text.replace(/<\$cc.g.R6>/g, '<span class="special" data-tip="Includes the following Operators:\nAsh\nTachanka\nBlitz\nFrost"> ')
    text = text.replace(/<\$cc.tag.knight>/g, '<span class="special" data-tip="Includes the following Operators:\nNearl the Radiant Knight\nNearl (mutually exclusive)\nBlemishine\nWhislash\nFlametail\nFartooth\nAshlock\nWild Mane\n\'Justice Knight\'\nGravel">')
    text = text.replace(/<\$ba.protect>/g, '<span class="special" data-tip="Reduce Physical and Arts damage taken by the stated percentage (Does not stack, strongest effect takes precedence)"> ')
    text = text.replace(/<\$cc.bd_a1_a1>/g, '<span class="special" data-tip="Affects Perception Information\nProvided by the following Operator(s):\nWhisperain"> ')
    text = text.replace(/<\$cc.w.ncdeer1>/g, '<span class="special" data-tip="Whenever a recipe that consumes 4 or less Morale fails to produce a byproduct, gain 1 point of Causality for every 1 Morale consumed"> ')
    text = text.replace(/<\$cc.w.ncdeer2>/g, '<span class="special" data-tip="Whenever a recipe that consumes 8 Morale fails to produce a byproduct, gain 1 point of Karma for every 1 Morale consumed"> ')
    text = text.replace(/<\$ba.charged>/g, '<span class="special" data-tip="Can continue recovering SP after reaching the maximum.\nWhen SP reaches double the maximum, enter Charged state.\nSkills have additional effects when activated in Charged state (All SP is consumed whenever skill is activated)"> ')

    const closingSpan = new RegExp('</>', 'g');
    text = text.replace(closingSpan, " </span>")

    text = text.replace('<Support Devices>', 'Support Devices')

    return text;
  }

  getSpType(skill): 'Auto Recovery' | 'Offensive Recovery' | 'Defensive Recovery' | 'Passive' {
    switch(skill.levels[0].spData.spType) {
      case 1:
        return 'Auto Recovery';
      case 2:
        return 'Offensive Recovery';
      case 4:
        return 'Defensive Recovery';
      case 8: 
        return 'Passive';
    }
  }

  getClass(operator): string {
    switch(operator.profession) {
      case 'WARRIOR': 
        return 'Guard';
      case 'PIONEER':
        return 'Vanguard';
      case 'TANK': 
        return 'Defender';
      case 'SUPPORT':
        return 'Supporter';
      case 'SPECIAL':
        return 'Specialist';
    }

    operator.profession = operator.profession.toLowerCase();

    return operator.profession.charAt(0).toUpperCase() + operator.profession.slice(1);
  }

  getBranch(operator): string {
    switch(operator.subProfessionId) {
      case 'unyield':
        return 'Juggernaut'
      case 'physician':
        return 'Medic';
      case 'fearless':
        return 'Dreadnought';
      case 'fastshot':
        return 'Marksman';
      case 'corecaster':
        return 'Core Caster';
      case 'splashcaster':
        return 'Splash Caster';
      case 'slower':
        return 'Decel Binder';
      case 'funnel':
        return 'Mesh-Accord Caster'
      case 'mystic':
        return 'Mystic Caster';
      case 'chain':
        return 'Chain Caster';
      case 'aoesniper':
        return 'Artilleryman';
      case 'reaperrange':
        return 'Spreadshooter';
      case 'longrange':
        return 'Deadeye';
      case 'bearer':
        return 'Standard Bearer';
      case 'artsfghter':
        return 'Arts Fighter';
      case 'ringhealer':
        return 'Multi-Target Medic'
      case 'artsprotector':
        return 'Arts Protector';
      case 'craftsman':
        return 'Artificer';
      case 'sword':
        return 'Swordmaster';
      case 'phalanx':
        return 'Phalanx Caster';
      case 'wandermedic':
        return 'Wandering Medic';
      case 'underminder':
        return 'Hexer';
      case 'stalker':
        return 'Ambusher';
      case 'blessing':
        return 'Abjurer';
      case 'shortrange':
        return 'Heavyshooter';
      case 'healer':
        return 'Therapist'
      case 'traper': // really...
        return 'Trapper'
    }

    return operator.subProfessionId.charAt(0).toUpperCase() + operator.subProfessionId.slice(1);
  }

  getEliteLmdUnlockReq(rarity: number, elite: number) {
    if(elite == 1) {
      switch(rarity) {
        case 3: 
          return '10k';
        case 4:
          return '15k';
        case 5: 
          return '20k';
        case 6: 
          return '30k';
      }
    } else if(elite == 2) {
      switch(rarity) {
        case 4:
          return '60k';
        case 5:
          return '120k';
        case 6: 
          return '180k';
      }
    }
  }

  getPosition(operator: Operator) {

    return operator.position.charAt(0).toUpperCase() + operator.position.slice(1, operator.position.length).toLowerCase();
  }
}
