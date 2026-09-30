"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[55376,3120,76137,24720],{58109:function(e,a,t){t.d(a,{V:function(){return r}});var i=t(99217),b=t(62510),n=t(52983),c=t(9375);let r=n.forwardRef(function({children:e,follow:a=!0,lockX:t=!1,lockY:r=!1,lockZ:o=!1,...l},s){let d=n.useRef(null),p=n.useRef(null),f=new c._fP;return(0,b.F)(({camera:e})=>{if(!a||!p.current)return;let i=d.current.rotation.clone();p.current.updateMatrix(),p.current.updateWorldMatrix(!1,!1),p.current.getWorldQuaternion(f),e.getWorldQuaternion(d.current.quaternion).premultiply(f.invert()),t&&(d.current.rotation.x=i.x),r&&(d.current.rotation.y=i.y),o&&(d.current.rotation.z=i.z)}),n.useImperativeHandle(s,()=>p.current,[]),n.createElement("group",(0,i.Z)({ref:p},l),n.createElement("group",{ref:d},e))})},81125:function(e,a,t){t.d(a,{q:function(){return v}});var i=t(99217),b=t(62510),n=t(52983),c=t(9375),r=t(30535),o=Object.defineProperty,l=(e,a,t)=>a in e?o(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,s=(e,a,t)=>(l(e,"symbol"!=typeof a?a+"":a,t),t);let d=new c.USm(0,0,0,"YXZ"),p=new c.Pa4,f={type:"change"},u={type:"lock"},h={type:"unlock"},m=Math.PI/2;class g extends r.p{constructor(e,a){super(),s(this,"camera"),s(this,"domElement"),s(this,"isLocked"),s(this,"minPolarAngle"),s(this,"maxPolarAngle"),s(this,"pointerSpeed"),s(this,"onMouseMove",e=>{this.domElement&&!1!==this.isLocked&&(d.setFromQuaternion(this.camera.quaternion),d.y-=.002*e.movementX*this.pointerSpeed,d.x-=.002*e.movementY*this.pointerSpeed,d.x=Math.max(m-this.maxPolarAngle,Math.min(m-this.minPolarAngle,d.x)),this.camera.quaternion.setFromEuler(d),this.dispatchEvent(f))}),s(this,"onPointerlockChange",()=>{this.domElement&&(this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(u),this.isLocked=!0):(this.dispatchEvent(h),this.isLocked=!1))}),s(this,"onPointerlockError",()=>{console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}),s(this,"connect",e=>{this.domElement=e||this.domElement,this.domElement&&(this.domElement.ownerDocument.addEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this.onPointerlockError))}),s(this,"disconnect",()=>{this.domElement&&(this.domElement.ownerDocument.removeEventListener("mousemove",this.onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this.onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this.onPointerlockError))}),s(this,"dispose",()=>{this.disconnect()}),s(this,"getObject",()=>this.camera),s(this,"direction",new c.Pa4(0,0,-1)),s(this,"getDirection",e=>e.copy(this.direction).applyQuaternion(this.camera.quaternion)),s(this,"moveForward",e=>{p.setFromMatrixColumn(this.camera.matrix,0),p.crossVectors(this.camera.up,p),this.camera.position.addScaledVector(p,e)}),s(this,"moveRight",e=>{p.setFromMatrixColumn(this.camera.matrix,0),this.camera.position.addScaledVector(p,e)}),s(this,"lock",()=>{this.domElement&&this.domElement.requestPointerLock()}),s(this,"unlock",()=>{this.domElement&&this.domElement.ownerDocument.exitPointerLock()}),this.camera=e,this.domElement=a,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,a&&this.connect(a)}}let v=n.forwardRef(({domElement:e,selector:a,onChange:t,onLock:c,onUnlock:r,enabled:o=!0,makeDefault:l,...s},d)=>{let{camera:p,...f}=s,u=(0,b.D)(e=>e.setEvents),h=(0,b.D)(e=>e.gl),m=(0,b.D)(e=>e.camera),v=(0,b.D)(e=>e.invalidate),k=(0,b.D)(e=>e.events),x=(0,b.D)(e=>e.get),w=(0,b.D)(e=>e.set),j=p||m,y=e||k.connected||h.domElement,S=n.useMemo(()=>new g(j),[j]);return n.useEffect(()=>{if(o){S.connect(y);let e=x().events.compute;return u({compute(e,a){let t=a.size.width/2,i=a.size.height/2;a.pointer.set(t/a.size.width*2-1,-(i/a.size.height*2)+1),a.raycaster.setFromCamera(a.pointer,a.camera)}}),()=>{S.disconnect(),u({compute:e})}}},[o,S]),n.useEffect(()=>{let e=e=>{v(),t&&t(e)};S.addEventListener("change",e),c&&S.addEventListener("lock",c),r&&S.addEventListener("unlock",r);let i=()=>S.lock(),b=a?Array.from(document.querySelectorAll(a)):[document];return b.forEach(e=>e&&e.addEventListener("click",i)),()=>{S.removeEventListener("change",e),c&&S.removeEventListener("lock",c),r&&S.removeEventListener("unlock",r),b.forEach(e=>e?e.removeEventListener("click",i):void 0)}},[t,c,r,a,S,v]),n.useEffect(()=>{if(l){let e=x().controls;return w({controls:S}),()=>w({controls:e})}},[l,S]),n.createElement("primitive",(0,i.Z)({ref:d,object:S},f))})},73420:function(e,a,t){t.d(a,{Z:function(){return o},c:function(){return r}});var i=t(52983),b=t(73542),n=t(75575);let c=i.createContext(null);function r({map:e,children:a,onChange:t,domElement:r}){let o=e.map(e=>e.name+e.keys).join("-"),l=i.useMemo(()=>(0,b.U)((0,n.XR)(()=>e.reduce((e,a)=>({...e,[a.name]:!1}),{}))),[o]),s=i.useMemo(()=>[l.subscribe,l.getState,l],[o]),d=l.setState;return i.useEffect(()=>{let a=e.map(({name:e,keys:a,up:i})=>({keys:a,up:i,fn:a=>{d({[e]:a}),t&&t(e,a,s[1]())}})).reduce((e,{keys:a,fn:t,up:i=!0})=>(a.forEach(a=>e[a]={fn:t,pressed:!1,up:i}),e),{}),i=({key:e,code:t})=>{let i=a[e]||a[t];if(!i)return;let{fn:b,pressed:n,up:c}=i;i.pressed=!0,(c||!n)&&b(!0)},b=({key:e,code:t})=>{let i=a[e]||a[t];if(!i)return;let{fn:b,up:n}=i;i.pressed=!1,n&&b(!1)},n=r||window;return n.addEventListener("keydown",i,{passive:!0}),n.addEventListener("keyup",b,{passive:!0}),()=>{n.removeEventListener("keydown",i),n.removeEventListener("keyup",b)}},[r,o]),i.createElement(c.Provider,{value:s,children:a})}function o(e){let[a,t,b]=i.useContext(c);return e?b(e):[a,t]}},76137:function(e,a,t){t.d(a,{uV:function(){return i.u},BC:function(){return b.B}});var i=t(60576);!function(){var e=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),a=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if("object"==typeof WebAssembly){var t=WebAssembly.validate(e)?i("b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb"):i("b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb");WebAssembly.instantiate(t,{}).then(function(e){e.instance.exports.__wasm_call_ctors()})}function i(e){for(var t=new Uint8Array(e.length),i=0;i<e.length;++i){var b=e.charCodeAt(i);t[i]=b>96?b-97:b>64?b-39:b+4}for(var n=0,i=0;i<e.length;++i)t[n++]=t[i]<60?a[t[i]]:(t[i]-60)*64+t[++i];return t.buffer.slice(0,n)}}();var b=t(86963);t(74153)},12318:function(e,a,t){t.d(a,{E:function(){return d}});var i=t(97458),b=t(52983),n=t(62978),c=t.n(n),r=t(71525),o=t(62401),l=t(14692);let s={xs:20,sm:32,lg:40},d=b.forwardRef((e,a)=>{var t;let{onClick:b,icon:n,iconName:d,tooltipText:p,text:f,variant:u="tertiary",disabled:h=!1,loading:m=!1,size:g="lg",to:v,active:k,bare:x=!1,"aria-label":w="tool",...j}=e,y=s[g];return(0,i.jsx)(r.u,{placement:"top",label:p,borderRadius:"md",children:(0,i.jsx)(o.h,{...j,ref:a,as:v&&!h?c():"button",...v&&!h&&{href:null==v?void 0:v.href,target:null!==(t=null==v?void 0:v.target)&&void 0!==t?t:"_self"},width:"".concat(y,"px"),height:"".concat(y,"px"),minWidth:"".concat(y,"px"),icon:null!=n?n:(0,i.jsx)(l.J,{name:d,fallbackText:f,height:"".concat(y-("xs"!==g?16:4),"px"),width:"".concat(y-("xs"!==g?16:4),"px")}),"aria-label":w,padding:"1",onClick:b,isDisabled:h,isLoading:m,bg:k?void 0:x?"transparent":"bg.surface",borderColor:k?void 0:x?"transparent":"ghost"===u?"border.default":"border.dark",borderWidth:k?void 0:x?"0":"1px",borderStyle:"solid",_hover:{bg:k?void 0:"bg.hover"},sx:{color:k?"icon.active !important":"icon.default !important"},...k?{colorScheme:"teal"}:{}})})})},88574:function(e,a,t){t.d(a,{T:function(){return c}});var i=t(97458),b=t(52983),n=t(3347);let c=e=>{let{rgba:a,onBlur:t}=e,[c,r]=(0,b.useState)(a),o="#"+a.slice(0,3).map(e=>255*e).map(e=>Math.round(e).toString(16).padStart(2,"0")).join(""),l=e=>{r([parseInt(e.substr(1,2),16)/255,parseInt(e.substr(3,2),16)/255,parseInt(e.substr(5,2),16)/255,1])};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(n.I,{type:"color",width:"100%",height:"64px",p:0,value:o,onChange:e=>l(e.currentTarget.value),onBlur:()=>{t(c)}})})}},37794:function(e,a,t){t.a(e,async function(e,i){try{t.d(a,{m:function(){return l}});var b=t(52983),n=t(3529),c=t(38316),r=t(59467),o=e([r]);function l(){let[e,a]=(0,b.useState)(null),[t,i]=(0,b.useState)(null),[o,l]=(0,b.useState)(0),[s,d]=(0,b.useState)([]),[p,f]=(0,b.useState)(!0);(0,b.useEffect)(()=>{let e=!1;return(async()=>{try{let b=await (0,c.o5)();if(e)return;if(b){var t;a(b.fileName),d(null!==(t=b.modBlocks)&&void 0!==t?t:[]),b.colorOverrides&&((0,r.E1)(b.colorOverrides),l(b.colorOverrides.size));let o=await n.dataManager.getModAssetData(c.VI);!e&&o&&i(o)}}catch(e){}finally{e||f(!1)}})(),()=>{e=!0}},[]);let u=(0,b.useCallback)(async e=>{var t;await (0,c.bh)(e.fileName,e.atlas,e.colorOverrides,e.modBlocks,null!==(t=e.wasBedrock)&&void 0!==t&&t),e.assetRecord&&await n.dataManager.addModAssetData({...e.assetRecord,id:c.VI}),(0,r.E1)(e.colorOverrides),a(e.fileName),i(e.assetRecord?{...e.assetRecord,id:c.VI}:null),l(e.colorOverrides.size),d(e.modBlocks)},[]),h=(0,b.useCallback)(async()=>{(0,r.Id)(),await (0,c.FJ)(),await n.dataManager.clearModAssetData(c.VI),a(null),i(null),l(0),d([])},[]);return(0,b.useMemo)(()=>({fileName:e,assetRecord:t,colorOverrideCount:o,modBlocks:s,isLoading:p,save:u,clear:h}),[e,t,o,s,p,u,h])}r=(o.then?(await o)():o)[0],i()}catch(e){i(e)}})},69:function(e,a,t){t.a(e,async function(e,i){try{t.d(a,{W:function(){return e}});var b=t(65753),n=t(29068);let e=e=>{if("string"!=typeof e||0===e.length)return;let a=(0,n.IX)(e),t=(0,b.U)("string"==typeof(null==a?void 0:a.name)&&a.name.length?a.name:e.split("[")[0]),i=null==a?void 0:a.state;if(!i||"object"!=typeof i)return t;let c=Object.entries(i).filter(e=>{let[a]=e;return!function(e){let a=String(null!=e?e:"").toLowerCase();return!!a&&!!("__entity"===a||"_entity"===a||"nbt"===a||"_nbt"===a||"__nbt"===a||"material"===a||"_material"===a||"__material"===a||(a.startsWith("_")||a.startsWith("__"))&&a.endsWith("nbt")||(a.startsWith("_")||a.startsWith("__"))&&a.endsWith("material"))}(a)}).map(e=>{let[a,t]=e,i=Array.isArray(t)?t[0]:t;return[a,i]}).filter(e=>{let[,a]=e;return null!=a&&String(a).length>0}).sort((e,a)=>{let[t]=e,[i]=a;return t.localeCompare(i)});return 0===c.length?t:"".concat(t,"[").concat(c.map(e=>{let[a,t]=e;return"".concat(a,"=").concat(String(t))}).join(","),"]")};i()}catch(e){i(e)}})},59467:function(e,a,t){t.a(e,async function(e,i){try{t.d(a,{E1:function(){return n},Id:function(){return c}});var b=t(87617);let e=null;function n(a){if(!e)for(let a of(e=new Map,b.k2))a.rgba&&e.set(a.id,{...a.rgba});for(let[e,t]of a){let a=b.JH[e];a&&(a.rgba=t)}}function c(){if(e){for(let[a,t]of e){let e=b.JH[a];e&&(e.rgba=t)}e=null}}i()}catch(e){i(e)}})},67844:function(e,a,t){t.d(a,{X:function(){return w}});var i=t(52983),b=t(20879),n=t(25610),c=t(97458);function r(e){return(0,c.jsx)(n.m.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...e,children:(0,c.jsx)("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function o(e){return(0,c.jsx)(n.m.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...e,children:(0,c.jsx)("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function l(e){let{isIndeterminate:a,isChecked:t,...i}=e;return t||a?(0,c.jsx)(n.m.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:(0,c.jsx)(a?o:r,{...i})}):null}var s=t(78486),d=t(19938),p=t(10915),f=t(26398),u=t(15627),h=t(42089),m={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},g={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},v=(0,p.F4)({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),k=(0,p.F4)({from:{opacity:0},to:{opacity:1}}),x=(0,p.F4)({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),w=(0,f.G)(function(e,a){let t=(0,b.J)(),r={...t,...e},o=(0,u.jC)("Checkbox",r),p=(0,h.Lr)(e),{spacing:f="0.5rem",className:w,children:j,iconColor:y,iconSize:S,icon:E=(0,c.jsx)(l,{}),isChecked:A,isDisabled:z=null==t?void 0:t.isDisabled,onChange:F,inputProps:H,...O}=p,G=A;(null==t?void 0:t.value)&&p.value&&(G=t.value.includes(p.value));let q=F;(null==t?void 0:t.onChange)&&p.value&&(q=(0,d.PP)(t.onChange,F));let{state:R,getInputProps:C,getCheckboxProps:D,getLabelProps:U,getRootProps:L}=(0,s.O)({...O,isDisabled:z,isChecked:G,onChange:q}),P=function(e){let[a,t]=(0,i.useState)(e),[b,n]=(0,i.useState)(!1);return e!==a&&(n(!0),t(e)),b}(R.isChecked),M=(0,i.useMemo)(()=>({animation:P?R.isIndeterminate?`${k} 20ms linear, ${x} 200ms linear`:`${v} 200ms linear`:void 0,fontSize:S,color:y,...o.icon}),[y,S,P,R.isIndeterminate,o.icon]),W=(0,i.cloneElement)(E,{__css:M,isIndeterminate:R.isIndeterminate,isChecked:R.isChecked});return(0,c.jsxs)(n.m.label,{__css:{...g,...o.container},className:(0,d.cx)("chakra-checkbox",w),...L(),children:[(0,c.jsx)("input",{className:"chakra-checkbox__input",...C(H,a)}),(0,c.jsx)(n.m.span,{__css:{...m,...o.control},className:"chakra-checkbox__control",...D(),children:W}),j&&(0,c.jsx)(n.m.span,{className:"chakra-checkbox__label",...U(),__css:{marginStart:f,...o.label},children:j})]})});w.displayName="Checkbox"},20879:function(e,a,t){t.d(a,{J:function(){return b},z:function(){return i}});var[i,b]=(0,t(96248).k)({name:"CheckboxGroupContext",strict:!1})},45276:function(e,a,t){t.d(a,{C:function(){return l}});var i=t(26398),b=t(15627),n=t(42089),c=t(25610),r=t(19938),o=t(97458),l=(0,i.G)(function(e,a){let t=(0,b.mq)("Badge",e),{className:i,...l}=(0,n.Lr)(e);return(0,o.jsx)(c.m.span,{ref:a,className:(0,r.cx)("chakra-badge",e.className),...l,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...t}})});l.displayName="Badge"},88105:function(e,a,t){t.d(a,{I:function(){return b}});var i=t(52983);function b(e){let a=(0,i.useRef)(null);return a.current=e,a}},59201:function(e,a,t){function i(e,a="page"){return e.touches?function(e,a="page"){let t=e.touches[0]||e.changedTouches[0];return{x:t[`${a}X`],y:t[`${a}Y`]}}(e,a):function(e,a="page"){return{x:e[`${a}X`],y:e[`${a}Y`]}}(e,a)}function b(e,a,t,b){var n;return n=function(e,a=!1){function t(a){e(a,{point:i(a)})}return a?e=>{let a=function(e){var a;let t=null!=(a=e.view)?a:window;return void 0!==t.PointerEvent&&e instanceof t.PointerEvent?!("mouse"!==e.pointerType):e instanceof t.MouseEvent}(e);(!a||a&&0===e.button)&&t(e)}:t}(t,"pointerdown"===a),e.addEventListener(a,n,b),()=>{e.removeEventListener(a,n,b)}}t.d(a,{O:function(){return G}});let n=1/60*1e3,c="undefined"!=typeof performance?()=>performance.now():()=>Date.now(),r="undefined"!=typeof window?e=>window.requestAnimationFrame(e):e=>setTimeout(()=>e(c()),n),o=!0,l=!1,s=!1,d={delta:0,timestamp:0},p=["read","update","preRender","render","postRender"],f=p.reduce((e,a)=>(e[a]=function(e){let a=[],t=[],i=0,b=!1,n=!1,c=new WeakSet,r={schedule:(e,n=!1,r=!1)=>{let o=r&&b,l=o?a:t;return n&&c.add(e),-1===l.indexOf(e)&&(l.push(e),o&&b&&(i=a.length)),e},cancel:e=>{let a=t.indexOf(e);-1!==a&&t.splice(a,1),c.delete(e)},process:o=>{if(b){n=!0;return}if(b=!0,[a,t]=[t,a],t.length=0,i=a.length)for(let t=0;t<i;t++){let i=a[t];i(o),c.has(i)&&(r.schedule(i),e())}b=!1,n&&(n=!1,r.process(o))}};return r}(()=>l=!0),e),{}),u=p.reduce((e,a)=>{let t=f[a];return e[a]=(e,a=!1,i=!1)=>(l||v(),t.schedule(e,a,i)),e},{}),h=p.reduce((e,a)=>(e[a]=f[a].cancel,e),{});p.reduce((e,a)=>(e[a]=()=>f[a].process(d),e),{});let m=e=>f[e].process(d),g=e=>{l=!1,d.delta=o?n:Math.max(Math.min(e-d.timestamp,40),1),d.timestamp=e,s=!0,p.forEach(m),s=!1,l&&(o=!1,r(g))},v=()=>{l=!0,o=!0,s||r(g)},k=()=>d;var x=Object.defineProperty,w=(e,a,t)=>a in e?x(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,j=(e,a,t)=>(w(e,"symbol"!=typeof a?a+"":a,t),t),y=class{constructor(e,a,t){var n;if(j(this,"history",[]),j(this,"startEvent",null),j(this,"lastEvent",null),j(this,"lastEventInfo",null),j(this,"handlers",{}),j(this,"removeListeners",()=>{}),j(this,"threshold",3),j(this,"win"),j(this,"updatePoint",()=>{var e,a;if(!(this.lastEvent&&this.lastEventInfo))return;let t=E(this.lastEventInfo,this.history),i=null!==this.startEvent,b=(e=t.offset,a={x:0,y:0},(F(e)&&F(a)?Math.sqrt(z(e.x,a.x)**2+z(e.y,a.y)**2):0)>=this.threshold);if(!i&&!b)return;let{timestamp:n}=k();this.history.push({...t.point,timestamp:n});let{onStart:c,onMove:r}=this.handlers;i||(null==c||c(this.lastEvent,t),this.startEvent=this.lastEvent),null==r||r(this.lastEvent,t)}),j(this,"onPointerMove",(e,a)=>{this.lastEvent=e,this.lastEventInfo=a,u.update(this.updatePoint,!0)}),j(this,"onPointerUp",(e,a)=>{let t=E(a,this.history),{onEnd:i,onSessionEnd:b}=this.handlers;null==b||b(e,t),this.end(),i&&this.startEvent&&(null==i||i(e,t))}),this.win=null!=(n=e.view)?n:window,e.touches&&e.touches.length>1)return;this.handlers=a,t&&(this.threshold=t),e.stopPropagation(),e.preventDefault();let c={point:i(e)},{timestamp:r}=k();this.history=[{...c.point,timestamp:r}];let{onSessionStart:o}=a;null==o||o(e,E(c,this.history)),this.removeListeners=function(...e){return a=>e.reduce((e,a)=>a(e),a)}(b(this.win,"pointermove",this.onPointerMove),b(this.win,"pointerup",this.onPointerUp),b(this.win,"pointercancel",this.onPointerUp))}updateHandlers(e){this.handlers=e}end(){var e;null==(e=this.removeListeners)||e.call(this),h.update(this.updatePoint)}};function S(e,a){return{x:e.x-a.x,y:e.y-a.y}}function E(e,a){return{point:e.point,delta:S(e.point,a[a.length-1]),offset:S(e.point,a[0]),velocity:function(e,a){if(e.length<2)return{x:0,y:0};let t=e.length-1,i=null,b=e[e.length-1];for(;t>=0&&(i=e[t],!(b.timestamp-i.timestamp>A(.1)));)t--;if(!i)return{x:0,y:0};let n=(b.timestamp-i.timestamp)/1e3;if(0===n)return{x:0,y:0};let c={x:(b.x-i.x)/n,y:(b.y-i.y)/n};return c.x===1/0&&(c.x=0),c.y===1/0&&(c.y=0),c}(a,0)}}var A=e=>1e3*e;function z(e,a){return Math.abs(e-a)}function F(e){return"x"in e&&"y"in e}var H=t(88105),O=t(52983);function G(e,a){let{onPan:t,onPanStart:i,onPanEnd:n,onPanSessionStart:c,onPanSessionEnd:r,threshold:o}=a,l=!!(t||i||n||c||r),s=(0,O.useRef)(null),d=(0,H.I)({onSessionStart:c,onSessionEnd:r,onStart:i,onMove:t,onEnd(e,a){s.current=null,null==n||n(e,a)}});(0,O.useEffect)(()=>{var e;null==(e=s.current)||e.updateHandlers(d.current)}),(0,O.useEffect)(()=>{let a=e.current;if(a&&l)return b(a,"pointerdown",function(e){s.current=new y(e,d.current,o)})},[e,l,d,o]),(0,O.useEffect)(()=>()=>{var e;null==(e=s.current)||e.end(),s.current=null},[])}},2377:function(e,a,t){t.d(a,{t:function(){return c},M:function(){return n}});var i=t(52983),b=(null==globalThis?void 0:globalThis.document)?i.useLayoutEffect:i.useEffect;function n({getNodes:e,observeMutation:a=!0}){let[t,n]=(0,i.useState)([]),[c,r]=(0,i.useState)(0);return b(()=>{let t=e(),i=t.map((e,a)=>(function(e,a){if(!e){a(void 0);return}a({width:e.offsetWidth,height:e.offsetHeight});let t=new(e.ownerDocument.defaultView??window).ResizeObserver(t=>{let i,b;if(!Array.isArray(t)||!t.length)return;let[n]=t;if("borderBoxSize"in n){let e=n.borderBoxSize,a=Array.isArray(e)?e[0]:e;i=a.inlineSize,b=a.blockSize}else i=e.offsetWidth,b=e.offsetHeight;a({width:i,height:b})});return t.observe(e,{box:"border-box"}),()=>t.unobserve(e)})(e,e=>{n(t=>[...t.slice(0,a),e,...t.slice(a+1)])}));if(a){let e=t[0];i.push(function(e,a){var t,i;if(!e||!e.parentElement)return;let b=new(null!=(i=null==(t=e.ownerDocument)?void 0:t.defaultView)?i:window).MutationObserver(()=>{a()});return b.observe(e.parentElement,{childList:!0}),()=>{b.disconnect()}}(e,()=>{r(e=>e+1)}))}return()=>{i.forEach(e=>{null==e||e()})}},[c]),t}function c(e){let[a]=n({observeMutation:!1,getNodes:()=>["object"==typeof e&&null!==e&&"current"in e?e.current:e]});return a}},1517:function(e,a,t){t.d(a,{iR:function(){return E},Ms:function(){return F},jz:function(){return H},gs:function(){return A},Uj:function(){return z}});var i=t(43146),b=t(94970),n=t(59201),c=t(3431),r=t(36938),o=t(79206),l=t(2377),s=t(16227),d=t(88105),p=t(94086),f=t(52983),u=t(96248),h=t(26398),m=t(15627),g=t(42089),v=t(61112),k=t(25610),x=t(97458),[w,j]=(0,u.k)({name:"SliderContext",hookName:"useSliderContext",providerName:"<Slider />"}),[y,S]=(0,u.k)({name:"SliderStylesContext",hookName:"useSliderStyles",providerName:"<Slider />"}),E=(0,h.G)((e,a)=>{var t;let u={...e,orientation:null!=(t=null==e?void 0:e.orientation)?t:"horizontal"},h=(0,m.jC)("Slider",u),j=(0,g.Lr)(u),{direction:S}=(0,v.F)();j.direction=S;let{getInputProps:E,getRootProps:A,...z}=function(e){var a;let{min:t=0,max:u=100,onChange:h,value:m,defaultValue:g,isReversed:v,direction:k="ltr",orientation:x="horizontal",id:w,isDisabled:j,isReadOnly:y,onChangeStart:S,onChangeEnd:E,step:A=1,getAriaValueText:z,"aria-valuetext":F,"aria-label":H,"aria-labelledby":O,name:G,focusThumbOnChange:q=!0,...R}=e,C=(0,c.W)(S),D=(0,c.W)(E),U=(0,c.W)(z),L=(0,b.XY)({isReversed:v,direction:k,orientation:x}),[P,M]=(0,o.T)({value:m,defaultValue:null!=g?g:u<t?t:t+(u-t)/2,onChange:h}),[W,Q]=(0,f.useState)(!1),[K,B]=(0,f.useState)(!1),T=!(j||y),_=(u-t)/10,J=A||(u-t)/100,N=(0,p.HU)(P,t,u),Y=u-N+t,Z=L?Y:N,V=(0,p.Rg)(Z,t,u),X="vertical"===x,I=(0,d.I)({min:t,max:u,step:A,isDisabled:j,value:N,isInteractive:T,isReversed:L,isVertical:X,eventSource:null,focusThumbOnChange:q,orientation:x}),$=(0,f.useRef)(null),ee=(0,f.useRef)(null),ea=(0,f.useRef)(null),et=(0,f.useId)(),ei=null!=w?w:et,[eb,en]=[`slider-thumb-${ei}`,`slider-track-${ei}`],ec=(0,f.useCallback)(e=>{var a,t;if(!$.current)return;let i=I.current;i.eventSource="pointer";let b=$.current.getBoundingClientRect(),{clientX:n,clientY:c}=null!=(t=null==(a=e.touches)?void 0:a[0])?t:e,r=(X?b.bottom-c:n-b.left)/(X?b.height:b.width);L&&(r=1-r);let o=(0,p.WS)(r,i.min,i.max);return i.step&&(o=parseFloat((0,p.WP)(o,i.min,i.step))),o=(0,p.HU)(o,i.min,i.max)},[X,L,I]),er=(0,f.useCallback)(e=>{let a=I.current;a.isInteractive&&(e=parseFloat((0,p.WP)(e,a.min,J)),M(e=(0,p.HU)(e,a.min,a.max)))},[J,M,I]),eo=(0,f.useMemo)(()=>({stepUp(e=J){er(L?N-e:N+e)},stepDown(e=J){er(L?N+e:N-e)},reset(){er(g||0)},stepTo(e){er(e)}}),[er,L,N,J,g]),el=(0,f.useCallback)(e=>{let a=I.current,t={ArrowRight:()=>eo.stepUp(),ArrowUp:()=>eo.stepUp(),ArrowLeft:()=>eo.stepDown(),ArrowDown:()=>eo.stepDown(),PageUp:()=>eo.stepUp(_),PageDown:()=>eo.stepDown(_),Home:()=>er(a.min),End:()=>er(a.max)}[e.key];t&&(e.preventDefault(),e.stopPropagation(),t(e),a.eventSource="keyboard")},[eo,er,_,I]),es=null!=(a=null==U?void 0:U(N))?a:F,ed=(0,l.t)(ee),{getThumbStyle:ep,rootStyle:ef,trackStyle:eu,innerTrackStyle:eh}=(0,f.useMemo)(()=>{let e=I.current,a=null!=ed?ed:{width:0,height:0};return(0,b.Wi)({isReversed:L,orientation:e.orientation,thumbRects:[a],thumbPercents:[V]})},[L,ed,V,I]),em=(0,f.useCallback)(()=>{I.current.focusThumbOnChange&&setTimeout(()=>{var e;return null==(e=ee.current)?void 0:e.focus()})},[I]);function eg(e){let a=ec(e);null!=a&&a!==I.current.value&&M(a)}(0,r.r)(()=>{let e=I.current;em(),"keyboard"===e.eventSource&&(null==D||D(e.value))},[N,D]),(0,n.O)(ea,{onPanSessionStart(e){let a=I.current;a.isInteractive&&(Q(!0),em(),eg(e),null==C||C(a.value))},onPanSessionEnd(){let e=I.current;e.isInteractive&&(Q(!1),null==D||D(e.value))},onPan(e){I.current.isInteractive&&eg(e)}});let ev=(0,f.useCallback)((e={},a=null)=>({...e,...R,ref:(0,s.lq)(a,ea),tabIndex:-1,"aria-disabled":(0,i.Qm)(j),"data-focused":(0,i.PB)(K),style:{...e.style,...ef}}),[R,j,K,ef]),ek=(0,f.useCallback)((e={},a=null)=>({...e,ref:(0,s.lq)(a,$),id:en,"data-disabled":(0,i.PB)(j),style:{...e.style,...eu}}),[j,en,eu]),ex=(0,f.useCallback)((e={},a=null)=>({...e,ref:a,style:{...e.style,...eh}}),[eh]),ew=(0,f.useCallback)((e={},a=null)=>({...e,ref:(0,s.lq)(a,ee),role:"slider",tabIndex:T?0:void 0,id:eb,"data-active":(0,i.PB)(W),"aria-valuetext":es,"aria-valuemin":t,"aria-valuemax":u,"aria-valuenow":N,"aria-orientation":x,"aria-disabled":(0,i.Qm)(j),"aria-readonly":(0,i.Qm)(y),"aria-label":H,"aria-labelledby":H?void 0:O,style:{...e.style,...ep(0)},onKeyDown:(0,i.v0)(e.onKeyDown,el),onFocus:(0,i.v0)(e.onFocus,()=>B(!0)),onBlur:(0,i.v0)(e.onBlur,()=>B(!1))}),[T,eb,W,es,t,u,N,x,j,y,H,O,ep,el]),ej=(0,f.useCallback)((e,a=null)=>{let b=!(e.value<t||e.value>u),n=N>=e.value,c=(0,p.Rg)(e.value,t,u),r={position:"absolute",pointerEvents:"none",...function(e){let{orientation:a,vertical:t,horizontal:i}=e;return"vertical"===a?t:i}({orientation:x,vertical:{bottom:L?`${100-c}%`:`${c}%`},horizontal:{left:L?`${100-c}%`:`${c}%`}})};return{...e,ref:a,role:"presentation","aria-hidden":!0,"data-disabled":(0,i.PB)(j),"data-invalid":(0,i.PB)(!b),"data-highlighted":(0,i.PB)(n),style:{...e.style,...r}}},[j,L,u,t,x,N]),ey=(0,f.useCallback)((e={},a=null)=>({...e,ref:a,type:"hidden",value:N,name:G}),[G,N]);return{state:{value:N,isFocused:K,isDragging:W},actions:eo,getRootProps:ev,getTrackProps:ek,getInnerTrackProps:ex,getThumbProps:ew,getMarkerProps:ej,getInputProps:ey}}(j),F=A(),H=E({},a);return(0,x.jsx)(w,{value:z,children:(0,x.jsx)(y,{value:h,children:(0,x.jsxs)(k.m.div,{...F,className:(0,i.cx)("chakra-slider",u.className),__css:h.container,children:[u.children,(0,x.jsx)("input",{...H})]})})})});E.displayName="Slider";var A=(0,h.G)((e,a)=>{let{getThumbProps:t}=j(),b=S(),n=t(e,a);return(0,x.jsx)(k.m.div,{...n,className:(0,i.cx)("chakra-slider__thumb",e.className),__css:b.thumb})});A.displayName="SliderThumb";var z=(0,h.G)((e,a)=>{let{getTrackProps:t}=j(),b=S(),n=t(e,a);return(0,x.jsx)(k.m.div,{...n,className:(0,i.cx)("chakra-slider__track",e.className),__css:b.track})});z.displayName="SliderTrack";var F=(0,h.G)((e,a)=>{let{getInnerTrackProps:t}=j(),b=S(),n=t(e,a);return(0,x.jsx)(k.m.div,{...n,className:(0,i.cx)("chakra-slider__filled-track",e.className),__css:b.filledTrack})});F.displayName="SliderFilledTrack";var H=(0,h.G)((e,a)=>{let{getMarkerProps:t}=j(),b=S(),n=t(e,a);return(0,x.jsx)(k.m.div,{...n,className:(0,i.cx)("chakra-slider__marker",e.className),__css:b.mark})});H.displayName="SliderMark"},43146:function(e,a,t){t.d(a,{PB:function(){return i},Qm:function(){return b},cx:function(){return n},v0:function(){return c}});var i=e=>e?"":void 0,b=e=>!!e||void 0,n=(...e)=>e.filter(Boolean).join(" ");function c(...e){return function(a){e.some(e=>(null==e||e(a),null==a?void 0:a.defaultPrevented))}}},94970:function(e,a,t){function i(e){return{root:`slider-root-${e}`,getThumb:a=>`slider-thumb-${e}-${a}`,getInput:a=>`slider-input-${e}-${a}`,track:`slider-track-${e}`,innerTrack:`slider-filled-track-${e}`,getMarker:a=>`slider-marker-${e}-${a}`,output:`slider-output-${e}`}}function b(e){let{orientation:a,vertical:t,horizontal:i}=e;return"vertical"===a?t:i}t.d(a,{Wi:function(){return r},XY:function(){return o},fL:function(){return b},s3:function(){return i}});var n={width:0,height:0},c=e=>e||n;function r(e){let{orientation:a,thumbPercents:t,thumbRects:i,isReversed:r}=e,o="vertical"===a?i.reduce((e,a)=>c(e).height>c(a).height?e:a,n):i.reduce((e,a)=>c(e).width>c(a).width?e:a,n),l={position:"relative",touchAction:"none",WebkitTapHighlightColor:"rgba(0,0,0,0)",userSelect:"none",outline:0,...b({orientation:a,vertical:o?{paddingLeft:o.width/2,paddingRight:o.width/2}:{},horizontal:o?{paddingTop:o.height/2,paddingBottom:o.height/2}:{}})},s={position:"absolute",...b({orientation:a,vertical:{left:"50%",transform:"translateX(-50%)",height:"100%"},horizontal:{top:"50%",transform:"translateY(-50%)",width:"100%"}})},d=1===t.length,p=[0,r?100-t[0]:t[0]],f=d?p:t,u=f[0];!d&&r&&(u=100-u);let h=Math.abs(f[f.length-1]-f[0]),m={...s,...b({orientation:a,vertical:r?{height:`${h}%`,top:`${u}%`}:{height:`${h}%`,bottom:`${u}%`},horizontal:r?{width:`${h}%`,right:`${u}%`}:{width:`${h}%`,left:`${u}%`}})};return{trackStyle:s,innerTrackStyle:m,rootStyle:l,getThumbStyle:e=>{var c;let r=null!=(c=i[e])?c:n;return{position:"absolute",userSelect:"none",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",touchAction:"none",...b({orientation:a,vertical:{bottom:`calc(${t[e]}% - ${r.height/2}px)`},horizontal:{left:`calc(${t[e]}% - ${r.width/2}px)`}})}}}}function o(e){let{isReversed:a,direction:t,orientation:i}=e;return"ltr"===t||"vertical"===i?a:!a}},40393:function(e,a,t){t.d(a,{Lj:function(){return i},Sh:function(){return c},js:function(){return n},p$:function(){return r}});var i={ease:[.25,.1,.25,1],easeIn:[.4,0,1,1],easeOut:[0,0,.2,1],easeInOut:[.4,0,.2,1]},b={slideLeft:{position:{left:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"-100%",y:0}},slideRight:{position:{right:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"100%",y:0}},slideUp:{position:{top:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"-100%"}},slideDown:{position:{bottom:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"100%"}}};function n(e){var a;switch(null!=(a=null==e?void 0:e.direction)?a:"right"){case"right":default:return b.slideRight;case"left":return b.slideLeft;case"bottom":return b.slideDown;case"top":return b.slideUp}}var c={enter:{duration:.2,ease:i.easeOut},exit:{duration:.1,ease:i.easeIn}},r={enter:(e,a)=>({...e,delay:"number"==typeof a?a:null==a?void 0:a.enter}),exit:(e,a)=>({...e,delay:"number"==typeof a?a:null==a?void 0:a.exit})}},1848:function(e,a,t){t.d(a,{U:function(){return p}});var i=t(40393),b=t(19938),n=t(44659),c=t(39267),r=t(52983),o=t(97458),l=e=>null!=e&&parseInt(e.toString(),10)>0,s={exit:{height:{duration:.2,ease:i.Lj.ease},opacity:{duration:.3,ease:i.Lj.ease}},enter:{height:{duration:.3,ease:i.Lj.ease},opacity:{duration:.4,ease:i.Lj.ease}}},d={exit:({animateOpacity:e,startingHeight:a,transition:t,transitionEnd:b,delay:n})=>{var c;return{...e&&{opacity:l(a)?1:0},height:a,transitionEnd:null==b?void 0:b.exit,transition:null!=(c=null==t?void 0:t.exit)?c:i.p$.exit(s.exit,n)}},enter:({animateOpacity:e,endingHeight:a,transition:t,transitionEnd:b,delay:n})=>{var c;return{...e&&{opacity:1},height:a,transitionEnd:null==b?void 0:b.enter,transition:null!=(c=null==t?void 0:t.enter)?c:i.p$.enter(s.enter,n)}}},p=(0,r.forwardRef)((e,a)=>{let{in:t,unmountOnExit:i,animateOpacity:l=!0,startingHeight:s=0,endingHeight:p="auto",style:f,className:u,transition:h,transitionEnd:m,...g}=e,[v,k]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=setTimeout(()=>{k(!0)});return()=>clearTimeout(e)},[]),(0,b.ZK)({condition:Number(s)>0&&!!i,message:"startingHeight and unmountOnExit are mutually exclusive. You can't use them together"});let x=parseFloat(s.toString())>0,w={startingHeight:s,endingHeight:p,animateOpacity:l,transition:v?h:{enter:{duration:0}},transitionEnd:{enter:null==m?void 0:m.enter,exit:i?null==m?void 0:m.exit:{...null==m?void 0:m.exit,display:x?"block":"none"}}},j=!i||t,y=t||i?"enter":"exit";return(0,o.jsx)(n.M,{initial:!1,custom:w,children:j&&(0,o.jsx)(c.E.div,{ref:a,...g,className:(0,b.cx)("chakra-collapse",u),style:{overflow:"hidden",display:"block",...f},custom:w,variants:d,initial:!!i&&"exit",animate:y,exit:"exit"})})});p.displayName="Collapse"},4642:function(e,a,t){t.d(a,{JW:function(){return c},Of:function(){return b},fd:function(){return n}});var i=t(76858);let b=(e,a)=>{if(void 0===e.h||void 0===a.h||!e.s||!a.s)return 0;let t=(0,i.Z)(e.h),b=(0,i.Z)(a.h);return 2*Math.sqrt(e.s*a.s)*Math.sin((b-t+360)/2*Math.PI/180)},n=(e,a)=>{if(void 0===e.h||void 0===a.h)return 0;let t=(0,i.Z)(e.h),b=(0,i.Z)(a.h);return Math.abs(b-t)>180?t-(b-360*Math.sign(b-t)):b-t},c=(e,a)=>{if(void 0===e.h||void 0===a.h||!e.c||!a.c)return 0;let t=(0,i.Z)(e.h),b=(0,i.Z)(a.h);return 2*Math.sqrt(e.c*a.c)*Math.sin((b-t+360)/2*Math.PI/180)}},21835:function(e,a,t){t.d(a,{_J6:function(){return U.Z},jcS:function(){return C.Z},lq$:function(){return D.Z},oWk:function(){return L.Z},qA$:function(){return P.Z}});var i=t(86373),b=t(7399),n=t(78724),c=t(5677),r=t(62915),o=t(75496),l=t(70127),s=t(26921),d=t(1014),p=t(82095),f=t(1009),u=t(32768),h=t(91647),m=t(41432),g=t(62782),v=t(48949),k=t(94067),x=t(54630),w=t(50749),j=t(49550),y=t(36572),S=t(29021),E=t(19995),A=t(30327),z=t(85923),F=t(11183),H=t(14945),O=t(59205),G=t(44657),q=t(73860),R=t(51729),C=t(65562),D=t(78180),U=t(8665),L=t(17791),P=t(85052);(0,R.yU)(i.Z),(0,R.yU)(b.Z),(0,R.yU)(n.Z),(0,R.yU)(c.Z),(0,R.yU)(r.Z),(0,R.yU)(o.Z),(0,R.yU)(l.Z),(0,R.yU)(s.Z),(0,R.yU)(d.Z),(0,R.yU)(p.Z),(0,R.yU)(f.Z),(0,R.yU)(u.Z),(0,R.yU)(h.Z),(0,R.yU)(m.Z),(0,R.yU)(g.Z),(0,R.yU)(v.Z),(0,R.yU)(k.Z),(0,R.yU)(x.Z),(0,R.yU)(w.Z),(0,R.yU)(j.Z),(0,R.yU)(y.Z),(0,R.yU)(S.Z),(0,R.yU)(E.Z),(0,R.yU)(A.Z),(0,R.yU)(z.Z),(0,R.yU)(F.Z),(0,R.yU)(H.Z),(0,R.yU)(O.Z),(0,R.yU)(G.Z),(0,R.yU)(q.Z)},4248:function(e,a,t){t.d(a,{i:function(){return i}});let i=parseInt(t(9375).UZH.replace(/\D+/g,""))},61261:function(e,a,t){t.d(a,{Y:function(){return n}});var i=t(16808),b=t(9375);i.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new b.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},i.ShaderLib.line={uniforms:b.rDY.merge([i.UniformsLib.common,i.UniformsLib.fog,i.UniformsLib.line]),vertexShader:`
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
		`};class n extends b.jyz{constructor(e){super({type:"LineMaterial",uniforms:b.rDY.clone(i.ShaderLib.line.uniforms),vertexShader:i.ShaderLib.line.vertexShader,fragmentShader:i.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}},12904:function(e,a,t){let i,b;t.d(a,{w:function(){return j}});var n=t(9375),c=t(90845),r=t(61261);let o=new n.Ltg,l=new n.Pa4,s=new n.Pa4,d=new n.Ltg,p=new n.Ltg,f=new n.Ltg,u=new n.Pa4,h=new n.yGw,m=new n.Zzh,g=new n.Pa4,v=new n.ZzF,k=new n.aLr,x=new n.Ltg;function w(e,a,t){return x.set(0,0,-a,1).applyMatrix4(e.projectionMatrix),x.multiplyScalar(1/x.w),x.x=b/t.width,x.y=b/t.height,x.applyMatrix4(e.projectionMatrixInverse),x.multiplyScalar(1/x.w),Math.abs(Math.max(x.x,x.y))}class j extends n.Kj0{constructor(e=new c.z,a=new r.Y({color:16777215*Math.random()})){super(e,a),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,a=e.attributes.instanceStart,t=e.attributes.instanceEnd,i=new Float32Array(2*a.count);for(let e=0,b=0,n=a.count;e<n;e++,b+=2)l.fromBufferAttribute(a,e),s.fromBufferAttribute(t,e),i[b]=0===b?0:i[b-1],i[b+1]=i[b]+l.distanceTo(s);let b=new n.$TI(i,2,1);return e.setAttribute("instanceDistanceStart",new n.kB5(b,1,0)),e.setAttribute("instanceDistanceEnd",new n.kB5(b,1,1)),this}raycast(e,a){let t,c;let r=this.material.worldUnits,o=e.camera;null!==o||r||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let s=this.matrixWorld,x=this.geometry,j=this.material;if(b=j.linewidth+l,null===x.boundingSphere&&x.computeBoundingSphere(),k.copy(x.boundingSphere).applyMatrix4(s),r)t=.5*b;else{let e=Math.max(o.near,k.distanceToPoint(i.origin));t=w(o,e,j.resolution)}if(k.radius+=t,!1!==i.intersectsSphere(k)){if(null===x.boundingBox&&x.computeBoundingBox(),v.copy(x.boundingBox).applyMatrix4(s),r)c=.5*b;else{let e=Math.max(o.near,v.distanceToPoint(i.origin));c=w(o,e,j.resolution)}v.expandByScalar(c),!1!==i.intersectsBox(v)&&(r?function(e,a){let t=e.matrixWorld,c=e.geometry,r=c.attributes.instanceStart,o=c.attributes.instanceEnd,l=Math.min(c.instanceCount,r.count);for(let c=0;c<l;c++){m.start.fromBufferAttribute(r,c),m.end.fromBufferAttribute(o,c),m.applyMatrix4(t);let l=new n.Pa4,s=new n.Pa4;i.distanceSqToSegment(m.start,m.end,s,l),s.distanceTo(l)<.5*b&&a.push({point:s,pointOnLine:l,distance:i.origin.distanceTo(s),object:e,face:null,faceIndex:c,uv:null,uv1:null})}}(this,a):function(e,a,t){let c=a.projectionMatrix,r=e.material.resolution,o=e.matrixWorld,l=e.geometry,s=l.attributes.instanceStart,v=l.attributes.instanceEnd,k=Math.min(l.instanceCount,s.count),x=-a.near;i.at(1,f),f.w=1,f.applyMatrix4(a.matrixWorldInverse),f.applyMatrix4(c),f.multiplyScalar(1/f.w),f.x*=r.x/2,f.y*=r.y/2,f.z=0,u.copy(f),h.multiplyMatrices(a.matrixWorldInverse,o);for(let a=0;a<k;a++){if(d.fromBufferAttribute(s,a),p.fromBufferAttribute(v,a),d.w=1,p.w=1,d.applyMatrix4(h),p.applyMatrix4(h),d.z>x&&p.z>x)continue;if(d.z>x){let e=d.z-p.z,a=(d.z-x)/e;d.lerp(p,a)}else if(p.z>x){let e=p.z-d.z,a=(p.z-x)/e;p.lerp(d,a)}d.applyMatrix4(c),p.applyMatrix4(c),d.multiplyScalar(1/d.w),p.multiplyScalar(1/p.w),d.x*=r.x/2,d.y*=r.y/2,p.x*=r.x/2,p.y*=r.y/2,m.start.copy(d),m.start.z=0,m.end.copy(p),m.end.z=0;let l=m.closestPointToPointParameter(u,!0);m.at(l,g);let f=n.M8C.lerp(d.z,p.z,l),k=f>=-1&&f<=1,w=u.distanceTo(g)<.5*b;if(k&&w){m.start.fromBufferAttribute(s,a),m.end.fromBufferAttribute(v,a),m.start.applyMatrix4(o),m.end.applyMatrix4(o);let b=new n.Pa4,c=new n.Pa4;i.distanceSqToSegment(m.start,m.end,c,b),t.push({point:c,pointOnLine:b,distance:i.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,uv1:null})}}}(this,o,a))}}onBeforeRender(e){let a=this.material.uniforms;a&&a.resolution&&(e.getViewport(o),this.material.uniforms.resolution.value.set(o.z,o.w))}}},90845:function(e,a,t){t.d(a,{z:function(){return c}});var i=t(9375);let b=new i.ZzF,n=new i.Pa4;class c extends i.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new i.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new i.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let a=this.attributes.instanceStart,t=this.attributes.instanceEnd;return void 0!==a&&(a.applyMatrix4(e),t.applyMatrix4(e),a.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let a;e instanceof Float32Array?a=e:Array.isArray(e)&&(a=new Float32Array(e));let t=new i.$TI(a,6,1);return this.setAttribute("instanceStart",new i.kB5(t,3,0)),this.setAttribute("instanceEnd",new i.kB5(t,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let a;e instanceof Float32Array?a=e:Array.isArray(e)&&(a=new Float32Array(e));let t=new i.$TI(a,6,1);return this.setAttribute("instanceColorStart",new i.kB5(t,3,0)),this.setAttribute("instanceColorEnd",new i.kB5(t,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new i.Uk6(e.geometry)),this}fromLineSegments(e){let a=e.geometry;return this.setPositions(a.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new i.ZzF);let e=this.attributes.instanceStart,a=this.attributes.instanceEnd;void 0!==e&&void 0!==a&&(this.boundingBox.setFromBufferAttribute(e),b.setFromBufferAttribute(a),this.boundingBox.union(b))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new i.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,a=this.attributes.instanceEnd;if(void 0!==e&&void 0!==a){let t=this.boundingSphere.center;this.boundingBox.getCenter(t);let i=0;for(let b=0,c=e.count;b<c;b++)n.fromBufferAttribute(e,b),i=Math.max(i,t.distanceToSquared(n)),n.fromBufferAttribute(a,b),i=Math.max(i,t.distanceToSquared(n));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}},75575:function(e,a,t){t.d(a,{XR:function(){return i}});let i=e=>(a,t,i)=>{let b=i.subscribe;return i.subscribe=(e,a,t)=>{let n=e;if(a){let b=(null==t?void 0:t.equalityFn)||Object.is,c=e(i.getState());n=t=>{let i=e(t);if(!b(c,i)){let e=c;a(c=i,e)}},(null==t?void 0:t.fireImmediately)&&a(c,c)}return b(n)},e(a,t,i)}},73542:function(e,a,t){t.d(a,{U:function(){return o},o:function(){return c}});var i=t(52983),b=t(98565);let n=e=>e;function c(e,a=n){let t=i.useSyncExternalStore(e.subscribe,i.useCallback(()=>a(e.getState()),[e,a]),i.useCallback(()=>a(e.getInitialState()),[e,a]));return i.useDebugValue(t),t}let r=e=>{let a=(0,b.M)(e),t=e=>c(a,e);return Object.assign(t,a),t},o=e=>e?r(e):r},98565:function(e,a,t){t.d(a,{M:function(){return b}});let i=e=>{let a;let t=new Set,i=(e,i)=>{let b="function"==typeof e?e(a):e;if(!Object.is(b,a)){let e=a;a=(null!=i?i:"object"!=typeof b||null===b)?b:Object.assign({},a,b),t.forEach(t=>t(a,e))}},b=()=>a,n={setState:i,getState:b,getInitialState:()=>c,subscribe:e=>(t.add(e),()=>t.delete(e))},c=a=e(i,b,n);return n},b=e=>e?i(e):i}}]);