import{b as P,f as b}from"./@babel-IoSH5Qy_.js";import{r as m}from"./react-CQCqM3ha.js";function l(r){return"default"+r.charAt(0).toUpperCase()+r.substr(1)}function d(r){var t=y(r,"string");return typeof t=="symbol"?t:String(t)}function y(r,t){if(typeof r!="object"||r===null)return r;var o=r[Symbol.toPrimitive];if(o!==void 0){var e=o.call(r,t);if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(r)}function S(r,t,o){var e=m.useRef(r!==void 0),n=m.useState(t),u=n[0],f=n[1],i=r!==void 0,p=e.current;return e.current=i,!i&&p&&u!==t&&f(t),[i?r:u,m.useCallback(function(c){for(var a=arguments.length,v=new Array(a>1?a-1:0),s=1;s<a;s++)v[s-1]=arguments[s];o&&o.apply(void 0,[c].concat(v)),f(c)},[o])]}function h(r,t){return Object.keys(t).reduce(function(o,e){var n,u=o,f=u[l(e)],i=u[e],p=P(u,[l(e),e].map(d)),c=t[e],a=S(i,f,r[c]),v=a[0],s=a[1];return b({},p,(n={},n[e]=v,n[c]=s,n))},r)}export{h as u};
//# sourceMappingURL=uncontrollable-ooD6EiUa.js.map