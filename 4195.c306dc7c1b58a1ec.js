"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4195],{4195:(Fe,_,c)=>{c.r(_),c.d(_,{HomePageModule:()=>De});var p=c(6895),h=c(7479),O=c(4719),g=c(6069),v=c(5861),x=c(4325),t=c(6738),I=c(523),f=c(4382),k=c(1481),b=c(9082),L=c(1555);function S(i,s){if(1&i){const e=t.EpF();t.TgZ(0,"ion-icon",8),t.NdJ("click",function(){t.CHM(e);const o=t.oxw().$implicit;return t.KtG(o.isFolded=!1)}),t.qZA()}}function P(i,s){if(1&i){const e=t.EpF();t.TgZ(0,"ion-icon",9),t.NdJ("click",function(){t.CHM(e);const o=t.oxw().$implicit;return t.KtG(o.isFolded=!0)}),t.qZA()}}function D(i,s){if(1&i&&t._UZ(0,"ion-img",14),2&i){const e=t.oxw().$implicit,n=t.oxw(2).$implicit;t.cQ8("src","",n.imgUrl,"",e.iconId,"",n.imgUrlSuffix,".png")}}const E=function(i,s){return{selected:i,disabled:s}};function F(i,s){if(1&i){const e=t.EpF();t.TgZ(0,"ion-col",3)(1,"div",11),t.NdJ("click",function(){const a=t.CHM(e).$implicit,r=t.oxw(3);return a.toggle=!a.toggle,t.KtG(r.toggleFilter())}),t.YNc(2,D,1,3,"ion-img",12),t.TgZ(3,"p",13),t._uU(4),t.qZA()()()}if(2&i){const e=s.$implicit,n=t.oxw(2).$implicit;t.xp6(1),t.Q6J("ngClass",t.WLB(3,E,e.toggle,"Branches"==n.name&&!e.isHighlighted)),t.xp6(1),t.Q6J("ngIf",n.imgUrl),t.xp6(2),t.Oqu(e.name)}}function H(i,s){if(1&i&&(t.ynx(0),t.YNc(1,F,5,6,"ion-col",10),t.BQk()),2&i){const e=t.oxw().$implicit;t.xp6(1),t.Q6J("ngForOf",e.filters)}}const V=function(i){return{selected:i}};function A(i,s){if(1&i){const e=t.EpF();t.TgZ(0,"ion-grid",1)(1,"ion-row",2),t._UZ(2,"div"),t.TgZ(3,"ion-col",3)(4,"div",4),t.NdJ("click",function(){const a=t.CHM(e).$implicit,r=t.oxw();return t.KtG(r.sortCategory(a.name))}),t._uU(5),t.qZA(),t.YNc(6,S,1,0,"ion-icon",5),t.YNc(7,P,1,0,"ion-icon",6),t.qZA()(),t.YNc(8,H,2,1,"ng-container",7),t.qZA()}if(2&i){const e=s.$implicit,n=t.oxw();t.xp6(4),t.Q6J("ngClass",t.VKq(5,V,n.selectedAll==e.name)),t.xp6(1),t.hij(" ",e.name," "),t.xp6(1),t.Q6J("ngIf",e.isFolded),t.xp6(1),t.Q6J("ngIf",!e.isFolded),t.xp6(1),t.Q6J("ngIf",!e.isFolded)}}let Z=(()=>{class i{constructor(e,n){this.sharedService=e,this.database=n,this.objectKeys=Object.keys,this.generatedFilters=[],this.selectedAll="",this.classes={name:"Classes",imgUrl:"https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_",isFolded:!1,filters:[{name:"Caster",toggle:!1,iconId:"caster"},{name:"Defender",toggle:!1,iconId:"defender"},{name:"Guard",toggle:!1,iconId:"guard"},{toggle:!1,name:"Medic",iconId:"medic"},{toggle:!1,name:"Sniper",iconId:"sniper"},{toggle:!1,name:"Specialist",iconId:"specialist"},{toggle:!1,name:"Supporter",iconId:"supporter"},{toggle:!1,name:"Vanguard",iconId:"vanguard"}]},this.branches={name:"Branches",filters:this.createCategoryFilter("branch"),imgUrl:"https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_",imgUrlSuffix:"_icon",isFolded:!1},this.groups={name:"Groups",filters:this.createCategoryFilter("group"),imgUrl:"https://raw.githubusercontent.com/Aceship/Arknight-Images/main/factions/logo_",isFolded:!1},this.artists={name:"Artists",filters:this.createCategoryFilter("artist"),isFolded:!1},this.filters=[this.classes,this.branches,this.groups,this.artists]}sortCategory(e){this.filters.forEach(n=>{n.filters.forEach(o=>{o.toggle=!1})}),this.branches.filters.forEach(n=>{n.isHighlighted=!0}),this.selectedAll==e?(this.selectedAll="",this.generatedFilters=[]):(this.generatedFilters=[{categoryName:e,toggles:[]}],this.selectedAll=e),this.sharedService.operatorListRefreshSubscription.next(this.generatedFilters)}toggleFilter(){this.selectedAll=null,this.generatedFilters=[],this.refreshGeneratedFilters(),this.checkBranchesToHighlight(),this.sharedService.operatorListRefreshSubscription.next(this.generatedFilters)}refreshGeneratedFilters(){this.filters.forEach(e=>{e.filters.forEach(n=>{if(n.toggle){const o=this.generatedFilters.find(a=>a.categoryName==e.name);o?o.toggles.push(n.name):this.generatedFilters.push({categoryName:e.name,toggles:[n.name]})}})})}createCategoryFilter(e){const n=[];let o=[];return this.database.operators.forEach(a=>{let r;switch(e){case"artist":r=n.find(l=>l.name==a.skins[0].artist);break;case"group":r=n.find(l=>l.name==a.group.name);break;default:r=n.find(l=>l.name==a[e])}if(!r){let l="";switch(e){case"artist":l=a.skins[0].artist;break;case"group":l=a.group.name;break;default:l=a[e]}if(!l)return;"branch"==e&&(o.find(Ee=>Ee.branch==l)||o.push({branch:l,class:a.class}));let d=null;switch(e){case"branch":d=a.originalBranch;break;case"group":d=a.group.id}n.push({name:l,toggle:!1,iconId:d,associatedClass:a.class,isHighlighted:!0})}}),n.sort((a,r)=>a.name<r.name?-1:1),"branch"==e&&(n.sort((a,r)=>a.name>r.name?-1:1),n.sort((a,r)=>o.find(u=>u.branch==a.name).class>o.find(u=>u.branch==r.name).class?1:-1)),n}checkBranchesToHighlight(){this.generatedFilters.find(n=>"Classes"==n.categoryName)?this.branches.filters.forEach(n=>{const o=null!=this.generatedFilters.find(a=>"Classes"==a.categoryName).toggles.find(a=>a==n.associatedClass);if(n.isHighlighted=o,!o){this.branches.filters.find(r=>r==n).toggle=!1;const a=this.generatedFilters.find(r=>"Branches"==r.categoryName);if(null!=a){const r=a.toggles.findIndex(l=>l==n.name);if(-1!=r&&a.toggles.splice(r,1),0==a.toggles.length){const l=this.generatedFilters.findIndex(d=>"Branches"==d.categoryName);this.generatedFilters.splice(l,1)}}}}):this.branches.filters.forEach(n=>{n.isHighlighted=!0})}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(b.F),t.Y36(f.k))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-filter-table"]],decls:1,vars:1,consts:[["class","filter-container",4,"ngFor","ngForOf"],[1,"filter-container"],[2,"text-align","center"],[2,"padding","0px"],[1,"individual-box","center",2,"text-align","center",3,"ngClass","click"],["class","fold-button","name","chevron-up-outline",3,"click",4,"ngIf"],["class","fold-button","name","chevron-down-outline",3,"click",4,"ngIf"],[4,"ngIf"],["name","chevron-up-outline",1,"fold-button",3,"click"],["name","chevron-down-outline",1,"fold-button",3,"click"],["style","padding: 0px;",4,"ngFor","ngForOf"],[1,"individual-box",3,"ngClass","click"],[3,"src",4,"ngIf"],[2,"display","inline-block"],[3,"src"]],template:function(e,n){1&e&&t.YNc(0,A,9,7,"ion-grid",0),2&e&&t.Q6J("ngForOf",n.filters)},dependencies:[p.mk,p.sg,p.O5,h.wI,h.jY,h.gu,h.Xz,h.Nd],styles:["ion-img[_ngcontent-%COMP%], .img[_ngcontent-%COMP%] {\n  height: 30px;\n  width: 30px;\n  display: inline-block;\n  margin: 5px;\n  margin-right: 0px;\n}\nion-img[_ngcontent-%COMP%]   .invisible[_ngcontent-%COMP%], .img[_ngcontent-%COMP%]   .invisible[_ngcontent-%COMP%] {\n  width: 0px;\n}\n.filter-container[_ngcontent-%COMP%] {\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px;\n  text-align: center;\n}\n.individual-box[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid white;\n  background: #2a2929;\n  margin: 5px;\n  padding-right: 10px;\n  width: 22.5%;\n  min-height: 35px;\n  cursor: pointer;\n}\n.individual-box[_ngcontent-%COMP%]:hover {\n  background: var(--hovergrey);\n}\n.individual-box.selected[_ngcontent-%COMP%] {\n  background: var(--blue);\n}\n.individual-box.center[_ngcontent-%COMP%] {\n  justify-content: center;\n}\n.individual-box.disabled[_ngcontent-%COMP%] {\n  filter: brightness(0.25);\n  pointer-events: none;\n}\np[_ngcontent-%COMP%] {\n  font-size: 13px;\n  pointer-events: none;\n  margin-left: 10px;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n.fold-button[_ngcontent-%COMP%] {\n  position: absolute;\n  transform: translate(5px, 12px);\n  font-size: 20px;\n  cursor: pointer;\n}"]}),i})();var M=c(1385);const B=function(i){return{name:i}};let z=(()=>{class i{constructor(e,n,o){this.opAvatarService=e,this.route=n,this.router=o,this.encodeURI=encodeURI}ngOnInit(){this.operatorImageLink=this.opAvatarService.getAvatar(this.operator)}goToOperatorPage(){var e=this;return(0,v.Z)(function*(){let n={name:encodeURI(e.operator.name)};yield e.router.navigate(["/operator"],{replaceUrl:!0,queryParams:n})})()}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(M.j),t.Y36(g.gz),t.Y36(g.F0))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-operator-item"]],inputs:{operator:"operator"},decls:4,vars:8,consts:[["routerLink","/operator",1,"container",3,"queryParams"],[3,"src"]],template:function(e,n){1&e&&(t.TgZ(0,"a",0),t._UZ(1,"ion-img",1),t.TgZ(2,"p"),t._uU(3),t.qZA()()),2&e&&(t.Q6J("queryParams",t.VKq(6,B,n.encodeURI(n.operator.name))),t.xp6(1),t.MGl("src","https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/",n.operatorImageLink,".png"),t.xp6(1),t.Gre("op-name rarity-",n.operator.rarity,""),t.xp6(1),t.Oqu(n.operator.name))},dependencies:[h.Xz,h.Fo,g.yS],styles:[".container[_ngcontent-%COMP%] {\n  border: 1px solid darkgrey;\n  display: inline-block;\n  text-align: center;\n  width: 67px;\n  margin: 5px;\n  text-align: center;\n  cursor: pointer;\n  text-decoration: none;\n  color: white;\n}\n.container[_ngcontent-%COMP%]:hover {\n  background: var(--hovergrey);\n}\nion-img[_ngcontent-%COMP%] {\n  width: 65px;\n  height: 65px;\n}\n.op-name[_ngcontent-%COMP%] {\n  border-top: 1px solid darkgrey;\n  padding: 5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  font-size: 13px;\n  --border-thickness: 5px;\n}\n.op-name.rarity-6[_ngcontent-%COMP%] {\n  border-bottom: var(--border-thickness) solid #ff8127;\n}\n.op-name.rarity-5[_ngcontent-%COMP%] {\n  border-bottom: var(--border-thickness) solid #ffe590;\n}\n.op-name.rarity-4[_ngcontent-%COMP%] {\n  border-bottom: var(--border-thickness) solid #c99fc9;\n}\n.op-name.rarity-3[_ngcontent-%COMP%] {\n  border-bottom: var(--border-thickness) solid #0098d6;\n}\n.op-name.rarity-2[_ngcontent-%COMP%] {\n  border-bottom: var(--border-thickness) solid #94bc00;\n}\n.op-name.rarity-1[_ngcontent-%COMP%] {\n  border-bottom: var(--border-thickness) solid darkgrey;\n}"]}),i})();function R(i,s){if(1&i&&(t.TgZ(0,"p"),t._uU(1),t.qZA()),2&i){const e=t.oxw().$implicit;t.xp6(1),t.Oqu(e.name)}}function Q(i,s){1&i&&t._UZ(0,"app-operator-item",4),2&i&&t.Q6J("operator",s.$implicit)}function N(i,s){if(1&i&&(t.TgZ(0,"div",1),t.YNc(1,R,2,1,"p",2),t.YNc(2,Q,1,1,"app-operator-item",3),t.qZA()),2&i){const e=s.$implicit;t.xp6(1),t.Q6J("ngIf",null!=e.name),t.xp6(1),t.Q6J("ngForOf",e.operators)}}let J=(()=>{class i{constructor(e,n){this.sharedService=e,this.database=n}ngOnInit(){this.operatorListRefresh=this.sharedService.operatorListRefresh.subscribe(e=>{this.generatedFilters=e,this.refresh()}),this.refresh()}refresh(){if(null==this.generatedFilters)this.operatorDivisions=[{name:null,operators:this.database.operators}];else if(1==this.generatedFilters.length&&0==this.generatedFilters[0].toggles.length)switch(this.generatedFilters[0].categoryName){case"Classes":this.sort("class");break;case"Branches":this.sort("branch");break;case"Artists":this.sort("artist");break;case"Groups":this.sort("group")}else this.filter();this.operatorDivisions.forEach(e=>{e.operators.sort((n,o)=>n.name<o.name?1:-1),e.operators.sort((n,o)=>n.rarity<o.rarity?1:-1)})}sort(e){this.operatorDivisions=[];let n=[];this.database.operators.slice().forEach(o=>{let a;switch(e){case"artist":a=o.skins[0].artist;break;case"group":a=o.group.name;break;default:a=o[e]}"branch"==e&&(n.find(d=>d.branch==o.branch)||n.push({branch:o.branch,class:o.class}));const r=this.operatorDivisions.find(l=>l.name==a);null!=r?r.operators.push(o):this.operatorDivisions.push({name:a,operators:[o]})}),this.operatorDivisions.sort((o,a)=>o.name>a.name?-1:1),"branch"==e&&this.operatorDivisions.sort((o,a)=>n.find(d=>d.branch==o.name).class>n.find(d=>d.branch==a.name).class?1:-1)}filter(){let e=this.database.operators.slice();this.generatedFilters.forEach(n=>{switch(n.categoryName){case"Classes":e=e.filter(o=>null!=n.toggles.find(a=>a==o.class));break;case"Branches":e=e.filter(o=>null!=n.toggles.find(a=>a==o.branch));break;case"Artists":e=e.filter(o=>null!=n.toggles.find(a=>a==o.skins[0].artist));break;case"Groups":e=e.filter(o=>null!=n.toggles.find(a=>a==o.group.name))}}),this.operatorDivisions=[{name:null,operators:e}]}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(b.F),t.Y36(f.k))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-operator-list"]],decls:1,vars:1,consts:[["style","margin-bottom: 20px;",4,"ngFor","ngForOf"],[2,"margin-bottom","20px"],[4,"ngIf"],[3,"operator",4,"ngFor","ngForOf"],[3,"operator"]],template:function(e,n){1&e&&t.YNc(0,N,3,2,"div",0),2&e&&t.Q6J("ngForOf",n.operatorDivisions)},dependencies:[p.sg,p.O5,z],styles:["p[_ngcontent-%COMP%] {\n  border-bottom: 2.5px solid white;\n  margin-left: 5px;\n  margin-top: 10px;\n  margin-bottom: 5px;\n  background: #353535;\n  padding: 2.5px;\n  padding-bottom: 0px;\n}"]}),i})();var U=c(843),j=c(9980);function Y(i,s){1&i&&t._UZ(0,"br")}function W(i,s){1&i&&t._UZ(0,"br")}function $(i,s){if(1&i&&(t.ynx(0),t.YNc(1,Y,1,0,"br",1),t._UZ(2,"app-item",8),t.YNc(3,W,1,0,"br",1),t.BQk()),2&i){const e=s.$implicit,n=s.index,o=t.oxw().$implicit;t.xp6(1),t.Q6J("ngIf",n==o.items.length/2&&n!=o.items.length-1),t.xp6(1),t.Q6J("item",e)("isGrouped",!0),t.xp6(1),t.Q6J("ngIf","Skill Summary - 2"==e.name)}}function G(i,s){if(1&i&&(t.TgZ(0,"table",7)(1,"tbody")(2,"tr")(3,"th"),t._uU(4),t.qZA()(),t.TgZ(5,"tr"),t.YNc(6,$,4,4,"ng-container",6),t.qZA()()()),2&i){const e=s.$implicit;t.xp6(4),t.Oqu(e.name),t.xp6(2),t.Q6J("ngForOf",e.items)}}function q(i,s){1&i&&t._UZ(0,"br")}function K(i,s){if(1&i&&(t.ynx(0),t.YNc(1,q,1,0,"br",1),t._UZ(2,"app-item",8),t.BQk()),2&i){const e=s.$implicit,n=s.index,o=t.oxw().$implicit;t.xp6(1),t.Q6J("ngIf",n==o.items.length/2),t.xp6(1),t.Q6J("item",e)("isGrouped",!0)}}function X(i,s){if(1&i&&(t.TgZ(0,"table",7)(1,"tbody")(2,"tr")(3,"th"),t._uU(4),t.qZA()(),t.TgZ(5,"tr"),t.YNc(6,K,3,3,"ng-container",6),t.qZA()()()),2&i){const e=s.$implicit;t.xp6(4),t.Oqu(e.name),t.xp6(2),t.Q6J("ngForOf",e.items)}}function ee(i,s){if(1&i&&(t.ynx(0),t._UZ(1,"app-item",8),t.BQk()),2&i){const e=s.$implicit;t.xp6(1),t.Q6J("item",e)("isGrouped",!0)}}function te(i,s){if(1&i&&(t.ynx(0),t.TgZ(1,"div",2),t.YNc(2,G,7,2,"table",3),t.qZA(),t.TgZ(3,"div",4),t.YNc(4,X,7,2,"table",3),t.qZA(),t.TgZ(5,"table",5)(6,"tbody")(7,"tr")(8,"th"),t._uU(9,"Miscellaneous"),t.qZA()(),t.TgZ(10,"tr"),t.YNc(11,ee,2,2,"ng-container",6),t.qZA()()(),t.BQk()),2&i){const e=t.oxw();t.xp6(2),t.Q6J("ngForOf",e.groupedItems),t.xp6(2),t.Q6J("ngForOf",e.groupedChips),t.xp6(7),t.Q6J("ngForOf",e.miscellaneousItems)}}function ie(i,s){if(1&i&&(t.ynx(0),t._UZ(1,"app-item",8),t.BQk()),2&i){const e=s.$implicit;t.xp6(1),t.Q6J("item",e)("isGrouped",!0)}}function ne(i,s){if(1&i&&(t.ynx(0),t.TgZ(1,"table",5)(2,"tbody")(3,"tr")(4,"th"),t._uU(5,"Growth Materials"),t.qZA()(),t.TgZ(6,"tr"),t.YNc(7,ie,2,2,"ng-container",6),t.qZA()()(),t.BQk()),2&i){const e=t.oxw();t.xp6(7),t.Q6J("ngForOf",e.allItems)}}let oe=(()=>{class i{constructor(e){this.database=e,this.round=Math.round,this.grouped=!0,this.groupedItems=[{name:"Skill Summaries",find:"Skill Summary"},{name:"Battle Records",find:"Battle Record"},{name:"Orirocks",find:"Orirock"},{name:"Oriron",find:"Oriron"},{name:"Devices",find:"Device"},{name:"Keton",find:"keton",lowerCase:!0},{name:"Polyesters",find:"ester",lowerCase:!0},{name:"Sugars",find:"Sugar"}],this.groupedChips=[{name:"Chips",find:"Chip"},{name:"Chip Packs",find:"Chip Pack"},{name:"Dualchips",find:"Dualchip"}],this.miscellaneousItems=[],this.allItems=[]}ngOnInit(){this.database.items.forEach(e=>{e.amount=0}),this.groupedItems.forEach(e=>{e.items=this.database.items.slice().filter(n=>e.lowerCase?n.name.toLowerCase().includes(e.find):n.name.includes(e.find))}),this.groupedChips.forEach(e=>{e.items=this.database.items.slice().filter(n=>e.lowerCase?n.name.toLowerCase().includes(e.find):"Chip"==e.find?n.name.includes("Chip")&&!n.name.includes("Chip Pack")&&!n.name.includes("Chip Catalyst"):n.name.includes(e.find))}),this.miscellaneousItems=this.database.items.slice().filter(e=>{if("MATERIAL"!=e.type)return!1;for(let n of this.groupedItems)if(n.items.find(a=>a==e))return!1;for(let n of this.groupedChips)if(n.items.find(a=>a==e))return!1;return!e.name.includes("Token")&&!e.name.includes("Letter")}),this.allItems=this.database.items.slice().filter(e=>"MATERIAL"==e.type&&!e.name.includes("Token")&&!e.name.includes("Letter"))}includes(e,n){return e.includes(n)}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(f.k))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-item-list"]],decls:4,vars:3,consts:[["label","Grouping",3,"value","onChanged"],[4,"ngIf"],[1,"grouped-item-container"],["class","table","style","margin-left: 5px; margin-right: 5px",4,"ngFor","ngForOf"],[1,"grouped-chip-container"],[1,"table"],[4,"ngFor","ngForOf"],[1,"table",2,"margin-left","5px","margin-right","5px"],[3,"item","isGrouped"]],template:function(e,n){1&e&&(t.TgZ(0,"div")(1,"app-checkbox",0),t.NdJ("onChanged",function(){return n.grouped=!n.grouped}),t.qZA()(),t.YNc(2,te,12,3,"ng-container",1),t.YNc(3,ne,8,1,"ng-container",1)),2&e&&(t.xp6(1),t.Q6J("value",n.grouped),t.xp6(1),t.Q6J("ngIf",n.grouped),t.xp6(1),t.Q6J("ngIf",!n.grouped))},dependencies:[p.sg,p.O5,U.b,j.P],styles:[".grouped-item-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n\n.grouped-chip-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n\n.grouped-miscellaneous[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n\nth[_ngcontent-%COMP%] {\n  border-bottom: 1px solid white !important;\n  border: none;\n}\n\ntr[_ngcontent-%COMP%] {\n  text-align: center;\n}"]}),i})();var se=c(8878);function ae(i,s){if(1&i&&(t.TgZ(0,"p",4),t._uU(1),t.ALo(2,"numberFormatter"),t.qZA()),2&i){const e=t.oxw();t.xp6(1),t.hij("Loading... ",t.xi3(2,1,e.dbGetter.jsonLoadingProgress/e.dbGetter.maxJsonFiles,"percent"),"")}}function re(i,s){1&i&&(t.TgZ(0,"div",9)(1,"div",10),t._UZ(2,"app-filter-table"),t.qZA(),t.TgZ(3,"div",11),t._UZ(4,"app-operator-list"),t.qZA()())}function le(i,s){1&i&&(t.TgZ(0,"div",12),t._UZ(1,"app-item-list"),t.qZA())}const y=function(i){return{selected:i}};function ce(i,s){if(1&i){const e=t.EpF();t.TgZ(0,"div")(1,"div",5)(2,"p",6),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.currentTab="operators")}),t._uU(3,"Operators"),t.qZA(),t.TgZ(4,"p",6),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.currentTab="items")}),t._uU(5,"Items"),t.qZA()(),t.YNc(6,re,5,0,"div",7),t.YNc(7,le,2,0,"div",8),t.qZA()}if(2&i){const e=t.oxw();t.xp6(2),t.Q6J("ngClass",t.VKq(4,y,"operators"==e.currentTab)),t.xp6(2),t.Q6J("ngClass",t.VKq(6,y,"items"==e.currentTab)),t.xp6(2),t.Q6J("ngIf","operators"==e.currentTab),t.xp6(1),t.Q6J("ngIf","items"==e.currentTab)}}const pe=function(i){return{blur:i}};let C=(()=>{class i{constructor(e,n,o,a,r){this.dbGetter=e,this.database=n,this.title=o,this.platform=a,this.sharedService=r,this.currentTab="operators",this.isBlurry=!1,this.hasLoaded=!1}ngOnInit(){this.changeTabDisplay(),this.hasLoaded=this.database.isLoaded,this.windowWidth=this.platform.width(),this.jsonsLoadedSubscription=this.sharedService.jsonsLoaded.subscribe(()=>{this.hasLoaded=!0}),this.toggledDialogSubscription=this.sharedService.toggledDialog.subscribe(e=>{this.isBlurry=e})}changeTabDisplay(){this.favIcon=document.getElementById("appIcon"),this.title.setTitle("Retropaint's Arknights Wiki"),this.favIcon.href="assets/icon/favicon.png"}onResize(e){var n=this;return(0,v.Z)(function*(){n.windowWidth=e.target.innerWidth})()}ngOnDestroy(){this.toggledDialogSubscription.unsubscribe()}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(I.i),t.Y36(f.k),t.Y36(k.Dx),t.Y36(h.t4),t.Y36(b.F))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-home"]],features:[t._Bn([x.xA])],decls:5,vars:5,consts:[[3,"ngClass"],["style","text-align: center; margin-top: 10px",4,"ngIf"],[4,"ngIf"],[3,"resize"],[2,"text-align","center","margin-top","10px"],[1,"tabs"],[3,"ngClass","click"],["class","dead-zone container",4,"ngIf"],["class","dead-zone",4,"ngIf"],[1,"dead-zone","container"],[1,"left-container","filter-table"],[1,"right-container","operator-list"],[1,"dead-zone"]],template:function(e,n){1&e&&(t._UZ(0,"app-header"),t.TgZ(1,"ion-content",0),t.YNc(2,ae,3,4,"p",1),t.YNc(3,ce,8,8,"div",2),t.TgZ(4,"div",3),t.NdJ("resize",function(a){return n.onResize(a)},!1,t.Jf7),t.qZA()()),2&e&&(t.xp6(1),t.Q6J("ngClass",t.VKq(3,pe,n.isBlurry)),t.xp6(1),t.Q6J("ngIf",!n.hasLoaded),t.xp6(1),t.Q6J("ngIf",n.hasLoaded))},dependencies:[p.mk,p.O5,h.W2,L.G,Z,J,oe,se.m],styles:[".dead-zone[_ngcontent-%COMP%] {\n  padding-left: 10px;\n  padding-right: 10px;\n  height: 85vh;\n}\n.dead-zone.container[_ngcontent-%COMP%] {\n  display: flex;\n}\n.left-container[_ngcontent-%COMP%] {\n  flex: 1 1 360px;\n  border: 1px solid white;\n  padding: 10px;\n  margin-right: 10px;\n  margin-bottom: 0px;\n  overflow: auto;\n}\n.left-container.desktop[_ngcontent-%COMP%] {\n  padding-right: 15px;\n}\n.right-container[_ngcontent-%COMP%] {\n  flex: 1 1 360px;\n  border: 1px solid white;\n  padding: 10px;\n  overflow: auto;\n}\n.tabs[_ngcontent-%COMP%] {\n  padding-left: 10px;\n  padding-bottom: 10px;\n  margin-top: 10px;\n}\n.tabs[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0px;\n  display: inline-block;\n  background: grey;\n  color: white;\n  padding: 5px;\n  margin-right: 10px;\n  cursor: pointer;\n}\n.tabs[_ngcontent-%COMP%]   p.selected[_ngcontent-%COMP%] {\n  background: #2a2929;\n  cursor: default;\n}\n.not-selected-tab[_ngcontent-%COMP%] {\n  display: none !important;\n}"]}),i})();const de=[{path:"",component:C},{path:":operator",component:C,data:{title:"Arknights Wiki"}}];let he=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[g.Bz.forChild(de),g.Bz]}),i})();var m=c(805),T=c(1795);let be=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[p.ez,T.T,m.m8,m.m8]}),i})();var _e=c(1493);let w=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[p.ez]}),i})(),Le=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[p.ez,m.m8,w,T.T,m.m8]}),i})();var Se=c(6874),Pe=c(4466);let De=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[p.ez,O.u5,h.Pc,he,be,_e.S,x.DL,Le,Se.L,w,g.Bz,Pe.m]}),i})()}}]);