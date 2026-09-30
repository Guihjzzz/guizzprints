(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[24654],{58109:function(e,t,n){"use strict";n.d(t,{V:function(){return s}});var i=n(99217),r=n(62510),o=n(52983),a=n(9375);let s=o.forwardRef(function({children:e,follow:t=!0,lockX:n=!1,lockY:s=!1,lockZ:l=!1,...d},c){let u=o.useRef(null),f=o.useRef(null),p=new a._fP;return(0,r.F)(({camera:e})=>{if(!t||!f.current)return;let i=u.current.rotation.clone();f.current.updateMatrix(),f.current.updateWorldMatrix(!1,!1),f.current.getWorldQuaternion(p),e.getWorldQuaternion(u.current.quaternion).premultiply(p.invert()),n&&(u.current.rotation.x=i.x),s&&(u.current.rotation.y=i.y),l&&(u.current.rotation.z=i.z)}),o.useImperativeHandle(c,()=>f.current,[]),o.createElement("group",(0,i.Z)({ref:f},d),o.createElement("group",{ref:u},e))})},81125:function(e,t,n){"use strict";n.d(t,{q:function(){return g}});var i=n(99217),r=n(62510),o=n(52983),a=n(9375),s=n(30535),l=Object.defineProperty,d=(e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,c=(e,t,n)=>(d(e,"symbol"!=typeof t?t+"":t,n),n);let u=new a.USm(0,0,0,"YXZ"),f=new a.Pa4,p={type:"change"},h={type:"lock"},m={type:"unlock"},v=Math.PI/2;class y extends s.p{constructor(e,t){super(),c(this,"camera"),c(this,"domElement"),c(this,"isLocked"),c(this,"minPolarAngle"),c(this,"maxPolarAngle"),c(this,"pointerSpeed"),c(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(u.setFromQuaternion(this.camera.quaternion),u.y-=.002*e.movementX*this.pointerSpeed,u.x-=.002*e.movementY*this.pointerSpeed,u.x=Math.max(v-this.maxPolarAngle,Math.min(v-this.minPolarAngle,u.x)),this.camera.quaternion.setFromEuler(u),this.dispatchEvent(p))}),c(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(h),this.isLocked=!0):(this.dispatchEvent(m),this.isLocked=!1))}),c(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),c(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),c(this,"dispose",()=>{this.disconnect()}),c(this,"getObject",()=>this.camera),c(this,"direction",new a.Pa4(0,0,-1)),c(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),c(this,"moveForward",e=>{f.setFromMatrixColumn(this.camera.matrix,0),f.crossVectors(this.camera.up,f),this.camera.position.addScaledVector(f,e)}),c(this,"moveRight",e=>{f.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(f,e)}),c(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),c(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,t&&this.connect(t)}}let g=o.forwardRef(({domElement:e,selector:t,onChange:n,onLock:a,onUnlock:s,enabled:l=!0,makeDefault:d,...c},u)=>{let{camera:f,...p}=c,h=(0,r.D)(e=>e.setEvents),m=(0,r.D)(e=>e.gl),v=(0,r.D)(e=>e.camera),g=(0,r.D)(e=>e.invalidate),w=(0,r.D)(e=>e.events),x=(0,r.D)(e=>e.get),S=(0,r.D)(e=>e.set),E=f||v,b=e||w.connected||m.domElement,L=o.useMemo(()=>new y(E),[E]);return o.useEffect(()=>{if(l){L.connect(b);let e=x().events.compute;return h({compute(e,t){let n=t.size.width/2,i=t.size.height/2;t.pointer.set(n/t.size.width*2-1,-(i/t.size.height*2)+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),()=>{L.disconnect(),h({compute:e})}}},[l,L]),o.useEffect(()=>{let e=e=>{g(),n&&n(e)};L.addEventListener("change",e),a&&L.addEventListener("lock",a),s&&L.addEventListener("unlock",s);let i=()=>L.lock(),r=t?Array.from(document.querySelectorAll(t)):[document];return r.forEach(e=>e&&e.addEventListener("click",i)),()=>{L.removeEventListener("change",e),a&&L.removeEventListener("lock",a),s&&L.removeEventListener("unlock",s),r.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[n,a,s,t,L,g]),o.useEffect(()=>{if(d){let e=x().controls;return S({controls:L}),()=>S({controls:e})}},[d,L]),o.createElement("primitive",(0,i.Z)({ref:u,object:L},p))})},73420:function(e,t,n){"use strict";n.d(t,{Z:function(){return l},c:function(){return s}});var i=n(52983),r=n(73542),o=n(75575);let a=i.createContext(null);function s({map:e,children:t,onChange:n,domElement:s}){let l=e.map(e=>e.name+e.keys).join("-"),d=i.useMemo(()=>(0,r.U)((0,o.XR)(()=>e.reduce((e,t)=>({...e,[t.name]:!1}),{}))),[l]),c=i.useMemo(()=>[d.subscribe,d.getState,d],[l]),u=d.setState;return i.useEffect(()=>{let t=e.map(({name:e,keys:t,up:i})=>({keys:t,up:i,fn:t=>{u({[e]:t}),n&&n(e,t,c[1]())}})).reduce((e,{keys:t,fn:n,up:i=!0})=>(t.forEach(t=>e[t]={fn:n,pressed:!1,up:i}),e),{}),i=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,pressed:o,up:a}=i;i.pressed=!0,(a||!o)&&r(!0)},r=({key:e,code:n})=>{let i=t[e]||t[n];if(!i)return;let{fn:r,up:o}=i;i.pressed=!1,o&&r(!1)},o=s||window;return o.addEventListener("keydown",i,{passive:!0}),o.addEventListener("keyup",r,{passive:!0}),()=>{o.removeEventListener("keydown",i),o.removeEventListener("keyup",r)}},[s,l]),i.createElement(a.Provider,{value:c,children:t})}function l(e){let[t,n,r]=i.useContext(a);return e?r(e):[t,n]}},14978:function(e,t,n){var i="Expected a function",r=0/0,o=/^\s+|\s+$/g,a=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,d=parseInt,c="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,u="object"==typeof self&&self&&self.Object===Object&&self,f=c||u||Function("return this")(),p=Object.prototype.toString,h=Math.max,m=Math.min,v=function(){return f.Date.now()};function y(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function g(e){if("number"==typeof e)return e;if("symbol"==typeof(t=e)||t&&"object"==typeof t&&"[object Symbol]"==p.call(t))return r;if(y(e)){var t,n="function"==typeof e.valueOf?e.valueOf():e;e=y(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(o,"");var i=s.test(e);return i||l.test(e)?d(e.slice(2),i?2:8):a.test(e)?r:+e}e.exports=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw TypeError(i);return y(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),function(e,t,n){var r,o,a,s,l,d,c=0,u=!1,f=!1,p=!0;if("function"!=typeof e)throw TypeError(i);function w(t){var n=r,i=o;return r=o=void 0,c=t,s=e.apply(i,n)}function x(e){var n=e-d,i=e-c;return void 0===d||n>=t||n<0||f&&i>=a}function S(){var e,n,i,r=v();if(x(r))return E(r);l=setTimeout(S,(e=r-d,n=r-c,i=t-e,f?m(i,a-n):i))}function E(e){return(l=void 0,p&&r)?w(e):(r=o=void 0,s)}function b(){var e,n=v(),i=x(n);if(r=arguments,o=this,d=n,i){if(void 0===l)return c=e=d,l=setTimeout(S,t),u?w(e):s;if(f)return l=setTimeout(S,t),w(d)}return void 0===l&&(l=setTimeout(S,t)),s}return t=g(t)||0,y(n)&&(u=!!n.leading,a=(f="maxWait"in n)?h(g(n.maxWait)||0,t):a,p="trailing"in n?!!n.trailing:p),b.cancel=function(){void 0!==l&&clearTimeout(l),c=0,r=d=o=l=void 0},b.flush=function(){return void 0===l?s:E(v())},b}(e,t,{leading:r,maxWait:t,trailing:o})}},1848:function(e,t,n){"use strict";n.d(t,{U:function(){return f}});var i=n(40393),r=n(19938),o=n(44659),a=n(39267),s=n(52983),l=n(97458),d=e=>null!=e&&parseInt(e.toString(),10)>0,c={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},u={exit:({animateOpacity:e,startingHeight:t,transition:n,transitionEnd:r,delay:o})=>{var a;return{...e&&{opacity:d(t)?1:0},height:t,transitionEnd:null==r?void 0:r.exit,transition:null!=(a=null==n?void 0:n.exit)?a:i.p$.exit(c.exit,o)}},enter:({animateOpacity:e,endingHeight:t,transition:n,transitionEnd:r,delay:o})=>{var a;return{...e&&{opacity:1},height:t,transitionEnd:null==r?void 0:r.enter,transition:null!=(a=null==n?void 0:n.enter)?a:i.p$.enter(c.enter,o)}}},f=(0,s.forwardRef)((e,t)=>{let{in:n,unmountOnExit:i,animateOpacity:d=!0,startingHeight:c=0,endingHeight:f="auto",style:p,className:h,transition:m,transitionEnd:v,...y}=e,[g,w]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=setTimeout(()=>{w(!0)});return()=>clearTimeout(e)},[]),(0,r.ZK)({condition:Number(c)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let x=parseFloat(c.toString())>0,S={startingHeight:c,endingHeight:f,animateOpacity:d,transition:g?m:{enter:{duration:0}},transitionEnd:{enter:null==v?void 0:v.enter,exit:i?null==v?void 0:v.exit:{...null==v?void 0:v.exit,display:x?"block":"none"}}},E=!i||n,b=n||i?"enter":"exit";return(0,l.jsx)(o.M,{initial:!1,custom:S,children:E&&(0,l.jsx)(a.E.div,{ref:t,...y,className:(0,r.cx)("chakra-collapse",h),style:{overflow:"hidden",display:"block",...p},custom:S,variants:u,initial:!!i&&"exit",animate:b,exit:"exit"})})});f.displayName="Collapse"},95569:function(e,t,n){"use strict";n.d(t,{v:function(){return i}});var i=n(60413);t.Z=i},4248:function(e,t,n){"use strict";n.d(t,{i:function(){return i}});let i=parseInt(n(9375).UZH.replace(/\D+/g,""))},61261:function(e,t,n){"use strict";n.d(t,{Y:function(){return o}});var i=n(16808),r=n(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:r.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class o extends r.jyz{constructor(e){super({type:"LineMaterial",uniforms:r.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,t,n){"use strict";let i,r;n.d(t,{w:function(){return E}});var o=n(9375),a=n(90845),s=n(61261);let l=new o.Ltg,d=new o.Pa4,c=new o.Pa4,u=new o.Ltg,f=new o.Ltg,p=new o.Ltg,h=new o.Pa4,m=new o.yGw,v=new o.Zzh,y=new o.Pa4,g=new o.ZzF,w=new o.aLr,x=new o.Ltg;function S(e,t,n){return x.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),x.multiplyScalar(1/x.w),x.x=r/n.width,x.y=r/n.height,x.applyMatrix4(e.projectionMatrixInverse),x.multiplyScalar(1/x.w),Math.abs(Math.max(x.x,x.y))}class E extends o.Kj0{constructor(e=new a.z,t=new s.Y({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,r=0,o=t.count;e<o;e++,r+=2)d.fromBufferAttribute(t,e),c.fromBufferAttribute(n,e),i[r]=0===r?0:i[r-1],i[r+1]=i[r]+d.distanceTo(c);let r=new o.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new o.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.kB5(r,1,1)),this}raycast(e,t){let n,a;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let c=this.matrixWorld,x=this.geometry,E=this.material;if(r=E.linewidth+d,null===x.boundingSphere&&x.computeBoundingSphere(),w.copy(x.boundingSphere).applyMatrix4(c),s)n=.5*r;else{let e=Math.max(l.near,w.distanceToPoint(i.origin));n=S(l,e,E.resolution)}if(w.radius+=n,!1!==i.intersectsSphere(w)){if(null===x.boundingBox&&x.computeBoundingBox(),g.copy(x.boundingBox).applyMatrix4(c),s)a=.5*r;else{let e=Math.max(l.near,g.distanceToPoint(i.origin));a=S(l,e,E.resolution)}g.expandByScalar(a),!1!==i.intersectsBox(g)&&(s?function(e,t){let n=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,d=Math.min(a.instanceCount,s.count);for(let a=0;a<d;a++){v.start.fromBufferAttribute(s,a),v.end.fromBufferAttribute(l,a),v.applyMatrix4(n);let d=new o.Pa4,c=new o.Pa4;i.distanceSqToSegment(v.start,v.end,c,d),c.distanceTo(d)<.5*r&&t.push({point:c,pointOnLine:d,distance:i.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}(this,t):function(e,t,n){let a=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,g=d.attributes.instanceEnd,w=Math.min(d.instanceCount,c.count),x=-t.near;i.at(1,p),p.w=1,p.applyMatrix4(t.matrixWorldInverse),p.applyMatrix4(a),p.multiplyScalar(1/p.w),p.x*=s.x/2,p.y*=s.y/2,p.z=0,h.copy(p),m.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<w;t++){if(u.fromBufferAttribute(c,t),f.fromBufferAttribute(g,t),u.w=1,f.w=1,u.applyMatrix4(m),f.applyMatrix4(m),u.z>x&&f.z>x)continue;if(u.z>x){let e=u.z-f.z,t=(u.z-x)/e;u.lerp(f,t)}else if(f.z>x){let e=f.z-u.z,t=(f.z-x)/e;f.lerp(u,t)}u.applyMatrix4(a),f.applyMatrix4(a),u.multiplyScalar(1/u.w),f.multiplyScalar(1/f.w),u.x*=s.x/2,u.y*=s.y/2,f.x*=s.x/2,f.y*=s.y/2,v.start.copy(u),v.start.z=0,v.end.copy(f),v.end.z=0;let d=v.closestPointToPointParameter(h,!0);v.at(d,y);let p=o.M8C.lerp(u.z,f.z,d),w=p>=-1&&p<=1,S=h.distanceTo(y)<.5*r;if(w&&S){v.start.fromBufferAttribute(c,t),v.end.fromBufferAttribute(g,t),v.start.applyMatrix4(l),v.end.applyMatrix4(l);let r=new o.Pa4,a=new o.Pa4;i.distanceSqToSegment(v.start,v.end,a,r),n.push({point:a,pointOnLine:r,distance:i.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(l),this.material.uniforms.resolution.value.set(l.z,l.w))}}},90845:function(e,t,n){"use strict";n.d(t,{z:function(){return a}});var i=n(9375);let r=new i.ZzF,o=new i.Pa4;class a extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceStart",new i.kB5(n,3,0)),this.setAttribute("instanceEnd",new i.kB5(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new i.$TI(t,6,1);return this.setAttribute("instanceColorStart",new i.kB5(n,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),r.setFromBufferAttribute(t),this.boundingBox.union(r))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)o.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(o)),o.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(o));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}}}]);