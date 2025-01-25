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
				<select-show v-model:orgList="copyerConfig.nodeUserList" type="user" :multiple="true"></select-show>
			</el-tab-pane>
			<el-tab-pane label="表单权限">
				<form-perm :hide-key="['E']" :form-perm="copyerConfig.formPerms"></form-perm>
			</el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>
<script setup>
import selectShow from '/@/components/OrgSelector/index.vue';

import $func from '../../utils/index';
import {useStore} from '../../stores/index';
import {computed, ref, watch} from 'vue';
import {useFlowStore} from '../../stores/flow';
import FormPerm from './components/formPerm.vue';

let copyerConfig = ref({});

let flowStore = useFlowStore();

const step2FormList = computed(() => {
  return flowStore.step2;
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
		arr[item.field] = 'R';
		if (formPerms[item.field]) {
			arr[item.field] = formPerms[item.field];
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
