<!--
功能：左侧树公共组件
作者：陈家和
日期：2023.08.23
-->
<template>
	<div class="mas-content"
		:style="{ width: state.isCollapse ? (showHideBtn ? '280px' : '100%') : '10px', marginRight: showHideBtn ? '10px' : '0' }">
		<div class="mas-treeBox" v-show="state.isCollapse">
			<div class="mastitle" v-if="title">{{ title }}</div>
			<el-input v-regCharacter :maxlength="maxlength" v-if="isShowSearch" v-model="filterText"
				:placeholder="maslg('输入关键字进行过滤')" clearable />
			<div class="mas-tree">
				<el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
					<el-tree ref="treeRef" :key="state.key" :default-expand-all="state.isExpandAll" :node-key="id"
						:data="multiple ? treeData : treeAllData" :show-checkbox="multiple" :check-strictly="false"
						:current-node-key="!multiple ? selected : ''" :highlight-current="!multiple"
						:expand-on-click-node="isExpandonClick" :check-on-click-node="multiple" :props="defaultProps"
						:filter-node-method="filterNode" :default-expanded-keys="defaultExpandData"
						:default-checked-keys="multiple ? selected : []" @node-click="handleNodeClick"
						@check="handleCheckChange" :accordion="isAccordion">
						<template #default="scope">
							<i :class="scope.node.data.icon" aria-hidden="true" style="margin-right: 5px;font-size: 12px;"
								v-if="showIcon"></i>
							<span class="el-tree-node__label" :title="scope.node.label">
								<slot :row="scope">
									{{ scope.node.label }}
								</slot>
							</span>
						</template>
					</el-tree>
				</el-scrollbar>
			</div>
		</div>

		<div class="mas-icon" @click="state.isCollapse = !state.isCollapse" v-if="showHideBtn">
			<el-icon>
				<CaretLeft v-if="state.isCollapse" />
				<CaretRight v-else />
			</el-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, nextTick, onMounted, reactive } from "vue";
import { ElTree } from "element-plus";
import { CaretLeft, CaretRight } from "@element-plus/icons-vue";

// 接收父组件参数并设置默认值
interface TreeFilterProps {
	requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
	data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
	title?: string; // treeFilter 标题 ==> 非必传
	id?: string; // 选择的id ==> 非必传，默认为 “id”
	label?: string; // 显示的label ==> 非必传，默认为 “label”
	multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
	defaultValue?: any; // 默认选中的值 ==> 非必传
	isEmitFirst?: boolean; //是否初始加载触发emit
	isShowSearch?: boolean;
	param?: any; //接口参数
	isExpandAll?: boolean; //是否展开
	defaultExpandData?: any; //展开节点
	showHideBtn?: boolean;//是否展示收起箭头
	isExpandonClick?: boolean;//是否允许点击树节点进行展开收缩
	isAccordion?: boolean;//是否为手风琴模式
	showIcon?: boolean;//是否自定义树形图标
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
	id: "id",
	label: "label",
	multiple: false,
	isExpandAll: false,
	isShowSearch: true,
	param: {},
	defaultExpandData: [],
	showHideBtn: true,
	isExpandonClick: false,
	isAccordion: false,
	showIcon: false
});

const defaultProps = {
	children: "ChildNodes",
	label: props.label
};
const state = reactive({
	isCollapse: true,
	isExpandAll: false,
	key: 1,
	masData: <any>[]
});
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<{ [key: string]: any }[]>([]);
const treeAllData = ref<{ [key: string]: any }[]>([]);

const selected = ref();
const currentNode = ref();
const setSelected = () => {
	if (props.multiple) selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
	else selected.value = typeof props.defaultValue == "string" ? props.defaultValue : currentNode.value;
};

onBeforeMount(() => {
	if (props.requestApi) {
		getTreeData();
	}
});
const getTreeData = async () => {
	const { data } = await props.requestApi!(props.param);
	currentNode.value = data[0].id;
	treeData.value = data;
	treeAllData.value = data;
	if (props.defaultValue) {
		setSelected();
	}
	if (props.isEmitFirst) {
		setSelected();
		emit("change", data[0]);
	}
};
watch(
	() => props.data,
	() => {
		if (props.data?.length) {
			treeData.value = props.data;
			treeAllData.value = props.data;
			if (props.isEmitFirst) {
				setSelected();
				emit("change", treeData.value[0]);
			}
		}
	},
	{ deep: true, immediate: true }
);
watch(
	() => props.isExpandAll,
	newValue => {
		state.key++;
		state.isExpandAll = newValue;
	},
	{ deep: true, immediate: true }
);
const filterText = ref("");
watch(filterText, val => {
	treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
	if (!value) return true;
	let parentNode = node.parent,
		labels = [node.label],
		level = 1;
	while (level < node.level) {
		labels = [...labels, parentNode.label];
		parentNode = parentNode.parent;
		level++;
	}
	return labels.some(label => label.indexOf(value) !== -1);
};

interface FilterEmits {
	(e: "change", value: any): void;
}
const emit = defineEmits<FilterEmits>();

// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
	if (props.multiple) return;
	emit("change", data);
};

// 多选
const handleCheckChange = data => {
	const result = state.masData.some(x => x.id == data.id);

	if (!result) {
		state.masData.push(data);
	}
	emit("change", state.masData);
};
const clickTree = () => {
	emit("change", treeData.value[0]);
}
const resetSelected = async (val: string, selectId: string) => {
	await nextTick()
	if (val == 'clearExpand') {
		getTreeData()
		return;
	}
	let clearString = val == 'clear' ? (selectId ? selectId : undefined) : (selectId ? selectId : '')
	treeRef.value!.setCurrentKey(clearString, false)
}
// 暴露给父组件使用
defineExpose({ treeData, treeAllData, treeRef, getTreeData, resetSelected, clickTree });
onMounted(() => { });
</script>

<style scoped lang="scss">
.mas-content {
	position: relative;
	margin-right: 10px;
	height: 100%;

	.mas-treeBox {
		display: flex;
		flex-direction: column;
		height: 100%;
		box-sizing: border-box;
		background-color: var(--el-fill-color-blank);
		border: 1px solid var(--el-border-color-light);
		border-radius: 6px;
		box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.05);

		.mastitle {
			padding: 5px 13px;
			// border-bottom: 1px solid #ccc;
			font-family: Hiragino Sans GB;
			color: #73767a;
			font-size: 18px;
		}

		.el-input {
			padding: 15px 18px;
		}

		.mas-tree {
			height: 100%;
		}
	}

	.mas-icon {
		width: 12px;
		height: 48px;
		background-color: var(--el-color-primary);
		position: absolute;
		opacity: 0.5;
		top: 50%;
		right: 0;
		font-size: 16px;
		cursor: pointer;
		border-radius: 4px;

		.el-icon {
			position: absolute;
			top: 50%;
			right: -2px;
			font-size: 16px;
			transform: translateY(-50%);
			color: #ffffff;
		}
	}
}

.mas-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
	background: linear-gradient(90deg, #0080ff 0%, #4cdcec 100%) !important;
	color: #ffffff;
}

.mas-content :deep(.el-tree-node__content) {
	height: 40px !important;
}

.mas-treeBox .el-tree-node__label {
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
