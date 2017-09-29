/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (typeof options.beforeSend === "function") {
          options.beforeSend(xhr, options);
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        } else {
          return fire(document, 'ajaxStop');
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return xhr.abort();
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=136)}([function(e,t){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(e){if(l===setTimeout)return setTimeout(e,0);if((l===n||!l)&&setTimeout)return l=setTimeout,setTimeout(e,0);try{return l(e,0)}catch(t){try{return l.call(null,e,0)}catch(t){return l.call(this,e,0)}}}function i(e){if(p===clearTimeout)return clearTimeout(e);if((p===o||!p)&&clearTimeout)return p=clearTimeout,clearTimeout(e);try{return p(e)}catch(t){try{return p.call(null,e)}catch(t){return p.call(this,e)}}}function a(){m&&f&&(m=!1,f.length?h=f.concat(h):v=-1,h.length&&u())}function u(){if(!m){var e=r(a);m=!0;for(var t=h.length;t;){for(f=h,h=[];++v<t;)f&&f[v].run();v=-1,t=h.length}f=null,m=!1,i(e)}}function s(e,t){this.fun=e,this.array=t}function c(){}var l,p,d=e.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:n}catch(e){l=n}try{p="function"==typeof clearTimeout?clearTimeout:o}catch(e){p=o}}();var f,h=[],m=!1,v=-1;d.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new s(e,t)),1!==h.length||m||r(u)},s.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=c,d.addListener=c,d.once=c,d.off=c,d.removeListener=c,d.removeAllListeners=c,d.emit=c,d.prependListener=c,d.prependOnceListener=c,d.listeners=function(e){return[]},d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(e,t,n){"use strict";e.exports=n(25)},function(e,t,n){"use strict";(function(t){function n(e,t,n,r,i,a,u,s){if(o(t),!e){var c;if(void 0===t)c=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,i,a,u,s],p=0;c=new Error(t.replace(/%s/g,function(){return l[p++]})),c.name="Invariant Violation"}throw c.framesToPop=1,c}}var o=function(e){};"production"!==t.env.NODE_ENV&&(o=function(e){if(void 0===e)throw new Error("invariant requires an error message argument")}),e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(13),r=o;if("production"!==t.env.NODE_ENV){var i=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];var r=0,i="Warning: "+e.replace(/%s/g,function(){return n[r++]});"undefined"!=typeof console&&console.error(i);try{throw new Error(i)}catch(e){}};r=function(e,t){if(void 0===t)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(0!==t.indexOf("Failed Composite propType: ")&&!e){for(var n=arguments.length,o=Array(n>2?n-2:0),r=2;r<n;r++)o[r-2]=arguments[r];i.apply(void 0,[t].concat(o))}}}e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";function o(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,o=0;o<t;o++)n+="&args[]="+encodeURIComponent(arguments[o+1]);n+=" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";var r=new Error(n);throw r.name="Invariant Violation",r.framesToPop=1,r}e.exports=o},function(e,t,n){"use strict";function o(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var r=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var o={};return"abcdefghijklmnopqrst".split("").forEach(function(e){o[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},o)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,s=o(e),c=1;c<arguments.length;c++){n=Object(arguments[c]);for(var l in n)i.call(n,l)&&(s[l]=n[l]);if(r){u=r(n);for(var p=0;p<u.length;p++)a.call(n,u[p])&&(s[u[p]]=n[u[p]])}}return s}},function(e,t,n){"use strict";(function(t){function o(e,t){return 1===e.nodeType&&e.getAttribute(m)===String(t)||8===e.nodeType&&e.nodeValue===" react-text: "+t+" "||8===e.nodeType&&e.nodeValue===" react-empty: "+t+" "}function r(e){for(var t;t=e._renderedComponent;)e=t;return e}function i(e,t){var n=r(e);n._hostNode=t,t[y]=n}function a(e){var t=e._hostNode;t&&(delete t[y],e._hostNode=null)}function u(e,n){if(!(e._flags&v.hasCachedChildNodes)){var a=e._renderedChildren,u=n.firstChild;e:for(var s in a)if(a.hasOwnProperty(s)){var c=a[s],l=r(c)._domID;if(0!==l){for(;null!==u;u=u.nextSibling)if(o(u,l)){i(c,u);continue e}"production"!==t.env.NODE_ENV?h(!1,"Unable to find element with ID %s.",l):p("32",l)}}e._flags|=v.hasCachedChildNodes}}function s(e){if(e[y])return e[y];for(var t=[];!e[y];){if(t.push(e),!e.parentNode)return null;e=e.parentNode}for(var n,o;e&&(o=e[y]);e=t.pop())n=o,t.length&&u(o,e);return n}function c(e){var t=s(e);return null!=t&&t._hostNode===e?t:null}function l(e){if(void 0===e._hostNode&&("production"!==t.env.NODE_ENV?h(!1,"getNodeFromInstance: Invalid argument."):p("33")),e._hostNode)return e._hostNode;for(var n=[];!e._hostNode;)n.push(e),e._hostParent||("production"!==t.env.NODE_ENV?h(!1,"React DOM tree root should always have a node reference."):p("34")),e=e._hostParent;for(;n.length;e=n.pop())u(e,e._hostNode);return e._hostNode}var p=n(4),d=n(20),f=n(84),h=n(2),m=d.ID_ATTRIBUTE_NAME,v=f,y="__reactInternalInstance$"+Math.random().toString(36).slice(2),g={getClosestInstanceFromNode:s,getInstanceFromNode:c,getNodeFromInstance:l,precacheChildNodes:u,precacheNode:i,uncacheNode:a};e.exports=g}).call(t,n(0))},function(e,t,n){"use strict";var o=!("undefined"==typeof window||!window.document||!window.document.createElement),r={canUseDOM:o,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:o&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:o&&!!window.screen,isInWorker:!o};e.exports=r},function(e,t,n){"use strict";(function(t){var n=function(){};"production"!==t.env.NODE_ENV&&(n=function(e,t,n){var o=arguments.length;n=new Array(o>2?o-2:0);for(var r=2;r<o;r++)n[r-2]=arguments[r];if(void 0===t)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(t.length<10||/^[s\W]*$/.test(t))throw new Error("The warning format should be able to uniquely identify this warning. Please, use a more descriptive format than: "+t);if(!e){var i=0,a="Warning: "+t.replace(/%s/g,function(){return n[i++]});"undefined"!=typeof console&&console.error(a);try{throw new Error(a)}catch(e){}}}),e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(238),r=n(110),i=n(241);n.d(t,"Provider",function(){return o.b}),n.d(t,"createProvider",function(){return o.a}),n.d(t,"connectAdvanced",function(){return r.a}),n.d(t,"connect",function(){return i.a})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(277);n.d(t,"BrowserRouter",function(){return o.a});var r=n(279);n.d(t,"HashRouter",function(){return r.a});var i=n(129);n.d(t,"Link",function(){return i.a});var a=n(281);n.d(t,"MemoryRouter",function(){return a.a});var u=n(282);n.d(t,"NavLink",function(){return u.a});var s=n(283);n.d(t,"Prompt",function(){return s.a});var c=n(284);n.d(t,"Redirect",function(){return c.a});var l=n(130);n.d(t,"Route",function(){return l.a});var p=n(73);n.d(t,"Router",function(){return p.a});var d=n(285);n.d(t,"StaticRouter",function(){return d.a});var f=n(286);n.d(t,"Switch",function(){return f.a});var h=n(287);n.d(t,"matchPath",function(){return h.a});var m=n(288);n.d(t,"withRouter",function(){return m.a})},function(e,t,n){(function(t){if("production"!==t.env.NODE_ENV){var o="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,r=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o};e.exports=n(83)(r,!0)}else e.exports=n(239)()}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){var t=Function.prototype.toString,n=Object.prototype.hasOwnProperty,o=RegExp("^"+t.call(n).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");try{var r=t.call(e);return o.test(r)}catch(e){return!1}}function r(e){var t=c(e);if(t){var n=t.childIDs;l(e),n.forEach(r)}}function i(e,t,n){return"\n    in "+(e||"Unknown")+(t?" (at "+t.fileName.replace(/^.*[\\\/]/,"")+":"+t.lineNumber+")":n?" (created by "+n+")":"")}function a(e){return null==e?"#empty":"string"==typeof e||"number"==typeof e?"#text":"string"==typeof e.type?e.type:e.type.displayName||e.type.name||"Unknown"}function u(e){var n,o=T.getDisplayName(e),r=T.getElement(e),a=T.getOwnerID(e);return a&&(n=T.getDisplayName(a)),"production"!==t.env.NODE_ENV&&g(r,"ReactComponentTreeHook: Missing React element for debugID %s when building stack",e),i(o,r&&r._source,n)}var s,c,l,p,d,f,h,m=n(26),v=n(17),y=n(2),g=n(3),E="function"==typeof Array.from&&"function"==typeof Map&&o(Map)&&null!=Map.prototype&&"function"==typeof Map.prototype.keys&&o(Map.prototype.keys)&&"function"==typeof Set&&o(Set)&&null!=Set.prototype&&"function"==typeof Set.prototype.keys&&o(Set.prototype.keys);if(E){var b=new Map,_=new Set;s=function(e,t){b.set(e,t)},c=function(e){return b.get(e)},l=function(e){b.delete(e)},p=function(){return Array.from(b.keys())},d=function(e){_.add(e)},f=function(e){_.delete(e)},h=function(){return Array.from(_.keys())}}else{var O={},N={},C=function(e){return"."+e},w=function(e){return parseInt(e.substr(1),10)};s=function(e,t){var n=C(e);O[n]=t},c=function(e){var t=C(e);return O[t]},l=function(e){var t=C(e);delete O[t]},p=function(){return Object.keys(O).map(w)},d=function(e){var t=C(e);N[t]=!0},f=function(e){var t=C(e);delete N[t]},h=function(){return Object.keys(N).map(w)}}var k=[],T={onSetChildren:function(e,n){var o=c(e);o||("production"!==t.env.NODE_ENV?y(!1,"Item must have been set"):m("144")),o.childIDs=n;for(var r=0;r<n.length;r++){var i=n[r],a=c(i);a||("production"!==t.env.NODE_ENV?y(!1,"Expected hook events to fire for the child before its parent includes it in onSetChildren()."):m("140")),null==a.childIDs&&"object"==typeof a.element&&null!=a.element&&("production"!==t.env.NODE_ENV?y(!1,"Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren()."):m("141")),a.isMounted||("production"!==t.env.NODE_ENV?y(!1,"Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren()."):m("71")),null==a.parentID&&(a.parentID=e),a.parentID!==e&&("production"!==t.env.NODE_ENV?y(!1,"Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).",i,a.parentID,e):m("142",i,a.parentID,e))}},onBeforeMountComponent:function(e,t,n){s(e,{element:t,parentID:n,text:null,childIDs:[],isMounted:!1,updateCount:0})},onBeforeUpdateComponent:function(e,t){var n=c(e);n&&n.isMounted&&(n.element=t)},onMountComponent:function(e){var n=c(e);n||("production"!==t.env.NODE_ENV?y(!1,"Item must have been set"):m("144")),n.isMounted=!0,0===n.parentID&&d(e)},onUpdateComponent:function(e){var t=c(e);t&&t.isMounted&&t.updateCount++},onUnmountComponent:function(e){var t=c(e);if(t){t.isMounted=!1;0===t.parentID&&f(e)}k.push(e)},purgeUnmountedComponents:function(){if(!T._preventPurging){for(var e=0;e<k.length;e++){r(k[e])}k.length=0}},isMounted:function(e){var t=c(e);return!!t&&t.isMounted},getCurrentStackAddendum:function(e){var t="";if(e){var n=a(e),o=e._owner;t+=i(n,e._source,o&&o.getName())}var r=v.current,u=r&&r._debugID;return t+=T.getStackAddendumByID(u)},getStackAddendumByID:function(e){for(var t="";e;)t+=u(e),e=T.getParentID(e);return t},getChildIDs:function(e){var t=c(e);return t?t.childIDs:[]},getDisplayName:function(e){var t=T.getElement(e);return t?a(t):null},getElement:function(e){var t=c(e);return t?t.element:null},getOwnerID:function(e){var t=T.getElement(e);return t&&t._owner?t._owner._debugID:null},getParentID:function(e){var t=c(e);return t?t.parentID:null},getSource:function(e){var t=c(e),n=t?t.element:null;return null!=n?n._source:null},getText:function(e){var t=T.getElement(e);return"string"==typeof t?t:"number"==typeof t?""+t:null},getUpdateCount:function(e){var t=c(e);return t?t.updateCount:0},getRootIDs:h,getRegisteredIDs:p,pushNonStandardWarningStack:function(e,t){if("function"==typeof console.reactStack){var n=[],o=v.current,r=o&&o._debugID;try{for(e&&n.push({name:r?T.getDisplayName(r):null,fileName:t?t.fileName:null,lineNumber:t?t.lineNumber:null});r;){var i=T.getElement(r),a=T.getParentID(r),u=T.getOwnerID(r),s=u?T.getDisplayName(u):null,c=i&&i._source;n.push({name:s,fileName:c?c.fileName:null,lineNumber:c?c.lineNumber:null}),r=a}}catch(e){}console.reactStack(n)}},popNonStandardWarningStack:function(){"function"==typeof console.reactStackEnd&&console.reactStackEnd()}};e.exports=T}).call(t,n(0))},function(e,t,n){"use strict";function o(e){return function(){return e}}var r=function(){};r.thatReturns=o,r.thatReturnsFalse=o(!1),r.thatReturnsTrue=o(!0),r.thatReturnsNull=o(null),r.thatReturnsThis=function(){return this},r.thatReturnsArgument=function(e){return e},e.exports=r},function(e,t,n){"use strict";(function(t){var o=null;if("production"!==t.env.NODE_ENV){o=n(162)}e.exports={debugTool:o}}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var n=function(e,n,o,r,i,a,u,s){if("production"!==t.env.NODE_ENV&&void 0===n)throw new Error("invariant requires an error message argument");if(!e){var c;if(void 0===n)c=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[o,r,i,a,u,s],p=0;c=new Error(n.replace(/%s/g,function(){return l[p++]})),c.name="Invariant Violation"}throw c.framesToPop=1,c}};e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.fetchUserTracksThunk=t.deleteTrackThunk=t.editTrackThunk=t.fetchBinaryData=t.verifyThenPostThunk=t.fetchTrackThunk=t.receiveUploadCompleted=t.receiveUploadProcessed=t.receiveUploadProgress=t.receiveTracks=t.clearUploadErrors=t.receiveUploadErrors=t.clearUploadParamsErrors=t.receiveUploadInactive=t.receiveUploadActive=t.receiveUploadParamsErrors=t.receiveTrack=t.receiveTracksLoaded=t.receiveTracksLoading=t.RECEIVE_TRACKS_LOADING=t.RECEIVE_TRACKS_LOADED=t.RECEIVE_UPLOAD_PROCESSED=t.RECEIVE_UPLOAD_INACTIVE=t.RECEIVE_UPLOAD_ACTIVE=t.RECEIVE_UPLOAD_COMPLETED=t.RECEIVE_UPLOAD_PROGRESS=t.CLEAR_UPLOAD_PARAMS_ERRORS=t.RECEIVE_UPLOAD_PARAMS_ERRORS=t.CLEAR_UPLOAD_ERRORS=t.RECEIVE_UPLOAD_ERRORS=t.DELETE_TRACK=t.RECEIVE_TRACKS=t.RECEIVE_TRACK=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(291),u=o(a),s=n(131),c=o(s),l=t.RECEIVE_TRACK="RECEIVE_TRACK",p=t.RECEIVE_TRACKS="RECEIVE_TRACKS",d=(t.DELETE_TRACK="DELETE_TRACK",t.RECEIVE_UPLOAD_ERRORS="RECEIVE_UPLOAD_ERRORS"),f=t.CLEAR_UPLOAD_ERRORS="CLEAR_UPLOAD_ERRORS",h=t.RECEIVE_UPLOAD_PARAMS_ERRORS="RECEIVE_UPLOAD_PARAMS_ERRORS",m=t.CLEAR_UPLOAD_PARAMS_ERRORS="CLEAR_UPLOAD_PARAMS_ERRORS",v=t.RECEIVE_UPLOAD_PROGRESS="RECEIVE_UPLOAD_PROGRESS",y=t.RECEIVE_UPLOAD_COMPLETED="RECEIVE_UPLOAD_COMPLETED",g=t.RECEIVE_UPLOAD_ACTIVE="RECEIVE_UPLOAD_ACTIVE",E=t.RECEIVE_UPLOAD_INACTIVE="RECEIVE_UPLOAD_INACTIVE",b=t.RECEIVE_UPLOAD_PROCESSED="RECEIVE_UPLOAD_PROCESSED",_=t.RECEIVE_TRACKS_LOADED="RECIEVE_TRACKS_LOADED",O=t.RECEIVE_TRACKS_LOADING="RECIEVE_TRACKS_LOADING",N=(t.receiveTracksLoading=function(){return{type:O}},t.receiveTracksLoaded=function(){return{type:_}},t.receiveTrack=function(e){return{type:l,payload:e}}),C=t.receiveUploadParamsErrors=function(e){return{type:h,payload:e.statusText?{general:[e.statusText]}:e}},w=t.receiveUploadActive=function(){return{type:g}},k=(t.receiveUploadInactive=function(){return{type:E}},t.clearUploadParamsErrors=function(e){return{type:m}},t.receiveUploadErrors=function(e){return{type:d,payload:e}}),T=(t.clearUploadErrors=function(){return{type:f}},t.receiveTracks=function(e){return{type:p,payload:e}}),D=t.receiveUploadProgress=function(e){return{type:v,payload:e}},P=t.receiveUploadProcessed=function(){return{type:b}},S=t.receiveUploadCompleted=function(){return{type:y}},x=(t.fetchTrackThunk=function(e,t){return function(n){return u.fetchTrack(e).then(function(e){return n(N(e))}).then(function(){t&&t(e)})}},t.verifyThenPostThunk=function(e){return function(t){var n=(new FormData,{track:{}});Object.keys(e).forEach(function(t){"file"!==t&&"imageFile"!==t&&(n.track[t]=e[t])}),n.filename=e.file?e.file.name:"",e.imageFile&&(n.image_filename=e.imageFile.name),u.verifyValidParams(n).then(function(o){var r=new x(e.file.size,e.imageFile?e.imageFile.size:0);n.temp_filename=o.audio.temp_filename,o.image&&(n.temp_image_filename=o.image.temp_filename),r.registerCallback(function(){t(S()),u.process_track(n).catch(function(e){return t(k(e)),$.Deferred().reject()}).then(function(e){return setTimeout(function(){return t(R(e.id))},1e3)})}),c.postPresigned({file:e.file,s3Info:o.audio,progressCallback:function(e){r.alertAmountAudioUploaded(e.loaded),t(D(r.getTotalProgress()))}}).then(function(){return r.alertAudioDone()}),o.image?c.postPresigned({file:e.imageFile,s3Info:o.image,progressCallback:function(e){r.alertAmountImageUploaded(e.loaded),t(D(r.getTotalProgress()))}}).then(function(){return r.alertImageDone()}):r.alertImageDone(),t(w())},function(e){return t(C(e.responseJSON)),$.Deferred().reject()})}},function(){function e(t,n){r(this,e),this.progress=0,this.total=t+n,this.audioUploaded=0,this.imageUploaded=0,this.audioDone=!1,this.imageDone=!1}return i(e,[{key:"registerCallback",value:function(e){this.callback=e}},{key:"alertAmountAudioUploaded",value:function(e){this.audioUploaded=e}},{key:"alertAmountImageUploaded",value:function(e){this.imageUploaded=e}},{key:"alertImageDone",value:function(){this.imageDone=!0,this.audioDone&&this.callback()}},{key:"alertAudioDone",value:function(){this.audioDone=!0,this.imageDone&&this.callback()}},{key:"getTotalProgress",value:function(){return(this.audioUploaded+this.imageUploaded)/this.total}}]),e}()),R=function e(t){return function(n){$.ajax({method:"get",url:"api/tracks/"+t+"/status"}).then(function(o){o.id?n(P()):"failed"===o.status?n(k({general:["couldn't process audio"]})):setTimeout(function(){return n(e(t))},1e3)})}};t.fetchBinaryData=function(e,t,n){u.getS3Url(t).then(function(e){return new Promise(function(t,n){var o=new XMLHttpRequest;o.open("get",e),o.responseType="blob",o.onload=function(){return t(o.response)},o.onerror=n,o.send()})}).then(function(t){e.binaryData=t,e.fetching=!1}).then(n).catch(function(){return e.fetching=!1})},t.editTrackThunk=function(e){return function(t){u.updateTrack({track:e}).then(function(){location.hash="tracks/"+e.id}).catch(function(e){return t(C(e.responseJSON))})}},t.deleteTrackThunk=function(e,t){return function(n){u.deleteTrack(e).then(t)}},t.fetchUserTracksThunk=function(e,t){return function(n){return u.fetchUserTracks(e).then(function(e){return n(T(e))}).then(t)}}},function(e,t,n){"use strict";var o={current:null};e.exports=o},function(e,t,n){"use strict";(function(t){function o(){D.ReactReconcileTransaction&&O||("production"!==t.env.NODE_ENV?y(!1,"ReactUpdates: must inject a reconcile transaction class and batching strategy"):l("123"))}function r(){this.reinitializeTransaction(),this.dirtyComponentsLength=null,this.callbackQueue=d.getPooled(),this.reconcileTransaction=D.ReactReconcileTransaction.getPooled(!0)}function i(e,t,n,r,i,a){return o(),O.batchedUpdates(e,t,n,r,i,a)}function a(e,t){return e._mountOrder-t._mountOrder}function u(e){var n=e.dirtyComponentsLength;n!==g.length&&("production"!==t.env.NODE_ENV?y(!1,"Expected flush transaction's stored dirty-components length (%s) to match dirty-components array length (%s).",n,g.length):l("124",n,g.length)),g.sort(a),E++;for(var o=0;o<n;o++){var r=g[o],i=r._pendingCallbacks;r._pendingCallbacks=null;var u;if(h.logTopLevelRenders){var s=r;r._currentElement.type.isReactTopLevelWrapper&&(s=r._renderedComponent),u="React update: "+s.getName(),console.time(u)}if(m.performUpdateIfNecessary(r,e.reconcileTransaction,E),u&&console.timeEnd(u),i)for(var c=0;c<i.length;c++)e.callbackQueue.enqueue(i[c],r.getPublicInstance())}}function s(e){if(o(),!O.isBatchingUpdates)return void O.batchedUpdates(s,e);g.push(e),null==e._updateBatchNumber&&(e._updateBatchNumber=E+1)}function c(e,n){O.isBatchingUpdates||("production"!==t.env.NODE_ENV?y(!1,"ReactUpdates.asap: Can't enqueue an asap callback in a context whereupdates are not being batched."):l("125")),b.enqueue(e,n),_=!0}var l=n(4),p=n(5),d=n(88),f=n(22),h=n(89),m=n(27),v=n(40),y=n(2),g=[],E=0,b=d.getPooled(),_=!1,O=null,N={initialize:function(){this.dirtyComponentsLength=g.length},close:function(){this.dirtyComponentsLength!==g.length?(g.splice(0,this.dirtyComponentsLength),k()):g.length=0}},C={initialize:function(){this.callbackQueue.reset()},close:function(){this.callbackQueue.notifyAll()}},w=[N,C];p(r.prototype,v,{getTransactionWrappers:function(){return w},destructor:function(){this.dirtyComponentsLength=null,d.release(this.callbackQueue),this.callbackQueue=null,D.ReactReconcileTransaction.release(this.reconcileTransaction),this.reconcileTransaction=null},perform:function(e,t,n){return v.perform.call(this,this.reconcileTransaction.perform,this.reconcileTransaction,e,t,n)}}),f.addPoolingTo(r);var k=function(){for(;g.length||_;){if(g.length){var e=r.getPooled();e.perform(u,null,e),r.release(e)}if(_){_=!1;var t=b;b=d.getPooled(),t.notifyAll(),d.release(t)}}},T={injectReconcileTransaction:function(e){e||("production"!==t.env.NODE_ENV?y(!1,"ReactUpdates: must provide a reconcile transaction class"):l("126")),D.ReactReconcileTransaction=e},injectBatchingStrategy:function(e){e||("production"!==t.env.NODE_ENV?y(!1,"ReactUpdates: must provide a batching strategy"):l("127")),"function"!=typeof e.batchedUpdates&&("production"!==t.env.NODE_ENV?y(!1,"ReactUpdates: must provide a batchedUpdates() function"):l("128")),"boolean"!=typeof e.isBatchingUpdates&&("production"!==t.env.NODE_ENV?y(!1,"ReactUpdates: must provide an isBatchingUpdates boolean attribute"):l("129")),O=e}},D={ReactReconcileTransaction:null,batchedUpdates:i,enqueueUpdate:s,flushBatchedUpdates:k,injection:T,asap:c};e.exports=D}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,n,o,r){"production"!==t.env.NODE_ENV&&(delete this.nativeEvent,delete this.preventDefault,delete this.stopPropagation),this.dispatchConfig=e,this._targetInst=n,this.nativeEvent=o;var i=this.constructor.Interface;for(var a in i)if(i.hasOwnProperty(a)){"production"!==t.env.NODE_ENV&&delete this[a];var s=i[a];s?this[a]=s(o):"target"===a?this.target=r:this[a]=o[a]}var c=null!=o.defaultPrevented?o.defaultPrevented:!1===o.returnValue;return this.isDefaultPrevented=c?u.thatReturnsTrue:u.thatReturnsFalse,this.isPropagationStopped=u.thatReturnsFalse,this}function r(e,n){function o(e){return i(a?"setting the method":"setting the property","This is effectively a no-op"),e}function r(){return i(a?"accessing the method":"accessing the property",a?"This is a no-op function":"This is set to null"),n}function i(n,o){"production"!==t.env.NODE_ENV&&s(!1,"This synthetic event is reused for performance reasons. If you're seeing this, you're %s `%s` on a released/nullified synthetic event. %s. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.",n,e,o)}var a="function"==typeof n;return{configurable:!0,set:o,get:r}}var i=n(5),a=n(22),u=n(13),s=n(3),c=!1,l="function"==typeof Proxy,p=["dispatchConfig","_targetInst","nativeEvent","isDefaultPrevented","isPropagationStopped","_dispatchListeners","_dispatchInstances"],d={type:null,target:null,currentTarget:u.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};i(o.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=u.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=u.thatReturnsTrue)},persist:function(){this.isPersistent=u.thatReturnsTrue},isPersistent:u.thatReturnsFalse,destructor:function(){var e=this.constructor.Interface;for(var n in e)"production"!==t.env.NODE_ENV?Object.defineProperty(this,n,r(n,e[n])):this[n]=null;for(var o=0;o<p.length;o++)this[p[o]]=null;"production"!==t.env.NODE_ENV&&(Object.defineProperty(this,"nativeEvent",r("nativeEvent",null)),Object.defineProperty(this,"preventDefault",r("preventDefault",u)),Object.defineProperty(this,"stopPropagation",r("stopPropagation",u)))}}),o.Interface=d,"production"!==t.env.NODE_ENV&&l&&(o=new Proxy(o,{construct:function(e,t){return this.apply(e,Object.create(e.prototype),t)},apply:function(e,n,o){return new Proxy(e.apply(n,o),{set:function(e,n,o){return"isPersistent"===n||e.constructor.Interface.hasOwnProperty(n)||-1!==p.indexOf(n)||("production"!==t.env.NODE_ENV&&s(c||e.isPersistent(),"This synthetic event is reused for performance reasons. If you're seeing this, you're adding a new property in the synthetic event object. The property is never released. See https://fb.me/react-event-pooling for more information."),c=!0),e[n]=o,!0}})}})),o.augmentClass=function(e,t){var n=this,o=function(){};o.prototype=n.prototype;var r=new o;i(r,e.prototype),e.prototype=r,e.prototype.constructor=e,e.Interface=i({},n.Interface,t),e.augmentClass=n.augmentClass,a.addPoolingTo(e,a.fourArgumentPooler)},a.addPoolingTo(o,a.fourArgumentPooler),e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,t){return(e&t)===t}var r=n(4),i=n(2),a={MUST_USE_PROPERTY:1,HAS_BOOLEAN_VALUE:4,HAS_NUMERIC_VALUE:8,HAS_POSITIVE_NUMERIC_VALUE:24,HAS_OVERLOADED_BOOLEAN_VALUE:32,injectDOMPropertyConfig:function(e){var n=a,u=e.Properties||{},c=e.DOMAttributeNamespaces||{},l=e.DOMAttributeNames||{},p=e.DOMPropertyNames||{},d=e.DOMMutationMethods||{};e.isCustomAttribute&&s._isCustomAttributeFunctions.push(e.isCustomAttribute);for(var f in u){s.properties.hasOwnProperty(f)&&("production"!==t.env.NODE_ENV?i(!1,"injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.",f):r("48",f));var h=f.toLowerCase(),m=u[f],v={attributeName:h,attributeNamespace:null,propertyName:f,mutationMethod:null,mustUseProperty:o(m,n.MUST_USE_PROPERTY),hasBooleanValue:o(m,n.HAS_BOOLEAN_VALUE),hasNumericValue:o(m,n.HAS_NUMERIC_VALUE),hasPositiveNumericValue:o(m,n.HAS_POSITIVE_NUMERIC_VALUE),hasOverloadedBooleanValue:o(m,n.HAS_OVERLOADED_BOOLEAN_VALUE)};if(v.hasBooleanValue+v.hasNumericValue+v.hasOverloadedBooleanValue<=1||("production"!==t.env.NODE_ENV?i(!1,"DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s",f):r("50",f)),"production"!==t.env.NODE_ENV&&(s.getPossibleStandardName[h]=f),l.hasOwnProperty(f)){var y=l[f];v.attributeName=y,"production"!==t.env.NODE_ENV&&(s.getPossibleStandardName[y]=f)}c.hasOwnProperty(f)&&(v.attributeNamespace=c[f]),p.hasOwnProperty(f)&&(v.propertyName=p[f]),d.hasOwnProperty(f)&&(v.mutationMethod=d[f]),s.properties[f]=v}}},u=":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",s={ID_ATTRIBUTE_NAME:"data-reactid",ROOT_ATTRIBUTE_NAME:"data-reactroot",ATTRIBUTE_NAME_START_CHAR:u,ATTRIBUTE_NAME_CHAR:u+"\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",properties:{},getPossibleStandardName:"production"!==t.env.NODE_ENV?{autofocus:"autoFocus"}:null,_isCustomAttributeFunctions:[],isCustomAttribute:function(e){for(var t=0;t<s._isCustomAttributeFunctions.length;t++){if((0,s._isCustomAttributeFunctions[t])(e))return!0}return!1},injection:a};e.exports=s}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){if("production"!==t.env.NODE_ENV&&f.call(e,"ref")){var n=Object.getOwnPropertyDescriptor(e,"ref").get;if(n&&n.isReactWarning)return!1}return void 0!==e.ref}function r(e){if("production"!==t.env.NODE_ENV&&f.call(e,"key")){var n=Object.getOwnPropertyDescriptor(e,"key").get;if(n&&n.isReactWarning)return!1}return void 0!==e.key}function i(e,n){var o=function(){u||(u=!0,"production"!==t.env.NODE_ENV&&p(!1,"%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://fb.me/react-special-props)",n))};o.isReactWarning=!0,Object.defineProperty(e,"key",{get:o,configurable:!0})}function a(e,n){var o=function(){s||(s=!0,"production"!==t.env.NODE_ENV&&p(!1,"%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://fb.me/react-special-props)",n))};o.isReactWarning=!0,Object.defineProperty(e,"ref",{get:o,configurable:!0})}var u,s,c=n(5),l=n(17),p=n(3),d=n(37),f=Object.prototype.hasOwnProperty,h=n(79),m={key:!0,ref:!0,__self:!0,__source:!0},v=function(e,n,o,r,i,a,u){var s={$$typeof:h,type:e,key:n,ref:o,props:u,_owner:a};return"production"!==t.env.NODE_ENV&&(s._store={},d?(Object.defineProperty(s._store,"validated",{configurable:!1,enumerable:!1,writable:!0,value:!1}),Object.defineProperty(s,"_self",{configurable:!1,enumerable:!1,writable:!1,value:r}),Object.defineProperty(s,"_source",{configurable:!1,enumerable:!1,writable:!1,value:i})):(s._store.validated=!1,s._self=r,s._source=i),Object.freeze&&(Object.freeze(s.props),Object.freeze(s))),s};v.createElement=function(e,n,u){var s,c={},p=null,d=null,y=null,g=null;if(null!=n){o(n)&&(d=n.ref),r(n)&&(p=""+n.key),y=void 0===n.__self?null:n.__self,g=void 0===n.__source?null:n.__source;for(s in n)f.call(n,s)&&!m.hasOwnProperty(s)&&(c[s]=n[s])}var E=arguments.length-2;if(1===E)c.children=u;else if(E>1){for(var b=Array(E),_=0;_<E;_++)b[_]=arguments[_+2];"production"!==t.env.NODE_ENV&&Object.freeze&&Object.freeze(b),c.children=b}if(e&&e.defaultProps){var O=e.defaultProps;for(s in O)void 0===c[s]&&(c[s]=O[s])}if("production"!==t.env.NODE_ENV&&(p||d)&&(void 0===c.$$typeof||c.$$typeof!==h)){var N="function"==typeof e?e.displayName||e.name||"Unknown":e;p&&i(c,N),d&&a(c,N)}return v(e,p,d,y,g,l.current,c)},v.createFactory=function(e){var t=v.createElement.bind(null,e);return t.type=e,t},v.cloneAndReplaceKey=function(e,t){return v(e.type,t,e.ref,e._self,e._source,e._owner,e.props)},v.cloneElement=function(e,t,n){var i,a=c({},e.props),u=e.key,s=e.ref,p=e._self,d=e._source,h=e._owner;if(null!=t){o(t)&&(s=t.ref,h=l.current),r(t)&&(u=""+t.key);var y;e.type&&e.type.defaultProps&&(y=e.type.defaultProps);for(i in t)f.call(t,i)&&!m.hasOwnProperty(i)&&(void 0===t[i]&&void 0!==y?a[i]=y[i]:a[i]=t[i])}var g=arguments.length-2;if(1===g)a.children=n;else if(g>1){for(var E=Array(g),b=0;b<g;b++)E[b]=arguments[b+2];a.children=E}return v(e.type,u,s,p,d,h,a)},v.isValidElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===h},e.exports=v}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(4),r=n(2),i=function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)},a=function(e,t){var n=this;if(n.instancePool.length){var o=n.instancePool.pop();return n.call(o,e,t),o}return new n(e,t)},u=function(e,t,n){var o=this;if(o.instancePool.length){var r=o.instancePool.pop();return o.call(r,e,t,n),r}return new o(e,t,n)},s=function(e,t,n,o){var r=this;if(r.instancePool.length){var i=r.instancePool.pop();return r.call(i,e,t,n,o),i}return new r(e,t,n,o)},c=function(e){var n=this;e instanceof n||("production"!==t.env.NODE_ENV?r(!1,"Trying to release an instance into a pool of a different type."):o("25")),e.destructor(),n.instancePool.length<n.poolSize&&n.instancePool.push(e)},l=i,p=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||l,n.poolSize||(n.poolSize=10),n.release=c,n},d={addPoolingTo:p,oneArgumentPooler:i,twoArgumentPooler:a,threeArgumentPooler:u,fourArgumentPooler:s};e.exports=d}).call(t,n(0))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fetchTrackCommentsUsersThunk=t.fetchUserThunk=t.postUserThunk=t.receiveUser=t.receiveUsersLoaded=t.receiveUsersLoading=t.receiveUsers=t.RECEIVE_USER=t.RECEIVE_USERS_LOADED=t.RECEIVE_USERS_LOADING=t.RECEIVE_USERS=void 0;var o=n(275),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(o),i=n(24),a=t.RECEIVE_USERS="RECEIVE_USERS",u=t.RECEIVE_USERS_LOADING="RECEIVE_USERS_LOADING",s=t.RECEIVE_USERS_LOADED="RECEIVE_USERS_LOADED",c=t.RECEIVE_USER="RECEIVE_USER",l=t.receiveUsers=function(e){return{type:a,payload:e}},p=(t.receiveUsersLoading=function(){return{type:u}},t.receiveUsersLoaded=function(){return{type:s}}),d=t.receiveUser=function(e){return{type:c,payload:e}};t.postUserThunk=function(e){return function(t){return r.postUser(e).then(function(e){return t((0,i.receiveSession)(e))}).catch(function(e){return t((0,i.receiveSessionErrors)(e.responseJSON))})}},t.fetchUserThunk=function(e,t){return function(n){return r.fetchUser(e).then(function(e){return n(d(e))}).then(t)}},t.fetchTrackCommentsUsersThunk=function(e){return function(t){return r.fetchTrackCommentsUsers(e).then(function(e){t(l(e)),t(p())})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.deleteSessionThunk=t.postSessionThunk=t.clearSessionErrors=t.receiveSessionErrors=t.receiveSession=t.CLEAR_SESSION_ERRORS=t.RECEIVE_SESSION_ERRORS=t.DELETE_SESSION=t.RECEIVE_SESSION=void 0;var o=n(276),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(o),i=t.RECEIVE_SESSION="RECEIVE_SESSION",a=t.DELETE_SESSION="DELETE_SESSION",u=t.RECEIVE_SESSION_ERRORS="RECEIVE_SESSION_ERRORS",s=t.CLEAR_SESSION_ERRORS="CLEAR_SESSION_ERRORS",c=t.receiveSession=function(e){return{type:i,payload:e}},l=t.receiveSessionErrors=function(e){return{type:u,errors:e}},p=(t.clearSessionErrors=function(e){return{type:s,errors:e}},function(){return{type:a}});t.postSessionThunk=function(e){return function(t){return r.postSession(e).then(function(e){return t(c(e))},function(e){return t(l(e.responseJSON))})}},t.deleteSessionThunk=function(){return function(e){return r.deleteSession().then(function(){e(p())})}}},function(e,t,n){"use strict";(function(t){var o=n(5),r=n(77),i=n(137),a=n(141),u=n(21),s=n(145),c=n(147),l=n(148),p=n(150),d=u.createElement,f=u.createFactory,h=u.cloneElement;if("production"!==t.env.NODE_ENV){var m=n(49),v=n(37),y=n(81),g=!1;d=y.createElement,f=y.createFactory,h=y.cloneElement}var E=o,b=function(e){return e};if("production"!==t.env.NODE_ENV){var _=!1,O=!1;E=function(){return m(_,"React.__spread is deprecated and should not be used. Use Object.assign directly or another helper function with similar semantics. You may be seeing this warning due to your compiler. See https://fb.me/react-spread-deprecation for more details."),_=!0,o.apply(null,arguments)},b=function(e){return m(O,"React.createMixin is deprecated and should not be used. In React v16.0, it will be removed. You can use this mixin directly instead. See https://fb.me/createmixin-was-never-implemented for more info."),O=!0,e}}var N={Children:{map:i.map,forEach:i.forEach,count:i.count,toArray:i.toArray,only:p},Component:r.Component,PureComponent:r.PureComponent,createElement:d,cloneElement:h,isValidElement:u.isValidElement,PropTypes:s,createClass:l,createFactory:f,createMixin:b,DOM:a,version:c,__spread:E};if("production"!==t.env.NODE_ENV){var C=!1;v&&(Object.defineProperty(N,"PropTypes",{get:function(){return m(g,"Accessing PropTypes via the main React package is deprecated, and will be removed in  React v16.0. Use the latest available v15.* prop-types package from npm instead. For info on usage, compatibility, migration and more, see https://fb.me/prop-types-docs"),g=!0,s}}),Object.defineProperty(N,"createClass",{get:function(){return m(C,"Accessing createClass via the main React package is deprecated, and will be removed in React v16.0. Use a plain JavaScript class instead. If you're not yet ready to migrate, create-react-class v15.* is available on npm as a temporary, drop-in replacement. For more info see https://fb.me/react-create-class"),C=!0,l}})),N.DOM={};var w=!1;Object.keys(a).forEach(function(e){N.DOM[e]=function(){return w||(m(!1,"Accessing factories like React.DOM.%s has been deprecated and will be removed in v16.0+. Use the react-dom-factories package instead.  Version 1.0 provides a drop-in replacement. For more info, see https://fb.me/react-dom-factories",e),w=!0),a[e].apply(a,arguments)}})}e.exports=N}).call(t,n(0))},function(e,t,n){"use strict";function o(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,o=0;o<t;o++)n+="&args[]="+encodeURIComponent(arguments[o+1]);n+=" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";var r=new Error(n);throw r.name="Invariant Violation",r.framesToPop=1,r}e.exports=o},function(e,t,n){"use strict";(function(t){function o(){r.attachRefs(this,this._currentElement)}var r=n(160),i=n(14),a=n(3),u={mountComponent:function(e,n,r,a,u,s){"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onBeforeMountComponent(e._debugID,e._currentElement,s);var c=e.mountComponent(n,r,a,u,s);return e._currentElement&&null!=e._currentElement.ref&&n.getReactMountReady().enqueue(o,e),"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onMountComponent(e._debugID),c},getHostNode:function(e){return e.getHostNode()},unmountComponent:function(e,n){"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onBeforeUnmountComponent(e._debugID),r.detachRefs(e,e._currentElement),e.unmountComponent(n),"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onUnmountComponent(e._debugID)},receiveComponent:function(e,n,a,u){var s=e._currentElement;if(n!==s||u!==e._context){"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onBeforeUpdateComponent(e._debugID,n);var c=r.shouldUpdateRefs(s,n);c&&r.detachRefs(e,s),e.receiveComponent(n,a,u),c&&e._currentElement&&null!=e._currentElement.ref&&a.getReactMountReady().enqueue(o,e),"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onUpdateComponent(e._debugID)}},performUpdateIfNecessary:function(e,n,o){if(e._updateBatchNumber!==o)return void("production"!==t.env.NODE_ENV&&a(null==e._updateBatchNumber||e._updateBatchNumber===o+1,"performUpdateIfNecessary: Unexpected batch number (current %s, pending %s)",o,e._updateBatchNumber));"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onBeforeUpdateComponent(e._debugID,e._currentElement),e.performUpdateIfNecessary(n),"production"!==t.env.NODE_ENV&&0!==e._debugID&&i.debugTool.onUpdateComponent(e._debugID)}};e.exports=u}).call(t,n(0))},function(e,t,n){"use strict";function o(e){if(h){var t=e.node,n=e.children;if(n.length)for(var o=0;o<n.length;o++)m(t,n[o],null);else null!=e.html?p(t,e.html):null!=e.text&&f(t,e.text)}}function r(e,t){e.parentNode.replaceChild(t.node,e),o(t)}function i(e,t){h?e.children.push(t):e.node.appendChild(t.node)}function a(e,t){h?e.html=t:p(e.node,t)}function u(e,t){h?e.text=t:f(e.node,t)}function s(){return this.node.nodeName}function c(e){return{node:e,children:[],html:null,text:null,toString:s}}var l=n(57),p=n(42),d=n(58),f=n(93),h="undefined"!=typeof document&&"number"==typeof document.documentMode||"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent&&/\bEdge\/\d/.test(navigator.userAgent),m=d(function(e,t,n){11===t.node.nodeType||1===t.node.nodeType&&"object"===t.node.nodeName.toLowerCase()&&(null==t.node.namespaceURI||t.node.namespaceURI===l.html)?(o(t),e.insertBefore(t.node,n)):(e.insertBefore(t.node,n),o(t))});c.insertTreeBefore=m,c.replaceChildWithTree=r,c.queueChild=i,c.queueHTML=a,c.queueText=u,e.exports=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){function o(){}var r=n(112),i=n(256),a=n(257),u=n(258),s=n(116),c=n(115);n.d(t,"createStore",function(){return r.b}),n.d(t,"combineReducers",function(){return i.a}),n.d(t,"bindActionCreators",function(){return a.a}),n.d(t,"applyMiddleware",function(){return u.a}),n.d(t,"compose",function(){return s.a}),"production"!==e.env.NODE_ENV&&"string"==typeof o.name&&"isCrushed"!==o.name&&Object(c.a)("You are currently using minified code outside of NODE_ENV === 'production'. This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) to ensure you have the correct code for your production build.")}.call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,t,n){var o=t.dispatchConfig.phasedRegistrationNames[n];return g(e,o)}function r(e,n,r){"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&y(e,"Dispatching inst must not be null");var i=o(e,r,n);i&&(r._dispatchListeners=m(r._dispatchListeners,i),r._dispatchInstances=m(r._dispatchInstances,e))}function i(e){e&&e.dispatchConfig.phasedRegistrationNames&&h.traverseTwoPhase(e._targetInst,r,e)}function a(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst,n=t?h.getParentInstance(t):null;h.traverseTwoPhase(n,r,e)}}function u(e,t,n){if(n&&n.dispatchConfig.registrationName){var o=n.dispatchConfig.registrationName,r=g(e,o);r&&(n._dispatchListeners=m(n._dispatchListeners,r),n._dispatchInstances=m(n._dispatchInstances,e))}}function s(e){e&&e.dispatchConfig.registrationName&&u(e._targetInst,null,e)}function c(e){v(e,i)}function l(e){v(e,a)}function p(e,t,n,o){h.traverseEnterLeave(n,o,u,e,t)}function d(e){v(e,s)}var f=n(31),h=n(51),m=n(85),v=n(86),y=n(3),g=f.getListener,E={accumulateTwoPhaseDispatches:c,accumulateTwoPhaseDispatchesSkipTarget:l,accumulateDirectDispatches:d,accumulateEnterLeaveDispatches:p};e.exports=E}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){return"button"===e||"input"===e||"select"===e||"textarea"===e}function r(e,t,n){switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":return!(!n.disabled||!o(t));default:return!1}}var i=n(4),a=n(39),u=n(51),s=n(52),c=n(85),l=n(86),p=n(2),d={},f=null,h=function(e,t){e&&(u.executeDispatchesInOrder(e,t),e.isPersistent()||e.constructor.release(e))},m=function(e){return h(e,!0)},v=function(e){return h(e,!1)},y=function(e){return"."+e._rootNodeID},g={injection:{injectEventPluginOrder:a.injectEventPluginOrder,injectEventPluginsByName:a.injectEventPluginsByName},putListener:function(e,n,o){"function"!=typeof o&&("production"!==t.env.NODE_ENV?p(!1,"Expected %s listener to be a function, instead got type %s",n,typeof o):i("94",n,typeof o));var r=y(e);(d[n]||(d[n]={}))[r]=o;var u=a.registrationNameModules[n];u&&u.didPutListener&&u.didPutListener(e,n,o)},getListener:function(e,t){var n=d[t];if(r(t,e._currentElement.type,e._currentElement.props))return null;var o=y(e);return n&&n[o]},deleteListener:function(e,t){var n=a.registrationNameModules[t];n&&n.willDeleteListener&&n.willDeleteListener(e,t);var o=d[t];if(o){delete o[y(e)]}},deleteAllListeners:function(e){var t=y(e);for(var n in d)if(d.hasOwnProperty(n)&&d[n][t]){var o=a.registrationNameModules[n];o&&o.willDeleteListener&&o.willDeleteListener(e,n),delete d[n][t]}},extractEvents:function(e,t,n,o){for(var r,i=a.plugins,u=0;u<i.length;u++){var s=i[u];if(s){var l=s.extractEvents(e,t,n,o);l&&(r=c(r,l))}}return r},enqueueEvents:function(e){e&&(f=c(f,e))},processEventQueue:function(e){var n=f;f=null,e?l(n,m):l(n,v),f&&("production"!==t.env.NODE_ENV?p(!1,"processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented."):i("95")),s.rethrowCaughtError()},__purge:function(){d={}},__getListenerBank:function(){return d}};e.exports=g}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(19),i=n(53),a={view:function(e){if(e.view)return e.view;var t=i(e);if(t.window===t)return t;var n=t.ownerDocument;return n?n.defaultView||n.parentWindow:window},detail:function(e){return e.detail||0}};r.augmentClass(o,a),e.exports=o},function(e,t,n){"use strict";var o={remove:function(e){e._reactInternalInstance=void 0},get:function(e){return e._reactInternalInstance},has:function(e){return void 0!==e._reactInternalInstance},set:function(e,t){e._reactInternalInstance=t}};e.exports=o},function(e,t,n){"use strict";t.__esModule=!0;var o=(t.addLeadingSlash=function(e){return"/"===e.charAt(0)?e:"/"+e},t.stripLeadingSlash=function(e){return"/"===e.charAt(0)?e.substr(1):e},t.hasBasename=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)});t.stripBasename=function(e,t){return o(e,t)?e.substr(t.length):e},t.stripTrailingSlash=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},t.parsePath=function(e){var t=e||"/",n="",o="",r=t.indexOf("#");-1!==r&&(o=t.substr(r),t=t.substr(0,r));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===o?"":o}},t.createPath=function(e){var t=e.pathname,n=e.search,o=e.hash,r=t||"/";return n&&"?"!==n&&(r+="?"===n.charAt(0)?n:"?"+n),o&&"#"!==o&&(r+="#"===o.charAt(0)?o:"#"+o),r}},function(e,t,n){"use strict";n.d(t,"a",function(){return o}),n.d(t,"f",function(){return r}),n.d(t,"c",function(){return i}),n.d(t,"e",function(){return a}),n.d(t,"g",function(){return u}),n.d(t,"d",function(){return s}),n.d(t,"b",function(){return c});var o=function(e){return"/"===e.charAt(0)?e:"/"+e},r=function(e){return"/"===e.charAt(0)?e.substr(1):e},i=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)},a=function(e,t){return i(e,t)?e.substr(t.length):e},u=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},s=function(e){var t=e||"/",n="",o="",r=t.indexOf("#");-1!==r&&(o=t.substr(r),t=t.substr(0,r));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===o?"":o}},c=function(e){var t=e.pathname,n=e.search,o=e.hash,r=t||"/";return n&&"?"!==n&&(r+="?"===n.charAt(0)?n:"?"+n),o&&"#"!==o&&(r+="#"===o.charAt(0)?o:"#"+o),r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.logged_in=function(e){return Boolean(e.session.current_user)},t.current_user_id=function(e){return e.session.current_user}},function(e,t,n){"use strict";(function(t){var n=!1;if("production"!==t.env.NODE_ENV)try{Object.defineProperty({},"x",{get:function(){}}),n=!0}catch(e){}e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var n={};"production"!==t.env.NODE_ENV&&Object.freeze(n),e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(){if(s)for(var e in c){var n=c[e],o=s.indexOf(e);if(o>-1||("production"!==t.env.NODE_ENV?u(!1,"EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.",e):a("96",e)),!l.plugins[o]){n.extractEvents||("production"!==t.env.NODE_ENV?u(!1,"EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.",e):a("97",e)),l.plugins[o]=n;var i=n.eventTypes;for(var p in i)r(i[p],n,p)||("production"!==t.env.NODE_ENV?u(!1,"EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.",p,e):a("98",p,e))}}}function r(e,n,o){l.eventNameDispatchConfigs.hasOwnProperty(o)&&("production"!==t.env.NODE_ENV?u(!1,"EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.",o):a("99",o)),l.eventNameDispatchConfigs[o]=e;var r=e.phasedRegistrationNames;if(r){for(var s in r)if(r.hasOwnProperty(s)){var c=r[s];i(c,n,o)}return!0}return!!e.registrationName&&(i(e.registrationName,n,o),!0)}function i(e,n,o){if(l.registrationNameModules[e]&&("production"!==t.env.NODE_ENV?u(!1,"EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.",e):a("100",e)),l.registrationNameModules[e]=n,l.registrationNameDependencies[e]=n.eventTypes[o].dependencies,"production"!==t.env.NODE_ENV){var r=e.toLowerCase();l.possibleRegistrationNames[r]=e,"onDoubleClick"===e&&(l.possibleRegistrationNames.ondblclick=e)}}var a=n(4),u=n(2),s=null,c={},l={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},possibleRegistrationNames:"production"!==t.env.NODE_ENV?{}:null,injectEventPluginOrder:function(e){s&&("production"!==t.env.NODE_ENV?u(!1,"EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React."):a("101")),s=Array.prototype.slice.call(e),o()},injectEventPluginsByName:function(e){var n=!1;for(var r in e)if(e.hasOwnProperty(r)){var i=e[r];c.hasOwnProperty(r)&&c[r]===i||(c[r]&&("production"!==t.env.NODE_ENV?u(!1,"EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.",r):a("102",r)),c[r]=i,n=!0)}n&&o()},getPluginModuleForEvent:function(e){var t=e.dispatchConfig;if(t.registrationName)return l.registrationNameModules[t.registrationName]||null;if(void 0!==t.phasedRegistrationNames){var n=t.phasedRegistrationNames;for(var o in n)if(n.hasOwnProperty(o)){var r=l.registrationNameModules[n[o]];if(r)return r}}return null},_resetEventPlugins:function(){s=null;for(var e in c)c.hasOwnProperty(e)&&delete c[e];l.plugins.length=0;var n=l.eventNameDispatchConfigs;for(var o in n)n.hasOwnProperty(o)&&delete n[o];var r=l.registrationNameModules;for(var i in r)r.hasOwnProperty(i)&&delete r[i];if("production"!==t.env.NODE_ENV){var a=l.possibleRegistrationNames;for(var u in a)a.hasOwnProperty(u)&&delete a[u]}}};e.exports=l}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(4),r=n(2),i={},a={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(e,n,i,a,u,s,c,l){this.isInTransaction()&&("production"!==t.env.NODE_ENV?r(!1,"Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction."):o("27"));var p,d;try{this._isInTransaction=!0,p=!0,this.initializeAll(0),d=e.call(n,i,a,u,s,c,l),p=!1}finally{try{if(p)try{this.closeAll(0)}catch(e){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return d},initializeAll:function(e){for(var t=this.transactionWrappers,n=e;n<t.length;n++){var o=t[n];try{this.wrapperInitData[n]=i,this.wrapperInitData[n]=o.initialize?o.initialize.call(this):null}finally{if(this.wrapperInitData[n]===i)try{this.initializeAll(n+1)}catch(e){}}}},closeAll:function(e){this.isInTransaction()||("production"!==t.env.NODE_ENV?r(!1,"Transaction.closeAll(): Cannot close transaction when none are open."):o("28"));for(var n=this.transactionWrappers,a=e;a<n.length;a++){var u,s=n[a],c=this.wrapperInitData[a];try{u=!0,c!==i&&s.close&&s.close.call(this,c),u=!1}finally{if(u)try{this.closeAll(a+1)}catch(e){}}}this.wrapperInitData.length=0}};e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(32),i=n(92),a=n(55),u={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:a,button:function(e){var t=e.button;return"which"in e?t:2===t?2:4===t?1:0},buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},pageX:function(e){return"pageX"in e?e.pageX:e.clientX+i.currentScrollLeft},pageY:function(e){return"pageY"in e?e.pageY:e.clientY+i.currentScrollTop}};r.augmentClass(o,u),e.exports=o},function(e,t,n){"use strict";var o,r=n(7),i=n(57),a=/^[ \r\n\t\f]/,u=/<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/,s=n(58),c=s(function(e,t){if(e.namespaceURI!==i.svg||"innerHTML"in e)e.innerHTML=t;else{o=o||document.createElement("div"),o.innerHTML="<svg>"+t+"</svg>";for(var n=o.firstChild;n.firstChild;)e.appendChild(n.firstChild)}});if(r.canUseDOM){var l=document.createElement("div");l.innerHTML=" ",""===l.innerHTML&&(c=function(e,t){if(e.parentNode&&e.parentNode.replaceChild(e,e),a.test(t)||"<"===t[0]&&u.test(t)){e.innerHTML=String.fromCharCode(65279)+t;var n=e.firstChild;1===n.data.length?e.removeChild(n):n.deleteData(0,1)}else e.innerHTML=t}),l=null}e.exports=c},function(e,t,n){"use strict";function o(e){var t=""+e,n=i.exec(t);if(!n)return t;var o,r="",a=0,u=0;for(a=n.index;a<t.length;a++){switch(t.charCodeAt(a)){case 34:o="&quot;";break;case 38:o="&amp;";break;case 39:o="&#x27;";break;case 60:o="&lt;";break;case 62:o="&gt;";break;default:continue}u!==a&&(r+=t.substring(u,a)),u=a+1,r+=o}return u!==a?r+t.substring(u,a):r}function r(e){return"boolean"==typeof e||"number"==typeof e?""+e:o(e)}var i=/["'&<>]/;e.exports=r},function(e,t,n){"use strict";function o(e){return Object.prototype.hasOwnProperty.call(e,m)||(e[m]=f++,p[e[m]]={}),p[e[m]]}var r,i=n(5),a=n(39),u=n(186),s=n(92),c=n(187),l=n(54),p={},d=!1,f=0,h={topAbort:"abort",topAnimationEnd:c("animationend")||"animationend",topAnimationIteration:c("animationiteration")||"animationiteration",topAnimationStart:c("animationstart")||"animationstart",topBlur:"blur",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topScroll:"scroll",topSeeked:"seeked",topSeeking:"seeking",topSelectionChange:"selectionchange",topStalled:"stalled",topSuspend:"suspend",topTextInput:"textInput",topTimeUpdate:"timeupdate",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topTransitionEnd:c("transitionend")||"transitionend",topVolumeChange:"volumechange",topWaiting:"waiting",topWheel:"wheel"},m="_reactListenersID"+String(Math.random()).slice(2),v=i({},u,{ReactEventListener:null,injection:{injectReactEventListener:function(e){e.setHandleTopLevel(v.handleTopLevel),v.ReactEventListener=e}},setEnabled:function(e){v.ReactEventListener&&v.ReactEventListener.setEnabled(e)},isEnabled:function(){return!(!v.ReactEventListener||!v.ReactEventListener.isEnabled())},listenTo:function(e,t){for(var n=t,r=o(n),i=a.registrationNameDependencies[e],u=0;u<i.length;u++){var s=i[u];r.hasOwnProperty(s)&&r[s]||("topWheel"===s?l("wheel")?v.ReactEventListener.trapBubbledEvent("topWheel","wheel",n):l("mousewheel")?v.ReactEventListener.trapBubbledEvent("topWheel","mousewheel",n):v.ReactEventListener.trapBubbledEvent("topWheel","DOMMouseScroll",n):"topScroll"===s?l("scroll",!0)?v.ReactEventListener.trapCapturedEvent("topScroll","scroll",n):v.ReactEventListener.trapBubbledEvent("topScroll","scroll",v.ReactEventListener.WINDOW_HANDLE):"topFocus"===s||"topBlur"===s?(l("focus",!0)?(v.ReactEventListener.trapCapturedEvent("topFocus","focus",n),v.ReactEventListener.trapCapturedEvent("topBlur","blur",n)):l("focusin")&&(v.ReactEventListener.trapBubbledEvent("topFocus","focusin",n),v.ReactEventListener.trapBubbledEvent("topBlur","focusout",n)),r.topBlur=!0,r.topFocus=!0):h.hasOwnProperty(s)&&v.ReactEventListener.trapBubbledEvent(s,h[s],n),r[s]=!0)}},trapBubbledEvent:function(e,t,n){return v.ReactEventListener.trapBubbledEvent(e,t,n)},trapCapturedEvent:function(e,t,n){return v.ReactEventListener.trapCapturedEvent(e,t,n)},supportsEventPageXY:function(){if(!document.createEvent)return!1;var e=document.createEvent("MouseEvent");return null!=e&&"pageX"in e},ensureScrollValueMonitoring:function(){if(void 0===r&&(r=v.supportsEventPageXY()),!r&&!d){var e=s.refreshScrollValues;v.ReactEventListener.monitorScrollValue(e),d=!0}}});e.exports=v},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(8),u=n.n(a),s=n(15),c=n.n(s),l=n(1),p=n.n(l),d=n(11),f=n.n(d),h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},m=function(e){function t(){var n,i,a;o(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=i=r(this,e.call.apply(e,[this].concat(s))),i.state={match:i.computeMatch(i.props.history.location.pathname)},a=n,r(i,a)}return i(t,e),t.prototype.getChildContext=function(){return{router:h({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,o=t.history;c()(null==n||1===p.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=o.listen(function(){e.setState({match:e.computeMatch(o.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){u()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?p.a.Children.only(e):null},t}(p.a.Component);m.propTypes={history:f.a.object.isRequired,children:f.a.node},m.contextTypes={router:f.a.object},m.childContextTypes={router:f.a.object.isRequired},t.a=m},function(e,t,n){"use strict";n.d(t,"a",function(){return u}),n.d(t,"b",function(){return s});var o=n(120),r=n(121),i=n(35),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},u=function(e,t,n,r){var u=void 0;"string"==typeof e?(u=Object(i.d)(e),u.state=t):(u=a({},e),void 0===u.pathname&&(u.pathname=""),u.search?"?"!==u.search.charAt(0)&&(u.search="?"+u.search):u.search="",u.hash?"#"!==u.hash.charAt(0)&&(u.hash="#"+u.hash):u.hash="",void 0!==t&&void 0===u.state&&(u.state=t));try{u.pathname=decodeURI(u.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+u.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(u.key=n),r?u.pathname?"/"!==u.pathname.charAt(0)&&(u.pathname=Object(o.default)(u.pathname,r.pathname)):u.pathname=r.pathname:u.pathname||(u.pathname="/"),u},s=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&Object(r.default)(e.state,t.state)}},function(e,t,n){"use strict";var o=n(273),r=n.n(o),i={},a=0,u=function(e,t){var n=""+t.end+t.strict+t.sensitive,o=i[n]||(i[n]={});if(o[e])return o[e];var u=[],s=r()(e,u,t),c={re:s,keys:u};return a<1e4&&(o[e]=c,a++),c},s=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof t&&(t={path:t});var n=t,o=n.path,r=void 0===o?"/":o,i=n.exact,a=void 0!==i&&i,s=n.strict,c=void 0!==s&&s,l=n.sensitive,p=void 0!==l&&l,d=u(r,{end:a,strict:c,sensitive:p}),f=d.re,h=d.keys,m=f.exec(e);if(!m)return null;var v=m[0],y=m.slice(1),g=e===v;return a&&!g?null:{path:r,url:"/"===r&&""===v?"/":v,isExact:g,params:h.reduce(function(e,t,n){return e[t.name]=y[n],e},{})}};t.a=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=t.RECEIVE_MAIN_CONTENT_LOADING="RECEIVE_MAIN_CONTENT_LOADING",r=t.RECEIVE_MAIN_CONTENT_LOADED="RECEIVE_MAIN_CONTENT_LOADED";t.receiveMainContentLoaded=function(){return{type:r}},t.receiveMainContentLoading=function(){return{type:o}}},function(e,t,n){"use strict";(function(t){var n=function(){};if("production"!==t.env.NODE_ENV){var o=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];var r=0,i="Warning: "+e.replace(/%s/g,function(){return n[r++]});"undefined"!=typeof console&&console.warn(i);try{throw new Error(i)}catch(e){}};n=function(e,t){if(void 0===t)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(!e){for(var n=arguments.length,r=Array(n>2?n-2:0),i=2;i<n;i++)r[i-2]=arguments[i];o.apply(void 0,[t].concat(r))}}}e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";(function(t){function o(e){return"topMouseUp"===e||"topTouchEnd"===e||"topTouchCancel"===e}function r(e){return"topMouseMove"===e||"topTouchMove"===e}function i(e){return"topMouseDown"===e||"topTouchStart"===e}function a(e,t,n,o){var r=e.type||"unknown-event";e.currentTarget=b.getNodeFromInstance(o),t?v.invokeGuardedCallbackWithCatch(r,n,e):v.invokeGuardedCallback(r,n,e),e.currentTarget=null}function u(e,n){var o=e._dispatchListeners,r=e._dispatchInstances;if("production"!==t.env.NODE_ENV&&h(e),Array.isArray(o))for(var i=0;i<o.length&&!e.isPropagationStopped();i++)a(e,n,o[i],r[i]);else o&&a(e,n,o,r);e._dispatchListeners=null,e._dispatchInstances=null}function s(e){var n=e._dispatchListeners,o=e._dispatchInstances;if("production"!==t.env.NODE_ENV&&h(e),Array.isArray(n)){for(var r=0;r<n.length&&!e.isPropagationStopped();r++)if(n[r](e,o[r]))return o[r]}else if(n&&n(e,o))return o;return null}function c(e){var t=s(e);return e._dispatchInstances=null,e._dispatchListeners=null,t}function l(e){"production"!==t.env.NODE_ENV&&h(e);var n=e._dispatchListeners,o=e._dispatchInstances;Array.isArray(n)&&("production"!==t.env.NODE_ENV?y(!1,"executeDirectDispatch(...): Invalid `event`."):m("103")),e.currentTarget=n?b.getNodeFromInstance(o):null;var r=n?n(e):null;return e.currentTarget=null,e._dispatchListeners=null,e._dispatchInstances=null,r}function p(e){return!!e._dispatchListeners}var d,f,h,m=n(4),v=n(52),y=n(2),g=n(3),E={injectComponentTree:function(e){d=e,"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&g(e&&e.getNodeFromInstance&&e.getInstanceFromNode,"EventPluginUtils.injection.injectComponentTree(...): Injected module is missing getNodeFromInstance or getInstanceFromNode.")},injectTreeTraversal:function(e){f=e,"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&g(e&&e.isAncestor&&e.getLowestCommonAncestor,"EventPluginUtils.injection.injectTreeTraversal(...): Injected module is missing isAncestor or getLowestCommonAncestor.")}};"production"!==t.env.NODE_ENV&&(h=function(e){var n=e._dispatchListeners,o=e._dispatchInstances,r=Array.isArray(n),i=r?n.length:n?1:0,a=Array.isArray(o),u=a?o.length:o?1:0;"production"!==t.env.NODE_ENV&&g(a===r&&u===i,"EventPluginUtils: Invalid `event`.")});var b={isEndish:o,isMoveish:r,isStartish:i,executeDirectDispatch:l,executeDispatchesInOrder:u,executeDispatchesInOrderStopAtTrue:c,hasDispatches:p,getInstanceFromNode:function(e){return d.getInstanceFromNode(e)},getNodeFromInstance:function(e){return d.getNodeFromInstance(e)},isAncestor:function(e,t){return f.isAncestor(e,t)},getLowestCommonAncestor:function(e,t){return f.getLowestCommonAncestor(e,t)},getParentInstance:function(e){return f.getParentInstance(e)},traverseTwoPhase:function(e,t,n){return f.traverseTwoPhase(e,t,n)},traverseEnterLeave:function(e,t,n,o,r){return f.traverseEnterLeave(e,t,n,o,r)},injection:E};e.exports=b}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function n(e,t,n){try{t(n)}catch(e){null===o&&(o=e)}}var o=null,r={invokeGuardedCallback:n,invokeGuardedCallbackWithCatch:n,rethrowCaughtError:function(){if(o){var e=o;throw o=null,e}}};if("production"!==t.env.NODE_ENV&&"undefined"!=typeof window&&"function"==typeof window.dispatchEvent&&"undefined"!=typeof document&&"function"==typeof document.createEvent){var i=document.createElement("react");r.invokeGuardedCallback=function(e,t,n){var o=t.bind(null,n),r="react-"+e;i.addEventListener(r,o,!1);var a=document.createEvent("Event");a.initEvent(r,!1,!1),i.dispatchEvent(a),i.removeEventListener(r,o,!1)}}e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";function o(e){var t=e.target||e.srcElement||window;return t.correspondingUseElement&&(t=t.correspondingUseElement),3===t.nodeType?t.parentNode:t}e.exports=o},function(e,t,n){"use strict";/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function o(e,t){if(!i.canUseDOM||t&&!("addEventListener"in document))return!1;var n="on"+e,o=n in document;if(!o){var a=document.createElement("div");a.setAttribute(n,"return;"),o="function"==typeof a[n]}return!o&&r&&"wheel"===e&&(o=document.implementation.hasFeature("Events.wheel","3.0")),o}var r,i=n(7);i.canUseDOM&&(r=document.implementation&&document.implementation.hasFeature&&!0!==document.implementation.hasFeature("","")),e.exports=o},function(e,t,n){"use strict";function o(e){var t=this,n=t.nativeEvent;if(n.getModifierState)return n.getModifierState(e);var o=i[e];return!!o&&!!n[o]}function r(e){return o}var i={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};e.exports=r},function(e,t,n){"use strict";(function(t){function o(e,t){return Array.isArray(t)&&(t=t[1]),t?t.nextSibling:e.firstChild}function r(e,t,n){l.insertTreeBefore(e,t,n)}function i(e,t,n){Array.isArray(t)?u(e,t[0],t[1],n):y(e,t,n)}function a(e,t){if(Array.isArray(t)){var n=t[1];t=t[0],s(e,t,n),e.removeChild(n)}e.removeChild(t)}function u(e,t,n,o){for(var r=t;;){var i=r.nextSibling;if(y(e,r,o),r===n)break;r=i}}function s(e,t,n){for(;;){var o=t.nextSibling;if(o===n)break;e.removeChild(o)}}function c(e,n,o){var r=e.parentNode,i=e.nextSibling;i===n?o&&y(r,document.createTextNode(o),i):o?(v(i,o),s(r,i,n)):s(r,e,n),"production"!==t.env.NODE_ENV&&f.debugTool.onHostOperation({instanceID:d.getInstanceFromNode(e)._debugID,type:"replace text",payload:o})}var l=n(28),p=n(171),d=n(6),f=n(14),h=n(58),m=n(42),v=n(93),y=h(function(e,t,n){e.insertBefore(t,n)}),g=p.dangerouslyReplaceNodeWithMarkup;"production"!==t.env.NODE_ENV&&(g=function(e,t,n){if(p.dangerouslyReplaceNodeWithMarkup(e,t),0!==n._debugID)f.debugTool.onHostOperation({instanceID:n._debugID,type:"replace with",payload:t.toString()});else{var o=d.getInstanceFromNode(t.node);0!==o._debugID&&f.debugTool.onHostOperation({instanceID:o._debugID,type:"mount",payload:t.toString()})}});var E={dangerouslyReplaceNodeWithMarkup:g,replaceDelimitedText:c,processUpdates:function(e,n){if("production"!==t.env.NODE_ENV)var u=d.getInstanceFromNode(e)._debugID;for(var s=0;s<n.length;s++){var c=n[s];switch(c.type){case"INSERT_MARKUP":r(e,c.content,o(e,c.afterNode)),"production"!==t.env.NODE_ENV&&f.debugTool.onHostOperation({instanceID:u,type:"insert child",payload:{toIndex:c.toIndex,content:c.content.toString()}});break;case"MOVE_EXISTING":i(e,c.fromNode,o(e,c.afterNode)),"production"!==t.env.NODE_ENV&&f.debugTool.onHostOperation({instanceID:u,type:"move child",payload:{fromIndex:c.fromIndex,toIndex:c.toIndex}});break;case"SET_MARKUP":m(e,c.content),"production"!==t.env.NODE_ENV&&f.debugTool.onHostOperation({instanceID:u,type:"replace children",payload:c.content.toString()});break;case"TEXT_CONTENT":v(e,c.content),"production"!==t.env.NODE_ENV&&f.debugTool.onHostOperation({instanceID:u,type:"replace text",payload:c.content.toString()});break;case"REMOVE_NODE":a(e,c.fromNode),"production"!==t.env.NODE_ENV&&f.debugTool.onHostOperation({instanceID:u,type:"remove child",payload:{fromIndex:c.fromIndex}})}}}};e.exports=E}).call(t,n(0))},function(e,t,n){"use strict";var o={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};e.exports=o},function(e,t,n){"use strict";var o=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,o,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,r)})}:e};e.exports=o},function(e,t,n){"use strict";(function(t){function o(e){null!=e.checkedLink&&null!=e.valueLink&&("production"!==t.env.NODE_ENV?d(!1,"Cannot provide a checkedLink and a valueLink. If you want to use checkedLink, you probably don't want to use valueLink and vice versa."):u("87"))}function r(e){o(e),(null!=e.value||null!=e.onChange)&&("production"!==t.env.NODE_ENV?d(!1,"Cannot provide a valueLink and a value or onChange event. If you want to use value or onChange, you probably don't want to use valueLink."):u("88"))}function i(e){o(e),(null!=e.checked||null!=e.onChange)&&("production"!==t.env.NODE_ENV?d(!1,"Cannot provide a checkedLink and a checked property or onChange event. If you want to use checked or onChange, you probably don't want to use checkedLink"):u("89"))}function a(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""}var u=n(4),s=n(97),c=n(82),l=n(25),p=c(l.isValidElement),d=n(2),f=n(3),h={button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0},m={value:function(e,t,n){return!e[t]||h[e.type]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(e,t,n){return!e[t]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:p.func},v={},y={checkPropTypes:function(e,n,o){for(var r in m){if(m.hasOwnProperty(r))var i=m[r](n,r,e,"prop",null,s);if(i instanceof Error&&!(i.message in v)){v[i.message]=!0;var u=a(o);"production"!==t.env.NODE_ENV&&f(!1,"Failed form propType: %s%s",i.message,u)}}},getValue:function(e){return e.valueLink?(r(e),e.valueLink.value):e.value},getChecked:function(e){return e.checkedLink?(i(e),e.checkedLink.value):e.checked},executeOnChange:function(e,t){return e.valueLink?(r(e),e.valueLink.requestChange(t.target.value)):e.checkedLink?(i(e),e.checkedLink.requestChange(t.target.checked)):e.onChange?e.onChange.call(void 0,t):void 0}};e.exports=y}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(4),r=n(2),i=!1,a={replaceNodeWithMarkup:null,processChildrenUpdates:null,injection:{injectEnvironment:function(e){i&&("production"!==t.env.NODE_ENV?r(!1,"ReactCompositeComponent: injectEnvironment() can only be called once."):o("104")),a.replaceNodeWithMarkup=e.replaceNodeWithMarkup,a.processChildrenUpdates=e.processChildrenUpdates,i=!0}}};e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function r(e,t){if(o(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var a=0;a<n.length;a++)if(!i.call(t,n[a])||!o(e[n[a]],t[n[a]]))return!1;return!0}var i=Object.prototype.hasOwnProperty;e.exports=r},function(e,t,n){"use strict";function o(e,t){var n=null===e||!1===e,o=null===t||!1===t;if(n||o)return n===o;var r=typeof e,i=typeof t;return"string"===r||"number"===r?"string"===i||"number"===i:"object"===i&&e.type===t.type&&e.key===t.key}e.exports=o},function(e,t,n){"use strict";function o(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function r(e){var t=/(=0|=2)/g,n={"=0":"=","=2":":"};return(""+("."===e[0]&&"$"===e[1]?e.substring(2):e.substring(1))).replace(t,function(e){return n[e]})}var i={escape:o,unescape:r};e.exports=i},function(e,t,n){"use strict";(function(t){function o(e){l.enqueueUpdate(e)}function r(e){var t=typeof e;if("object"!==t)return t;var n=e.constructor&&e.constructor.name||t,o=Object.keys(e);return o.length>0&&o.length<20?n+" (keys: "+o.join(", ")+")":n}function i(e,n){var o=s.get(e);if(!o){if("production"!==t.env.NODE_ENV){var r=e.constructor;"production"!==t.env.NODE_ENV&&d(!n,"%s(...): Can only update a mounted or mounting component. This usually means you called %s() on an unmounted component. This is a no-op. Please check the code for the %s component.",n,n,r&&(r.displayName||r.name)||"ReactClass")}return null}return"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&d(null==u.current,"%s(...): Cannot update during an existing state transition (such as within `render` or another component's constructor). Render methods should be a pure function of props and state; constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`.",n),o}var a=n(4),u=n(17),s=n(33),c=n(14),l=n(18),p=n(2),d=n(3),f={isMounted:function(e){if("production"!==t.env.NODE_ENV){var n=u.current;null!==n&&("production"!==t.env.NODE_ENV&&d(n._warnedAboutRefsInRender,"%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.",n.getName()||"A component"),n._warnedAboutRefsInRender=!0)}var o=s.get(e);return!!o&&!!o._renderedComponent},enqueueCallback:function(e,t,n){f.validateCallback(t,n);var r=i(e);if(!r)return null;r._pendingCallbacks?r._pendingCallbacks.push(t):r._pendingCallbacks=[t],o(r)},enqueueCallbackInternal:function(e,t){e._pendingCallbacks?e._pendingCallbacks.push(t):e._pendingCallbacks=[t],o(e)},enqueueForceUpdate:function(e){var t=i(e,"forceUpdate");t&&(t._pendingForceUpdate=!0,o(t))},enqueueReplaceState:function(e,t,n){var r=i(e,"replaceState");r&&(r._pendingStateQueue=[t],r._pendingReplaceState=!0,void 0!==n&&null!==n&&(f.validateCallback(n,"replaceState"),r._pendingCallbacks?r._pendingCallbacks.push(n):r._pendingCallbacks=[n]),o(r))},enqueueSetState:function(e,n){"production"!==t.env.NODE_ENV&&(c.debugTool.onSetState(),"production"!==t.env.NODE_ENV&&d(null!=n,"setState(...): You passed an undefined or null state object; instead, use forceUpdate()."));var r=i(e,"setState");if(r){(r._pendingStateQueue||(r._pendingStateQueue=[])).push(n),o(r)}},enqueueElementInternal:function(e,t,n){e._pendingElement=t,e._context=n,o(e)},validateCallback:function(e,n){e&&"function"!=typeof e&&("production"!==t.env.NODE_ENV?p(!1,"%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.",n,r(e)):a("122",n,r(e)))}};e.exports=f}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(5),r=n(13),i=n(3),a=r;if("production"!==t.env.NODE_ENV){var u=["address","applet","area","article","aside","base","basefont","bgsound","blockquote","body","br","button","caption","center","col","colgroup","dd","details","dir","div","dl","dt","embed","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","iframe","img","input","isindex","li","link","listing","main","marquee","menu","menuitem","meta","nav","noembed","noframes","noscript","object","ol","p","param","plaintext","pre","script","section","select","source","style","summary","table","tbody","td","template","textarea","tfoot","th","thead","title","tr","track","ul","wbr","xmp"],s=["applet","caption","html","table","td","th","marquee","object","template","foreignObject","desc","title"],c=s.concat(["button"]),l=["dd","dt","li","option","optgroup","p","rp","rt"],p={current:null,formTag:null,aTagInScope:null,buttonTagInScope:null,nobrTagInScope:null,pTagInButtonScope:null,listItemTagAutoclosing:null,dlItemTagAutoclosing:null},d=function(e,t,n){var r=o({},e||p),i={tag:t,instance:n};return-1!==s.indexOf(t)&&(r.aTagInScope=null,r.buttonTagInScope=null,r.nobrTagInScope=null),-1!==c.indexOf(t)&&(r.pTagInButtonScope=null),-1!==u.indexOf(t)&&"address"!==t&&"div"!==t&&"p"!==t&&(r.listItemTagAutoclosing=null,r.dlItemTagAutoclosing=null),r.current=i,"form"===t&&(r.formTag=i),"a"===t&&(r.aTagInScope=i),"button"===t&&(r.buttonTagInScope=i),"nobr"===t&&(r.nobrTagInScope=i),"p"===t&&(r.pTagInButtonScope=i),"li"===t&&(r.listItemTagAutoclosing=i),"dd"!==t&&"dt"!==t||(r.dlItemTagAutoclosing=i),r},f=function(e,t){switch(t){case"select":return"option"===e||"optgroup"===e||"#text"===e;case"optgroup":return"option"===e||"#text"===e;case"option":return"#text"===e;case"tr":return"th"===e||"td"===e||"style"===e||"script"===e||"template"===e;case"tbody":case"thead":case"tfoot":return"tr"===e||"style"===e||"script"===e||"template"===e;case"colgroup":return"col"===e||"template"===e;case"table":return"caption"===e||"colgroup"===e||"tbody"===e||"tfoot"===e||"thead"===e||"style"===e||"script"===e||"template"===e;case"head":return"base"===e||"basefont"===e||"bgsound"===e||"link"===e||"meta"===e||"title"===e||"noscript"===e||"noframes"===e||"style"===e||"script"===e||"template"===e;case"html":return"head"===e||"body"===e;case"#document":return"html"===e}switch(e){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":return"h1"!==t&&"h2"!==t&&"h3"!==t&&"h4"!==t&&"h5"!==t&&"h6"!==t;case"rp":case"rt":return-1===l.indexOf(t);case"body":case"caption":case"col":case"colgroup":case"frame":case"head":case"html":case"tbody":case"td":case"tfoot":case"th":case"thead":case"tr":return null==t}return!0},h=function(e,t){switch(e){case"address":case"article":case"aside":case"blockquote":case"center":case"details":case"dialog":case"dir":case"div":case"dl":case"fieldset":case"figcaption":case"figure":case"footer":case"header":case"hgroup":case"main":case"menu":case"nav":case"ol":case"p":case"section":case"summary":case"ul":case"pre":case"listing":case"table":case"hr":case"xmp":case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":return t.pTagInButtonScope;case"form":return t.formTag||t.pTagInButtonScope;case"li":return t.listItemTagAutoclosing;case"dd":case"dt":return t.dlItemTagAutoclosing;case"button":return t.buttonTagInScope;case"a":return t.aTagInScope;case"nobr":return t.nobrTagInScope}return null},m=function(e){if(!e)return[];var t=[];do{t.push(e)}while(e=e._currentElement._owner);return t.reverse(),t},v={};a=function(e,n,o,r){r=r||p;var a=r.current,u=a&&a.tag;null!=n&&("production"!==t.env.NODE_ENV&&i(null==e,"validateDOMNesting: when childText is passed, childTag should be null"),e="#text");var s=f(e,u)?null:a,c=s?null:h(e,r),l=s||c;if(l){var d,y=l.tag,g=l.instance,E=o&&o._currentElement._owner,b=g&&g._currentElement._owner,_=m(E),O=m(b),N=Math.min(_.length,O.length),C=-1;for(d=0;d<N&&_[d]===O[d];d++)C=d;var w=_.slice(C+1).map(function(e){return e.getName()||"(unknown)"}),k=O.slice(C+1).map(function(e){return e.getName()||"(unknown)"}),T=[].concat(-1!==C?_[C].getName()||"(unknown)":[],k,y,c?["..."]:[],w,e).join(" > "),D=!!s+"|"+e+"|"+y+"|"+T;if(v[D])return;v[D]=!0;var P=e,S="";if("#text"===e?/\S/.test(n)?P="Text nodes":(P="Whitespace text nodes",S=" Make sure you don't have any extra whitespace between tags on each line of your source code."):P="<"+e+">",s){var x="";"table"===y&&"tr"===e&&(x+=" Add a <tbody> to your code to match the DOM tree generated by the browser."),"production"!==t.env.NODE_ENV&&i(!1,"validateDOMNesting(...): %s cannot appear as a child of <%s>.%s See %s.%s",P,y,S,T,x)}else"production"!==t.env.NODE_ENV&&i(!1,"validateDOMNesting(...): %s cannot appear as a descendant of <%s>. See %s.",P,y,T)}},a.updatedAncestorInfo=d,a.isTagValidInContext=function(e,t){t=t||p;var n=t.current,o=n&&n.tag;return f(e,o)&&!h(e,t)}}e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";function o(e){var t,n=e.keyCode;return"charCode"in e?0===(t=e.charCode)&&13===n&&(t=13):t=n,t>=32||13===t?t:0}e.exports=o},function(e,t,n){"use strict";function o(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e);try{throw new Error(e)}catch(e){}}t.a=o},function(e,t,n){"use strict";function o(e){if(!Object(a.a)(e)||Object(r.a)(e)!=u)return!1;var t=Object(i.a)(e);if(null===t)return!0;var n=p.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&l.call(n)==d}var r=n(244),i=n(249),a=n(251),u="[object Object]",s=Function.prototype,c=Object.prototype,l=s.toString,p=c.hasOwnProperty,d=l.call(Object);t.a=o},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.locationsAreEqual=t.createLocation=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},i=n(120),a=o(i),u=n(121),s=o(u),c=n(34);t.createLocation=function(e,t,n,o){var i=void 0;"string"==typeof e?(i=(0,c.parsePath)(e),i.state=t):(i=r({},e),void 0===i.pathname&&(i.pathname=""),i.search?"?"!==i.search.charAt(0)&&(i.search="?"+i.search):i.search="",i.hash?"#"!==i.hash.charAt(0)&&(i.hash="#"+i.hash):i.hash="",void 0!==t&&void 0===i.state&&(i.state=t));try{i.pathname=decodeURI(i.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+i.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(i.key=n),o?i.pathname?"/"!==i.pathname.charAt(0)&&(i.pathname=(0,a.default)(i.pathname,o.pathname)):i.pathname=o.pathname:i.pathname||(i.pathname="/"),i},t.locationsAreEqual=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&(0,s.default)(e.state,t.state)}},function(e,t,n){"use strict";t.__esModule=!0;var o=n(8),r=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=null,t=function(t){return(0,r.default)(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,o,i){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof o?o(a,i):((0,r.default)(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),i(!0)):i(!1!==a)}else i(!0)},o=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return o.push(n),function(){t=!1,o=o.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];o.forEach(function(e){return e.apply(void 0,t)})}}};t.default=i},function(e,t,n){"use strict";var o=n(8),r=n.n(o),i=function(){var e=null,t=function(t){return r()(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,o,i){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof o?o(a,i):(r()(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),i(!0)):i(!1!==a)}else i(!0)},o=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return o.push(n),function(){t=!1,o=o.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];o.forEach(function(e){return e.apply(void 0,t)})}}};t.a=i},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(8),u=n.n(a),s=n(15),c=n.n(s),l=n(1),p=n.n(l),d=n(11),f=n.n(d),h=n(47),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},v=function(e){return 0===p.a.Children.count(e)},y=function(e){function t(){var n,i,a;o(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=i=r(this,e.call.apply(e,[this].concat(s))),i.state={match:i.computeMatch(i.props,i.context.router)},a=n,r(i,a)}return i(t,e),t.prototype.getChildContext=function(){return{router:m({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,o=e.location,r=e.path,i=e.strict,a=e.exact,u=e.sensitive;if(n)return n;c()(t,"You should not use <Route> or withRouter() outside a <Router>");var s=t.route,l=(o||s.location).pathname;return r?Object(h.a)(l,{path:r,strict:i,exact:a,sensitive:u}):s.match},t.prototype.componentWillMount=function(){u()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),u()(!(this.props.component&&this.props.children&&!v(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),u()(!(this.props.render&&this.props.children&&!v(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){u()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),u()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,o=t.component,r=t.render,i=this.context.router,a=i.history,u=i.route,s=i.staticContext,c=this.props.location||u.location,l={match:e,location:c,history:a,staticContext:s};return o?e?p.a.createElement(o,l):null:r?e?r(l):null:n?"function"==typeof n?n(l):v(n)?null:p.a.Children.only(n):null},t}(p.a.Component);y.propTypes={computedMatch:f.a.object,path:f.a.string,exact:f.a.bool,strict:f.a.bool,sensitive:f.a.bool,component:f.a.func,render:f.a.func,children:f.a.oneOfType([f.a.func,f.a.node]),location:f.a.object},y.contextTypes={router:f.a.shape({history:f.a.object.isRequired,route:f.a.object.isRequired,staticContext:f.a.object})},y.childContextTypes={router:f.a.object.isRequired},t.a=y},function(e,t,n){"use strict";var o=n(45);t.a=o.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.redirectToUser=t.ProtectedRoute=t.AuthRoute=void 0;var o=n(36),r=n(10),i=n(9),a=n(1),u=function(e){return e&&e.__esModule?e:{default:e}}(a),s=function(e){var t=e.component,n=e.path,o=e.loggedIn,i=e.current_user_id;return u.default.createElement(r.Route,{exact:!0,path:n,render:function(e){return o?u.default.createElement(r.Redirect,{to:"/users/"+i}):u.default.createElement(t,e)}})},c=function(e){var t=e.component,n=e.path,o=e.loggedIn;return u.default.createElement(r.Route,{exact:!0,path:n,render:function(e){return o?u.default.createElement(t,e):u.default.createElement(r.Redirect,{to:"/login"})}})},l=function(e){return{loggedIn:(0,o.logged_in)(e),current_user_id:(0,o.current_user_id)(e)}};t.AuthRoute=(0,r.withRouter)((0,i.connect)(l)(s)),t.ProtectedRoute=(0,r.withRouter)((0,i.connect)(l)(c)),t.redirectToUser=function(e){return function(){return location.hash="/users/"+e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveCommentsLoading=t.receiveCommentsLoaded=t.postCommentThunk=t.fetchCommentsThunk=t.receiveComments=t.RECEIVE_COMMENTS_LOADING=t.RECEIVE_COMMENTS_LOADED=t.RECEIVE_COMMENTS=void 0;var o=n(296),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(o),i=t.RECEIVE_COMMENTS="RECEIVE_COMMENTS",a=t.RECEIVE_COMMENTS_LOADED="RECEIVE_COMMENTS_LOADED",u=t.RECEIVE_COMMENTS_LOADING="RECEIVE_COMMENTS_LOADING",s=t.receiveComments=function(e){return{type:i,payload:e}},c=(t.fetchCommentsThunk=function(e){return function(t){return r.fetchComments(e).then(function(e){t(s(e)),t(c())})}},t.postCommentThunk=function(e,t,n){return function(o){return r.postComment(e,{comment:t}).then(function(e){return n(e)})}},t.receiveCommentsLoaded=function(){return{type:a}});t.receiveCommentsLoading=function(){return{type:u}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=t.RECEIVE_PLAYLIST="RECEIVE_PLAYLIST",r=t.PAUSE_PLAYBACK="PAUSE_PLAYBACK",i=t.START_PLAYBACK="START_PLAYBACK";t.receivePlaylist=function(e){return{type:o,payload:e}},t.pausePlayback=function(){return{type:r}},t.startPlayback=function(){return{type:i}}},function(e,t,n){"use strict";(function(t){function o(e,t,n){this.props=e,this.context=t,this.refs=l,this.updater=n||s}function r(e,t,n){this.props=e,this.context=t,this.refs=l,this.updater=n||s}function i(){}var a=n(26),u=n(5),s=n(78),c=n(37),l=n(38),p=n(2),d=n(49);if(o.prototype.isReactComponent={},o.prototype.setState=function(e,n){"object"!=typeof e&&"function"!=typeof e&&null!=e&&("production"!==t.env.NODE_ENV?p(!1,"setState(...): takes an object of state variables to update or a function which returns an object of state variables."):a("85")),this.updater.enqueueSetState(this,e),n&&this.updater.enqueueCallback(this,n,"setState")},o.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this),e&&this.updater.enqueueCallback(this,e,"forceUpdate")},"production"!==t.env.NODE_ENV){var f={isMounted:["isMounted","Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],replaceState:["replaceState","Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]};for(var h in f)f.hasOwnProperty(h)&&function(e,t){c&&Object.defineProperty(o.prototype,e,{get:function(){d(!1,"%s(...) is deprecated in plain JavaScript React classes. %s",t[0],t[1])}})}(h,f[h])}i.prototype=o.prototype,r.prototype=new i,r.prototype.constructor=r,u(r.prototype,o.prototype),r.prototype.isPureReactComponent=!0,e.exports={Component:o,PureComponent:r}}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,n){if("production"!==t.env.NODE_ENV){var o=e.constructor;"production"!==t.env.NODE_ENV&&r(!1,"%s(...): Can only update a mounted or mounting component. This usually means you called %s() on an unmounted component. This is a no-op. Please check the code for the %s component.",n,n,o&&(o.displayName||o.name)||"ReactClass")}}var r=n(3),i={isMounted:function(e){return!1},enqueueCallback:function(e,t){},enqueueForceUpdate:function(e){o(e,"forceUpdate")},enqueueReplaceState:function(e,t){o(e,"replaceState")},enqueueSetState:function(e,t){o(e,"setState")}};e.exports=i}).call(t,n(0))},function(e,t,n){"use strict";var o="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;e.exports=o},function(e,t,n){"use strict";function o(e){var t=e&&(r&&e[r]||e[i]);if("function"==typeof t)return t}var r="function"==typeof Symbol&&Symbol.iterator,i="@@iterator";e.exports=o},function(e,t,n){"use strict";(function(t){function o(){if(c.current){var e=c.current.getName();if(e)return" Check the render method of `"+e+"`."}return""}function r(e){if(null!==e&&void 0!==e&&void 0!==e.__source){var t=e.__source;return" Check your code at "+t.fileName.replace(/^.*[\\\/]/,"")+":"+t.lineNumber+"."}return""}function i(e){var t=o();if(!t){var n="string"==typeof e?e:e.displayName||e.name;n&&(t=" Check the top-level render call using <"+n+">.")}return t}function a(e,n){if(e._store&&!e._store.validated&&null==e.key){e._store.validated=!0;var o=y.uniqueKey||(y.uniqueKey={}),r=i(n);if(!o[r]){o[r]=!0;var a="";e&&e._owner&&e._owner!==c.current&&(a=" It was passed a child from "+e._owner.getName()+"."),"production"!==t.env.NODE_ENV&&m(!1,'Each child in an array or iterator should have a unique "key" prop.%s%s See https://fb.me/react-warning-keys for more information.%s',r,a,l.getCurrentStackAddendum(e))}}}function u(e,t){if("object"==typeof e)if(Array.isArray(e))for(var n=0;n<e.length;n++){var o=e[n];p.isValidElement(o)&&a(o,t)}else if(p.isValidElement(e))e._store&&(e._store.validated=!0);else if(e){var r=h(e);if(r&&r!==e.entries)for(var i,u=r.call(e);!(i=u.next()).done;)p.isValidElement(i.value)&&a(i.value,t)}}function s(e){var n=e.type;if("function"==typeof n){var o=n.displayName||n.name;n.propTypes&&d(n.propTypes,e.props,"prop",o,e,null),"function"==typeof n.getDefaultProps&&"production"!==t.env.NODE_ENV&&m(n.getDefaultProps.isReactClassApproved,"getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.")}}var c=n(17),l=n(12),p=n(21),d=n(142),f=n(37),h=n(80),m=n(3),v=n(49),y={},g={createElement:function(e,n,i){var a="string"==typeof e||"function"==typeof e;if(!a&&"function"!=typeof e&&"string"!=typeof e){var c="";(void 0===e||"object"==typeof e&&null!==e&&0===Object.keys(e).length)&&(c+=" You likely forgot to export your component from the file it's defined in.");var d=r(n);c+=d||o(),c+=l.getCurrentStackAddendum();var f=null!==n&&void 0!==n&&void 0!==n.__source?n.__source:null;l.pushNonStandardWarningStack(!0,f),"production"!==t.env.NODE_ENV&&m(!1,"React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",null==e?e:typeof e,c),l.popNonStandardWarningStack()}var h=p.createElement.apply(this,arguments);if(null==h)return h;if(a)for(var v=2;v<arguments.length;v++)u(arguments[v],e);return s(h),h},createFactory:function(e){var n=g.createElement.bind(null,e);return n.type=e,"production"!==t.env.NODE_ENV&&f&&Object.defineProperty(n,"type",{enumerable:!1,get:function(){return v(!1,"Factory.type is deprecated. Access the class directly before passing it to createFactory."),Object.defineProperty(this,"type",{value:e}),e}}),n},cloneElement:function(e,t,n){for(var o=p.cloneElement.apply(this,arguments),r=2;r<arguments.length;r++)u(arguments[r],o.type);return s(o),o}};e.exports=g}).call(t,n(0))},function(e,t,n){"use strict";var o=n(83);e.exports=function(e){return o(e,!1)}},function(e,t,n){"use strict";(function(t){var o=n(13),r=n(2),i=n(3),a=n(50),u=n(146);e.exports=function(e,n){function s(e){var t=e&&(w&&e[w]||e[k]);if("function"==typeof t)return t}function c(e,t){return e===t?0!==e||1/e==1/t:e!==e&&t!==t}function l(e){this.message=e,this.stack=""}function p(e){function o(o,c,p,d,f,h,m){if(d=d||T,h=h||p,m!==a)if(n)r(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");else if("production"!==t.env.NODE_ENV&&"undefined"!=typeof console){var v=d+":"+p;!u[v]&&s<3&&(i(!1,"You are manually calling a React.PropTypes validation function for the `%s` prop on `%s`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.",h,d),u[v]=!0,s++)}return null==c[p]?o?new l(null===c[p]?"The "+f+" `"+h+"` is marked as required in `"+d+"`, but its value is `null`.":"The "+f+" `"+h+"` is marked as required in `"+d+"`, but its value is `undefined`."):null:e(c,p,d,f,h)}if("production"!==t.env.NODE_ENV)var u={},s=0;var c=o.bind(null,!1);return c.isRequired=o.bind(null,!0),c}function d(e){function t(t,n,o,r,i,a){var u=t[n];if(_(u)!==e)return new l("Invalid "+r+" `"+i+"` of type `"+O(u)+"` supplied to `"+o+"`, expected `"+e+"`.");return null}return p(t)}function f(e){function t(t,n,o,r,i){if("function"!=typeof e)return new l("Property `"+i+"` of component `"+o+"` has invalid PropType notation inside arrayOf.");var u=t[n];if(!Array.isArray(u)){return new l("Invalid "+r+" `"+i+"` of type `"+_(u)+"` supplied to `"+o+"`, expected an array.")}for(var s=0;s<u.length;s++){var c=e(u,s,o,r,i+"["+s+"]",a);if(c instanceof Error)return c}return null}return p(t)}function h(e){function t(t,n,o,r,i){if(!(t[n]instanceof e)){var a=e.name||T;return new l("Invalid "+r+" `"+i+"` of type `"+C(t[n])+"` supplied to `"+o+"`, expected instance of `"+a+"`.")}return null}return p(t)}function m(e){function n(t,n,o,r,i){for(var a=t[n],u=0;u<e.length;u++)if(c(a,e[u]))return null;return new l("Invalid "+r+" `"+i+"` of value `"+a+"` supplied to `"+o+"`, expected one of "+JSON.stringify(e)+".")}return Array.isArray(e)?p(n):("production"!==t.env.NODE_ENV&&i(!1,"Invalid argument supplied to oneOf, expected an instance of array."),o.thatReturnsNull)}function v(e){function t(t,n,o,r,i){if("function"!=typeof e)return new l("Property `"+i+"` of component `"+o+"` has invalid PropType notation inside objectOf.");var u=t[n],s=_(u);if("object"!==s)return new l("Invalid "+r+" `"+i+"` of type `"+s+"` supplied to `"+o+"`, expected an object.");for(var c in u)if(u.hasOwnProperty(c)){var p=e(u,c,o,r,i+"."+c,a);if(p instanceof Error)return p}return null}return p(t)}function y(e){function n(t,n,o,r,i){for(var u=0;u<e.length;u++){if(null==(0,e[u])(t,n,o,r,i,a))return null}return new l("Invalid "+r+" `"+i+"` supplied to `"+o+"`.")}if(!Array.isArray(e))return"production"!==t.env.NODE_ENV&&i(!1,"Invalid argument supplied to oneOfType, expected an instance of array."),o.thatReturnsNull;for(var r=0;r<e.length;r++){var u=e[r];if("function"!=typeof u)return i(!1,"Invalid argument supplid to oneOfType. Expected an array of check functions, but received %s at index %s.",N(u),r),o.thatReturnsNull}return p(n)}function g(e){function t(t,n,o,r,i){var u=t[n],s=_(u);if("object"!==s)return new l("Invalid "+r+" `"+i+"` of type `"+s+"` supplied to `"+o+"`, expected `object`.");for(var c in e){var p=e[c];if(p){var d=p(u,c,o,r,i+"."+c,a);if(d)return d}}return null}return p(t)}function E(t){switch(typeof t){case"number":case"string":case"undefined":return!0;case"boolean":return!t;case"object":if(Array.isArray(t))return t.every(E);if(null===t||e(t))return!0;var n=s(t);if(!n)return!1;var o,r=n.call(t);if(n!==t.entries){for(;!(o=r.next()).done;)if(!E(o.value))return!1}else for(;!(o=r.next()).done;){var i=o.value;if(i&&!E(i[1]))return!1}return!0;default:return!1}}function b(e,t){return"symbol"===e||("Symbol"===t["@@toStringTag"]||"function"==typeof Symbol&&t instanceof Symbol)}function _(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":b(t,e)?"symbol":t}function O(e){if(void 0===e||null===e)return""+e;var t=_(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}function N(e){var t=O(e);switch(t){case"array":case"object":return"an "+t;case"boolean":case"date":case"regexp":return"a "+t;default:return t}}function C(e){return e.constructor&&e.constructor.name?e.constructor.name:T}var w="function"==typeof Symbol&&Symbol.iterator,k="@@iterator",T="<<anonymous>>",D={array:d("array"),bool:d("boolean"),func:d("function"),number:d("number"),object:d("object"),string:d("string"),symbol:d("symbol"),any:function(){return p(o.thatReturnsNull)}(),arrayOf:f,element:function(){function t(t,n,o,r,i){var a=t[n];if(!e(a)){return new l("Invalid "+r+" `"+i+"` of type `"+_(a)+"` supplied to `"+o+"`, expected a single ReactElement.")}return null}return p(t)}(),instanceOf:h,node:function(){function e(e,t,n,o,r){return E(e[t])?null:new l("Invalid "+o+" `"+r+"` supplied to `"+n+"`, expected a ReactNode.")}return p(e)}(),objectOf:v,oneOf:m,oneOfType:y,shape:g};return l.prototype=Error.prototype,D.checkPropTypes=u,D.PropTypes=D,D}}).call(t,n(0))},function(e,t,n){"use strict";var o={hasCachedChildNodes:1};e.exports=o},function(e,t,n){"use strict";(function(t){function o(e,n){return null==n&&("production"!==t.env.NODE_ENV?i(!1,"accumulateInto(...): Accumulated items must not be null or undefined."):r("30")),null==e?n:Array.isArray(e)?Array.isArray(n)?(e.push.apply(e,n),e):(e.push(n),e):Array.isArray(n)?[e].concat(n):[e,n]}var r=n(4),i=n(2);e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}e.exports=o},function(e,t,n){"use strict";function o(){return!i&&r.canUseDOM&&(i="textContent"in document.documentElement?"textContent":"innerText"),i}var r=n(7),i=null;e.exports=o},function(e,t,n){"use strict";(function(t){function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=n(4),i=n(22),a=n(2),u=function(){function e(t){o(this,e),this._callbacks=null,this._contexts=null,this._arg=t}return e.prototype.enqueue=function(e,t){this._callbacks=this._callbacks||[],this._callbacks.push(e),this._contexts=this._contexts||[],this._contexts.push(t)},e.prototype.notifyAll=function(){var e=this._callbacks,n=this._contexts,o=this._arg;if(e&&n){e.length!==n.length&&("production"!==t.env.NODE_ENV?a(!1,"Mismatched list of contexts in callback queue"):r("24")),this._callbacks=null,this._contexts=null;for(var i=0;i<e.length;i++)e[i].call(n[i],o);e.length=0,n.length=0}},e.prototype.checkpoint=function(){return this._callbacks?this._callbacks.length:0},e.prototype.rollback=function(e){this._callbacks&&this._contexts&&(this._callbacks.length=e,this._contexts.length=e)},e.prototype.reset=function(){this._callbacks=null,this._contexts=null},e.prototype.destructor=function(){this.reset()},e}();e.exports=i.addPoolingTo(u)}).call(t,n(0))},function(e,t,n){"use strict";var o={logTopLevelRenders:!1};e.exports=o},function(e,t,n){"use strict";function o(e){var t=e.type,n=e.nodeName;return n&&"input"===n.toLowerCase()&&("checkbox"===t||"radio"===t)}function r(e){return e._wrapperState.valueTracker}function i(e,t){e._wrapperState.valueTracker=t}function a(e){delete e._wrapperState.valueTracker}function u(e){var t;return e&&(t=o(e)?""+e.checked:e.value),t}var s=n(6),c={_getTrackerFromNode:function(e){return r(s.getInstanceFromNode(e))},track:function(e){if(!r(e)){var t=s.getNodeFromInstance(e),n=o(t)?"checked":"value",u=Object.getOwnPropertyDescriptor(t.constructor.prototype,n),c=""+t[n];t.hasOwnProperty(n)||"function"!=typeof u.get||"function"!=typeof u.set||(Object.defineProperty(t,n,{enumerable:u.enumerable,configurable:!0,get:function(){return u.get.call(this)},set:function(e){c=""+e,u.set.call(this,e)}}),i(e,{getValue:function(){return c},setValue:function(e){c=""+e},stopTracking:function(){a(e),delete t[n]}}))}},updateValueIfChanged:function(e){if(!e)return!1;var t=r(e);if(!t)return c.track(e),!0;var n=t.getValue(),o=u(s.getNodeFromInstance(e));return o!==n&&(t.setValue(o),!0)},stopTracking:function(e){var t=r(e);t&&t.stopTracking()}};e.exports=c},function(e,t,n){"use strict";function o(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!r[e.type]:"textarea"===t}var r={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};e.exports=o},function(e,t,n){"use strict";var o={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(e){o.currentScrollLeft=e.x,o.currentScrollTop=e.y}};e.exports=o},function(e,t,n){"use strict";var o=n(7),r=n(43),i=n(42),a=function(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t};o.canUseDOM&&("textContent"in document.documentElement||(a=function(e,t){if(3===e.nodeType)return void(e.nodeValue=t);i(e,r(t))})),e.exports=a},function(e,t,n){"use strict";function o(e){try{e.focus()}catch(e){}}e.exports=o},function(e,t,n){"use strict";function o(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}var r={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},i=["Webkit","ms","Moz","O"];Object.keys(r).forEach(function(e){i.forEach(function(t){r[o(t,e)]=r[e]})});var a={background:{backgroundAttachment:!0,backgroundColor:!0,backgroundImage:!0,backgroundPositionX:!0,backgroundPositionY:!0,backgroundRepeat:!0},backgroundPosition:{backgroundPositionX:!0,backgroundPositionY:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0},outline:{outlineWidth:!0,outlineStyle:!0,outlineColor:!0}},u={isUnitlessNumber:r,shorthandPropertyExpansions:a};e.exports=u},function(e,t,n){"use strict";(function(t){function o(e){return!!d.hasOwnProperty(e)||!p.hasOwnProperty(e)&&(l.test(e)?(d[e]=!0,!0):(p[e]=!0,"production"!==t.env.NODE_ENV&&c(!1,"Invalid attribute name: `%s`",e),!1))}function r(e,t){return null==t||e.hasBooleanValue&&!t||e.hasNumericValue&&isNaN(t)||e.hasPositiveNumericValue&&t<1||e.hasOverloadedBooleanValue&&!1===t}var i=n(20),a=n(6),u=n(14),s=n(185),c=n(3),l=new RegExp("^["+i.ATTRIBUTE_NAME_START_CHAR+"]["+i.ATTRIBUTE_NAME_CHAR+"]*$"),p={},d={},f={createMarkupForID:function(e){return i.ID_ATTRIBUTE_NAME+"="+s(e)},setAttributeForID:function(e,t){e.setAttribute(i.ID_ATTRIBUTE_NAME,t)},createMarkupForRoot:function(){return i.ROOT_ATTRIBUTE_NAME+'=""'},setAttributeForRoot:function(e){e.setAttribute(i.ROOT_ATTRIBUTE_NAME,"")},createMarkupForProperty:function(e,t){var n=i.properties.hasOwnProperty(e)?i.properties[e]:null;if(n){if(r(n,t))return"";var o=n.attributeName;return n.hasBooleanValue||n.hasOverloadedBooleanValue&&!0===t?o+'=""':o+"="+s(t)}return i.isCustomAttribute(e)?null==t?"":e+"="+s(t):null},createMarkupForCustomAttribute:function(e,t){return o(e)&&null!=t?e+"="+s(t):""},setValueForProperty:function(e,n,o){var s=i.properties.hasOwnProperty(n)?i.properties[n]:null;if(s){var c=s.mutationMethod;if(c)c(e,o);else{if(r(s,o))return void this.deleteValueForProperty(e,n);if(s.mustUseProperty)e[s.propertyName]=o;else{var l=s.attributeName,p=s.attributeNamespace;p?e.setAttributeNS(p,l,""+o):s.hasBooleanValue||s.hasOverloadedBooleanValue&&!0===o?e.setAttribute(l,""):e.setAttribute(l,""+o)}}}else if(i.isCustomAttribute(n))return void f.setValueForAttribute(e,n,o);if("production"!==t.env.NODE_ENV){var d={};d[n]=o,u.debugTool.onHostOperation({instanceID:a.getInstanceFromNode(e)._debugID,type:"update attribute",payload:d})}},setValueForAttribute:function(e,n,r){if(o(n)&&(null==r?e.removeAttribute(n):e.setAttribute(n,""+r),"production"!==t.env.NODE_ENV)){var i={};i[n]=r,u.debugTool.onHostOperation({instanceID:a.getInstanceFromNode(e)._debugID,type:"update attribute",payload:i})}},deleteValueForAttribute:function(e,n){e.removeAttribute(n),"production"!==t.env.NODE_ENV&&u.debugTool.onHostOperation({instanceID:a.getInstanceFromNode(e)._debugID,type:"remove attribute",payload:n})},deleteValueForProperty:function(e,n){var o=i.properties.hasOwnProperty(n)?i.properties[n]:null;if(o){var r=o.mutationMethod;if(r)r(e,void 0);else if(o.mustUseProperty){var s=o.propertyName;o.hasBooleanValue?e[s]=!1:e[s]=""}else e.removeAttribute(o.attributeName)}else i.isCustomAttribute(n)&&e.removeAttribute(n);"production"!==t.env.NODE_ENV&&u.debugTool.onHostOperation({instanceID:a.getInstanceFromNode(e)._debugID,type:"remove attribute",payload:n})}};e.exports=f}).call(t,n(0))},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";(function(t){function o(){if(this._rootNodeID&&this._wrapperState.pendingUpdate){this._wrapperState.pendingUpdate=!1;var e=this._currentElement.props,t=c.getValue(e);null!=t&&a(this,Boolean(e.multiple),t)}}function r(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""}function i(e,n){var o=e._currentElement._owner;c.checkPropTypes("select",n,o),void 0===n.valueLink||f||("production"!==t.env.NODE_ENV&&d(!1,"`valueLink` prop on `select` is deprecated; set `value` and `onChange` instead."),f=!0);for(var i=0;i<m.length;i++){var a=m[i];if(null!=n[a]){var u=Array.isArray(n[a]);n.multiple&&!u?"production"!==t.env.NODE_ENV&&d(!1,"The `%s` prop supplied to <select> must be an array if `multiple` is true.%s",a,r(o)):!n.multiple&&u&&"production"!==t.env.NODE_ENV&&d(!1,"The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s",a,r(o))}}}function a(e,t,n){var o,r,i=l.getNodeFromInstance(e).options;if(t){for(o={},r=0;r<n.length;r++)o[""+n[r]]=!0;for(r=0;r<i.length;r++){var a=o.hasOwnProperty(i[r].value);i[r].selected!==a&&(i[r].selected=a)}}else{for(o=""+n,r=0;r<i.length;r++)if(i[r].value===o)return void(i[r].selected=!0);i.length&&(i[0].selected=!0)}}function u(e){var t=this._currentElement.props,n=c.executeOnChange(t,e);return this._rootNodeID&&(this._wrapperState.pendingUpdate=!0),p.asap(o,this),n}var s=n(5),c=n(59),l=n(6),p=n(18),d=n(3),f=!1,h=!1,m=["value","defaultValue"],v={getHostProps:function(e,t){return s({},t,{onChange:e._wrapperState.onChange,value:void 0})},mountWrapper:function(e,n){"production"!==t.env.NODE_ENV&&i(e,n);var o=c.getValue(n);e._wrapperState={pendingUpdate:!1,initialValue:null!=o?o:n.defaultValue,listeners:null,onChange:u.bind(e),wasMultiple:Boolean(n.multiple)},void 0===n.value||void 0===n.defaultValue||h||("production"!==t.env.NODE_ENV&&d(!1,"Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://fb.me/react-controlled-components"),h=!0)},getSelectValueContext:function(e){return e._wrapperState.initialValue},postUpdateWrapper:function(e){var t=e._currentElement.props;e._wrapperState.initialValue=void 0;var n=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=Boolean(t.multiple);var o=c.getValue(t);null!=o?(e._wrapperState.pendingUpdate=!1,a(e,Boolean(t.multiple),o)):n!==Boolean(t.multiple)&&(null!=t.defaultValue?a(e,Boolean(t.multiple),t.defaultValue):a(e,Boolean(t.multiple),t.multiple?[]:""))}};e.exports=v}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""}function r(e){return"function"==typeof e&&void 0!==e.prototype&&"function"==typeof e.prototype.mountComponent&&"function"==typeof e.prototype.receiveComponent}function i(e,n){var u;if(null===e||!1===e)u=c.create(i);else if("object"==typeof e){var s=e,m=s.type;if("function"!=typeof m&&"string"!=typeof m){var v="";"production"!==t.env.NODE_ENV&&(void 0===m||"object"==typeof m&&null!==m&&0===Object.keys(m).length)&&(v+=" You likely forgot to export your component from the file it's defined in."),v+=o(s._owner),"production"!==t.env.NODE_ENV?d(!1,"Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",null==m?m:typeof m,v):a("130",null==m?m:typeof m,v)}"string"==typeof s.type?u=l.createInternalComponent(s):r(s.type)?(u=new s.type(s),u.getHostNode||(u.getHostNode=u.getNativeNode)):u=new h(s)}else"string"==typeof e||"number"==typeof e?u=l.createInstanceForText(e):"production"!==t.env.NODE_ENV?d(!1,"Encountered invalid React node of type %s",typeof e):a("131",typeof e);return"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&f("function"==typeof u.mountComponent&&"function"==typeof u.receiveComponent&&"function"==typeof u.getHostNode&&"function"==typeof u.unmountComponent,"Only React Components can be mounted."),u._mountIndex=0,u._mountImage=null,"production"!==t.env.NODE_ENV&&(u._debugID=n?p():0),"production"!==t.env.NODE_ENV&&Object.preventExtensions&&Object.preventExtensions(u),u}var a=n(4),u=n(5),s=n(193),c=n(101),l=n(102),p=n(196),d=n(2),f=n(3),h=function(e){this.construct(e)};u(h.prototype,s,{_instantiateReactComponent:i}),e.exports=i}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(4),r=n(25),i=n(2),a={HOST:0,COMPOSITE:1,EMPTY:2,getType:function(e){return null===e||!1===e?a.EMPTY:r.isValidElement(e)?"function"==typeof e.type?a.COMPOSITE:a.HOST:void("production"!==t.env.NODE_ENV?i(!1,"Unexpected node: %s",e):o("26",e))}};e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";var o,r={injectEmptyComponentFactory:function(e){o=e}},i={create:function(e){return o(e)}};i.injection=r,e.exports=i},function(e,t,n){"use strict";(function(t){function o(e){return s||("production"!==t.env.NODE_ENV?u(!1,"There is no registered component for the tag %s",e.type):a("111",e.type)),new s(e)}function r(e){return new c(e)}function i(e){return e instanceof c}var a=n(4),u=n(2),s=null,c=null,l={injectGenericComponentClass:function(e){s=e},injectTextComponentClass:function(e){c=e}},p={createInternalComponent:o,createInstanceForText:r,isTextComponent:i,injection:l};e.exports=p}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,t){return e&&"object"==typeof e&&null!=e.key?p.escape(e.key):t.toString(36)}function r(e,n,i,v){var y=typeof e;if("undefined"!==y&&"boolean"!==y||(e=null),null===e||"string"===y||"number"===y||"object"===y&&e.$$typeof===s)return i(v,e,""===n?f+o(e,0):n),1;var g,E,b=0,_=""===n?f:n+h;if(Array.isArray(e))for(var O=0;O<e.length;O++)g=e[O],E=_+o(g,O),b+=r(g,E,i,v);else{var N=c(e);if(N){var C,w=N.call(e);if(N!==e.entries)for(var k=0;!(C=w.next()).done;)g=C.value,E=_+o(g,k++),b+=r(g,E,i,v);else{if("production"!==t.env.NODE_ENV){var T="";if(u.current){var D=u.current.getName();D&&(T=" Check the render method of `"+D+"`.")}"production"!==t.env.NODE_ENV&&d(m,"Using Maps as children is not yet fully supported. It is an experimental feature that might be removed. Convert it to a sequence / iterable of keyed ReactElements instead.%s",T),m=!0}for(;!(C=w.next()).done;){var P=C.value;P&&(g=P[1],E=_+p.escape(P[0])+h+o(g,0),b+=r(g,E,i,v))}}}else if("object"===y){var S="";if("production"!==t.env.NODE_ENV&&(S=" If you meant to render a collection of children, use an array instead or wrap the object using createFragment(object) from the React add-ons.",e._isReactElement&&(S=" It looks like you're using an element created by a different version of React. Make sure to use only one copy of React."),u.current)){var x=u.current.getName();x&&(S+=" Check the render method of `"+x+"`.")}var R=String(e);"production"!==t.env.NODE_ENV?l(!1,"Objects are not valid as a React child (found: %s).%s","[object Object]"===R?"object with keys {"+Object.keys(e).join(", ")+"}":R,S):a("31","[object Object]"===R?"object with keys {"+Object.keys(e).join(", ")+"}":R,S)}}return b}function i(e,t,n){return null==e?0:r(e,"",t,n)}var a=n(4),u=n(17),s=n(197),c=n(198),l=n(2),p=n(63),d=n(3),f=".",h=":",m=!1;e.exports=i}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(13),r={listen:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!1),{remove:function(){e.removeEventListener(t,n,!1)}}):e.attachEvent?(e.attachEvent("on"+t,n),{remove:function(){e.detachEvent("on"+t,n)}}):void 0},capture:function(e,n,r){return e.addEventListener?(e.addEventListener(n,r,!0),{remove:function(){e.removeEventListener(n,r,!0)}}):("production"!==t.env.NODE_ENV&&console.error("Attempted to listen to events during the capture phase on a browser that does not support the capture phase. Your application will not receive some events."),{remove:o})},registerDefault:function(){}};e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";function o(e){return i(document.documentElement,e)}var r=n(210),i=n(212),a=n(94),u=n(106),s={hasSelectionCapabilities:function(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&"text"===e.type||"textarea"===t||"true"===e.contentEditable)},getSelectionInformation:function(){var e=u();return{focusedElem:e,selectionRange:s.hasSelectionCapabilities(e)?s.getSelection(e):null}},restoreSelection:function(e){var t=u(),n=e.focusedElem,r=e.selectionRange;t!==n&&o(n)&&(s.hasSelectionCapabilities(n)&&s.setSelection(n,r),a(n))},getSelection:function(e){var t;if("selectionStart"in e)t={start:e.selectionStart,end:e.selectionEnd};else if(document.selection&&e.nodeName&&"input"===e.nodeName.toLowerCase()){var n=document.selection.createRange();n.parentElement()===e&&(t={start:-n.moveStart("character",-e.value.length),end:-n.moveEnd("character",-e.value.length)})}else t=r.getOffsets(e);return t||{start:0,end:0}},setSelection:function(e,t){var n=t.start,o=t.end;if(void 0===o&&(o=n),"selectionStart"in e)e.selectionStart=n,e.selectionEnd=Math.min(o,e.value.length);else if(document.selection&&e.nodeName&&"input"===e.nodeName.toLowerCase()){var i=e.createTextRange();i.collapse(!0),i.moveStart("character",n),i.moveEnd("character",o-n),i.select()}else r.setOffsets(e,t)}};e.exports=s},function(e,t,n){"use strict";function o(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}e.exports=o},function(e,t,n){"use strict";(function(t){function o(e,t){for(var n=Math.min(e.length,t.length),o=0;o<n;o++)if(e.charAt(o)!==t.charAt(o))return o;return e.length===t.length?-1:n}function r(e){return e?e.nodeType===F?e.documentElement:e.firstChild:null}function i(e){return e.getAttribute&&e.getAttribute(V)||""}function a(e,t,n,o,r){var i;if(C.logTopLevelRenders){var a=e._currentElement.props.child,u=a.type;i="React mount: "+("string"==typeof u?u:u.displayName||u.name),console.time(i)}var s=D.mountComponent(e,n,null,O(e,t),r,0);i&&console.timeEnd(i),e._renderedComponent._topLevelWrapper=e,Y._mountImageIntoNode(s,t,e,o,n)}function u(e,t,n,o){var r=S.ReactReconcileTransaction.getPooled(!n&&N.useCreateElement);r.perform(a,null,e,t,r,n,o),S.ReactReconcileTransaction.release(r)}function s(e,n,o){for("production"!==t.env.NODE_ENV&&k.debugTool.onBeginFlush(),D.unmountComponent(e,o),"production"!==t.env.NODE_ENV&&k.debugTool.onEndFlush(),n.nodeType===F&&(n=n.documentElement);n.lastChild;)n.removeChild(n.lastChild)}function c(e){var t=r(e);if(t){var n=_.getInstanceFromNode(t);return!(!n||!n._hostParent)}}function l(e){var t=r(e);return!(!t||!d(t)||_.getInstanceFromNode(t))}function p(e){return!(!e||e.nodeType!==L&&e.nodeType!==F&&e.nodeType!==B)}function d(e){return p(e)&&(e.hasAttribute(U)||e.hasAttribute(V))}function f(e){var t=r(e),n=t&&_.getInstanceFromNode(t);return n&&!n._hostParent?n:null}function h(e){var t=f(e);return t?t._hostContainerInfo._topLevelWrapper:null}var m=n(4),v=n(28),y=n(20),g=n(25),E=n(44),b=n(17),_=n(6),O=n(227),N=n(228),C=n(89),w=n(33),k=n(14),T=n(229),D=n(27),P=n(64),S=n(18),x=n(38),R=n(99),I=n(2),M=n(42),A=n(62),j=n(3),V=y.ID_ATTRIBUTE_NAME,U=y.ROOT_ATTRIBUTE_NAME,L=1,F=9,B=11,W={},H=1,q=function(){this.rootID=H++};q.prototype.isReactComponent={},"production"!==t.env.NODE_ENV&&(q.displayName="TopLevelWrapper"),q.prototype.render=function(){return this.props.child},q.isReactTopLevelWrapper=!0;var Y={TopLevelWrapper:q,_instancesByReactRootID:W,scrollMonitor:function(e,t){t()},_updateRootComponent:function(e,t,n,o,r){return Y.scrollMonitor(o,function(){P.enqueueElementInternal(e,t,n),r&&P.enqueueCallbackInternal(e,r)}),e},_renderNewRootComponent:function(e,n,o,r){"production"!==t.env.NODE_ENV&&j(null==b.current,"_renderNewRootComponent(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate. Check the render method of %s.",b.current&&b.current.getName()||"ReactCompositeComponent"),p(n)||("production"!==t.env.NODE_ENV?I(!1,"_registerComponent(...): Target container is not a DOM element."):m("37")),E.ensureScrollValueMonitoring();var i=R(e,!1);S.batchedUpdates(u,i,n,o,r);var a=i._instance.rootID;return W[a]=i,i},renderSubtreeIntoContainer:function(e,n,o,r){return null!=e&&w.has(e)||("production"!==t.env.NODE_ENV?I(!1,"parentComponent must be a valid React Component"):m("38")),Y._renderSubtreeIntoContainer(e,n,o,r)},_renderSubtreeIntoContainer:function(e,n,o,a){P.validateCallback(a,"ReactDOM.render"),g.isValidElement(n)||("production"!==t.env.NODE_ENV?I(!1,"ReactDOM.render(): Invalid component element.%s","string"==typeof n?" Instead of passing a string like 'div', pass React.createElement('div') or <div />.":"function"==typeof n?" Instead of passing a class like Foo, pass React.createElement(Foo) or <Foo />.":null!=n&&void 0!==n.props?" This may be caused by unintentionally loading two independent copies of React.":""):m("39","string"==typeof n?" Instead of passing a string like 'div', pass React.createElement('div') or <div />.":"function"==typeof n?" Instead of passing a class like Foo, pass React.createElement(Foo) or <Foo />.":null!=n&&void 0!==n.props?" This may be caused by unintentionally loading two independent copies of React.":"")),"production"!==t.env.NODE_ENV&&j(!o||!o.tagName||"BODY"!==o.tagName.toUpperCase(),"render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");var u,s=g.createElement(q,{child:n});if(e){var l=w.get(e);u=l._processChildContext(l._context)}else u=x;var p=h(o);if(p){var d=p._currentElement,f=d.props.child;if(A(f,n)){var v=p._renderedComponent.getPublicInstance(),y=a&&function(){a.call(v)};return Y._updateRootComponent(p,s,u,o,y),v}Y.unmountComponentAtNode(o)}var E=r(o),b=E&&!!i(E),_=c(o);if("production"!==t.env.NODE_ENV&&("production"!==t.env.NODE_ENV&&j(!_,"render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."),!b||E.nextSibling))for(var O=E;O;){if(i(O)){"production"!==t.env.NODE_ENV&&j(!1,"render(): Target node has markup rendered by React, but there are unrelated nodes as well. This is most commonly caused by white-space inserted around server-rendered markup.");break}O=O.nextSibling}var N=b&&!p&&!_,C=Y._renderNewRootComponent(s,o,N,u)._renderedComponent.getPublicInstance();return a&&a.call(C),C},render:function(e,t,n){return Y._renderSubtreeIntoContainer(null,e,t,n)},unmountComponentAtNode:function(e){"production"!==t.env.NODE_ENV&&j(null==b.current,"unmountComponentAtNode(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate. Check the render method of %s.",b.current&&b.current.getName()||"ReactCompositeComponent"),p(e)||("production"!==t.env.NODE_ENV?I(!1,"unmountComponentAtNode(...): Target container is not a DOM element."):m("40")),"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&j(!l(e),"unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");var n=h(e);if(!n){var o=c(e),r=1===e.nodeType&&e.hasAttribute(U);return"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&j(!o,"unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s",r?"You may have accidentally passed in a React root node instead of its container.":"Instead, have the parent component update its state and rerender in order to remove this component."),!1}return delete W[n._instance.rootID],S.batchedUpdates(s,n,e,!1),!0},_mountImageIntoNode:function(e,n,i,a,u){if(p(n)||("production"!==t.env.NODE_ENV?I(!1,"mountComponentIntoNode(...): Target container is not valid."):m("41")),a){var s=r(n);if(T.canReuseMarkup(e,s))return void _.precacheNode(i,s);var c=s.getAttribute(T.CHECKSUM_ATTR_NAME);s.removeAttribute(T.CHECKSUM_ATTR_NAME);var l=s.outerHTML;s.setAttribute(T.CHECKSUM_ATTR_NAME,c);var d=e;if("production"!==t.env.NODE_ENV){var f;n.nodeType===L?(f=document.createElement("div"),f.innerHTML=e,d=f.innerHTML):(f=document.createElement("iframe"),document.body.appendChild(f),f.contentDocument.write(e),d=f.contentDocument.documentElement.outerHTML,document.body.removeChild(f))}var h=o(d,l),y=" (client) "+d.substring(h-20,h+20)+"\n (server) "+l.substring(h-20,h+20);n.nodeType===F&&("production"!==t.env.NODE_ENV?I(!1,"You're trying to render a component to the document using server rendering but the checksum was invalid. This usually means you rendered a different component type or props on the client from the one on the server, or your render() methods are impure. React cannot handle this case due to cross-browser quirks by rendering at the document root. You should look for environment dependent code in your components and ensure the props are the same client and server side:\n%s",y):m("42",y)),"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&j(!1,"React attempted to reuse markup in a container but the checksum was invalid. This generally means that you are using server rendering and the markup generated on the server was not what the client was expecting. React injected new markup to compensate which works but you have lost many of the benefits of server rendering. Instead, figure out why the markup being generated is different on the client or server:\n%s",y)}if(n.nodeType===F&&("production"!==t.env.NODE_ENV?I(!1,"You're trying to render a component to the document but you didn't use server rendering. We can't do this without using server rendering due to cross-browser quirks. See ReactDOMServer.renderToString() for server rendering."):m("43")),u.useCreateElement){for(;n.lastChild;)n.removeChild(n.lastChild);v.insertTreeBefore(n,e,null)}else M(n,e),_.precacheNode(i,n.firstChild);if("production"!==t.env.NODE_ENV){var g=_.getInstanceFromNode(n.firstChild);0!==g._debugID&&k.debugTool.onHostOperation({instanceID:g._debugID,type:"mount",payload:e.toString()})}}};e.exports=Y}).call(t,n(0))},function(e,t,n){"use strict";function o(e){for(var t;(t=e._renderedNodeType)===r.COMPOSITE;)e=e._renderedComponent;return t===r.HOST?e._renderedComponent:t===r.EMPTY?null:void 0}var r=n(100);e.exports=o},function(e,t,n){"use strict";n.d(t,"b",function(){return i}),n.d(t,"a",function(){return a});var o=n(11),r=n.n(o),i=r.a.shape({trySubscribe:r.a.func.isRequired,tryUnsubscribe:r.a.func.isRequired,notifyNestedSubs:r.a.func.isRequired,isSubscribed:r.a.func.isRequired}),a=r.a.shape({subscribe:r.a.func.isRequired,dispatch:r.a.func.isRequired,getState:r.a.func.isRequired})},function(e,t,n){"use strict";(function(e){function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function u(){}function s(e,t){var n={run:function(o){try{var r=e(t.getState(),o);(r!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=r,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}function c(t){var n,c,l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=l.getDisplayName,b=void 0===d?function(e){return"ConnectAdvanced("+e+")"}:d,_=l.methodName,O=void 0===_?"connectAdvanced":_,N=l.renderCountProp,C=void 0===N?void 0:N,w=l.shouldHandleStateChanges,k=void 0===w||w,T=l.storeKey,D=void 0===T?"store":T,P=l.withRef,S=void 0!==P&&P,x=a(l,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),R=D+"Subscription",I=g++,M=(n={},n[D]=v.a,n[R]=v.b,n),A=(c={},c[R]=v.b,c);return function(n){f()("function"==typeof n,"You must pass a component to the function returned by connect. Instead received "+JSON.stringify(n));var a=n.displayName||n.name||"Component",c=b(a),l=y({},x,{getDisplayName:b,methodName:O,renderCountProp:C,shouldHandleStateChanges:k,storeKey:D,withRef:S,displayName:c,wrappedComponentName:a,WrappedComponent:n}),d=function(e){function a(t,n){o(this,a);var i=r(this,e.call(this,t,n));return i.version=I,i.state={},i.renderCount=0,i.store=t[D]||n[D],i.propsMode=Boolean(t[D]),i.setWrappedInstance=i.setWrappedInstance.bind(i),f()(i.store,'Could not find "'+D+'" in either the context or props of "'+c+'". Either wrap the root component in a <Provider>, or explicitly pass "'+D+'" as a prop to "'+c+'".'),i.initSelector(),i.initSubscription(),i}return i(a,e),a.prototype.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return e={},e[R]=t||this.context[R],e},a.prototype.componentDidMount=function(){k&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},a.prototype.componentWillReceiveProps=function(e){this.selector.run(e)},a.prototype.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},a.prototype.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=u,this.store=null,this.selector.run=u,this.selector.shouldComponentUpdate=!1},a.prototype.getWrappedInstance=function(){return f()(S,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+O+"() call."),this.wrappedInstance},a.prototype.setWrappedInstance=function(e){this.wrappedInstance=e},a.prototype.initSelector=function(){var e=t(this.store.dispatch,l);this.selector=s(e,this.store),this.selector.run(this.props)},a.prototype.initSubscription=function(){if(k){var e=(this.propsMode?this.props:this.context)[R];this.subscription=new m.a(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},a.prototype.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(E)):this.notifyNestedSubs()},a.prototype.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},a.prototype.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},a.prototype.addExtraProps=function(e){if(!(S||C||this.propsMode&&this.subscription))return e;var t=y({},e);return S&&(t.ref=this.setWrappedInstance),C&&(t[C]=this.renderCount++),this.propsMode&&this.subscription&&(t[R]=this.subscription),t},a.prototype.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(h.createElement)(n,this.addExtraProps(e.props))},a}(h.Component);return d.WrappedComponent=n,d.displayName=c,d.childContextTypes=A,d.contextTypes=M,d.propTypes=M,"production"!==e.env.NODE_ENV&&(d.prototype.componentWillUpdate=function(){var e=this;if(this.version!==I){this.version=I,this.initSelector();var t=[];this.subscription&&(t=this.subscription.listeners.get(),this.subscription.tryUnsubscribe()),this.initSubscription(),k&&(this.subscription.trySubscribe(),t.forEach(function(t){return e.subscription.listeners.subscribe(t)}))}}),p()(d,n)}}t.a=c;var l=n(111),p=n.n(l),d=n(15),f=n.n(d),h=n(1),m=(n.n(h),n(240)),v=n(109),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},g=0,E={}}).call(t,n(0))},function(e,t,n){"use strict";var o={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,mixins:!0,propTypes:!0,type:!0},r={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},i=Object.defineProperty,a=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,s=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,l=c&&c(Object);e.exports=function e(t,n,p){if("string"!=typeof n){if(l){var d=c(n);d&&d!==l&&e(t,d,p)}var f=a(n);u&&(f=f.concat(u(n)));for(var h=0;h<f.length;++h){var m=f[h];if(!(o[m]||r[m]||p&&p[m])){var v=s(n,m);try{i(t,m,v)}catch(e){}}}return t}return t}},function(e,t,n){"use strict";function o(e,t,n){function i(){y===v&&(y=v.slice())}function s(){return m}function c(e){if("function"!=typeof e)throw new Error("Expected listener to be a function.");var t=!0;return i(),y.push(e),function(){if(t){t=!1,i();var n=y.indexOf(e);y.splice(n,1)}}}function l(e){if(!Object(r.a)(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(g)throw new Error("Reducers may not dispatch actions.");try{g=!0,m=h(m,e)}finally{g=!1}for(var t=v=y,n=0;n<t.length;n++){(0,t[n])()}return e}function p(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");h=e,l({type:u.INIT})}function d(){var e,t=c;return e={subscribe:function(e){function n(){e.next&&e.next(s())}if("object"!=typeof e)throw new TypeError("Expected the observer to be an object.");return n(),{unsubscribe:t(n)}}},e[a.a]=function(){return this},e}var f;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(o)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var h=e,m=t,v=[],y=v,g=!1;return l({type:u.INIT}),f={dispatch:l,subscribe:c,getState:s,replaceReducer:p},f[a.a]=d,f}n.d(t,"a",function(){return u}),t.b=o;var r=n(68),i=n(252),a=n.n(i),u={INIT:"@@redux/INIT"}},function(e,t,n){"use strict";var o=n(245),r=o.a.Symbol;t.a=r},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";function o(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e);try{throw new Error(e)}catch(e){}}t.a=o},function(e,t,n){"use strict";function o(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}t.a=o},function(e,t,n){"use strict";(function(e){function o(e){return function(t,n){function o(){return r}var r=e(t,n);return o.dependsOnOwnProps=!1,o}}function r(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function i(t,n){return function(o,i){var u=i.displayName,s=function(e,t){return s.dependsOnOwnProps?s.mapToProps(e,t):s.mapToProps(e)};return s.dependsOnOwnProps=!0,s.mapToProps=function(o,i){s.mapToProps=t,s.dependsOnOwnProps=r(t);var c=s(o,i);return"function"==typeof c&&(s.mapToProps=c,s.dependsOnOwnProps=r(c),c=s(o,i)),"production"!==e.env.NODE_ENV&&Object(a.a)(c,u,n),c},s}}t.a=o,t.b=i;var a=n(118)}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n){Object(r.a)(e)||Object(i.a)(n+"() in "+t+" must return a plain object. Instead received "+e+".")}t.a=o;var r=n(68),i=n(67)},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(8),u=n.n(a),s=n(1),c=n.n(s),l=n(11),p=n.n(l),d=n(268),f=n.n(d),h=n(45),m=function(e){function t(){var n,i,a;o(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=i=r(this,e.call.apply(e,[this].concat(s))),i.history=f()(i.props),a=n,r(i,a)}return i(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<MemoryRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { MemoryRouter as Router }`.")},t.prototype.render=function(){return c.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(c.a.Component);m.propTypes={initialEntries:p.a.array,initialIndex:p.a.number,getUserConfirmation:p.a.func,keyLength:p.a.number,children:p.a.node},t.a=m},function(e,t,n){"use strict";function o(e){return"/"===e.charAt(0)}function r(e,t){for(var n=t,o=n+1,r=e.length;o<r;n+=1,o+=1)e[n]=e[o];e.pop()}function i(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],i=t&&t.split("/")||[],a=e&&o(e),u=t&&o(t),s=a||u;if(e&&o(e)?i=n:n.length&&(i.pop(),i=i.concat(n)),!i.length)return"/";var c=void 0;if(i.length){var l=i[i.length-1];c="."===l||".."===l||""===l}else c=!1;for(var p=0,d=i.length;d>=0;d--){var f=i[d];"."===f?r(i,d):".."===f?(r(i,d),p++):p&&(r(i,d),p--)}if(!s)for(;p--;p)i.unshift("..");!s||""===i[0]||i[0]&&o(i[0])||i.unshift("");var h=i.join("/");return c&&"/"!==h.substr(-1)&&(h+="/"),h}Object.defineProperty(t,"__esModule",{value:!0}),t.default=i},function(e,t,n){"use strict";function o(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(Array.isArray(e))return Array.isArray(t)&&e.length===t.length&&e.every(function(e,n){return o(e,t[n])});var n=void 0===e?"undefined":r(e);if(n!==(void 0===t?"undefined":r(t)))return!1;if("object"===n){var i=e.valueOf(),a=t.valueOf();if(i!==e||a!==t)return o(i,a);var u=Object.keys(e),s=Object.keys(t);return u.length===s.length&&u.every(function(n){return o(e[n],t[n])})}return!1}Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=o},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(1),u=n.n(a),s=n(11),c=n.n(s),l=n(15),p=n.n(l),d=function(e){function t(){return o(this,t),r(this,e.apply(this,arguments))}return i(t,e),t.prototype.enable=function(e){this.unblock&&this.unblock(),this.unblock=this.context.router.history.block(e)},t.prototype.disable=function(){this.unblock&&(this.unblock(),this.unblock=null)},t.prototype.componentWillMount=function(){p()(this.context.router,"You should not use <Prompt> outside a <Router>"),this.props.when&&this.enable(this.props.message)},t.prototype.componentWillReceiveProps=function(e){e.when?this.props.when&&this.props.message===e.message||this.enable(e.message):this.disable()},t.prototype.componentWillUnmount=function(){this.disable()},t.prototype.render=function(){return null},t}(u.a.Component);d.propTypes={when:c.a.bool,message:c.a.oneOfType([c.a.func,c.a.string]).isRequired},d.defaultProps={when:!0},d.contextTypes={router:c.a.shape({history:c.a.shape({block:c.a.func.isRequired}).isRequired}).isRequired},t.a=d},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(1),u=n.n(a),s=n(11),c=n.n(s),l=n(8),p=n.n(l),d=n(15),f=n.n(d),h=n(269),m=function(e){function t(){return o(this,t),r(this,e.apply(this,arguments))}return i(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){f()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(h.a)(e.to),n=Object(h.a)(this.props.to);if(Object(h.b)(t,n))return void p()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"');this.perform()},t.prototype.perform=function(){var e=this.context.router.history,t=this.props,n=t.push,o=t.to;n?e.push(o):e.replace(o)},t.prototype.render=function(){return null},t}(u.a.Component);m.propTypes={push:c.a.bool,from:c.a.string,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired},m.defaultProps={push:!1},m.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired}).isRequired,staticContext:c.a.object}).isRequired},t.a=m},function(e,t,n){"use strict";n.d(t,"b",function(){return o}),n.d(t,"a",function(){return r}),n.d(t,"e",function(){return i}),n.d(t,"c",function(){return a}),n.d(t,"g",function(){return u}),n.d(t,"h",function(){return s}),n.d(t,"f",function(){return c}),n.d(t,"d",function(){return l});var o=!("undefined"==typeof window||!window.document||!window.document.createElement),r=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},i=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},a=function(e,t){return t(window.confirm(e))},u=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},s=function(){return-1===window.navigator.userAgent.indexOf("Trident")},c=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},l=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";function o(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(8),s=n.n(u),c=n(15),l=n.n(c),p=n(1),d=n.n(p),f=n(11),h=n.n(f),m=n(34),v=(n.n(m),n(45)),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},g=function(e){var t=e.pathname,n=void 0===t?"/":t,o=e.search,r=void 0===o?"":o,i=e.hash,a=void 0===i?"":i;return{pathname:n,search:"?"===r?"":r,hash:"#"===a?"":a}},E=function(e,t){return e?y({},t,{pathname:Object(m.addLeadingSlash)(e)+t.pathname}):t},b=function(e,t){if(!e)return t;var n=Object(m.addLeadingSlash)(e);return 0!==t.pathname.indexOf(n)?t:y({},t,{pathname:t.pathname.substr(n.length)})},_=function(e){return"string"==typeof e?Object(m.parsePath)(e):g(e)},O=function(e){return"string"==typeof e?e:Object(m.createPath)(e)},N=function(e){return function(){l()(!1,"You cannot %s with <StaticRouter>",e)}},C=function(){},w=function(e){function t(){var n,o,a;r(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=o=i(this,e.call.apply(e,[this].concat(s))),o.createHref=function(e){return Object(m.addLeadingSlash)(o.props.basename+O(e))},o.handlePush=function(e){var t=o.props,n=t.basename,r=t.context;r.action="PUSH",r.location=E(n,_(e)),r.url=O(r.location)},o.handleReplace=function(e){var t=o.props,n=t.basename,r=t.context;r.action="REPLACE",r.location=E(n,_(e)),r.url=O(r.location)},o.handleListen=function(){return C},o.handleBlock=function(){return C},a=n,i(o,a)}return a(t,e),t.prototype.getChildContext=function(){return{router:{staticContext:this.props.context}}},t.prototype.componentWillMount=function(){s()(!this.props.history,"<StaticRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { StaticRouter as Router }`.")},t.prototype.render=function(){var e=this.props,t=e.basename,n=(e.context,e.location),r=o(e,["basename","context","location"]),i={createHref:this.createHref,action:"POP",location:b(t,_(n)),push:this.handlePush,replace:this.handleReplace,go:N("go"),goBack:N("goBack"),goForward:N("goForward"),listen:this.handleListen,block:this.handleBlock};return d.a.createElement(v.a,y({},r,{history:i}))},t}(d.a.Component);w.propTypes={basename:h.a.string,context:h.a.object.isRequired,location:h.a.oneOfType([h.a.string,h.a.object])},w.defaultProps={basename:"",location:"/"},w.childContextTypes={router:h.a.object.isRequired},t.a=w},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(1),u=n.n(a),s=n(11),c=n.n(s),l=n(8),p=n.n(l),d=n(15),f=n.n(d),h=n(47),m=function(e){function t(){return o(this,t),r(this,e.apply(this,arguments))}return i(t,e),t.prototype.componentWillMount=function(){f()(this.context.router,"You should not use <Switch> outside a <Router>")},t.prototype.componentWillReceiveProps=function(e){p()(!(e.location&&!this.props.location),'<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),p()(!(!e.location&&this.props.location),'<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.')},t.prototype.render=function(){var e=this.context.router.route,t=this.props.children,n=this.props.location||e.location,o=void 0,r=void 0;return u.a.Children.forEach(t,function(t){if(u.a.isValidElement(t)){var i=t.props,a=i.path,s=i.exact,c=i.strict,l=i.sensitive,p=i.from,d=a||p;null==o&&(r=t,o=d?Object(h.a)(n.pathname,{path:d,exact:s,strict:c,sensitive:l}):e.match)}}),o?u.a.cloneElement(r,{location:n,computedMatch:o}):null},t}(u.a.Component);m.contextTypes={router:c.a.shape({route:c.a.object.isRequired}).isRequired},m.propTypes={children:c.a.node,location:c.a.object},t.a=m},function(e,t,n){"use strict";function o(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}var r=n(1),i=n.n(r),a=n(11),u=n.n(a),s=n(111),c=n.n(s),l=n(72),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},d=function(e){var t=function(t){var n=t.wrappedComponentRef,r=o(t,["wrappedComponentRef"]);return i.a.createElement(l.a,{render:function(t){return i.a.createElement(e,p({},r,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:u.a.func},c()(t,e)};t.a=d},function(e,t,n){"use strict";t.__esModule=!0;t.canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement),t.addEventListener=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},t.removeEventListener=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},t.getConfirmation=function(e,t){return t(window.confirm(e))},t.supportsHistory=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},t.supportsPopStateOnHashChange=function(){return-1===window.navigator.userAgent.indexOf("Trident")},t.supportsGoWithoutReloadUsingHash=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},t.isExtraneousPopstateEvent=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";function o(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(1),s=n.n(u),c=n(11),l=n.n(c),p=n(15),d=n.n(p),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},h=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},m=function(e){function t(){var n,o,a;r(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=o=i(this,e.call.apply(e,[this].concat(s))),o.handleClick=function(e){if(o.props.onClick&&o.props.onClick(e),!e.defaultPrevented&&0===e.button&&!o.props.target&&!h(e)){e.preventDefault();var t=o.context.router.history,n=o.props,r=n.replace,i=n.to;r?t.replace(i):t.push(i)}},a=n,i(o,a)}return a(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,r=o(e,["replace","to","innerRef"]);d()(this.context.router,"You should not use <Link> outside a <Router>");var i=this.context.router.history.createHref("string"==typeof t?{pathname:t}:t);return s.a.createElement("a",f({},r,{onClick:this.handleClick,href:i,ref:n}))},t}(s.a.Component);m.propTypes={onClick:l.a.func,target:l.a.string,replace:l.a.bool,to:l.a.oneOfType([l.a.string,l.a.object]).isRequired,innerRef:l.a.oneOfType([l.a.string,l.a.func])},m.defaultProps={replace:!1},m.contextTypes={router:l.a.shape({history:l.a.shape({push:l.a.func.isRequired,replace:l.a.func.isRequired,createHref:l.a.func.isRequired}).isRequired}).isRequired},t.a=m},function(e,t,n){"use strict";var o=n(72);t.a=o.a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.postPresigned=function(e){var t=e.file,n=e.s3Info,o=e.progressCallback,r=(e.doneCallback,new FormData);return Object.keys(n.fields).forEach(function(e){r.append(e,n.fields[e])}),n.fields.file=t,r.append("file",t),$.ajax({xhr:function(){var e=new window.XMLHttpRequest;return e.upload.addEventListener("progress",o,!1),e},type:"POST",url:n.url,data:r,processData:!1,contentType:!1})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),r=n(300),i=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(76),u=function(e,t){return{playing:e.playlist.playing,current_in_playlist:e.playlist.ids[e.playlist.currentIndex]===t.trackId}},s=function(e,t){return{playTrack:function(){e((0,a.receivePlaylist)([t.trackId]))},resumeTrack:function(){e((0,a.startPlayback)())},pauseTrack:function(){return e((0,a.pausePlayback)())}}};t.default=(0,o.connect)(u,s)(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),r=n(301),i=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(134),u=n(36),s=function(e,t){var n=void 0;return n="user"===t.type?t.id==(0,u.current_user_id)(e):t.userId==(0,u.current_user_id)(e),{editable:n}},c=function(e,t){var n=void 0;return n="user"===t.type?function(e){return(0,a.postUserImage)(e,t.id)}:function(e){return(0,a.postTrackImage)(e,t.id)},{postAction:n}};t.default=(0,o.connect)(s,c)(i.default)},function(e,t,n){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.postTrackImage=t.postUserImage=void 0;var r=(n(23),n(16),n(131)),i=o(r),a=n(302),u=o(a);t.postUserImage=function(e,t){u.presignedUserPost(e,t).then(function(t){return i.postPresigned({file:e,s3Info:t})})},t.postTrackImage=function(e,t){u.presignedTrackPost(e,t).then(function(t){return i.postPresigned({file:e,s3Info:t})})}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=o(r),a=n(308),u=o(a),s=n(10);t.default=function(){return i.default.createElement("div",{className:"nav_bar"},i.default.createElement("div",{className:"nav_link_set"},i.default.createElement(s.NavLink,{className:"top_nav_link",to:"/charts"},"Charts"),i.default.createElement(s.NavLink,{className:"top_nav_link",exact:!0,to:"/"},"Home")),i.default.createElement(u.default,null))}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r=n(1),i=o(r),a=n(151),u=o(a),s=n(237),c=o(s),l=n(316),p=o(l),d=n(24),f=n(134);document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("root"),t=(0,p.default)();window.postUserImage=f.postUserImage,window.postTrackImage=f.postTrackImage,window.currentUser&&t.dispatch((0,d.receiveSession)(currentUser)),u.default.render(i.default.createElement(c.default,{store:t}),e)})},function(e,t,n){"use strict";function o(e){return(""+e).replace(b,"$&/")}function r(e,t){this.func=e,this.context=t,this.count=0}function i(e,t,n){var o=e.func,r=e.context;o.call(r,t,e.count++)}function a(e,t,n){if(null==e)return e;var o=r.getPooled(t,n);y(e,i,o),r.release(o)}function u(e,t,n,o){this.result=e,this.keyPrefix=t,this.func=n,this.context=o,this.count=0}function s(e,t,n){var r=e.result,i=e.keyPrefix,a=e.func,u=e.context,s=a.call(u,t,e.count++);Array.isArray(s)?c(s,r,n,v.thatReturnsArgument):null!=s&&(m.isValidElement(s)&&(s=m.cloneAndReplaceKey(s,i+(!s.key||t&&t.key===s.key?"":o(s.key)+"/")+n)),r.push(s))}function c(e,t,n,r,i){var a="";null!=n&&(a=o(n)+"/");var c=u.getPooled(t,a,r,i);y(e,s,c),u.release(c)}function l(e,t,n){if(null==e)return e;var o=[];return c(e,o,null,t,n),o}function p(e,t,n){return null}function d(e,t){return y(e,p,null)}function f(e){var t=[];return c(e,t,null,v.thatReturnsArgument),t}var h=n(138),m=n(21),v=n(13),y=n(139),g=h.twoArgumentPooler,E=h.fourArgumentPooler,b=/\/+/g;r.prototype.destructor=function(){this.func=null,this.context=null,this.count=0},h.addPoolingTo(r,g),u.prototype.destructor=function(){this.result=null,this.keyPrefix=null,this.func=null,this.context=null,this.count=0},h.addPoolingTo(u,E);var _={forEach:a,map:l,mapIntoWithKeyPrefixInternal:c,count:d,toArray:f};e.exports=_},function(e,t,n){"use strict";(function(t){var o=n(26),r=n(2),i=function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)},a=function(e,t){var n=this;if(n.instancePool.length){var o=n.instancePool.pop();return n.call(o,e,t),o}return new n(e,t)},u=function(e,t,n){var o=this;if(o.instancePool.length){var r=o.instancePool.pop();return o.call(r,e,t,n),r}return new o(e,t,n)},s=function(e,t,n,o){var r=this;if(r.instancePool.length){var i=r.instancePool.pop();return r.call(i,e,t,n,o),i}return new r(e,t,n,o)},c=function(e){var n=this;e instanceof n||("production"!==t.env.NODE_ENV?r(!1,"Trying to release an instance into a pool of a different type."):o("25")),e.destructor(),n.instancePool.length<n.poolSize&&n.instancePool.push(e)},l=i,p=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||l,n.poolSize||(n.poolSize=10),n.release=c,n},d={addPoolingTo:p,oneArgumentPooler:i,twoArgumentPooler:a,threeArgumentPooler:u,fourArgumentPooler:s};e.exports=d}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,t){return e&&"object"==typeof e&&null!=e.key?p.escape(e.key):t.toString(36)}function r(e,n,i,v){var y=typeof e;if("undefined"!==y&&"boolean"!==y||(e=null),null===e||"string"===y||"number"===y||"object"===y&&e.$$typeof===s)return i(v,e,""===n?f+o(e,0):n),1;var g,E,b=0,_=""===n?f:n+h;if(Array.isArray(e))for(var O=0;O<e.length;O++)g=e[O],E=_+o(g,O),b+=r(g,E,i,v);else{var N=c(e);if(N){var C,w=N.call(e);if(N!==e.entries)for(var k=0;!(C=w.next()).done;)g=C.value,E=_+o(g,k++),b+=r(g,E,i,v);else{if("production"!==t.env.NODE_ENV){var T="";if(u.current){var D=u.current.getName();D&&(T=" Check the render method of `"+D+"`.")}"production"!==t.env.NODE_ENV&&d(m,"Using Maps as children is not yet fully supported. It is an experimental feature that might be removed. Convert it to a sequence / iterable of keyed ReactElements instead.%s",T),m=!0}for(;!(C=w.next()).done;){var P=C.value;P&&(g=P[1],E=_+p.escape(P[0])+h+o(g,0),b+=r(g,E,i,v))}}}else if("object"===y){var S="";if("production"!==t.env.NODE_ENV&&(S=" If you meant to render a collection of children, use an array instead or wrap the object using createFragment(object) from the React add-ons.",e._isReactElement&&(S=" It looks like you're using an element created by a different version of React. Make sure to use only one copy of React."),u.current)){var x=u.current.getName();x&&(S+=" Check the render method of `"+x+"`.")}var R=String(e);"production"!==t.env.NODE_ENV?l(!1,"Objects are not valid as a React child (found: %s).%s","[object Object]"===R?"object with keys {"+Object.keys(e).join(", ")+"}":R,S):a("31","[object Object]"===R?"object with keys {"+Object.keys(e).join(", ")+"}":R,S)}}return b}function i(e,t,n){return null==e?0:r(e,"",t,n)}var a=n(26),u=n(17),s=n(79),c=n(80),l=n(2),p=n(140),d=n(3),f=".",h=":",m=!1;e.exports=i}).call(t,n(0))},function(e,t,n){"use strict";function o(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function r(e){var t=/(=0|=2)/g,n={"=0":"=","=2":":"};return(""+("."===e[0]&&"$"===e[1]?e.substring(2):e.substring(1))).replace(t,function(e){return n[e]})}var i={escape:o,unescape:r};e.exports=i},function(e,t,n){"use strict";(function(t){var o=n(21),r=o.createFactory;if("production"!==t.env.NODE_ENV){r=n(81).createFactory}var i={a:r("a"),abbr:r("abbr"),address:r("address"),area:r("area"),article:r("article"),aside:r("aside"),audio:r("audio"),b:r("b"),base:r("base"),bdi:r("bdi"),bdo:r("bdo"),big:r("big"),blockquote:r("blockquote"),body:r("body"),br:r("br"),button:r("button"),canvas:r("canvas"),caption:r("caption"),cite:r("cite"),code:r("code"),col:r("col"),colgroup:r("colgroup"),data:r("data"),datalist:r("datalist"),dd:r("dd"),del:r("del"),details:r("details"),dfn:r("dfn"),dialog:r("dialog"),div:r("div"),dl:r("dl"),dt:r("dt"),em:r("em"),embed:r("embed"),fieldset:r("fieldset"),figcaption:r("figcaption"),figure:r("figure"),footer:r("footer"),form:r("form"),h1:r("h1"),h2:r("h2"),h3:r("h3"),h4:r("h4"),h5:r("h5"),h6:r("h6"),head:r("head"),header:r("header"),hgroup:r("hgroup"),hr:r("hr"),html:r("html"),i:r("i"),iframe:r("iframe"),img:r("img"),input:r("input"),ins:r("ins"),kbd:r("kbd"),keygen:r("keygen"),label:r("label"),legend:r("legend"),li:r("li"),link:r("link"),main:r("main"),map:r("map"),mark:r("mark"),menu:r("menu"),menuitem:r("menuitem"),meta:r("meta"),meter:r("meter"),nav:r("nav"),noscript:r("noscript"),object:r("object"),ol:r("ol"),optgroup:r("optgroup"),option:r("option"),output:r("output"),p:r("p"),param:r("param"),picture:r("picture"),pre:r("pre"),progress:r("progress"),q:r("q"),rp:r("rp"),rt:r("rt"),ruby:r("ruby"),s:r("s"),samp:r("samp"),script:r("script"),section:r("section"),select:r("select"),small:r("small"),source:r("source"),span:r("span"),strong:r("strong"),style:r("style"),sub:r("sub"),summary:r("summary"),sup:r("sup"),table:r("table"),tbody:r("tbody"),td:r("td"),textarea:r("textarea"),tfoot:r("tfoot"),th:r("th"),thead:r("thead"),time:r("time"),title:r("title"),tr:r("tr"),track:r("track"),u:r("u"),ul:r("ul"),var:r("var"),video:r("video"),wbr:r("wbr"),circle:r("circle"),clipPath:r("clipPath"),defs:r("defs"),ellipse:r("ellipse"),g:r("g"),image:r("image"),line:r("line"),linearGradient:r("linearGradient"),mask:r("mask"),path:r("path"),pattern:r("pattern"),polygon:r("polygon"),polyline:r("polyline"),radialGradient:r("radialGradient"),rect:r("rect"),stop:r("stop"),svg:r("svg"),text:r("text"),tspan:r("tspan")};e.exports=i}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,o,p,d,f,h){for(var m in e)if(e.hasOwnProperty(m)){var v;try{"function"!=typeof e[m]&&("production"!==t.env.NODE_ENV?s(!1,"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",d||"React class",a[p],m):i("84",d||"React class",a[p],m)),v=e[m](o,m,d,p,null,u)}catch(e){v=e}if("production"!==t.env.NODE_ENV&&c(!v||v instanceof Error,"%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",d||"React class",a[p],m,typeof v),v instanceof Error&&!(v.message in l)){l[v.message]=!0;var y="";"production"!==t.env.NODE_ENV&&(r||(r=n(12)),null!==h?y=r.getStackAddendumByID(h):null!==f&&(y=r.getCurrentStackAddendum(f))),"production"!==t.env.NODE_ENV&&c(!1,"Failed %s type: %s%s",p,v.message,y)}}}var r,i=n(26),a=n(143),u=n(144),s=n(2),c=n(3);void 0!==t&&t.env&&"test"===t.env.NODE_ENV&&(r=n(12));var l={};e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var n={};"production"!==t.env.NODE_ENV&&(n={prop:"prop",context:"context",childContext:"child context"}),e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";var o=n(21),r=o.isValidElement,i=n(82);e.exports=i(r)},function(e,t,n){"use strict";(function(t){function o(e,n,o,s,c){if("production"!==t.env.NODE_ENV)for(var l in e)if(e.hasOwnProperty(l)){var p;try{r("function"==typeof e[l],"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",s||"React class",o,l),p=e[l](n,l,s,o,null,a)}catch(e){p=e}if(i(!p||p instanceof Error,"%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",s||"React class",o,l,typeof p),p instanceof Error&&!(p.message in u)){u[p.message]=!0;var d=c?c():"";i(!1,"Failed %s type: %s%s",o,p.message,null!=d?d:"")}}}if("production"!==t.env.NODE_ENV)var r=n(2),i=n(3),a=n(50),u={};e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";e.exports="15.6.1"},function(e,t,n){"use strict";var o=n(77),r=o.Component,i=n(21),a=i.isValidElement,u=n(78),s=n(149);e.exports=s(r,a,u)},function(e,t,n){"use strict";(function(t){function o(e){return e}function r(e,n,r){function p(e,n,o){for(var r in n)n.hasOwnProperty(r)&&"production"!==t.env.NODE_ENV&&s("function"==typeof n[r],"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",e.displayName||"ReactClass",c[o],r)}function d(e,t){var n=O.hasOwnProperty(t)?O[t]:null;k.hasOwnProperty(t)&&u("OVERRIDE_BASE"===n,"ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",t),e&&u("DEFINE_MANY"===n||"DEFINE_MANY_MERGED"===n,"ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",t)}function f(e,o){if(o){u("function"!=typeof o,"ReactClass: You're attempting to use a component class or function as a mixin. Instead, just use a regular object."),u(!n(o),"ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object.");var r=e.prototype,i=r.__reactAutoBindPairs;o.hasOwnProperty(l)&&N.mixins(e,o.mixins);for(var a in o)if(o.hasOwnProperty(a)&&a!==l){var c=o[a],p=r.hasOwnProperty(a);if(d(p,a),N.hasOwnProperty(a))N[a](e,c);else{var f=O.hasOwnProperty(a),h="function"==typeof c,m=h&&!f&&!p&&!1!==o.autobind;if(m)i.push(a,c),r[a]=c;else if(p){var g=O[a];u(f&&("DEFINE_MANY_MERGED"===g||"DEFINE_MANY"===g),"ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.",g,a),"DEFINE_MANY_MERGED"===g?r[a]=v(r[a],c):"DEFINE_MANY"===g&&(r[a]=y(r[a],c))}else r[a]=c,"production"!==t.env.NODE_ENV&&"function"==typeof c&&o.displayName&&(r[a].displayName=o.displayName+"_"+a)}}}else if("production"!==t.env.NODE_ENV){var E=typeof o,b="object"===E&&null!==o;"production"!==t.env.NODE_ENV&&s(b,"%s: You're attempting to include a mixin that is either null or not an object. Check the mixins included by the component, as well as any mixins they include themselves. Expected object but got %s.",e.displayName||"ReactClass",null===o?null:E)}}function h(e,t){if(t)for(var n in t){var o=t[n];if(t.hasOwnProperty(n)){var r=n in N;u(!r,'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.',n);var i=n in e;u(!i,"ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",n),e[n]=o}}}function m(e,t){u(e&&t&&"object"==typeof e&&"object"==typeof t,"mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.");for(var n in t)t.hasOwnProperty(n)&&(u(void 0===e[n],"mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.",n),e[n]=t[n]);return e}function v(e,t){return function(){var n=e.apply(this,arguments),o=t.apply(this,arguments);if(null==n)return o;if(null==o)return n;var r={};return m(r,n),m(r,o),r}}function y(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function g(e,n){var o=n.bind(e);if("production"!==t.env.NODE_ENV){o.__reactBoundContext=e,o.__reactBoundMethod=n,o.__reactBoundArguments=null;var r=e.constructor.displayName,i=o.bind;o.bind=function(a){for(var u=arguments.length,c=Array(u>1?u-1:0),l=1;l<u;l++)c[l-1]=arguments[l];if(a!==e&&null!==a)"production"!==t.env.NODE_ENV&&s(!1,"bind(): React component methods may only be bound to the component instance. See %s",r);else if(!c.length)return"production"!==t.env.NODE_ENV&&s(!1,"bind(): You are binding a component method to the component. React does this for you automatically in a high-performance way, so you can safely remove this call. See %s",r),o;var p=i.apply(o,arguments);return p.__reactBoundContext=e,p.__reactBoundMethod=n,p.__reactBoundArguments=c,p}}return o}function E(e){for(var t=e.__reactAutoBindPairs,n=0;n<t.length;n+=2){var o=t[n],r=t[n+1];e[o]=g(e,r)}}function b(e){var n=o(function(e,o,i){"production"!==t.env.NODE_ENV&&s(this instanceof n,"Something is calling a React component directly. Use a factory or JSX instead. See: https://fb.me/react-legacyfactory"),this.__reactAutoBindPairs.length&&E(this),this.props=e,this.context=o,this.refs=a,this.updater=i||r,this.state=null;var c=this.getInitialState?this.getInitialState():null;"production"!==t.env.NODE_ENV&&void 0===c&&this.getInitialState._isMockFunction&&(c=null),u("object"==typeof c&&!Array.isArray(c),"%s.getInitialState(): must return an object or null",n.displayName||"ReactCompositeComponent"),this.state=c});n.prototype=new T,n.prototype.constructor=n,n.prototype.__reactAutoBindPairs=[],_.forEach(f.bind(null,n)),f(n,C),f(n,e),f(n,w),n.getDefaultProps&&(n.defaultProps=n.getDefaultProps()),"production"!==t.env.NODE_ENV&&(n.getDefaultProps&&(n.getDefaultProps.isReactClassApproved={}),n.prototype.getInitialState&&(n.prototype.getInitialState.isReactClassApproved={})),u(n.prototype.render,"createClass(...): Class specification must implement a `render` method."),"production"!==t.env.NODE_ENV&&(s(!n.prototype.componentShouldUpdate,"%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",e.displayName||"A component"),s(!n.prototype.componentWillRecieveProps,"%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?",e.displayName||"A component"));for(var i in O)n.prototype[i]||(n.prototype[i]=null);return n}var _=[],O={mixins:"DEFINE_MANY",statics:"DEFINE_MANY",propTypes:"DEFINE_MANY",contextTypes:"DEFINE_MANY",childContextTypes:"DEFINE_MANY",getDefaultProps:"DEFINE_MANY_MERGED",getInitialState:"DEFINE_MANY_MERGED",getChildContext:"DEFINE_MANY_MERGED",render:"DEFINE_ONCE",componentWillMount:"DEFINE_MANY",componentDidMount:"DEFINE_MANY",componentWillReceiveProps:"DEFINE_MANY",shouldComponentUpdate:"DEFINE_ONCE",componentWillUpdate:"DEFINE_MANY",componentDidUpdate:"DEFINE_MANY",componentWillUnmount:"DEFINE_MANY",updateComponent:"OVERRIDE_BASE"},N={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)f(e,t[n])},childContextTypes:function(e,n){"production"!==t.env.NODE_ENV&&p(e,n,"childContext"),e.childContextTypes=i({},e.childContextTypes,n)},contextTypes:function(e,n){"production"!==t.env.NODE_ENV&&p(e,n,"context"),e.contextTypes=i({},e.contextTypes,n)},getDefaultProps:function(e,t){e.getDefaultProps?e.getDefaultProps=v(e.getDefaultProps,t):e.getDefaultProps=t},propTypes:function(e,n){"production"!==t.env.NODE_ENV&&p(e,n,"prop"),e.propTypes=i({},e.propTypes,n)},statics:function(e,t){h(e,t)},autobind:function(){}},C={componentDidMount:function(){this.__isMounted=!0}},w={componentWillUnmount:function(){this.__isMounted=!1}},k={replaceState:function(e,t){this.updater.enqueueReplaceState(this,e,t)},isMounted:function(){return"production"!==t.env.NODE_ENV&&(s(this.__didWarnIsMounted,"%s: isMounted is deprecated. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.",this.constructor&&this.constructor.displayName||this.name||"Component"),this.__didWarnIsMounted=!0),!!this.__isMounted}},T=function(){};return i(T.prototype,e.prototype,k),b}var i=n(5),a=n(38),u=n(2);if("production"!==t.env.NODE_ENV)var s=n(3);var c,l="mixins";c="production"!==t.env.NODE_ENV?{prop:"prop",context:"context",childContext:"child context"}:{},e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){return i.isValidElement(e)||("production"!==t.env.NODE_ENV?a(!1,"React.Children.only expected to receive a single React element child."):r("143")),e}var r=n(26),i=n(21),a=n(2);e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";e.exports=n(152)},function(e,t,n){"use strict";(function(t){var o=n(6),r=n(153),i=n(107),a=n(27),u=n(18),s=n(231),c=n(232),l=n(108),p=n(233),d=n(3);r.inject();var f={findDOMNode:c,render:i.render,unmountComponentAtNode:i.unmountComponentAtNode,version:s,unstable_batchedUpdates:u.batchedUpdates,unstable_renderSubtreeIntoContainer:p};if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject&&__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({ComponentTree:{getClosestInstanceFromNode:o.getClosestInstanceFromNode,getNodeFromInstance:function(e){return e._renderedComponent&&(e=l(e)),e?o.getNodeFromInstance(e):null}},Mount:i,Reconciler:a}),"production"!==t.env.NODE_ENV){if(n(7).canUseDOM&&window.top===window.self){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&(navigator.userAgent.indexOf("Chrome")>-1&&-1===navigator.userAgent.indexOf("Edge")||navigator.userAgent.indexOf("Firefox")>-1)){var h=-1===window.location.protocol.indexOf("http")&&-1===navigator.userAgent.indexOf("Firefox");console.debug("Download the React DevTools "+(h?"and use an HTTP server (instead of a file: URL) ":"")+"for a better development experience: https://fb.me/react-devtools")}var m=function(){};"production"!==t.env.NODE_ENV&&d(-1!==(m.name||m.toString()).indexOf("testFn"),"It looks like you're using a minified copy of the development build of React. When deploying React apps to production, make sure to use the production build which skips development warnings and is faster. See https://fb.me/react-minification for more details.");var v=document.documentMode&&document.documentMode<8;"production"!==t.env.NODE_ENV&&d(!v,'Internet Explorer is running in compatibility mode; please add the following tag to your HTML to prevent this from happening: <meta http-equiv="X-UA-Compatible" content="IE=edge" />');for(var y=[Array.isArray,Array.prototype.every,Array.prototype.forEach,Array.prototype.indexOf,Array.prototype.map,Date.now,Function.prototype.bind,Object.keys,String.prototype.trim],g=0;g<y.length;g++)if(!y[g]){"production"!==t.env.NODE_ENV&&d(!1,"One or more ES5 shims expected by React are not available: https://fb.me/react-warning-polyfills");break}}}if("production"!==t.env.NODE_ENV){var E=n(14),b=n(234),_=n(235),O=n(236);E.debugTool.addHook(b),E.debugTool.addHook(_),E.debugTool.addHook(O)}e.exports=f}).call(t,n(0))},function(e,t,n){"use strict";function o(){N||(N=!0,g.EventEmitter.injectReactEventListener(y),g.EventPluginHub.injectEventPluginOrder(u),g.EventPluginUtils.injectComponentTree(d),g.EventPluginUtils.injectTreeTraversal(h),g.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:O,EnterLeaveEventPlugin:s,ChangeEventPlugin:a,SelectEventPlugin:_,BeforeInputEventPlugin:i}),g.HostComponent.injectGenericComponentClass(p),g.HostComponent.injectTextComponentClass(m),g.DOMProperty.injectDOMPropertyConfig(r),g.DOMProperty.injectDOMPropertyConfig(c),g.DOMProperty.injectDOMPropertyConfig(b),g.EmptyComponent.injectEmptyComponentFactory(function(e){return new f(e)}),g.Updates.injectReconcileTransaction(E),g.Updates.injectBatchingStrategy(v),g.Component.injectEnvironment(l))}var r=n(154),i=n(155),a=n(159),u=n(167),s=n(168),c=n(169),l=n(170),p=n(176),d=n(6),f=n(202),h=n(203),m=n(204),v=n(205),y=n(206),g=n(208),E=n(209),b=n(215),_=n(216),O=n(217),N=!1;e.exports={inject:o}},function(e,t,n){"use strict";var o={Properties:{"aria-current":0,"aria-details":0,"aria-disabled":0,"aria-hidden":0,"aria-invalid":0,"aria-keyshortcuts":0,"aria-label":0,"aria-roledescription":0,"aria-autocomplete":0,"aria-checked":0,"aria-expanded":0,"aria-haspopup":0,"aria-level":0,"aria-modal":0,"aria-multiline":0,"aria-multiselectable":0,"aria-orientation":0,"aria-placeholder":0,"aria-pressed":0,"aria-readonly":0,"aria-required":0,"aria-selected":0,"aria-sort":0,"aria-valuemax":0,"aria-valuemin":0,"aria-valuenow":0,"aria-valuetext":0,"aria-atomic":0,"aria-busy":0,"aria-live":0,"aria-relevant":0,"aria-dropeffect":0,"aria-grabbed":0,"aria-activedescendant":0,"aria-colcount":0,"aria-colindex":0,"aria-colspan":0,"aria-controls":0,"aria-describedby":0,"aria-errormessage":0,"aria-flowto":0,"aria-labelledby":0,"aria-owns":0,"aria-posinset":0,"aria-rowcount":0,"aria-rowindex":0,"aria-rowspan":0,"aria-setsize":0},DOMAttributeNames:{},DOMPropertyNames:{}};e.exports=o},function(e,t,n){"use strict";function o(e){return(e.ctrlKey||e.altKey||e.metaKey)&&!(e.ctrlKey&&e.altKey)}function r(e){switch(e){case"topCompositionStart":return w.compositionStart;case"topCompositionEnd":return w.compositionEnd;case"topCompositionUpdate":return w.compositionUpdate}}function i(e,t){return"topKeyDown"===e&&t.keyCode===g}function a(e,t){switch(e){case"topKeyUp":return-1!==y.indexOf(t.keyCode);case"topKeyDown":return t.keyCode!==g;case"topKeyPress":case"topMouseDown":case"topBlur":return!0;default:return!1}}function u(e){var t=e.detail;return"object"==typeof t&&"data"in t?t.data:null}function s(e,t,n,o){var s,c;if(E?s=r(e):T?a(e,n)&&(s=w.compositionEnd):i(e,n)&&(s=w.compositionStart),!s)return null;O&&(T||s!==w.compositionStart?s===w.compositionEnd&&T&&(c=T.getData()):T=h.getPooled(o));var l=m.getPooled(s,t,n,o);if(c)l.data=c;else{var p=u(n);null!==p&&(l.data=p)}return d.accumulateTwoPhaseDispatches(l),l}function c(e,t){switch(e){case"topCompositionEnd":return u(t);case"topKeyPress":return t.which!==N?null:(k=!0,C);case"topTextInput":var n=t.data;return n===C&&k?null:n;default:return null}}function l(e,t){if(T){if("topCompositionEnd"===e||!E&&a(e,t)){var n=T.getData();return h.release(T),T=null,n}return null}switch(e){case"topPaste":return null;case"topKeyPress":return t.which&&!o(t)?String.fromCharCode(t.which):null;case"topCompositionEnd":return O?null:t.data;default:return null}}function p(e,t,n,o){var r;if(!(r=_?c(e,n):l(e,n)))return null;var i=v.getPooled(w.beforeInput,t,n,o);return i.data=r,d.accumulateTwoPhaseDispatches(i),i}var d=n(30),f=n(7),h=n(156),m=n(157),v=n(158),y=[9,13,27,32],g=229,E=f.canUseDOM&&"CompositionEvent"in window,b=null;f.canUseDOM&&"documentMode"in document&&(b=document.documentMode);var _=f.canUseDOM&&"TextEvent"in window&&!b&&!function(){var e=window.opera;return"object"==typeof e&&"function"==typeof e.version&&parseInt(e.version(),10)<=12}(),O=f.canUseDOM&&(!E||b&&b>8&&b<=11),N=32,C=String.fromCharCode(N),w={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["topCompositionEnd","topKeyPress","topTextInput","topPaste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:["topBlur","topCompositionEnd","topKeyDown","topKeyPress","topKeyUp","topMouseDown"]},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:["topBlur","topCompositionStart","topKeyDown","topKeyPress","topKeyUp","topMouseDown"]},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:["topBlur","topCompositionUpdate","topKeyDown","topKeyPress","topKeyUp","topMouseDown"]}},k=!1,T=null,D={eventTypes:w,extractEvents:function(e,t,n,o){return[s(e,t,n,o),p(e,t,n,o)]}};e.exports=D},function(e,t,n){"use strict";function o(e){this._root=e,this._startText=this.getText(),this._fallbackText=null}var r=n(5),i=n(22),a=n(87);r(o.prototype,{destructor:function(){this._root=null,this._startText=null,this._fallbackText=null},getText:function(){return"value"in this._root?this._root.value:this._root[a()]},getData:function(){if(this._fallbackText)return this._fallbackText;var e,t,n=this._startText,o=n.length,r=this.getText(),i=r.length;for(e=0;e<o&&n[e]===r[e];e++);var a=o-e;for(t=1;t<=a&&n[o-t]===r[i-t];t++);var u=t>1?1-t:void 0;return this._fallbackText=r.slice(e,u),this._fallbackText}}),i.addPoolingTo(o),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(19),i={data:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(19),i={data:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n){var o=k.getPooled(x.change,e,t,n);return o.type="change",O.accumulateTwoPhaseDispatches(o),o}function r(e){var t=e.nodeName&&e.nodeName.toLowerCase();return"select"===t||"input"===t&&"file"===e.type}function i(e){var t=o(I,e,D(e));w.batchedUpdates(a,t)}function a(e){_.enqueueEvents(e),_.processEventQueue(!1)}function u(e,t){R=e,I=t,R.attachEvent("onchange",i)}function s(){R&&(R.detachEvent("onchange",i),R=null,I=null)}function c(e,t){var n=T.updateValueIfChanged(e),o=!0===t.simulated&&j._allowSimulatedPassThrough;if(n||o)return e}function l(e,t){if("topChange"===e)return t}function p(e,t,n){"topFocus"===e?(s(),u(t,n)):"topBlur"===e&&s()}function d(e,t){R=e,I=t,R.attachEvent("onpropertychange",h)}function f(){R&&(R.detachEvent("onpropertychange",h),R=null,I=null)}function h(e){"value"===e.propertyName&&c(I,e)&&i(e)}function m(e,t,n){"topFocus"===e?(f(),d(t,n)):"topBlur"===e&&f()}function v(e,t,n){if("topSelectionChange"===e||"topKeyUp"===e||"topKeyDown"===e)return c(I,n)}function y(e){var t=e.nodeName;return t&&"input"===t.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)}function g(e,t,n){if("topClick"===e)return c(t,n)}function E(e,t,n){if("topInput"===e||"topChange"===e)return c(t,n)}function b(e,t){if(null!=e){var n=e._wrapperState||t._wrapperState;if(n&&n.controlled&&"number"===t.type){var o=""+t.value;t.getAttribute("value")!==o&&t.setAttribute("value",o)}}}var _=n(31),O=n(30),N=n(7),C=n(6),w=n(18),k=n(19),T=n(90),D=n(53),P=n(54),S=n(91),x={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:["topBlur","topChange","topClick","topFocus","topInput","topKeyDown","topKeyUp","topSelectionChange"]}},R=null,I=null,M=!1;N.canUseDOM&&(M=P("change")&&(!document.documentMode||document.documentMode>8));var A=!1;N.canUseDOM&&(A=P("input")&&(!("documentMode"in document)||document.documentMode>9));var j={eventTypes:x,_allowSimulatedPassThrough:!0,_isInputEventSupported:A,extractEvents:function(e,t,n,i){var a,u,s=t?C.getNodeFromInstance(t):window;if(r(s)?M?a=l:u=p:S(s)?A?a=E:(a=v,u=m):y(s)&&(a=g),a){var c=a(e,t,n);if(c){return o(c,n,i)}}u&&u(e,s,t),"topBlur"===e&&b(t,s)}};e.exports=j},function(e,t,n){"use strict";function o(e,t,n){"function"==typeof e?e(t.getPublicInstance()):i.addComponentAsRefTo(t,e,n)}function r(e,t,n){"function"==typeof e?e(null):i.removeComponentAsRefFrom(t,e,n)}var i=n(161),a={};a.attachRefs=function(e,t){if(null!==t&&"object"==typeof t){var n=t.ref;null!=n&&o(n,e,t._owner)}},a.shouldUpdateRefs=function(e,t){var n=null,o=null;null!==e&&"object"==typeof e&&(n=e.ref,o=e._owner);var r=null,i=null;return null!==t&&"object"==typeof t&&(r=t.ref,i=t._owner),n!==r||"string"==typeof r&&i!==o},a.detachRefs=function(e,t){if(null!==t&&"object"==typeof t){var n=t.ref;null!=n&&r(n,e,t._owner)}},e.exports=a},function(e,t,n){"use strict";(function(t){function o(e){return!(!e||"function"!=typeof e.attachRef||"function"!=typeof e.detachRef)}var r=n(4),i=n(2),a={addComponentAsRefTo:function(e,n,a){o(a)||("production"!==t.env.NODE_ENV?i(!1,"addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded (details: https://fb.me/react-refs-must-have-owner)."):r("119")),a.attachRef(n,e)},removeComponentAsRefFrom:function(e,n,a){o(a)||("production"!==t.env.NODE_ENV?i(!1,"removeComponentAsRefFrom(...): Only a ReactOwner can have refs. You might be removing a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded (details: https://fb.me/react-refs-must-have-owner)."):r("120"));var u=a.getPublicInstance();u&&u.refs[n]===e.getPublicInstance()&&a.detachRef(n)}};e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,n,o,r,i,a,u,s){try{n.call(o,r,i,a,u,s)}catch(n){"production"!==t.env.NODE_ENV&&_(N[e],"Exception thrown by hook while handling %s: %s",e,n+"\n"+n.stack),N[e]=!0}}function r(e,t,n,r,i,a){for(var u=0;u<O.length;u++){var s=O[u],c=s[e];c&&o(e,c,s,t,n,r,i,a)}}function i(){g.purgeUnmountedComponents(),y.clearHistory()}function a(e){return e.reduce(function(e,t){var n=g.getOwnerID(t),o=g.getParentID(t);return e[t]={displayName:g.getDisplayName(t),text:g.getText(t),updateCount:g.getUpdateCount(t),childIDs:g.getChildIDs(t),ownerID:n||o&&g.getOwnerID(o)||0,parentID:o},e},{})}function u(){var e=P,t=D,n=y.getHistory();if(0===T)return P=0,D=[],void i();if(t.length||n.length){var o=g.getRegisteredIDs();w.push({duration:b()-e,measurements:t||[],operations:n||[],treeSnapshot:a(o)})}i(),P=b(),D=[]}function s(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1]&&0===e||e||"production"!==t.env.NODE_ENV&&_(!1,"ReactDebugTool: debugID may not be empty.")}function c(e,n){0!==T&&(I&&!M&&("production"!==t.env.NODE_ENV&&_(!1,"There is an internal error in the React performance measurement code. Did not expect %s timer to start while %s timer is still in progress for %s instance.",n,I||"no",e===S?"the same":"another"),M=!0),x=b(),R=0,S=e,I=n)}function l(e,n){0!==T&&(I===n||M||("production"!==t.env.NODE_ENV&&_(!1,"There is an internal error in the React performance measurement code. We did not expect %s timer to stop while %s timer is still in progress for %s instance. Please report this as a bug in React.",n,I||"no",e===S?"the same":"another"),M=!0),C&&D.push({timerType:n,instanceID:e,duration:b()-x-R}),x=0,R=0,S=null,I=null)}function p(){var e={startTime:x,nestedFlushStartTime:b(),debugID:S,timerType:I};k.push(e),x=0,R=0,S=null,I=null}function d(){var e=k.pop(),t=e.startTime,n=e.nestedFlushStartTime,o=e.debugID,r=e.timerType,i=b()-n;x=t,R+=i,S=o,I=r}function f(e){if(!C||!j)return!1;var t=g.getElement(e);return null!=t&&"object"==typeof t&&!("string"==typeof t.type)}function h(e,t){if(f(e)){var n=e+"::"+t;A=b(),performance.mark(n)}}function m(e,t){if(f(e)){var n=e+"::"+t,o=g.getDisplayName(e)||"Unknown";if(b()-A>.1){var r=o+" ["+t+"]";performance.measure(r,n)}performance.clearMarks(n),r&&performance.clearMeasures(r)}}var v=n(163),y=n(164),g=n(12),E=n(7),b=n(165),_=n(3),O=[],N={},C=!1,w=[],k=[],T=0,D=[],P=0,S=null,x=0,R=0,I=null,M=!1,A=0,j="undefined"!=typeof performance&&"function"==typeof performance.mark&&"function"==typeof performance.clearMarks&&"function"==typeof performance.measure&&"function"==typeof performance.clearMeasures,V={addHook:function(e){O.push(e)},removeHook:function(e){for(var t=0;t<O.length;t++)O[t]===e&&(O.splice(t,1),t--)},isProfiling:function(){return C},beginProfiling:function(){C||(C=!0,w.length=0,u(),V.addHook(y))},endProfiling:function(){C&&(C=!1,u(),V.removeHook(y))},getFlushHistory:function(){return w},onBeginFlush:function(){T++,u(),p(),r("onBeginFlush")},onEndFlush:function(){u(),T--,d(),r("onEndFlush")},onBeginLifeCycleTimer:function(e,t){s(e),r("onBeginLifeCycleTimer",e,t),h(e,t),c(e,t)},onEndLifeCycleTimer:function(e,t){s(e),l(e,t),m(e,t),r("onEndLifeCycleTimer",e,t)},onBeginProcessingChildContext:function(){r("onBeginProcessingChildContext")},onEndProcessingChildContext:function(){r("onEndProcessingChildContext")},onHostOperation:function(e){s(e.instanceID),r("onHostOperation",e)},onSetState:function(){r("onSetState")},onSetChildren:function(e,t){s(e),t.forEach(s),r("onSetChildren",e,t)},onBeforeMountComponent:function(e,t,n){s(e),s(n,!0),r("onBeforeMountComponent",e,t,n),h(e,"mount")},onMountComponent:function(e){s(e),m(e,"mount"),r("onMountComponent",e)},onBeforeUpdateComponent:function(e,t){s(e),r("onBeforeUpdateComponent",e,t),h(e,"update")},onUpdateComponent:function(e){s(e),m(e,"update"),r("onUpdateComponent",e)},onBeforeUnmountComponent:function(e){s(e),r("onBeforeUnmountComponent",e),h(e,"unmount")},onUnmountComponent:function(e){s(e),m(e,"unmount"),r("onUnmountComponent",e)},onTestEvent:function(){r("onTestEvent")}};V.addDevtool=V.addHook,V.removeDevtool=V.removeHook,V.addHook(v),V.addHook(g),/[?&]react_perf\b/.test(E.canUseDOM&&window.location.href||"")&&V.beginProfiling(),e.exports=V}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(3);if("production"!==t.env.NODE_ENV)var r=!1,i=function(){"production"!==t.env.NODE_ENV&&o(!r,"setState(...): Cannot call setState() inside getChildContext()")};var a={onBeginProcessingChildContext:function(){r=!0},onEndProcessingChildContext:function(){r=!1},onSetState:function(){i()}};e.exports=a}).call(t,n(0))},function(e,t,n){"use strict";var o=[],r={onHostOperation:function(e){o.push(e)},clearHistory:function(){r._preventClearing||(o=[])},getHistory:function(){return o}};e.exports=r},function(e,t,n){"use strict";var o,r=n(166);o=r.now?function(){return r.now()}:function(){return Date.now()},e.exports=o},function(e,t,n){"use strict";var o,r=n(7);r.canUseDOM&&(o=window.performance||window.msPerformance||window.webkitPerformance),e.exports=o||{}},function(e,t,n){"use strict";var o=["ResponderEventPlugin","SimpleEventPlugin","TapEventPlugin","EnterLeaveEventPlugin","ChangeEventPlugin","SelectEventPlugin","BeforeInputEventPlugin"];e.exports=o},function(e,t,n){"use strict";var o=n(30),r=n(6),i=n(41),a={mouseEnter:{registrationName:"onMouseEnter",dependencies:["topMouseOut","topMouseOver"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["topMouseOut","topMouseOver"]}},u={eventTypes:a,extractEvents:function(e,t,n,u){if("topMouseOver"===e&&(n.relatedTarget||n.fromElement))return null;if("topMouseOut"!==e&&"topMouseOver"!==e)return null;var s;if(u.window===u)s=u;else{var c=u.ownerDocument;s=c?c.defaultView||c.parentWindow:window}var l,p;if("topMouseOut"===e){l=t;var d=n.relatedTarget||n.toElement;p=d?r.getClosestInstanceFromNode(d):null}else l=null,p=t;if(l===p)return null;var f=null==l?s:r.getNodeFromInstance(l),h=null==p?s:r.getNodeFromInstance(p),m=i.getPooled(a.mouseLeave,l,n,u);m.type="mouseleave",m.target=f,m.relatedTarget=h;var v=i.getPooled(a.mouseEnter,p,n,u);return v.type="mouseenter",v.target=h,v.relatedTarget=f,o.accumulateEnterLeaveDispatches(m,v,l,p),[m,v]}};e.exports=u},function(e,t,n){"use strict";var o=n(20),r=o.injection.MUST_USE_PROPERTY,i=o.injection.HAS_BOOLEAN_VALUE,a=o.injection.HAS_NUMERIC_VALUE,u=o.injection.HAS_POSITIVE_NUMERIC_VALUE,s=o.injection.HAS_OVERLOADED_BOOLEAN_VALUE,c={isCustomAttribute:RegExp.prototype.test.bind(new RegExp("^(data|aria)-["+o.ATTRIBUTE_NAME_CHAR+"]*$")),Properties:{accept:0,acceptCharset:0,accessKey:0,action:0,allowFullScreen:i,allowTransparency:0,alt:0,as:0,async:i,autoComplete:0,autoPlay:i,capture:i,cellPadding:0,cellSpacing:0,charSet:0,challenge:0,checked:r|i,cite:0,classID:0,className:0,cols:u,colSpan:0,content:0,contentEditable:0,contextMenu:0,controls:i,coords:0,crossOrigin:0,data:0,dateTime:0,default:i,defer:i,dir:0,disabled:i,download:s,draggable:0,encType:0,form:0,formAction:0,formEncType:0,formMethod:0,formNoValidate:i,formTarget:0,frameBorder:0,headers:0,height:0,hidden:i,high:0,href:0,hrefLang:0,htmlFor:0,httpEquiv:0,icon:0,id:0,inputMode:0,integrity:0,is:0,keyParams:0,keyType:0,kind:0,label:0,lang:0,list:0,loop:i,low:0,manifest:0,marginHeight:0,marginWidth:0,max:0,maxLength:0,media:0,mediaGroup:0,method:0,min:0,minLength:0,multiple:r|i,muted:r|i,name:0,nonce:0,noValidate:i,open:i,optimum:0,pattern:0,placeholder:0,playsInline:i,poster:0,preload:0,profile:0,radioGroup:0,readOnly:i,referrerPolicy:0,rel:0,required:i,reversed:i,role:0,rows:u,rowSpan:a,sandbox:0,scope:0,scoped:i,scrolling:0,seamless:i,selected:r|i,shape:0,size:u,sizes:0,span:u,spellCheck:0,src:0,srcDoc:0,srcLang:0,srcSet:0,start:a,step:0,style:0,summary:0,tabIndex:0,target:0,title:0,type:0,useMap:0,value:0,width:0,wmode:0,wrap:0,about:0,datatype:0,inlist:0,prefix:0,property:0,resource:0,typeof:0,vocab:0,autoCapitalize:0,autoCorrect:0,autoSave:0,color:0,itemProp:0,itemScope:i,itemType:0,itemID:0,itemRef:0,results:0,security:0,unselectable:0},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{},DOMMutationMethods:{value:function(e,t){if(null==t)return e.removeAttribute("value");"number"!==e.type||!1===e.hasAttribute("value")?e.setAttribute("value",""+t):e.validity&&!e.validity.badInput&&e.ownerDocument.activeElement!==e&&e.setAttribute("value",""+t)}}};e.exports=c},function(e,t,n){"use strict";var o=n(56),r=n(175),i={processChildrenUpdates:r.dangerouslyProcessChildrenUpdates,replaceNodeWithMarkup:o.dangerouslyReplaceNodeWithMarkup};e.exports=i},function(e,t,n){"use strict";(function(t){var o=n(4),r=n(28),i=n(7),a=n(172),u=n(13),s=n(2),c={dangerouslyReplaceNodeWithMarkup:function(e,n){if(i.canUseDOM||("production"!==t.env.NODE_ENV?s(!1,"dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a worker thread. Make sure `window` and `document` are available globally before requiring React when unit testing or use ReactDOMServer.renderToString() for server rendering."):o("56")),n||("production"!==t.env.NODE_ENV?s(!1,"dangerouslyReplaceNodeWithMarkup(...): Missing markup."):o("57")),"HTML"===e.nodeName&&("production"!==t.env.NODE_ENV?s(!1,"dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the <html> node. This is because browser quirks make this unreliable and/or slow. If you want to render to the root you must use server rendering. See ReactDOMServer.renderToString()."):o("58")),"string"==typeof n){var c=a(n,u)[0];e.parentNode.replaceChild(c,e)}else r.replaceChildWithTree(e,n)}};e.exports=c}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){var t=e.match(l);return t&&t[1].toLowerCase()}function r(e,n){var r=c;c||("production"!==t.env.NODE_ENV?s(!1,"createNodesFromMarkup dummy not initialized"):s(!1));var i=o(e),l=i&&u(i);if(l){r.innerHTML=l[1]+e+l[2];for(var p=l[0];p--;)r=r.lastChild}else r.innerHTML=e;var d=r.getElementsByTagName("script");d.length&&(n||("production"!==t.env.NODE_ENV?s(!1,"createNodesFromMarkup(...): Unexpected <script> element rendered."):s(!1)),a(d).forEach(n));for(var f=Array.from(r.childNodes);r.lastChild;)r.removeChild(r.lastChild);return f}var i=n(7),a=n(173),u=n(174),s=n(2),c=i.canUseDOM?document.createElement("div"):null,l=/^\s*<(\w+)/;e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){var n=e.length;if((Array.isArray(e)||"object"!=typeof e&&"function"!=typeof e)&&("production"!==t.env.NODE_ENV?a(!1,"toArray: Array-like object expected"):a(!1)),"number"!=typeof n&&("production"!==t.env.NODE_ENV?a(!1,"toArray: Object needs a length property"):a(!1)),0===n||n-1 in e||("production"!==t.env.NODE_ENV?a(!1,"toArray: Object should have keys for indices"):a(!1)),"function"==typeof e.callee&&("production"!==t.env.NODE_ENV?a(!1,"toArray: Object can't be `arguments`. Use rest params (function(...args) {}) or Array.from() instead."):a(!1)),e.hasOwnProperty)try{return Array.prototype.slice.call(e)}catch(e){}for(var o=Array(n),r=0;r<n;r++)o[r]=e[r];return o}function r(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"length"in e&&!("setInterval"in e)&&"number"!=typeof e.nodeType&&(Array.isArray(e)||"callee"in e||"item"in e)}function i(e){return r(e)?Array.isArray(e)?e.slice():o(e):[e]}var a=n(2);e.exports=i}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){return a||("production"!==t.env.NODE_ENV?i(!1,"Markup wrapping node not initialized"):i(!1)),d.hasOwnProperty(e)||(e="*"),u.hasOwnProperty(e)||(a.innerHTML="*"===e?"<link />":"<"+e+"></"+e+">",u[e]=!a.firstChild),u[e]?d[e]:null}var r=n(7),i=n(2),a=r.canUseDOM?document.createElement("div"):null,u={},s=[1,'<select multiple="true">',"</select>"],c=[1,"<table>","</table>"],l=[3,"<table><tbody><tr>","</tr></tbody></table>"],p=[1,'<svg xmlns="http://www.w3.org/2000/svg">',"</svg>"],d={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:s,option:s,caption:c,colgroup:c,tbody:c,tfoot:c,thead:c,td:l,th:l};["circle","clipPath","defs","ellipse","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","text","tspan"].forEach(function(e){d[e]=p,u[e]=!0}),e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";var o=n(56),r=n(6),i={dangerouslyProcessChildrenUpdates:function(e,t){var n=r.getNodeFromInstance(e);o.processUpdates(n,t)}};e.exports=i},function(e,t,n){"use strict";(function(t){function o(e){if(e){var t=e._currentElement._owner||null;if(t){var n=t.getName();if(n)return" This DOM node was rendered by `"+n+"`."}}return""}function r(e){if("object"==typeof e){if(Array.isArray(e))return"["+e.map(r).join(", ")+"]";var t=[];for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var o=/^[a-z$_][\w$_]*$/i.test(n)?n:JSON.stringify(n);t.push(o+": "+r(e[n]))}return"{"+t.join(", ")+"}"}return"string"==typeof e?JSON.stringify(e):"function"==typeof e?"[function object]":String(e)}function i(e,n,o){if(null!=e&&null!=n&&!W(e,n)){var i,a=o._tag,u=o._currentElement._owner;u&&(i=u.getName());var s=i+"|"+a;te.hasOwnProperty(s)||(te[s]=!0,"production"!==t.env.NODE_ENV&&Y(!1,"`%s` was passed a style object that has previously been mutated. Mutating `style` is deprecated. Consider cloning it beforehand. Check the `render` %s. Previous style: %s. Mutated style: %s.",a,u?"of `"+i+"`":"using <"+a+">",r(e),r(n)))}}function a(e,n){n&&(ae[e._tag]&&(null!=n.children||null!=n.dangerouslySetInnerHTML)&&("production"!==t.env.NODE_ENV?F(!1,"%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s",e._tag,e._currentElement._owner?" Check the render method of "+e._currentElement._owner.getName()+".":""):g("137",e._tag,e._currentElement._owner?" Check the render method of "+e._currentElement._owner.getName()+".":"")),null!=n.dangerouslySetInnerHTML&&(null!=n.children&&("production"!==t.env.NODE_ENV?F(!1,"Can only set one of `children` or `props.dangerouslySetInnerHTML`."):g("60")),"object"==typeof n.dangerouslySetInnerHTML&&J in n.dangerouslySetInnerHTML||("production"!==t.env.NODE_ENV?F(!1,"`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information."):g("61"))),"production"!==t.env.NODE_ENV&&("production"!==t.env.NODE_ENV&&Y(null==n.innerHTML,"Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."),"production"!==t.env.NODE_ENV&&Y(n.suppressContentEditableWarning||!n.contentEditable||null==n.children,"A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."),"production"!==t.env.NODE_ENV&&Y(null==n.onFocusIn&&null==n.onFocusOut,"React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.")),null!=n.style&&"object"!=typeof n.style&&("production"!==t.env.NODE_ENV?F(!1,"The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.%s",o(e)):g("62",o(e))))}function u(e,n,o,r){if(!(r instanceof V)){"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&Y("onScroll"!==n||B("scroll",!0),"This browser doesn't support the `onScroll` event");var i=e._hostContainerInfo,a=i._node&&i._node.nodeType===ee,u=a?i._node:i._ownerDocument;G(n,u),r.getReactMountReady().enqueue(s,{inst:e,registrationName:n,listener:o})}}function s(){var e=this;k.putListener(e.inst,e.registrationName,e.listener)}function c(){var e=this;x.postMountWrapper(e)}function l(){var e=this;M.postMountWrapper(e)}function p(){var e=this;R.postMountWrapper(e)}function d(){H.track(this)}function f(){var e=this;e._rootNodeID||("production"!==t.env.NODE_ENV?F(!1,"Must be mounted to trap events"):g("63"));var n=$(e);switch(n||("production"!==t.env.NODE_ENV?F(!1,"trapBubbledEvent(...): Requires node to be rendered."):g("64")),e._tag){case"iframe":case"object":e._wrapperState.listeners=[D.trapBubbledEvent("topLoad","load",n)];break;case"video":case"audio":e._wrapperState.listeners=[];for(var o in oe)oe.hasOwnProperty(o)&&e._wrapperState.listeners.push(D.trapBubbledEvent(o,oe[o],n));break;case"source":e._wrapperState.listeners=[D.trapBubbledEvent("topError","error",n)];break;case"img":e._wrapperState.listeners=[D.trapBubbledEvent("topError","error",n),D.trapBubbledEvent("topLoad","load",n)];break;case"form":e._wrapperState.listeners=[D.trapBubbledEvent("topReset","reset",n),D.trapBubbledEvent("topSubmit","submit",n)];break;case"input":case"select":case"textarea":e._wrapperState.listeners=[D.trapBubbledEvent("topInvalid","invalid",n)]}}function h(){I.postUpdateWrapper(this)}function m(e){ce.call(se,e)||(ue.test(e)||("production"!==t.env.NODE_ENV?F(!1,"Invalid tag: %s",e):g("65",e)),se[e]=!0)}function v(e,t){return e.indexOf("-")>=0||null!=t.is}function y(e){var n=e.type;m(n),this._currentElement=e,this._tag=n.toLowerCase(),this._namespaceURI=null,this._renderedChildren=null,this._previousStyle=null,this._previousStyleCopy=null,this._hostNode=null,this._hostParent=null,this._rootNodeID=0,this._domID=0,this._hostContainerInfo=null,this._wrapperState=null,this._topLevelWrapper=null,this._flags=0,"production"!==t.env.NODE_ENV&&(this._ancestorInfo=null,ne.call(this,null))}var g=n(4),E=n(5),b=n(177),_=n(178),O=n(28),N=n(57),C=n(20),w=n(96),k=n(31),T=n(39),D=n(44),P=n(84),S=n(6),x=n(188),R=n(189),I=n(98),M=n(190),A=n(14),j=n(191),V=n(200),U=n(13),L=n(43),F=n(2),B=n(54),W=n(61),H=n(90),q=n(65),Y=n(3),K=P,z=k.deleteListener,$=S.getNodeFromInstance,G=D.listenTo,X=T.registrationNameModules,Q={string:!0,number:!0},J="__html",Z={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null},ee=11,te={},ne=U;"production"!==t.env.NODE_ENV&&(ne=function(e){var t=null!=this._contentDebugID,n=this._debugID,o=-n;if(null==e)return t&&A.debugTool.onUnmountComponent(this._contentDebugID),void(this._contentDebugID=null);q(null,String(e),this,this._ancestorInfo),this._contentDebugID=o,t?(A.debugTool.onBeforeUpdateComponent(o,e),A.debugTool.onUpdateComponent(o)):(A.debugTool.onBeforeMountComponent(o,e,n),A.debugTool.onMountComponent(o),A.debugTool.onSetChildren(n,[o]))});var oe={topAbort:"abort",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topSeeked:"seeked",topSeeking:"seeking",topStalled:"stalled",topSuspend:"suspend",topTimeUpdate:"timeupdate",topVolumeChange:"volumechange",topWaiting:"waiting"},re={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},ie={listing:!0,pre:!0,textarea:!0},ae=E({menuitem:!0},re),ue=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,se={},ce={}.hasOwnProperty,le=1;y.displayName="ReactDOMComponent",y.Mixin={mountComponent:function(e,n,o,r){this._rootNodeID=le++,this._domID=o._idCounter++,this._hostParent=n,this._hostContainerInfo=o;var i=this._currentElement.props;switch(this._tag){case"audio":case"form":case"iframe":case"img":case"link":case"object":case"source":case"video":this._wrapperState={listeners:null},e.getReactMountReady().enqueue(f,this);break;case"input":x.mountWrapper(this,i,n),i=x.getHostProps(this,i),e.getReactMountReady().enqueue(d,this),e.getReactMountReady().enqueue(f,this);break;case"option":R.mountWrapper(this,i,n),i=R.getHostProps(this,i);break;case"select":I.mountWrapper(this,i,n),i=I.getHostProps(this,i),e.getReactMountReady().enqueue(f,this);break;case"textarea":M.mountWrapper(this,i,n),i=M.getHostProps(this,i),e.getReactMountReady().enqueue(d,this),e.getReactMountReady().enqueue(f,this)}a(this,i);var u,s;if(null!=n?(u=n._namespaceURI,s=n._tag):o._tag&&(u=o._namespaceURI,s=o._tag),(null==u||u===N.svg&&"foreignobject"===s)&&(u=N.html),u===N.html&&("svg"===this._tag?u=N.svg:"math"===this._tag&&(u=N.mathml)),this._namespaceURI=u,"production"!==t.env.NODE_ENV){var h;null!=n?h=n._ancestorInfo:o._tag&&(h=o._ancestorInfo),h&&q(this._tag,null,this,h),this._ancestorInfo=q.updatedAncestorInfo(h,this._tag,this)}var m;if(e.useCreateElement){var v,y=o._ownerDocument;if(u===N.html)if("script"===this._tag){var g=y.createElement("div"),E=this._currentElement.type;g.innerHTML="<"+E+"></"+E+">",v=g.removeChild(g.firstChild)}else v=i.is?y.createElement(this._currentElement.type,i.is):y.createElement(this._currentElement.type);else v=y.createElementNS(u,this._currentElement.type);S.precacheNode(this,v),this._flags|=K.hasCachedChildNodes,this._hostParent||w.setAttributeForRoot(v),this._updateDOMProperties(null,i,e);var _=O(v);this._createInitialChildren(e,i,r,_),m=_}else{var C=this._createOpenTagMarkupAndPutListeners(e,i),k=this._createContentMarkup(e,i,r);m=!k&&re[this._tag]?C+"/>":C+">"+k+"</"+this._currentElement.type+">"}switch(this._tag){case"input":e.getReactMountReady().enqueue(c,this),i.autoFocus&&e.getReactMountReady().enqueue(b.focusDOMComponent,this);break;case"textarea":e.getReactMountReady().enqueue(l,this),i.autoFocus&&e.getReactMountReady().enqueue(b.focusDOMComponent,this);break;case"select":case"button":i.autoFocus&&e.getReactMountReady().enqueue(b.focusDOMComponent,this);break;case"option":e.getReactMountReady().enqueue(p,this)}return m},_createOpenTagMarkupAndPutListeners:function(e,n){var o="<"+this._currentElement.type;for(var r in n)if(n.hasOwnProperty(r)){var i=n[r];if(null!=i)if(X.hasOwnProperty(r))i&&u(this,r,i,e);else{"style"===r&&(i&&("production"!==t.env.NODE_ENV&&(this._previousStyle=i),i=this._previousStyleCopy=E({},n.style)),i=_.createMarkupForStyles(i,this));var a=null;null!=this._tag&&v(this._tag,n)?Z.hasOwnProperty(r)||(a=w.createMarkupForCustomAttribute(r,i)):a=w.createMarkupForProperty(r,i),a&&(o+=" "+a)}}return e.renderToStaticMarkup?o:(this._hostParent||(o+=" "+w.createMarkupForRoot()),o+=" "+w.createMarkupForID(this._domID))},_createContentMarkup:function(e,n,o){var r="",i=n.dangerouslySetInnerHTML;if(null!=i)null!=i.__html&&(r=i.__html);else{var a=Q[typeof n.children]?n.children:null,u=null!=a?null:n.children;if(null!=a)r=L(a),"production"!==t.env.NODE_ENV&&ne.call(this,a);else if(null!=u){var s=this.mountChildren(u,e,o);r=s.join("")}}return ie[this._tag]&&"\n"===r.charAt(0)?"\n"+r:r},_createInitialChildren:function(e,n,o,r){var i=n.dangerouslySetInnerHTML;if(null!=i)null!=i.__html&&O.queueHTML(r,i.__html);else{var a=Q[typeof n.children]?n.children:null,u=null!=a?null:n.children;if(null!=a)""!==a&&("production"!==t.env.NODE_ENV&&ne.call(this,a),O.queueText(r,a));else if(null!=u)for(var s=this.mountChildren(u,e,o),c=0;c<s.length;c++)O.queueChild(r,s[c])}},receiveComponent:function(e,t,n){var o=this._currentElement;this._currentElement=e,this.updateComponent(t,o,e,n)},updateComponent:function(e,t,n,o){var r=t.props,i=this._currentElement.props;switch(this._tag){case"input":r=x.getHostProps(this,r),i=x.getHostProps(this,i);break;case"option":r=R.getHostProps(this,r),i=R.getHostProps(this,i);break;case"select":r=I.getHostProps(this,r),i=I.getHostProps(this,i);break;case"textarea":r=M.getHostProps(this,r),i=M.getHostProps(this,i)}switch(a(this,i),this._updateDOMProperties(r,i,e),this._updateDOMChildren(r,i,e,o),this._tag){case"input":x.updateWrapper(this);break;case"textarea":M.updateWrapper(this);break;case"select":e.getReactMountReady().enqueue(h,this)}},_updateDOMProperties:function(e,n,o){var r,a,s;for(r in e)if(!n.hasOwnProperty(r)&&e.hasOwnProperty(r)&&null!=e[r])if("style"===r){var c=this._previousStyleCopy;for(a in c)c.hasOwnProperty(a)&&(s=s||{},s[a]="");this._previousStyleCopy=null}else X.hasOwnProperty(r)?e[r]&&z(this,r):v(this._tag,e)?Z.hasOwnProperty(r)||w.deleteValueForAttribute($(this),r):(C.properties[r]||C.isCustomAttribute(r))&&w.deleteValueForProperty($(this),r);for(r in n){var l=n[r],p="style"===r?this._previousStyleCopy:null!=e?e[r]:void 0;if(n.hasOwnProperty(r)&&l!==p&&(null!=l||null!=p))if("style"===r)if(l?("production"!==t.env.NODE_ENV&&(i(this._previousStyleCopy,this._previousStyle,this),this._previousStyle=l),l=this._previousStyleCopy=E({},l)):this._previousStyleCopy=null,p){for(a in p)!p.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(s=s||{},s[a]="");for(a in l)l.hasOwnProperty(a)&&p[a]!==l[a]&&(s=s||{},s[a]=l[a])}else s=l;else if(X.hasOwnProperty(r))l?u(this,r,l,o):p&&z(this,r);else if(v(this._tag,n))Z.hasOwnProperty(r)||w.setValueForAttribute($(this),r,l);else if(C.properties[r]||C.isCustomAttribute(r)){var d=$(this);null!=l?w.setValueForProperty(d,r,l):w.deleteValueForProperty(d,r)}}s&&_.setValueForStyles($(this),s,this)},_updateDOMChildren:function(e,n,o,r){var i=Q[typeof e.children]?e.children:null,a=Q[typeof n.children]?n.children:null,u=e.dangerouslySetInnerHTML&&e.dangerouslySetInnerHTML.__html,s=n.dangerouslySetInnerHTML&&n.dangerouslySetInnerHTML.__html,c=null!=i?null:e.children,l=null!=a?null:n.children,p=null!=i||null!=u,d=null!=a||null!=s;null!=c&&null==l?this.updateChildren(null,o,r):p&&!d&&(this.updateTextContent(""),"production"!==t.env.NODE_ENV&&A.debugTool.onSetChildren(this._debugID,[])),null!=a?i!==a&&(this.updateTextContent(""+a),"production"!==t.env.NODE_ENV&&ne.call(this,a)):null!=s?(u!==s&&this.updateMarkup(""+s),"production"!==t.env.NODE_ENV&&A.debugTool.onSetChildren(this._debugID,[])):null!=l&&("production"!==t.env.NODE_ENV&&ne.call(this,null),this.updateChildren(l,o,r))},getHostNode:function(){return $(this)},unmountComponent:function(e){switch(this._tag){case"audio":case"form":case"iframe":case"img":case"link":case"object":case"source":case"video":var n=this._wrapperState.listeners;if(n)for(var o=0;o<n.length;o++)n[o].remove();break;case"input":case"textarea":H.stopTracking(this);break;case"html":case"head":case"body":"production"!==t.env.NODE_ENV?F(!1,"<%s> tried to unmount. Because of cross-browser quirks it is impossible to unmount some top-level components (eg <html>, <head>, and <body>) reliably and efficiently. To fix this, have a single top-level component that never unmounts render these elements.",this._tag):g("66",this._tag)}this.unmountChildren(e),S.uncacheNode(this),k.deleteAllListeners(this),this._rootNodeID=0,this._domID=0,this._wrapperState=null,"production"!==t.env.NODE_ENV&&ne.call(this,null)},getPublicInstance:function(){return $(this)}},E(y.prototype,y.Mixin,j.Mixin),e.exports=y}).call(t,n(0))},function(e,t,n){"use strict";var o=n(6),r=n(94),i={focusDOMComponent:function(){r(o.getNodeFromInstance(this))}};e.exports=i},function(e,t,n){"use strict";(function(t){var o=n(95),r=n(7),i=n(14),a=n(179),u=n(181),s=n(182),c=n(184),l=n(3),p=c(function(e){return s(e)}),d=!1,f="cssFloat";if(r.canUseDOM){var h=document.createElement("div").style;try{h.font=""}catch(e){d=!0}void 0===document.documentElement.style.cssFloat&&(f="styleFloat")}if("production"!==t.env.NODE_ENV)var m=/^(?:webkit|moz|o)[A-Z]/,v=/;\s*$/,y={},g={},E=!1,b=function(e,n){y.hasOwnProperty(e)&&y[e]||(y[e]=!0,"production"!==t.env.NODE_ENV&&l(!1,"Unsupported style property %s. Did you mean %s?%s",e,a(e),C(n)))},_=function(e,n){y.hasOwnProperty(e)&&y[e]||(y[e]=!0,"production"!==t.env.NODE_ENV&&l(!1,"Unsupported vendor-prefixed style property %s. Did you mean %s?%s",e,e.charAt(0).toUpperCase()+e.slice(1),C(n)))},O=function(e,n,o){g.hasOwnProperty(n)&&g[n]||(g[n]=!0,"production"!==t.env.NODE_ENV&&l(!1,'Style property values shouldn\'t contain a semicolon.%s Try "%s: %s" instead.',C(o),e,n.replace(v,"")))},N=function(e,n,o){E||(E=!0,"production"!==t.env.NODE_ENV&&l(!1,"`NaN` is an invalid value for the `%s` css style property.%s",e,C(o)))},C=function(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""},w=function(e,t,n){var o;n&&(o=n._currentElement._owner),e.indexOf("-")>-1?b(e,o):m.test(e)?_(e,o):v.test(t)&&O(e,t,o),"number"==typeof t&&isNaN(t)&&N(e,0,o)};var k={createMarkupForStyles:function(e,n){var o="";for(var r in e)if(e.hasOwnProperty(r)){var i=0===r.indexOf("--"),a=e[r];"production"!==t.env.NODE_ENV&&(i||w(r,a,n)),null!=a&&(o+=p(r)+":",o+=u(r,a,n,i)+";")}return o||null},setValueForStyles:function(e,n,r){"production"!==t.env.NODE_ENV&&i.debugTool.onHostOperation({instanceID:r._debugID,type:"update styles",payload:n});var a=e.style;for(var s in n)if(n.hasOwnProperty(s)){var c=0===s.indexOf("--");"production"!==t.env.NODE_ENV&&(c||w(s,n[s],r));var l=u(s,n[s],r,c);if("float"!==s&&"cssFloat"!==s||(s=f),c)a.setProperty(s,l);else if(l)a[s]=l;else{var p=d&&o.shorthandPropertyExpansions[s];if(p)for(var h in p)a[h]="";else a[s]=""}}}};e.exports=k}).call(t,n(0))},function(e,t,n){"use strict";function o(e){return r(e.replace(i,"ms-"))}var r=n(180),i=/^-ms-/;e.exports=o},function(e,t,n){"use strict";function o(e){return e.replace(r,function(e,t){return t.toUpperCase()})}var r=/-(.)/g;e.exports=o},function(e,t,n){"use strict";(function(t){function o(e,n,o,r){if(null==n||"boolean"==typeof n||""===n)return"";var s=isNaN(n);if(r||s||0===n||a.hasOwnProperty(e)&&a[e])return""+n;if("string"==typeof n){if("production"!==t.env.NODE_ENV&&o&&"0"!==n){var c=o._currentElement._owner,l=c?c.getName():null;l&&!u[l]&&(u[l]={});var p=!1;if(l){var d=u[l];p=d[e],p||(d[e]=!0)}p||"production"!==t.env.NODE_ENV&&i(!1,"a `%s` tag (owner: `%s`) was passed a numeric string value for CSS property `%s` (value: `%s`) which will be treated as a unitless number in a future version of React.",o._currentElement.type,l||"unknown",e,n)}n=n.trim()}return n+"px"}var r=n(95),i=n(3),a=r.isUnitlessNumber,u={};e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";function o(e){return r(e).replace(i,"-ms-")}var r=n(183),i=/^ms-/;e.exports=o},function(e,t,n){"use strict";function o(e){return e.replace(r,"-$1").toLowerCase()}var r=/([A-Z])/g;e.exports=o},function(e,t,n){"use strict";function o(e){var t={};return function(n){return t.hasOwnProperty(n)||(t[n]=e.call(this,n)),t[n]}}e.exports=o},function(e,t,n){"use strict";function o(e){return'"'+r(e)+'"'}var r=n(43);e.exports=o},function(e,t,n){"use strict";function o(e){r.enqueueEvents(e),r.processEventQueue(!1)}var r=n(31),i={handleTopLevel:function(e,t,n,i){o(r.extractEvents(e,t,n,i))}};e.exports=i},function(e,t,n){"use strict";function o(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}function r(e){if(u[e])return u[e];if(!a[e])return e;var t=a[e];for(var n in t)if(t.hasOwnProperty(n)&&n in s)return u[e]=t[n];return""}var i=n(7),a={animationend:o("Animation","AnimationEnd"),animationiteration:o("Animation","AnimationIteration"),animationstart:o("Animation","AnimationStart"),transitionend:o("Transition","TransitionEnd")},u={},s={};i.canUseDOM&&(s=document.createElement("div").style,"AnimationEvent"in window||(delete a.animationend.animation,delete a.animationiteration.animation,delete a.animationstart.animation),"TransitionEvent"in window||delete a.transitionend.transition),e.exports=r},function(e,t,n){"use strict";(function(t){function o(){this._rootNodeID&&b.updateWrapper(this)}function r(e){return"checkbox"===e.type||"radio"===e.type?null!=e.checked:null!=e.value}function i(e){var n=this._currentElement.props,r=c.executeOnChange(n,e);p.asap(o,this);var i=n.name;if("radio"===n.type&&null!=i){for(var u=l.getNodeFromInstance(this),s=u;s.parentNode;)s=s.parentNode;for(var f=s.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),h=0;h<f.length;h++){var m=f[h];if(m!==u&&m.form===u.form){var v=l.getInstanceFromNode(m);v||("production"!==t.env.NODE_ENV?d(!1,"ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported."):a("90")),p.asap(o,v)}}}return r}var a=n(4),u=n(5),s=n(96),c=n(59),l=n(6),p=n(18),d=n(2),f=n(3),h=!1,m=!1,v=!1,y=!1,g=!1,E=!1,b={getHostProps:function(e,t){var n=c.getValue(t),o=c.getChecked(t);return u({type:void 0,step:void 0,min:void 0,max:void 0},t,{defaultChecked:void 0,defaultValue:void 0,value:null!=n?n:e._wrapperState.initialValue,checked:null!=o?o:e._wrapperState.initialChecked,onChange:e._wrapperState.onChange})},mountWrapper:function(e,n){if("production"!==t.env.NODE_ENV){c.checkPropTypes("input",n,e._currentElement._owner);var o=e._currentElement._owner;void 0===n.valueLink||h||("production"!==t.env.NODE_ENV&&f(!1,"`valueLink` prop on `input` is deprecated; set `value` and `onChange` instead."),h=!0),void 0===n.checkedLink||m||("production"!==t.env.NODE_ENV&&f(!1,"`checkedLink` prop on `input` is deprecated; set `value` and `onChange` instead."),m=!0),void 0===n.checked||void 0===n.defaultChecked||y||("production"!==t.env.NODE_ENV&&f(!1,"%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components",o&&o.getName()||"A component",n.type),y=!0),void 0===n.value||void 0===n.defaultValue||v||("production"!==t.env.NODE_ENV&&f(!1,"%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components",o&&o.getName()||"A component",n.type),v=!0)}var a=n.defaultValue;e._wrapperState={initialChecked:null!=n.checked?n.checked:n.defaultChecked,initialValue:null!=n.value?n.value:a,listeners:null,onChange:i.bind(e),controlled:r(n)}},updateWrapper:function(e){var n=e._currentElement.props;if("production"!==t.env.NODE_ENV){var o=r(n),i=e._currentElement._owner;e._wrapperState.controlled||!o||E||("production"!==t.env.NODE_ENV&&f(!1,"%s is changing an uncontrolled input of type %s to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components",i&&i.getName()||"A component",n.type),E=!0),!e._wrapperState.controlled||o||g||("production"!==t.env.NODE_ENV&&f(!1,"%s is changing a controlled input of type %s to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components",i&&i.getName()||"A component",n.type),g=!0)}var a=n.checked;null!=a&&s.setValueForProperty(l.getNodeFromInstance(e),"checked",a||!1);var u=l.getNodeFromInstance(e),p=c.getValue(n);if(null!=p)if(0===p&&""===u.value)u.value="0";else if("number"===n.type){var d=parseFloat(u.value,10)||0;(p!=d||p==d&&u.value!=p)&&(u.value=""+p)}else u.value!==""+p&&(u.value=""+p);else null==n.value&&null!=n.defaultValue&&u.defaultValue!==""+n.defaultValue&&(u.defaultValue=""+n.defaultValue),null==n.checked&&null!=n.defaultChecked&&(u.defaultChecked=!!n.defaultChecked)},postMountWrapper:function(e){var t=e._currentElement.props,n=l.getNodeFromInstance(e);switch(t.type){case"submit":case"reset":break;case"color":case"date":case"datetime":case"datetime-local":case"month":case"time":case"week":n.value="",n.value=n.defaultValue;break;default:n.value=n.value}var o=n.name;""!==o&&(n.name=""),n.defaultChecked=!n.defaultChecked,n.defaultChecked=!n.defaultChecked,""!==o&&(n.name=o)}};e.exports=b}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){var n="";return i.Children.forEach(e,function(e){null!=e&&("string"==typeof e||"number"==typeof e?n+=e:c||(c=!0,"production"!==t.env.NODE_ENV&&s(!1,"Only strings and numbers are supported as <option> children.")))}),n}var r=n(5),i=n(25),a=n(6),u=n(98),s=n(3),c=!1,l={mountWrapper:function(e,n,r){"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&s(null==n.selected,"Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");var i=null;if(null!=r){var a=r;"optgroup"===a._tag&&(a=a._hostParent),null!=a&&"select"===a._tag&&(i=u.getSelectValueContext(a))}var c=null;if(null!=i){var l;if(l=null!=n.value?n.value+"":o(n.children),c=!1,Array.isArray(i)){for(var p=0;p<i.length;p++)if(""+i[p]===l){c=!0;break}}else c=""+i===l}e._wrapperState={selected:c}},postMountWrapper:function(e){var t=e._currentElement.props;if(null!=t.value){a.getNodeFromInstance(e).setAttribute("value",t.value)}},getHostProps:function(e,t){var n=r({selected:void 0,children:void 0},t);null!=e._wrapperState.selected&&(n.selected=e._wrapperState.selected);var i=o(t.children);return i&&(n.children=i),n}};e.exports=l}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(){this._rootNodeID&&h.updateWrapper(this)}function r(e){var t=this._currentElement.props,n=u.executeOnChange(t,e);return c.asap(o,this),n}var i=n(4),a=n(5),u=n(59),s=n(6),c=n(18),l=n(2),p=n(3),d=!1,f=!1,h={getHostProps:function(e,n){return null!=n.dangerouslySetInnerHTML&&("production"!==t.env.NODE_ENV?l(!1,"`dangerouslySetInnerHTML` does not make sense on <textarea>."):i("91")),a({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue,onChange:e._wrapperState.onChange})},mountWrapper:function(e,n){"production"!==t.env.NODE_ENV&&(u.checkPropTypes("textarea",n,e._currentElement._owner),void 0===n.valueLink||d||("production"!==t.env.NODE_ENV&&p(!1,"`valueLink` prop on `textarea` is deprecated; set `value` and `onChange` instead."),d=!0),void 0===n.value||void 0===n.defaultValue||f||("production"!==t.env.NODE_ENV&&p(!1,"Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://fb.me/react-controlled-components"),f=!0));var o=u.getValue(n),a=o;if(null==o){var s=n.defaultValue,c=n.children;null!=c&&("production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&p(!1,"Use the `defaultValue` or `value` props instead of setting children on <textarea>."),null!=s&&("production"!==t.env.NODE_ENV?l(!1,"If you supply `defaultValue` on a <textarea>, do not pass children."):i("92")),Array.isArray(c)&&(c.length<=1||("production"!==t.env.NODE_ENV?l(!1,"<textarea> can only have at most one child."):i("93")),c=c[0]),s=""+c),null==s&&(s=""),a=s}e._wrapperState={initialValue:""+a,listeners:null,onChange:r.bind(e)}},updateWrapper:function(e){var t=e._currentElement.props,n=s.getNodeFromInstance(e),o=u.getValue(t);if(null!=o){var r=""+o;r!==n.value&&(n.value=r),null==t.defaultValue&&(n.defaultValue=r)}null!=t.defaultValue&&(n.defaultValue=t.defaultValue)},postMountWrapper:function(e){var t=s.getNodeFromInstance(e),n=t.textContent;n===e._wrapperState.initialValue&&(t.value=n)}};e.exports=h}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,t,n){return{type:"INSERT_MARKUP",content:e,fromIndex:null,fromNode:null,toIndex:n,afterNode:t}}function r(e,t,n){return{type:"MOVE_EXISTING",content:null,fromIndex:e._mountIndex,fromNode:m.getHostNode(e),toIndex:n,afterNode:t}}function i(e,t){return{type:"REMOVE_NODE",content:null,fromIndex:e._mountIndex,fromNode:t,toIndex:null,afterNode:null}}function a(e){return{type:"SET_MARKUP",content:e,fromIndex:null,fromNode:null,toIndex:null,afterNode:null}}function u(e){return{type:"TEXT_CONTENT",content:e,fromIndex:null,fromNode:null,toIndex:null,afterNode:null}}function s(e,t){return t&&(e=e||[],e.push(t)),e}function c(e,t){p.processChildrenUpdates(e,t)}var l=n(4),p=n(60),d=n(33),f=n(14),h=n(17),m=n(27),v=n(192),y=n(13),g=n(199),E=n(2),b=y;if("production"!==t.env.NODE_ENV){var _=function(e){if(!e._debugID){var t;(t=d.get(e))&&(e=t)}return e._debugID};b=function(e){var t=_(this);0!==t&&f.debugTool.onSetChildren(t,e?Object.keys(e).map(function(t){return e[t]._debugID}):[])}}var O={Mixin:{_reconcilerInstantiateChildren:function(e,n,o){if("production"!==t.env.NODE_ENV){var r=_(this);if(this._currentElement)try{return h.current=this._currentElement._owner,v.instantiateChildren(e,n,o,r)}finally{h.current=null}}return v.instantiateChildren(e,n,o)},_reconcilerUpdateChildren:function(e,n,o,r,i,a){var u,s=0;if("production"!==t.env.NODE_ENV&&(s=_(this),this._currentElement)){try{h.current=this._currentElement._owner,u=g(n,s)}finally{h.current=null}return v.updateChildren(e,u,o,r,i,this,this._hostContainerInfo,a,s),u}return u=g(n,s),v.updateChildren(e,u,o,r,i,this,this._hostContainerInfo,a,s),u},mountChildren:function(e,n,o){var r=this._reconcilerInstantiateChildren(e,n,o);this._renderedChildren=r;var i=[],a=0;for(var u in r)if(r.hasOwnProperty(u)){var s=r[u],c=0;"production"!==t.env.NODE_ENV&&(c=_(this));var l=m.mountComponent(s,n,this,this._hostContainerInfo,o,c);s._mountIndex=a++,i.push(l)}return"production"!==t.env.NODE_ENV&&b.call(this,r),i},updateTextContent:function(e){var n=this._renderedChildren;v.unmountChildren(n,!1);for(var o in n)n.hasOwnProperty(o)&&("production"!==t.env.NODE_ENV?E(!1,"updateTextContent called on non-empty component."):l("118"));c(this,[u(e)])},updateMarkup:function(e){var n=this._renderedChildren;v.unmountChildren(n,!1);for(var o in n)n.hasOwnProperty(o)&&("production"!==t.env.NODE_ENV?E(!1,"updateTextContent called on non-empty component."):l("118"));c(this,[a(e)])},updateChildren:function(e,t,n){this._updateChildren(e,t,n)},_updateChildren:function(e,n,o){var r=this._renderedChildren,i={},a=[],u=this._reconcilerUpdateChildren(r,e,a,i,n,o);if(u||r){var l,p=null,d=0,f=0,h=0,v=null;for(l in u)if(u.hasOwnProperty(l)){var y=r&&r[l],g=u[l];y===g?(p=s(p,this.moveChild(y,v,d,f)),f=Math.max(y._mountIndex,f),y._mountIndex=d):(y&&(f=Math.max(y._mountIndex,f)),p=s(p,this._mountChildAtIndex(g,a[h],v,d,n,o)),h++),d++,v=m.getHostNode(g)}for(l in i)i.hasOwnProperty(l)&&(p=s(p,this._unmountChild(r[l],i[l])));p&&c(this,p),this._renderedChildren=u,"production"!==t.env.NODE_ENV&&b.call(this,u)}},unmountChildren:function(e){var t=this._renderedChildren;v.unmountChildren(t,e),this._renderedChildren=null},moveChild:function(e,t,n,o){if(e._mountIndex<o)return r(e,t,n)},createChild:function(e,t,n){return o(n,t,e._mountIndex)},removeChild:function(e,t){return i(e,t)},_mountChildAtIndex:function(e,t,n,o,r,i){return e._mountIndex=o,this.createChild(e,n,t)},_unmountChild:function(e,t){var n=this.removeChild(e,t);return e._mountIndex=null,n}}};e.exports=O}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,o,i,s){var c=void 0===e[i];"production"!==t.env.NODE_ENV&&(r||(r=n(12)),c||"production"!==t.env.NODE_ENV&&l(!1,"flattenChildren(...): Encountered two children with the same key, `%s`. Child keys must be unique; when two children share a key, only the first child will be used.%s",u.unescape(i),r.getStackAddendumByID(s))),null!=o&&c&&(e[i]=a(o,!0))}var r,i=n(27),a=n(99),u=n(63),s=n(62),c=n(103),l=n(3);void 0!==t&&t.env&&"test"===t.env.NODE_ENV&&(r=n(12));var p={instantiateChildren:function(e,n,r,i){if(null==e)return null;var a={};return"production"!==t.env.NODE_ENV?c(e,function(e,t,n){return o(e,t,n,i)},a):c(e,o,a),a},updateChildren:function(e,t,n,o,r,u,c,l,p){if(t||e){var d,f;for(d in t)if(t.hasOwnProperty(d)){f=e&&e[d];var h=f&&f._currentElement,m=t[d];if(null!=f&&s(h,m))i.receiveComponent(f,m,r,l),t[d]=f;else{f&&(o[d]=i.getHostNode(f),i.unmountComponent(f,!1));var v=a(m,!0);t[d]=v;var y=i.mountComponent(v,r,u,c,l,p);n.push(y)}}for(d in e)!e.hasOwnProperty(d)||t&&t.hasOwnProperty(d)||(f=e[d],o[d]=i.getHostNode(f),i.unmountComponent(f,!1))}},unmountChildren:function(e,t){for(var n in e)if(e.hasOwnProperty(n)){var o=e[n];i.unmountComponent(o,t)}}};e.exports=p}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){}function r(e,n){"production"!==t.env.NODE_ENV&&("production"!==t.env.NODE_ENV&&N(null===n||!1===n||l.isValidElement(n),"%s(...): A valid React element (or null) must be returned. You may have returned undefined, an array or some other invalid object.",e.displayName||e.name||"Component"),"production"!==t.env.NODE_ENV&&N(!e.childContextTypes,"%s(...): childContextTypes cannot be defined on a functional component.",e.displayName||e.name||"Component"))}function i(e){return!(!e.prototype||!e.prototype.isReactComponent)}function a(e){return!(!e.prototype||!e.prototype.isPureReactComponent)}function u(e,t,n){if(0===t)return e();m.debugTool.onBeginLifeCycleTimer(t,n);try{return e()}finally{m.debugTool.onEndLifeCycleTimer(t,n)}}var s=n(4),c=n(5),l=n(25),p=n(60),d=n(17),f=n(52),h=n(33),m=n(14),v=n(100),y=n(27);if("production"!==t.env.NODE_ENV)var g=n(194);var E=n(38),b=n(2),_=n(61),O=n(62),N=n(3),C={ImpureClass:0,PureClass:1,StatelessFunctional:2};o.prototype.render=function(){var e=h.get(this)._currentElement.type,t=e(this.props,this.context,this.updater);return r(e,t),t};var w=1,k={construct:function(e){this._currentElement=e,this._rootNodeID=0,this._compositeType=null,this._instance=null,this._hostParent=null,this._hostContainerInfo=null,this._updateBatchNumber=null,this._pendingElement=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._renderedNodeType=null,this._renderedComponent=null,this._context=null,this._mountOrder=0,this._topLevelWrapper=null,this._pendingCallbacks=null,this._calledComponentWillUnmount=!1,"production"!==t.env.NODE_ENV&&(this._warnedAboutRefsInRender=!1)},mountComponent:function(e,n,c,p){var d=this;this._context=p,this._mountOrder=w++,this._hostParent=n,this._hostContainerInfo=c;var f,m=this._currentElement.props,v=this._processContext(p),y=this._currentElement.type,g=e.getUpdateQueue(),_=i(y),O=this._constructComponent(_,m,v,g);if(_||null!=O&&null!=O.render?a(y)?this._compositeType=C.PureClass:this._compositeType=C.ImpureClass:(f=O,r(y,f),null===O||!1===O||l.isValidElement(O)||("production"!==t.env.NODE_ENV?b(!1,"%s(...): A valid React element (or null) must be returned. You may have returned undefined, an array or some other invalid object.",y.displayName||y.name||"Component"):s("105",y.displayName||y.name||"Component")),O=new o(y),this._compositeType=C.StatelessFunctional),"production"!==t.env.NODE_ENV){null==O.render&&"production"!==t.env.NODE_ENV&&N(!1,"%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.",y.displayName||y.name||"Component");var k=O.props!==m,T=y.displayName||y.name||"Component";"production"!==t.env.NODE_ENV&&N(void 0===O.props||!k,"%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.",T,T)}O.props=m,O.context=v,O.refs=E,O.updater=g,this._instance=O,h.set(O,this),"production"!==t.env.NODE_ENV&&("production"!==t.env.NODE_ENV&&N(!O.getInitialState||O.getInitialState.isReactClassApproved||O.state,"getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?",this.getName()||"a component"),"production"!==t.env.NODE_ENV&&N(!O.getDefaultProps||O.getDefaultProps.isReactClassApproved,"getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.",this.getName()||"a component"),"production"!==t.env.NODE_ENV&&N(!O.propTypes,"propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.",this.getName()||"a component"),"production"!==t.env.NODE_ENV&&N(!O.contextTypes,"contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.",this.getName()||"a component"),"production"!==t.env.NODE_ENV&&N("function"!=typeof O.componentShouldUpdate,"%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",this.getName()||"A component"),"production"!==t.env.NODE_ENV&&N("function"!=typeof O.componentDidUnmount,"%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?",this.getName()||"A component"),"production"!==t.env.NODE_ENV&&N("function"!=typeof O.componentWillRecieveProps,"%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?",this.getName()||"A component"));var D=O.state;void 0===D&&(O.state=D=null),("object"!=typeof D||Array.isArray(D))&&("production"!==t.env.NODE_ENV?b(!1,"%s.state: must be set to an object or null",this.getName()||"ReactCompositeComponent"):s("106",this.getName()||"ReactCompositeComponent")),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1;var P;return P=O.unstable_handleError?this.performInitialMountWithErrorHandling(f,n,c,e,p):this.performInitialMount(f,n,c,e,p),O.componentDidMount&&("production"!==t.env.NODE_ENV?e.getReactMountReady().enqueue(function(){u(function(){return O.componentDidMount()},d._debugID,"componentDidMount")}):e.getReactMountReady().enqueue(O.componentDidMount,O)),P},_constructComponent:function(e,n,o,r){if("production"===t.env.NODE_ENV)return this._constructComponentWithoutOwner(e,n,o,r);d.current=this;try{return this._constructComponentWithoutOwner(e,n,o,r)}finally{d.current=null}},_constructComponentWithoutOwner:function(e,n,o,r){var i=this._currentElement.type;return e?"production"!==t.env.NODE_ENV?u(function(){return new i(n,o,r)},this._debugID,"ctor"):new i(n,o,r):"production"!==t.env.NODE_ENV?u(function(){return i(n,o,r)},this._debugID,"render"):i(n,o,r)},performInitialMountWithErrorHandling:function(e,t,n,o,r){var i,a=o.checkpoint();try{i=this.performInitialMount(e,t,n,o,r)}catch(u){o.rollback(a),this._instance.unstable_handleError(u),this._pendingStateQueue&&(this._instance.state=this._processPendingState(this._instance.props,this._instance.context)),a=o.checkpoint(),this._renderedComponent.unmountComponent(!0),o.rollback(a),i=this.performInitialMount(e,t,n,o,r)}return i},performInitialMount:function(e,n,o,r,i){var a=this._instance,s=0;"production"!==t.env.NODE_ENV&&(s=this._debugID),a.componentWillMount&&("production"!==t.env.NODE_ENV?u(function(){return a.componentWillMount()},s,"componentWillMount"):a.componentWillMount(),this._pendingStateQueue&&(a.state=this._processPendingState(a.props,a.context))),void 0===e&&(e=this._renderValidatedComponent());var c=v.getType(e);this._renderedNodeType=c;var l=this._instantiateReactComponent(e,c!==v.EMPTY);this._renderedComponent=l;var p=y.mountComponent(l,r,n,o,this._processChildContext(i),s);if("production"!==t.env.NODE_ENV&&0!==s){var d=0!==l._debugID?[l._debugID]:[];m.debugTool.onSetChildren(s,d)}return p},getHostNode:function(){return y.getHostNode(this._renderedComponent)},unmountComponent:function(e){if(this._renderedComponent){var n=this._instance;if(n.componentWillUnmount&&!n._calledComponentWillUnmount)if(n._calledComponentWillUnmount=!0,e){var o=this.getName()+".componentWillUnmount()";f.invokeGuardedCallback(o,n.componentWillUnmount.bind(n))}else"production"!==t.env.NODE_ENV?u(function(){return n.componentWillUnmount()},this._debugID,"componentWillUnmount"):n.componentWillUnmount();this._renderedComponent&&(y.unmountComponent(this._renderedComponent,e),this._renderedNodeType=null,this._renderedComponent=null,this._instance=null),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._pendingCallbacks=null,this._pendingElement=null,this._context=null,this._rootNodeID=0,this._topLevelWrapper=null,h.remove(n)}},_maskContext:function(e){var t=this._currentElement.type,n=t.contextTypes;if(!n)return E;var o={};for(var r in n)o[r]=e[r];return o},_processContext:function(e){var n=this._maskContext(e);if("production"!==t.env.NODE_ENV){var o=this._currentElement.type;o.contextTypes&&this._checkContextTypes(o.contextTypes,n,"context")}return n},_processChildContext:function(e){var n,o=this._currentElement.type,r=this._instance;if(r.getChildContext)if("production"!==t.env.NODE_ENV){m.debugTool.onBeginProcessingChildContext();try{n=r.getChildContext()}finally{m.debugTool.onEndProcessingChildContext()}}else n=r.getChildContext();if(n){"object"!=typeof o.childContextTypes&&("production"!==t.env.NODE_ENV?b(!1,"%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().",this.getName()||"ReactCompositeComponent"):s("107",this.getName()||"ReactCompositeComponent")),"production"!==t.env.NODE_ENV&&this._checkContextTypes(o.childContextTypes,n,"child context");for(var i in n)i in o.childContextTypes||("production"!==t.env.NODE_ENV?b(!1,'%s.getChildContext(): key "%s" is not defined in childContextTypes.',this.getName()||"ReactCompositeComponent",i):s("108",this.getName()||"ReactCompositeComponent",i));return c({},e,n)}return e},_checkContextTypes:function(e,n,o){"production"!==t.env.NODE_ENV&&g(e,n,o,this.getName(),null,this._debugID)},receiveComponent:function(e,t,n){var o=this._currentElement,r=this._context;this._pendingElement=null,this.updateComponent(t,o,e,r,n)},performUpdateIfNecessary:function(e){null!=this._pendingElement?y.receiveComponent(this,this._pendingElement,e,this._context):null!==this._pendingStateQueue||this._pendingForceUpdate?this.updateComponent(e,this._currentElement,this._currentElement,this._context,this._context):this._updateBatchNumber=null},updateComponent:function(e,n,o,r,i){var a=this._instance;null==a&&("production"!==t.env.NODE_ENV?b(!1,"Attempted to update component `%s` that has already been unmounted (or failed to mount).",this.getName()||"ReactCompositeComponent"):s("136",this.getName()||"ReactCompositeComponent"));var c,l=!1;this._context===i?c=a.context:(c=this._processContext(i),l=!0);var p=n.props,d=o.props;n!==o&&(l=!0),l&&a.componentWillReceiveProps&&("production"!==t.env.NODE_ENV?u(function(){return a.componentWillReceiveProps(d,c)},this._debugID,"componentWillReceiveProps"):a.componentWillReceiveProps(d,c));var f=this._processPendingState(d,c),h=!0;this._pendingForceUpdate||(a.shouldComponentUpdate?h="production"!==t.env.NODE_ENV?u(function(){return a.shouldComponentUpdate(d,f,c)},this._debugID,"shouldComponentUpdate"):a.shouldComponentUpdate(d,f,c):this._compositeType===C.PureClass&&(h=!_(p,d)||!_(a.state,f))),"production"!==t.env.NODE_ENV&&"production"!==t.env.NODE_ENV&&N(void 0!==h,"%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.",this.getName()||"ReactCompositeComponent"),this._updateBatchNumber=null,h?(this._pendingForceUpdate=!1,this._performComponentUpdate(o,d,f,c,e,i)):(this._currentElement=o,this._context=i,a.props=d,a.state=f,a.context=c)},_processPendingState:function(e,t){var n=this._instance,o=this._pendingStateQueue,r=this._pendingReplaceState;if(this._pendingReplaceState=!1,this._pendingStateQueue=null,!o)return n.state;if(r&&1===o.length)return o[0];for(var i=c({},r?o[0]:n.state),a=r?1:0;a<o.length;a++){var u=o[a];c(i,"function"==typeof u?u.call(n,i,e,t):u)}return i},_performComponentUpdate:function(e,n,o,r,i,a){var s,c,l,p=this,d=this._instance,f=Boolean(d.componentDidUpdate);f&&(s=d.props,c=d.state,l=d.context),d.componentWillUpdate&&("production"!==t.env.NODE_ENV?u(function(){return d.componentWillUpdate(n,o,r)},this._debugID,"componentWillUpdate"):d.componentWillUpdate(n,o,r)),this._currentElement=e,this._context=a,d.props=n,d.state=o,d.context=r,this._updateRenderedComponent(i,a),f&&("production"!==t.env.NODE_ENV?i.getReactMountReady().enqueue(function(){u(d.componentDidUpdate.bind(d,s,c,l),p._debugID,"componentDidUpdate")}):i.getReactMountReady().enqueue(d.componentDidUpdate.bind(d,s,c,l),d))},_updateRenderedComponent:function(e,n){var o=this._renderedComponent,r=o._currentElement,i=this._renderValidatedComponent(),a=0;if("production"!==t.env.NODE_ENV&&(a=this._debugID),O(r,i))y.receiveComponent(o,i,e,this._processChildContext(n));else{var u=y.getHostNode(o);y.unmountComponent(o,!1);var s=v.getType(i);this._renderedNodeType=s;var c=this._instantiateReactComponent(i,s!==v.EMPTY);this._renderedComponent=c;var l=y.mountComponent(c,e,this._hostParent,this._hostContainerInfo,this._processChildContext(n),a);if("production"!==t.env.NODE_ENV&&0!==a){var p=0!==c._debugID?[c._debugID]:[];m.debugTool.onSetChildren(a,p)}this._replaceNodeWithMarkup(u,l,o)}},_replaceNodeWithMarkup:function(e,t,n){p.replaceNodeWithMarkup(e,t,n)},_renderValidatedComponentWithoutOwnerOrContext:function(){var e,n=this._instance;return e="production"!==t.env.NODE_ENV?u(function(){return n.render()},this._debugID,"render"):n.render(),"production"!==t.env.NODE_ENV&&void 0===e&&n.render._isMockFunction&&(e=null),e},_renderValidatedComponent:function(){var e;if("production"!==t.env.NODE_ENV||this._compositeType!==C.StatelessFunctional){d.current=this;try{e=this._renderValidatedComponentWithoutOwnerOrContext()}finally{d.current=null}}else e=this._renderValidatedComponentWithoutOwnerOrContext();return null===e||!1===e||l.isValidElement(e)||("production"!==t.env.NODE_ENV?b(!1,"%s.render(): A valid React element (or null) must be returned. You may have returned undefined, an array or some other invalid object.",this.getName()||"ReactCompositeComponent"):s("109",this.getName()||"ReactCompositeComponent")),e},attachRef:function(e,n){var o=this.getPublicInstance();null==o&&("production"!==t.env.NODE_ENV?b(!1,"Stateless function components cannot have refs."):s("110"));var r=n.getPublicInstance();if("production"!==t.env.NODE_ENV){var i=n&&n.getName?n.getName():"a component";"production"!==t.env.NODE_ENV&&N(null!=r||n._compositeType!==C.StatelessFunctional,'Stateless function components cannot be given refs (See ref "%s" in %s created by %s). Attempts to access this ref will fail.',e,i,this.getName())}(o.refs===E?o.refs={}:o.refs)[e]=r},detachRef:function(e){delete this.getPublicInstance().refs[e]},getName:function(){var e=this._currentElement.type,t=this._instance&&this._instance.constructor;return e.displayName||t&&t.displayName||e.name||t&&t.name||null},getPublicInstance:function(){var e=this._instance;return this._compositeType===C.StatelessFunctional?null:e},_instantiateReactComponent:null};e.exports=k}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,o,p,d,f,h){for(var m in e)if(e.hasOwnProperty(m)){var v;try{"function"!=typeof e[m]&&("production"!==t.env.NODE_ENV?s(!1,"%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",d||"React class",a[p],m):i("84",d||"React class",a[p],m)),v=e[m](o,m,d,p,null,u)}catch(e){v=e}if("production"!==t.env.NODE_ENV&&c(!v||v instanceof Error,"%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",d||"React class",a[p],m,typeof v),v instanceof Error&&!(v.message in l)){l[v.message]=!0;var y="";"production"!==t.env.NODE_ENV&&(r||(r=n(12)),null!==h?y=r.getStackAddendumByID(h):null!==f&&(y=r.getCurrentStackAddendum(f))),"production"!==t.env.NODE_ENV&&c(!1,"Failed %s type: %s%s",p,v.message,y)}}}var r,i=n(4),a=n(195),u=n(97),s=n(2),c=n(3);void 0!==t&&t.env&&"test"===t.env.NODE_ENV&&(r=n(12));var l={};e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var n={};"production"!==t.env.NODE_ENV&&(n={prop:"prop",context:"context",childContext:"child context"}),e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";function o(){return r++}var r=1;e.exports=o},function(e,t,n){"use strict";var o="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;e.exports=o},function(e,t,n){"use strict";function o(e){var t=e&&(r&&e[r]||e[i]);if("function"==typeof t)return t}var r="function"==typeof Symbol&&Symbol.iterator,i="@@iterator";e.exports=o},function(e,t,n){"use strict";(function(t){function o(e,o,r,u){if(e&&"object"==typeof e){var c=e,l=void 0===c[r];"production"!==t.env.NODE_ENV&&(i||(i=n(12)),l||"production"!==t.env.NODE_ENV&&s(!1,"flattenChildren(...): Encountered two children with the same key, `%s`. Child keys must be unique; when two children share a key, only the first child will be used.%s",a.unescape(r),i.getStackAddendumByID(u))),l&&null!=o&&(c[r]=o)}}function r(e,n){if(null==e)return e;var r={};return"production"!==t.env.NODE_ENV?u(e,function(e,t,r){return o(e,t,r,n)},r):u(e,o,r),r}var i,a=n(63),u=n(103),s=n(3);void 0!==t&&t.env&&"test"===t.env.NODE_ENV&&(i=n(12)),e.exports=r}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e){this.reinitializeTransaction(),this.renderToStaticMarkup=e,this.useCreateElement=!1,this.updateQueue=new s(this)}var r=n(5),i=n(22),a=n(40),u=n(14),s=n(201),c=[];"production"!==t.env.NODE_ENV&&c.push({initialize:u.debugTool.onBeginFlush,close:u.debugTool.onEndFlush});var l={enqueue:function(){}},p={getTransactionWrappers:function(){return c},getReactMountReady:function(){return l},getUpdateQueue:function(){return this.updateQueue},destructor:function(){},checkpoint:function(){},rollback:function(){}};r(o.prototype,a,p),i.addPoolingTo(o),e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,n){if("production"!==t.env.NODE_ENV){var o=e.constructor;"production"!==t.env.NODE_ENV&&a(!1,"%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op. Please check the code for the %s component.",n,n,o&&(o.displayName||o.name)||"ReactClass")}}var i=n(64),a=n(3),u=function(){function e(t){o(this,e),this.transaction=t}return e.prototype.isMounted=function(e){return!1},e.prototype.enqueueCallback=function(e,t,n){this.transaction.isInTransaction()&&i.enqueueCallback(e,t,n)},e.prototype.enqueueForceUpdate=function(e){this.transaction.isInTransaction()?i.enqueueForceUpdate(e):r(e,"forceUpdate")},e.prototype.enqueueReplaceState=function(e,t){this.transaction.isInTransaction()?i.enqueueReplaceState(e,t):r(e,"replaceState")},e.prototype.enqueueSetState=function(e,t){this.transaction.isInTransaction()?i.enqueueSetState(e,t):r(e,"setState")},e}();e.exports=u}).call(t,n(0))},function(e,t,n){"use strict";var o=n(5),r=n(28),i=n(6),a=function(e){this._currentElement=null,this._hostNode=null,this._hostParent=null,this._hostContainerInfo=null,this._domID=0};o(a.prototype,{mountComponent:function(e,t,n,o){var a=n._idCounter++;this._domID=a,this._hostParent=t,this._hostContainerInfo=n;var u=" react-empty: "+this._domID+" ";if(e.useCreateElement){var s=n._ownerDocument,c=s.createComment(u);return i.precacheNode(this,c),r(c)}return e.renderToStaticMarkup?"":"\x3c!--"+u+"--\x3e"},receiveComponent:function(){},getHostNode:function(){return i.getNodeFromInstance(this)},unmountComponent:function(){i.uncacheNode(this)}}),e.exports=a},function(e,t,n){"use strict";(function(t){function o(e,n){"_hostNode"in e||("production"!==t.env.NODE_ENV?c(!1,"getNodeFromInstance: Invalid argument."):s("33")),"_hostNode"in n||("production"!==t.env.NODE_ENV?c(!1,"getNodeFromInstance: Invalid argument."):s("33"));for(var o=0,r=e;r;r=r._hostParent)o++;for(var i=0,a=n;a;a=a._hostParent)i++;for(;o-i>0;)e=e._hostParent,o--;for(;i-o>0;)n=n._hostParent,i--;for(var u=o;u--;){if(e===n)return e;e=e._hostParent,n=n._hostParent}return null}function r(e,n){"_hostNode"in e||("production"!==t.env.NODE_ENV?c(!1,"isAncestor: Invalid argument."):s("35")),"_hostNode"in n||("production"!==t.env.NODE_ENV?c(!1,"isAncestor: Invalid argument."):s("35"));for(;n;){if(n===e)return!0;n=n._hostParent}return!1}function i(e){return"_hostNode"in e||("production"!==t.env.NODE_ENV?c(!1,"getParentInstance: Invalid argument."):s("36")),e._hostParent}function a(e,t,n){for(var o=[];e;)o.push(e),e=e._hostParent;var r;for(r=o.length;r-- >0;)t(o[r],"captured",n);for(r=0;r<o.length;r++)t(o[r],"bubbled",n)}function u(e,t,n,r,i){for(var a=e&&t?o(e,t):null,u=[];e&&e!==a;)u.push(e),e=e._hostParent;for(var s=[];t&&t!==a;)s.push(t),t=t._hostParent;var c;for(c=0;c<u.length;c++)n(u[c],"bubbled",r);for(c=s.length;c-- >0;)n(s[c],"captured",i)}var s=n(4),c=n(2);e.exports={isAncestor:r,getLowestCommonAncestor:o,getParentInstance:i,traverseTwoPhase:a,traverseEnterLeave:u}}).call(t,n(0))},function(e,t,n){"use strict";(function(t){var o=n(4),r=n(5),i=n(56),a=n(28),u=n(6),s=n(43),c=n(2),l=n(65),p=function(e){this._currentElement=e,this._stringText=""+e,this._hostNode=null,this._hostParent=null,this._domID=0,this._mountIndex=0,this._closingComment=null,this._commentNodes=null};r(p.prototype,{mountComponent:function(e,n,o,r){if("production"!==t.env.NODE_ENV){var i;null!=n?i=n._ancestorInfo:null!=o&&(i=o._ancestorInfo),i&&l(null,this._stringText,this,i)}var c=o._idCounter++,p=" react-text: "+c+" ";if(this._domID=c,this._hostParent=n,e.useCreateElement){var d=o._ownerDocument,f=d.createComment(p),h=d.createComment(" /react-text "),m=a(d.createDocumentFragment());return a.queueChild(m,a(f)),this._stringText&&a.queueChild(m,a(d.createTextNode(this._stringText))),a.queueChild(m,a(h)),u.precacheNode(this,f),this._closingComment=h,m}var v=s(this._stringText);return e.renderToStaticMarkup?v:"\x3c!--"+p+"--\x3e"+v+"\x3c!-- /react-text --\x3e"},receiveComponent:function(e,t){if(e!==this._currentElement){this._currentElement=e;var n=""+e;if(n!==this._stringText){this._stringText=n;var o=this.getHostNode();i.replaceDelimitedText(o[0],o[1],n)}}},getHostNode:function(){var e=this._commentNodes;if(e)return e;if(!this._closingComment)for(var n=u.getNodeFromInstance(this),r=n.nextSibling;;){if(null==r&&("production"!==t.env.NODE_ENV?c(!1,"Missing closing comment for text component %s",this._domID):o("67",this._domID)),8===r.nodeType&&" /react-text "===r.nodeValue){this._closingComment=r;break}r=r.nextSibling}return e=[this._hostNode,this._closingComment],this._commentNodes=e,e},unmountComponent:function(){this._closingComment=null,this._commentNodes=null,u.uncacheNode(this)}}),e.exports=p}).call(t,n(0))},function(e,t,n){"use strict";function o(){this.reinitializeTransaction()}var r=n(5),i=n(18),a=n(40),u=n(13),s={initialize:u,close:function(){d.isBatchingUpdates=!1}},c={initialize:u,close:i.flushBatchedUpdates.bind(i)},l=[c,s];r(o.prototype,a,{getTransactionWrappers:function(){return l}});var p=new o,d={isBatchingUpdates:!1,batchedUpdates:function(e,t,n,o,r,i){var a=d.isBatchingUpdates;return d.isBatchingUpdates=!0,a?e(t,n,o,r,i):p.perform(e,null,t,n,o,r,i)}};e.exports=d},function(e,t,n){"use strict";function o(e){for(;e._hostParent;)e=e._hostParent;var t=p.getNodeFromInstance(e),n=t.parentNode;return p.getClosestInstanceFromNode(n)}function r(e,t){this.topLevelType=e,this.nativeEvent=t,this.ancestors=[]}function i(e){var t=f(e.nativeEvent),n=p.getClosestInstanceFromNode(t),r=n;do{e.ancestors.push(r),r=r&&o(r)}while(r);for(var i=0;i<e.ancestors.length;i++)n=e.ancestors[i],m._handleTopLevel(e.topLevelType,n,e.nativeEvent,f(e.nativeEvent))}function a(e){e(h(window))}var u=n(5),s=n(104),c=n(7),l=n(22),p=n(6),d=n(18),f=n(53),h=n(207);u(r.prototype,{destructor:function(){this.topLevelType=null,this.nativeEvent=null,this.ancestors.length=0}}),l.addPoolingTo(r,l.twoArgumentPooler);var m={_enabled:!0,_handleTopLevel:null,WINDOW_HANDLE:c.canUseDOM?window:null,setHandleTopLevel:function(e){m._handleTopLevel=e},setEnabled:function(e){m._enabled=!!e},isEnabled:function(){return m._enabled},trapBubbledEvent:function(e,t,n){return n?s.listen(n,t,m.dispatchEvent.bind(null,e)):null},trapCapturedEvent:function(e,t,n){return n?s.capture(n,t,m.dispatchEvent.bind(null,e)):null},monitorScrollValue:function(e){var t=a.bind(null,e);s.listen(window,"scroll",t)},dispatchEvent:function(e,t){if(m._enabled){var n=r.getPooled(e,t);try{d.batchedUpdates(i,n)}finally{r.release(n)}}}};e.exports=m},function(e,t,n){"use strict";function o(e){return e.Window&&e instanceof e.Window?{x:e.pageXOffset||e.document.documentElement.scrollLeft,y:e.pageYOffset||e.document.documentElement.scrollTop}:{x:e.scrollLeft,y:e.scrollTop}}e.exports=o},function(e,t,n){"use strict";var o=n(20),r=n(31),i=n(51),a=n(60),u=n(101),s=n(44),c=n(102),l=n(18),p={Component:a.injection,DOMProperty:o.injection,EmptyComponent:u.injection,EventPluginHub:r.injection,EventPluginUtils:i.injection,EventEmitter:s.injection,HostComponent:c.injection,Updates:l.injection};e.exports=p},function(e,t,n){"use strict";(function(t){function o(e){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=i.getPooled(null),this.useCreateElement=e}var r=n(5),i=n(88),a=n(22),u=n(44),s=n(105),c=n(14),l=n(40),p=n(64),d={initialize:s.getSelectionInformation,close:s.restoreSelection},f={initialize:function(){var e=u.isEnabled();return u.setEnabled(!1),e},close:function(e){u.setEnabled(e)}},h={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},m=[d,f,h];"production"!==t.env.NODE_ENV&&m.push({initialize:c.debugTool.onBeginFlush,close:c.debugTool.onEndFlush});var v={getTransactionWrappers:function(){return m},getReactMountReady:function(){return this.reactMountReady},getUpdateQueue:function(){return p},checkpoint:function(){return this.reactMountReady.checkpoint()},rollback:function(e){this.reactMountReady.rollback(e)},destructor:function(){i.release(this.reactMountReady),this.reactMountReady=null}};r(o.prototype,l,v),a.addPoolingTo(o),e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n,o){return e===n&&t===o}function r(e){var t=document.selection,n=t.createRange(),o=n.text.length,r=n.duplicate();r.moveToElementText(e),r.setEndPoint("EndToStart",n);var i=r.text.length;return{start:i,end:i+o}}function i(e){var t=window.getSelection&&window.getSelection();if(!t||0===t.rangeCount)return null;var n=t.anchorNode,r=t.anchorOffset,i=t.focusNode,a=t.focusOffset,u=t.getRangeAt(0);try{u.startContainer.nodeType,u.endContainer.nodeType}catch(e){return null}var s=o(t.anchorNode,t.anchorOffset,t.focusNode,t.focusOffset),c=s?0:u.toString().length,l=u.cloneRange();l.selectNodeContents(e),l.setEnd(u.startContainer,u.startOffset);var p=o(l.startContainer,l.startOffset,l.endContainer,l.endOffset),d=p?0:l.toString().length,f=d+c,h=document.createRange();h.setStart(n,r),h.setEnd(i,a);var m=h.collapsed;return{start:m?f:d,end:m?d:f}}function a(e,t){var n,o,r=document.selection.createRange().duplicate();void 0===t.end?(n=t.start,o=n):t.start>t.end?(n=t.end,o=t.start):(n=t.start,o=t.end),r.moveToElementText(e),r.moveStart("character",n),r.setEndPoint("EndToStart",r),r.moveEnd("character",o-n),r.select()}function u(e,t){if(window.getSelection){var n=window.getSelection(),o=e[l()].length,r=Math.min(t.start,o),i=void 0===t.end?r:Math.min(t.end,o);if(!n.extend&&r>i){var a=i;i=r,r=a}var u=c(e,r),s=c(e,i);if(u&&s){var p=document.createRange();p.setStart(u.node,u.offset),n.removeAllRanges(),r>i?(n.addRange(p),n.extend(s.node,s.offset)):(p.setEnd(s.node,s.offset),n.addRange(p))}}}var s=n(7),c=n(211),l=n(87),p=s.canUseDOM&&"selection"in document&&!("getSelection"in window),d={getOffsets:p?r:i,setOffsets:p?a:u};e.exports=d},function(e,t,n){"use strict";function o(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function r(e){for(;e;){if(e.nextSibling)return e.nextSibling;e=e.parentNode}}function i(e,t){for(var n=o(e),i=0,a=0;n;){if(3===n.nodeType){if(a=i+n.textContent.length,i<=t&&a>=t)return{node:n,offset:t-i};i=a}n=o(r(n))}}e.exports=i},function(e,t,n){"use strict";function o(e,t){return!(!e||!t)&&(e===t||!r(e)&&(r(t)?o(e,t.parentNode):"contains"in e?e.contains(t):!!e.compareDocumentPosition&&!!(16&e.compareDocumentPosition(t))))}var r=n(213);e.exports=o},function(e,t,n){"use strict";function o(e){return r(e)&&3==e.nodeType}var r=n(214);e.exports=o},function(e,t,n){"use strict";function o(e){var t=e?e.ownerDocument||e:document,n=t.defaultView||window;return!(!e||!("function"==typeof n.Node?e instanceof n.Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}e.exports=o},function(e,t,n){"use strict";var o={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},r={accentHeight:"accent-height",accumulate:0,additive:0,alignmentBaseline:"alignment-baseline",allowReorder:"allowReorder",alphabetic:0,amplitude:0,arabicForm:"arabic-form",ascent:0,attributeName:"attributeName",attributeType:"attributeType",autoReverse:"autoReverse",azimuth:0,baseFrequency:"baseFrequency",baseProfile:"baseProfile",baselineShift:"baseline-shift",bbox:0,begin:0,bias:0,by:0,calcMode:"calcMode",capHeight:"cap-height",clip:0,clipPath:"clip-path",clipRule:"clip-rule",clipPathUnits:"clipPathUnits",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",contentScriptType:"contentScriptType",contentStyleType:"contentStyleType",cursor:0,cx:0,cy:0,d:0,decelerate:0,descent:0,diffuseConstant:"diffuseConstant",direction:0,display:0,divisor:0,dominantBaseline:"dominant-baseline",dur:0,dx:0,dy:0,edgeMode:"edgeMode",elevation:0,enableBackground:"enable-background",end:0,exponent:0,externalResourcesRequired:"externalResourcesRequired",fill:0,fillOpacity:"fill-opacity",fillRule:"fill-rule",filter:0,filterRes:"filterRes",filterUnits:"filterUnits",floodColor:"flood-color",floodOpacity:"flood-opacity",focusable:0,fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",format:0,from:0,fx:0,fy:0,g1:0,g2:0,glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",glyphRef:"glyphRef",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",hanging:0,horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",ideographic:0,imageRendering:"image-rendering",in:0,in2:0,intercept:0,k:0,k1:0,k2:0,k3:0,k4:0,kernelMatrix:"kernelMatrix",kernelUnitLength:"kernelUnitLength",kerning:0,keyPoints:"keyPoints",keySplines:"keySplines",keyTimes:"keyTimes",lengthAdjust:"lengthAdjust",letterSpacing:"letter-spacing",lightingColor:"lighting-color",limitingConeAngle:"limitingConeAngle",local:0,markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",markerHeight:"markerHeight",markerUnits:"markerUnits",markerWidth:"markerWidth",mask:0,maskContentUnits:"maskContentUnits",maskUnits:"maskUnits",mathematical:0,mode:0,numOctaves:"numOctaves",offset:0,opacity:0,operator:0,order:0,orient:0,orientation:0,origin:0,overflow:0,overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pathLength:"pathLength",patternContentUnits:"patternContentUnits",patternTransform:"patternTransform",patternUnits:"patternUnits",pointerEvents:"pointer-events",points:0,pointsAtX:"pointsAtX",pointsAtY:"pointsAtY",pointsAtZ:"pointsAtZ",preserveAlpha:"preserveAlpha",preserveAspectRatio:"preserveAspectRatio",primitiveUnits:"primitiveUnits",r:0,radius:0,refX:"refX",refY:"refY",renderingIntent:"rendering-intent",repeatCount:"repeatCount",repeatDur:"repeatDur",requiredExtensions:"requiredExtensions",requiredFeatures:"requiredFeatures",restart:0,result:0,rotate:0,rx:0,ry:0,scale:0,seed:0,shapeRendering:"shape-rendering",slope:0,spacing:0,specularConstant:"specularConstant",specularExponent:"specularExponent",speed:0,spreadMethod:"spreadMethod",startOffset:"startOffset",stdDeviation:"stdDeviation",stemh:0,stemv:0,stitchTiles:"stitchTiles",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",string:0,stroke:0,strokeDasharray:"stroke-dasharray",strokeDashoffset:"stroke-dashoffset",strokeLinecap:"stroke-linecap",strokeLinejoin:"stroke-linejoin",strokeMiterlimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",surfaceScale:"surfaceScale",systemLanguage:"systemLanguage",tableValues:"tableValues",targetX:"targetX",targetY:"targetY",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",textLength:"textLength",to:0,transform:0,u1:0,u2:0,underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicode:0,unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",values:0,vectorEffect:"vector-effect",version:0,vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",viewBox:"viewBox",viewTarget:"viewTarget",visibility:0,widths:0,wordSpacing:"word-spacing",writingMode:"writing-mode",x:0,xHeight:"x-height",x1:0,x2:0,xChannelSelector:"xChannelSelector",xlinkActuate:"xlink:actuate",xlinkArcrole:"xlink:arcrole",xlinkHref:"xlink:href",xlinkRole:"xlink:role",xlinkShow:"xlink:show",xlinkTitle:"xlink:title",xlinkType:"xlink:type",xmlBase:"xml:base",xmlns:0,xmlnsXlink:"xmlns:xlink",xmlLang:"xml:lang",xmlSpace:"xml:space",y:0,y1:0,y2:0,yChannelSelector:"yChannelSelector",z:0,zoomAndPan:"zoomAndPan"},i={Properties:{},DOMAttributeNamespaces:{xlinkActuate:o.xlink,xlinkArcrole:o.xlink,xlinkHref:o.xlink,xlinkRole:o.xlink,xlinkShow:o.xlink,xlinkTitle:o.xlink,xlinkType:o.xlink,xmlBase:o.xml,xmlLang:o.xml,xmlSpace:o.xml},DOMAttributeNames:{}};Object.keys(r).forEach(function(e){i.Properties[e]=0,r[e]&&(i.DOMAttributeNames[e]=r[e])}),e.exports=i},function(e,t,n){"use strict";function o(e){if("selectionStart"in e&&s.hasSelectionCapabilities(e))return{start:e.selectionStart,end:e.selectionEnd};if(window.getSelection){var t=window.getSelection();return{anchorNode:t.anchorNode,anchorOffset:t.anchorOffset,focusNode:t.focusNode,focusOffset:t.focusOffset}}if(document.selection){var n=document.selection.createRange();return{parentElement:n.parentElement(),text:n.text,top:n.boundingTop,left:n.boundingLeft}}}function r(e,t){if(g||null==m||m!==l())return null;var n=o(m);if(!y||!d(y,n)){y=n;var r=c.getPooled(h.select,v,e,t);return r.type="select",r.target=m,i.accumulateTwoPhaseDispatches(r),r}return null}var i=n(30),a=n(7),u=n(6),s=n(105),c=n(19),l=n(106),p=n(91),d=n(61),f=a.canUseDOM&&"documentMode"in document&&document.documentMode<=11,h={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:["topBlur","topContextMenu","topFocus","topKeyDown","topKeyUp","topMouseDown","topMouseUp","topSelectionChange"]}},m=null,v=null,y=null,g=!1,E=!1,b={eventTypes:h,extractEvents:function(e,t,n,o){if(!E)return null;var i=t?u.getNodeFromInstance(t):window;switch(e){case"topFocus":(p(i)||"true"===i.contentEditable)&&(m=i,v=t,y=null);break;case"topBlur":m=null,v=null,y=null;break;case"topMouseDown":g=!0;break;case"topContextMenu":case"topMouseUp":return g=!1,r(n,o);case"topSelectionChange":if(f)break;case"topKeyDown":case"topKeyUp":return r(n,o)}return null},didPutListener:function(e,t,n){"onSelect"===t&&(E=!0)}};e.exports=b},function(e,t,n){"use strict";(function(t){function o(e){return"."+e._rootNodeID}function r(e){return"button"===e||"input"===e||"select"===e||"textarea"===e}var i=n(4),a=n(104),u=n(30),s=n(6),c=n(218),l=n(219),p=n(19),d=n(220),f=n(221),h=n(41),m=n(223),v=n(224),y=n(225),g=n(32),E=n(226),b=n(13),_=n(66),O=n(2),N={},C={};["abort","animationEnd","animationIteration","animationStart","blur","canPlay","canPlayThrough","click","contextMenu","copy","cut","doubleClick","drag","dragEnd","dragEnter","dragExit","dragLeave","dragOver","dragStart","drop","durationChange","emptied","encrypted","ended","error","focus","input","invalid","keyDown","keyPress","keyUp","load","loadedData","loadedMetadata","loadStart","mouseDown","mouseMove","mouseOut","mouseOver","mouseUp","paste","pause","play","playing","progress","rateChange","reset","scroll","seeked","seeking","stalled","submit","suspend","timeUpdate","touchCancel","touchEnd","touchMove","touchStart","transitionEnd","volumeChange","waiting","wheel"].forEach(function(e){var t=e[0].toUpperCase()+e.slice(1),n="on"+t,o="top"+t,r={phasedRegistrationNames:{bubbled:n,captured:n+"Capture"},dependencies:[o]};N[e]=r,C[o]=r});var w={},k={eventTypes:N,extractEvents:function(e,n,o,r){var a=C[e];if(!a)return null;var s;switch(e){case"topAbort":case"topCanPlay":case"topCanPlayThrough":case"topDurationChange":case"topEmptied":case"topEncrypted":case"topEnded":case"topError":case"topInput":case"topInvalid":case"topLoad":case"topLoadedData":case"topLoadedMetadata":case"topLoadStart":case"topPause":case"topPlay":case"topPlaying":case"topProgress":case"topRateChange":case"topReset":case"topSeeked":case"topSeeking":case"topStalled":case"topSubmit":case"topSuspend":case"topTimeUpdate":case"topVolumeChange":case"topWaiting":s=p;break;case"topKeyPress":if(0===_(o))return null;case"topKeyDown":case"topKeyUp":s=f;break;case"topBlur":case"topFocus":s=d;break;case"topClick":if(2===o.button)return null;case"topDoubleClick":case"topMouseDown":case"topMouseMove":case"topMouseUp":case"topMouseOut":case"topMouseOver":case"topContextMenu":s=h;break;case"topDrag":case"topDragEnd":case"topDragEnter":case"topDragExit":case"topDragLeave":case"topDragOver":case"topDragStart":case"topDrop":s=m;break;case"topTouchCancel":case"topTouchEnd":case"topTouchMove":case"topTouchStart":s=v;break;case"topAnimationEnd":case"topAnimationIteration":case"topAnimationStart":s=c;break;case"topTransitionEnd":s=y;break;case"topScroll":s=g;break;case"topWheel":s=E;break;case"topCopy":case"topCut":case"topPaste":s=l}s||("production"!==t.env.NODE_ENV?O(!1,"SimpleEventPlugin: Unhandled event type, `%s`.",e):i("86",e));var b=s.getPooled(a,n,o,r);return u.accumulateTwoPhaseDispatches(b),b},didPutListener:function(e,t,n){if("onClick"===t&&!r(e._tag)){var i=o(e),u=s.getNodeFromInstance(e);w[i]||(w[i]=a.listen(u,"click",b))}},willDeleteListener:function(e,t){if("onClick"===t&&!r(e._tag)){var n=o(e);w[n].remove(),delete w[n]}}};e.exports=k}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(19),i={animationName:null,elapsedTime:null,pseudoElement:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(19),i={clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(32),i={relatedTarget:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(32),i=n(66),a=n(222),u=n(55),s={key:a,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:u,charCode:function(e){return"keypress"===e.type?i(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?i(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}};r.augmentClass(o,s),e.exports=o},function(e,t,n){"use strict";function o(e){if(e.key){var t=i[e.key]||e.key;if("Unidentified"!==t)return t}if("keypress"===e.type){var n=r(e);return 13===n?"Enter":String.fromCharCode(n)}return"keydown"===e.type||"keyup"===e.type?a[e.keyCode]||"Unidentified":""}var r=n(66),i={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},a={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(41),i={dataTransfer:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(32),i=n(55),a={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:i};r.augmentClass(o,a),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(19),i={propertyName:null,elapsedTime:null,pseudoElement:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";function o(e,t,n,o){return r.call(this,e,t,n,o)}var r=n(41),i={deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null};r.augmentClass(o,i),e.exports=o},function(e,t,n){"use strict";(function(t){function o(e,n){var o={_topLevelWrapper:e,_idCounter:1,_ownerDocument:n?n.nodeType===i?n:n.ownerDocument:null,_node:n,_tag:n?n.nodeName.toLowerCase():null,_namespaceURI:n?n.namespaceURI:null};return"production"!==t.env.NODE_ENV&&(o._ancestorInfo=n?r.updatedAncestorInfo(null,o._tag,null):null),o}var r=n(65),i=9;e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";var o={useCreateElement:!0,useFiber:!1};e.exports=o},function(e,t,n){"use strict";var o=n(230),r=/\/?>/,i=/^<\!\-\-/,a={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(e){var t=o(e);return i.test(e)?e:e.replace(r," "+a.CHECKSUM_ATTR_NAME+'="'+t+'"$&')},canReuseMarkup:function(e,t){var n=t.getAttribute(a.CHECKSUM_ATTR_NAME);return n=n&&parseInt(n,10),o(e)===n}};e.exports=a},function(e,t,n){"use strict";function o(e){for(var t=1,n=0,o=0,i=e.length,a=-4&i;o<a;){for(var u=Math.min(o+4096,a);o<u;o+=4)n+=(t+=e.charCodeAt(o))+(t+=e.charCodeAt(o+1))+(t+=e.charCodeAt(o+2))+(t+=e.charCodeAt(o+3));t%=r,n%=r}for(;o<i;o++)n+=t+=e.charCodeAt(o);return t%=r,n%=r,t|n<<16}var r=65521;e.exports=o},function(e,t,n){"use strict";e.exports="15.6.1"},function(e,t,n){"use strict";(function(t){function o(e){if("production"!==t.env.NODE_ENV){var n=i.current;null!==n&&("production"!==t.env.NODE_ENV&&l(n._warnedAboutRefsInRender,"%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.",n.getName()||"A component"),n._warnedAboutRefsInRender=!0)}if(null==e)return null;if(1===e.nodeType)return e;var o=u.get(e);if(o)return o=s(o),o?a.getNodeFromInstance(o):null;"function"==typeof e.render?"production"!==t.env.NODE_ENV?c(!1,"findDOMNode was called on an unmounted component."):r("44"):"production"!==t.env.NODE_ENV?c(!1,"Element appears to be neither ReactComponent nor DOMNode (keys: %s)",Object.keys(e)):r("45",Object.keys(e))}var r=n(4),i=n(17),a=n(6),u=n(33),s=n(108),c=n(2),l=n(3);e.exports=o}).call(t,n(0))},function(e,t,n){"use strict";var o=n(107);e.exports=o.renderSubtreeIntoContainer},function(e,t,n){"use strict";(function(t){function o(e,t){null!=t&&"string"==typeof t.type&&(t.type.indexOf("-")>=0||t.props.is||p(e,t))}var r=n(20),i=n(39),a=n(12),u=n(3);if("production"!==t.env.NODE_ENV)var s={children:!0,dangerouslySetInnerHTML:!0,key:!0,ref:!0,autoFocus:!0,defaultValue:!0,valueLink:!0,defaultChecked:!0,checkedLink:!0,innerHTML:!0,suppressContentEditableWarning:!0,onFocusIn:!0,onFocusOut:!0},c={},l=function(e,n,o){if(r.properties.hasOwnProperty(n)||r.isCustomAttribute(n))return!0;if(s.hasOwnProperty(n)&&s[n]||c.hasOwnProperty(n)&&c[n])return!0;if(i.registrationNameModules.hasOwnProperty(n))return!0;c[n]=!0;var l=n.toLowerCase(),p=r.isCustomAttribute(l)?l:r.getPossibleStandardName.hasOwnProperty(l)?r.getPossibleStandardName[l]:null,d=i.possibleRegistrationNames.hasOwnProperty(l)?i.possibleRegistrationNames[l]:null;return null!=p?("production"!==t.env.NODE_ENV&&u(!1,"Unknown DOM property %s. Did you mean %s?%s",n,p,a.getStackAddendumByID(o)),!0):null!=d&&("production"!==t.env.NODE_ENV&&u(!1,"Unknown event handler property %s. Did you mean `%s`?%s",n,d,a.getStackAddendumByID(o)),!0)};var p=function(e,n){var o=[];for(var r in n.props){l(n.type,r,e)||o.push(r)}var i=o.map(function(e){return"`"+e+"`"}).join(", ");1===o.length?"production"!==t.env.NODE_ENV&&u(!1,"Unknown prop %s on <%s> tag. Remove this prop from the element. For details, see https://fb.me/react-unknown-prop%s",i,n.type,a.getStackAddendumByID(e)):o.length>1&&"production"!==t.env.NODE_ENV&&u(!1,"Unknown props %s on <%s> tag. Remove these props from the element. For details, see https://fb.me/react-unknown-prop%s",i,n.type,a.getStackAddendumByID(e))},d={onBeforeMountComponent:function(e,t){o(e,t)},onBeforeUpdateComponent:function(e,t){o(e,t)}};e.exports=d}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,n){null!=n&&("input"!==n.type&&"textarea"!==n.type&&"select"!==n.type||null==n.props||null!==n.props.value||a||("production"!==t.env.NODE_ENV&&i(!1,"`value` prop on `%s` should not be null. Consider using the empty string to clear the component or `undefined` for uncontrolled components.%s",n.type,r.getStackAddendumByID(e)),a=!0))}var r=n(12),i=n(3),a=!1,u={onBeforeMountComponent:function(e,t){o(e,t)},onBeforeUpdateComponent:function(e,t){o(e,t)}};e.exports=u}).call(t,n(0))},function(e,t,n){"use strict";(function(t){function o(e,n,o){if(c.hasOwnProperty(n)&&c[n])return!0;if(l.test(n)){var r=n.toLowerCase(),i=a.getPossibleStandardName.hasOwnProperty(r)?a.getPossibleStandardName[r]:null;if(null==i)return c[n]=!0,!1;if(n!==i)return"production"!==t.env.NODE_ENV&&s(!1,"Unknown ARIA attribute %s. Did you mean %s?%s",n,i,u.getStackAddendumByID(o)),c[n]=!0,!0}return!0}function r(e,n){var r=[];for(var i in n.props){o(n.type,i,e)||r.push(i)}var a=r.map(function(e){return"`"+e+"`"}).join(", ");1===r.length?"production"!==t.env.NODE_ENV&&s(!1,"Invalid aria prop %s on <%s> tag. For details, see https://fb.me/invalid-aria-prop%s",a,n.type,u.getStackAddendumByID(e)):r.length>1&&"production"!==t.env.NODE_ENV&&s(!1,"Invalid aria props %s on <%s> tag. For details, see https://fb.me/invalid-aria-prop%s",a,n.type,u.getStackAddendumByID(e))}function i(e,t){null!=t&&"string"==typeof t.type&&(t.type.indexOf("-")>=0||t.props.is||r(e,t))}var a=n(20),u=n(12),s=n(3),c={},l=new RegExp("^(aria)-["+a.ATTRIBUTE_NAME_CHAR+"]*$"),p={onBeforeMountComponent:function(e,n){"production"!==t.env.NODE_ENV&&i(e,n)},onBeforeUpdateComponent:function(e,n){"production"!==t.env.NODE_ENV&&i(e,n)}};e.exports=p}).call(t,n(0))},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=o(r),a=n(9),u=n(263),s=o(u),c=n(135);o(c);t.default=function(e){return i.default.createElement(a.Provider,{store:e.store},i.default.createElement(s.default,null))}},function(e,t,n){"use strict";(function(e){function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(){f||(f=!0,Object(d.a)("<Provider> does not support changing `store` on the fly. It is most likely that you see this error because you updated to Redux 2.x and React Redux 2.x which no longer hot reload reducers automatically. See https://github.com/reactjs/react-redux/releases/tag/v2.0.0 for the migration instructions."))}function u(){var t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"store",u=arguments[1],c=u||n+"Subscription",d=function(e){function t(i,a){o(this,t);var u=r(this,e.call(this,i,a));return u[n]=i.store,u}return i(t,e),t.prototype.getChildContext=function(){var e;return e={},e[n]=this[n],e[c]=null,e},t.prototype.render=function(){return s.Children.only(this.props.children)},t}(s.Component);return"production"!==e.env.NODE_ENV&&(d.prototype.componentWillReceiveProps=function(e){this[n]!==e.store&&a()}),d.propTypes={store:p.a.isRequired,children:l.a.element.isRequired},d.childContextTypes=(t={},t[n]=p.a.isRequired,t[c]=p.b,t),d}t.a=u;var s=n(1),c=(n.n(s),n(11)),l=n.n(c),p=n(109),d=n(67),f=!1;t.b=u()}).call(t,n(0))},function(e,t,n){"use strict";var o=n(13),r=n(2),i=n(50);e.exports=function(){function e(e,t,n,o,a,u){u!==i&&r(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t};return n.checkPropTypes=o,n.PropTypes=n,n}},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(){var e=[],t=[];return{clear:function(){t=i,e=i},notify:function(){for(var n=e=t,o=0;o<n.length;o++)n[o]()},get:function(){return t},subscribe:function(n){var o=!0;return t===e&&(t=e.slice()),t.push(n),function(){o&&e!==i&&(o=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}}n.d(t,"a",function(){return u});var i=null,a={notify:function(){}},u=function(){function e(t,n,r){o(this,e),this.store=t,this.parentSub=n,this.onStateChange=r,this.unsubscribe=null,this.listeners=a}return e.prototype.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},e.prototype.notifyNestedSubs=function(){this.listeners.notify()},e.prototype.isSubscribed=function(){return Boolean(this.unsubscribe)},e.prototype.trySubscribe=function(){this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=r())},e.prototype.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=a)},e}()},function(e,t,n){"use strict";function o(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function r(e,t,n){for(var o=t.length-1;o>=0;o--){var r=t[o](e);if(r)return r}return function(t,o){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+o.wrappedComponentName+".")}}function i(e,t){return e===t}var a=n(110),u=n(242),s=n(243),c=n(259),l=n(260),p=n(261),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.connectHOC,n=void 0===t?a.a:t,f=e.mapStateToPropsFactories,h=void 0===f?c.a:f,m=e.mapDispatchToPropsFactories,v=void 0===m?s.a:m,y=e.mergePropsFactories,g=void 0===y?l.a:y,E=e.selectorFactory,b=void 0===E?p.a:E;return function(e,t,a){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},c=s.pure,l=void 0===c||c,p=s.areStatesEqual,f=void 0===p?i:p,m=s.areOwnPropsEqual,y=void 0===m?u.a:m,E=s.areStatePropsEqual,_=void 0===E?u.a:E,O=s.areMergedPropsEqual,N=void 0===O?u.a:O,C=o(s,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),w=r(e,h,"mapStateToProps"),k=r(t,v,"mapDispatchToProps"),T=r(a,g,"mergeProps");return n(b,d({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:w,initMapDispatchToProps:k,initMergeProps:T,pure:l,areStatesEqual:f,areOwnPropsEqual:y,areStatePropsEqual:_,areMergedPropsEqual:N},C))}}()},function(e,t,n){"use strict";function o(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function r(e,t){if(o(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var a=0;a<n.length;a++)if(!i.call(t,n[a])||!o(e[n[a]],t[n[a]]))return!1;return!0}t.a=r;var i=Object.prototype.hasOwnProperty},function(e,t,n){"use strict";function o(e){return"function"==typeof e?Object(u.b)(e,"mapDispatchToProps"):void 0}function r(e){return e?void 0:Object(u.a)(function(e){return{dispatch:e}})}function i(e){return e&&"object"==typeof e?Object(u.a)(function(t){return Object(a.bindActionCreators)(e,t)}):void 0}var a=n(29),u=n(117);t.a=[o,r,i]},function(e,t,n){"use strict";function o(e){return null==e?void 0===e?s:u:c&&c in Object(e)?Object(i.a)(e):Object(a.a)(e)}var r=n(113),i=n(247),a=n(248),u="[object Null]",s="[object Undefined]",c=r.a?r.a.toStringTag:void 0;t.a=o},function(e,t,n){"use strict";var o=n(246),r="object"==typeof self&&self&&self.Object===Object&&self,i=o.a||r||Function("return this")();t.a=i},function(e,t,n){"use strict";(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.a=n}).call(t,n(114))},function(e,t,n){"use strict";function o(e){var t=a.call(e,s),n=e[s];try{e[s]=void 0;var o=!0}catch(e){}var r=u.call(e);return o&&(t?e[s]=n:delete e[s]),r}var r=n(113),i=Object.prototype,a=i.hasOwnProperty,u=i.toString,s=r.a?r.a.toStringTag:void 0;t.a=o},function(e,t,n){"use strict";function o(e){return i.call(e)}var r=Object.prototype,i=r.toString;t.a=o},function(e,t,n){"use strict";var o=n(250),r=Object(o.a)(Object.getPrototypeOf,Object);t.a=r},function(e,t,n){"use strict";function o(e,t){return function(n){return e(t(n))}}t.a=o},function(e,t,n){"use strict";function o(e){return null!=e&&"object"==typeof e}t.a=o},function(e,t,n){e.exports=n(253)},function(e,t,n){"use strict";(function(e,o){Object.defineProperty(t,"__esModule",{value:!0});var r,i=n(255),a=function(e){return e&&e.__esModule?e:{default:e}}(i);r="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:o;var u=(0,a.default)(r);t.default=u}).call(t,n(114),n(254)(e))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";function o(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o},function(e,t,n){"use strict";(function(e){function o(e,t){var n=t&&t.type;return"Given action "+(n&&'"'+n.toString()+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function r(e,t,n,o){var r=Object.keys(t),i=n&&n.type===u.a.INIT?"preloadedState argument passed to createStore":"previous state received by the reducer";if(0===r.length)return"Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";if(!Object(s.a)(e))return"The "+i+' has unexpected type of "'+{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1]+'". Expected argument to be an object with the following keys: "'+r.join('", "')+'"';var a=Object.keys(e).filter(function(e){return!t.hasOwnProperty(e)&&!o[e]});return a.forEach(function(e){o[e]=!0}),a.length>0?"Unexpected "+(a.length>1?"keys":"key")+' "'+a.join('", "')+'" found in '+i+'. Expected to find one of the known reducer keys instead: "'+r.join('", "')+'". Unexpected keys will be ignored.':void 0}function i(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:u.a.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+u.a.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}function a(t){for(var n=Object.keys(t),a={},u=0;u<n.length;u++){var s=n[u];"production"!==e.env.NODE_ENV&&void 0===t[s]&&Object(c.a)('No reducer provided for key "'+s+'"'),"function"==typeof t[s]&&(a[s]=t[s])}var l=Object.keys(a),p=void 0;"production"!==e.env.NODE_ENV&&(p={});var d=void 0;try{i(a)}catch(e){d=e}return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];if(d)throw d;if("production"!==e.env.NODE_ENV){var i=r(t,a,n,p);i&&Object(c.a)(i)}for(var u=!1,s={},f=0;f<l.length;f++){var h=l[f],m=a[h],v=t[h],y=m(v,n);if(void 0===y){var g=o(h,n);throw new Error(g)}s[h]=y,u=u||y!==v}return u?s:t}}t.a=a;var u=n(112),s=n(68),c=n(115)}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t){return function(){return t(e.apply(void 0,arguments))}}function r(e,t){if("function"==typeof e)return o(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),r={},i=0;i<n.length;i++){var a=n[i],u=e[a];"function"==typeof u&&(r[a]=o(u,t))}return r}t.a=r},function(e,t,n){"use strict";function o(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(n,o,a){var u=e(n,o,a),s=u.dispatch,c=[],l={getState:u.getState,dispatch:function(e){return s(e)}};return c=t.map(function(e){return e(l)}),s=r.a.apply(void 0,c)(u.dispatch),i({},u,{dispatch:s})}}}t.a=o;var r=n(116),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}},function(e,t,n){"use strict";function o(e){return"function"==typeof e?Object(i.b)(e,"mapStateToProps"):void 0}function r(e){return e?void 0:Object(i.a)(function(){return{}})}var i=n(117);t.a=[o,r]},function(e,t,n){"use strict";(function(e){function o(e,t,n){return s({},n,e,t)}function r(t){return function(n,o){var r=o.displayName,i=o.pure,a=o.areMergedPropsEqual,s=!1,c=void 0;return function(n,o,l){var p=t(n,o,l);return s?i&&a(p,c)||(c=p):(s=!0,c=p,"production"!==e.env.NODE_ENV&&Object(u.a)(c,r,"mergeProps")),c}}}function i(e){return"function"==typeof e?r(e):void 0}function a(e){return e?void 0:function(){return o}}var u=n(118),s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};t.a=[i,a]}).call(t,n(0))},function(e,t,n){"use strict";(function(e){function o(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}function r(e,t,n,o){return function(r,i){return n(e(r,i),t(o,i),i)}}function i(e,t,n,o,r){function i(r,i){return h=r,m=i,v=e(h,m),y=t(o,m),g=n(v,y,m),f=!0,g}function a(){return v=e(h,m),t.dependsOnOwnProps&&(y=t(o,m)),g=n(v,y,m)}function u(){return e.dependsOnOwnProps&&(v=e(h,m)),t.dependsOnOwnProps&&(y=t(o,m)),g=n(v,y,m)}function s(){var t=e(h,m),o=!d(t,v);return v=t,o&&(g=n(v,y,m)),g}function c(e,t){var n=!p(t,m),o=!l(e,h);return h=e,m=t,n&&o?a():n?u():o?s():g}var l=r.areStatesEqual,p=r.areOwnPropsEqual,d=r.areStatePropsEqual,f=!1,h=void 0,m=void 0,v=void 0,y=void 0,g=void 0;return function(e,t){return f?c(e,t):i(e,t)}}function a(t,n){var a=n.initMapStateToProps,s=n.initMapDispatchToProps,c=n.initMergeProps,l=o(n,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),p=a(t,l),d=s(t,l),f=c(t,l);return"production"!==e.env.NODE_ENV&&Object(u.a)(p,d,f,l.displayName),(l.pure?i:r)(p,d,f,t,l)}t.a=a;var u=n(262)}).call(t,n(0))},function(e,t,n){"use strict";function o(e,t,n){if(!e)throw new Error("Unexpected value for "+t+" in "+n+".");"mapStateToProps"!==t&&"mapDispatchToProps"!==t||e.hasOwnProperty("dependsOnOwnProps")||Object(i.a)("The selector for "+t+" of "+n+" did not specify a value for dependsOnOwnProps.")}function r(e,t,n,r){o(e,"mapStateToProps",r),o(t,"mapDispatchToProps",r),o(n,"mergeProps",r)}t.a=r;var i=n(67)},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=o(r),a=n(264),u=o(a),s=n(135),c=o(s),l=n(310),p=o(l),d=n(10),f=n(312),h=o(f);t.default=function(){return i.default.createElement(d.HashRouter,null,i.default.createElement("div",{className:"app"},i.default.createElement(c.default,null),i.default.createElement(p.default,null),i.default.createElement(u.default,null),i.default.createElement(h.default,null)))}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=o(r),a=n(265),u=o(a),s=n(10),c=n(74),l=n(289),p=o(l),d=n(290),f=o(d),h=n(293),m=o(h),v=n(303),y=o(v);t.default=function(e){return i.default.createElement("div",{className:"main_content"},i.default.createElement(c.AuthRoute,{exact:!0,path:"/",component:p.default}),i.default.createElement(c.AuthRoute,{path:"/login",component:u.default}),i.default.createElement(c.AuthRoute,{path:"/signup",component:u.default}),i.default.createElement(s.Route,{exact:!0,path:"/tracks/:trackId",component:m.default}),i.default.createElement(s.Route,{exact:!0,path:"/users/:userId",component:y.default}),i.default.createElement(c.ProtectedRoute,{path:"/upload",component:f.default}),i.default.createElement(c.ProtectedRoute,{path:"/tracks/:trackId/edit",component:f.default}))}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=(o(r),n(266)),a=o(i),u=n(9),s=n(267),c=n(23),l=n(24),p=function(e,t){var n=e.errors.session,o=void 0,r=void 0;return"/login"===t.match.path?(o="Welcome back to SoundShroud",r="Log In"):(o="Sign up for SoundShroud",r="Sign Up"),{message:o,buttonText:r,errors:n}},d=function(e,t){var n="/login"===t.match.path?l.postSessionThunk:c.postUserThunk;return{action:function(t){return e(n({user:t}))},example:function(){return e((0,l.postSessionThunk)({user:{username:"example",password:"password"}}))},clearErrors:function(){return e((0,l.clearSessionErrors)())}}};t.default=(0,s.withRouter)((0,u.connect)(p,d)(a.default))},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=function(e){return e&&e.__esModule?e:{default:e}}(s),l=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={username:"",password:"",label_username:!0,label_password:!0},n.handleSubmit=n.handleSubmit.bind(n),n.handleChange=n.handleChange.bind(n),n.handleExample=n.handleExample.bind(n),n}return a(t,e),u(t,[{key:"handleChange",value:function(e){var t=this;return function(n){return t.setState(o({},e,n.target.value))}}},{key:"handleExample",value:function(e){e.preventDefault(),this.props.example()}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.action(this.state)}},{key:"componentDidMount",value:function(){document.getElementById("blue_filter_in").beginElement()}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"render",value:function(){var e=this,t=(this.state.password.length,0===this.state.username.length),n={};return Object.keys(this.props.errors).forEach(function(t){n[t]=c.default.createElement("div",{className:"errors"},c.default.createElement("svg",{height:"15",width:"15"},c.default.createElement("polygon",{points:"0,8 15,0 15,15"})),c.default.createElement("div",null,e.props.errors[t].join(", ")))}),c.default.createElement("div",{id:"session-form-content"},c.default.createElement("div",{id:"session-form-and-title"},c.default.createElement("h1",null,this.props.message),c.default.createElement("div",{id:"session-form-container"},c.default.createElement("form",{onSubmit:this.handleSubmit},c.default.createElement("div",null,c.default.createElement("input",{type:"text",onFocus:function(n){t&&e.setState({label_username:!1})},onBlur:function(t){0===e.state.username.length&&e.setState({label_username:!0})},className:this.state.label_username?"empty":"",onChange:this.handleChange("username"),value:this.state.label_username?"Username":this.state.username}),n.username),c.default.createElement("div",null,c.default.createElement("input",{type:this.state.label_password?"text":"password",onFocus:function(t){e.setState({label_password:!1})},onBlur:function(t){0===e.state.password.length&&e.setState({label_password:!0})},onChange:this.handleChange("password"),className:this.state.label_password?"empty":"",value:this.state.label_password?"Password":this.state.password}),n.password),c.default.createElement("div",{className:"session_submit_buttons"},c.default.createElement("input",{type:"button",onClick:this.handleExample,className:"form_button blue_button",value:"Demo"}),c.default.createElement("input",{type:"submit",className:"form_button blue_button",value:this.props.buttonText}),n.general)))))}}]),t}(c.default.Component);t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(119);n.d(t,"MemoryRouter",function(){return o.a});var r=n(122);n.d(t,"Prompt",function(){return r.a});var i=n(123);n.d(t,"Redirect",function(){return i.a});var a=n(72);n.d(t,"Route",function(){return a.a});var u=n(45);n.d(t,"Router",function(){return u.a});var s=n(125);n.d(t,"StaticRouter",function(){return s.a});var c=n(126);n.d(t,"Switch",function(){return c.a});var l=n(47);n.d(t,"matchPath",function(){return l.a});var p=n(127);n.d(t,"withRouter",function(){return p.a})},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},a=n(8),u=o(a),s=n(34),c=n(69),l=n(70),p=o(l),d=function(e,t,n){return Math.min(Math.max(e,t),n)},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.getUserConfirmation,n=e.initialEntries,o=void 0===n?["/"]:n,a=e.initialIndex,l=void 0===a?0:a,f=e.keyLength,h=void 0===f?6:f,m=(0,p.default)(),v=function(e){i(P,e),P.length=P.entries.length,m.notifyListeners(P.location,P.action)},y=function(){return Math.random().toString(36).substr(2,h)},g=d(l,0,o.length-1),E=o.map(function(e){return"string"==typeof e?(0,c.createLocation)(e,void 0,y()):(0,c.createLocation)(e,void 0,e.key||y())}),b=s.createPath,_=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var o=(0,c.createLocation)(e,n,y(),P.location);m.confirmTransitionTo(o,"PUSH",t,function(e){if(e){var t=P.index,n=t+1,r=P.entries.slice(0);r.length>n?r.splice(n,r.length-n,o):r.push(o),v({action:"PUSH",location:o,index:n,entries:r})}})},O=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var o=(0,c.createLocation)(e,n,y(),P.location);m.confirmTransitionTo(o,"REPLACE",t,function(e){e&&(P.entries[P.index]=o,v({action:"REPLACE",location:o}))})},N=function(e){var n=d(P.index+e,0,P.entries.length-1),o=P.entries[n];m.confirmTransitionTo(o,"POP",t,function(e){e?v({action:"POP",location:o,index:n}):v()})},C=function(){return N(-1)},w=function(){return N(1)},k=function(e){var t=P.index+e;return t>=0&&t<P.entries.length},T=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return m.setPrompt(e)},D=function(e){return m.appendListener(e)},P={length:E.length,action:"POP",location:E[g],index:g,entries:E,createHref:b,push:_,replace:O,go:N,goBack:C,goForward:w,canGo:k,block:T,listen:D};return P};t.default=f},function(e,t,n){"use strict";var o=(n(270),n(271),n(272),n(46));n.d(t,"a",function(){return o.a}),n.d(t,"b",function(){return o.b});n(35)},function(e,t,n){"use strict";var o=n(8),r=(n.n(o),n(15));n.n(r),n(46),n(35),n(71),n(124),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var o=n(8),r=(n.n(o),n(15)),i=(n.n(r),n(46),n(35));n(71),n(124),Object.assign,i.f,i.a,i.a,i.a},function(e,t,n){"use strict";var o=n(8);n.n(o),n(35),n(46),n(71),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){function o(e,t){for(var n,o=[],r=0,i=0,a="",u=t&&t.delimiter||"/";null!=(n=g.exec(e));){var l=n[0],p=n[1],d=n.index;if(a+=e.slice(i,d),i=d+l.length,p)a+=p[1];else{var f=e[i],h=n[2],m=n[3],v=n[4],y=n[5],E=n[6],b=n[7];a&&(o.push(a),a="");var _=null!=h&&null!=f&&f!==h,O="+"===E||"*"===E,N="?"===E||"*"===E,C=n[2]||u,w=v||y;o.push({name:m||r++,prefix:h||"",delimiter:C,optional:N,repeat:O,partial:_,asterisk:!!b,pattern:w?c(w):b?".*":"[^"+s(C)+"]+?"})}}return i<e.length&&(a+=e.substr(i)),a&&o.push(a),o}function r(e,t){return u(o(e,t))}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function a(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var r="",u=n||{},s=o||{},c=s.pretty?i:encodeURIComponent,l=0;l<e.length;l++){var p=e[l];if("string"!=typeof p){var d,f=u[p.name];if(null==f){if(p.optional){p.partial&&(r+=p.prefix);continue}throw new TypeError('Expected "'+p.name+'" to be defined')}if(y(f)){if(!p.repeat)throw new TypeError('Expected "'+p.name+'" to not repeat, but received `'+JSON.stringify(f)+"`");if(0===f.length){if(p.optional)continue;throw new TypeError('Expected "'+p.name+'" to not be empty')}for(var h=0;h<f.length;h++){if(d=c(f[h]),!t[l].test(d))throw new TypeError('Expected all "'+p.name+'" to match "'+p.pattern+'", but received `'+JSON.stringify(d)+"`");r+=(0===h?p.prefix:p.delimiter)+d}}else{if(d=p.asterisk?a(f):c(f),!t[l].test(d))throw new TypeError('Expected "'+p.name+'" to match "'+p.pattern+'", but received "'+d+'"');r+=p.prefix+d}}else r+=p}return r}}function s(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function c(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function l(e,t){return e.keys=t,e}function p(e){return e.sensitive?"":"i"}function d(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var o=0;o<n.length;o++)t.push({name:o,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return l(e,t)}function f(e,t,n){for(var o=[],r=0;r<e.length;r++)o.push(v(e[r],t,n).source);return l(new RegExp("(?:"+o.join("|")+")",p(n)),t)}function h(e,t,n){return m(o(e,n),t,n)}function m(e,t,n){y(t)||(n=t||n,t=[]),n=n||{};for(var o=n.strict,r=!1!==n.end,i="",a=0;a<e.length;a++){var u=e[a];if("string"==typeof u)i+=s(u);else{var c=s(u.prefix),d="(?:"+u.pattern+")";t.push(u),u.repeat&&(d+="(?:"+c+d+")*"),d=u.optional?u.partial?c+"("+d+")?":"(?:"+c+"("+d+"))?":c+"("+d+")",i+=d}}var f=s(n.delimiter||"/"),h=i.slice(-f.length)===f;return o||(i=(h?i.slice(0,-f.length):i)+"(?:"+f+"(?=$))?"),i+=r?"$":o&&h?"":"(?="+f+"|$)",l(new RegExp("^"+i,p(n)),t)}function v(e,t,n){return y(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?d(e,t):y(e)?f(e,t,n):h(e,t,n)}var y=n(274);e.exports=v,e.exports.parse=o,e.exports.compile=r,e.exports.tokensToFunction=u,e.exports.tokensToRegExp=m;var g=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.postUser=function(e){return $.ajax({method:"post",url:"/api/users",data:e})},t.fetchTrackCommentsUsers=function(e){return $.ajax({method:"get",url:"/api/tracks/"+e+"/users"})},t.fetchUser=function(e){return $.ajax({method:"get",url:"/api/users/"+e})},t.postImage=function(e,t){$.ajax({method:"post",url:"/api/users/"+e+"image"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.postSession=function(e){return $.ajax({method:"post",url:"/api/session",data:e})},t.deleteSession=function(){return $.ajax({method:"delete",url:"api/session"})}},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(8),u=n.n(a),s=n(1),c=n.n(s),l=n(11),p=n.n(l),d=n(278),f=n.n(d),h=n(73),m=function(e){function t(){var n,i,a;o(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=i=r(this,e.call.apply(e,[this].concat(s))),i.history=f()(i.props),a=n,r(i,a)}return i(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.")},t.prototype.render=function(){return c.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(c.a.Component);m.propTypes={basename:p.a.string,forceRefresh:p.a.bool,getUserConfirmation:p.a.func,keyLength:p.a.number,children:p.a.node},t.a=m},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},a=n(8),u=o(a),s=n(15),c=o(s),l=n(69),p=n(34),d=n(70),f=o(d),h=n(128),m=function(){try{return window.history.state||{}}catch(e){return{}}},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,c.default)(h.canUseDOM,"Browser history needs a DOM");var t=window.history,n=(0,h.supportsHistory)(),o=!(0,h.supportsPopStateOnHashChange)(),a=e.forceRefresh,s=void 0!==a&&a,d=e.getUserConfirmation,v=void 0===d?h.getConfirmation:d,y=e.keyLength,g=void 0===y?6:y,E=e.basename?(0,p.stripTrailingSlash)((0,p.addLeadingSlash)(e.basename)):"",b=function(e){var t=e||{},n=t.key,o=t.state,r=window.location,i=r.pathname,a=r.search,s=r.hash,c=i+a+s;return(0,u.default)(!E||(0,p.hasBasename)(c,E),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+c+'" to begin with "'+E+'".'),E&&(c=(0,p.stripBasename)(c,E)),(0,l.createLocation)(c,o,n)},_=function(){return Math.random().toString(36).substr(2,g)},O=(0,f.default)(),N=function(e){i(W,e),W.length=t.length,O.notifyListeners(W.location,W.action)},C=function(e){(0,h.isExtraneousPopstateEvent)(e)||T(b(e.state))},w=function(){T(b(m()))},k=!1,T=function(e){if(k)k=!1,N();else{O.confirmTransitionTo(e,"POP",v,function(t){t?N({action:"POP",location:e}):D(e)})}},D=function(e){var t=W.location,n=S.indexOf(t.key);-1===n&&(n=0);var o=S.indexOf(e.key);-1===o&&(o=0);var r=n-o;r&&(k=!0,M(r))},P=b(m()),S=[P.key],x=function(e){return E+(0,p.createPath)(e)},R=function(e,o){(0,u.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==o),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var i=(0,l.createLocation)(e,o,_(),W.location);O.confirmTransitionTo(i,"PUSH",v,function(e){if(e){var o=x(i),r=i.key,a=i.state;if(n)if(t.pushState({key:r,state:a},null,o),s)window.location.href=o;else{var c=S.indexOf(W.location.key),l=S.slice(0,-1===c?0:c+1);l.push(i.key),S=l,N({action:"PUSH",location:i})}else(0,u.default)(void 0===a,"Browser history cannot push state in browsers that do not support HTML5 history"),window.location.href=o}})},I=function(e,o){(0,u.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==o),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var i=(0,l.createLocation)(e,o,_(),W.location);O.confirmTransitionTo(i,"REPLACE",v,function(e){if(e){var o=x(i),r=i.key,a=i.state;if(n)if(t.replaceState({key:r,state:a},null,o),s)window.location.replace(o);else{var c=S.indexOf(W.location.key);-1!==c&&(S[c]=i.key),N({action:"REPLACE",location:i})}else(0,u.default)(void 0===a,"Browser history cannot replace state in browsers that do not support HTML5 history"),window.location.replace(o)}})},M=function(e){t.go(e)},A=function(){return M(-1)},j=function(){return M(1)},V=0,U=function(e){V+=e,1===V?((0,h.addEventListener)(window,"popstate",C),o&&(0,h.addEventListener)(window,"hashchange",w)):0===V&&((0,h.removeEventListener)(window,"popstate",C),o&&(0,h.removeEventListener)(window,"hashchange",w))},L=!1,F=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=O.setPrompt(e);return L||(U(1),L=!0),function(){return L&&(L=!1,U(-1)),t()}},B=function(e){var t=O.appendListener(e);return U(1),function(){U(-1),t()}},W={length:t.length,action:"POP",location:P,createHref:x,push:R,replace:I,go:M,goBack:A,goForward:j,block:F,listen:B};return W};t.default=v},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(8),u=n.n(a),s=n(1),c=n.n(s),l=n(11),p=n.n(l),d=n(280),f=n.n(d),h=n(73),m=function(e){function t(){var n,i,a;o(this,t);for(var u=arguments.length,s=Array(u),c=0;c<u;c++)s[c]=arguments[c];return n=i=r(this,e.call.apply(e,[this].concat(s))),i.history=f()(i.props),a=n,r(i,a)}return i(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return c.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(c.a.Component);m.propTypes={basename:p.a.string,getUserConfirmation:p.a.func,hashType:p.a.oneOf(["hashbang","noslash","slash"]),children:p.a.node},t.a=m},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},i=n(8),a=o(i),u=n(15),s=o(u),c=n(69),l=n(34),p=n(70),d=o(p),f=n(128),h={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+(0,l.stripLeadingSlash)(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:l.stripLeadingSlash,decodePath:l.addLeadingSlash},slash:{encodePath:l.addLeadingSlash,decodePath:l.addLeadingSlash}},m=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},v=function(e){return window.location.hash=e},y=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,s.default)(f.canUseDOM,"Hash history needs a DOM");var t=window.history,n=(0,f.supportsGoWithoutReloadUsingHash)(),o=e.getUserConfirmation,i=void 0===o?f.getConfirmation:o,u=e.hashType,p=void 0===u?"slash":u,g=e.basename?(0,l.stripTrailingSlash)((0,l.addLeadingSlash)(e.basename)):"",E=h[p],b=E.encodePath,_=E.decodePath,O=function(){var e=_(m());return(0,a.default)(!g||(0,l.hasBasename)(e,g),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+g+'".'),g&&(e=(0,l.stripBasename)(e,g)),(0,c.createLocation)(e)},N=(0,d.default)(),C=function(e){r(Y,e),Y.length=t.length,N.notifyListeners(Y.location,Y.action)},w=!1,k=null,T=function(){var e=m(),t=b(e);if(e!==t)y(t);else{var n=O(),o=Y.location;if(!w&&(0,c.locationsAreEqual)(o,n))return;if(k===(0,l.createPath)(n))return;k=null,D(n)}},D=function(e){if(w)w=!1,C();else{N.confirmTransitionTo(e,"POP",i,function(t){t?C({action:"POP",location:e}):P(e)})}},P=function(e){var t=Y.location,n=I.lastIndexOf((0,l.createPath)(t));-1===n&&(n=0);var o=I.lastIndexOf((0,l.createPath)(e));-1===o&&(o=0);var r=n-o;r&&(w=!0,V(r))},S=m(),x=b(S);S!==x&&y(x);var R=O(),I=[(0,l.createPath)(R)],M=function(e){return"#"+b(g+(0,l.createPath)(e))},A=function(e,t){(0,a.default)(void 0===t,"Hash history cannot push state; it is ignored");var n=(0,c.createLocation)(e,void 0,void 0,Y.location);N.confirmTransitionTo(n,"PUSH",i,function(e){if(e){var t=(0,l.createPath)(n),o=b(g+t);if(m()!==o){k=t,v(o);var r=I.lastIndexOf((0,l.createPath)(Y.location)),i=I.slice(0,-1===r?0:r+1);i.push(t),I=i,C({action:"PUSH",location:n})}else(0,a.default)(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),C()}})},j=function(e,t){(0,a.default)(void 0===t,"Hash history cannot replace state; it is ignored");var n=(0,c.createLocation)(e,void 0,void 0,Y.location);N.confirmTransitionTo(n,"REPLACE",i,function(e){if(e){var t=(0,l.createPath)(n),o=b(g+t);m()!==o&&(k=t,y(o));var r=I.indexOf((0,l.createPath)(Y.location));-1!==r&&(I[r]=t),C({action:"REPLACE",location:n})}})},V=function(e){(0,a.default)(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},U=function(){return V(-1)},L=function(){return V(1)},F=0,B=function(e){F+=e,1===F?(0,f.addEventListener)(window,"hashchange",T):0===F&&(0,f.removeEventListener)(window,"hashchange",T)},W=!1,H=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=N.setPrompt(e);return W||(B(1),W=!0),function(){return W&&(W=!1,B(-1)),t()}},q=function(e){var t=N.appendListener(e);return B(1),function(){B(-1),t()}},Y={length:t.length,action:"POP",location:R,createHref:M,push:A,replace:j,go:V,goBack:U,goForward:L,block:H,listen:q};return Y};t.default=g},function(e,t,n){"use strict";var o=n(119);t.a=o.a},function(e,t,n){"use strict";function o(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}var r=n(1),i=n.n(r),a=n(11),u=n.n(a),s=n(130),c=n(129),l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d=function(e){var t=e.to,n=e.exact,r=e.strict,a=e.location,u=e.activeClassName,d=e.className,f=e.activeStyle,h=e.style,m=e.isActive,v=e.ariaCurrent,y=o(e,["to","exact","strict","location","activeClassName","className","activeStyle","style","isActive","ariaCurrent"]);return i.a.createElement(s.a,{path:"object"===(void 0===t?"undefined":p(t))?t.pathname:t,exact:n,strict:r,location:a,children:function(e){var n=e.location,o=e.match,r=!!(m?m(o,n):o);return i.a.createElement(c.a,l({to:t,className:r?[d,u].filter(function(e){return e}).join(" "):d,style:r?l({},h,f):h,"aria-current":r&&v},y))}})};d.propTypes={to:c.a.propTypes.to,exact:u.a.bool,strict:u.a.bool,location:u.a.object,activeClassName:u.a.string,className:u.a.string,activeStyle:u.a.object,style:u.a.object,isActive:u.a.func,ariaCurrent:u.a.oneOf(["page","step","location","true"])},d.defaultProps={activeClassName:"active",ariaCurrent:"true"},t.a=d},function(e,t,n){"use strict";var o=n(122);t.a=o.a},function(e,t,n){"use strict";var o=n(123);t.a=o.a},function(e,t,n){"use strict";var o=n(125);t.a=o.a},function(e,t,n){"use strict";var o=n(126);t.a=o.a},function(e,t,n){"use strict";var o=n(47);t.a=o.a},function(e,t,n){"use strict";var o=n(127);t.a=o.a},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(1),s=function(e){return e&&e.__esModule?e:{default:e}}(u),c=n(10),l=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"componentDidMount",value:function(){document.getElementById("blue_filter_in").beginElement()}},{key:"render",value:function(){return s.default.createElement("div",{className:"landing_page_content static_img_page"},s.default.createElement("img",{src:"/assets/sax blue.jpeg"}),s.default.createElement("div",{className:"image-gradient-overlay"}),s.default.createElement("div",{className:"landing_info"},s.default.createElement("h1",null," Connect on SoundShroud"),s.default.createElement("div",null,"Discover hot new music from emerging and major artists worldwide."),s.default.createElement(c.Link,{className:"blue_button",id:"landing_button",to:"/signup"}," Sign Up For Free!")))}}]),t}(s.default.Component);t.default=l},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(9),c=n(10),l=n(16),p=n(48),d=n(292),f=o(d),h=n(1),m=o(h),v=function(e,t){return{track:e.entities.tracks[t.trackId],loading:t.editing&&e.loading.mainContent,initial_state:{title:"",labelTitle:!0,labelDescription:!0,description:"",file:void 0},errors:e.errors.uploadParams}},y=function(e,t){var n=void 0;return n=t.editing?function(n){n.id=t.trackId,e((0,l.editTrackThunk)(n))}:function(t){return e((0,l.verifyThenPostThunk)(t))},{formAction:n,clearParamsErrors:function(){return e((0,l.clearUploadParamsErrors)())}}},g=function(e,t){return{editing:Boolean(t.match.params.trackId),trackId:t.match.params.trackId}},E=function(e,t){return t.match.params.trackId?{fetchTrack:function(t){e((0,p.receiveMainContentLoading)()),e((0,l.fetchTrackThunk)(t,function(){return e((0,p.receiveMainContentLoaded)())}))}}:{}},b=(0,s.connect)(v,y)(f.default),_=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.editing&&this.props.fetchTrack(this.props.trackId)}},{key:"componentWillReceiveProps",value:function(e){e.trackId!==this.props.trackId&&this.props.fetchTrack(e.trackId)}},{key:"render",value:function(){return m.default.createElement(b,{trackId:this.props.trackId,editing:this.props.editing})}}]),t}(m.default.Component);t.default=(0,c.withRouter)((0,s.connect)(g,E)(_))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchTracks=function(e){return $.ajax({method:"get",url:"api/"+e+"/track"})},t.fetchTrack=function(e){return $.ajax({method:"get",url:"api/tracks/"+e})},t.process_track=function(e){return $.ajax({method:"post",data:e,url:"api/tracks/process"})},t.updateTrack=function(e){return $.ajax({method:"PATCH",url:"api/tracks/"+e.track.id,data:e})},t.verifyValidParams=function(e){return $.ajax({method:"post",url:"api/tracks/verify",data:e})},t.deleteTrack=function(e){return $.ajax({method:"delete",url:"api/tracks/"+e})},t.postToS3=function(e,t){req=new XMLHttpRequest},t.getS3Url=function(e){return $.ajax({method:"get",url:"/api/tracks/s3/"+e})},t.fetchUserTracks=function(e){return $.ajax({method:"get",url:"api/users/"+e+"/tracks"})}},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=function(e){return e&&e.__esModule?e:{default:e}}(s),l=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state=n.props.initial_state,n.handleSubmit=n.handleSubmit.bind(n),n.handleChange=n.handleChange.bind(n),n.handleFileChange=n.handleFileChange.bind(n),n.handleImageChange=n.handleImageChange.bind(n),n}return a(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearParamsErrors()}},{key:"componentWillReceiveProps",value:function(e){this.props.loading&&!e.loading&&this.setState(Object.assign({labelTitle:!1,labelDescription:0===e.track.description.length},e.track))}}]),u(t,[{key:"handleChange",value:function(e){var t=this;return function(n){n.preventDefault(),t.setState(o({},e,n.target.value))}}},{key:"handleFileChange",value:function(e){this.setState({file:e.target.files[0]})}},{key:"handleImageChange",value:function(e){this.setState({imageFile:e.target.files[0]})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.clearParamsErrors(),this.props.formAction(this.state)}},{key:"render",value:function(){var e=this,t={},n=this.state.imageFile?URL.createObjectURL(this.state.imageFile):"/assets/camera.svg",o=void 0;if(Object.keys(this.props.errors).forEach(function(n){t[n]=c.default.createElement("div",{className:"errors"},c.default.createElement("svg",{height:"15",width:"15"},c.default.createElement("polygon",{points:"0,8 15,0 15,15"})),c.default.createElement("div",null,e.props.errors[n].join(", ")))}),this.props.loading)return null;var r=this.props.editing?void 0:c.default.createElement("div",{id:"track-upload-select-container"},c.default.createElement("input",{type:"file",className:"file-input",onChange:this.handleFileChange}),c.default.createElement("div",{id:"track-upload-select",onClick:function(){return document.querySelector(".file-input").click()}},this.state.file?this.state.file.name:"Select a file"),t.file);this.props.editing||(o=c.default.createElement("div",{className:"image-input-container"},c.default.createElement("input",{className:"image-input",type:"file",onChange:this.handleImageChange}),c.default.createElement("img",{src:n,className:"medium-large cover-art"}),c.default.createElement("div",null),c.default.createElement("button",{className:"blue_button",onClick:function(){return document.querySelector(".image-input").click()}},"change image")));return c.default.createElement("div",{className:"track-form-content"},o,c.default.createElement("div",{className:"floater2"},c.default.createElement("h2",null,this.props.editing?"Edit your Track":"Upload a Track"),c.default.createElement("form",{className:"track_form",onSubmit:this.handleSubmit},r,c.default.createElement("div",null,c.default.createElement("input",{type:"text",value:this.state.labelTitle?"Name your track":this.state.title,onChange:this.handleChange("title"),onFocus:function(){return e.setState({labelTitle:!1})},onBlur:function(){return e.setState({labelTitle:0===e.state.title.length})}}),t.title),c.default.createElement("div",null,c.default.createElement("textArea",{value:this.state.labelDescription?"Describe your track":this.state.description,onFocus:function(){return e.setState({labelDescription:!1})},onBlur:function(){return e.setState({labelDescription:0===e.state.description.length})},onChange:this.handleChange("description")}),t.description),c.default.createElement("div",null,c.default.createElement("input",{type:"submit",className:"blue_button",value:this.props.editing?"Update":"Upload"})))))}}]),t}(c.default.Component);t.default=l},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=n(9),p=n(10),d=n(48),f=n(294),h=o(f),m=n(16),v=n(36),y=function(e,t){return{loading:e.loading.mainContent,track:e.entities.tracks[t.trackId],current_user_id:(0,v.current_user_id)(e)}},g=function(e,t){return{deleteTrack:function(){e((0,m.deleteTrackThunk)(t.trackId,function(){return location.hash="/"}))}}},E=function(e,t){return{trackId:t.match.params.trackId}},b=function(e,t){return{fetchTrack:function(t){e((0,d.receiveMainContentLoading)()),e((0,m.fetchTrackThunk)(t,function(){return e((0,d.receiveMainContentLoaded)())}))}}},_=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.fetchTrack(this.props.trackId)}},{key:"componentWillReceiveProps",value:function(e){e.trackId!=this.props.trackId&&this.props.fetchTrack(e.trackId)}},{key:"render",value:function(){return c.default.createElement(O,{trackId:this.props.trackId})}}]),t}(c.default.Component),O=(0,l.connect)(y,g)(h.default);t.default=(0,p.withRouter)((0,l.connect)(E,b)(_))},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=n(10),p=n(295),d=o(p),f=n(74),h=n(132),m=o(h),v=n(133),y=o(v),g=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleDelete=n.handleDelete.bind(n),n}return a(t,e),u(t,[{key:"handleDelete",value:function(){confirm('Are you sure you would like to\n       delete "'+this.props.track.title+'"?')&&this.props.deleteTrack()}},{key:"render",value:function(){if(this.props.loading)return null;var e=void 0,t=void 0;return this.props.current_user_id===this.props.track.artist_id&&(e=c.default.createElement(l.Link,{className:"blue_button",to:"/tracks/"+this.props.track.id+"/edit"},"Edit"),t=c.default.createElement("button",{className:"blue_button",onClick:this.handleDelete},"Delete")),c.default.createElement("div",{className:"track_show_content"},c.default.createElement("div",{className:"banner"},c.default.createElement("div",{id:"track_banner_left_side"},c.default.createElement("div",null,c.default.createElement("div",{className:"artist_and_play_button"},c.default.createElement(m.default,{large:!0,trackId:this.props.track.id}),c.default.createElement("div",{className:"track_info_container"},c.default.createElement("div",{className:"banner-info-text"},c.default.createElement("a",null,this.props.track.artist_display_name," ")),c.default.createElement("div",{className:"banner-info-text"},c.default.createElement("a",null,this.props.track.title)))),c.default.createElement("div",null,this.props.track.created_at.slice(0,10))),c.default.createElement("div",{id:"show_page_waveform_container"},c.default.createElement("div",{className:"waveform"}))),c.default.createElement("div",{id:"track_banner_right_side"},c.default.createElement(y.default,{size:"large",inputId:"track-update-cover-art",type:"track",userId:this.props.track.artist_id,id:this.props.track.id,src:this.props.track.img_url}),c.default.createElement("ul",{id:"track_show_options"},c.default.createElement("li",null,e),c.default.createElement("li",null,t)))),c.default.createElement("div",{className:"rule"}),c.default.createElement("div",{id:"track_show_lower_half"},c.default.createElement("div",{id:"artist_and_comments"},c.default.createElement("div",{className:"song_show_artist_info"},c.default.createElement("img",{className:"user-img-medium",onClick:(0,f.redirectToUser)(this.props.track.artist_id),src:this.props.track.artist_img}),this.props.track.artist_display_name),c.default.createElement("div",{id:"description_and_comments"},c.default.createElement("div",{id:"track_description"},this.props.track.description),c.default.createElement(d.default,{trackId:this.props.track.id})))))}}]),t}(c.default.Component);t.default=g},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(9),c=(n(10),n(75)),l=n(23),p=n(297),d=o(p),f=n(1),h=o(f),m=n(36),v=function(e,t){return{fetchComments:function(){e((0,c.receiveCommentsLoading)()),e((0,l.receiveUsersLoading)()),e((0,c.fetchCommentsThunk)(t.trackId)),e((0,l.fetchTrackCommentsUsersThunk)(t.trackId))}}},y=function(e,t){return{}},g=function(e,t){return{loading:e.loading.comments||e.loading.users,comments:e.entities.comments,loggedIn:(0,m.logged_in)(e)}},E=function(e,t){return{postComment:function(n,o){e((0,c.postCommentThunk)(t.trackId,n,o))}}},b=(0,s.connect)(g,E)(d.default),_=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.fetchComments()}},{key:"componentWillReceiveProps",value:function(e){this.props.trackId!==e.trackId&&this.props.fetchComments()}},{key:"render",value:function(){return h.default.createElement(b,{trackId:this.props.trackId,fetchComments:this.props.fetchComments})}}]),t}(h.default.Component);t.default=(0,s.connect)(y,v)(_)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchComments=function(e){return $.ajax({method:"get",url:"api/tracks/"+e+"/comments"})},t.postComment=function(e,t){return $.ajax({method:"post",url:"api/tracks/"+e+"/comments",data:t})}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=n(298),p=o(l),d=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={labelInput:!0,body:"",savedWidth:0,savedHeight:0},n.handleSubmit=n.handleSubmit.bind(n),n.handleChange=n.handleChange.bind(n),n.handleClick=n.handleClick.bind(n),n}return a(t,e),u(t,[{key:"handleChange",value:function(e){this.setState({body:e.target.value})}},{key:"handleSubmit",value:function(e){if(e.preventDefault(),this.props.loggedIn){var t=document.querySelector(".commentsIndex");this.setState({body:"",labelInput:!0,savedWidth:t.offsetWidth,savedHeight:t.offsetHeight}),this.props.postComment(this.state,this.props.fetchComments)}}},{key:"handleClick",value:function(e){e.preventDefault(),this.props.loggedIn||(location.hash="/login")}},{key:"render",value:function(){var e=this,t=this.props.loggedIn?"Add a Comment":"Please log in to add a comment";if(this.props.loading)return c.default.createElement("div",{style:{width:this.state.savedWidth,height:this.state.savedHeight}});var n=this.props.comments.map(function(e){return c.default.createElement("li",{key:"comment"+e.id},c.default.createElement(p.default,{comment:e}))});return c.default.createElement("div",{className:"commentsIndex"},c.default.createElement("form",{id:"commentForm",onSubmit:this.handleSubmit},c.default.createElement("input",{type:"text",onChange:this.handleChange,onClick:this.handleClick,onBlur:function(){return e.setState({labelInput:0===e.state.body.length})},onFocus:function(){return e.setState({labelInput:!1})},value:this.state.labelInput?t:this.state.body})),c.default.createElement("ul",null,n))}}]),t}(c.default.Component);t.default=d},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),r=n(299),i=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(e,t){return{user:e.entities.users[t.comment.user_id]}};t.default=(0,o.connect)(a)(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(74),r=n(1),i=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e){return i.default.createElement("div",{className:"comment_item"},i.default.createElement("img",{className:"profile_thumbnail",onClick:(0,o.redirectToUser)(e.user.id),src:e.user.image_url}),i.default.createElement("div",{className:"comment_body_and_info"},i.default.createElement("div",{className:"comment_info"},i.default.createElement("div",{className:"username-link",onClick:(0,o.redirectToUser)(e.user.id)},""+(e.user.display_name?e.user.display_name:e.user.username))),i.default.createElement("div",{className:"comment_body"},e.comment.body)))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),r=function(e){return e&&e.__esModule?e:{default:e}}(o);t.default=function(e){return r.default.createElement("div",{className:"document-play-button "+(e.large?"large":"small"),onClick:i(e)},r.default.createElement("img",{className:a(e)?"":"hidden",src:window.pause_img_url}),r.default.createElement("img",{className:a(e)?"hidden":"",src:window.play_img_url}))};var i=function(e){return function(){e.current_in_playlist?e.playing?e.pauseTrack():e.resumeTrack():e.playTrack()}},a=function(e){return e.current_in_playlist&&e.playing}},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(1),s=function(e){return e&&e.__esModule?e:{default:e}}(u),c=function(e){function t(e){o(this,t);var n=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={src:!1},n.handleChange=n.handleChange.bind(n),n}return i(t,e),a(t,[{key:"handleChange",value:function(e){var t=e.target.files[0];this.setState({src:URL.createObjectURL(t)}),URL.revokeObjectURL(this.props.src),this.props.postAction(t)}},{key:"render",value:function(){var e=this,t=void 0;this.props.editable&&(t=s.default.createElement("button",{className:"blue_button",onClick:function(){return document.getElementById(e.props.inputId).click()}},"Update Image"));var n=this.state.src||this.props.src;return s.default.createElement("div",{className:"image-input-container"},s.default.createElement("input",{type:"file",className:"image-input",id:this.props.inputId,onChange:this.handleChange}),s.default.createElement("img",{src:n,className:(this.props.size?this.props.size:"")+" cover-art"}),t)}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.presignedUserPost=function(e,t){return $.ajax({method:"post",url:"/api/users/"+t+"/img/verify",data:{filename:e.name}})},t.presignedTrackPost=function(e,t){return $.ajax({method:"post",url:"/api/tracks/"+t+"/img/verify",data:{filename:e.name}})}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(9),c=n(10),l=n(304),p=o(l),d=n(1),f=o(d),h=n(48),m=n(23),v=function(e,t){return{loading:e.loading.mainContent,user:e.entities.users[t.userId]}},y=function(e,t){return{userId:t.match.params.userId}},g=function(e,t){return{fetchUser:function(t){e((0,h.receiveMainContentLoading)()),e((0,m.fetchUserThunk)(t,function(){return e((0,h.receiveMainContentLoaded)())}))}}},E=(0,c.withRouter)((0,s.connect)(v,b)(p.default)),b={},_=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.fetchUser(this.props.userId)}},{key:"componentWillReceiveProps",value:function(e){this.props.userId!==e.userId&&this.props.fetchUser(e.userId)}},{key:"render",value:function(){return f.default.createElement(E,{userId:this.props.userId})}}]),t}(f.default.Component);t.default=(0,c.withRouter)((0,s.connect)(y,g)(_))},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=n(305),p=o(l),d=n(133),f=o(d),h=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"display_name",value:function(){return this.props.user.display_name?this.props.user.display_name:this.props.user.username}},{key:"render",value:function(){var e=void 0;return this.props.loading?null:(this.props.user.location&&this.props.user.location.length>0&&(e=c.default.createElement("div",{className:"banner-info-text"},c.default.createElement("a",null,"this.props.user.loction"))),c.default.createElement("div",{className:"user-show-content"},c.default.createElement("div",{className:"user-show banner"},c.default.createElement(f.default,{src:this.props.user.image_url,inputId:"user-show-img-input",size:"medium",type:"user",id:this.props.user.id}),c.default.createElement("div",null,c.default.createElement("div",{className:"banner-info-text"},c.default.createElement("a",null,this.display_name())),e)),c.default.createElement(p.default,{trackIds:this.props.user.track_ids})))}}]),t}(c.default.Component);t.default=h},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=n(9),p=n(10),d=n(16),f=n(306),h=o(f),m=function(e,t){return{}},v=function(e,t){return{fetchUserTracks:function(){e((0,d.receiveTracksLoading)()),e((0,d.fetchUserTracksThunk)(t.match.params.userId,function(){return e((0,d.receiveTracksLoaded)())}))}}},y=function(e,t){return{loading:e.loading.tracks,tracks:t.trackIds.map(function(t){return e.entities.tracks[t]})}},g=function(e,t){return{}},E=(0,l.connect)(y,g)(h.default),b=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.fetchUserTracks()}},{key:"componentWillReceiveProps",value:function(e){this.props.trackIds!==e.trackIds&&this.props.fetchUserTracks()}},{key:"render",value:function(){return c.default.createElement(E,{trackIds:this.props.trackIds})}}]),t}(c.default.Component);t.default=(0,p.withRouter)((0,l.connect)(m,v)(b))},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=(n(10),n(307)),p=o(l),d=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"render",value:function(){if(this.props.loading)return null;var e=this.props.tracks.map(function(e){return c.default.createElement("li",{key:"trackItem"+e.id},c.default.createElement(p.default,{track:e}))});return c.default.createElement("div",{className:"tracks-index"},c.default.createElement("ul",null,e))}}]),t}(c.default.Component);t.default=d},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=o(r),a=n(10),u=n(132),s=o(u);t.default=function(e){return i.default.createElement("div",{className:"track-item"},i.default.createElement("img",{className:"medium cover-art",src:e.track.img_url,onClick:function(){return location.hash="/tracks/"+e.track.id}}),i.default.createElement("div",{className:"play-button-and-info"},i.default.createElement(s.default,{trackId:e.track.id}),i.default.createElement("div",{className:"info"},i.default.createElement(a.Link,{className:"username-link",to:"/users/"+e.track.artist_id},e.track.artist_display_name),i.default.createElement(a.Link,{className:"title-link",to:"/tracks/"+e.track.id},e.track.title))))}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=(o(r),n(9)),a=n(10),u=n(309),s=o(u),c=n(36),l=n(24),p=function(e){return{logged_in:(0,c.logged_in)(e),current_user_id:(0,c.current_user_id)(e)}},d=function(e){return{delete_session:function(){return e((0,l.deleteSessionThunk)())}}};t.default=(0,a.withRouter)((0,i.connect)(p,d)(s.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),r=function(e){return e&&e.__esModule?e:{default:e}}(o),i=n(10);t.default=function(e){var t=e.delete_session,n=e.logged_in,o=e.current_user_id,a=void 0;return a=n?r.default.createElement("button",{className:"logout_button",onClick:function(e){e.preventDefault(),t()}},"Log Out"):null,r.default.createElement("div",{className:"nav_link_set"},r.default.createElement(i.NavLink,{className:"top_nav_link",to:n?"/upload":"/login"},n?"Upload":"Log In"),r.default.createElement(i.NavLink,{className:"top_nav_link",to:n?"/users/"+o:"/signup"},n?"Profile":"Sign Up"),a)}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=(o(r),n(9)),a=n(311),u=o(a),s=n(16),c=function(e,t){return{progress:e.upload.progress,active:e.upload.active,errors:e.errors.upload,processed:e.upload.processed}},l=function(e,t){return{setInactive:function(){return e((0,s.receiveUploadInactive)())}}};t.default=(0,i.connect)(c,l)(u.default)},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(1),s=function(e){return e&&e.__esModule?e:{default:e}}(u),c=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"componentDidUpdate",value:function(){var e=document.getElementById("progress_bar"),t=e.getContext("2d"),n=e.width*this.props.progress;t.fillStyle="#2d7387",t.fillRect(0,0,n,e.height),this.props.progress<1&&(t.fillStyle="white",t.fillRect(n,0,e.width-n,e.height))}},{key:"render",value:function(){var e=this;if(this.props.active){var t=void 0;return t=this.props.errors.general.length>0?s.default.createElement("div",{className:"upload_error"},s.default.createElement("a",null,this.props.errors.general.join(", ")),s.default.createElement("button",{className:"red_button",onClick:function(){return e.props.setInactive()}},"OK")):1===this.props.progress?this.props.processed?s.default.createElement("div",null,s.default.createElement("a",null,"Upload Complete"),s.default.createElement("button",{className:"blue_button",onClick:function(){return e.props.setInactive()}},"OK")):s.default.createElement("a",null,"Processing..."):s.default.createElement("a",null,"Uploading..."),s.default.createElement("div",{id:"upload_progress"},t,s.default.createElement("canvas",{id:"progress_bar"}),s.default.createElement("div",null))}return null}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),r=n(16),i=n(313),a=function(e){return e&&e.__esModule?e:{default:e}}(i),u=function(e,t){return{playlist:e.playlist.ids,playing:e.playlist.playing,indexInPlaylist:0,fetchForCache:function(e,t,n){return(0,r.fetchBinaryData)(e,t,n)}}},s=function(e,t){return{}};t.default=(0,o.connect)(u,s)(a.default)},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(1),c=o(s),l=n(314),p=o(l),d=5,f=Math.floor(d/2),h=function(e){return function(t,n){for(var o=[],r=0;r<d;++r)o.push(t.cache[r+e]||n.playlist[n.indexInPlaylist+r-f]);return{cache:o,playing:!1,waitingToPlay:!0,audioSource:null,srcIsValid:!1}}},m=function(e){return function(t,n){for(var o=[],r=0;r<d;++r)o.push({id:e[n.indexInPlaylist+r-f]});return{cache:o,playing:!1,waitingToPlay:!0,srcIsValid:!1}}},v=function(e,t){if(e.loaded&&!e.srcIsValid)return e.audioSource.src=URL.createObjectURL(e.cache[f].binaryData),{srcIsValid:!0}},y=function(e,t){return{loaded:Boolean(e.cache[f].binaryData)}},g=function(e,t){if(e.waitingToPlay&&!e.playing&&e.loaded)return e.audioSource.play(),{waitingToPlay:!1,playing:!0}},E=function e(t){return function(n,o){var r=n.cache[f];return r.id?r.binaryData||r.fetching?void 0:void o.fetchForCache(r,r.id,function(){t.setState(y),t.setState(v),t.setState(g),t.setState(e(t))}):{}}},b=function(e){function t(e){r(this,t);for(var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),o=[],a=0;a<d;++a)o.push({id:void 0});return n.state={position:0,loaded:!1,waitingToPlay:!1,playing:!1,cache:o,audioCtx:new(window.AudioContext||window.webkitAudioContext),audioSource:document.querySelector("audio")},n}return a(t,e),u(t,[{key:"componentWillReceiveProps",value:function(e){e.playing!==this.props.playing&&(e.playing?this.setState({waitingToPlay:!0}):(this.setState({playing:!1}),this.state.audioSource.pause())),this.props.playlist===e.playlist?e.indexInPlaylist!=this.props.indexInPlaylist&&this.setState(h(e.indexInPlaylist-this.props.indexInPlaylist)):this.setState(m(e.playlist)),this.cacheHandleLoop()}},{key:"cacheHandleLoop",value:function(){this.setState(y),this.setState(v),this.setState(g),this.setState(E(this))}},{key:"handlePlay",value:function(){this.props.startPlayback()}},{key:"handleSeek",value:function(e){position=e.target.clientX/e.target.offsetX,this.setState({position:position}),this.setState(function(e,t){return{waitingToPlay:e.playing}}),this.cacheHandleLoop()}},{key:"handlePause",value:function(){this.props.stopPlayback()}},{key:"render",value:function(){return c.default.createElement("div",{className:"audio-progress"},c.default.createElement(p.default,{loaded:this.state.loaded,playing:this.props.playing}))}}]),t}(c.default.Component);t.default=b},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),r=n(315),i=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(76),u=function(e,t){return{}},s=function(e,t){return{playAction:function(){return e((0,a.startPlayback)())},pauseAction:function(){return e((0,a.pausePlayback)())}}};t.default=(0,o.connect)(u,s)(i.default)},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=n(1),s=function(e){return e&&e.__esModule?e:{default:e}}(u),c=function(e){function t(e){o(this,t);var n=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleStartSeeking=n.handleStartSeeking.bind(n),n.handleSeeking=n.handleSeeking.bind(n),n.handleStopSeeking=n.handleStopSeeking.bind(n),n.assignCanvas=n.assignCanvas.bind(n),n.audioElement=document.querySelector("audio"),n.assignCanvasContainer=n.assignCanvasContainer.bind(n),n}return i(t,e),a(t,[{key:"handleTimeChange",value:function(e){var t=this;return function(){return t.setState({progress:e.currentTime/e.duration})}}}]),a(t,[{key:"componentWillMount",value:function(){this.state={progress:0};var e=document.querySelector("audio");e.addEventListener("timeupdate",this.handleTimeChange(e))}},{key:"assignCanvasContainer",value:function(e){this.canvasCont=e}},{key:"assignCanvas",value:function(e){this.canvas=e,this.canvasCtx=e.getContext("2d")}},{key:"render",value:function(){var e=this,t=s.default.createElement("svg",{viewBox:"0,0,50,50",onClick:function(){e.props.loaded&&e.props.playAction()}},s.default.createElement("polygon",{points:"0,0 50,25 0,50",fill:"white"})),n=s.default.createElement("svg",{viewBox:"0,0,50,50",onClick:this.props.forwardAction},s.default.createElement("polygon",{points:"0,10 25,25 0,40",fill:"white"}),s.default.createElement("polygon",{points:"25,10 50,25 25,40",fill:"white"})),o=s.default.createElement("svg",{viewBox:"0,0,50,50",onClick:this.props.pauseAction},s.default.createElement("polygon",{points:"0,0 20,0 20,50 0,50",fill:"white"}),s.default.createElement("polygon",{points:"30,0 50,0 50,50 30,50",fill:"white"})),r=s.default.createElement("svg",{viewBox:"0,0,50,50",onClick:this.props.backAction},s.default.createElement("polygon",{points:"50,10 25,25 50,40",fill:"white"}),s.default.createElement("polygon",{points:"25,10 0,25 25,40",fill:"white"}));return s.default.createElement("div",{id:"audio-controls-content",className:this.props.loaded?"active":""},s.default.createElement("div",{className:"controls"},s.default.createElement("div",null,r),s.default.createElement("div",null,this.props.playing?o:t),s.default.createElement("div",null,n)),s.default.createElement("div",{id:"audio-progress"},s.default.createElement("div",{id:"audio-current-time",className:this.props.loaded?"active":""},this.props.loaded?this.formatTime(this.audioElement.currentTime):this.formatTime(0)),s.default.createElement("div",{id:"audio-seek-container",className:this.props.loaded?"active":"",ref:this.assignCanvasContainer,onMouseDown:this.handleStartSeeking},s.default.createElement("canvas",{id:"audio-seek-canvas",ref:this.assignCanvas})),s.default.createElement("div",{id:"audio-duration",className:this.props.loaded?"active":""},this.props.loaded?this.formatTime(this.audioElement.duration):this.formatTime(0))))}},{key:"componentDidUpdate",value:function(){this.drawCanvas()}},{key:"formatTime",value:function(e){var t=Math.floor(e/60),n=Math.floor(e%60);return isNaN(t)?"0:00":t+":"+(n<10?"0":"")+n}},{key:"drawCanvas",value:function(){var e=this.canvas.width,t=this.canvas.width*this.state.progress,n=this.canvas.height;this.canvasCtx.fillStyle="#3f3f3f",this.canvasCtx.fillRect(0,0,e,n),this.props.loaded&&(this.canvasCtx.fillStyle="#0c70ae",this.canvasCtx.fillRect(0,0,t,n))}},{key:"handleStartSeeking",value:function(e){0===e.button&&(e.preventDefault(),this.handleSeeking(e),this.props.playing&&this.audioElement.pause(),window.addEventListener("mouseup",this.handleStopSeeking),window.addEventListener("mousemove",this.handleSeeking))}},{key:"handleStopSeeking",value:function(e){e.preventDefault(),this.props.playing&&this.audioElement.play(),window.removeEventListener("mouseup",this.handleStopSeeking),window.removeEventListener("mousemove",this.handleSeeking)}},{key:"handleSeeking",value:function(e){e.preventDefault();var t=this.canvas.getBoundingClientRect(),n=t.right-t.left,o=e.clientX-t.left;o<0&&(o=0),this.audioElement.currentTime=o/n*this.audioElement.duration}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(29),i=n(317),a=o(i),u=n(318),s=o(u);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,r.createStore)(s.default,e,(0,r.applyMiddleware)(a.default))}},function(e,t,n){"use strict";function o(e){return function(t){var n=t.dispatch,o=t.getState;return function(t){return function(r){return"function"==typeof r?r(n,o,e):t(r)}}}}t.__esModule=!0;var r=o();r.withExtraArgument=o,t.default=r},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(29),i=n(319),a=o(i),u=n(323),s=o(u),c=n(324),l=o(c),p=n(328),d=o(p),f=n(329),h=o(f),m=n(334),v=o(m);t.default=(0,r.combineReducers)({entities:a.default,session:s.default,errors:l.default,upload:d.default,loading:h.default,playlist:v.default})},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(29),i=n(320),a=o(i),u=n(321),s=o(u),c=n(322),l=o(c);t.default=(0,r.combineReducers)({tracks:a.default,users:s.default,comments:l.default})},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0});var r=n(16);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];switch(t.type){case r.RECEIVE_TRACKS:return t.payload;case r.RECEIVE_TRACK:return Object.assign({},e,o({},t.payload.id,t.payload));default:return e}}},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0});var r=n(24),i=n(23),a={};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,t=arguments[1];switch(t.type){case r.RECEIVE_SESSION:return Object.assign({},e,o({},t.payload.id,t.payload));case i.RECEIVE_USERS:return t.payload;case i.RECEIVE_USER:return Object.assign({},e,o({},t.payload.id,t.payload));default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(75);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];switch(t.type){case o.RECEIVE_COMMENTS:return t.payload;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(24),r={current_user:null};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,t=arguments[1];switch(t.type){case o.RECEIVE_SESSION:return{current_user:t.payload.id};case o.DELETE_SESSION:return r;default:return e}}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(29),i=n(325),a=o(i),u=n(326),s=o(u),c=n(327),l=o(c);t.default=(0,r.combineReducers)({session:a.default,upload:s.default,uploadParams:l.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(23),r=n(24);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(t.type){case o.RECIEVE_USER:case o.RECIEVE_USERS:return[];case r.RECEIVE_SESSION_ERRORS:return t.errors;case r.CLEAR_SESSION_ERRORS:return[];default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(16),r={general:[]};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,t=arguments[1];switch(t.type){case o.RECEIVE_UPLOAD_ERRORS:return Object.assign({},e,t.payload);case o.RECEIVE_UPLOAD_INACTIVE:return r;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(16),r={general:[]};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,t=arguments[1];switch(t.type){case o.RECEIVE_UPLOAD_PARAMS_ERRORS:return Object.assign({},e,t.payload);case o.CLEAR_UPLOAD_PARAMS_ERRORS:return r;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(16),r={active:!1,progress:0,processed:!1};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,t=arguments[1];switch(t.type){case o.RECEIVE_UPLOAD_PROGRESS:return Object.assign({},e,{progress:t.payload});case o.RECEIVE_UPLOAD_ACTIVE:return Object.assign({},e,{active:!0});case o.RECEIVE_UPLOAD_INACTIVE:return r;case o.RECEIVE_UPLOAD_COMPLETED:return Object.assign({},e,{progress:1});case o.RECEIVE_UPLOAD_PROCESSED:return Object.assign({},e,{processed:!0});default:return e}}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(29),i=n(330),a=o(i),u=n(331),s=o(u),c=n(332),l=o(c),p=n(333),d=o(p);t.default=(0,r.combineReducers)({mainContent:a.default,comments:s.default,users:l.default,tracks:d.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(48);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];switch(arguments[1].type){case o.RECEIVE_MAIN_CONTENT_LOADING:return!0;case o.RECEIVE_MAIN_CONTENT_LOADED:return!1;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(75);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];switch(arguments[1].type){case o.RECEIVE_COMMENTS_LOADING:return!0;case o.RECEIVE_COMMENTS_LOADED:return!1;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(23);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];switch(arguments[1].type){case o.RECEIVE_USERS_LOADED:return!1;case o.RECEIVE_USERS_LOADING:return!0;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(16);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];switch(arguments[1].type){case o.RECEIVE_TRACKS_LOADED:return!1;case o.RECEIVE_TRACKS_LOADING:return!0;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(76),r={ids:[],currentIndex:0,playing:!1};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,t=arguments[1];switch(t.type){case o.RECEIVE_PLAYLIST:return Object.assign({},e,{ids:t.payload,playing:!0});case o.START_PLAYBACK:return Object.assign({},e,{playing:!0});case o.PAUSE_PLAYBACK:return Object.assign({},e,{playing:!1});default:return e}}}]);
//# sourceMappingURL=bundle.js.map
;
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */

( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
