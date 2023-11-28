<!--
功能：岗位单选多选公共组件
作者：陈家和
日期：2023.08.23
-->
<template>
	<div class="mas-dialogBox">
		<el-dialog style="height:90%" :width="width" v-model="dialogFromVisible"
			:title="state.type == 2 ? maslg('岗位选择多选') : maslg('岗位选择单选')" :close-on-click-modal="false"
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
								<el-form-item :label="maslg('名称/编码')" prop="keyword">
									<el-input v-regCharacter :maxlength="maxlength" placeholder=""
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
							<span>{{ maslg('岗位信息') }}</span>
							<el-table row-key="F_PostId" class="mas-operate" :data="state.tableData" ref="multipleTable"
								tooltip-effect="light" border :header-cell-style="{ fontSize: '13px' }"
								highlight-current-row @row-click="rowClick" @row-dblclick="Handdblclick"
								@selection-change="handleSelectionChange" :expand-row-keys="expandTable">
								<el-table-column v-if="state.type == 2" type="selection" width="50" align="center" />

								<el-table-column v-for="item in tableHeader" :key="item.F_EnCode" :prop="item.F_EnCode"
									:label="item.F_FullName" :show-overflow-tooltip="true" align="left">
								</el-table-column>
							</el-table>

						</div>
						<div class="mas-middle">
							<el-button type="primary" :icon="ArrowRightBold" @click="addRight" />
							<el-button type="primary" :icon="ArrowLeftBold" @click="removeLeft" />
						</div>
						<div class="main-right">
							<span>{{ maslg('已选岗位') }}</span>
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
import { ElMessage, ElTree } from "element-plus";
import { getTableTree } from "@/utils/util";
import { FormInstance, TableInstance } from "element-plus";

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
	keyword: "",
	cuid: "",
	companyId: "",
	departmentId: ""
});

const tableHeader = [
	{
		F_EnCode: "F_Name",
		F_FullName: proxy?.maslg("岗位名称"),
		// width: "100"
	},
	{
		F_EnCode: "F_EnCode",
		F_FullName: proxy?.maslg("岗位编号"),
		// width: "100"
	},
	{
		F_EnCode: "F_DepartmentName",
		F_FullName: proxy?.maslg("所属部门"),
		// width: "100"
	}
];

// 获取已选用户
const getFromData = async postIds => {
	if (postIds == "" || postIds == null || postIds == undefined) {
		dialogFromVisible.value = true;
		return;
	}
	const { data } = await organization.GetListByPostIds({ postIds: postIds, isOrgReadRights: false });
	state.FinishtableData = data;
	dialogFromVisible.value = true;
};
const expandTable = ref<string[]>([])
// 获取表格数据
const getTableList = async () => {
	const { data } = await organization.GetPostList(searchList);
	state.tableData = getTableTree({ newList: data, type: "F_PostId" });
	if (state.FinishtableData.length > 0 && setSelectRow) {
		let returnData;
		let openID = <string[]>[]
		let parentId = state.FinishtableData[0].F_ParentId
		expandTable.value = []
		const getData = (parentData: any, findeData: any) => {
			parentData.map(item => {
				if (item.F_PostId == findeData.F_PostId && item.F_EnCode == findeData.F_EnCode) {
					returnData = item
				}
				else if (item.children && item.children.length > 0) {
					getData(item.children, findeData)
				}
				if (parentId && parentId != '0') {
					if (parentId == item.F_PostId) {
						openID.push(item.F_PostId)
						parentId = item.F_ParentId
					}
				}
			})
		}
		getData(state.tableData, state.FinishtableData[0])
		expandTable.value = openID
		nextTick(() => {
			multipleTable.value!.setCurrentRow(returnData)
		})
	}
	// if (state.tableData.length == 0) {
	// 	state.FinishtableData = []
	// 	state.waitData = []
	// }
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
let clickTree = ''
let submitClickTree = ''
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
	submitClickTree = clickTree
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
			return y.F_PostId !== x.F_PostId;
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
		state.waitData = [];
		state.waitData.push(val);
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
const clearSelectData = async (selectData: any[], treeId: any) => {
	if (!selectData.length) {
		state.FinishtableData = []
		state.waitData = []
		expandTable.value = []
		submitClickTree = ''
		setSelectRow = false
		nextTick(() => {
			multipleTable.value!.setCurrentRow(null)
		})
		treefilter.value?.clickTree()
	}
	else {
		submitClickTree = treeId
		state.FinishtableData = selectData
		state.waitData = selectData
		setSelectRow = true
		getPCode(treeId)
	}
	nextTick(() => {
		treefilter.value?.resetSelected('post', treeId.id)
	})
	// setTimeout(() => {
	// 	treefilter.value?.resetSelected('post', treeId.id)
	// }, 200)

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
		flex: 1;
	}

	.main-right {
		height: 100%;
		overflow: hidden;
		flex: 1;
	}

	.mas-operate {
		height: calc(100% - 68px);
		overflow: auto;
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

