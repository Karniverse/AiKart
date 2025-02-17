!function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function l(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const c="undefined"!=typeof window;let i=c?()=>window.performance.now():()=>Date.now(),u=c?t=>requestAnimationFrame(t):t;const a=new Set;function f(t){a.forEach((e=>{e.c(t)||(a.delete(e),e.f())})),0!==a.size&&u(f)}function d(t,e){t.appendChild(e)}function g(t,e,n){t.insertBefore(e,n||null)}function h(t){t.parentNode.removeChild(t)}function p(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function m(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function y(){return $(" ")}function v(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function _(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const x=new Set;let b,w=0;function k(t,e,n,r,o,l,s,c=0){const i=16.666/r;let u="{\n";for(let t=0;t<=1;t+=i){const r=e+(n-e)*l(t);u+=100*t+`%{${s(r,1-r)}}\n`}const a=u+`100% {${s(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(a)}_${c}`,d=t.ownerDocument;x.add(d);const g=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild(m("style")).sheet),h=d.__svelte_rules||(d.__svelte_rules={});h[f]||(h[f]=!0,g.insertRule(`@keyframes ${f} ${a}`,g.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${f} ${r}ms linear ${o}ms 1 both`,w+=1,f}function E(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-r.length;o&&(t.style.animation=r.join(", "),w-=o,w||u((()=>{w||(x.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),x.clear())})))}function A(t){b=t}const C=[],L=[],O=[],I=[],M=Promise.resolve();let S=!1;function j(t){O.push(t)}let B=!1;const P=new Set;function T(){if(!B){B=!0;do{for(let t=0;t<C.length;t+=1){const e=C[t];A(e),D(e.$$)}for(A(null),C.length=0;L.length;)L.pop()();for(let t=0;t<O.length;t+=1){const e=O[t];P.has(e)||(P.add(e),e())}O.length=0}while(C.length);for(;I.length;)I.pop()();S=!1,B=!1,P.clear()}}function D(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(j)}}let K;function N(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const R=new Set;let U;function q(t,e){t&&t.i&&(R.delete(t),t.i(e))}function z(t,e,n,r){if(t&&t.o){if(R.has(t))return;R.add(t),U.c.push((()=>{R.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}const H={duration:0};function F(n,r,s,c){let d=r(n,s),g=c?0:1,h=null,p=null,m=null;function $(){m&&E(n,m)}function y(t,e){const n=t.b-g;return e*=Math.abs(n),{a:g,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function v(r){const{delay:l=0,duration:s=300,easing:c=e,tick:v=t,css:_}=d||H,x={start:i()+l,b:r};r||(x.group=U,U.r+=1),h||p?p=x:(_&&($(),m=k(n,g,r,s,l,c,_)),r&&v(0,1),h=y(x,s),j((()=>N(n,r,"start"))),function(t){let e;0===a.size&&u(f),new Promise((n=>{a.add(e={c:t,f:n})}))}((t=>{if(p&&t>p.start&&(h=y(p,s),p=null,N(n,h.b,"start"),_&&($(),m=k(n,g,h.b,h.duration,0,c,d.css))),h)if(t>=h.end)v(g=h.b,1-g),N(n,h.b,"end"),p||(h.b?$():--h.group.r||o(h.group.c)),h=null;else if(t>=h.start){const e=t-h.start;g=h.a+h.d*c(e/h.duration),v(g,1-g)}return!(!h&&!p)})))}return{run(t){l(d)?(K||(K=Promise.resolve(),K.then((()=>{K=null}))),K).then((()=>{d=d(),v(t)})):v(t)},end(){$(),h=p=null}}}function X(t){t&&t.c()}function G(t,e,r){const{fragment:s,on_mount:c,on_destroy:i,after_update:u}=t.$$;s&&s.m(e,r),j((()=>{const e=c.map(n).filter(l);i?i.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(j)}function J(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(C.push(t),S||(S=!0,M.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function V(e,n,l,s,c,i,u=[-1]){const a=b;A(e);const f=n.props||{},d=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:r(),dirty:u,skip_bound:!1};let g=!1;if(d.ctx=l?l(e,f,((t,n,...r)=>{const o=r.length?r[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),g&&Q(e,t)),n})):[],d.update(),g=!0,o(d.before_update),d.fragment=!!s&&s(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(h)}else d.fragment&&d.fragment.c();n.intro&&q(e.$$.fragment),G(e,n.target,n.anchor),T()}A(a)}class W{$destroy(){J(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Y(e){let n,r,o,l,s,c;return{c(){n=m("div"),r=m("div"),o=m("div"),l=$(e[0]),s=y(),c=m("div"),_(o,"class","title svelte-1we3r7c"),_(c,"class","description svelte-1we3r7c"),_(r,"class","content svelte-1we3r7c"),_(n,"class","card svelte-1we3r7c")},m(t,i){g(t,n,i),d(n,r),d(r,o),d(o,l),d(r,s),d(r,c),c.innerHTML=e[1]},p(t,[e]){1&e&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(l,t[0]),2&e&&(c.innerHTML=t[1])},i:t,o:t,d(t){t&&h(n)}}}function Z(t,e,n){let{title:r="AiKart"}=e,{description:o="I'm KarMukil, this page exclusively showcases my AI art.<br>All wallpapers are free to download"}=e;return t.$$set=t=>{"title"in t&&n(0,r=t.title),"description"in t&&n(1,o=t.description)},[r,o]}class tt extends W{constructor(t){super(),V(this,t,Z,Y,s,{title:0,description:1})}}function et(t,{delay:n=0,duration:r=400,easing:o=e}){const l=+getComputedStyle(t).opacity;return{delay:n,duration:r,easing:o,css:t=>"opacity: "+t*l}}function nt(t,e,n){const r=t.slice();return r[13]=e[n],r}function rt(t,e,n){const r=t.slice();return r[16]=e[n],r}function ot(t){let e,n,r,o;function l(...e){return t[9](t[16],...e)}return{c(){e=m("img"),e.src!==(n=t[16])&&_(e,"src",n),_(e,"alt","Gallery Image"),_(e,"loading","lazy"),_(e,"class","svelte-1e3ylx2")},m(t,n){g(t,e,n),r||(o=v(e,"click",l),r=!0)},p(r,o){t=r,1&o&&e.src!==(n=t[16])&&_(e,"src",n)},d(t){t&&h(e),r=!1,o()}}}function lt(t){let e,n,r,l,s,c,i,u,a,f,$,x,b,w=t[0],k=[];for(let e=0;e<w.length;e+=1)k[e]=st(nt(t,w,e));return{c(){e=m("div"),n=m("button"),n.textContent="❮",r=y(),l=m("img"),c=y(),i=m("button"),i.textContent="❯",u=y(),a=m("div");for(let t=0;t<k.length;t+=1)k[t].c();_(n,"class","prev svelte-1e3ylx2"),l.src!==(s=t[1])&&_(l,"src",s),_(l,"alt","Full Image"),_(l,"class","svelte-1e3ylx2"),_(i,"class","next svelte-1e3ylx2"),_(a,"class","thumbnails svelte-1e3ylx2"),_(e,"class","lightbox svelte-1e3ylx2")},m(o,s){g(o,e,s),d(e,n),d(e,r),d(e,l),d(e,c),d(e,i),d(e,u),d(e,a);for(let t=0;t<k.length;t+=1)k[t].m(a,null);$=!0,x||(b=[v(n,"click",t[5]),v(i,"click",t[4]),v(e,"click",t[3]),v(e,"touchstart",t[7]),v(e,"touchend",t[8])],x=!0)},p(t,e){if((!$||2&e&&l.src!==(s=t[1]))&&_(l,"src",s),65&e){let n;for(w=t[0],n=0;n<w.length;n+=1){const r=nt(t,w,n);k[n]?k[n].p(r,e):(k[n]=st(r),k[n].c(),k[n].m(a,null))}for(;n<k.length;n+=1)k[n].d(1);k.length=w.length}},i(t){$||(j((()=>{f||(f=F(e,et,{},!0)),f.run(1)})),$=!0)},o(t){f||(f=F(e,et,{},!1)),f.run(0),$=!1},d(t){t&&h(e),p(k,t),t&&f&&f.end(),x=!1,o(b)}}}function st(t){let e,n,r,o;function l(...e){return t[10](t[13],...e)}return{c(){e=m("img"),e.src!==(n=t[13])&&_(e,"src",n),_(e,"class","svelte-1e3ylx2")},m(t,n){g(t,e,n),r||(o=v(e,"click",l),r=!0)},p(r,o){t=r,1&o&&e.src!==(n=t[13])&&_(e,"src",n)},d(t){t&&h(e),r=!1,o()}}}function ct(t){let e,n,r,l,s=t[0],c=[];for(let e=0;e<s.length;e+=1)c[e]=ot(rt(t,s,e));let i=t[1]&&lt(t);return{c(){e=m("div");for(let t=0;t<c.length;t+=1)c[t].c();n=y(),i&&i.c(),r=$(""),_(e,"class","gallery svelte-1e3ylx2")},m(t,o){g(t,e,o);for(let t=0;t<c.length;t+=1)c[t].m(e,null);g(t,n,o),i&&i.m(t,o),g(t,r,o),l=!0},p(t,[n]){if(5&n){let r;for(s=t[0],r=0;r<s.length;r+=1){const o=rt(t,s,r);c[r]?c[r].p(o,n):(c[r]=ot(o),c[r].c(),c[r].m(e,null))}for(;r<c.length;r+=1)c[r].d(1);c.length=s.length}t[1]?i?(i.p(t,n),2&n&&q(i,1)):(i=lt(t),i.c(),q(i,1),i.m(r.parentNode,r)):i&&(U={r:0,c:[],p:U},z(i,1,1,(()=>{i=null})),U.r||o(U.c),U=U.p)},i(t){l||(q(i),l=!0)},o(t){z(i),l=!1},d(t){t&&h(e),p(c,t),t&&h(n),i&&i.d(t),t&&h(r)}}}function it(t,e,n){let{imageUrls:r=[]}=e,o=null,l=0;function s(t){n(1,o=t)}function c(t){t.stopPropagation();let e=r.indexOf(o);e<r.length-1&&n(1,o=r[e+1])}function i(t){t.stopPropagation();let e=r.indexOf(o);e>0&&n(1,o=r[e-1])}function u(t,e){t.stopPropagation(),n(1,o=e)}!async function(){try{const t=await fetch("https://karmukil.tunnelagent.com/AiKart/"),e=await t.text(),o=[],l=/<a href="([^"]+\.(jpg|png|gif|jpeg|webp))">.*?<\/a>\s+(\d{2}-\w{3}-\d{4} \d{2}:\d{2})/gi;let s;for(;null!==(s=l.exec(e));){const t=s[1],e=s[3],n=new Date(e.replace(/-/g," "));o.push({url:`https://karmukil.tunnelagent.com/AiKart/${t}`,date:n})}o.sort(((t,e)=>e.date-t.date)),n(0,r=[...o.map((t=>t.url))])}catch(t){console.error("Error fetching images:",t)}}();return t.$$set=t=>{"imageUrls"in t&&n(0,r=t.imageUrls)},[r,o,s,function(t){t.target.classList.contains("lightbox")&&n(1,o=null)},c,i,u,function(t){l=t.touches[0].clientX},function(t){let e=t.changedTouches[0].clientX;l-e>50?c(t):e-l>50&&i(t)},t=>s(t),(t,e)=>u(e,t)]}class ut extends W{constructor(t){super(),V(this,t,it,ct,s,{imageUrls:0})}}function at(e){let n;return{c(){n=m("div"),n.innerHTML='<input type="text" id="searchBox" placeholder="Search images..." onkeyup="filterImages()" class="svelte-1yigw7f"/>',_(n,"class","search svelte-1yigw7f")},m(t,e){g(t,n,e)},p:t,i:t,o:t,d(t){t&&h(n)}}}function ft(t){return document.addEventListener("DOMContentLoaded",(function(){document.getElementById("searchBox").addEventListener("keyup",(function(){let t=document.getElementById("searchBox").value.toLowerCase();document.querySelectorAll(".gallery img").forEach((e=>{let n=e.src.toLowerCase();e.style.display=n.includes(t)?"block":"none"}))}))})),[]}class dt extends W{constructor(t){super(),V(this,t,ft,at,s,{})}}function gt(e){let n,r,o,l,s,c,i;return r=new tt({}),l=new dt({}),c=new ut({}),{c(){n=m("div"),X(r.$$.fragment),o=y(),X(l.$$.fragment),s=y(),X(c.$$.fragment)},m(t,e){g(t,n,e),G(r,n,null),d(n,o),G(l,n,null),d(n,s),G(c,n,null),i=!0},p:t,i(t){i||(q(r.$$.fragment,t),q(l.$$.fragment,t),q(c.$$.fragment,t),i=!0)},o(t){z(r.$$.fragment,t),z(l.$$.fragment,t),z(c.$$.fragment,t),i=!1},d(t){t&&h(n),J(r),J(l),J(c)}}}new class extends W{constructor(t){super(),V(this,t,null,gt,s,{})}}({target:document.body})}();
