<template>
	<div>
		<!--			<approval :node-config="nodeConfig" v-if="nodeConfig.type==1"></approval>-->
		<div class="node-wrap" v-if="nodeConfig.type < 3 || nodeConfig.type === 10">
			<div class="node-wrap-box" :class="(nodeConfig.type == 0 ? 'start-node ' : '') + (nodeConfig.error ? 'active error' : '')">
				<div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
					<span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
					<template v-else>
						<el-icon v-if="nodeConfig.type == 1"><User /></el-icon>
						<el-icon v-else-if="nodeConfig.type == 10"><Timer /></el-icon>
						<el-icon v-else><Message /></el-icon>
						<input
							v-if="isInput"
							type="text"
							class="ant-input editable-title-input"
							@blur="blurEvent()"
							@focus="$event.currentTarget.select()"
							v-focus
							v-model="nodeConfig.nodeName"
							:placeholder="defaultText"
						/>
						<span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
						<el-icon class="close" @click="delNode"><Close /></el-icon>
					</template>
				</div>
				<div class="content" @click="openConfigDrawer">
					<div class="text">
						{{ placeHolder?.length > 0 ? placeHolder: '请选择' + defaultText }}
					</div>
					<el-icon class="arrow"><ArrowRight /></el-icon>
				</div>

				<div class="error_tip" v-if="nodeConfig.error">
					<el-icon class="error-icon"><WarningFilled /></el-icon>
				</div>
			</div>
			<addNode :current-node="nodeConfig" v-model:childNodeP="nodeConfig.childNode" />
		</div>
		<div class="branch-wrap" v-if="nodeConfig.type == 4">
			<div class="branch-box-wrap">
				<div class="branch-box">
					<button class="add-branch" @click="addTerm">添加条件</button>
					<div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
						<div class="condition-node">
							<div class="condition-node-box">
								<div class="auto-judge" :class="item.error ? 'error active' : ''">
									<div class="sort-left" v-if="index != 0" @click="arrTransfer(index, -1)">&lt;</div>
									<div class="title-wrapper">
										<input
											style="width: 50%"
											v-if="isInputList[index]"
											type="text"
											class="ant-input editable-title-input"
											@blur="blurEvent(index)"
											@focus="$event.currentTarget.select()"
											v-focus
											v-model="item.nodeName"
										/>
										<span v-else class="editable-title" @click="clickEvent(index)">{{ item.nodeName }}</span>
										<span class="priority-title">优先级{{ item.priorityLevel }}</span>
										<el-icon class="close" @click="delTerm(index)"><Close /></el-icon>
									</div>
									<div class="sort-right" v-if="index != nodeConfig.conditionNodes.length - 1" @click="arrTransfer(index)">&gt;</div>
									<div class="content" v-if="index < nodeConfig.conditionNodes.length - 1" @click="openConfigDrawer(item.priorityLevel)">
										{{ conditionStr(nodeConfig, index) }}
									</div>
									<div class="content" v-else>{{ conditionStr(nodeConfig, index) }}</div>
									<div class="error_tip" v-if="item.error">
										<el-icon class="error-icon"><WarningFilled /></el-icon>
									</div>
								</div>
								<addNode v-model:childNodeP="item.childNode" :current-node="item" />
							</div>
						</div>
						<nodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode" />
						<template v-if="index == 0">
							<div class="top-left-cover-line"></div>
							<div class="bottom-left-cover-line"></div>
						</template>
						<template v-if="index == nodeConfig.conditionNodes.length - 1">
							<div class="top-right-cover-line"></div>
							<div class="bottom-right-cover-line"></div>
						</template>
					</div>
				</div>
				<addNode v-model:childNodeP="nodeConfig.childNode" :current-node="nodeConfig" />
			</div>
		</div>
		<div class="branch-wrap" v-if="nodeConfig.type == 5">
			<div class="branch-box-wrap">
				<div class="branch-box">
					<button class="add-branch" @click="addTerm">添加分支</button>
					<div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
						<div class="condition-node">
							<div class="condition-node-box">
								<div class="auto-judge" :class="item.error ? 'error active' : ''">
									<div class="sort-left" v-if="index != 0" @click="arrTransfer(index, -1)">&lt;</div>
									<div class="title-wrapper">
										<input
											style="width: 50%"
											v-if="isInputList[index]"
											type="text"
											class="ant-input editable-title-input"
											@blur="blurEvent(index)"
											@focus="$event.currentTarget.select()"
											v-focus
											v-model="item.nodeName"
										/>
										<span v-else class="editable-title" @click="clickEvent(index)">{{ item.nodeName }}</span>

										<!--										<span class="priority-title" @click="openConfigDrawer(item.priorityLevel)">优先级{{-->
										<!--												item.priorityLevel-->
										<!--											}}</span>-->
										<el-icon class="close" @click="delTerm(index)"><Close /></el-icon>
									</div>
									<div class="sort-right" v-if="index != nodeConfig.conditionNodes.length - 1" @click="arrTransfer(index)">&gt;</div>

									<div class="content">{{ item.placeHolder }}</div>
									<div class="error_tip" v-if="item.error">
										<el-icon class="error-icon"><WarningFilled /></el-icon>
									</div>
								</div>
								<addNode v-model:childNodeP="item.childNode" :current-node="item" />
							</div>
						</div>
						<nodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode" />
						<template v-if="index == 0">
							<div class="top-left-cover-line"></div>
							<div class="bottom-left-cover-line"></div>
						</template>
						<template v-if="index == nodeConfig.conditionNodes.length - 1">
							<div class="top-right-cover-line"></div>
							<div class="bottom-right-cover-line"></div>
						</template>
					</div>
				</div>
				<addNode v-model:childNodeP="nodeConfig.childNode" :current-node="nodeConfig" />
			</div>
		</div>
		<nodeWrap v-if="nodeConfig.childNode" v-model:nodeConfig="nodeConfig.childNode" />
	</div>
