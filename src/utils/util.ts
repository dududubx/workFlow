import { isArray } from "@/utils/is";
import { ElMessage } from "element-plus";
import { unescape } from "querystring";
// import router from "@/routers/index";

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export function localGet(key: string) {
	const value = window.localStorage.getItem(key);
	try {
		return JSON.parse(window.localStorage.getItem(key) as string);
	} catch (error) {
		return value;
	}
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 * @return void
 */
export function localSet(key: string, value: any) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @return void
 */
export function localRemove(key: string) {
	window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @return void
 */
export function localClear() {
	window.localStorage.clear();
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export function isType(val: any) {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 生成唯一 uuid
 * @return string
 */
export function generateUUID() {
	if (typeof crypto === "object") {
		if (typeof crypto.randomUUID === "function") {
			return crypto.randomUUID();
		}
		if (typeof crypto.getRandomValues === "function" && typeof Uint8Array === "function") {
			const callback = (c: any) => {
				const num = Number(c);
				return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
			};
			return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, callback);
		}
	}
	let timestamp = new Date().getTime();
	let performanceNow = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
		let random = Math.random() * 16;
		if (timestamp > 0) {
			random = (timestamp + random) % 16 | 0;
			timestamp = Math.floor(timestamp / 16);
		} else {
			random = (performanceNow + random) % 16 | 0;
			performanceNow = Math.floor(performanceNow / 16);
		}
		return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
	});
}
// 创建一个GUID
export function newGuid() {
	var guid = "";
	for (var i = 1; i <= 32; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
		if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) guid += "-";
	}
	return guid;
}

export function dateFormat(fmt: string, date: { getFullYear: () => { (): any; new(): any; toString: { (): any; new(): any; }; }; getMonth: () => number; getDate: () => { (): any; new(): any; toString: { (): any; new(): any; }; }; getHours: () => { (): any; new(): any; toString: { (): any; new(): any; }; }; getMinutes: () => { (): any; new(): any; toString: { (): any; new(): any; }; }; getSeconds: () => { (): any; new(): any; toString: { (): any; new(): any; }; }; }) {
	let ret
	const opt = {
		'Y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'H+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		'S+': date.getSeconds().toString(), // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}
	for (let k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt)
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
		}
	}
	return fmt
}
export const getNowData = (params: string, value: any): string => {
	//第一步工作，拿到传入该函数的时间value
	const dateTime: any = value;
	//第二步工作，分别获取传入时间的年，月，日，时，分，秒，星期，YYYY-MM-DD，HH:ii:ss，YYYY-MM-DD HH:ii:ss格式的值
	let year: number = dateTime.getFullYear();//当前年
	let month: any = dateTime.getMonth() + 1;
	let date: any = dateTime.getDate();
	let hours: any = dateTime.getHours();
	let minutes: any = dateTime.getMinutes();
	let seconds: any = dateTime.getSeconds();
	let week: any = dateTime.getDay();
	month = month < 10 ? '0' + month : month;//当前月
	date = date < 10 ? '0' + date : date;//当前日
	hours = hours < 10 ? '0' + hours : hours;//当前小时
	minutes = minutes < 10 ? '0' + minutes : minutes;//当前分钟
	seconds = seconds < 10 ? '0' + seconds : seconds;//当前秒钟
	week == 0 ? '日' : week;//当前星期
	let curryDate: any = year + '-' + month + '-' + date;//当前日期
	let curryTime: any = hours + ':' + minutes + ':' + seconds;//当前时间
	let curryDateTime: any = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;//当前日期时间
	//第三步工作，根据传入类型判断要返回的值，这里为了避免大量if判断。采用了策略模式。
	const paramsList: any = {
		'year': () => { return year },
		'month': () => { return month },
		'date': () => { return date },
		'hours': () => { return hours },
		'minutes': () => { return minutes },
		'seconds': () => { return seconds },
		'week': () => {
			let weekArr: any = {
				0: () => { return '日' },
				1: () => { return '一' },
				2: () => { return '二' },
				3: () => { return '三' },
				4: () => { return '四' },
				5: () => { return '五' },
				6: () => { return '六' }
			}
			return weekArr[week] ? weekArr[week]() : 'no';
		},
		'curryDate': () => { return curryDate },
		'curryTime': () => { return curryTime },
		'curryDateTime': () => { return curryDateTime },
	}
	return paramsList[params] ? paramsList[params]() : 'no';
}

