import{d as K,a1 as Z,l as A,c as ee,x as D,Q as te,y as ae,z as L,R as i,a8 as O,ce as M,cf as m,a3 as se,a6 as ne,a7 as ie,i as r,o as h,a as oe,m as E,g as b,w as v,B as le,b as T,ap as ce,u as re,e as ue,T as pe,cg as y,E as ge,q as fe,U as de,L as me,n as R,t as Y,bu as ye,_ as _e}from"./index-D767YE15.js";import{b as he,a as ve,_ as we,c as xe}from"./AlertCircle-DipXxMDp.js";const Me={class:"notification-content","data-tauri-drag-region":"",style:{cursor:"move"}},be={class:"btns"},C=50,u=10,Te=K({__name:"Notification",setup(ze){re(a=>({c587ecea:r(S)}));const{borderRadius:z,appOpacity:S,appTransform:$,oppositeBgColor:w}=ue(),{createWindow:U}=Z();let N;const k=A(1),q=ee(()=>{const a=Math.floor(k.value/3600),t=Math.floor(k.value%3600/60),s=Math.floor(k.value%60);return`${a?`${a}:`:""}${t?`${t}:`:""}${s}`}),{notify:P}=pe,H=D({info:w==null?void 0:w.value,loading:w==null?void 0:w.value,success:"#67c23a",warning:"#e6a23c",danger:"#f56c6c"}),c=D({name:"运行中",currentMessage:{type:"info",message:"",time:""}});let I=!1;const Q=()=>{var a;(a=M.getByLabel("main"))==null||a.show(),i.hide(),I=!0};let V;const g={lastX:0,lastY:0,lastMirrorPos:""};let l,d;const _=A(!0);te(_,async()=>{var t,s,e,o,f;d&&clearTimeout(d);const a=N||M.getByLabel("floatWindow");if(_.value){if($.value="none",z.value="20px",await((t=i)==null?void 0:t.setSize(new m(300,40))),S.value=1,await O(),g.lastMirrorPos==="right"&&l){const n=await(a==null?void 0:a.outerPosition());await((s=i)==null?void 0:s.setPosition(new y(l.width-300,(n==null?void 0:n.y)||0)))}}else{if(g.lastMirrorPos==="")return;const n=await i.outerPosition(),x=await i.innerSize();g.lastMirrorPos==="left"?(await((e=i)==null?void 0:e.setPosition(new y(0,n.y))),$.value=`translateX(calc(-100% + ${u}px))`,z.value="0px 10px 10px 0px",d=setTimeout(()=>{var p;(p=i)==null||p.setSize(new m(u,x.height)),S.value=.5,clearTimeout(d)},1e3)):g.lastMirrorPos==="right"?(await((o=i)==null?void 0:o.setPosition(new y(l.width-x.width,n.y))),$.value=`translateX(calc(100% - ${u}px))`,z.value="10px 0px 0px 10px",d=setTimeout(async()=>{var p;await((p=i)==null?void 0:p.setSize(new m(u,x.height))),await i.setPosition(new y(l.width-u,n.y)),S.value=.5,clearTimeout(d)},1e3)):(await((f=i)==null?void 0:f.setPosition(new y(n.x,0))),$.value=`translateY(calc(-100% + ${u}px))`,z.value="0px 0px 10px 10px",d=setTimeout(async()=>{var p;await((p=i)==null?void 0:p.setSize(new m(x.width,u))),S.value=.5,clearTimeout(d)},1e3)),await(a==null?void 0:a.hide())}});const W=async(a,t)=>{const s=a!=null?a:await i.innerSize(),{x:e,y:o}=t!=null?t:await i.outerPosition();l=l!=null?l:await L.getScreenSize();const{width:f}=l;let n="";return o<C?e<C?o<=e?n="top":n="left":f-s.width-e<C?o<=f-s.width-e?n="top":n="right":n="top":e<C?n="left":f-s.width-e<C&&(n="right"),n},j=async(a,t)=>{const{x:s,y:e}=await L.getMousePos();return s>=t.x&&s<=t.x+a.width&&e>=t.y&&e<=t.y+a.height},F=async(a,t,s)=>{const e=N||M.getByLabel("floatWindow");if(!_.value){e==null||e.hide();return}if(a===""){e==null||e.hide();return}a==="top"?(await P.sendCustom({name:"borderRadius",message:"0 0 10px 10px"}),await(e==null?void 0:e.setSize(new m(t.width,u))),await(e==null?void 0:e.setPosition(new y(s.x,0)))):a==="left"?(await P.sendCustom({name:"borderRadius",message:"0px 10px 10px 0px"}),await(e==null?void 0:e.setSize(new m(u,t.height))),await(e==null?void 0:e.setPosition(new y(0,s.y)))):a==="right"&&(await P.sendCustom({name:"borderRadius",message:"10px 0px 0px 10px"}),await(e==null?void 0:e.setSize(new m(u,t.height))),l||(l=await L.getScreenSize()),await(e==null?void 0:e.setPosition(new y(l.width-u,s.y)))),await(e==null?void 0:e.show())};let X,B;return ae(async()=>{l=await L.getScreenSize(),X=await P.listen(t=>{const{type:s,payload:e}=t.payload;if(s==="message")B&&clearInterval(B),c.currentMessage=e,e.type==="loading"&&(k.value=1,B=setInterval(()=>{k.value+=1},1e3));else if(s==="init")c.name=e.name,I=!1,c.currentMessage={type:"info",message:"",time:""};else if(s==="clear-message")c.currentMessage={type:"info",message:"",time:""};else if(s==="done")c.currentMessage={type:"info",message:"",time:""},i.hide(),I=!0;else if(s==="custom-message"){const{name:o}=e;o==="continue"&&(I=!1)}}),N=U("floatWindow","/floatWindow",{height:300,width:40,alwaysOnTop:!1}),await P.sendCustom({name:"opacity",message:"0.5"}),O(()=>{var t;(t=M.getByLabel("floatWindow"))==null||t.hide()});const a=setTimeout(()=>{var t;(t=M.getByLabel("floatWindow"))==null||t.hide(),clearTimeout(a)},500);i.setSize(new m(300,40)),z.value="20px",V=setInterval(async()=>{if(I||!await i.isVisible())return;const t=await L.getMousePos();if(t.x===g.lastX&&t.y===g.lastY)return;g.lastX=t.x,g.lastY=t.y;const s=await i.innerSize(),e=await i.outerPosition(),o=await W(s,e);g.lastMirrorPos=o,o===""?_.value=!0:!await j(s,e)?_.value=!1:_.value=!0,await F(o,s,e)},200)}),se(()=>{var a;B&&clearInterval(B),V&&clearInterval(V),X(),(a=M.getByLabel("floatWindow"))==null||a.hide()}),(a,t)=>{const s=xe,e=he,o=ge,f=ve,n=we,x=ye,p=fe,G=de,J=me;return ne((h(),oe("div",Me,[E("div",{class:"content","data-tauri-drag-region":"",style:ce([{cursor:"move"},{color:r(H)[r(c).currentMessage.type||"info"]}])},[r(c).currentMessage.type==="loading"?(h(),b(s,{key:0,class:"icon","data-tauri-drag-region":"",style:{cursor:"move"}})):r(c).currentMessage.type==="success"?(h(),b(o,{key:1,class:"icon",size:"small","data-tauri-drag-region":"",style:{cursor:"move"}},{default:v(()=>[T(e,{"data-tauri-drag-region":""})]),_:1})):r(c).currentMessage.type==="warning"?(h(),b(o,{key:2,class:"icon",size:"small","data-tauri-drag-region":"",style:{cursor:"move"}},{default:v(()=>[T(f,{"data-tauri-drag-region":""})]),_:1})):r(c).currentMessage.type==="danger"?(h(),b(o,{key:3,class:"icon",size:"small","data-tauri-drag-region":"",style:{cursor:"move"}},{default:v(()=>[T(n,{"data-tauri-drag-region":""})]),_:1})):(h(),b(x,{key:4,"data-tauri-drag-region":"",class:"icon",size:"small",style:{cursor:"move"}})),r(c).currentMessage.type==="loading"?(h(),b(p,{key:5,class:"icon",size:"small",type:"primary","data-tauri-drag-region":"",style:{cursor:"move"}},{default:v(()=>[R(Y(r(q)),1)]),_:1})):le("",!0),T(G,{class:"message","data-tauri-drag-region":"",style:{cursor:"move"}},{default:v(()=>[R(Y(r(c).currentMessage.message),1)]),_:1})],4),E("div",be,[T(J,{class:"btn",size:"small",onClick:Q,circle:""},{default:v(()=>[T(o,null,{default:v(()=>t[0]||(t[0]=[E("span",{"i-mdi-home-export-outline":""},null,-1)])),_:1})]),_:1})])],512)),[[ie,r(_)]])}}}),Pe=_e(Te,[["__scopeId","data-v-5ffe9323"]]);export{Pe as default};