</template>
<script setup>
import addNode from './addNode.vue';
import Approval from './node/approval.vue';

import { onMounted, ref, watch, getCurrentInstance, computed } from 'vue';
import { useStore } from '../stores/index';
import { bgColors, placeholderList } from '../utils/const';
import { conditionStr, arrToStr, setApproverStr, copyerStr, checkApproval, timerStr } from '../utils/workflowHelpers';
import { useI18n } from 'vue-i18n';

const _uid = getCurrentInstance().uid;

const props = defineProps({
	nodeConfig: {
		type: Object,
		default: () => ({}),
	},
});

const defaultText = computed(() => {
	return placeholderList[props.nodeConfig.type];
});

const {t} = useI18n()
const placeHolder = computed(() => {
	if (props.nodeConfig.type == 0) {
		return arrToStr(props.nodeConfig.nodeUserList) || t('flow.allUser');
	}
	if (props.nodeConfig.type == 1) {
		return setApproverStr(props.nodeConfig);
	}
	if (props.nodeConfig.type == 2) {
		return copyerStr(props.nodeConfig);
	}
	if (props.nodeConfig.type == 10) {
		return timerStr(props.nodeConfig);
	}
	return '';
});

watch(placeHolder, (value, oldValue, onCleanup) => {
	props.nodeConfig.placeHolder = value;
});

import { useFlowStore } from '../stores/flow';
import other from '/@/utils/other';
import { flattenFormItems } from '../utils/formUtils';

const flowStore = useFlowStore();

const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2.formRule || [];
});

watch(
	() => step2FormList.value,
	(val) => {
		const nodeConfig = props.nodeConfig;

		// 获取展平后的表单项列表
		const flattenedFormList = flattenFormItems(val);

		if (nodeConfig.type == 1) {
			//审批人

			if (nodeConfig.assignedType == 8) {
				//表单人员
				const formUserId = nodeConfig.formUserId;
				// 使用展平后的表单列表进行检查
				const length = flattenedFormList.filter((res) => res.field === formUserId).length;
				if (length == 0) {
					nodeConfig.formUserId = '';
					nodeConfig.formUserName = '';
					nodeConfig.error = true;
				}
			}
		}
		if (nodeConfig.type == 4) {
			//条件分支

			let index = 0;
			const len = nodeConfig.conditionNodes.length;
			for (const node of nodeConfig.conditionNodes) {
				if (index >= len - 1) {
					break;
				}
				for (const item1 of node.conditionList) {
					for (const item2 of item1.conditionList) {
						// 使用展平后的表单列表进行检查
						const length = flattenedFormList.filter((res) => (res.field === item2.key || item2.key === 'root')).length;
						if (length == 0) {
							item2.key = '';
							item2.expression = '';
							item2.keyType = '';
							item2.value = '';
							node.error = true;
						}
					}
				}
				index++;
			}
		}
	}
);