/**
 * 判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
	if (!a || !b) return false;
	let aProps = Object.getOwnPropertyNames(a);
	let bProps = Object.getOwnPropertyNames(b);
	if (aProps.length != bProps.length) return false;
	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i];
		let propA = a[propName];
		let propB = b[propName];
		if (!b.hasOwnProperty(propName)) return false;
		if (propA instanceof Object) {
			if (!isObjectValueEqual(propA, propB)) return false;
		} else if (propA !== propB) {
			return false;
		}
	}
	return true;
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
	let num = Math.floor(Math.random() * (min - max) + max);
	return num;
}

/**
 * @description 获取当前时间对应的提示语
 * @return string
 */
export function getTimeState() {
	// 获取当前时间
	let timeNow = new Date();
	// 获取当前小时
	let hours = timeNow.getHours();
	// 判断当前时间段
	if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
	if (hours >= 10 && hours <= 14) return `中午好 🌞`;
	if (hours >= 14 && hours <= 18) return `下午好 🌞`;
	if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
	if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
}


/**
 * @description 递归查询当前路由所对应的路由
 * @param {Array} menuList 所有菜单列表
 * @param {String} path 当前访问地址
 * @return array
 */
export function filterCurrentRoute(menuList: Menu.MenuOptions[], path: string) {

	let result = {};
	for (let item of menuList) {
		if (item.path === path) return item;
		if (item.children) {
			const res = filterCurrentRoute(item.children, path);
			if (Object.keys(res).length) result = res;
		}
	}
	return result;
}

