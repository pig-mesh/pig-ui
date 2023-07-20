<template>
	<el-drawer
		:append-to-body="true"
		title="抄送人设置"
		v-model="visible"
		@open="openEvent"
		class="set_copyer"
		:show-close="false"
		:size="550"
		:before-close="saveCopyer"
	>
		<el-tabs type="border-card">
			<el-tab-pane label="设置抄送人">
				<select-show v-model:orgList="copyerConfig.nodeUserList" type="org" :multiple="true"></select-show>
			</el-tab-pane>
			<el-tab-pane label="表单权限">
				<form-perm :hide-key="['E']" :form-perm="copyerConfig.formPerms"></form-perm>
			</el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>
<script setup>
import selectShow from '/@/views/flow/workflow/components/dialog/selectAndShow.vue';

import $func from '../../utils/index';
import { useStore } from '../../stores/index';
import { ref, watch, computed } from 'vue';
let copyerConfig = ref({});

import { useFlowStore } from '../../stores/flow';
import { ElTable } from 'element-plus';
let flowStore = useFlowStore();

import FormPerm from './components/formPerm.vue';

const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
});

let store = useStore();
let { setCopyerConfig, setCopyer } = store;
let copyerDrawer = computed(() => store.copyerDrawer);
let copyerConfig1 = computed(() => store.copyerConfig1);
let visible = computed({
	get() {
		return copyerDrawer.value;
	},
	set() {
		closeDrawer();
	},
});
watch(copyerConfig1, (val) => {
	copyerConfig.value = val.value;
});

const openEvent = () => {
	let value = step2FormList.value;
	var arr = {};
	let formPerms = copyerConfig.value.formPerms;

	for (var item of value) {
		arr[item.id] = 'R';
		// if (item.type === 'Layout') {
		//   arr[item.id] = "R"
		// }
		if (formPerms[item.id]) {
			arr[item.id] = formPerms[item.id];
		}
		if (item.type === 'Layout') {
			let value1 = item.props.value;
			for (var it of value1) {
				arr[it.id] = 'R';
				if (formPerms[it.id]) {
					arr[it.id] = formPerms[it.id];
				}
			}
		}
	}
	copyerConfig.value.formPerms = arr;
};

const saveCopyer = () => {
	copyerConfig.value.error = !$func.copyerStr(copyerConfig.value);
	setCopyerConfig({
		value: copyerConfig.value,
		flag: true,
		id: copyerConfig1.value.id,
	});
	closeDrawer();
};
const closeDrawer = () => {
	setCopyer(false);
};
</script>

<style scoped></style>
