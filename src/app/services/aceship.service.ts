import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EliteUnlockReqs, Operator, Skill, SkillLevel, SkillUnlockReqs, StatBreakpoint, Talent } from '../interfaces/operator';
import { concatMap } from 'rxjs/operators'; 
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
  
})
export class AceshipService {

  operators: Operator[] = [];
  items: Item[] = [];

  constructor(private http: HttpClient) { }

  init() {
    console.log('test')

    this.http.get('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/item_table.json')
      .pipe(
        concatMap(itemJson => {
          Object.keys(itemJson['items']).forEach(item => {
            const thisItem = itemJson['items'][item]
            
            const newItem: Item = {
              name: thisItem.name,
              id: thisItem.itemId,
              imgId: thisItem.iconId,
              rarity: thisItem.rarity+1
            }

            this.items.push(newItem);
          
          })

          return this.http.get('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/character_table.json');
        }),
        concatMap(results => {
          console.log(results)

          Object.keys(results).forEach(entry => {
            if(entry.includes('char')) {
              const op = results[entry];

              // add just the skillId to each skill. Skill data retrieved in next subscription
              let skills: Skill[] = [];
              op.skills.forEach(skill => {
                const newSkill: Skill = {
                  id: skill.skillId,
                  masteryUnlockReqs: this.getSkillMasteryUnlockReqs(skill)
                }
                skills.push(newSkill)
              })

              const newOperator: Operator = {
                id: op.potentialItemId,
                name: op.name,
                nation: op.nationId,
                rarity: op.rarity + 1,
                potentials: this.getPotentials(op),
                trait: op.description,
                class: this.getClass(op),
                branch: this.getBranch(op),
                talents: this.getTalents(op),
                recruitTags: op.tagList,
                obtainMethods: op.itemObtainApproach,
                position: op.position,
                skills: skills,
                statBreakpoints: this.getStats(op),
                skillLevelUnlockReqs: this.getSkillLevelUnlockReqs(op)
              }

              this.operators.push(newOperator);
            }
          })
          
          return this.http.get('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/skill_table.json');
        })
      )
      .subscribe(skills => {
        console.log(skills)

        this.operators.forEach(operator => {
          operator.skills.forEach(skill => {
            const jsonSkill = skills[skill.id];

            if(jsonSkill.levels) {
              skill.name = jsonSkill.levels[0].name;
              skill.description = this.stylizeText(jsonSkill.levels[0].description);
              skill.spType = this.getSpType(jsonSkill);
              skill.levels = [];

              skill.levels = this.getSkillLevels(skill, jsonSkill, operator);
            }

          })
        })
      })
  }

  getStats(operator): StatBreakpoint[] {
    let opStats: StatBreakpoint[] = [];

    let eliteCount: number = 0;
    let lastMaxLevel: number = 0;
    operator.phases.forEach(elite => {

      const eliteStats = elite.attributesKeyFrames;

      let minStats = eliteStats[0].data
      minStats = this.replaceKey(minStats, 'magicResistance', 'res');
      minStats = this.replaceKey(minStats, 'blockCnt', 'blockCount');

      let maxStats = eliteStats[1].data
      maxStats = this.replaceKey(maxStats, 'magicResistance', 'res');
      maxStats = this.replaceKey(maxStats, 'blockCnt', 'blockCount');

      let eliteUnlockReqs: EliteUnlockReqs;
      if(elite.evolveCost) {

        let items: Item[] = [];

        const itemFromDb = this.items.find(thisItem => '4001' == thisItem.id)
        const lmd: Item = {
          id: '4001',
          name: itemFromDb.name,
          imgId: itemFromDb.imgId,
          rarity: itemFromDb.rarity,
          amount: this.getEliteLmdUnlockReq(operator.rarity+1, eliteCount).toLocaleString()
        }
        items.push(lmd);

        elite.evolveCost.forEach(item => {
          const itemFromDb = this.items.find(thisItem => item.id == thisItem.id)

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

    if(skill.levelUpCostCond == []) {
      return [];
    }

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

      if(skill.name == 'Aqua Loop') {
        level.duration = 0;
      }

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

    return talents;

  }

  /** 
  * @returns The new key.
  */
   replaceKey(object: any, keyToRename: string, newName: string) {
    object[newName] = object[keyToRename];
    //delete(object[keyToRename]);
    return object;
  }

  stylizeText(text: string) {

    text = text.replace(/<@ba.talpu>/g, '<span class="positive-effect"> ')
    text = text.replace(/<@ba.vup>/g, '<span class="positive-effect"> ')

    text = text.replace(/<@ba.vdown>/g, '<span class="negative-effect"> ')

    text = text.replace(/<\$ba.shield>/g, '<span class="special"> ')
    text = text.replace(/<\$ba.buffres>/g, '<span class="special"> ')
    text = text.replace(/<\$ba.fragile>/g, '<span class="special"> ')
    text = text.replace(/<\$ba.sluggish>/g, '<span class="special"> ')
    text = text.replace(/<\$ba.stun>/g, '<span class="special"> ')
    text = text.replace(/<\$ba.cold>/g, '<span class="special"> ')
    text = text.replace(/<\$ba.frozen>/g, '<span class="special"> ')

    text = text.replace(/<@ba.rem>/g, '<br> <span class="info"> ')

    const closingSpan = new RegExp('</>', 'g');
    text = text.replace(closingSpan, " </span>")
    return text;
  }

  getItem(id: string) {
    return this.items.find(thisItem => id == thisItem.id)
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
      case 'artsfighter':
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
    }

    return operator.subProfessionId.charAt(0).toUpperCase() + operator.subProfessionId.slice(1);
  }

  getEliteLmdUnlockReq(rarity: number, elite: number) {
    if(elite == 1) {
      switch(rarity) {
        case 3: 
          return 10000;
        case 4:
          return 15000;
        case 5: 
          return 20000;
        case 6: 
          return 30000;
      }
    } else if(elite == 2) {
      switch(rarity) {
        case 4:
          return 60000;
        case 5:
          return 120000;
        case 6: 
          return 180000;
      }
    }
  }
}