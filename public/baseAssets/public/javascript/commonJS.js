/**
 * 公共代码 修改请慎重
 * 全局变量
 */

if (typeof Vue === 'function') Vue.config.productionTip = false;
/** 公共ajax
 * @param type
 * @param url
 * @param param
 * @param async
 * @param success_callback
 * @param fail_callback
 * @returns {boolean}
 */
function mas_ajax(type, url, param, async, success_callback, fail_callback) {
    var ajaxURL = '';
    if (Array.isArray(url)) { ajaxURL = url[0] + url[1] }
    else { ajaxURL = baseAPI + url }
    if (!Array.isArray(url) && url.indexOf('http') >= 0) {
        ajaxURL = url
    }
    $.ajax({
        cache: true,
        type: type,
        url: ajaxURL,
        data: param,
        dataType: "json",
        async: async,
        error: function () {
            fail_callback && fail_callback()
        },
        success: function (res) {
            success_callback && success_callback(res)
        }
    })
}
/**
 * 打开新页面
 * @param url
 * @param timer
 */
function open_new_page(url, timer) { if (!timer) { timer = 500 } setTimeout(function () { window.location.href = url }, timer) }
/**
 * 跳转页面
 * @param url
 */
function page_to_other(url) { window.location.href = url }
/**
 * 获取url中的文件名
 * @returns {string}
 */
function get_html_doc_name() { var str = window.location.href; str = str.substring(str.lastIndexOf("/") + 1); str = str.substring(0, str.lastIndexOf(".")); return str; }
/**
 * 时间戳转格式化时间字符串
 * @param timestamp
 * @param date_str
 * @param time_str
 * @returns {{date_format: string, time_format: string}}
 */
// console.log(timestamp_format_date(1523175846).date_format)
function timestamp_format_date(timestamp, date_str, time_str) { var currTime = new Date(); var now = new Date(timestamp * 1000); var year = now.getFullYear().toString(); var month = (now.getMonth() + 1).toString(); var date = now.getDate().toString(); var hour = now.getHours().toString(); var minutes = now.getMinutes().toString(); var seconds = now.getSeconds().toString(); if (month.length === 1) month = '0' + month; if (minutes.length === 1) minutes = '0' + minutes; if (seconds.length === 1) seconds = '0' + seconds; switch (now.getDay()) { case 0: week = "星期天"; break; case 1: week = "星期一"; break; case 2: week = "星期二"; break; case 3: week = "星期三"; break; case 4: week = "星期四"; break; case 5: week = "星期五"; break; case 6: week = "星期六"; break }var date_format = year + '-' + month + '-' + date + ''; var time_format = hour + ':' + minutes + ':' + seconds; var time_allFormat = ''; var currMsgTime = parseInt(month + date + hour + minutes); var storageTime = parseInt(sessionStorage.getItem('nextMsgTime')); if (year >= 2018 && (!storageTime || Math.abs(currMsgTime - storageTime) > 10)) { if (currTime.getFullYear() == year && currTime.getMonth() + 1 == month && currTime.getDate() == date) { time_allFormat = '<span class="timeSPAN">&nbsp;' + hour + ':' + minutes + '&nbsp;</span>' } else if (currTime.getFullYear() == year && currTime.getMonth() + 1 == month && currTime.getDate() - 1 == date) { time_allFormat = '<span class="timeSPAN">&nbsp;昨天&nbsp;' + hour + ':' + minutes + '&nbsp;</span>' } else if (currTime.getFullYear() == year && currTime.getMonth() + 1 == month && currTime.getDate() - 2 == date) { time_allFormat = '<span class="timeSPAN">&nbsp;' + week + hour + ':' + minutes + '&nbsp;</span>' } else { time_allFormat = '<span class="timeSPAN">&nbsp;' + year + '年' + month + '月' + date + '日' + hour + ':' + minutes + '&nbsp;</span>' } } if (app.currTab == 'intimate') { sessionStorage.setItem('nextMsgTime', 0) } else { sessionStorage.setItem('nextMsgTime', currMsgTime) } return { date_format: date_format, time_format: time_format, time_allFormat: time_allFormat } }
/**
 * 获取字符串中的数字
 * @param str
 * @returns {Array|{index: number, input: string}}
 */
