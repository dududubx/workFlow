/**
 * 公共代码 修改请慎重
 * 全局公用函数
 */
var ISAPP = !isPC();
if (typeof Vue === 'function') Vue.config.productionTip = false;
/**
 * 判断是否PC端
 * @returns {boolean}
 */
function isPC() { var userAgentInfo = navigator.userAgent; var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]; var flag = true; for (var v = 0; v < Agents.length; v++) { if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break } } return flag }
/** 公共ajax
 * @param type
 * @param url
 * @param param
 * @param async
 * @param success_callback
 * @param fail_callback
 * @returns {boolean}
 */
 function mas_ajax(type, url, param, success_callback, fail_callback,async) {
    var ajaxURL = '';
    if (Array.isArray(url)) { ajaxURL = url[0] + url[1] }
    else { ajaxURL = baseAPI + url }
    if (!Array.isArray(url) && url.indexOf('http') >= 0) {
        ajaxURL = url
    }
    $.ajax({
        headers:{
            token:localStorage.getItem("TOKEN")
        },
        // contentType:'application/json;charset=utf-8',
        cache: true,
        type: type,
        url: ajaxURL,
        data: param,
        dataType: "json",
        async:async==undefined ? true : async,
        error: function () {
            fail_callback && fail_callback();
        },
        success: function (res) {
            if(res.code == 200){
                success_callback && success_callback(res);
            }else{
                success_callback && success_callback({code:888,data:[]});
            }
        }
    })
}
function mas_ajax_json(type, url, param, success_callback, fail_callback,async) {
    var ajaxURL = '';
    if (Array.isArray(url)) { ajaxURL = url[0] + url[1] }
    else { ajaxURL = baseAPI + url }
    if (!Array.isArray(url) && url.indexOf('http') >= 0) {
        ajaxURL = url
    }
    $.ajax({
        headers:{
            token:localStorage.getItem("TOKEN")
        },
        contentType:'application/json;charset=utf-8',
        cache: true,
        type: type,
        url: ajaxURL,
        data: param,
        dataType: "json",
        async:async==undefined ? true : async,
        error: function () {
            fail_callback && fail_callback();
        },
        success: function (res) {
            success_callback && success_callback(res);
        }
    })
}
/***
 *对Date的扩展，将 Date 转化为指定格式的String
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt
 * @returns {void | string}
 * @constructor
 */
Date.prototype.Format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); return fmt }
/***
 * UTF转北京时间
 * @param timeUTC
 * @returns {string}
 * @constructor
 */
function UTC2BeiJing(timeUTC) { if (!timeUTC) { return "" } var Y, MA, D, H, MI, S, time = new Date(timeUTC); Y = time.getFullYear(); MA = time.getMonth() + 1; D = time.getDate(); H = time.getHours(); MI = time.getMinutes(); S = time.getSeconds(); return Y + '-' + (MA < 10 ? '0' + MA : MA) + '-' + (D < 10 ? '0' + D : D) + ' ' + (H < 10 ? '0' + H : H) + ':' + (MI < 10 ? '0' + MI : MI) + ':' + (S < 10 ? '0' + S : S) }
/**
 * 获取指定的URL参数值
 * URL:http://www.quwan.com/index?name=tyler
 * 参数：paramName URL参数
 * 调用方法:getParam("name")
 * 返回值:tyler
 */
function getParam(paramName) {
	var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
	if (window.location.search.indexOf('?') >= 0 && window.location.search.split('?').length > 2) {
		var URLtext = decodeURI(window.location.search),
			urlLen = window.location.search.lastIndexOf('?');
		var currURL = replacepos(URLtext, urlLen, urlLen + 1, '&');
		window.location.search = currURL
	}
    var ResultUrl = '';
    if(window.location.href.indexOf('?')>=0){
        ResultUrl = decodeURI(window.location.href).split('?').pop()
    }
	var r = ResultUrl.match(reg);
	if (r != null) {
		return decodeURI(r[2])
	} else {
		return null
	}
}
function getParam2(paramName){
    return getParam(paramName)
}
function replacepos(text, start, stop, replacetext) {
	mystr = text.substring(0, stop - 1) + replacetext + text.substring(stop + 1);
	return mystr
}
/**
 * 隨機數
 * @param len
 * @returns {string}
 * @constructor
 */
