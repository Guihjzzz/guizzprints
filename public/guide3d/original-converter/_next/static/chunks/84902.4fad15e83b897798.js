"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[84902,3120],{58109:function(e,t,n){n.d(t,{V:function(){return s}});var r=n(99217),i=n(62510),o=n(52983),a=n(9375);let s=o.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...c},u){let d=o.useRef(null),m=o.useRef(null),f=new a._fP;return(0,i.F)(({camera:e})=>{if(!t||!m.current)return;let r=d.current.rotation.clone();m.current.updateMatrix(),m.current.updateWorldMatrix(!1,!1),m.current.getWorldQuaternion(f),e.getWorldQuaternion(d.current.quaternion).premultiply(f.invert()),n&&(d.current.rotation.x=r.x),s&&(d.current.rotation.y=r.y),l&&(d.current.rotation.z=r.z)}),o.useImperativeHandle(u,()=>m.current,[]),o.createElement("group",(0,r.Z)({ref:m},c),o.createElement("group",{ref:d},e))})},71709:function(e,t,n){n.d(t,{B:function(){return f},Y:function(){return m}});var r,i=n(52983),o=n(9375),a=n(62510),s=((r=s||{})[r.NONE=0]="NONE",r[r.START=1]="START",r[r.ACTIVE=2]="ACTIVE",r);let l=e=>e&&e.isOrthographicCamera,c=e=>e&&e.isBox3,u=e=>1-Math.exp(-5*e)+.007*e,d=i.createContext(null);function m({children:e,maxDuration:t=1,margin:n=1.2,observe:r,fit:m,clip:f,interpolateFunc:p=u,onFit:h}){let v=i.useRef(null),{camera:x,size:y,invalidate:g}=(0,a.D)(),w=(0,a.D)(e=>e.controls),b=i.useRef(h);b.current=h;let S=i.useRef({camPos:new o.Pa4,camRot:new o._fP,camZoom:1}),E=i.useRef({camPos:void 0,camRot:void 0,camZoom:void 0,camUp:void 0,target:void 0}),_=i.useRef(s.NONE),k=i.useRef(0),[A]=i.useState(()=>new o.ZzF),P=i.useMemo(()=>{function e(){let e=A.getSize(new o.Pa4),t=A.getCenter(new o.Pa4),r=Math.max(e.x,e.y,e.z),i=l(x)?4*r:r/(2*Math.atan(Math.PI*x.fov/360)),a=l(x)?4*r:i/x.aspect;return{box:A,size:e,center:t,distance:n*Math.max(i,a)}}return{getSize:e,refresh(e){if(c(e))A.copy(e);else{let t=e||v.current;if(!t)return this;t.updateWorldMatrix(!0,!0),A.setFromObject(t)}if(A.isEmpty()){let e=x.position.length()||10;A.setFromCenterAndSize(new o.Pa4,new o.Pa4(e,e,e))}return S.current.camPos.copy(x.position),S.current.camRot.copy(x.quaternion),l(x)&&(S.current.camZoom=x.zoom),E.current.camPos=void 0,E.current.camRot=void 0,E.current.camZoom=void 0,E.current.camUp=void 0,E.current.target=void 0,this},reset(){let{center:t,distance:n}=e(),r=x.position.clone().sub(t).normalize();E.current.camPos=t.clone().addScaledVector(r,n),E.current.target=t.clone();let i=new o.yGw().lookAt(E.current.camPos,E.current.target,x.up);return E.current.camRot=new o._fP().setFromRotationMatrix(i),_.current=s.START,k.current=0,this},moveTo(e){return E.current.camPos=Array.isArray(e)?new o.Pa4(...e):e.clone(),_.current=s.START,k.current=0,this},lookAt({target:e,up:t}){E.current.target=Array.isArray(e)?new o.Pa4(...e):e.clone(),t?E.current.camUp=Array.isArray(t)?new o.Pa4(...t):t.clone():E.current.camUp=x.up.clone();let n=new o.yGw().lookAt(E.current.camPos||x.position,E.current.target,E.current.camUp);return E.current.camRot=new o._fP().setFromRotationMatrix(n),_.current=s.START,k.current=0,this},to({position:e,target:t}){return this.moveTo(e).lookAt({target:t})},fit(){if(!l(x))return this.reset();let e=0,t=0,r=[new o.Pa4(A.min.x,A.min.y,A.min.z),new o.Pa4(A.min.x,A.max.y,A.min.z),new o.Pa4(A.min.x,A.min.y,A.max.z),new o.Pa4(A.min.x,A.max.y,A.max.z),new o.Pa4(A.max.x,A.max.y,A.max.z),new o.Pa4(A.max.x,A.max.y,A.min.z),new o.Pa4(A.max.x,A.min.y,A.max.z),new o.Pa4(A.max.x,A.min.y,A.min.z)],i=E.current.camPos||x.position,a=E.current.target||(null==w?void 0:w.target),c=E.current.camUp||x.up,u=a?new o.yGw().lookAt(i,a,c).setPosition(i).invert():x.matrixWorldInverse;for(let n of r)n.applyMatrix4(u),e=Math.max(e,Math.abs(n.y)),t=Math.max(t,Math.abs(n.x));e*=2,t*=2;let d=(x.top-x.bottom)/e,m=(x.right-x.left)/t;return E.current.camZoom=Math.min(d,m)/n,_.current=s.START,k.current=0,b.current&&b.current(this.getSize()),this},clip(){let{distance:t}=e();return x.near=t/100,x.far=100*t,x.updateProjectionMatrix(),w&&(w.maxDistance=10*t,w.update()),g(),this}}},[A,x,w,n,g]);i.useLayoutEffect(()=>{if(w){let e=()=>{if(w&&E.current.target&&_.current!==s.NONE){let e=new o.Pa4().setFromMatrixColumn(x.matrix,2),t=S.current.camPos.distanceTo(w.target),n=(E.current.camPos||S.current.camPos).distanceTo(E.current.target),r=(1-k.current)*t+k.current*n;w.target.copy(x.position).addScaledVector(e,-r),w.update()}_.current=s.NONE};return w.addEventListener("start",e),()=>w.removeEventListener("start",e)}},[w]);let C=i.useRef(0);return i.useLayoutEffect(()=>{(r||0==C.current++)&&(P.refresh(),m&&P.reset().fit(),f&&P.clip())},[y,f,m,r,x,w]),(0,a.F)((e,n)=>{if(_.current===s.START)_.current=s.ACTIVE,g();else if(_.current===s.ACTIVE){if(k.current+=n/t,k.current>=1)E.current.camPos&&x.position.copy(E.current.camPos),E.current.camRot&&x.quaternion.copy(E.current.camRot),E.current.camUp&&x.up.copy(E.current.camUp),E.current.camZoom&&l(x)&&(x.zoom=E.current.camZoom),x.updateMatrixWorld(),x.updateProjectionMatrix(),w&&E.current.target&&(w.target.copy(E.current.target),w.update()),_.current=s.NONE;else{let e=p(k.current);E.current.camPos&&x.position.lerpVectors(S.current.camPos,E.current.camPos,e),E.current.camRot&&x.quaternion.slerpQuaternions(S.current.camRot,E.current.camRot,e),E.current.camUp&&x.up.set(0,1,0).applyQuaternion(x.quaternion),E.current.camZoom&&l(x)&&(x.zoom=(1-e)*S.current.camZoom+e*E.current.camZoom),x.updateMatrixWorld(),x.updateProjectionMatrix()}g()}}),i.createElement("group",{ref:v},i.createElement(d.Provider,{value:P},e))}function f(){return i.useContext(d)}},81125:function(e,t,n){n.d(t,{q:function(){return y}});var r=n(99217),i=n(62510),o=n(52983),a=n(9375),s=n(30535),l=Object.defineProperty,c=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,u=(e,t,n)=>(c(e,"symbol"!=typeof t?t+"":t,n),n);let d=new a.USm(0,0,0,"YXZ"),m=new a.Pa4,f={type:"change"},p={type:"lock"},h={type:"unlock"},v=Math.PI/2;class x extends s.p{constructor(e,t){super(),u(this,"camera"),u(this,"domElement"),u(this,"isLocked"),u(this,"minPolarAngle"),u(this,"maxPolarAngle"),u(this,"pointerSpeed"),u(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(d.setFromQuaternion(this.camera.quaternion),d.y-=.002*e.movementX*this.pointerSpeed,d.x-=.002*e.movementY*this.pointerSpeed,d.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,d.x)),this.camera.quaternion.setFromEuler(d),this.dispatchEvent(f))}),u(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(p),this.isLocked=!0):(this.dispatchEvent(h),this.isLocked=!1))}),u(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),u(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),u(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),u(this,"dispose",()=>{this.disconnect()}),u(this,"getObject",()=>this.camera),u(this,"direction",new a.Pa4(0,0,-1)),u(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),u(this,"moveForward",e=>{m.setFromMatrixColumn(this.camera.matrix,0),m.crossVectors(this.camera.up,m),this.camera.position.addScaledVector(m,e)}),u(this,"moveRight",e=>{m.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(m,e)}),u(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),u(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let y=o.forwardRef(({domElement:e,selector:t,onChange:n,onLock:a,onUnlock:s,enabled:l=!0,makeDefault:c,...u},d)=>{let{camera:m,...f}=u,p=(0,i.D)(e=>e.setEvents),h=(0,i.D)(e=>e.gl),v=(0,i.D)(e=>e.camera),y=(0,i.D)(e=>e.invalidate),g=(0,i.D)(e=>e.events),w=(0,i.D)(e=>e.get),b=(0,i.D)(e=>e.set),S=m||v,E=e||g.connected||h.domElement,_=o.useMemo(()=>new x(S),[S]);return o.useEffect(()=>{if(l){_.connect(E);let e=w().events.compute;return p({compute(e,t){let n=t.size.width/2,r=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(r/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{_.disconnect(),p({compute:e})}}},[l,_]),o.useEffect(()=>{let e=e=>{y(),n&&n(e)};_.addEventListener("change",e),a&&_.addEventListener("lock",a),s&&_.addEventListener("unlock",s);let r=()=>_.lock(),i=t?Array.from(document.querySelectorAll(t)):[document];return i.forEach(e=>e&&e.addEventListener("click",r)),()=>{_.removeEventListener("change",e),a&&_.removeEventListener("lock",a),s&&_.removeEventListener("unlock",s),i.forEach(e=>e?e.removeEventListener("click",r):void 0)}},[n,a,s,t,_,y]),o.useEffect(()=>{if(c){let e=w().controls;return b({controls:_}),()=>b({controls:e})}},[c,_]),o.createElement("primitive",(0,r.Z)({ref:d,object:_},f))})},73420:function(e,t,n){n.d(t,{Z:function(){return l},c:function(){return s}});var r=n(52983),i=n(73542),o=n(75575);let a=r.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),c=r.useMemo(()=>(0,i.U)((0,o.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),u=r.useMemo(()=>[c.subscribe,c.getState,c],[l]),d=c.setState;return r.useEffect(()=>{let t=e.map(({name:e,keys:t,up:r})=>({keys:t,up:r,fn:t=>{d({[e]:t}),n&&n(e,t,u[1]())}})).reduce((e,{keys:t,fn:n,up:r=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:r}),e),{}),r=({key:e,code:n})=>{let r=t[e]||t[n];if(!r)return;let{fn:i,pressed:o,up:a}=r;r.pressed=!0,(a||!o)&&i(!0)},i=({key:e,code:n})=>{let r=t[e]||t[n];if(!r)return;let{fn:i,up:o}=r;r.pressed=!1,o&&i(!1)},o=s||window;return o.addEventListener("keydown",r,{passive:!0}),o.addEventListener("keyup",i,{passive:!0}),()=>{o.removeEventListener("keydown",r),o.removeEventListener("keyup",i)}},[s,l]),r.createElement(a.Provider,{value:u,children:t})}function l(e){let[t,n,i]=r.useContext(a);return e?i(e):[t,n]}},30280:function(e,t,n){n.d(t,{H:function(){return u}});var r=n(45045),i=n(82911),o=n(26398),a=n(25610),s=n(1848),l=n(19938),c=n(97458),u=(0,o.G)(function(e,t){let{className:n,motionProps:o,...u}=e,{reduceMotion:d}=(0,r.EF)(),{getPanelProps:m,isOpen:f}=(0,i.bB)(),p=m(u,t),h=(0,l.cx)("chakra-accordion__panel",n),v=(0,i.YO)();d||delete p.hidden;let x=(0,c.jsx)(a.m.div,{...p,__css:v.panel,className:h});return d?x:(0,c.jsx)(s.U,{in:f,...o,children:x})});u.displayName="AccordionPanel"},45045:function(e,t,n){n.d(t,{As:function(){return c},EF:function(){return d},Zl:function(){return m},a2:function(){return u}});var r=n(82911),i=n(96248),o=n(79206),a=n(16227),s=n(19938),l=n(52983);function c(e){let{onChange:t,defaultIndex:n,index:i,allowMultiple:a,allowToggle:c,...u}=e;(function(e){let t=e.index||e.defaultIndex,n=null!=t&&!Array.isArray(t)&&e.allowMultiple;(0,s.ZK)({condition:!!n,message:`If 'allowMultiple' is passed, then 'index' or 'defaultIndex' must be an array. You passed: ${typeof t},`})})(e),(0,s.ZK)({condition:!!(e.allowMultiple&&e.allowToggle),message:"If 'allowMultiple' is passed, 'allowToggle' will be ignored. Either remove 'allowToggle' or 'allowMultiple' depending on whether you want multiple accordions visible or not"});let d=(0,r._v)(),[m,f]=(0,l.useState)(-1);(0,l.useEffect)(()=>()=>{f(-1)},[]);let[p,h]=(0,o.T)({value:i,defaultValue:()=>a?null!=n?n:[]:null!=n?n:-1,onChange:t});return{index:p,setIndex:h,htmlProps:u,getAccordionItemProps:e=>{let t=!1;return null!==e&&(t=Array.isArray(p)?p.includes(e):p===e),{isOpen:t,onChange:t=>{null!==e&&(a&&Array.isArray(p)?h(t?p.concat(e):p.filter(t=>t!==e)):t?h(e):c&&h(-1))}}},focusedIndex:m,setFocusedIndex:f,descendants:d}}var[u,d]=(0,i.k)({name:"AccordionContext",hookName:"useAccordionContext",providerName:"Accordion"});function m(e){var t;let{isDisabled:n,isFocusable:i,id:o,...c}=e,{getAccordionItemProps:u,setFocusedIndex:m}=d(),f=(0,l.useRef)(null),p=(0,l.useId)(),h=null!=o?o:p,v=`accordion-button-${h}`,x=`accordion-panel-${h}`;(0,s.ZK)({condition:!!(e.isFocusable&&!e.isDisabled),message:`Using only 'isFocusable', this prop is reserved for situations where you pass 'isDisabled' but you still want the element to receive focus (A11y). Either remove it or pass 'isDisabled' as well.
    `});let{register:y,index:g,descendants:w}=(0,r.mc)({disabled:n&&!i}),{isOpen:b,onChange:S}=u(-1===g?null:g);t={isOpen:b,isDisabled:n},(0,s.ZK)({condition:t.isOpen&&!!t.isDisabled,message:"Cannot open a disabled accordion item"});let E=(0,l.useCallback)(()=>{null==S||S(!b),m(g)},[g,m,b,S]),_=(0,l.useCallback)(e=>{let t={ArrowDown:()=>{let e=w.nextEnabled(g);null==e||e.node.focus()},ArrowUp:()=>{let e=w.prevEnabled(g);null==e||e.node.focus()},Home:()=>{let e=w.firstEnabled();null==e||e.node.focus()},End:()=>{let e=w.lastEnabled();null==e||e.node.focus()}}[e.key];t&&(e.preventDefault(),t(e))},[w,g]),k=(0,l.useCallback)(()=>{m(g)},[m,g]),A=(0,l.useCallback)(function(e={},t=null){return{...e,type:"button",ref:(0,a.lq)(y,f,t),id:v,disabled:!!n,"aria-expanded":!!b,"aria-controls":x,onClick:(0,s.v0)(e.onClick,E),onFocus:(0,s.v0)(e.onFocus,k),onKeyDown:(0,s.v0)(e.onKeyDown,_)}},[v,n,b,E,k,_,x,y]),P=(0,l.useCallback)(function(e={},t=null){return{...e,ref:t,role:"region",id:x,"aria-labelledby":v,hidden:!b}},[v,b,x]);return{isOpen:b,isDisabled:n,isFocusable:i,onOpen:()=>{null==S||S(!0)},onClose:()=>{null==S||S(!1)},getButtonProps:A,getPanelProps:P,htmlProps:c}}},74827:function(e,t,n){n.d(t,{U:function(){return m}});var r=n(45045),i=n(82911),o=n(26398),a=n(15627),s=n(42089),l=n(25610),c=n(19938),u=n(52983),d=n(97458),m=(0,o.G)(function({children:e,reduceMotion:t,...n},o){let m=(0,a.jC)("Accordion",n),f=(0,s.Lr)(n),{htmlProps:p,descendants:h,...v}=(0,r.As)(f),x=(0,u.useMemo)(()=>({...v,reduceMotion:!!t}),[v,t]);return(0,d.jsx)(i.di,{value:h,children:(0,d.jsx)(r.a2,{value:x,children:(0,d.jsx)(i.lh,{value:m,children:(0,d.jsx)(l.m.div,{ref:o,...p,className:(0,c.cx)("chakra-accordion",n.className),__css:m.root,children:e})})})})});m.displayName="Accordion"},26473:function(e,t,n){n.d(t,{Q:function(){return u}});var r=n(45045),i=n(82911),o=n(26398),a=n(25610),s=n(19938),l=n(52983),c=n(97458),u=(0,o.G)(function(e,t){let{children:n,className:o}=e,{htmlProps:u,...d}=(0,r.Zl)(e),m={...(0,i.YO)().container,overflowAnchor:"none"},f=(0,l.useMemo)(()=>d,[d]);return(0,c.jsx)(i.ec,{value:f,children:(0,c.jsx)(a.m.div,{ref:t,...u,className:(0,s.cx)("chakra-accordion__item",o),__css:m,children:"function"==typeof n?n({isExpanded:!!d.isOpen,isDisabled:!!d.isDisabled}):n})})});u.displayName="AccordionItem"},7498:function(e,t,n){n.d(t,{K:function(){return l}});var r=n(82911),i=n(26398),o=n(25610),a=n(19938),s=n(97458),l=(0,i.G)(function(e,t){let{getButtonProps:n}=(0,r.bB)(),i=n(e,t),l={display:"flex",alignItems:"center",width:"100%",outline:0,...(0,r.YO)().button};return(0,s.jsx)(o.m.button,{...i,className:(0,a.cx)("chakra-accordion__button",e.className),__css:l})});l.displayName="AccordionButton"},82911:function(e,t,n){n.d(t,{YO:function(){return a},_v:function(){return d},bB:function(){return l},di:function(){return c},ec:function(){return s},lh:function(){return o},mc:function(){return m}});var r=n(75548),i=n(96248),[o,a]=(0,i.k)({name:"AccordionStylesContext",hookName:"useAccordionStyles",providerName:"<Accordion />"}),[s,l]=(0,i.k)({name:"AccordionItemContext",hookName:"useAccordionItemContext",providerName:"<AccordionItem />"}),[c,u,d,m]=(0,r.n)()},67844:function(e,t,n){n.d(t,{X:function(){return b}});var r=n(52983),i=n(20879),o=n(25610),a=n(97458);function s(e){return(0,a.jsx)(o.m.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...e,children:(0,a.jsx)("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function l(e){return(0,a.jsx)(o.m.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...e,children:(0,a.jsx)("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function c(e){let{isIndeterminate:t,isChecked:n,...r}=e;return n||t?(0,a.jsx)(o.m.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:(0,a.jsx)(t?l:s,{...r})}):null}var u=n(78486),d=n(19938),m=n(10915),f=n(26398),p=n(15627),h=n(42089),v={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},x={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},y=(0,m.F4)({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),g=(0,m.F4)({from:{opacity:0},to:{opacity:1}}),w=(0,m.F4)({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),b=(0,f.G)(function(e,t){let n=(0,i.J)(),s={...n,...e},l=(0,p.jC)("Checkbox",s),m=(0,h.Lr)(e),{spacing:f="0.5rem",className:b,children:S,iconColor:E,iconSize:_,icon:k=(0,a.jsx)(c,{}),isChecked:A,isDisabled:P=null==n?void 0:n.isDisabled,onChange:C,inputProps:M,...L}=m,j=A;(null==n?void 0:n.value)&&m.value&&(j=n.value.includes(m.value));let z=C;(null==n?void 0:n.onChange)&&m.value&&(z=(0,d.PP)(n.onChange,C));let{state:N,getInputProps:U,getCheckboxProps:D,getLabelProps:I,getRootProps:R}=(0,u.O)({...L,isDisabled:P,isChecked:j,onChange:z}),T=function(e){let[t,n]=(0,r.useState)(e),[i,o]=(0,r.useState)(!1);return e!==t&&(o(!0),n(e)),i}(N.isChecked),B=(0,r.useMemo)(()=>({animation:T?N.isIndeterminate?`${g} 20ms linear, ${w} 200ms linear`:`${y} 200ms linear`:void 0,fontSize:_,color:E,...l.icon}),[E,_,T,N.isIndeterminate,l.icon]),F=(0,r.cloneElement)(k,{__css:B,isIndeterminate:N.isIndeterminate,isChecked:N.isChecked});return(0,a.jsxs)(o.m.label,{__css:{...x,...l.container},className:(0,d.cx)("chakra-checkbox",b),...R(),children:[(0,a.jsx)("input",{className:"chakra-checkbox__input",...U(M,t)}),(0,a.jsx)(o.m.span,{__css:{...v,...l.control},className:"chakra-checkbox__control",...D(),children:F}),S&&(0,a.jsx)(o.m.span,{className:"chakra-checkbox__label",...I(),__css:{marginStart:f,...l.label},children:S})]})});b.displayName="Checkbox"},20879:function(e,t,n){n.d(t,{J:function(){return i},z:function(){return r}});var[r,i]=(0,n(96248).k)({name:"CheckboxGroupContext",strict:!1})},87059:function(e,t,n){n.d(t,{K:function(){return a},Y:function(){return o}});var r=n(71327),i=n(19938);function o(e){let{isDisabled:t,isInvalid:n,isReadOnly:r,isRequired:o,...s}=a(e);return{...s,disabled:t,readOnly:r,required:o,"aria-invalid":(0,i.Qm)(n),"aria-required":(0,i.Qm)(o),"aria-readonly":(0,i.Qm)(r)}}function a(e){var t,n,o;let a=(0,r.NJ)(),{id:s,disabled:l,readOnly:c,required:u,isRequired:d,isInvalid:m,isReadOnly:f,isDisabled:p,onFocus:h,onBlur:v,...x}=e,y=e["aria-describedby"]?[e["aria-describedby"]]:[];return(null==a?void 0:a.hasFeedbackText)&&(null==a?void 0:a.isInvalid)&&y.push(a.feedbackId),(null==a?void 0:a.hasHelpText)&&y.push(a.helpTextId),{...x,"aria-describedby":y.join(" ")||void 0,id:null!=s?s:null==a?void 0:a.id,isDisabled:null!=(t=null!=l?l:p)?t:null==a?void 0:a.isDisabled,isReadOnly:null!=(n=null!=c?c:f)?n:null==a?void 0:a.isReadOnly,isRequired:null!=(o=null!=u?u:d)?o:null==a?void 0:a.isRequired,isInvalid:null!=m?m:null==a?void 0:a.isInvalid,onFocus:(0,i.v0)(null==a?void 0:a.onFocus,h),onBlur:(0,i.v0)(null==a?void 0:a.onBlur,v)}}},71327:function(e,t,n){n.d(t,{NI:function(){return v},NJ:function(){return h},Q6:function(){return x},e:function(){return f}});var r=n(96248),i=n(16227),o=n(26398),a=n(15627),s=n(42089),l=n(25610),c=n(19938),u=n(52983),d=n(97458),[m,f]=(0,r.k)({name:"FormControlStylesContext",errorMessage:"useFormControlStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<FormControl />\" "}),[p,h]=(0,r.k)({strict:!1,name:"FormControlContext"}),v=(0,o.G)(function(e,t){let n=(0,a.jC)("Form",e),{getRootProps:r,htmlProps:o,...f}=function(e){let{id:t,isRequired:n,isInvalid:r,isDisabled:o,isReadOnly:a,...s}=e,l=(0,u.useId)(),d=t||`field-${l}`,m=`${d}-label`,f=`${d}-feedback`,p=`${d}-helptext`,[h,v]=(0,u.useState)(!1),[x,y]=(0,u.useState)(!1),[g,w]=(0,u.useState)(!1),b=(0,u.useCallback)((e={},t=null)=>({id:p,...e,ref:(0,i.lq)(t,e=>{e&&y(!0)})}),[p]),S=(0,u.useCallback)((e={},t=null)=>({...e,ref:t,"data-focus":(0,c.PB)(g),"data-disabled":(0,c.PB)(o),"data-invalid":(0,c.PB)(r),"data-readonly":(0,c.PB)(a),id:void 0!==e.id?e.id:m,htmlFor:void 0!==e.htmlFor?e.htmlFor:d}),[d,o,g,r,a,m]),E=(0,u.useCallback)((e={},t=null)=>({id:f,...e,ref:(0,i.lq)(t,e=>{e&&v(!0)}),"aria-live":"polite"}),[f]),_=(0,u.useCallback)((e={},t=null)=>({...e,...s,ref:t,role:"group","data-focus":(0,c.PB)(g),"data-disabled":(0,c.PB)(o),"data-invalid":(0,c.PB)(r),"data-readonly":(0,c.PB)(a)}),[s,o,g,r,a]);return{isRequired:!!n,isInvalid:!!r,isReadOnly:!!a,isDisabled:!!o,isFocused:!!g,onFocus:()=>w(!0),onBlur:()=>w(!1),hasFeedbackText:h,setHasFeedbackText:v,hasHelpText:x,setHasHelpText:y,id:d,labelId:m,feedbackId:f,helpTextId:p,htmlProps:s,getHelpTextProps:b,getErrorMessageProps:E,getRootProps:_,getLabelProps:S,getRequiredIndicatorProps:(0,u.useCallback)((e={},t=null)=>({...e,ref:t,role:"presentation","aria-hidden":!0,children:e.children||"*"}),[])}}((0,s.Lr)(e)),h=(0,c.cx)("chakra-form-control",e.className);return(0,d.jsx)(p,{value:f,children:(0,d.jsx)(m,{value:n,children:(0,d.jsx)(l.m.div,{...r({},t),className:h,__css:n.container})})})});v.displayName="FormControl";var x=(0,o.G)(function(e,t){let n=h(),r=f(),i=(0,c.cx)("chakra-form__helper-text",e.className);return(0,d.jsx)(l.m.div,{...null==n?void 0:n.getHelpTextProps(e,t),__css:r.helperText,className:i})});x.displayName="FormHelperText"},56:function(e,t,n){n.d(t,{l:function(){return u}});var r=n(71327),i=n(26398),o=n(15627),a=n(42089),s=n(25610),l=n(19938),c=n(97458),u=(0,i.G)(function(e,t){var n;let i=(0,o.mq)("FormLabel",e),u=(0,a.Lr)(e),{className:m,children:f,requiredIndicator:p=(0,c.jsx)(d,{}),optionalIndicator:h=null,...v}=u,x=(0,r.NJ)(),y=null!=(n=null==x?void 0:x.getLabelProps(v,t))?n:{ref:t,...v};return(0,c.jsxs)(s.m.label,{...y,className:(0,l.cx)("chakra-form__label",u.className),__css:{display:"block",textAlign:"start",...i},children:[f,(null==x?void 0:x.isRequired)?p:h]})});u.displayName="FormLabel";var d=(0,i.G)(function(e,t){let n=(0,r.NJ)(),i=(0,r.e)();if(!(null==n?void 0:n.isRequired))return null;let o=(0,l.cx)("chakra-form__required-indicator",e.className);return(0,c.jsx)(s.m.span,{...null==n?void 0:n.getRequiredIndicatorProps(e,t),__css:i.requiredIndicator,className:o})});d.displayName="RequiredIndicator"},3347:function(e,t,n){n.d(t,{I:function(){return u}});var r=n(87059),i=n(26398),o=n(15627),a=n(42089),s=n(25610),l=n(19938),c=n(97458),u=(0,i.G)(function(e,t){let{htmlSize:n,...i}=e,u=(0,o.jC)("Input",i),d=(0,a.Lr)(i),m=(0,r.Y)(d),f=(0,l.cx)("chakra-input",e.className);return(0,c.jsx)(s.m.input,{size:n,...m,__css:u.field,ref:t,className:f})});u.displayName="Input",u.id="Input"},86169:function(e,t,n){n.d(t,{U:function(){return a}});var r=n(63009),i=n(26398),o=n(97458),a=(0,i.G)((e,t)=>(0,o.jsx)(r.K,{align:"center",...e,direction:"row",ref:t}));a.displayName="HStack"},30366:function(e,t,n){n.d(t,{M:function(){return a}});var r=n(25610),i=n(26398),o=n(97458),a=(0,r.m)("div",{baseStyle:{display:"flex",alignItems:"center",justifyContent:"center"}});a.displayName="Center";var s={horizontal:{insetStart:"50%",transform:"translateX(-50%)"},vertical:{top:"50%",transform:"translateY(-50%)"},both:{insetStart:"50%",top:"50%",transform:"translate(-50%, -50%)"}};(0,i.G)(function(e,t){let{axis:n="both",...i}=e;return(0,o.jsx)(r.m.div,{ref:t,__css:s[n],...i,position:"absolute"})})},52250:function(e,t,n){n.d(t,{r:function(){return a}});var r=n(26398),i=n(25610),o=n(97458),a=(0,r.G)(function(e,t){let{templateAreas:n,gap:r,rowGap:a,columnGap:s,column:l,row:c,autoFlow:u,autoRows:d,templateRows:m,autoColumns:f,templateColumns:p,...h}=e;return(0,o.jsx)(i.m.div,{ref:t,__css:{display:"grid",gridTemplateAreas:n,gridGap:r,gridRowGap:a,gridColumnGap:s,gridAutoColumns:f,gridColumn:l,gridRow:c,gridAutoFlow:u,gridAutoRows:d,gridTemplateRows:m,gridTemplateColumns:p},...h})});a.displayName="Grid"},7070:function(e,t,n){n.d(t,{M:function(){return c}});var r=n(52250),i=n(26398),o=n(61112),a=n(71778),s=n(9878),l=n(97458),c=(0,i.G)(function(e,t){let{columns:n,spacingX:i,spacingY:c,spacing:u,minChildWidth:d,...m}=e,f=(0,o.F)(),p=d?(0,s.XQ)(d,e=>{let t=(0,a.LP)("sizes",e,"number"==typeof e?`${e}px`:e)(f);return null===e?null:`repeat(auto-fit, minmax(${t}, 1fr))`}):(0,s.XQ)(n,e=>null===e?null:`repeat(${e}, minmax(0, 1fr))`);return(0,l.jsx)(r.r,{ref:t,gap:u,columnGap:i,rowGap:c,templateColumns:p,...m})});c.displayName="SimpleGrid"},45276:function(e,t,n){n.d(t,{C:function(){return c}});var r=n(26398),i=n(15627),o=n(42089),a=n(25610),s=n(19938),l=n(97458),c=(0,r.G)(function(e,t){let n=(0,i.mq)("Badge",e),{className:r,...c}=(0,o.Lr)(e);return(0,l.jsx)(a.m.span,{ref:t,className:(0,s.cx)("chakra-badge",e.className),...c,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...n}})});c.displayName="Badge"},44620:function(e,t,n){n.d(t,{o:function(){return c}});var r=n(26398),i=n(25610),o=n(9878),a=n(19938),s=n(52983),l=n(97458),c=(0,r.G)(function(e,t){let{ratio:n=4/3,children:r,className:c,...u}=e,d=s.Children.only(r),m=(0,a.cx)("chakra-aspect-ratio",c);return(0,l.jsx)(i.m.div,{ref:t,position:"relative",className:m,_before:{height:0,content:'""',display:"block",paddingBottom:(0,o.XQ)(n,e=>`${1/e*100}%`)},__css:{"& > *:not(style)":{overflow:"hidden",position:"absolute",top:"0",right:"0",bottom:"0",left:"0",display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%"},"& > img, & > video":{objectFit:"cover"}},...u,children:d})});c.displayName="AspectRatio"},94086:function(e,t,n){function r(e,t){let n=function(e){let t=parseFloat(e);return"number"!=typeof t||Number.isNaN(t)?0:t}(e),r=10**(null!=t?t:10);return n=Math.round(n*r)/r,t?n.toFixed(t):n.toString()}function i(e){if(!Number.isFinite(e))return 0;let t=1,n=0;for(;Math.round(e*t)/t!==e;)t*=10,n+=1;return n}function o(e,t,n){return(e-t)*100/(n-t)}function a(e,t,n){return(n-t)*e+t}function s(e,t,n){return r(Math.round((e-t)/n)*n+t,i(n))}function l(e,t,n){return null==e?e:(n<t&&console.warn("clamp: max cannot be less than min"),Math.min(Math.max(e,t),n))}n.d(t,{HU:function(){return l},Rg:function(){return o},WP:function(){return s},WS:function(){return a},Zd:function(){return r},vk:function(){return i}})},38834:function(e,t,n){n.d(t,{P:function(){return m}});var r=n(19938),i=n(26398),o=n(25610),a=n(97458),s=(0,i.G)(function(e,t){let{children:n,placeholder:i,className:s,...l}=e;return(0,a.jsxs)(o.m.select,{...l,ref:t,className:(0,r.cx)("chakra-select",s),children:[i&&(0,a.jsx)("option",{value:"",children:i}),n]})});s.displayName="SelectField";var l=n(87059),c=n(15627),u=n(42089),d=n(52983),m=(0,i.G)((e,t)=>{var n;let i=(0,c.jC)("Select",e),{rootProps:d,placeholder:m,icon:f,color:p,height:v,h:x,minH:y,minHeight:g,iconColor:w,iconSize:b,...S}=(0,u.Lr)(e),[E,_]=function(e,t){let n={},r={};for(let[i,o]of Object.entries(e))t.includes(i)?n[i]=o:r[i]=o;return[n,r]}(S,u.oE),k=(0,l.Y)(_),A={paddingEnd:"2rem",...i.field,_focus:{zIndex:"unset",...null==(n=i.field)?void 0:n._focus}};return(0,a.jsxs)(o.m.div,{className:"chakra-select__wrapper",__css:{width:"100%",height:"fit-content",position:"relative",color:p},...E,...d,children:[(0,a.jsx)(s,{ref:t,height:null!=x?x:v,minH:null!=y?y:g,placeholder:m,...k,__css:A,children:e.children}),(0,a.jsx)(h,{"data-disabled":(0,r.PB)(k.disabled),...(w||p)&&{color:w||p},__css:i.icon,...b&&{fontSize:b},children:f})]})});m.displayName="Select";var f=e=>(0,a.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,a.jsx)("path",{fill:"currentColor",d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"})}),p=(0,o.m)("div",{baseStyle:{position:"absolute",display:"inline-flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",top:"50%",transform:"translateY(-50%)"}}),h=e=>{let{children:t=(0,a.jsx)(f,{}),...n}=e,r=(0,d.cloneElement)(t,{role:"presentation",className:"chakra-select__icon",focusable:!1,"aria-hidden":!0,style:{width:"1em",height:"1em",color:"currentColor"}});return(0,a.jsx)(p,{...n,className:"chakra-select__icon-wrapper",children:(0,d.isValidElement)(t)?r:null})};h.displayName="SelectIcon"},14056:function(e,t,n){n.d(t,{r:function(){return d}});var r=n(78486),i=n(19938),o=n(26398),a=n(15627),s=n(42089),l=n(25610),c=n(52983),u=n(97458),d=(0,o.G)(function(e,t){let n=(0,a.jC)("Switch",e),{spacing:o="0.5rem",children:d,...m}=(0,s.Lr)(e),{getIndicatorProps:f,getInputProps:p,getCheckboxProps:h,getRootProps:v,getLabelProps:x}=(0,r.O)(m),y=(0,c.useMemo)(()=>({display:"inline-block",position:"relative",verticalAlign:"middle",lineHeight:0,...n.container}),[n.container]),g=(0,c.useMemo)(()=>({display:"inline-flex",flexShrink:0,justifyContent:"flex-start",boxSizing:"content-box",cursor:"pointer",...n.track}),[n.track]),w=(0,c.useMemo)(()=>({userSelect:"none",marginStart:o,...n.label}),[o,n.label]);return(0,u.jsxs)(l.m.label,{...v(),className:(0,i.cx)("chakra-switch",e.className),__css:y,children:[(0,u.jsx)("input",{className:"chakra-switch__input",...p({},t)}),(0,u.jsx)(l.m.span,{...h(),className:"chakra-switch__track",__css:g,children:(0,u.jsx)(l.m.span,{__css:n.thumb,className:"chakra-switch__thumb",...f()})}),d&&(0,u.jsx)(l.m.span,{className:"chakra-switch__label",...x(),__css:w,children:d})]})});d.displayName="Switch"},40393:function(e,t,n){n.d(t,{Lj:function(){return r},Sh:function(){return a},js:function(){return o},p$:function(){return s}});var r={ease:[.25,.1,.25,1],easeIn:[.4,0,1,1],easeOut:[0,0,.2,1],easeInOut:[.4,0,.2,1]},i={slideLeft:{position:{left:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"-100%",y:0}},slideRight:{position:{right:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"100%",y:0}},slideUp:{position:{top:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"-100%"}},slideDown:{position:{bottom:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"100%"}}};function o(e){var t;switch(null!=(t=null==e?void 0:e.direction)?t:"right"){case"right":default:return i.slideRight;case"left":return i.slideLeft;case"bottom":return i.slideDown;case"top":return i.slideUp}}var a={enter:{duration:.2,ease:r.easeOut},exit:{duration:.1,ease:r.easeIn}},s={enter:(e,t)=>({...e,delay:"number"==typeof t?t:null==t?void 0:t.enter}),exit:(e,t)=>({...e,delay:"number"==typeof t?t:null==t?void 0:t.exit})}},1848:function(e,t,n){n.d(t,{U:function(){return m}});var r=n(40393),i=n(19938),o=n(44659),a=n(39267),s=n(52983),l=n(97458),c=e=>null!=e&&parseInt(e.toString(),10)>0,u={exit:{height:{duration:.2,ease:r.Lj.ease},opacity:{duration:.3,ease:r.Lj.ease}},enter:{height:{duration:.3,ease:r.Lj.ease},opacity:{duration:.4,ease:r.Lj.ease}}},d={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:i,delay:o})=>{var a;return{...e&&{opacity:c(t)?1:0},height:t,transitionEnd:null==i?void 0:i.exit,transition:null!=(a=null==n?void 0:n.exit)?a:r.p$.exit(u.exit,o)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:i,delay:o})=>{var a;return{...e&&{opacity:1},height:t,transitionEnd:null==i?void 0:i.enter,transition:null!=(a=null==n?void 0:n.enter)?a:r.p$.enter(u.enter,o)}}},m=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:r,animateOpacity:c=!0,startingHeight:u=0,endingHeight:m="auto",style:f,className:p,transition:h,transitionEnd:v,...x}=e,[y,g]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{g(!0)});return()=>clearTimeout(e)},[]),(0,i.ZK)({condition:Number(u)>0&&!!r,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let w=parseFloat(u.toString())>0,b={startingHeight:u,endingHeight:m,animateOpacity:c,transition:y?h:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:r?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:w?"block":"none"}}},S=!r||n,E=n||r?"enter":"exit";return(0,l.jsx)(o.M,{initial:!1,custom:b,children:S&&(0,l.jsx)(a.E.div,{ref:t,...x,className:(0,i.cx)("chakra-collapse",p),style:{overflow:"hidden",display:"block",...f},custom:b,variants:d,initial:!!r&&"exit",animate:E,exit:"exit"})})});m.displayName="Collapse"},4248:function(e,t,n){n.d(t,{i:function(){return r}});let r=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){n.d(t,{Y:function(){return o}});var r=n(16808),i=n(9375);r.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new i.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},r.ShaderLib.line={uniforms:i.rDY.merge([r.UniformsLib.common,r.UniformsLib.fog,r.UniformsLib.line]),vertexShader:`
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
		`};class o extends i.jyz{constructor(e){super({type:"LineMaterial",uniforms:i.rDY.clone(r.ShaderLib.line.uniforms),vertexShader:r.ShaderLib.line.vertexShader,fragmentShader:r.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){let r,i;n.d(t,{w:function(){return S}});var o=n(9375),a=n(90845),s=n(61261);let l=new o.Ltg,c=new o.Pa4,u=new o.Pa4,d=new o.Ltg,m=new o.Ltg,f=new o.Ltg,p=new o.Pa4,h=new o.yGw,v=new o.Zzh,x=new o.Pa4,y=new o.ZzF,g=new o.aLr,w=new o.Ltg;function b(e,t,n){return w.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),w.multiplyScalar(1/w.w),w.x=i/n.width,w.y=i/n.height,w.applyMatrix4(e.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}class S extends o.Kj0{constructor(e=new a.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)c.fromBufferAttribute(t,e),u.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+c.distanceTo(u);let i=new o.$TI(r,2,1);return e.setAttribute("instanceDistanceStart",new o.kB5(i,1,0)),e.setAttribute("instanceDistanceEnd",new o.kB5(i,1,1)),this}raycast(e,t){let n,a;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;r=e.ray;let u=this.matrixWorld,w=this.geometry,S=this.material;if(i=S.linewidth+c,null===w.boundingSphere&&w.computeBoundingSphere(),g.copy(w.boundingSphere).applyMatrix4(u),s)n=.5*i;else{let e=Math.max(l.near,g.distanceToPoint(r.origin));n=b(l,e,S.resolution)}if(g.radius+=n,!1!==r.intersectsSphere(g)){if(null===w.boundingBox&&w.computeBoundingBox(),y.copy(w.boundingBox).applyMatrix4(u),s)a=.5*i;else{let e=Math.max(l.near,y.distanceToPoint(r.origin));a=b(l,e,S.resolution)}y.expandByScalar(a),!1!==r.intersectsBox(y)&&(s?function(e,t){let n=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,c=Math.min(a.instanceCount,s.count);for(let a=0;a<c;a++){v.start.fromBufferAttribute(s,a),v.end.fromBufferAttribute(l,a),v.applyMatrix4(n);let c=new o.Pa4,u=new o.Pa4;r.distanceSqToSegment(v.start,v.end,u,c),u.distanceTo(c)<.5*i&&t.push({point:u,pointOnLine:c,distance:r.origin.distanceTo(u),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}(this,t):function(e,t,n){let a=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,y=c.attributes.instanceEnd,g=Math.min(c.instanceCount,u.count),w=-t.near;r.at(1,f),f.w=1,f.applyMatrix4(t.matrixWorldInverse),f.applyMatrix4(a),f.multiplyScalar(1/f.w),f.x*=s.x/2,f.y*=s.y/2,f.z=0,p.copy(f),h.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<g;t++){if(d.fromBufferAttribute(u,t),m.fromBufferAttribute(y,t),d.w=1,m.w=1,d.applyMatrix4(h),m.applyMatrix4(h),d.z>w&&m.z>w)continue;if(d.z>w){let e=d.z-m.z,t=(d.z-w)/e;d.lerp(m,t)}else if(m.z>w){let e=m.z-d.z,t=(m.z-w)/e;m.lerp(d,t)}d.applyMatrix4(a),m.applyMatrix4(a),d.multiplyScalar(1/d.w),m.multiplyScalar(1/m.w),d.x*=s.x/2,d.y*=s.y/2,m.x*=s.x/2,m.y*=s.y/2,v.start.copy(d),v.start.z=0,v.end.copy(m),v.end.z=0;let c=v.closestPointToPointParameter(p,!0);v.at(c,x);let f=o.M8C.lerp(d.z,m.z,c),g=f>=-1&&f<=1,b=p.distanceTo(x)<.5*i;if(g&&b){v.start.fromBufferAttribute(u,t),v.end.fromBufferAttribute(y,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let i=new o.Pa4,a=new o.Pa4;r.distanceSqToSegment(v.start,v.end,a,i),n.push({point:a,pointOnLine:i,distance:r.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){n.d(t,{z:function(){return a}});var r=n(9375);let i=new r.ZzF,o=new r.Pa4;class a extends r.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new r.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new r.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new r.$TI(t,6,1);return this.setAttribute("instanceStart",new r.kB5(n,3,0)),this.setAttribute("instanceEnd",new r.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new r.$TI(t,6,1);return this.setAttribute("instanceColorStart",new r.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new r.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new r.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new r.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),i.setFromBufferAttribute(t),this.boundingBox.union(i))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new r.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)o.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(o)),o.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(o));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){n.d(t,{XR:function(){return r}});let r=e=>(t,n,r)=>{let i=r.subscribe;return r.subscribe=(e,t,n)=>{let o=e;if(t){let i=(null==n?void 0:n.equalityFn)||Object.is,a=e(r.getState());o=n=>{let r=e(n);if(!i(a,r)){let e=a;t(a=r,e)}},(null==n?void 0:n.fireImmediately)&&t(a,a)}return i(o)},e(t,n,r)}},73542:function(e,t,n){n.d(t,{U:function(){return l},o:function(){return a}});var r=n(52983),i=n(98565);let o=e=>e;function a(e,t=o){let n=r.useSyncExternalStore(e.subscribe,r.useCallback(()=>t(e.getState()),[e,t]),r.useCallback(()=>t(e.getInitialState()),[e,t]));return r.useDebugValue(n),n}let s=e=>{let t=(0,i.M)(e),n=e=>a(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){n.d(t,{M:function(){return i}});let r=e=>{let t;let n=new Set,r=(e,r)=>{let i="function"==typeof e?e(t):e;if(!Object.is(i,t)){let e=t;t=(null!=r?r:"object"!=typeof i||null===i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,o={setState:r,getState:i,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(r,i,o);return o},i=e=>e?r(e):r}}]);