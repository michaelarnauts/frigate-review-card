function e(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new n(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,g=m?m.emptyScript:"",v=_.reactiveElementPolyfillSupport,f=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);o?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...d(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const n=o.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const s=this.constructor,o=this[e];if(i??=s.getPropertyOptions(e),!((i.hasChanged??y)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,v?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.1");const A=globalThis,x=A.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,R="?"+C,P=`<${R}>`,M=document,k=()=>M.createComment(""),H=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,T="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,z=/>/g,N=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,q=M.createTreeWalker(M,129);function Z(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,s=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=I;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===I?"!--"===l[1]?r=O:void 0!==l[1]?r=z:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=N):void 0!==l[3]&&(r=N):r===N?">"===l[0]?(r=o??I,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?N:'"'===l[3]?L:D):r===L||r===D?r=N:r===O||r===z?r=I:(r=N,o=void 0);const d=r===N&&e[t+1].startsWith("/>")?" ":"";n+=r===I?i+P:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+C+d):i+C+(-2===c?t:d)}return[Z(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,c]=J(e,t);if(this.el=Y.createElement(l,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=q.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(S)){const t=c[n++],i=s.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?ee:"?"===r[1]?te:"@"===r[1]?ie:X}),s.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(e));if(j.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],k()),q.nextNode(),a.push({type:2,index:++o});s.append(e[t],k())}}}else if(8===s.nodeType)if(s.data===R)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)a.push({type:7,index:o}),e+=C.length-1}o++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function K(e,t,i=e,s){if(t===B)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=H(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=K(e,o._$AS(e,t.values),o,s)),t}class G{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);q.currentNode=s;let o=q.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new Q(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new se(o,this,e)),this._$AV.push(t),a=i[++r]}n!==a?.index&&(o=q.nextNode(),n++)}return q.currentNode=M,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),H(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new G(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Y(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new Q(this.O(k()),this.O(k()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(e,t=this,i,s){const o=this.strings;let n=!1;if(void 0===o)e=K(this,e,t,0),n=!H(e)||e!==this._$AH&&e!==B,n&&(this._$AH=e);else{const s=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=K(this,s[i+r],t,r),a===B&&(a=this._$AH[r]),n||=!H(a)||a!==this._$AH[r],a===V?e=V:e!==V&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class te extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ie extends X{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??V)===B)return;const i=this._$AH,s=e===V&&i!==V||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const oe=A.litHtmlPolyfillSupport;oe?.(Y,Q),(A.litHtmlVersions??=[]).push("3.3.1");const ne=globalThis;class re extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new Q(t.insertBefore(k(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}re._$litElement$=!0,re.finalized=!0,ne.litElementHydrateSupport?.({LitElement:re});const ae=ne.litElementPolyfillSupport;ae?.({LitElement:re}),(ne.litElementVersions??=[]).push("4.2.1");const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ce={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},he=(e=ce,t,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e)}}throw Error("Unsupported decorator location: "+s)};function de(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return de({...e,state:!0,attribute:!1})}function ue(e,t,i){const s=i?`?h=${encodeURIComponent(String(i))}`:"";return`/api/frigate/${encodeURIComponent(e)}/notifications/${encodeURIComponent(t)}/snapshot.jpg${s}`}const _e="3.0.0",me={instance:"frigate",severity:"alert",items_visible:5,reverse_order:!1,scrollable:!0,autoplay_on_hover:!0,popup_play_clip:!0,popup_show_date:!0,popup_show_duration:!0,popup_show_camera:!0,popup_show_zones:!0,debug:!1};let ge=class extends re{constructor(){super(...arguments),this._reviews=[],this._loading=!0,this._signedClips=new Map}_getDailyResetTimestamp(){if(!this._config?.daily_reset_time)return null;const[e,t]=this._config.daily_reset_time.split(":").map(Number);if(isNaN(e)||isNaN(t))return null;const i=new Date,s=new Date(i);return s.setHours(e,t,0,0),i<s&&s.setDate(s.getDate()-1),s.getTime()/1e3}static getConfigElement(){return document.createElement("frigate-review-card-editor")}static getStubConfig(){return{instance:"frigate",items_visible:5,scrollable:!0}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={...me,...e}}getCardSize(){return 3}getLayoutOptions(){return{grid_columns:4}}async firstUpdated(){await this._loadReviews(),await this._subscribeToReviews(),this._setupVisibilityHandler(),this._setupPolling(),customElements.whenDefined("ha-adaptive-dialog").then(()=>this.requestUpdate())}updated(e){e.has("hass")&&this.hass&&!this._unsubscribe&&this._subscribeToReviews()}disconnectedCallback(){super.disconnectedCallback(),this._cleanup()}_cleanup(){this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=void 0),this._pollInterval&&(clearInterval(this._pollInterval),this._pollInterval=void 0),this._boundVisibilityHandler&&(document.removeEventListener("visibilitychange",this._boundVisibilityHandler),this._boundVisibilityHandler=void 0),this._clearHoverIntent()}_setupVisibilityHandler(){this._boundVisibilityHandler=()=>{"visible"===document.visibilityState&&(console.debug("Frigate Review Card: Page became visible, refreshing..."),this._loadReviews(),this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=void 0),this._subscribeToReviews())},document.addEventListener("visibilitychange",this._boundVisibilityHandler)}_setupPolling(){this._pollInterval=window.setInterval(()=>{"visible"===document.visibilityState&&this._loadReviews()},1e4)}_getSeverityFilter(){const e=this._config?.severity;return e&&"all"!==e?e:void 0}_getItemsHours(){const e=this._config?.items_max_age_hours;return"number"==typeof e&&e>0?e:void 0}_getMaxItems(){const e=this._config?.items_limit;return"number"==typeof e&&e>0?e:void 0!==this._getItemsHours()?void 0:20}_getAfter(){const e=this._getItemsHours();return void 0!==e?Math.floor(Date.now()/1e3)-Math.round(3600*e):1}async _loadReviews(){if(this.hass&&this._config){this._error=void 0;try{const e=this._config.items_offset||0,t=this._getMaxItems(),i=await async function(e,t){const i=await e.callWS({type:"frigate/reviews/get",...t});return JSON.parse(i)}(this.hass,{instance_id:this._config.instance,cameras:this._config.cameras,labels:this._config.labels,zones:this._config.zones,severity:this._getSeverityFilter(),limit:void 0!==t?t+e:void 0,after:this._getAfter()});this._reviews=i.sort((e,t)=>(t.start_time||0)-(e.start_time||0))}catch(e){console.error("Failed to load Frigate reviews:",e),this._error="Failed to load reviews"}finally{this._loading=!1}}}async _subscribeToReviews(){if(this.hass&&this._config&&!this._unsubscribe)try{this._unsubscribe=await async function(e,t,i){const s=await e.connection.subscribeMessage(e=>{try{const t="string"==typeof e?JSON.parse(e):e;i(t)}catch(e){console.warn("Failed to parse Frigate review:",e)}},{type:"frigate/reviews/subscribe",instance_id:t});return s}(this.hass,this._config.instance||"frigate",e=>{this._matchesFilters(e)&&("new"!==e.type&&"end"!==e.type||this._loadReviews())})}catch(e){console.warn("Failed to subscribe to Frigate reviews:",e)}}_matchesFilters(e){const t=this._config;if(!t)return!0;const i=e.after;if(!i)return!1;const s=this._getSeverityFilter();if(s&&i.severity!==s)return!1;if(t.cameras?.length&&!t.cameras.includes(i.camera))return!1;if(t.labels?.length){const e=i.data?.objects||[];if(!t.labels.some(t=>e.includes(t)))return!1}if(t.zones?.length){const e=i.data?.zones||[];if(!t.zones.some(t=>e.includes(t)))return!1}return!0}_handleReviewClick(e){this._selectedReview=e,this._config?.popup_play_clip&&this._ensureSignedClip(e)}_onReviewHover(e,t){t&&"mouse"!==t.pointerType||this._config?.autoplay_on_hover&&(this._clearHoverIntent(),this._hoverIntentTimer=window.setTimeout(()=>{this._hoverIntentTimer=void 0,this._hoveredReviewId=e.id,this._ensureSignedClip(e)},400))}_onReviewLeave(){this._clearHoverIntent(),this._hoveredReviewId=void 0}_clearHoverIntent(){void 0!==this._hoverIntentTimer&&(clearTimeout(this._hoverIntentTimer),this._hoverIntentTimer=void 0)}_handleModalClose(){this._selectedReview=void 0}_openCamera(e){this._handleModalClose(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_getReviewEventId(e){return e.data?.detections?.find(Boolean)}_getClipRange(e){return{start:Math.max(0,e.start_time),end:e.end_time??Date.now()/1e3}}async _ensureSignedClip(e){const t=Date.now()/1e3,i=null==e.end_time,s=this._signedClips.get(e.id);if(s&&!(s?.pending&&!i)&&t-s.ts<43080)return s.url;if(!this.hass)return s?.url;const o=this._config?.instance||"frigate",{start:n,end:r}=this._getClipRange(e),a=function(e,t,i,s){return`/api/frigate/${encodeURIComponent(e)}/recording/${encodeURIComponent(t)}/start/${i}/end/${s}`}(o,e.camera,n,r);try{const s=await async function(e,t,i=43200){return(await e.callWS({type:"auth/sign_path",path:t,expires:i})).path}(this.hass,a,43200);return this._signedClips.set(e.id,{url:s,ts:t,pending:i}),this.requestUpdate(),s}catch(e){return console.warn("Failed to sign Frigate review clip URL:",e),s?.url}}_useAmPm(){const e=this.hass?.locale;if(!e?.time_format)return;const t=e.time_format;if("12"===t)return!0;if("24"===t)return!1;const i="language"===t?e.language:void 0,s=(new Date).toLocaleString(i);return s.includes("AM")||s.includes("PM")}_formatTime(e){const t=new Date(1e3*e),i=this.hass?.locale?.language||void 0;return t.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:this._useAmPm()})}_formatDateTime(e){const t=new Date(1e3*e),i=this.hass?.locale?.language||void 0;return t.toLocaleString(i,{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:this._useAmPm()})}_formatDuration(e,t){if(!t)return"Ongoing";const i=Math.round(t-e);if(i<60)return`${i}s`;const s=Math.floor(i/60),o=i%60;return o>0?`${s}m ${o}s`:`${s}m`}_formatZones(e){return e&&0!==e.length?e.map(e=>e.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())).join(", "):""}_formatObjects(e){const t=e.data?.objects||[];return 0===t.length?this._capitalize(e.severity||"Review"):t.map(e=>this._capitalize(e)).join(", ")}render(){if(!this._config)return F`<ha-card>No configuration</ha-card>`;const e=!!this._config.scrollable,t=e,i=this._config.items_visible||5,s=this._getMaxItems();let o=this._reviews;const n=this._getDailyResetTimestamp();null!==n&&(o=this._reviews.filter(e=>(e.start_time||0)>n));const r=this._config.items_offset||0,a=void 0!==s?o.slice(r,r+s):o.slice(r),l=Math.max(0,i-a.length);let c=[...a.map(e=>this._renderReview(e)),...Array(l).fill(0).map(()=>F`<div class="placeholder"></div>`)];return this._config.reverse_order&&c.reverse(),F`
      <ha-card>
        <div class="content">
          ${this._config.debug?F`<div class="debug-version">v${_e}</div>`:""}
          ${this._loading?F`<div class="loading"></div>`:this._error?F``:F`
              <div class="events-container">
                ${t?F`
                  <button class="scroll-btn prev" @click=${()=>this._scroll("left")}>◀</button>
                  <button class="scroll-btn next" @click=${()=>this._scroll("right")}>▶</button>
                `:""}
                <div class="events ${e?"scrollable":""}" style="--visible-count: ${i};">
                  ${c}
                </div>
              </div>
            `}
        </div>
      </ha-card>
      ${this._renderDialog()}
    `}_renderReview(e){const t=this._config?.instance||"frigate",i=this._getReviewEventId(e),s=i?ue(t,i,e.end_time||void 0):"",o=this._formatObjects(e),n=this._hoveredReviewId===e.id,r=!!this._config?.autoplay_on_hover,a=this._signedClips.get(e.id)?.url;return F`
      <div class="event"
        @click=${()=>this._handleReviewClick(e)}
        @pointerenter=${t=>this._onReviewHover(e,t)}
        @pointerleave=${()=>this._onReviewLeave()}
        style="position: relative;"
      >
        ${s?F`<img src="${s}" alt="${o}" loading="lazy" />`:F`<div class="event-fallback">${o}</div>`}
        ${r&&n&&a?F`<video
                   autoplay
                   muted
                   .muted=${!0}
                   loop
                   playsinline
                   style="position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; pointer-events: none;"
                 >
                   <source src="${a}" type="video/mp4">
                 </video>`:""}
      </div>
    `}_renderDialog(){const e=this._selectedReview;if(!e)return F``;const t=this._config?.instance||"frigate",i=this._getReviewEventId(e),s=i?ue(t,i,e.end_time||void 0):"",o=this._signedClips.get(e.id)?.url,n=!!this._config?.popup_play_clip&&!!o,r=this._formatObjects(e),a=!1!==this._config?.popup_show_date,l=!1!==this._config?.popup_show_duration,c=!1!==this._config?.popup_show_camera,h=!1!==this._config?.popup_show_zones,d=a?this._formatDateTime(e.start_time):this._formatTime(e.start_time),p=this._formatDuration(e.start_time,e.end_time),u=this._formatZones(e.data?.zones||[]),_=`camera.${e.camera}`,m=!!this.hass?.states?.[_],g=this._formatCameraName(e.camera),v=c?m?F`<button class="breadcrumb" @click=${()=>this._openCamera(_)}>${g}</button>`:F`<span class="breadcrumb">${g}</span>`:"",f=n?F`<video autoplay muted controls playsinline>
               <source src="${o}" type="video/mp4">
             </video>`:s?F`<img src="${s}" alt="${r}" />`:F``,b=F`
      <div class="dialog-media">${f}</div>
      ${h&&!!u||l?F`<div class="dialog-meta">
            ${h&&u?F`<div class="dialog-sub">${u}</div>`:""}
            ${l?F`<div class="dialog-sub">Duration: ${p}</div>`:""}
          </div>`:""}
    `;return customElements.get("ha-adaptive-dialog")?F`
        <ha-adaptive-dialog
          open
          width="medium"
          header-title=${d}
          header-subtitle-position="above"
          @closed=${()=>this._handleModalClose()}
        >
          ${v?F`<span slot="headerSubtitle">${v}</span>`:""}
          ${b}
        </ha-adaptive-dialog>
      `:F`
      <ha-dialog open hideActions @closed=${()=>this._handleModalClose()}>
        <ha-dialog-header slot="heading">
          <ha-icon-button
            slot="navigationIcon"
            dialogAction="cancel"
            label="Close"
            .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
          ></ha-icon-button>
          <span slot="title">
            ${v?F`<div class="dialog-overline">${v}</div>`:""}
            <div>${d}</div>
          </span>
        </ha-dialog-header>
        ${b}
      </ha-dialog>
    `}_scroll(e){const t=this.renderRoot.querySelector(".events");if(!t)return;const i=.8*t.clientWidth;t.scrollBy({left:"left"===e?-i:i,behavior:"smooth"})}_capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}_formatCameraName(e){return e.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}static get styles(){return r`
      :host {
        display: block;
      }

      ha-card {
        overflow: hidden;
        background: transparent;
        box-shadow: none;
        width: 100%;
      }

      .content {
        padding: 0;
      }

      .loading {
        min-height: 80px;
      }

      .events-container {
        position: relative;
        width: 100%;
      }

      .scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, background-color 0.2s, transform 0.2s;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        /* Hidden by default; only shown on desktop (fine pointer) below. */
        display: none;
      }

      /* Show the scroll arrows only where there's a mouse; touch devices swipe. */
      @media (hover: hover) and (pointer: fine) {
        .scroll-btn {
          display: flex;
        }
      }

      .scroll-btn.prev {
        left: 8px;
      }

      .scroll-btn.next {
        right: 8px;
      }

      .events-container:hover .scroll-btn {
        opacity: 1;
      }

      .scroll-btn:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1);
      }

      .scroll-btn:active {
        transform: translateY(-50%) scale(0.95);
      }

      .events {
        display: grid;
        grid-template-columns: repeat(var(--visible-count, 5), 1fr);
        gap: 9px;
        align-items: start;
      }

      .events.scrollable {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        /* Claim horizontal drags for the carousel and keep the gesture from
           bubbling out to browser-back or a swipe-navigation add-on. */
        touch-action: pan-x;
        overscroll-behavior-x: contain;
        scroll-behavior: smooth;
        grid-template-columns: none;
        -ms-overflow-style: none;
        scrollbar-width: none;
        align-items: start;
      }

      .events.scrollable::-webkit-scrollbar {
        display: none;
      }

      .events.scrollable .event,
      .events.scrollable .placeholder {
        flex: 0 0 calc((100% - (var(--visible-count, 5) - 1) * 9px) / var(--visible-count, 5));
        scroll-snap-align: start;
        box-sizing: border-box;
      }

      .event {
        aspect-ratio: 1 / 1;
        cursor: pointer;
        border-radius: 12px;
        overflow: hidden;
        background: var(--secondary-background-color);
        transition: transform 0.2s, opacity 0.2s;
      }

      .event:hover {
        transform: scale(1.02);
        opacity: 0.9;
      }

      .event:active {
        transform: scale(0.98);
      }

      .placeholder {
        aspect-ratio: 1 / 1;
        border-radius: 12px;
        background: #1c1c1c;
      }

      .event img,
      .event video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .event-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 4px;
        box-sizing: border-box;
        color: var(--secondary-text-color, #aaa);
        font-size: 12px;
        text-align: center;
      }

      .debug-version {
        font-size: 10px;
        color: var(--secondary-text-color, #aaa);
        padding: 2px 8px;
        text-align: right;
        font-family: monospace;
        opacity: 0.7;
      }

      /* Native HA dialog for the detail popup */
      ha-dialog {
        --mdc-dialog-min-width: min(90vw, 520px);
        --mdc-dialog-max-width: min(95vw, 720px);
        --dialog-content-padding: 0;
      }

      ha-adaptive-dialog {
        --dialog-content-padding: 0;
      }

      .dialog-media {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
      }

      .dialog-media img,
      .dialog-media video {
        width: 100%;
        max-height: 70vh;
        object-fit: contain;
        display: block;
      }

      .dialog-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px 16px;
      }

      /* Mirrors Home Assistant's own more-info breadcrumb overline. */
      .breadcrumb {
        color: var(--secondary-text-color);
        font-size: var(--ha-font-size-m, 14px);
        font-family: var(--ha-font-family-heading, inherit);
        line-height: 16px;
        padding: var(--ha-space-1, 4px);
        margin: calc(var(--ha-space-1, 4px) * -1);
        background: none;
        border: none;
        outline: none;
        display: inline;
        border-radius: var(--ha-border-radius-md, 8px);
        transition: background-color 180ms ease-in-out;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
      }

      button.breadcrumb {
        cursor: pointer;
      }

      button.breadcrumb:focus-visible,
      button.breadcrumb:hover {
        background-color: rgba(var(--rgb-secondary-text-color, 114, 114, 114), 0.08);
      }

      .dialog-overline {
        margin-bottom: 2px;
      }

      .dialog-sub {
        font-size: 13px;
        color: var(--secondary-text-color);
        line-height: 1.3;
      }
    `}};e([de({attribute:!1})],ge.prototype,"hass",void 0),e([pe()],ge.prototype,"_config",void 0),e([pe()],ge.prototype,"_reviews",void 0),e([pe()],ge.prototype,"_selectedReview",void 0),e([pe()],ge.prototype,"_loading",void 0),e([pe()],ge.prototype,"_error",void 0),e([pe()],ge.prototype,"_hoveredReviewId",void 0),ge=e([le("frigate-review-card")],ge);const ve=[{value:"alert",label:"Alerts only"},{value:"detection",label:"Detections only"},{value:"all",label:"Alerts & detections"}],fe={instance:"Frigate instance",severity:"Severity",cameras:"Cameras (comma-separated)",labels:"Labels (comma-separated)",zones:"Zones (comma-separated)",items_visible:"Items visible at once",items_limit:"Max items (count)",items_max_age_hours:"Max age (hours)",items_offset:"Offset (skip newest N)",reverse_order:"Reverse order",scrollable:"Scrollable gallery",popup_play_clip:"Play clip in popup",autoplay_on_hover:"Autoplay clip on hover",popup_show_date:"Show date",popup_show_duration:"Show duration",popup_show_camera:"Show camera name",popup_show_zones:"Show zones",daily_reset_time:"Daily reset time (HH:MM)",debug:"Debug"},be=["cameras","labels","zones"],ye=["items_visible","items_limit","items_max_age_hours","items_offset"];let $e=class extends re{constructor(){super(...arguments),this._config={type:"custom:frigate-review-card"},this._computeLabel=e=>fe[e.name]??e.name}setConfig(e){this._config=e}get _schema(){return[{name:"section_source",type:"expandable",flatten:!0,expanded:!0,title:"Frigate & filters",schema:[{name:"instance",selector:{text:{}}},{name:"severity",selector:{select:{mode:"dropdown",options:ve}}},{name:"cameras",selector:{text:{}}},{name:"labels",selector:{text:{}}},{name:"zones",selector:{text:{}}}]},{name:"section_items",type:"expandable",flatten:!0,expanded:!0,title:"Items shown",schema:[{name:"items_grid",type:"grid",flatten:!0,schema:[{name:"items_visible",selector:{number:{min:1,mode:"box"}}},{name:"items_limit",selector:{number:{min:1,mode:"box"}}},{name:"items_max_age_hours",selector:{number:{min:1,mode:"box"}}},{name:"items_offset",selector:{number:{min:0,mode:"box"}}}]},{name:"scrollable",selector:{boolean:{}}},{name:"reverse_order",selector:{boolean:{}}}]},{name:"section_playback",type:"expandable",flatten:!0,title:"Playback",schema:[{name:"popup_play_clip",selector:{boolean:{}}},{name:"autoplay_on_hover",selector:{boolean:{}}}]},{name:"section_popup",type:"expandable",flatten:!0,title:"Popup details",schema:[{name:"popup_grid",type:"grid",flatten:!0,schema:[{name:"popup_show_date",selector:{boolean:{}}},{name:"popup_show_duration",selector:{boolean:{}}},{name:"popup_show_camera",selector:{boolean:{}}},{name:"popup_show_zones",selector:{boolean:{}}}]}]},{name:"section_advanced",type:"expandable",flatten:!0,title:"Advanced",schema:[{name:"daily_reset_time",selector:{text:{}}},{name:"debug",selector:{boolean:{}}}]}]}get _data(){const e={...me,...this._config};for(const t of be){const i=e[t];e[t]=Array.isArray(i)?i.join(", "):i||""}return e}render(){return this.hass?F`
      <ha-form
        .hass=${this.hass}
        .data=${this._data}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:F``}_valueChanged(e){e.stopPropagation();const t={...e.detail.value};for(const e of be){const i=t[e];if("string"==typeof i){const s=i.split(",").map(e=>e.trim()).filter(Boolean);s.length?t[e]=s:delete t[e]}}for(const e of ye){const i=t[e];""!==i&&null!=i||delete t[e]}const i=me;for(const e of Object.keys(t))"type"!==e&&void 0!==i[e]&&t[e]===i[e]&&delete t[e];this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}static get styles(){return r`
      ha-form {
        display: block;
      }
    `}};e([de({attribute:!1})],$e.prototype,"hass",void 0),e([pe()],$e.prototype,"_config",void 0),$e=e([le("frigate-review-card-editor")],$e),window.customCards=window.customCards||[],window.customCards.push({type:"frigate-review-card",name:"Frigate Review Card",description:"A simple card for displaying recent Frigate review items (alerts & detections)",preview:!0}),console.info(`%c FRIGATE-REVIEW-CARD v${_e} %c Loaded `,"color: white; background: #3b82f6; font-weight: bold;","color: #3b82f6; background: white;");export{ge as FrigateReviewCard,$e as FrigateReviewCardEditor};