function RandomId(len) {
    return Math.random().toString(36).substr(3, len);
}
/**
 * 根据数组中某个属性去重
 * @param arr
 * @param key
 * @returns {*}
 */
function unique(arr, key) { var res = new Map(); return arr.filter(function (a) { return !res.has(a[key]) && res.set(a[key], 1) }) }
/**
 * 根据数组中某个属性排序
 * @param arr
 * @param key
 * @returns {*}
 */
 function sortBy(attr, rev) {if (rev == undefined) {
    rev = 1;
} else {
    rev = (rev) ? 1 : -1;
}
return function (a, b) {
    a = Number(a[attr]);
    b = Number(b[attr]);
    if (a < b) {
        return rev * -1;
    }
    if (a > b) {
        return rev * 1;
    }
    return 0;
}}

/***
 * 数组对象 筛选出相同keyword的数据
 * @param arry      数组对象
 * @param keyword   属性名
 * @param index     属性值
 * @returns {*}
 */
function getParamByKeyword(arry, keyword, index) { var newArr = arry.filter(function (arry) { return arry[keyword] == index }); return newArr }
/**
 * 打开新页面
 * @param url
 * @param name
 * @param param
 */
function open_to_page(url, name, param) {
    if (ISAPP) { api.openWin({ name: name, url: url, pageParam: param }) } else { window.location.href = url }
}
/**
 * 跳转页面
 * @param url
 */
function page_to_other(url, name, param) { if (ISAPP) { api.openWin({ name: name, url: url, pageParam: param }) } else { window.location.href = url } }
/**
 * loading 动画
 * @type {string}
 */
// var loadingAnimation = `
//      <div v-if="visible" :id="loadId" class="chart-loader"><div class="loader"></div></div>
//     `;
var loadingAnimation = "\n     <div v-if=\"visible\" :id=\"loadId\" class=\"chart-loader\"><div class=\"loader\"></div></div>\n    ";
/**
 * 防抖函数
 * @param fn
 * @param wait
 * @returns {Function}
 */
function debounce(fn, wait) { var timeout = null; return function () { if (timeout !== null) clearTimeout(timeout); timeout = setTimeout(fn, wait) } }

/**
 * 节流函数
 * @param func
 * @param delay
 * @returns {Function}
 */
function throttle(func, delay) { var timer = null; var startTime = Date.now(); return function () { var curTime = Date.now(); var remaining = delay - (curTime - startTime); var context = this; var args = arguments; clearTimeout(timer); if (remaining <= 0) { func.apply(context, args); startTime = Date.now() } else { timer = setTimeout(func, remaining) } } }
/**
 * 获取字符串中的数字
 * @param str
 * @returns {Array|{index: number, input: string}}
 */
function getStrNum(str) { var obj = str.match(/[\d]+/g); return obj ? obj : []; }

/***
 * 浏览器全屏
 */
function fullscreen() {
    var elem = document.body;
    if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.requestFullScreen) {
        elem.requestFullscreen();
    } else {
        //浏览器不支持全屏API或已被禁用
    }
}
//弹出
function ErroAlert(e) {
    var index = layer.alert(e, { icon: 5, time: 2000, offset: 't', closeBtn: 0, title: '错误信息', btn: [], anim: 2, shade: 0 });
    layer.style(index, {
        color: '#777'
    });
}
/**
 * aja http://krampstudio.github.io/aja.js/
 * aja()方法
 * @version <=%pkg.version%>
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com> © 2015
 * @license MIT
 **/
