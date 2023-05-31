!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.maapInpParser=e():t.maapInpParser=e()}(self,(()=>(()=>{"use strict";var t={6:function(t,e,r){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const u=n(r(759)),o=n(r(111));e.default=(0,o.default)(u.default)},954:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=function t(e,r,n,u=[]){try{const t=e.parse(r,n);if(!(null==n?void 0:n.locations)){const e=t=>{t&&delete t.location,"object"==typeof t&&Object.values(t).forEach((t=>e(t)))};e(t)}return{errors:u,input:r,output:t}}catch(o){const a=o;if(a.location&&!1!==(null==n?void 0:n.safeMode)){const o=r.split("\n"),i=a.location.start.line-1;return o[i]=`// ${o[i]}`,t(e,o.join("\n"),n,u.concat(a))}throw o}}},792:(t,e)=>{function r(t){return["number","boolean","timer"].indexOf(t)>=0}function n(t){return["sensitivity","title","file","block","conditional_block","alias","plotfil","user_evt","function","set_timer","lookup_variable","action"].indexOf(t)>=0}function u(t){return t.value?"T":"F"}function o(t){return`TIMER #${t.value}`}function a(t){switch(t.type){case"number":return function(t){let e=`${t.value}`;return t.units&&(e+=` ${t.units}`),e}(t);case"boolean":return u(t);default:return o(t)}}function i(t){return t.value}function s(t){return t.value}function c(t){let e=`${t.index} `;return t.flag&&(e+=`${u(t.flag)} `),"parameter_name"===t.value.type?e+=s(t.value):e+=b(t.value),e}function l(t){return`${i(t.value)}(${function(t){let e="";return t.forEach((t=>{e+=`${v(t)},`})),e.substring(0,e.length-1)}(t.arguments)})`}function f(t){let e=`${v(t.value.left)} ${t.value.op} `;return"expression"===t.value.right.type?e+=f(t.value.right):e+=v(t.value.right),e}function p(t){return`(${f(t.value)})`}function v(t){return"call_expression"===t.type?l(t):"expression_block"===t.type?p(t):y(t)}function h(t){let e="";return e="call_expression"===t.target.type?l(t.target):i(t.target),`${e} = ${b(t.value)}`}function d(t){return`${y(t.target)} IS ${b(t.value)}`}function A(t){return`${y(t.target)} AS ${i(t.value)}`}function b(t){switch(t.type){case"is_expression":return d(t);case"expression":return f(t);default:return v(t)}}function y(t){return"call_expression"===t.type?l(t):r(t.type)?a(t):"parameter_name"===t.type?s(t):i(t)}function m(t){switch(t.type){case"sensitivity":return`SENSITIVITY ${t.value}`;case"title":return`TITLE\n${t.value||""}\nEND`;case"file":return`${(s=t).fileType} ${s.value}`;case"block":return`${(a=t).blockType}\n${a.value.map((t=>x(t))).join("\n")}\nEND`;case"conditional_block":return`${(u=t).blockType} ${b(u.test)}\n${u.value.map((t=>x(t))).join("\n")}\nEND`;case"alias":return`ALIAS\n${t.value.map((t=>A(t))).join("\n")}\nEND`;case"plotfil":return`PLOTFIL ${(n=t).n}\n${n.value.map((t=>t.map((t=>y(t))).join(","))).join("\n")}\nEND`;case"user_evt":return`USEREVT\n${g(t.value)}\nEND`;case"function":return`FUNCTION ${i((r=t).name)} = ${b(r.value)}`;case"set_timer":return`SET ${o(t.value)}`;default:return`LOOKUP VARIABLE ${y((e=t).name)}\n${e.value.join("\n")}\nEND`}var e,r,n,u,a,s}function g(t){return t.map((t=>{return"parameter"===t.type?c(t):"action"===t.type?`ACTION #${(e=t).index}\n${g(e.value)}\nEND`:x(t);var e})).join("\n")}function C(t){return`// ${t.value}`}function x(t){return"comment"===t.type?C(t):n(t.type)?m(t):"assignment"===t.type?h(t):"as_expression"===t.type?A(t):b(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){if(n(t.type))return m(t);if(r(t.type))return a(t);switch(t.type){case"program":return t.value.map((t=>x(t))).join("\n");case"parameter":return c(t);case"call_expression":return l(t);case"expression":return f(t);case"expression_block":return p(t);case"assignment":return h(t);case"is_expression":return d(t);case"as_expression":return A(t);case"identifier":return i(t);case"parameter_name":return s(t);case"comment":return C(t);default:throw new Error(`Unexpected input type: ${t.type}`)}}},111:function(t,e,r){var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const u=n(r(954)),o=n(r(792));e.default=function(t){const e={options:{locations:!1,safeMode:!0},parse:(r,n)=>(0,u.default)(t,r,Object.assign(Object.assign({},e.options),n)),toString:t=>(0,o.default)(t)};return e}},759:t=>{function e(t,r,n,u){var o=Error.call(this,t);return Object.setPrototypeOf&&Object.setPrototypeOf(o,e.prototype),o.expected=r,o.found=n,o.location=u,o.name="SyntaxError",o}function r(t,e,r){return r=r||" ",t.length>e?t:(e-=t.length,t+(r+=r.repeat(e)).slice(0,e))}!function(t,e){function r(){this.constructor=t}r.prototype=e.prototype,t.prototype=new r}(e,Error),e.prototype.format=function(t){var e="Error: "+this.message;if(this.location){var n,u=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){u=t[n].text.split(/\r\n|\n|\r/g);break}var o=this.location.start,a=this.location.source+":"+o.line+":"+o.column;if(u){var i=this.location.end,s=r("",o.line.toString().length),c=u[o.line-1],l=o.line===i.line?i.column:c.length+1;e+="\n --\x3e "+a+"\n"+s+" |\n"+o.line+" | "+c+"\n"+s+" | "+r("",o.column-1)+r("",l-o.column,"^")}else e+="\n at "+a}return e},e.buildMessage=function(t,e){var r={literal:function(t){return'"'+u(t.text)+'"'},class:function(t){var e=t.parts.map((function(t){return Array.isArray(t)?o(t[0])+"-"+o(t[1]):o(t)}));return"["+(t.inverted?"^":"")+e+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function u(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function o(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function a(t){return r[t.type](t)}return"Expected "+function(t){var e,r,n=t.map(a);if(n.sort(),n.length>0){for(e=1,r=1;e<n.length;e++)n[e-1]!==n[e]&&(n[r]=n[e],r++);n.length=r}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+u(t)+'"':"end of input"}(e)+" found."},t.exports={SyntaxError:e,parse:function(t,r){var n,u={},o=(r=void 0!==r?r:{}).grammarSource,a={Start:Wt},i=Wt,s="**",c="TIMER",l=/^[\n\r\u2028\u2029]/,f=/^[a-zA-Z]/,p=/^[a-zA-Z0-9]/,v=/^[0-9]/,h=/^[1-9]/,d=/^[+\-]/,A=/^[a-zA-Z0-9:()|]/,b={type:"any"},y=Bt("\t",!1),m=Bt("\v",!1),g=Bt("\f",!1),C=Bt(" ",!1),x=Bt(" ",!1),_=Bt("\ufeff",!1),E=Ht(["\n","\r","\u2028","\u2029"],!1,!1),L=Bt("\n",!1),$=Bt("\r\n",!1),w=Bt("\r",!1),T=Bt("\u2028",!1),j=Bt("\u2029",!1),I=Bt("//",!1),N=Bt("!",!1),O=Bt("C ",!1),S=Bt("**",!1),F=Ht([["a","z"],["A","Z"]],!1,!1),R=Bt("$",!1),k=Bt("_",!1),M=Bt("\\",!1),D=Ht([["a","z"],["A","Z"],["0","9"]],!1,!1),P=Bt("/",!1),U=Bt(".",!1),z=Bt("0",!1),V=Ht([["0","9"]],!1,!1),Z=Ht([["1","9"]],!1,!1),B=Bt("e",!0),H=Ht(["+","-"],!1,!1),K=Ht([["a","z"],["A","Z"],["0","9"],":","(",")","|"],!1,!1),Y=Bt("#",!1),G=Bt("ACTION",!0),W=Bt("ALIAS",!0),q=Bt("AS",!0),J=Bt("END",!0),Q=Bt(" TIME",!0),X=Bt("F",!0),tt=Bt("FALSE",!0),et=Bt("FUNCTION",!0),rt=Bt("INCLUDE",!0),nt=Bt("INITIATOR",!0),ut=Bt("S",!0),ot=Bt("IF",!0),at=Bt("IS",!0),it=Bt("LOOKUP VARIABLE",!0),st=Bt("OFF",!0),ct=Bt("ON",!0),lt=Bt("PARAMETER CHANGE",!0),ft=Bt("PARAMETER FILE",!0),pt=Bt("PLOTFIL",!0),vt=Bt("SENSITIVITY",!0),ht=Bt("SET",!0),dt=(Bt("SI",!0),Bt("T",!0)),At=Bt("TIMER",!1),bt=Bt("TITLE",!0),yt=Bt("TRUE",!0),mt=Bt("USEREVT",!0),gt=Bt("WHEN",!0),Ct=Bt(",",!1),xt=Bt("(",!1),_t=Bt(")",!1),Et=Bt("*",!1),Lt=Bt(">=",!1),$t=Bt("<=",!1),wt=Bt(">",!1),Tt=Bt("<",!1),jt=Bt("+",!1),It=Bt("-",!1),Nt=Bt("AND",!1),Ot=Bt("=",!1),St=function(){return parseFloat(Vt())},Ft=function(t){return t.filter((t=>"comment"===t.type))},Rt=function(t,e){return[t].concat(Re(e,1))},kt=0,Mt=0,Dt=[{line:1,column:1}],Pt=0,Ut=[],zt=0;if("startRule"in r){if(!(r.startRule in a))throw new Error("Can't start parsing from rule \""+r.startRule+'".');i=a[r.startRule]}function Vt(){return t.substring(Mt,kt)}function Zt(){return Yt(Mt,kt)}function Bt(t,e){return{type:"literal",text:t,ignoreCase:e}}function Ht(t,e,r){return{type:"class",parts:t,inverted:e,ignoreCase:r}}function Kt(e){var r,n=Dt[e];if(n)return n;for(r=e-1;!Dt[r];)r--;for(n={line:(n=Dt[r]).line,column:n.column};r<e;)10===t.charCodeAt(r)?(n.line++,n.column=1):n.column++,r++;return Dt[e]=n,n}function Yt(t,e){var r=Kt(t),n=Kt(e);return{source:o,start:{offset:t,line:r.line,column:r.column},end:{offset:e,line:n.line,column:n.column}}}function Gt(t){kt<Pt||(kt>Pt&&(Pt=kt,Ut=[]),Ut.push(t))}function Wt(){var t,e;return t=kt,de(),e=function(){var t,e;return t=kt,(e=Se())===u&&(e=null),Mt=t,e={type:"program",value:e||[]}}(),de(),Mt=t,e}function qt(){var e,r,n;return e=kt,r=kt,zt++,n=function(){var e;return l.test(t.charAt(kt))?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(E)),e}(),zt--,n===u?r=void 0:(kt=r,r=u),r!==u?(n=function(){var e;return t.length>kt?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(b)),e}(),n!==u?e=r=[r,n]:(kt=e,e=u)):(kt=e,e=u),e}function Jt(){var e;return 9===t.charCodeAt(kt)?(e="\t",kt++):(e=u,0===zt&&Gt(y)),e===u&&(11===t.charCodeAt(kt)?(e="\v",kt++):(e=u,0===zt&&Gt(m)),e===u&&(12===t.charCodeAt(kt)?(e="\f",kt++):(e=u,0===zt&&Gt(g)),e===u&&(32===t.charCodeAt(kt)?(e=" ",kt++):(e=u,0===zt&&Gt(C)),e===u&&(160===t.charCodeAt(kt)?(e=" ",kt++):(e=u,0===zt&&Gt(x)),e===u&&(65279===t.charCodeAt(kt)?(e="\ufeff",kt++):(e=u,0===zt&&Gt(_))))))),e}function Qt(){var e;return 10===t.charCodeAt(kt)?(e="\n",kt++):(e=u,0===zt&&Gt(L)),e===u&&("\r\n"===t.substr(kt,2)?(e="\r\n",kt+=2):(e=u,0===zt&&Gt($)),e===u&&(13===t.charCodeAt(kt)?(e="\r",kt++):(e=u,0===zt&&Gt(w)),e===u&&(8232===t.charCodeAt(kt)?(e="\u2028",kt++):(e=u,0===zt&&Gt(T)),e===u&&(8233===t.charCodeAt(kt)?(e="\u2029",kt++):(e=u,0===zt&&Gt(j)))))),e}function Xt(){var e,r,n,o;if(e=kt,r=function(){var e;return"//"===t.substr(kt,2)?(e="//",kt+=2):(e=u,0===zt&&Gt(I)),e===u&&(33===t.charCodeAt(kt)?(e="!",kt++):(e=u,0===zt&&Gt(N)),e===u&&("C "===t.substr(kt,2)?(e="C ",kt+=2):(e=u,0===zt&&Gt(O)),e===u&&(t.substr(kt,2)===s?(e=s,kt+=2):(e=u,0===zt&&Gt(S))))),e}(),r!==u){for(n=[],o=qt();o!==u;)n.push(o),o=qt();Mt=e,e={type:"comment",value:Re(n,1).join("")}}else kt=e,e=u;return e}function te(){var e;return(e=oe())===u&&(e=function(){var e,r,n,o,a,i,s,c;return e=kt,r=function(){var e,r,n,o,a;if(e=kt,(r=re())!==u)if(46===t.charCodeAt(kt)?(n=".",kt++):(n=u,0===zt&&Gt(U)),n!==u){for(o=[],a=ne();a!==u;)o.push(a),a=ne();(a=ue())===u&&(a=null),Mt=e,e=parseFloat(Vt())}else kt=e,e=u;else kt=e,e=u;if(e===u){if(e=kt,46===t.charCodeAt(kt)?(r=".",kt++):(r=u,0===zt&&Gt(U)),r!==u){if(n=[],(o=ne())!==u)for(;o!==u;)n.push(o),o=ne();else n=u;n!==u?((o=ue())===u&&(o=null),Mt=e,e=St()):(kt=e,e=u)}else kt=e,e=u;e===u&&(e=kt,(r=re())!==u?((n=ue())===u&&(n=null),Mt=e,e=St()):(kt=e,e=u))}return e}(),r!==u?(n=kt,zt++,o=function(){var e;return f.test(t.charAt(kt))?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(F)),e===u&&(36===t.charCodeAt(kt)?(e="$",kt++):(e=u,0===zt&&Gt(R)),e===u&&(95===t.charCodeAt(kt)?(e="_",kt++):(e=u,0===zt&&Gt(k)),e===u&&(92===t.charCodeAt(kt)?(e="\\",kt++):(e=u,0===zt&&Gt(M))))),e}(),o===u&&(o=ne()),zt--,o===u?n=void 0:(kt=n,n=u),n!==u?(o=kt,a=Ae(),(i=ee())!==u?o=a=[a,i]:(kt=o,o=u),o===u&&(o=null),Mt=e,s=r,c=o,e={location:Zt(),type:"number",units:(c||[])[1],value:s}):(kt=e,e=u)):(kt=e,e=u),e}())===u&&(e=le()),e}function ee(){var e,r,n,o,a;if(e=kt,r=[],p.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=u,0===zt&&Gt(D)),n!==u)for(;n!==u;)r.push(n),p.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=u,0===zt&&Gt(D));else r=u;return r!==u?(n=kt,t.substr(kt,2)===s?(o=s,kt+=2):(o=u,0===zt&&Gt(S)),o===u&&(47===t.charCodeAt(kt)?(o="/",kt++):(o=u,0===zt&&Gt(P))),o!==u&&(a=ee())!==u?n=o=[o,a]:(kt=n,n=u),n===u&&(n=null),Mt=e,e=function(t,e){let r=t.join("");return e&&(r+=e[0]+e[1]),r}(r,n)):(kt=e,e=u),e}function re(){var e,r,n,o;if(48===t.charCodeAt(kt)?(e="0",kt++):(e=u,0===zt&&Gt(z)),e===u)if(e=kt,r=function(){var e;return h.test(t.charAt(kt))?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(Z)),e}(),r!==u){for(n=[],o=ne();o!==u;)n.push(o),o=ne();e=r=[r,n]}else kt=e,e=u;return e}function ne(){var e;return v.test(t.charAt(kt))?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(V)),e}function ue(){var e,r,n;return e=kt,r=function(){var e;return"e"===t.substr(kt,1).toLowerCase()?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(B)),e}(),r!==u?(n=function(){var e,r,n,o;if(e=kt,d.test(t.charAt(kt))?(r=t.charAt(kt),kt++):(r=u,0===zt&&Gt(H)),r===u&&(r=null),n=[],(o=ne())!==u)for(;o!==u;)n.push(o),o=ne();else n=u;return n!==u?e=r=[r,n]:(kt=e,e=u),e}(),n!==u?e=r=[r,n]:(kt=e,e=u)):(kt=e,e=u),e}function oe(){var e,r,n,o;return e=kt,r=function(){var e;return"true"===t.substr(kt,4).toLowerCase()?(e=t.substr(kt,4),kt+=4):(e=u,0===zt&&Gt(yt)),e}(),r===u&&(r=function(){var e;return"false"===t.substr(kt,5).toLowerCase()?(e=t.substr(kt,5),kt+=5):(e=u,0===zt&&Gt(tt)),e}(),r===u&&(r=function(){var e;return"t"===t.substr(kt,1).toLowerCase()?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(dt)),e}(),r===u&&(r=function(){var e;return"f"===t.substr(kt,1).toLowerCase()?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(X)),e}()))),r!==u?(n=kt,zt++,f.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=u,0===zt&&Gt(F)),zt--,o===u?n=void 0:(kt=n,n=u),n!==u?(Mt=e,e=function(t){let e="TRUE"===t||"T"===t;return{location:Zt(),type:"boolean",value:e}}(r)):(kt=e,e=u)):(kt=e,e=u),e}function ae(){var e,r,n,o;return e=kt,(r=pe())===u&&(r=ve())===u&&(r=fe()),r!==u?(n=kt,zt++,f.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=u,0===zt&&Gt(F)),zt--,o===u?n=void 0:(kt=n,n=u),n!==u?e=r=[r,n]:(kt=e,e=u)):(kt=e,e=u),e}function ie(){var e,r,n,o,a;if(e=kt,r=kt,zt++,n=ae(),zt--,n===u?r=void 0:(kt=r,r=u),r!==u){if(n=[],p.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=u,0===zt&&Gt(D)),o!==u)for(;o!==u;)n.push(o),p.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=u,0===zt&&Gt(D));else n=u;n!==u?(Mt=e,a=n,e={location:Zt(),type:"identifier",value:a.join("")}):(kt=e,e=u)}else kt=e,e=u;return e}function se(){var e;return A.test(t.charAt(kt))?(e=t.charAt(kt),kt++):(e=u,0===zt&&Gt(K)),e}function ce(){var t,e,r,n,o,a,i,s,c;if(t=kt,e=kt,zt++,r=ae(),zt--,r===u?e=void 0:(kt=e,e=u),e!==u){if(r=[],(n=se())!==u)for(;n!==u;)r.push(n),n=se();else r=u;if(r!==u){if(n=[],o=kt,a=Ae(),i=kt,zt++,s=ae(),zt--,s===u?i=void 0:(kt=i,i=u),i!==u){if(s=[],(c=se())!==u)for(;c!==u;)s.push(c),c=se();else s=u;s!==u?o=a=[a,i,s]:(kt=o,o=u)}else kt=o,o=u;if(o!==u)for(;o!==u;)if(n.push(o),o=kt,a=Ae(),i=kt,zt++,s=ae(),zt--,s===u?i=void 0:(kt=i,i=u),i!==u){if(s=[],(c=se())!==u)for(;c!==u;)s.push(c),c=se();else s=u;s!==u?o=a=[a,i,s]:(kt=o,o=u)}else kt=o,o=u;else n=u;n!==u?(Mt=t,t=function(t,e){let r=t.join("");return e&&(r+=" "+Re(e,2).map((t=>t.join(""))).join(" ")),{location:Zt(),type:"parameter_name",value:r}}(r,n)):(kt=t,t=u)}else kt=t,t=u}else kt=t,t=u;return t}function le(){var e,r,n,o,a,i;if(e=kt,r=function(){var e;return t.substr(kt,5)===c?(e=c,kt+=5):(e=u,0===zt&&Gt(At)),e}(),r!==u){if(Ae(),35===t.charCodeAt(kt)?(n="#",kt++):(n=u,0===zt&&Gt(Y)),n===u&&(n=null),o=[],v.test(t.charAt(kt))?(a=t.charAt(kt),kt++):(a=u,0===zt&&Gt(V)),a!==u)for(;a!==u;)o.push(a),v.test(t.charAt(kt))?(a=t.charAt(kt),kt++):(a=u,0===zt&&Gt(V));else o=u;o!==u?(Mt=e,i=o,e={location:Zt(),type:"timer",value:Number(i.join(""))}):(kt=e,e=u)}else kt=e,e=u;return e}function fe(){var e;return"as"===t.substr(kt,2).toLowerCase()?(e=t.substr(kt,2),kt+=2):(e=u,0===zt&&Gt(q)),e}function pe(){var e,r,n,o;return e=kt,"end"===t.substr(kt,3).toLowerCase()?(r=t.substr(kt,3),kt+=3):(r=u,0===zt&&Gt(J)),r!==u?(n=kt,zt++," time"===t.substr(kt,5).toLowerCase()?(o=t.substr(kt,5),kt+=5):(o=u,0===zt&&Gt(Q)),zt--,o===u?n=void 0:(kt=n,n=u),n!==u?e=r=[r,n]:(kt=e,e=u)):(kt=e,e=u),e}function ve(){var e;return"is"===t.substr(kt,2).toLowerCase()?(e=t.substr(kt,2),kt+=2):(e=u,0===zt&&Gt(at)),e}function he(){var t,e,r;if(t=kt,e=[],(r=Jt())===u&&(r=Qt())===u&&(r=Xt()),r!==u)for(;r!==u;)e.push(r),(r=Jt())===u&&(r=Qt())===u&&(r=Xt());else e=u;return e!==u&&(Mt=t,e=Ft(e)),e}function de(){var t,e,r;for(t=kt,e=[],(r=Jt())===u&&(r=Qt())===u&&(r=Xt());r!==u;)e.push(r),(r=Jt())===u&&(r=Qt())===u&&(r=Xt());return Mt=t,Ft(e)}function Ae(){var t,e;for(t=[],e=Jt();e!==u;)t.push(e),e=Jt();return t}function be(){var e,r,n,o,a,i,s;return e=kt,(r=Ce())!==u?(n=kt,o=Ae(),44===t.charCodeAt(kt)?(a=",",kt++):(a=u,0===zt&&Gt(Ct)),a!==u?(i=Ae(),(s=be())!==u?n=o=[o,a,i,s]:(kt=n,n=u)):(kt=n,n=u),n===u&&(n=null),Mt=e,e=function(t,e){let r=[t];return e&&(r=r.concat(e[3])),r}(r,n)):(kt=e,e=u),e}function ye(){var e,r,n,o,a,i;return e=kt,(r=ie())!==u?(Ae(),40===t.charCodeAt(kt)?(n="(",kt++):(n=u,0===zt&&Gt(xt)),n!==u?((o=be())===u&&(o=null),41===t.charCodeAt(kt)?(a=")",kt++):(a=u,0===zt&&Gt(_t)),a!==u?(Mt=e,i=r,e={arguments:o||[],location:Zt(),type:"call_expression",value:i}):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u),e}function me(){var e,r,n,o,a,i,c;return e=kt,(r=Ce())!==u?(Ae(),n=function(){var e;return t.substr(kt,2)===s?(e=s,kt+=2):(e=u,0===zt&&Gt(S)),e===u&&(42===t.charCodeAt(kt)?(e="*",kt++):(e=u,0===zt&&Gt(Et)),e===u&&(47===t.charCodeAt(kt)?(e="/",kt++):(e=u,0===zt&&Gt(P)),e===u&&(">="===t.substr(kt,2)?(e=">=",kt+=2):(e=u,0===zt&&Gt(Lt)),e===u&&("<="===t.substr(kt,2)?(e="<=",kt+=2):(e=u,0===zt&&Gt($t)),e===u&&(62===t.charCodeAt(kt)?(e=">",kt++):(e=u,0===zt&&Gt(wt)),e===u&&(60===t.charCodeAt(kt)?(e="<",kt++):(e=u,0===zt&&Gt(Tt)),e===u&&(43===t.charCodeAt(kt)?(e="+",kt++):(e=u,0===zt&&Gt(jt)),e===u&&(45===t.charCodeAt(kt)?(e="-",kt++):(e=u,0===zt&&Gt(It)),e===u&&("AND"===t.substr(kt,3)?(e="AND",kt+=3):(e=u,0===zt&&Gt(Nt))))))))))),e}(),n!==u?(Ae(),(o=me())===u&&(o=Ce()),o!==u?(Mt=e,a=r,i=n,c=o,e={location:Zt(),type:"expression",value:{left:a,op:i,right:c}}):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u),e}function ge(){var e,r,n,o,a;return e=kt,40===t.charCodeAt(kt)?(r="(",kt++):(r=u,0===zt&&Gt(xt)),r!==u&&(n=me())!==u?(41===t.charCodeAt(kt)?(o=")",kt++):(o=u,0===zt&&Gt(_t)),o!==u?(Mt=e,a=n,e={location:Zt(),type:"expression_block",value:a}):(kt=e,e=u)):(kt=e,e=u),e}function Ce(){var t;return(t=ye())===u&&(t=ge())===u&&(t=Le()),t}function xe(){var t,e,r,n,o;return t=kt,(e=Le())!==u?(Ae(),ve()!==u?(Ae(),(r=Ee())!==u?(Mt=t,n=e,o=r,t={location:Zt(),target:n,type:"is_expression",value:o}):(kt=t,t=u)):(kt=t,t=u)):(kt=t,t=u),t}function _e(){var t,e,r,n,o;return t=kt,(e=Le())!==u?(Ae(),fe()!==u?(Ae(),(r=Le())!==u?(Mt=t,n=e,o=r,t={location:Zt(),target:n,type:"as_expression",value:o}):(kt=t,t=u)):(kt=t,t=u)):(kt=t,t=u),t}function Ee(){var t;return(t=xe())===u&&(t=me())===u&&(t=Ce()),t}function Le(){var t;return(t=ye())===u&&(t=te())===u&&(t=ce())===u&&(t=ie()),t}function $e(){var e,r,n;return e=kt,r=function(){var e,r,n,o;return e=kt,r=function(){var e;return"sensitivity"===t.substr(kt,11).toLowerCase()?(e=t.substr(kt,11),kt+=11):(e=u,0===zt&&Gt(vt)),e}(),r!==u&&he()!==u?(n=function(){var e;return"on"===t.substr(kt,2).toLowerCase()?(e=t.substr(kt,2),kt+=2):(e=u,0===zt&&Gt(ct)),e}(),n===u&&(n=function(){var e;return"off"===t.substr(kt,3).toLowerCase()?(e=t.substr(kt,3),kt+=3):(e=u,0===zt&&Gt(st)),e}()),n!==u?(Mt=e,o=n,e={location:Zt(),type:"sensitivity",value:o}):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o,a;return e=kt,r=function(){var e;return"title"===t.substr(kt,5).toLowerCase()?(e=t.substr(kt,5),kt+=5):(e=u,0===zt&&Gt(bt)),e}(),r!==u&&he()!==u?(n=kt,(o=we())!==u&&(a=he())!==u?n=o=[o,a]:(kt=n,n=u),n===u&&(n=null),(o=pe())!==u?(Mt=e,e={type:"title",value:(n||[])[0]}):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o;if(e=kt,r=function(){var e;return"parameter file"===t.substr(kt,14).toLowerCase()?(e=t.substr(kt,14),kt+=14):(e=u,0===zt&&Gt(ft)),e}(),r===u&&(r=function(){var e;return"include"===t.substr(kt,7).toLowerCase()?(e=t.substr(kt,7),kt+=7):(e=u,0===zt&&Gt(rt)),e}()),r!==u){if(Ae(),n=[],(o=qt())!==u)for(;o!==u;)n.push(o),o=qt();else n=u;n!==u?(Mt=e,e={fileType:r,type:"file",value:Re(n,1).join("")}):(kt=e,e=u)}else kt=e,e=u;return e}(),r===u&&(r=function(){var e,r,n,o,a;return e=kt,r=function(){var e;return"parameter change"===t.substr(kt,16).toLowerCase()?(e=t.substr(kt,16),kt+=16):(e=u,0===zt&&Gt(lt)),e}(),r===u&&(r=function(){var e,r,n;return e=kt,"initiator"===t.substr(kt,9).toLowerCase()?(r=t.substr(kt,9),kt+=9):(r=u,0===zt&&Gt(nt)),r!==u?("s"===t.substr(kt,1).toLowerCase()?(n=t.charAt(kt),kt++):(n=u,0===zt&&Gt(ut)),n===u&&(n=null),Mt=e,e="INITIATORS"):(kt=e,e=u),e}()),r!==u&&he()!==u?(n=kt,(o=Se())!==u&&(a=he())!==u?n=o=[o,a]:(kt=n,n=u),n===u&&(n=null),(o=pe())!==u?(Mt=e,e={blockType:r,type:"block",value:ke(n)}):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o,a,i;return e=kt,r=function(){var e;return"when"===t.substr(kt,4).toLowerCase()?(e=t.substr(kt,4),kt+=4):(e=u,0===zt&&Gt(gt)),e}(),r===u&&(r=function(){var e;return"if"===t.substr(kt,2).toLowerCase()?(e=t.substr(kt,2),kt+=2):(e=u,0===zt&&Gt(ot)),e}()),r!==u?(Ae(),(n=Ee())!==u&&he()!==u?(o=kt,(a=Se())!==u&&(i=he())!==u?o=a=[a,i]:(kt=o,o=u),o===u&&(o=null),(a=pe())!==u?(Mt=e,e={blockType:r,test:n,type:"conditional_block",value:ke(o)}):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o,a;return e=kt,r=function(){var e;return"alias"===t.substr(kt,5).toLowerCase()?(e=t.substr(kt,5),kt+=5):(e=u,0===zt&&Gt(W)),e}(),r!==u&&he()!==u?(n=kt,o=function(){var t,e,r,n,o,a;if(t=kt,(e=_e())!==u){for(r=[],n=kt,(o=he())!==u&&(a=_e())!==u?n=o=[o,a]:(kt=n,n=u);n!==u;)r.push(n),n=kt,(o=he())!==u&&(a=_e())!==u?n=o=[o,a]:(kt=n,n=u);Mt=t,t=Rt(e,r)}else kt=t,t=u;return t}(),o!==u&&(a=he())!==u?n=o=[o,a]:(kt=n,n=u),n===u&&(n=null),(o=pe())!==u?(Mt=e,e={type:"alias",value:ke(n)}):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o,a,i,s,c;if(e=kt,r=function(){var e;return"plotfil"===t.substr(kt,7).toLowerCase()?(e=t.substr(kt,7),kt+=7):(e=u,0===zt&&Gt(pt)),e}(),r!==u){if(Ae(),n=[],v.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=u,0===zt&&Gt(V)),o!==u)for(;o!==u;)n.push(o),v.test(t.charAt(kt))?(o=t.charAt(kt),kt++):(o=u,0===zt&&Gt(V));else n=u;n!==u&&(o=he())!==u?(a=kt,(i=je())!==u&&(s=he())!==u?a=i=[i,s]:(kt=a,a=u),a===u&&(a=null),(i=pe())!==u?(Mt=e,c=a,e={n:Number(n.join("")),type:"plotfil",value:ke(c)}):(kt=e,e=u)):(kt=e,e=u)}else kt=e,e=u;return e}(),r===u&&(r=function(){var e,r,n,o,a;return e=kt,r=function(){var e;return"userevt"===t.substr(kt,7).toLowerCase()?(e=t.substr(kt,7),kt+=7):(e=u,0===zt&&Gt(mt)),e}(),r!==u&&he()!==u?(n=kt,(o=Ie())!==u&&(a=he())!==u?n=o=[o,a]:(kt=n,n=u),n===u&&(n=null),(o=pe())!==u?(Mt=e,e={type:"user_evt",value:ke(n)}):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o,a;return e=kt,r=function(){var e;return"function"===t.substr(kt,8).toLowerCase()?(e=t.substr(kt,8),kt+=8):(e=u,0===zt&&Gt(et)),e}(),r!==u?(Ae(),(n=ie())!==u?(Ae(),61===t.charCodeAt(kt)?(o="=",kt++):(o=u,0===zt&&Gt(Ot)),o!==u?(Ae(),(a=Ee())!==u?(Mt=e,e={name:n,type:"function",value:a}):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n;return e=kt,r=function(){var e;return"set"===t.substr(kt,3).toLowerCase()?(e=t.substr(kt,3),kt+=3):(e=u,0===zt&&Gt(ht)),e}(),r!==u?(Ae(),(n=le())!==u?(Mt=e,e={type:"set_timer",value:n}):(kt=e,e=u)):(kt=e,e=u),e}(),r===u&&(r=function(){var e,r,n,o,a,i;return e=kt,r=function(){var e;return"lookup variable"===t.substr(kt,15).toLowerCase()?(e=t.substr(kt,15),kt+=15):(e=u,0===zt&&Gt(it)),e}(),r!==u?(Ae(),(n=Le())!==u&&he()!==u?(o=kt,(a=Oe())!==u&&(i=he())!==u?o=a=[a,i]:(kt=o,o=u),o===u&&(o=null),(a=pe())!==u?(Mt=e,e={name:n,type:"lookup_variable",value:ke(o)}):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u),e}())))))))))),r!==u&&(Mt=e,n=r,r={location:Zt(),...n}),r}function we(){var t,e,r,n,o,a;if(t=kt,e=kt,zt++,r=pe(),zt--,r===u?e=void 0:(kt=e,e=u),e!==u){if(r=[],(n=qt())!==u)for(;n!==u;)r.push(n),n=qt();else r=u;r!==u?(n=kt,(o=he())!==u&&(a=we())!==u?n=o=[o,a]:(kt=n,n=u),n===u&&(n=null),Mt=t,t=function(t,e){let r=Re(t,1).join("");return e&&(r+="\n"+e[1]),r}(r,n)):(kt=t,t=u)}else kt=t,t=u;return t}function Te(){var e,r,n,o,a,i,s,c;if(e=kt,(r=Le())!==u){for(n=[],o=kt,a=Ae(),44===t.charCodeAt(kt)?(i=",",kt++):(i=u,0===zt&&Gt(Ct)),i!==u?(s=Ae(),(c=Te())!==u?o=a=[a,i,s,c]:(kt=o,o=u)):(kt=o,o=u);o!==u;)n.push(o),o=kt,a=Ae(),44===t.charCodeAt(kt)?(i=",",kt++):(i=u,0===zt&&Gt(Ct)),i!==u?(s=Ae(),(c=Te())!==u?o=a=[a,i,s,c]:(kt=o,o=u)):(kt=o,o=u);Mt=e,e=function(t,e){let r=[t];return e&&e.length>0&&(r=r.concat(Re(e,3)[0])),r}(r,n)}else kt=e,e=u;return e}function je(){var t,e,r,n,o,a;if(t=kt,(e=Te())!==u){for(r=[],n=kt,(o=he())!==u&&(a=je())!==u?n=o=[o,a]:(kt=n,n=u);n!==u;)r.push(n),n=kt,(o=he())!==u&&(a=je())!==u?n=o=[o,a]:(kt=n,n=u);Mt=t,t=function(t,e){let r=[t];return e&&e.length>0&&(r=r.concat(Re(e,1)[0])),r}(e,r)}else kt=t,t=u;return t}function Ie(){var t,e,r,n,o,a;if(t=kt,(e=Ne())!==u){for(r=[],n=kt,(o=he())!==u&&(a=Ne())!==u?n=o=[o,a]:(kt=n,n=u);n!==u;)r.push(n),n=kt,(o=he())!==u&&(a=Ne())!==u?n=o=[o,a]:(kt=n,n=u);Mt=t,t=Rt(e,r)}else kt=t,t=u;return t}function Ne(){var e;return(e=function(){var e,r,n,o,a,i,s;if(e=kt,r=[],v.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=u,0===zt&&Gt(V)),n!==u)for(;n!==u;)r.push(n),v.test(t.charAt(kt))?(n=t.charAt(kt),kt++):(n=u,0===zt&&Gt(V));else r=u;return r!==u?(n=Ae(),o=kt,(a=oe())!==u?o=a=[a,Ae()]:(kt=o,o=u),o===u&&(o=null),(a=Ee())===u&&(a=ce()),a!==u?(Mt=e,i=r,s=a,e={flag:(o||[])[0],location:Zt(),index:Number(i.join("")),type:"parameter",value:s}):(kt=e,e=u)):(kt=e,e=u),e}())===u&&(e=function(){var e,r,n,o,a,i,s,c,l;if(e=kt,r=function(){var e;return"action"===t.substr(kt,6).toLowerCase()?(e=t.substr(kt,6),kt+=6):(e=u,0===zt&&Gt(G)),e}(),r!==u)if(Ae(),35===t.charCodeAt(kt)?(n="#",kt++):(n=u,0===zt&&Gt(Y)),n!==u){if(o=[],v.test(t.charAt(kt))?(a=t.charAt(kt),kt++):(a=u,0===zt&&Gt(V)),a!==u)for(;a!==u;)o.push(a),v.test(t.charAt(kt))?(a=t.charAt(kt),kt++):(a=u,0===zt&&Gt(V));else o=u;o!==u&&(a=he())!==u?(i=kt,(s=Ie())!==u&&(c=he())!==u?i=s=[s,c]:(kt=i,i=u),i===u&&(i=null),(s=pe())!==u?(Mt=e,l=i,e={index:Number(o.join("")),location:Zt(),type:"action",value:ke(l)}):(kt=e,e=u)):(kt=e,e=u)}else kt=e,e=u;else kt=e,e=u;return e}())===u&&(e=Fe()),e}function Oe(){var t,e,r,n,o,a,i;if(t=kt,e=kt,zt++,r=ae(),zt--,r===u?e=void 0:(kt=e,e=u),e!==u){if(r=[],(n=qt())!==u)for(;n!==u;)r.push(n),n=qt();else r=u;if(r!==u){for(n=[],o=kt,(a=he())!==u&&(i=Oe())!==u?o=a=[a,i]:(kt=o,o=u);o!==u;)n.push(o),o=kt,(a=he())!==u&&(i=Oe())!==u?o=a=[a,i]:(kt=o,o=u);Mt=t,t=function(t,e){let r=[Re(t,1).join("")];return e&&e.length>0&&(r=r.concat(Re(e,1)[0])),r}(r,n)}else kt=t,t=u}else kt=t,t=u;return t}function Se(){var t,e,r,n,o,a;if(t=kt,(e=Fe())!==u){for(r=[],n=kt,(o=he())!==u&&(a=Fe())!==u?n=o=[o,a]:(kt=n,n=u);n!==u;)r.push(n),n=kt,(o=he())!==u&&(a=Fe())!==u?n=o=[o,a]:(kt=n,n=u);Mt=t,t=function(t,e){let r=[t];for(let t=0;t<e.length;t+=1){for(let n=0;n<e[t][0].length;n+=1)r=r.concat(e[t][0][n]);r=r.concat(e[t][1])}return r}(e,r)}else kt=t,t=u;return t}function Fe(){var e;return(e=$e())===u&&(e=function(){var e,r,n,o,a,i;return e=kt,(r=ye())===u&&(r=ie()),r!==u?(Ae(),61===t.charCodeAt(kt)?(n="=",kt++):(n=u,0===zt&&Gt(Ot)),n!==u?(Ae(),(o=Ee())!==u?(Mt=e,a=r,i=o,e={location:Zt(),target:a,type:"assignment",value:i}):(kt=e,e=u)):(kt=e,e=u)):(kt=e,e=u),e}())===u&&(e=_e())===u&&(e=xe())===u&&(e=me())===u&&(e=ye())===u&&(e=ge())===u&&(e=ce())===u&&(e=te())===u&&(e=ie()),e}function Re(t,e){return t.map((t=>t[e]))}function ke(t){return(t||[])[0]||[]}if((n=i())!==u&&kt===t.length)return n;throw n!==u&&kt<t.length&&Gt({type:"end"}),function(t,r,n){return new e(e.buildMessage(t,r),t,r,n)}(Ut,Pt<t.length?t.charAt(Pt):null,Pt<t.length?Yt(Pt,Pt+1):Yt(Pt,Pt))}}}},e={};return function r(n){var u=e[n];if(void 0!==u)return u.exports;var o=e[n]={exports:{}};return t[n].call(o.exports,o,o.exports,r),o.exports}(6)})()));