"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[43750,3120],{58109:function(e,t,n){n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375);let s=a.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...u},c){let d=a.useRef(null),f=a.useRef(null),p=new o._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=d.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(p),e.getWorldQuaternion(d.current.quaternion).premultiply(p.invert()),n&&(d.current.rotation.x=i.x),s&&(d.current.rotation.y=i.y),l&&(d.current.rotation.z=i.z)}),a.useImperativeHandle(c,()=>f.current,[]),a.createElement("group",(0,i.Z)({ref:f},u),a.createElement("group",{ref:d},e))})},81125:function(e,t,n){n.d(t,{q:function(){return g}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375),s=n(30535),l=Object.defineProperty,u=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,c=(e,t,n)=>(u(e,"symbol"!=typeof t?t+"":t,n),n);let d=new o.USm(0,0,0,"YXZ"),f=new o.Pa4,p={type:"change"},m={type:"lock"},h={type:"unlock"},v=Math.PI/2;class y extends s.p{constructor(e,t){super(),c(this,"camera"),c(this,"domElement"),c(this,"isLocked"),c(this,"minPolarAngle"),c(this,"maxPolarAngle"),c(this,"pointerSpeed"),c(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(d.setFromQuaternion(this.camera.quaternion),d.y-=.002*e.movementX*this.pointerSpeed,d.x-=.002*e.movementY*this.pointerSpeed,d.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,d.x)),this.camera.quaternion.setFromEuler(d),this.dispatchEvent(p))}),c(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(m),this.isLocked=!0):(this.dispatchEvent(h),this.isLocked=!1))}),c(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),c(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"dispose",()=>{this.disconnect()}),c(this,"getObject",()=>this.camera),c(this,"direction",new o.Pa4(0,0,-1)),c(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),c(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),c(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),c(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),c(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let g=a.forwardRef(({domElement:e,selector:t,onChange:n,onLock:o,onUnlock:s,enabled:l=!0,makeDefault:u,...c},d)=>{let{camera:f,...p}=c,m=(0,r.D)(e=>e.setEvents),h=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),g=(0,r.D)(e=>e.invalidate),b=(0,r.D)(e=>e.events),w=(0,r.D)(e=>e.get),S=(0,r.D)(e=>e.set),x=f||v,E=e||b.connected||h.domElement,_=a.useMemo(()=>new y(x),[x]);return a.useEffect(()=>{if(l){_.connect(E);let e=w().events.compute;return m({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{_.disconnect(),m({compute:e})}}},[l,_]),a.useEffect(()=>{let e=e=>{g(),n&&n(e)};_.addEventListener("change",e),o&&_.addEventListener("lock",o),s&&_.addEventListener("unlock",s);let i=()=>_.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{_.removeEventListener("change",e),o&&_.removeEventListener("lock",o),s&&_.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,o,s,t,_,g]),a.useEffect(()=>{if(u){let e=w().controls;return S({controls:_}),()=>S({controls:e})}},[u,_]),a.createElement("primitive",(0,i.Z)({ref:d,object:_},p))})},73420:function(e,t,n){n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),a=n(75575);let o=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),u=i.useMemo(()=>(0,r.U)((0,a.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),c=i.useMemo(()=>[u.subscribe,u.getState,u],[l]),d=u.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{d({[e]:t}),n&&n(e,t,c[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:a,up:o}=i;i.pressed=!0,(o||!a)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:a}=i;i.pressed=!1,a&&r(!1)},a=s||window;return a.addEventListener("keydown",i,{passive:!0}),a.addEventListener("keyup",r,{passive:!0}),()=>{a.removeEventListener("keydown",i),a.removeEventListener("keyup",r)}},[s,l]),i.createElement(o.Provider,{value:c,children:t})}function l(e){let[t,n,r]=i.useContext(o);return e?r(e):[t,n]}},88574:function(e,t,n){n.d(t,{T:function(){return o}});var i=n(97458),r=n(52983),a=n(3347);let o=e=>{let{rgba:t,onBlur:n}=e,[o,s]=(0,r.useState)(t),l="#"+t.slice(0,3).map(e=>255*e).map(e=>Math.round(e).toString(16).padStart(2,"0")).join(""),u=e=>{s([parseInt(e.substr(1,2),16)/255,parseInt(e.substr(3,2),16)/255,parseInt(e.substr(5,2),16)/255,1])};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(a.I,{type:"color",width:"100%",height:"64px",p:0,value:l,onChange:e=>u(e.currentTarget.value),onBlur:()=>{n(o)}})})}},37794:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{m:function(){return u}});var r=n(52983),a=n(3529),o=n(38316),s=n(59467),l=e([s]);function u(){let[e,t]=(0,r.useState)(null),[n,i]=(0,r.useState)(null),[l,u]=(0,r.useState)(0),[c,d]=(0,r.useState)([]),[f,p]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=!1;return(async()=>{try{let r=await (0,o.o5)();if(e)return;if(r){var n;t(r.fileName),d(null!==(n=r.modBlocks)&&void 0!==n?n:[]),r.colorOverrides&&((0,s.E1)(r.colorOverrides),u(r.colorOverrides.size));let l=await a.dataManager.getModAssetData(o.VI);!e&&l&&i(l)}}catch(e){}finally{e||p(!1)}})(),()=>{e=!0}},[]);let m=(0,r.useCallback)(async e=>{var n;await (0,o.bh)(e.fileName,e.atlas,e.colorOverrides,e.modBlocks,null!==(n=e.wasBedrock)&&void 0!==n&&n),e.assetRecord&&await a.dataManager.addModAssetData({...e.assetRecord,id:o.VI}),(0,s.E1)(e.colorOverrides),t(e.fileName),i(e.assetRecord?{...e.assetRecord,id:o.VI}:null),u(e.colorOverrides.size),d(e.modBlocks)},[]),h=(0,r.useCallback)(async()=>{(0,s.Id)(),await (0,o.FJ)(),await a.dataManager.clearModAssetData(o.VI),t(null),i(null),u(0),d([])},[]);return(0,r.useMemo)(()=>({fileName:e,assetRecord:n,colorOverrideCount:l,modBlocks:c,isLoading:f,save:m,clear:h}),[e,n,l,c,f,m,h])}s=(l.then?(await l)():l)[0],i()}catch(e){i(e)}})},28158:function(e,t,n){n.d(t,{G:function(){return l}});let i=e=>({type:"compound",value:e}),r=e=>({type:"string",value:e}),a=e=>null===e||"object"!=typeof e||Array.isArray(e)?{}:e,o=(e,t)=>a(a(e)[t]).value,s=["protection","fire_protection","feather_falling","blast_protection","projectile_protection","thorns","respiration","depth_strider","aqua_affinity","sharpness","smite","bane_of_arthropods","knockback","fire_aspect","looting","efficiency","silk_touch","unbreaking","fortune","power","punch","flame","infinity","luck_of_the_sea","lure","frost_walker","mending","binding_curse","vanishing_curse","impaling","riptide","loyalty","channeling","multishot","piercing","quick_charge","soul_speed","swift_sneak"];function l(e,t,n,l){let u=structuredClone(a(e)),c=o(e,"tag"),d=o(c,"display"),f=o(d,"Name"),p=a(o(d,"Lore")).value,m=Array.isArray(p)?p.filter(e=>"string"==typeof e):[],h=a(o(c,"ench")).value,v={},y=[];if(Array.isArray(h))for(let e of h){let t=o(e,"id"),n=o(e,"lvl"),i="number"==typeof t&&Number.isInteger(t)?s[t]:void 0;if(!i||"number"!=typeof n||!Number.isInteger(n)||n<=0||n>(l>=3837?255:32767))continue;let a="minecraft:".concat(i);v[a]={type:"int",value:n},y.push({id:r(a),lvl:{type:"short",value:n}})}let g=o(c,"Damage"),b=o(c,"RepairCost"),w=o(c,"Unbreakable"),S=e=>"number"==typeof e&&Number.isInteger(e)&&e>=0&&e<=2147483647,x="minecraft:enchanted_book"===t;if(l>=3837){let e=l>=4325,a=t=>e?i({text:r(t)}):r(JSON.stringify({text:t})),o={"minecraft:custom_data":{type:"compound",value:{"bloxelizer:bedrock_item":{type:"compound",value:u}}}};return"string"==typeof f&&(o["minecraft:custom_name"]=a(f)),m.length&&(o["minecraft:lore"]={type:"list",value:{type:e?"compound":"string",value:m.map(e=>a(e).value)}}),Object.keys(v).length&&(o[x?"minecraft:stored_enchantments":"minecraft:enchantments"]=e?i(v):i({levels:i(v)})),S(g)&&(o["minecraft:damage"]={type:"int",value:g}),S(b)&&(o["minecraft:repair_cost"]={type:"int",value:b}),(1===w||!0===w)&&(o["minecraft:unbreakable"]=i({})),{id:r(t),count:{type:"int",value:n},components:i(o)}}let E=structuredClone(a(c));E["bloxelizer:bedrock_item"]={type:"compound",value:u};let _=structuredClone(a(d));return"string"==typeof f&&(_.Name=r(JSON.stringify({text:f}))),m.length&&(_.Lore={type:"list",value:{type:"string",value:l<1952?m:m.map(e=>JSON.stringify({text:e}))}}),Object.keys(_).length&&(E.display={type:"compound",value:_}),delete E.ench,y.length&&(E[x?"StoredEnchantments":"Enchantments"]={type:"list",value:{type:"compound",value:y}}),{id:r(t),Count:{type:"byte",value:n},tag:{type:"compound",value:E}}}},45901:function(e,t,n){function i(e){return null==e||"object"!=typeof e?e:"value"in e?e.value:e}function r(e){let t=i(e);return"string"==typeof t?t:void 0}function a(e){let t=i(e);return"number"==typeof t?t:void 0}function o(e){if(null==e)return[];if(Array.isArray(e))return e;let t=i(e);if(Array.isArray(t))return t;if(t&&"object"==typeof t){var n;if(Array.isArray(t.value))return t.value;if(Array.isArray(null===(n=t.value)||void 0===n?void 0:n.value))return t.value.value}return[]}function s(e,t){let n=Object.keys(null!=t?t:{}).sort();if(0===n.length)return e;let i=n.map(e=>{var n;return"".concat(e,"=").concat(null===(n=t[e])||void 0===n?void 0:n[0])});return"".concat(e,"[").concat(i.join(","),"]")}n.d(t,{AR:function(){return s},R2:function(){return r},ap:function(){return i},nF:function(){return a},sk:function(){return o}})},65750:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{By:function(){return m},f0:function(){return h},o8:function(){return A},oU:function(){return p},t1:function(){return f},yV:function(){return d}});var r=n(87228),a=n(45604),o=n(16681),s=n(24394),l=n(23240),u=n(29068),c=e([r]);r=(c.then?(await c)():c)[0];let v={Byte:"byte",Int:"int",Float:"float",Double:"double",String:"string",List:"list",Compound:"compound",IntArray:"intArray"},y="__entity",g="__nbt";function d(e){if(!e.id.includes("painting"))return!0;let t=e.states.px,n=e.states.py;return null==t&&null==n||(null==t||"0"===t)&&(null==n||"0"===n)}function f(e){return(0,l.m4)(e)}function p(e){return(0,l.FN)(e)}function m(e){var t,n;if(!e||"string"!=typeof e)return null;let i=(0,u.IX)(e),r=null==i?void 0:i.name;if("string"!=typeof r||0===r.length)return null;let a=null==i?void 0:null===(t=i.state)||void 0===t?void 0:t[y],o=Array.isArray(a)?a[0]:a;if("1"!==o)return null;let s={},l=null!==(n=null==i?void 0:i.state)&&void 0!==n?n:{};for(let[e,t]of Object.entries(l)){let n=Array.isArray(t)?t[0]:t;void 0!==n&&(s[e]=String(n))}let c=s[g],d="string"==typeof c&&c.length?p(c):void 0;return{id:r,states:s,nbtPayload:d}}let b=e=>{if(null==e)return;let t=Number.parseInt(e,10);if(Number.isFinite(t))return t},w=e=>{if(null==e)return;let t=Number.parseFloat(e);if(Number.isFinite(t))return t},S=e=>!!e&&"object"==typeof e&&!Array.isArray(e),x=(e,t,n,i)=>{if(!S(e))return;let r=Math.floor(t),a=Math.floor(n),o=Math.floor(i);e.block_pos&&"object"==typeof e.block_pos&&(e.block_pos={type:v.IntArray,value:[r,a,o]}),e.TileX&&"object"==typeof e.TileX&&(e.TileX={type:v.Int,value:r}),e.TileY&&"object"==typeof e.TileY&&(e.TileY={type:v.Int,value:a}),e.TileZ&&"object"==typeof e.TileZ&&(e.TileZ={type:v.Int,value:o})},E=e=>{S(e)&&delete e.UUID},_=(e,t,n,i,r,l)=>{var u,c;(e=(0,o.y)(e))&&"object"==typeof e||(e={}),!e.id&&e.Id&&(e.id=e.Id),e.id={type:v.String,value:t};let[d,f,p]=(0,a.Q)(null===(c=e.Pos)||void 0===c?void 0:null===(u=c.value)||void 0===u?void 0:u.value,n,i,r,t,l);return e=(0,s.d)(e,[d,f,p]),x(e,d,f,p),E(e),e};function h(e){let t=(0,r.r)(e);if(t&&(e={...e,nbtPayload:t}),e.nbtPayload)return _((0,l.ug)((0,l.G2)(e.nbtPayload)),e.id,e.x,e.y,e.z,e.states);let n=w(e.states.yaw),i=w(e.states.pitch),a=b(e.states.facing),o=b(e.states.rotation),s=e.states.item,u=b(e.states.enabled),c=e.states.primary_item,d={id:{type:v.String,value:e.id},Pos:{type:v.List,value:{type:v.Double,value:[e.x,e.y,e.z]}}};if((void 0!==n||void 0!==i)&&(d.Rotation={type:v.List,value:{type:v.Float,value:[null!=n?n:0,null!=i?i:0]}}),e.id.includes("item_frame")&&(void 0!==a&&(d.Facing={type:v.Byte,value:a}),void 0!==o&&(d.ItemRotation={type:v.Byte,value:o}),s&&(d.Item={type:v.Compound,value:{id:{type:v.String,value:s},Count:{type:v.Byte,value:1}}})),e.id.includes("painting")){void 0!==a&&(d.Facing={type:v.Byte,value:a});let t=e.states.variant;if("string"==typeof t&&t.length>0){let e=t.includes(":")?t:"minecraft:".concat(t);d.variant={type:v.String,value:e}}}return e.id.includes("minecart")&&(void 0!==u&&(d.Enabled={type:v.Byte,value:u}),c&&(d.Items={type:v.List,value:{type:v.Compound,value:[{id:{type:v.String,value:c},Count:{type:v.Byte,value:1}}]}})),d}let A={marker:y,nbt:g,source:"__src",passengerDepth:"__passenger_depth"};i()}catch(e){i(e)}})},87228:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{r:function(){return o}});var r=n(28158),a=n(76816);let e=e=>null===e||"object"!=typeof e||Array.isArray(e)?void 0:e,s=(t,n)=>{var i,r;return null===(i=e(null===(r=e(t))||void 0===r?void 0:r[n]))||void 0===i?void 0:i.value};function o(e){var t,n,i,o,l,u;if("minecraft:item_frame"!==e.id&&"minecraft:glow_item_frame"!==e.id)return null;let c=e.nbtPayload,d=s(c,"id"),f="ItemFrame"===d||"GlowItemFrame"===d;if(null!=c&&!f)return null;let p=Number(null!==(t=e.states.facing)&&void 0!==t?t:2),m=Number.isInteger(p)&&p>=0&&p<=5?p:2,h=[[0,-1,0],[0,1,0],[0,0,-1],[0,0,1],[-1,0,0],[1,0,0]][m],v=[e.x,e.y,e.z].map(Math.floor),y=v.map((e,t)=>e+.5-.46875*h[t]),g=s(c,"ItemRotation"),b=Number(null!==(i=null!==(n=e.states.rotation)&&void 0!==n?n:"number"==typeof g?g/45:void 0)&&void 0!==i?i:0),w=null!==(o=e.dataVersion)&&void 0!==o?o:3465,S={id:{type:"string",value:e.id},Pos:{type:"list",value:{type:"double",value:y}},Facing:{type:"byte",value:m},...w>=4325?{block_pos:{type:"intArray",value:v}}:{TileX:{type:"int",value:v[0]},TileY:{type:"int",value:v[1]},TileZ:{type:"int",value:v[2]}},ItemRotation:{type:"byte",value:Number.isFinite(b)?(Math.round(b)%8+8)%8:0}},x=s(c,"Item"),E=s(x,"Name"),_=null!==(l=e.states.item)&&void 0!==l?l:"string"==typeof E?E:void 0;if(_){let e=s(x,"Count"),t=f&&null!==(u=a.r[_])&&void 0!==u?u:_,n="number"==typeof e&&Number.isInteger(e)&&e>0&&e<=127?e:1,i=f?(0,r.G)(x,t,n,w):{id:{type:"string",value:t},[w>=3837?"count":"Count"]:{type:w>=3837?"int":"byte",value:n}};S.Item={type:"compound",value:i}}let A=s(c,"ItemDropChance");return"number"==typeof A&&Number.isFinite(A)&&(S.ItemDropChance={type:"float",value:A}),S}i()}catch(e){i(e)}})},69:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{W:function(){return e}});var r=n(65753),a=n(29068);let e=e=>{if("string"!=typeof e||0===e.length)return;let t=(0,a.IX)(e),n=(0,r.U)("string"==typeof(null==t?void 0:t.name)&&t.name.length?t.name:e.split("[")[0]),i=null==t?void 0:t.state;if(!i||"object"!=typeof i)return n;let o=Object.entries(i).filter(e=>{let[t]=e;return!function(e){let t=String(null!=e?e:"").toLowerCase();return!!t&&!!("__entity"===t||"_entity"===t||"nbt"===t||"_nbt"===t||"__nbt"===t||"material"===t||"_material"===t||"__material"===t||(t.startsWith("_")||t.startsWith("__"))&&t.endsWith("nbt")||(t.startsWith("_")||t.startsWith("__"))&&t.endsWith("material"))}(t)}).map(e=>{let[t,n]=e,i=Array.isArray(n)?n[0]:n;return[t,i]}).filter(e=>{let[,t]=e;return null!=t&&String(t).length>0}).sort((e,t)=>{let[n]=e,[i]=t;return n.localeCompare(i)});return 0===o.length?n:"".concat(n,"[").concat(o.map(e=>{let[t,n]=e;return"".concat(t,"=").concat(String(n))}).join(","),"]")};i()}catch(e){i(e)}})},59467:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{E1:function(){return a},Id:function(){return o}});var r=n(87617);let e=null;function a(t){if(!e)for(let t of(e=new Map,r.k2))t.rgba&&e.set(t.id,{...t.rgba});for(let[e,n]of t){let t=r.JH[e];t&&(t.rgba=n)}}function o(){if(e){for(let[t,n]of e){let e=r.JH[t];e&&(e.rgba=n)}e=null}}i()}catch(e){i(e)}})},4248:function(e,t,n){n.d(t,{i:function(){return i}});let i=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){n.d(t,{Y:function(){return a}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class a extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){let i,r;n.d(t,{w:function(){return x}});var a=n(9375),o=n(90845),s=n(61261);let l=new a.Ltg,u=new a.Pa4,c=new a.Pa4,d=new a.Ltg,f=new a.Ltg,p=new a.Ltg,m=new a.Pa4,h=new a.yGw,v=new a.Zzh,y=new a.Pa4,g=new a.ZzF,b=new a.aLr,w=new a.Ltg;function S(e,t,n){return w.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),w.multiplyScalar(1/w.w),w.x=r/n.width,w.y=r/n.height,w.applyMatrix4(e.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}class x extends a.Kj0{constructor(e=new o.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)u.fromBufferAttribute(t,e),c.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+u.distanceTo(c);let r=new a.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new a.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.kB5(r,1,1)),this}raycast(e,t){let n,o;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let u=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let c=this.matrixWorld,w=this.geometry,x=this.material;if(r=x.linewidth+u,null===w.boundingSphere&&w.computeBoundingSphere(),b.copy(w.boundingSphere).applyMatrix4(c),s)n=.5*r;else{let e=Math.max(l.near,b.distanceToPoint(i.origin));n=S(l,e,x.resolution)}if(b.radius+=n,!1!==i.intersectsSphere(b)){if(null===w.boundingBox&&w.computeBoundingBox(),g.copy(w.boundingBox).applyMatrix4(c),s)o=.5*r;else{let e=Math.max(l.near,g.distanceToPoint(i.origin));o=S(l,e,x.resolution)}g.expandByScalar(o),!1!==i.intersectsBox(g)&&(s?function(e,t){let n=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,l=o.attributes.instanceEnd,u=Math.min(o.instanceCount,s.count);for(let o=0;o<u;o++){v.start.fromBufferAttribute(s,o),v.end.fromBufferAttribute(l,o),v.applyMatrix4(n);let u=new a.Pa4,c=new a.Pa4;i.distanceSqToSegment(v.start,v.end,c,u),c.distanceTo(u)<.5*r&&t.push({point:c,pointOnLine:u,distance:i.origin.distanceTo(c),object:e,face:null,faceIndex:o,uv:null,uv1:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,u=e.geometry,c=u.attributes.instanceStart,g=u.attributes.instanceEnd,b=Math.min(u.instanceCount,c.count),w=-t.near;i.at(1,p),p.w=1,p.applyMatrix4(t.matrixWorldInverse),p.applyMatrix4(o),p.multiplyScalar(1/p.w),p.x*=s.x/2,p.y*=s.y/2,p.z=0,m.copy(p),h.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<b;t++){if(d.fromBufferAttribute(c,t),f.fromBufferAttribute(g,t),d.w=1,f.w=1,d.applyMatrix4(h),f.applyMatrix4(h),d.z>w&&f.z>w)continue;if(d.z>w){let e=d.z-f.z,t=(d.z-w)/e;d.lerp(f,t)}else if(f.z>w){let e=f.z-d.z,t=(f.z-w)/e;f.lerp(d,t)}d.applyMatrix4(o),f.applyMatrix4(o),d.multiplyScalar(1/d.w),f.multiplyScalar(1/f.w),d.x*=s.x/2,d.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(d),v.start.z=0,v.end.copy(f),v.end.z=0;let u=v.closestPointToPointParameter(m,!0);v.at(u,y);let p=a.M8C.lerp(d.z,f.z,u),b=p>=-1&&p<=1,S=m.distanceTo(y)<.5*r;if(b&&S){v.start.fromBufferAttribute(c,t),v.end.fromBufferAttribute(g,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new a.Pa4,o=new a.Pa4;i.distanceSqToSegment(v.start,v.end,o,r),n.push({point:o,pointOnLine:r,distance:i.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){n.d(t,{z:function(){return o}});var i=n(9375);let r=new i.ZzF,a=new i.Pa4;class o extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)a.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(a)),a.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(a));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){n.d(t,{XR:function(){return i}});let i=e=>(t,n,i)=>{let r=i.subscribe;return i.subscribe=(e,t,n)=>{let a=e;if(t){let r=(null==n?void 0:n.equalityFn)||Object.is,o=e(i.getState());a=n=>{let i=e(n);if(!r(o,i)){let e=o;t(o=i,e)}},(null==n?void 0:n.fireImmediately)&&t(o,o)}return r(a)},e(t,n,i)}},73542:function(e,t,n){n.d(t,{U:function(){return l},o:function(){return o}});var i=n(52983),r=n(98565);let a=e=>e;function o(e,t=a){let n=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>t(e.getState()),[e,t]),i.useCallback(()=>t(e.getInitialState()),[e,t]));return i.useDebugValue(n),n}let s=e=>{let t=(0,r.M)(e),n=e=>o(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){n.d(t,{M:function(){return r}});let i=e=>{let t;let n=new Set,i=(e,i)=>{let r="function"==typeof e?e(t):e;if(!Object.is(r,t)){let e=t;t=(null!=i?i:"object"!=typeof r||null===r)?r:Object.assign({},t,r),n.forEach(n=>n(t,e))}},r=()=>t,a={setState:i,getState:r,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(i,r,a);return a},r=e=>e?i(e):i}}]);