/**
 * Aja.js
 * Ajax without XML : Asynchronous Javascript and JavaScript/JSON(P)
 *
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 */
(function () { 'use strict'; var types = ['html', 'json', 'jsonp', 'script']; var methods = ['connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace']; var aja = function aja() { var data = {}; var events = {}; var Aja = { url: function (url) { return _chain.call(this, 'url', url, validators.string) }, sync: function (sync) { return _chain.call(this, 'sync', sync, validators.bool) }, cache: function (cache) { return _chain.call(this, 'cache', cache, validators.bool) }, type: function (type) { return _chain.call(this, 'type', type, validators.type) }, header: function (name, value) { data.headers = data.headers || {}; validators.string(name); if (typeof value !== 'undefined') { validators.string(value); data.headers[name] = value; return this } return data.headers[name] }, auth: function (user, passwd) { validators.string(user); validators.string(passwd); data.auth = { user: user, passwd: passwd }; return this }, timeout: function (ms) { return _chain.call(this, 'timeout', ms, validators.positiveInteger) }, method: function (method) { return _chain.call(this, 'method', method, validators.method) }, queryString: function (params) { return _chain.call(this, 'queryString', params, validators.queryString) }, data: function (params) { var paramKeys = Object.keys(params), newData = {}; if (paramKeys && paramKeys.length > 0) { paramKeys.forEach(function (item) { if (typeof params[item] === "string" || typeof params[item] === "number") { newData[item] = params[item] } else if (typeof params[item] === "object") { for (var i in params[item]) { if (typeof params[item][i] === "string" || typeof params[item][i] === "number") { newData[item + '[' + i + ']'] = params[item][i] } else if (typeof params[item] === "object") { for (var i in params[item]) { newData[item + '[' + i + ']'] = params[item][i] } } } } }) } if (typeof newData === "object") { var params2 = Object.keys(newData), newData2 = {}; params2.forEach(function (item) { if (typeof newData[item] === "string" || typeof newData[item] === "number") { newData2[item] = newData[item] } else if (typeof newData[item] === "object") { for (var i in newData[item]) { if (typeof newData[item][i] === "string" || typeof newData[item][i] === "number") { newData2[item + '[' + i + ']'] = newData[item][i] } else if (typeof newData[item] === "object") { for (var i in newData[item]) { newData2[item + '[' + i + ']'] = newData[item][i] } } } } }); newData = newData2 } if (typeof newData === "object") { var params3 = Object.keys(newData), newData3 = {}; params3.forEach(function (item) { if (typeof newData[item] === "string" || typeof newData[item] === "number") { newData3[item] = newData[item] } else if (typeof newData[item] === "object") { for (var i in newData[item]) { if (typeof newData[item][i] === "string" || typeof newData[item][i] === "number") { newData3[item + '[' + i + ']'] = newData[item][i] } else if (typeof newData[item] === "object") { for (var i in newData[item]) { newData3[item + '[' + i + ']'] = newData[item][i] } } } } }); newData = newData2 } if (typeof newData === "object") { var params4 = Object.keys(newData), newData4 = {}; params4.forEach(function (item) { if (typeof newData[item] === "string" || typeof newData[item] === "number") { newData4[item] = newData[item] } else if (typeof newData[item] === "object") { for (var i in newData[item]) { if (typeof newData[item][i] === "string" || typeof newData[item][i] === "number") { newData4[item + '[' + i + ']'] = newData[item][i] } else if (typeof newData[item] === "object") { for (var i in newData[item]) { newData4[item + '[' + i + ']'] = newData[item][i] } } } } }); newData = newData4 } params = newData; return _chain.call(this, 'data', params, validators.plainObject) }, body: function (content) { return _chain.call(this, 'body', content, null, function (content) { if (typeof content === 'object') { if (!(content instanceof FormData)) { try { content = JSON.stringify(content) } catch (e) { throw new TypeError('Unable to stringify body\'s content : ' + e.name); } this.header('Content-Type', 'application/json') } } else { content = content + '' } return content }) }, into: function (selector) { return _chain.call(this, 'into', selector, validators.selector, function (selector) { if (typeof selector === 'string') { return document.querySelectorAll(selector) } if (selector instanceof HTMLElement) { return [selector] } }) }, jsonPaddingName: function (paramName) { return _chain.call(this, 'jsonPaddingName', paramName, validators.string) }, jsonPadding: function (padding) { return _chain.call(this, 'jsonPadding', padding, validators.func) }, on: function (name, cb) { if (typeof cb === 'function') { events[name] = events[name] || []; events[name].push(cb) } return this }, off: function (name) { events[name] = []; return this }, trigger: function (name, data) { var self = this; var eventCalls = function eventCalls(name, data) { if (events[name] instanceof Array) { events[name].forEach(function (event) { event.call(self, data) }) } }; if (typeof name !== 'undefined') { name = name + ''; var statusPattern = /^([0-9])([0-9x])([0-9x])$/i; var triggerStatus = name.match(statusPattern); if (triggerStatus && triggerStatus.length > 3) { Object.keys(events).forEach(function (eventName) { var listenerStatus = eventName.match(statusPattern); if (listenerStatus && listenerStatus.length > 3 && triggerStatus[1] === listenerStatus[1] && (listenerStatus[2] === 'x' || triggerStatus[2] === listenerStatus[2]) && (listenerStatus[3] === 'x' || triggerStatus[3] === listenerStatus[3])) { eventCalls(eventName, data) } }) } else if (events[name]) { eventCalls(name, data) } } return this }, go: function () { var type = data.type || (data.into ? 'html' : 'json'); var url = _buildQuery(); if (typeof ajaGo[type] === 'function') { return ajaGo[type].call(this, url) } } }; var ajaGo = { json: function (url) { var self = this; ajaGo._xhr.call(this, url, function processRes(res) { if (res) { try { res = JSON.parse(res) } catch (e) { self.trigger('error', e); return null } } if (res.Code == '-1') { localStorage.clear(); page_to_other('../../views/login/login.html') } return res }) }, html: function (url) { ajaGo._xhr.call(this, url, function processRes(res) { if (data.into && data.into.length) { [].forEach.call(data.into, function (elt) { elt.innerHTML = res }) } return res }) }, _xhr: function (url, processRes) { var self = this; var key, header; var method = data.method || 'get'; var async = data.sync !== true; var request = new XMLHttpRequest(); var _data = data.data; var body = data.body; var contentType = this.header('Content-Type'); var timeout = data.timeout; var timeoutId; var isUrlEncoded; var openParams; if (!contentType && _data && _dataInBody()) { this.header('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8'); contentType = this.header('Content-Type') } if (_data && _dataInBody()) { if (typeof body !== 'string') { body = '' } if (contentType.indexOf('json') > -1) { try { body = JSON.stringify(_data) } catch (e) { throw new TypeError('Unable to stringify body\'s content : ' + e.name); } } else { isUrlEncoded = contentType && contentType.indexOf('x-www-form-urlencoded') > 1; for (key in _data) { if (isUrlEncoded) { body += encodeURIComponent(key) + '=' + encodeURIComponent(_data[key]) + '&' } else { body += key + '=' + _data[key] + '\n\r' } } } } openParams = [method, url, async]; if (data.auth) { openParams.push(data.auth.user); openParams.push(data.auth.passwd) } request.open.apply(request, openParams); for (header in data.headers) { request.setRequestHeader(header, data.headers[header]) } request.onprogress = function (e) { if (e.lengthComputable) { self.trigger('progress', e.loaded / e.total) } }; request.onload = function onRequestLoad() { var response = request.responseText; if (timeoutId) { clearTimeout(timeoutId) } if (this.status >= 200 && this.status < 300) { if (typeof processRes === 'function') { response = processRes(response) } self.trigger('success', response) } self.trigger(this.status, response); self.trigger('end', response) }; request.onerror = function onRequestError(err) { if (timeoutId) { clearTimeout(timeoutId) } self.trigger('error', err, arguments) }; if (timeout) { timeoutId = setTimeout(function () { self.trigger('timeout', { type: 'timeout', expiredAfter: timeout }, request, arguments); request.abort() }, timeout) } request.send(body) }, jsonp: function (url) { var script; var self = this; var head = document.querySelector('head'); var async = data.sync !== true; var jsonPaddingName = data.jsonPaddingName || 'callback'; var jsonPadding = data.jsonPadding || ('_padd' + new Date().getTime() + Math.floor(Math.random() * 10000)); var paddingQuery = {}; if (aja[jsonPadding]) { throw new Error('Padding ' + jsonPadding + '  already exists. It must be unique.'); } if (!/^ajajsonp_/.test(jsonPadding)) { jsonPadding = 'ajajsonp_' + jsonPadding } window[jsonPadding] = function padding(response) { self.trigger('success', response); head.removeChild(script); window[jsonPadding] = undefined }; paddingQuery[jsonPaddingName] = jsonPadding; url = appendQueryString(url, paddingQuery); script = document.createElement('script'); script.async = async; script.src = url; script.onerror = function () { self.trigger('error', arguments); head.removeChild(script); window[jsonPadding] = undefined }; head.appendChild(script) }, script: function (url) { var self = this; var head = document.querySelector('head') || document.querySelector('body'); var async = data.sync !== true; var script; if (!head) { throw new Error('Ok, wait a second, you want to load a script, but you don\'t have at least a head or body tag...'); } script = document.createElement('script'); script.async = async; script.src = url; script.onerror = function onScriptError() { self.trigger('error', arguments); head.removeChild(script) }; script.onload = function onScriptLoad() { self.trigger('success', arguments) }; head.appendChild(script) } }; var _chain = function _chain(name, value, validator, update) { if (typeof value !== 'undefined') { if (typeof validator === 'function') { try { value = validator.call(validators, value) } catch (e) { throw new TypeError('Failed to set ' + name + ' : ' + e.message); } } if (typeof update === 'function') { data[name] = update.call(this, value) } else { data[name] = value } return this } return data[name] === 'undefined' ? null : data[name] }; var _dataInBody = function _dataInBody() { return ['delete', 'patch', 'post', 'put'].indexOf(data.method) > -1 }; var _buildQuery = function _buildQuery() { var url = data.url; var cache = typeof data.cache !== 'undefined' ? !!data.cache : true; var queryString = data.queryString || ''; var _data = data.data; if (cache === false) { queryString += '&ajabuster=' + new Date().getTime() } url = appendQueryString(url, queryString); if (_data && !_dataInBody()) { url = appendQueryString(url, _data) } return url }; return Aja }; var validators = { bool: function (value) { return !!value }, string: function (string) { if (typeof string !== 'string') { throw new TypeError('a string is expected, but ' + string + ' [' + (typeof string) + '] given'); } return string }, positiveInteger: function (integer) { if (parseInt(integer) !== integer || integer <= 0) { throw new TypeError('an integer is expected, but ' + integer + ' [' + (typeof integer) + '] given'); } return integer }, plainObject: function (object) { if (typeof object !== 'object' || object.constructor !== Object) { throw new TypeError('an object is expected, but ' + object + '  [' + (typeof object) + '] given'); } return object }, type: function (type) { type = this.string(type); if (types.indexOf(type.toLowerCase()) < 0) { throw new TypeError('a type in [' + types.join(', ') + '] is expected, but ' + type + ' given'); } return type.toLowerCase() }, method: function (method) { method = this.string(method); if (methods.indexOf(method.toLowerCase()) < 0) { throw new TypeError('a method in [' + methods.join(', ') + '] is expected, but ' + method + ' given'); } return method.toLowerCase() }, queryString: function (params) { var object = {}; if (typeof params === 'string') { params.replace('?', '').split('&').forEach(function (kv) { var pair = kv.split('='); if (pair.length === 2) { object[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]) } }) } else { object = params } return this.plainObject(object) }, selector: function (selector) { if (typeof selector !== 'string' && !(selector instanceof HTMLElement)) { throw new TypeError('a selector or an HTMLElement is expected, ' + selector + ' [' + (typeof selector) + '] given'); } return selector }, func: function (functionName) { functionName = this.string(functionName); if (!/^([a-zA-Z_])([a-zA-Z0-9_\-])+$/.test(functionName)) { throw new TypeError('a valid function name is expected, ' + functionName + ' [' + (typeof functionName) + '] given'); } return functionName } }; var appendQueryString = function appendQueryString(url, params) { var key; url = url || ''; if (params) { if (url.indexOf('?') === -1) { url += '?' } if (typeof params === 'string') { url += params } else if (typeof params === 'object') { for (key in params) { if (!/[?&]$/.test(url)) { url += '&' } url += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) } } } return url }; if (typeof window.define === 'function' && window.define.amd) { window.define([], function () { return aja }) } else if (typeof exports === 'object') { module.exports = aja } else { window.aja = window.aja || aja } }());
/***
 * 补齐URL
 * @param url
 * @returns {*}
 * @constructor
 */
