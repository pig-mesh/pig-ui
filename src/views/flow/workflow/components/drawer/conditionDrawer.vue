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
			<el-form-item label="条件设置类型">
				<el-radio-group v-model="conditionConfig.conditionType" :disabled="isBusinessForm">
					<el-radio :label="0">条件组方式</el-radio>
					<el-radio :label="1">表达式方式</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="条件组关系" v-if="conditionConfig.conditionType === 0">
				<el-switch v-model="conditionConfig.groupMode" active-text="且" inactive-text="或" />
			</el-form-item>
			<el-form-item label="规则名称" v-if="conditionConfig.conditionType === 1">
				<el-input
					v-model="conditionConfig.ruleName"
					placeholder="请输入规则名称，例如：高金额审批规则、部门主管审批等"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="条件表达式" v-if="conditionConfig.conditionType === 1">
				<el-input
					v-model="conditionConfig.expressionText"
					type="textarea"
					:rows="6"
					placeholder="请输入条件表达式，例如：
springbean.method(execution)"
					style="width: 100%"
				/>
				<div class="form-tip">
					<el-text type="info" size="small">
						支持常用动态bean计算：springbean.method(execution)
					</el-text>
				</div>
			</el-form-item>
		</el-form>

		<el-card v-if="conditionConfig.conditionType === 0" class="box-card" v-for="(item, index) in conditionConfig.conditionList" :key="index" style="margin-bottom: 20px">
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
				<!-- 根据条件类型显示不同的组件 -->
				<condition v-if="conditionConfig.conditionType === 0" :condition="item1"></condition>
				<form-condition v-else :condition="item1"></form-condition>
			</div>
			<el-button dark type="success" style="margin-top: 20px" @click="addOneCondition(item, index)">添加条件</el-button>
		</el-card>
		<el-button v-if="conditionConfig.conditionType === 0" dark type="primary" @click="addOneConditionGroup">添加条件组</el-button>
	</el-drawer>
</template>
<script setup>
import {computed, getCurrentInstance, ref, watch} from 'vue';
import { conditionStr, copyerStr } from '../../utils';
import {useStore} from '../../stores/index';
import Condition from './components/condition.vue';
import FormCondition from './components/formCondition.vue';
import {useFlowStore} from '../../stores/flow';
import { BpmModelFormType } from '../../../form/const/constants';

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
	if (!conditionConfig.value.conditionList) {
		conditionConfig.value.conditionList = [];
	}
	
	// 根据条件类型创建不同的条件对象
	let initialCondition;
	if (conditionConfig.value.conditionType === 1) {
		initialCondition = { key: '', expression: '', value: '', fieldName: '', fieldType: '' };
	} else {
		initialCondition = { key: '', expression: '', value: '' };
	}
	
	conditionConfig.value.conditionList.push({
		mode: true,
		conditionList: [initialCondition],
	});
};
//添加组内一个条件
const addOneCondition = (item, index) => {
	if (!item.conditionList) {
		item.conditionList = [];
	}
	// 根据条件类型创建不同的条件对象
	if (conditionConfig.value.conditionType === 1) {
		item.conditionList.push({ key: '', expression: '', value: '', fieldName: '', fieldType: '' });
	} else {
		item.conditionList.push({ key: '', expression: '', value: '' });
	}
};

let flowStore = useFlowStore();

const step2FormList = computed(() => {
  return flowStore.step2.formRule || [];
});

// 判断是否为业务表单（自定义表单）
const isBusinessForm = computed(() => {
  return flowStore.step2.formType === BpmModelFormType.CUSTOM;
});

// 递归搜索表单项，支持children属性
const findFormItemByField = (items, targetField) => {
	for (const item of items) {
		// 如果当前项的field匹配，返回该项
		if (item.field === targetField) {
			return item;
		}
		// 如果当前项有children，递归搜索children
		if (item.children && Array.isArray(item.children)) {
			const found = findFormItemByField(item.children, targetField);
			if (found) {
				return found;
			}
		}
	}
	return null;
};

