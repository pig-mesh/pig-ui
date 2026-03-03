<template>
	<div class="add-node-btn-box">
		<div class="add-node-btn">
			<el-popover placement="right-start" v-model="visible" width="280px">
				<div class="add-node-popover-body">
					<a class="add-node-popover-item approver" @click="addType(1)">
						<div class="item-wrapper">
							<el-icon><User /></el-icon>
						</div>
						<p>{{ $t('flow.approver') }}</p>
					</a>
					<a class="add-node-popover-item notifier" @click="addType(2)">
						<div class="item-wrapper">
							<el-icon><Message /></el-icon>
						</div>
						<p>{{ $t('flow.carbonCopyRecipient') }}</p>
					</a>

					<a class="add-node-popover-item condition" @click="addType(4)">
						<div class="item-wrapper">
							<el-icon><Share /></el-icon>
						</div>
						<p>{{ $t('flow.conditionalBranching') }}</p>
					</a>

					<a class="add-node-popover-item ParallelGateway" @click="addType(5)">
						<div class="item-wrapper">
							<el-icon><Operation /></el-icon>
						</div>
						<p>{{ $t('flow.parallelBranch') }}</p>
					</a>
					<a class="add-node-popover-item timer" @click="addType(10)">
						<div class="item-wrapper">
							<el-icon><Timer /></el-icon>
						</div>
						<p>{{ $t('flow.timer') }}</p>
					</a>
					<a class="add-node-popover-item trigger" @click="addType(11)">
						<div class="item-wrapper">
							<el-icon><Connection /></el-icon>
						</div>
						<p>{{ $t('flow.trigger') }}</p>
					</a>
				</div>
				<template #reference>
					<button class="btn" type="button">
						<el-icon><Plus /></el-icon>
					</button>
				</template>
			</el-popover>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue';
import other from '/@/utils/other';

const props = defineProps({
	childNodeP: {
		type: Object,
		default: () => ({}),
	},
	currentNode: {
		type: Object,
		default: () => ({}),
	},
});

const emits = defineEmits(['update:childNodeP']);
const visible = ref(false);
const addType = (type) => {
	visible.value = false;
	if (type !== 4 && type !== 5) {
		let data;
		if (type === 1) {
			data = {
				id: other.getNonDuplicateID(),
				nodeName: '审批人',
				error: true,
				type: 1,
				parentId: props.currentNode.id,
				//人员方式
				assignedType: 1,
				//单选还是多选
				multiple: false,
				//多人审批的选项
				multipleMode: 1,
				//第几级部门负责人
				deptLeaderLevel: 1,
				//人员选择
				formUserId: '',
				formUserName: '',
				//表单权限
				formPerms: {},
				//审批人为空
				nobody: {
					handler: 'TO_PASS',
					assignedUser: [],
				},
				//审批人拒绝
				refuse: {
					handler: 'TO_END',
					nodeId: '',
				},
				childNode: props.childNodeP,
				nodeUserList: [],
			};
		} else if (type === 2) {
			data = {
				id: other.getNonDuplicateID(),
				parentId: props.currentNode.id,

				nodeName: '抄送人',
				type: 2,
				error: true,
				childNode: props.childNodeP,
				nodeUserList: [],
				//表单权限
				formPerms: {},
			};
		} else if (type === 10) {
			data = {
				id: other.getNonDuplicateID(),
				parentId: props.currentNode.id,
				nodeName: '延时器',
				type: 10,
				error: true,
				childNode: props.childNodeP,
				timerConfig: {
					timerType: 'DURATION',
					duration: {
						value: 30,
						unit: 'MINUTE',
					},
					dateTime: null,
					formFieldId: null,
					formFieldName: null,
				},
			};
		} else if (type === 11) {
			data = {
				id: other.getNonDuplicateID(),
				parentId: props.currentNode.id,
				nodeName: '触发器',
				type: 11,
				error: true,
				childNode: props.childNodeP,
				triggerConfig: {
					url: '',
					headers: [],
					body: [],
					returnMapping: [],
					errorHandler: 'THROW',
				},
			};
		}
		emits('update:childNodeP', data);
	} else if (type === 4) {
		const id = other.getNonDuplicateID();
		emits('update:childNodeP', {
			nodeName: '条件分支',
			type: 4,
			id: id,
			parentId: props.currentNode.id,

			childNode: props.childNodeP,
			conditionNodes: [
				{
					id: other.getNonDuplicateID(),
					nodeName: '条件1',
					groupMode: true,
					error: true,
					type: 3,
					parentId: id,

					priorityLevel: 1,
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
				},
				{
					nodeName: '条件2',
					type: 3,
					id: other.getNonDuplicateID(),
					groupMode: true,
					error: false,
					parentId: id,
					priorityLevel: 2,
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
				},
			],
		});
	} else if (type === 5) {
		const id = other.getNonDuplicateID();
		emits('update:childNodeP', {
			nodeName: '并行分支',
			type: 5,
			id: id,
			parentId: props.currentNode.id,

			childNode: props.childNodeP,
			conditionNodes: [
				{
					id: other.getNonDuplicateID(),
					nodeName: '分支1',
					placeHolder: '满足条件',
					parentId: id,

					error: false,
					type: 3,
					priorityLevel: 1,
					conditionList: [],
					nodeUserList: [],
					childNode: null,
				},
				{
					nodeName: '分支2',
					type: 3,
					id: other.getNonDuplicateID(),
					parentId: id,

					error: false,
					placeHolder: '满足条件',

					priorityLevel: 2,
					conditionList: [],
					nodeUserList: [],
					childNode: null,
				},
			],
		});
	}
};
</script>
<style scoped lang="css">
.add-node-btn-box {
	width: 240px;
	display: inline-flex;
	flex-shrink: 0;
	position: relative;
}

