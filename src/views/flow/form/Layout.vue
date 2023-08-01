<template>
	<div>
		<template v-if="mode === 'D'">
			<draggable
				v-model="targetList"
				class="drag-content"
				item-key="index"
				:sort="true"
				effect="dark"
				:group="{ name: 'dragFormList', pull: false, put: true }"
			>
				<template #item="{ element }">
					<div class="border okcomponent line" effect="dark" @click.stop="showConfigPanel(element.id)">
						<el-icon v-if="element.type != 'Empty'" class="deleteIcon" @click.stop="deleteForm(element.id)">
							<Delete />
						</el-icon>
						<el-form-item :label="step2Object[element.id]?.name" :required="step2Object[element.id]?.required">
							<component style="width: 100%" :is="getFormWidget(element.type)" :id="element.id" v-model:form="step2Object[element.id]"></component>
						</el-form-item>
					</div>
				</template>
			</draggable>
		</template>
		<template v-else>
			<el-card v-for="(item, index) in form.props.value" :key="index" style="margin-bottom: 10px">
				<template #header>
					<div class="card-header">
						<span>编号:{{ index + 1 }}</span>
						<el-button
							v-if="form.props.value.length > 0 && form.perm != 'R'"
							@click="deleteOneItem(index)"
							class="button"
							icon="Delete"
							text
						></el-button>
					</div>
				</template>
				<form-render ref="formRenderRefLayout" :form-list="item"></form-render>
			</el-card>
			<div style="text-align: center; padding: 15px">
				<el-button
					type="primary"
					@click="addOneItem"
					:disabled="form.perm === 'R' || (form.props.max && form.props.value.length >= form.props.max)"
					text
					>添加明细
				</el-button>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable';

import {Delete} from '@element-plus/icons-vue';
import {computed, ref} from 'vue';

import getFormName from '/@/views/flow/form/tools/utils/getFormWidget';
import FormRender from './render/FormRender.vue';
import {useFlowStore} from '../workflow/stores/flow';

const emit = defineEmits(['showPanel', 'addLayoutOneItem', 'deleteLayoutOneItem']);
let flowStore = useFlowStore();

var config = computed(() => {
	let step2 = flowStore.step2;
  return step2.filter((res) => res.id === props.id)[0];
});

const getFormWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormName[name];
};

let targetList = computed({
	get: () => {
		let value = config.value?.props?.value;
		if (value?.length == 0) {
			return [
				{
					type: 'Empty',
					name: '',
				},
			];
		}
		return value;
	},
	set: (v) => {
		config.value.props.value = v.filter((res) => res.type != 'Layout' && res.type != 'Empty');
	},
});

const addOneItem = () => {
	emit('addLayoutOneItem', props.form.id);
};

const deleteOneItem = (index) => {
	emit('deleteLayoutOneItem', props.form.id, index);
};

const showConfigPanel = (id) => {
	emit('showPanel', config.value.props.value.filter((res) => res.id === id)[0]);
};

const deleteForm = (id) => {
	config.value.props.value = config.value.props.value.filter((res) => res.id !== id);

	emit('showPanel', undefined);
};
var step2Object = computed(() => {
	var obj = {};

	targetList.value.forEach((res) => (obj[res.id] = res));

	return obj;
});

let props = defineProps({
	mode: {
		type: String,
		default: 'D',
	},

	id: {
		type: String,
		default: '',
	},

	index: {
		type: Number,
		default: undefined,
	},

	form: {
		type: Object,
		default: () => {},
	},
});
const { proxy } = getCurrentInstance();

const getValidateRule = () => {
	var item = props.form;
	var itemProps = item.props;

	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (value.length == 0) {
				return callback(new Error('明细【' + item.name + '】的数量不能为0'));
			}
		}
		if (value.length == 0) {
			return callback();
		}
		if (itemProps.min && value.length < itemProps.min) {
			return callback(new Error('明细【' + item.name + '】的数量不能小于' + itemProps.min));
		}
		if (itemProps.max && value.length > itemProps.max) {
			return callback(new Error('明细【' + item.name + '】的数量不能大于' + itemProps.max));
		}

		var result = [];

		for (var fr of formRenderRefLayout.value) {
			fr.validate(function (valid) {
				result.push(valid);
			});
		}

		setTimeout(() => {
			if (result.indexOf(false) >= 0) {
				callback(new Error('明细【' + item.name + '】下的表单验证失败'));
			} else {
				callback();
			}
		}, 1000);
	};
	let ruleArray = [
		{
			validator: checkConfig,
			trigger: 'blur',
		},
	];
	if (item.required) {
		ruleArray.push({ required: true, message: '请填写' + item.name, trigger: 'change' });
	}
	return ruleArray;
};
const formRenderRefLayout = ref();

defineExpose({ getValidateRule });
</script>
<style scoped>
.okcomponent {
	padding: 5px;
	border: 1px solid;
	border-radius: 5px;
	margin-bottom: 10px;
}

@center_width: 360px;

.drag-content {
	min-height: 100px;
	padding: 10px 10px;
}

.deleteIcon {
	position: absolute;
	margin-left: calc(@center_width - 80px);
	z-index: 20;
}

.deleteIcon:hover {
	cursor: pointer;
	color: palevioletred;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.box-card {
	width: 480px;
}
</style>
