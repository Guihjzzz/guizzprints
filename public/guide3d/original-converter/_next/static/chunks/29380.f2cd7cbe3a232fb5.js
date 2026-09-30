(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[29380,3120,24654],{58109:function(e,t,n){"use strict";n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),o=n(52983),a=n(9375);let s=o.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...c},u){let d=o.useRef(null),f=o.useRef(null),m=new a._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=d.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(m),e.getWorldQuaternion(d.current.quaternion).premultiply(m.invert()),n&&(d.current.rotation.x=i.x),s&&(d.current.rotation.y=i.y),l&&(d.current.rotation.z=i.z)}),o.useImperativeHandle(u,()=>f.current,[]),o.createElement("group",(0,i.Z)({ref:f},c),o.createElement("group",{ref:d},e))})},81125:function(e,t,n){"use strict";n.d(t,{q:function(){return x}});var i=n(99217),r=n(62510),o=n(52983),a=n(9375),s=n(30535),l=Object.defineProperty,c=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,u=(e,t,n)=>(c(e,"symbol"!=typeof t?t+"":t,n),n);let d=new a.USm(0,0,0,"YXZ"),f=new a.Pa4,m={type:"change"},p={type:"lock"},h={type:"unlock"},v=Math.PI/2;class y extends s.p{constructor(e,t){super(),u(this,"camera"),u(this,"domElement"),u(this,"isLocked"),u(this,"minPolarAngle"),u(this,"maxPolarAngle"),u(this,"pointerSpeed"),u(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(d.setFromQuaternion(this.camera.quaternion),d.y-=.002*e.movementX*this.pointerSpeed,d.x-=.002*e.movementY*this.pointerSpeed,d.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,d.x)),this.camera.quaternion.setFromEuler(d),this.dispatchEvent(m))}),u(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(p),this.isLocked=!0):(this.dispatchEvent(h),this.isLocked=!1))}),u(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),u(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),u(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),u(this,"dispose",()=>{this.disconnect()}),u(this,"getObject",()=>this.camera),u(this,"direction",new a.Pa4(0,0,-1)),u(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),u(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),u(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),u(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),u(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let x=o.forwardRef(({domElement:e,selector:t,onChange:n,onLock:a,onUnlock:s,enabled:l=!0,makeDefault:c,...u},d)=>{let{camera:f,...m}=u,p=(0,r.D)(e=>e.setEvents),h=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),x=(0,r.D)(e=>e.invalidate),g=(0,r.D)(e=>e.events),b=(0,r.D)(e=>e.get),w=(0,r.D)(e=>e.set),S=f||v,E=e||g.connected||h.domElement,_=o.useMemo(()=>new y(S),[S]);return o.useEffect(()=>{if(l){_.connect(E);let e=b().events.compute;return p({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{_.disconnect(),p({compute:e})}}},[l,_]),o.useEffect(()=>{let e=e=>{x(),n&&n(e)};_.addEventListener("change",e),a&&_.addEventListener("lock",a),s&&_.addEventListener("unlock",s);let i=()=>_.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{_.removeEventListener("change",e),a&&_.removeEventListener("lock",a),s&&_.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,a,s,t,_,x]),o.useEffect(()=>{if(c){let e=b().controls;return w({controls:_}),()=>w({controls:e})}},[c,_]),o.createElement("primitive",(0,i.Z)({ref:d,object:_},m))})},73420:function(e,t,n){"use strict";n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),o=n(75575);let a=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),c=i.useMemo(()=>(0,r.U)((0,o.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),u=i.useMemo(()=>[c.subscribe,c.getState,c],[l]),d=c.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{d({[e]:t}),n&&n(e,t,u[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:o,up:a}=i;i.pressed=!0,(a||!o)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:o}=i;i.pressed=!1,o&&r(!1)},o=s||window;return o.addEventListener("keydown",i,{passive:!0}),o.addEventListener("keyup",r,{passive:!0}),()=>{o.removeEventListener("keydown",i),o.removeEventListener("keyup",r)}},[s,l]),i.createElement(a.Provider,{value:u,children:t})}function l(e){let[t,n,r]=i.useContext(a);return e?r(e):[t,n]}},14978:function(e,t,n){var i="Expected a function",r=0/0,o=/^\s+|\s+$/g,a=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,c=parseInt,u="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,d="object"==typeof self&&self&&self.Object===Object&&self,f=u||d||Function("return this")(),m=Object.prototype.toString,p=Math.max,h=Math.min,v=function(){return f.Date.now()};function y(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function x(e){if("number"==typeof e)return e;if("symbol"==typeof(t=e)||t&&"object"==typeof t&&"[object Symbol]"==m.call(t))return r;if(y(e)){var t,n="function"==typeof e.valueOf?e.valueOf():e;e=y(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(o,"");var i=s.test(e);return i||l.test(e)?c(e.slice(2),i?2:8):a.test(e)?r:+e}e.exports=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw TypeError(i);return y(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),function(e,t,n){var r,o,a,s,l,c,u=0,d=!1,f=!1,m=!0;if("function"!=typeof e)throw TypeError(i);function g(t){var n=r,i=o;return r=o=void 0,u=t,s=e.apply(i,n)}function b(e){var n=e-c,i=e-u;return void 0===c||n>=t||n<0||f&&i>=a}function w(){var e,n,i,r=v();if(b(r))return S(r);l=setTimeout(w,(e=r-c,n=r-u,i=t-e,f?h(i,a-n):i))}function S(e){return(l=void 0,m&&r)?g(e):(r=o=void 0,s)}function E(){var e,n=v(),i=b(n);if(r=arguments,o=this,c=n,i){if(void 0===l)return u=e=c,l=setTimeout(w,t),d?g(e):s;if(f)return l=setTimeout(w,t),g(c)}return void 0===l&&(l=setTimeout(w,t)),s}return t=x(t)||0,y(n)&&(d=!!n.leading,a=(f="maxWait"in n)?p(x(n.maxWait)||0,t):a,m="trailing"in n?!!n.trailing:m),E.cancel=function(){void 0!==l&&clearTimeout(l),u=0,r=c=o=l=void 0},E.flush=function(){return void 0===l?s:S(v())},E}(e,t,{leading:r,maxWait:t,trailing:o})}},30280:function(e,t,n){"use strict";n.d(t,{H:function(){return u}});var i=n(45045),r=n(82911),o=n(26398),a=n(25610),s=n(1848),l=n(19938),c=n(97458),u=(0,o.G)(function(e,t){let{className:n,motionProps:o,...u}=e,{reduceMotion:d}=(0,i.EF)(),{getPanelProps:f,isOpen:m}=(0,r.bB)(),p=f(u,t),h=(0,l.cx)("chakra-accordion__panel",n),v=(0,r.YO)();d||delete p.hidden;let y=(0,c.jsx)(a.m.div,{...p,__css:v.panel,className:h});return d?y:(0,c.jsx)(s.U,{in:m,...o,children:y})});u.displayName="AccordionPanel"},45045:function(e,t,n){"use strict";n.d(t,{As:function(){return c},EF:function(){return d},Zl:function(){return f},a2:function(){return u}});var i=n(82911),r=n(96248),o=n(79206),a=n(16227),s=n(19938),l=n(52983);function c(e){let{onChange:t,defaultIndex:n,index:r,allowMultiple:a,allowToggle:c,...u}=e;(function(e){let t=e.index||e.defaultIndex,n=null!=t&&!Array.isArray(t)&&e.allowMultiple;(0,s.ZK)({condition:!!n,message:`If 'allowMultiple' is passed, then 'index' or 'defaultIndex' must be an array. You passed: ${typeof t},`})})(e),(0,s.ZK)({condition:!!(e.allowMultiple&&e.allowToggle),message:"If 'allowMultiple' is passed, 'allowToggle' will be ignored. Either remove 'allowToggle' or 'allowMultiple' depending on whether you want multiple accordions visible or not"});let d=(0,i._v)(),[f,m]=(0,l.useState)(-1);(0,l.useEffect)(()=>()=>{m(-1)},[]);let[p,h]=(0,o.T)({value:r,defaultValue:()=>a?null!=n?n:[]:null!=n?n:-1,onChange:t});return{index:p,setIndex:h,htmlProps:u,getAccordionItemProps:e=>{let t=!1;return null!==e&&(t=Array.isArray(p)?p.includes(e):p===e),{isOpen:t,onChange:t=>{null!==e&&(a&&Array.isArray(p)?h(t?p.concat(e):p.filter(t=>t!==e)):t?h(e):c&&h(-1))}}},focusedIndex:f,setFocusedIndex:m,descendants:d}}var[u,d]=(0,r.k)({name:"AccordionContext",hookName:"useAccordionContext",providerName:"Accordion"});function f(e){var t;let{isDisabled:n,isFocusable:r,id:o,...c}=e,{getAccordionItemProps:u,setFocusedIndex:f}=d(),m=(0,l.useRef)(null),p=(0,l.useId)(),h=null!=o?o:p,v=`accordion-button-${h}`,y=`accordion-panel-${h}`;(0,s.ZK)({condition:!!(e.isFocusable&&!e.isDisabled),message:`Using only 'isFocusable', this prop is reserved for situations where you pass 'isDisabled' but you still want the element to receive focus (A11y). Either remove it or pass 'isDisabled' as well.
    `});let{register:x,index:g,descendants:b}=(0,i.mc)({disabled:n&&!r}),{isOpen:w,onChange:S}=u(-1===g?null:g);t={isOpen:w,isDisabled:n},(0,s.ZK)({condition:t.isOpen&&!!t.isDisabled,message:"Cannot open a disabled accordion item"});let E=(0,l.useCallback)(()=>{null==S||S(!w),f(g)},[g,f,w,S]),_=(0,l.useCallback)(e=>{let t={ArrowDown:()=>{let e=b.nextEnabled(g);null==e||e.node.focus()},ArrowUp:()=>{let e=b.prevEnabled(g);null==e||e.node.focus()},Home:()=>{let e=b.firstEnabled();null==e||e.node.focus()},End:()=>{let e=b.lastEnabled();null==e||e.node.focus()}}[e.key];t&&(e.preventDefault(),t(e))},[b,g]),k=(0,l.useCallback)(()=>{f(g)},[f,g]),j=(0,l.useCallback)(function(e={},t=null){return{...e,type:"button",ref:(0,a.lq)(x,m,t),id:v,disabled:!!n,"aria-expanded":!!w,"aria-controls":y,onClick:(0,s.v0)(e.onClick,E),onFocus:(0,s.v0)(e.onFocus,k),onKeyDown:(0,s.v0)(e.onKeyDown,_)}},[v,n,w,E,k,_,y,x]),A=(0,l.useCallback)(function(e={},t=null){return{...e,ref:t,role:"region",id:y,"aria-labelledby":v,hidden:!w}},[v,w,y]);return{isOpen:w,isDisabled:n,isFocusable:r,onOpen:()=>{null==S||S(!0)},onClose:()=>{null==S||S(!1)},getButtonProps:j,getPanelProps:A,htmlProps:c}}},74827:function(e,t,n){"use strict";n.d(t,{U:function(){return f}});var i=n(45045),r=n(82911),o=n(26398),a=n(15627),s=n(42089),l=n(25610),c=n(19938),u=n(52983),d=n(97458),f=(0,o.G)(function({children:e,reduceMotion:t,...n},o){let f=(0,a.jC)("Accordion",n),m=(0,s.Lr)(n),{htmlProps:p,descendants:h,...v}=(0,i.As)(m),y=(0,u.useMemo)(()=>({...v,reduceMotion:!!t}),[v,t]);return(0,d.jsx)(r.di,{value:h,children:(0,d.jsx)(i.a2,{value:y,children:(0,d.jsx)(r.lh,{value:f,children:(0,d.jsx)(l.m.div,{ref:o,...p,className:(0,c.cx)("chakra-accordion",n.className),__css:f.root,children:e})})})})});f.displayName="Accordion"},26473:function(e,t,n){"use strict";n.d(t,{Q:function(){return u}});var i=n(45045),r=n(82911),o=n(26398),a=n(25610),s=n(19938),l=n(52983),c=n(97458),u=(0,o.G)(function(e,t){let{children:n,className:o}=e,{htmlProps:u,...d}=(0,i.Zl)(e),f={...(0,r.YO)().container,overflowAnchor:"none"},m=(0,l.useMemo)(()=>d,[d]);return(0,c.jsx)(r.ec,{value:m,children:(0,c.jsx)(a.m.div,{ref:t,...u,className:(0,s.cx)("chakra-accordion__item",o),__css:f,children:"function"==typeof n?n({isExpanded:!!d.isOpen,isDisabled:!!d.isDisabled}):n})})});u.displayName="AccordionItem"},7498:function(e,t,n){"use strict";n.d(t,{K:function(){return l}});var i=n(82911),r=n(26398),o=n(25610),a=n(19938),s=n(97458),l=(0,r.G)(function(e,t){let{getButtonProps:n}=(0,i.bB)(),r=n(e,t),l={display:"flex",alignItems:"center",width:"100%",outline:0,...(0,i.YO)().button};return(0,s.jsx)(o.m.button,{...r,className:(0,a.cx)("chakra-accordion__button",e.className),__css:l})});l.displayName="AccordionButton"},82911:function(e,t,n){"use strict";n.d(t,{YO:function(){return a},_v:function(){return d},bB:function(){return l},di:function(){return c},ec:function(){return s},lh:function(){return o},mc:function(){return f}});var i=n(75548),r=n(96248),[o,a]=(0,r.k)({name:"AccordionStylesContext",hookName:"useAccordionStyles",providerName:"<Accordion />"}),[s,l]=(0,r.k)({name:"AccordionItemContext",hookName:"useAccordionItemContext",providerName:"<AccordionItem />"}),[c,u,d,f]=(0,i.n)()},88239:function(e,t,n){"use strict";n.d(t,{h:function(){return d}});var i=n(96528),r=n(26398),o=n(25610),a=n(19938),s=n(52983),l=n(97458),c={horizontal:{"> *:first-of-type:not(:last-of-type)":{borderEndRadius:0},"> *:not(:first-of-type):not(:last-of-type)":{borderRadius:0},"> *:not(:first-of-type):last-of-type":{borderStartRadius:0}},vertical:{"> *:first-of-type:not(:last-of-type)":{borderBottomRadius:0},"> *:not(:first-of-type):not(:last-of-type)":{borderRadius:0},"> *:not(:first-of-type):last-of-type":{borderTopRadius:0}}},u={horizontal:e=>({"& > *:not(style) ~ *:not(style)":{marginStart:e}}),vertical:e=>({"& > *:not(style) ~ *:not(style)":{marginTop:e}})},d=(0,r.G)(function(e,t){let{size:n,colorScheme:r,variant:d,className:f,spacing:m="0.5rem",isAttached:p,isDisabled:h,orientation:v="horizontal",...y}=e,x=(0,a.cx)("chakra-button__group",f),g=(0,s.useMemo)(()=>({size:n,colorScheme:r,variant:d,isDisabled:h}),[n,r,d,h]),b={display:"inline-flex",...p?c[v]:u[v](m)},w="vertical"===v;return(0,l.jsx)(i.D,{value:g,children:(0,l.jsx)(o.m.div,{ref:t,role:"group",__css:b,className:x,"data-attached":p?"":void 0,"data-orientation":v,flexDir:w?"column":void 0,...y})})});d.displayName="ButtonGroup"},67844:function(e,t,n){"use strict";n.d(t,{X:function(){return w}});var i=n(52983),r=n(20879),o=n(25610),a=n(97458);function s(e){return(0,a.jsx)(o.m.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...e,children:(0,a.jsx)("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function l(e){return(0,a.jsx)(o.m.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...e,children:(0,a.jsx)("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function c(e){let{isIndeterminate:t,isChecked:n,...i}=e;return n||t?(0,a.jsx)(o.m.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:(0,a.jsx)(t?l:s,{...i})}):null}var u=n(78486),d=n(19938),f=n(10915),m=n(26398),p=n(15627),h=n(42089),v={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},y={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},x=(0,f.F4)({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),g=(0,f.F4)({from:{opacity:0},to:{opacity:1}}),b=(0,f.F4)({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),w=(0,m.G)(function(e,t){let n=(0,r.J)(),s={...n,...e},l=(0,p.jC)("Checkbox",s),f=(0,h.Lr)(e),{spacing:m="0.5rem",className:w,children:S,iconColor:E,iconSize:_,icon:k=(0,a.jsx)(c,{}),isChecked:j,isDisabled:A=null==n?void 0:n.isDisabled,onChange:C,inputProps:L,...M}=f,z=j;(null==n?void 0:n.value)&&f.value&&(z=n.value.includes(f.value));let P=C;(null==n?void 0:n.onChange)&&f.value&&(P=(0,d.PP)(n.onChange,C));let{state:N,getInputProps:D,getCheckboxProps:U,getLabelProps:B,getRootProps:I}=(0,u.O)({...M,isDisabled:A,isChecked:z,onChange:P}),T=function(e){let[t,n]=(0,i.useState)(e),[r,o]=(0,i.useState)(!1);return e!==t&&(o(!0),n(e)),r}(N.isChecked),F=(0,i.useMemo)(()=>({animation:T?N.isIndeterminate?`${g} 20ms linear, ${b} 200ms linear`:`${x} 200ms linear`:void 0,fontSize:_,color:E,...l.icon}),[E,_,T,N.isIndeterminate,l.icon]),O=(0,i.cloneElement)(k,{__css:F,isIndeterminate:N.isIndeterminate,isChecked:N.isChecked});return(0,a.jsxs)(o.m.label,{__css:{...y,...l.container},className:(0,d.cx)("chakra-checkbox",w),...I(),children:[(0,a.jsx)("input",{className:"chakra-checkbox__input",...D(L,t)}),(0,a.jsx)(o.m.span,{__css:{...v,...l.control},className:"chakra-checkbox__control",...U(),children:O}),S&&(0,a.jsx)(o.m.span,{className:"chakra-checkbox__label",...B(),__css:{marginStart:m,...l.label},children:S})]})});w.displayName="Checkbox"},20879:function(e,t,n){"use strict";n.d(t,{J:function(){return r},z:function(){return i}});var[i,r]=(0,n(96248).k)({name:"CheckboxGroupContext",strict:!1})},87059:function(e,t,n){"use strict";n.d(t,{K:function(){return a},Y:function(){return o}});var i=n(71327),r=n(19938);function o(e){let{isDisabled:t,isInvalid:n,isReadOnly:i,isRequired:o,...s}=a(e);return{...s,disabled:t,readOnly:i,required:o,"aria-invalid":(0,r.Qm)(n),"aria-required":(0,r.Qm)(o),"aria-readonly":(0,r.Qm)(i)}}function a(e){var t,n,o;let a=(0,i.NJ)(),{id:s,disabled:l,readOnly:c,required:u,isRequired:d,isInvalid:f,isReadOnly:m,isDisabled:p,onFocus:h,onBlur:v,...y}=e,x=e["aria-describedby"]?[e["aria-describedby"]]:[];return(null==a?void 0:a.hasFeedbackText)&&(null==a?void 0:a.isInvalid)&&x.push(a.feedbackId),(null==a?void 0:a.hasHelpText)&&x.push(a.helpTextId),{...y,"aria-describedby":x.join(" ")||void 0,id:null!=s?s:null==a?void 0:a.id,isDisabled:null!=(t=null!=l?l:p)?t:null==a?void 0:a.isDisabled,isReadOnly:null!=(n=null!=c?c:m)?n:null==a?void 0:a.isReadOnly,isRequired:null!=(o=null!=u?u:d)?o:null==a?void 0:a.isRequired,isInvalid:null!=f?f:null==a?void 0:a.isInvalid,onFocus:(0,r.v0)(null==a?void 0:a.onFocus,h),onBlur:(0,r.v0)(null==a?void 0:a.onBlur,v)}}},71327:function(e,t,n){"use strict";n.d(t,{NI:function(){return v},NJ:function(){return h},Q6:function(){return y},e:function(){return m}});var i=n(96248),r=n(16227),o=n(26398),a=n(15627),s=n(42089),l=n(25610),c=n(19938),u=n(52983),d=n(97458),[f,m]=(0,i.k)({name:"FormControlStylesContext",errorMessage:"useFormControlStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<FormControl />\" "}),[p,h]=(0,i.k)({strict:!1,name:"FormControlContext"}),v=(0,o.G)(function(e,t){let n=(0,a.jC)("Form",e),{getRootProps:i,htmlProps:o,...m}=function(e){let{id:t,isRequired:n,isInvalid:i,isDisabled:o,isReadOnly:a,...s}=e,l=(0,u.useId)(),d=t||`field-${l}`,f=`${d}-label`,m=`${d}-feedback`,p=`${d}-helptext`,[h,v]=(0,u.useState)(!1),[y,x]=(0,u.useState)(!1),[g,b]=(0,u.useState)(!1),w=(0,u.useCallback)((e={},t=null)=>({id:p,...e,ref:(0,r.lq)(t,e=>{e&&x(!0)})}),[p]),S=(0,u.useCallback)((e={},t=null)=>({...e,ref:t,"data-focus":(0,c.PB)(g),"data-disabled":(0,c.PB)(o),"data-invalid":(0,c.PB)(i),"data-readonly":(0,c.PB)(a),id:void 0!==e.id?e.id:f,htmlFor:void 0!==e.htmlFor?e.htmlFor:d}),[d,o,g,i,a,f]),E=(0,u.useCallback)((e={},t=null)=>({id:m,...e,ref:(0,r.lq)(t,e=>{e&&v(!0)}),"aria-live":"polite"}),[m]),_=(0,u.useCallback)((e={},t=null)=>({...e,...s,ref:t,role:"group","data-focus":(0,c.PB)(g),"data-disabled":(0,c.PB)(o),"data-invalid":(0,c.PB)(i),"data-readonly":(0,c.PB)(a)}),[s,o,g,i,a]);return{isRequired:!!n,isInvalid:!!i,isReadOnly:!!a,isDisabled:!!o,isFocused:!!g,onFocus:()=>b(!0),onBlur:()=>b(!1),hasFeedbackText:h,setHasFeedbackText:v,hasHelpText:y,setHasHelpText:x,id:d,labelId:f,feedbackId:m,helpTextId:p,htmlProps:s,getHelpTextProps:w,getErrorMessageProps:E,getRootProps:_,getLabelProps:S,getRequiredIndicatorProps:(0,u.useCallback)((e={},t=null)=>({...e,ref:t,role:"presentation","aria-hidden":!0,children:e.children||"*"}),[])}}((0,s.Lr)(e)),h=(0,c.cx)("chakra-form-control",e.className);return(0,d.jsx)(p,{value:m,children:(0,d.jsx)(f,{value:n,children:(0,d.jsx)(l.m.div,{...i({},t),className:h,__css:n.container})})})});v.displayName="FormControl";var y=(0,o.G)(function(e,t){let n=h(),i=m(),r=(0,c.cx)("chakra-form__helper-text",e.className);return(0,d.jsx)(l.m.div,{...null==n?void 0:n.getHelpTextProps(e,t),__css:i.helperText,className:r})});y.displayName="FormHelperText"},3347:function(e,t,n){"use strict";n.d(t,{I:function(){return u}});var i=n(87059),r=n(26398),o=n(15627),a=n(42089),s=n(25610),l=n(19938),c=n(97458),u=(0,r.G)(function(e,t){let{htmlSize:n,...r}=e,u=(0,o.jC)("Input",r),d=(0,a.Lr)(r),f=(0,i.Y)(d),m=(0,l.cx)("chakra-input",e.className);return(0,c.jsx)(s.m.input,{size:n,...f,__css:u.field,ref:t,className:m})});u.displayName="Input",u.id="Input"},86169:function(e,t,n){"use strict";n.d(t,{U:function(){return a}});var i=n(63009),r=n(26398),o=n(97458),a=(0,r.G)((e,t)=>(0,o.jsx)(i.K,{align:"center",...e,direction:"row",ref:t}));a.displayName="HStack"},52250:function(e,t,n){"use strict";n.d(t,{r:function(){return a}});var i=n(26398),r=n(25610),o=n(97458),a=(0,i.G)(function(e,t){let{templateAreas:n,gap:i,rowGap:a,columnGap:s,column:l,row:c,autoFlow:u,autoRows:d,templateRows:f,autoColumns:m,templateColumns:p,...h}=e;return(0,o.jsx)(r.m.div,{ref:t,__css:{display:"grid",gridTemplateAreas:n,gridGap:i,gridRowGap:a,gridColumnGap:s,gridAutoColumns:m,gridColumn:l,gridRow:c,gridAutoFlow:u,gridAutoRows:d,gridTemplateRows:f,gridTemplateColumns:p},...h})});a.displayName="Grid"},7070:function(e,t,n){"use strict";n.d(t,{M:function(){return c}});var i=n(52250),r=n(26398),o=n(61112),a=n(71778),s=n(9878),l=n(97458),c=(0,r.G)(function(e,t){let{columns:n,spacingX:r,spacingY:c,spacing:u,minChildWidth:d,...f}=e,m=(0,o.F)(),p=d?(0,s.XQ)(d,e=>{let t=(0,a.LP)("sizes",e,"number"==typeof e?`${e}px`:e)(m);return null===e?null:`repeat(auto-fit, minmax(${t}, 1fr))`}):(0,s.XQ)(n,e=>null===e?null:`repeat(${e}, minmax(0, 1fr))`);return(0,l.jsx)(i.r,{ref:t,gap:u,columnGap:r,rowGap:c,templateColumns:p,...f})});c.displayName="SimpleGrid"},45276:function(e,t,n){"use strict";n.d(t,{C:function(){return c}});var i=n(26398),r=n(15627),o=n(42089),a=n(25610),s=n(19938),l=n(97458),c=(0,i.G)(function(e,t){let n=(0,r.mq)("Badge",e),{className:i,...c}=(0,o.Lr)(e);return(0,l.jsx)(a.m.span,{ref:t,className:(0,s.cx)("chakra-badge",e.className),...c,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...n}})});c.displayName="Badge"},86929:function(e,t,n){"use strict";n.d(t,{o:function(){return l}});var i=n(8464),r=n(97878),o=n(19938),a=n(26398),s=n(97458),l=(0,a.G)((e,t)=>{let{onClick:n,className:a,...l}=e,{onClose:c}=(0,i.vR)(),u=(0,o.cx)("chakra-modal__close-btn",a),d=(0,i.I_)();return(0,s.jsx)(r.P,{ref:t,__css:d.closeButton,className:u,onClick:(0,o.v0)(n,e=>{e.stopPropagation(),c()}),...l})});l.displayName="ModalCloseButton"},94086:function(e,t,n){"use strict";function i(e,t){let n=function(e){let t=parseFloat(e);return"number"!=typeof t||Number.isNaN(t)?0:t}(e),i=10**(null!=t?t:10);return n=Math.round(n*i)/i,t?n.toFixed(t):n.toString()}function r(e){if(!Number.isFinite(e))return 0;let t=1,n=0;for(;Math.round(e*t)/t!==e;)t*=10,n+=1;return n}function o(e,t,n){return(e-t)*100/(n-t)}function a(e,t,n){return(n-t)*e+t}function s(e,t,n){return i(Math.round((e-t)/n)*n+t,r(n))}function l(e,t,n){return null==e?e:(n<t&&console.warn("clamp: max cannot be less than min"),Math.min(Math.max(e,t),n))}n.d(t,{HU:function(){return l},Rg:function(){return o},WP:function(){return s},WS:function(){return a},Zd:function(){return i},vk:function(){return r}})},38834:function(e,t,n){"use strict";n.d(t,{P:function(){return f}});var i=n(19938),r=n(26398),o=n(25610),a=n(97458),s=(0,r.G)(function(e,t){let{children:n,placeholder:r,className:s,...l}=e;return(0,a.jsxs)(o.m.select,{...l,ref:t,className:(0,i.cx)("chakra-select",s),children:[r&&(0,a.jsx)("option",{value:"",children:r}),n]})});s.displayName="SelectField";var l=n(87059),c=n(15627),u=n(42089),d=n(52983),f=(0,r.G)((e,t)=>{var n;let r=(0,c.jC)("Select",e),{rootProps:d,placeholder:f,icon:m,color:p,height:v,h:y,minH:x,minHeight:g,iconColor:b,iconSize:w,...S}=(0,u.Lr)(e),[E,_]=function(e,t){let n={},i={};for(let[r,o]of Object.entries(e))t.includes(r)?n[r]=o:i[r]=o;return[n,i]}(S,u.oE),k=(0,l.Y)(_),j={paddingEnd:"2rem",...r.field,_focus:{zIndex:"unset",...null==(n=r.field)?void 0:n._focus}};return(0,a.jsxs)(o.m.div,{className:"chakra-select__wrapper",__css:{width:"100%",height:"fit-content",position:"relative",color:p},...E,...d,children:[(0,a.jsx)(s,{ref:t,height:null!=y?y:v,minH:null!=x?x:g,placeholder:f,...k,__css:j,children:e.children}),(0,a.jsx)(h,{"data-disabled":(0,i.PB)(k.disabled),...(b||p)&&{color:b||p},__css:r.icon,...w&&{fontSize:w},children:m})]})});f.displayName="Select";var m=e=>(0,a.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,a.jsx)("path",{fill:"currentColor",d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"})}),p=(0,o.m)("div",{baseStyle:{position:"absolute",display:"inline-flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",top:"50%",transform:"translateY(-50%)"}}),h=e=>{let{children:t=(0,a.jsx)(m,{}),...n}=e,i=(0,d.cloneElement)(t,{role:"presentation",className:"chakra-select__icon",focusable:!1,"aria-hidden":!0,style:{width:"1em",height:"1em",color:"currentColor"}});return(0,a.jsx)(p,{...n,className:"chakra-select__icon-wrapper",children:(0,d.isValidElement)(t)?i:null})};h.displayName="SelectIcon"},14056:function(e,t,n){"use strict";n.d(t,{r:function(){return d}});var i=n(78486),r=n(19938),o=n(26398),a=n(15627),s=n(42089),l=n(25610),c=n(52983),u=n(97458),d=(0,o.G)(function(e,t){let n=(0,a.jC)("Switch",e),{spacing:o="0.5rem",children:d,...f}=(0,s.Lr)(e),{getIndicatorProps:m,getInputProps:p,getCheckboxProps:h,getRootProps:v,getLabelProps:y}=(0,i.O)(f),x=(0,c.useMemo)(()=>({display:"inline-block",position:"relative",verticalAlign:"middle",lineHeight:0,...n.container}),[n.container]),g=(0,c.useMemo)(()=>({display:"inline-flex",flexShrink:0,justifyContent:"flex-start",boxSizing:"content-box",cursor:"pointer",...n.track}),[n.track]),b=(0,c.useMemo)(()=>({userSelect:"none",marginStart:o,...n.label}),[o,n.label]);return(0,u.jsxs)(l.m.label,{...v(),className:(0,r.cx)("chakra-switch",e.className),__css:x,children:[(0,u.jsx)("input",{className:"chakra-switch__input",...p({},t)}),(0,u.jsx)(l.m.span,{...h(),className:"chakra-switch__track",__css:g,children:(0,u.jsx)(l.m.span,{__css:n.thumb,className:"chakra-switch__thumb",...m()})}),d&&(0,u.jsx)(l.m.span,{className:"chakra-switch__label",...y(),__css:b,children:d})]})});d.displayName="Switch"},1848:function(e,t,n){"use strict";n.d(t,{U:function(){return f}});var i=n(40393),r=n(19938),o=n(44659),a=n(39267),s=n(52983),l=n(97458),c=e=>null!=e&&parseInt(e.toString(),10)>0,u={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},d={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:r,delay:o})=>{var a;return{...e&&{opacity:c(t)?1:0},height:t,transitionEnd:null==r?void 0:r.exit,transition:null!=(a=null==n?void 0:n.exit)?a:i.p$.exit(u.exit,o)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:r,delay:o})=>{var a;return{...e&&{opacity:1},height:t,transitionEnd:null==r?void 0:r.enter,transition:null!=(a=null==n?void 0:n.enter)?a:i.p$.enter(u.enter,o)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:i,animateOpacity:c=!0,startingHeight:u=0,endingHeight:f="auto",style:m,className:p,transition:h,transitionEnd:v,...y}=e,[x,g]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{g(!0)});return()=>clearTimeout(e)},[]),(0,r.ZK)({condition:Number(u)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let b=parseFloat(u.toString())>0,w={startingHeight:u,endingHeight:f,animateOpacity:c,transition:x?h:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:i?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:b?"block":"none"}}},S=!i||n,E=n||i?"enter":"exit";return(0,l.jsx)(o.M,{initial:!1,custom:w,children:S&&(0,l.jsx)(a.E.div,{ref:t,...y,className:(0,r.cx)("chakra-collapse",p),style:{overflow:"hidden",display:"block",...m},custom:w,variants:d,initial:!!i&&"exit",animate:E,exit:"exit"})})});f.displayName="Collapse"},95569:function(e,t,n){"use strict";n.d(t,{v:function(){return i}});var i=n(60413);t.Z=i},4248:function(e,t,n){"use strict";n.d(t,{i:function(){return i}});let i=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){"use strict";n.d(t,{Y:function(){return o}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class o extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){"use strict";let i,r;n.d(t,{w:function(){return S}});var o=n(9375),a=n(90845),s=n(61261);let l=new o.Ltg,c=new o.Pa4,u=new o.Pa4,d=new o.Ltg,f=new o.Ltg,m=new o.Ltg,p=new o.Pa4,h=new o.yGw,v=new o.Zzh,y=new o.Pa4,x=new o.ZzF,g=new o.aLr,b=new o.Ltg;function w(e,t,n){return b.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),b.multiplyScalar(1/b.w),b.x=r/n.width,b.y=r/n.height,b.applyMatrix4(e.projectionMatrixInverse),b.multiplyScalar(1/b.w),Math.abs(Math.max(b.x,b.y))}class S extends o.Kj0{constructor(e=new a.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,o=t.count;e<o;e++,r+=2)c.fromBufferAttribute(t,e),u.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+c.distanceTo(u);let r=new o.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new o.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.kB5(r,1,1)),this}raycast(e,t){let n,a;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let u=this.matrixWorld,b=this.geometry,S=this.material;if(r=S.linewidth+c,null===b.boundingSphere&&b.computeBoundingSphere(),g.copy(b.boundingSphere).applyMatrix4(u),s)n=.5*r;else{let e=Math.max(l.near,g.distanceToPoint(i.origin));n=w(l,e,S.resolution)}if(g.radius+=n,!1!==i.intersectsSphere(g)){if(null===b.boundingBox&&b.computeBoundingBox(),x.copy(b.boundingBox).applyMatrix4(u),s)a=.5*r;else{let e=Math.max(l.near,x.distanceToPoint(i.origin));a=w(l,e,S.resolution)}x.expandByScalar(a),!1!==i.intersectsBox(x)&&(s?function(e,t){let n=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,c=Math.min(a.instanceCount,s.count);for(let a=0;a<c;a++){v.start.fromBufferAttribute(s,a),v.end.fromBufferAttribute(l,a),v.applyMatrix4(n);let c=new o.Pa4,u=new o.Pa4;i.distanceSqToSegment(v.start,v.end,u,c),u.distanceTo(c)<.5*r&&t.push({point:u,pointOnLine:c,distance:i.origin.distanceTo(u),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}(this,t):function(e,t,n){let a=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,x=c.attributes.instanceEnd,g=Math.min(c.instanceCount,u.count),b=-t.near;i.at(1,m),m.w=1,m.applyMatrix4(t.matrixWorldInverse),m.applyMatrix4(a),m.multiplyScalar(1/m.w),m.x*=s.x/2,m.y*=s.y/2,m.z=0,p.copy(m),h.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<g;t++){if(d.fromBufferAttribute(u,t),f.fromBufferAttribute(x,t),d.w=1,f.w=1,d.applyMatrix4(h),f.applyMatrix4(h),d.z>b&&f.z>b)continue;if(d.z>b){let e=d.z-f.z,t=(d.z-b)/e;d.lerp(f,t)}else if(f.z>b){let e=f.z-d.z,t=(f.z-b)/e;f.lerp(d,t)}d.applyMatrix4(a),f.applyMatrix4(a),d.multiplyScalar(1/d.w),f.multiplyScalar(1/f.w),d.x*=s.x/2,d.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(d),v.start.z=0,v.end.copy(f),v.end.z=0;let c=v.closestPointToPointParameter(p,!0);v.at(c,y);let m=o.M8C.lerp(d.z,f.z,c),g=m>=-1&&m<=1,w=p.distanceTo(y)<.5*r;if(g&&w){v.start.fromBufferAttribute(u,t),v.end.fromBufferAttribute(x,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new o.Pa4,a=new o.Pa4;i.distanceSqToSegment(v.start,v.end,a,r),n.push({point:a,pointOnLine:r,distance:i.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){"use strict";n.d(t,{z:function(){return a}});var i=n(9375);let r=new i.ZzF,o=new i.Pa4;class a extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)o.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(o)),o.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(o));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){"use strict";n.d(t,{XR:function(){return i}});let i=e=>(t,n,i)=>{let r=i.subscribe;return i.subscribe=(e,t,n)=>{let o=e;if(t){let r=(null==n?void 0:n.equalityFn)||Object.is,a=e(i.getState());o=n=>{let i=e(n);if(!r(a,i)){let e=a;t(a=i,e)}},(null==n?void 0:n.fireImmediately)&&t(a,a)}return r(o)},e(t,n,i)}},73542:function(e,t,n){"use strict";n.d(t,{U:function(){return l},o:function(){return a}});var i=n(52983),r=n(98565);let o=e=>e;function a(e,t=o){let n=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>t(e.getState()),[e,t]),i.useCallback(()=>t(e.getInitialState()),[e,t]));return i.useDebugValue(n),n}let s=e=>{let t=(0,r.M)(e),n=e=>a(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){"use strict";n.d(t,{M:function(){return r}});let i=e=>{let t;let n=new Set,i=(e,i)=>{let r="function"==typeof e?e(t):e;if(!Object.is(r,t)){let e=t;t=(null!=i?i:"object"!=typeof r||null===r)?r:Object.assign({},t,r),n.forEach(n=>n(t,e))}},r=()=>t,o={setState:i,getState:r,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(i,r,o);return o},r=e=>e?i(e):i}}]);