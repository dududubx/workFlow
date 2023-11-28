<!--
功能：用户单选多选公共组件
作者：陈家和
日期：2023.08.23
-->
<template>
	<div class="mas-dialogBox">
		<el-dialog style="height:90%" :width="width" v-model="dialogFromVisible"
			:title="state.type == 2 ? maslg('人员选择多选') : maslg('人员选择单选')" :close-on-click-modal="false"
			:before-close="handleClose" align-center :draggable="true">
			<content-box :ishowAside="true">
				<template v-slot:page-tree>
					<TreeFilter ref="treefilter" label="text" :title="maslg('组织机构')"
						:requestApi="organization.GetWholeTreeTwo"
						:param="{ 'isLoadAllNode': true, 'isLoadDepartment': true }" :isEmitFirst="true" :isExpandAll="true"
						@change="getPCode" />
				</template>
				<template v-slot:page-header>
					<el-form @submit.native.prevent :inline="true" :model="searchList" ref="searchFormRef">
						<el-row>
							<el-col :span="8">
								<el-form-item :label="maslg('姓名')">
									<el-input v-regCharacter :maxlength="maxlength" placeholder=""
										v-model="searchList.F_RealNameLike" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="16">
								<el-button-group style="float:left">
									<el-button type="primary" class="search_btn searchform_btn" @click="SearchClick">{{
										maslg('查询')
									}}</el-button>
									<el-button type="primary" class="reload_btn searchform_btn" @click="resetClick">{{
										maslg('重置')
									}}</el-button>
								</el-button-group>
							</el-col>
						</el-row>
					</el-form>
				</template>
				<template v-slot:main-content>
					<div class="mas-mainBox">
						<div class="main-left">
							<span>{{ maslg('公司人员') }}</span>
							<el-table class="mas-operate" :data="state.tableData" ref="multipleTable" tooltip-effect="light"
								border :header-cell-style="{ fontSize: '13px' }" highlight-current-row @row-click="rowClick"
								@row-dblclick="Handdblclick" @selection-change="handleSelectionChange">
								<el-table-column v-if="state.type == 2" type="selection" width="50" align="center" />

								<el-table-column v-for="item in tableHeader" :key="item.F_EnCode" :prop="item.F_EnCode"
									:label="item.F_FullName" :show-overflow-tooltip="true" align="left" :width="item.width">
								</el-table-column>
							</el-table>
							<!-- <el-pagination v-model:current-page="searchData.page" v-model:page-size="searchData.rows"
								:page-sizes="[50, 100, 200, 400]" small layout="total, sizes, prev, pager, next, jumper"
								:total="searchData.total" @size-change="handleSizeChange"
								@current-change="handleCurrentChange" /> -->
							<pagination :total="searchData.total" :small="true" :pageSize="pageSize"
								@sizeChange="handleSizeChange" @currentChange="handleCurrentChange" ref="paginationBox">
							</pagination>
						</div>
						<div class="mas-middle">
							<el-button type="primary" :icon="ArrowRightBold" @click="addRight" />
							<el-button type="primary" :icon="ArrowLeftBold" @click="removeLeft" />
						</div>
						<div class="main-right">
							<span>{{ maslg('已选人员') }}</span>
							<el-table class="mas-FinishOperate" :data="state.FinishtableData" ref="FinishtableData"
								tooltip-effect="light" border :header-cell-style="{ fontSize: '13px' }"
								highlight-current-row @row-click="finishRowClick" @selection-change="FinishtableDataChange"
								@row-dblclick="Finishdblclick">
								<el-table-column v-if="state.type == 2" type="selection" width="50" align="center" />
								<el-table-column v-for="item in tableHeader" :key="item.F_EnCode" :prop="item.F_EnCode"
									:label="item.F_FullName" :show-overflow-tooltip="true" align="left" :width="item.width">
								</el-table-column>
							</el-table>
						</div>
					</div>
				</template>
			</content-box>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="handleClose">{{ maslg('关闭') }}</el-button>
					<el-button type="primary" @click="submitForm">
						{{ maslg('确认') }}
					</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>