.add-node-btn-box::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	margin: auto;
	width: 2px;
	height: 100%;
	background-color: #cacaca;
}

.add-node-btn {
	user-select: none;
	width: 240px;
	padding: 20px 0 32px;
	display: flex;
	justify-content: center;
	flex-shrink: 0;
	flex-grow: 1;
}

.add-node-btn .btn {
	outline: none;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
	width: 30px;
	height: 30px;
	min-width: 30px;
	min-height: 30px;
	background: #3296fa;
	border-radius: 50%;
	position: relative;
	border: none;
	padding: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.add-node-btn .btn .iconfont {
	color: #fff;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.add-node-btn .btn:hover {
	transform: scale3d(1.3, 1.3, 1);
	box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
}

.add-node-btn .btn:active {
	transform: none;
	background: #1e83e9;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
<style scoped lang="scss">
@import '../css/workflow.css';

.add-node-popover-body {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 4px;

	.add-node-popover-item {
		cursor: pointer;
		text-align: center;
		flex: 0 0 calc(33.333% - 4px);

		.item-wrapper {
			user-select: none;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 72px;
			height: 72px;
			margin-bottom: 5px;
			background: #fff;
			border: 1px solid #e2e2e2;
			border-radius: 50%;
			transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

			.el-icon {
				font-size: 30px;
			}
		}

		&.approver {
			.item-wrapper {
				color: #ff943e;
			}

			&:hover .item-wrapper {
				background: #ff943e;
				box-shadow: 0 8px 16px 0 rgba(255, 148, 62, 0.35);
			}
		}

		&.notifier {
			.item-wrapper {
				color: #3296fa;
			}

			&:hover .item-wrapper {
				background: #3296fa;
				box-shadow: 0 8px 16px 0 rgba(50, 150, 250, 0.35);
			}
		}

		&.condition {
			.item-wrapper {
				color: #15bc83;
			}

			&:hover .item-wrapper {
				background: #15bc83;
				box-shadow: 0 8px 16px 0 rgba(21, 188, 131, 0.35);
			}
		}

		&.ParallelGateway {
			.item-wrapper {
				color: rgb(255, 69, 0);
			}

			&:hover .item-wrapper {
				background: rgb(255, 69, 0);
				box-shadow: 0 8px 16px 0 rgba(255, 69, 0, 0.35);
			}
		}

		&.timer {
			.item-wrapper {
				color: rgb(148, 103, 255);
			}

			&:hover .item-wrapper {
				background: rgb(148, 103, 255);
				box-shadow: 0 8px 16px 0 rgba(148, 103, 255, 0.35);
			}
		}

		&.trigger {
			.item-wrapper {
				color: rgb(64, 158, 255);
			}

			&:hover .item-wrapper {
				background: rgb(64, 158, 255);
				box-shadow: 0 8px 16px 0 rgba(64, 158, 255, 0.35);
			}
		}

		&:hover {
			.item-wrapper {
				transform: translateY(-3px);
				border-color: transparent;
			}

			.el-icon {
				color: #fff;
			}
		}

		&:active {
			.item-wrapper {
				transform: translateY(0);
				box-shadow: none;
			}
		}
	}
}
</style>
