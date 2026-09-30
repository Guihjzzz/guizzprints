(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4512,3120,24654,47002,53143,1649,99297,12128],{58109:function(e,t,n){"use strict";n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375);let s=a.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...u},d){let c=a.useRef(null),f=a.useRef(null),m=new o._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=c.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(m),e.getWorldQuaternion(c.current.quaternion).premultiply(m.invert()),n&&(c.current.rotation.x=i.x),s&&(c.current.rotation.y=i.y),l&&(c.current.rotation.z=i.z)}),a.useImperativeHandle(d,()=>f.current,[]),a.createElement("group",(0,i.Z)({ref:f},u),a.createElement("group",{ref:c},e))})},81125:function(e,t,n){"use strict";n.d(t,{q:function(){return g}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375),s=n(30535),l=Object.defineProperty,u=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,d=(e,t,n)=>(u(e,"symbol"!=typeof t?t+"":t,n),n);let c=new o.USm(0,0,0,"YXZ"),f=new o.Pa4,m={type:"change"},p={type:"lock"},h={type:"unlock"},v=Math.PI/2;class y extends s.p{constructor(e,t){super(),d(this,"camera"),d(this,"domElement"),d(this,"isLocked"),d(this,"minPolarAngle"),d(this,"maxPolarAngle"),d(this,"pointerSpeed"),d(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(c.setFromQuaternion(this.camera.quaternion),c.y-=.002*e.movementX*this.pointerSpeed,c.x-=.002*e.movementY*this.pointerSpeed,c.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,c.x)),this.camera.quaternion.setFromEuler(c),this.dispatchEvent(m))}),d(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(p),this.isLocked=!0):(this.dispatchEvent(h),this.isLocked=!1))}),d(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),d(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),d(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),d(this,"dispose",()=>{this.disconnect()}),d(this,"getObject",()=>this.camera),d(this,"direction",new o.Pa4(0,0,-1)),d(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),d(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),d(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),d(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),d(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let g=a.forwardRef(({domElement:e,selector:t,onChange:n,onLock:o,onUnlock:s,enabled:l=!0,makeDefault:u,...d},c)=>{let{camera:f,...m}=d,p=(0,r.D)(e=>e.setEvents),h=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),g=(0,r.D)(e=>e.invalidate),b=(0,r.D)(e=>e.events),x=(0,r.D)(e=>e.get),w=(0,r.D)(e=>e.set),S=f||v,_=e||b.connected||h.domElement,E=a.useMemo(()=>new y(S),[S]);return a.useEffect(()=>{if(l){E.connect(_);let e=x().events.compute;return p({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{E.disconnect(),p({compute:e})}}},[l,E]),a.useEffect(()=>{let e=e=>{g(),n&&n(e)};E.addEventListener("change",e),o&&E.addEventListener("lock",o),s&&E.addEventListener("unlock",s);let i=()=>E.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{E.removeEventListener("change",e),o&&E.removeEventListener("lock",o),s&&E.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,o,s,t,E,g]),a.useEffect(()=>{if(u){let e=x().controls;return w({controls:E}),()=>w({controls:e})}},[u,E]),a.createElement("primitive",(0,i.Z)({ref:c,object:E},m))})},73420:function(e,t,n){"use strict";n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),a=n(75575);let o=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),u=i.useMemo(()=>(0,r.U)((0,a.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),d=i.useMemo(()=>[u.subscribe,u.getState,u],[l]),c=u.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{c({[e]:t}),n&&n(e,t,d[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:a,up:o}=i;i.pressed=!0,(o||!a)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:a}=i;i.pressed=!1,a&&r(!1)},a=s||window;return a.addEventListener("keydown",i,{passive:!0}),a.addEventListener("keyup",r,{passive:!0}),()=>{a.removeEventListener("keydown",i),a.removeEventListener("keyup",r)}},[s,l]),i.createElement(o.Provider,{value:d,children:t})}function l(e){let[t,n,r]=i.useContext(o);return e?r(e):[t,n]}},14978:function(e,t,n){var i="Expected a function",r=0/0,a=/^\s+|\s+$/g,o=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,u=parseInt,d="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,c="object"==typeof self&&self&&self.Object===Object&&self,f=d||c||Function("return this")(),m=Object.prototype.toString,p=Math.max,h=Math.min,v=function(){return f.Date.now()};function y(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function g(e){if("number"==typeof e)return e;if("symbol"==typeof(t=e)||t&&"object"==typeof t&&"[object Symbol]"==m.call(t))return r;if(y(e)){var t,n="function"==typeof e.valueOf?e.valueOf():e;e=y(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(a,"");var i=s.test(e);return i||l.test(e)?u(e.slice(2),i?2:8):o.test(e)?r:+e}e.exports=function(e,t,n){var r=!0,a=!0;if("function"!=typeof e)throw TypeError(i);return y(n)&&(r="leading"in n?!!n.leading:r,a="trailing"in n?!!n.trailing:a),function(e,t,n){var r,a,o,s,l,u,d=0,c=!1,f=!1,m=!0;if("function"!=typeof e)throw TypeError(i);function b(t){var n=r,i=a;return r=a=void 0,d=t,s=e.apply(i,n)}function x(e){var n=e-u,i=e-d;return void 0===u||n>=t||n<0||f&&i>=o}function w(){var e,n,i,r=v();if(x(r))return S(r);l=setTimeout(w,(e=r-u,n=r-d,i=t-e,f?h(i,o-n):i))}function S(e){return(l=void 0,m&&r)?b(e):(r=a=void 0,s)}function _(){var e,n=v(),i=x(n);if(r=arguments,a=this,u=n,i){if(void 0===l)return d=e=u,l=setTimeout(w,t),c?b(e):s;if(f)return l=setTimeout(w,t),b(u)}return void 0===l&&(l=setTimeout(w,t)),s}return t=g(t)||0,y(n)&&(c=!!n.leading,o=(f="maxWait"in n)?p(g(n.maxWait)||0,t):o,m="trailing"in n?!!n.trailing:m),_.cancel=function(){void 0!==l&&clearTimeout(l),d=0,r=u=a=l=void 0},_.flush=function(){return void 0===l?s:S(v())},_}(e,t,{leading:r,maxWait:t,trailing:a})}},18804:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{default:function(){return s},noSSR:function(){return o}});let i=n(97940);n(97458),n(52983);let r=i._(n(16043));function a(e){return{default:(null==e?void 0:e.default)||e}}function o(e,t){return delete t.webpack,delete t.modules,e(t)}function s(e,t){let n=r.default,i={loading:e=>{let{error:t,isLoading:n,pastDelay:i}=e;return null}};e instanceof Promise?i.loader=()=>e:"function"==typeof e?i.loader=e:"object"==typeof e&&(i={...i,...e});let s=(i={...i,...t}).loader;return(i.loadableGenerated&&(i={...i,...i.loadableGenerated},delete i.loadableGenerated),"boolean"!=typeof i.ssr||i.ssr)?n({...i,loader:()=>null!=s?s().then(a):Promise.resolve(a(()=>null))}):(delete i.webpack,delete i.modules,o(n,i))}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},11105:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LoadableContext",{enumerable:!0,get:function(){return i}});let i=n(97940)._(n(52983)).default.createContext(null)},16043:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return f}});let i=n(97940)._(n(52983)),r=n(11105),a=[],o=[],s=!1;function l(e){let t=e(),n={loading:!0,loaded:null,error:null};return n.promise=t.then(e=>(n.loading=!1,n.loaded=e,e)).catch(e=>{throw n.loading=!1,n.error=e,e}),n}class u{promise(){return this._res.promise}retry(){this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};let{_res:e,_opts:t}=this;e.loading&&("number"==typeof t.delay&&(0===t.delay?this._state.pastDelay=!0:this._delay=setTimeout(()=>{this._update({pastDelay:!0})},t.delay)),"number"==typeof t.timeout&&(this._timeout=setTimeout(()=>{this._update({timedOut:!0})},t.timeout))),this._res.promise.then(()=>{this._update({}),this._clearTimeouts()}).catch(e=>{this._update({}),this._clearTimeouts()}),this._update({})}_update(e){this._state={...this._state,error:this._res.error,loaded:this._res.loaded,loading:this._res.loading,...e},this._callbacks.forEach(e=>e())}_clearTimeouts(){clearTimeout(this._delay),clearTimeout(this._timeout)}getCurrentValue(){return this._state}subscribe(e){return this._callbacks.add(e),()=>{this._callbacks.delete(e)}}constructor(e,t){this._loadFn=e,this._opts=t,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}}function d(e){return function(e,t){let n=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null},t),a=null;function l(){if(!a){let t=new u(e,n);a={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return a.promise()}if(!s){let e=n.webpack?n.webpack():n.modules;e&&o.push(t=>{for(let n of e)if(t.includes(n))return l()})}function d(e,t){!function(){l();let e=i.default.useContext(r.LoadableContext);e&&Array.isArray(n.modules)&&n.modules.forEach(t=>{e(t)})}();let o=i.default.useSyncExternalStore(a.subscribe,a.getCurrentValue,a.getCurrentValue);return i.default.useImperativeHandle(t,()=>({retry:a.retry}),[]),i.default.useMemo(()=>{var t;return o.loading||o.error?i.default.createElement(n.loading,{isLoading:o.loading,pastDelay:o.pastDelay,timedOut:o.timedOut,error:o.error,retry:a.retry}):o.loaded?i.default.createElement((t=o.loaded)&&t.default?t.default:t,e):null},[e,o])}return d.preload=()=>l(),d.displayName="LoadableComponent",i.default.forwardRef(d)}(l,e)}function c(e,t){let n=[];for(;e.length;){let i=e.pop();n.push(i(t))}return Promise.all(n).then(()=>{if(e.length)return c(e,t)})}d.preloadAll=()=>new Promise((e,t)=>{c(a).then(e,t)}),d.preloadReady=e=>(void 0===e&&(e=[]),new Promise(t=>{let n=()=>(s=!0,t());c(o,e).then(n,n)})),window.__NEXT_PRELOADREADY=d.preloadReady;let f=d},89258:function(e,t,n){e.exports=n(18804)},14984:function(e,t,n){"use strict";n.d(t,{W:function(){return i},w:function(){return r}});var[i,r]=(0,n(96248).k)({name:"BreadcrumbStylesContext",errorMessage:"useBreadcrumbStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<Breadcrumb />\" "})},10200:function(e,t,n){"use strict";n.d(t,{a:function(){return f}});var i=n(14984),r=n(19938),a=n(65184),o=n(26398),s=n(15627),l=n(42089),u=n(25610),d=n(52983),c=n(97458),f=(0,o.G)(function(e,t){let n=(0,s.jC)("Breadcrumb",e),{children:o,spacing:f="0.5rem",separator:m="/",className:p,listProps:h,...v}=(0,l.Lr)(e),y=(0,a.W)(o),g=y.length,b=y.map((e,t)=>(0,d.cloneElement)(e,{separator:m,spacing:f,isLastChild:g===t+1})),x=(0,r.cx)("chakra-breadcrumb",p);return(0,c.jsx)(u.m.nav,{ref:t,"aria-label":"breadcrumb",className:x,__css:n.container,...v,children:(0,c.jsx)(i.W,{value:n,children:(0,c.jsx)(u.m.ol,{className:"chakra-breadcrumb__list",...h,__css:{display:"flex",alignItems:"center",...n.list},children:b})})})});f.displayName="Breadcrumb"},17006:function(e,t,n){"use strict";n.d(t,{g:function(){return f}});var i=n(52069),r=n(14984),a=n(26398),o=n(25610),s=n(97458),l=(0,a.G)(function(e,t){let{spacing:n,...i}=e,a={mx:n,...(0,r.w)().separator};return(0,s.jsx)(o.m.span,{ref:t,role:"presentation",...i,__css:a})});l.displayName="BreadcrumbSeparator";var u=n(65184),d=n(19938),c=n(52983),f=(0,a.G)(function(e,t){let{isCurrentPage:n,separator:a,isLastChild:f,spacing:m,children:p,className:h,...v}=e,y=(0,u.W)(p).map(e=>e.type===i.A?(0,c.cloneElement)(e,{isCurrentPage:n}):e.type===l?(0,c.cloneElement)(e,{spacing:m,children:e.props.children||a}):e),g={display:"inline-flex",alignItems:"center",...(0,r.w)().item},b=(0,d.cx)("chakra-breadcrumb__list-item",h);return(0,s.jsxs)(o.m.li,{ref:t,className:b,...v,__css:g,children:[y,!f&&(0,s.jsx)(l,{spacing:m,children:a})]})});f.displayName="BreadcrumbItem"},52069:function(e,t,n){"use strict";n.d(t,{A:function(){return l}});var i=n(14984),r=n(26398),a=n(25610),o=n(19938),s=n(97458),l=(0,r.G)(function(e,t){let{isCurrentPage:n,as:r,className:l,href:u,...d}=e,c=(0,i.w)(),f={ref:t,as:r,className:(0,o.cx)("chakra-breadcrumb__link",l),...d};return n?(0,s.jsx)(a.m.span,{"aria-current":"page",__css:c.link,...f}):(0,s.jsx)(a.m.a,{__css:c.link,href:u,...f})});l.displayName="BreadcrumbLink"},87059:function(e,t,n){"use strict";n.d(t,{K:function(){return o},Y:function(){return a}});var i=n(71327),r=n(19938);function a(e){let{isDisabled:t,isInvalid:n,isReadOnly:i,isRequired:a,...s}=o(e);return{...s,disabled:t,readOnly:i,required:a,"aria-invalid":(0,r.Qm)(n),"aria-required":(0,r.Qm)(a),"aria-readonly":(0,r.Qm)(i)}}function o(e){var t,n,a;let o=(0,i.NJ)(),{id:s,disabled:l,readOnly:u,required:d,isRequired:c,isInvalid:f,isReadOnly:m,isDisabled:p,onFocus:h,onBlur:v,...y}=e,g=e["aria-describedby"]?[e["aria-describedby"]]:[];return(null==o?void 0:o.hasFeedbackText)&&(null==o?void 0:o.isInvalid)&&g.push(o.feedbackId),(null==o?void 0:o.hasHelpText)&&g.push(o.helpTextId),{...y,"aria-describedby":g.join(" ")||void 0,id:null!=s?s:null==o?void 0:o.id,isDisabled:null!=(t=null!=l?l:p)?t:null==o?void 0:o.isDisabled,isReadOnly:null!=(n=null!=u?u:m)?n:null==o?void 0:o.isReadOnly,isRequired:null!=(a=null!=d?d:c)?a:null==o?void 0:o.isRequired,isInvalid:null!=f?f:null==o?void 0:o.isInvalid,onFocus:(0,r.v0)(null==o?void 0:o.onFocus,h),onBlur:(0,r.v0)(null==o?void 0:o.onBlur,v)}}},71327:function(e,t,n){"use strict";n.d(t,{NI:function(){return v},NJ:function(){return h},Q6:function(){return y},e:function(){return m}});var i=n(96248),r=n(16227),a=n(26398),o=n(15627),s=n(42089),l=n(25610),u=n(19938),d=n(52983),c=n(97458),[f,m]=(0,i.k)({name:"FormControlStylesContext",errorMessage:"useFormControlStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<FormControl />\" "}),[p,h]=(0,i.k)({strict:!1,name:"FormControlContext"}),v=(0,a.G)(function(e,t){let n=(0,o.jC)("Form",e),{getRootProps:i,htmlProps:a,...m}=function(e){let{id:t,isRequired:n,isInvalid:i,isDisabled:a,isReadOnly:o,...s}=e,l=(0,d.useId)(),c=t||`field-${l}`,f=`${c}-label`,m=`${c}-feedback`,p=`${c}-helptext`,[h,v]=(0,d.useState)(!1),[y,g]=(0,d.useState)(!1),[b,x]=(0,d.useState)(!1),w=(0,d.useCallback)((e={},t=null)=>({id:p,...e,ref:(0,r.lq)(t,e=>{e&&g(!0)})}),[p]),S=(0,d.useCallback)((e={},t=null)=>({...e,ref:t,"data-focus":(0,u.PB)(b),"data-disabled":(0,u.PB)(a),"data-invalid":(0,u.PB)(i),"data-readonly":(0,u.PB)(o),id:void 0!==e.id?e.id:f,htmlFor:void 0!==e.htmlFor?e.htmlFor:c}),[c,a,b,i,o,f]),_=(0,d.useCallback)((e={},t=null)=>({id:m,...e,ref:(0,r.lq)(t,e=>{e&&v(!0)}),"aria-live":"polite"}),[m]),E=(0,d.useCallback)((e={},t=null)=>({...e,...s,ref:t,role:"group","data-focus":(0,u.PB)(b),"data-disabled":(0,u.PB)(a),"data-invalid":(0,u.PB)(i),"data-readonly":(0,u.PB)(o)}),[s,a,b,i,o]);return{isRequired:!!n,isInvalid:!!i,isReadOnly:!!o,isDisabled:!!a,isFocused:!!b,onFocus:()=>x(!0),onBlur:()=>x(!1),hasFeedbackText:h,setHasFeedbackText:v,hasHelpText:y,setHasHelpText:g,id:c,labelId:f,feedbackId:m,helpTextId:p,htmlProps:s,getHelpTextProps:w,getErrorMessageProps:_,getRootProps:E,getLabelProps:S,getRequiredIndicatorProps:(0,d.useCallback)((e={},t=null)=>({...e,ref:t,role:"presentation","aria-hidden":!0,children:e.children||"*"}),[])}}((0,s.Lr)(e)),h=(0,u.cx)("chakra-form-control",e.className);return(0,c.jsx)(p,{value:m,children:(0,c.jsx)(f,{value:n,children:(0,c.jsx)(l.m.div,{...i({},t),className:h,__css:n.container})})})});v.displayName="FormControl";var y=(0,a.G)(function(e,t){let n=h(),i=m(),r=(0,u.cx)("chakra-form__helper-text",e.className);return(0,c.jsx)(l.m.div,{...null==n?void 0:n.getHelpTextProps(e,t),__css:i.helperText,className:r})});y.displayName="FormHelperText"},3347:function(e,t,n){"use strict";n.d(t,{I:function(){return d}});var i=n(87059),r=n(26398),a=n(15627),o=n(42089),s=n(25610),l=n(19938),u=n(97458),d=(0,r.G)(function(e,t){let{htmlSize:n,...r}=e,d=(0,a.jC)("Input",r),c=(0,o.Lr)(r),f=(0,i.Y)(c),m=(0,l.cx)("chakra-input",e.className);return(0,u.jsx)(s.m.input,{size:n,...f,__css:d.field,ref:t,className:m})});d.displayName="Input",d.id="Input"},86169:function(e,t,n){"use strict";n.d(t,{U:function(){return o}});var i=n(63009),r=n(26398),a=n(97458),o=(0,r.G)((e,t)=>(0,a.jsx)(i.K,{align:"center",...e,direction:"row",ref:t}));o.displayName="HStack"},31654:function(e,t,n){"use strict";n.d(t,{a:function(){return a}});var i=n(83780),r=n(52983);function a(e,t={}){let{ssr:n=!0,fallback:a}=t,{getWindow:o}=(0,i.O)(),s=Array.isArray(e)?e:[e],l=Array.isArray(a)?a:[a];l=l.filter(e=>null!=e);let[u,d]=(0,r.useState)(()=>s.map((e,t)=>({media:e,matches:n?!!l[t]:o().matchMedia(e).matches})));return(0,r.useEffect)(()=>{let e=o();d(s.map(t=>({media:t,matches:e.matchMedia(t).matches})));let t=s.map(t=>e.matchMedia(t)),n=e=>{d(t=>t.slice().map(t=>t.media===e.media?{...t,matches:e.matches}:t))};return t.forEach(e=>{"function"==typeof e.addListener?e.addListener(n):e.addEventListener("change",n)}),()=>{t.forEach(e=>{"function"==typeof e.removeListener?e.removeListener(n):e.removeEventListener("change",n)})}},[o]),u.map(e=>e.matches)}},56822:function(e,t,n){"use strict";n.d(t,{S:function(){return s}});var i=n(9878),r=n(31654),a=n(61112),o=n(19938);function s(e,t){var n;let s=function(e){var t,n;let i=(0,o.Kn)(e)?e:{fallback:null!=e?e:"base"},s=(0,a.F)().__breakpoints.details.map(({minMaxQuery:e,breakpoint:t})=>({breakpoint:t,query:e.replace("@media screen and ","")})),l=s.map(e=>e.breakpoint===i.fallback),u=(0,r.a)(s.map(e=>e.query),{fallback:l,ssr:i.ssr}).findIndex(e=>!0==e);return null!=(n=null==(t=s[u])?void 0:t.breakpoint)?n:i.fallback}((0,o.Kn)(t)?t:{fallback:null!=t?t:"base"}),l=(0,a.F)();if(!s)return;let u=Array.from((null==(n=l.__breakpoints)?void 0:n.keys)||[]);return function(e,t,n=i.AV){let r=Object.keys(e).indexOf(t);if(-1!==r)return e[t];let a=n.indexOf(t);for(;a>=0;){let t=n[a];if(e.hasOwnProperty(t)){r=a;break}a-=1}if(-1!==r)return e[n[r]]}(Array.isArray(e)?Object.fromEntries(Object.entries((0,i.Yq)(e,u)).map(([e,t])=>[e,t])):e,s,u)}},86929:function(e,t,n){"use strict";n.d(t,{o:function(){return l}});var i=n(8464),r=n(97878),a=n(19938),o=n(26398),s=n(97458),l=(0,o.G)((e,t)=>{let{onClick:n,className:o,...l}=e,{onClose:u}=(0,i.vR)(),d=(0,a.cx)("chakra-modal__close-btn",o),c=(0,i.I_)();return(0,s.jsx)(r.P,{ref:t,__css:c.closeButton,className:d,onClick:(0,a.v0)(n,e=>{e.stopPropagation(),u()}),...l})});l.displayName="ModalCloseButton"},10575:function(e,t,n){"use strict";n.d(t,{s:function(){return g}});var i=n(52435),r=n(87878),a=n(8464),o=n(19938),s=n(25610),l=n(26398),u=n(40393),d=n(44659),c=n(39267),f=n(52983),m=n(97458),p={exit:{duration:.15,ease:u.Lj.easeInOut},enter:{type:"spring",damping:25,stiffness:180}},h={exit:({direction:e,transition:t,transitionEnd:n,delay:i})=>{var r;let{exit:a}=(0,u.js)({direction:e});return{...a,transition:null!=(r=null==t?void 0:t.exit)?r:u.p$.exit(p.exit,i),transitionEnd:null==n?void 0:n.exit}},enter:({direction:e,transitionEnd:t,transition:n,delay:i})=>{var r;let{enter:a}=(0,u.js)({direction:e});return{...a,transition:null!=(r=null==n?void 0:n.enter)?r:u.p$.enter(p.enter,i),transitionEnd:null==t?void 0:t.enter}}},v=(0,f.forwardRef)(function(e,t){let{direction:n="right",style:i,unmountOnExit:r,in:a,className:s,transition:l,transitionEnd:f,delay:p,motionProps:v,...y}=e,g=Object.assign({position:"fixed"},(0,u.js)({direction:n}).position,i),b=!r||a&&r,x=a||r?"enter":"exit",w={transitionEnd:f,transition:l,direction:n,delay:p};return(0,m.jsx)(d.M,{custom:w,children:b&&(0,m.jsx)(c.E.div,{...y,ref:t,initial:"exit",className:(0,o.cx)("chakra-slide",s),animate:x,exit:"exit",custom:w,variants:h,style:g,...v})})});v.displayName="Slide";var y=(0,s.m)(v),g=(0,l.G)((e,t)=>{let{className:n,children:l,motionProps:u,containerProps:d,...c}=e,{getDialogProps:f,getDialogContainerProps:p,isOpen:h}=(0,a.vR)(),v=f(c,t),g=p(d),b=(0,o.cx)("chakra-modal__content",n),x=(0,a.I_)(),w={display:"flex",flexDirection:"column",position:"relative",width:"100%",outline:0,...x.dialog},S={display:"flex",width:"100vw",height:"$100vh",position:"fixed",left:0,top:0,...x.dialogContainer},{placement:_}=(0,i.M)();return(0,m.jsx)(r.M,{children:(0,m.jsx)(s.m.div,{...g,className:"chakra-modal__content-container",__css:S,children:(0,m.jsx)(y,{motionProps:u,direction:_,in:h,className:b,...v,__css:w,children:l})})})});g.displayName="DrawerContent"},52435:function(e,t,n){"use strict";n.d(t,{M:function(){return l},d:function(){return d}});var i=n(8464),r=n(96248),a=n(61112),o=n(97458),[s,l]=(0,r.k)(),u={start:{ltr:"left",rtl:"right"},end:{ltr:"right",rtl:"left"}};function d(e){var t;let{isOpen:n,onClose:r,placement:l="right",children:d,...c}=e,f=(0,a.F)(),m=null==(t=f.components)?void 0:t.Drawer,p=function(e,t){var n,i;if(e)return null!=(i=null==(n=u[e])?void 0:n[t])?i:e}(l,f.direction);return(0,o.jsx)(s,{value:{placement:p},children:(0,o.jsx)(i.u_,{isOpen:n,onClose:r,styleConfig:m,...c,children:d})})}},38834:function(e,t,n){"use strict";n.d(t,{P:function(){return f}});var i=n(19938),r=n(26398),a=n(25610),o=n(97458),s=(0,r.G)(function(e,t){let{children:n,placeholder:r,className:s,...l}=e;return(0,o.jsxs)(a.m.select,{...l,ref:t,className:(0,i.cx)("chakra-select",s),children:[r&&(0,o.jsx)("option",{value:"",children:r}),n]})});s.displayName="SelectField";var l=n(87059),u=n(15627),d=n(42089),c=n(52983),f=(0,r.G)((e,t)=>{var n;let r=(0,u.jC)("Select",e),{rootProps:c,placeholder:f,icon:m,color:p,height:v,h:y,minH:g,minHeight:b,iconColor:x,iconSize:w,...S}=(0,d.Lr)(e),[_,E]=function(e,t){let n={},i={};for(let[r,a]of Object.entries(e))t.includes(r)?n[r]=a:i[r]=a;return[n,i]}(S,d.oE),k=(0,l.Y)(E),L={paddingEnd:"2rem",...r.field,_focus:{zIndex:"unset",...null==(n=r.field)?void 0:n._focus}};return(0,o.jsxs)(a.m.div,{className:"chakra-select__wrapper",__css:{width:"100%",height:"fit-content",position:"relative",color:p},..._,...c,children:[(0,o.jsx)(s,{ref:t,height:null!=y?y:v,minH:null!=g?g:b,placeholder:f,...k,__css:L,children:e.children}),(0,o.jsx)(h,{"data-disabled":(0,i.PB)(k.disabled),...(x||p)&&{color:x||p},__css:r.icon,...w&&{fontSize:w},children:m})]})});f.displayName="Select";var m=e=>(0,o.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,o.jsx)("path",{fill:"currentColor",d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"})}),p=(0,a.m)("div",{baseStyle:{position:"absolute",display:"inline-flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",top:"50%",transform:"translateY(-50%)"}}),h=e=>{let{children:t=(0,o.jsx)(m,{}),...n}=e,i=(0,c.cloneElement)(t,{role:"presentation",className:"chakra-select__icon",focusable:!1,"aria-hidden":!0,style:{width:"1em",height:"1em",color:"currentColor"}});return(0,o.jsx)(p,{...n,className:"chakra-select__icon-wrapper",children:(0,c.isValidElement)(t)?i:null})};h.displayName="SelectIcon"},60271:function(e,t,n){"use strict";n.d(t,{O:function(){return y}});var i=n(52983),r=n(19938),a=n(25610),o=n(42089),s=n(10915),l=n(26398),u=n(15627),d=n(71778),c=n(97458),f=(0,a.m)("div",{baseStyle:{boxShadow:"none",backgroundClip:"padding-box",cursor:"default",color:"transparent",pointerEvents:"none",userSelect:"none","&::before, &::after, *":{visibility:"hidden"}}}),m=(0,o.gJ)("skeleton-start-color"),p=(0,o.gJ)("skeleton-end-color"),h=(0,s.F4)({from:{opacity:0},to:{opacity:1}}),v=(0,s.F4)({from:{borderColor:m.reference,background:m.reference},to:{borderColor:p.reference,background:p.reference}}),y=(0,l.G)((e,t)=>{let n={...e,fadeDuration:"number"==typeof e.fadeDuration?e.fadeDuration:.4,speed:"number"==typeof e.speed?e.speed:.8},s=(0,u.mq)("Skeleton",n),l=function(){let e=(0,i.useRef)(!0);return(0,i.useEffect)(()=>{e.current=!1},[]),e.current}(),{startColor:y="",endColor:g="",isLoaded:b,fadeDuration:x,speed:w,className:S,fitContent:_,...E}=(0,o.Lr)(n),[k,L]=(0,d.dQ)("colors",[y,g]),j=function(e){let t=(0,i.useRef)();return(0,i.useEffect)(()=>{t.current=e},[e]),t.current}(b),P=(0,r.cx)("chakra-skeleton",S),M={...k&&{[m.variable]:k},...L&&{[p.variable]:L}};if(b){let e=l||j?"none":`${h} ${x}s`;return(0,c.jsx)(a.m.div,{ref:t,className:P,__css:{animation:e},...E})}return(0,c.jsx)(f,{ref:t,className:P,...E,__css:{width:_?"fit-content":void 0,...s,...M,_dark:{...s._dark,...M},animation:`${w}s linear infinite alternate ${v}`}})});y.displayName="Skeleton"},82878:function(e,t,n){"use strict";n.d(t,{N:function(){return l}});var i=n(60271),r=n(56822),a=n(25610),o=n(19938),s=n(97458),l=e=>{let{noOfLines:t=3,spacing:n="0.5rem",skeletonHeight:l="0.5rem",className:u,startColor:d,endColor:c,isLoaded:f,fadeDuration:m,speed:p,variant:h,size:v,colorScheme:y,children:g,...b}=e,x=(0,r.S)("number"==typeof t?[t]:t)||3,w=Array(x).fill(1).map((e,t)=>t+1),S=e=>x>1&&e===w.length?"80%":"100%",_=(0,o.cx)("chakra-skeleton__group",u);return(0,s.jsx)(a.m.div,{className:_,...b,children:w.map((e,t)=>{if(f&&t>0)return null;let r=f?null:{mb:e===w.length?"0":n,width:S(e),height:l};return(0,s.jsx)(i.O,{startColor:d,endColor:c,isLoaded:f,fadeDuration:m,speed:p,variant:h,size:v,colorScheme:y,...r,children:0===t?g:void 0},w.length.toString()+e)})})};l.displayName="SkeletonText"},40393:function(e,t,n){"use strict";n.d(t,{Lj:function(){return i},Sh:function(){return o},js:function(){return a},p$:function(){return s}});var i={ease:[.25,.1,.25,1],easeIn:[.4,0,1,1],easeOut:[0,0,.2,1],easeInOut:[.4,0,.2,1]},r={slideLeft:{position:{left:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"-100%",y:0}},slideRight:{position:{right:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"100%",y:0}},slideUp:{position:{top:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"-100%"}},slideDown:{position:{bottom:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"100%"}}};function a(e){var t;switch(null!=(t=null==e?void 0:e.direction)?t:"right"){case"right":default:return r.slideRight;case"left":return r.slideLeft;case"bottom":return r.slideDown;case"top":return r.slideUp}}var o={enter:{duration:.2,ease:i.easeOut},exit:{duration:.1,ease:i.easeIn}},s={enter:(e,t)=>({...e,delay:"number"==typeof t?t:null==t?void 0:t.enter}),exit:(e,t)=>({...e,delay:"number"==typeof t?t:null==t?void 0:t.exit})}},1848:function(e,t,n){"use strict";n.d(t,{U:function(){return f}});var i=n(40393),r=n(19938),a=n(44659),o=n(39267),s=n(52983),l=n(97458),u=e=>null!=e&&parseInt(e.toString(),10)>0,d={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},c={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:r,delay:a})=>{var o;return{...e&&{opacity:u(t)?1:0},height:t,transitionEnd:null==r?void 0:r.exit,transition:null!=(o=null==n?void 0:n.exit)?o:i.p$.exit(d.exit,a)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:r,delay:a})=>{var o;return{...e&&{opacity:1},height:t,transitionEnd:null==r?void 0:r.enter,transition:null!=(o=null==n?void 0:n.enter)?o:i.p$.enter(d.enter,a)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:i,animateOpacity:u=!0,startingHeight:d=0,endingHeight:f="auto",style:m,className:p,transition:h,transitionEnd:v,...y}=e,[g,b]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{b(!0)});return()=>clearTimeout(e)},[]),(0,r.ZK)({condition:Number(d)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let x=parseFloat(d.toString())>0,w={startingHeight:d,endingHeight:f,animateOpacity:u,transition:g?h:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:i?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:x?"block":"none"}}},S=!i||n,_=n||i?"enter":"exit";return(0,l.jsx)(a.M,{initial:!1,custom:w,children:S&&(0,l.jsx)(o.E.div,{ref:t,...y,className:(0,r.cx)("chakra-collapse",p),style:{overflow:"hidden",display:"block",...m},custom:w,variants:c,initial:!!i&&"exit",animate:_,exit:"exit"})})});f.displayName="Collapse"},95569:function(e,t,n){"use strict";n.d(t,{v:function(){return i}});var i=n(60413);t.Z=i},4248:function(e,t,n){"use strict";n.d(t,{i:function(){return i}});let i=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){"use strict";n.d(t,{Y:function(){return a}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class a extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){"use strict";let i,r;n.d(t,{w:function(){return S}});var a=n(9375),o=n(90845),s=n(61261);let l=new a.Ltg,u=new a.Pa4,d=new a.Pa4,c=new a.Ltg,f=new a.Ltg,m=new a.Ltg,p=new a.Pa4,h=new a.yGw,v=new a.Zzh,y=new a.Pa4,g=new a.ZzF,b=new a.aLr,x=new a.Ltg;function w(e,t,n){return x.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),x.multiplyScalar(1/x.w),x.x=r/n.width,x.y=r/n.height,x.applyMatrix4(e.projectionMatrixInverse),x.multiplyScalar(1/x.w),Math.abs(Math.max(x.x,x.y))}class S extends a.Kj0{constructor(e=new o.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)u.fromBufferAttribute(t,e),d.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+u.distanceTo(d);let r=new a.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new a.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.kB5(r,1,1)),this}raycast(e,t){let n,o;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let u=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let d=this.matrixWorld,x=this.geometry,S=this.material;if(r=S.linewidth+u,null===x.boundingSphere&&x.computeBoundingSphere(),b.copy(x.boundingSphere).applyMatrix4(d),s)n=.5*r;else{let e=Math.max(l.near,b.distanceToPoint(i.origin));n=w(l,e,S.resolution)}if(b.radius+=n,!1!==i.intersectsSphere(b)){if(null===x.boundingBox&&x.computeBoundingBox(),g.copy(x.boundingBox).applyMatrix4(d),s)o=.5*r;else{let e=Math.max(l.near,g.distanceToPoint(i.origin));o=w(l,e,S.resolution)}g.expandByScalar(o),!1!==i.intersectsBox(g)&&(s?function(e,t){let n=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,l=o.attributes.instanceEnd,u=Math.min(o.instanceCount,s.count);for(let o=0;o<u;o++){v.start.fromBufferAttribute(s,o),v.end.fromBufferAttribute(l,o),v.applyMatrix4(n);let u=new a.Pa4,d=new a.Pa4;i.distanceSqToSegment(v.start,v.end,d,u),d.distanceTo(u)<.5*r&&t.push({point:d,pointOnLine:u,distance:i.origin.distanceTo(d),object:e,face:null,faceIndex:o,uv:null,uv1:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,u=e.geometry,d=u.attributes.instanceStart,g=u.attributes.instanceEnd,b=Math.min(u.instanceCount,d.count),x=-t.near;i.at(1,m),m.w=1,m.applyMatrix4(t.matrixWorldInverse),m.applyMatrix4(o),m.multiplyScalar(1/m.w),m.x*=s.x/2,m.y*=s.y/2,m.z=0,p.copy(m),h.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<b;t++){if(c.fromBufferAttribute(d,t),f.fromBufferAttribute(g,t),c.w=1,f.w=1,c.applyMatrix4(h),f.applyMatrix4(h),c.z>x&&f.z>x)continue;if(c.z>x){let e=c.z-f.z,t=(c.z-x)/e;c.lerp(f,t)}else if(f.z>x){let e=f.z-c.z,t=(f.z-x)/e;f.lerp(c,t)}c.applyMatrix4(o),f.applyMatrix4(o),c.multiplyScalar(1/c.w),f.multiplyScalar(1/f.w),c.x*=s.x/2,c.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(c),v.start.z=0,v.end.copy(f),v.end.z=0;let u=v.closestPointToPointParameter(p,!0);v.at(u,y);let m=a.M8C.lerp(c.z,f.z,u),b=m>=-1&&m<=1,w=p.distanceTo(y)<.5*r;if(b&&w){v.start.fromBufferAttribute(d,t),v.end.fromBufferAttribute(g,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new a.Pa4,o=new a.Pa4;i.distanceSqToSegment(v.start,v.end,o,r),n.push({point:o,pointOnLine:r,distance:i.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){"use strict";n.d(t,{z:function(){return o}});var i=n(9375);let r=new i.ZzF,a=new i.Pa4;class o extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)a.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(a)),a.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(a));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){"use strict";n.d(t,{XR:function(){return i}});let i=e=>(t,n,i)=>{let r=i.subscribe;return i.subscribe=(e,t,n)=>{let a=e;if(t){let r=(null==n?void 0:n.equalityFn)||Object.is,o=e(i.getState());a=n=>{let i=e(n);if(!r(o,i)){let e=o;t(o=i,e)}},(null==n?void 0:n.fireImmediately)&&t(o,o)}return r(a)},e(t,n,i)}},73542:function(e,t,n){"use strict";n.d(t,{U:function(){return l},o:function(){return o}});var i=n(52983),r=n(98565);let a=e=>e;function o(e,t=a){let n=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>t(e.getState()),[e,t]),i.useCallback(()=>t(e.getInitialState()),[e,t]));return i.useDebugValue(n),n}let s=e=>{let t=(0,r.M)(e),n=e=>o(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){"use strict";n.d(t,{M:function(){return r}});let i=e=>{let t;let n=new Set,i=(e,i)=>{let r="function"==typeof e?e(t):e;if(!Object.is(r,t)){let e=t;t=(null!=i?i:"object"!=typeof r||null===r)?r:Object.assign({},t,r),n.forEach(n=>n(t,e))}},r=()=>t,a={setState:i,getState:r,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(i,r,a);return a},r=e=>e?i(e):i}}]);