const isInputList = ref([]);
const isInput = ref(false);
const resetConditionNodesErr = () => {
	if (props.nodeConfig.type == 5) {
		return;
	}
	for (let i = 0; i < props.nodeConfig.conditionNodes.length; i++) {
		const conditionNode = props.nodeConfig.conditionNodes[i];

		conditionNode.error = false;
		const conditionList = conditionNode.conditionList;
		if (i != props.nodeConfig.conditionNodes.length - 1) {
			let error = conditionList.length == 0;

			for (const it of conditionList) {
				error = it.conditionList.length == 0;
				for (const ite of it.conditionList) {
					if (!ite.key || !ite.expression || !ite.value) {
						error = true;
						break;
					}
				}
			}
			conditionNode.error = error;
		}
	}
};
onMounted(() => {
	if (props.nodeConfig.type == 1) {
		props.nodeConfig.error = !checkApproval(props.nodeConfig);
	} else if (props.nodeConfig.type == 2) {
		props.nodeConfig.error = !copyerStr(props.nodeConfig);
	} else if (props.nodeConfig.type == 4) {
		resetConditionNodesErr();
	} else if (props.nodeConfig.type == 10) {
		props.nodeConfig.error = !timerStr(props.nodeConfig);
	}
});
const emits = defineEmits(['update:nodeConfig']);
const store = useStore();
const { setPromoter, setApprover, setCopyer, setCondition, setTimer, setStarterConfig, setApproverConfig, setCopyerConfig, setConditionsConfig, setTimerConfig } = store;
const starterConfigData = computed(() => store.starterConfigData);
const approverConfigData = computed(() => store.approverConfigData);
const copyerConfig1 = computed(() => store.copyerConfig1);
const conditionsConfig1 = computed(() => store.conditionsConfig1);
const timerConfigData = computed(() => store.timerConfigData);

watch(starterConfigData, (approver) => {
	if (approver.flag && approver.id === _uid) {
		emits('update:nodeConfig', approver.value);
	}
});
watch(approverConfigData, (approver) => {
	if (approver.flag && approver.id === _uid) {
		emits('update:nodeConfig', approver.value);
	}
});
watch(copyerConfig1, (copyer) => {
	if (copyer.flag && copyer.id === _uid) {
		emits('update:nodeConfig', copyer.value);
	}
});
watch(conditionsConfig1, (condition) => {
	if (condition.flag && condition.id === _uid) {
		emits('update:nodeConfig', condition.value);
	}
});
watch(timerConfigData, (timer) => {
	if (timer.flag && timer.id === _uid) {
		emits('update:nodeConfig', timer.value);
	}
});

const clickEvent = (index) => {
	if (index || index === 0) {
		isInputList.value[index] = true;
	} else {
		isInput.value = true;
	}
};
const blurEvent = (index) => {
	if (index || index === 0) {
		isInputList.value[index] = false;
		props.nodeConfig.conditionNodes[index].nodeName = props.nodeConfig.conditionNodes[index].nodeName || '条件';
	} else {
		isInput.value = false;
		props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText;
	}
};
const { proxy } = getCurrentInstance();