function getStrNum(str) { var obj = str.match(/[\d]+/g); return obj ? obj : []; }

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
        var URLtext = window.location.search,
            urlLen = window.location.search.lastIndexOf('?');
        var currURL = replacepos(URLtext, urlLen, urlLen + 1, '&');
        window.location.search = currURL
    }
    var ResultUrl = '';
    if (window.location.href.indexOf('?') >= 0) {
        ResultUrl = window.location.href.split('?').pop()
    }
    var r = ResultUrl.match(reg);
    if (r != null) {
        return decodeURI(r[2])
    } else {
        return null
    }
}
function replacepos(text, start, stop, replacetext) { mystr = text.substring(0, stop - 1) + replacetext + text.substring(stop + 1); return mystr }
/**
 * 删除指定的URL参数值
 * URL:http://www.quwan.com/index?name=tyler
 * 参数：paramName URL参数
 * 调用方法:delUrlParam("name")
 * 返回值:tyler
 */
function delUrlParam(paramName, urlParam) { var str = ""; var url; if (urlParam) { url = urlParam } else { url = window.location.href } if (url.indexOf('?') != -1) str = url.substr(url.indexOf('?') + 1); else return url; var arr = ""; var returnurl = ""; var setparam = ""; if (str.indexOf('&') != -1) { arr = str.split('&'); for (i in arr) { if (arr[i].split('=')[0] != paramName) { returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&" } } return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1) } else { arr = str.split('='); if (arr[0] == paramName) return url.substr(0, url.indexOf('?')); else return url } }

/**
 *2.5s 刷新当前页面
 */
function reload_page() {
    setTimeout(function () {
        window.location.reload();
    }, 500)
}

/***
 * 数组对象排序
 * @param prop
 * @returns {Function}
 */
var compare = function (prop) { return function (obj1, obj2) { var val1 = obj1[prop]; var val2 = obj2[prop]; if (obj1['owner'] == true) { return 1 } if (obj2['owner'] == true) { return 1 } if (val1 < val2) { return 1 } else if (val1 > val2) { return -1 } else { return 0 } } }
/***
 * 数组对象 筛选特定值 id
 * @param arry
 * @param index
 * @returns {*}
 */
function getParamDetail(arry, index) {
    var newArr = arry.filter(function (arry) {
        return arry.id.match(index)
    });
    return newArr
}

//数组去重
function unique(arr) {
    var obj = {};
    return arr.filter(function (item, index, arr) {
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

/***
 * UTF转北京时间
 * @param timeUTC
 * @returns {string}
 * @constructor
 */
function UTC2BeiJing(timeUTC) {
    if (timeUTC && timeUTC.indexOf('T') > 0) {
        return timeUTC.replace(/T/g, ' ')
    } else {
        var Y, MA, D, H, MI, S, time = new Date(timeUTC); Y = time.getFullYear(); MA = time.getMonth() + 1; D = time.getDate(); H = time.getHours(); MI = time.getMinutes(); S = time.getSeconds(); return Y + '-' + (MA < 10 ? '0' + MA : MA) + '-' + (D < 10 ? '0' + D : D) + ' ' + (H < 10 ? '0' + H : H) + ':' + (MI < 10 ? '0' + MI : MI) + ':' + (S < 10 ? '0' + S : S)
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); return fmt }

/**
 * 将一维的扁平数组转换为多层级对象
 * @param  {[type]} list 一维数组，数组中每一个元素需包含描述上下级的两个属性
 * @return {[type]} tree 多层级树状结构
 */
function lineToTree(data) { var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'path'; var parentId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'parentPath'; var children = 'children'; var valueMap = [], tree = []; data.forEach(function (v) { valueMap[v[value]] = v }); data.forEach(function (v) { var parent = valueMap[v[parentId]]; if (parent) { !parent[children] && (parent[children] = []); parent[children].push(v) } else { tree.push(v) } }); return tree }

/**
 * 隨機數
 * @param len
 * @returns {string}
 * @constructor
 */
function RandomId(len) {
    return Math.random().toString(36).substr(3, len);
};

/***
 * 添加指定的URL参数值
 * @param uri
 * @param key
 * @param value
 * @returns {string|*}
 */
function updateQueryStringParameter(uri, key, value) {
    if (!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

/**
 * 公共ajax
 * @param type
 * @param url
 * @param param
 * @param async
 * @param success_callback
 * @param fail_callback
 * @returns {boolean}
 */

function common_ajax(type, url, param, async, success_callback, fail_callback) {
    var ajaxURL = '';
    if (Array.isArray(url)) { ajaxURL = url[0] + url[1] }
    else { ajaxURL = baseAPI + url }
    if (!Array.isArray(url) && url.indexOf('http') >= 0) {
        ajaxURL = url
    }
    $.ajax({
        cache: true,
        type: type,
        url: ajaxURL,
        data: param,
        dataType: "json",
        async: async,
        error: function () {
            fail_callback && fail_callback()
        },
        success: function (res) {
            success_callback && success_callback(res)
        }
    })
}

/**
 * 公共ajax（补充，可以灵活配置content-type等）
 * @param url
 * @param params
 * @param config
 * @param success_callback
 * @param fail_callback
 * @returns {boolean}
*/

function ajaxReq(url, parmas, config, success_callback, fail_callback) {
    var ajaxURL = '', defaultConfig = {};
    if (Array.isArray(url)) { ajaxURL = url[0] + url[1] }
    else { ajaxURL = baseAPI + url }
    if (!Array.isArray(url) && url.indexOf('http') >= 0) {
        ajaxURL = url
    }

    defaultConfig = {
        url: ajaxURL,
        data: parmas,
        cache: true,
        type: 'GET',
        dataType: 'json',
        async: true,
        error: function () {
            fail_callback && fail_callback()
        },
        success: function (res) {
            success_callback && success_callback(res)
        }
    }

    $.extend(defaultConfig, config)
    $.ajax(defaultConfig)
}


/**
 * 月份排序
 * @param obj1
 * @param obj2
 * @returns {number}
 */
var compare2 = function (obj1, obj2) {
    var val1 = Number(obj1.Month);
    var val2 = Number(obj2.Month);
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
/**
 * 年排序
 * @param obj1
 * @param obj2
 * @returns {number}
 */
var compareByYear = function (obj1, obj2) {
    var val1 = Number(obj1.Year);
    var val2 = Number(obj2.Year);
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}
/**
 * 根据数组中某个对象值去重
 * @param arr
 * @param key
 * @returns {*}
 */
function unique2(arr, key) {
    var res = new Map();
    return arr.filter(function (a) {
        return !res.has(a[key]) && res.set(a[key], 1);
    });
}
/***
 * 数组对象 筛选特定值 time
 * @param arry
 * @param index
 * @returns {*}
 */
function getParamDetail2(arry, index) {
    var newArr = arry.filter(function (arry) {
        return arry.Month.match(index)
    });
    return newArr
}
/***
 * 数组对象 筛选特定值 部门
 * @param arry
 * @param Department
 * @returns {*}
 */
function getByDepartment(arry, index) {
    var newArr = arry.filter(function (arry) {
        return arry.Department.match(index)
    });
    return newArr
}
/***
 * 数组对象 筛选特定值 年份
 * @param arry
 * @param Year
 * @returns {*}
 */
function getByYear(arry, index) {
    var newArr = arry.filter(function (arry) {
        return arry.Year.match(index)
    });
    return newArr
}
//   arr=>符合格式的原始对象数组,
//   key=>作为求和条件的对象属性名
//   val=>需要求和的对象属性名
function getSum(arr, key, val) {
    var newArr = Array.from(arr.reduce(function (dict, item) {
        if (dict.has(item[key])) {
            dict.get(item[key]).push(item[val]);
        } else {
            dict.set(item[key], [item[val]]);
        }
        return dict;
    }, new Map())).map(function (item) {
        return {
            key: item[0],
            val: item[1]
        };
    });

    var _loop = function _loop(j, _k) {
        if (j == _k) {
            var i = 0;
            newArr[j].val.forEach(function (item) {
                i += item;
                newArr[j].val = i;
            });
            _k++;
        }

        k = _k;
    };

    for (var j = 0, k = 0; j < newArr.length; j++) {
        _loop(j, k);
    }

    return newArr;
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
/**
 *@param name
 * @param url 地址  name：打开方式
 */
function openWindow(url, name) {
    var iWidth = 1100; //弹出窗口的宽度;
    var iHeight = 550; //弹出窗口的高度;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open(url, name, "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft + ",toolbar=no, directories=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no, alwaysRaised=yes,z-look=yes");
}
/***
 * 数组对象 筛选出相同keyword的数据
 * @param arry      数组对象
 * @param keyword   属性名
 * @param index     属性值
 * @returns {*}
 */
function getParamByKeyword(arry, keyword, index) {
    var newArr = arry.filter(function (arry) {
        return arry[keyword] === index
    });
    return newArr
}
