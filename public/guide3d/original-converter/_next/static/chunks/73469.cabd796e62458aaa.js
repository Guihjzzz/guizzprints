"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[73469,3120],{58109:function(e,t,n){n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375);let s=a.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...d},c){let u=a.useRef(null),f=a.useRef(null),p=new o._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=u.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(p),e.getWorldQuaternion(u.current.quaternion).premultiply(p.invert()),n&&(u.current.rotation.x=i.x),s&&(u.current.rotation.y=i.y),l&&(u.current.rotation.z=i.z)}),a.useImperativeHandle(c,()=>f.current,[]),a.createElement("group",(0,i.Z)({ref:f},d),a.createElement("group",{ref:u},e))})},81125:function(e,t,n){n.d(t,{q:function(){return y}});var i=n(99217),r=n(62510),a=n(52983),o=n(9375),s=n(30535),l=Object.defineProperty,d=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,c=(e,t,n)=>(d(e,"symbol"!=typeof t?t+"":t,n),n);let u=new o.USm(0,0,0,"YXZ"),f=new o.Pa4,p={type:"change"},m={type:"lock"},h={type:"unlock"},v=Math.PI/2;class g extends s.p{constructor(e,t){super(),c(this,"camera"),c(this,"domElement"),c(this,"isLocked"),c(this,"minPolarAngle"),c(this,"maxPolarAngle"),c(this,"pointerSpeed"),c(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(u.setFromQuaternion(this.camera.quaternion),u.y-=.002*e.movementX*this.pointerSpeed,u.x-=.002*e.movementY*this.pointerSpeed,u.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,u.x)),this.camera.quaternion.setFromEuler(u),this.dispatchEvent(p))}),c(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(m),this.isLocked=!0):(this.dispatchEvent(h),this.isLocked=!1))}),c(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),c(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"dispose",()=>{this.disconnect()}),c(this,"getObject",()=>this.camera),c(this,"direction",new o.Pa4(0,0,-1)),c(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),c(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),c(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),c(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),c(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let y=a.forwardRef(({domElement:e,selector:t,onChange:n,onLock:o,onUnlock:s,enabled:l=!0,makeDefault:d,...c},u)=>{let{camera:f,...p}=c,m=(0,r.D)(e=>e.setEvents),h=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),y=(0,r.D)(e=>e.invalidate),w=(0,r.D)(e=>e.events),S=(0,r.D)(e=>e.get),x=(0,r.D)(e=>e.set),b=f||v,E=e||w.connected||h.domElement,_=a.useMemo(()=>new g(b),[b]);return a.useEffect(()=>{if(l){_.connect(E);let e=S().events.compute;return m({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{_.disconnect(),m({compute:e})}}},[l,_]),a.useEffect(()=>{let e=e=>{y(),n&&n(e)};_.addEventListener("change",e),o&&_.addEventListener("lock",o),s&&_.addEventListener("unlock",s);let i=()=>_.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{_.removeEventListener("change",e),o&&_.removeEventListener("lock",o),s&&_.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,o,s,t,_,y]),a.useEffect(()=>{if(d){let e=S().controls;return x({controls:_}),()=>x({controls:e})}},[d,_]),a.createElement("primitive",(0,i.Z)({ref:u,object:_},p))})},73420:function(e,t,n){n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),a=n(75575);let o=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),d=i.useMemo(()=>(0,r.U)((0,a.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),c=i.useMemo(()=>[d.subscribe,d.getState,d],[l]),u=d.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{u({[e]:t}),n&&n(e,t,c[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:a,up:o}=i;i.pressed=!0,(o||!a)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:a}=i;i.pressed=!1,a&&r(!1)},a=s||window;return a.addEventListener("keydown",i,{passive:!0}),a.addEventListener("keyup",r,{passive:!0}),()=>{a.removeEventListener("keydown",i),a.removeEventListener("keyup",r)}},[s,l]),i.createElement(o.Provider,{value:c,children:t})}function l(e){let[t,n,r]=i.useContext(o);return e?r(e):[t,n]}},88574:function(e,t,n){n.d(t,{T:function(){return o}});var i=n(97458),r=n(52983),a=n(3347);let o=e=>{let{rgba:t,onBlur:n}=e,[o,s]=(0,r.useState)(t),l="#"+t.slice(0,3).map(e=>255*e).map(e=>Math.round(e).toString(16).padStart(2,"0")).join(""),d=e=>{s([parseInt(e.substr(1,2),16)/255,parseInt(e.substr(3,2),16)/255,parseInt(e.substr(5,2),16)/255,1])};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(a.I,{type:"color",width:"100%",height:"64px",p:0,value:l,onChange:e=>d(e.currentTarget.value),onBlur:()=>{n(o)}})})}},37794:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{m:function(){return d}});var r=n(52983),a=n(3529),o=n(38316),s=n(59467),l=e([s]);function d(){let[e,t]=(0,r.useState)(null),[n,i]=(0,r.useState)(null),[l,d]=(0,r.useState)(0),[c,u]=(0,r.useState)([]),[f,p]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=!1;return(async()=>{try{let r=await (0,o.o5)();if(e)return;if(r){var n;t(r.fileName),u(null!==(n=r.modBlocks)&&void 0!==n?n:[]),r.colorOverrides&&((0,s.E1)(r.colorOverrides),d(r.colorOverrides.size));let l=await a.dataManager.getModAssetData(o.VI);!e&&l&&i(l)}}catch(e){}finally{e||p(!1)}})(),()=>{e=!0}},[]);let m=(0,r.useCallback)(async e=>{var n;await (0,o.bh)(e.fileName,e.atlas,e.colorOverrides,e.modBlocks,null!==(n=e.wasBedrock)&&void 0!==n&&n),e.assetRecord&&await a.dataManager.addModAssetData({...e.assetRecord,id:o.VI}),(0,s.E1)(e.colorOverrides),t(e.fileName),i(e.assetRecord?{...e.assetRecord,id:o.VI}:null),d(e.colorOverrides.size),u(e.modBlocks)},[]),h=(0,r.useCallback)(async()=>{(0,s.Id)(),await (0,o.FJ)(),await a.dataManager.clearModAssetData(o.VI),t(null),i(null),d(0),u([])},[]);return(0,r.useMemo)(()=>({fileName:e,assetRecord:n,colorOverrideCount:l,modBlocks:c,isLoading:f,save:m,clear:h}),[e,n,l,c,f,m,h])}s=(l.then?(await l)():l)[0],i()}catch(e){i(e)}})},69:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{W:function(){return e}});var r=n(65753),a=n(29068);let e=e=>{if("string"!=typeof e||0===e.length)return;let t=(0,a.IX)(e),n=(0,r.U)("string"==typeof(null==t?void 0:t.name)&&t.name.length?t.name:e.split("[")[0]),i=null==t?void 0:t.state;if(!i||"object"!=typeof i)return n;let o=Object.entries(i).filter(e=>{let[t]=e;return!function(e){let t=String(null!=e?e:"").toLowerCase();return!!t&&!!("__entity"===t||"_entity"===t||"nbt"===t||"_nbt"===t||"__nbt"===t||"material"===t||"_material"===t||"__material"===t||(t.startsWith("_")||t.startsWith("__"))&&t.endsWith("nbt")||(t.startsWith("_")||t.startsWith("__"))&&t.endsWith("material"))}(t)}).map(e=>{let[t,n]=e,i=Array.isArray(n)?n[0]:n;return[t,i]}).filter(e=>{let[,t]=e;return null!=t&&String(t).length>0}).sort((e,t)=>{let[n]=e,[i]=t;return n.localeCompare(i)});return 0===o.length?n:"".concat(n,"[").concat(o.map(e=>{let[t,n]=e;return"".concat(t,"=").concat(String(n))}).join(","),"]")};i()}catch(e){i(e)}})},59467:function(e,t,n){n.a(e,async function(e,i){try{n.d(t,{E1:function(){return a},Id:function(){return o}});var r=n(87617);let e=null;function a(t){if(!e)for(let t of(e=new Map,r.k2))t.rgba&&e.set(t.id,{...t.rgba});for(let[e,n]of t){let t=r.JH[e];t&&(t.rgba=n)}}function o(){if(e){for(let[t,n]of e){let e=r.JH[t];e&&(e.rgba=n)}e=null}}i()}catch(e){i(e)}})},52250:function(e,t,n){n.d(t,{r:function(){return o}});var i=n(26398),r=n(25610),a=n(97458),o=(0,i.G)(function(e,t){let{templateAreas:n,gap:i,rowGap:o,columnGap:s,column:l,row:d,autoFlow:c,autoRows:u,templateRows:f,autoColumns:p,templateColumns:m,...h}=e;return(0,a.jsx)(r.m.div,{ref:t,__css:{display:"grid",gridTemplateAreas:n,gridGap:i,gridRowGap:o,gridColumnGap:s,gridAutoColumns:p,gridColumn:l,gridRow:d,gridAutoFlow:c,gridAutoRows:u,gridTemplateRows:f,gridTemplateColumns:m},...h})});o.displayName="Grid"},7070:function(e,t,n){n.d(t,{M:function(){return d}});var i=n(52250),r=n(26398),a=n(61112),o=n(71778),s=n(9878),l=n(97458),d=(0,r.G)(function(e,t){let{columns:n,spacingX:r,spacingY:d,spacing:c,minChildWidth:u,...f}=e,p=(0,a.F)(),m=u?(0,s.XQ)(u,e=>{let t=(0,o.LP)("sizes",e,"number"==typeof e?`${e}px`:e)(p);return null===e?null:`repeat(auto-fit, minmax(${t}, 1fr))`}):(0,s.XQ)(n,e=>null===e?null:`repeat(${e}, minmax(0, 1fr))`);return(0,l.jsx)(i.r,{ref:t,gap:c,columnGap:r,rowGap:d,templateColumns:m,...f})});d.displayName="SimpleGrid"},1848:function(e,t,n){n.d(t,{U:function(){return f}});var i=n(40393),r=n(19938),a=n(44659),o=n(39267),s=n(52983),l=n(97458),d=e=>null!=e&&parseInt(e.toString(),10)>0,c={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},u={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:r,delay:a})=>{var o;return{...e&&{opacity:d(t)?1:0},height:t,transitionEnd:null==r?void 0:r.exit,transition:null!=(o=null==n?void 0:n.exit)?o:i.p$.exit(c.exit,a)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:r,delay:a})=>{var o;return{...e&&{opacity:1},height:t,transitionEnd:null==r?void 0:r.enter,transition:null!=(o=null==n?void 0:n.enter)?o:i.p$.enter(c.enter,a)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:i,animateOpacity:d=!0,startingHeight:c=0,endingHeight:f="auto",style:p,className:m,transition:h,transitionEnd:v,...g}=e,[y,w]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{w(!0)});return()=>clearTimeout(e)},[]),(0,r.ZK)({condition:Number(c)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let S=parseFloat(c.toString())>0,x={startingHeight:c,endingHeight:f,animateOpacity:d,transition:y?h:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:i?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:S?"block":"none"}}},b=!i||n,E=n||i?"enter":"exit";return(0,l.jsx)(a.M,{initial:!1,custom:x,children:b&&(0,l.jsx)(o.E.div,{ref:t,...g,className:(0,r.cx)("chakra-collapse",m),style:{overflow:"hidden",display:"block",...p},custom:x,variants:u,initial:!!i&&"exit",animate:E,exit:"exit"})})});f.displayName="Collapse"},61261:function(e,t,n){n.d(t,{Y:function(){return a}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class a extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){let i,r;n.d(t,{w:function(){return b}});var a=n(9375),o=n(90845),s=n(61261);let l=new a.Ltg,d=new a.Pa4,c=new a.Pa4,u=new a.Ltg,f=new a.Ltg,p=new a.Ltg,m=new a.Pa4,h=new a.yGw,v=new a.Zzh,g=new a.Pa4,y=new a.ZzF,w=new a.aLr,S=new a.Ltg;function x(e,t,n){return S.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),S.multiplyScalar(1/S.w),S.x=r/n.width,S.y=r/n.height,S.applyMatrix4(e.projectionMatrixInverse),S.multiplyScalar(1/S.w),Math.abs(Math.max(S.x,S.y))}class b extends a.Kj0{constructor(e=new o.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)d.fromBufferAttribute(t,e),c.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+d.distanceTo(c);let r=new a.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new a.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.kB5(r,1,1)),this}raycast(e,t){let n,o;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let c=this.matrixWorld,S=this.geometry,b=this.material;if(r=b.linewidth+d,null===S.boundingSphere&&S.computeBoundingSphere(),w.copy(S.boundingSphere).applyMatrix4(c),s)n=.5*r;else{let e=Math.max(l.near,w.distanceToPoint(i.origin));n=x(l,e,b.resolution)}if(w.radius+=n,!1!==i.intersectsSphere(w)){if(null===S.boundingBox&&S.computeBoundingBox(),y.copy(S.boundingBox).applyMatrix4(c),s)o=.5*r;else{let e=Math.max(l.near,y.distanceToPoint(i.origin));o=x(l,e,b.resolution)}y.expandByScalar(o),!1!==i.intersectsBox(y)&&(s?function(e,t){let n=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,l=o.attributes.instanceEnd,d=Math.min(o.instanceCount,s.count);for(let o=0;o<d;o++){v.start.fromBufferAttribute(s,o),v.end.fromBufferAttribute(l,o),v.applyMatrix4(n);let d=new a.Pa4,c=new a.Pa4;i.distanceSqToSegment(v.start,v.end,c,d),c.distanceTo(d)<.5*r&&t.push({point:c,pointOnLine:d,distance:i.origin.distanceTo(c),object:e,face:null,faceIndex:o,uv:null,uv1:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,y=d.attributes.instanceEnd,w=Math.min(d.instanceCount,c.count),S=-t.near;i.at(1,p),p.w=1,p.applyMatrix4(t.matrixWorldInverse),p.applyMatrix4(o),p.multiplyScalar(1/p.w),p.x*=s.x/2,p.y*=s.y/2,p.z=0,m.copy(p),h.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<w;t++){if(u.fromBufferAttribute(c,t),f.fromBufferAttribute(y,t),u.w=1,f.w=1,u.applyMatrix4(h),f.applyMatrix4(h),u.z>S&&f.z>S)continue;if(u.z>S){let e=u.z-f.z,t=(u.z-S)/e;u.lerp(f,t)}else if(f.z>S){let e=f.z-u.z,t=(f.z-S)/e;f.lerp(u,t)}u.applyMatrix4(o),f.applyMatrix4(o),u.multiplyScalar(1/u.w),f.multiplyScalar(1/f.w),u.x*=s.x/2,u.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(u),v.start.z=0,v.end.copy(f),v.end.z=0;let d=v.closestPointToPointParameter(m,!0);v.at(d,g);let p=a.M8C.lerp(u.z,f.z,d),w=p>=-1&&p<=1,x=m.distanceTo(g)<.5*r;if(w&&x){v.start.fromBufferAttribute(c,t),v.end.fromBufferAttribute(y,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new a.Pa4,o=new a.Pa4;i.distanceSqToSegment(v.start,v.end,o,r),n.push({point:o,pointOnLine:r,distance:i.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){n.d(t,{z:function(){return o}});var i=n(9375);let r=new i.ZzF,a=new i.Pa4;class o extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)a.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(a)),a.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(a));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,t,n){n.d(t,{XR:function(){return i}});let i=e=>(t,n,i)=>{let r=i.subscribe;return i.subscribe=(e,t,n)=>{let a=e;if(t){let r=(null==n?void 0:n.equalityFn)||Object.is,o=e(i.getState());a=n=>{let i=e(n);if(!r(o,i)){let e=o;t(o=i,e)}},(null==n?void 0:n.fireImmediately)&&t(o,o)}return r(a)},e(t,n,i)}},73542:function(e,t,n){n.d(t,{U:function(){return l},o:function(){return o}});var i=n(52983),r=n(98565);let a=e=>e;function o(e,t=a){let n=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>t(e.getState()),[e,t]),i.useCallback(()=>t(e.getInitialState()),[e,t]));return i.useDebugValue(n),n}let s=e=>{let t=(0,r.M)(e),n=e=>o(t,e);return Object.assign(n,t),n},l=e=>e?s(e):s},98565:function(e,t,n){n.d(t,{M:function(){return r}});let i=e=>{let t;let n=new Set,i=(e,i)=>{let r="function"==typeof e?e(t):e;if(!Object.is(r,t)){let e=t;t=(null!=i?i:"object"!=typeof r||null===r)?r:Object.assign({},t,r),n.forEach(n=>n(t,e))}},r=()=>t,a={setState:i,getState:r,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(i,r,a);return a},r=e=>e?i(e):i}}]);