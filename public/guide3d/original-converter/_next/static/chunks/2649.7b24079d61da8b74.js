"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2649,3120],{58109:function(e,t,n){n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375);let s=a.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...c},d){let u=a.useRef(null),f=a.useRef(null),h=new o._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=u.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(h),e.getWorldQuaternion(u.current.quaternion).premultiply(h.invert()),n&&(u.current.rotation.x=i.x),s&&(u.current.rotation.y=i.y),l&&(u.current.rotation.z=i.z)}),a.useImperativeHandle(d,()=>f.current,[]),a.createElement("group",(0,i.Z)({ref:f},c),a.createElement("group",{ref:u},e))})},81125:function(e,t,n){n.d(t,{q:function(){return y}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375),s=n(30535),l=Object.defineProperty,c=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,d=(e,t,n)=>(c(e,"symbol"!=typeof t?t+"":t,n),n);let u=new o.USm(0,0,0,"YXZ"),f=new o.Pa4,h={type:"change"},m={type:"lock"},p={type:"unlock"},v=Math.PI/2;class g extends s.p{constructor(e,t){super(),d(this,"camera"),d(this,"domElement"),d(this,"isLocked"),d(this,"minPolarAngle"),d(this,"maxPolarAngle"),d(this,"pointerSpeed"),d(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(u.setFromQuaternion(this.camera.quaternion),u.y-=.002*e.movementX*this.pointerSpeed,u.x-=.002*e.movementY*this.pointerSpeed,u.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,u.x)),this.camera.quaternion.setFromEuler(u),this.dispatchEvent(h))}),d(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(m),this.isLocked=!0):(this.dispatchEvent(p),this.isLocked=!1))}),d(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),d(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),d(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),d(this,"dispose",()=>{this.disconnect()}),d(this,"getObject",()=>this.camera),d(this,"direction",new o.Pa4(0,0,-1)),d(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),d(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),d(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),d(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),d(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let y=a.forwardRef(({domElement:e,selector:t,onChange:n,onLock:o,onUnlock:s,enabled:l=!0,makeDefault:c,...d},u)=>{let{camera:f,...h}=d,m=(0,r.D)(e=>e.setEvents),p=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),y=(0,r.D)(e=>e.invalidate),x=(0,r.D)(e=>e.events),b=(0,r.D)(e=>e.get),w=(0,r.D)(e=>e.set),S=f||v,E=e||x.connected||p.domElement,_=a.useMemo(()=>new g(S),[S]);return a.useEffect(()=>{if(l){_.connect(E);let e=b().events.compute;return m({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{_.disconnect(),m({compute:e})}}},[l,_]),a.useEffect(()=>{let e=e=>{y(),n&&n(e)};_.addEventListener("change",e),o&&_.addEventListener("lock",o),s&&_.addEventListener("unlock",s);let i=()=>_.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{_.removeEventListener("change",e),o&&_.removeEventListener("lock",o),s&&_.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,o,s,t,_,y]),a.useEffect(()=>{if(c){let e=b().controls;return w({controls:_}),()=>w({controls:e})}},[c,_]),a.createElement("primitive",(0,i.Z)({ref:u,object:_},h))})},73420:function(e,t,n){n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),a=n(75575);let o=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),c=i.useMemo(()=>(0,r.U)((0,a.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),d=i.useMemo(()=>[c.subscribe,c.getState,c],[l]),u=c.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{u({[e]:t}),n&&n(e,t,d[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:a,up:o}=i;i.pressed=!0,(o||!a)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:a}=i;i.pressed=!1,a&&r(!1)},a=s||window;return a.addEventListener("keydown",i,{passive:!0}),a.addEventListener("keyup",r,{passive:!0}),()=>{a.removeEventListener("keydown",i),a.removeEventListener("keyup",r)}},[s,l]),i.createElement(o.Provider,{value:d,children:t})}function l(e){let[t,n,r]=i.useContext(o);return e?r(e):[t,n]}},12318:function(e,t,n){n.d(t,{E:function(){return u}});var i=n(97458),r=n(52983),a=n(62978),o=n.n(a),s=n(71525),l=n(62401),c=n(14692);let d={xs:20,sm:32,lg:40},u=r.forwardRef((e,t)=>{var n;let{onClick:r,icon:a,iconName:u,tooltipText:f,text:h,variant:m="tertiary",disabled:p=!1,loading:v=!1,size:g="lg",to:y,active:x,bare:b=!1,"aria-label":w="tool",...S}=e,E=d[g];return(0,i.jsx)(s.u,{placement:"top",label:f,borderRadius:"md",children:(0,i.jsx)(l.h,{...S,ref:t,as:y&&!p?o():"button",...y&&!p&&{href:null==y?void 0:y.href,target:null!==(n=null==y?void 0:y.target)&&void 0!==n?n:"_self"},width:"".concat(E,"px"),height:"".concat(E,"px"),minWidth:"".concat(E,"px"),icon:null!=a?a:(0,i.jsx)(c.J,{name:u,fallbackText:h,height:"".concat(E-("xs"!==g?16:4),"px"),width:"".concat(E-("xs"!==g?16:4),"px")}),"aria-label":w,padding:"1",onClick:r,isDisabled:p,isLoading:v,bg:x?void 0:b?"transparent":"bg.surface",borderColor:x?void 0:b?"transparent":"ghost"===m?"border.default":"border.dark",borderWidth:x?void 0:b?"0":"1px",borderStyle:"solid",_hover:{bg:x?void 0:"bg.hover"},sx:{color:x?"icon.active !important":"icon.default !important"},...x?{colorScheme:"teal"}:{}})})})},53632:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{QL:function(){return k},T1:function(){return b},Zd:function(){return y},gH:function(){return v},i9:function(){return x},wN:function(){return z}});var r=n(98750),a=n(72311),o=n(87617),s=n(29826);n(23633);var l=e([s]);s=(l.then?(await l)():l)[0];let c=[r.mQ.NORTH,r.mQ.EAST,r.mQ.SOUTH,r.mQ.WEST],d=[r.mQ.NORTH,r.mQ.EAST,r.mQ.SOUTH,r.mQ.WEST,r.mQ.UP,r.mQ.DOWN],u=[r.FQ.BOTTOM,r.FQ.TOP],f=["y","x","z"],h=[0,1],m=/(?:_log|_wood|_stem|_hyphae|_pillar|basalt|bone_block)$/,p=new Set(["piston","sticky_piston","dispenser","dropper","observer"]),v=e=>{var t,n;if(!e)return null;let i=null!==(t=e.name)&&void 0!==t?t:"",r=null!==(n=e.displayName)&&void 0!==n?n:"";return r.includes("Stairs")?"stair":!r.includes("Slab")||i.includes("double_slab")||i.includes("waxed_")?r.includes("Trapdoor")?"trapdoor":r.includes("Door")?"door":r.includes("Bed")&&i.endsWith("_bed")?"bed":m.test(i)?"log":p.has(i)?"piston":i.endsWith("_sign")||i.endsWith("_wall_sign")?"sign":null:"slab"},g=e=>{switch(e){case"stair":return[{name:"facing",values:c},{name:"half",values:u}];case"slab":return[{name:"half",values:u}];case"trapdoor":return[{name:"facing",values:c},{name:"open",values:h},{name:"half",values:u}];case"door":return[{name:"facing",values:c},{name:"open",values:h}];case"bed":case"sign":return[{name:"facing",values:c}];case"log":return[{name:"axis",values:f}];case"piston":return[{name:"facing",values:d}];default:return[]}},y=e=>{let t={};for(let n of g(e))t[n.name]=n.values[0];return t},x=(e,t,n)=>{let i=g(e);if(0===i.length)return t;let r={...t},a=n;for(let e of i){if(0===a)break;let n=e.values,i=t[e.name],o=n.findIndex(e=>e===i),s=o>=0?o:0,l=(s+a+n.length)%n.length;r[e.name]=n[l],a=1===a&&s===n.length-1||-1===a&&0===s?a:0}return r},b=e=>w(e),w=e=>{switch(e){case"stair":return r.bF.STAIR;case"slab":return r.bF.SLAB;case"trapdoor":return r.bF.TRAPDOOR;default:return r.bF.FULL}},S=e=>e===r.mQ.EAST?1:e===r.mQ.WEST?-1:0,E=e=>e===r.mQ.SOUTH?1:e===r.mQ.NORTH?-1:0,_=e=>"x"===e?{x:1,y:0,z:0}:"z"===e?{x:0,y:0,z:1}:{x:0,y:0,z:0},k=(a.b.Stone,(e,t,n,i,a)=>{var o,l,c,d,u,f;let h=w(i),[m,p,v]=t,g=null!==(o=a.aliasIndex)&&void 0!==o?o:0,y=null!==(l=a.aliasFlavor)&&void 0!==l?l:0,x=null!==(c=a.entityId)&&void 0!==c?c:0;a.defaultBlockId;let b=null!==(d=n.facing)&&void 0!==d?d:r.mQ.NORTH,k=null!==(u=n.half)&&void 0!==u?u:r.FQ.BOTTOM,L=null!==(f=n.open)&&void 0!==f?f:0,{x:z,y:M,z:D}=_(n.axis);if("bed"===i){let t=S(b),n=E(b),i=s.g.generateVoxelData(m,p,v,0,0,0,b,h,r.FQ.BOTTOM,0,e.id,a.gid,a.mid,g,y,x),o=s.g.generateVoxelData(m+t,p,v+n,0,0,0,b,h,r.FQ.BOTTOM,1,e.id,a.gid,a.mid,g,y,x);return[i,o]}if("door"===i){let t=L?S(b):0,n=L?E(b):0,i=s.g.generateVoxelData(m,p,v,t,0,n,b,h,r.FQ.BOTTOM,L,e.id,a.gid,a.mid,g,y,x),o=s.g.generateVoxelData(m,p+1,v,t,0,n,b,h,r.FQ.TOP,L,e.id,a.gid,a.mid,g,y,x);return[i,o]}let T=n.axis?z:L?S(b):0,A=n.axis?D:L?E(b):0,U=n.axis?M:0;return[s.g.generateVoxelData(m,p,v,T,U,A,b,h,k,L,e.id,a.gid,a.mid,g,y,x)]}),L=[],z=(e,t)=>{let n=e[9],i=o.JH[String(n)];if(!i)return null;let a=v(i);if(!a)return null;let[,,,l,,c,d]=s.g.unpackVoxelMetadata(e[3],L),u={};for(let e of g(a))switch(e.name){case"facing":u.facing=l;break;case"half":u.half=c;break;case"open":u.open=1===d?1:0;break;case"axis":{let[e,t,n]=L;u.axis=0!==e?"x":0!==n?"z":"y"}}let f=[...t];return"door"===a&&c===r.FQ.TOP&&(f=[t[0],t[1]-1,t[2]]),"bed"===a&&1===d&&(f=[t[0]-S(l),t[1],t[2]-E(l)]),{kind:a,block:i,state:u,origin:f}};i()}catch(e){i(e)}})},88574:function(e,t,n){n.d(t,{T:function(){return o}});var i=n(97458),r=n(52983),a=n(3347);let o=e=>{let{rgba:t,onBlur:n}=e,[o,s]=(0,r.useState)(t),l="#"+t.slice(0,3).map(e=>255*e).map(e=>Math.round(e).toString(16).padStart(2,"0")).join(""),c=e=>{s([parseInt(e.substr(1,2),16)/255,parseInt(e.substr(3,2),16)/255,parseInt(e.substr(5,2),16)/255,1])};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(a.I,{type:"color",width:"100%",height:"64px",p:0,value:l,onChange:e=>c(e.currentTarget.value),onBlur:()=>{n(o)}})})}},23633:function(e,t,n){n.d(t,{n:function(){return a}});let i=new Set,r=new Uint32Array(2),a=()=>{let e;do globalThis.crypto.getRandomValues(r),e=-((2097151&r[0])*4294967296+r[1]);while(0===e||i.has(e));return i.add(e),e}},37794:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{m:function(){return c}});var r=n(52983),a=n(3529),o=n(38316),s=n(59467),l=e([s]);function c(){let[e,t]=(0,r.useState)(null),[n,i]=(0,r.useState)(null),[l,c]=(0,r.useState)(0),[d,u]=(0,r.useState)([]),[f,h]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=!1;return(async()=>{try{let r=await (0,o.o5)();if(e)return;if(r){var n;t(r.fileName),u(null!==(n=r.modBlocks)&&void 0!==n?n:[]),r.colorOverrides&&((0,s.E1)(r.colorOverrides),c(r.colorOverrides.size));let l=await a.dataManager.getModAssetData(o.VI);!e&&l&&i(l)}}catch(e){}finally{e||h(!1)}})(),()=>{e=!0}},[]);let m=(0,r.useCallback)(async e=>{var n;await (0,o.bh)(e.fileName,e.atlas,e.colorOverrides,e.modBlocks,null!==(n=e.wasBedrock)&&void 0!==n&&n),e.assetRecord&&await a.dataManager.addModAssetData({...e.assetRecord,id:o.VI}),(0,s.E1)(e.colorOverrides),t(e.fileName),i(e.assetRecord?{...e.assetRecord,id:o.VI}:null),c(e.colorOverrides.size),u(e.modBlocks)},[]),p=(0,r.useCallback)(async()=>{(0,s.Id)(),await (0,o.FJ)(),await a.dataManager.clearModAssetData(o.VI),t(null),i(null),c(0),u([])},[]);return(0,r.useMemo)(()=>({fileName:e,assetRecord:n,colorOverrideCount:l,modBlocks:d,isLoading:f,save:m,clear:p}),[e,n,l,d,f,m,p])}s=(l.then?(await l)():l)[0],i()}catch(e){i(e)}})},39878:function(e,t,n){n.d(t,{eY:function(){return c},ke:function(){return l}});var i=n(35075);let r=i.T4*i.TD,a=i.df*i.TD,o=(e,t)=>{if("undefined"!=typeof document){let n=document.createElement("canvas");return n.width=e,n.height=t,n}return"undefined"!=typeof OffscreenCanvas?new OffscreenCanvas(e,t):null};function s(){let e=new Uint8ClampedArray(r*a*4);for(let t=i.sO;t<=i.oB;t+=1){let n=(0,i.t2)(t);if(!n)continue;let{column:a,row:o}=(0,i.Me)(t),s=a*i.TD,l=o*i.TD;for(let t=0;t<Math.min(n.length,i.TD);t+=1){let a=n[t];for(let n=0;n<Math.min(a.length,i.TD);n+=1){if("#"!==a[n])continue;let i=((l+t)*r+s+n)*4;e[i]=255,e[i+1]=255,e[i+2]=255,e[i+3]=255}}}return e}function l(){let e=o(r,a);if(!e)return null;let t=e.getContext("2d");if(!t)return null;let n=t.createImageData(r,a);return n.data.set(s()),t.putImageData(n,0,0),e}function c(){return{imageData:s(),width:r,height:a}}},69:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{W:function(){return e}});var r=n(65753),a=n(29068);let e=e=>{if("string"!=typeof e||0===e.length)return;let t=(0,a.IX)(e),n=(0,r.U)("string"==typeof(null==t?void 0:t.name)&&t.name.length?t.name:e.split("[")[0]),i=null==t?void 0:t.state;if(!i||"object"!=typeof i)return n;let o=Object.entries(i).filter(e=>{let[t]=e;return!function(e){let t=String(null!=e?e:"").toLowerCase();return!!t&&!!("__entity"===t||"_entity"===t||"nbt"===t||"_nbt"===t||"__nbt"===t||"material"===t||"_material"===t||"__material"===t||(t.startsWith("_")||t.startsWith("__"))&&t.endsWith("nbt")||(t.startsWith("_")||t.startsWith("__"))&&t.endsWith("material"))}(t)}).map(e=>{let[t,n]=e,i=Array.isArray(n)?n[0]:n;return[t,i]}).filter(e=>{let[,t]=e;return null!=t&&String(t).length>0}).sort((e,t)=>{let[n]=e,[i]=t;return n.localeCompare(i)});return 0===o.length?n:"".concat(n,"[").concat(o.map(e=>{let[t,n]=e;return"".concat(t,"=").concat(String(n))}).join(","),"]")};i()}catch(e){i(e)}})},20112:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{modelProcessingBlocks:function(){return r.Cf}});var r=n(99753),a=e([r]);r=(a.then?(await a)():a)[0],i()}catch(e){i(e)}})},59467:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{E1:function(){return a},Id:function(){return o}});var r=n(87617);let e=null;function a(t){if(!e)for(let t of(e=new Map,r.k2))t.rgba&&e.set(t.id,{...t.rgba});for(let[e,n]of t){let t=r.JH[e];t&&(t.rgba=n)}}function o(){if(e){for(let[t,n]of e){let e=r.JH[t];e&&(e.rgba=n)}e=null}}i()}catch(e){i(e)}})},1553:function(e,t,n){n.d(t,{GLTFParser:function(){return i.xY}}),n(29389),n(72633);var i=n(22608);n(34591)},99753:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{Cf:function(){return u}});var r=n(87617),a=n(31322),o=n(69773),s=n(1553),l=n(83589),c=n(80591),d=e([l,c,a]);[l,c,a]=d.then?(await d)():d;let u=r.k2.filter(e=>(0,l.y)(e));new c.i({blocks:u,blockById:r.JH,javaAliases:a.Q.java,concreteBlockIdIndexes:o.o,sampleTextureColor:(e,t,n)=>s.GLTFParser.getColorFromUV(e,{data:t,...n}),blockFilter:l.y}),i()}catch(e){i(e)}})},67844:function(e,t,n){n.d(t,{X:function(){return w}});var i=n(52983),r=n(20879),a=n(25610),o=n(97458);function s(e){return(0,o.jsx)(a.m.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...e,children:(0,o.jsx)("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function l(e){return(0,o.jsx)(a.m.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...e,children:(0,o.jsx)("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function c(e){let{isIndeterminate:t,isChecked:n,...i}=e;return n||t?(0,o.jsx)(a.m.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:(0,o.jsx)(t?l:s,{...i})}):null}var d=n(78486),u=n(19938),f=n(10915),h=n(26398),m=n(15627),p=n(42089),v={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},g={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},y=(0,f.F4)({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),x=(0,f.F4)({from:{opacity:0},to:{opacity:1}}),b=(0,f.F4)({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),w=(0,h.G)(function(e,t){let n=(0,r.J)(),s={...n,...e},l=(0,m.jC)("Checkbox",s),f=(0,p.Lr)(e),{spacing:h="0.5rem",className:w,children:S,iconColor:E,iconSize:_,icon:k=(0,o.jsx)(c,{}),isChecked:L,isDisabled:z=null==n?void 0:n.isDisabled,onChange:M,inputProps:D,...T}=f,A=L;(null==n?void 0:n.value)&&f.value&&(A=n.value.includes(f.value));let U=M;(null==n?void 0:n.onChange)&&f.value&&(U=(0,u.PP)(n.onChange,M));let{state:O,getInputProps:C,getCheckboxProps:P,getLabelProps:B,getRootProps:j}=(0,d.O)({...T,isDisabled:z,isChecked:A,onChange:U}),I=function(e){let[t,n]=(0,i.useState)(e),[r,a]=(0,i.useState)(!1);return e!==t&&(a(!0),n(e)),r}(O.isChecked),F=(0,i.useMemo)(()=>({animation:I?O.isIndeterminate?`${x} 20ms linear, ${b} 200ms linear`:`${y} 200ms linear`:void 0,fontSize:_,color:E,...l.icon}),[E,_,I,O.isIndeterminate,l.icon]),R=(0,i.cloneElement)(k,{__css:F,isIndeterminate:O.isIndeterminate,isChecked:O.isChecked});return(0,o.jsxs)(a.m.label,{__css:{...g,...l.container},className:(0,u.cx)("chakra-checkbox",w),...j(),children:[(0,o.jsx)("input",{className:"chakra-checkbox__input",...C(D,t)}),(0,o.jsx)(a.m.span,{__css:{...v,...l.control},className:"chakra-checkbox__control",...P(),children:R}),S&&(0,o.jsx)(a.m.span,{className:"chakra-checkbox__label",...B(),__css:{marginStart:h,...l.label},children:S})]})});w.displayName="Checkbox"},20879:function(e,t,n){n.d(t,{J:function(){return r},z:function(){return i}});var[i,r]=(0,n(96248).k)({name:"CheckboxGroupContext",strict:!1})},45276:function(e,t,n){n.d(t,{C:function(){return c}});var i=n(26398),r=n(15627),a=n(42089),o=n(25610),s=n(19938),l=n(97458),c=(0,i.G)(function(e,t){let n=(0,r.mq)("Badge",e),{className:i,...c}=(0,a.Lr)(e);return(0,l.jsx)(o.m.span,{ref:t,className:(0,s.cx)("chakra-badge",e.className),...c,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...n}})});c.displayName="Badge"},40393:function(e,t,n){n.d(t,{Lj:function(){return i},Sh:function(){return o},js:function(){return a},p$:function(){return s}});var i={ease:[.25,.1,.25,1],easeIn:[.4,0,1,1],easeOut:[0,0,.2,1],easeInOut:[.4,0,.2,1]},r={slideLeft:{position:{left:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"-100%",y:0}},slideRight:{position:{right:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"100%",y:0}},slideUp:{position:{top:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"-100%"}},slideDown:{position:{bottom:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"100%"}}};function a(e){var t;switch(null!=(t=null==e?void 0:e.direction)?t:"right"){case"right":default:return r.slideRight;case"left":return r.slideLeft;case"bottom":return r.slideDown;case"top":return r.slideUp}}var o={enter:{duration:.2,ease:i.easeOut},exit:{duration:.1,ease:i.easeIn}},s={enter:(e,t)=>({...e,delay:"number"==typeof t?t:null==t?void 0:t.enter}),exit:(e,t)=>({...e,delay:"number"==typeof t?t:null==t?void 0:t.exit})}},1848:function(e,t,n){n.d(t,{U:function(){return f}});var i=n(40393),r=n(19938),a=n(44659),o=n(39267),s=n(52983),l=n(97458),c=e=>null!=e&&parseInt(e.toString(),10)>0,d={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},u={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:r,delay:a})=>{var o;return{...e&&{opacity:c(t)?1:0},height:t,transitionEnd:null==r?void 0:r.exit,transition:null!=(o=null==n?void 0:n.exit)?o:i.p$.exit(d.exit,a)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:r,delay:a})=>{var o;return{...e&&{opacity:1},height:t,transitionEnd:null==r?void 0:r.enter,transition:null!=(o=null==n?void 0:n.enter)?o:i.p$.enter(d.enter,a)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:i,animateOpacity:c=!0,startingHeight:d=0,endingHeight:f="auto",style:h,className:m,transition:p,transitionEnd:v,...g}=e,[y,x]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{x(!0)});return()=>clearTimeout(e)},[]),(0,r.ZK)({condition:Number(d)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let b=parseFloat(d.toString())>0,w={startingHeight:d,endingHeight:f,animateOpacity:c,transition:y?p:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:i?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:b?"block":"none"}}},S=!i||n,E=n||i?"enter":"exit";return(0,l.jsx)(a.M,{initial:!1,custom:w,children:S&&(0,l.jsx)(o.E.div,{ref:t,...g,className:(0,r.cx)("chakra-collapse",m),style:{overflow:"hidden",display:"block",...h},custom:w,variants:u,initial:!!i&&"exit",animate:E,exit:"exit"})})});f.displayName="Collapse"},4248:function(e,t,n){n.d(t,{i:function(){return i}});let i=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){n.d(t,{Y:function(){return a}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class a extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){let i,r;n.d(t,{w:function(){return S}});var a=n(9375),o=n(90845),s=n(61261);let l=new a.Ltg,c=new a.Pa4,d=new a.Pa4,u=new a.Ltg,f=new a.Ltg,h=new a.Ltg,m=new a.Pa4,p=new a.yGw,v=new a.Zzh,g=new a.Pa4,y=new a.ZzF,x=new a.aLr,b=new a.Ltg;function w(e,t,n){return b.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),b.multiplyScalar(1/b.w),b.x=r/n.width,b.y=r/n.height,b.applyMatrix4(e.projectionMatrixInverse),b.multiplyScalar(1/b.w),Math.abs(Math.max(b.x,b.y))}class S extends a.Kj0{constructor(e=new o.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)c.fromBufferAttribute(t,e),d.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+c.distanceTo(d);let r=new a.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new a.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.kB5(r,1,1)),this}raycast(e,t){let n,o;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let d=this.matrixWorld,b=this.geometry,S=this.material;if(r=S.linewidth+c,null===b.boundingSphere&&b.computeBoundingSphere(),x.copy(b.boundingSphere).applyMatrix4(d),s)n=.5*r;else{let e=Math.max(l.near,x.distanceToPoint(i.origin));n=w(l,e,S.resolution)}if(x.radius+=n,!1!==i.intersectsSphere(x)){if(null===b.boundingBox&&b.computeBoundingBox(),y.copy(b.boundingBox).applyMatrix4(d),s)o=.5*r;else{let e=Math.max(l.near,y.distanceToPoint(i.origin));o=w(l,e,S.resolution)}y.expandByScalar(o),!1!==i.intersectsBox(y)&&(s?function(e,t){let n=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,s.count);for(let o=0;o<c;o++){v.start.fromBufferAttribute(s,o),v.end.fromBufferAttribute(l,o),v.applyMatrix4(n);let c=new a.Pa4,d=new a.Pa4;i.distanceSqToSegment(v.start,v.end,d,c),d.distanceTo(c)<.5*r&&t.push({point:d,pointOnLine:c,distance:i.origin.distanceTo(d),object:e,face:null,faceIndex:o,uv:null,uv1:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,y=c.attributes.instanceEnd,x=Math.min(c.instanceCount,d.count),b=-t.near;i.at(1,h),h.w=1,h.applyMatrix4(t.matrixWorldInverse),h.applyMatrix4(o),h.multiplyScalar(1/h.w),h.x*=s.x/2,h.y*=s.y/2,h.z=0,m.copy(h),p.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<x;t++){if(u.fromBufferAttribute(d,t),f.fromBufferAttribute(y,t),u.w=1,f.w=1,u.applyMatrix4(p),f.applyMatrix4(p),u.z>b&&f.z>b)continue;if(u.z>b){let e=u.z-f.z,t=(u.z-b)/e;u.lerp(f,t)}else if(f.z>b){let e=f.z-u.z,t=(f.z-b)/e;f.lerp(u,t)}u.applyMatrix4(o),f.applyMatrix4(o),u.multiplyScalar(1/u.w),f.multiplyScalar(1/f.w),u.x*=s.x/2,u.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(u),v.start.z=0,v.end.copy(f),v.end.z=0;let c=v.closestPointToPointParameter(m,!0);v.at(c,g);let h=a.M8C.lerp(u.z,f.z,c),x=h>=-1&&h<=1,w=m.distanceTo(g)<.5*r;if(x&&w){v.start.fromBufferAttribute(d,t),v.end.fromBufferAttribute(y,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new a.Pa4,o=new a.Pa4;i.distanceSqToSegment(v.start,v.end,o,r),n.push({point:o,pointOnLine:r,distance:i.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){n.d(t,{z:function(){return o}});var i=n(9375);let r=new i.ZzF,a=new i.Pa4;class o extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)a.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(a)),a.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(a));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){n.d(t,{XR:function(){return i}});let i=e=>(t,n,i)=>{let r=i.subscribe;return i.subscribe=(e,t,n)=>{let a=e;if(t){let r=(null==n?void 0:n.equalityFn)||Object.is,o=e(i.getState());a=n=>{let i=e(n);if(!r(o,i)){let e=o;t(o=i,e)}},(null==n?void 0:n.fireImmediately)&&t(o,o)}return r(a)},e(t,n,i)}},73542:function(e,t,n){n.d(t,{U:function(){return l},o:function(){return o}});var i=n(52983),r=n(98565);let a=e=>e;function o(e,t=a){let n=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>t(e.getState()),[e,t]),i.useCallback(()=>t(e.getInitialState()),[e,t]));return i.useDebugValue(n),n}let s=e=>{let t=(0,r.M)(e),n=e=>o(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){n.d(t,{M:function(){return r}});let i=e=>{let t;let n=new Set,i=(e,i)=>{let r="function"==typeof e?e(t):e;if(!Object.is(r,t)){let e=t;t=(null!=i?i:"object"!=typeof r||null===r)?r:Object.assign({},t,r),n.forEach(n=>n(t,e))}},r=()=>t,a={setState:i,getState:r,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(i,r,a);return a},r=e=>e?i(e):i}}]);