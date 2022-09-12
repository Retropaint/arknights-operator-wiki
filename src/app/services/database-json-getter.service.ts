import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { Item } from '../interfaces/item';
import { ProfileEntry, Operator, Skill, Dialogue } from '../interfaces/operator';
import { Range } from '../interfaces/range';
import { Skin } from '../interfaces/skin';
import { DatabaseJsonParserService } from './database-json-parser.service';
import { DatabaseService } from './database.service';
import { ManualJsonParserService } from './manual-json-parser.service';
import { OperatorTransitionerService } from './operator-transitioner.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseJsonGetterService {

  constructor(
    private http: HttpClient,
    private transitioner: OperatorTransitionerService,
    private database: DatabaseService,
    private dbJsonParser: DatabaseJsonParserService,
    private manualParser: ManualJsonParserService
  ) { }

  init() {
    this.http.get('assets/json/item_table.json')
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

          return this.http.get('assets/json/character_table.json');
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
                break; case 'Conviction':
                  op.potentialItemId = "p_char_159_peacok"
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
                position: this.dbJsonParser.getPosition(op),
                skills: skills,
                statBreakpoints: this.dbJsonParser.getStats(op),
                skillLevelUnlockReqs: this.dbJsonParser.getSkillLevelUnlockReqs(op),
                summons: this.dbJsonParser.getSummons(results, op.tokenKey),
                skins: [],
                voiceActors: {},
                modules: [],
                baseSkills: [],
                profileEntries: [],
                dialogues: []
              }

              this.database.operators.push(newOperator);
            }
          })

          const opIds = [];
          this.database.operators.forEach(operator => {
            opIds.push(operator.id.replace('p_', ''));
          })
          console.log(opIds)
          
          return this.http.get('assets/json/range_table.json');
        }),
        concatMap(jsonRanges => {
          Object.keys(jsonRanges).forEach(jsonRange => {
            const newRange: Range = {
              id: jsonRanges[jsonRange].id,
              grid: this.dbJsonParser.getRangeGrid(jsonRanges[jsonRange].grids)
            }
            this.database.ranges.push(newRange);
          })

          return this.http.get('assets/json/charword_table.json'); 
        }),
        concatMap((jsonCharwords: any) => {

          Object.keys(jsonCharwords.charWords).forEach(char => {
            const voiceEntry = jsonCharwords.charWords[char]

            const op = this.database.operators.find(operator => operator.id.slice(2, operator.id.length) == char.slice(0, char.length - 7))
            if(op != null) {
              const newDialogue: Dialogue = {
                name: voiceEntry.voiceTitle,
                text: voiceEntry.voiceText,
                fileIndex: char.slice(char.length-3, char.length)
              }
              op.dialogues.push(newDialogue)
            }
          })

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

          return this.http.get('assets/json/skin_table.json'); 
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
          
          return this.http.get('assets/json/uniequip_table.json'); 
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

          return this.http.get('assets/json/building_data.json'); 
        }),
        concatMap(results => {
          this.dbJsonParser.getBaseSkills(results['buffs']);

          Object.keys(results['chars']).forEach(char => {
            this.dbJsonParser.getOperatorBaseSkills(results['chars'][char].charId, results['chars'][char].buffChar)
          })

          return this.http.get('assets/json/battle_equip_table.json'); 
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

          return this.http.get('assets/json/handbook_info_table.json'); 
        }),
        concatMap(results => {
          console.log(results)

          Object.keys(results['handbookDict']).forEach(charId => {
            const charEntry = results['handbookDict'][charId]
            const op = this.database.operators.find(operator => operator.id.slice(2, operator.id.length) == charId);
            if(!op) {
              return;
            }

            charEntry.storyTextAudio.forEach(archive => {
              const newEntry: ProfileEntry = {
                name: archive.storyTitle,
                description: archive.stories[0].storyText,
                unlockRequirement: {
                  type: archive.stories[0].unLockType,
                  value: archive.stories[0].unLockParam
                }
              }

              op.profileEntries.push(newEntry)
            })
            
          })

          return this.http.get('assets/json/skill_table.json'); 
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

          // rather just use this operator loop for manual edits than create an entirely new one
          this.manualParser.edit(operator);
        })

        this.transitioner.transitionSubscription.next();
      })
  }
}