function CompleteUrl(url) { if (url.substr(0, 7).toLowerCase() == "http://" || url.substr(0, 8).toLowerCase() == "https://") { return url } else { return "http://" + url } }
// 数组时分秒转换
function secondsFormat(s, type) {
    if (type == 'second') {
        if (s) {
            var day = Math.floor(s / (24 * 3600));
            var daystr = day > 0 ? day + "天" : '';
            var hour = Math.floor((s - day * 24 * 3600) / 3600);
            var hourstr = hour > 0 ? hour + "小时" : '';
            var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
            var minutestr = minute > 0 ? minute + "分" : '';
            var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
            var secondstr = second > 0 ? second + "秒" : '';
            return daystr + hourstr + minutestr;
        }
        else {
            return '0分钟'
        }
    } else if (type == 'minute') {
        if (s) {
            var day = Math.floor(s / (24 * 3600));
            var daystr = day > 0 ? day + "天" : '';
            var hour = Math.floor((s - day * 24 * 3600) / 3600);
            var hourstr = hour > 0 ? hour + "小时" : '';
            var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
            var minutestr = minute > 0 ? minute + "分" : '';
            return daystr + hourstr + minutestr;
        } else {
            return '0分钟'
        }

    }
}

/**
 * 将本地图片转base64编码
 * @param url
 * @param callback
 * @param outputFormat
 */
