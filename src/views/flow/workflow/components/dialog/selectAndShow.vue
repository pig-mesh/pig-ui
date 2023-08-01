<template>
	<div>
		<employees-dialog
			v-model:visible="selectUserDialogVisible"
			:data="defaultValue"
			:type="type"
			:multiple="multiple"
			:selectSelf="selectSelf"
			@change="afterSelectUser"
		/>
	</div>
	<el-button :disabled="disabled" icon="Plus" circle size="large" @click="selectUserDialogVisible = true"> </el-button>
	<div style="width: 100%; margin-top: 10px; text-align: left">
		<org-item v-model:data="defaultValue" :disabled="disabled" />
	</div>
</template>

<script setup lang="ts">
import employeesDialog from '/@/views/flow/workflow/components/dialog/employeesDialog.vue';
import orgItem from '/@/views/flow/workflow/components/dialog/orgItem.vue';

let selectUserDialogVisible = ref(false);
const afterSelectUser = (data) => {
	//选择人员变化
	selectUserDialogVisible.value = false;
	emits('update:orgList', data);
};

var defaultValue = computed({
	get: () => {
		return props.orgList;
	},
	set: (r) => {
		emits('update:orgList', r);
	},
});
let emits = defineEmits(['update:orgList']);

let props = defineProps({
	orgList: {
		type: Array,
		default: () => [],
	},

	type: {
		type: String,
		default: 'org',
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
</script>
