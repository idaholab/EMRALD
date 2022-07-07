/**
 * MAAP Input Parser v0.4.0
 *
 * Download the latest version from:
 * https://github.com/nmde/maap-input-parser/blob/main/dist/maap-inp-parser.js
 */
!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.maapInpParser=r():t.maapInpParser=r()}(self,(()=>(()=>{"use strict";var t={6:function(t,r,e){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});const u=n(e(759)),o=n(e(111));r.default=(0,o.default)(u.default)},954:(t,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.default=function t(r,e,n,u=[]){try{return{errors:u,input:e,output:r.parse(e,n)}}catch(o){const a=o;if(a.location&&!1!==(null==n?void 0:n.safeMode)){const o=e.split("\n"),i=a.location.start.line-1;return o[i]=`// ${o[i]}`,t(r,o.join("\n"),n,u.concat(a))}throw o}}},792:(t,r)=>{function e(t){return["number","boolean","timer"].indexOf(t)>=0}function n(t){return["sensitivity","title","file","block","conditional_block","alias","plotfil","user_evt","function","set_timer","lookup_variable","action"].indexOf(t)>=0}function u(t){return t.value?"T":"F"}function o(t){return`TIMER #${t.value}`}function a(t){switch(t.type){case"number":return function(t){let r=`${t.value}`;return t.units&&(r+=` ${t.units}`),r}(t);case"boolean":return u(t);default:return o(t)}}function i(t){return t.value}function s(t){return t.value}function c(t){let r=`${t.index} `;return t.flag&&(r+=`${u(t.flag)} `),"parameter_name"===t.value.type?r+=s(t.value):r+=b(t.value),r}function l(t){return`${i(t.value)}(${function(t){let r="";return t.forEach((t=>{r+=`${v(t)},`})),r.substring(0,r.length-1)}(t.arguments)})`}function f(t){let r=`${v(t.value.left)} ${t.value.op} `;return"expression"===t.value.right.type?r+=f(t.value.right):r+=v(t.value.right),r}function p(t){return`(${f(t.value)})`}function v(t){return"call_expression"===t.type?l(t):"expression_block"===t.type?p(t):y(t)}function h(t){let r="";return r="call_expression"===t.target.type?l(t.target):i(t.target),`${r} = ${b(t.value)}`}function A(t){return`${y(t.target)} IS ${b(t.value)}`}function d(t){return`${y(t.target)} AS ${i(t.value)}`}function b(t){switch(t.type){case"is_expression":return A(t);case"expression":return f(t);default:return v(t)}}function y(t){return"call_expression"===t.type?l(t):e(t.type)?a(t):"parameter_name"===t.type?s(t):i(t)}function C(t){switch(t.type){case"sensitivity":return`SENSITIVITY ${t.value}`;case"title":return`TITLE\n${t.value||""}\nEND`;case"file":return`${(s=t).fileType} ${s.value}`;case"block":return`${(a=t).blockType}\n${a.value.map((t=>m(t))).join("\n")}\nEND`;case"conditional_block":return`${(u=t).blockType} ${b(u.test)}\n${u.value.map((t=>m(t))).join("\n")}\nEND`;case"alias":return`ALIAS\n${t.value.map((t=>d(t))).join("\n")}\nEND`;case"plotfil":return`PLOTFIL ${(n=t).n}\n${n.value.map((t=>t.map((t=>y(t))).join(","))).join("\n")}\nEND`;case"user_evt":return`USEREVT\n${g(t.value)}\nEND`;case"function":return`FUNCTION ${i((e=t).name)} = ${b(e.value)}`;case"set_timer":return`SET ${o(t.value)}`;default:return`LOOKUP VARIABLE ${y((r=t).name)}\n${r.value.join("\n")}\nEND`}var r,e,n,u,a,s}function g(t){return t.map((t=>{return"parameter"===t.type?c(t):"action"===t.type?`ACTION #${(r=t).index}\n${g(r.value)}\nEND`:m(t);var r})).join("\n")}function m(t){return n(t.type)?C(t):"assignment"===t.type?h(t):"as_expression"===t.type?d(t):b(t)}Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(t){if(n(t.type))return C(t);if(e(t.type))return a(t);switch(t.type){case"program":return t.value.map((t=>m(t))).join("\n");case"parameter":return c(t);case"call_expression":return l(t);case"expression":return f(t);case"expression_block":return p(t);case"assignment":return h(t);case"is_expression":return A(t);case"as_expression":return d(t);case"identifier":return i(t);default:throw new Error(`Unexpected input type: ${t.type}`)}}},111:function(t,r,e){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});const u=n(e(954)),o=n(e(792));r.default=function(t){const r={options:{safeMode:!0},parse:(e,n)=>(0,u.default)(t,e,Object.assign(Object.assign({},r.options),n)),toString:t=>(0,o.default)(t)};return r}},759:t=>{function r(t,e,n,u){var o=Error.call(this,t);return Object.setPrototypeOf&&Object.setPrototypeOf(o,r.prototype),o.expected=e,o.found=n,o.location=u,o.name="SyntaxError",o}function e(t,r,e){return e=e||" ",t.length>r?t:(r-=t.length,t+(e+=e.repeat(r)).slice(0,r))}!function(t,r){function e(){this.constructor=t}e.prototype=r.prototype,t.prototype=new e}(r,Error),r.prototype.format=function(t){var r="Error: "+this.message;if(this.location){var n,u=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){u=t[n].text.split(/\r\n|\n|\r/g);break}var o=this.location.start,a=this.location.source+":"+o.line+":"+o.column;if(u){var i=this.location.end,s=e("",o.line.toString().length),c=u[o.line-1],l=o.line===i.line?i.column:c.length+1;r+="\n --\x3e "+a+"\n"+s+" |\n"+o.line+" | "+c+"\n"+s+" | "+e("",o.column-1)+e("",l-o.column,"^")}else r+="\n at "+a}return r},r.buildMessage=function(t,r){var e={literal:function(t){return'"'+u(t.text)+'"'},class:function(t){var r=t.parts.map((function(t){return Array.isArray(t)?o(t[0])+"-"+o(t[1]):o(t)}));return"["+(t.inverted?"^":"")+r+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function u(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function o(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function a(t){return e[t.type](t)}return"Expected "+function(t){var r,e,n=t.map(a);if(n.sort(),n.length>0){for(r=1,e=1;r<n.length;r++)n[r-1]!==n[r]&&(n[e]=n[r],e++);n.length=e}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+u(t)+'"':"end of input"}(r)+" found."},t.exports={SyntaxError:r,parse:function(t,e){var n,u={},o=(e=void 0!==e?e:{}).grammarSource,a={Start:Gt},i=Gt,s="**",c="TIMER",l=/^[\n\r\u2028\u2029]/,f=/^[a-zA-Z]/,p=/^[a-zA-Z0-9]/,v=/^[0-9]/,h=/^[1-9]/,A=/^[+\-]/,d=/^[a-zA-Z0-9:()|]/,b={type:"any"},y=Zt("\t",!1),C=Zt("\v",!1),g=Zt("\f",!1),m=Zt(" ",!1),x=Zt(" ",!1),_=Zt("\ufeff",!1),E=Bt(["\n","\r","\u2028","\u2029"],!1,!1),L=Zt("\n",!1),w=Zt("\r\n",!1),$=Zt("\r",!1),T=Zt("\u2028",!1),I=Zt("\u2029",!1),j=Zt("//",!1),N=Zt("!",!1),O=Zt("C ",!1),S=Zt("**",!1),F=Bt([["a","z"],["A","Z"]],!1,!1),R=Zt("$",!1),k=Zt("_",!1),M=Zt("\\",!1),D=Bt([["a","z"],["A","Z"],["0","9"]],!1,!1),P=Zt("/",!1),U=Zt(".",!1),z=Zt("0",!1),V=Bt([["0","9"]],!1,!1),Z=Bt([["1","9"]],!1,!1),B=Zt("e",!0),H=Bt(["+","-"],!1,!1),K=Bt([["a","z"],["A","Z"],["0","9"],":","(",")","|"],!1,!1),Y=Zt("#",!1),G=Zt("ACTION",!0),W=Zt("ALIAS",!0),q=Zt("AS",!0),J=Zt("END",!0),Q=Zt(" TIME",!0),X=Zt("F",!0),tt=Zt("FALSE",!0),rt=Zt("FUNCTION",!0),et=Zt("INCLUDE",!0),nt=Zt("INITIATOR",!0),ut=Zt("S",!0),ot=Zt("IF",!0),at=Zt("IS",!0),it=Zt("LOOKUP VARIABLE",!0),st=Zt("OFF",!0),ct=Zt("ON",!0),lt=Zt("PARAMETER CHANGE",!0),ft=Zt("PARAMETER FILE",!0),pt=Zt("PLOTFIL",!0),vt=Zt("SENSITIVITY",!0),ht=Zt("SET",!0),At=(Zt("SI",!0),Zt("T",!0)),dt=Zt("TIMER",!1),bt=Zt("TITLE",!0),yt=Zt("TRUE",!0),Ct=Zt("USEREVT",!0),gt=Zt("WHEN",!0),mt=Zt(",",!1),xt=Zt("(",!1),_t=Zt(")",!1),Et=Zt("*",!1),Lt=Zt(">=",!1),wt=Zt("<=",!1),$t=Zt(">",!1),Tt=Zt("<",!1),It=Zt("+",!1),jt=Zt("-",!1),Nt=Zt("AND",!1),Ot=Zt("=",!1),St=function(){return parseFloat(zt())},Ft=function(t,r){return[t].concat(Fr(r,1))},Rt=0,kt=0,Mt=[{line:1,column:1}],Dt=0,Pt=[],Ut=0;if("startRule"in e){if(!(e.startRule in a))throw new Error("Can't start parsing from rule \""+e.startRule+'".');i=a[e.startRule]}function zt(){return t.substring(kt,Rt)}function Vt(){return Kt(kt,Rt)}function Zt(t,r){return{type:"literal",text:t,ignoreCase:r}}function Bt(t,r,e){return{type:"class",parts:t,inverted:r,ignoreCase:e}}function Ht(r){var e,n=Mt[r];if(n)return n;for(e=r-1;!Mt[e];)e--;for(n={line:(n=Mt[e]).line,column:n.column};e<r;)10===t.charCodeAt(e)?(n.line++,n.column=1):n.column++,e++;return Mt[r]=n,n}function Kt(t,r){var e=Ht(t),n=Ht(r);return{source:o,start:{offset:t,line:e.line,column:e.column},end:{offset:r,line:n.line,column:n.column}}}function Yt(t){Rt<Dt||(Rt>Dt&&(Dt=Rt,Pt=[]),Pt.push(t))}function Gt(){var t,r;return t=Rt,hr(),r=function(){var t,r;return t=Rt,(r=Or())===u&&(r=null),kt=t,r={type:"program",value:r||[]}}(),hr(),kt=t,r}function Wt(){var r,e,n;return r=Rt,e=Rt,Ut++,n=function(){var r;return l.test(t.charAt(Rt))?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(E)),r}(),Ut--,n===u?e=void 0:(Rt=e,e=u),e!==u?(n=function(){var r;return t.length>Rt?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(b)),r}(),n!==u?r=e=[e,n]:(Rt=r,r=u)):(Rt=r,r=u),r}function qt(){var r;return 9===t.charCodeAt(Rt)?(r="\t",Rt++):(r=u,0===Ut&&Yt(y)),r===u&&(11===t.charCodeAt(Rt)?(r="\v",Rt++):(r=u,0===Ut&&Yt(C)),r===u&&(12===t.charCodeAt(Rt)?(r="\f",Rt++):(r=u,0===Ut&&Yt(g)),r===u&&(32===t.charCodeAt(Rt)?(r=" ",Rt++):(r=u,0===Ut&&Yt(m)),r===u&&(160===t.charCodeAt(Rt)?(r=" ",Rt++):(r=u,0===Ut&&Yt(x)),r===u&&(65279===t.charCodeAt(Rt)?(r="\ufeff",Rt++):(r=u,0===Ut&&Yt(_))))))),r}function Jt(){var r;return 10===t.charCodeAt(Rt)?(r="\n",Rt++):(r=u,0===Ut&&Yt(L)),r===u&&("\r\n"===t.substr(Rt,2)?(r="\r\n",Rt+=2):(r=u,0===Ut&&Yt(w)),r===u&&(13===t.charCodeAt(Rt)?(r="\r",Rt++):(r=u,0===Ut&&Yt($)),r===u&&(8232===t.charCodeAt(Rt)?(r="\u2028",Rt++):(r=u,0===Ut&&Yt(T)),r===u&&(8233===t.charCodeAt(Rt)?(r="\u2029",Rt++):(r=u,0===Ut&&Yt(I)))))),r}function Qt(){var r,e,n,o;if(r=Rt,e=function(){var r;return"//"===t.substr(Rt,2)?(r="//",Rt+=2):(r=u,0===Ut&&Yt(j)),r===u&&(33===t.charCodeAt(Rt)?(r="!",Rt++):(r=u,0===Ut&&Yt(N)),r===u&&("C "===t.substr(Rt,2)?(r="C ",Rt+=2):(r=u,0===Ut&&Yt(O)),r===u&&(t.substr(Rt,2)===s?(r=s,Rt+=2):(r=u,0===Ut&&Yt(S))))),r}(),e!==u){for(n=[],o=Wt();o!==u;)n.push(o),o=Wt();r=e=[e,n]}else Rt=r,r=u;return r}function Xt(){var r;return(r=ur())===u&&(r=function(){var r,e,n,o,a,i,s,c;return r=Rt,e=function(){var r,e,n,o,a;if(r=Rt,(e=rr())!==u)if(46===t.charCodeAt(Rt)?(n=".",Rt++):(n=u,0===Ut&&Yt(U)),n!==u){for(o=[],a=er();a!==u;)o.push(a),a=er();(a=nr())===u&&(a=null),kt=r,r=parseFloat(zt())}else Rt=r,r=u;else Rt=r,r=u;if(r===u){if(r=Rt,46===t.charCodeAt(Rt)?(e=".",Rt++):(e=u,0===Ut&&Yt(U)),e!==u){if(n=[],(o=er())!==u)for(;o!==u;)n.push(o),o=er();else n=u;n!==u?((o=nr())===u&&(o=null),kt=r,r=St()):(Rt=r,r=u)}else Rt=r,r=u;r===u&&(r=Rt,(e=rr())!==u?((n=nr())===u&&(n=null),kt=r,r=St()):(Rt=r,r=u))}return r}(),e!==u?(n=Rt,Ut++,o=function(){var r;return f.test(t.charAt(Rt))?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(F)),r===u&&(36===t.charCodeAt(Rt)?(r="$",Rt++):(r=u,0===Ut&&Yt(R)),r===u&&(95===t.charCodeAt(Rt)?(r="_",Rt++):(r=u,0===Ut&&Yt(k)),r===u&&(92===t.charCodeAt(Rt)?(r="\\",Rt++):(r=u,0===Ut&&Yt(M))))),r}(),o===u&&(o=er()),Ut--,o===u?n=void 0:(Rt=n,n=u),n!==u?(o=Rt,a=Ar(),(i=tr())!==u?o=a=[a,i]:(Rt=o,o=u),o===u&&(o=null),kt=r,s=e,c=o,r={location:Vt(),type:"number",units:(c||[])[1],value:s}):(Rt=r,r=u)):(Rt=r,r=u),r}())===u&&(r=cr()),r}function tr(){var r,e,n,o,a;if(r=Rt,e=[],p.test(t.charAt(Rt))?(n=t.charAt(Rt),Rt++):(n=u,0===Ut&&Yt(D)),n!==u)for(;n!==u;)e.push(n),p.test(t.charAt(Rt))?(n=t.charAt(Rt),Rt++):(n=u,0===Ut&&Yt(D));else e=u;return e!==u?(n=Rt,t.substr(Rt,2)===s?(o=s,Rt+=2):(o=u,0===Ut&&Yt(S)),o===u&&(47===t.charCodeAt(Rt)?(o="/",Rt++):(o=u,0===Ut&&Yt(P))),o!==u&&(a=tr())!==u?n=o=[o,a]:(Rt=n,n=u),n===u&&(n=null),kt=r,r=function(t,r){let e=t.join("");return r&&(e+=r[0]+r[1]),e}(e,n)):(Rt=r,r=u),r}function rr(){var r,e,n,o;if(48===t.charCodeAt(Rt)?(r="0",Rt++):(r=u,0===Ut&&Yt(z)),r===u)if(r=Rt,e=function(){var r;return h.test(t.charAt(Rt))?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(Z)),r}(),e!==u){for(n=[],o=er();o!==u;)n.push(o),o=er();r=e=[e,n]}else Rt=r,r=u;return r}function er(){var r;return v.test(t.charAt(Rt))?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(V)),r}function nr(){var r,e,n;return r=Rt,e=function(){var r;return"e"===t.substr(Rt,1).toLowerCase()?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(B)),r}(),e!==u?(n=function(){var r,e,n,o;if(r=Rt,A.test(t.charAt(Rt))?(e=t.charAt(Rt),Rt++):(e=u,0===Ut&&Yt(H)),e===u&&(e=null),n=[],(o=er())!==u)for(;o!==u;)n.push(o),o=er();else n=u;return n!==u?r=e=[e,n]:(Rt=r,r=u),r}(),n!==u?r=e=[e,n]:(Rt=r,r=u)):(Rt=r,r=u),r}function ur(){var r,e,n,o;return r=Rt,e=function(){var r;return"true"===t.substr(Rt,4).toLowerCase()?(r=t.substr(Rt,4),Rt+=4):(r=u,0===Ut&&Yt(yt)),r}(),e===u&&(e=function(){var r;return"false"===t.substr(Rt,5).toLowerCase()?(r=t.substr(Rt,5),Rt+=5):(r=u,0===Ut&&Yt(tt)),r}(),e===u&&(e=function(){var r;return"t"===t.substr(Rt,1).toLowerCase()?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(At)),r}(),e===u&&(e=function(){var r;return"f"===t.substr(Rt,1).toLowerCase()?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(X)),r}()))),e!==u?(n=Rt,Ut++,f.test(t.charAt(Rt))?(o=t.charAt(Rt),Rt++):(o=u,0===Ut&&Yt(F)),Ut--,o===u?n=void 0:(Rt=n,n=u),n!==u?(kt=r,r=function(t){let r="TRUE"===t||"T"===t;return{location:Vt(),type:"boolean",value:r}}(e)):(Rt=r,r=u)):(Rt=r,r=u),r}function or(){var r,e,n,o;return r=Rt,(e=fr())===u&&(e=pr())===u&&(e=lr()),e!==u?(n=Rt,Ut++,f.test(t.charAt(Rt))?(o=t.charAt(Rt),Rt++):(o=u,0===Ut&&Yt(F)),Ut--,o===u?n=void 0:(Rt=n,n=u),n!==u?r=e=[e,n]:(Rt=r,r=u)):(Rt=r,r=u),r}function ar(){var r,e,n,o,a;if(r=Rt,e=Rt,Ut++,n=or(),Ut--,n===u?e=void 0:(Rt=e,e=u),e!==u){if(n=[],p.test(t.charAt(Rt))?(o=t.charAt(Rt),Rt++):(o=u,0===Ut&&Yt(D)),o!==u)for(;o!==u;)n.push(o),p.test(t.charAt(Rt))?(o=t.charAt(Rt),Rt++):(o=u,0===Ut&&Yt(D));else n=u;n!==u?(kt=r,a=n,r={location:Vt(),type:"identifier",value:a.join("")}):(Rt=r,r=u)}else Rt=r,r=u;return r}function ir(){var r;return d.test(t.charAt(Rt))?(r=t.charAt(Rt),Rt++):(r=u,0===Ut&&Yt(K)),r}function sr(){var t,r,e,n,o,a,i,s,c;if(t=Rt,r=Rt,Ut++,e=or(),Ut--,e===u?r=void 0:(Rt=r,r=u),r!==u){if(e=[],(n=ir())!==u)for(;n!==u;)e.push(n),n=ir();else e=u;if(e!==u){if(n=[],o=Rt,a=Ar(),i=Rt,Ut++,s=or(),Ut--,s===u?i=void 0:(Rt=i,i=u),i!==u){if(s=[],(c=ir())!==u)for(;c!==u;)s.push(c),c=ir();else s=u;s!==u?o=a=[a,i,s]:(Rt=o,o=u)}else Rt=o,o=u;if(o!==u)for(;o!==u;)if(n.push(o),o=Rt,a=Ar(),i=Rt,Ut++,s=or(),Ut--,s===u?i=void 0:(Rt=i,i=u),i!==u){if(s=[],(c=ir())!==u)for(;c!==u;)s.push(c),c=ir();else s=u;s!==u?o=a=[a,i,s]:(Rt=o,o=u)}else Rt=o,o=u;else n=u;n!==u?(kt=t,t=function(t,r){let e=t.join("");return r&&(e+=" "+Fr(r,2).map((t=>t.join(""))).join(" ")),{location:Vt(),type:"parameter_name",value:e}}(e,n)):(Rt=t,t=u)}else Rt=t,t=u}else Rt=t,t=u;return t}function cr(){var r,e,n,o,a,i;if(r=Rt,e=function(){var r;return t.substr(Rt,5)===c?(r=c,Rt+=5):(r=u,0===Ut&&Yt(dt)),r}(),e!==u){if(Ar(),35===t.charCodeAt(Rt)?(n="#",Rt++):(n=u,0===Ut&&Yt(Y)),n===u&&(n=null),o=[],v.test(t.charAt(Rt))?(a=t.charAt(Rt),Rt++):(a=u,0===Ut&&Yt(V)),a!==u)for(;a!==u;)o.push(a),v.test(t.charAt(Rt))?(a=t.charAt(Rt),Rt++):(a=u,0===Ut&&Yt(V));else o=u;o!==u?(kt=r,i=o,r={location:Vt(),type:"timer",value:Number(i.join(""))}):(Rt=r,r=u)}else Rt=r,r=u;return r}function lr(){var r;return"as"===t.substr(Rt,2).toLowerCase()?(r=t.substr(Rt,2),Rt+=2):(r=u,0===Ut&&Yt(q)),r}function fr(){var r,e,n,o;return r=Rt,"end"===t.substr(Rt,3).toLowerCase()?(e=t.substr(Rt,3),Rt+=3):(e=u,0===Ut&&Yt(J)),e!==u?(n=Rt,Ut++," time"===t.substr(Rt,5).toLowerCase()?(o=t.substr(Rt,5),Rt+=5):(o=u,0===Ut&&Yt(Q)),Ut--,o===u?n=void 0:(Rt=n,n=u),n!==u?r=e=[e,n]:(Rt=r,r=u)):(Rt=r,r=u),r}function pr(){var r;return"is"===t.substr(Rt,2).toLowerCase()?(r=t.substr(Rt,2),Rt+=2):(r=u,0===Ut&&Yt(at)),r}function vr(){var t,r;if(t=[],(r=qt())===u&&(r=Jt())===u&&(r=Qt()),r!==u)for(;r!==u;)t.push(r),(r=qt())===u&&(r=Jt())===u&&(r=Qt());else t=u;return t}function hr(){var t,r;for(t=[],(r=qt())===u&&(r=Jt())===u&&(r=Qt());r!==u;)t.push(r),(r=qt())===u&&(r=Jt())===u&&(r=Qt());return t}function Ar(){var t,r;for(t=[],r=qt();r!==u;)t.push(r),r=qt();return t}function dr(){var r,e,n,o,a,i,s;return r=Rt,(e=gr())!==u?(n=Rt,o=Ar(),44===t.charCodeAt(Rt)?(a=",",Rt++):(a=u,0===Ut&&Yt(mt)),a!==u?(i=Ar(),(s=dr())!==u?n=o=[o,a,i,s]:(Rt=n,n=u)):(Rt=n,n=u),n===u&&(n=null),kt=r,r=function(t,r){let e=[t];return r&&(e=e.concat(r[3])),e}(e,n)):(Rt=r,r=u),r}function br(){var r,e,n,o,a,i;return r=Rt,(e=ar())!==u?(Ar(),40===t.charCodeAt(Rt)?(n="(",Rt++):(n=u,0===Ut&&Yt(xt)),n!==u?((o=dr())===u&&(o=null),41===t.charCodeAt(Rt)?(a=")",Rt++):(a=u,0===Ut&&Yt(_t)),a!==u?(kt=r,i=e,r={arguments:o||[],location:Vt(),type:"call_expression",value:i}):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u),r}function yr(){var r,e,n,o,a,i,c;return r=Rt,(e=gr())!==u?(Ar(),n=function(){var r;return t.substr(Rt,2)===s?(r=s,Rt+=2):(r=u,0===Ut&&Yt(S)),r===u&&(42===t.charCodeAt(Rt)?(r="*",Rt++):(r=u,0===Ut&&Yt(Et)),r===u&&(47===t.charCodeAt(Rt)?(r="/",Rt++):(r=u,0===Ut&&Yt(P)),r===u&&(">="===t.substr(Rt,2)?(r=">=",Rt+=2):(r=u,0===Ut&&Yt(Lt)),r===u&&("<="===t.substr(Rt,2)?(r="<=",Rt+=2):(r=u,0===Ut&&Yt(wt)),r===u&&(62===t.charCodeAt(Rt)?(r=">",Rt++):(r=u,0===Ut&&Yt($t)),r===u&&(60===t.charCodeAt(Rt)?(r="<",Rt++):(r=u,0===Ut&&Yt(Tt)),r===u&&(43===t.charCodeAt(Rt)?(r="+",Rt++):(r=u,0===Ut&&Yt(It)),r===u&&(45===t.charCodeAt(Rt)?(r="-",Rt++):(r=u,0===Ut&&Yt(jt)),r===u&&("AND"===t.substr(Rt,3)?(r="AND",Rt+=3):(r=u,0===Ut&&Yt(Nt))))))))))),r}(),n!==u?(Ar(),(o=yr())===u&&(o=gr()),o!==u?(kt=r,a=e,i=n,c=o,r={location:Vt(),type:"expression",value:{left:a,op:i,right:c}}):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u),r}function Cr(){var r,e,n,o,a;return r=Rt,40===t.charCodeAt(Rt)?(e="(",Rt++):(e=u,0===Ut&&Yt(xt)),e!==u&&(n=yr())!==u?(41===t.charCodeAt(Rt)?(o=")",Rt++):(o=u,0===Ut&&Yt(_t)),o!==u?(kt=r,a=n,r={location:Vt(),type:"expression_block",value:a}):(Rt=r,r=u)):(Rt=r,r=u),r}function gr(){var t;return(t=br())===u&&(t=Cr())===u&&(t=Er()),t}function mr(){var t,r,e,n,o;return t=Rt,(r=Er())!==u?(Ar(),pr()!==u?(Ar(),(e=_r())!==u?(kt=t,n=r,o=e,t={location:Vt(),target:n,type:"is_expression",value:o}):(Rt=t,t=u)):(Rt=t,t=u)):(Rt=t,t=u),t}function xr(){var t,r,e,n,o;return t=Rt,(r=Er())!==u?(Ar(),lr()!==u?(Ar(),(e=Er())!==u?(kt=t,n=r,o=e,t={location:Vt(),target:n,type:"as_expression",value:o}):(Rt=t,t=u)):(Rt=t,t=u)):(Rt=t,t=u),t}function _r(){var t;return(t=mr())===u&&(t=yr())===u&&(t=gr()),t}function Er(){var t;return(t=br())===u&&(t=Xt())===u&&(t=sr())===u&&(t=ar()),t}function Lr(){var r,e,n;return r=Rt,e=function(){var r,e,n,o;return r=Rt,e=function(){var r;return"sensitivity"===t.substr(Rt,11).toLowerCase()?(r=t.substr(Rt,11),Rt+=11):(r=u,0===Ut&&Yt(vt)),r}(),e!==u&&vr()!==u?(n=function(){var r;return"on"===t.substr(Rt,2).toLowerCase()?(r=t.substr(Rt,2),Rt+=2):(r=u,0===Ut&&Yt(ct)),r}(),n===u&&(n=function(){var r;return"off"===t.substr(Rt,3).toLowerCase()?(r=t.substr(Rt,3),Rt+=3):(r=u,0===Ut&&Yt(st)),r}()),n!==u?(kt=r,o=n,r={location:Vt(),type:"sensitivity",value:o}):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o,a;return r=Rt,e=function(){var r;return"title"===t.substr(Rt,5).toLowerCase()?(r=t.substr(Rt,5),Rt+=5):(r=u,0===Ut&&Yt(bt)),r}(),e!==u&&vr()!==u?(n=Rt,(o=wr())!==u&&(a=vr())!==u?n=o=[o,a]:(Rt=n,n=u),n===u&&(n=null),(o=fr())!==u?(kt=r,r={type:"title",value:(n||[])[0]}):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o;if(r=Rt,e=function(){var r;return"parameter file"===t.substr(Rt,14).toLowerCase()?(r=t.substr(Rt,14),Rt+=14):(r=u,0===Ut&&Yt(ft)),r}(),e===u&&(e=function(){var r;return"include"===t.substr(Rt,7).toLowerCase()?(r=t.substr(Rt,7),Rt+=7):(r=u,0===Ut&&Yt(et)),r}()),e!==u){if(Ar(),n=[],(o=Wt())!==u)for(;o!==u;)n.push(o),o=Wt();else n=u;n!==u?(kt=r,r={fileType:e,type:"file",value:Fr(n,1).join("")}):(Rt=r,r=u)}else Rt=r,r=u;return r}(),e===u&&(e=function(){var r,e,n,o,a;return r=Rt,e=function(){var r;return"parameter change"===t.substr(Rt,16).toLowerCase()?(r=t.substr(Rt,16),Rt+=16):(r=u,0===Ut&&Yt(lt)),r}(),e===u&&(e=function(){var r,e,n;return r=Rt,"initiator"===t.substr(Rt,9).toLowerCase()?(e=t.substr(Rt,9),Rt+=9):(e=u,0===Ut&&Yt(nt)),e!==u?("s"===t.substr(Rt,1).toLowerCase()?(n=t.charAt(Rt),Rt++):(n=u,0===Ut&&Yt(ut)),n===u&&(n=null),kt=r,r="INITIATORS"):(Rt=r,r=u),r}()),e!==u&&vr()!==u?(n=Rt,(o=Or())!==u&&(a=vr())!==u?n=o=[o,a]:(Rt=n,n=u),n===u&&(n=null),(o=fr())!==u?(kt=r,r={blockType:e,type:"block",value:Rr(n)}):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o,a,i;return r=Rt,e=function(){var r;return"when"===t.substr(Rt,4).toLowerCase()?(r=t.substr(Rt,4),Rt+=4):(r=u,0===Ut&&Yt(gt)),r}(),e===u&&(e=function(){var r;return"if"===t.substr(Rt,2).toLowerCase()?(r=t.substr(Rt,2),Rt+=2):(r=u,0===Ut&&Yt(ot)),r}()),e!==u?(Ar(),(n=_r())!==u&&vr()!==u?(o=Rt,(a=Or())!==u&&(i=vr())!==u?o=a=[a,i]:(Rt=o,o=u),o===u&&(o=null),(a=fr())!==u?(kt=r,r={blockType:e,test:n,type:"conditional_block",value:Rr(o)}):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o,a;return r=Rt,e=function(){var r;return"alias"===t.substr(Rt,5).toLowerCase()?(r=t.substr(Rt,5),Rt+=5):(r=u,0===Ut&&Yt(W)),r}(),e!==u&&vr()!==u?(n=Rt,o=function(){var t,r,e,n,o,a;if(t=Rt,(r=xr())!==u){for(e=[],n=Rt,(o=vr())!==u&&(a=xr())!==u?n=o=[o,a]:(Rt=n,n=u);n!==u;)e.push(n),n=Rt,(o=vr())!==u&&(a=xr())!==u?n=o=[o,a]:(Rt=n,n=u);kt=t,t=Ft(r,e)}else Rt=t,t=u;return t}(),o!==u&&(a=vr())!==u?n=o=[o,a]:(Rt=n,n=u),n===u&&(n=null),(o=fr())!==u?(kt=r,r={type:"alias",value:Rr(n)}):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o,a,i,s,c;if(r=Rt,e=function(){var r;return"plotfil"===t.substr(Rt,7).toLowerCase()?(r=t.substr(Rt,7),Rt+=7):(r=u,0===Ut&&Yt(pt)),r}(),e!==u){if(Ar(),n=[],v.test(t.charAt(Rt))?(o=t.charAt(Rt),Rt++):(o=u,0===Ut&&Yt(V)),o!==u)for(;o!==u;)n.push(o),v.test(t.charAt(Rt))?(o=t.charAt(Rt),Rt++):(o=u,0===Ut&&Yt(V));else n=u;n!==u&&(o=vr())!==u?(a=Rt,(i=Tr())!==u&&(s=vr())!==u?a=i=[i,s]:(Rt=a,a=u),a===u&&(a=null),(i=fr())!==u?(kt=r,c=a,r={n:Number(n.join("")),type:"plotfil",value:Rr(c)}):(Rt=r,r=u)):(Rt=r,r=u)}else Rt=r,r=u;return r}(),e===u&&(e=function(){var r,e,n,o,a;return r=Rt,e=function(){var r;return"userevt"===t.substr(Rt,7).toLowerCase()?(r=t.substr(Rt,7),Rt+=7):(r=u,0===Ut&&Yt(Ct)),r}(),e!==u&&vr()!==u?(n=Rt,(o=Ir())!==u&&(a=vr())!==u?n=o=[o,a]:(Rt=n,n=u),n===u&&(n=null),(o=fr())!==u?(kt=r,r={type:"user_evt",value:Rr(n)}):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o,a;return r=Rt,e=function(){var r;return"function"===t.substr(Rt,8).toLowerCase()?(r=t.substr(Rt,8),Rt+=8):(r=u,0===Ut&&Yt(rt)),r}(),e!==u?(Ar(),(n=ar())!==u?(Ar(),61===t.charCodeAt(Rt)?(o="=",Rt++):(o=u,0===Ut&&Yt(Ot)),o!==u?(Ar(),(a=_r())!==u?(kt=r,r={name:n,type:"function",value:a}):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n;return r=Rt,e=function(){var r;return"set"===t.substr(Rt,3).toLowerCase()?(r=t.substr(Rt,3),Rt+=3):(r=u,0===Ut&&Yt(ht)),r}(),e!==u?(Ar(),(n=cr())!==u?(kt=r,r={type:"set_timer",value:n}):(Rt=r,r=u)):(Rt=r,r=u),r}(),e===u&&(e=function(){var r,e,n,o,a,i;return r=Rt,e=function(){var r;return"lookup variable"===t.substr(Rt,15).toLowerCase()?(r=t.substr(Rt,15),Rt+=15):(r=u,0===Ut&&Yt(it)),r}(),e!==u?(Ar(),(n=Er())!==u&&vr()!==u?(o=Rt,(a=Nr())!==u&&(i=vr())!==u?o=a=[a,i]:(Rt=o,o=u),o===u&&(o=null),(a=fr())!==u?(kt=r,r={name:n,type:"lookup_variable",value:Rr(o)}):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u),r}())))))))))),e!==u&&(kt=r,n=e,e={location:Vt(),...n}),e}function wr(){var t,r,e,n,o,a;if(t=Rt,r=Rt,Ut++,e=fr(),Ut--,e===u?r=void 0:(Rt=r,r=u),r!==u){if(e=[],(n=Wt())!==u)for(;n!==u;)e.push(n),n=Wt();else e=u;e!==u?(n=Rt,(o=vr())!==u&&(a=wr())!==u?n=o=[o,a]:(Rt=n,n=u),n===u&&(n=null),kt=t,t=function(t,r){let e=Fr(t,1).join("");return r&&(e+="\n"+r[1]),e}(e,n)):(Rt=t,t=u)}else Rt=t,t=u;return t}function $r(){var r,e,n,o,a,i,s,c;if(r=Rt,(e=Er())!==u){for(n=[],o=Rt,a=Ar(),44===t.charCodeAt(Rt)?(i=",",Rt++):(i=u,0===Ut&&Yt(mt)),i!==u?(s=Ar(),(c=$r())!==u?o=a=[a,i,s,c]:(Rt=o,o=u)):(Rt=o,o=u);o!==u;)n.push(o),o=Rt,a=Ar(),44===t.charCodeAt(Rt)?(i=",",Rt++):(i=u,0===Ut&&Yt(mt)),i!==u?(s=Ar(),(c=$r())!==u?o=a=[a,i,s,c]:(Rt=o,o=u)):(Rt=o,o=u);kt=r,r=function(t,r){let e=[t];return r&&r.length>0&&(e=e.concat(Fr(r,3)[0])),e}(e,n)}else Rt=r,r=u;return r}function Tr(){var t,r,e,n,o,a;if(t=Rt,(r=$r())!==u){for(e=[],n=Rt,(o=vr())!==u&&(a=Tr())!==u?n=o=[o,a]:(Rt=n,n=u);n!==u;)e.push(n),n=Rt,(o=vr())!==u&&(a=Tr())!==u?n=o=[o,a]:(Rt=n,n=u);kt=t,t=function(t,r){let e=[t];return r&&r.length>0&&(e=e.concat(Fr(r,1)[0])),e}(r,e)}else Rt=t,t=u;return t}function Ir(){var t,r,e,n,o,a;if(t=Rt,(r=jr())!==u){for(e=[],n=Rt,(o=vr())!==u&&(a=jr())!==u?n=o=[o,a]:(Rt=n,n=u);n!==u;)e.push(n),n=Rt,(o=vr())!==u&&(a=jr())!==u?n=o=[o,a]:(Rt=n,n=u);kt=t,t=Ft(r,e)}else Rt=t,t=u;return t}function jr(){var r;return(r=function(){var r,e,n,o,a,i,s;if(r=Rt,e=[],v.test(t.charAt(Rt))?(n=t.charAt(Rt),Rt++):(n=u,0===Ut&&Yt(V)),n!==u)for(;n!==u;)e.push(n),v.test(t.charAt(Rt))?(n=t.charAt(Rt),Rt++):(n=u,0===Ut&&Yt(V));else e=u;return e!==u?(n=Ar(),o=Rt,(a=ur())!==u?o=a=[a,Ar()]:(Rt=o,o=u),o===u&&(o=null),(a=_r())===u&&(a=sr()),a!==u?(kt=r,i=e,s=a,r={flag:(o||[])[0],location:Vt(),index:Number(i.join("")),type:"parameter",value:s}):(Rt=r,r=u)):(Rt=r,r=u),r}())===u&&(r=function(){var r,e,n,o,a,i,s,c,l;if(r=Rt,e=function(){var r;return"action"===t.substr(Rt,6).toLowerCase()?(r=t.substr(Rt,6),Rt+=6):(r=u,0===Ut&&Yt(G)),r}(),e!==u)if(Ar(),35===t.charCodeAt(Rt)?(n="#",Rt++):(n=u,0===Ut&&Yt(Y)),n!==u){if(o=[],v.test(t.charAt(Rt))?(a=t.charAt(Rt),Rt++):(a=u,0===Ut&&Yt(V)),a!==u)for(;a!==u;)o.push(a),v.test(t.charAt(Rt))?(a=t.charAt(Rt),Rt++):(a=u,0===Ut&&Yt(V));else o=u;o!==u&&(a=vr())!==u?(i=Rt,(s=Ir())!==u&&(c=vr())!==u?i=s=[s,c]:(Rt=i,i=u),i===u&&(i=null),(s=fr())!==u?(kt=r,l=i,r={index:Number(o.join("")),location:Vt(),type:"action",value:Rr(l)}):(Rt=r,r=u)):(Rt=r,r=u)}else Rt=r,r=u;else Rt=r,r=u;return r}())===u&&(r=Sr()),r}function Nr(){var t,r,e,n,o,a,i;if(t=Rt,r=Rt,Ut++,e=or(),Ut--,e===u?r=void 0:(Rt=r,r=u),r!==u){if(e=[],(n=Wt())!==u)for(;n!==u;)e.push(n),n=Wt();else e=u;if(e!==u){for(n=[],o=Rt,(a=vr())!==u&&(i=Nr())!==u?o=a=[a,i]:(Rt=o,o=u);o!==u;)n.push(o),o=Rt,(a=vr())!==u&&(i=Nr())!==u?o=a=[a,i]:(Rt=o,o=u);kt=t,t=function(t,r){let e=[Fr(t,1).join("")];return r&&r.length>0&&(e=e.concat(Fr(r,1)[0])),e}(e,n)}else Rt=t,t=u}else Rt=t,t=u;return t}function Or(){var t,r,e,n,o,a;if(t=Rt,(r=Sr())!==u){for(e=[],n=Rt,(o=vr())!==u&&(a=Sr())!==u?n=o=[o,a]:(Rt=n,n=u);n!==u;)e.push(n),n=Rt,(o=vr())!==u&&(a=Sr())!==u?n=o=[o,a]:(Rt=n,n=u);kt=t,t=Ft(r,e)}else Rt=t,t=u;return t}function Sr(){var r;return(r=Lr())===u&&(r=function(){var r,e,n,o,a,i;return r=Rt,(e=br())===u&&(e=ar()),e!==u?(Ar(),61===t.charCodeAt(Rt)?(n="=",Rt++):(n=u,0===Ut&&Yt(Ot)),n!==u?(Ar(),(o=_r())!==u?(kt=r,a=e,i=o,r={location:Vt(),target:a,type:"assignment",value:i}):(Rt=r,r=u)):(Rt=r,r=u)):(Rt=r,r=u),r}())===u&&(r=xr())===u&&(r=mr())===u&&(r=yr())===u&&(r=br())===u&&(r=Cr())===u&&(r=sr())===u&&(r=Xt())===u&&(r=ar()),r}function Fr(t,r){return t.map((t=>t[r]))}function Rr(t){return(t||[])[0]||[]}if((n=i())!==u&&Rt===t.length)return n;throw n!==u&&Rt<t.length&&Yt({type:"end"}),function(t,e,n){return new r(r.buildMessage(t,e),t,e,n)}(Pt,Dt<t.length?t.charAt(Dt):null,Dt<t.length?Kt(Dt,Dt+1):Kt(Dt,Dt))}}}},r={};return function e(n){var u=r[n];if(void 0!==u)return u.exports;var o=r[n]={exports:{}};return t[n].call(o.exports,o,o.exports,e),o.exports}(6)})()));