const openEvent = () => {
	// 初始化条件类型，业务表单强制为1，否则默认为0
	if (conditionConfig.value.conditionType === undefined) {
		conditionConfig.value.conditionType = isBusinessForm.value ? 1 : 0;
	}
	
	// 初始化表达式文本
	if (conditionConfig.value.expressionText === undefined) {
		conditionConfig.value.expressionText = '';
	}
	
	// 确保在抽屉打开时有正确的初始化
	if (!conditionConfig.value.conditionList || conditionConfig.value.conditionList.length === 0) {
		let initialCondition;
		if (conditionConfig.value.conditionType === 1) {
			initialCondition = { key: '', expression: '', value: '', fieldName: '', fieldType: '' };
		} else {
			initialCondition = { key: '', expression: '', value: '' };
		}
		conditionConfig.value.conditionList = [{ mode: true, conditionList: [initialCondition] }];
	}
};

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
					// 递归搜索包含children的表单项
					let ele = findFormItemByField(step2FormList.value, key);
					if (ele && ele?.props?.type === 'user') {
						con.keyType = 'SelectUser';
					}else if (ele && ele?.props?.type === 'dept') {
            con.keyType = 'SelectDept';
          } else if (ele) {
            con.keyType = ele.type;
          }
				}
			}
		}
	}
	conditionsConfig.value = val.value;
	PriorityLevel.value = val.priorityLevel;
	
	// 正确初始化当前编辑的条件配置
	if (val.priorityLevel && val.priorityLevel <= conditionsConfig.value.conditionNodes.length) {
		const targetNode = conditionsConfig.value.conditionNodes[val.priorityLevel - 1];
		conditionConfig.value = {
			conditionList: targetNode.conditionList || [{ mode: true, conditionList: [{ key: '', expression: '', value: '' }] }],
			groupMode: targetNode.groupMode !== undefined ? targetNode.groupMode : true,
			nodeUserList: targetNode.nodeUserList || [],
			conditionType: targetNode.conditionType !== undefined ? targetNode.conditionType : (isBusinessForm.value ? 1 : 0),
			expressionText: targetNode.expressionText || '',
			ruleName: targetNode.ruleName || '',
		};
	} else {
		// 默认配置
		const defaultConditionType = isBusinessForm.value ? 1 : 0;
		let initialCondition;
		if (defaultConditionType === 1) {
			initialCondition = { key: '', expression: '', value: '', fieldName: '', fieldType: '' };
		} else {
			initialCondition = { key: '', expression: '', value: '' };
		}
		
		conditionConfig.value = { 
			nodeUserList: [], 
			conditionList: [{ mode: true, conditionList: [initialCondition] }],
			groupMode: true,
			conditionType: defaultConditionType,
			expressionText: '',
			ruleName: ''
		};
	}
});
const { proxy } = getCurrentInstance();

const saveCondition = () => {
	// 确保当前编辑的条件已经保存到对应的条件节点中
	if (PriorityLevel.value && conditionConfig.value) {
		// 将编辑的条件配置更新到对应的条件节点
		const targetIndex = PriorityLevel.value - 1;
		if (targetIndex >= 0 && targetIndex < conditionsConfig.value.conditionNodes.length) {
			// 保留原有的节点属性，只更新条件相关的属性
			const targetNode = conditionsConfig.value.conditionNodes[targetIndex];
			targetNode.conditionList = conditionConfig.value.conditionList;
			targetNode.groupMode = conditionConfig.value.groupMode;
			targetNode.conditionType = conditionConfig.value.conditionType;
			targetNode.expressionText = conditionConfig.value.expressionText;
			targetNode.ruleName = conditionConfig.value.ruleName;
		}
	}

	// 重新计算优先级（确保连续性）
	conditionsConfig.value.conditionNodes.forEach((item, index) => {
		item.priorityLevel = index + 1;
	});

	// 验证和设置错误状态
	for (var i = 0; i < conditionsConfig.value.conditionNodes.length; i++) {
		let conditionNode = conditionsConfig.value.conditionNodes[i];

		conditionNode.error = false;
		let conditionList = conditionNode.conditionList;
		
		// 最后一个条件节点（"其他条件"）不需要验证
		if (i != conditionsConfig.value.conditionNodes.length - 1) {
			var error = conditionList.length == 0;

			for (var groupCondition of conditionList) {
				if (!groupCondition.conditionList || groupCondition.conditionList.length == 0) {
					error = true;
					break;
				}
				for (var condition of groupCondition.conditionList) {
					// 根据条件类型进行不同的验证
					if (conditionNode.conditionType === 1) {
						// 表达式方式验证：检查是否有规则名称和表达式文本
						if (!conditionNode.ruleName || conditionNode.ruleName.trim() === '' ||
							!conditionNode.expressionText || conditionNode.expressionText.trim() === '') {
							error = true;
							break;
						}
					} else {
						// 条件组方式验证：需要字段、表达式和值
						if (!condition.key || !condition.expression || !condition.value) {
							error = true;
							break;
						}
					}
				}
				if (error) break;
			}
			conditionNode.error = error;
		}

		// 生成条件描述文本
		conditionNode.placeHolder = conditionStr(conditionsConfig.value, i);
	}

	// 保存配置
	setConditionsConfig({
		value: conditionsConfig.value,
		flag: true,
		id: conditionsConfig1.value.id,
	});
	
	closeDrawer();
};

const closeDrawer = (val) => {
	setCondition(false);
};

// 监听条件类型变化，重新初始化条件数据
watch(() => conditionConfig.value.conditionType, (newType, oldType) => {
	if (oldType !== undefined && newType !== oldType) {
		// 条件类型改变时，重新初始化所有条件数据
		let initialCondition;
		if (newType === 1) {
			initialCondition = { key: '', expression: '', value: '', fieldName: '', fieldType: '' };
			// 初始化表达式文本和规则名称
			if (!conditionConfig.value.expressionText) {
				conditionConfig.value.expressionText = '';
			}
			if (!conditionConfig.value.ruleName) {
				conditionConfig.value.ruleName = '';
			}
		} else {
			initialCondition = { key: '', expression: '', value: '' };
		}
		
		conditionConfig.value.conditionList = [{ mode: true, conditionList: [initialCondition] }];
	}
});
</script>
<style scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.form-tip {
	margin-top: 8px;
}
</style>