<script setup lang="ts" name="company">
import { reactive, onMounted, ref, getCurrentInstance, nextTick, defineAsyncComponent, watch, ComponentInternalInstance, toRaw } from "vue";
import { Search, Refresh, ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { organization } from "@/api/OrganizationModule";
// import { base } from "@/api/XA_Base/XABaseSystemModule"; //接口
const ContentBox = defineAsyncComponent(() => import("@/components/contentBox/contentBox.vue"));
import { ElMessage, ElTree } from "element-plus";
import { FormInstance, TableInstance } from "element-plus";
import pagination from '../pagination/index.vue'

interface propsType {
	type: number,
	title: string,
	userIds: string,
	height: string,
	width: string,
	isCallBackColse?: boolean
}
// 定义父组件传过来的值
const props = withDefaults(defineProps<propsType>(), {
	type: 2,
	title: '',
	userIds: '',
	height: '70%',
	width: '95%',
	isCallBackColse: false
})
const ruleFormRef = ref<FormInstance>();
const { proxy } = <ComponentInternalInstance>getCurrentInstance();
const currentPage4 = ref(1);
const pageSize4 = ref(50);
const dialogFromVisible = ref(false);
const state = reactive({
	tableData: <any>[],
	FinishtableData: <any>[],
	waitData: <any>[],
	removeData: <any>[],
	type: 2,
	userIds: ''
});
const searchList = reactive({
	F_RealNameLike: "",
	cuid: "",
	F_CompanyId: "",
	F_DepartmentId: ""
});
const searchData = reactive({
	rows: 50,
	sidx: "F_RealName asc",
	sord: "ASC",
	page: 1,
	records: 0,
	total: 0
});
const pageSize = [50, 100, 200, 400]
const tableHeader = [
	{
		F_EnCode: "F_RealName",
		F_FullName: proxy?.maslg("姓名")
	},
	{
		F_EnCode: "F_CompanyName",
		F_FullName: proxy?.maslg("公司")
	},
	{
		F_EnCode: "F_DepartmentName",
		F_FullName: proxy?.maslg("部门")
	}
];

// 获取已选用户
const getFromData = async UserIds => {
	if (UserIds == "" || UserIds == null || UserIds == undefined) {
		state.FinishtableData = [];
		dialogFromVisible.value = true;
		return;
	}
	const { data } = await organization.GetEntityListByUserIds({ userIds: UserIds });
	state.FinishtableData = data;
	dialogFromVisible.value = true;
};
// 获取表格数据
const getTableList = async () => {
	const { data } = await organization.GetUserPageList({ ...searchData, queryJson: JSON.stringify(searchList) });
	state.tableData = data.rows;
	searchData.total = data.records;
	if (state.FinishtableData.length > 0 && setSelectRow) {
		let selectData = state.tableData.find(el => {
			return el.F_UserId == state.FinishtableData[0].F_UserId
		})
		nextTick(() => {
			multipleTable.value!.setCurrentRow(selectData)
		})
	}
};
// 查询
const SearchClick = () => {
	getTableList();
};
//重置
const resetClick = () => {
	searchList.F_RealNameLike = "";
};
// 取消
const handleClose = () => {
	dialogFromVisible.value = false;
};
// 确认
const submitForm = () => {
	if (!state.FinishtableData.length) {
		ElMessage({
			message: proxy?.maslg("至少选择一个！"),
			type: "warning"
		});
		return;
	}
	proxy?.$emit("chooseReault", toRaw(state.FinishtableData), submitClickTree);
	props.isCallBackColse ? "" : (dialogFromVisible.value = false);
};
//页数变化
const handleCurrentChange = val => {
	searchData.page = val;
	getTableList();
};
const handleSizeChange = val => {
	searchData.rows = val;
	getTableList();
};
let clickTree = {}
let submitClickTree = {}
// 组织树点击
const getPCode = val => {
	if (val.exid1 == "Company") {
		searchList.F_CompanyId = val.id;
		searchList.F_DepartmentId = val.exid3;
	}
	if (val.exid1 == "Department") {
		searchList.F_CompanyId = val.exid3; //部门所属公司Id
		searchList.F_DepartmentId = val.id;
	}
	if (val.exid1 == "") {
		searchList.F_CompanyId = ""; //部门所属公司Id
		searchList.F_DepartmentId = "";
	}
	clickTree = toRaw(val)
	getTableList();
};

const addRight = () => {
	if (!state.waitData.length || !state.tableData.length) {
		ElMessage({
			message: proxy?.maslg("请选择人员！"),
			type: "warning"
		});
		return;
	}
	submitClickTree['treeId'] = clickTree
	const { rows, page } = searchData
	submitClickTree['rows'] = rows
	submitClickTree['page'] = page
	if (state.type == 1) {
		state.FinishtableData = state.waitData;
		return;
	}
	if (!state.FinishtableData.length) {
		state.FinishtableData = state.waitData;
		return;
	}
	state.waitData.map(x => {
		let result = state.FinishtableData.every(y => {
			return y.F_UserId !== x.F_UserId;
		});
		if (result) {
			state.FinishtableData.push(x);
		}
	});
};
const removeLeft = () => {
	if (!state.FinishtableData.length || !state.removeData.length) return;
	state.FinishtableData = state.FinishtableData.filter(x => !state.removeData.some(y => y === x));
	state.removeData = [];
};
const handleSelectionChange = val => {
	state.waitData = val;
};
const FinishtableDataChange = val => {
	state.removeData = val;
};
const multipleTable = ref<TableInstance>()
// 单击
const rowClick = val => {
	if (state.type == 1) {
		state.waitData = [];
		state.waitData.push(val);
		return;
	}
	multipleTable.value!.toggleRowSelection(val, undefined);
};
// 双击
const Handdblclick = val => {
	if (state.type == 1) {
		state.FinishtableData = [];
		state.FinishtableData.push(val);
		return;
	}
};
const Finishdblclick = val => {
	if (state.type == 1) {
		state.FinishtableData = [];
		return;
	}
};
const FinishtableData = ref<TableInstance>()
const finishRowClick = val => {
	if (state.type == 1) {
		state.removeData = [];
		state.removeData.push(val);
		return;
	}
	FinishtableData.value!.toggleRowSelection(val, undefined);
};
watch(
	() => props.userIds,
	(newValue, oldValue) => {
		state.userIds = newValue;
	},
	{ immediate: true }
);

const treefilter = ref()
let setSelectRow = false
const paginationBox = ref<InstanceType<typeof pagination>>()
const clearSelectData = async (selectData: any[], treeData: any) => {
	if (selectData.length == 0) {
		state.FinishtableData = []
		submitClickTree = {}
		state.waitData = []
		searchData.page = 1
		searchData.rows = 50
		treefilter.value?.clickTree()
		setSelectRow = false
		// isEmitFirst.value = true
	}
	else {
		state.FinishtableData = selectData
		state.waitData = selectData
		submitClickTree = { ...treeData }
		searchData.page = treeData.page
		searchData.rows = treeData.rows
		setSelectRow = true
		getPCode(treeData.treeId)
	}
	paginationBox.value?.resetPage(searchData.page, searchData.rows)
	nextTick(() => {
		treefilter.value?.resetSelected('role', treeData?.treeId?.id)
	})

}
onMounted(() => {
	state.type = props.type;
	getTableList();
});
defineExpose({ getFromData, handleClose, clearSelectData });
</script>

<style lang="scss" scoped>
.mas-dialogBox :deep(.el-dialog__body) {
	height: v-bind(height);
}

.mas-mainBox {
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.main-left {
		height: 100%;
		overflow: hidden;
		width: 570px;
	}

	.main-right {
		height: 100%;
		overflow: hidden;
		flex: 1;
	}

	.mas-operate {
		height: calc(100% - 68px);
		overflow: scroll;
	}

	.mas-FinishOperate {
		height: calc(100% - 32px);
		overflow: scroll;
	}

	.mas-middle {
		width: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 50%;

		button {
			margin: 0 !important;
		}
	}
}

:deep(.el-dialog .el-dialog__footer) {
	position: absolute;
	bottom: 0;
	right: 0;
}
</style> 