const delNode = () => {
	emits('update:nodeConfig', props.nodeConfig.childNode);
};
const addTerm = () => {
	if (props.nodeConfig.type == 5) {
		let len = props.nodeConfig.conditionNodes.length + 1;
		props.nodeConfig.conditionNodes.push({
			nodeName: '分支' + len,
			type: 3,
			id: other.getNonDuplicateID(),
			placeHolder: '满足条件',
			parentId: props.nodeConfig.id,

			priorityLevel: len,
			conditionList: [
				{
					conditionList: [],
				},
			],
			nodeUserList: [],
			childNode: null,
		});
		emits('update:nodeConfig', props.nodeConfig);

		return;
	}

	let len = props.nodeConfig.conditionNodes.length + 1;
	props.nodeConfig.conditionNodes.push({
		nodeName: '条件' + len,
		type: 3,
		parentId: props.nodeConfig.id,
		id: other.getNonDuplicateID(),
		priorityLevel: len,
		conditionList: [
			{
				mode: true,
				conditionList: [
					{
						key: '',
						expression: '',
					},
				],
			},
		],
		nodeUserList: [],
		childNode: null,
	});
	resetConditionNodesErr();
	emits('update:nodeConfig', props.nodeConfig);
};
const delTerm = (index) => {
	props.nodeConfig.conditionNodes.splice(index, 1);
	props.nodeConfig.conditionNodes.map((item, index) => {
		item.priorityLevel = index + 1;
		item.nodeName = `条件${index + 1}`;
	});
	resetConditionNodesErr();
	emits('update:nodeConfig', props.nodeConfig);
	if (props.nodeConfig.conditionNodes.length == 1) {
		if (props.nodeConfig.childNode) {
			if (props.nodeConfig.conditionNodes[0].childNode) {
				reData(props.nodeConfig.conditionNodes[0].childNode, props.nodeConfig.childNode);
			} else {
				props.nodeConfig.conditionNodes[0].childNode = props.nodeConfig.childNode;
			}
		}
		emits('update:nodeConfig', props.nodeConfig.conditionNodes[0].childNode);
	}
};
const reData = (data, addData) => {
	if (!data.childNode) {
		data.childNode = addData;
	} else {
		reData(data.childNode, addData);
	}
};
const openConfigDrawer = (priorityLevel) => {
	const { type } = props.nodeConfig;
	if (type == 0) {
		setPromoter(true);
		setStarterConfig({
			value: JSON.parse(JSON.stringify(props.nodeConfig)),

			flag: false,
			id: _uid,
		});
	} else if (type == 1) {
		setApprover(true);
		setApproverConfig({
			value: {
				...JSON.parse(JSON.stringify(props.nodeConfig)),
				...{ assignedType: props.nodeConfig.assignedType || 1 },
				...{ multiple: props.nodeConfig.multiple || false },
			},
			flag: false,
			id: _uid,
		});
	} else if (type == 2) {
		setCopyer(true);
		setCopyerConfig({
			value: JSON.parse(JSON.stringify(props.nodeConfig)),
			flag: false,
			id: _uid,
		});
	} else if (type == 10) {
		setTimer(true);
		setTimerConfig({
			value: JSON.parse(JSON.stringify(props.nodeConfig)),
			flag: false,
			id: _uid,
		});
		return;
	} else {
		setCondition(true);
		setConditionsConfig({
			value: JSON.parse(JSON.stringify(props.nodeConfig)),
			priorityLevel,
			flag: false,
			id: _uid,
		});
	}
};
const arrTransfer = (index, type = 1) => {
	//向左-1,向右1
	props.nodeConfig.conditionNodes[index] = props.nodeConfig.conditionNodes.splice(index + type, 1, props.nodeConfig.conditionNodes[index])[0];
	props.nodeConfig.conditionNodes.map((item, index) => {
		item.priorityLevel = index + 1;
	});
	resetConditionNodesErr();
	emits('update:nodeConfig', props.nodeConfig);
};
</script>
<style scoped>
@import '../css/workflow.css';

.error_tip {
	position: absolute;
	top: 0px;
	right: 0px;
	transform: translate(150%, 0px);
	font-size: 24px;
}

.promoter_person .el-dialog__body {
	padding: 10px 20px 14px 20px;
}

.selected_list {
	margin-bottom: 20px;
	line-height: 30px;
}

.selected_list span {
	margin-right: 10px;
	padding: 3px 6px 3px 9px;
	line-height: 12px;
	white-space: nowrap;
	border-radius: 2px;
	border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
	margin-left: 5px;
	width: 7px;
	height: 7px;
	cursor: pointer;
}
</style>
