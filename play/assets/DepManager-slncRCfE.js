import{ae as le,aJ as ve,dr as Ne,d as M,ao as me,bV as _e,ah as oe,l as R,Q,a8 as ie,cI as pe,a3 as Me,o as i,a as N,ak as Be,i as s,ap as qe,al as De,am as ge,ds as j,dt as Ke,du as Ye,c as J,y as ye,cp as je,b as u,E as te,bp as Ge,bq as He,ar as We,aZ as ae,ai as Je,aj as be,dv as Qe,bb as Ee,b4 as xe,bc as Xe,ag as Ze,bl as et,dw as Pe,x as Se,bv as Oe,a6 as Z,a7 as tt,B as Y,as as at,at as nt,u as he,a0 as st,s as lt,R as ot,m as K,n as D,w as P,t as I,F as G,D as H,g as T,a9 as it,G as F,dk as X,bR as rt,q as ke,L as we,ch as $e,_ as ee,e as Re,dx as ne,cd as se,A as ct}from"./index-D767YE15.js";import{v as ze,r as ut}from"./el-loading-Cb413ljY.js";import{E as Ce}from"./el-empty-C55xF_EA.js";import{u as dt}from"./index-Cwm3MLgW.js";const re=Symbol("tabsRootContextKey"),ft=le({tabs:{type:ve(Array),default:()=>Ne([])}}),Ve="ElTabBar",pt=M({name:Ve}),bt=M({...pt,props:ft,setup(a,{expose:e}){const h=a,w=ge(),o=me(re);o||_e(Ve,"<el-tabs><el-tab-bar /></el-tabs>");const b=oe("tabs"),p=R(),t=R(),n=()=>{let g=0,C=0;const v=["top","bottom"].includes(o.props.tabPosition)?"width":"height",V=v==="width"?"x":"y",l=V==="x"?"left":"top";return h.tabs.every(r=>{var d,B;const c=(B=(d=w.parent)==null?void 0:d.refs)==null?void 0:B[`tab-${r.uid}`];if(!c)return!1;if(!r.active)return!0;g=c[`offset${j(l)}`],C=c[`client${j(v)}`];const E=window.getComputedStyle(c);return v==="width"&&(C-=Number.parseFloat(E.paddingLeft)+Number.parseFloat(E.paddingRight),g+=Number.parseFloat(E.paddingLeft)),!1}),{[v]:`${C}px`,transform:`translate${j(V)}(${g}px)`}},_=()=>t.value=n(),f=[],k=()=>{var g;f.forEach(v=>v.stop()),f.length=0;const C=(g=w.parent)==null?void 0:g.refs;if(C){for(const v in C)if(v.startsWith("tab-")){const V=C[v];V&&f.push(pe(V,_))}}};Q(()=>h.tabs,async()=>{await ie(),_(),k()},{immediate:!0});const $=pe(p,()=>_());return Me(()=>{f.forEach(g=>g.stop()),f.length=0,$.stop()}),e({ref:p,update:_}),(g,C)=>(i(),N("div",{ref_key:"barRef",ref:p,class:Be([s(b).e("active-bar"),s(b).is(s(o).props.tabPosition)]),style:qe(t.value)},null,6))}});var vt=De(bt,[["__file","tab-bar.vue"]]);const mt=le({panes:{type:ve(Array),default:()=>Ne([])},currentName:{type:[String,Number],default:""},editable:Boolean,type:{type:String,values:["card","border-card",""],default:""},stretch:Boolean}),_t={tabClick:(a,e,h)=>h instanceof Event,tabRemove:(a,e)=>e instanceof Event},Te="ElTabNav",gt=M({name:Te,props:mt,emits:_t,setup(a,{expose:e,emit:h}){const w=me(re);w||_e(Te,"<el-tabs><tab-nav /></el-tabs>");const o=oe("tabs"),b=Ke(),p=Ye(),t=R(),n=R(),_=R(),f=R(),k=R(!1),$=R(0),g=R(!1),C=R(!0),v=J(()=>["top","bottom"].includes(w.props.tabPosition)?"width":"height"),V=J(()=>({transform:`translate${v.value==="width"?"X":"Y"}(-${$.value}px)`})),l=()=>{if(!t.value)return;const y=t.value[`offset${j(v.value)}`],x=$.value;if(!x)return;const m=x>y?x-y:0;$.value=m},r=()=>{if(!t.value||!n.value)return;const y=n.value[`offset${j(v.value)}`],x=t.value[`offset${j(v.value)}`],m=$.value;if(y-m<=x)return;const L=y-m>x*2?m+x:y-x;$.value=L},d=async()=>{const y=n.value;if(!k.value||!_.value||!t.value||!y)return;await ie();const x=_.value.querySelector(".is-active");if(!x)return;const m=t.value,L=["top","bottom"].includes(w.props.tabPosition),A=x.getBoundingClientRect(),z=m.getBoundingClientRect(),q=L?y.offsetWidth-z.width:y.offsetHeight-z.height,U=$.value;let O=U;L?(A.left<z.left&&(O=U-(z.left-A.left)),A.right>z.right&&(O=U+A.right-z.right)):(A.top<z.top&&(O=U-(z.top-A.top)),A.bottom>z.bottom&&(O=U+(A.bottom-z.bottom))),O=Math.max(O,0),$.value=Math.min(O,q)},B=()=>{var y;if(!n.value||!t.value)return;a.stretch&&((y=f.value)==null||y.update());const x=n.value[`offset${j(v.value)}`],m=t.value[`offset${j(v.value)}`],L=$.value;m<x?(k.value=k.value||{},k.value.prev=L,k.value.next=L+m<x,x-L<m&&($.value=x-m)):(k.value=!1,L>0&&($.value=0))},c=y=>{const x=y.code,{up:m,down:L,left:A,right:z}=ae;if(![m,L,A,z].includes(x))return;const q=Array.from(y.currentTarget.querySelectorAll("[role=tab]:not(.is-disabled)")),U=q.indexOf(y.target);let O;x===A||x===m?U===0?O=q.length-1:O=U-1:U<q.length-1?O=U+1:O=0,q[O].focus({preventScroll:!0}),q[O].click(),E()},E=()=>{C.value&&(g.value=!0)},S=()=>g.value=!1;return Q(b,y=>{y==="hidden"?C.value=!1:y==="visible"&&setTimeout(()=>C.value=!0,50)}),Q(p,y=>{y?setTimeout(()=>C.value=!0,50):C.value=!1}),pe(_,B),ye(()=>setTimeout(()=>d(),0)),je(()=>B()),e({scrollToActiveTab:d,removeFocus:S}),()=>{const y=k.value?[u("span",{class:[o.e("nav-prev"),o.is("disabled",!k.value.prev)],onClick:l},[u(te,null,{default:()=>[u(Ge,null,null)]})]),u("span",{class:[o.e("nav-next"),o.is("disabled",!k.value.next)],onClick:r},[u(te,null,{default:()=>[u(He,null,null)]})])]:null,x=a.panes.map((m,L)=>{var A,z,q,U;const O=m.uid,ce=m.props.disabled,ue=(z=(A=m.props.name)!=null?A:m.index)!=null?z:`${L}`,de=!ce&&(m.isClosable||a.editable);m.index=`${L}`;const Ie=de?u(te,{class:"is-icon-close",onClick:W=>h("tabRemove",m,W)},{default:()=>[u(We,null,null)]}):null,Ue=((U=(q=m.slots).label)==null?void 0:U.call(q))||m.props.label,Fe=!ce&&m.active?0:-1;return u("div",{ref:`tab-${O}`,class:[o.e("item"),o.is(w.props.tabPosition),o.is("active",m.active),o.is("disabled",ce),o.is("closable",de),o.is("focus",g.value)],id:`tab-${ue}`,key:`tab-${O}`,"aria-controls":`pane-${ue}`,role:"tab","aria-selected":m.active,tabindex:Fe,onFocus:()=>E(),onBlur:()=>S(),onClick:W=>{S(),h("tabClick",m,ue,W)},onKeydown:W=>{de&&(W.code===ae.delete||W.code===ae.backspace)&&h("tabRemove",m,W)}},[Ue,Ie])});return u("div",{ref:_,class:[o.e("nav-wrap"),o.is("scrollable",!!k.value),o.is(w.props.tabPosition)]},[y,u("div",{class:o.e("nav-scroll"),ref:t},[u("div",{class:[o.e("nav"),o.is(w.props.tabPosition),o.is("stretch",a.stretch&&["top","bottom"].includes(w.props.tabPosition))],ref:n,style:V.value,role:"tablist",onKeydown:c},[a.type?null:u(vt,{ref:f,tabs:[...a.panes]},null),x])])])}}}),yt=le({type:{type:String,values:["card","border-card",""],default:""},closable:Boolean,addable:Boolean,modelValue:{type:[String,Number]},editable:Boolean,tabPosition:{type:String,values:["top","right","bottom","left"],default:"top"},beforeLeave:{type:ve(Function),default:()=>!0},stretch:Boolean}),fe=a=>Xe(a)||Ze(a),ht={[Ee]:a=>fe(a),tabClick:(a,e)=>e instanceof Event,tabChange:a=>fe(a),edit:(a,e)=>["remove","add"].includes(e),tabRemove:a=>fe(a),tabAdd:()=>!0},kt=M({name:"ElTabs",props:yt,emits:ht,setup(a,{emit:e,slots:h,expose:w}){var o;const b=oe("tabs"),p=J(()=>["left","right"].includes(a.tabPosition)),{children:t,addChild:n,removeChild:_}=dt(ge(),"ElTabPane"),f=R(),k=R((o=a.modelValue)!=null?o:"0"),$=async(l,r=!1)=>{var d,B,c;if(!(k.value===l||xe(l)))try{await((d=a.beforeLeave)==null?void 0:d.call(a,l,k.value))!==!1&&(k.value=l,r&&(e(Ee,l),e("tabChange",l)),(c=(B=f.value)==null?void 0:B.removeFocus)==null||c.call(B))}catch{}},g=(l,r,d)=>{l.props.disabled||($(r,!0),e("tabClick",l,d))},C=(l,r)=>{l.props.disabled||xe(l.props.name)||(r.stopPropagation(),e("edit",l.props.name,"remove"),e("tabRemove",l.props.name))},v=()=>{e("edit",void 0,"add"),e("tabAdd")};Q(()=>a.modelValue,l=>$(l)),Q(k,async()=>{var l;await ie(),(l=f.value)==null||l.scrollToActiveTab()}),Je(re,{props:a,currentName:k,registerPane:l=>{t.value.push(l)},sortPane:n,unregisterPane:_}),w({currentName:k});const V=({render:l})=>l();return()=>{const l=h["add-icon"],r=a.editable||a.addable?u("div",{class:[b.e("new-tab"),p.value&&b.e("new-tab-vertical")],tabindex:"0",onClick:v,onKeydown:c=>{c.code===ae.enter&&v()}},[l?be(h,"add-icon"):u(te,{class:b.is("icon-plus")},{default:()=>[u(Qe,null,null)]})]):null,d=u("div",{class:[b.e("header"),p.value&&b.e("header-vertical"),b.is(a.tabPosition)]},[u(V,{render:()=>{const c=t.value.some(E=>E.slots.label);return u(gt,{ref:f,currentName:k.value,editable:a.editable,type:a.type,panes:t.value,stretch:a.stretch,onTabClick:g,onTabRemove:C},{$stable:!c})}},null),r]),B=u("div",{class:b.e("content")},[be(h,"default")]);return u("div",{class:[b.b(),b.m(a.tabPosition),{[b.m("card")]:a.type==="card",[b.m("border-card")]:a.type==="border-card"}]},[B,d])}}}),wt=le({label:{type:String,default:""},name:{type:[String,Number]},closable:Boolean,disabled:Boolean,lazy:Boolean}),Le="ElTabPane",$t=M({name:Le}),Ct=M({...$t,props:wt,setup(a){const e=a,h=ge(),w=et(),o=me(re);o||_e(Le,"usage: <el-tabs><el-tab-pane /></el-tabs/>");const b=oe("tab-pane"),p=R(),t=J(()=>e.closable||o.props.closable),n=Pe(()=>{var g;return o.currentName.value===((g=e.name)!=null?g:p.value)}),_=R(n.value),f=J(()=>{var g;return(g=e.name)!=null?g:p.value}),k=Pe(()=>!e.lazy||_.value||n.value);Q(n,g=>{g&&(_.value=!0)});const $=Se({uid:h.uid,slots:w,props:e,paneName:f,active:n,index:p,isClosable:t});return o.registerPane($),ye(()=>{o.sortPane($)}),Oe(()=>{o.unregisterPane($.uid)}),(g,C)=>s(k)?Z((i(),N("div",{key:0,id:`pane-${s(f)}`,class:Be(s(b).b()),role:"tabpanel","aria-hidden":!s(n),"aria-labelledby":`tab-${s(f)}`},[be(g.$slots,"default")],10,["id","aria-hidden","aria-labelledby"])),[[tt,s(n)]]):Y("v-if",!0)}});var Ae=De(Ct,[["__file","tab-pane.vue"]]);const xt=at(kt,{TabPane:Ae}),Pt=nt(Ae),Tt={class:"content"},Nt={key:0,class:"info"},Bt={key:0},Dt={key:1},Et={key:2},St={class:"btns","element-loading-text":"安装中"},Ot=M({__name:"InstallDep",setup(a){he(l=>({cdb9359e:s(t)}));const e=R([]),h=st(),{app:w,ocr:o}=lt(h),b=R(),{allLibsName:p}=$e(),t=R("auto"),n=Se({success:0,fail:0,failLabel:[],installed:!1,loading:!1});let _;const f=l=>{const r=l.payload;Array.isArray(r)&&$(r)};ye(async()=>{_=await ot.listen("tauri://file-drop",f),await ie();const{height:l}=b.value.getBoundingClientRect();t.value=`${l}px`}),Oe(()=>{_()});const k=()=>{e.value=[]},$=async l=>{if(l||(l=await it.selectFile(!0)),l){const r=e.value.map(c=>c.path),d=[...new Set([...r,...l])].map(c=>({path:c,label:c.split("\\")[c.split("\\").length-1]})).filter(c=>p.value.find(S=>S.split("->").find(x=>x.includes(c.label))));if(e.value.length+l.length!==d.length&&F({title:"提示",message:"所选的部分依赖已在列表中或者无效，已自动过滤",type:"warning",position:"bottom-right"}),d.find(c=>c.label.includes("base_dep_pkg.7z"))){const c=d.find(E=>E.label.includes("simple_dep_pkg.7z"));c&&(d.splice(d.indexOf(c),1),F({title:"提示",message:"已选择普通版依赖包，已将精简版依赖包移除。",type:"info",position:"bottom-right"}))}e.value=d,await C(d)&&F({title:"提示",message:"当前为完整版，如果继续安装基础版依赖包，将会把OCR运行方式设置为基础版(CPU)。",type:"warning",position:"bottom-right"})}},g=l=>{e.value=e.value.filter(r=>r.path!==l)},C=async l=>w.value.dependenceState==="完整版"?!!l.find(d=>d.label.includes("base_dep_pkg.7z")):!1,v=async(l=!1)=>{n.loading=!0;const r=[];n.success=0,n.fail=0,n.failLabel=[];const d=e.value.slice(0),B=await C(d);for(let E=0;E<d.length;E++){const S=e.value.pop();S&&(await X.installDep(S,!1,B,o.value.value)?n.success++:(r.push(S.label),n.fail++))}n.failLabel=r,n.installed=!0,B&&!r.includes("base_dep_pkg.7z")&&o.value.value==="GPU"&&(o.value.value="CPU",F({title:"提示",message:"由于在完整版上安装了基础版依赖包，为了避免出错，已将OCR运行方式设置为基础版(CPU)。",type:"info",position:"bottom-right"})),F({title:"提示",message:"安装完成",type:"success",position:"bottom-right"}),await X.checkDepUpdate(),n.loading=!1,l&&ut();const c=setTimeout(()=>{n.installed=!1,clearTimeout(c)},1e4)},V=async()=>{let l=!1;const r=e.value.find(d=>d.path.includes("screenOperation.dll"));r&&await X.libExists("screenOperation.dll")&&(l=!0),l?rt.confirm("检测到存在文件更新后需要重启才能生效，是否继续？","提示",{confirmButtonText:"继续",cancelButtonText:"取消",type:"warning"}).then(async()=>{await X.pushUpdateDep(r.path),await v(!0)}):await v()};return(l,r)=>{const d=ke,B=Ce,c=we,E=ze;return i(),N("div",{class:"install-dep",ref_key:"contentRef",ref:b},[K("div",Tt,[!s(e).length&&s(n).installed?(i(),N("div",Nt,[K("div",null,[r[1]||(r[1]=D(" 安装成功：")),u(d,{size:"small"},{default:P(()=>[D(I(s(n).success),1)]),_:1})]),K("div",null,[r[2]||(r[2]=D(" 安装失败：")),u(d,{type:"danger",size:"small"},{default:P(()=>[D(I(s(n).fail),1)]),_:1})]),s(n).failLabel.length?(i(),N("div",Bt,"安装失败的依赖名：")):Y("",!0),(i(!0),N(G,null,H(s(n).failLabel,S=>(i(),T(d,{key:S,type:"info"},{default:P(()=>[D(I(S),1)]),_:2},1024))),128))])):!s(e).length&&!s(n).installed?(i(),N("div",Dt,[u(B,{description:"暂无安装任务,可点击右边按钮或者将文件拖入此处进行安装"})])):Y("",!0),s(e).length?(i(),N("div",Et,"安装任务队列：")):Y("",!0),(i(!0),N(G,null,H(s(e),S=>(i(),T(d,{key:S.path,class:"dep-tag",closable:"",type:"info",onClose:y=>g(S.path)},{default:P(()=>[D(I(S.label),1)]),_:2},1032,["onClose"]))),128))]),Z((i(),N("div",St,[s(e).length?(i(),T(c,{key:0,class:"clear-btn",onClick:k},{default:P(()=>r[3]||(r[3]=[D("清空列表")])),_:1})):Y("",!0),u(c,{class:"select-btn",onClick:r[0]||(r[0]=S=>$())},{default:P(()=>r[4]||(r[4]=[D("选择本地依赖文件")])),_:1}),u(c,{class:"install-btn",onClick:V,type:"primary",disabled:!s(e).length},{default:P(()=>[D("安装"+I(s(e).length?`(${s(e).length})`:""),1)]),_:1},8,["disabled"])])),[[E,s(n).loading]])],512)}}}),Rt=ee(Ot,[["__scopeId","data-v-f3bf06e7"]]),zt={class:"dep-pkg-item"},Vt={class:"header"},Lt={class:"desc"},At=M({__name:"DepPkgItem",props:{item:{type:Object,required:!0},currentVersion:{type:String,default:""}},setup(a){he(p=>({"3fb7bda6":s(h),"68f9f7ba":s(w)}));const e=a,{appAsideBgColor:h,appBackground:w}=Re(),o=J(()=>!!e.item.download_url.find(p=>p.origin==="阿里云盘")),b=async p=>{if(p===1){const t=e.item.download_url.find(n=>n.origin.includes("移动云盘"));t?(await ne("open_in_default_browser",{url:t.url}),t.pwd&&(se(t.pwd),F({title:"提示",message:"移动云盘提取码已复制到剪切板",type:"success",position:"bottom-right"}))):F({title:"提示",message:"未找到移动云盘下载链接",type:"error",position:"bottom-right"})}else{const t=e.item.download_url.find(n=>n.origin.includes("阿里云盘"));t?(await ne("open_in_default_browser",{url:t.url}),t.pwd&&(se(t.pwd),F({title:"提示",message:"阿里云盘提取码已复制到剪切板",type:"success",position:"bottom-right"}))):F({title:"提示",message:"未找到阿里云盘下载链接",type:"error",position:"bottom-right"})}};return(p,t)=>{const n=ke,_=we;return i(),N("div",zt,[K("div",Vt,[K("div",null,[D(I(a.item.name)+" ",1),u(n,{size:"small"},{default:P(()=>[D(I(a.item.version),1)]),_:1}),K("span",Lt,I(a.item.desc),1)]),K("div",null,[s(o)?(i(),T(_,{key:0,size:"small",onClick:t[0]||(t[0]=f=>b(2))},{default:P(()=>t[2]||(t[2]=[D("阿里云盘下载")])),_:1})):Y("",!0),u(_,{size:"small",onClick:t[1]||(t[1]=f=>b(1))},{default:P(()=>t[3]||(t[3]=[D("移动云盘下载")])),_:1})])]),K("div",null,[(i(!0),N(G,null,H(a.item.child_files,f=>(i(),T(n,{type:"info",key:f},{default:P(()=>[D(I(f),1)]),_:2},1024))),128))])])}}}),It=ee(At,[["__scopeId","data-v-c0e62280"]]),Ut={key:0,class:"dep-pkg-list"},Ft=M({__name:"DepPkgDownload",setup(a){const{depPkgList:e}=$e();return(h,w)=>{const o=It,b=Ce;return s(e).length?(i(),N("div",Ut,[(i(!0),N(G,null,H(s(e),p=>(i(),T(o,{key:p.name,item:p},null,8,["item"]))),128))])):(i(),T(b,{key:1,description:"暂无依赖包"}))}}}),Mt=ee(Ft,[["__scopeId","data-v-042cebc9"]]),qt={class:"lack-dep-item"},Kt={key:0},Yt={key:1},jt=M({__name:"LackItem",props:{item:{type:Object,required:!0},currentVersion:{type:String,default:""}},setup(a){he(p=>({25807507:s(h),"648065ee":s(w)}));const e=a,{appAsideBgColor:h,appBackground:w}=Re(),o=J(()=>!!e.item.download_url.find(p=>p.origin==="阿里云盘")),b=async p=>{if(p===1){const t=e.item.download_url.find(n=>n.origin.includes("移动云盘"));t?(await ne("open_in_default_browser",{url:t.url}),t.pwd&&(se(t.pwd),F({title:"提示",message:"移动云盘提取码已复制到剪切板",type:"success",position:"bottom-right"}))):F({title:"提示",message:"未找到移动云盘下载链接",type:"error",position:"bottom-right"})}else{const t=e.item.download_url.find(n=>n.origin.includes("阿里云盘"));t?(await ne("open_in_default_browser",{url:t.url}),t.pwd&&(se(t.pwd),F({title:"提示",message:"阿里云盘提取码已复制到剪切板",type:"success",position:"bottom-right"}))):F({title:"提示",message:"未找到阿里云盘下载链接",type:"error",position:"bottom-right"})}};return(p,t)=>{const n=ke,_=we;return i(),N("div",qt,[a.item.currentVersion?(i(),N("div",Kt,[D(I(a.item.name)+" ",1),u(n,{type:"info",size:"small"},{default:P(()=>[D(I(a.item.currentVersion)+"->"+I(a.item.version),1)]),_:1})])):(i(),N("div",Yt,[D(I(a.item.name)+" ",1),u(n,{type:"info",size:"small"},{default:P(()=>[D(I(a.item.version),1)]),_:1})])),K("div",null,[s(o)?(i(),T(_,{key:0,size:"small",onClick:t[0]||(t[0]=f=>b(2))},{default:P(()=>t[2]||(t[2]=[D("阿里云盘下载")])),_:1})):Y("",!0),u(_,{size:"small",onClick:t[1]||(t[1]=f=>b(1))},{default:P(()=>t[3]||(t[3]=[D("移动云盘下载")])),_:1})])])}}}),Gt=ee(jt,[["__scopeId","data-v-caea571e"]]),Ht={class:"dep-manager"},Wt=M({__name:"DepManager",setup(a){const{lackDependence:e,activeDrewerName:h,needUpdateDepList:w,contentLoading:o}=$e(),b=async p=>{p!=="install"&&(o.value=!0,await X.checkDepUpdate(),o.value=!1)};return(p,t)=>{const n=Gt,_=Ce,f=Pt,k=xt,$=Mt,g=Rt,C=ze;return i(),N("div",Ht,[u(k,{modelValue:s(h),"onUpdate:modelValue":t[0]||(t[0]=v=>ct(h)?h.value=v:null),class:"tabs",onTabChange:b,"tab-position":"top"},{default:P(()=>[Z((i(),T(f,{label:"缺失依赖下载",name:"lackDepDownload"},{default:P(()=>{var v,V,l;return[s(e)&&((v=s(e)[0])!=null&&v.length||(V=s(e)[1])!=null&&V.length||(l=s(e)[2])!=null&&l.length)?(i(),T(k,{key:0,"tab-position":"left"},{default:P(()=>{var r,d,B;return[u(f,{label:`精简版(${((r=s(e)[0])==null?void 0:r.length)||0})`},{default:P(()=>[s(e)[0].length?(i(!0),N(G,{key:0},H(s(e)[0],c=>(i(),T(n,{key:0+c.name,item:c},null,8,["item"]))),128)):(i(),T(_,{key:1,description:"依赖满足精简版要求，没有缺失依赖项。"}))]),_:1},8,["label"]),u(f,{label:`基础版(${((d=s(e)[1])==null?void 0:d.length)||0})`},{default:P(()=>[s(e)[1].length?(i(!0),N(G,{key:0},H(s(e)[1],c=>(i(),T(n,{key:1+c.name,item:c},null,8,["item"]))),128)):(i(),T(_,{key:1,description:"依赖满足基础版要求，没有缺失依赖项。"}))]),_:1},8,["label"]),u(f,{label:`完整版(${((B=s(e)[2])==null?void 0:B.length)||0})`},{default:P(()=>[s(e)[2].length?(i(!0),N(G,{key:0},H(s(e)[2],c=>(i(),T(n,{key:2+c.name,item:c},null,8,["item"]))),128)):(i(),T(_,{key:1,description:"依赖满足完整版要求，没有缺失依赖项。"}))]),_:1},8,["label"])]}),_:1})):(i(),T(_,{key:1,description:"没有缺失依赖项。"}))]}),_:1})),[[C,s(o)]]),u(f,{label:"依赖包下载",name:"depPackageDownload"},{default:P(()=>[s(h)==="depPackageDownload"?Z((i(),T($,{key:0},null,512)),[[C,s(o)]]):Y("",!0)]),_:1}),Z((i(),T(f,{label:"可更新依赖",name:"haveUpdateDep"},{default:P(()=>[s(w).length?(i(!0),N(G,{key:0},H(s(w),v=>(i(),T(n,{key:v.name,item:v,currentVersion:v.currentVersion},null,8,["item","currentVersion"]))),128)):(i(),T(_,{key:1,description:"暂无依赖需要更新，所有依赖皆为最新版。"}))]),_:1})),[[C,s(o)]]),u(f,{label:"依赖安装",name:"install"},{default:P(()=>[s(h)==="install"?(i(),T(g,{key:0})):Y("",!0)]),_:1})]),_:1},8,["modelValue"])])}}}),ea=ee(Wt,[["__scopeId","data-v-9166c38d"]]);export{ea as default};