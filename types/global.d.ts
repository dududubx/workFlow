declare interface ViteEnv {
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_GLOB_APP_TITLE: string;
	VITE_DROP_CONSOLE: boolean;
	VITE_PROXY_URL: string;
	VITE_BUILD_GZIP: boolean;
	VITE_REPORT: boolean;
}

// * Menu
declare namespace Menu {
	interface MenuOptions {
		path: string;
		name: string;
		component?: string | (() => Promise<any>);
		redirect?: string;
		meta: MetaProps;
		children?: MenuOptions[];
	}
	interface MetaProps {
		icon: string;
		title: string;
		activeMenu?: string;
		isLink?: string;
		isHide: boolean;
		isFull: boolean;
		isAffix: boolean;
		isKeepAlive: boolean;
	}
}

// * Vite
declare type Recordable<T = any> = Record<string, T>;

declare interface requestKey {
	method: string | undefined,
	url: string | undefined,
	params: object | undefined,
	data: object | undefined
}

declare interface treeData {
	id: number | string,
	label: string,
	children?: treeData[]
}
declare interface wfobj {
	cuid: string,
	type: string,
	nFormId: string,
	formId: string,
	viewId: string,
	formcode: string,
	appViewId: string,
	field: string,
	systemmenu: string,
	id_systemmenucode: string,
	name: string,
	url: string,
	appurl: string,
	id: string,
	formType: string,
	authorize: authorizeType,
	formNo: string
}
interface authorizeType {
	[key: string]: {
		formId: string,
		fieldName: string,
		fieldId: string,
		isLook: number,
		isEdit: number,
		isNotNull: number
	}
}
declare interface titleConfigList {
	cuid: string,
	type: string,
	fixmsg: string,
	id: string
}
declare interface writeBackConfigList {
	cuid: string,
	pageid: string,
	page: string,
	fieldid: string,
	field: string,
	tableCode: string,
	fillmode: string,
	id: string,
	type: string,
	nFormId: string
}