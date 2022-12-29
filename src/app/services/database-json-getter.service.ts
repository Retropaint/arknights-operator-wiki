import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, mergeMap } from 'rxjs/operators';
import { Item } from '../interfaces/item';
import { ProfileEntry, Operator, Skill, Dialogue } from '../interfaces/operator';
import { Range } from '../interfaces/range';
import { Skin } from '../interfaces/skin';
import { Stage } from '../interfaces/stage';
import { DatabaseJsonParserService } from './database-json-parser.service';
import { DatabaseService } from './database.service';
import { ManualJsonParserService } from './manual-json-parser.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseJsonGetterService {

  baseUrl: string = "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/en_US/gamedata/excel/"
  //baseUrl: string = "assets/json/"
  jsonLoadingProgress: number;
  maxJsonFiles: number = 10;

  constructor(
    private http: HttpClient,
    private database: DatabaseService,
    private dbJsonParser: DatabaseJsonParserService,
    private manualParser: ManualJsonParserService,
    private sharedService: SharedService
  ) { }

  init() {
    this.jsonLoadingProgress = 0;
    this.http.get(this.baseUrl + 'item_table.json')
      .pipe(
        mergeMap(itemJson => {
          Object.keys(itemJson['items']).forEach(item => {
            const thisItem = itemJson['items'][item]
            
            const newItem: Item = {
              name: thisItem.name,
              id: thisItem.itemId,
              imgId: thisItem.iconId,
              rarity: thisItem.rarity+1,
              //type: this.dbJsonParser.getMaterialType(thisItem.classifyType),
              description: thisItem.description,
              usage: thisItem.usage
            }

            this.database.items.push(newItem);
          
          })

          this.jsonLoadingProgress++;
          //return this.http.get(this.baseUrl + 'stage_table.json');
          return this.http.get(this.baseUrl + 'character_table.json');
        }),
        /*concatMap(stageJson => {
          Object.keys(stageJson['stages']).forEach(stage => {
            const thisStage = stageJson['stages'][stage];

            if(thisStage.stageDropInfo.displayRewards.length == 1) {
              return
            }

            const newStage: Stage = {
              name: thisStage.name,
              code: thisStage.code,
              type: this.dbJsonParser.getSttageType(thisStage.stageType, thisStage.code),
              itemDrops: {
                main: this.dbJsonParser.parseStageDrops(thisStage.stageDropInfo.displayRewards),
                side: this.dbJsonParser.parseStageDrops(thisStage.stageDropInfo.displayDetailRewards)
              }
            }

            this.database.stages.push(newStage);
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'character_table.json');
        }),*/
        concatMap(results => {

          Object.keys(results).forEach(entry => {
            if(entry.includes('char')) {
              const op = results[entry];

              if(op.potentialItemId == "p_char_512_aprot") {
                return;
              }

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
                  op.potentialItemId = 'p_char_159_peacok';
                break; case 'Nine-Colored Deer':
                  op.potentialItemId = 'p_char_4019_ncdeer'
              }
              
              this.addOperator(op, results);
            }
          })

          const opIds = [];
          this.database.operators.forEach(operator => {
            opIds.push(operator.id.replace('p_', ''));
          })
          
          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'char_patch_table.json');
        }),
        concatMap((result: any) => {
          console.log(result)

          this.addOperator(result.patchChars.char_1001_amiya2, null)

          console.log(this.database.operators)

          return this.http.get(this.baseUrl + 'range_table.json');
        }),
        mergeMap(jsonRanges => {
          Object.keys(jsonRanges).forEach(jsonRange => {
            const newRange: Range = {
              id: jsonRanges[jsonRange].id,
              grid: this.dbJsonParser.getRangeGrid(jsonRanges[jsonRange].grids)
            }
            this.database.ranges.push(newRange);
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'charword_table.json'); 
        }),
        mergeMap((jsonCharwords: any) => {

          console.log(jsonCharwords.voiceLangDict)

          Object.keys(jsonCharwords.charWords).forEach(char => {
            const voiceEntry = jsonCharwords.charWords[char]
            let op;

            if(char.includes('amiya2')) {
              op = this.database.operators.find(operator => operator.name == 'Amiya (Guard)');
            } else {
              op = this.database.operators.find(operator => operator.id.slice(2, operator.id.length) == char.slice(0, char.length - 7))
            }
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
            let op;
            if(char == 'char_1001_amiya2') {
              op = this.database.operators.find(operator => operator.name == 'Amiya (Guard)');
            } else {
              op = this.database.operators.find(operator => operator.id.slice(2, operator.id.length) == char)
            }
            if(op != null) {
              const charDict = jsonCharwords.voiceLangDict[char].dict;
              op.voiceActors.CN = charDict.CN_MANDARIN?.cvName
              op.voiceActors.JP = charDict.JP?.cvName
              op.voiceActors.EN = charDict.EN?.cvName
              op.voiceActors.KR = charDict.KR?.cvName
            }
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'skin_table.json'); 
        }),
        mergeMap((jsonSkins: any) => {

          Object.keys(jsonSkins.charSkins).forEach(jsonSkin => {
            const thisSkin = jsonSkins.charSkins[jsonSkin];

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

            if(newSkin.id == "char_1001_amiya2_2") {
              this.database.operators.find(operator => operator.name == 'Amiya (Guard)').skins.push(newSkin);
            } else if(op != null) {
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
          
          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'uniequip_table.json'); 
        }),
        mergeMap((results: any) => {

          Object.keys(results.equipDict).forEach(equip => {
            const jsonModule = results.equipDict[equip]

            const op = this.database.operators.find(operator => operator.id.includes(jsonModule.charId));
            if(op == null) {
              return;
            }

            op.modules.push(this.dbJsonParser.getModule(jsonModule, results))
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'battle_equip_table.json'); 
        }),
        mergeMap(results => {

          Object.keys(results).forEach(equipId => {
            this.database.operators.forEach(op => {
              let module = op.modules.find(module => module.id == equipId)
              
              if(module != null) {
                module = this.dbJsonParser.getModuleLevelStats(results[equipId], module);
              }
            })
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'building_data.json'); 
        }),
        mergeMap(results => {
          this.dbJsonParser.getBaseSkills(results['buffs']);

          Object.keys(results['chars']).forEach(char => {
            this.dbJsonParser.getOperatorBaseSkills(results['chars'][char].charId, results['chars'][char].buffChar)
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'handbook_info_table.json');
        }),
        mergeMap(results => {
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

              op.profileEntries.push(newEntry);
            })
            
          })

          this.jsonLoadingProgress++;
          return this.http.get(this.baseUrl + 'skill_table.json'); 
        }),
        mergeMap(skills => {
          this.database.operators.forEach(operator => {

            operator.skills.forEach(skill => {
              const jsonSkill = skills[skill.id];

              // only make "Tied" have the tooltip rather than rest of text
              if(operator.name == "Kal\'tsit") {
                jsonSkill.levels[6].description = jsonSkill.levels[6].description.replace("Tied", "Tied</span>")
              }

              if(jsonSkill.levels) {
                skill.name = jsonSkill.levels[0].name;
                skill.description = this.dbJsonParser.stylizeText(jsonSkill.levels[6].description, false);
                skill.spType = this.dbJsonParser.getSpType(jsonSkill);
                skill.levels = [];
                skill.activationType = jsonSkill.levels[0].skillType == 1 ? 'Manual' : 'Auto';
  
                if(jsonSkill.iconId != null) {
                  skill.iconId = jsonSkill.iconId;
                } else {
                  skill.iconId = skill.id;
                }
  
                skill.levels = this.dbJsonParser.getSkillLevels(skill, jsonSkill, operator);
              }
            })
  
            // use this last operator loop to go thru all manual edits
            this.manualParser.edit(operator);
          })

          this.jsonLoadingProgress++;

          // dummy data to let mergeMap pass thru
          return new Array(1);
        })
      )
      .subscribe(() => {
        this.sharedService.allJsonsLoaded();
        this.database.isLoaded = true;
      })
  }

  addOperator(op: any, wholeJson: any) {
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

    let groupId = '';
    if(op.groupId != null) {
      groupId = op.groupId;
    } else if(op.nationId != null) {
      groupId = op.nationId;
    } else {
      groupId = op.teamId;
    }

    const newOperator: Operator = {
      id: op.potentialItemId,
      name: op.name,
      rarity: op.rarity + 1,
      potentials: this.dbJsonParser.getPotentials(op),
      trait: this.dbJsonParser.stylizeText(op.description).replace('{heal_scale:0%}', '80%'),
      class: this.dbJsonParser.getClass(op),
      branch: this.dbJsonParser.getBranch(op),
      originalBranch: op.subProfessionId,
      talents: this.dbJsonParser.getTalents(op),
      tags: op.tagList,
      obtainMethods: op.itemObtainApproach,
      position: this.dbJsonParser.getPosition(op),
      skills: skills,
      statBreakpoints: this.dbJsonParser.getStats(op),
      skillLevelUnlockReqs: this.dbJsonParser.getSkillLevelUnlockReqs(op),
      summons: this.dbJsonParser.getSummons(wholeJson, op.tokenKey, op),
      trustStats: this.dbJsonParser.getTrustStats(op),
      recruitmentContract: op.itemDesc,
      potentialToken: op.itemUsage,
      avatarLink: this.getAvatarLink(op),
      group: {
        name: this.dbJsonParser.getGroupName(groupId),
        id: groupId
      },
      skins: [],
      voiceActors: {},
      modules: [],
      baseSkills: [],
      profileEntries: [],
      dialogues: []
    }

    if(op.name == 'Amiya' && op.profession == 'WARRIOR') {
      newOperator.name = 'Amiya (Guard)';
      newOperator.profileEntries = this.database.operators.find(op => op.name == 'Amiya').profileEntries;
      newOperator.baseSkills = this.database.operators.find(op => op.name == 'Amiya').baseSkills;
    }

    if(newOperator.branch == 'Pusher' || newOperator.branch == 'Hookmaster') {
      newOperator.position = 'All'
    }

    this.database.operators.push(newOperator);
  }

  getAvatarLink(op: any) {
    if(op.name == 'Amiya (Guard)') {
      return 'char_1001_amiya2';
    }

    let operatorImageLink = op.potentialItemId;

    const specialReserveOp = this.database.specialReserveOps.find(specOp => specOp == op.name) != null;

    if(!specialReserveOp) {

      if(op.name.includes('Reserve Operator')) {
        operatorImageLink = op.potentialItemId.slice(0, op.potentialItemId.length - 2);
      } else {
        operatorImageLink = op.potentialItemId.slice(2, op.potentialItemId.length);
      }

    }

    return operatorImageLink
  }
}
