// •	主版本号：当你做了不兼容的 API 修改
var MainVersion = 'V1.0.1_'
    // •	次版本号：当你做了向下兼容的功能性新增
    ,
    Version = '0.0.1'
    // •	是否是内网环境.
    ,
    IsInnerNetwork = false
    // •	是否需要单点登录
    ,
    SingleLogin = false
    // •	API接口地址 like  http://10.10.100.3:8867
    ,
    baseAPI = ''
    // •	前端页面发布地址
    ,
    bdAPI = ''
    // •	前端页面d大数据平台发布地址
    ,
    wlwUrl = window.location.origin
    // masNVR服务地址
    ,
    masNVR = ''
    // 是否允许浏览器内核执行视频播放事件
    ,
    ToDoPlay = true
    // •	配置x,y正反方向,用于子系统定位数据
    ,
    AppTableIndex = 0,
    XaxisDirection = true,
    YaxisDirection = false
    // 定义GIS默认场景ID 用于组件选择
    ,
    GISSceneId = 'gis'
    // 定义平面图默认场景ID 用于组件选择
    ,
    HTSceneId = '67931647-28ac-4639-8003-c67550af984e'
    // 定义组件选择时的场景数据 来源于二三维协同设计
    // 定义危险作业图地址 用于五位一体-风险分区大数据
    ,
    tszfRegular = /[`~!@#$%^&*\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/g, //特殊字符正则表达式变量，如"[`@#`]"只过滤@和#，不配置除了_ . 都会过滤
    inputPlaceholder = "请输入",
    selectPlaceholder = "请选择",
    maxlength = 50,
    DangerWork = '',
    DefaultMapList = [{
        Name: '厂区GIS图',
        ID: GISSceneId
    }, {
        Name: '厂区平面图',
        ID: HTSceneId
    }],
    // 关闭列表页组织机构树
    closeIndexOrgTree = false,
    // 小安易联接口文档
    userIdShow = false,
    //是否启用中间页地址（登录后中间页）
    LoginMiddlePage = false,
    //中间页地址（loginMiddlePage设置为true生效）
    LoginMiddlePageUrl = '/pages/xapages/desktop/index.html',
    OrgTreeShowType = 'COMPANY'; //组织机构树加载类型(公司:COMPANY,部门:DEPARTMENT)
if (__TopPageInOrOut('192.168') || __TopPageInOrOut('127.0.0.1')) { //内网
    IsInnerNetwork = false;
    baseAPI = "http://192.168.100.74:3002";
    iframApi = 'http://192.168.100.74:3001'
    iotAPI = "http://localhost:5000";
    bdAPI = 'http://localhost:52879';
    lcsAPI = 'http://localhost:44346';
    wlwUrl = window.location.origin;
    masNVR = 'http://192.168.1.133:5035';
} else {
    IsInnerNetwork = true;
    baseAPI = "http://localhost:55954";
    iframApi = 'http://localhost:6422';
    bdAPI = 'http://127.0.0.1:52879';
    iotAPI = "http://192.168.1.142:12346";
    lcsAPI = 'http://127.0.0.1:44346';
    wlwUrl = window.location.origin;
    masNVR = 'http://192.168.1.133:5035';
}
/**
 * 判断内外网
 * @param a
 * @private
 */
function __TopPageInOrOut(a) {
    return 0 <= window.location.host.indexOf(a) || 0 <= window.document.referrer.indexOf(a);
}
//系统风格名称
var UIthemeNames = {
    'AdminDefault': '经典版',
    'AdminAccordion': '风尚版',
    'AdminWindows': '炫动版',
    'AdminTop': '飞扬版',
    'AdminTopMenu': '瀑布版',
    'AdminTopLeftMenu': '混合版',
    'AdminLeftDrawer': '时尚版'
};
// TODO 定义组态编辑器公共文本样式
var CommonTextStyle = {
    "text": "文本绑定", // 显示内容
    "text.color": "red", // 文本颜色
    "text.align": "center", // 水平布局方式
    "text.vAlign": "middle", // 垂直布局方式
    "text.font": "24px Arial", // 文本字体样式
    "interactive": true
};
// 单点登录操作

// 单点登录操作
var masAjax = {
    post: function(url, data, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8"
        );
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                fn.call(this, xhr.responseText);
            }
        };
        xhr.send(data);
    },
    get: function(url, data, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false); //同步请求
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                fn.call(this, xhr.responseText);
            }
        };
        xhr.send(data);
    },
};


