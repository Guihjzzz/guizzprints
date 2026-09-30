"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[42913,3120,76137,24720],{58109:function(e,a,t){t.d(a,{V:function(){return r}});var i=t(99217),b=t(62510),n=t(52983),c=t(9375);let r=n.forwardRef(function({children:e,follow:a=!0,lockX:t=!1,lockY:r=!1,lockZ:o=!1,...l},s){let d=n.useRef(null),p=n.useRef(null),f=new c._fP;return(0,b.F)(({camera:e})=>{if(!a||!p.current)return;let i=d.current.rotation.clone();p.current.updateMatrix(),p.current.updateWorldMatrix(!1,!1),p.current.getWorldQuaternion(f),e.getWorldQuaternion(d.current.quaternion).premultiply(f.invert()),t&&(d.current.rotation.x=i.x),r&&(d.current.rotation.y=i.y),o&&(d.current.rotation.z=i.z)}),n.useImperativeHandle(s,()=>p.current,[]),n.createElement("group",(0,i.Z)({ref:p},l),n.createElement("group",{ref:d},e))})},71709:function(e,a,t){t.d(a,{B:function(){return f},Y:function(){return p}});var i,b=t(52983),n=t(9375),c=t(62510),r=((i=r||{})[i.NONE=0]="NONE",i[i.START=1]="START",i[i.ACTIVE=2]="ACTIVE",i);let o=e=>e&&e.isOrthographicCamera,l=e=>e&&e.isBox3,s=e=>1-Math.exp(-5*e)+.007*e,d=b.createContext(null);function p({children:e,maxDuration:a=1,margin:t=1.2,observe:i,fit:p,clip:f,interpolateFunc:u=s,onFit:m}){let h=b.useRef(null),{camera:g,size:v,invalidate:x}=(0,c.D)(),k=(0,c.D)(e=>e.controls),w=b.useRef(m);w.current=m;let j=b.useRef({camPos:new n.Pa4,camRot:new n._fP,camZoom:1}),y=b.useRef({camPos:void 0,camRot:void 0,camZoom:void 0,camUp:void 0,target:void 0}),S=b.useRef(r.NONE),A=b.useRef(0),[F]=b.useState(()=>new n.ZzF),E=b.useMemo(()=>{function e(){let e=F.getSize(new n.Pa4),a=F.getCenter(new n.Pa4),i=Math.max(e.x,e.y,e.z),b=o(g)?4*i:i/(2*Math.atan(Math.PI*g.fov/360)),c=o(g)?4*i:b/g.aspect;return{box:F,size:e,center:a,distance:t*Math.max(b,c)}}return{getSize:e,refresh(e){if(l(e))F.copy(e);else{let a=e||h.current;if(!a)return this;a.updateWorldMatrix(!0,!0),F.setFromObject(a)}if(F.isEmpty()){let e=g.position.length()||10;F.setFromCenterAndSize(new n.Pa4,new n.Pa4(e,e,e))}return j.current.camPos.copy(g.position),j.current.camRot.copy(g.quaternion),o(g)&&(j.current.camZoom=g.zoom),y.current.camPos=void 0,y.current.camRot=void 0,y.current.camZoom=void 0,y.current.camUp=void 0,y.current.target=void 0,this},reset(){let{center:a,distance:t}=e(),i=g.position.clone().sub(a).normalize();y.current.camPos=a.clone().addScaledVector(i,t),y.current.target=a.clone();let b=new n.yGw().lookAt(y.current.camPos,y.current.target,g.up);return y.current.camRot=new n._fP().setFromRotationMatrix(b),S.current=r.START,A.current=0,this},moveTo(e){return y.current.camPos=Array.isArray(e)?new n.Pa4(...e):e.clone(),S.current=r.START,A.current=0,this},lookAt({target:e,up:a}){y.current.target=Array.isArray(e)?new n.Pa4(...e):e.clone(),a?y.current.camUp=Array.isArray(a)?new n.Pa4(...a):a.clone():y.current.camUp=g.up.clone();let t=new n.yGw().lookAt(y.current.camPos||g.position,y.current.target,y.current.camUp);return y.current.camRot=new n._fP().setFromRotationMatrix(t),S.current=r.START,A.current=0,this},to({position:e,target:a}){return this.moveTo(e).lookAt({target:a})},fit(){if(!o(g))return this.reset();let e=0,a=0,i=[new n.Pa4(F.min.x,F.min.y,F.min.z),new n.Pa4(F.min.x,F.max.y,F.min.z),new n.Pa4(F.min.x,F.min.y,F.max.z),new n.Pa4(F.min.x,F.max.y,F.max.z),new n.Pa4(F.max.x,F.max.y,F.max.z),new n.Pa4(F.max.x,F.max.y,F.min.z),new n.Pa4(F.max.x,F.min.y,F.max.z),new n.Pa4(F.max.x,F.min.y,F.min.z)],b=y.current.camPos||g.position,c=y.current.target||(null==k?void 0:k.target),l=y.current.camUp||g.up,s=c?new n.yGw().lookAt(b,c,l).setPosition(b).invert():g.matrixWorldInverse;for(let t of i)t.applyMatrix4(s),e=Math.max(e,Math.abs(t.y)),a=Math.max(a,Math.abs(t.x));e*=2,a*=2;let d=(g.top-g.bottom)/e,p=(g.right-g.left)/a;return y.current.camZoom=Math.min(d,p)/t,S.current=r.START,A.current=0,w.current&&w.current(this.getSize()),this},clip(){let{distance:a}=e();return g.near=a/100,g.far=100*a,g.updateProjectionMatrix(),k&&(k.maxDistance=10*a,k.update()),x(),this}}},[F,g,k,t,x]);b.useLayoutEffect(()=>{if(k){let e=()=>{if(k&&y.current.target&&S.current!==r.NONE){let e=new n.Pa4().setFromMatrixColumn(g.matrix,2),a=j.current.camPos.distanceTo(k.target),t=(y.current.camPos||j.current.camPos).distanceTo(y.current.target),i=(1-A.current)*a+A.current*t;k.target.copy(g.position).addScaledVector(e,-i),k.update()}S.current=r.NONE};return k.addEventListener("start",e),()=>k.removeEventListener("start",e)}},[k]);let z=b.useRef(0);return b.useLayoutEffect(()=>{(i||0==z.current++)&&(E.refresh(),p&&E.reset().fit(),f&&E.clip())},[v,f,p,i,g,k]),(0,c.F)((e,t)=>{if(S.current===r.START)S.current=r.ACTIVE,x();else if(S.current===r.ACTIVE){if(A.current+=t/a,A.current>=1)y.current.camPos&&g.position.copy(y.current.camPos),y.current.camRot&&g.quaternion.copy(y.current.camRot),y.current.camUp&&g.up.copy(y.current.camUp),y.current.camZoom&&o(g)&&(g.zoom=y.current.camZoom),g.updateMatrixWorld(),g.updateProjectionMatrix(),k&&y.current.target&&(k.target.copy(y.current.target),k.update()),S.current=r.NONE;else{let e=u(A.current);y.current.camPos&&g.position.lerpVectors(j.current.camPos,y.current.camPos,e),y.current.camRot&&g.quaternion.slerpQuaternions(j.current.camRot,y.current.camRot,e),y.current.camUp&&g.up.set(0,1,0).applyQuaternion(g.quaternion),y.current.camZoom&&o(g)&&(g.zoom=(1-e)*j.current.camZoom+e*y.current.camZoom),g.updateMatrixWorld(),g.updateProjectionMatrix()}x()}}),b.createElement("group",{ref:h},b.createElement(d.Provider,{value:E},e))}function f(){return b.useContext(d)}},81125:function(e,a,t){t.d(a,{q:function(){return v}});var i=t(99217),b=t(62510),n=t(52983),c=t(9375),r=t(30535),o=Object.defineProperty,l=(e,a,t)=>a in e?o(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,s=(e,a,t)=>(l(e,"symbol"!=typeof a?a+"":a,t),t);let d=new c.USm(0,0,0,"YXZ"),p=new c.Pa4,f={type:"change"},u={type:"lock"},m={type:"unlock"},h=Math.PI/2;class g extends r.p{constructor(e,a){super(),s(this,"camera"),s(this,"domElement"),s(this,"isLocked"),s(this,"minPolarAngle"),s(this,"maxPolarAngle"),s(this,"pointerSpeed"),s(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(d.setFromQuaternion(this.camera.quaternion),d.y-=.002*e.movementX*this.pointerSpeed,d.x-=.002*e.movementY*this.pointerSpeed,d.x=Math.max(h-this.maxPolarAngle,Math.min(h-this.minPolarAngle,d.x)),this.camera.quaternion.setFromEuler(d),this.dispatchEvent(f))}),s(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(u),this.isLocked=!0):(this.dispatchEvent(m),this.isLocked=!1))}),s(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),s(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),s(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),s(this,"dispose",()=>{this.disconnect()}),s(this,"getObject",()=>this.camera),s(this,"direction",new c.Pa4(0,0,-1)),s(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),s(this,"moveForward",e=>{p.setFromMatrixColumn(this.camera.matrix,0),p.crossVectors(this.camera.up,p),this.camera.position.addScaledVector(p,e)}),s(this,"moveRight",e=>{p.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(p,e)}),s(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),s(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=a,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,a&&this.connect(a)}}let v=n.forwardRef(({domElement:e,selector:a,onChange:t,onLock:c,onUnlock:r,enabled:o=!0,makeDefault:l,...s},d)=>{let{camera:p,...f}=s,u=(0,b.D)(e=>e.setEvents),m=(0,b.D)(e=>e.gl),h=(0,b.D)(e=>e.camera),v=(0,b.D)(e=>e.invalidate),x=(0,b.D)(e=>e.events),k=(0,b.D)(e=>e.get),w=(0,b.D)(e=>e.set),j=p||h,y=e||x.connected||m.domElement,S=n.useMemo(()=>new g(j),[j]);return n.useEffect(()=>{if(o){S.connect(y);let e=k().events.compute;return u({compute(e,a){let t=a.size.width/2,i=a.size.height/2;a.pointer.set(t/a.size.width*2-1,-(i/a.size.height*2)+1),a.raycaster.setFromCamera(a.pointer,a.camera)}}),()=>{S.disconnect(),u({compute:e})}}},[o,S]),n.useEffect(()=>{let e=e=>{v(),t&&t(e)};S.addEventListener("change",e),c&&S.addEventListener("lock",c),r&&S.addEventListener("unlock",r);let i=()=>S.lock(),b=a?Array.from(document.querySelectorAll(a)):[document];return b.forEach(e=>e&&e.addEventListener("click",i)),()=>{S.removeEventListener("change",e),c&&S.removeEventListener("lock",c),r&&S.removeEventListener("unlock",r),b.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[t,c,r,a,S,v]),n.useEffect(()=>{if(l){let e=k().controls;return w({controls:S}),()=>w({controls:e})}},[l,S]),n.createElement("primitive",(0,i.Z)({ref:d,object:S},f))})},73420:function(e,a,t){t.d(a,{Z:function(){return o},c:function(){return r}});var i=t(52983),b=t(73542),n=t(75575);let c=i.createContext(null);function r({map:e,children:a,onChange:t,domElement:r}){let o=e.map(e=>e.name+e.keys).join("-"),l=i.useMemo(()=>(0,b.U)((0,n.XR)(()=>e.reduce((e,a)=>({...e,[a.name]:!1}),{}))),[o]),s=i.useMemo(()=>[l.subscribe,l.getState,l],[o]),d=l.setState;return i.useEffect(()=>{let a=e.map(({name:e,keys:a,up:i})=>({keys:a,up:i,fn:a=>{d({[e]:a}),t&&t(e,a,s[1]())}})).reduce((e,{keys:a,fn:t,up:i=!0})=>(a.forEach(a=>e[a]={fn:t,pressed:!1,up:i}),e),{}),i=({key:e,code:t})=>{let i=a[e]||a[t];if(!i)return;let{fn:b,pressed:n,up:c}=i;i.pressed=!0,(c||!n)&&b(!0)},b=({key:e,code:t})=>{let i=a[e]||a[t];if(!i)return;let{fn:b,up:n}=i;i.pressed=!1,n&&b(!1)},n=r||window;return n.addEventListener("keydown",i,{passive:!0}),n.addEventListener("keyup",b,{passive:!0}),()=>{n.removeEventListener("keydown",i),n.removeEventListener("keyup",b)}},[r,o]),i.createElement(c.Provider,{value:s,children:a})}function o(e){let[a,t,b]=i.useContext(c);return e?b(e):[a,t]}},76137:function(e,a,t){t.d(a,{uV:function(){return i.u},BC:function(){return b.B}});var i=t(60576);!function(){var e=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),a=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if("object"==typeof WebAssembly){var t=WebAssembly.validate(e)?i("b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb"):i("b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb");WebAssembly.instantiate(t,{}).then(function(e){e.instance.exports.__wasm_call_ctors()})}function i(e){for(var t=new Uint8Array(e.length),i=0;i<e.length;++i){var b=e.charCodeAt(i);t[i]=b>96?b-97:b>64?b-39:b+4}for(var n=0,i=0;i<e.length;++i)t[n++]=t[i]<60?a[t[i]]:(t[i]-60)*64+t[++i];return t.buffer.slice(0,n)}}();var b=t(86963);t(74153)},30280:function(e,a,t){t.d(a,{H:function(){return s}});var i=t(45045),b=t(82911),n=t(26398),c=t(25610),r=t(1848),o=t(19938),l=t(97458),s=(0,n.G)(function(e,a){let{className:t,motionProps:n,...s}=e,{reduceMotion:d}=(0,i.EF)(),{getPanelProps:p,isOpen:f}=(0,b.bB)(),u=p(s,a),m=(0,o.cx)("chakra-accordion__panel",t),h=(0,b.YO)();d||delete u.hidden;let g=(0,l.jsx)(c.m.div,{...u,__css:h.panel,className:m});return d?g:(0,l.jsx)(r.U,{in:f,...n,children:g})});s.displayName="AccordionPanel"},45045:function(e,a,t){t.d(a,{As:function(){return l},EF:function(){return d},Zl:function(){return p},a2:function(){return s}});var i=t(82911),b=t(96248),n=t(79206),c=t(16227),r=t(19938),o=t(52983);function l(e){let{onChange:a,defaultIndex:t,index:b,allowMultiple:c,allowToggle:l,...s}=e;(function(e){let a=e.index||e.defaultIndex,t=null!=a&&!Array.isArray(a)&&e.allowMultiple;(0,r.ZK)({condition:!!t,message:`If 'allowMultiple' is passed, then 'index' or 'defaultIndex' must be an array. You passed: ${typeof a},`})})(e),(0,r.ZK)({condition:!!(e.allowMultiple&&e.allowToggle),message:"If 'allowMultiple' is passed, 'allowToggle' will be ignored. Either remove 'allowToggle' or 'allowMultiple' depending on whether you want multiple accordions visible or not"});let d=(0,i._v)(),[p,f]=(0,o.useState)(-1);(0,o.useEffect)(()=>()=>{f(-1)},[]);let[u,m]=(0,n.T)({value:b,defaultValue:()=>c?null!=t?t:[]:null!=t?t:-1,onChange:a});return{index:u,setIndex:m,htmlProps:s,getAccordionItemProps:e=>{let a=!1;return null!==e&&(a=Array.isArray(u)?u.includes(e):u===e),{isOpen:a,onChange:a=>{null!==e&&(c&&Array.isArray(u)?m(a?u.concat(e):u.filter(a=>a!==e)):a?m(e):l&&m(-1))}}},focusedIndex:p,setFocusedIndex:f,descendants:d}}var[s,d]=(0,b.k)({name:"AccordionContext",hookName:"useAccordionContext",providerName:"Accordion"});function p(e){var a;let{isDisabled:t,isFocusable:b,id:n,...l}=e,{getAccordionItemProps:s,setFocusedIndex:p}=d(),f=(0,o.useRef)(null),u=(0,o.useId)(),m=null!=n?n:u,h=`accordion-button-${m}`,g=`accordion-panel-${m}`;(0,r.ZK)({condition:!!(e.isFocusable&&!e.isDisabled),message:`Using only 'isFocusable', this prop is reserved for situations where you pass 'isDisabled' but you still want the element to receive focus (A11y). Either remove it or pass 'isDisabled' as well.
    `});let{register:v,index:x,descendants:k}=(0,i.mc)({disabled:t&&!b}),{isOpen:w,onChange:j}=s(-1===x?null:x);a={isOpen:w,isDisabled:t},(0,r.ZK)({condition:a.isOpen&&!!a.isDisabled,message:"Cannot open a disabled accordion item"});let y=(0,o.useCallback)(()=>{null==j||j(!w),p(x)},[x,p,w,j]),S=(0,o.useCallback)(e=>{let a={ArrowDown:()=>{let e=k.nextEnabled(x);null==e||e.node.focus()},ArrowUp:()=>{let e=k.prevEnabled(x);null==e||e.node.focus()},Home:()=>{let e=k.firstEnabled();null==e||e.node.focus()},End:()=>{let e=k.lastEnabled();null==e||e.node.focus()}}[e.key];a&&(e.preventDefault(),a(e))},[k,x]),A=(0,o.useCallback)(()=>{p(x)},[p,x]),F=(0,o.useCallback)(function(e={},a=null){return{...e,type:"button",ref:(0,c.lq)(v,f,a),id:h,disabled:!!t,"aria-expanded":!!w,"aria-controls":g,onClick:(0,r.v0)(e.onClick,y),onFocus:(0,r.v0)(e.onFocus,A),onKeyDown:(0,r.v0)(e.onKeyDown,S)}},[h,t,w,y,A,S,g,v]),E=(0,o.useCallback)(function(e={},a=null){return{...e,ref:a,role:"region",id:g,"aria-labelledby":h,hidden:!w}},[h,w,g]);return{isOpen:w,isDisabled:t,isFocusable:b,onOpen:()=>{null==j||j(!0)},onClose:()=>{null==j||j(!1)},getButtonProps:F,getPanelProps:E,htmlProps:l}}},74827:function(e,a,t){t.d(a,{U:function(){return p}});var i=t(45045),b=t(82911),n=t(26398),c=t(15627),r=t(42089),o=t(25610),l=t(19938),s=t(52983),d=t(97458),p=(0,n.G)(function({children:e,reduceMotion:a,...t},n){let p=(0,c.jC)("Accordion",t),f=(0,r.Lr)(t),{htmlProps:u,descendants:m,...h}=(0,i.As)(f),g=(0,s.useMemo)(()=>({...h,reduceMotion:!!a}),[h,a]);return(0,d.jsx)(b.di,{value:m,children:(0,d.jsx)(i.a2,{value:g,children:(0,d.jsx)(b.lh,{value:p,children:(0,d.jsx)(o.m.div,{ref:n,...u,className:(0,l.cx)("chakra-accordion",t.className),__css:p.root,children:e})})})})});p.displayName="Accordion"},26473:function(e,a,t){t.d(a,{Q:function(){return s}});var i=t(45045),b=t(82911),n=t(26398),c=t(25610),r=t(19938),o=t(52983),l=t(97458),s=(0,n.G)(function(e,a){let{children:t,className:n}=e,{htmlProps:s,...d}=(0,i.Zl)(e),p={...(0,b.YO)().container,overflowAnchor:"none"},f=(0,o.useMemo)(()=>d,[d]);return(0,l.jsx)(b.ec,{value:f,children:(0,l.jsx)(c.m.div,{ref:a,...s,className:(0,r.cx)("chakra-accordion__item",n),__css:p,children:"function"==typeof t?t({isExpanded:!!d.isOpen,isDisabled:!!d.isDisabled}):t})})});s.displayName="AccordionItem"},7498:function(e,a,t){t.d(a,{K:function(){return o}});var i=t(82911),b=t(26398),n=t(25610),c=t(19938),r=t(97458),o=(0,b.G)(function(e,a){let{getButtonProps:t}=(0,i.bB)(),b=t(e,a),o={display:"flex",alignItems:"center",width:"100%",outline:0,...(0,i.YO)().button};return(0,r.jsx)(n.m.button,{...b,className:(0,c.cx)("chakra-accordion__button",e.className),__css:o})});o.displayName="AccordionButton"},82911:function(e,a,t){t.d(a,{YO:function(){return c},_v:function(){return d},bB:function(){return o},di:function(){return l},ec:function(){return r},lh:function(){return n},mc:function(){return p}});var i=t(75548),b=t(96248),[n,c]=(0,b.k)({name:"AccordionStylesContext",hookName:"useAccordionStyles",providerName:"<Accordion />"}),[r,o]=(0,b.k)({name:"AccordionItemContext",hookName:"useAccordionItemContext",providerName:"<AccordionItem />"}),[l,s,d,p]=(0,i.n)()},87059:function(e,a,t){t.d(a,{K:function(){return c},Y:function(){return n}});var i=t(71327),b=t(19938);function n(e){let{isDisabled:a,isInvalid:t,isReadOnly:i,isRequired:n,...r}=c(e);return{...r,disabled:a,readOnly:i,required:n,"aria-invalid":(0,b.Qm)(t),"aria-required":(0,b.Qm)(n),"aria-readonly":(0,b.Qm)(i)}}function c(e){var a,t,n;let c=(0,i.NJ)(),{id:r,disabled:o,readOnly:l,required:s,isRequired:d,isInvalid:p,isReadOnly:f,isDisabled:u,onFocus:m,onBlur:h,...g}=e,v=e["aria-describedby"]?[e["aria-describedby"]]:[];return(null==c?void 0:c.hasFeedbackText)&&(null==c?void 0:c.isInvalid)&&v.push(c.feedbackId),(null==c?void 0:c.hasHelpText)&&v.push(c.helpTextId),{...g,"aria-describedby":v.join(" ")||void 0,id:null!=r?r:null==c?void 0:c.id,isDisabled:null!=(a=null!=o?o:u)?a:null==c?void 0:c.isDisabled,isReadOnly:null!=(t=null!=l?l:f)?t:null==c?void 0:c.isReadOnly,isRequired:null!=(n=null!=s?s:d)?n:null==c?void 0:c.isRequired,isInvalid:null!=p?p:null==c?void 0:c.isInvalid,onFocus:(0,b.v0)(null==c?void 0:c.onFocus,m),onBlur:(0,b.v0)(null==c?void 0:c.onBlur,h)}}},71327:function(e,a,t){t.d(a,{NI:function(){return h},NJ:function(){return m},Q6:function(){return g},e:function(){return f}});var i=t(96248),b=t(16227),n=t(26398),c=t(15627),r=t(42089),o=t(25610),l=t(19938),s=t(52983),d=t(97458),[p,f]=(0,i.k)({name:"FormControlStylesContext",errorMessage:"useFormControlStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<FormControl />\" "}),[u,m]=(0,i.k)({strict:!1,name:"FormControlContext"}),h=(0,n.G)(function(e,a){let t=(0,c.jC)("Form",e),{getRootProps:i,htmlProps:n,...f}=function(e){let{id:a,isRequired:t,isInvalid:i,isDisabled:n,isReadOnly:c,...r}=e,o=(0,s.useId)(),d=a||`field-${o}`,p=`${d}-label`,f=`${d}-feedback`,u=`${d}-helptext`,[m,h]=(0,s.useState)(!1),[g,v]=(0,s.useState)(!1),[x,k]=(0,s.useState)(!1),w=(0,s.useCallback)((e={},a=null)=>({id:u,...e,ref:(0,b.lq)(a,e=>{e&&v(!0)})}),[u]),j=(0,s.useCallback)((e={},a=null)=>({...e,ref:a,"data-focus":(0,l.PB)(x),"data-disabled":(0,l.PB)(n),"data-invalid":(0,l.PB)(i),"data-readonly":(0,l.PB)(c),id:void 0!==e.id?e.id:p,htmlFor:void 0!==e.htmlFor?e.htmlFor:d}),[d,n,x,i,c,p]),y=(0,s.useCallback)((e={},a=null)=>({id:f,...e,ref:(0,b.lq)(a,e=>{e&&h(!0)}),"aria-live":"polite"}),[f]),S=(0,s.useCallback)((e={},a=null)=>({...e,...r,ref:a,role:"group","data-focus":(0,l.PB)(x),"data-disabled":(0,l.PB)(n),"data-invalid":(0,l.PB)(i),"data-readonly":(0,l.PB)(c)}),[r,n,x,i,c]);return{isRequired:!!t,isInvalid:!!i,isReadOnly:!!c,isDisabled:!!n,isFocused:!!x,onFocus:()=>k(!0),onBlur:()=>k(!1),hasFeedbackText:m,setHasFeedbackText:h,hasHelpText:g,setHasHelpText:v,id:d,labelId:p,feedbackId:f,helpTextId:u,htmlProps:r,getHelpTextProps:w,getErrorMessageProps:y,getRootProps:S,getLabelProps:j,getRequiredIndicatorProps:(0,s.useCallback)((e={},a=null)=>({...e,ref:a,role:"presentation","aria-hidden":!0,children:e.children||"*"}),[])}}((0,r.Lr)(e)),m=(0,l.cx)("chakra-form-control",e.className);return(0,d.jsx)(u,{value:f,children:(0,d.jsx)(p,{value:t,children:(0,d.jsx)(o.m.div,{...i({},a),className:m,__css:t.container})})})});h.displayName="FormControl";var g=(0,n.G)(function(e,a){let t=m(),i=f(),b=(0,l.cx)("chakra-form__helper-text",e.className);return(0,d.jsx)(o.m.div,{...null==t?void 0:t.getHelpTextProps(e,a),__css:i.helperText,className:b})});g.displayName="FormHelperText"},56:function(e,a,t){t.d(a,{l:function(){return s}});var i=t(71327),b=t(26398),n=t(15627),c=t(42089),r=t(25610),o=t(19938),l=t(97458),s=(0,b.G)(function(e,a){var t;let b=(0,n.mq)("FormLabel",e),s=(0,c.Lr)(e),{className:p,children:f,requiredIndicator:u=(0,l.jsx)(d,{}),optionalIndicator:m=null,...h}=s,g=(0,i.NJ)(),v=null!=(t=null==g?void 0:g.getLabelProps(h,a))?t:{ref:a,...h};return(0,l.jsxs)(r.m.label,{...v,className:(0,o.cx)("chakra-form__label",s.className),__css:{display:"block",textAlign:"start",...b},children:[f,(null==g?void 0:g.isRequired)?u:m]})});s.displayName="FormLabel";var d=(0,b.G)(function(e,a){let t=(0,i.NJ)(),b=(0,i.e)();if(!(null==t?void 0:t.isRequired))return null;let n=(0,o.cx)("chakra-form__required-indicator",e.className);return(0,l.jsx)(r.m.span,{...null==t?void 0:t.getRequiredIndicatorProps(e,a),__css:b.requiredIndicator,className:n})});d.displayName="RequiredIndicator"},3347:function(e,a,t){t.d(a,{I:function(){return s}});var i=t(87059),b=t(26398),n=t(15627),c=t(42089),r=t(25610),o=t(19938),l=t(97458),s=(0,b.G)(function(e,a){let{htmlSize:t,...b}=e,s=(0,n.jC)("Input",b),d=(0,c.Lr)(b),p=(0,i.Y)(d),f=(0,o.cx)("chakra-input",e.className);return(0,l.jsx)(r.m.input,{size:t,...p,__css:s.field,ref:a,className:f})});s.displayName="Input",s.id="Input"},86169:function(e,a,t){t.d(a,{U:function(){return c}});var i=t(63009),b=t(26398),n=t(97458),c=(0,b.G)((e,a)=>(0,n.jsx)(i.K,{align:"center",...e,direction:"row",ref:a}));c.displayName="HStack"},30366:function(e,a,t){t.d(a,{M:function(){return c}});var i=t(25610),b=t(26398),n=t(97458),c=(0,i.m)("div",{baseStyle:{display:"flex",alignItems:"center",justifyContent:"center"}});c.displayName="Center";var r={horizontal:{insetStart:"50%",transform:"translateX(-50%)"},vertical:{top:"50%",transform:"translateY(-50%)"},both:{insetStart:"50%",top:"50%",transform:"translate(-50%, -50%)"}};(0,b.G)(function(e,a){let{axis:t="both",...b}=e;return(0,n.jsx)(i.m.div,{ref:a,__css:r[t],...b,position:"absolute"})})},52250:function(e,a,t){t.d(a,{r:function(){return c}});var i=t(26398),b=t(25610),n=t(97458),c=(0,i.G)(function(e,a){let{templateAreas:t,gap:i,rowGap:c,columnGap:r,column:o,row:l,autoFlow:s,autoRows:d,templateRows:p,autoColumns:f,templateColumns:u,...m}=e;return(0,n.jsx)(b.m.div,{ref:a,__css:{display:"grid",gridTemplateAreas:t,gridGap:i,gridRowGap:c,gridColumnGap:r,gridAutoColumns:f,gridColumn:o,gridRow:l,gridAutoFlow:s,gridAutoRows:d,gridTemplateRows:p,gridTemplateColumns:u},...m})});c.displayName="Grid"},7070:function(e,a,t){t.d(a,{M:function(){return l}});var i=t(52250),b=t(26398),n=t(61112),c=t(71778),r=t(9878),o=t(97458),l=(0,b.G)(function(e,a){let{columns:t,spacingX:b,spacingY:l,spacing:s,minChildWidth:d,...p}=e,f=(0,n.F)(),u=d?(0,r.XQ)(d,e=>{let a=(0,c.LP)("sizes",e,"number"==typeof e?`${e}px`:e)(f);return null===e?null:`repeat(auto-fit, minmax(${a}, 1fr))`}):(0,r.XQ)(t,e=>null===e?null:`repeat(${e}, minmax(0, 1fr))`);return(0,o.jsx)(i.r,{ref:a,gap:s,columnGap:b,rowGap:l,templateColumns:u,...p})});l.displayName="SimpleGrid"},45276:function(e,a,t){t.d(a,{C:function(){return l}});var i=t(26398),b=t(15627),n=t(42089),c=t(25610),r=t(19938),o=t(97458),l=(0,i.G)(function(e,a){let t=(0,b.mq)("Badge",e),{className:i,...l}=(0,n.Lr)(e);return(0,o.jsx)(c.m.span,{ref:a,className:(0,r.cx)("chakra-badge",e.className),...l,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...t}})});l.displayName="Badge"},44620:function(e,a,t){t.d(a,{o:function(){return l}});var i=t(26398),b=t(25610),n=t(9878),c=t(19938),r=t(52983),o=t(97458),l=(0,i.G)(function(e,a){let{ratio:t=4/3,children:i,className:l,...s}=e,d=r.Children.only(i),p=(0,c.cx)("chakra-aspect-ratio",l);return(0,o.jsx)(b.m.div,{ref:a,position:"relative",className:p,_before:{height:0,content:'""',display:"block",paddingBottom:(0,n.XQ)(t,e=>`${1/e*100}%`)},__css:{"& > *:not(style)":{overflow:"hidden",position:"absolute",top:"0",right:"0",bottom:"0",left:"0",display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%"},"& > img, & > video":{objectFit:"cover"}},...s,children:d})});l.displayName="AspectRatio"},38834:function(e,a,t){t.d(a,{P:function(){return p}});var i=t(19938),b=t(26398),n=t(25610),c=t(97458),r=(0,b.G)(function(e,a){let{children:t,placeholder:b,className:r,...o}=e;return(0,c.jsxs)(n.m.select,{...o,ref:a,className:(0,i.cx)("chakra-select",r),children:[b&&(0,c.jsx)("option",{value:"",children:b}),t]})});r.displayName="SelectField";var o=t(87059),l=t(15627),s=t(42089),d=t(52983),p=(0,b.G)((e,a)=>{var t;let b=(0,l.jC)("Select",e),{rootProps:d,placeholder:p,icon:f,color:u,height:h,h:g,minH:v,minHeight:x,iconColor:k,iconSize:w,...j}=(0,s.Lr)(e),[y,S]=function(e,a){let t={},i={};for(let[b,n]of Object.entries(e))a.includes(b)?t[b]=n:i[b]=n;return[t,i]}(j,s.oE),A=(0,o.Y)(S),F={paddingEnd:"2rem",...b.field,_focus:{zIndex:"unset",...null==(t=b.field)?void 0:t._focus}};return(0,c.jsxs)(n.m.div,{className:"chakra-select__wrapper",__css:{width:"100%",height:"fit-content",position:"relative",color:u},...y,...d,children:[(0,c.jsx)(r,{ref:a,height:null!=g?g:h,minH:null!=v?v:x,placeholder:p,...A,__css:F,children:e.children}),(0,c.jsx)(m,{"data-disabled":(0,i.PB)(A.disabled),...(k||u)&&{color:k||u},__css:b.icon,...w&&{fontSize:w},children:f})]})});p.displayName="Select";var f=e=>(0,c.jsx)("svg",{viewBox:"0 0 24 24",...e,children:(0,c.jsx)("path",{fill:"currentColor",d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"})}),u=(0,n.m)("div",{baseStyle:{position:"absolute",display:"inline-flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",top:"50%",transform:"translateY(-50%)"}}),m=e=>{let{children:a=(0,c.jsx)(f,{}),...t}=e,i=(0,d.cloneElement)(a,{role:"presentation",className:"chakra-select__icon",focusable:!1,"aria-hidden":!0,style:{width:"1em",height:"1em",color:"currentColor"}});return(0,c.jsx)(u,{...t,className:"chakra-select__icon-wrapper",children:(0,d.isValidElement)(a)?i:null})};m.displayName="SelectIcon"},14056:function(e,a,t){t.d(a,{r:function(){return d}});var i=t(78486),b=t(19938),n=t(26398),c=t(15627),r=t(42089),o=t(25610),l=t(52983),s=t(97458),d=(0,n.G)(function(e,a){let t=(0,c.jC)("Switch",e),{spacing:n="0.5rem",children:d,...p}=(0,r.Lr)(e),{getIndicatorProps:f,getInputProps:u,getCheckboxProps:m,getRootProps:h,getLabelProps:g}=(0,i.O)(p),v=(0,l.useMemo)(()=>({display:"inline-block",position:"relative",verticalAlign:"middle",lineHeight:0,...t.container}),[t.container]),x=(0,l.useMemo)(()=>({display:"inline-flex",flexShrink:0,justifyContent:"flex-start",boxSizing:"content-box",cursor:"pointer",...t.track}),[t.track]),k=(0,l.useMemo)(()=>({userSelect:"none",marginStart:n,...t.label}),[n,t.label]);return(0,s.jsxs)(o.m.label,{...h(),className:(0,b.cx)("chakra-switch",e.className),__css:v,children:[(0,s.jsx)("input",{className:"chakra-switch__input",...u({},a)}),(0,s.jsx)(o.m.span,{...m(),className:"chakra-switch__track",__css:x,children:(0,s.jsx)(o.m.span,{__css:t.thumb,className:"chakra-switch__thumb",...f()})}),d&&(0,s.jsx)(o.m.span,{className:"chakra-switch__label",...g(),__css:k,children:d})]})});d.displayName="Switch"},40393:function(e,a,t){t.d(a,{Lj:function(){return i},Sh:function(){return c},js:function(){return n},p$:function(){return r}});var i={ease:[.25,.1,.25,1],easeIn:[.4,0,1,1],easeOut:[0,0,.2,1],easeInOut:[.4,0,.2,1]},b={slideLeft:{position:{left:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"-100%",y:0}},slideRight:{position:{right:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"100%",y:0}},slideUp:{position:{top:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"-100%"}},slideDown:{position:{bottom:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"100%"}}};function n(e){var a;switch(null!=(a=null==e?void 0:e.direction)?a:"right"){case"right":default:return b.slideRight;case"left":return b.slideLeft;case"bottom":return b.slideDown;case"top":return b.slideUp}}var c={enter:{duration:.2,ease:i.easeOut},exit:{duration:.1,ease:i.easeIn}},r={enter:(e,a)=>({...e,delay:"number"==typeof a?a:null==a?void 0:a.enter}),exit:(e,a)=>({...e,delay:"number"==typeof a?a:null==a?void 0:a.exit})}},1848:function(e,a,t){t.d(a,{U:function(){return p}});var i=t(40393),b=t(19938),n=t(44659),c=t(39267),r=t(52983),o=t(97458),l=e=>null!=e&&parseInt(e.toString(),10)>0,s={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},d={exit:({animateOpacity:e,startingHeight:a,transition:t,transitionEnd:b,delay:n})=>{var c;return{...e&&{opacity:l(a)?1:0},height:a,transitionEnd:null==b?void 0:b.exit,transition:null!=(c=null==t?void 0:t.exit)?c:i.p$.exit(s.exit,n)}},enter:({animateOpacity:e,endingHeight:a,transition:t,transitionEnd:b,delay:n})=>{var c;return{...e&&{opacity:1},height:a,transitionEnd:null==b?void 0:b.enter,transition:null!=(c=null==t?void 0:t.enter)?c:i.p$.enter(s.enter,n)}}},p=(0,r.forwardRef)((e,a)=>{let{in:t,unmountOnExit:i,animateOpacity:l=!0,startingHeight:s=0,endingHeight:p="auto",style:f,className:u,transition:m,transitionEnd:h,...g}=e,[v,x]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=setTimeout(()=>{x(!0)});return()=>clearTimeout(e)},[]),(0,b.ZK)({condition:Number(s)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let k=parseFloat(s.toString())>0,w={startingHeight:s,endingHeight:p,animateOpacity:l,transition:v?m:{enter:{duration:0}},transitionEnd:{enter:null==h?void 0:h.enter,exit:i?null==h?void 0:h.exit:{...null==h?void 0:h.exit,display:k?"block":"none"}}},j=!i||t,y=t||i?"enter":"exit";return(0,o.jsx)(n.M,{initial:!1,custom:w,children:j&&(0,o.jsx)(c.E.div,{ref:a,...g,className:(0,b.cx)("chakra-collapse",u),style:{overflow:"hidden",display:"block",...f},custom:w,variants:d,initial:!!i&&"exit",animate:y,exit:"exit"})})});p.displayName="Collapse"},4248:function(e,a,t){t.d(a,{i:function(){return i}});let i=parseInt(t(9375).UZH.replace(/\D+/g,""))},61261:function(e,a,t){t.d(a,{Y:function(){return n}});var i=t(16808),b=t(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new b.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:b.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class n extends b.jyz{constructor(e){super({type:"LineMaterial",uniforms:b.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,a,t){let i,b;t.d(a,{w:function(){return j}});var n=t(9375),c=t(90845),r=t(61261);let o=new n.Ltg,l=new n.Pa4,s=new n.Pa4,d=new n.Ltg,p=new n.Ltg,f=new n.Ltg,u=new n.Pa4,m=new n.yGw,h=new n.Zzh,g=new n.Pa4,v=new n.ZzF,x=new n.aLr,k=new n.Ltg;function w(e,a,t){return k.set(0,0,-a,1).applyMatrix4(e.projectionMatrix),k.multiplyScalar(1/k.w),k.x=b/t.width,k.y=b/t.height,k.applyMatrix4(e.projectionMatrixInverse),k.multiplyScalar(1/k.w),Math.abs(Math.max(k.x,k.y))}class j extends n.Kj0{constructor(e=new c.z,a=new r.Y({color:16777215*Math.random()})){super(e,a),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,a=e.attributes.instanceStart,t=e.attributes.instanceEnd,i=new Float32Array(2*a.count);for(let e=0,b=0,n=a.count;e<n;e++,b+=2)l.fromBufferAttribute(a,e),s.fromBufferAttribute(t,e),i[b]=0===b?0:i[b-1],i[b+1]=i[b]+l.distanceTo(s);let b=new n.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new n.kB5(b,1,0)),e.setAttribute("instanceDistanceEnd",new n.kB5(b,1,1)),this}raycast(e,a){let t,c;let r=this.material.worldUnits,o=e.camera;null!==o||r||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let s=this.matrixWorld,k=this.geometry,j=this.material;if(b=j.linewidth+l,null===k.boundingSphere&&k.computeBoundingSphere(),x.copy(k.boundingSphere).applyMatrix4(s),r)t=.5*b;else{let e=Math.max(o.near,x.distanceToPoint(i.origin));t=w(o,e,j.resolution)}if(x.radius+=t,!1!==i.intersectsSphere(x)){if(null===k.boundingBox&&k.computeBoundingBox(),v.copy(k.boundingBox).applyMatrix4(s),r)c=.5*b;else{let e=Math.max(o.near,v.distanceToPoint(i.origin));c=w(o,e,j.resolution)}v.expandByScalar(c),!1!==i.intersectsBox(v)&&(r?function(e,a){let t=e.matrixWorld,c=e.geometry,r=c.attributes.instanceStart,o=c.attributes.instanceEnd,l=Math.min(c.instanceCount,r.count);for(let c=0;c<l;c++){h.start.fromBufferAttribute(r,c),h.end.fromBufferAttribute(o,c),h.applyMatrix4(t);let l=new n.Pa4,s=new n.Pa4;i.distanceSqToSegment(h.start,h.end,s,l),s.distanceTo(l)<.5*b&&a.push({point:s,pointOnLine:l,distance:i.origin.distanceTo(s),object:e,face:null,faceIndex:c,uv:null,uv1:null})}}(this,a):function(e,a,t){let c=a.projectionMatrix,r=e.material.resolution,o=e.matrixWorld,l=e.geometry,s=l.attributes.instanceStart,v=l.attributes.instanceEnd,x=Math.min(l.instanceCount,s.count),k=-a.near;i.at(1,f),f.w=1,f.applyMatrix4(a.matrixWorldInverse),f.applyMatrix4(c),f.multiplyScalar(1/f.w),f.x*=r.x/2,f.y*=r.y/2,f.z=0,u.copy(f),m.multiplyMatrices(a.matrixWorldInverse,o);for(let a=0;a<x;a++){if(d.fromBufferAttribute(s,a),p.fromBufferAttribute(v,a),d.w=1,p.w=1,d.applyMatrix4(m),p.applyMatrix4(m),d.z>k&&p.z>k)continue;if(d.z>k){let e=d.z-p.z,a=(d.z-k)/e;d.lerp(p,a)}else if(p.z>k){let e=p.z-d.z,a=(p.z-k)/e;p.lerp(d,a)}d.applyMatrix4(c),p.applyMatrix4(c),d.multiplyScalar(1/d.w),p.multiplyScalar(1/p.w),d.x*=r.x/2,d.y*=r.y/2,p.x*=r.x/2,p.y*=r.y/2,h.start.copy(d),h.start.z=0,h.end.copy(p),h.end.z=0;let l=h.closestPointToPointParameter(u,!0);h.at(l,g);let f=n.M8C.lerp(d.z,p.z,l),x=f>=-1&&f<=1,w=u.distanceTo(g)<.5*b;if(x&&w){h.start.fromBufferAttribute(s,a),h.end.fromBufferAttribute(v,a),h.start.applyMatrix4(o),h.end.applyMatrix4(o);let b=new n.Pa4,c=new n.Pa4;i.distanceSqToSegment(h.start,h.end,c,b),t.push({point:c,pointOnLine:b,distance:i.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}}(this,o,a))}}onBeforeRender(e){let a=this.material.uniforms;a&&a.resolution&&(e.getViewport(o),this.material.uniforms.resolution.value.set(o.z,o.w))}}},90845:function(e,a,t){t.d(a,{z:function(){return c}});var i=t(9375);let b=new i.ZzF,n=new i.Pa4;class c extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let a=this.attributes.instanceStart,t=this.attributes.instanceEnd;return void 0!==a&&(a.applyMatrix4(e),t.applyMatrix4(e),a.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let a;e instanceof Float32Array?a=e:Array.isArray(e)&&(a=new Float32Array(e));let t=new i.$TI(a,6,1);return this.setAttribute("instanceStart",new i.kB5(t,3,0)),this.setAttribute("instanceEnd",new i.kB5(t,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let a;e instanceof Float32Array?a=e:Array.isArray(e)&&(a=new Float32Array(e));let t=new i.$TI(a,6,1);return this.setAttribute("instanceColorStart",new i.kB5(t,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(t,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let a=e.geometry;return this.setPositions(a.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,a=this.attributes.instanceEnd;void 0!==e&&void 0!==a&&(this.boundingBox.setFromBufferAttribute(e),b.setFromBufferAttribute(a),this.boundingBox.union(b))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,a=this.attributes.instanceEnd;if(void 0!==e&&void 0!==a){let t=this.boundingSphere.center;this.boundingBox.getCenter(t);let i=0;for(let b=0,c=e.count;b<c;b++)n.fromBufferAttribute(e,b),i=Math.max(i,t.distanceToSquared(n)),n.fromBufferAttribute(a,b),i=Math.max(i,t.distanceToSquared(n));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,a,t){t.d(a,{XR:function(){return i}});let i=e=>(a,t,i)=>{let b=i.subscribe;return i.subscribe=(e,a,t)=>{let n=e;if(a){let b=(null==t?void 0:t.equalityFn)||Object.is,c=e(i.getState());n=t=>{let i=e(t);if(!b(c,i)){let e=c;a(c=i,e)}},(null==t?void 0:t.fireImmediately)&&a(c,c)}return b(n)},e(a,t,i)}},73542:function(e,a,t){t.d(a,{U:function(){return o},o:function(){return c}});var i=t(52983),b=t(98565);let n=e=>e;function c(e,a=n){let t=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>a(e.getState()),[e,a]),i.useCallback(()=>a(e.getInitialState()),[e,a]));return i.useDebugValue(t),t}let r=e=>{let a=(0,b.M)(e),t=e=>c(a,e);return Object.assign(t,a),t},o=e=>e?r(e):r},98565:function(e,a,t){t.d(a,{M:function(){return b}});let i=e=>{let a;let t=new Set,i=(e,i)=>{let b="function"==typeof e?e(a):e;if(!Object.is(b,a)){let e=a;a=(null!=i?i:"object"!=typeof b||null===b)?b:Object.assign({},a,b),t.forEach(t=>t(a,e))}},b=()=>a,n={setState:i,getState:b,getInitialState:()=>c,subscribe:e=>(t.add(e),()=>t.delete(e))},c=a=e(i,b,n);return n},b=e=>e?i(e):i}}]);