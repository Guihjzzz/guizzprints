(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[15673,3120],{58109:function(e,t,n){"use strict";n.d(t,{V:function(){return s}});var r=n(99217),i=n(62510),o=n(52983),a=n(9375);let s=o.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...u},c){let d=o.useRef(null),f=o.useRef(null),h=new a._fP;return(0,i.F)(({camera:e})=>{if(!t||!f.current)return;let r=d.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(h),e.getWorldQuaternion(d.current.quaternion).premultiply(h.invert()),n&&(d.current.rotation.x=r.x),s&&(d.current.rotation.y=r.y),l&&(d.current.rotation.z=r.z)}),o.useImperativeHandle(c,()=>f.current,[]),o.createElement("group",(0,r.Z)({ref:f},u),o.createElement("group",{ref:d},e))})},81125:function(e,t,n){"use strict";n.d(t,{q:function(){return y}});var r=n(99217),i=n(62510),o=n(52983),a=n(9375),s=n(30535),l=Object.defineProperty,u=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,c=(e,t,n)=>(u(e,"symbol"!=typeof t?t+"":t,n),n);let d=new a.USm(0,0,0,"YXZ"),f=new a.Pa4,h={type:"change"},p={type:"lock"},m={type:"unlock"},v=Math.PI/2;class g extends s.p{constructor(e,t){super(),c(this,"camera"),c(this,"domElement"),c(this,"isLocked"),c(this,"minPolarAngle"),c(this,"maxPolarAngle"),c(this,"pointerSpeed"),c(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(d.setFromQuaternion(this.camera.quaternion),d.y-=.002*e.movementX*this.pointerSpeed,d.x-=.002*e.movementY*this.pointerSpeed,d.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,d.x)),this.camera.quaternion.setFromEuler(d),this.dispatchEvent(h))}),c(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(p),this.isLocked=!0):(this.dispatchEvent(m),this.isLocked=!1))}),c(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),c(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"dispose",()=>{this.disconnect()}),c(this,"getObject",()=>this.camera),c(this,"direction",new a.Pa4(0,0,-1)),c(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),c(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),c(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),c(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),c(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let y=o.forwardRef(({domElement:e,selector:t,onChange:n,onLock:a,onUnlock:s,enabled:l=!0,makeDefault:u,...c},d)=>{let{camera:f,...h}=c,p=(0,i.D)(e=>e.setEvents),m=(0,i.D)(e=>e.gl),v=(0,i.D)(e=>e.camera),y=(0,i.D)(e=>e.invalidate),S=(0,i.D)(e=>e.events),w=(0,i.D)(e=>e.get),b=(0,i.D)(e=>e.set),x=f||v,_=e||S.connected||m.domElement,E=o.useMemo(()=>new g(x),[x]);return o.useEffect(()=>{if(l){E.connect(_);let e=w().events.compute;return p({compute(e,t){let n=t.size.width/2,r=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(r/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{E.disconnect(),p({compute:e})}}},[l,E]),o.useEffect(()=>{let e=e=>{y(),n&&n(e)};E.addEventListener("change",e),a&&E.addEventListener("lock",a),s&&E.addEventListener("unlock",s);let r=()=>E.lock(),i=t?Array.from(document.querySelectorAll(t)):[document];return i.forEach(e=>e&&e.addEventListener("click",r)),()=>{E.removeEventListener("change",e),a&&E.removeEventListener("lock",a),s&&E.removeEventListener("unlock",s),i.forEach(e=>e?e.removeEventListener("click",r):void 0)}},[n,a,s,t,E,y]),o.useEffect(()=>{if(u){let e=w().controls;return b({controls:E}),()=>b({controls:e})}},[u,E]),o.createElement("primitive",(0,r.Z)({ref:d,object:E},h))})},73420:function(e,t,n){"use strict";n.d(t,{Z:function(){return l},c:function(){return s}});var r=n(52983),i=n(73542),o=n(75575);let a=r.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),u=r.useMemo(()=>(0,i.U)((0,o.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),c=r.useMemo(()=>[u.subscribe,u.getState,u],[l]),d=u.setState;return r.useEffect(()=>{let t=e.map(({name:e,keys:t,up:r})=>({keys:t,up:r,fn:t=>{d({[e]:t}),n&&n(e,t,c[1]())}})).reduce((e,{keys:t,fn:n,up:r=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:r}),e),{}),r=({key:e,code:n})=>{let r=t[e]||t[n];if(!r)return;let{fn:i,pressed:o,up:a}=r;r.pressed=!0,(a||!o)&&i(!0)},i=({key:e,code:n})=>{let r=t[e]||t[n];if(!r)return;let{fn:i,up:o}=r;r.pressed=!1,o&&i(!1)},o=s||window;return o.addEventListener("keydown",r,{passive:!0}),o.addEventListener("keyup",i,{passive:!0}),()=>{o.removeEventListener("keydown",r),o.removeEventListener("keyup",i)}},[s,l]),r.createElement(a.Provider,{value:c,children:t})}function l(e){let[t,n,i]=r.useContext(a);return e?i(e):[t,n]}},53870:function(e,t,n){"use strict";var r=n(73656);n(41354);var i=n(52983),o=i&&"object"==typeof i&&"default"in i?i:{default:i},a=void 0!==r&&r.env&&!0,s=function(e){return"[object String]"===Object.prototype.toString.call(e)},l=function(){function e(e){var t=void 0===e?{}:e,n=t.name,r=void 0===n?"stylesheet":n,i=t.optimizeForSpeed,o=void 0===i?a:i;u(s(r),"`name` must be a string"),this._name=r,this._deletedRulePlaceholder="#"+r+"-deleted-rule____{}",u("boolean"==typeof o,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=o,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var l=document.querySelector('meta[property="csp-nonce"]');this._nonce=l?l.getAttribute("content"):null}var t=e.prototype;return t.setOptimizeForSpeed=function(e){u("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),u(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},t.isOptimizeForSpeed=function(){return this._optimizeForSpeed},t.inject=function(){var e=this;if(u(!this._injected,"sheet already injected"),this._injected=!0,this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,n){return"number"==typeof n?e._serverSheet.cssRules[n]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),n},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},t.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},t.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},t.insertRule=function(e,t){if(u(s(e),"`insertRule` accepts only strings"),this._optimizeForSpeed){var n=this.getSheet();"number"!=typeof t&&(t=n.cssRules.length);try{n.insertRule(e,t)}catch(e){return -1}}else{var r=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,r))}return this._rulesCount++},t.replaceRule=function(e,t){if(this._optimizeForSpeed){var n=this.getSheet();if(t.trim()||(t=this._deletedRulePlaceholder),!n.cssRules[e])return e;n.deleteRule(e);try{n.insertRule(t,e)}catch(t){n.insertRule(this._deletedRulePlaceholder,e)}}else{var r=this._tags[e];u(r,"old rule at index `"+e+"` not found"),r.textContent=t}return e},t.deleteRule=function(e){if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];u(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},t.flush=function(){this._injected=!1,this._rulesCount=0,this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]},t.cssRules=function(){var e=this;return this._tags.reduce(function(t,n){return n?t=t.concat(Array.prototype.map.call(e.getSheetForTag(n).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},t.makeStyleTag=function(e,t,n){t&&u(s(t),"makeStyleTag accepts only strings as second parameter");var r=document.createElement("style");this._nonce&&r.setAttribute("nonce",this._nonce),r.type="text/css",r.setAttribute("data-"+e,""),t&&r.appendChild(document.createTextNode(t));var i=document.head||document.getElementsByTagName("head")[0];return n?i.insertBefore(r,n):i.appendChild(r),r},function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}(e.prototype,[{key:"length",get:function(){return this._rulesCount}}]),e}();function u(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var c=function(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0},d={};function f(e,t){if(!t)return"jsx-"+e;var n=String(t),r=e+n;return d[r]||(d[r]="jsx-"+c(e+"-"+n)),d[r]}function h(e,t){var n=e+t;return d[n]||(d[n]=t.replace(/__jsx-style-dynamic-selector/g,e)),d[n]}var p=function(){function e(e){var t=void 0===e?{}:e,n=t.styleSheet,r=void 0===n?null:n,i=t.optimizeForSpeed,o=void 0!==i&&i;this._sheet=r||new l({name:"styled-jsx",optimizeForSpeed:o}),this._sheet.inject(),r&&"boolean"==typeof o&&(this._sheet.setOptimizeForSpeed(o),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer||(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var n=this.getIdAndRules(e),r=n.styleId,i=n.rules;if(r in this._instancesCounts){this._instancesCounts[r]+=1;return}var o=i.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[r]=o,this._instancesCounts[r]=1},t.remove=function(e){var t=this,n=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(n in this._instancesCounts,"styleId: `"+n+"` not found"),this._instancesCounts[n]-=1,this._instancesCounts[n]<1){var r=this._fromServer&&this._fromServer[n];r?(r.parentNode.removeChild(r),delete this._fromServer[n]):(this._indices[n].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[n]),delete this._instancesCounts[n]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],n=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return n[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,n;return t=this.cssRules(),void 0===(n=e)&&(n={}),t.map(function(e){var t=e[0],r=e[1];return o.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:n.nonce?n.nonce:void 0,dangerouslySetInnerHTML:{__html:r}})})},t.getIdAndRules=function(e){var t=e.children,n=e.dynamic,r=e.id;if(n){var i=f(r,n);return{styleId:i,rules:Array.isArray(t)?t.map(function(e){return h(i,e)}):[h(i,t)]}}return{styleId:f(r),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),m=i.createContext(null);m.displayName="StyleSheetContext";var v=o.default.useInsertionEffect||o.default.useLayoutEffect,g=new p;function y(e){var t=g||i.useContext(m);return t&&v(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)]),null}y.dynamic=function(e){return e.map(function(e){return f(e[0],e[1])}).join(" ")},t.style=y},76741:function(e,t,n){"use strict";e.exports=n(53870).style},41354:function(){},30280:function(e,t,n){"use strict";n.d(t,{H:function(){return c}});var r=n(45045),i=n(82911),o=n(26398),a=n(25610),s=n(1848),l=n(19938),u=n(97458),c=(0,o.G)(function(e,t){let{className:n,motionProps:o,...c}=e,{reduceMotion:d}=(0,r.EF)(),{getPanelProps:f,isOpen:h}=(0,i.bB)(),p=f(c,t),m=(0,l.cx)("chakra-accordion__panel",n),v=(0,i.YO)();d||delete p.hidden;let g=(0,u.jsx)(a.m.div,{...p,__css:v.panel,className:m});return d?g:(0,u.jsx)(s.U,{in:h,...o,children:g})});c.displayName="AccordionPanel"},45045:function(e,t,n){"use strict";n.d(t,{As:function(){return u},EF:function(){return d},Zl:function(){return f},a2:function(){return c}});var r=n(82911),i=n(96248),o=n(79206),a=n(16227),s=n(19938),l=n(52983);function u(e){let{onChange:t,defaultIndex:n,index:i,allowMultiple:a,allowToggle:u,...c}=e;(function(e){let t=e.index||e.defaultIndex,n=null!=t&&!Array.isArray(t)&&e.allowMultiple;(0,s.ZK)({condition:!!n,message:`If 'allowMultiple' is passed, then 'index' or 'defaultIndex' must be an array. You passed: ${typeof t},`})})(e),(0,s.ZK)({condition:!!(e.allowMultiple&&e.allowToggle),message:"If 'allowMultiple' is passed, 'allowToggle' will be ignored. Either remove 'allowToggle' or 'allowMultiple' depending on whether you want multiple accordions visible or not"});let d=(0,r._v)(),[f,h]=(0,l.useState)(-1);(0,l.useEffect)(()=>()=>{h(-1)},[]);let[p,m]=(0,o.T)({value:i,defaultValue:()=>a?null!=n?n:[]:null!=n?n:-1,onChange:t});return{index:p,setIndex:m,htmlProps:c,getAccordionItemProps:e=>{let t=!1;return null!==e&&(t=Array.isArray(p)?p.includes(e):p===e),{isOpen:t,onChange:t=>{null!==e&&(a&&Array.isArray(p)?m(t?p.concat(e):p.filter(t=>t!==e)):t?m(e):u&&m(-1))}}},focusedIndex:f,setFocusedIndex:h,descendants:d}}var[c,d]=(0,i.k)({name:"AccordionContext",hookName:"useAccordionContext",providerName:"Accordion"});function f(e){var t;let{isDisabled:n,isFocusable:i,id:o,...u}=e,{getAccordionItemProps:c,setFocusedIndex:f}=d(),h=(0,l.useRef)(null),p=(0,l.useId)(),m=null!=o?o:p,v=`accordion-button-${m}`,g=`accordion-panel-${m}`;(0,s.ZK)({condition:!!(e.isFocusable&&!e.isDisabled),message:`Using only 'isFocusable', this prop is reserved for situations where you pass 'isDisabled' but you still want the element to receive focus (A11y). Either remove it or pass 'isDisabled' as well.
    `});let{register:y,index:S,descendants:w}=(0,r.mc)({disabled:n&&!i}),{isOpen:b,onChange:x}=c(-1===S?null:S);t={isOpen:b,isDisabled:n},(0,s.ZK)({condition:t.isOpen&&!!t.isDisabled,message:"Cannot open a disabled accordion item"});let _=(0,l.useCallback)(()=>{null==x||x(!b),f(S)},[S,f,b,x]),E=(0,l.useCallback)(e=>{let t={ArrowDown:()=>{let e=w.nextEnabled(S);null==e||e.node.focus()},ArrowUp:()=>{let e=w.prevEnabled(S);null==e||e.node.focus()},Home:()=>{let e=w.firstEnabled();null==e||e.node.focus()},End:()=>{let e=w.lastEnabled();null==e||e.node.focus()}}[e.key];t&&(e.preventDefault(),t(e))},[w,S]),A=(0,l.useCallback)(()=>{f(S)},[f,S]),M=(0,l.useCallback)(function(e={},t=null){return{...e,type:"button",ref:(0,a.lq)(y,h,t),id:v,disabled:!!n,"aria-expanded":!!b,"aria-controls":g,onClick:(0,s.v0)(e.onClick,_),onFocus:(0,s.v0)(e.onFocus,A),onKeyDown:(0,s.v0)(e.onKeyDown,E)}},[v,n,b,_,A,E,g,y]),j=(0,l.useCallback)(function(e={},t=null){return{...e,ref:t,role:"region",id:g,"aria-labelledby":v,hidden:!b}},[v,b,g]);return{isOpen:b,isDisabled:n,isFocusable:i,onOpen:()=>{null==x||x(!0)},onClose:()=>{null==x||x(!1)},getButtonProps:M,getPanelProps:j,htmlProps:u}}},74827:function(e,t,n){"use strict";n.d(t,{U:function(){return f}});var r=n(45045),i=n(82911),o=n(26398),a=n(15627),s=n(42089),l=n(25610),u=n(19938),c=n(52983),d=n(97458),f=(0,o.G)(function({children:e,reduceMotion:t,...n},o){let f=(0,a.jC)("Accordion",n),h=(0,s.Lr)(n),{htmlProps:p,descendants:m,...v}=(0,r.As)(h),g=(0,c.useMemo)(()=>({...v,reduceMotion:!!t}),[v,t]);return(0,d.jsx)(i.di,{value:m,children:(0,d.jsx)(r.a2,{value:g,children:(0,d.jsx)(i.lh,{value:f,children:(0,d.jsx)(l.m.div,{ref:o,...p,className:(0,u.cx)("chakra-accordion",n.className),__css:f.root,children:e})})})})});f.displayName="Accordion"},26473:function(e,t,n){"use strict";n.d(t,{Q:function(){return c}});var r=n(45045),i=n(82911),o=n(26398),a=n(25610),s=n(19938),l=n(52983),u=n(97458),c=(0,o.G)(function(e,t){let{children:n,className:o}=e,{htmlProps:c,...d}=(0,r.Zl)(e),f={...(0,i.YO)().container,overflowAnchor:"none"},h=(0,l.useMemo)(()=>d,[d]);return(0,u.jsx)(i.ec,{value:h,children:(0,u.jsx)(a.m.div,{ref:t,...c,className:(0,s.cx)("chakra-accordion__item",o),__css:f,children:"function"==typeof n?n({isExpanded:!!d.isOpen,isDisabled:!!d.isDisabled}):n})})});c.displayName="AccordionItem"},7498:function(e,t,n){"use strict";n.d(t,{K:function(){return l}});var r=n(82911),i=n(26398),o=n(25610),a=n(19938),s=n(97458),l=(0,i.G)(function(e,t){let{getButtonProps:n}=(0,r.bB)(),i=n(e,t),l={display:"flex",alignItems:"center",width:"100%",outline:0,...(0,r.YO)().button};return(0,s.jsx)(o.m.button,{...i,className:(0,a.cx)("chakra-accordion__button",e.className),__css:l})});l.displayName="AccordionButton"},82911:function(e,t,n){"use strict";n.d(t,{YO:function(){return a},_v:function(){return d},bB:function(){return l},di:function(){return u},ec:function(){return s},lh:function(){return o},mc:function(){return f}});var r=n(75548),i=n(96248),[o,a]=(0,i.k)({name:"AccordionStylesContext",hookName:"useAccordionStyles",providerName:"<Accordion />"}),[s,l]=(0,i.k)({name:"AccordionItemContext",hookName:"useAccordionItemContext",providerName:"<AccordionItem />"}),[u,c,d,f]=(0,r.n)()},42768:function(e,t,n){"use strict";n.d(t,{X:function(){return l}});var r=n(45045),i=n(82911),o=n(15928),a=n(19938),s=n(97458);function l(e){let{isOpen:t,isDisabled:n}=(0,i.bB)(),{reduceMotion:l}=(0,r.EF)(),u=(0,a.cx)("chakra-accordion__icon",e.className),c={opacity:n?.4:1,transform:t?"rotate(-180deg)":void 0,transition:l?void 0:"transform 0.2s",transformOrigin:"center",...(0,i.YO)().icon};return(0,s.jsx)(o.J,{viewBox:"0 0 24 24","aria-hidden":!0,className:u,__css:c,...e,children:(0,s.jsx)("path",{fill:"currentColor",d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"})})}l.displayName="AccordionIcon"},56:function(e,t,n){"use strict";n.d(t,{l:function(){return c}});var r=n(71327),i=n(26398),o=n(15627),a=n(42089),s=n(25610),l=n(19938),u=n(97458),c=(0,i.G)(function(e,t){var n;let i=(0,o.mq)("FormLabel",e),c=(0,a.Lr)(e),{className:f,children:h,requiredIndicator:p=(0,u.jsx)(d,{}),optionalIndicator:m=null,...v}=c,g=(0,r.NJ)(),y=null!=(n=null==g?void 0:g.getLabelProps(v,t))?n:{ref:t,...v};return(0,u.jsxs)(s.m.label,{...y,className:(0,l.cx)("chakra-form__label",c.className),__css:{display:"block",textAlign:"start",...i},children:[h,(null==g?void 0:g.isRequired)?p:m]})});c.displayName="FormLabel";var d=(0,i.G)(function(e,t){let n=(0,r.NJ)(),i=(0,r.e)();if(!(null==n?void 0:n.isRequired))return null;let o=(0,l.cx)("chakra-form__required-indicator",e.className);return(0,u.jsx)(s.m.span,{...null==n?void 0:n.getRequiredIndicatorProps(e,t),__css:i.requiredIndicator,className:o})});d.displayName="RequiredIndicator"},48048:function(e,t,n){"use strict";n.d(t,{J1:function(){return p}});var r=n(71327),i=n(15928),o=n(96248),a=n(26398),s=n(15627),l=n(42089),u=n(25610),c=n(19938),d=n(97458),[f,h]=(0,o.k)({name:"FormErrorStylesContext",errorMessage:"useFormErrorStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<FormError />\" "}),p=(0,a.G)((e,t)=>{let n=(0,s.jC)("FormError",e),i=(0,l.Lr)(e),o=(0,r.NJ)();return(null==o?void 0:o.isInvalid)?(0,d.jsx)(f,{value:n,children:(0,d.jsx)(u.m.div,{...null==o?void 0:o.getErrorMessageProps(i,t),className:(0,c.cx)("chakra-form__error-message",e.className),__css:{display:"flex",alignItems:"center",...n.text}})}):null});p.displayName="FormErrorMessage",(0,a.G)((e,t)=>{let n=h(),o=(0,r.NJ)();if(!(null==o?void 0:o.isInvalid))return null;let a=(0,c.cx)("chakra-form__error-icon",e.className);return(0,d.jsx)(i.J,{ref:t,"aria-hidden":!0,...e,__css:n.icon,className:a,children:(0,d.jsx)("path",{fill:"currentColor",d:"M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"})})}).displayName="FormErrorIcon"},52250:function(e,t,n){"use strict";n.d(t,{r:function(){return a}});var r=n(26398),i=n(25610),o=n(97458),a=(0,r.G)(function(e,t){let{templateAreas:n,gap:r,rowGap:a,columnGap:s,column:l,row:u,autoFlow:c,autoRows:d,templateRows:f,autoColumns:h,templateColumns:p,...m}=e;return(0,o.jsx)(i.m.div,{ref:t,__css:{display:"grid",gridTemplateAreas:n,gridGap:r,gridRowGap:a,gridColumnGap:s,gridAutoColumns:h,gridColumn:l,gridRow:u,gridAutoFlow:c,gridAutoRows:d,gridTemplateRows:f,gridTemplateColumns:p},...m})});a.displayName="Grid"},7070:function(e,t,n){"use strict";n.d(t,{M:function(){return u}});var r=n(52250),i=n(26398),o=n(61112),a=n(71778),s=n(9878),l=n(97458),u=(0,i.G)(function(e,t){let{columns:n,spacingX:i,spacingY:u,spacing:c,minChildWidth:d,...f}=e,h=(0,o.F)(),p=d?(0,s.XQ)(d,e=>{let t=(0,a.LP)("sizes",e,"number"==typeof e?`${e}px`:e)(h);return null===e?null:`repeat(auto-fit, minmax(${t}, 1fr))`}):(0,s.XQ)(n,e=>null===e?null:`repeat(${e}, minmax(0, 1fr))`);return(0,l.jsx)(r.r,{ref:t,gap:c,columnGap:i,rowGap:u,templateColumns:p,...f})});u.displayName="SimpleGrid"},68069:function(e,t,n){"use strict";n.d(t,{P:function(){return u}});var r=n(26398),i=n(25610),o=n(62282),a=n(9878),s=n(97458);function l(e){return(0,a.XQ)(e,e=>"auto"===e?"auto":`span ${e}/span ${e}`)}var u=(0,r.G)(function(e,t){let{area:n,colSpan:r,colStart:a,colEnd:u,rowEnd:c,rowSpan:d,rowStart:f,...h}=e,p=(0,o.o)({gridArea:n,gridColumn:l(r),gridRow:l(d),gridColumnStart:a,gridColumnEnd:u,gridRowStart:f,gridRowEnd:c});return(0,s.jsx)(i.m.div,{ref:t,__css:p,...h})});u.displayName="GridItem"},24330:function(e,t,n){"use strict";n.d(t,{g:function(){return d}});var r=n(87059),i=n(26398),o=n(15627),a=n(42089),s=n(25610),l=n(19938),u=n(97458),c=["h","minH","height","minHeight"],d=(0,i.G)((e,t)=>{let n=(0,o.mq)("Textarea",e),{className:i,rows:d,...f}=(0,a.Lr)(e),h=(0,r.Y)(f),p=d?function(e,t=[]){let n=Object.assign({},e);for(let e of t)e in n&&delete n[e];return n}(n,c):n;return(0,u.jsx)(s.m.textarea,{ref:t,rows:d,...h,className:(0,l.cx)("chakra-textarea",i),__css:p})});d.displayName="Textarea"},1848:function(e,t,n){"use strict";n.d(t,{U:function(){return f}});var r=n(40393),i=n(19938),o=n(44659),a=n(39267),s=n(52983),l=n(97458),u=e=>null!=e&&parseInt(e.toString(),10)>0,c={exit:{height:{duration:.2,ease:r.Lj.ease},opacity:{duration:.3,ease:r.Lj.ease}},enter:{height:{duration:.3,ease:r.Lj.ease},opacity:{duration:.4,ease:r.Lj.ease}}},d={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:i,delay:o})=>{var a;return{...e&&{opacity:u(t)?1:0},height:t,transitionEnd:null==i?void 0:i.exit,transition:null!=(a=null==n?void 0:n.exit)?a:r.p$.exit(c.exit,o)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:i,delay:o})=>{var a;return{...e&&{opacity:1},height:t,transitionEnd:null==i?void 0:i.enter,transition:null!=(a=null==n?void 0:n.enter)?a:r.p$.enter(c.enter,o)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:r,animateOpacity:u=!0,startingHeight:c=0,endingHeight:f="auto",style:h,className:p,transition:m,transitionEnd:v,...g}=e,[y,S]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{S(!0)});return()=>clearTimeout(e)},[]),(0,i.ZK)({condition:Number(c)>0&&!!r,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let w=parseFloat(c.toString())>0,b={startingHeight:c,endingHeight:f,animateOpacity:u,transition:y?m:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:r?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:w?"block":"none"}}},x=!r||n,_=n||r?"enter":"exit";return(0,l.jsx)(o.M,{initial:!1,custom:b,children:x&&(0,l.jsx)(a.E.div,{ref:t,...g,className:(0,i.cx)("chakra-collapse",p),style:{overflow:"hidden",display:"block",...h},custom:b,variants:d,initial:!!r&&"exit",animate:_,exit:"exit"})})});f.displayName="Collapse"},85995:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach(function(t){var r;r=n[t],t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function a(e){return function t(){for(var n=this,r=arguments.length,i=Array(r),o=0;o<r;o++)i[o]=arguments[o];return i.length>=e.length?e.apply(this,i):function(){for(var e=arguments.length,r=Array(e),o=0;o<e;o++)r[o]=arguments[o];return t.apply(n,[].concat(i,r))}}}function s(e){return({}).toString.call(e).includes("Object")}function l(e){return"function"==typeof e}n.d(t,{ZP:function(){return q}});var u,c,d=a(function(e,t){throw Error(e[t]||e.default)})({initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"}),f=function(e,t){return s(t)||d("changeType"),Object.keys(t).some(function(t){return!Object.prototype.hasOwnProperty.call(e,t)})&&d("changeField"),t},h=function(e){l(e)||d("selectorType")},p=function(e){l(e)||s(e)||d("handlerType"),s(e)&&Object.values(e).some(function(e){return!l(e)})&&d("handlersType")},m=function(e){e||d("initialIsRequired"),s(e)||d("initialType"),Object.keys(e).length||d("initialContent")};function v(e,t){return l(t)?t(e.current):t}function g(e,t){return e.current=o(o({},e.current),t),t}function y(e,t,n){return l(t)?t(e.current):Object.keys(n).forEach(function(n){var r;return null===(r=t[n])||void 0===r?void 0:r.call(t,e.current[n])}),n}(u=function(e,t){throw Error(e[t]||e.default)},function e(){for(var t=this,n=arguments.length,r=Array(n),i=0;i<n;i++)r[i]=arguments[i];return r.length>=u.length?u.apply(this,r):function(){for(var n=arguments.length,i=Array(n),o=0;o<n;o++)i[o]=arguments[o];return e.apply(t,[].concat(r,i))}})({configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:"Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "});var S=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return t.reduceRight(function(e,t){return t(e)},e)}},w={type:"cancelation",msg:"operation is manually canceled"};function b(e){var t=!1,n=new Promise(function(n,r){e.then(function(e){return t?r(w):n(e)}),e.catch(r)});return n.cancel=function(){return t=!0},n}var x=function(e){if(Array.isArray(e))return e}(c=({create:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};m(e),p(t);var n={current:e},r=a(y)(n,t),i=a(g)(n),o=a(f)(e),s=a(v)(n);return[function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(e){return e};return h(e),e(n.current)},function(e){(function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return t.reduceRight(function(e,t){return t(e)},e)}})(r,i,o,s)(e)}]}}).create({config:{paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"}},isInitialized:!1,resolve:null,reject:null,monaco:null}))||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,o,a,s=[],l=!0,u=!1;try{for(o=(n=n.call(e)).next;!(l=(r=o.call(n)).done)&&(s.push(r.value),2!==s.length);l=!0);}catch(e){u=!0,i=e}finally{try{if(!l&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(u)throw i}}return s}}(c,2)||function(e,t){if(e){if("string"==typeof e)return r(e,2);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,2):void 0}}(c,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),_=x[0],E=x[1];function A(e){return document.body.appendChild(e)}function M(e){var t,n,r=_(function(e){return{config:e.config,reject:e.reject}}),i=(t="".concat(r.config.paths.vs,"../../../loader.js"),n=document.createElement("script"),t&&(n.src=t),n);return i.onload=function(){return e()},i.onerror=r.reject,i}function j(){var e=_(function(e){return{config:e.config,resolve:e.resolve,reject:e.reject}}),t=window.require;t.config(e.config),t(["vs/editor/editor.main"],function(t){var n=t.m||t;k(n),e.resolve(n)},function(t){e.reject(t)})}function k(e){_().monaco||E({monaco:e})}var z=new Promise(function(e,t){return E({resolve:e,reject:t})}),L=function(){var e=_(function(e){return{monaco:e.monaco,isInitialized:e.isInitialized,resolve:e.resolve}});if(!e.isInitialized){if(E({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),b(z);if(window.monaco&&window.monaco.editor)return k(window.monaco),e.resolve(window.monaco),b(z);S(A,M)(j)}return b(z)},C=n(52983),R={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},O={display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},P=function({children:e}){return C.createElement("div",{style:O},e)},F=(0,C.memo)(function({width:e,height:t,isEditorReady:n,loading:r,_ref:i,className:o,wrapperProps:a}){return C.createElement("section",{style:{...R.wrapper,width:e,height:t},...a},!n&&C.createElement(P,null,r),C.createElement("div",{ref:i,style:{...R.fullWidth,...!n&&R.hide},className:o}))}),T=function(e){(0,C.useEffect)(e,[])},D=function(e,t,n=!0){let r=(0,C.useRef)(!0);(0,C.useEffect)(r.current||!n?()=>{r.current=!1}:e,t)};function U(){}function N(e,t,n,r){return e.editor.getModel(I(e,r))||e.editor.createModel(t,n,r?I(e,r):void 0)}function I(e,t){return e.Uri.parse(t)}(0,C.memo)(function({original:e,modified:t,language:n,originalLanguage:r,modifiedLanguage:i,originalModelPath:o,modifiedModelPath:a,keepCurrentOriginalModel:s=!1,keepCurrentModifiedModel:l=!1,theme:u="light",loading:c="Loading...",options:d={},height:f="100%",width:h="100%",className:p,wrapperProps:m={},beforeMount:v=U,onMount:g=U}){let[y,S]=(0,C.useState)(!1),[w,b]=(0,C.useState)(!0),x=(0,C.useRef)(null),_=(0,C.useRef)(null),E=(0,C.useRef)(null),A=(0,C.useRef)(g),M=(0,C.useRef)(v),j=(0,C.useRef)(!1);T(()=>{let e=L();return e.then(e=>(_.current=e)&&b(!1)).catch(e=>e?.type!=="cancelation"&&console.error("Monaco initialization: error:",e)),()=>{let t;return x.current?(t=x.current?.getModel(),void(s||t?.original?.dispose(),l||t?.modified?.dispose(),x.current?.dispose())):e.cancel()}}),D(()=>{if(x.current&&_.current){let t=x.current.getOriginalEditor(),i=N(_.current,e||"",r||n||"text",o||"");i!==t.getModel()&&t.setModel(i)}},[o],y),D(()=>{if(x.current&&_.current){let e=x.current.getModifiedEditor(),r=N(_.current,t||"",i||n||"text",a||"");r!==e.getModel()&&e.setModel(r)}},[a],y),D(()=>{let e=x.current.getModifiedEditor();e.getOption(_.current.editor.EditorOption.readOnly)?e.setValue(t||""):t!==e.getValue()&&(e.executeEdits("",[{range:e.getModel().getFullModelRange(),text:t||"",forceMoveMarkers:!0}]),e.pushUndoStop())},[t],y),D(()=>{x.current?.getModel()?.original.setValue(e||"")},[e],y),D(()=>{let{original:e,modified:t}=x.current.getModel();_.current.editor.setModelLanguage(e,r||n||"text"),_.current.editor.setModelLanguage(t,i||n||"text")},[n,r,i],y),D(()=>{_.current?.editor.setTheme(u)},[u],y),D(()=>{x.current?.updateOptions(d)},[d],y);let k=(0,C.useCallback)(()=>{if(!_.current)return;M.current(_.current);let s=N(_.current,e||"",r||n||"text",o||""),l=N(_.current,t||"",i||n||"text",a||"");x.current?.setModel({original:s,modified:l})},[n,t,i,e,r,o,a]),z=(0,C.useCallback)(()=>{!j.current&&E.current&&(x.current=_.current.editor.createDiffEditor(E.current,{automaticLayout:!0,...d}),k(),_.current?.editor.setTheme(u),S(!0),j.current=!0)},[d,u,k]);return(0,C.useEffect)(()=>{y&&A.current(x.current,_.current)},[y]),(0,C.useEffect)(()=>{w||y||z()},[w,y,z]),C.createElement(F,{width:h,height:f,isEditorReady:y,loading:c,_ref:E,className:p,wrapperProps:m})});var B=function(e){let t=(0,C.useRef)();return(0,C.useEffect)(()=>{t.current=e},[e]),t.current},G=new Map,q=(0,C.memo)(function({defaultValue:e,defaultLanguage:t,defaultPath:n,value:r,language:i,path:o,theme:a="light",line:s,loading:l="Loading...",options:u={},overrideServices:c={},saveViewState:d=!0,keepCurrentModel:f=!1,width:h="100%",height:p="100%",className:m,wrapperProps:v={},beforeMount:g=U,onMount:y=U,onChange:S,onValidate:w=U}){let[b,x]=(0,C.useState)(!1),[_,E]=(0,C.useState)(!0),A=(0,C.useRef)(null),M=(0,C.useRef)(null),j=(0,C.useRef)(null),k=(0,C.useRef)(y),z=(0,C.useRef)(g),R=(0,C.useRef)(),O=(0,C.useRef)(r),P=B(o),I=(0,C.useRef)(!1),q=(0,C.useRef)(!1);T(()=>{let e=L();return e.then(e=>(A.current=e)&&E(!1)).catch(e=>e?.type!=="cancelation"&&console.error("Monaco initialization: error:",e)),()=>M.current?void(R.current?.dispose(),f?d&&G.set(o,M.current.saveViewState()):M.current.getModel()?.dispose(),M.current.dispose()):e.cancel()}),D(()=>{let a=N(A.current,e||r||"",t||i||"",o||n||"");a!==M.current?.getModel()&&(d&&G.set(P,M.current?.saveViewState()),M.current?.setModel(a),d&&M.current?.restoreViewState(G.get(o)))},[o],b),D(()=>{M.current?.updateOptions(u)},[u],b),D(()=>{M.current&&void 0!==r&&(M.current.getOption(A.current.editor.EditorOption.readOnly)?M.current.setValue(r):r===M.current.getValue()||(q.current=!0,M.current.executeEdits("",[{range:M.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),M.current.pushUndoStop(),q.current=!1))},[r],b),D(()=>{let e=M.current?.getModel();e&&i&&A.current?.editor.setModelLanguage(e,i)},[i],b),D(()=>{void 0!==s&&M.current?.revealLine(s)},[s],b),D(()=>{A.current?.editor.setTheme(a)},[a],b);let V=(0,C.useCallback)(()=>{if(!(!j.current||!A.current)&&!I.current){z.current(A.current);let l=o||n,f=N(A.current,r||e||"",t||i||"",l||"");M.current=A.current?.editor.create(j.current,{model:f,automaticLayout:!0,...u},c),d&&M.current.restoreViewState(G.get(l)),A.current.editor.setTheme(a),void 0!==s&&M.current.revealLine(s),x(!0),I.current=!0}},[e,t,n,r,i,o,u,c,d,a,s]);return(0,C.useEffect)(()=>{b&&k.current(M.current,A.current)},[b]),(0,C.useEffect)(()=>{_||b||V()},[_,b,V]),O.current=r,(0,C.useEffect)(()=>{b&&S&&(R.current?.dispose(),R.current=M.current?.onDidChangeModelContent(e=>{q.current||S(M.current.getValue(),e)}))},[b,S]),(0,C.useEffect)(()=>{if(b){let e=A.current.editor.onDidChangeMarkers(e=>{let t=M.current.getModel()?.uri;if(t&&e.find(e=>e.path===t.path)){let e=A.current.editor.getModelMarkers({resource:t});w?.(e)}});return()=>{e?.dispose()}}return()=>{}},[b,w]),C.createElement(F,{width:h,height:p,isEditorReady:b,loading:l,_ref:j,className:m,wrapperProps:v})})},61261:function(e,t,n){"use strict";n.d(t,{Y:function(){return o}});var r=n(16808),i=n(9375);r.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new i.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},r.ShaderLib.line={uniforms:i.rDY.merge([r.UniformsLib.common,r.UniformsLib.fog,r.UniformsLib.line]),vertexShader:`
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
		`};class o extends i.jyz{constructor(e){super({type:"LineMaterial",uniforms:i.rDY.clone(r.ShaderLib.line.uniforms),vertexShader:r.ShaderLib.line.vertexShader,fragmentShader:r.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){"use strict";let r,i;n.d(t,{w:function(){return x}});var o=n(9375),a=n(90845),s=n(61261);let l=new o.Ltg,u=new o.Pa4,c=new o.Pa4,d=new o.Ltg,f=new o.Ltg,h=new o.Ltg,p=new o.Pa4,m=new o.yGw,v=new o.Zzh,g=new o.Pa4,y=new o.ZzF,S=new o.aLr,w=new o.Ltg;function b(e,t,n){return w.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),w.multiplyScalar(1/w.w),w.x=i/n.width,w.y=i/n.height,w.applyMatrix4(e.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}class x extends o.Kj0{constructor(e=new a.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)u.fromBufferAttribute(t,e),c.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+u.distanceTo(c);let i=new o.$TI(r,2,1);return e.setAttribute("instanceDistanceStart",new o.kB5(i,1,0)),e.setAttribute("instanceDistanceEnd",new o.kB5(i,1,1)),this}raycast(e,t){let n,a;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let u=void 0!==e.params.Line2&&e.params.Line2.threshold||0;r=e.ray;let c=this.matrixWorld,w=this.geometry,x=this.material;if(i=x.linewidth+u,null===w.boundingSphere&&w.computeBoundingSphere(),S.copy(w.boundingSphere).applyMatrix4(c),s)n=.5*i;else{let e=Math.max(l.near,S.distanceToPoint(r.origin));n=b(l,e,x.resolution)}if(S.radius+=n,!1!==r.intersectsSphere(S)){if(null===w.boundingBox&&w.computeBoundingBox(),y.copy(w.boundingBox).applyMatrix4(c),s)a=.5*i;else{let e=Math.max(l.near,y.distanceToPoint(r.origin));a=b(l,e,x.resolution)}y.expandByScalar(a),!1!==r.intersectsBox(y)&&(s?function(e,t){let n=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,u=Math.min(a.instanceCount,s.count);for(let a=0;a<u;a++){v.start.fromBufferAttribute(s,a),v.end.fromBufferAttribute(l,a),v.applyMatrix4(n);let u=new o.Pa4,c=new o.Pa4;r.distanceSqToSegment(v.start,v.end,c,u),c.distanceTo(u)<.5*i&&t.push({point:c,pointOnLine:u,distance:r.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}(this,t):function(e,t,n){let a=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,u=e.geometry,c=u.attributes.instanceStart,y=u.attributes.instanceEnd,S=Math.min(u.instanceCount,c.count),w=-t.near;r.at(1,h),h.w=1,h.applyMatrix4(t.matrixWorldInverse),h.applyMatrix4(a),h.multiplyScalar(1/h.w),h.x*=s.x/2,h.y*=s.y/2,h.z=0,p.copy(h),m.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<S;t++){if(d.fromBufferAttribute(c,t),f.fromBufferAttribute(y,t),d.w=1,f.w=1,d.applyMatrix4(m),f.applyMatrix4(m),d.z>w&&f.z>w)continue;if(d.z>w){let e=d.z-f.z,t=(d.z-w)/e;d.lerp(f,t)}else if(f.z>w){let e=f.z-d.z,t=(f.z-w)/e;f.lerp(d,t)}d.applyMatrix4(a),f.applyMatrix4(a),d.multiplyScalar(1/d.w),f.multiplyScalar(1/f.w),d.x*=s.x/2,d.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(d),v.start.z=0,v.end.copy(f),v.end.z=0;let u=v.closestPointToPointParameter(p,!0);v.at(u,g);let h=o.M8C.lerp(d.z,f.z,u),S=h>=-1&&h<=1,b=p.distanceTo(g)<.5*i;if(S&&b){v.start.fromBufferAttribute(c,t),v.end.fromBufferAttribute(y,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let i=new o.Pa4,a=new o.Pa4;r.distanceSqToSegment(v.start,v.end,a,i),n.push({point:a,pointOnLine:i,distance:r.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){"use strict";n.d(t,{z:function(){return a}});var r=n(9375);let i=new r.ZzF,o=new r.Pa4;class a extends r.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new r.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new r.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new r.$TI(t,6,1);return this.setAttribute("instanceStart",new r.kB5(n,3,0)),this.setAttribute("instanceEnd",new r.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new r.$TI(t,6,1);return this.setAttribute("instanceColorStart",new r.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new r.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new r.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new r.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),i.setFromBufferAttribute(t),this.boundingBox.union(i))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new r.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)o.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(o)),o.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(o));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){"use strict";n.d(t,{XR:function(){return r}});let r=e=>(t,n,r)=>{let i=r.subscribe;return r.subscribe=(e,t,n)=>{let o=e;if(t){let i=(null==n?void 0:n.equalityFn)||Object.is,a=e(r.getState());o=n=>{let r=e(n);if(!i(a,r)){let e=a;t(a=r,e)}},(null==n?void 0:n.fireImmediately)&&t(a,a)}return i(o)},e(t,n,r)}},73542:function(e,t,n){"use strict";n.d(t,{U:function(){return l},o:function(){return a}});var r=n(52983),i=n(98565);let o=e=>e;function a(e,t=o){let n=r.useSyncExternalStore(e.subscribe,r.useCallback(()=>t(e.getState()),[e,t]),r.useCallback(()=>t(e.getInitialState()),[e,t]));return r.useDebugValue(n),n}let s=e=>{let t=(0,i.M)(e),n=e=>a(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){"use strict";n.d(t,{M:function(){return i}});let r=e=>{let t;let n=new Set,r=(e,r)=>{let i="function"==typeof e?e(t):e;if(!Object.is(i,t)){let e=t;t=(null!=r?r:"object"!=typeof i||null===i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,o={setState:r,getState:i,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(r,i,o);return o},i=e=>e?r(e):r}}]);