"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[50754,3120],{58109:function(e,t,n){n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),o=n(52983),a=n(9375);let s=o.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...c},d){let u=o.useRef(null),f=o.useRef(null),m=new a._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=u.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(m),e.getWorldQuaternion(u.current.quaternion).premultiply(m.invert()),n&&(u.current.rotation.x=i.x),s&&(u.current.rotation.y=i.y),l&&(u.current.rotation.z=i.z)}),o.useImperativeHandle(d,()=>f.current,[]),o.createElement("group",(0,i.Z)({ref:f},c),o.createElement("group",{ref:u},e))})},81125:function(e,t,n){n.d(t,{q:function(){return y}});var i=n(99217),r=n(62510),o=n(52983),a=n(9375),s=n(30535),l=Object.defineProperty,c=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,d=(e,t,n)=>(c(e,"symbol"!=typeof t?t+"":t,n),n);let u=new a.USm(0,0,0,"YXZ"),f=new a.Pa4,m={type:"change"},h={type:"lock"},p={type:"unlock"},v=Math.PI/2;class g extends s.p{constructor(e,t){super(),d(this,"camera"),d(this,"domElement"),d(this,"isLocked"),d(this,"minPolarAngle"),d(this,"maxPolarAngle"),d(this,"pointerSpeed"),d(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(u.setFromQuaternion(this.camera.quaternion),u.y-=.002*e.movementX*this.pointerSpeed,u.x-=.002*e.movementY*this.pointerSpeed,u.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,u.x)),this.camera.quaternion.setFromEuler(u),this.dispatchEvent(m))}),d(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(h),this.isLocked=!0):(this.dispatchEvent(p),this.isLocked=!1))}),d(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),d(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),d(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),d(this,"dispose",()=>{this.disconnect()}),d(this,"getObject",()=>this.camera),d(this,"direction",new a.Pa4(0,0,-1)),d(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),d(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),d(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),d(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),d(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let y=o.forwardRef(({domElement:e,selector:t,onChange:n,onLock:a,onUnlock:s,enabled:l=!0,makeDefault:c,...d},u)=>{let{camera:f,...m}=d,h=(0,r.D)(e=>e.setEvents),p=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),y=(0,r.D)(e=>e.invalidate),x=(0,r.D)(e=>e.events),w=(0,r.D)(e=>e.get),S=(0,r.D)(e=>e.set),b=f||v,E=e||x.connected||p.domElement,_=o.useMemo(()=>new g(b),[b]);return o.useEffect(()=>{if(l){_.connect(E);let e=w().events.compute;return h({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{_.disconnect(),h({compute:e})}}},[l,_]),o.useEffect(()=>{let e=e=>{y(),n&&n(e)};_.addEventListener("change",e),a&&_.addEventListener("lock",a),s&&_.addEventListener("unlock",s);let i=()=>_.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{_.removeEventListener("change",e),a&&_.removeEventListener("lock",a),s&&_.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,a,s,t,_,y]),o.useEffect(()=>{if(c){let e=w().controls;return S({controls:_}),()=>S({controls:e})}},[c,_]),o.createElement("primitive",(0,i.Z)({ref:u,object:_},m))})},73420:function(e,t,n){n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),o=n(75575);let a=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),c=i.useMemo(()=>(0,r.U)((0,o.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),d=i.useMemo(()=>[c.subscribe,c.getState,c],[l]),u=c.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{u({[e]:t}),n&&n(e,t,d[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:o,up:a}=i;i.pressed=!0,(a||!o)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:o}=i;i.pressed=!1,o&&r(!1)},o=s||window;return o.addEventListener("keydown",i,{passive:!0}),o.addEventListener("keyup",r,{passive:!0}),()=>{o.removeEventListener("keydown",i),o.removeEventListener("keyup",r)}},[s,l]),i.createElement(a.Provider,{value:d,children:t})}function l(e){let[t,n,r]=i.useContext(a);return e?r(e):[t,n]}},67844:function(e,t,n){n.d(t,{X:function(){return S}});var i=n(52983),r=n(20879),o=n(25610),a=n(97458);function s(e){return(0,a.jsx)(o.m.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...e,children:(0,a.jsx)("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function l(e){return(0,a.jsx)(o.m.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...e,children:(0,a.jsx)("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function c(e){let{isIndeterminate:t,isChecked:n,...i}=e;return n||t?(0,a.jsx)(o.m.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:(0,a.jsx)(t?l:s,{...i})}):null}var d=n(78486),u=n(19938),f=n(10915),m=n(26398),h=n(15627),p=n(42089),v={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},g={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},y=(0,f.F4)({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),x=(0,f.F4)({from:{opacity:0},to:{opacity:1}}),w=(0,f.F4)({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),S=(0,m.G)(function(e,t){let n=(0,r.J)(),s={...n,...e},l=(0,h.jC)("Checkbox",s),f=(0,p.Lr)(e),{spacing:m="0.5rem",className:S,children:b,iconColor:E,iconSize:_,icon:L=(0,a.jsx)(c,{}),isChecked:k,isDisabled:z=null==n?void 0:n.isDisabled,onChange:M,inputProps:A,...U}=f,P=k;(null==n?void 0:n.value)&&f.value&&(P=n.value.includes(f.value));let C=M;(null==n?void 0:n.onChange)&&f.value&&(C=(0,u.PP)(n.onChange,M));let{state:D,getInputProps:j,getCheckboxProps:B,getLabelProps:T,getRootProps:O}=(0,d.O)({...U,isDisabled:z,isChecked:P,onChange:C}),I=function(e){let[t,n]=(0,i.useState)(e),[r,o]=(0,i.useState)(!1);return e!==t&&(o(!0),n(e)),r}(D.isChecked),N=(0,i.useMemo)(()=>({animation:I?D.isIndeterminate?`${x} 20ms linear, ${w} 200ms linear`:`${y} 200ms linear`:void 0,fontSize:_,color:E,...l.icon}),[E,_,I,D.isIndeterminate,l.icon]),F=(0,i.cloneElement)(L,{__css:N,isIndeterminate:D.isIndeterminate,isChecked:D.isChecked});return(0,a.jsxs)(o.m.label,{__css:{...g,...l.container},className:(0,u.cx)("chakra-checkbox",S),...O(),children:[(0,a.jsx)("input",{className:"chakra-checkbox__input",...j(A,t)}),(0,a.jsx)(o.m.span,{__css:{...v,...l.control},className:"chakra-checkbox__control",...B(),children:F}),b&&(0,a.jsx)(o.m.span,{className:"chakra-checkbox__label",...T(),__css:{marginStart:m,...l.label},children:b})]})});S.displayName="Checkbox"},20879:function(e,t,n){n.d(t,{J:function(){return r},z:function(){return i}});var[i,r]=(0,n(96248).k)({name:"CheckboxGroupContext",strict:!1})},45276:function(e,t,n){n.d(t,{C:function(){return c}});var i=n(26398),r=n(15627),o=n(42089),a=n(25610),s=n(19938),l=n(97458),c=(0,i.G)(function(e,t){let n=(0,r.mq)("Badge",e),{className:i,...c}=(0,o.Lr)(e);return(0,l.jsx)(a.m.span,{ref:t,className:(0,s.cx)("chakra-badge",e.className),...c,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...n}})});c.displayName="Badge"},68069:function(e,t,n){n.d(t,{P:function(){return c}});var i=n(26398),r=n(25610),o=n(62282),a=n(9878),s=n(97458);function l(e){return(0,a.XQ)(e,e=>"auto"===e?"auto":`span ${e}/span ${e}`)}var c=(0,i.G)(function(e,t){let{area:n,colSpan:i,colStart:a,colEnd:c,rowEnd:d,rowSpan:u,rowStart:f,...m}=e,h=(0,o.o)({gridArea:n,gridColumn:l(i),gridRow:l(u),gridColumnStart:a,gridColumnEnd:c,gridRowStart:f,gridRowEnd:d});return(0,s.jsx)(r.m.div,{ref:t,__css:h,...m})});c.displayName="GridItem"},94086:function(e,t,n){function i(e,t){let n=function(e){let t=parseFloat(e);return"number"!=typeof t||Number.isNaN(t)?0:t}(e),i=10**(null!=t?t:10);return n=Math.round(n*i)/i,t?n.toFixed(t):n.toString()}function r(e){if(!Number.isFinite(e))return 0;let t=1,n=0;for(;Math.round(e*t)/t!==e;)t*=10,n+=1;return n}function o(e,t,n){return(e-t)*100/(n-t)}function a(e,t,n){return(n-t)*e+t}function s(e,t,n){return i(Math.round((e-t)/n)*n+t,r(n))}function l(e,t,n){return null==e?e:(n<t&&console.warn("clamp: max cannot be less than min"),Math.min(Math.max(e,t),n))}n.d(t,{HU:function(){return l},Rg:function(){return o},WP:function(){return s},WS:function(){return a},Zd:function(){return i},vk:function(){return r}})},64585:function(e,t,n){n.d(t,{h:function(){return s}});var i=n(93905),r=n(26398),o=n(25610),a=n(97458),s=(0,r.G)((e,t)=>{let n=(0,i.p)();return(0,a.jsx)(o.m.thead,{...e,ref:t,__css:n.thead})})},93905:function(e,t,n){n.d(t,{i:function(){return f},p:function(){return u}});var i=n(26398),r=n(15627),o=n(42089),a=n(25610),s=n(19938),l=n(96248),c=n(97458),[d,u]=(0,l.k)({name:"TableStylesContext",errorMessage:"useTableStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<Table />\" "}),f=(0,i.G)((e,t)=>{let n=(0,r.jC)("Table",e),{className:i,layout:l,...u}=(0,o.Lr)(e);return(0,c.jsx)(d,{value:n,children:(0,c.jsx)(a.m.table,{ref:t,__css:{tableLayout:l,...n.table},className:(0,s.cx)("chakra-table",i),...u})})});f.displayName="Table"},16367:function(e,t,n){n.d(t,{Tr:function(){return s}});var i=n(93905),r=n(26398),o=n(25610),a=n(97458),s=(0,r.G)((e,t)=>{let n=(0,i.p)();return(0,a.jsx)(o.m.tr,{...e,ref:t,__css:n.tr})})},9226:function(e,t,n){n.d(t,{p:function(){return s}});var i=n(93905),r=n(26398),o=n(25610),a=n(97458),s=(0,r.G)((e,t)=>{let n=(0,i.p)();return(0,a.jsx)(o.m.tbody,{...e,ref:t,__css:n.tbody})})},66633:function(e,t,n){n.d(t,{Th:function(){return s}});var i=n(93905),r=n(26398),o=n(25610),a=n(97458),s=(0,r.G)(({isNumeric:e,...t},n)=>{let r=(0,i.p)();return(0,a.jsx)(o.m.th,{...t,ref:n,__css:r.th,"data-is-numeric":e})})},97775:function(e,t,n){n.d(t,{Td:function(){return s}});var i=n(93905),r=n(26398),o=n(25610),a=n(97458),s=(0,r.G)(({isNumeric:e,...t},n)=>{let r=(0,i.p)();return(0,a.jsx)(o.m.td,{...t,ref:n,__css:r.td,"data-is-numeric":e})})},1848:function(e,t,n){n.d(t,{U:function(){return f}});var i=n(40393),r=n(19938),o=n(44659),a=n(39267),s=n(52983),l=n(97458),c=e=>null!=e&&parseInt(e.toString(),10)>0,d={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},u={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:r,delay:o})=>{var a;return{...e&&{opacity:c(t)?1:0},height:t,transitionEnd:null==r?void 0:r.exit,transition:null!=(a=null==n?void 0:n.exit)?a:i.p$.exit(d.exit,o)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:r,delay:o})=>{var a;return{...e&&{opacity:1},height:t,transitionEnd:null==r?void 0:r.enter,transition:null!=(a=null==n?void 0:n.enter)?a:i.p$.enter(d.enter,o)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:i,animateOpacity:c=!0,startingHeight:d=0,endingHeight:f="auto",style:m,className:h,transition:p,transitionEnd:v,...g}=e,[y,x]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{x(!0)});return()=>clearTimeout(e)},[]),(0,r.ZK)({condition:Number(d)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let w=parseFloat(d.toString())>0,S={startingHeight:d,endingHeight:f,animateOpacity:c,transition:y?p:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:i?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:w?"block":"none"}}},b=!i||n,E=n||i?"enter":"exit";return(0,l.jsx)(o.M,{initial:!1,custom:S,children:b&&(0,l.jsx)(a.E.div,{ref:t,...g,className:(0,r.cx)("chakra-collapse",h),style:{overflow:"hidden",display:"block",...m},custom:S,variants:u,initial:!!i&&"exit",animate:E,exit:"exit"})})});f.displayName="Collapse"},4248:function(e,t,n){n.d(t,{i:function(){return i}});let i=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){n.d(t,{Y:function(){return o}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class o extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){let i,r;n.d(t,{w:function(){return b}});var o=n(9375),a=n(90845),s=n(61261);let l=new o.Ltg,c=new o.Pa4,d=new o.Pa4,u=new o.Ltg,f=new o.Ltg,m=new o.Ltg,h=new o.Pa4,p=new o.yGw,v=new o.Zzh,g=new o.Pa4,y=new o.ZzF,x=new o.aLr,w=new o.Ltg;function S(e,t,n){return w.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),w.multiplyScalar(1/w.w),w.x=r/n.width,w.y=r/n.height,w.applyMatrix4(e.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}class b extends o.Kj0{constructor(e=new a.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,o=t.count;e<o;e++,r+=2)c.fromBufferAttribute(t,e),d.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+c.distanceTo(d);let r=new o.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new o.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.kB5(r,1,1)),this}raycast(e,t){let n,a;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let d=this.matrixWorld,w=this.geometry,b=this.material;if(r=b.linewidth+c,null===w.boundingSphere&&w.computeBoundingSphere(),x.copy(w.boundingSphere).applyMatrix4(d),s)n=.5*r;else{let e=Math.max(l.near,x.distanceToPoint(i.origin));n=S(l,e,b.resolution)}if(x.radius+=n,!1!==i.intersectsSphere(x)){if(null===w.boundingBox&&w.computeBoundingBox(),y.copy(w.boundingBox).applyMatrix4(d),s)a=.5*r;else{let e=Math.max(l.near,y.distanceToPoint(i.origin));a=S(l,e,b.resolution)}y.expandByScalar(a),!1!==i.intersectsBox(y)&&(s?function(e,t){let n=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,c=Math.min(a.instanceCount,s.count);for(let a=0;a<c;a++){v.start.fromBufferAttribute(s,a),v.end.fromBufferAttribute(l,a),v.applyMatrix4(n);let c=new o.Pa4,d=new o.Pa4;i.distanceSqToSegment(v.start,v.end,d,c),d.distanceTo(c)<.5*r&&t.push({point:d,pointOnLine:c,distance:i.origin.distanceTo(d),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}(this,t):function(e,t,n){let a=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,y=c.attributes.instanceEnd,x=Math.min(c.instanceCount,d.count),w=-t.near;i.at(1,m),m.w=1,m.applyMatrix4(t.matrixWorldInverse),m.applyMatrix4(a),m.multiplyScalar(1/m.w),m.x*=s.x/2,m.y*=s.y/2,m.z=0,h.copy(m),p.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<x;t++){if(u.fromBufferAttribute(d,t),f.fromBufferAttribute(y,t),u.w=1,f.w=1,u.applyMatrix4(p),f.applyMatrix4(p),u.z>w&&f.z>w)continue;if(u.z>w){let e=u.z-f.z,t=(u.z-w)/e;u.lerp(f,t)}else if(f.z>w){let e=f.z-u.z,t=(f.z-w)/e;f.lerp(u,t)}u.applyMatrix4(a),f.applyMatrix4(a),u.multiplyScalar(1/u.w),f.multiplyScalar(1/f.w),u.x*=s.x/2,u.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(u),v.start.z=0,v.end.copy(f),v.end.z=0;let c=v.closestPointToPointParameter(h,!0);v.at(c,g);let m=o.M8C.lerp(u.z,f.z,c),x=m>=-1&&m<=1,S=h.distanceTo(g)<.5*r;if(x&&S){v.start.fromBufferAttribute(d,t),v.end.fromBufferAttribute(y,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new o.Pa4,a=new o.Pa4;i.distanceSqToSegment(v.start,v.end,a,r),n.push({point:a,pointOnLine:r,distance:i.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){n.d(t,{z:function(){return a}});var i=n(9375);let r=new i.ZzF,o=new i.Pa4;class a extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)o.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(o)),o.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(o));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){n.d(t,{XR:function(){return i}});let i=e=>(t,n,i)=>{let r=i.subscribe;return i.subscribe=(e,t,n)=>{let o=e;if(t){let r=(null==n?void 0:n.equalityFn)||Object.is,a=e(i.getState());o=n=>{let i=e(n);if(!r(a,i)){let e=a;t(a=i,e)}},(null==n?void 0:n.fireImmediately)&&t(a,a)}return r(o)},e(t,n,i)}},73542:function(e,t,n){n.d(t,{U:function(){return l},o:function(){return a}});var i=n(52983),r=n(98565);let o=e=>e;function a(e,t=o){let n=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>t(e.getState()),[e,t]),i.useCallback(()=>t(e.getInitialState()),[e,t]));return i.useDebugValue(n),n}let s=e=>{let t=(0,r.M)(e),n=e=>a(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){n.d(t,{M:function(){return r}});let i=e=>{let t;let n=new Set,i=(e,i)=>{let r="function"==typeof e?e(t):e;if(!Object.is(r,t)){let e=t;t=(null!=i?i:"object"!=typeof r||null===r)?r:Object.assign({},t,r),n.forEach(n=>n(t,e))}},r=()=>t,o={setState:i,getState:r,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(i,r,o);return o},r=e=>e?i(e):i}}]);