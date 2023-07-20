<template>
	<el-drawer
		:append-to-body="true"
		title="条件设置"
		v-model="visible"
		:show-close="false"
		:size="550"
		@open="openEvent"
		:before-close="saveCondition"
	>
		<template #header="{ titleId, titleClass }">
			<h3 :id="titleId" :class="titleClass">条件设置</h3>
		</template>
		<el-form label-width="120px">
			<el-form-item label="条件组关系">
				<el-switch v-model="conditionConfig.groupMode" active-text="且" inactive-text="或" />
			</el-form-item>
		</el-form>

		<el-card class="box-card" v-for="(item, index) in conditionConfig.conditionList" :key="index" style="margin-bottom: 20px">
			<template #header>
				<div class="card-header">
					<span>条件组{{ index + 1 }}</span>
					<el-switch v-model="item.mode" active-text="且" inactive-text="或" />

					<el-button text v-if="conditionConfig.conditionList.length > 1" @click="deleteGroup(index)" icon="Delete"></el-button>
				</div>
			</template>
			<div v-for="(item1, index1) in item.conditionList" :key="index1">
				<div style="display: flex; flex-direction: row; justify-content: space-between">
					<div>
						{{ index1 == 0 ? '当' : item.mode ? '且' : '或' }}
					</div>
					<div>
						<el-button text @click="deleteCondition(index, index1)" v-if="item.conditionList.length > 1" icon="Delete"></el-button>
					</div>
				</div>

				<condition :condition="item1"></condition>
			</div>
			<el-button dark type="success" style="margin-top: 20px" @click="addOneCondition(item, index)">添加条件</el-button>
		</el-card>
		<el-button dark type="primary" @click="addOneConditionGroup">添加条件组</el-button>
	</el-drawer>
</template>
<script setup>
import { ref, watch, computed, getCurrentInstance } from 'vue';
import $func from '../../utils/index';
import { useStore } from '../../stores/index';

let conditionsConfig = ref({
	conditionNodes: [],
});
let conditionConfig = ref({});
let PriorityLevel = ref('');

let store = useStore();
let { setCondition, setConditionsConfig } = store;
let conditionsConfig1 = computed(() => store.conditionsConfig1);
let conditionDrawer = computed(() => store.conditionDrawer);
let visible = computed({
	get() {
		return conditionDrawer.value;
	},
	set() {
		closeDrawer();
	},
});
//删除条件组
const deleteGroup = (index) => {
	conditionConfig.value?.conditionList.splice(index, 1);
};
//刪除单个条件
const deleteCondition = (index, index1) => {
	conditionConfig.value?.conditionList[index].conditionList.splice(index1, 1);
};

//添加一个条件组
const addOneConditionGroup = () => {
	conditionConfig.value?.conditionList.push({
		mode: true,
		conditionList: [{}],
	});
};
//添加组内一个条件
const addOneCondition = (item, index) => {
	let conditionList = item.conditionList;
	if (!conditionList) {
		conditionList = [];
	}
	conditionList.push({});
	item.conditionList = conditionList;
};

import Condition from './components/condition.vue';
import { useFlowStore } from '../../stores/flow';

let flowStore = useFlowStore();

const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
});

const openEvent = () => {};

watch(conditionsConfig1, (val) => {
	let conditionNodes = val.value.conditionNodes;

	for (var item of conditionNodes) {
		let groupList = item.conditionList;
		for (var group of groupList) {
			let conditionList = group.conditionList;
			for (var con of conditionList) {
				let key = con.key;
				if (key === 'root') {
					con.keyType = 'SelectUser';
				} else {
					let ele = step2FormList.value.filter((res) => res.id === key);
					if (ele.length > 0) {
						con.keyType = ele[0].type;
					}
				}
			}
		}
	}

	conditionsConfig.value = val.value;
	PriorityLevel.value = val.priorityLevel;
	conditionConfig.value = val.priorityLevel ? conditionsConfig.value.conditionNodes[val.priorityLevel - 1] : { nodeUserList: [], conditionList: [] };
});
const { proxy } = getCurrentInstance();

const saveCondition = () => {
	closeDrawer();
	var a = conditionsConfig.value.conditionNodes.splice(PriorityLevel.value - 1, 1); //截取旧下标
	conditionsConfig.value.conditionNodes.splice(conditionConfig.value.priorityLevel - 1, 0, a[0]); //填充新下标
	conditionsConfig.value.conditionNodes.map((item, index) => {
		item.priorityLevel = index + 1;
	});

	for (var i = 0; i < conditionsConfig.value.conditionNodes.length; i++) {
		let conditionNode = conditionsConfig.value.conditionNodes[i];

		conditionNode.error = false;
		let conditionList = conditionNode.conditionList;
		if (i != conditionsConfig.value.conditionNodes.length - 1) {
			var error = conditionList.length == 0;

			for (var it of conditionList) {
				error = it.conditionList.length == 0;
				for (var ite of it.conditionList) {
					if (!ite.key || !ite.expression || !ite.value) {
						error = true;
						break;
					}
				}
			}
			conditionNode.error = error;
		}

		conditionNode.placeHolder = $func.conditionStr(conditionsConfig.value, i);
	}
	setConditionsConfig({
		value: conditionsConfig.value,
		flag: true,
		id: conditionsConfig1.value.id,
	});
};

const closeDrawer = (val) => {
	setCondition(false);
};
</script>
<style scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
