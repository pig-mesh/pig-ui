<template>
	<el-drawer :append-to-body="true" title="条件设置" v-model="visible" :show-close="false" :size="580" @open="openEvent"
		:before-close="saveCondition" class="condition-drawer">
		<template #header="{ titleId, titleClass }">
			<div class="drawer-header">
				<h3 :id="titleId" :class="titleClass">条件设置</h3>
			</div>
		</template>
		<div class="px-1">
			<el-form label-width="100px" class="mb-2">
				<el-form-item label="设置类型">
					<el-radio-group v-model="conditionConfig.conditionType" :disabled="isBusinessForm">
						<el-radio-button :label="0">条件组方式</el-radio-button>
						<el-radio-button :label="1">表达式方式</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="组间关系" v-if="conditionConfig.conditionType === 0">
					<el-switch v-model="conditionConfig.groupMode" active-text="且(AND)" inactive-text="或(OR)"
						inline-prompt />
				</el-form-item>
				<el-form-item label="规则名称" v-if="conditionConfig.conditionType === 1">
					<el-input v-model="conditionConfig.ruleName"
						placeholder="例如：高金额审批规则、部门主管审批等" />
				</el-form-item>
				<el-form-item label="条件表达式" v-if="conditionConfig.conditionType === 1">
					<el-input v-model="conditionConfig.expressionText" type="textarea" :rows="6"
						placeholder="请输入条件表达式，例如：springbean.method(execution)" />
					<div class="mt-2">
						<el-text type="info" size="small">
							支持常用动态bean计算：springbean.method(execution)
						</el-text>
					</div>
				</el-form-item>
			</el-form>

			<!-- 条件组列表 -->
			<div v-if="conditionConfig.conditionType === 0" class="flex flex-col gap-4">
				<div v-for="(item, index) in conditionConfig.conditionList" :key="index"
					class="overflow-hidden transition-shadow duration-200 border border-gray-200 rounded-lg dark:border-slate-600 bg-gray-50 dark:bg-slate-800 hover:shadow-md">
					<!-- 条件组头部 -->
					<div class="flex justify-between items-center px-4 py-2.5 bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
						<div class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
							<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--el-color-primary)] text-white text-[11px] font-semibold leading-none">{{ index + 1 }}</span>
							<span>条件组</span>
						</div>
						<div class="flex items-center gap-2">
							<el-switch v-model="item.mode" active-text="且" inactive-text="或" size="small" />
							<el-button v-if="conditionConfig.conditionList.length > 1" text type="danger"
								size="small" @click="deleteGroup(index)" icon="Delete" />
						</div>
					</div>
					<!-- 条件项列表 -->
					<div class="px-4 pt-3 pb-1">
						<div v-for="(item1, index1) in item.conditionList" :key="index1"
							class="mb-2" :class="index1 > 0 ? 'pt-2 border-t border-dashed border-gray-200 dark:border-slate-600' : ''">
							<div class="flex items-center justify-between mb-2">
								<span class="inline-block px-2.5 py-0.5 rounded text-xs font-medium leading-snug"
									:class="index1 === 0
										? 'bg-blue-50 dark:bg-blue-900/30 text-[var(--el-color-primary)] border border-blue-200 dark:border-blue-800'
										: item.mode
											? 'bg-green-50 dark:bg-green-900/30 text-green-500 border border-green-200 dark:border-green-800'
											: 'bg-orange-50 dark:bg-orange-900/30 text-orange-400 border border-orange-200 dark:border-orange-800'">
									{{ index1 === 0 ? '当' : item.mode ? '且' : '或' }}
								</span>
								<el-button v-if="item.conditionList.length > 1" text type="danger" size="small"
									@click="deleteCondition(index, index1)" icon="Delete" />
							</div>
							<div class="pl-1">
								<condition v-if="conditionConfig.conditionType === 0" :condition="item1" />
								<form-condition v-else :condition="item1" />
							</div>
						</div>
					</div>
					<!-- 添加条件按钮 -->
					<div class="px-4 pt-2 pb-3.5">
						<el-button type="primary" plain size="small" @click="addOneCondition(item, index)"
							icon="Plus">添加条件</el-button>
					</div>
				</div>

				<!-- 添加条件组按钮 -->
				<el-button type="primary" plain @click="addOneConditionGroup" icon="Plus"
					class="w-full !border-dashed">添加条件组</el-button>
			</div>
		</div>
	</el-drawer>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { conditionStr } from '../../utils';
import { useStore } from '../../stores/index';
import Condition from './components/condition.vue';
import FormCondition from './components/formCondition.vue';
import { useFlowStore } from '../../stores/flow';
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
const addOneCondition = (item) => {
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
					// 根据判断维度设置不同的 keyType
					const orgType = con.orgType || 'user';
					if (orgType === 'dept') {
						con.keyType = 'SelectDept';
					} else if (orgType === 'role') {
						con.keyType = 'SelectRole';
					} else if (orgType === 'post') {
						con.keyType = 'SelectPost';
					} else {
						con.keyType = 'SelectUser';
					}
				} else {
					// 递归搜索包含children的表单项
					let ele = findFormItemByField(step2FormList.value, key);
					if (ele && ele?.props?.type === 'user') {
						con.keyType = 'SelectUser';
					} else if (ele && ele?.props?.type === 'dept') {
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

const closeDrawer = () => {
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
