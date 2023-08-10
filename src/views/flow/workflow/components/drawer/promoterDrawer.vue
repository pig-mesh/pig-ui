<template>
	<el-drawer
		:append-to-body="true"
		:title="$t('flow.initiator')"
		v-model="visible"
		class="set_promoter"
		:show-close="false"
		@open="openEvent"
		:size="550"
		:before-close="savePromoter"
	>
		<div class="demo-drawer__content">
			<el-tabs type="border-card">
				<el-tab-pane label="设置发起人">
					<select-show v-model:orgList="starterConfig.nodeUserList" type="org" :multiple="true"></select-show>
				</el-tab-pane>
				<el-tab-pane label="表单权限">
					<form-perm :form-perm="starterConfig.formPerms"></form-perm>
				</el-tab-pane>
			</el-tabs>
		</div>
	</el-drawer>
</template>
<script setup>
import selectShow from '/@/views/flow/workflow/components/dialog/selectAndShow.vue';
import { useFlowStore } from '../../stores/flow';
import { useStore } from '../../stores/index';
import FormPerm from './components/formPerm.vue';

let store = useStore();

let starterConfig = ref({});
let flowStore = useFlowStore();

let starterConfigData = computed(() => store.starterConfigData);
watch(starterConfigData, (val) => {
	starterConfig.value = val.value;
});
const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
});

const openEvent = () => {
	let value = step2FormList.value;
	var arr = {};
	let formPerms = starterConfig.value.formPerms;
	for (var item of value) {
		arr[item.id] = 'E';

		if (formPerms[item.id]) {
			arr[item.id] = formPerms[item.id];
		}
		if (item.type === 'Layout') {
			let value1 = item.props.value;
			for (var it of value1) {
				arr[it.id] = 'E';
				if (formPerms[it.id]) {
					arr[it.id] = formPerms[it.id];
				}
			}
		}
	}
	starterConfig.value.formPerms = arr;
};

let { setPromoter, setStarterConfig } = store;
let promoterDrawer = computed(() => store.promoterDrawer);
let visible = computed({
	get() {
		return promoterDrawer.value;
	},
	set() {
		closeDrawer();
	},
});

const savePromoter = () => {
	setStarterConfig({
		value: starterConfig.value,
		flag: true,
		id: starterConfigData.value.id,
	});
	closeDrawer();
};
const closeDrawer = () => {
	setPromoter(false);
};
</script>