/**
 * @description 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getFlatArr(menuList: Menu.MenuOptions[]) {
	let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description 使用递归，过滤需要缓存的路由（暂时没有使用）
 * @param {Array} menuList 所有菜单列表
 * @param {Array} cacheArr 缓存的路由菜单 name ['**','**']
 * @return array
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveArr: string[] = []) {
	menuList.forEach(item => {
		item.meta.isKeepAlive && item.name && keepAliveArr.push(item.name);
		item.children?.length && getKeepAliveRouterName(item.children, keepAliveArr);
	});
	return keepAliveArr;
}
// 初始处理菜单
export function getNewList(NewList: Array<any>) {
	const list = NewList;
	let list1: any[] = []
	list.forEach(x => {
		let result = list.filter(y => x.F_ParentId == y.F_ModuleId && y.F_Platform == 'PC');
		if (!result.length && x.F_Target == "expand") {
			list1.push(x)
		}
	})
	const state = {
		handleData(record: any[]) {
			let newList;
			let recordLength = record.length;
			for (let i = 0; i < recordLength; i++) {
				newList = list.filter(x => x.F_ParentId == record[i].F_ModuleId)
				if (newList.length) {
					record[i].children = newList
					let lastList = record[i].children.filter((x1: { F_ModuleId: any; }) => x1.F_ModuleId !== '')
					if (lastList.length) {
						state.handleData(lastList)
					}
				}
			}
			return record
		}
	}
	return state.handleData(list1);
}
function randomCoding() {
	//创建26个字母数组
	var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	var idvalue = '';
	let n = 4;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
	for (var i = 0; i < n; i++) {
		idvalue += arr[Math.floor(Math.random() * 26)];
	}
	return idvalue;
}

// 动态生成符合路由的数据菜单
export function getNewRouteMenu(NewList: Array<any>) {
	const list = NewList;
	list.push({
		F_Icon: 'fa fa-at',
		F_ParentId: 'cjh',
		F_ModuleId: '0',
		F_Target: 'router',
		F_FullName: '首页',
		F_Platform: "PC",
		F_UrlAddress: '/home',
		children: []
	})
	const state = {
		handleData(list: any[]) {
			list.map(x => {
				x.isIframe = false
				x.params = {}
				x.isLink = ""
				x.path = x.F_UrlAddress ? x.F_UrlAddress : x.F_EnCode
				if (x.F_Target == "router" && (x.F_UrlAddress !== "" || x.F_UrlAddress !== null)) {
					let newAddress = x.F_UrlAddress.split('?')
					x.F_UrlAddress = newAddress[0]
					if (newAddress[1]) {
						x.path = '/' + x.F_EnCode
						let params = newAddress[1].split('&')
						params.forEach((v: string) => {
							let key = v.split('=')
							x.params[key[0]] = key[1]
						})
					}
					x.component = x.F_UrlAddress + '/index'
				}
				if (x.F_Target !== "router") {
					x.path = '/' + x.F_EnCode
				}
				if (x.F_Target == "iframe") {
					x.isIframe = true
					x.isLink = x.F_UrlAddress
				}
				x.name = x.F_EnCode
				x.meta = {
					"icon": x.F_Icon,
					"title": x.F_FullName,
					"isIframe": x.isIframe,
					"isLink": x.isLink,
					"isHide": false,
					"isFull": false,
					"isAffix": false,
					"isKeepAlive": true,
					"F_ModuleId": x.F_ModuleId,
					"F_EnCode": x.F_EnCode,
					"parentID": x.F_ParentId,
					"params": x.params
				}

				if (x.children) {
					state.handleData(x.children);
				}
			})
			return list
		}
	}
	return state.handleData(list);
}
//处理基础数据配置的表格树
// 初始处理菜单
export function getTableTree(data: {
	type: any; newList: any;
}) {
	const list = data.newList;
	const type = data.type
	let list1: any[] = []
	list.forEach((x: { F_ParentId: any; }) => {
		let result = list.filter((y: { [x: string]: any; }) => x.F_ParentId == y[type]);
		if (!result.length) {
			list1.push(x)
		}
	})
	const state = {
		handleData(record: any[]) {
			let newList;
			let recordLength = record.length;
			for (let i = 0; i < recordLength; i++) {
				newList = list.filter((x: { F_ParentId: any; }) => x.F_ParentId == record[i][type])
				if (newList.length) {
					record[i].children = newList
					let lastList = record[i].children.filter((x1: { [x: string]: string; }) => x1[type] !== '')
					if (lastList.length) {
						state.handleData(lastList)
					}
				}
			}
			return record
		}
	}
	return state.handleData(list1);
}
/**
 * @description 使用递归，过滤出需要渲染在左侧菜单的列表（剔除 isHide == true 的菜单）
 * @param {Array} menuList 所有菜单列表
 * @return array
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
	let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.filter(item => {
		item.children?.length && (item.children = getShowMenuList(item.children));
		return !item.meta?.isHide;
	});
}

/**
 * @description 使用递归处理路由菜单 path，生成一维数组(第一版本地路由鉴权会用到)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} menuPathArr 菜单地址的一维数组 ['**','**']
 * @return array
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []) {
	menuList.forEach((item: Menu.MenuOptions) => {
		typeof item === "object" && item.path && menuPathArr.push(item.path);
		item.children?.length && getMenuListPath(item.children, menuPathArr);
	});
	return menuPathArr;
}

/**
 * @description 递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 所有菜单列表
 * @param {Object} result 输出的结果
 * @param {Array} parent 父级菜单
 * @returns object
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], result: { [key: string]: any } = {}, parent = []) => {
	for (const item of menuList) {
		result[item.path] = [...parent, item];
		if (item.children) getAllBreadcrumbList(item.children, result, result[item.path]);
	}
	return result;
};

/**
 * @description 格式化表格单元格默认值(el-table-column)
 * @param {Number} row 行
 * @param {Number} col 列
 * @param {String} callValue 当前单元格值
 * @return string
 * */