var checkUrlParam = function(v) {
        if (v.match(/^[0-9a-zA-Z:%/,_.-]{1,}$/)) {
            return v;
        }
        return '';
    }
    /**
     * 2021-06-04 增加获取URLtoken方法，如果URL有TOKEN传入，默认使用此Token
     * 获取指定的URL参数值
     * URL:http://www.quwan.com/index?name=tyler
     * 参数： function getParamInUrl(paramName) {
     * 调用方法:getParamInUrl("name")
     * 返回值:tyler
     */
function getParamInUrl(paramName) {
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
//if (getParamInUrl('token') && getParamInUrl('token') != null) { localStorage.setItem('TOKEN', getParamInUrl('token')) }

/**
 * 请求小安易联的样式风格表，进行页面设置
 * 动态创建link 标签
 * @returns
 */
(function() {
    //如果是MVC页面，则不再追加样式引入
    if (document.getElementById("systemcolor")) return;
    var doc = document;
    var link = doc.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", baseAPI + "/UI/GetBaseColorCss?uicolor=" + escape((localStorage.getItem('uicolor') || '').split(',')[0]));

    var heads = doc.getElementsByTagName("head");
    if (heads.length) {
        heads[0].appendChild(link);
    } else {
        doc.documentElement.appendChild(link);
    }
})();
/*
 * 版 本 mas-ADMS-Core 梅安森敏捷开发框架()
 * Copyright (c) 2019-present 梅安森研发事业部
 * 创建人：梅安森研发事业部
 * 日 期：2018.05.10
 * 描 述：客户端语言包加载
 */
(function() {
    "use strict";
    //是否登记语言包中不存在的新单词
    var registerNewWord = true;
    //主语言-简体中文
    var mainType = 'chinese';
    //当前设置语言
    var setLanguage = localStorage.getItem('Language') || 'chinese';
    //已提交的新单词
    var savedNewWord = {};
    //语言包缓存加载完成
    var lgCacheLoaded = false;
    //通用方法
    window.maslg = {
        getMainCode: function() { return mainType; },
        //将主语言文本转换成设置的语言
        get: function(text) {
            //如果当前设置语言就是主语言，则直接返回原文
            if (mainType == setLanguage) {
                return text;
            } else {
                if (window["lg_" + setLanguage]) {
                    var _ntext = window["lg_" + setLanguage][text];
                    //如果没找到对应翻译，则考虑需要作为新单词记录在数据库
                    if (_ntext == null || _ntext == undefined) {
                        maslg.saveNewWord(text);
                        return text;
                    }
                    if (_ntext && _ntext.length && _ntext.length > 0) {
                        return _ntext;
                    }
                    return text;
                } else {
                    return text;
                }
            }
        },
        getSyn: function(text) {
            return text;
        },
        //保存缓存语言包不存在的新单词,待后续统一翻译
        saveNewWord: function(text) {
            if (registerNewWord != true || savedNewWord[text] || text == null || text == undefined || text == "") return;
            savedNewWord[text] = true;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", baseAPI + '/LGMap/SaveNewWord', true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.setRequestHeader("Token", localStorage.getItem('TOKEN'));
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                    console.log('submit new word ‘' + text + '’ -> ' + setLanguage);
                }
            };
            xhr.send("typeCode=" + setLanguage + "&word=" + text);
        },
        //设置文档标签语言转换
        settag: function(doc) {
            //如果当前设置语言就是主语言，则进行任何处理
            if (mainType == setLanguage) { return; }
            if (lgCacheLoaded) {
                var lgcss = (doc || document).getElementsByClassName('maslg');
                for (var i = 0; i < lgcss.length; i++) {
                    lgcss[i].innerText = maslg.get(lgcss[i].innerText);
                }
                var lgcsstitle = (doc || document).getElementsByClassName('maslg-title');
                for (var i = 0; i < lgcsstitle.length; i++) {
                    lgcsstitle[i].innerText = maslg.get(lgcsstitle[i].innerText);
                }
                var lgs = (doc || document).getElementsByTagName('lg');
                for (var i = 0; i < lgs.length; i++) {
                    lgs[i].innerText = maslg.get(lgs[i].innerText);
                }
                var inputs = (doc || document).getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].placeholder) {
                        if (inputs[i].islgget == true) continue;
                        inputs[i].setAttribute('placeholder', maslg.get(inputs[i].placeholder));
                        inputs[i].islgget = true;
                    }
                }
            } else {
                setTimeout(function() {
                    maslg.settag(doc);
                }, 200);
            }
        }
    };
    //如果当前设置语言不是主语言则加载设置语言的语言包缓存
    if (mainType != setLanguage) {
        if (parent["lg_" + setLanguage]) {
            window["lg_" + setLanguage] = parent["lg_" + setLanguage];
            setTimeout(function() {
                lgCacheLoaded = true;
                maslg.settag(document);
            }, 200);
        } else {
            //加载设置语言语言包缓存
            var lg_setted = document.createElement('script');
            lg_setted.src = baseAPI + "/js/language/lg_" + setLanguage + ".js?v=" + new Date().getMilliseconds();
            lg_setted.defer = true;
            lg_setted.onload = function() {
                lgCacheLoaded = true;
                maslg.settag(document);
            }
            document.head.appendChild(lg_setted);
        }
    }
})();

