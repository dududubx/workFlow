<template>
  <div class="mas-contentBox">
    <div class="page-aside" v-if="ishowAside">
      <slot name="page-tree">
      </slot>
    </div>
    <div class="page-box">
      <div class="mas-headerTitle" v-if="ishowTitle">
        <slot name="page-title">
        </slot>
      </div>
      <div class="page-header" v-if="isShowSearch">
        <slot name="page-header">
        </slot>
      </div>
      <div class="main-content" :style="{ height: isShowSearch ?'calc(100% - 108px)' :'calc(100% - 22px)' }">
        <slot name="main-content">
        </slot>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts" name="contentBox">
import { reactive, computed } from "vue";
// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	ishowAside: {
		type: Boolean,
		default: () => false
	},
	ishowTitle: {
		type: Boolean,
		default: () => false
	},
	isShowSearch: {
		type: Boolean,
		default: () => true
	}
});
</script>

<style lang="scss" scoped>
.mas-contentBox {
	display: flex;
	height: 100%;
	overflow: hidden;
	.page-box {
		flex: 1;
		height: 100%;
		width: 100%;
		background-color: #fafafa;
		box-sizing: border-box;
		overflow: hidden;
		.mas-headerTitle {
			background-color: var(--el-fill-color-blank);
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			box-shadow: 0 0 12px #0000000d;
			box-sizing: border-box;
			padding: 5px;
			margin-bottom: 1px;
		}
		.page-header {
			height: 76px;
			padding: 20px;
			box-sizing: border-box;
			background-color: var(--el-fill-color-blank);
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			box-shadow: 0 0 12px #0000000d;
			margin: 0px 0 10px !important;
			:deep(.el-input) {
				width: 200px;
			}
		}
		.main-content {
			flex: 1;
			border-radius: 3px;
			background-color: var(--el-fill-color-blank);
			border: 1px solid var(--el-border-color-light);
			border-radius: 4px;
			box-shadow: 0 0 12px #0000000d;
			padding: 10px;
			overflow: hidden;
		}
	}
}
</style>