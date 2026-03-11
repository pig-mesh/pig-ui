<!--
  OrgSelector 组织选择器组件

  功能：点击"+"按钮弹出组织选择弹窗，支持选择用户、部门、角色、岗位，
  选中后以标签形式展示在按钮下方，标签可关闭删除。

  用法示例：
  <org-selector v-model="selectedItems" type="user" :multiple="true" />
  <org-selector v-model:orgList="selectedItems" type="org" />

  Props：
  - modelValue / orgList : OrgItem[] - 已选中的组织项列表（支持两种 v-model 写法）
  - type     : string  - 选择类型：'user'|'dept'|'role'|'post'|'org'（混合）
  - multiple : boolean - 是否多选（默认 true）
  - disabled : boolean - 是否禁用（默认 false）
  - selectSelf: boolean - 是否允许选择当前登录用户（默认 true）
-->
<template>
	<div>
		<div>
			<employees-dialog
				v-model:visible="selectUserDialogVisible"
				:data="modelData"
				:type="type"
				:multiple="multiple"
				:selectSelf="selectSelf"
				@change="afterSelectUser"
			/>
		</div>
		<el-button :disabled="disabled" icon="Plus" circle size="large" @click="selectUserDialogVisible = true"> </el-button>
		<div style="width: 100%; margin-top: 10px; text-align: left">
			<org-item v-model:data="modelData" :disabled="disabled" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import employeesDialog from './employeesDialog.vue';
import orgItem from './orgItem.vue';
import type { OrgItem } from './types';

const selectUserDialogVisible = ref(false);

const emit = defineEmits(['update:orgList', 'update:modelValue']);

const props = defineProps({
	/** 已选中项（v-model 绑定） */
	modelValue: {
		type: Array as PropType<OrgItem[]>,
		default: () => [],
	},
	/** 已选中项（v-model:orgList 绑定，兼容旧写法） */
	orgList: {
		type: Array as PropType<OrgItem[]>,
		default: () => [],
	},
	/** 选择类型：user / dept / role / post / org */
	type: {
		type: String,
	},
	/** 是否多选 */
	multiple: {
		type: Boolean,
		default: true,
	},
	/** 是否禁用 */
	disabled: {
		type: Boolean,
		default: false,
	},
	/** 是否允许选择当前登录用户 */
	selectSelf: {
		type: Boolean,
		default: true,
	},
});

const { modelValue, orgList } = toRefs(props);

/**
 * 双向绑定的选中数据
 * 优先使用 modelValue，回退到 orgList（兼容两种 v-model 写法）
 */
const modelData = computed({
	get: () => modelValue.value?.length ? modelValue.value : orgList.value || [],
	set: (value: OrgItem[]) => {
		emit('update:modelValue', value);
		emit('update:orgList', value);
	},
});

/** 弹窗确认后更新选中数据 */
const afterSelectUser = (data: OrgItem[]) => {
	selectUserDialogVisible.value = false;
	emit('update:modelValue', data);
	emit('update:orgList', data);
};
</script>
