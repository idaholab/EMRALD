/**
 * MAAP Input Parser v0.2.0
 *
 * Download the latest version from:
 * https://github.com/nmde/maap-input-parser/blob/main/dist/maap-inp-parser.js
 */
!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.maapInpParser=r():t.maapInpParser=r()}(self,(()=>(()=>{"use strict";var t={6:function(t,r,e){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});const u=n(e(759)),o=n(e(111));r.default=(0,o.default)(u.default)},954:(t,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.default=function t(r,e,n,u=[]){try{return{errors:u,input:e,output:r.parse(e,n)}}catch(o){const a=o;if(a.location&&!1!==(null==n?void 0:n.safeMode)){const o=e.split("\n"),s=a.location.start.line-1;return o[s]=`// ${o[s]}`,t(r,o.join("\n"),n,u.concat(a))}throw o}}},111:function(t,r,e){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});const u=n(e(954));r.default=function(t){const r={options:{safeMode:!0},parse:(e,n)=>(0,u.default)(t,e,Object.assign(Object.assign({},r.options),n))};return r}},759:t=>{function r(t,e,n,u){var o=Error.call(this,t);return Object.setPrototypeOf&&Object.setPrototypeOf(o,r.prototype),o.expected=e,o.found=n,o.location=u,o.name="SyntaxError",o}function e(t,r,e){return e=e||" ",t.length>r?t:(r-=t.length,t+(e+=e.repeat(r)).slice(0,r))}!function(t,r){function e(){this.constructor=t}e.prototype=r.prototype,t.prototype=new e}(r,Error),r.prototype.format=function(t){var r="Error: "+this.message;if(this.location){var n,u=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){u=t[n].text.split(/\r\n|\n|\r/g);break}var o=this.location.start,a=this.location.source+":"+o.line+":"+o.column;if(u){var s=this.location.end,i=e("",o.line.toString().length),c=u[o.line-1],f=o.line===s.line?s.column:c.length+1;r+="\n --\x3e "+a+"\n"+i+" |\n"+o.line+" | "+c+"\n"+i+" | "+e("",o.column-1)+e("",f-o.column,"^")}else r+="\n at "+a}return r},r.buildMessage=function(t,r){var e={literal:function(t){return'"'+u(t.text)+'"'},class:function(t){var r=t.parts.map((function(t){return Array.isArray(t)?o(t[0])+"-"+o(t[1]):o(t)}));return"["+(t.inverted?"^":"")+r+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function u(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function o(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function a(t){return e[t.type](t)}return"Expected "+function(t){var r,e,n=t.map(a);if(n.sort(),n.length>0){for(r=1,e=1;r<n.length;r++)n[r-1]!==n[r]&&(n[e]=n[r],e++);n.length=e}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+u(t)+'"':"end of input"}(r)+" found."},t.exports={SyntaxError:r,parse:function(t,e){var n,u,o,a,s={},i=(e=void 0!==e?e:{}).grammarSource,c={Start:Yt},f=Yt,l="**",v="TIMER",p=/^[\n\r\u2028\u2029]/,h=/^[a-zA-Z]/,A=/^[a-zA-Z0-9]/,d=/^[0-9]/,b=/^[1-9]/,C=/^[+\-]/,g=/^[a-zA-Z0-9:]/,y={type:"any"},m=Ht("\t",!1),x=Ht("\v",!1),L=Ht("\f",!1),w=Ht(" ",!1),E=Ht(" ",!1),I=Ht("\ufeff",!1),T=Bt(["\n","\r","\u2028","\u2029"],!1,!1),_=Ht("\n",!1),j=Ht("\r\n",!1),F=Ht("\r",!1),O=Ht("\u2028",!1),S=Ht("\u2029",!1),R=Ht("//",!1),N=Ht("!",!1),M=Ht("C ",!1),P=Ht("**",!1),k=Bt([["a","z"],["A","Z"]],!1,!1),U=Ht("$",!1),z=Ht("_",!1),Z=Ht("\\",!1),D=Bt([["a","z"],["A","Z"],["0","9"]],!1,!1),V=Ht("/",!1),$=Ht(".",!1),H=Ht("0",!1),B=Bt([["0","9"]],!1,!1),G=Bt([["1","9"]],!1,!1),K=Ht("e",!0),W=Bt(["+","-"],!1,!1),Y=Bt([["a","z"],["A","Z"],["0","9"],":"],!1,!1),q=Ht("#",!1),J=Ht("ACTION",!0),Q=Ht("ALIAS",!0),X=Ht("AS",!0),tt=Ht("END",!0),rt=Ht(" TIME",!0),et=Ht("F",!0),nt=Ht("FALSE",!0),ut=Ht("FUNCTION",!0),ot=Ht("INCLUDE",!0),at=Ht("INITIATOR",!0),st=Ht("S",!0),it=Ht("IF",!0),ct=Ht("IS",!0),ft=Ht("LOOKUP VARIABLE",!0),lt=Ht("OFF",!0),vt=Ht("ON",!0),pt=Ht("PARAMETER CHANGE",!0),ht=Ht("PARAMETER FILE",!0),At=Ht("PLOTFIL",!0),dt=Ht("SENSITIVITY",!0),bt=Ht("SET",!0),Ct=(Ht("SI",!0),Ht("T",!0)),gt=Ht("TIMER",!1),yt=Ht("TITLE",!0),mt=Ht("TRUE",!0),xt=Ht("USEREVT",!0),Lt=Ht("WHEN",!0),wt=Ht(",",!1),Et=Ht("(",!1),It=Ht(")",!1),Tt=Ht("*",!1),_t=Ht(">=",!1),jt=Ht("<=",!1),Ft=Ht(">",!1),Ot=Ht("<",!1),St=Ht("+",!1),Rt=Ht("-",!1),Nt=Ht("=",!1),Mt=function(){return parseFloat($t())},Pt=function(t,r){return[t].concat(Fr(r,1))},kt=0,Ut=0,zt=[{line:1,column:1}],Zt=0,Dt=[],Vt=0;if("startRule"in e){if(!(e.startRule in c))throw new Error("Can't start parsing from rule \""+e.startRule+'".');f=c[e.startRule]}function $t(){return t.substring(Ut,kt)}function Ht(t,r){return{type:"literal",text:t,ignoreCase:r}}function Bt(t,r,e){return{type:"class",parts:t,inverted:r,ignoreCase:e}}function Gt(r){var e,n=zt[r];if(n)return n;for(e=r-1;!zt[e];)e--;for(n={line:(n=zt[e]).line,column:n.column};e<r;)10===t.charCodeAt(e)?(n.line++,n.column=1):n.column++,e++;return zt[r]=n,n}function Kt(t,r){var e=Gt(t),n=Gt(r);return{source:i,start:{offset:t,line:e.line,column:e.column},end:{offset:r,line:n.line,column:n.column}}}function Wt(t){kt<Zt||(kt>Zt&&(Zt=kt,Dt=[]),Dt.push(t))}function Yt(){var t,r;return t=kt,vr(),r=function(){var t,r;return t=kt,(r=_r())===s&&(r=null),Ut=t,r={type:"program",value:r||[]}}(),vr(),Ut=t,r}function qt(){var r,e,n;return r=kt,e=kt,Vt++,n=function(){var r;return p.test(t.charAt(kt))?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(T)),r}(),Vt--,n===s?e=void 0:(kt=e,e=s),e!==s?(n=function(){var r;return t.length>kt?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(y)),r}(),n!==s?r=e=[e,n]:(kt=r,r=s)):(kt=r,r=s),r}function Jt(){var r;return 9===t.charCodeAt(kt)?(r="\t",kt++):(r=s,0===Vt&&Wt(m)),r===s&&(11===t.charCodeAt(kt)?(r="\v",kt++):(r=s,0===Vt&&Wt(x)),r===s&&(12===t.charCodeAt(kt)?(r="\f",kt++):(r=s,0===Vt&&Wt(L)),r===s&&(32===t.charCodeAt(kt)?(r=" ",kt++):(r=s,0===Vt&&Wt(w)),r===s&&(160===t.charCodeAt(kt)?(r=" ",kt++):(r=s,0===Vt&&Wt(E)),r===s&&(65279===t.charCodeAt(kt)?(r="\ufeff",kt++):(r=s,0===Vt&&Wt(I))))))),r}function Qt(){var r;return 10===t.charCodeAt(kt)?(r="\n",kt++):(r=s,0===Vt&&Wt(_)),r===s&&("\r\n"===t.substr(kt,2)?(r="\r\n",kt+=2):(r=s,0===Vt&&Wt(j)),r===s&&(13===t.charCodeAt(kt)?(r="\r",kt++):(r=s,0===Vt&&Wt(F)),r===s&&(8232===t.charCodeAt(kt)?(r="\u2028",kt++):(r=s,0===Vt&&Wt(O)),r===s&&(8233===t.charCodeAt(kt)?(r="\u2029",kt++):(r=s,0===Vt&&Wt(S)))))),r}function Xt(){var r,e,n,u;if(r=kt,e=function(){var r;return"//"===t.substr(kt,2)?(r="//",kt+=2):(r=s,0===Vt&&Wt(R)),r===s&&(33===t.charCodeAt(kt)?(r="!",kt++):(r=s,0===Vt&&Wt(N)),r===s&&("C "===t.substr(kt,2)?(r="C ",kt+=2):(r=s,0===Vt&&Wt(M)),r===s&&(t.substr(kt,2)===l?(r=l,kt+=2):(r=s,0===Vt&&Wt(P))))),r}(),e!==s){for(n=[],u=qt();u!==s;)n.push(u),u=qt();r=e=[e,n]}else kt=r,r=s;return r}function tr(){var r;return(r=or())===s&&(r=function(){var r,e,n,u,o,a,i;return r=kt,e=function(){var r,e,n,u,o;if(r=kt,(e=er())!==s)if(46===t.charCodeAt(kt)?(n=".",kt++):(n=s,0===Vt&&Wt($)),n!==s){for(u=[],o=nr();o!==s;)u.push(o),o=nr();(o=ur())===s&&(o=null),Ut=r,r=parseFloat($t())}else kt=r,r=s;else kt=r,r=s;if(r===s){if(r=kt,46===t.charCodeAt(kt)?(e=".",kt++):(e=s,0===Vt&&Wt($)),e!==s){if(n=[],(u=nr())!==s)for(;u!==s;)n.push(u),u=nr();else n=s;n!==s?((u=ur())===s&&(u=null),Ut=r,r=Mt()):(kt=r,r=s)}else kt=r,r=s;r===s&&(r=kt,(e=er())!==s?((n=ur())===s&&(n=null),Ut=r,r=Mt()):(kt=r,r=s))}return r}(),e!==s?(n=kt,Vt++,u=function(){var r;return h.test(t.charAt(kt))?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(k)),r===s&&(36===t.charCodeAt(kt)?(r="$",kt++):(r=s,0===Vt&&Wt(U)),r===s&&(95===t.charCodeAt(kt)?(r="_",kt++):(r=s,0===Vt&&Wt(z)),r===s&&(92===t.charCodeAt(kt)?(r="\\",kt++):(r=s,0===Vt&&Wt(Z))))),r}(),u===s&&(u=nr()),Vt--,u===s?n=void 0:(kt=n,n=s),n!==s?(u=kt,o=pr(),(a=rr())!==s?u=o=[o,a]:(kt=u,u=s),u===s&&(u=null),Ut=r,i=e,r={type:"number",units:(u||[])[1],value:i}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=ir()),r}function rr(){var r,e,n,u,o;if(r=kt,e=[],A.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=s,0===Vt&&Wt(D)),n!==s)for(;n!==s;)e.push(n),A.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=s,0===Vt&&Wt(D));else e=s;return e!==s?(n=kt,t.substr(kt,2)===l?(u=l,kt+=2):(u=s,0===Vt&&Wt(P)),u===s&&(47===t.charCodeAt(kt)?(u="/",kt++):(u=s,0===Vt&&Wt(V))),u!==s&&(o=rr())!==s?n=u=[u,o]:(kt=n,n=s),n===s&&(n=null),Ut=r,r=function(t,r){let e=t.join("");return r&&(e+=r[0]+r[1]),e}(e,n)):(kt=r,r=s),r}function er(){var r,e,n,u;if(48===t.charCodeAt(kt)?(r="0",kt++):(r=s,0===Vt&&Wt(H)),r===s)if(r=kt,e=function(){var r;return b.test(t.charAt(kt))?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(G)),r}(),e!==s){for(n=[],u=nr();u!==s;)n.push(u),u=nr();r=e=[e,n]}else kt=r,r=s;return r}function nr(){var r;return d.test(t.charAt(kt))?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(B)),r}function ur(){var r,e,n;return r=kt,e=function(){var r;return"e"===t.substr(kt,1).toLowerCase()?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(K)),r}(),e!==s?(n=function(){var r,e,n,u;if(r=kt,C.test(t.charAt(kt))?(e=t.charAt(kt),kt++):(e=s,0===Vt&&Wt(W)),e===s&&(e=null),n=[],(u=nr())!==s)for(;u!==s;)n.push(u),u=nr();else n=s;return n!==s?r=e=[e,n]:(kt=r,r=s),r}(),n!==s?r=e=[e,n]:(kt=r,r=s)):(kt=r,r=s),r}function or(){var r,e,n,u,o;return r=kt,e=function(){var r;return"true"===t.substr(kt,4).toLowerCase()?(r=t.substr(kt,4),kt+=4):(r=s,0===Vt&&Wt(mt)),r}(),e===s&&(e=function(){var r;return"false"===t.substr(kt,5).toLowerCase()?(r=t.substr(kt,5),kt+=5):(r=s,0===Vt&&Wt(nt)),r}(),e===s&&(e=function(){var r;return"t"===t.substr(kt,1).toLowerCase()?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(Ct)),r}(),e===s&&(e=function(){var r;return"f"===t.substr(kt,1).toLowerCase()?(r=t.charAt(kt),kt++):(r=s,0===Vt&&Wt(et)),r}()))),e!==s?(n=kt,Vt++,h.test(t.charAt(kt))?(u=t.charAt(kt),kt++):(u=s,0===Vt&&Wt(k)),Vt--,u===s?n=void 0:(kt=n,n=s),n!==s?(Ut=r,r={type:"boolean",value:"TRUE"===(o=e)||"T"===o}):(kt=r,r=s)):(kt=r,r=s),r}function ar(){var r,e,n,u;return r=kt,(e=fr())===s&&(e=lr())===s&&(e=cr()),e!==s?(n=kt,Vt++,h.test(t.charAt(kt))?(u=t.charAt(kt),kt++):(u=s,0===Vt&&Wt(k)),Vt--,u===s?n=void 0:(kt=n,n=s),n!==s?r=e=[e,n]:(kt=r,r=s)):(kt=r,r=s),r}function sr(){var r,e,n,u,o,a;if(r=kt,e=kt,Vt++,n=ar(),Vt--,n===s?e=void 0:(kt=e,e=s),e!==s){if(n=[],g.test(t.charAt(kt))?(u=t.charAt(kt),kt++):(u=s,0===Vt&&Wt(Y)),u!==s)for(;u!==s;)n.push(u),g.test(t.charAt(kt))?(u=t.charAt(kt),kt++):(u=s,0===Vt&&Wt(Y));else n=s;n!==s?(u=kt,32===t.charCodeAt(kt)?(o=" ",kt++):(o=s,0===Vt&&Wt(w)),o!==s&&(a=sr())!==s?u=o=[o,a]:(kt=u,u=s),u===s&&(u=null),Ut=r,r=function(t,r){let e=t.join("");return r&&(e+=" "+r[1].value),{type:"identifier",value:e}}(n,u)):(kt=r,r=s)}else kt=r,r=s;return r}function ir(){var r,e,n,u,o;if(r=kt,e=function(){var r;return t.substr(kt,5)===v?(r=v,kt+=5):(r=s,0===Vt&&Wt(gt)),r}(),e!==s){if(pr(),35===t.charCodeAt(kt)?(n="#",kt++):(n=s,0===Vt&&Wt(q)),n===s&&(n=null),u=[],d.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=s,0===Vt&&Wt(B)),o!==s)for(;o!==s;)u.push(o),d.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=s,0===Vt&&Wt(B));else u=s;u!==s?(Ut=r,r={type:"timer",value:Number(u.join(""))}):(kt=r,r=s)}else kt=r,r=s;return r}function cr(){var r;return"as"===t.substr(kt,2).toLowerCase()?(r=t.substr(kt,2),kt+=2):(r=s,0===Vt&&Wt(X)),r}function fr(){var r,e,n,u;return r=kt,"end"===t.substr(kt,3).toLowerCase()?(e=t.substr(kt,3),kt+=3):(e=s,0===Vt&&Wt(tt)),e!==s?(n=kt,Vt++," time"===t.substr(kt,5).toLowerCase()?(u=t.substr(kt,5),kt+=5):(u=s,0===Vt&&Wt(rt)),Vt--,u===s?n=void 0:(kt=n,n=s),n!==s?r=e=[e,n]:(kt=r,r=s)):(kt=r,r=s),r}function lr(){var r;return"is"===t.substr(kt,2).toLowerCase()?(r=t.substr(kt,2),kt+=2):(r=s,0===Vt&&Wt(ct)),r}function vr(){var t,r;for(t=[],(r=Jt())===s&&(r=Qt())===s&&(r=Xt());r!==s;)t.push(r),(r=Jt())===s&&(r=Qt())===s&&(r=Xt());return t}function pr(){var t,r;for(t=[],r=Jt();r!==s;)t.push(r),r=Jt();return t}function hr(){var t,r;return t=kt,(r=tr())===s&&(r=sr()),r!==s&&(Ut=t),r}function Ar(){var r,e,n,u,o,a,i;return r=kt,(e=Cr())!==s?(n=kt,u=pr(),44===t.charCodeAt(kt)?(o=",",kt++):(o=s,0===Vt&&Wt(wt)),o!==s?(a=pr(),(i=Ar())!==s?n=u=[u,o,a,i]:(kt=n,n=s)):(kt=n,n=s),n===s&&(n=null),Ut=r,r=function(t,r){let e=[t];return r&&(e=e.concat(r[3])),e}(e,n)):(kt=r,r=s),r}function dr(){var r,e,n,u,o;return r=kt,(e=sr())!==s?(pr(),40===t.charCodeAt(kt)?(n="(",kt++):(n=s,0===Vt&&Wt(Et)),n!==s?((u=Ar())===s&&(u=null),41===t.charCodeAt(kt)?(o=")",kt++):(o=s,0===Vt&&Wt(It)),o!==s?(Ut=r,r={arguments:u||[],type:"call_expression",value:e}):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s),r}function br(){var r,e,n,u;return r=kt,(e=Cr())!==s?(pr(),n=function(){var r;return t.substr(kt,2)===l?(r=l,kt+=2):(r=s,0===Vt&&Wt(P)),r===s&&(42===t.charCodeAt(kt)?(r="*",kt++):(r=s,0===Vt&&Wt(Tt)),r===s&&(47===t.charCodeAt(kt)?(r="/",kt++):(r=s,0===Vt&&Wt(V)),r===s&&(">="===t.substr(kt,2)?(r=">=",kt+=2):(r=s,0===Vt&&Wt(_t)),r===s&&("<="===t.substr(kt,2)?(r="<=",kt+=2):(r=s,0===Vt&&Wt(jt)),r===s&&(62===t.charCodeAt(kt)?(r=">",kt++):(r=s,0===Vt&&Wt(Ft)),r===s&&(60===t.charCodeAt(kt)?(r="<",kt++):(r=s,0===Vt&&Wt(Ot)),r===s&&(43===t.charCodeAt(kt)?(r="+",kt++):(r=s,0===Vt&&Wt(St)),r===s&&(45===t.charCodeAt(kt)?(r="-",kt++):(r=s,0===Vt&&Wt(Rt)))))))))),r}(),n!==s?(pr(),(u=br())===s&&(u=Cr()),u!==s?(Ut=r,r={type:"expression",value:{left:e,op:n,right:u}}):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s),r}function Cr(){var r;return(r=dr())===s&&(r=function(){var r,e,n,u;return r=kt,40===t.charCodeAt(kt)?(e="(",kt++):(e=s,0===Vt&&Wt(Et)),e!==s&&(n=br())!==s?(41===t.charCodeAt(kt)?(u=")",kt++):(u=s,0===Vt&&Wt(It)),u!==s?(Ut=r,r={type:"expression_block",value:n}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=hr()),r}function gr(){var t,r,e;return t=kt,(r=dr())===s&&(r=sr()),r!==s?(pr(),cr()!==s?(pr(),(e=sr())!==s?(Ut=t,t={target:r,type:"as_expression",value:e}):(kt=t,t=s)):(kt=t,t=s)):(kt=t,t=s),t}function yr(){var t;return(t=function(){var t,r,e;return t=kt,(r=dr())===s&&(r=sr()),r!==s?(pr(),lr()!==s?(pr(),(e=yr())!==s?(Ut=t,t={target:r,type:"is_expression",value:e}):(kt=t,t=s)):(kt=t,t=s)):(kt=t,t=s),t}())===s&&(t=br())===s&&(t=Cr()),t}function mr(){var r;return(r=function(){var r,e,n;return r=kt,e=function(){var r;return"sensitivity"===t.substr(kt,11).toLowerCase()?(r=t.substr(kt,11),kt+=11):(r=s,0===Vt&&Wt(dt)),r}(),e!==s?(vr(),n=function(){var r;return"on"===t.substr(kt,2).toLowerCase()?(r=t.substr(kt,2),kt+=2):(r=s,0===Vt&&Wt(vt)),r}(),n===s&&(n=function(){var r;return"off"===t.substr(kt,3).toLowerCase()?(r=t.substr(kt,3),kt+=3):(r=s,0===Vt&&Wt(lt)),r}()),n!==s?(Ut=r,r={type:"sensitivity",value:n}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n;return r=kt,e=function(){var r;return"title"===t.substr(kt,5).toLowerCase()?(r=t.substr(kt,5),kt+=5):(r=s,0===Vt&&Wt(yt)),r}(),e!==s?(vr(),(n=xr())===s&&(n=null),vr(),fr()!==s?(Ut=r,r={type:"title",value:n}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n,u;if(r=kt,e=function(){var r;return"parameter file"===t.substr(kt,14).toLowerCase()?(r=t.substr(kt,14),kt+=14):(r=s,0===Vt&&Wt(ht)),r}(),e===s&&(e=function(){var r;return"include"===t.substr(kt,7).toLowerCase()?(r=t.substr(kt,7),kt+=7):(r=s,0===Vt&&Wt(ot)),r}()),e!==s){if(pr(),n=[],(u=qt())!==s)for(;u!==s;)n.push(u),u=qt();else n=s;n!==s?(Ut=r,r={fileType:e,type:"file",value:Fr(n,1).join("")}):(kt=r,r=s)}else kt=r,r=s;return r}())===s&&(r=function(){var r,e,n;return r=kt,e=function(){var r;return"parameter change"===t.substr(kt,16).toLowerCase()?(r=t.substr(kt,16),kt+=16):(r=s,0===Vt&&Wt(pt)),r}(),e===s&&(e=function(){var r,e,n;return r=kt,"initiator"===t.substr(kt,9).toLowerCase()?(e=t.substr(kt,9),kt+=9):(e=s,0===Vt&&Wt(at)),e!==s?("s"===t.substr(kt,1).toLowerCase()?(n=t.charAt(kt),kt++):(n=s,0===Vt&&Wt(st)),n===s&&(n=null),Ut=r,r="INITIATORS"):(kt=r,r=s),r}()),e!==s?(vr(),(n=_r())===s&&(n=null),vr(),fr()!==s?(Ut=r,r={blockType:e,type:"block",value:n||[]}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n,u;return r=kt,e=function(){var r;return"when"===t.substr(kt,4).toLowerCase()?(r=t.substr(kt,4),kt+=4):(r=s,0===Vt&&Wt(Lt)),r}(),e===s&&(e=function(){var r;return"if"===t.substr(kt,2).toLowerCase()?(r=t.substr(kt,2),kt+=2):(r=s,0===Vt&&Wt(it)),r}()),e!==s?(pr(),(n=yr())!==s?(vr(),(u=_r())===s&&(u=null),vr(),fr()!==s?(Ut=r,r={blockType:e,test:n,type:"conditional_block",value:u||[]}):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n;return r=kt,e=function(){var r;return"alias"===t.substr(kt,5).toLowerCase()?(r=t.substr(kt,5),kt+=5):(r=s,0===Vt&&Wt(Q)),r}(),e!==s?(vr(),n=function(){var t,r,e,n,u,o;if(t=kt,(r=gr())!==s){for(e=[],n=kt,u=vr(),(o=gr())!==s?n=u=[u,o]:(kt=n,n=s);n!==s;)e.push(n),n=kt,u=vr(),(o=gr())!==s?n=u=[u,o]:(kt=n,n=s);Ut=t,t=Pt(r,e)}else kt=t,t=s;return t}(),n===s&&(n=null),vr(),fr()!==s?(Ut=r,r={type:"alias",value:n||[]}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n,u,o,a;if(r=kt,e=function(){var r;return"plotfil"===t.substr(kt,7).toLowerCase()?(r=t.substr(kt,7),kt+=7):(r=s,0===Vt&&Wt(At)),r}(),e!==s){if(pr(),n=[],d.test(t.charAt(kt))?(u=t.charAt(kt),kt++):(u=s,0===Vt&&Wt(B)),u!==s)for(;u!==s;)n.push(u),d.test(t.charAt(kt))?(u=t.charAt(kt),kt++):(u=s,0===Vt&&Wt(B));else n=s;n!==s?(u=vr(),(o=wr())===s&&(o=null),vr(),fr()!==s?(Ut=r,a=o,r={n:Number(n.join("")),type:"plotfil",value:a||[]}):(kt=r,r=s)):(kt=r,r=s)}else kt=r,r=s;return r}())===s&&(r=function(){var r,e,n;return r=kt,e=function(){var r;return"userevt"===t.substr(kt,7).toLowerCase()?(r=t.substr(kt,7),kt+=7):(r=s,0===Vt&&Wt(xt)),r}(),e!==s?(vr(),(n=Er())===s&&(n=null),vr(),fr()!==s?(Ut=r,r={type:"user_evt",value:n||[]}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n,u,o;return r=kt,e=function(){var r;return"function"===t.substr(kt,8).toLowerCase()?(r=t.substr(kt,8),kt+=8):(r=s,0===Vt&&Wt(ut)),r}(),e!==s?(pr(),(n=sr())!==s?(pr(),61===t.charCodeAt(kt)?(u="=",kt++):(u=s,0===Vt&&Wt(Nt)),u!==s?(pr(),(o=yr())!==s?(Ut=r,r={name:n,type:"function",value:o}):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n;return r=kt,e=function(){var r;return"set"===t.substr(kt,3).toLowerCase()?(r=t.substr(kt,3),kt+=3):(r=s,0===Vt&&Wt(bt)),r}(),e!==s?(pr(),(n=ir())!==s?(Ut=r,r={type:"set_timer",value:n}):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=function(){var r,e,n,u;return r=kt,e=function(){var r;return"lookup variable"===t.substr(kt,15).toLowerCase()?(r=t.substr(kt,15),kt+=15):(r=s,0===Vt&&Wt(ft)),r}(),e!==s?(pr(),n=function(){var t;return(t=dr())===s&&(t=hr()),t}(),n!==s?(vr(),(u=Tr())===s&&(u=null),vr(),fr()!==s?(Ut=r,r={name:n,type:"lookup_variable",value:u}):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s),r}()),r}function xr(){var t,r,e,n,u,o;if(t=kt,r=kt,Vt++,e=fr(),Vt--,e===s?r=void 0:(kt=r,r=s),r!==s){if(e=[],(n=qt())!==s)for(;n!==s;)e.push(n),n=qt();else e=s;e!==s?(n=kt,u=vr(),(o=xr())!==s?n=u=[u,o]:(kt=n,n=s),n===s&&(n=null),Ut=t,t=function(t,r){let e=Fr(t,1).join("");return r&&(e+="\n"+r[1]),e}(e,n)):(kt=t,t=s)}else kt=t,t=s;return t}function Lr(){var r,e,n,u,o,a,i,c;if(r=kt,(e=dr())===s&&(e=hr()),e!==s){for(n=[],u=kt,o=pr(),44===t.charCodeAt(kt)?(a=",",kt++):(a=s,0===Vt&&Wt(wt)),a!==s?(i=pr(),(c=Lr())!==s?u=o=[o,a,i,c]:(kt=u,u=s)):(kt=u,u=s);u!==s;)n.push(u),u=kt,o=pr(),44===t.charCodeAt(kt)?(a=",",kt++):(a=s,0===Vt&&Wt(wt)),a!==s?(i=pr(),(c=Lr())!==s?u=o=[o,a,i,c]:(kt=u,u=s)):(kt=u,u=s);Ut=r,r=function(t,r){let e=[t];return r&&r.length>0&&(e=e.concat(Fr(r,3)[0])),e}(e,n)}else kt=r,r=s;return r}function wr(){var t,r,e,n,u,o;if(t=kt,(r=Lr())!==s){for(e=[],n=kt,u=vr(),(o=wr())!==s?n=u=[u,o]:(kt=n,n=s);n!==s;)e.push(n),n=kt,u=vr(),(o=wr())!==s?n=u=[u,o]:(kt=n,n=s);Ut=t,t=function(t,r){let e=[t];return r&&r.length>0&&(e=e.concat(Fr(r,1)[0])),e}(r,e)}else kt=t,t=s;return t}function Er(){var t,r,e,n,u,o;if(t=kt,(r=Ir())!==s){for(e=[],n=kt,u=vr(),(o=Ir())!==s?n=u=[u,o]:(kt=n,n=s);n!==s;)e.push(n),n=kt,u=vr(),(o=Ir())!==s?n=u=[u,o]:(kt=n,n=s);Ut=t,t=Pt(r,e)}else kt=t,t=s;return t}function Ir(){var r;return(r=function(){var r,e,n,u,o,a,i;if(r=kt,e=[],d.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=s,0===Vt&&Wt(B)),n!==s)for(;n!==s;)e.push(n),d.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=s,0===Vt&&Wt(B));else e=s;if(e!==s){for(n=pr(),(u=or())===s&&(u=pr()),u===s&&(u=null),o=[],a=qt();a!==s;)o.push(a),a=qt();Ut=r,i=o,r={flag:u,index:Number(e.join("")),type:"parameter",value:Fr(i,1).join("").trim()}}else kt=r,r=s;return r}())===s&&(r=function(){var r,e,n,u,o,a,i;if(r=kt,e=function(){var r;return"action"===t.substr(kt,6).toLowerCase()?(r=t.substr(kt,6),kt+=6):(r=s,0===Vt&&Wt(J)),r}(),e!==s)if(pr(),35===t.charCodeAt(kt)?(n="#",kt++):(n=s,0===Vt&&Wt(q)),n!==s){if(u=[],d.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=s,0===Vt&&Wt(B)),o!==s)for(;o!==s;)u.push(o),d.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=s,0===Vt&&Wt(B));else u=s;u!==s?(o=vr(),(a=Er())===s&&(a=null),vr(),fr()!==s?(Ut=r,i=a,r={index:Number(u.join("")),type:"action",value:i||[]}):(kt=r,r=s)):(kt=r,r=s)}else kt=r,r=s;else kt=r,r=s;return r}())===s&&(r=jr()),r}function Tr(){var t,r,e,n,u,o,a;if(t=kt,r=kt,Vt++,e=ar(),Vt--,e===s?r=void 0:(kt=r,r=s),r!==s){if(e=[],(n=qt())!==s)for(;n!==s;)e.push(n),n=qt();else e=s;if(e!==s){for(n=[],u=kt,o=vr(),(a=Tr())!==s?u=o=[o,a]:(kt=u,u=s);u!==s;)n.push(u),u=kt,o=vr(),(a=Tr())!==s?u=o=[o,a]:(kt=u,u=s);Ut=t,t=function(t,r){let e=[Fr(t,1).join("")];return r&&r.length>0&&(e=e.concat(Fr(r,1)[0])),e}(e,n)}else kt=t,t=s}else kt=t,t=s;return t}function _r(){var t,r,e,n,u,o;if(t=kt,(r=jr())!==s){for(e=[],n=kt,u=vr(),(o=jr())!==s?n=u=[u,o]:(kt=n,n=s);n!==s;)e.push(n),n=kt,u=vr(),(o=jr())!==s?n=u=[u,o]:(kt=n,n=s);Ut=t,t=Pt(r,e)}else kt=t,t=s;return t}function jr(){var r;return(r=mr())===s&&(r=function(){var r,e,n,u;return r=kt,(e=dr())===s&&(e=sr()),e!==s?(pr(),61===t.charCodeAt(kt)?(n="=",kt++):(n=s,0===Vt&&Wt(Nt)),n!==s?(pr(),(u=yr())!==s?(Ut=r,r={target:e,type:"assignment",value:u}):(kt=r,r=s)):(kt=r,r=s)):(kt=r,r=s),r}())===s&&(r=gr())===s&&(r=yr()),r}function Fr(t,r){return t.map((t=>t[r]))}if((n=f())!==s&&kt===t.length)return n;throw n!==s&&kt<t.length&&Wt({type:"end"}),u=Dt,o=Zt<t.length?t.charAt(Zt):null,a=Zt<t.length?Kt(Zt,Zt+1):Kt(Zt,Zt),new r(r.buildMessage(u,o),u,o,a)}}}},r={};return function e(n){var u=r[n];if(void 0!==u)return u.exports;var o=r[n]={exports:{}};return t[n].call(o.exports,o,o.exports,e),o.exports}(6)})()));