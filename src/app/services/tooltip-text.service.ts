import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class TooltipTextService {

  constructor(
    private db: DatabaseService
  ) { }

  addTooltipTexts(text: string) {
    const openSpan = "<span class=\"special tooltip\" data-tip=\"";
    const closeSpan = '">';
    
    text = text.replace(/<\@ba.dt.element>/g, openSpan + "Includes Neural Damage, Corrosion Damage, and Burn Damage" + closeSpan)
    text = text.replace(/<\$ba.dt.element>/g, openSpan + "Includes Neural Damage, Corrosion Damage, and Burn Damage" + closeSpan)
    text = text.replace(/<\$ba.shield>/g, openSpan + "Each stack of shield can block 1 instance of damage" + closeSpan )
    text = text.replace(/<\$ba.buffres>/g, openSpan + "The duration of stun, cold, and freeze effects are reduced by 50%" + closeSpan)
    text = text.replace(/<\$ba.fragile>/g, openSpan + "Increase all damage taken by the stated percentage (Does not stack, strongest effect takes precedence)" + closeSpan)
    text = text.replace(/<\$ba.sluggish>/g, openSpan + "Movement Speed reduced by 80%" + closeSpan)
    text = text.replace(/<\$ba.stun>/g, openSpan + "Unable to move, block, attack, or use skills" + closeSpan)
    text = text.replace(/<\$ba.cold>/g, openSpan + "Attack Speed -30. If Cold effect is stacked, effect changes to Frozen" + closeSpan)
    text = text.replace(/<\$ba.camou>/g, openSpan + "When not blocking, will not be targeted by enemy normal attacks (unable to avoid splash-type attacks)" + closeSpan)
    text = text.replace(/<\$ba.frozen>/g, openSpan + "Unable to move, attack or use skills (Activated through Cold effect); When enemies are Frozen, RES -15" + closeSpan)
    text = text.replace(/<\$ba.root>/g, openSpan + "Unable to move" + closeSpan)
    text = text.replace(/<\$ba.invisible>/g, openSpan + "When unblocked/not blocking, will not be attacked by enemies" + closeSpan)
    text = text.replace(/<\$ba.levitate>/g, openSpan + "Changes into an aerial unit and becomes unable to move, attack and use skills; Duration halved against enemies with more than 3 weight" + closeSpan)
    text = text.replace(/<\$ba.overdrive>/g, openSpan + "The skill bar has 2 sections. Halfway through the skill, additional effects are activated" + closeSpan)
    text = text.replace(/<\$ba.binding>/g, openSpan + "When the Tied target is not deployed, forcibly end activated skills, remove all SP and become unable to gain SP" + closeSpan)
    text = text.replace(/<\$cc.bd_b1>/g, openSpan + "Provided by the following Operator:\nDusk\nMr.Nothing" + closeSpan)
    text = text.replace(/<\$cc.bd_a1>/g, openSpan + "Affects Chain of Thought\nProvided by the following Operator(s):\nRosmontis\nDusk\nWhisperain\nIris"  + closeSpan)
    text = text.replace(/<\$cc.g.sui>/g, openSpan + "Includes the following Operators:\nNian\nDusk\nLing" + closeSpan)
    text = text.replace(/<\$cc.g.lgd>/g, openSpan + "Includes the following operators:\nChen\nHoshiguma\nSwire" + closeSpan)
    text = text.replace(/<\$cc.bd_ash>/g, openSpan + "Provided by the following Operator:\nAsh" + closeSpan)
    text = text.replace(/<\$cc.bd_tachanka>/g, openSpan + "Provided by the following Operator:\nTachanka" + closeSpan)
    text = text.replace(/<\$cc.g.ussg>/g, openSpan + "Includes the following Operators:\nRosa\nZima\nIstina\nGummy" + closeSpan)
    text = text.replace(/<\$cc.g.R6>/g, openSpan + "Includes the following Operators:\nAsh\nTachanka\nBlitz\nFrost" + closeSpan)
    text = text.replace(/<\$cc.tag.knight>/g, openSpan + "Includes the following Operators:\nNearl the Radiant Knight\nNearl (mutually exclusive)\nBlemishine\nWhislash\nFlametail\nFartooth\nAshlock\nWild Mane\n\'Justice Knight\'\nGravel" + closeSpan)
    text = text.replace(/<\$ba.protect>/g, openSpan + "Reduce Physical and Arts damage taken by the stated percentage (Does not stack, strongest effect takes precedence)" + closeSpan)
    text = text.replace(/<\$cc.bd_a1_a1>/g, openSpan + "Affects Perception Information\nProvided by the following Operator(s):\nWhisperain" + closeSpan)
    text = text.replace(/<\$cc.w.ncdeer1>/g, openSpan + "Whenever a recipe that consumes 4 or less Morale fails to produce a byproduct, gain 1 point of Causality for every 1 Morale consumed" + closeSpan)
    text = text.replace(/<\$cc.w.ncdeer2>/g, openSpan + "Whenever a recipe that consumes 8 Morale fails to produce a byproduct, gain 1 point of Karma for every 1 Morale consumed" + closeSpan)
    text = text.replace(/<\$ba.charged>/g, openSpan + "Can continue recovering SP after reaching the maximum.\nWhen SP reaches double the maximum, enter Charged state.\nSkills have additional effects when activated in Charged state (All SP is consumed whenever skill is activated)" + closeSpan)
    text = text.replace(/<\$ba.strong>/g, openSpan + "When HP is higher than a certain percentage, gain a certain amount of ATK (Does not stack, strongest effect takes precedence)" + closeSpan)
    text = text.replace(/<\$ba.sleep>/g, openSpan + "Invulnerable and unable to take action" + closeSpan)
    text = text.replace(/<\$ba.inspire>/g, openSpan + "Adds basic stats, only the highest effect of this type is applied" + closeSpan)
    text = text.replace(/<\$cc.g.abyssal>/g, openSpan + "Includes the following Operators:\nGladiia\nSkadi\nSpecter\nAndreana" + closeSpan)
    text = text.replace(/<\$cc.c.abyssal2_1>/g, openSpan + "For every Abyssal Hunter operator stationed in a Factory, the Control Center provides 5% Productivity for every Factory with an Abyssal Hunter operator stationed within it, up to a maximum of 45% Productivity" + closeSpan)
    text = text.replace(/<\$cc.c.abyssal2_2>/g, openSpan + "For every Abyssal Hunter operator stationed in a Factory, the Control Center provides 10% Productivity for every Factory with an Abyssal Hunter operator stationed within it, up to a maximum of 90% Productivity" + closeSpan)
    text = text.replace(/<\$cc.c.abyssal2_3>/g, openSpan + "Takes priority over Cooperative Will, and does not stack.\nDoes not stack with Automation α, Automation β, or Bionic Seadragon, and the 'set to 0' effect will take priority" + closeSpan)
    text = text.replace(/<\$cc.g.psk>/g, openSpan + "Includes the following Operators:\nFlametail\nFartooth\nAshlock\nWild Mane\n\'Justice Knight\'" + closeSpan)
    text = text.replace(/<\$cc.g.sp>/g, openSpan + `Includes the following Operators:\n${this.alterOps()}` + closeSpan)
    text = text.replace(/<\$ba.magicfragile>/g, openSpan + "Increase Arts damage taken by the stated percentage\n(Does not stack, strongest effect takes precedence)" + closeSpan)
    text = text.replace(/<\$ba.debuff>/g, openSpan + "Includes Stun, Cold, Frozen, etc" + closeSpan)

    return text;
  }

  private alterOps() {
    let result = "";
    
    this.db.operators.forEach(operator => {
      if(operator.name.includes('the ')) {
        result += operator.name + '\n';
      }
    })

    return result;
  }
}
