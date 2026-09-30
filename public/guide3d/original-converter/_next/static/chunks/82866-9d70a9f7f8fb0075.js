"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[82866],{63563:function(e,t,i){i.d(t,{R:function(){return s}});var n=i(52983),a=i(9375),r=i(62510);function s(e,t,i){let s=(0,r.D)(e=>e.size),o=(0,r.D)(e=>e.viewport),l="number"==typeof e?e:s.width*o.dpr,h="number"==typeof t?t:s.height*o.dpr,{samples:c=0,depth:u,...d}=("number"==typeof e?i:e)||{},f=n.useMemo(()=>{let e=new a.dd2(l,h,{minFilter:a.wem,magFilter:a.wem,type:a.cLu,...d});return u&&(e.depthTexture=new a.$YQ(l,h,a.VzW)),e.samples=c,e},[]);return n.useLayoutEffect(()=>{f.setSize(l,h),c&&(f.samples=c)},[c,f,l,h]),n.useEffect(()=>()=>f.dispose(),[]),f}},66466:function(e,t,i){i.d(t,{u:function(){return o}});var n=i(9375),a=i(52983),r=i(62510);function s({defaultScene:e,defaultCamera:t,renderPriority:i=1}){let n;let{gl:s,scene:o,camera:l}=(0,r.D)();return(0,r.F)(()=>{n=s.autoClear,1===i&&(s.autoClear=!0,s.render(e,t)),s.autoClear=!1,s.clearDepth(),s.render(o,l),s.autoClear=n},i),a.createElement("group",{onPointerOver:()=>null})}function o({children:e,renderPriority:t=1}){let{scene:i,camera:o}=(0,r.D)(),[l]=a.useState(()=>new n.xsS);return a.createElement(a.Fragment,null,(0,r.h)(a.createElement(a.Fragment,null,e,a.createElement(s,{defaultScene:i,defaultCamera:o,renderPriority:t})),l,{events:{priority:t+1}}))}},76967:function(e,t,i){let n,a;i.d(t,{x:function(){return O}});var r=i(99217),s=i(52983),o=i(9375),l=i(62510);let h=new o.ZzF,c=new o.Pa4;class u extends o.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new o.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new o.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new o.$TI(t,6,1);return this.setAttribute("instanceStart",new o.kB5(i,3,0)),this.setAttribute("instanceEnd",new o.kB5(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new o.$TI(i,2*t,1);return this.setAttribute("instanceColorStart",new o.kB5(n,t,0)),this.setAttribute("instanceColorEnd",new o.kB5(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new o.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new o.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),h.setFromBufferAttribute(t),this.boundingBox.union(h))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new o.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let a=0,r=e.count;a<r;a++)c.fromBufferAttribute(e,a),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,a),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var d=i(16808),f=i(4248);class p extends o.jyz{constructor(e){super({type:"LineMaterial",uniforms:o.rDY.clone(o.rDY.merge([d.UniformsLib.common,d.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new o.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

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

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

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

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

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
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

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
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${f.i>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let m=f.i>=125?"uv1":"uv2",v=new o.Ltg,g=new o.Pa4,b=new o.Pa4,y=new o.Ltg,x=new o.Ltg,_=new o.Ltg,w=new o.Pa4,S=new o.yGw,E=new o.Zzh,P=new o.Pa4,D=new o.ZzF,T=new o.aLr,M=new o.Ltg;function L(e,t,i){return M.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),M.multiplyScalar(1/M.w),M.x=a/i.width,M.y=a/i.height,M.applyMatrix4(e.projectionMatrixInverse),M.multiplyScalar(1/M.w),Math.abs(Math.max(M.x,M.y))}class R extends o.Kj0{constructor(e=new u,t=new p({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,a=0,r=t.count;e<r;e++,a+=2)g.fromBufferAttribute(t,e),b.fromBufferAttribute(i,e),n[a]=0===a?0:n[a-1],n[a+1]=n[a]+g.distanceTo(b);let a=new o.$TI(n,2,1);return e.setAttribute("instanceDistanceStart",new o.kB5(a,1,0)),e.setAttribute("instanceDistanceEnd",new o.kB5(a,1,1)),this}raycast(e,t){let i,r;let s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let h=void 0!==e.params.Line2&&e.params.Line2.threshold||0;n=e.ray;let c=this.matrixWorld,u=this.geometry,d=this.material;if(a=d.linewidth+h,null===u.boundingSphere&&u.computeBoundingSphere(),T.copy(u.boundingSphere).applyMatrix4(c),s)i=.5*a;else{let e=Math.max(l.near,T.distanceToPoint(n.origin));i=L(l,e,d.resolution)}if(T.radius+=i,!1!==n.intersectsSphere(T)){if(null===u.boundingBox&&u.computeBoundingBox(),D.copy(u.boundingBox).applyMatrix4(c),s)r=.5*a;else{let e=Math.max(l.near,D.distanceToPoint(n.origin));r=L(l,e,d.resolution)}D.expandByScalar(r),!1!==n.intersectsBox(D)&&(s?function(e,t){let i=e.matrixWorld,r=e.geometry,s=r.attributes.instanceStart,l=r.attributes.instanceEnd,h=Math.min(r.instanceCount,s.count);for(let r=0;r<h;r++){E.start.fromBufferAttribute(s,r),E.end.fromBufferAttribute(l,r),E.applyMatrix4(i);let h=new o.Pa4,c=new o.Pa4;n.distanceSqToSegment(E.start,E.end,c,h),c.distanceTo(h)<.5*a&&t.push({point:c,pointOnLine:h,distance:n.origin.distanceTo(c),object:e,face:null,faceIndex:r,uv:null,[m]:null})}}(this,t):function(e,t,i){let r=t.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,h=e.geometry,c=h.attributes.instanceStart,u=h.attributes.instanceEnd,d=Math.min(h.instanceCount,c.count),f=-t.near;n.at(1,_),_.w=1,_.applyMatrix4(t.matrixWorldInverse),_.applyMatrix4(r),_.multiplyScalar(1/_.w),_.x*=s.x/2,_.y*=s.y/2,_.z=0,w.copy(_),S.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<d;t++){if(y.fromBufferAttribute(c,t),x.fromBufferAttribute(u,t),y.w=1,x.w=1,y.applyMatrix4(S),x.applyMatrix4(S),y.z>f&&x.z>f)continue;if(y.z>f){let e=y.z-x.z,t=(y.z-f)/e;y.lerp(x,t)}else if(x.z>f){let e=x.z-y.z,t=(x.z-f)/e;x.lerp(y,t)}y.applyMatrix4(r),x.applyMatrix4(r),y.multiplyScalar(1/y.w),x.multiplyScalar(1/x.w),y.x*=s.x/2,y.y*=s.y/2,x.x*=s.x/2,x.y*=s.y/2,E.start.copy(y),E.start.z=0,E.end.copy(x),E.end.z=0;let h=E.closestPointToPointParameter(w,!0);E.at(h,P);let d=o.M8C.lerp(y.z,x.z,h),p=d>=-1&&d<=1,v=w.distanceTo(P)<.5*a;if(p&&v){E.start.fromBufferAttribute(c,t),E.end.fromBufferAttribute(u,t),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let a=new o.Pa4,r=new o.Pa4;n.distanceSqToSegment(E.start,E.end,r,a),i.push({point:r,pointOnLine:a,distance:n.origin.distanceTo(r),object:e,face:null,faceIndex:t,uv:null,[m]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class A extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let a=0;a<i;a+=t)n[2*a]=e[a],n[2*a+1]=e[a+1],n[2*a+2]=e[a+2],n[2*a+3]=e[a+3],n[2*a+4]=e[a+4],n[2*a+5]=e[a+5];else for(let a=0;a<i;a+=t)n[2*a]=e[a],n[2*a+1]=e[a+1],n[2*a+2]=e[a+2],n[2*a+3]=e[a+3],n[2*a+4]=e[a+4],n[2*a+5]=e[a+5],n[2*a+6]=e[a+6],n[2*a+7]=e[a+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class k extends R{constructor(e=new A,t=new p({color:16777215*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=s.forwardRef(function({points:e,color:t=16777215,vertexColors:i,linewidth:n,lineWidth:a,segments:h,dashed:c,...d},f){var m,v;let g=(0,l.D)(e=>e.size),b=s.useMemo(()=>h?new R:new k,[h]),[y]=s.useState(()=>new p),x=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,_=s.useMemo(()=>{let n=h?new u:new A,a=e.map(e=>{let t=Array.isArray(e);return e instanceof o.Pa4||e instanceof o.Ltg?[e.x,e.y,e.z]:e instanceof o.FM8?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(a.flat()),i){t=16777215;let e=i.map(e=>e instanceof o.Ilk?e.toArray():e);n.setColors(e.flat(),x)}return n},[e,h,i,x]);return s.useLayoutEffect(()=>{b.computeLineDistances()},[e,b]),s.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),s.useEffect(()=>()=>{_.dispose(),y.dispose()},[_]),s.createElement("primitive",(0,r.Z)({object:b,ref:f},d),s.createElement("primitive",{object:_,attach:"geometry"}),s.createElement("primitive",(0,r.Z)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!==(v=null!=n?n:a)&&void 0!==v?v:1,dashed:c,transparent:4===x},d)))})},96428:function(e,t,i){i.d(t,{i:function(){return l}});var n=i(99217),a=i(52983),r=i(62510),s=i(63563);let o=e=>"function"==typeof e,l=a.forwardRef(({envMap:e,resolution:t=256,frames:i=1/0,children:l,makeDefault:h,...c},u)=>{let d=(0,r.D)(({set:e})=>e),f=(0,r.D)(({camera:e})=>e),p=(0,r.D)(({size:e})=>e),m=a.useRef(null);a.useImperativeHandle(u,()=>m.current,[]);let v=a.useRef(null),g=(0,s.R)(t);a.useLayoutEffect(()=>{c.manual||m.current.updateProjectionMatrix()},[p,c]),a.useLayoutEffect(()=>{m.current.updateProjectionMatrix()}),a.useLayoutEffect(()=>{if(h)return d(()=>({camera:m.current})),()=>d(()=>({camera:f}))},[m,h,d]);let b=0,y=null,x=o(l);return(0,r.F)(t=>{x&&(i===1/0||b<i)&&(v.current.visible=!1,t.gl.setRenderTarget(g),y=t.scene.background,e&&(t.scene.background=e),t.gl.render(t.scene,m.current),t.scene.background=y,t.gl.setRenderTarget(null),v.current.visible=!0,b++)}),a.createElement(a.Fragment,null,a.createElement("orthographicCamera",(0,n.Z)({left:-(p.width/2),right:p.width/2,top:p.height/2,bottom:-(p.height/2),ref:m},c),!x&&l),a.createElement("group",{ref:v},x&&l(g.texture)))})},79469:function(e,t,i){i.d(t,{x:function(){return l}});var n=i(99217),a=i(52983),r=i(64057),s=i(62510),o=i(58089);let l=a.forwardRef(({sdfGlyphSize:e=64,anchorX:t="center",anchorY:i="middle",font:l,fontSize:h=1,children:c,characters:u,onSync:d,...f},p)=>{let m=(0,s.D)(({invalidate:e})=>e),[v]=a.useState(()=>new r.xv),[g,b]=a.useMemo(()=>{let e=[],t="";return a.Children.forEach(c,i=>{"string"==typeof i||"number"==typeof i?t+=i:e.push(i)}),[e,t]},[c]);return(0,o.Rq)(()=>new Promise(e=>(0,r.C5)({font:l,characters:u},e)),["troika-text",l,u]),a.useLayoutEffect(()=>void v.sync(()=>{m(),d&&d(v)})),a.useEffect(()=>()=>v.dispose(),[v]),a.createElement("primitive",(0,n.Z)({object:v,ref:p,font:l,text:b,anchorX:t,anchorY:i,fontSize:h,sdfGlyphSize:e},f),g)})},7642:function(e,t,i){let n,a;i.d(t,{V:function(){return y}});var r=i(99217),s=i(52983),o=i(78520),l=i(9375),h=i(62510);let c=new l.Pa4,u=new l.Pa4,d=new l.Pa4,f=new l.FM8;function p(e,t,i){let n=c.setFromMatrixPosition(e.matrixWorld);n.project(t);let a=i.width/2,r=i.height/2;return[n.x*a+a,-(n.y*r)+r]}let m=e=>1e-10>Math.abs(e)?0:e;function v(e,t,i=""){let n="matrix3d(";for(let i=0;16!==i;i++)n+=m(t[i]*e.elements[i])+(15!==i?",":")");return i+n}let g=(n=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,n)),b=(a=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,a(t),"translate(-50%,-50%)")),y=s.forwardRef(({children:e,eps:t=.001,style:i,className:n,prepend:a,center:v,fullscreen:y,portal:x,distanceFactor:_,sprite:w=!1,transform:S=!1,occlude:E,onOcclude:P,castShadow:D,receiveShadow:T,material:M,geometry:L,zIndexRange:R=[16777271,0],calculatePosition:A=p,as:k="div",wrapperClass:O,pointerEvents:C="auto",...j},z)=>{let{gl:U,camera:I,scene:B,size:F,raycaster:N,events:W,viewport:G}=(0,h.D)(),[H]=s.useState(()=>document.createElement(k)),$=s.useRef(),q=s.useRef(null),Y=s.useRef(0),V=s.useRef([0,0]),K=s.useRef(null),Z=s.useRef(null),X=(null==x?void 0:x.current)||W.connected||U.domElement.parentNode,Q=s.useRef(null),J=s.useRef(!1),ee=s.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);s.useLayoutEffect(()=>{let e=U.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(R[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),s.useLayoutEffect(()=>{if(q.current){let e=$.current=o.createRoot(H);if(B.updateMatrixWorld(),S)H.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=A(q.current,I,F);H.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return X&&(a?X.prepend(H):X.appendChild(H)),()=>{X&&X.removeChild(H),e.unmount()}}},[X,S]),s.useLayoutEffect(()=>{O&&(H.className=O)},[O]);let et=s.useMemo(()=>S?{position:"absolute",top:0,left:0,width:F.width,height:F.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...y&&{top:-F.height/2,left:-F.width/2,width:F.width,height:F.height},...i},[i,v,y,F,S]),ei=s.useMemo(()=>({position:"absolute",pointerEvents:C}),[C]);s.useLayoutEffect(()=>{var t,a;J.current=!1,S?null==(t=$.current)||t.render(s.createElement("div",{ref:K,style:et},s.createElement("div",{ref:Z,style:ei},s.createElement("div",{ref:z,className:n,style:i,children:e})))):null==(a=$.current)||a.render(s.createElement("div",{ref:z,style:et,className:n,children:e}))});let en=s.useRef(!0);(0,h.F)(e=>{if(q.current){I.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=S?V.current:A(q.current,I,F);if(S||Math.abs(Y.current-I.zoom)>t||Math.abs(V.current[0]-e[0])>t||Math.abs(V.current[1]-e[1])>t){let t=function(e,t){let i=c.setFromMatrixPosition(e.matrixWorld),n=u.setFromMatrixPosition(t.matrixWorld),a=i.sub(n),r=t.getWorldDirection(d);return a.angleTo(r)>Math.PI/2}(q.current,I),i=!1;ee&&(Array.isArray(E)?i=E.map(e=>e.current):"blending"!==E&&(i=[B]));let n=en.current;if(i){let e=function(e,t,i,n){let a=c.setFromMatrixPosition(e.matrixWorld),r=a.clone();r.project(t),f.set(r.x,r.y),i.setFromCamera(f,t);let s=i.intersectObjects(n,!0);if(s.length){let e=s[0].distance;return a.distanceTo(i.ray.origin)<e}return!0}(q.current,I,N,i);en.current=e&&!t}else en.current=!t;n!==en.current&&(P?P(!en.current):H.style.display=en.current?"block":"none");let a=Math.floor(R[0]/2),r=E?ee?[R[0],a]:[a-1,0]:R;if(H.style.zIndex=`${function(e,t,i){if(t instanceof l.cPb||t instanceof l.iKG){let n=c.setFromMatrixPosition(e.matrixWorld),a=u.setFromMatrixPosition(t.matrixWorld),r=n.distanceTo(a),s=(i[1]-i[0])/(t.far-t.near),o=i[1]-s*t.far;return Math.round(s*r+o)}}(q.current,I,r)}`,S){let[e,t]=[F.width/2,F.height/2],i=I.projectionMatrix.elements[5]*t,{isOrthographicCamera:n,top:a,left:r,bottom:s,right:o}=I,l=g(I.matrixWorldInverse),h=n?`scale(${i})translate(${m(-(o+r)/2)}px,${m((a+s)/2)}px)`:`translateZ(${i}px)`,c=q.current.matrixWorld;w&&((c=I.matrixWorldInverse.clone().transpose().copyPosition(c).scale(q.current.scale)).elements[3]=c.elements[7]=c.elements[11]=0,c.elements[15]=1),H.style.width=F.width+"px",H.style.height=F.height+"px",H.style.perspective=n?"":`${i}px`,K.current&&Z.current&&(K.current.style.transform=`${h}${l}translate(${e}px,${t}px)`,Z.current.style.transform=b(c,1/((_||10)/400)))}else{let t=void 0===_?1:function(e,t){if(t instanceof l.iKG)return t.zoom;if(!(t instanceof l.cPb))return 1;{let i=c.setFromMatrixPosition(e.matrixWorld),n=u.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(n))}}(q.current,I)*_;H.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}V.current=e,Y.current=I.zoom}}if(!ee&&Q.current&&!J.current){if(S){if(K.current){let e=K.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=I;if(t||L)j.scale&&(Array.isArray(j.scale)?j.scale instanceof l.Pa4?Q.current.scale.copy(j.scale.clone().divideScalar(1)):Q.current.scale.set(1/j.scale[0],1/j.scale[1],1/j.scale[2]):Q.current.scale.setScalar(1/j.scale));else{let t=(_||10)/400,i=e.clientWidth*t,n=e.clientHeight*t;Q.current.scale.set(i,n,1)}J.current=!0}}}else{let t=H.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/G.factor,i=t.clientWidth*e,n=t.clientHeight*e;Q.current.scale.set(i,n,1),J.current=!0}Q.current.lookAt(e.camera.position)}}});let ea=s.useMemo(()=>({vertexShader:S?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[S]);return s.createElement("group",(0,r.Z)({},j,{ref:q}),E&&!ee&&s.createElement("mesh",{castShadow:D,receiveShadow:T,ref:Q},L||s.createElement("planeGeometry",null),M||s.createElement("shaderMaterial",{side:l.ehD,vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader})))})},77449:function(e,t,i){i.d(t,{B$:function(){return function e(t,i){let n=function(e){let t=JSON.stringify(e,p),i=v.get(t);return null==i&&v.set(t,i=++m),i}(i),r=c.get(t);if(r||c.set(t,r=Object.create(null)),r[n])return new r[n];let g=`_onBeforeCompile${n}`,b=function(e,a){t.onBeforeCompile.call(this,e,a);let r=this.customProgramCacheKey()+"|"+e.vertexShader+"|"+e.fragmentShader,o=u[r];if(!o){let t=function(e,{vertexShader:t,fragmentShader:i},n,a){let{vertexDefs:r,vertexMainIntro:o,vertexMainOutro:l,vertexTransform:h,fragmentDefs:c,fragmentMainIntro:u,fragmentMainOutro:d,fragmentColorTransform:p,customRewriter:m,timeUniform:v}=n;if(r=r||"",o=o||"",l=l||"",c=c||"",u=u||"",d=d||"",(h||m)&&(t=s(t)),(p||m)&&(i=s(i=i.replace(/^[ \t]*#include <((?:tonemapping|encodings|colorspace|fog|premultiplied_alpha|dithering)_fragment)>/gm,"\n//!BEGIN_POST_CHUNK $1\n$&\n//!END_POST_CHUNK\n"))),m){let e=m({vertexShader:t,fragmentShader:i});t=e.vertexShader,i=e.fragmentShader}if(p){let e=[];i=i.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,t=>(e.push(t),"")),d=`${p}
${e.join("\n")}
${d}`}if(v){let e=`
uniform float ${v};
`;r=e+r,c=e+c}return h&&(t=`vec3 troika_position_${a};
vec3 troika_normal_${a};
vec2 troika_uv_${a};
${t}
`,r=`${r}
void troikaVertexTransform${a}(inout vec3 position, inout vec3 normal, inout vec2 uv) {
  ${h}
}
`,o=`
troika_position_${a} = vec3(position);
troika_normal_${a} = vec3(normal);
troika_uv_${a} = vec2(uv);
troikaVertexTransform${a}(troika_position_${a}, troika_normal_${a}, troika_uv_${a});
${o}
`,t=t.replace(/\b(position|normal|uv)\b/g,(e,t,i,n)=>/\battribute\s+vec[23]\s+$/.test(n.substr(0,i))?t:`troika_${t}_${a}`),e.map&&e.map.channel>0||(t=t.replace(/\bMAP_UV\b/g,`troika_uv_${a}`))),{vertexShader:t=f(t,a,r,o,l),fragmentShader:i=f(i,a,c,u,d)}}(this,e,i,n);o=u[r]=t}e.vertexShader=o.vertexShader,e.fragmentShader=o.fragmentShader,l(e.uniforms,this.uniforms),i.timeUniform&&(e.uniforms[i.timeUniform]={get value(){return Date.now()-h}}),this[g]&&this[g](e)},y=function(){return x(i.chained?t:t.clone())},x=function(e){let a=Object.create(e,_);return Object.defineProperty(a,"baseMaterial",{value:t}),Object.defineProperty(a,"id",{value:d++}),a.uuid=function(){let e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(o[255&e]+o[e>>8&255]+o[e>>16&255]+o[e>>24&255]+"-"+o[255&t]+o[t>>8&255]+"-"+o[t>>16&15|64]+o[t>>24&255]+"-"+o[63&i|128]+o[i>>8&255]+"-"+o[i>>16&255]+o[i>>24&255]+o[255&n]+o[n>>8&255]+o[n>>16&255]+o[n>>24&255]).toUpperCase()}(),a.uniforms=l({},e.uniforms,i.uniforms),a.defines=l({},e.defines,i.defines),a.defines[`TROIKA_DERIVED_MATERIAL_${n}`]="",a.extensions=l({},e.extensions,i.extensions),a._listeners=void 0,a},_={constructor:{value:y},isDerivedMaterial:{value:!0},type:{get:()=>t.type,set:e=>{t.type=e}},isDerivedFrom:{writable:!0,configurable:!0,value:function(e){let t=this.baseMaterial;return e===t||t.isDerivedMaterial&&t.isDerivedFrom(e)||!1}},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return t.customProgramCacheKey()+"|"+n}},onBeforeCompile:{get:()=>b,set(e){this[g]=e}},copy:{writable:!0,configurable:!0,value:function(e){return t.copy.call(this,e),t.isShaderMaterial||t.isDerivedMaterial||(l(this.extensions,e.extensions),l(this.defines,e.defines),l(this.uniforms,a.rDY.clone(e.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){return x(new t.constructor).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let n=this._depthMaterial;return n||((n=this._depthMaterial=e(t.isDerivedMaterial?t.getDepthMaterial():new a.lRF({depthPacking:a.mSO}),i)).defines.IS_DEPTH_MATERIAL="",n.uniforms=this.uniforms),n}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let n=this._distanceMaterial;return n||((n=this._distanceMaterial=e(t.isDerivedMaterial?t.getDistanceMaterial():new a.Lun,i)).defines.IS_DISTANCE_MATERIAL="",n.uniforms=this.uniforms),n}},dispose:{writable:!0,configurable:!0,value(){let{_depthMaterial:e,_distanceMaterial:i}=this;e&&e.dispose(),i&&i.dispose(),t.dispose.call(this)}}};return r[n]=y,new y}},MW:function(){return r}});var n=i(16808),a=i(9375);let r=/\bvoid\s+main\s*\(\s*\)\s*{/g;function s(e){return e.replace(/^[ \t]*#include +<([\w\d./]+)>/gm,function(e,t){let i=n.ShaderChunk[t];return i?s(i):e})}let o=[];for(let e=0;e<256;e++)o[e]=(e<16?"0":"")+e.toString(16);let l=Object.assign||function(){let e=arguments[0];for(let t=1,i=arguments.length;t<i;t++){let i=arguments[t];if(i)for(let t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])}return e},h=Date.now(),c=new WeakMap,u=new Map,d=1e10;function f(e,t,i,n,a){return(n||a||i)&&(e=e.replace(r,`
${i}
void troikaOrigMain${t}() {`)+`
void main() {
  ${n}
  troikaOrigMain${t}();
  ${a}
}`),e}function p(e,t){return"uniforms"===e?void 0:"function"==typeof t?t.toString():t}let m=0,v=new Map;a.ehD},61593:function(e,t,i){function n(){var e=Object.create(null);function t(e,t){var i=void 0;self.troikaDefine=function(e){return i=e};var n=URL.createObjectURL(new Blob(["/** "+e.replace(/\*/g,"")+" **/\n\ntroikaDefine(\n"+t+"\n)"],{type:"application/javascript"}));try{importScripts(n)}catch(e){console.error(e)}return URL.revokeObjectURL(n),delete self.troikaDefine,i}self.addEventListener("message",function(i){var n=i.data,a=n.messageId,r=n.action,s=n.data;try{"registerModule"===r&&function i(n,a){var r=n.id,s=n.name,o=n.dependencies;void 0===o&&(o=[]);var l=n.init;void 0===l&&(l=function(){});var h=n.getTransferables;if(void 0===h&&(h=null),!e[r])try{o=o.map(function(t){return t&&t.isWorkerModule&&(i(t,function(e){if(e instanceof Error)throw e}),t=e[t.id].value),t}),l=t("<"+s+">.init",l),h&&(h=t("<"+s+">.getTransferables",h));var c=null;"function"==typeof l?c=l.apply(void 0,o):console.error("worker module init function failed to rehydrate"),e[r]={id:r,value:c,getTransferables:h},a(c)}catch(e){e&&e.noLog||console.error(e),a(e)}}(s,function(e){e instanceof Error?postMessage({messageId:a,success:!1,error:e.message}):postMessage({messageId:a,success:!0,result:{isCallable:"function"==typeof e}})}),"callModule"===r&&function(t,i){var n,a=t.id,r=t.args;e[a]&&"function"==typeof e[a].value||i(Error("Worker module "+a+": not found or its 'init' did not return a function"));try{var s=(n=e[a]).value.apply(n,r);s&&"function"==typeof s.then?s.then(o,function(e){return i(e instanceof Error?e:Error(""+e))}):o(s)}catch(e){i(e)}function o(t){try{var n=e[a].getTransferables&&e[a].getTransferables(t);n&&Array.isArray(n)&&n.length||(n=void 0),i(t,n)}catch(e){console.error(e),i(e)}}}(s,function(e,t){e instanceof Error?postMessage({messageId:a,success:!1,error:e.message}):postMessage({messageId:a,success:!0,result:e},t||void 0)})}catch(e){postMessage({messageId:a,success:!1,error:e.stack})}})}i.d(t,{Ae:function(){return u},Ch:function(){return function e(t){if((!t||"function"!=typeof t.init)&&!o)throw Error("requires `options.init` function");var i,n=t.dependencies,s=t.init,l=t.getTransferables,c=t.workerId,u=((i=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];return i._getInitResult().then(function(t){if("function"==typeof t)return t.apply(void 0,e);throw Error("Worker module function was called but `init` did not return a callable function")})})._getInitResult=function(){var e=t.dependencies,n=t.init,a=Promise.all(e=Array.isArray(e)?e.map(function(e){return e&&(e=e.onMainThread||e)._getInitResult&&(e=e._getInitResult()),e}):[]).then(function(e){return n.apply(null,e)});return i._getInitResult=function(){return a},a},i);null==c&&(c="#default");var p="workerModule"+ ++r,m=t.name||p,v=null;function g(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];if(!a())return u.apply(void 0,e);if(!v){v=f(c,"registerModule",g.workerModuleData);var i=function(){v=null,h[c].delete(i)};(h[c]||(h[c]=new Set)).add(i)}return v.then(function(t){if(t.isCallable)return f(c,"callModule",{id:p,args:e});throw Error("Worker module function was called but `init` did not return a callable function")})}return n=n&&n.map(function(t){return"function"!=typeof t||t.workerModuleData||(o=!0,t=e({workerId:c,name:"<"+m+"> function dependency: "+t.name,init:"function(){return (\n"+d(t)+"\n)}"}),o=!1),t&&t.workerModuleData&&(t=t.workerModuleData),t}),g.workerModuleData={isWorkerModule:!0,id:p,name:m,dependencies:n,init:d(s),getTransferables:l&&d(l)},g.onMainThread=u,g}}}),i(73656);var a=function(){var e=!1;if("undefined"!=typeof window&&void 0!==window.document)try{new Worker(URL.createObjectURL(new Blob([""],{type:"application/javascript"}))).terminate(),e=!0}catch(e){console.log("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: ["+e.message+"]")}return a=function(){return e},e},r=0,s=0,o=!1,l=Object.create(null),h=Object.create(null),c=Object.create(null);function u(e){h[e]&&h[e].forEach(function(e){e()}),l[e]&&(l[e].terminate(),delete l[e])}function d(e){var t=e.toString();return!/^function/.test(t)&&/^\w+\s*\(/.test(t)&&(t="function "+t),t}function f(e,t,i){return new Promise(function(a,r){var o=++s;c[o]=function(e){e.success?a(e.result):r(Error("Error in worker "+t+" call: "+e.error))},(function(e){var t=l[e];if(!t){var i=d(n);(t=l[e]=new Worker(URL.createObjectURL(new Blob(["/** Worker Module Bootstrap: "+e.replace(/\*/g,"")+" **/\n\n;("+i+")()"],{type:"application/javascript"})))).onmessage=function(e){var t=e.data,i=t.messageId,n=c[i];if(!n)throw Error("WorkerModule response with empty or unknown messageId");delete c[i],n(t)}}return t})(e).postMessage({messageId:o,action:t,data:i})})}},16586:function(e,t,i){i.d(t,{T:function(){return h}});var n=i(26398),a=i(15627),r=i(42089),s=i(25610),o=i(19938),l=i(97458),h=(0,n.G)(function(e,t){let i=(0,a.mq)("Kbd",e),{className:n,...h}=(0,r.Lr)(e);return(0,l.jsx)(s.m.kbd,{ref:t,className:(0,o.cx)("chakra-kbd",n),...h,__css:{fontFamily:"mono",...i}})});h.displayName="Kbd"},84760:function(e,t,i){i.d(t,{U2:function(){return E},I2:function(){return T},xW:function(){return P},ug:function(){return D}});var n=i(43146),a=i(94970),r=i(59201),s=i(79206),o=i(3431),l=i(36938),h=i(16227),c=i(94086),u=i(52983),d=i(2377),f=i(96248),p=i(26398),m=i(15627),v=i(42089),g=i(61112),b=i(25610),y=i(97458),[x,_]=(0,f.k)({name:"SliderContext",errorMessage:"useSliderContext: `context` is undefined. Seems you forgot to wrap all slider components within <RangeSlider />"}),[w,S]=(0,f.k)({name:"RangeSliderStylesContext",errorMessage:"useRangeSliderStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<RangeSlider />\" "}),E=(0,p.G)(function(e,t){let i={orientation:"horizontal",...e},f=(0,m.jC)("Slider",i),p=(0,v.Lr)(i),{direction:_}=(0,g.F)();p.direction=_;let{getRootProps:S,...E}=function(e){var t;let{min:i=0,max:f=100,onChange:p,value:m,defaultValue:v,isReversed:g,direction:b="ltr",orientation:y="horizontal",id:x,isDisabled:_,isReadOnly:w,onChangeStart:S,onChangeEnd:E,step:P=1,getAriaValueText:D,"aria-valuetext":T,"aria-label":M,"aria-labelledby":L,name:R,focusThumbOnChange:A=!0,minStepsBetweenThumbs:k=0,...O}=e,C=(0,o.W)(S),j=(0,o.W)(E),z=(0,o.W)(D),U=(0,a.XY)({isReversed:g,direction:b,orientation:y}),[I,B]=(0,s.T)({value:m,defaultValue:null!=v?v:[25,75],onChange:p});if(!Array.isArray(I))throw TypeError(`[range-slider] You passed an invalid value for \`value\` or \`defaultValue\`, expected \`Array\` but got \`${typeof I}\``);let[F,N]=(0,u.useState)(!1),[W,G]=(0,u.useState)(!1),[H,$]=(0,u.useState)(-1),q=!(_||w),Y=(0,u.useRef)(I),V=I.map(e=>(0,c.HU)(e,i,f)),K=(t=k*P,V.map((e,n)=>({min:0===n?i:V[n-1]+t,max:n===V.length-1?f:V[n+1]-t}))),Z=(0,u.useRef)({eventSource:null,value:[],valueBounds:[]});Z.current.value=V,Z.current.valueBounds=K;let X=V.map(e=>f-e+i),Q=(U?X:V).map(e=>(0,c.Rg)(e,i,f)),J="vertical"===y,ee=(0,u.useRef)(null),et=(0,u.useRef)(null),ei=(0,d.M)({getNodes(){let e=et.current,t=null==e?void 0:e.querySelectorAll("[role=slider]");return t?Array.from(t):[]}}),en=(0,u.useId)(),ea=(0,a.s3)(null!=x?x:en),er=(0,u.useCallback)(e=>{var t,n;if(!ee.current)return;Z.current.eventSource="pointer";let a=ee.current.getBoundingClientRect(),{clientX:r,clientY:s}=null!=(n=null==(t=e.touches)?void 0:t[0])?n:e,o=(J?a.bottom-s:r-a.left)/(J?a.height:a.width);return U&&(o=1-o),(0,c.WS)(o,i,f)},[J,U,f,i]),es=(f-i)/10,eo=P||(f-i)/100,el=(0,u.useMemo)(()=>({setValueAtIndex(e,t){if(!q)return;let i=Z.current.valueBounds[e];t=parseFloat((0,c.WP)(t,i.min,eo)),t=(0,c.HU)(t,i.min,i.max);let n=[...Z.current.value];n[e]=t,B(n)},setActiveIndex:$,stepUp(e,t=eo){let i=Z.current.value[e],n=U?i-t:i+t;el.setValueAtIndex(e,n)},stepDown(e,t=eo){let i=Z.current.value[e],n=U?i+t:i-t;el.setValueAtIndex(e,n)},reset(){B(Y.current)}}),[eo,U,B,q]),eh=(0,u.useCallback)(e=>{let t={ArrowRight:()=>el.stepUp(H),ArrowUp:()=>el.stepUp(H),ArrowLeft:()=>el.stepDown(H),ArrowDown:()=>el.stepDown(H),PageUp:()=>el.stepUp(H,es),PageDown:()=>el.stepDown(H,es),Home:()=>{let{min:e}=K[H];el.setValueAtIndex(H,e)},End:()=>{let{max:e}=K[H];el.setValueAtIndex(H,e)}}[e.key];t&&(e.preventDefault(),e.stopPropagation(),t(e),Z.current.eventSource="keyboard")},[el,H,es,K]),{getThumbStyle:ec,rootStyle:eu,trackStyle:ed,innerTrackStyle:ef}=(0,u.useMemo)(()=>(0,a.Wi)({isReversed:U,orientation:y,thumbRects:ei,thumbPercents:Q}),[U,y,Q,ei]),ep=(0,u.useCallback)(e=>{var t;let i=null!=e?e:H;if(-1!==i&&A){let e=ea.getThumb(i),n=null==(t=et.current)?void 0:t.ownerDocument.getElementById(e);n&&setTimeout(()=>n.focus())}},[A,H,ea]);(0,l.r)(()=>{"keyboard"===Z.current.eventSource&&(null==j||j(Z.current.value))},[V,j]);let em=e=>{let t=er(e)||0,i=Z.current.value.map(e=>Math.abs(e-t)),n=Math.min(...i),a=i.indexOf(n),r=i.filter(e=>e===n);r.length>1&&t>Z.current.value[a]&&(a=a+r.length-1),$(a),el.setValueAtIndex(a,t),ep(a)},ev=e=>{if(-1==H)return;let t=er(e)||0;$(H),el.setValueAtIndex(H,t),ep(H)};(0,r.O)(et,{onPanSessionStart(e){q&&(N(!0),em(e),null==C||C(Z.current.value))},onPanSessionEnd(){q&&(N(!1),null==j||j(Z.current.value))},onPan(e){q&&ev(e)}});let eg=(0,u.useCallback)((e={},t=null)=>({...e,...O,id:ea.root,ref:(0,h.lq)(t,et),tabIndex:-1,"aria-disabled":(0,n.Qm)(_),"data-focused":(0,n.PB)(W),style:{...e.style,...eu}}),[O,_,W,eu,ea]),eb=(0,u.useCallback)((e={},t=null)=>({...e,ref:(0,h.lq)(t,ee),id:ea.track,"data-disabled":(0,n.PB)(_),style:{...e.style,...ed}}),[_,ed,ea]),ey=(0,u.useCallback)((e={},t=null)=>({...e,ref:t,id:ea.innerTrack,style:{...e.style,...ef}}),[ef,ea]),ex=(0,u.useCallback)((e,t=null)=>{var i;let{index:a,...r}=e,s=V[a];if(null==s)throw TypeError(`[range-slider > thumb] Cannot find value at index \`${a}\`. The \`value\` or \`defaultValue\` length is : ${V.length}`);let o=K[a];return{...r,ref:t,role:"slider",tabIndex:q?0:void 0,id:ea.getThumb(a),"data-active":(0,n.PB)(F&&H===a),"aria-valuetext":null!=(i=null==z?void 0:z(s))?i:null==T?void 0:T[a],"aria-valuemin":o.min,"aria-valuemax":o.max,"aria-valuenow":s,"aria-orientation":y,"aria-disabled":(0,n.Qm)(_),"aria-readonly":(0,n.Qm)(w),"aria-label":null==M?void 0:M[a],"aria-labelledby":(null==M?void 0:M[a])?void 0:null==L?void 0:L[a],style:{...e.style,...ec(a)},onKeyDown:(0,n.v0)(e.onKeyDown,eh),onFocus:(0,n.v0)(e.onFocus,()=>{G(!0),$(a)}),onBlur:(0,n.v0)(e.onBlur,()=>{G(!1),$(-1)})}},[ea,V,K,q,F,H,z,T,y,_,w,M,L,ec,eh,G]),e_=(0,u.useCallback)((e={},t=null)=>({...e,ref:t,id:ea.output,htmlFor:V.map((e,t)=>ea.getThumb(t)).join(" "),"aria-live":"off"}),[ea,V]),ew=(0,u.useCallback)((e,t=null)=>{let{value:r,...s}=e,o=!(r<i||r>f),l=r>=V[0]&&r<=V[V.length-1],h=(0,c.Rg)(r,i,f);h=U?100-h:h;let u={position:"absolute",pointerEvents:"none",...(0,a.fL)({orientation:y,vertical:{bottom:`${h}%`},horizontal:{left:`${h}%`}})};return{...s,ref:t,id:ea.getMarker(e.value),role:"presentation","aria-hidden":!0,"data-disabled":(0,n.PB)(_),"data-invalid":(0,n.PB)(!o),"data-highlighted":(0,n.PB)(l),style:{...e.style,...u}}},[_,U,f,i,y,V,ea]),eS=(0,u.useCallback)((e,t=null)=>{let{index:i,...n}=e;return{...n,ref:t,id:ea.getInput(i),type:"hidden",value:V[i],name:Array.isArray(R)?R[i]:`${R}-${i}`}},[R,V,ea]);return{state:{value:V,isFocused:W,isDragging:F,getThumbPercent:e=>Q[e],getThumbMinValue:e=>K[e].min,getThumbMaxValue:e=>K[e].max},actions:el,getRootProps:eg,getTrackProps:eb,getInnerTrackProps:ey,getThumbProps:ex,getMarkerProps:ew,getInputProps:eS,getOutputProps:e_}}(p),P=(0,u.useMemo)(()=>({...E,name:i.name}),[E,i.name]);return(0,y.jsx)(x,{value:P,children:(0,y.jsx)(w,{value:f,children:(0,y.jsx)(b.m.div,{...S({},t),className:"chakra-slider",__css:f.container,children:i.children})})})});E.displayName="RangeSlider";var P=(0,p.G)(function(e,t){let{getThumbProps:i,getInputProps:a,name:r}=_(),s=S(),o=i(e,t);return(0,y.jsxs)(b.m.div,{...o,className:(0,n.cx)("chakra-slider__thumb",e.className),__css:s.thumb,children:[o.children,r&&(0,y.jsx)("input",{...a({index:e.index})})]})});P.displayName="RangeSliderThumb";var D=(0,p.G)(function(e,t){let{getTrackProps:i}=_(),a=S(),r=i(e,t);return(0,y.jsx)(b.m.div,{...r,className:(0,n.cx)("chakra-slider__track",e.className),__css:a.track,"data-testid":"chakra-range-slider-track"})});D.displayName="RangeSliderTrack";var T=(0,p.G)(function(e,t){let{getInnerTrackProps:i}=_(),n=S(),a=i(e,t);return(0,y.jsx)(b.m.div,{...a,className:"chakra-slider__filled-track",__css:n.filledTrack})});T.displayName="RangeSliderFilledTrack",(0,p.G)(function(e,t){let{getMarkerProps:i}=_(),a=S(),r=i(e,t);return(0,y.jsx)(b.m.div,{...r,className:(0,n.cx)("chakra-slider__marker",e.className),__css:a.mark})}).displayName="RangeSliderMark"},21370:function(e,t){t.Z=function(){return function(e){var t,i,n,a,r={R:"13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",EN:"1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",ES:"17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",ET:"z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",AN:"16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",CS:"18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",B:"a,3,f+2,2v,690",S:"9,2,k",WS:"c,k,4f4,1vk+a,u,1j,335",ON:"x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",BN:"0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",NSM:"lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",AL:"16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",LRO:"6ct",RLO:"6cu",LRE:"6cq",RLE:"6cr",PDF:"6cs",LRI:"6ee",RLI:"6ef",FSI:"6eg",PDI:"6eh"},s={},o={};s.L=1,o[1]="L",Object.keys(r).forEach(function(e,t){s[e]=1<<t+1,o[s[e]]=e}),Object.freeze(s);var l=s.LRI|s.RLI|s.FSI,h=s.L|s.R|s.AL,c=s.B|s.S|s.WS|s.ON|s.FSI|s.LRI|s.RLI|s.PDI,u=s.BN|s.RLE|s.LRE|s.RLO|s.LRO|s.PDF,d=s.S|s.WS|s.B|l|s.PDI|u,f=null;function p(e){return!function(){if(!f){f=new Map;var e=function(e){if(r.hasOwnProperty(e)){var t=0;r[e].split(",").forEach(function(i){var n=i.split("+"),a=n[0],r=n[1];a=parseInt(a,36),r=r?parseInt(r,36):0,f.set(t+=a,s[e]);for(var o=0;o<r;o++)f.set(++t,s[e])})}};for(var t in r)e(t)}}(),f.get(e.codePointAt(0))||s.L}var m={pairs:"14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",canonical:"6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"};function v(e,t){var i,n=0,a=new Map,r=t&&new Map;return e.split(",").forEach(function e(s){if(-1!==s.indexOf("+"))for(var o=+s;o--;)e(i);else{i=s;var l=s.split(">"),h=l[0],c=l[1];h=String.fromCodePoint(n+=parseInt(h,36)),c=String.fromCodePoint(n+=parseInt(c,36)),a.set(h,c),t&&r.set(c,h)}}),{map:a,reverseMap:r}}function g(){if(!t){var e=v(m.pairs,!0),a=e.map,r=e.reverseMap;t=a,i=r,n=v(m.canonical,!1).map}}function b(e){return g(),t.get(e)||null}function y(e){return g(),i.get(e)||null}function x(e){return g(),n.get(e)||null}var _=s.L,w=s.R,S=s.EN,E=s.ES,P=s.ET,D=s.AN,T=s.CS,M=s.B,L=s.S,R=s.ON,A=s.BN,k=s.NSM,O=s.AL,C=s.LRO,j=s.RLO,z=s.LRE,U=s.RLE,I=s.PDF,B=s.LRI,F=s.RLI,N=s.FSI,W=s.PDI;function G(e){return!function(){if(!a){var e=v("14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",!0),t=e.map;e.reverseMap.forEach(function(e,i){t.set(i,e)}),a=t}}(),a.get(e)||null}function H(e,t,i,n){var a=e.length;i=Math.max(0,null==i?0:+i),n=Math.min(a-1,null==n?a-1:+n);var r=[];return t.paragraphs.forEach(function(a){var s=Math.max(i,a.start),o=Math.min(n,a.end);if(s<o){for(var l=t.levels.slice(s,o+1),h=o;h>=s&&p(e[h])&d;h--)l[h]=a.level;for(var c=a.level,u=1/0,f=0;f<l.length;f++){var m=l[f];m>c&&(c=m),m<u&&(u=1|m)}for(var v=c;v>=u;v--)for(var g=0;g<l.length;g++)if(l[g]>=v){for(var b=g;g+1<l.length&&l[g+1]>=v;)g++;g>b&&r.push([b+s,g+s])}}}),r}function $(e,t,i,n){for(var a=H(e,t,i,n),r=[],s=0;s<e.length;s++)r[s]=s;return a.forEach(function(e){for(var t=e[0],i=e[1],n=r.slice(t,i+1),a=n.length;a--;)r[i-a]=n[a]}),r}return e.closingToOpeningBracket=y,e.getBidiCharType=p,e.getBidiCharTypeName=function(e){return o[p(e)]},e.getCanonicalBracket=x,e.getEmbeddingLevels=function(e,t){for(var i=new Uint32Array(e.length),n=0;n<e.length;n++)i[n]=p(e[n]);var a=new Map;function r(e,t){var n=i[e];i[e]=t,a.set(n,a.get(n)-1),n&c&&a.set(c,a.get(c)-1),a.set(t,(a.get(t)||0)+1),t&c&&a.set(c,(a.get(c)||0)+1)}for(var s=new Uint8Array(e.length),o=new Map,f=[],m=null,v=0;v<e.length;v++)m||f.push(m={start:v,end:e.length-1,level:"rtl"===t?1:"ltr"===t?0:tR(v,!1)}),i[v]&M&&(m.end=v,m=null);for(var g=U|z|j|C|l|W|I|M,G=function(e){return e+(1&e?1:2)},H=function(e){return e+(1&e?2:1)},$=0;$<f.length;$++){var q=[{_level:(m=f[$]).level,_override:0,_isolate:0}],Y=void 0,V=0,K=0,Z=0;a.clear();for(var X=m.start;X<=m.end;X++){var Q=i[X];if(Y=q[q.length-1],a.set(Q,(a.get(Q)||0)+1),Q&c&&a.set(c,(a.get(c)||0)+1),Q&g){if(Q&(U|z)){s[X]=Y._level;var J=(Q===U?H:G)(Y._level);!(J<=125)||V||K?!V&&K++:q.push({_level:J,_override:0,_isolate:0})}else if(Q&(j|C)){s[X]=Y._level;var ee=(Q===j?H:G)(Y._level);!(ee<=125)||V||K?!V&&K++:q.push({_level:ee,_override:Q&j?w:_,_isolate:0})}else if(Q&l){Q&N&&(Q=1===tR(X+1,!0)?F:B),s[X]=Y._level,Y._override&&r(X,Y._override);var et=(Q===F?H:G)(Y._level);et<=125&&0===V&&0===K?(Z++,q.push({_level:et,_override:0,_isolate:1,_isolInitIndex:X})):V++}else if(Q&W){if(V>0)V--;else if(Z>0){for(K=0;!q[q.length-1]._isolate;)q.pop();var ei=q[q.length-1]._isolInitIndex;null!=ei&&(o.set(ei,X),o.set(X,ei)),q.pop(),Z--}Y=q[q.length-1],s[X]=Y._level,Y._override&&r(X,Y._override)}else Q&I?(0===V&&(K>0?K--:!Y._isolate&&q.length>1&&(q.pop(),Y=q[q.length-1])),s[X]=Y._level):Q&M&&(s[X]=m.level)}else s[X]=Y._level,Y._override&&Q!==A&&r(X,Y._override)}for(var en=[],ea=null,er=m.start;er<=m.end;er++){var es=i[er];if(!(es&u)){var eo=s[er],el=es&l,eh=es===W;ea&&eo===ea._level?(ea._end=er,ea._endsWithIsolInit=el):en.push(ea={_start:er,_end:er,_level:eo,_startsWithPDI:eh,_endsWithIsolInit:el})}}for(var ec=[],eu=0;eu<en.length;eu++){var ed=en[eu];if(!ed._startsWithPDI||ed._startsWithPDI&&!o.has(ed._start)){for(var ef=[ea=ed],ep=void 0;ea&&ea._endsWithIsolInit&&null!=(ep=o.get(ea._end));)for(var em=eu+1;em<en.length;em++)if(en[em]._start===ep){ef.push(ea=en[em]);break}for(var ev=[],eg=0;eg<ef.length;eg++)for(var eb=ef[eg],ey=eb._start;ey<=eb._end;ey++)ev.push(ey);for(var ex=s[ev[0]],e_=m.level,ew=ev[0]-1;ew>=0;ew--)if(!(i[ew]&u)){e_=s[ew];break}var eS=ev[ev.length-1],eE=s[eS],eP=m.level;if(!(i[eS]&l)){for(var eD=eS+1;eD<=m.end;eD++)if(!(i[eD]&u)){eP=s[eD];break}}ec.push({_seqIndices:ev,_sosType:Math.max(e_,ex)%2?w:_,_eosType:Math.max(eP,eE)%2?w:_})}}for(var eT=0;eT<ec.length;eT++){var eM=ec[eT],eL=eM._seqIndices,eR=eM._sosType,eA=eM._eosType,ek=1&s[eL[0]]?w:_;if(a.get(k))for(var eO=0;eO<eL.length;eO++){var eC=eL[eO];if(i[eC]&k){for(var ej=eR,ez=eO-1;ez>=0;ez--)if(!(i[eL[ez]]&u)){ej=i[eL[ez]];break}r(eC,ej&(l|W)?R:ej)}}if(a.get(S))for(var eU=0;eU<eL.length;eU++){var eI=eL[eU];if(i[eI]&S)for(var eB=eU-1;eB>=-1;eB--){var eF=-1===eB?eR:i[eL[eB]];if(eF&h){eF===O&&r(eI,D);break}}}if(a.get(O))for(var eN=0;eN<eL.length;eN++){var eW=eL[eN];i[eW]&O&&r(eW,w)}if(a.get(E)||a.get(T))for(var eG=1;eG<eL.length-1;eG++){var eH=eL[eG];if(i[eH]&(E|T)){for(var e$=0,eq=0,eY=eG-1;eY>=0&&(e$=i[eL[eY]])&u;eY--);for(var eV=eG+1;eV<eL.length&&(eq=i[eL[eV]])&u;eV++);e$===eq&&(i[eH]===E?e$===S:e$&(S|D))&&r(eH,e$)}}if(a.get(S)){for(var eK=0;eK<eL.length;eK++)if(i[eL[eK]]&S){for(var eZ=eK-1;eZ>=0&&i[eL[eZ]]&(P|u);eZ--)r(eL[eZ],S);for(eK++;eK<eL.length&&i[eL[eK]]&(P|u|S);eK++)i[eL[eK]]!==S&&r(eL[eK],S)}}if(a.get(P)||a.get(E)||a.get(T))for(var eX=0;eX<eL.length;eX++){var eQ=eL[eX];if(i[eQ]&(P|E|T)){r(eQ,R);for(var eJ=eX-1;eJ>=0&&i[eL[eJ]]&u;eJ--)r(eL[eJ],R);for(var e0=eX+1;e0<eL.length&&i[eL[e0]]&u;e0++)r(eL[e0],R)}}if(a.get(S))for(var e1=0,e2=eR;e1<eL.length;e1++){var e4=eL[e1],e3=i[e4];e3&S?e2===_&&r(e4,_):e3&h&&(e2=e3)}if(a.get(c)){for(var e5=w|S|D,e6=e5|_,e8=[],e7=[],e9=0;e9<eL.length;e9++)if(i[eL[e9]]&c){var te=e[eL[e9]],tt=void 0;if(null!==b(te)){if(e7.length<63)e7.push({char:te,seqIndex:e9});else break}else if(null!==(tt=y(te)))for(var ti=e7.length-1;ti>=0;ti--){var tn=e7[ti].char;if(tn===tt||tn===y(x(te))||b(x(tn))===te){e8.push([e7[ti].seqIndex,e9]),e7.length=ti;break}}}e8.sort(function(e,t){return e[0]-t[0]});for(var ta=0;ta<e8.length;ta++){for(var tr=e8[ta],ts=tr[0],to=tr[1],tl=!1,th=0,tc=ts+1;tc<to;tc++){var tu=eL[tc];if(i[tu]&e6){tl=!0;var td=i[tu]&e5?w:_;if(td===ek){th=td;break}}}if(tl&&!th){th=eR;for(var tf=ts-1;tf>=0;tf--){var tp=eL[tf];if(i[tp]&e6){var tm=i[tp]&e5?w:_;th=tm!==ek?tm:ek;break}}}if(th){if(i[eL[ts]]=i[eL[to]]=th,th!==ek){for(var tv=ts+1;tv<eL.length;tv++)if(!(i[eL[tv]]&u)){p(e[eL[tv]])&k&&(i[eL[tv]]=th);break}}if(th!==ek){for(var tg=to+1;tg<eL.length;tg++)if(!(i[eL[tg]]&u)){p(e[eL[tg]])&k&&(i[eL[tg]]=th);break}}}}for(var tb=0;tb<eL.length;tb++)if(i[eL[tb]]&c){for(var ty=tb,tx=tb,t_=eR,tw=tb-1;tw>=0;tw--)if(i[eL[tw]]&u)ty=tw;else{t_=i[eL[tw]]&e5?w:_;break}for(var tS=eA,tE=tb+1;tE<eL.length;tE++)if(i[eL[tE]]&(c|u))tx=tE;else{tS=i[eL[tE]]&e5?w:_;break}for(var tP=ty;tP<=tx;tP++)i[eL[tP]]=t_===tS?t_:ek;tb=tx}}}for(var tD=m.start;tD<=m.end;tD++){var tT=s[tD],tM=i[tD];if(1&tT?tM&(_|S|D)&&s[tD]++:tM&w?s[tD]++:tM&(D|S)&&(s[tD]+=2),tM&u&&(s[tD]=0===tD?m.level:s[tD-1]),tD===m.end||p(e[tD])&(L|M))for(var tL=tD;tL>=0&&p(e[tL])&d;tL--)s[tL]=m.level}}return{levels:s,paragraphs:f};function tR(t,n){for(var a=t;a<e.length;a++){var r=i[a];if(r&(w|O))return 1;if(r&(M|_)||n&&r===W)break;if(r&l){var s=function(t){for(var n=1,a=t+1;a<e.length;a++){var r=i[a];if(r&M)break;if(r&W){if(0==--n)return a}else r&l&&n++}return -1}(a);a=-1===s?e.length:s}}return 0}},e.getMirroredCharacter=G,e.getMirroredCharactersMap=function(e,t,i,n){var a=e.length;i=Math.max(0,null==i?0:+i),n=Math.min(a-1,null==n?a-1:+n);for(var r=new Map,s=i;s<=n;s++)if(1&t[s]){var o=G(e[s]);null!==o&&r.set(s,o)}return r},e.getReorderSegments=H,e.getReorderedIndices=$,e.getReorderedString=function(e,t,i,n){var a=$(e,t,i,n),r=[].concat(e);return a.forEach(function(i,n){r[n]=(1&t.levels[i]?G(e[i]):null)||e[i]}),r.join("")},e.openingToClosingBracket=b,Object.defineProperty(e,"__esModule",{value:!0}),e}({})}},45493:function(e,t,i){i.d(t,{in:function(){return f},m8:function(){return Y}});var n=i(9375);function a(e,t,i,a,r,s,o,l){let h=(e,t,i,a)=>[new n.FM8(e/o,1-a/l),new n.FM8(i/o,1-a/l),new n.FM8(i/o,1-t/l),new n.FM8(e/o,1-t/l)],c=h(t+s,i,t+a+s,i+s),u=h(t+a+s,i,t+2*a+s,i+s),d=h(t,i+s,t+s,i+s+r),f=h(t+s,i+s,t+a+s,i+s+r),p=h(t+a+s,i+s,t+a+2*s,i+r+s),m=h(t+a+2*s,i+s,t+2*a+2*s,i+r+s),v=e.attributes.uv,g=[p[3],p[2],p[0],p[1]],b=[d[3],d[2],d[0],d[1]],y=[c[3],c[2],c[0],c[1]],x=[u[0],u[1],u[3],u[2]],_=[f[3],f[2],f[0],f[1]],w=[m[3],m[2],m[0],m[1]],S=[];for(let e of[g,b,y,x,_,w])for(let t of e)S.push(t.x,t.y);v.set(new Float32Array(S)),v.needsUpdate=!0}function r(e,t,i,n,r,s){a(e,t,i,n,r,s,64,64)}function s(e,t,i,n,r,s){a(e,t,i,n,r,s,64,32)}class o extends n.ZAu{constructor(e,t){super(),Object.defineProperty(this,"innerLayer",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"outerLayer",{enumerable:!0,configurable:!0,writable:!0,value:t}),e.name="inner",t.name="outer"}}class l extends n.ZAu{constructor(){super(),Object.defineProperty(this,"head",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"body",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"rightArm",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"leftArm",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"rightLeg",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"leftLeg",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"modelListeners",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"slim",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"_map",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"layer1Material",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"layer1MaterialBiased",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"layer2Material",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"layer2MaterialBiased",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.layer1Material=new n.Wid({side:n.Wl3}),this.layer2Material=new n.Wid({side:n.ehD,transparent:!0,alphaTest:1e-5}),this.layer1MaterialBiased=this.layer1Material.clone(),this.layer1MaterialBiased.polygonOffset=!0,this.layer1MaterialBiased.polygonOffsetFactor=1,this.layer1MaterialBiased.polygonOffsetUnits=1,this.layer2MaterialBiased=this.layer2Material.clone(),this.layer2MaterialBiased.polygonOffset=!0,this.layer2MaterialBiased.polygonOffsetFactor=1,this.layer2MaterialBiased.polygonOffsetUnits=1;let e=new n.DvJ(8,8,8);r(e,0,0,8,8,8);let t=new n.Kj0(e,this.layer1Material),i=new n.DvJ(9,9,9);r(i,32,0,8,8,8);let a=new n.Kj0(i,this.layer2Material);this.head=new o(t,a),this.head.name="head",this.head.add(t,a),t.position.y=4,a.position.y=4,this.add(this.head);let s=new n.DvJ(8,12,4);r(s,16,16,8,12,4);let l=new n.Kj0(s,this.layer1Material),h=new n.DvJ(8.5,12.5,4.5);r(h,16,32,8,12,4);let c=new n.Kj0(h,this.layer2Material);this.body=new o(l,c),this.body.name="body",this.body.add(l,c),this.body.position.y=-6,this.add(this.body);let u=new n.DvJ,d=new n.Kj0(u,this.layer1MaterialBiased);this.modelListeners.push(()=>{d.scale.x=this.slim?3:4,d.scale.y=12,d.scale.z=4,r(u,40,16,this.slim?3:4,12,4)});let f=new n.DvJ,p=new n.Kj0(f,this.layer2MaterialBiased);this.modelListeners.push(()=>{p.scale.x=this.slim?3.5:4.5,p.scale.y=12.5,p.scale.z=4.5,r(f,40,32,this.slim?3:4,12,4)});let m=new n.ZAu;m.add(d,p),this.modelListeners.push(()=>{m.position.x=this.slim?-.5:-1}),m.position.y=-4,this.rightArm=new o(d,p),this.rightArm.name="rightArm",this.rightArm.add(m),this.rightArm.position.x=-5,this.rightArm.position.y=-2,this.add(this.rightArm);let v=new n.DvJ,g=new n.Kj0(v,this.layer1MaterialBiased);this.modelListeners.push(()=>{g.scale.x=this.slim?3:4,g.scale.y=12,g.scale.z=4,r(v,32,48,this.slim?3:4,12,4)});let b=new n.DvJ,y=new n.Kj0(b,this.layer2MaterialBiased);this.modelListeners.push(()=>{y.scale.x=this.slim?3.5:4.5,y.scale.y=12.5,y.scale.z=4.5,r(b,48,48,this.slim?3:4,12,4)});let x=new n.ZAu;x.add(g,y),this.modelListeners.push(()=>{x.position.x=this.slim?.5:1}),x.position.y=-4,this.leftArm=new o(g,y),this.leftArm.name="leftArm",this.leftArm.add(x),this.leftArm.position.x=5,this.leftArm.position.y=-2,this.add(this.leftArm);let _=new n.DvJ(4,12,4);r(_,0,16,4,12,4);let w=new n.Kj0(_,this.layer1MaterialBiased),S=new n.DvJ(4.5,12.5,4.5);r(S,0,32,4,12,4);let E=new n.Kj0(S,this.layer2MaterialBiased),P=new n.ZAu;P.add(w,E),P.position.y=-6,this.rightLeg=new o(w,E),this.rightLeg.name="rightLeg",this.rightLeg.add(P),this.rightLeg.position.x=-1.9,this.rightLeg.position.y=-12,this.rightLeg.position.z=-.1,this.add(this.rightLeg);let D=new n.DvJ(4,12,4);r(D,16,48,4,12,4);let T=new n.Kj0(D,this.layer1MaterialBiased),M=new n.DvJ(4.5,12.5,4.5);r(M,0,48,4,12,4);let L=new n.Kj0(M,this.layer2MaterialBiased),R=new n.ZAu;R.add(T,L),R.position.y=-6,this.leftLeg=new o(T,L),this.leftLeg.name="leftLeg",this.leftLeg.add(R),this.leftLeg.position.x=1.9,this.leftLeg.position.y=-12,this.leftLeg.position.z=-.1,this.add(this.leftLeg),this.modelType="default"}get map(){return this._map}set map(e){this._map=e,this.layer1Material.map=e,this.layer1Material.needsUpdate=!0,this.layer1MaterialBiased.map=e,this.layer1MaterialBiased.needsUpdate=!0,this.layer2Material.map=e,this.layer2Material.needsUpdate=!0,this.layer2MaterialBiased.map=e,this.layer2MaterialBiased.needsUpdate=!0}get modelType(){return this.slim?"slim":"default"}set modelType(e){this.slim="slim"===e,this.modelListeners.forEach(e=>e())}getBodyParts(){return this.children.filter(e=>e instanceof o)}setInnerLayerVisible(e){this.getBodyParts().forEach(t=>t.innerLayer.visible=e)}setOuterLayerVisible(e){this.getBodyParts().forEach(t=>t.outerLayer.visible=e)}resetJoints(){this.head.rotation.set(0,0,0),this.leftArm.rotation.set(0,0,0),this.rightArm.rotation.set(0,0,0),this.leftLeg.rotation.set(0,0,0),this.rightLeg.rotation.set(0,0,0),this.body.rotation.set(0,0,0),this.head.position.y=0,this.body.position.y=-6,this.body.position.z=0,this.rightArm.position.x=-5,this.rightArm.position.y=-2,this.rightArm.position.z=0,this.leftArm.position.x=5,this.leftArm.position.y=-2,this.leftArm.position.z=0,this.rightLeg.position.x=-1.9,this.rightLeg.position.y=-12,this.rightLeg.position.z=-.1,this.leftLeg.position.x=1.9,this.leftLeg.position.y=-12,this.leftLeg.position.z=-.1}}class h extends n.ZAu{constructor(){super(),Object.defineProperty(this,"cape",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"material",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.material=new n.Wid({side:n.ehD,transparent:!0,alphaTest:1e-5});let e=new n.DvJ(10,16,1);s(e,0,0,10,16,1),this.cape=new n.Kj0(e,this.material),this.cape.position.y=-8,this.cape.position.z=.5,this.add(this.cape)}get map(){return this.material.map}set map(e){this.material.map=e,this.material.needsUpdate=!0}}class c extends n.ZAu{constructor(){super(),Object.defineProperty(this,"leftWing",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"rightWing",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"material",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.material=new n.Wid({side:n.ehD,transparent:!0,alphaTest:1e-5});let e=new n.DvJ(12,22,4);s(e,22,0,10,20,2);let t=new n.Kj0(e,this.material);t.position.x=-5,t.position.y=-10,t.position.z=-1,this.leftWing=new n.ZAu,this.leftWing.add(t),this.add(this.leftWing);let i=new n.DvJ(12,22,4);s(i,22,0,10,20,2);let a=new n.Kj0(i,this.material);a.scale.x=-1,a.position.x=5,a.position.y=-10,a.position.z=-1,this.rightWing=new n.ZAu,this.rightWing.add(a),this.add(this.rightWing),this.leftWing.position.x=5,this.leftWing.rotation.x=.2617994,this.resetJoints()}resetJoints(){this.leftWing.rotation.y=.01,this.leftWing.rotation.z=.2617994,this.updateRightWing()}updateRightWing(){this.rightWing.position.x=-this.leftWing.position.x,this.rightWing.position.y=this.leftWing.position.y,this.rightWing.rotation.x=this.leftWing.rotation.x,this.rightWing.rotation.y=-this.leftWing.rotation.y,this.rightWing.rotation.z=-this.leftWing.rotation.z}get map(){return this.material.map}set map(e){this.material.map=e,this.material.needsUpdate=!0}}class u extends n.ZAu{constructor(){super(),Object.defineProperty(this,"rightEar",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"leftEar",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"material",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.material=new n.Wid({side:n.Wl3});let e=new n.DvJ(8,8,4/3);a(e,0,0,6,6,1,14,7),this.rightEar=new n.Kj0(e,this.material),this.rightEar.name="rightEar",this.rightEar.position.x=-6,this.add(this.rightEar),this.leftEar=new n.Kj0(e,this.material),this.leftEar.name="leftEar",this.leftEar.position.x=6,this.add(this.leftEar)}get map(){return this.material.map}set map(e){this.material.map=e,this.material.needsUpdate=!0}}let d=10.8*Math.PI/180;class f extends n.ZAu{constructor(){super(),Object.defineProperty(this,"skin",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"cape",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"elytra",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"ears",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.skin=new l,this.skin.name="skin",this.skin.position.y=8,this.add(this.skin),this.cape=new h,this.cape.name="cape",this.cape.position.y=8,this.cape.position.z=-2,this.cape.rotation.x=d,this.cape.rotation.y=Math.PI,this.add(this.cape),this.elytra=new c,this.elytra.name="elytra",this.elytra.position.y=8,this.elytra.position.z=-2,this.elytra.visible=!1,this.add(this.elytra),this.ears=new u,this.ears.name="ears",this.ears.position.y=10,this.ears.position.z=2/3,this.ears.visible=!1,this.skin.head.add(this.ears)}get backEquipment(){return this.cape.visible?"cape":this.elytra.visible?"elytra":null}set backEquipment(e){this.cape.visible="cape"===e,this.elytra.visible="elytra"===e}resetJoints(){this.skin.resetJoints(),this.cape.rotation.x=d,this.cape.position.y=8,this.cape.position.z=-2,this.elytra.position.y=8,this.elytra.position.z=-2,this.elytra.rotation.x=0,this.elytra.resetJoints()}}function p(e){return e instanceof HTMLImageElement||e instanceof HTMLVideoElement||e instanceof HTMLCanvasElement||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas}function m(e,t,i,n,a){let r=e.getImageData(t,i,n,a);for(let e=0;e<n;e++)for(let t=0;t<a;t++){let i=(e+t*n)*4;if(255!==r.data[i+3])return!0}return!1}function v(e,t,i){if(i){if(m(e,0,0,t,t))return}else if(m(e,0,0,t,t/2))return;let n=t/64,a=(t,i,a,r)=>e.clearRect(t*n,i*n,a*n,r*n);a(40,0,8,8),a(48,0,8,8),a(32,8,8,8),a(40,8,8,8),a(48,8,8,8),a(56,8,8,8),i&&(a(4,32,4,4),a(8,32,4,4),a(0,36,4,12),a(4,36,4,12),a(8,36,4,12),a(12,36,4,12),a(20,32,8,4),a(28,32,8,4),a(16,36,4,12),a(20,36,8,12),a(28,36,4,12),a(32,36,8,12),a(44,32,4,4),a(48,32,4,4),a(40,36,4,12),a(44,36,4,12),a(48,36,4,12),a(52,36,12,12),a(4,48,4,4),a(8,48,4,4),a(0,52,4,12),a(4,52,4,12),a(8,52,4,12),a(12,52,4,12),a(52,48,4,4),a(56,48,4,4),a(48,52,4,12),a(52,52,4,12),a(56,52,4,12),a(60,52,4,12))}function g(e,t){if(t.width!==t.height&&t.width!==2*t.height)throw Error(`Bad skin size: ${t.width}x${t.height}`);let i=t.width/64,n=14*i,a=7*i;e.width=n,e.height=a;let r=e.getContext("2d",{willReadFrequently:!0});r.clearRect(0,0,n,a),r.drawImage(t,24*i,0,n,a,0,0,n,a)}async function b(e){let t=document.createElement("img");return new Promise((i,n)=>{t.onload=()=>i(t),t.onerror=n,t.crossOrigin="anonymous","string"==typeof e?t.src=e:(void 0!==e.crossOrigin&&(t.crossOrigin=e.crossOrigin),void 0!==e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.src=e.src)})}var y=i(16808);let x={type:"change"},_={type:"start"},w={type:"end"},S=new n.zHn,E=new n.JOQ,P=Math.cos(70*n.M8C.DEG2RAD),D=new n.Pa4,T=2*Math.PI,M={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};class L extends n.ZXd{constructor(e,t=null){super(e,t),this.state=M.NONE,this.enabled=!0,this.target=new n.Pa4,this.cursor=new n.Pa4,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:n.RsA.ROTATE,MIDDLE:n.RsA.DOLLY,RIGHT:n.RsA.PAN},this.touches={ONE:n.QmN.ROTATE,TWO:n.QmN.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new n.Pa4,this._lastQuaternion=new n._fP,this._lastTargetPosition=new n.Pa4,this._quat=new n._fP().setFromUnitVectors(e.up,new n.Pa4(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new n.$V,this._sphericalDelta=new n.$V,this._scale=1,this._panOffset=new n.Pa4,this._rotateStart=new n.FM8,this._rotateEnd=new n.FM8,this._rotateDelta=new n.FM8,this._panStart=new n.FM8,this._panEnd=new n.FM8,this._panDelta=new n.FM8,this._dollyStart=new n.FM8,this._dollyEnd=new n.FM8,this._dollyDelta=new n.FM8,this._dollyDirection=new n.Pa4,this._mouse=new n.FM8,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=A.bind(this),this._onPointerDown=R.bind(this),this._onPointerUp=k.bind(this),this._onContextMenu=B.bind(this),this._onMouseWheel=j.bind(this),this._onKeyDown=z.bind(this),this._onTouchStart=U.bind(this),this._onTouchMove=I.bind(this),this._onMouseDown=O.bind(this),this._onMouseMove=C.bind(this),this._interceptControlDown=F.bind(this),this._interceptControlUp=N.bind(this),null!==this.domElement&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){null!==this._domElementKeyEvents&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(x),this.update(),this.state=M.NONE}update(e=null){let t=this.object.position;D.copy(t).sub(this.target),D.applyQuaternion(this._quat),this._spherical.setFromVector3(D),this.autoRotate&&this.state===M.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(i)&&isFinite(a)&&(i<-Math.PI?i+=T:i>Math.PI&&(i-=T),a<-Math.PI?a+=T:a>Math.PI&&(a-=T),i<=a?this._spherical.theta=Math.max(i,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+a)/2?Math.max(i,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),!0===this.enableDamping?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=e!=this._spherical.radius}if(D.setFromSpherical(this._spherical),D.applyQuaternion(this._quatInverse),t.copy(this.target).add(D),this.object.lookAt(this.target),!0===this.enableDamping?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=D.length();e=this._clampDistance(t*this._scale);let i=t-e;this.object.position.addScaledVector(this._dollyDirection,i),this.object.updateMatrixWorld(),r=!!i}else if(this.object.isOrthographicCamera){let t=new n.Pa4(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let i=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=i!==this.object.zoom;let a=new n.Pa4(this._mouse.x,this._mouse.y,0);a.unproject(this.object),this.object.position.sub(a).add(t),this.object.updateMatrixWorld(),e=D.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;null!==e&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(S.origin.copy(this.object.position),S.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(S.direction))<P?this.object.lookAt(this.target):(E.setFromNormalAndCoplanarPoint(this.object.up,this.target),S.intersectPlane(E,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,!!(r||this._lastPosition.distanceToSquared(this.object.position)>1e-6||8*(1-this._lastQuaternion.dot(this.object.quaternion))>1e-6||this._lastTargetPosition.distanceToSquared(this.target)>1e-6)&&(this.dispatchEvent(x),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0)}_getAutoRotationAngle(e){return null!==e?T/60*this.autoRotateSpeed*e:T/60/60*this.autoRotateSpeed}_getZoomScale(e){return Math.pow(.95,this.zoomSpeed*Math.abs(.01*e))}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){D.setFromMatrixColumn(t,0),D.multiplyScalar(-e),this._panOffset.add(D)}_panUp(e,t){!0===this.screenSpacePanning?D.setFromMatrixColumn(t,1):(D.setFromMatrixColumn(t,0),D.crossVectors(this.object.up,D)),D.multiplyScalar(e),this._panOffset.add(D)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let n=this.object.position;D.copy(n).sub(this.target);let a=D.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/i.clientHeight,this.object.matrix),this._panUp(2*t*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),n=e-i.left,a=t-i.top,r=i.width,s=i.height;this._mouse.x=n/r*2-1,this._mouse.y=-(a/s*2)+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(T*this._rotateDelta.x/t.clientHeight),this._rotateUp(T*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(T*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-T*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(T*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-T*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(1===this._pointers.length)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._rotateStart.set(i,n)}}_handleTouchStartPan(e){if(1===this._pointers.length)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panStart.set(i,n)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,n=e.pageY-t.y;this._dollyStart.set(0,Math.sqrt(i*i+n*n))}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(1==this._pointers.length)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._rotateEnd.set(i,n)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(T*this._rotateDelta.x/t.clientHeight),this._rotateUp(T*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(1===this._pointers.length)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panEnd.set(i,n)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,n=e.pageY-t.y;this._dollyEnd.set(0,Math.sqrt(i*i+n*n)),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,r=(e.pageY+t.y)*.5;this._updateZoomParameters(a,r)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];void 0===t&&(t=new n.FM8,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function R(e){!1!==this.enabled&&(0===this._pointers.length&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._isTrackingPointer(e)||(this._addPointer(e),"touch"===e.pointerType?this._onTouchStart(e):this._onMouseDown(e)))}function A(e){!1!==this.enabled&&("touch"===e.pointerType?this._onTouchMove(e):this._onMouseMove(e))}function k(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(w),this.state=M.NONE;break;case 1:let t=this._pointers[0],i=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:i.x,pageY:i.y})}}function O(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case n.RsA.DOLLY:if(!1===this.enableZoom)return;this._handleMouseDownDolly(e),this.state=M.DOLLY;break;case n.RsA.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===this.enablePan)return;this._handleMouseDownPan(e),this.state=M.PAN}else{if(!1===this.enableRotate)return;this._handleMouseDownRotate(e),this.state=M.ROTATE}break;case n.RsA.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===this.enableRotate)return;this._handleMouseDownRotate(e),this.state=M.ROTATE}else{if(!1===this.enablePan)return;this._handleMouseDownPan(e),this.state=M.PAN}break;default:this.state=M.NONE}this.state!==M.NONE&&this.dispatchEvent(_)}function C(e){switch(this.state){case M.ROTATE:if(!1===this.enableRotate)return;this._handleMouseMoveRotate(e);break;case M.DOLLY:if(!1===this.enableZoom)return;this._handleMouseMoveDolly(e);break;case M.PAN:if(!1===this.enablePan)return;this._handleMouseMovePan(e)}}function j(e){!1!==this.enabled&&!1!==this.enableZoom&&this.state===M.NONE&&(e.preventDefault(),this.dispatchEvent(_),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(w))}function z(e){!1!==this.enabled&&this._handleKeyDown(e)}function U(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case n.QmN.ROTATE:if(!1===this.enableRotate)return;this._handleTouchStartRotate(e),this.state=M.TOUCH_ROTATE;break;case n.QmN.PAN:if(!1===this.enablePan)return;this._handleTouchStartPan(e),this.state=M.TOUCH_PAN;break;default:this.state=M.NONE}break;case 2:switch(this.touches.TWO){case n.QmN.DOLLY_PAN:if(!1===this.enableZoom&&!1===this.enablePan)return;this._handleTouchStartDollyPan(e),this.state=M.TOUCH_DOLLY_PAN;break;case n.QmN.DOLLY_ROTATE:if(!1===this.enableZoom&&!1===this.enableRotate)return;this._handleTouchStartDollyRotate(e),this.state=M.TOUCH_DOLLY_ROTATE;break;default:this.state=M.NONE}break;default:this.state=M.NONE}this.state!==M.NONE&&this.dispatchEvent(_)}function I(e){switch(this._trackPointer(e),this.state){case M.TOUCH_ROTATE:if(!1===this.enableRotate)return;this._handleTouchMoveRotate(e),this.update();break;case M.TOUCH_PAN:if(!1===this.enablePan)return;this._handleTouchMovePan(e),this.update();break;case M.TOUCH_DOLLY_PAN:if(!1===this.enableZoom&&!1===this.enablePan)return;this._handleTouchMoveDollyPan(e),this.update();break;case M.TOUCH_DOLLY_ROTATE:if(!1===this.enableZoom&&!1===this.enableRotate)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=M.NONE}}function B(e){!1!==this.enabled&&e.preventDefault()}function F(e){"Control"===e.key&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function N(e){"Control"===e.key&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var W=i(12056),G=i(73202),H=i(6487);let $={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new n.FM8(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		// FXAA algorithm from NVIDIA, C# implementation by Jasper Flick, GLSL port by Dave Hoskins
		// http://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf
		// https://catlikecoding.com/unity/tutorials/advanced-rendering/fxaa/

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;
			
			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {
				
				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );
			
		}`};class q extends n.jyi{constructor(e="",t={}){let i=new n.xeV({transparent:!0,alphaTest:1e-5});super(i),Object.defineProperty(this,"painted",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"text",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"font",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"margin",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"textStyle",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"backgroundStyle",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"height",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"textMaterial",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.textMaterial=i,this.text=e,this.font=void 0===t.font?"48px Minecraft":t.font,this.margin=void 0===t.margin?[5,10,5,10]:t.margin,this.textStyle=void 0===t.textStyle?"white":t.textStyle,this.backgroundStyle=void 0===t.backgroundStyle?"rgba(0,0,0,.25)":t.backgroundStyle,this.height=void 0===t.height?4:t.height,(void 0===t.repaintAfterLoaded||t.repaintAfterLoaded)&&!document.fonts.check(this.font,this.text)?(this.paint(),this.painted=this.loadAndPaint()):(this.paint(),this.painted=Promise.resolve())}async loadAndPaint(){await document.fonts.load(this.font,this.text),this.paint()}paint(){let e=document.createElement("canvas"),t=e.getContext("2d");t.font=this.font;let i=t.measureText(this.text);e.width=this.margin[3]+i.actualBoundingBoxLeft+i.actualBoundingBoxRight+this.margin[1],e.height=this.margin[0]+i.actualBoundingBoxAscent+i.actualBoundingBoxDescent+this.margin[2],(t=e.getContext("2d")).font=this.font,t.fillStyle=this.backgroundStyle,t.fillRect(0,0,e.width,e.height),t.fillStyle=this.textStyle,t.fillText(this.text,this.margin[3]+i.actualBoundingBoxLeft,this.margin[0]+i.actualBoundingBoxAscent);let a=new n.ROQ(e);a.magFilter=n.TyD,a.minFilter=n.TyD,this.textMaterial.map=a,this.textMaterial.needsUpdate=!0,this.scale.x=e.width/e.height*this.height,this.scale.y=this.height}}class Y{constructor(e={}){let t;Object.defineProperty(this,"canvas",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"scene",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"camera",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"renderer",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"controls",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"playerObject",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"playerWrapper",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"globalLight",{enumerable:!0,configurable:!0,writable:!0,value:new n.Mig(16777215,3)}),Object.defineProperty(this,"cameraLight",{enumerable:!0,configurable:!0,writable:!0,value:new n.cek(16777215,.6)}),Object.defineProperty(this,"composer",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"renderPass",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"fxaaPass",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"skinCanvas",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"capeCanvas",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"earsCanvas",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"skinTexture",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"capeTexture",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"earsTexture",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"backgroundTexture",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"_disposed",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"_renderPaused",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"_zoom",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"isUserRotating",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"autoRotate",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"autoRotateSpeed",{enumerable:!0,configurable:!0,writable:!0,value:1}),Object.defineProperty(this,"_animation",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"clock",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"animationID",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"onContextLost",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"onContextRestored",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_pixelRatio",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"devicePixelRatioQuery",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"onDevicePixelRatioChange",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_nameTag",{enumerable:!0,configurable:!0,writable:!0,value:null}),this.canvas=void 0===e.canvas?document.createElement("canvas"):e.canvas,this.skinCanvas=document.createElement("canvas"),this.capeCanvas=document.createElement("canvas"),this.earsCanvas=document.createElement("canvas"),this.scene=new n.xsS,this.camera=new n.cPb,this.camera.add(this.cameraLight),this.scene.add(this.camera),this.scene.add(this.globalLight),n.epp.enabled=!1,this.renderer=new y.WebGLRenderer({canvas:this.canvas,preserveDrawingBuffer:!0===e.preserveDrawingBuffer}),this.onDevicePixelRatioChange=()=>{this.renderer.setPixelRatio(window.devicePixelRatio),this.updateComposerSize(),"match-device"===this._pixelRatio&&(this.devicePixelRatioQuery=matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`),this.devicePixelRatioQuery.addEventListener("change",this.onDevicePixelRatioChange,{once:!0}))},void 0===e.pixelRatio||"match-device"===e.pixelRatio?(this._pixelRatio="match-device",this.devicePixelRatioQuery=matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`),this.devicePixelRatioQuery.addEventListener("change",this.onDevicePixelRatioChange,{once:!0}),this.renderer.setPixelRatio(window.devicePixelRatio)):(this._pixelRatio=e.pixelRatio,this.devicePixelRatioQuery=null,this.renderer.setPixelRatio(e.pixelRatio)),this.renderer.setClearColor(0,0),this.renderer.capabilities.isWebGL2&&(t=new n.dd2(0,0,{depthTexture:new n.$YQ(0,0,n.VzW)})),this.composer=new W.x(this.renderer,t),this.renderPass=new G.C(this.scene,this.camera),this.fxaaPass=new H.T($),this.composer.addPass(this.renderPass),this.composer.addPass(this.fxaaPass),this.playerObject=new f,this.playerObject.name="player",this.playerObject.skin.visible=!1,this.playerObject.cape.visible=!1,this.playerWrapper=new n.ZAu,this.playerWrapper.add(this.playerObject),this.scene.add(this.playerWrapper),this.controls=new L(this.camera,this.canvas),this.controls.enablePan=!1,this.controls.minDistance=10,this.controls.maxDistance=256,!1===e.enableControls&&(this.controls.enabled=!1),void 0!==e.skin&&this.loadSkin(e.skin,{model:e.model,ears:"current-skin"===e.ears}),void 0!==e.cape&&this.loadCape(e.cape),void 0!==e.ears&&"current-skin"!==e.ears&&this.loadEars(e.ears.source,{textureType:e.ears.textureType}),void 0!==e.width&&(this.width=e.width),void 0!==e.height&&(this.height=e.height),void 0!==e.background&&(this.background=e.background),void 0!==e.panorama&&this.loadPanorama(e.panorama),void 0!==e.nameTag&&(this.nameTag=e.nameTag),this.camera.position.z=1,this._zoom=void 0===e.zoom?.9:e.zoom,this.fov=void 0===e.fov?50:e.fov,this._animation=void 0===e.animation?null:e.animation,this.clock=new n.SUY,!0===e.renderPaused?(this._renderPaused=!0,this.animationID=null):this.animationID=window.requestAnimationFrame(()=>this.draw()),this.onContextLost=e=>{e.preventDefault(),null!==this.animationID&&(window.cancelAnimationFrame(this.animationID),this.animationID=null)},this.onContextRestored=()=>{this.renderer.setClearColor(0,0),this._renderPaused||this._disposed||null!==this.animationID||(this.animationID=window.requestAnimationFrame(()=>this.draw()))},this.canvas.addEventListener("webglcontextlost",this.onContextLost,!1),this.canvas.addEventListener("webglcontextrestored",this.onContextRestored,!1),this.canvas.addEventListener("mousedown",()=>{this.isUserRotating=!0},!1),this.canvas.addEventListener("mouseup",()=>{this.isUserRotating=!1},!1),this.canvas.addEventListener("touchmove",e=>{1===e.touches.length?this.isUserRotating=!0:this.isUserRotating=!1},!1),this.canvas.addEventListener("touchend",()=>{this.isUserRotating=!1},!1)}updateComposerSize(){this.composer.setSize(this.width,this.height);let e=this.renderer.getPixelRatio();this.composer.setPixelRatio(e),this.fxaaPass.material.uniforms.resolution.value.x=1/(this.width*e),this.fxaaPass.material.uniforms.resolution.value.y=1/(this.height*e)}recreateSkinTexture(){null!==this.skinTexture&&this.skinTexture.dispose(),this.skinTexture=new n.ROQ(this.skinCanvas),this.skinTexture.magFilter=n.TyD,this.skinTexture.minFilter=n.TyD,this.playerObject.skin.map=this.skinTexture}recreateCapeTexture(){null!==this.capeTexture&&this.capeTexture.dispose(),this.capeTexture=new n.ROQ(this.capeCanvas),this.capeTexture.magFilter=n.TyD,this.capeTexture.minFilter=n.TyD,this.playerObject.cape.map=this.capeTexture,this.playerObject.elytra.map=this.capeTexture}recreateEarsTexture(){null!==this.earsTexture&&this.earsTexture.dispose(),this.earsTexture=new n.ROQ(this.earsCanvas),this.earsTexture.magFilter=n.TyD,this.earsTexture.minFilter=n.TyD,this.playerObject.ears.map=this.earsTexture}loadSkin(e,t={}){if(null===e)this.resetSkin();else{if(!p(e))return b(e).then(e=>this.loadSkin(e,t));!function(e,t){let i=!1;if(t.width!==t.height){if(t.width===2*t.height)i=!0;else throw Error(`Bad skin size: ${t.width}x${t.height}`)}let n=e.getContext("2d",{willReadFrequently:!0});if(i){let i=t.width;e.width=i,e.height=i,n.clearRect(0,0,i,i),n.drawImage(t,0,0,i,i/2),function(e,t){e.save(),e.scale(-1,1);let i=t/64,n=(t,n,a,r,s,o)=>e.drawImage(e.canvas,t*i,n*i,a*i,r*i,-s*i,o*i,-a*i,r*i);n(4,16,4,4,20,48),n(8,16,4,4,24,48),n(0,20,4,12,24,52),n(4,20,4,12,20,52),n(8,20,4,12,16,52),n(12,20,4,12,28,52),n(44,16,4,4,36,48),n(48,16,4,4,40,48),n(40,20,4,12,40,52),n(44,20,4,12,36,52),n(48,20,4,12,32,52),n(52,20,4,12,44,52),e.restore()}(n,i),v(n,e.width,!1)}else e.width=t.width,e.height=t.height,n.clearRect(0,0,t.width,t.height),n.drawImage(t,0,0,e.width,e.height),v(n,e.width,!0)}(this.skinCanvas,e),this.recreateSkinTexture(),void 0===t.model||"auto-detect"===t.model?this.playerObject.skin.modelType=function(e){let t=e.width/64,i=e.getContext("2d",{willReadFrequently:!0}),n=(e,n,a,r)=>m(i,e*t,n*t,a*t,r*t),a=(e,n,a,r)=>(function(e,t,i,n,a){let r=e.getImageData(t,i,n,a);for(let e=0;e<n;e++)for(let t=0;t<a;t++){let i=(e+t*n)*4;if(!(0===r.data[i+0]&&0===r.data[i+1]&&0===r.data[i+2]&&255===r.data[i+3]))return!1}return!0})(i,e*t,n*t,a*t,r*t),r=(e,n,a,r)=>(function(e,t,i,n,a){let r=e.getImageData(t,i,n,a);for(let e=0;e<n;e++)for(let t=0;t<a;t++){let i=(e+t*n)*4;if(!(255===r.data[i+0]&&255===r.data[i+1]&&255===r.data[i+2]&&255===r.data[i+3]))return!1}return!0})(i,e*t,n*t,a*t,r*t);return n(50,16,2,4)||n(54,20,2,12)||n(42,48,2,4)||n(46,52,2,12)||a(50,16,2,4)&&a(54,20,2,12)&&a(42,48,2,4)&&a(46,52,2,12)||r(50,16,2,4)&&r(54,20,2,12)&&r(42,48,2,4)&&r(46,52,2,12)?"slim":"default"}(this.skinCanvas):this.playerObject.skin.modelType=t.model,!1!==t.makeVisible&&(this.playerObject.skin.visible=!0),(!0===t.ears||"load-only"==t.ears)&&(g(this.earsCanvas,e),this.recreateEarsTexture(),!0===t.ears&&(this.playerObject.ears.visible=!0))}}resetSkin(){this.playerObject.skin.visible=!1,this.playerObject.skin.map=null,null!==this.skinTexture&&(this.skinTexture.dispose(),this.skinTexture=null)}loadCape(e,t={}){if(null===e)this.resetCape();else{if(!p(e))return b(e).then(e=>this.loadCape(e,t));!function(e,t){let i=function(e){if(e.width===2*e.height)return e.width/64;if(17*e.width==22*e.height)return e.width/22;if(11*e.width==23*e.height)return e.width/46;throw Error(`Bad cape size: ${e.width}x${e.height}`)}(t);e.width=64*i,e.height=32*i;let n=e.getContext("2d",{willReadFrequently:!0});n.clearRect(0,0,e.width,e.height),n.drawImage(t,0,0,t.width,t.height)}(this.capeCanvas,e),this.recreateCapeTexture(),!1!==t.makeVisible&&(this.playerObject.backEquipment=void 0===t.backEquipment?"cape":t.backEquipment)}}resetCape(){this.playerObject.backEquipment=null,this.playerObject.cape.map=null,this.playerObject.elytra.map=null,null!==this.capeTexture&&(this.capeTexture.dispose(),this.capeTexture=null)}loadEars(e,t={}){if(null===e)this.resetEars();else{if(!p(e))return b(e).then(e=>this.loadEars(e,t));"skin"===t.textureType?g(this.earsCanvas,e):function(e,t){let i=function(e){if(e.width===2*e.height&&e.height%7==0)return e.height/7;throw Error(`Bad ears size: ${e.width}x${e.height}`)}(t);e.width=14*i,e.height=7*i;let n=e.getContext("2d",{willReadFrequently:!0});n.clearRect(0,0,e.width,e.height),n.drawImage(t,0,0,t.width,t.height)}(this.earsCanvas,e),this.recreateEarsTexture(),!1!==t.makeVisible&&(this.playerObject.ears.visible=!0)}}resetEars(){this.playerObject.ears.visible=!1,this.playerObject.ears.map=null,null!==this.earsTexture&&(this.earsTexture.dispose(),this.earsTexture=null)}loadPanorama(e){return this.loadBackground(e,n.dSO)}loadBackground(e,t){if(!p(e))return b(e).then(e=>this.loadBackground(e,t));null!==this.backgroundTexture&&this.backgroundTexture.dispose(),this.backgroundTexture=new n.xEZ,this.backgroundTexture.image=e,void 0!==t&&(this.backgroundTexture.mapping=t),this.backgroundTexture.needsUpdate=!0,this.scene.background=this.backgroundTexture}draw(){let e=this.clock.getDelta();null!==this._animation&&this._animation.update(this.playerObject,e),this.autoRotate&&!(this.controls.enableRotate&&this.isUserRotating)&&(this.playerWrapper.rotation.y+=e*this.autoRotateSpeed),this.controls.update(),this.render(),this.animationID=window.requestAnimationFrame(()=>this.draw())}render(){this.composer.render()}setSize(e,t){this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.updateComposerSize()}dispose(){this._disposed=!0,this.canvas.removeEventListener("webglcontextlost",this.onContextLost,!1),this.canvas.removeEventListener("webglcontextrestored",this.onContextRestored,!1),null!==this.devicePixelRatioQuery&&(this.devicePixelRatioQuery.removeEventListener("change",this.onDevicePixelRatioChange),this.devicePixelRatioQuery=null),null!==this.animationID&&(window.cancelAnimationFrame(this.animationID),this.animationID=null),this.controls.dispose(),this.renderer.dispose(),this.resetSkin(),this.resetCape(),this.resetEars(),this.background=null,this.fxaaPass.fsQuad.dispose()}get disposed(){return this._disposed}get renderPaused(){return this._renderPaused}set renderPaused(e){this._renderPaused=e,this._renderPaused&&null!==this.animationID?(window.cancelAnimationFrame(this.animationID),this.animationID=null,this.clock.stop(),this.clock.autoStart=!0):this._renderPaused||this._disposed||this.renderer.getContext().isContextLost()||null!=this.animationID||(this.animationID=window.requestAnimationFrame(()=>this.draw()))}get width(){return this.renderer.getSize(new n.FM8).width}set width(e){this.setSize(e,this.height)}get height(){return this.renderer.getSize(new n.FM8).height}set height(e){this.setSize(this.width,e)}get background(){return this.scene.background}set background(e){null===e||e instanceof n.Ilk||e instanceof n.xEZ?this.scene.background=e:this.scene.background=new n.Ilk(e),null!==this.backgroundTexture&&e!==this.backgroundTexture&&(this.backgroundTexture.dispose(),this.backgroundTexture=null)}adjustCameraDistance(){let e=4.5+16.5/Math.tan(this.fov/180*Math.PI/2)/this.zoom;e<10?e=10:e>256&&(e=256),this.camera.position.multiplyScalar(e/this.camera.position.length()),this.camera.updateProjectionMatrix()}resetCameraPose(){this.camera.position.set(0,0,1),this.camera.rotation.set(0,0,0),this.adjustCameraDistance()}get fov(){return this.camera.fov}set fov(e){this.camera.fov=e,this.adjustCameraDistance()}get zoom(){return this._zoom}set zoom(e){this._zoom=e,this.adjustCameraDistance()}get pixelRatio(){return this._pixelRatio}set pixelRatio(e){"match-device"===e?"match-device"!==this._pixelRatio&&(this._pixelRatio=e,this.onDevicePixelRatioChange()):("match-device"===this._pixelRatio&&null!==this.devicePixelRatioQuery&&(this.devicePixelRatioQuery.removeEventListener("change",this.onDevicePixelRatioChange),this.devicePixelRatioQuery=null),this._pixelRatio=e,this.renderer.setPixelRatio(e),this.updateComposerSize())}get animation(){return this._animation}set animation(e){this._animation!==e&&(this.playerObject.resetJoints(),this.playerObject.position.set(0,0,0),this.playerObject.rotation.set(0,0,0),this.clock.stop(),this.clock.autoStart=!0),null!==e&&(e.progress=0),this._animation=e}get nameTag(){return this._nameTag}set nameTag(e){null!==this._nameTag&&this.playerWrapper.remove(this._nameTag),null!==e&&(e instanceof n.Tme||(e=new q(e)),this.playerWrapper.add(e),e.position.y=20),this._nameTag=e}}},12056:function(e,t,i){i.d(t,{x:function(){return h}});var n=i(9375),a=i(92429),r=i(6487),s=i(50277);class o extends s.w{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let n,a;let r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0),this.inverse?(n=0,a=1):(n=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,n,4294967295),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class l extends s.w{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class h{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),void 0===t){let i=e.getSize(new n.FM8);this._width=i.width,this._height=i.height,(t=new n.dd2(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:n.cLu})).texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new r.T(a.C),this.copyPass.material.blending=n.jFi,this.clock=new n.SUY}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){void 0===e&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let t=0,n=this.passes.length;t<n;t++){let n=this.passes[t];if(!1!==n.enabled){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),n.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),n.needsSwap){if(i){let t=this.renderer.getContext(),i=this.renderer.state.buffers.stencil;i.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),i.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}void 0!==o&&(n instanceof o?i=!0:n instanceof l&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(void 0===e){let t=this.renderer.getSize(new n.FM8);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}},50277:function(e,t,i){i.d(t,{T:function(){return l},w:function(){return a}});var n=i(9375);class a{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}let r=new n.iKG(-1,1,1,-1,0,1);class s extends n.u9r{constructor(){super(),this.setAttribute("position",new n.a$l([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new n.a$l([0,2,0,0,2,0],2))}}let o=new s;class l{constructor(e){this._mesh=new n.Kj0(o,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,r)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}},73202:function(e,t,i){i.d(t,{C:function(){return r}});var n=i(9375),a=i(50277);class r extends a.w{constructor(e,t,i=null,a=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=a,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new n.Ilk}render(e,t,i){let n,a;let r=e.autoClear;e.autoClear=!1,null!==this.overrideMaterial&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),null!==this.clearColor&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),null!==this.clearAlpha&&(n=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),!0==this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),!0===this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),null!==this.clearColor&&e.setClearColor(this._oldClearColor),null!==this.clearAlpha&&e.setClearAlpha(n),null!==this.overrideMaterial&&(this.scene.overrideMaterial=a),e.autoClear=r}}},6487:function(e,t,i){i.d(t,{T:function(){return r}});var n=i(9375),a=i(50277);class r extends a.w{constructor(e,t){super(),this.textureID=void 0!==t?t:"tDiffuse",e instanceof n.jyz?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=n.rDY.clone(e.uniforms),this.material=new n.jyz({name:void 0!==e.name?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new a.T(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)),this.fsQuad.render(e)}dispose(){this.material.dispose(),this.fsQuad.dispose()}}},92429:function(e,t,i){i.d(t,{C:function(){return n}});let n={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`}},14771:function(e,t,i){i.d(t,{Z:function(){return n}});function n(){return function(e){function t(e,t){for(var i,n,a,r,s,o=/([MLQCZ])([^MLQCZ]*)/g;i=o.exec(e);){var l=i[2].replace(/^\s*|\s*$/g,"").split(/[,\s]+/).map(function(e){return parseFloat(e)});switch(i[1]){case"M":r=n=l[0],s=a=l[1];break;case"L":(l[0]!==r||l[1]!==s)&&t("L",r,s,r=l[0],s=l[1]);break;case"Q":t("Q",r,s,r=l[2],s=l[3],l[0],l[1]);break;case"C":t("C",r,s,r=l[4],s=l[5],l[0],l[1],l[2],l[3]);break;case"Z":(r!==n||s!==a)&&t("L",r,s,n,a)}}}function i(e,i,n){void 0===n&&(n=16);var a={x:0,y:0};t(e,function(e,t,r,s,o,l,h,c,u){switch(e){case"L":i(t,r,s,o);break;case"Q":for(var d=t,f=r,p=1;p<n;p++)!function(e,t,i,n,a,r,s,o){var l=1-s;o.x=l*l*e+2*l*s*i+s*s*a,o.y=l*l*t+2*l*s*n+s*s*r}(t,r,l,h,s,o,p/(n-1),a),i(d,f,a.x,a.y),d=a.x,f=a.y;break;case"C":for(var m=t,v=r,g=1;g<n;g++)!function(e,t,i,n,a,r,s,o,l,h){var c=1-l;h.x=c*c*c*e+3*c*c*l*i+3*c*l*l*a+l*l*l*s,h.y=c*c*c*t+3*c*c*l*n+3*c*l*l*r+l*l*l*o}(t,r,l,h,c,u,s,o,g/(n-1),a),i(m,v,a.x,a.y),m=a.x,v=a.y}})}var n="precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}",a=new WeakMap,r={premultipliedAlpha:!1,preserveDrawingBuffer:!0,antialias:!1,depth:!1};function s(e,t){var i=e.getContext?e.getContext("webgl",r):e,n=a.get(i);if(!n){var s="undefined"!=typeof WebGL2RenderingContext&&i instanceof WebGL2RenderingContext,o={},l={},h={},c=-1,u=[];function d(e){var t=o[e];if(!t&&!(t=o[e]=i.getExtension(e)))throw Error(e+" not supported");return t}function f(e,t){var n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}function p(){o={},l={},h={},c=-1,u.length=0}i.canvas.addEventListener("webglcontextlost",function(e){p(),e.preventDefault()},!1),a.set(i,n={gl:i,isWebGL2:s,getExtension:d,withProgram:function(e,t,n,a){if(!l[e]){var r={},o={},h=i.createProgram();i.attachShader(h,f(t,i.VERTEX_SHADER)),i.attachShader(h,f(n,i.FRAGMENT_SHADER)),i.linkProgram(h),l[e]={program:h,transaction:function(e){i.useProgram(h),e({setUniform:function(e,t){for(var n=[],a=arguments.length-2;a-- >0;)n[a]=arguments[a+2];var r=o[t]||(o[t]=i.getUniformLocation(h,t));i["uniform"+e].apply(i,[r].concat(n))},setAttribute:function(e,t,n,a,o){var l=r[e];l||(l=r[e]={buf:i.createBuffer(),loc:i.getAttribLocation(h,e),data:null}),i.bindBuffer(i.ARRAY_BUFFER,l.buf),i.vertexAttribPointer(l.loc,t,i.FLOAT,!1,0,0),i.enableVertexAttribArray(l.loc),s?i.vertexAttribDivisor(l.loc,a):d("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(l.loc,a),o!==l.data&&(i.bufferData(i.ARRAY_BUFFER,o,n),l.data=o)}})}}}l[e].transaction(a)},withTexture:function(e,t){c++;try{i.activeTexture(i.TEXTURE0+c);var n=h[e];n||(n=h[e]=i.createTexture(),i.bindTexture(i.TEXTURE_2D,n),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST)),i.bindTexture(i.TEXTURE_2D,n),t(n,c)}finally{c--}},withTextureFramebuffer:function(e,t,n){var a=i.createFramebuffer();u.push(a),i.bindFramebuffer(i.FRAMEBUFFER,a),i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,e),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,e,0);try{n(a)}finally{i.deleteFramebuffer(a),i.bindFramebuffer(i.FRAMEBUFFER,u[--u.length-1]||null)}},handleContextLoss:p})}t(n)}function o(e,t,i,a,r,o,l,h){void 0===l&&(l=15),void 0===h&&(h=null),s(e,function(e){var s=e.gl,c=e.withProgram;(0,e.withTexture)("copy",function(e,u){s.texImage2D(s.TEXTURE_2D,0,s.RGBA,r,o,0,s.RGBA,s.UNSIGNED_BYTE,t),c("copy",n,"precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}",function(e){var t=e.setUniform;(0,e.setAttribute)("aUV",2,s.STATIC_DRAW,0,new Float32Array([0,0,2,0,0,2])),t("1i","image",u),s.bindFramebuffer(s.FRAMEBUFFER,h||null),s.disable(s.BLEND),s.colorMask(8&l,4&l,2&l,1&l),s.viewport(i,a,r,o),s.scissor(i,a,r,o),s.drawArrays(s.TRIANGLES,0,3)})})})}var l=Object.freeze({__proto__:null,withWebGLContext:s,renderImageData:o,resizeWebGLCanvasWithoutClearing:function(e,t,i){var n=e.width,a=e.height;s(e,function(r){var s=r.gl,l=new Uint8Array(n*a*4);s.readPixels(0,0,n,a,s.RGBA,s.UNSIGNED_BYTE,l),e.width=t,e.height=i,o(s,l,0,0,n,a)})}});function h(e,t,n,a,r,s){void 0===s&&(s=1);var o=new Uint8Array(e*t),l=a[2]-a[0],h=a[3]-a[1],c=[];i(n,function(e,t,i,n){c.push({x1:e,y1:t,x2:i,y2:n,minX:Math.min(e,i),minY:Math.min(t,n),maxX:Math.max(e,i),maxY:Math.max(t,n)})}),c.sort(function(e,t){return e.maxX-t.maxX});for(var u=0;u<e;u++)for(var d=0;d<t;d++){var f=function(e,t){for(var i=1/0,n=1/0,a=c.length;a--;){var r=c[a];if(r.maxX+n<=e)break;if(e+n>r.minX&&t-n<r.maxY&&t+n>r.minY){var s=function(e,t,i,n,a,r){var s=a-i,o=r-n,l=s*s+o*o,h=l?Math.max(0,Math.min(1,((e-i)*s+(t-n)*o)/l)):0,c=e-(i+h*s),u=t-(n+h*o);return c*c+u*u}(e,t,r.x1,r.y1,r.x2,r.y2);s<i&&(n=Math.sqrt(i=s))}}return function(e,t){for(var i=0,n=c.length;n--;){var a=c[n];if(a.maxX<=e)break;a.y1>t!=a.y2>t&&e<(a.x2-a.x1)*(t-a.y1)/(a.y2-a.y1)+a.x1&&(i+=a.y1<a.y2?1:-1)}return 0!==i}(e,t)&&(n=-n),n}(a[0]+l*(u+.5)/e,a[1]+h*(d+.5)/t),p=Math.pow(1-Math.abs(f)/r,s)/2;f<0&&(p=1-p),p=Math.max(0,Math.min(255,Math.round(255*p))),o[d*e+u]=p}return o}function c(e,t,i,n,a,r,s,o,l,h){void 0===r&&(r=1),void 0===o&&(o=0),void 0===l&&(l=0),void 0===h&&(h=0),u(e,t,i,n,a,r,s,null,o,l,h)}function u(e,t,i,n,a,r,s,l,c,u,d){void 0===r&&(r=1),void 0===c&&(c=0),void 0===u&&(u=0),void 0===d&&(d=0);for(var f=h(e,t,i,n,a,r),p=new Uint8Array(4*f.length),m=0;m<f.length;m++)p[4*m+d]=f[m];o(s,p,c,u,e,t,1<<3-d,l)}var d=Object.freeze({__proto__:null,generate:h,generateIntoCanvas:c,generateIntoFramebuffer:u}),f=new Float32Array([0,0,2,0,0,2]),p=null,m=!1,v={},g=new WeakMap;function b(e){if(!m&&!w(e))throw Error("WebGL generation not supported")}function y(e,t,i,n,a,r,o){if(void 0===r&&(r=1),void 0===o&&(o=null),!o&&!(o=p)){var l="function"==typeof OffscreenCanvas?new OffscreenCanvas(1,1):"undefined"!=typeof document?document.createElement("canvas"):null;if(!l)throw Error("OffscreenCanvas or DOM canvas not supported");o=p=l.getContext("webgl",{depth:!1})}b(o);var h=new Uint8Array(e*t*4);s(o,function(s){var o=s.gl,l=s.withTexture,c=s.withTextureFramebuffer;l("readable",function(s,l){o.texImage2D(o.TEXTURE_2D,0,o.RGBA,e,t,0,o.RGBA,o.UNSIGNED_BYTE,null),c(s,l,function(s){_(e,t,i,n,a,r,o,s,0,0,0),o.readPixels(0,0,e,t,o.RGBA,o.UNSIGNED_BYTE,h)})})});for(var c=new Uint8Array(e*t),u=0,d=0;u<h.length;u+=4)c[d++]=h[u];return c}function x(e,t,i,n,a,r,s,o,l,h){void 0===r&&(r=1),void 0===o&&(o=0),void 0===l&&(l=0),void 0===h&&(h=0),_(e,t,i,n,a,r,s,null,o,l,h)}function _(e,t,a,r,o,l,h,c,u,d,p){void 0===l&&(l=1),void 0===u&&(u=0),void 0===d&&(d=0),void 0===p&&(p=0),b(h);var m=[];i(a,function(e,t,i,n){m.push(e,t,i,n)}),m=new Float32Array(m),s(h,function(i){var a=i.gl,s=i.isWebGL2,h=i.getExtension,v=i.withProgram,g=i.withTexture,b=i.withTextureFramebuffer,y=i.handleContextLoss;if(g("rawDistances",function(i,g){(e!==i._lastWidth||t!==i._lastHeight)&&a.texImage2D(a.TEXTURE_2D,0,a.RGBA,i._lastWidth=e,i._lastHeight=t,0,a.RGBA,a.UNSIGNED_BYTE,null),v("main","precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}","precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}",function(n){var c=n.setAttribute,u=n.setUniform,d=!s&&h("ANGLE_instanced_arrays"),p=!s&&h("EXT_blend_minmax");c("aUV",2,a.STATIC_DRAW,0,f),c("aLineSegment",4,a.DYNAMIC_DRAW,1,m),u.apply(void 0,["4f","uGlyphBounds"].concat(r)),u("1f","uMaxDistance",o),u("1f","uExponent",l),b(i,g,function(i){a.enable(a.BLEND),a.colorMask(!0,!0,!0,!0),a.viewport(0,0,e,t),a.scissor(0,0,e,t),a.blendFunc(a.ONE,a.ONE),a.blendEquationSeparate(a.FUNC_ADD,s?a.MAX:p.MAX_EXT),a.clear(a.COLOR_BUFFER_BIT),s?a.drawArraysInstanced(a.TRIANGLES,0,3,m.length/4):d.drawArraysInstancedANGLE(a.TRIANGLES,0,3,m.length/4)})}),v("post",n,"precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}",function(i){i.setAttribute("aUV",2,a.STATIC_DRAW,0,f),i.setUniform("1i","tex",g),a.bindFramebuffer(a.FRAMEBUFFER,c),a.disable(a.BLEND),a.colorMask(0===p,1===p,2===p,3===p),a.viewport(u,d,e,t),a.scissor(u,d,e,t),a.drawArrays(a.TRIANGLES,0,3)})}),a.isContextLost())throw y(),Error("webgl context lost")})}function w(e){var t=e&&e!==p?e.canvas||e:v,i=g.get(t);if(void 0===i){m=!0;var n=null;try{var a=[97,106,97,61,99,137,118,80,80,118,137,99,61,97,106,97],r=y(4,4,"M8,8L16,8L24,24L16,24Z",[0,0,32,32],24,1,e);(i=r&&a.length===r.length&&r.every(function(e,t){return e===a[t]}))||(n="bad trial run results",console.info(a,r))}catch(e){i=!1,n=e.message}n&&console.warn("WebGL SDF generation not supported:",n),m=!1,g.set(t,i)}return i}var S=Object.freeze({__proto__:null,generate:y,generateIntoCanvas:x,generateIntoFramebuffer:_,isSupported:w});return e.forEachPathCommand=t,e.generate=function(e,t,i,n,a,r){void 0===a&&(a=Math.max(n[2]-n[0],n[3]-n[1])/2),void 0===r&&(r=1);try{return y.apply(S,arguments)}catch(e){return console.info("WebGL SDF generation failed, falling back to JS",e),h.apply(d,arguments)}},e.generateIntoCanvas=function(e,t,i,n,a,r,s,o,l,h){void 0===a&&(a=Math.max(n[2]-n[0],n[3]-n[1])/2),void 0===r&&(r=1),void 0===o&&(o=0),void 0===l&&(l=0),void 0===h&&(h=0);try{return x.apply(S,arguments)}catch(e){return console.info("WebGL SDF generation failed, falling back to JS",e),c.apply(d,arguments)}},e.javascript=d,e.pathToLineSegments=i,e.webgl=S,e.webglUtils=l,Object.defineProperty(e,"__esModule",{value:!0}),e}({})}}}]);