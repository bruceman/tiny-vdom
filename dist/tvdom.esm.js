function Element(e,t,n){if(!(this instanceof Element))return _.isArray(n)||null==n||(n=_.slice(arguments,2).filter(_.truthy)),new Element(e,t,n);_.isArray(t)&&(n=t,t={}),this.tagName=e,this.props=t||{},this.children=n||[],this.key=t?t.key:void 0;var r=0;_.each(this.children,function(e,t){e instanceof Element?r+=e.count:n[t]=""+e,r++}),this.count=r}function parse(e){var t,n=[],r=-1,o=[],i={};if((e=e.trim()).replace(tagRE,function(a,c){var l,s="/"!==a.charAt(1),u=c+a.length,p=e.charAt(u);s&&(r++,!(t=parseTag(a)).voidElement&&p&&"<"!==p&&t.children.push({type:"text",content:e.slice(u,e.indexOf("<",u))}),i[t.tagName]=t,0===r&&n.push(t),(l=o[r-1])&&l.children.push(t),o[r]=t),s&&!t.voidElement||(r--,"<"!==p&&p&&o[r].children.push({type:"text",content:e.slice(u,e.indexOf("<",u))}))}),1!==n.length)throw new Error("Must have one root element");return toElement(n[0])}function parseTag(e){var t,n=0,r={type:"tag",name:"",voidElement:!1,attrs:{},children:[]};return e.replace(attrRE,function(o){n%2?t=o:0===n?((lookup[o]||"/"===e.charAt(e.length-2))&&(r.voidElement=!0),r.name=o):r.attrs[t]=o.replace(/['"]/g,""),n++}),r}function unescapeChar(e){return unescapes[e]}function toElement(e){var t=[];return e.children.forEach(function(e){"text"==e.type?unescapeRE.test(e.content)?t.push(e.content.replace(unescapeRE,unescapeChar)):t.push(e.content):t.push(toElement(e))}),Element(e.name,e.attrs,t)}function diff$2(e,t,n){function r(e){var t={index:e,type:0};d.push(t)}function o(e,t){var n={index:e,item:t,type:1};d.push(n)}function i(e){E.splice(e,1)}for(var a,c,l=makeKeyIndexAndFree(e,n),s=makeKeyIndexAndFree(t,n),u=s.free,p=l.keyIndex,f=s.keyIndex,d=[],h=[],y=0,m=0;y<e.length;){if(a=e[y],c=getItemKey(a,n))if(f.hasOwnProperty(c)){var v=f[c];h.push(t[v])}else h.push(null);else{var k=u[m++];h.push(k||null)}y++}var E=h.slice(0);for(y=0;y<E.length;)null===E[y]?(r(y),i(y)):y++;for(var g=y=0;y<t.length;){c=getItemKey(a=t[y],n);var x=E[g],_=getItemKey(x,n);if(x)if(c===_)g++;else if(p.hasOwnProperty(c)){getItemKey(E[g+1],n)===c?(r(y),i(g),g++):o(y,a)}else o(y,a);else o(y,a);y++}return{moves:d,children:h}}function makeKeyIndexAndFree(e,t){for(var n={},r=[],o=0,i=e.length;o<i;o++){var a=e[o],c=getItemKey(a,t);c?n[c]=o:r.push(a)}return{keyIndex:n,free:r}}function getItemKey(e,t){if(e&&t)return"string"==typeof t?e[t]:t(e)}function patch(e,t){dfsWalk$1(e,{index:0},t)}function dfsWalk$1(e,t,n){for(var r=n[t.index],o=e.childNodes?e.childNodes.length:0,i=0;i<o;i++){var a=e.childNodes[i];t.index++,dfsWalk$1(a,t,n)}r&&applyPatches(e,r)}function applyPatches(e,t){_.each(t,function(t){switch(t.type){case REPLACE:var n="string"==typeof t.node?document.createTextNode(t.node):t.node.render();e.parentNode.replaceChild(n,e);break;case REORDER:reorderChildren(e,t.moves);break;case PROPS:setProps(e,t.props);break;case TEXT:e.textContent?e.textContent=t.content:e.nodeValue=t.content;break;default:throw new Error("Unknown patch type "+t.type)}})}function setProps(e,t){for(var n in t)if(void 0===t[n])e.removeAttribute(n);else{var r=t[n];_.setAttr(e,n,r)}}function reorderChildren(e,t){var n=_.toArray(e.childNodes),r={};_.each(n,function(e){if(1===e.nodeType){var t=e.getAttribute("key");t&&(r[t]=e)}}),_.each(t,function(t){var o=t.index;if(0===t.type)n[o]&&n[o]===e.childNodes[o]&&e.removeChild(e.childNodes[o]),n.splice(o,1);else if(1===t.type){var i=r[t.item.key]?r[t.item.key].cloneNode(!0):"object"===_typeof(t.item)?t.item.render():document.createTextNode(t.item);n.splice(o,0,i),e.insertBefore(i,e.childNodes[o]||null)}})}function diff(e,t){var n={};return dfsWalk(e,t,0,n),n}function dfsWalk(e,t,n,r){var o=[];if(null===t);else if(_.isString(e)&&_.isString(t))t!==e&&o.push({type:patch.TEXT,content:t});else if(e.tagName===t.tagName&&e.key===t.key){var i=diffProps(e,t);i&&o.push({type:patch.PROPS,props:i}),isIgnoreChildren(t)||diffChildren(e.children,t.children,n,r,o)}else o.push({type:patch.REPLACE,node:t});o.length&&(r[n]=o)}function diffChildren(e,t,n,r,o){var i=listDiff2(e,t,"key");if(t=i.children,i.moves.length){var a={type:patch.REORDER,moves:i.moves};o.push(a)}var c=null,l=n;_.each(e,function(e,n){dfsWalk(e,t[n],l=c&&c.count?l+c.count+1:l+1,r),c=e})}function diffProps(e,t){var n,r,o=0,i=e.props,a=t.props,c={};for(n in i)r=i[n],a[n]!==r&&(o++,c[n]=a[n]);for(n in a)r=a[n],i.hasOwnProperty(n)||(o++,c[n]=a[n]);return 0===o?null:c}function isIgnoreChildren(e){return e.props&&e.props.hasOwnProperty("ignore")}var _={};_.type=function(e){return Object.prototype.toString.call(e).replace(/\[object\s|\]/g,"")},_.isArray=function(e){return"Array"===_.type(e)},_.slice=function(e,t){return Array.prototype.slice.call(e,t)},_.truthy=function(e){return!!e},_.isString=function(e){return"String"===_.type(e)},_.each=function(e,t){for(var n=0,r=e.length;n<r;n++)t(e[n],n)},_.toArray=function(e){if(!e)return[];for(var t=[],n=0,r=e.length;n<r;n++)t.push(e[n]);return t},_.setAttr=function(e,t,n){switch(t){case"style":e.style.cssText=n;break;case"value":var r=e.tagName||"";"input"===(r=r.toLowerCase())||"textarea"===r?e.value=n:e.setAttribute(t,n);break;default:e.setAttribute(t,n)}},Element.prototype.render=function(){var e=document.createElement(this.tagName),t=this.props;for(var n in t){var r=t[n];_.setAttr(e,n,r)}return _.each(this.children,function(t){var n=t instanceof Element?t.render():document.createTextNode(t);e.appendChild(n)}),e};var tagRE=/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g,attrRE=/([\w-]+)|['"]{1}([^'"]*)['"]{1}/g,lookup=Object.create?Object.create(null):{};lookup.area=!0,lookup.base=!0,lookup.br=!0,lookup.col=!0,lookup.embed=!0,lookup.hr=!0,lookup.img=!0,lookup.input=!0,lookup.keygen=!0,lookup.link=!0,lookup.menuitem=!0,lookup.meta=!0,lookup.param=!0,lookup.source=!0,lookup.track=!0,lookup.wbr=!0;var unescapes={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#x27;":"'","&#x60;":"`","&#x3D;":"="},unescapeRE=/(&amp;)|(&lt;)|(&gt;)|(&quot;)|(&#x27;)|(&#x60;)|(&#x3D;)/g,makeKeyIndexAndFree_1=makeKeyIndexAndFree,diff_2=diff$2,diff_1={makeKeyIndexAndFree:makeKeyIndexAndFree_1,diff:diff_2},listDiff2=diff_1.diff,_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},REPLACE=0,REORDER=1,PROPS=2,TEXT=3;patch.REPLACE=REPLACE,patch.REORDER=REORDER,patch.PROPS=PROPS,patch.TEXT=TEXT;var main={element:Element,parse:parse,diff:diff,patch:patch};export default main;