/**
 * MAAP Input Parser v0.3.1
 *
 * Download the latest version from:
 * https://github.com/nmde/maap-input-parser/blob/main/dist/maap-inp-parser.js
 */
!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.maapInpParser=r():t.maapInpParser=r()}(self,(()=>(()=>{"use strict";var t={6:function(t,r,e){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});const u=n(e(759)),o=n(e(111));r.default=(0,o.default)(u.default)},954:(t,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.default=function t(r,e,n,u=[]){try{return{errors:u,input:e,output:r.parse(e,n)}}catch(o){const a=o;if(a.location&&!1!==(null==n?void 0:n.safeMode)){const o=e.split("\n"),s=a.location.start.line-1;return o[s]=`// ${o[s]}`,t(r,o.join("\n"),n,u.concat(a))}throw o}}},792:(t,r)=>{function e(t){return["number","boolean","timer"].indexOf(t)>=0}function n(t){return["sensitivity","title","file","block","conditional_block","alias","plotfil","user_evt","function","set_timer","lookup_variable","action"].indexOf(t)>=0}function u(t){return t.value?"T":"F"}function o(t){let r=`${t.index} `;return t.flag&&(r+=`${u(t.flag)} `),`${r}${t.value}`}function a(t){return`TIMER #${t.value}`}function s(t){switch(t.type){case"number":return function(t){let r=`${t.value}`;return t.units&&(r+=` ${t.units}`),r}(t);case"boolean":return u(t);default:return a(t)}}function i(t){return t.value}function c(t){return e(t.type)?s(t):i(t)}function l(t){return`${i(t.value)}(${function(t){let r="";return t.forEach((t=>{r+=`${v(t)},`})),r.substring(0,r.length-1)}(t.arguments)})`}function f(t){let r=`${v(t.value.left)} ${t.value.op} `;return"expression"===t.value.right.type?r+=f(t.value.right):r+=v(t.value.right),r}function p(t){return`(${f(t.value)})`}function v(t){return"call_expression"===t.type?l(t):"expression_block"===t.type?p(t):c(t)}function h(t){let r="";return r="call_expression"===t.target.type?l(t.target):i(t.target),`${r} = ${b(t.value)}`}function d(t){let r="";return r="call_expression"===t.target.type?l(t.target):i(t.target),`${r} IS ${b(t.value)}`}function A(t){let r="";return r="call_expression"===t.target.type?l(t.target):i(t.target),`${r} AS ${i(t.value)}`}function b(t){switch(t.type){case"is_expression":return d(t);case"expression":return f(t);default:return v(t)}}function y(t){switch(t.type){case"sensitivity":return`SENSITIVITY ${t.value}`;case"title":return`TITLE\n${t.value||""}\nEND`;case"file":return`${(f=t).fileType} ${f.value}`;case"block":return`${(s=t).blockType}\n${s.value.map((t=>C(t))).join("\n")}\nEND`;case"conditional_block":return`${(o=t).blockType} ${b(o.test)}\n${o.value.map((t=>C(t))).join("\n")}\nEND`;case"alias":return`ALIAS\n${t.value.map((t=>A(t))).join("\n")}\nEND`;case"plotfil":return`PLOTFIL ${(u=t).n}\n${u.value.map((t=>t.map((t=>"call_expression"===t.type?l(t):c(t))).join(","))).join("\n")}\nEND`;case"user_evt":return`USEREVT\n${g(t.value)}\nEND`;case"function":return`FUNCTION ${i((n=t).name)} = ${b(n.value)}`;case"set_timer":return`SET ${a(t.value)}`;default:return`LOOKUP VARIABLE ${e=(r=t).name,"call_expression"===e.type?l(e):c(e)}\n${r.value.join("\n")}\nEND`}var r,e,n,u,o,s,f}function g(t){return t.map((t=>{return"parameter"===t.type?o(t):"action"===t.type?`ACTION #${(r=t).index}\n${g(r.value)}\nEND`:C(t);var r})).join("\n")}function C(t){return n(t.type)?y(t):"assignment"===t.type?h(t):"as_expression"===t.type?A(t):b(t)}Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(t){if(n(t.type))return y(t);if(e(t.type))return s(t);switch(t.type){case"program":return t.value.map((t=>C(t))).join("\n");case"parameter":return o(t);case"call_expression":return l(t);case"expression":return f(t);case"expression_block":return p(t);case"assignment":return h(t);case"is_expression":return d(t);case"as_expression":return A(t);case"identifier":return i(t);default:throw new Error(`Unexpected input type: ${t.type}`)}}},111:function(t,r,e){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});const u=n(e(954)),o=n(e(792));r.default=function(t){const r={options:{safeMode:!0},parse:(e,n)=>(0,u.default)(t,e,Object.assign(Object.assign({},r.options),n)),toString:t=>(0,o.default)(t)};return r}},759:t=>{function r(t,e,n,u){var o=Error.call(this,t);return Object.setPrototypeOf&&Object.setPrototypeOf(o,r.prototype),o.expected=e,o.found=n,o.location=u,o.name="SyntaxError",o}function e(t,r,e){return e=e||" ",t.length>r?t:(r-=t.length,t+(e+=e.repeat(r)).slice(0,r))}!function(t,r){function e(){this.constructor=t}e.prototype=r.prototype,t.prototype=new e}(r,Error),r.prototype.format=function(t){var r="Error: "+this.message;if(this.location){var n,u=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){u=t[n].text.split(/\r\n|\n|\r/g);break}var o=this.location.start,a=this.location.source+":"+o.line+":"+o.column;if(u){var s=this.location.end,i=e("",o.line.toString().length),c=u[o.line-1],l=o.line===s.line?s.column:c.length+1;r+="\n --\x3e "+a+"\n"+i+" |\n"+o.line+" | "+c+"\n"+i+" | "+e("",o.column-1)+e("",l-o.column,"^")}else r+="\n at "+a}return r},r.buildMessage=function(t,r){var e={literal:function(t){return'"'+u(t.text)+'"'},class:function(t){var r=t.parts.map((function(t){return Array.isArray(t)?o(t[0])+"-"+o(t[1]):o(t)}));return"["+(t.inverted?"^":"")+r+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function u(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function o(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function a(t){return e[t.type](t)}return"Expected "+function(t){var r,e,n=t.map(a);if(n.sort(),n.length>0){for(r=1,e=1;r<n.length;r++)n[r-1]!==n[r]&&(n[e]=n[r],e++);n.length=e}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+u(t)+'"':"end of input"}(r)+" found."},t.exports={SyntaxError:r,parse:function(t,e){var n,u,o,a,s={},i=(e=void 0!==e?e:{}).grammarSource,c={Start:Wt},l=Wt,f="**",p="TIMER",v=/^[\n\r\u2028\u2029]/,h=/^[a-zA-Z]/,d=/^[a-zA-Z0-9]/,A=/^[0-9]/,b=/^[1-9]/,y=/^[+\-]/,g=/^[a-zA-Z0-9:]/,C={type:"any"},m=Bt("\t",!1),x=Bt("\v",!1),_=Bt("\f",!1),E=Bt(" ",!1),$=Bt(" ",!1),L=Bt("\ufeff",!1),w=Ht(["\n","\r","\u2028","\u2029"],!1,!1),T=Bt("\n",!1),I=Bt("\r\n",!1),j=Bt("\r",!1),N=Bt("\u2028",!1),O=Bt("\u2029",!1),S=Bt("//",!1),F=Bt("!",!1),R=Bt("C ",!1),k=Bt("**",!1),M=Ht([["a","z"],["A","Z"]],!1,!1),P=Bt("$",!1),D=Bt("_",!1),U=Bt("\\",!1),z=Ht([["a","z"],["A","Z"],["0","9"]],!1,!1),V=Bt("/",!1),Z=Bt(".",!1),B=Bt("0",!1),H=Ht([["0","9"]],!1,!1),K=Ht([["1","9"]],!1,!1),Y=Bt("e",!0),G=Ht(["+","-"],!1,!1),W=Ht([["a","z"],["A","Z"],["0","9"],":"],!1,!1),q=Bt("#",!1),J=Bt("ACTION",!0),Q=Bt("ALIAS",!0),X=Bt("AS",!0),tt=Bt("END",!0),rt=Bt(" TIME",!0),et=Bt("F",!0),nt=Bt("FALSE",!0),ut=Bt("FUNCTION",!0),ot=Bt("INCLUDE",!0),at=Bt("INITIATOR",!0),st=Bt("S",!0),it=Bt("IF",!0),ct=Bt("IS",!0),lt=Bt("LOOKUP VARIABLE",!0),ft=Bt("OFF",!0),pt=Bt("ON",!0),vt=Bt("PARAMETER CHANGE",!0),ht=Bt("PARAMETER FILE",!0),dt=Bt("PLOTFIL",!0),At=Bt("SENSITIVITY",!0),bt=Bt("SET",!0),yt=(Bt("SI",!0),Bt("T",!0)),gt=Bt("TIMER",!1),Ct=Bt("TITLE",!0),mt=Bt("TRUE",!0),xt=Bt("USEREVT",!0),_t=Bt("WHEN",!0),Et=Bt(",",!1),$t=Bt("(",!1),Lt=Bt(")",!1),wt=Bt("*",!1),Tt=Bt(">=",!1),It=Bt("<=",!1),jt=Bt(">",!1),Nt=Bt("<",!1),Ot=Bt("+",!1),St=Bt("-",!1),Ft=Bt("=",!1),Rt=function(){return parseFloat(Zt())},kt=function(t,r){return[t].concat(jr(r,1))},Mt=0,Pt=0,Dt=[{line:1,column:1}],Ut=0,zt=[],Vt=0;if("startRule"in e){if(!(e.startRule in c))throw new Error("Can't start parsing from rule \""+e.startRule+'".');l=c[e.startRule]}function Zt(){return t.substring(Pt,Mt)}function Bt(t,r){return{type:"literal",text:t,ignoreCase:r}}function Ht(t,r,e){return{type:"class",parts:t,inverted:r,ignoreCase:e}}function Kt(r){var e,n=Dt[r];if(n)return n;for(e=r-1;!Dt[e];)e--;for(n={line:(n=Dt[e]).line,column:n.column};e<r;)10===t.charCodeAt(e)?(n.line++,n.column=1):n.column++,e++;return Dt[r]=n,n}function Yt(t,r){var e=Kt(t),n=Kt(r);return{source:i,start:{offset:t,line:e.line,column:e.column},end:{offset:r,line:n.line,column:n.column}}}function Gt(t){Mt<Ut||(Mt>Ut&&(Ut=Mt,zt=[]),zt.push(t))}function Wt(){var t,r;return t=Mt,pr(),r=function(){var t,r;return t=Mt,(r=Tr())===s&&(r=null),Pt=t,r={type:"program",value:r||[]}}(),pr(),Pt=t,r}function qt(){var r,e,n;return r=Mt,e=Mt,Vt++,n=function(){var r;return v.test(t.charAt(Mt))?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(w)),r}(),Vt--,n===s?e=void 0:(Mt=e,e=s),e!==s?(n=function(){var r;return t.length>Mt?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(C)),r}(),n!==s?r=e=[e,n]:(Mt=r,r=s)):(Mt=r,r=s),r}function Jt(){var r;return 9===t.charCodeAt(Mt)?(r="\t",Mt++):(r=s,0===Vt&&Gt(m)),r===s&&(11===t.charCodeAt(Mt)?(r="\v",Mt++):(r=s,0===Vt&&Gt(x)),r===s&&(12===t.charCodeAt(Mt)?(r="\f",Mt++):(r=s,0===Vt&&Gt(_)),r===s&&(32===t.charCodeAt(Mt)?(r=" ",Mt++):(r=s,0===Vt&&Gt(E)),r===s&&(160===t.charCodeAt(Mt)?(r=" ",Mt++):(r=s,0===Vt&&Gt($)),r===s&&(65279===t.charCodeAt(Mt)?(r="\ufeff",Mt++):(r=s,0===Vt&&Gt(L))))))),r}function Qt(){var r;return 10===t.charCodeAt(Mt)?(r="\n",Mt++):(r=s,0===Vt&&Gt(T)),r===s&&("\r\n"===t.substr(Mt,2)?(r="\r\n",Mt+=2):(r=s,0===Vt&&Gt(I)),r===s&&(13===t.charCodeAt(Mt)?(r="\r",Mt++):(r=s,0===Vt&&Gt(j)),r===s&&(8232===t.charCodeAt(Mt)?(r="\u2028",Mt++):(r=s,0===Vt&&Gt(N)),r===s&&(8233===t.charCodeAt(Mt)?(r="\u2029",Mt++):(r=s,0===Vt&&Gt(O)))))),r}function Xt(){var r,e,n,u;if(r=Mt,e=function(){var r;return"//"===t.substr(Mt,2)?(r="//",Mt+=2):(r=s,0===Vt&&Gt(S)),r===s&&(33===t.charCodeAt(Mt)?(r="!",Mt++):(r=s,0===Vt&&Gt(F)),r===s&&("C "===t.substr(Mt,2)?(r="C ",Mt+=2):(r=s,0===Vt&&Gt(R)),r===s&&(t.substr(Mt,2)===f?(r=f,Mt+=2):(r=s,0===Vt&&Gt(k))))),r}(),e!==s){for(n=[],u=qt();u!==s;)n.push(u),u=qt();r=e=[e,n]}else Mt=r,r=s;return r}function tr(){var r;return(r=or())===s&&(r=function(){var r,e,n,u,o,a,i;return r=Mt,e=function(){var r,e,n,u,o;if(r=Mt,(e=er())!==s)if(46===t.charCodeAt(Mt)?(n=".",Mt++):(n=s,0===Vt&&Gt(Z)),n!==s){for(u=[],o=nr();o!==s;)u.push(o),o=nr();(o=ur())===s&&(o=null),Pt=r,r=parseFloat(Zt())}else Mt=r,r=s;else Mt=r,r=s;if(r===s){if(r=Mt,46===t.charCodeAt(Mt)?(e=".",Mt++):(e=s,0===Vt&&Gt(Z)),e!==s){if(n=[],(u=nr())!==s)for(;u!==s;)n.push(u),u=nr();else n=s;n!==s?((u=ur())===s&&(u=null),Pt=r,r=Rt()):(Mt=r,r=s)}else Mt=r,r=s;r===s&&(r=Mt,(e=er())!==s?((n=ur())===s&&(n=null),Pt=r,r=Rt()):(Mt=r,r=s))}return r}(),e!==s?(n=Mt,Vt++,u=function(){var r;return h.test(t.charAt(Mt))?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(M)),r===s&&(36===t.charCodeAt(Mt)?(r="$",Mt++):(r=s,0===Vt&&Gt(P)),r===s&&(95===t.charCodeAt(Mt)?(r="_",Mt++):(r=s,0===Vt&&Gt(D)),r===s&&(92===t.charCodeAt(Mt)?(r="\\",Mt++):(r=s,0===Vt&&Gt(U))))),r}(),u===s&&(u=nr()),Vt--,u===s?n=void 0:(Mt=n,n=s),n!==s?(u=Mt,o=vr(),(a=rr())!==s?u=o=[o,a]:(Mt=u,u=s),u===s&&(u=null),Pt=r,i=e,r={type:"number",units:(u||[])[1],value:i}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=ir()),r}function rr(){var r,e,n,u,o;if(r=Mt,e=[],d.test(t.charAt(Mt))?(n=t.charAt(Mt),Mt++):(n=s,0===Vt&&Gt(z)),n!==s)for(;n!==s;)e.push(n),d.test(t.charAt(Mt))?(n=t.charAt(Mt),Mt++):(n=s,0===Vt&&Gt(z));else e=s;return e!==s?(n=Mt,t.substr(Mt,2)===f?(u=f,Mt+=2):(u=s,0===Vt&&Gt(k)),u===s&&(47===t.charCodeAt(Mt)?(u="/",Mt++):(u=s,0===Vt&&Gt(V))),u!==s&&(o=rr())!==s?n=u=[u,o]:(Mt=n,n=s),n===s&&(n=null),Pt=r,r=function(t,r){let e=t.join("");return r&&(e+=r[0]+r[1]),e}(e,n)):(Mt=r,r=s),r}function er(){var r,e,n,u;if(48===t.charCodeAt(Mt)?(r="0",Mt++):(r=s,0===Vt&&Gt(B)),r===s)if(r=Mt,e=function(){var r;return b.test(t.charAt(Mt))?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(K)),r}(),e!==s){for(n=[],u=nr();u!==s;)n.push(u),u=nr();r=e=[e,n]}else Mt=r,r=s;return r}function nr(){var r;return A.test(t.charAt(Mt))?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(H)),r}function ur(){var r,e,n;return r=Mt,e=function(){var r;return"e"===t.substr(Mt,1).toLowerCase()?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(Y)),r}(),e!==s?(n=function(){var r,e,n,u;if(r=Mt,y.test(t.charAt(Mt))?(e=t.charAt(Mt),Mt++):(e=s,0===Vt&&Gt(G)),e===s&&(e=null),n=[],(u=nr())!==s)for(;u!==s;)n.push(u),u=nr();else n=s;return n!==s?r=e=[e,n]:(Mt=r,r=s),r}(),n!==s?r=e=[e,n]:(Mt=r,r=s)):(Mt=r,r=s),r}function or(){var r,e,n,u,o;return r=Mt,e=function(){var r;return"true"===t.substr(Mt,4).toLowerCase()?(r=t.substr(Mt,4),Mt+=4):(r=s,0===Vt&&Gt(mt)),r}(),e===s&&(e=function(){var r;return"false"===t.substr(Mt,5).toLowerCase()?(r=t.substr(Mt,5),Mt+=5):(r=s,0===Vt&&Gt(nt)),r}(),e===s&&(e=function(){var r;return"t"===t.substr(Mt,1).toLowerCase()?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(yt)),r}(),e===s&&(e=function(){var r;return"f"===t.substr(Mt,1).toLowerCase()?(r=t.charAt(Mt),Mt++):(r=s,0===Vt&&Gt(et)),r}()))),e!==s?(n=Mt,Vt++,h.test(t.charAt(Mt))?(u=t.charAt(Mt),Mt++):(u=s,0===Vt&&Gt(M)),Vt--,u===s?n=void 0:(Mt=n,n=s),n!==s?(Pt=r,r={type:"boolean",value:"TRUE"===(o=e)||"T"===o}):(Mt=r,r=s)):(Mt=r,r=s),r}function ar(){var r,e,n,u;return r=Mt,(e=lr())===s&&(e=fr())===s&&(e=cr()),e!==s?(n=Mt,Vt++,h.test(t.charAt(Mt))?(u=t.charAt(Mt),Mt++):(u=s,0===Vt&&Gt(M)),Vt--,u===s?n=void 0:(Mt=n,n=s),n!==s?r=e=[e,n]:(Mt=r,r=s)):(Mt=r,r=s),r}function sr(){var r,e,n,u,o,a;if(r=Mt,e=Mt,Vt++,n=ar(),Vt--,n===s?e=void 0:(Mt=e,e=s),e!==s){if(n=[],g.test(t.charAt(Mt))?(u=t.charAt(Mt),Mt++):(u=s,0===Vt&&Gt(W)),u!==s)for(;u!==s;)n.push(u),g.test(t.charAt(Mt))?(u=t.charAt(Mt),Mt++):(u=s,0===Vt&&Gt(W));else n=s;n!==s?(u=Mt,32===t.charCodeAt(Mt)?(o=" ",Mt++):(o=s,0===Vt&&Gt(E)),o!==s&&(a=sr())!==s?u=o=[o,a]:(Mt=u,u=s),u===s&&(u=null),Pt=r,r=function(t,r){let e=t.join("");return r&&(e+=" "+r[1].value),{type:"identifier",value:e}}(n,u)):(Mt=r,r=s)}else Mt=r,r=s;return r}function ir(){var r,e,n,u,o;if(r=Mt,e=function(){var r;return t.substr(Mt,5)===p?(r=p,Mt+=5):(r=s,0===Vt&&Gt(gt)),r}(),e!==s){if(vr(),35===t.charCodeAt(Mt)?(n="#",Mt++):(n=s,0===Vt&&Gt(q)),n===s&&(n=null),u=[],A.test(t.charAt(Mt))?(o=t.charAt(Mt),Mt++):(o=s,0===Vt&&Gt(H)),o!==s)for(;o!==s;)u.push(o),A.test(t.charAt(Mt))?(o=t.charAt(Mt),Mt++):(o=s,0===Vt&&Gt(H));else u=s;u!==s?(Pt=r,r={type:"timer",value:Number(u.join(""))}):(Mt=r,r=s)}else Mt=r,r=s;return r}function cr(){var r;return"as"===t.substr(Mt,2).toLowerCase()?(r=t.substr(Mt,2),Mt+=2):(r=s,0===Vt&&Gt(X)),r}function lr(){var r,e,n,u;return r=Mt,"end"===t.substr(Mt,3).toLowerCase()?(e=t.substr(Mt,3),Mt+=3):(e=s,0===Vt&&Gt(tt)),e!==s?(n=Mt,Vt++," time"===t.substr(Mt,5).toLowerCase()?(u=t.substr(Mt,5),Mt+=5):(u=s,0===Vt&&Gt(rt)),Vt--,u===s?n=void 0:(Mt=n,n=s),n!==s?r=e=[e,n]:(Mt=r,r=s)):(Mt=r,r=s),r}function fr(){var r;return"is"===t.substr(Mt,2).toLowerCase()?(r=t.substr(Mt,2),Mt+=2):(r=s,0===Vt&&Gt(ct)),r}function pr(){var t,r;for(t=[],(r=Jt())===s&&(r=Qt())===s&&(r=Xt());r!==s;)t.push(r),(r=Jt())===s&&(r=Qt())===s&&(r=Xt());return t}function vr(){var t,r;for(t=[],r=Jt();r!==s;)t.push(r),r=Jt();return t}function hr(){var t,r;return t=Mt,(r=tr())===s&&(r=sr()),r!==s&&(Pt=t),r}function dr(){var r,e,n,u,o,a,i;return r=Mt,(e=yr())!==s?(n=Mt,u=vr(),44===t.charCodeAt(Mt)?(o=",",Mt++):(o=s,0===Vt&&Gt(Et)),o!==s?(a=vr(),(i=dr())!==s?n=u=[u,o,a,i]:(Mt=n,n=s)):(Mt=n,n=s),n===s&&(n=null),Pt=r,r=function(t,r){let e=[t];return r&&(e=e.concat(r[3])),e}(e,n)):(Mt=r,r=s),r}function Ar(){var r,e,n,u,o;return r=Mt,(e=sr())!==s?(vr(),40===t.charCodeAt(Mt)?(n="(",Mt++):(n=s,0===Vt&&Gt($t)),n!==s?((u=dr())===s&&(u=null),41===t.charCodeAt(Mt)?(o=")",Mt++):(o=s,0===Vt&&Gt(Lt)),o!==s?(Pt=r,r={arguments:u||[],type:"call_expression",value:e}):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s),r}function br(){var r,e,n,u;return r=Mt,(e=yr())!==s?(vr(),n=function(){var r;return t.substr(Mt,2)===f?(r=f,Mt+=2):(r=s,0===Vt&&Gt(k)),r===s&&(42===t.charCodeAt(Mt)?(r="*",Mt++):(r=s,0===Vt&&Gt(wt)),r===s&&(47===t.charCodeAt(Mt)?(r="/",Mt++):(r=s,0===Vt&&Gt(V)),r===s&&(">="===t.substr(Mt,2)?(r=">=",Mt+=2):(r=s,0===Vt&&Gt(Tt)),r===s&&("<="===t.substr(Mt,2)?(r="<=",Mt+=2):(r=s,0===Vt&&Gt(It)),r===s&&(62===t.charCodeAt(Mt)?(r=">",Mt++):(r=s,0===Vt&&Gt(jt)),r===s&&(60===t.charCodeAt(Mt)?(r="<",Mt++):(r=s,0===Vt&&Gt(Nt)),r===s&&(43===t.charCodeAt(Mt)?(r="+",Mt++):(r=s,0===Vt&&Gt(Ot)),r===s&&(45===t.charCodeAt(Mt)?(r="-",Mt++):(r=s,0===Vt&&Gt(St)))))))))),r}(),n!==s?(vr(),(u=br())===s&&(u=yr()),u!==s?(Pt=r,r={type:"expression",value:{left:e,op:n,right:u}}):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s),r}function yr(){var r;return(r=Ar())===s&&(r=function(){var r,e,n,u;return r=Mt,40===t.charCodeAt(Mt)?(e="(",Mt++):(e=s,0===Vt&&Gt($t)),e!==s&&(n=br())!==s?(41===t.charCodeAt(Mt)?(u=")",Mt++):(u=s,0===Vt&&Gt(Lt)),u!==s?(Pt=r,r={type:"expression_block",value:n}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=hr()),r}function gr(){var t,r,e;return t=Mt,(r=Ar())===s&&(r=sr()),r!==s?(vr(),cr()!==s?(vr(),(e=sr())!==s?(Pt=t,t={target:r,type:"as_expression",value:e}):(Mt=t,t=s)):(Mt=t,t=s)):(Mt=t,t=s),t}function Cr(){var t;return(t=function(){var t,r,e;return t=Mt,(r=Ar())===s&&(r=sr()),r!==s?(vr(),fr()!==s?(vr(),(e=Cr())!==s?(Pt=t,t={target:r,type:"is_expression",value:e}):(Mt=t,t=s)):(Mt=t,t=s)):(Mt=t,t=s),t}())===s&&(t=br())===s&&(t=yr()),t}function mr(){var r;return(r=function(){var r,e,n;return r=Mt,e=function(){var r;return"sensitivity"===t.substr(Mt,11).toLowerCase()?(r=t.substr(Mt,11),Mt+=11):(r=s,0===Vt&&Gt(At)),r}(),e!==s?(pr(),n=function(){var r;return"on"===t.substr(Mt,2).toLowerCase()?(r=t.substr(Mt,2),Mt+=2):(r=s,0===Vt&&Gt(pt)),r}(),n===s&&(n=function(){var r;return"off"===t.substr(Mt,3).toLowerCase()?(r=t.substr(Mt,3),Mt+=3):(r=s,0===Vt&&Gt(ft)),r}()),n!==s?(Pt=r,r={type:"sensitivity",value:n}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n;return r=Mt,e=function(){var r;return"title"===t.substr(Mt,5).toLowerCase()?(r=t.substr(Mt,5),Mt+=5):(r=s,0===Vt&&Gt(Ct)),r}(),e!==s?(pr(),(n=xr())===s&&(n=null),pr(),lr()!==s?(Pt=r,r={type:"title",value:n}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n,u;if(r=Mt,e=function(){var r;return"parameter file"===t.substr(Mt,14).toLowerCase()?(r=t.substr(Mt,14),Mt+=14):(r=s,0===Vt&&Gt(ht)),r}(),e===s&&(e=function(){var r;return"include"===t.substr(Mt,7).toLowerCase()?(r=t.substr(Mt,7),Mt+=7):(r=s,0===Vt&&Gt(ot)),r}()),e!==s){if(vr(),n=[],(u=qt())!==s)for(;u!==s;)n.push(u),u=qt();else n=s;n!==s?(Pt=r,r={fileType:e,type:"file",value:jr(n,1).join("")}):(Mt=r,r=s)}else Mt=r,r=s;return r}())===s&&(r=function(){var r,e,n;return r=Mt,e=function(){var r;return"parameter change"===t.substr(Mt,16).toLowerCase()?(r=t.substr(Mt,16),Mt+=16):(r=s,0===Vt&&Gt(vt)),r}(),e===s&&(e=function(){var r,e,n;return r=Mt,"initiator"===t.substr(Mt,9).toLowerCase()?(e=t.substr(Mt,9),Mt+=9):(e=s,0===Vt&&Gt(at)),e!==s?("s"===t.substr(Mt,1).toLowerCase()?(n=t.charAt(Mt),Mt++):(n=s,0===Vt&&Gt(st)),n===s&&(n=null),Pt=r,r="INITIATORS"):(Mt=r,r=s),r}()),e!==s?(pr(),(n=Tr())===s&&(n=null),pr(),lr()!==s?(Pt=r,r={blockType:e,type:"block",value:n||[]}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n,u;return r=Mt,e=function(){var r;return"when"===t.substr(Mt,4).toLowerCase()?(r=t.substr(Mt,4),Mt+=4):(r=s,0===Vt&&Gt(_t)),r}(),e===s&&(e=function(){var r;return"if"===t.substr(Mt,2).toLowerCase()?(r=t.substr(Mt,2),Mt+=2):(r=s,0===Vt&&Gt(it)),r}()),e!==s?(vr(),(n=Cr())!==s?(pr(),(u=Tr())===s&&(u=null),pr(),lr()!==s?(Pt=r,r={blockType:e,test:n,type:"conditional_block",value:u||[]}):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n;return r=Mt,e=function(){var r;return"alias"===t.substr(Mt,5).toLowerCase()?(r=t.substr(Mt,5),Mt+=5):(r=s,0===Vt&&Gt(Q)),r}(),e!==s?(pr(),n=function(){var t,r,e,n,u,o;if(t=Mt,(r=gr())!==s){for(e=[],n=Mt,u=pr(),(o=gr())!==s?n=u=[u,o]:(Mt=n,n=s);n!==s;)e.push(n),n=Mt,u=pr(),(o=gr())!==s?n=u=[u,o]:(Mt=n,n=s);Pt=t,t=kt(r,e)}else Mt=t,t=s;return t}(),n===s&&(n=null),pr(),lr()!==s?(Pt=r,r={type:"alias",value:n||[]}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n,u,o,a;if(r=Mt,e=function(){var r;return"plotfil"===t.substr(Mt,7).toLowerCase()?(r=t.substr(Mt,7),Mt+=7):(r=s,0===Vt&&Gt(dt)),r}(),e!==s){if(vr(),n=[],A.test(t.charAt(Mt))?(u=t.charAt(Mt),Mt++):(u=s,0===Vt&&Gt(H)),u!==s)for(;u!==s;)n.push(u),A.test(t.charAt(Mt))?(u=t.charAt(Mt),Mt++):(u=s,0===Vt&&Gt(H));else n=s;n!==s?(u=pr(),(o=Er())===s&&(o=null),pr(),lr()!==s?(Pt=r,a=o,r={n:Number(n.join("")),type:"plotfil",value:a||[]}):(Mt=r,r=s)):(Mt=r,r=s)}else Mt=r,r=s;return r}())===s&&(r=function(){var r,e,n;return r=Mt,e=function(){var r;return"userevt"===t.substr(Mt,7).toLowerCase()?(r=t.substr(Mt,7),Mt+=7):(r=s,0===Vt&&Gt(xt)),r}(),e!==s?(pr(),(n=$r())===s&&(n=null),pr(),lr()!==s?(Pt=r,r={type:"user_evt",value:n||[]}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n,u,o;return r=Mt,e=function(){var r;return"function"===t.substr(Mt,8).toLowerCase()?(r=t.substr(Mt,8),Mt+=8):(r=s,0===Vt&&Gt(ut)),r}(),e!==s?(vr(),(n=sr())!==s?(vr(),61===t.charCodeAt(Mt)?(u="=",Mt++):(u=s,0===Vt&&Gt(Ft)),u!==s?(vr(),(o=Cr())!==s?(Pt=r,r={name:n,type:"function",value:o}):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n;return r=Mt,e=function(){var r;return"set"===t.substr(Mt,3).toLowerCase()?(r=t.substr(Mt,3),Mt+=3):(r=s,0===Vt&&Gt(bt)),r}(),e!==s?(vr(),(n=ir())!==s?(Pt=r,r={type:"set_timer",value:n}):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=function(){var r,e,n,u;return r=Mt,e=function(){var r;return"lookup variable"===t.substr(Mt,15).toLowerCase()?(r=t.substr(Mt,15),Mt+=15):(r=s,0===Vt&&Gt(lt)),r}(),e!==s?(vr(),n=function(){var t;return(t=Ar())===s&&(t=hr()),t}(),n!==s?(pr(),(u=wr())===s&&(u=null),pr(),lr()!==s?(Pt=r,r={name:n,type:"lookup_variable",value:u}):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s),r}()),r}function xr(){var t,r,e,n,u,o;if(t=Mt,r=Mt,Vt++,e=lr(),Vt--,e===s?r=void 0:(Mt=r,r=s),r!==s){if(e=[],(n=qt())!==s)for(;n!==s;)e.push(n),n=qt();else e=s;e!==s?(n=Mt,u=pr(),(o=xr())!==s?n=u=[u,o]:(Mt=n,n=s),n===s&&(n=null),Pt=t,t=function(t,r){let e=jr(t,1).join("");return r&&(e+="\n"+r[1]),e}(e,n)):(Mt=t,t=s)}else Mt=t,t=s;return t}function _r(){var r,e,n,u,o,a,i,c;if(r=Mt,(e=Ar())===s&&(e=hr()),e!==s){for(n=[],u=Mt,o=vr(),44===t.charCodeAt(Mt)?(a=",",Mt++):(a=s,0===Vt&&Gt(Et)),a!==s?(i=vr(),(c=_r())!==s?u=o=[o,a,i,c]:(Mt=u,u=s)):(Mt=u,u=s);u!==s;)n.push(u),u=Mt,o=vr(),44===t.charCodeAt(Mt)?(a=",",Mt++):(a=s,0===Vt&&Gt(Et)),a!==s?(i=vr(),(c=_r())!==s?u=o=[o,a,i,c]:(Mt=u,u=s)):(Mt=u,u=s);Pt=r,r=function(t,r){let e=[t];return r&&r.length>0&&(e=e.concat(jr(r,3)[0])),e}(e,n)}else Mt=r,r=s;return r}function Er(){var t,r,e,n,u,o;if(t=Mt,(r=_r())!==s){for(e=[],n=Mt,u=pr(),(o=Er())!==s?n=u=[u,o]:(Mt=n,n=s);n!==s;)e.push(n),n=Mt,u=pr(),(o=Er())!==s?n=u=[u,o]:(Mt=n,n=s);Pt=t,t=function(t,r){let e=[t];return r&&r.length>0&&(e=e.concat(jr(r,1)[0])),e}(r,e)}else Mt=t,t=s;return t}function $r(){var t,r,e,n,u,o;if(t=Mt,(r=Lr())!==s){for(e=[],n=Mt,u=pr(),(o=Lr())!==s?n=u=[u,o]:(Mt=n,n=s);n!==s;)e.push(n),n=Mt,u=pr(),(o=Lr())!==s?n=u=[u,o]:(Mt=n,n=s);Pt=t,t=kt(r,e)}else Mt=t,t=s;return t}function Lr(){var r;return(r=function(){var r,e,n,u,o,a,i,c;if(r=Mt,e=[],A.test(t.charAt(Mt))?(n=t.charAt(Mt),Mt++):(n=s,0===Vt&&Gt(H)),n!==s)for(;n!==s;)e.push(n),A.test(t.charAt(Mt))?(n=t.charAt(Mt),Mt++):(n=s,0===Vt&&Gt(H));else e=s;if(e!==s){for(n=vr(),u=Mt,(o=or())!==s?u=o=[o,a=vr()]:(Mt=u,u=s),u===s&&(u=null),o=[],a=qt();a!==s;)o.push(a),a=qt();Pt=r,i=e,c=o,r={flag:(u||[])[0],index:Number(i.join("")),type:"parameter",value:jr(c,1).join("").trim()}}else Mt=r,r=s;return r}())===s&&(r=function(){var r,e,n,u,o,a,i;if(r=Mt,e=function(){var r;return"action"===t.substr(Mt,6).toLowerCase()?(r=t.substr(Mt,6),Mt+=6):(r=s,0===Vt&&Gt(J)),r}(),e!==s)if(vr(),35===t.charCodeAt(Mt)?(n="#",Mt++):(n=s,0===Vt&&Gt(q)),n!==s){if(u=[],A.test(t.charAt(Mt))?(o=t.charAt(Mt),Mt++):(o=s,0===Vt&&Gt(H)),o!==s)for(;o!==s;)u.push(o),A.test(t.charAt(Mt))?(o=t.charAt(Mt),Mt++):(o=s,0===Vt&&Gt(H));else u=s;u!==s?(o=pr(),(a=$r())===s&&(a=null),pr(),lr()!==s?(Pt=r,i=a,r={index:Number(u.join("")),type:"action",value:i||[]}):(Mt=r,r=s)):(Mt=r,r=s)}else Mt=r,r=s;else Mt=r,r=s;return r}())===s&&(r=Ir()),r}function wr(){var t,r,e,n,u,o,a;if(t=Mt,r=Mt,Vt++,e=ar(),Vt--,e===s?r=void 0:(Mt=r,r=s),r!==s){if(e=[],(n=qt())!==s)for(;n!==s;)e.push(n),n=qt();else e=s;if(e!==s){for(n=[],u=Mt,o=pr(),(a=wr())!==s?u=o=[o,a]:(Mt=u,u=s);u!==s;)n.push(u),u=Mt,o=pr(),(a=wr())!==s?u=o=[o,a]:(Mt=u,u=s);Pt=t,t=function(t,r){let e=[jr(t,1).join("")];return r&&r.length>0&&(e=e.concat(jr(r,1)[0])),e}(e,n)}else Mt=t,t=s}else Mt=t,t=s;return t}function Tr(){var t,r,e,n,u,o;if(t=Mt,(r=Ir())!==s){for(e=[],n=Mt,u=pr(),(o=Ir())!==s?n=u=[u,o]:(Mt=n,n=s);n!==s;)e.push(n),n=Mt,u=pr(),(o=Ir())!==s?n=u=[u,o]:(Mt=n,n=s);Pt=t,t=kt(r,e)}else Mt=t,t=s;return t}function Ir(){var r;return(r=mr())===s&&(r=function(){var r,e,n,u;return r=Mt,(e=Ar())===s&&(e=sr()),e!==s?(vr(),61===t.charCodeAt(Mt)?(n="=",Mt++):(n=s,0===Vt&&Gt(Ft)),n!==s?(vr(),(u=Cr())!==s?(Pt=r,r={target:e,type:"assignment",value:u}):(Mt=r,r=s)):(Mt=r,r=s)):(Mt=r,r=s),r}())===s&&(r=gr())===s&&(r=Cr()),r}function jr(t,r){return t.map((t=>t[r]))}if((n=l())!==s&&Mt===t.length)return n;throw n!==s&&Mt<t.length&&Gt({type:"end"}),u=zt,o=Ut<t.length?t.charAt(Ut):null,a=Ut<t.length?Yt(Ut,Ut+1):Yt(Ut,Ut),new r(r.buildMessage(u,o),u,o,a)}}}},r={};return function e(n){var u=r[n];if(void 0!==u)return u.exports;var o=r[n]={exports:{}};return t[n].call(o.exports,o,o.exports,e),o.exports}(6)})()));