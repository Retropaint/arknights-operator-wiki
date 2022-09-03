import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { Item } from '../interfaces/item';
import { Operator, Skill } from '../interfaces/operator';
import { Range } from '../interfaces/range';
import { Skin } from '../interfaces/skin';
import { DatabaseJsonParserService } from './database-json-parser.service';
import { DatabaseService } from './database.service';
import { OperatorTransitionerService } from './operator-transitioner.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseJsonGetterService {

  constructor(
    private http: HttpClient,
    private transitioner: OperatorTransitionerService,
    private database: DatabaseService,
    private dbJsonParser: DatabaseJsonParserService
  ) { }

  init() {
    this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/item_table.json')
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

            this.database.items.push(newItem);
          
          })

          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/character_table.json');
        }),
        concatMap(results => {

          Object.keys(results).forEach(entry => {
            if(entry.includes('char')) {
              const op = results[entry];

              // add just the skillId to each skill. Skill data retrieved in skill subscription
              let skills: Skill[] = [];
              op.skills.forEach(skill => {
                const newSkill: Skill = {
                  id: skill.skillId,
                  masteryUnlockReqs: this.dbJsonParser.getSkillMasteryUnlockReqs(skill),
                  eliteUnlockReq: skill.unlockCond.phase
                }
                skills.push(newSkill)
              })

              if(op.name.includes('Reserve Operator')) {
                if(op.name.includes('Melee')) {
                  op.potentialItemId = 'char_504_rguard_1';
                } else if(op.name.includes('Sniper')) {
                  op.potentialItemId = 'char_507_rsnipe_1';
                } else if(op.name.includes('Logistics')) {
                  op.potentialItemId = 'char_506_rmedic_1';
                } else {
                  op.potentialItemId = 'char_505_rcast_1';
                }
              }

              switch(op.name) {
                case 'Sharp':
                  op.potentialItemId = "char_508_aguard";
                break; case 'Touch':
                  op.potentialItemId = "char_510_amedic";
                break; case 'Pith':
                  op.potentialItemId = 'char_509_acast';
                break; case 'Stormeye':
                  op.potentialItemId = 'char_511_asnipe';
              }

              const newOperator: Operator = {
                id: op.potentialItemId,
                name: op.name,
                nation: op.nationId,
                rarity: op.rarity + 1,
                potentials: this.dbJsonParser.getPotentials(op),
                trait: this.dbJsonParser.stylizeText(op.description).replace('{heal_scale:0%}', '80%'),
                class: this.dbJsonParser.getClass(op),
                branch: this.dbJsonParser.getBranch(op),
                talents: this.dbJsonParser.getTalents(op),
                recruitTags: op.tagList,
                obtainMethods: op.itemObtainApproach,
                position: op.position,
                skills: skills,
                statBreakpoints: this.dbJsonParser.getStats(op),
                skillLevelUnlockReqs: this.dbJsonParser.getSkillLevelUnlockReqs(op),
                skins: [],
                voiceActors: {},
                modules: [],
                summons: this.dbJsonParser.getSummons(results, op.tokenKey)
              }

              this.database.operators.push(newOperator);
            }
          })
          
          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/range_table.json');
        }),
        concatMap(jsonRanges => {
          Object.keys(jsonRanges).forEach(jsonRange => {
            const newRange: Range = {
              id: jsonRanges[jsonRange].id,
              grid: this.dbJsonParser.getRangeGrid(jsonRanges[jsonRange].grids)
            }
            this.database.ranges.push(newRange);
          })

          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/charword_table.json'); 
        }),
        concatMap((jsonCharwords: any) => {
          Object.keys(jsonCharwords.voiceLangDict).forEach(char => {

            const op = this.database.operators.find(operator => operator.id.slice(2, operator.id.length) == char)
            if(op != null) {
              const charDict = jsonCharwords.voiceLangDict[char].dict;
              op.voiceActors.CN = charDict.CN_MANDARIN?.cvName
              op.voiceActors.JP = charDict.JP?.cvName
              op.voiceActors.EN = charDict.EN?.cvName
              op.voiceActors.KR = charDict.KR?.cvName
            }
          })

          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/skin_table.json'); 
        }),
        concatMap((jsonSkins: any) => {

          Object.keys(jsonSkins.charSkins).forEach(jsonSkin => {
            const thisSkin = jsonSkins.charSkins[jsonSkin];

            if(thisSkin.portraitId == "char_1001_amiya2_2") {
              return;
            }

            const newSkin: Skin = {
              name: thisSkin.displaySkin.skinName,
              brand: thisSkin.displaySkin.skinGroupName,
              artist: thisSkin.displaySkin.drawerName,
              id: encodeURIComponent(thisSkin.portraitId),
              operatorId: thisSkin.charId
            }

            const op = this.database.operators.find(operator => operator.id.includes(newSkin.operatorId));

            if(newSkin.name == null) {
              if(newSkin.id[newSkin.id.length - 1] == '2') {
                newSkin.name = 'Elite 2'
              } else if(op != null && op.name == 'Amiya' && newSkin.id.includes('%2B')){
                newSkin.name = 'Elite 1'
              } else {
                newSkin.name = 'Default';
              }
            }

            if(op != null) {
              op.skins.push(newSkin);
            }

            this.database.skins.push(newSkin);
          })

          let skinJson = {
            skins: []
          };
          skinJson.skins = [];
          this.database.skins.forEach(skin => {
            skinJson.skins.push(skin.id)
          })
          
          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/uniequip_table.json'); 
        }),
        concatMap((results: any) => {

          Object.keys(results.equipDict).forEach(equip => {
            const jsonModule = results.equipDict[equip]

            const op = this.database.operators.find(operator => operator.id.includes(jsonModule.charId));
            if(op == null) {
              return;
            }

            op.modules.push(this.dbJsonParser.getModule(jsonModule, results))
            
          })

          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/building_data.json'); 
        }),
        concatMap(results => {
          console.log(results)

          Object.keys(results).forEach(build => {
            
          })

          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/battle_equip_table.json'); 
        }),
        concatMap(results => {

          Object.keys(results).forEach(equipId => {
            this.database.operators.forEach(op => {
              let module = op.modules.find(module => module.id == equipId)
              if(module != null) {
                module = this.dbJsonParser.getModuleLevelStats(results[equipId], module);
              }
            })
          })

          return this.http.get('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/skill_table.json'); 
        })
      )
      .subscribe(skills => {
        this.database.operators.forEach(operator => {
          operator.skills.forEach(skill => {
            const jsonSkill = skills[skill.id];

            if(jsonSkill.levels) {
              skill.name = jsonSkill.levels[0].name;
              skill.description = this.dbJsonParser.stylizeText(jsonSkill.levels[6].description);
              skill.spType = this.dbJsonParser.getSpType(jsonSkill);
              skill.levels = [];
              skill.activationType = jsonSkill.levels[0].skillType == 1 ? 'Manual' : 'Auto';

              skill.levels = this.dbJsonParser.getSkillLevels(skill, jsonSkill, operator);
            }

          })
        })

        this.transitioner.transitionSubscription.next();
      })
  }
}
