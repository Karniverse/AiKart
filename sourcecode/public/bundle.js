!function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function l(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const i="undefined"!=typeof window;let c=i?()=>window.performance.now():()=>Date.now(),u=i?t=>requestAnimationFrame(t):t;const a=new Set;function f(t){a.forEach((e=>{e.c(t)||(a.delete(e),e.f())})),0!==a.size&&u(f)}function d(t,e){t.appendChild(e)}function g(t,e,n){t.insertBefore(e,n||null)}function m(t){t.parentNode.removeChild(t)}function h(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function p(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function $(){return y(" ")}function b(t,e,n,l){return t.addEventListener(e,n,l),()=>t.removeEventListener(e,n,l)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const w=new Set;let _,E=0;function x(t,e,n,l,o,r,s,i=0){const c=16.666/l;let u="{\n";for(let t=0;t<=1;t+=c){const l=e+(n-e)*r(t);u+=100*t+`%{${s(l,1-l)}}\n`}const a=u+`100% {${s(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(a)}_${i}`,d=t.ownerDocument;w.add(d);const g=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild(p("style")).sheet),m=d.__svelte_rules||(d.__svelte_rules={});m[f]||(m[f]=!0,g.insertRule(`@keyframes ${f} ${a}`,g.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?`${h}, `:""}${f} ${l}ms linear ${o}ms 1 both`,E+=1,f}function k(t,e){const n=(t.style.animation||"").split(", "),l=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-l.length;o&&(t.style.animation=l.join(", "),E-=o,E||u((()=>{E||(w.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),w.clear())})))}function q(t){_=t}function L(t){(function(){if(!_)throw new Error("Function called outside component initialization");return _})().$$.on_mount.push(t)}const A=[],I=[],C=[],T=[],M=Promise.resolve();let S=!1;function B(t){C.push(t)}let j=!1;const H=new Set;function N(){if(!j){j=!0;do{for(let t=0;t<A.length;t+=1){const e=A[t];q(e),O(e.$$)}for(q(null),A.length=0;I.length;)I.pop()();for(let t=0;t<C.length;t+=1){const e=C[t];H.has(e)||(H.add(e),e())}C.length=0}while(A.length);for(;T.length;)T.pop()();S=!1,j=!1,H.clear()}}function O(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(B)}}let P;function R(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const z=new Set;let D;function F(t,e){t&&t.i&&(z.delete(t),t.i(e))}function K(t,e,n,l){if(t&&t.o){if(z.has(t))return;z.add(t),D.c.push((()=>{z.delete(t),l&&(n&&t.d(1),l())})),t.o(e)}}const X={duration:0};function G(n,l,s,i){let d=l(n,s),g=i?0:1,m=null,h=null,p=null;function y(){p&&k(n,p)}function $(t,e){const n=t.b-g;return e*=Math.abs(n),{a:g,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function b(l){const{delay:r=0,duration:s=300,easing:i=e,tick:b=t,css:v}=d||X,w={start:c()+r,b:l};l||(w.group=D,D.r+=1),m||h?h=w:(v&&(y(),p=x(n,g,l,s,r,i,v)),l&&b(0,1),m=$(w,s),B((()=>R(n,l,"start"))),function(t){let e;0===a.size&&u(f),new Promise((n=>{a.add(e={c:t,f:n})}))}((t=>{if(h&&t>h.start&&(m=$(h,s),h=null,R(n,m.b,"start"),v&&(y(),p=x(n,g,m.b,m.duration,0,i,d.css))),m)if(t>=m.end)b(g=m.b,1-g),R(n,m.b,"end"),h||(m.b?y():--m.group.r||o(m.group.c)),m=null;else if(t>=m.start){const e=t-m.start;g=m.a+m.d*i(e/m.duration),b(g,1-g)}return!(!m&&!h)})))}return{run(t){r(d)?(P||(P=Promise.resolve(),P.then((()=>{P=null}))),P).then((()=>{d=d(),b(t)})):b(t)},end(){y(),m=h=null}}}function J(t){t&&t.c()}function Q(t,e,l){const{fragment:s,on_mount:i,on_destroy:c,after_update:u}=t.$$;s&&s.m(e,l),B((()=>{const e=i.map(n).filter(r);c?c.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(B)}function U(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function V(t,e){-1===t.$$.dirty[0]&&(A.push(t),S||(S=!0,M.then(N)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(e,n,r,s,i,c,u=[-1]){const a=_;q(e);const f=n.props||{},d=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:i,bound:l(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:l(),dirty:u,skip_bound:!1};let g=!1;if(d.ctx=r?r(e,f,((t,n,...l)=>{const o=l.length?l[0]:n;return d.ctx&&i(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),g&&V(e,t)),n})):[],d.update(),g=!0,o(d.before_update),d.fragment=!!s&&s(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(m)}else d.fragment&&d.fragment.c();n.intro&&F(e.$$.fragment),Q(e,n.target,n.anchor),N()}q(a)}class Y{$destroy(){U(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Z(e){let n,l,r,s,i,c,u,a,f,h,w,_,E,x,k,q;return{c(){n=p("div"),l=p("div"),r=p("button"),r.innerHTML='<img class="homeimage svelte-7yq4ya" src="home.png" alt="buttonpng" border="0"/> \n            <br/>Home',s=$(),i=p("button"),i.innerHTML='<img class="homeimage svelte-7yq4ya" src="play.png" alt="buttonpng" border="0"/> \n            <br/>SlideShow',c=$(),u=p("div"),u.innerHTML='<img class="headerimg svelte-7yq4ya" src="header.gif"/>',a=$(),f=p("div"),h=y("Total Images"),w=p("br"),_=y(e[1]),E=$(),x=p("div"),x.innerHTML='<img src="" alt="" class="svelte-7yq4ya"/>',v(r,"class","svelte-7yq4ya"),v(i,"class","svelte-7yq4ya"),v(l,"class","homebtn svelte-7yq4ya"),v(u,"class","introimage svelte-7yq4ya"),v(f,"class","count svelte-7yq4ya"),v(x,"id","fullscreen-slideshow"),v(x,"class","fullscreen-slideshow svelte-7yq4ya"),v(n,"class","card svelte-7yq4ya")},m(t,o){g(t,n,o),d(n,l),d(l,r),d(l,s),d(l,i),d(n,c),d(n,u),d(n,a),d(n,f),d(f,h),d(f,w),d(f,_),d(n,E),d(n,x),k||(q=[b(r,"click",e[7]),b(i,"click",e[8]),b(x,"click",e[3])],k=!0)},p(t,[e]){2&e&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(_,t[1])},i:t,o:t,d(t){t&&m(n),k=!1,o(q)}}}function tt(t){const e=document.getElementById("fullscreen-slideshow");e&&(e.style.display="flex",e.querySelector("img").src=t)}function et(){window.location="https://www.karmukil.in"}function nt(t,e,n){let l,{title:o="AiKart"}=e,{description:r="I'm KarMukil, this page exclusively showcases my AI art.<br>All wallpapers are free to download"}=e,s=0,i=0,{imageEntries:c=[]}=e;function u(){if(0===c.length)return;let t=-1;function e(){let e;do{e=Math.floor(Math.random()*c.length)}while(e===t);return t=e,e}i=e(),tt(c[i].full),l=setInterval((()=>{i=e(),tt(c[i].full)}),4e3)}function a(){clearInterval(l);const t=document.getElementById("fullscreen-slideshow");t&&(t.style.display="none")}L((()=>{window.addEventListener("keydown",(t=>{"Escape"===t.key&&a()}))})),window.addEventListener("load",(()=>{setTimeout((()=>{const t=document.querySelector(".gallery");t&&(n(1,s=t.getElementsByTagName("img").length),n(4,c=Array.from(t.getElementsByTagName("img")).map((t=>({full:t.src.replace("th/","")})))))}),1e3)}));return t.$$set=t=>{"title"in t&&n(5,o=t.title),"description"in t&&n(6,r=t.description),"imageEntries"in t&&n(4,c=t.imageEntries)},[et,s,u,a,c,o,r,()=>et(),()=>u()]}class lt extends Y{constructor(t){super(),W(this,t,nt,Z,s,{title:5,description:6,imageEntries:4,homepage:0})}get homepage(){return et}}function ot(t,{delay:n=0,duration:l=400,easing:o=e}){const r=+getComputedStyle(t).opacity;return{delay:n,duration:l,easing:o,css:t=>"opacity: "+t*r}}function rt(t,e,n){const l=t.slice();return l[14]=e[n],l}function st(t,e,n){const l=t.slice();return l[17]=e[n],l}function it(t){let e,n,l,o;function r(...e){return t[10](t[17],...e)}return{c(){e=p("img"),e.src!==(n=t[17].thumb)&&v(e,"src",n),v(e,"alt","Gallery Image"),v(e,"loading","lazy"),v(e,"class","svelte-imghby")},m(t,n){g(t,e,n),l||(o=b(e,"click",r),l=!0)},p(l,o){t=l,1&o&&e.src!==(n=t[17].thumb)&&v(e,"src",n)},d(t){t&&m(e),l=!1,o()}}}function ct(t){let e,n,l,r,s,i,c,u,a,f,y,w,_,E=t[0],x=[];for(let e=0;e<E.length;e+=1)x[e]=ut(rt(t,E,e));return{c(){e=p("div"),n=p("button"),n.textContent="❮",l=$(),r=p("img"),i=$(),c=p("button"),c.textContent="❯",u=$(),a=p("div");for(let t=0;t<x.length;t+=1)x[t].c();v(n,"class","prev svelte-imghby"),r.src!==(s=t[1])&&v(r,"src",s),v(r,"alt","Full Image"),v(r,"class","svelte-imghby"),v(c,"class","next svelte-imghby"),v(a,"class","thumbnails svelte-imghby"),v(e,"class","lightbox svelte-imghby")},m(o,s){g(o,e,s),d(e,n),d(e,l),d(e,r),d(e,i),d(e,c),d(e,u),d(e,a);for(let t=0;t<x.length;t+=1)x[t].m(a,null);y=!0,w||(_=[b(n,"click",t[5]),b(c,"click",t[4]),b(e,"click",t[3]),b(e,"touchstart",t[7]),b(e,"touchend",t[8])],w=!0)},p(t,e){if((!y||2&e&&r.src!==(s=t[1]))&&v(r,"src",s),65&e){let n;for(E=t[0],n=0;n<E.length;n+=1){const l=rt(t,E,n);x[n]?x[n].p(l,e):(x[n]=ut(l),x[n].c(),x[n].m(a,null))}for(;n<x.length;n+=1)x[n].d(1);x.length=E.length}},i(t){y||(B((()=>{f||(f=G(e,ot,{},!0)),f.run(1)})),y=!0)},o(t){f||(f=G(e,ot,{},!1)),f.run(0),y=!1},d(t){t&&m(e),h(x,t),t&&f&&f.end(),w=!1,o(_)}}}function ut(t){let e,n,l,o;function r(...e){return t[11](t[14],...e)}return{c(){e=p("img"),e.src!==(n=t[14].thumb)&&v(e,"src",n),v(e,"class","svelte-imghby")},m(t,n){g(t,e,n),l||(o=b(e,"click",r),l=!0)},p(l,o){t=l,1&o&&e.src!==(n=t[14].thumb)&&v(e,"src",n)},d(t){t&&m(e),l=!1,o()}}}function at(t){let e,n,l,r,s,i,c=t[0],u=[];for(let e=0;e<c.length;e+=1)u[e]=it(st(t,c,e));let a=t[1]&&ct(t);return{c(){e=p("div");for(let t=0;t<u.length;t+=1)u[t].c();n=$(),a&&a.c(),l=y(""),v(e,"class","gallery svelte-imghby")},m(o,c){g(o,e,c);for(let t=0;t<u.length;t+=1)u[t].m(e,null);g(o,n,c),a&&a.m(o,c),g(o,l,c),r=!0,s||(i=b(window,"keydown",t[9]),s=!0)},p(t,[n]){if(5&n){let l;for(c=t[0],l=0;l<c.length;l+=1){const o=st(t,c,l);u[l]?u[l].p(o,n):(u[l]=it(o),u[l].c(),u[l].m(e,null))}for(;l<u.length;l+=1)u[l].d(1);u.length=c.length}t[1]?a?(a.p(t,n),2&n&&F(a,1)):(a=ct(t),a.c(),F(a,1),a.m(l.parentNode,l)):a&&(D={r:0,c:[],p:D},K(a,1,1,(()=>{a=null})),D.r||o(D.c),D=D.p)},i(t){r||(F(a),r=!0)},o(t){K(a),r=!1},d(t){t&&m(e),h(u,t),t&&m(n),a&&a.d(t),t&&m(l),s=!1,i()}}}const ft="https://karmukil.tunnelagent.com/AiKart/";function dt(t,e,n){let{imageEntries:l=[]}=e,o=null,r=0;function s(t){n(1,o=t)}function i(t){t&&t.stopPropagation();let e=l.findIndex((t=>t.full===o));e<l.length-1&&n(1,o=l[e+1].full)}function c(t){t&&t.stopPropagation();let e=l.findIndex((t=>t.full===o));e>0&&n(1,o=l[e-1].full)}function u(t,e){t.stopPropagation(),n(1,o=e)}!async function(){try{const t=await fetch(ft),e=await t.text(),o=[],r=/<a href="([^"]+\.(jpg|png|gif|jpeg|webp))">.*?<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/gi;let s;for(;null!==(s=r.exec(e));){const t=s[1],e=s[3],n=new Date(e.replace(/-/g," "));o.push({thumb:`${ft}th/${t}`,full:`${ft}${t}`,date:n})}o.sort(((t,e)=>e.date-t.date)),n(0,l=[...o])}catch(t){n(0,l=[]),l.push({thumb:"error.jpg",full:"error.jpg"})}}();return t.$$set=t=>{"imageEntries"in t&&n(0,l=t.imageEntries)},[l,o,s,function(t){t.target.classList.contains("lightbox")&&n(1,o=null)},i,c,u,function(t){r=t.touches[0].clientX},function(t){let e=t.changedTouches[0].clientX;r-e>50?i(t):e-r>50&&c(t)},function(t){o&&("ArrowRight"===t.key?i():"ArrowLeft"===t.key?c():"Escape"===t.key&&n(1,o=null))},t=>s(t.full),(t,e)=>u(e,t.full)]}class gt extends Y{constructor(t){super(),W(this,t,dt,at,s,{imageEntries:0})}}function mt(e){let n;return{c(){n=p("div"),n.innerHTML='<input type="text" id="searchBox" placeholder="Search images..." onkeyup="filterImages()" class="svelte-1yigw7f"/>',v(n,"class","search svelte-1yigw7f")},m(t,e){g(t,n,e)},p:t,i:t,o:t,d(t){t&&m(n)}}}function ht(t){return document.addEventListener("DOMContentLoaded",(function(){document.getElementById("searchBox").addEventListener("keyup",(function(){let t=document.getElementById("searchBox").value.toLowerCase();document.querySelectorAll(".gallery img").forEach((e=>{let n=e.src.toLowerCase();e.style.display=n.includes(t)?"block":"none"}))}))})),[]}class pt extends Y{constructor(t){super(),W(this,t,ht,mt,s,{})}}function yt(e){let n,l,o,r,s,i,c;return l=new lt({}),r=new pt({}),i=new gt({}),{c(){n=p("div"),J(l.$$.fragment),o=$(),J(r.$$.fragment),s=$(),J(i.$$.fragment)},m(t,e){g(t,n,e),Q(l,n,null),d(n,o),Q(r,n,null),d(n,s),Q(i,n,null),c=!0},p:t,i(t){c||(F(l.$$.fragment,t),F(r.$$.fragment,t),F(i.$$.fragment,t),c=!0)},o(t){K(l.$$.fragment,t),K(r.$$.fragment,t),K(i.$$.fragment,t),c=!1},d(t){t&&m(n),U(l),U(r),U(i)}}}new class extends Y{constructor(t){super(),W(this,t,null,yt,s,{})}}({target:document.body})}();
