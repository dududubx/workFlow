<!--
功能：角色单选多选公共组件
作者：陈家和
日期：2023.08.23
-->
<template>
	<div class="mas-dialogBox">
		<el-dialog style="height:90%" :width="width" v-model="dialogFromVisible"
			:title="state.type == 2 ? maslg('角色选择多选') : maslg('角色选择单选')" :close-on-click-modal="false"
			:before-close="handleClose" align-center :draggable="true">
			<content-box :ishowAside="true">
				<template v-slot:page-tree>
					<TreeFilter v-once ref="treefilter" label="text" title="组织机构" :requestApi="organization.GetWholeTreeTwo"
						:param="{ 'isLoadAllNode': true, 'isLoadDepartment': true }" :isEmitFirst="true" :isExpandAll="true"
						@change="getPCode" />
				</template>
				<template v-slot:page-header>
					<el-form @submit.native.prevent :inline="true" :model="searchList" ref="searchFormRef">
						<el-row>
							<el-col :span="8">
								<el-form-item :label="maslg('名称/编码')" prop="keyword">
									<el-input v-regCharacter v-debounce="SearchClick" :maxlength="maxlength" placeholder=""
										v-model="searchList.keyword" clearable></el-input>
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
							<span class="main-right_title">{{ maslg('部门角色信息') }}</span>
							<el-table class="mas-operate" :data="state.tableData" ref="multipleTable" tooltip-effect="light"
								border :header-cell-style="{ fontSize: '13px' }" highlight-current-row @row-click="rowClick"
								@row-dblclick="Handdblclick" @selection-change="handleSelectionChange"
								:empty-text="maslg('无数据')">
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
							<span class="main-right_title">{{ maslg('已选角色') }}</span>
							<el-config-provider :locale="locale">
								<el-table class="mas-FinishOperate" :data="state.FinishtableData" ref="FinishtableData"
									tooltip-effect="light" border :header-cell-style="{ fontSize: '13px' }"
									highlight-current-row @row-click="finishRowClick"
									@selection-change="FinishtableDataChange" @row-dblclick="Finishdblclick"
									:empty-text="maslg('无数据')">
									<el-table-column v-if="state.type == 2" type="selection" width="50" align="center" />
									<el-table-column v-for="item in tableHeader" :key="item.F_EnCode" :prop="item.F_EnCode"
										:label="item.F_FullName" :show-overflow-tooltip="true" align="left"
										:width="item.width">
									</el-table-column>
								</el-table>
							</el-config-provider>
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
import { FormInstance, TableInstance } from "element-plus";
import { ElMessage, ElTree } from "element-plus";
import { setLanguage } from "@/hooks/setLanguage";
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
const { locale } = setLanguage()
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
	keyword: "",
	cuid: "",
	companyId: "",
	departmentId: "",
	F_EnabledMark: 1
});
const searchData = reactive({
	rows: 50,
	sidx: "F_FullName  asc",
	sord: "ASC",
	page: 1,
	records: 0,
	total: 0
});
const pageSize = [50, 100, 200, 400]
const tableHeader = [
	{
		F_EnCode: "F_FullName",
		F_FullName: proxy?.maslg("角色名称"),
	},
	{
		F_EnCode: "F_EnCode",
		F_FullName: proxy?.maslg("角色编号"),
	},
	{
		F_EnCode: "DepartmentID_Text",
		F_FullName: proxy?.maslg("所属部门"),
	}
];

// 获取已选用户
const getFromData = async RoleIds => {
	if (RoleIds == "" || RoleIds == null || RoleIds == undefined) {
		dialogFromVisible.value = true;
		return;
	}
	const { data } = await organization.GetListByRoleIds({ RoleIds: RoleIds, isOrgReadRights: false });
	state.FinishtableData = data;
	dialogFromVisible.value = true;
};
// 获取表格数据
const getTableList = async () => {
	const { data } = await organization.GetRolePageList({ ...searchData, queryJson: JSON.stringify(searchList) });
	state.tableData = data.rows;
	if (state.FinishtableData.length > 0 && setSelectRow) {
		let selectData = state.tableData.find(el => {
			return el.F_RoleId == state.FinishtableData[0].F_RoleId && el.F_EnCode == state.FinishtableData[0].F_EnCode
		})
		multipleTable.value!.setCurrentRow(selectData)
	}
	searchData.total = data.records;
};
// 查询
const SearchClick = () => {
	getTableList();
};
const searchFormRef = ref<FormInstance>()
//重置
const resetClick = () => {
	searchFormRef.value!.resetFields();
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
	proxy?.$emit("chooseReault", state.FinishtableData, submitClickTree);
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
let submitClickTree = {
	treeId: {},
	rows: 0,
	page: 0
}
// 组织树点击
const getPCode = val => {
	if (val.exid1 == "Company") {
		searchList.companyId = val.id;
		searchList.departmentId = val.exid3;
	}
	if (val.exid1 == "Department") {
		searchList.companyId = val.exid3; //部门所属公司Id
		searchList.departmentId = val.id;
	}
	if (val.exid1 == "") {
		searchList.companyId = ""; //部门所属公司Id
		searchList.departmentId = "";
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
	submitClickTree.treeId = clickTree
	submitClickTree.rows = toRaw(searchData.rows)
	submitClickTree.page = toRaw(searchData.page)
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
		state.waitData = []
		state.FinishtableData.push(val);
		state.waitData.push(val)
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
const treefilter = ref()
let setSelectRow = false
const paginationBox = ref<InstanceType<typeof pagination>>()
const clearSelectData = async (selectData: any[], treeData: any) => {
	if (!selectData.length) {
		state.FinishtableData = []
		submitClickTree = {
			treeId: {},
			rows: 0,
			page: 0
		}
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
		submitClickTree = treeData
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
watch(
	() => props.userIds,
	(newValue, oldValue) => {
		state.userIds = newValue;
	},
	{ immediate: true }
);
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
		width: 445px;
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

