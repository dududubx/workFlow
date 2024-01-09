<!--
功能：部门单选多选公共组件
作者：陈家和
日期：2023.08.23
-->
<template>
	<div class="mas-dialogBox">
		<el-dialog style="height:90%" :width="width" v-model="dialogFromVisible"
			:title="state.type == 2 ? maslg('部门选择多选') : maslg('部门选择单选')" :close-on-click-modal="false"
			:before-close="handleClose" align-center :draggable="true">
			<content-box :ishowAside="false" :isShowSearch="false">
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
								<!-- <el-button-group style="float:left">
									<el-button type="primary" :icon="Refresh" @click="resetClick">{{ maslg('重置')
									}}</el-button>
									<el-button type="primary" :icon="Search" @click="SearchClick">{{ maslg('查询')
									}}</el-button>
								</el-button-group> -->
							</el-col>
						</el-row>
					</el-form>
				</template>
				<template v-slot:main-content>
					<div class="mas-mainBox">
						<div class="main-left">
							<TreeFilter ref="treefilter" label="text" :title="maslg('组织机构')"
								:multiple="type == 1 ? false : true" :requestApi="organization.GetWholeTreeTwo"
								:param="{ 'isLoadAllNode': false, 'isLoadDepartment': true }" :isEmitFirst="false"
								:isExpandAll="true" @change="getPCode" />

						</div>
						<div class="mas-middle">
							<el-button type="primary" :icon="ArrowRightBold" @click="addRight" />
							<el-button type="primary" :icon="ArrowLeftBold" @click="removeLeft" />
						</div>
						<div class="main-right">
							<span class="main-right_title">{{ maslg('已选部门') }}</span>
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
import { reactive, onMounted, ref, getCurrentInstance, nextTick, defineAsyncComponent, watch, ComponentInternalInstance } from "vue";
import { Search, Refresh, ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { organization } from "@/api/OrganizationModule";
import { FormInstance, TableInstance } from "element-plus";
// import { base } from "@/api/XA_Base/XABaseSystemModule"; //接口
import { ElMessage, ElTree } from "element-plus";
import { getTableTree } from "@/utils/util";
import { setLanguage } from '@/hooks/setLanguage'
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
	height: "70%",
	with: "60%"
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
	departmentId: ""
});

const tableHeader = [
	{
		F_EnCode: "text",
		F_FullName: proxy?.maslg("名称")
	}
];

// 获取已选用户
const getFromData = async ids => {
	if (ids == "" || ids == null || ids == undefined) {
		dialogFromVisible.value = true;
		return;
	}
	const { data } = await organization.GetCacheDepartmentListByIds({ ids: ids });
	state.FinishtableData = data;
	dialogFromVisible.value = true;
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
	proxy?.$emit("chooseReault", state.FinishtableData, {});
	dialogFromVisible.value = false;
};

const addRight = () => {
	if ((!state.waitData.length && !state.FinishtableData.length) || !isDepart.value) {
		ElMessage({
			message: proxy?.maslg("请选择部门！"),
			type: "warning"
		});
		return;
	}
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
			return y.id !== x.id;
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

const isDepart = ref(false)
// 单击
const getPCode = val => {
	if (state.type == 1) {
		state.waitData = [];
		if (val.exid1 == "Company") {
			isDepart.value = false
			return;
		}
		isDepart.value = true
		state.waitData.push(val);
		return false;
	}
	state.waitData = val.filter(x => x.exid1 == "Department");
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
	FinishtableData.value!.toggleRowSelection(val, true);
};
watch(
	() => props.userIds,
	(newValue, oldValue) => {
		state.userIds = newValue;
	},
	{ immediate: true }
);
const treefilter = ref()
const clearSelectData = async (selectData: any[]) => {
	if (!selectData.length) {
		state.FinishtableData = []
		state.waitData = []
	}
	else {
		state.FinishtableData = selectData
		state.waitData = selectData
	}
	await nextTick()
	let selectId = selectData.length > 0 ? selectData[0].id : ''
	setTimeout(() => {
		treefilter.value?.resetSelected('clear', selectId)
	}, 200)
}
onMounted(() => {
	state.type = props.type;
});
defineExpose({ getFromData, clearSelectData });
</script>

<style lang="scss" scoped>
.mas-dialogBox :deep(.el-dialog__body) {
	height: v-bind(height);
}

:deep(.el-dialog .el-dialog__footer) {
	position: absolute;
	bottom: 0;
	right: 0;
}
</style> 