var masAjaxGetText = {
        get: function(url, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            // 添加http头，发送信息至服务器时内容编码类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                    fn.call(this, xhr.responseText);
                }
            };
            xhr.send();
        }
    }
    // 动态修改element的颜色样式
setTimeout(function() {
    //如果是MVC页面，则不再追加样式引入
    if (document.getElementById("systemcolor")) return;
    masAjaxGetText.get('/baseAssets/public/css/element.css', function(res) {
        var styleFGList = localStorage.getItem('uicolor');
        // 删除页面引入的element.css
        var linkList = document.getElementsByTagName('link');
        var HasElementUi = false;
        if (linkList && linkList.length > 0) {
            for (var i = 0; i < linkList.length; i++) {
                if (linkList[i] && linkList[i].href && linkList[i].href.indexOf('/public/css/element.css') != -1) {
                    linkList[i].parentNode.removeChild(linkList[i]);
                    HasElementUi = true;
                }
            }
        }
        if (!HasElementUi) return;
        if (styleFGList != null && styleFGList.indexOf(',') > -1) {
            var styleFG = styleFGList.split(',');
            var color1 = styleFG[0];
            var color2 = styleFG[1];
            var color3 = styleFG[2];
            var cssStyle = res.replace(/#409EFF/g, color1).replace(/#409eff/g, color1).replace(/#f0f7ff/g, color1)
                .replace(/#66b1ff/g, color2).replace(/#c6e2ff/g, color3).replace(/#ecf5ff/g, color3)
                .replace(/#3a8ee6/g, color2);
            var styleNode = document.createElement('style');
            styleNode.type = 'text/css';
            if (styleNode.styleSheet) {
                styleNode.styleSheet.cssText = cssStyle;
            } else {
                styleNode.innerHTML = cssStyle;
            }
            var StyleDom = document.getElementsByTagName('head')[0];
            StyleDom.insertBefore(styleNode, StyleDom.childNodes[0]);
        } else {
            var cssStyle = res
            var styleNode = document.createElement('style');
            styleNode.type = 'text/css';
            if (styleNode.styleSheet) {
                styleNode.styleSheet.cssText = cssStyle;
            } else {
                styleNode.innerHTML = cssStyle;
            }
            var StyleDom = document.getElementsByTagName('head')[0];
            StyleDom.insertBefore(styleNode, StyleDom.childNodes[0]);
        };
    })
}, 0);