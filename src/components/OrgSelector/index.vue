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
import { ref, computed } from 'vue';
import employeesDialog from './employeesDialog.vue';
import orgItem from './orgItem.vue';
import type { OrgItem } from './types';

const selectUserDialogVisible = ref(false);

const emits = defineEmits(['update:orgList', 'update:modelValue']);

const props = defineProps({
	orgList: {
		type: Array as PropType<OrgItem[]>,
		default: () => [],
	},
	modelValue: {
		type: Array as PropType<OrgItem[]>,
		default: () => [],
	},
	type: {
		type: String,
		default: 'user',
	},
	multiple: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	selectSelf: {
		type: Boolean,
		default: true,
	},
});

const modelData = computed({
	get: () => {
		return props.modelValue?.length ? props.modelValue : props.orgList || [];
	},
	set: (value: OrgItem[]) => {
		emits('update:modelValue', value);
		emits('update:orgList', value);
	},
});

const afterSelectUser = (data: OrgItem[]) => {
	selectUserDialogVisible.value = false;
	emits('update:modelValue', data);
	emits('update:orgList', data);
};
</script>
