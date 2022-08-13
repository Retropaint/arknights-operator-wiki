import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Operator, Skill, SkillLevel, Talent } from '../interfaces/operator';
import { concatMap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AceshipService {

  operators: Operator[] = [];

  constructor(private http: HttpClient) { }

  init() {
    this.http.get('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/character_table.json')
      .pipe(
        concatMap(results => {
          Object.keys(results).forEach(entry => {
            if(entry.includes('char')) {
              const op = results[entry];

              // add just the skillId to each skill. Skill data retrieved in next subscription
              let skills: Skill[] = [];
              op.skills.forEach(skill => {
                const newSkill: Skill = {
                  id: skill.skillId
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
                stats: this.getStats(op)
              }

              this.operators.push(newOperator);
            }
          })
          
          return this.http.get('https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/gamedata/en_US/gamedata/excel/skill_table.json');
        })
      )
      .subscribe(skills => {
        this.operators.forEach(operator => {
          operator.skills.forEach(skill => {
            const jsonSkill = skills[skill.id];

            if(jsonSkill.levels) {
              skill.name = jsonSkill.levels[0].name;
              skill.description = jsonSkill.levels[0].description;
              skill.spType = this.getSpType(jsonSkill);
              skill.levels = [];

              skill.levels = this.getSkillLevels(skill, jsonSkill);
            }

          })
        })

        console.log(this.operators)
      })
  }

  

  getStats(operator): any {
    let opStats: any = [];

    let eliteCount: string = 'elite0';
    operator.phases.forEach(elite => {

      let stats = elite.attributesKeyFrames[0].data;

      stats.res = this.replaceKey(stats.magicResistance, stats.res);
      stats.blockCount = this.replaceKey(stats.blockCnt, stats.blockCount);
      stats.aspd = this.replaceKey(stats.attackSpeed, stats.aspd);
      stats.deployTime = this.replaceKey(stats.attackSpeed, stats.aspd);

      switch(stats.baseAttackTime) {
        case 1.3: case 1.6:
          stats.attackTimeDesc = 'Slightly Slow';
        case 2.3:
          stats.attackTimeDesc = 'Slow';
        break;
      }

      const minElite = {
        level: elite.attributesKeyFrames[0].level,
        stats: stats
      }
      const maxElite = {
        level: elite.attributesKeyFrames[1].level,
        stats: stats
      }
      const newElite = {
        minElite,
        maxElite
      }
      opStats[eliteCount] = newElite;
      switch(eliteCount) {
        case 'elite0':
          eliteCount = 'elite1';
        break; case 'elite1':
          eliteCount = 'elite2';
      }
    })
    console.log(opStats)

    return opStats;

  }
  
  getPotentials(operator): string[] {
    if(!operator.potentialRanks) {
      return [];
    }

    let potentials: string[] = [];

    operator.potentialRanks.forEach(potential => {
      potentials.push(potential.description);
    })

    return potentials;
  }

  getSkillLevels(skill, jsonSkill): SkillLevel[] {

    jsonSkill.levels.forEach(level => {

      level.blackboard.forEach(stat => {
        stat.name = this.replaceKey(stat.key, stat.name);
      })

      const newLevel: SkillLevel = {
        duration: level.duration,
        spCost: level.spData.spCost,
        stats: level.blackboard
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
        descriptions: [],
        unlockConditions: []
      };

      talent.candidates.forEach(candidate => {
        
        candidate.unlockCondition.elite = this.replaceKey(candidate.unlockCondition.phase, candidate.unlockCondition.elite);
        
        // add required potential to unlockCondition
        candidate.unlockCondition.potential = candidate.requiredPotentialRank;
        
        newTalent.descriptions.push(candidate.description);
        newTalent.unlockConditions.push(candidate.unlockCondition);
      })
      newTalent.maxLevel = newTalent.descriptions.length;

      talents.push(newTalent);
    })

    return talents;

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

  /** 
  * @returns The new key.
  */
  replaceKey(keyToRename: any, newName: any) {
    newName = keyToRename;
    keyToRename = null;
    return newName;
  }
}