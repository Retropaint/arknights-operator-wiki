"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[3995],{3995:(j,p,a)=>{a.r(p),a.d(p,{ItemPageModule:()=>z});var c=a(6895),u=a(4719),m=a(7479),g=a(6069),l=a(4325),t=a(6738),h=a(672),f=a(4382),v=a(9082),P=a(358),x=a(1555),y=a(9980),T=a(8878);const b=["stageTable"];function I(n,s){if(1&n&&(t.TgZ(0,"p",3),t._uU(1),t.ALo(2,"numberFormatter"),t.qZA()),2&n){const e=t.oxw();t.xp6(1),t.hij("Loading... ",t.xi3(2,1,e.dbGetter.jsonLoadingProgress/e.dbGetter.maxJsonFiles,"percent"),"")}}function Z(n,s){if(1&n&&t._UZ(0,"app-item-component",17),2&n){const e=t.oxw(3);t.Q6J("isGrouped",!0)("item",e.item)}}function M(n,s){if(1&n&&(t.TgZ(0,"div",12)(1,"table",13)(2,"tbody")(3,"tr")(4,"td",14)(5,"div",12),t.YNc(6,Z,1,2,"app-item-component",15),t.TgZ(7,"strong"),t._uU(8),t.qZA()()()()()(),t.TgZ(9,"table",16)(10,"tbody")(11,"tr")(12,"th"),t._uU(13,"Item Description"),t.qZA()(),t.TgZ(14,"tr")(15,"td"),t._uU(16),t.qZA()()()(),t.TgZ(17,"table",16)(18,"tbody")(19,"tr")(20,"th"),t._uU(21,"Item Usage"),t.qZA()(),t.TgZ(22,"tr")(23,"td"),t._uU(24),t.qZA()()()()()),2&n){const e=t.oxw(2);t.xp6(6),t.Q6J("ngIf",e.item),t.xp6(2),t.Oqu(e.item.name),t.xp6(8),t.Oqu(e.item.description),t.xp6(8),t.Oqu(e.item.usage)}}function C(n,s){if(1&n&&(t.TgZ(0,"tr")(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.qZA()()),2&n){const e=s.$implicit;t.xp6(2),t.Oqu(e.type),t.xp6(2),t.AsE("",e.code," ",e.isGuaranteed?"(guaranteed)":"",""),t.xp6(2),t.Oqu(e.dropType)}}function O(n,s){if(1&n&&(t.TgZ(0,"div",4),t._UZ(1,"div",5),t.YNc(2,M,25,4,"div",6),t.TgZ(3,"div",7,8)(5,"table",9)(6,"thead",10)(7,"tr")(8,"th"),t._uU(9,"Drops From"),t.qZA(),t.TgZ(10,"th"),t._uU(11,"Stage Code"),t.qZA(),t.TgZ(12,"th"),t._uU(13,"Drop Type"),t.qZA()()(),t.TgZ(14,"tbody"),t.YNc(15,C,7,4,"tr",11),t.qZA()()()()),2&n){const e=t.oxw();t.xp6(2),t.Q6J("ngIf",e.item),t.xp6(1),t.Akn("height:"+e.stageTableHeight+"px"),t.xp6(12),t.Q6J("ngForOf",e.stageDrops)}}const A=[{path:"",component:(()=>{class n{constructor(e,i,o,r,d,F){this.jsonParser=e,this.router=i,this.database=o,this.sharedService=r,this.route=d,this.dbGetter=F,this.stageDrops=[],this.stageTableHeight=0}ngOnInit(){let e;this.routerSubscription=this.router.events.subscribe(i=>{i instanceof g.QW?e=i.snapshot.queryParams.id:i instanceof g.Xs&&null!=e&&this.initItem(e)}),this.jsonsLoadedSubscription=this.sharedService.jsonsLoaded.subscribe(()=>{this.initItem(this.route.snapshot.queryParams.id)})}initItem(e){this.stageDrops=[],this.item=this.jsonParser.getItem(e),this.getStageDrops(),this.sharedService.changeTabDisplay(this.item.name,`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/${this.item.imgId}.png`),setTimeout(()=>{this.onResize(null)})}getStageDrops(){this.database.stages.forEach(e=>{const i=e.itemDrops.main.find(d=>d.id==this.item.id),o=e.itemDrops.side.find(d=>d.id==this.item.id);if(!i&&!o)return;let r="";i&&o?r="Main & Side":i?r="Main":o&&(r="Side"),this.stageDrops.push({code:e.code,type:e.type,dropType:r,isGuaranteed:!1})}),this.stageDrops.sort((e,i)=>e.type<i.type?-1:1),this.stageDrops.sort((e,i)=>e.type.includes("Chapter")&&e.type.includes("Branch")&&i.type.includes("Branch")&&i.type.includes("Chapter")?-1:0),this.stageDrops.sort((e,i)=>e.type.includes("Chapter")&&i.type.includes("Branch")&&i.type.includes("Chapter")?-1:0)}onResize(e){this.stageTableHeight=window.innerHeight-this.stageTable.nativeElement.offsetTop-80}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(h.E),t.Y36(g.F0),t.Y36(f.k),t.Y36(v.F),t.Y36(g.gz),t.Y36(P.i))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-item"]],viewQuery:function(e,i){if(1&e&&t.Gf(b,5),2&e){let o;t.iGM(o=t.CRH())&&(i.stageTable=o.first)}},features:[t._Bn([l.xA])],decls:5,vars:2,consts:[["style","text-align: center; margin-top: 10px",4,"ngIf"],["class","dead-zone",4,"ngIf"],[3,"resize"],[2,"text-align","center","margin-top","10px"],[1,"dead-zone"],[2,"background","red"],["class","container",4,"ngIf"],[1,"stage-table-container"],["stageTable",""],[1,"table",2,"width","500px"],[1,"header"],[4,"ngFor","ngForOf"],[1,"container"],[1,"table","item"],[2,"border","none"],[3,"isGrouped","item",4,"ngIf"],[1,"table"],[3,"isGrouped","item"]],template:function(e,i){1&e&&(t._UZ(0,"app-header"),t.TgZ(1,"ion-content"),t.YNc(2,I,3,4,"p",0),t.YNc(3,O,16,4,"div",1),t.TgZ(4,"div",2),t.NdJ("resize",function(r){return i.onResize(r)},!1,t.Jf7),t.qZA()()),2&e&&(t.xp6(2),t.Q6J("ngIf",!i.database.isLoaded),t.xp6(1),t.Q6J("ngIf",i.database.isLoaded))},dependencies:[c.sg,c.O5,m.W2,x.G,y.P,T.m],styles:[".container[_ngcontent-%COMP%] {\n  display: flex;\n}\n.container[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  height: 20px;\n}\n.dead-zone[_ngcontent-%COMP%] {\n  padding-left: 10px;\n  padding-right: 10px;\n  text-align: center;\n}\n.table[_ngcontent-%COMP%] {\n  margin: 5px;\n}\n.table.item[_ngcontent-%COMP%] {\n  width: 300px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.table.item[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.table.item[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.stage-table-container[_ngcontent-%COMP%] {\n  margin: 5px;\n  overflow-y: auto;\n  display: inline-block;\n  margin-left: auto;\n  margin-right: auto;\n}\n.stage-table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] {\n  margin: 0px;\n  border-collapse: separate;\n}\n.stage-table-container[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  background: var(--tableFirstHeader);\n}"]}),n})()}];let D=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[g.Bz.forChild(A),g.Bz]}),n})();var U=a(4466),S=a(1493);let z=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[c.ez,u.u5,m.Pc,D,S.S,l.DL,U.m]}),n})()}}]);