export function defaultFormat(row: number, col: number, callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 处理无数据情况
 * @param {String} callValue 需要处理的值
 * @return string
 * */
export function formatValue(callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 处理 prop 为多级嵌套的情况(列如: prop:user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @return any
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
	if (!prop.includes(".")) return row[prop] ?? "--";
	prop.split(".").forEach(item => (row = row[item] ?? "--"));
	return row;
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @return string
 * */
export function handleProp(prop: string) {
	const propArr = prop.split(".");
	if (propArr.length == 1) return prop;
	return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames 指定 label && value 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @return string
 * */
export function filterEnum(
	callValue: any,
	enumData: any[] | undefined,
	fieldNames?: { label: string; value: string },
	type?: "tag"
): string {
	const value = fieldNames?.value ?? "value";
	const label = fieldNames?.label ?? "label";
	let filterData: { [key: string]: any } = {};
	if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === callValue);
	if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
	return filterData ? filterData[label] : "--";
}
/**
 * 获取数据显示值
 * @param {any} data 数据源
 * @param {any} valKeyId 值属性名
 * @param {any} keyValues 值
 * @param {any} textKeyId 显示属性名
 */
export function GetDataTexts(data: any[], valKeyId: string, keyValues: any, textKeyId: string) {
	const text = [];
	const ids = ((keyValues == null || keyValues == undefined ? '' : keyValues) + '').split(',');
	for (const item of data) {
		if (ids.indexOf(item[valKeyId]) >= 0) {
			text.push(item[textKeyId])
		}
	}
	return text.join(',')
}
/**
 * 获取数据显示值(常用)
 * @param {any} v 时间值
 * @param {any} format 时间格式
 */
export function formatDate(v: any, format: string) {
	if (!v || v == '0001-01-01 00:00:00') return "";
	format = format.replace(/H/g, 'h')
	var d = v;
	if (typeof v === 'string') {
		if (v.indexOf("年") > -1) {//处理特殊yyyy年MM月dd日格式
			v = v.replace("年", "/").replace("月", "/").replace("日", " ").trim().replace(new RegExp('^\\/+|\\/+$', 'g'), '');
		}
		if (v.indexOf("/Date(") > -1)
			d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
		else
			d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
	}
	var o = {
		"M+": d.getMonth() + 1,  //month
		"d+": d.getDate(),       //day
		"h+": d.getHours(),      //hour
		"m+": d.getMinutes(),    //minute
		"s+": d.getSeconds(),    //second
		"q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
		"S": d.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

/**
 * 获取数据显示值
 * @param {any} name 文件名
 * @param {any} data 文本内容
 */
export function ExportText(name: any, data: BlobPart) {
	var fakeClick = function (obj: HTMLElement) {
		var ev = document.createEvent("MouseEvents");
		ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		obj.dispatchEvent(ev);
	}
	var export_blob = new Blob([data]);
	var urlObject = window.URL || window.webkitURL || window;
	var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	save_link.href = urlObject.createObjectURL(export_blob);
	save_link.download = name;
	fakeClick(save_link);
}
/**
 * 权限管理
 * @param {any} api 接口
 * @param {any} param 接口参数
 * @param {array}  [{按钮字段,按钮名}]
 */
export function GetAuth(api: (arg0: any) => Promise<any>, param: any, data: any[], callback: any) {
	api(param).then((res) => {
		res.data.ButtonRight.map((x: { F_EnCode: any; }) => {
			data.map(y => {
				if (x.F_EnCode == y.F_EnCode) {
					y.state = true;
					callback && callback(true)
				}
			})
		})
	})
}

/**
 * 上传文件
 * @param {any} FileChunkApi 上传分片接口
 * @param {any} MergeApi 合并上传分片接口
 * @param {any} RemoveFileChunkApi 移除上传分片接口
 * @param {any} fileRaw 文件信息
 * @param {any} folderId 文件夹id
 * @param {any} fileGuId 文件id
 * @param {any} typeCode 分类编码
 * @param {any} businessID 业务上传标识
 * @param {any} callback 上传回调方法
*/
export function UploadFile(FileChunkApi: (arg0: any) => Promise<any>, MergeApi: (arg0: any) => Promise<any>, RemoveFileChunkApi: (arg0: any) => Promise<any>,
	fileRaw: any, folderId: string, fileGuId: string, typeCode: string, businessID: string, callback: any) {
	if (!fileGuId) {
		fileGuId = newGuid();
	}
	const chunkSize = 5 * 1024 * 1024;//默认分片大小5M
	// 文件分片储存
	let chunkList = [];
	function chunkPush(page = 1) {
		chunkList.push(fileRaw.slice((page - 1) * chunkSize, page * chunkSize));
		if (page * chunkSize < fileRaw.size) {
			chunkPush(page + 1);
		}
	}
	chunkPush();
	try {
		saveFileChunk(FileChunkApi, chunkList, fileGuId, fileRaw, businessID);
		let fileInfo = {
			fileGuid: fileGuId,
			fileName: fileRaw.name,
			chunks: chunkList.length,
			//folderId: folderId,
			//typeCode: "",
			//businessID: businessID,
			//createThumbnail: 0
		};
		if (businessID) {
			/*报表上传时如果参数全部出入、多传几次后端程序会报错*/
			fileInfo.folderId = folderId;
			fileInfo.typeCode = "";
			fileInfo.businessID = businessID;
			fileInfo.createThumbnail = 0;
		}
		MergeUploadFile(MergeApi, fileInfo, callback);
	} catch (error) {
		let formData = new FormData();
		formData.append("fileGuid", fileGuId);
		formData.append("chunks", chunkList.length);
		RemoveFileChunkApi(formData);
		ElMessage({ message: "附件上传异常", grouping: true, type: "warning" });
	}

}
// 保存文件片段到后台
export function saveFileChunk(FileChunkApi: (arg0: any) => Promise<any>, chunkList: any[], fileGuId: string, fileRaw: any, businessID: string) {
	for (let i = 0; i < chunkList.length; i++) {
		let formData = new FormData();
		formData.append("name", fileRaw.name);
		formData.append("type", "application/octet-stream");
		formData.append("lastModifiedDate", fileRaw.lastModifiedDate);
		formData.append("size", chunkList[i].size);
		formData.append("chunk", i);
		formData.append("chunks", chunkList.length);
		formData.append("fileGuid", fileGuId);
		formData.append("file", chunkList[i]);
		if (businessID)
			formData.append("businessID", businessID);
		FileChunkApi(formData);
	}
};

// 文件上传
export function MergeUploadFile(MergeApi: (arg0: any) => Promise<any>, fileInfo, callback: any) {
	let formData = new FormData();
	for (let key in fileInfo) {
		formData.append(key, fileInfo[key]);
	}
	MergeApi(formData, callback)
};
//加载表格列
export function openUrl(op, formData, dataRow) {
	let url = (op.openUrl || '');
	let text = (op.openText || '');
	for (let id in formData) {
		url = url.replace(new RegExp("{" + id + "}", "g"), formData[id] || '');
		text = text.replace(new RegExp("{" + id + "}", "g"), formData[id] || '');
	}
	for (let id in dataRow) {
		url = url.replace(new RegExp("{" + id + "}", "g"), dataRow[id] || '');
		text = text.replace(new RegExp("{" + id + "}", "g"), dataRow[id] || '');
	}
	var pathid = "/" + newGuid();
	switch (op.openType) {
		case "workspace"://工作区
			var item = {
				path: pathid,
				meta: {
					"icon": '77',
					"title": text,
					"isLink": '',
					"isHide": false,
					"isFull": false,
					"isAffix": false,
					"isKeepAlive": true,
					"F_ModuleId": "1",
					"F_EnCode": "1"
				},
				component: {
					template: `
					<iframe :src="url" frameborder="0" height=100% width=100% scrolling="no"></iframe>  
					`,
					data() {
						return {
							url: url
						}
					}
				}
			};
			// router.addRoute("layout", item);
			// router.push(pathid)
			break;
		case "newbrowsertab":
			window.open(url);
			break;
		default:
			//弹窗

			break;

	}
};
export function bindGridCellFormatter(type, op, dataRow) {

}
/**
 * @description 获取href中的参数
 * @param {string[]} params 要获取的参数数组
 */
export function getUrlParams(params: string[]) {
	let paramsObj = {}
	params.map(item => {
		let reg = new RegExp('(^|&)' + item + '=([^&]*)(&|$)')
		let r = window.location.search.substr(1).match(reg)
		if (r != null) {
			paramsObj[item] = decodeURIComponent(r[2])
		}
	})
	return paramsObj
}