function getBase64FromLocalImg(url, callback, outputFormat) { var canvas = document.createElement('CANVAS'), ctx = canvas.getContext('2d'), img = new Image; var quality = 0.6; img.crossOrigin = 'Anonymous'; img.onload = function () { canvas.height = img.height; canvas.width = img.width; ctx.drawImage(img, 0, 0); var dataURL = canvas.toDataURL(outputFormat || 'image/png', quality); while (dataURL.length / 1024 > 150) { quality -= 0.01; dataURL = canvas.toDataURL("image/jpeg", quality) } while (dataURL.length / 1024 < 50) { quality += 0.001; dataURL = canvas.toDataURL("image/jpeg", quality) } callback.call(this, dataURL); canvas = null }; img.src = url }
// 假数据X轴
function getDateArray(startDate, endDate, space) {
    if (!endDate) {
        endDate = new Date();
    }
    if (!startDate) {
        // startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
        startDate = new Date(new Date(new Date().toLocaleDateString()).getTime());
    }
    if (!space) {
        space = 30 * 60 * 1000;
    } else {
        space = space * 60 * 1000;
    }
    var endTime = endDate.getTime();
    var startTime = startDate.getTime();
    var mod = endTime - startTime;
    if (mod <= space) {
        alert("时间太短");
        return;
    }
    var dateArray = [];
    while (mod >= space) {
        var d = new Date();
        d.setTime(startTime + space);
        dateArray.push(d);
        mod = mod - space;
        startTime = startTime + space;
    }
    var end = endDate.getTime();
    var start = startDate.getTime();
    dateArray.unshift(new Date(start)); // 插入开头时间
    // 正序
    return dateArray.sort(function (a, b) {
        return Date.parse(a) - Date.parse(b);
    });
}

/*js实现数组扁平化 实现一：递归*/
function flatArray(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatArray(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}
// 组态控制下发
function CtrlPointEquip(nodeData){
    if(nodeData && nodeData.getAttr('pointInfo')){
        var Info = JSON.parse(nodeData.getAttr('pointInfo'));
        if(!Info.PointCode){return;}
        // 先根据测点请求一次实时值
        mas_ajax('POST', '/XAYL_IotService/RealtimeDataHistory/GetRealDataMsg',[Info.PointCode], function (resp) {
            if(resp.code == 200 && resp.data && resp.data.length > 0){
                var PointRealInfo = resp.data[0]
                var RealTimeValue = PointRealInfo.RealtimeValue;
                mas_ajax('POST', '/XAYL_IotService/SystemInformation/SendLinkageControlMsg?SystemCode='+PointRealInfo.SystemCode,{
                    "id":PointRealInfo.PointCode,
                    "type": 1,
                    "ctrlType": 3,
                    "message": ''+RealTimeValue,
                    "pointList": PointRealInfo.PointCode,
                }, function (resp2) {
                    console.log(resp2)
                });
            }
        });
    }
}
