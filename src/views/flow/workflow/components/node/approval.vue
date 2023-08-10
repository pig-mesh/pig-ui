<script setup lang="ts">
import { ref } from 'vue';

const { proxy } = getCurrentInstance();
let isInput = ref(false);

let props = defineProps({
	nodeConfig: {
		type: Object,
		default: () => {},
	},
});
const blurEvent = (index) => {
	if (index || index === 0) {
		isInputList.value[index] = false;
		props.nodeConfig.conditionNodes[index].nodeName = props.nodeConfig.conditionNodes[index].nodeName || '条件';
	} else {
		isInput.value = false;
		props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText;
	}
};
import { bgColors, placeholderList } from '/@/views/flow/workflow/utils/const';
import { computed } from 'vue';
import addNode from '../addNode.vue';

import $func from '/@/views/flow/workflow/utils';
import { useI18n } from 'vue-i18n';
let defaultText = computed(() => {
	return placeholderList[props.nodeConfig.type];
});

const { t } = useI18n;
var placeHolder = computed(() => {
	if (props.nodeConfig.type == 0) {
		return $func.arrToStr(props.nodeConfig.nodeUserList) || t('flow.allUser');
	}
	if (props.nodeConfig.type == 1) {
		return $func.setApproverStr(props.nodeConfig);
	}
	if (props.nodeConfig.type == 2) {
		return $func.copyerStr(props.nodeConfig);
	}
	return '';
});

const clickEvent = (index) => {
	if (index || index === 0) {
		isInputList.value[index] = true;
	} else {
		isInput.value = true;
	}
};
let isInputList = ref([]);

const delNode = () => {
	emits('update:nodeConfig', props.nodeConfig.childNode);
};
</script>

<template>
	<div class="node-wrap">
		<div class="node-wrap-box" :class="(nodeConfig.type == 0 ? 'start-node ' : '') + (nodeConfig.error ? 'active error' : '')">
			<div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
				<span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
				<template v-else>
					<span class="iconfont">{{ '' }}</span>
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
					<i class="anticon anticon-close close" @click="delNode"></i>
				</template>
			</div>
			<div class="content" @click="openConfigDrawer">
				<div class="text">
					{{ placeHolder?.length > 0 ? placeHolder : '请选择' + defaultText }}
				</div>
				<i class="anticon anticon-right arrow"></i>
			</div>

			<div class="error_tip" v-if="nodeConfig.error">
				<i class="anticon anticon-exclamation-circle"></i>
			</div>
		</div>
		<addNode :current-node="nodeConfig" v-model:childNodeP="nodeConfig.childNode" />
	</div>
</template>

<style scoped>
@import '/@/views/flow/workflow/css/workflow.css';

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
