"use strict";(self.webpackChunktrail_passion_guide=self.webpackChunktrail_passion_guide||[]).push([[451],{6990:(n,t,e)=>{e.d(t,{Z:()=>d});var o=e(7537),r=e.n(o),a=e(3645),i=e.n(a),u=e(1667),s=e.n(u),c=new URL(e(4115),e.b),l=new URL(e(402),e.b),f=i()(r()),h=s()(c),p=s()(l);f.push([n.id,"/* latin-ext */\n@font-face {\n  font-family: righteous;\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: local('Righteous'), local('Righteous-Regular'),\n    url("+h+") format('woff2');\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n\n/* latin */\n@font-face {\n  font-family: righteous;\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: local('Righteous'), local('Righteous-Regular'),\n    url("+p+") format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n","",{version:3,sources:["webpack://./src/tololib/font/righteous/righteous.css"],names:[],mappings:"AAAA,cAAc;AACd;EACE,sBAAsB;EACtB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB;2DAC4C;EAC5C,mHAAmH;AACrH;;AAEA,UAAU;AACV;EACE,sBAAsB;EACtB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB;2DACwC;EACxC,yKAAyK;AAC3K",sourcesContent:["/* latin-ext */\n@font-face {\n  font-family: righteous;\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: local('Righteous'), local('Righteous-Regular'),\n    url(./righteous.ext.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n\n/* latin */\n@font-face {\n  font-family: righteous;\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: local('Righteous'), local('Righteous-Regular'),\n    url(./righteous.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n"],sourceRoot:""}]);const d=f},8368:(n,t,e)=>{e.d(t,{Z:()=>l});var o=e(4650);const r=function(){function n(){this.actionRunning=!1}return n.prototype.exec=function(n){this.curTask?this.nxtTask=n:this.curTask=n,this.actionRunning||this.action()},n.prototype.action=function(){return n=this,t=void 0,o=function(){var n;return function(n,t){var e,o,r,a,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,o&&(r=2&a[0]?o.return:a[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,a[1])).done)return r;switch(o=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,o=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((r=(r=i.trys).length>0&&r[r.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){i.label=a[1];break}if(6===a[0]&&i.label<r[1]){i.label=r[1],r=a;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(a);break}r[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(n,i)}catch(n){a=[6,n],o=0}finally{e=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}}(this,(function(t){switch(t.label){case 0:this.actionRunning=!0,t.label=1;case 1:t.trys.push([1,,8,9]),t.label=2;case 2:if(!this.curTask)return[3,7];t.label=3;case 3:return t.trys.push([3,5,,6]),[4,this.curTask()];case 4:return t.sent(),[3,6];case 5:return n=t.sent(),console.error("[UpdateTasks]",n),[3,6];case 6:return this.curTask=this.nxtTask,[3,2];case 7:return[3,9];case 8:return this.actionRunning=!1,[7];case 9:return[2]}}))},new((e=void 0)||(e=Promise))((function(r,a){function i(n){try{s(o.next(n))}catch(n){a(n)}}function u(n){try{s(o.throw(n))}catch(n){a(n)}}function s(n){var t;n.done?r(n.value):(t=n.value,t instanceof e?t:new e((function(n){n(t)}))).then(i,u)}s((o=o.apply(n,t||[])).next())}));var n,t,e,o},n}();const a={Debouncer:o.Z,sleep:function(n){return t=this,e=void 0,r=function(){return function(n,t){var e,o,r,a,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,o&&(r=2&a[0]?o.return:a[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,a[1])).done)return r;switch(o=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,o=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((r=(r=i.trys).length>0&&r[r.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){i.label=a[1];break}if(6===a[0]&&i.label<r[1]){i.label=r[1],r=a;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(a);break}r[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(n,i)}catch(n){a=[6,n],o=0}finally{e=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}}(this,(function(t){return[2,new Promise((function(t){window.setTimeout(t,n)}))]}))},new((o=void 0)||(o=Promise))((function(n,a){function i(n){try{s(r.next(n))}catch(n){a(n)}}function u(n){try{s(r.throw(n))}catch(n){a(n)}}function s(t){var e;t.done?n(t.value):(e=t.value,e instanceof o?e:new o((function(n){n(e)}))).then(i,u)}s((r=r.apply(t,e||[])).next())}));var t,e,o,r},Throttler:function(n,t){var e=0,o=0,r=function(){},a=[],i=function(){e=0,r.apply(void 0,function(n,t,e){if(e||2===arguments.length)for(var o,r=0,a=t.length;r<a;r++)!o&&r in t||(o||(o=Array.prototype.slice.call(t,0,r)),o[r]=t[r]);return n.concat(o||Array.prototype.slice.call(t))}([],function(n,t){var e="function"==typeof Symbol&&n[Symbol.iterator];if(!e)return n;var o,r,a=e.call(n),i=[];try{for(;(void 0===t||t-- >0)&&!(o=a.next()).done;)i.push(o.value)}catch(n){r={error:n}}finally{try{o&&!o.done&&(e=a.return)&&e.call(a)}finally{if(r)throw r.error}}return i}(a),!1))};return function(){for(var u=[],s=0;s<arguments.length;s++)u[s]=arguments[s];r=n,a=u;var c=Date.now(),l=c-o;o=c,l>t?i():0===e&&(e=window.setTimeout(i,t-l))}},UpdateTasks:r};var i=function(){return i=Object.assign||function(n){for(var t,e=1,o=arguments.length;e<o;e++)for(var r in t=arguments[e])Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n},i.apply(this,arguments)},u=function(n,t,e,o){return new(e||(e=Promise))((function(r,a){function i(n){try{s(o.next(n))}catch(n){a(n)}}function u(n){try{s(o.throw(n))}catch(n){a(n)}}function s(n){var t;n.done?r(n.value):(t=n.value,t instanceof e?t:new e((function(n){n(t)}))).then(i,u)}s((o=o.apply(n,t||[])).next())}))},s=function(n,t){var e,o,r,a,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,o&&(r=2&a[0]?o.return:a[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,a[1])).done)return r;switch(o=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,o=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((r=(r=i.trys).length>0&&r[r.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){i.label=a[1];break}if(6===a[0]&&i.label<r[1]){i.label=r[1],r=a;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(a);break}r[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(n,i)}catch(n){a=[6,n],o=0}finally{e=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}},c=new Set;const l=function(){function n(n){this.name=n,this.name=n}return n.prototype.load=function(){return u(this,void 0,void 0,(function(){var t,e=this;return s(this,(function(o){return t=this.name,[2,new Promise((function(o,r){return u(e,void 0,void 0,(function(){var e;return s(this,(function(a){switch(a.label){case 0:return a.trys.push([0,2,,3]),[4,n.waitForFontToBeLoaded({name:t})];case 1:return a.sent(),o(this),[3,3];case 2:return e=a.sent(),console.error("[TFW] Font loading failed for ",t),console.error(e),r(e),[3,3];case 3:return[2]}}))}))}))]}))}))},n.prototype.use=function(){document.body.style.fontFamily=this.name},n.isFontLoaded=function(n){var t=i({size:"1rem"},n),e="".concat(t.size," '").concat(t.name,"'");try{var o=document.fonts;return o?(c.has(e)||(c.add(e),o.load(e).then((function(){}),(function(n){console.error("[TFW] Unable to preload font:",e),console.error("[TFW]",n)}))),o.check(e)):(console.warn("[TFW] This browser does not support Font load API!"),!0)}catch(n){return console.error("[TFW] Error while testing if font is loaded:",e),!1}},n.waitForFontToBeLoaded=function(t){return u(this,void 0,void 0,(function(){var e,o,r;return s(this,(function(u){switch(u.label){case 0:e=i({size:"1rem",timeout:1e3},t),o=100,r=Date.now(),u.label=1;case 1:return n.isFontLoaded(e)?[3,3]:Date.now()-r>e.timeout?(console.warn("[TFW] Timeout while waiting for font to be loaded:",e.name,e.size),[2]):[4,a.sleep(o)];case 2:return u.sent(),[3,1];case 3:return[2]}}))}))},n}()},2451:(n,t,e)=>{e.r(t),e.d(t,{default:()=>b});var o=e(8368),r=e(3379),a=e.n(r),i=e(7795),u=e.n(i),s=e(569),c=e.n(s),l=e(3565),f=e.n(l),h=e(9216),p=e.n(h),d=e(4589),y=e.n(d),w=e(6990),A={};A.styleTagTransform=y(),A.setAttributes=f(),A.insert=c().bind(null,"head"),A.domAPI=u(),A.insertStyleElement=p(),a()(w.Z,A),w.Z&&w.Z.locals&&w.Z.locals;const b=new o.Z("righteous")},4115:(n,t,e)=>{n.exports=e.p+"2823f4873a8085d2b4dc.woff2"},402:(n,t,e)=>{n.exports=e.p+"7514bbf97db3ad2ed8c5.woff2"}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sK0NBQWdEbUMsSUFDdkQsSUFJRixFQUFBVCxzQkFBYixTQUFtQ1gsRyxvR0FDekJrQixFQUFNLEdBQ1JDLEtBQU0sT0FDTlMsUUFBUyxLQUNONUIsR0FFRDZCLEVBQWdCLElBQ2hCQyxFQUFZNUIsS0FBS0QsTSx3QkFDZlMsRUFBVU8sYUFBYUMsR0FBTyxNQUNkaEIsS0FBS0QsTUFBUTZCLEVBQ2ZaLEVBQU9VLFNBQ3JCNUMsUUFBUTJDLEtBQUsscURBQXNEVCxFQUFPWCxLQUFNVyxFQUFPQyxNQUN2RixLQUVKLEdBQU0sUUFBWVUsSSxjQUFsQixTLCtCQUdaLEVBaEZBLEksc0xDTUlFLEVBQVUsR0FFZEEsRUFBUUMsa0JBQW9CLElBQzVCRCxFQUFRRSxjQUFnQixJQUVsQkYsRUFBUUcsT0FBUyxTQUFjLEtBQU0sUUFFM0NILEVBQVFJLE9BQVMsSUFDakJKLEVBQVFLLG1CQUFxQixJQUVoQixJQUFJLElBQVNMLEdBS0osS0FBVyxZQUFpQixXQUEzQyxNQ3ZCUCxNQUFtQixJQUFLLGMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90cmFpbC1wYXNzaW9uLWd1aWRlLy4vc3JjL3RvbG9saWIvZm9udC9yaWdodGVvdXMvcmlnaHRlb3VzLmNzcyIsIndlYnBhY2s6Ly90cmFpbC1wYXNzaW9uLWd1aWRlLy4vc3JjL3RvbG9saWIvYXN5bmMvdXBkYXRlLXRhc2tzLnRzIiwid2VicGFjazovL3RyYWlsLXBhc3Npb24tZ3VpZGUvLi9zcmMvdG9sb2xpYi9hc3luYy9pbmRleC50cyIsIndlYnBhY2s6Ly90cmFpbC1wYXNzaW9uLWd1aWRlLy4vc3JjL3RvbG9saWIvYXN5bmMvdGhyb3R0bGVyLnRzIiwid2VicGFjazovL3RyYWlsLXBhc3Npb24tZ3VpZGUvLi9zcmMvdG9sb2xpYi9mb250L2ZvbnQudHMiLCJ3ZWJwYWNrOi8vdHJhaWwtcGFzc2lvbi1ndWlkZS8uL3NyYy90b2xvbGliL2ZvbnQvcmlnaHRlb3VzL3JpZ2h0ZW91cy5jc3M/NWI5ZSIsIndlYnBhY2s6Ly90cmFpbC1wYXNzaW9uLWd1aWRlLy4vc3JjL3RvbG9saWIvZm9udC9yaWdodGVvdXMvcmlnaHRlb3VzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL3JpZ2h0ZW91cy5leHQud29mZjJcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyA9IG5ldyBVUkwoXCIuL3JpZ2h0ZW91cy53b2ZmMlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIvKiBsYXRpbi1leHQgKi9cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiByaWdodGVvdXM7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICBmb250LXdlaWdodDogNDAwO1xcbiAgZm9udC1kaXNwbGF5OiBzd2FwO1xcbiAgc3JjOiBsb2NhbCgnUmlnaHRlb3VzJyksIGxvY2FsKCdSaWdodGVvdXMtUmVndWxhcicpLFxcbiAgICB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fICsgXCIpIGZvcm1hdCgnd29mZjInKTtcXG4gIHVuaWNvZGUtcmFuZ2U6IFUrMDEwMC0wMjRGLCBVKzAyNTksIFUrMUUwMC0xRUZGLCBVKzIwMjAsIFUrMjBBMC0yMEFCLCBVKzIwQUQtMjBDRiwgVSsyMTEzLCBVKzJDNjAtMkM3RiwgVStBNzIwLUE3RkY7XFxufVxcblxcbi8qIGxhdGluICovXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogcmlnaHRlb3VzO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGZvbnQtZGlzcGxheTogc3dhcDtcXG4gIHNyYzogbG9jYWwoJ1JpZ2h0ZW91cycpLCBsb2NhbCgnUmlnaHRlb3VzLVJlZ3VsYXInKSxcXG4gICAgdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyArIFwiKSBmb3JtYXQoJ3dvZmYyJyk7XFxuICB1bmljb2RlLXJhbmdlOiBVKzAwMDAtMDBGRiwgVSswMTMxLCBVKzAxNTItMDE1MywgVSswMkJCLTAyQkMsIFUrMDJDNiwgVSswMkRBLCBVKzAyREMsIFUrMjAwMC0yMDZGLCBVKzIwNzQsIFUrMjBBQywgVSsyMTIyLCBVKzIxOTEsIFUrMjE5MywgVSsyMjEyLCBVKzIyMTUsIFUrRkVGRiwgVStGRkZEO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvdG9sb2xpYi9mb250L3JpZ2h0ZW91cy9yaWdodGVvdXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLGNBQWM7QUFDZDtFQUNFLHNCQUFzQjtFQUN0QixrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtFQUNsQjsyREFDNEM7RUFDNUMsbUhBQW1IO0FBQ3JIOztBQUVBLFVBQVU7QUFDVjtFQUNFLHNCQUFzQjtFQUN0QixrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtFQUNsQjsyREFDd0M7RUFDeEMseUtBQXlLO0FBQzNLXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIGxhdGluLWV4dCAqL1xcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IHJpZ2h0ZW91cztcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICBmb250LWRpc3BsYXk6IHN3YXA7XFxuICBzcmM6IGxvY2FsKCdSaWdodGVvdXMnKSwgbG9jYWwoJ1JpZ2h0ZW91cy1SZWd1bGFyJyksXFxuICAgIHVybCguL3JpZ2h0ZW91cy5leHQud29mZjIpIGZvcm1hdCgnd29mZjInKTtcXG4gIHVuaWNvZGUtcmFuZ2U6IFUrMDEwMC0wMjRGLCBVKzAyNTksIFUrMUUwMC0xRUZGLCBVKzIwMjAsIFUrMjBBMC0yMEFCLCBVKzIwQUQtMjBDRiwgVSsyMTEzLCBVKzJDNjAtMkM3RiwgVStBNzIwLUE3RkY7XFxufVxcblxcbi8qIGxhdGluICovXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogcmlnaHRlb3VzO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGZvbnQtZGlzcGxheTogc3dhcDtcXG4gIHNyYzogbG9jYWwoJ1JpZ2h0ZW91cycpLCBsb2NhbCgnUmlnaHRlb3VzLVJlZ3VsYXInKSxcXG4gICAgdXJsKC4vcmlnaHRlb3VzLndvZmYyKSBmb3JtYXQoJ3dvZmYyJyk7XFxuICB1bmljb2RlLXJhbmdlOiBVKzAwMDAtMDBGRiwgVSswMTMxLCBVKzAxNTItMDE1MywgVSswMkJCLTAyQkMsIFUrMDJDNiwgVSswMkRBLCBVKzAyREMsIFUrMjAwMC0yMDZGLCBVKzIwNzQsIFUrMjBBQywgVSsyMTIyLCBVKzIxOTEsIFUrMjE5MywgVSsyMjEyLCBVKzIyMTUsIFUrRkVGRiwgVStGRkZEO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwidHlwZSBJVGFzayA9ICgpID0+IFByb21pc2U8dm9pZD5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBkYXRlVGFza3Mge1xuICAgIHByaXZhdGUgbnh0VGFzaz86IElUYXNrXG4gICAgcHJpdmF0ZSBjdXJUYXNrPzogSVRhc2tcbiAgICBwcml2YXRlIGFjdGlvblJ1bm5pbmcgPSBmYWxzZVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBjbGFzcyBwcmV2ZW50IHR3byB0YXNrcyB0byBiZSBleGVjdXRlZCBpbiBwYXJhbGxlbC5cbiAgICAgKiBTbywgdGhlIHRhc2tzIGFyZSBxdWV1ZWQuIEJ1dCB0aGlzIGlzIGEgc21hc2hpbmctcXVldWUuXG4gICAgICogV2hpY2ggbWVhbnMgdGhhdCB0aGUgcXVldWUga2VlcHMgb25seSB0d28gZWxlbWVudHMsXG4gICAgICogdGhlIGZpcnN0IG9uZSBhbmQgdGhlIGxhc3Qgb25lLlxuICAgICAqL1xuICAgIGV4ZWModGFzazogSVRhc2spIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyVGFzaykge1xuICAgICAgICAgICAgdGhpcy5ueHRUYXNrID0gdGFza1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJUYXNrID0gdGFza1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5hY3Rpb25SdW5uaW5nKSB0aGlzLmFjdGlvbigpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uUnVubmluZyA9IHRydWVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmN1clRhc2spIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmN1clRhc2soKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbVXBkYXRlVGFza3NdXCIsIGV4KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmN1clRhc2sgPSB0aGlzLm54dFRhc2tcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uUnVubmluZyA9IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgRGVib3VuY2VyIGZyb20gJy4vZGVib3VuY2VyJ1xuaW1wb3J0IFRocm90dGxlciBmcm9tICcuL3Rocm90dGxlcidcbmltcG9ydCBVcGRhdGVUYXNrcyBmcm9tICcuL3VwZGF0ZS10YXNrcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIERlYm91bmNlcixcbiAgICBzbGVlcCxcbiAgICBUaHJvdHRsZXIsXG4gICAgVXBkYXRlVGFza3Ncbn1cblxuYXN5bmMgZnVuY3Rpb24gc2xlZXAoZGVsYXlJbk1pbGxpc2Vjb25kczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChyZXNvbHZlLCBkZWxheUluTWlsbGlzZWNvbmRzKVxuICAgIH0pXG59XG4iLCJ0eXBlIEFjdGlvbiA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiB0byBjYWxsIGFzIG11Y2ggYXMgeW91IHdhbnQuIEl0IHdpbGwgcGVyZm9ybSB0aGUgZGVib3VjZSBmb3IgeW91LlxuICogUHV0IGluIHRoZSBzYW1lIGFyZ3MgYXMgdGhlIGBhY3Rpb25gIGZ1bmN0aW9uLlxuICpcbiAqICogYWN0aW9uIC0gIEFjdGlvbiB0byBjYWxsLiBUd28gY29uc2VjdXRpdmUgYWN0aW9ucyBjYW5ub3QgYmUgIGNhbGxlZCBpZiB0aGVyZSBpc1xuICogbGVzcyB0aGFuIGBkZWxheWAgbXMgYmV0d2VlbiB0aGVtLlxuICogKiBkZWxheSAtIE51bWJlciBvZiBtaWxsaXNlY29uZHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGFjdGlvbjogQWN0aW9uLCBkZWxheTogbnVtYmVyKTogQWN0aW9uIHtcbiAgICBsZXQgdGltZXIgPSAwXG4gICAgbGV0IHRpbWVzdGFtcCA9IDBcbiAgICBsZXQgbmV4dEFjdGlvbjogQWN0aW9uID0gKCkgPT4gey8qIEVtcHR5IGFjdGlvbiovfVxuICAgIGxldCBuZXh0QXJnczogYW55W10gPSBbXVxuICAgIGNvbnN0IHRocm90dGxlQWN0aW9uID0gKCkgPT4ge1xuICAgICAgICB0aW1lciA9IDBcbiAgICAgICAgbmV4dEFjdGlvbiguLi5uZXh0QXJncylcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odGhpczogeyBkZWxheTogbnVtYmVyIH0sIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIG5leHRBY3Rpb24gPSBhY3Rpb25cbiAgICAgICAgbmV4dEFyZ3MgPSBhcmdzXG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgICAgY29uc3QgZWxhcHNlZFRpbWUgPSBub3cgLSB0aW1lc3RhbXBcbiAgICAgICAgdGltZXN0YW1wID0gbm93XG4gICAgICAgIGlmIChlbGFwc2VkVGltZSA+IGRlbGF5KSB7XG4gICAgICAgICAgICB0aHJvdHRsZUFjdGlvbigpXG4gICAgICAgIH0gZWxzZSBpZiAodGltZXIgPT09IDApIHtcbiAgICAgICAgICAgIHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQodGhyb3R0bGVBY3Rpb24sIGRlbGF5IC0gZWxhcHNlZFRpbWUpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgQXN5bmMgZnJvbSAnLi4vYXN5bmMnXG5cbi8vXG5jb25zdCBGT05URkFNSUxJRVNfQVNLRURfVE9fQkVfTE9BREVEID0gbmV3IFNldDxzdHJpbmc+KClcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9udENsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmb250IGluIG1lbW9yeS5cbiAgICAgKi9cbiAgICBhc3luYyBsb2FkKCk6IFByb21pc2U8Rm9udENsYXNzPiB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpc1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Rm9udENsYXNzPihhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IEZvbnRDbGFzcy53YWl0Rm9yRm9udFRvQmVMb2FkZWQoeyBuYW1lIH0pXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1RGV10gRm9udCBsb2FkaW5nIGZhaWxlZCBmb3IgXCIsIG5hbWUpXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihleClcbiAgICAgICAgICAgICAgICByZWplY3QoZXgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlIHRoaXMgZm9udDpcbiAgICAgKiBgYGBjc3NcbiAgICAgKiBib2R5IHsgZm9udC1mYW1pbHk6IG15Rm9udE5hbWU7IH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICB1c2UoKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuZm9udEZhbWlseSA9IHRoaXMubmFtZVxuICAgIH1cblxuICAgIHN0YXRpYyBpc0ZvbnRMb2FkZWQoYXJnczogSUlzRm9udExvYWRlZEFyZ3VtZW50cyk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBwYXJhbXM6IFJlcXVpcmVkPElJc0ZvbnRMb2FkZWRBcmd1bWVudHM+ID0ge1xuICAgICAgICAgICAgc2l6ZTogXCIxcmVtXCIsXG4gICAgICAgICAgICAuLi5hcmdzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZm9udENTUyA9IGAke3BhcmFtcy5zaXplfSAnJHtwYXJhbXMubmFtZX0nYFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBmb250cyB9ID0gZG9jdW1lbnRcbiAgICAgICAgICAgIGlmICghZm9udHMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbVEZXXSBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBGb250IGxvYWQgQVBJIVwiKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIUZPTlRGQU1JTElFU19BU0tFRF9UT19CRV9MT0FERUQuaGFzKGZvbnRDU1MpKSB7XG4gICAgICAgICAgICAgICAgRk9OVEZBTUlMSUVTX0FTS0VEX1RPX0JFX0xPQURFRC5hZGQoZm9udENTUylcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWZsb2F0aW5nLXByb21pc2VzXG4gICAgICAgICAgICAgICAgZm9udHMubG9hZChmb250Q1NTKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWVtcHR5XG4gICAgICAgICAgICAgICAgICAgICgpID0+IHt9LFxuICAgICAgICAgICAgICAgICAgICBleCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW1RGV10gVW5hYmxlIHRvIHByZWxvYWQgZm9udDpcIiwgZm9udENTUylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbVEZXXVwiLCBleClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmb250cy5jaGVjayhmb250Q1NTKVxuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltURlddIEVycm9yIHdoaWxlIHRlc3RpbmcgaWYgZm9udCBpcyBsb2FkZWQ6XCIsIGZvbnRDU1MpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB3YWl0Rm9yRm9udFRvQmVMb2FkZWQoYXJnczogSVdhaXRGb3JGb250VG9CZUxvYWRlZEFyZ3VtZW50cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBwYXJhbXM6IFJlcXVpcmVkPElXYWl0Rm9yRm9udFRvQmVMb2FkZWRBcmd1bWVudHM+ID0ge1xuICAgICAgICAgICAgc2l6ZTogXCIxcmVtXCIsXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwLFxuICAgICAgICAgICAgLi4uYXJnc1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFNMRUVQSU5HX1RJTUUgPSAxMDBcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgICAgICB3aGlsZSAoIUZvbnRDbGFzcy5pc0ZvbnRMb2FkZWQocGFyYW1zKSkge1xuICAgICAgICAgICAgY29uc3QgZWxhcHNlZFRpbWUgPSBEYXRlLm5vdygpIC0gc3RhcnRUaW1lXG4gICAgICAgICAgICBpZiAoZWxhcHNlZFRpbWUgPiBwYXJhbXMudGltZW91dCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltURlddIFRpbWVvdXQgd2hpbGUgd2FpdGluZyBmb3IgZm9udCB0byBiZSBsb2FkZWQ6XCIsIHBhcmFtcy5uYW1lLCBwYXJhbXMuc2l6ZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IEFzeW5jLnNsZWVwKFNMRUVQSU5HX1RJTUUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuaW50ZXJmYWNlIElJc0ZvbnRMb2FkZWRBcmd1bWVudHMge1xuICAgIG5hbWU6IHN0cmluZ1xuICAgIHNpemU/OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIElXYWl0Rm9yRm9udFRvQmVMb2FkZWRBcmd1bWVudHMgZXh0ZW5kcyBJSXNGb250TG9hZGVkQXJndW1lbnRzIHtcbiAgICB0aW1lb3V0PzogbnVtYmVyXG59XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmlnaHRlb3VzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmlnaHRlb3VzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsImltcG9ydCBGb250IGZyb20gJy4uL2ZvbnQnXG5pbXBvcnQgXCIuL3JpZ2h0ZW91cy5jc3NcIlxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRm9udChcInJpZ2h0ZW91c1wiKVxuIl0sIm5hbWVzIjpbIl9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fIiwiVVJMIiwiX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18iLCJfX19DU1NfTE9BREVSX0VYUE9SVF9fXyIsIl9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18iLCJfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fIiwicHVzaCIsIm1vZHVsZSIsImlkIiwiYWN0aW9uUnVubmluZyIsImV4ZWMiLCJ0YXNrIiwidGhpcyIsImN1clRhc2siLCJueHRUYXNrIiwiYWN0aW9uIiwiY29uc29sZSIsImVycm9yIiwiRGVib3VuY2VyIiwic2xlZXAiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ3aW5kb3ciLCJzZXRUaW1lb3V0IiwiVGhyb3R0bGVyIiwiZGVsYXkiLCJ0aW1lciIsInRpbWVzdGFtcCIsIm5leHRBY3Rpb24iLCJuZXh0QXJncyIsInRocm90dGxlQWN0aW9uIiwiYXJncyIsIm5vdyIsIkRhdGUiLCJlbGFwc2VkVGltZSIsIlVwZGF0ZVRhc2tzIiwiRk9OVEZBTUlMSUVTX0FTS0VEX1RPX0JFX0xPQURFRCIsIlNldCIsIm5hbWUiLCJsb2FkIiwicmVqZWN0IiwiRm9udENsYXNzIiwid2FpdEZvckZvbnRUb0JlTG9hZGVkIiwidXNlIiwiZG9jdW1lbnQiLCJib2R5Iiwic3R5bGUiLCJmb250RmFtaWx5IiwiaXNGb250TG9hZGVkIiwicGFyYW1zIiwic2l6ZSIsImZvbnRDU1MiLCJmb250cyIsImhhcyIsImFkZCIsInRoZW4iLCJleCIsImNoZWNrIiwid2FybiIsInRpbWVvdXQiLCJTTEVFUElOR19USU1FIiwic3RhcnRUaW1lIiwib3B0aW9ucyIsInN0eWxlVGFnVHJhbnNmb3JtIiwic2V0QXR0cmlidXRlcyIsImluc2VydCIsImRvbUFQSSIsImluc2VydFN0eWxlRWxlbWVudCJdLCJzb3VyY2VSb290IjoiIn0=