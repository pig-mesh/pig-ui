<script setup lang="ts">
import { useFlowStore } from '../../../stores/flow';
import { computed, ref, watch, type PropType } from 'vue';
import { watchImmediate } from '@vueuse/core';
import selectShow from '/@/components/OrgSelector/index.vue';
import other from '/@/utils/other';
import { flattenFormItems, type FormItem } from '../../../utils/formUtils';

// 表达式类型接口定义
interface ExpressionType {
	key: string;
	name: string;
}

// 表达式映射接口定义
interface ExpressionMap {
	OrgSelector: ExpressionType[];
	input: ExpressionType[];
	textarea: ExpressionType[];
	textArea: ExpressionType[]; // 添加这个字段以匹配接口要求
	inputNumber: ExpressionType[];
	datePicker: ExpressionType[];
	[key: string]: ExpressionType[];
}

let flowStore = useFlowStore();

// 获取步骤2的表单列表
const step2FormList = computed(() => {
	return (flowStore.step2.formRule as unknown) as FormItem[];
});

// 定义允许参与计算的表单类型
const allowedTypes = ['OrgSelector', 'input', 'textarea', 'inputNumber', 'datePicker'];

// 过滤并处理表单列表
const formList = computed(() => {
	const value = step2FormList.value;

	// 使用统一的flattenFormItems函数,传入类型过滤器
	const flattened = flattenFormItems(value, allowedTypes);
	const $deepCopy = other.deepClone(flattened);

	// 添加发起人选项
	$deepCopy.push({
		id: 'root',
		field: 'root',
		name: '发起人',
		typeName: '用户',
		type: 'OrgSelector',
		props: { type: 'user' },
		value: [],
	});

	return $deepCopy as FormItem[];
});

// 发起人判断维度选项
const orgDimensionOptions = [
	{ value: 'user', label: '用户' },
	{ value: 'dept', label: '部门' },
	{ value: 'role', label: '角色' },
	{ value: 'post', label: '岗位' },
];

// 条件接口定义
interface Condition {
	key: string;
	value: any;
	keyType?: string;
	expression?: string;
	orgType?: string;
}

// 组件属性定义
let props = defineProps({
	condition: {
		type: Object as PropType<Condition>,
		default: () => ({}),
	},
});

// 表单项映射对象
const formIdObj = computed(() => {
	const obj: Record<string, FormItem> = {};
	formList.value.forEach((item: FormItem) => {
		if (item.field) {
			obj[item.field] = item;
		}
	});
	return obj;
});

// 条件选择值的计算属性
const conditionSelectVal = computed({
	get() {
		let value = props.condition.value;
		return value && value.length > 0 ? value.map((res: { key: string }) => res.key) : undefined;
	},
	set(t: string[]) {
		let options = formList.value.find((item) => item.field === props.condition.key)?.props?.options || [];
		let filterElement = options.filter((res: { key: string }) => t.indexOf(res.key) >= 0);
		props.condition.value = filterElement;
	},
});

// 表达式配置
let expression = ref<ExpressionMap>({
	OrgSelector: [
		{ key: 'in', name: '属于' },
		{ key: 'notin', name: '不属于' },
	],
	input: [
		{ key: '==', name: '等于' },
		{ key: '!=', name: '不等于' },
		{ key: 'contain', name: '包含' },
		{ key: 'notcontain', name: '不包含' },
	],
	textarea: [
		{ key: '==', name: '等于' },
		{ key: '!=', name: '不等于' },
		{ key: 'contain', name: '包含' },
		{ key: 'notcontain', name: '不包含' },
	],
	textArea: [
		// 添加这个字段以匹配接口要求
		{ key: '==', name: '等于' },
		{ key: '!=', name: '不等于' },
		{ key: 'contain', name: '包含' },
		{ key: 'notcontain', name: '不包含' },
	],
	inputNumber: [
		{ key: '==', name: '等于' },
		{ key: '!=', name: '不等于' },
		{ key: '>', name: '大于' },
		{ key: '>=', name: '大于等于' },
		{ key: '<', name: '小于' },
		{ key: '<=', name: '小于等于' },
	],
	datePicker: [
		{ key: '==', name: '等于' },
		{ key: '!=', name: '不等于' },
		{ key: '>', name: '大于' },
		{ key: '>=', name: '大于等于' },
		{ key: '<', name: '小于' },
		{ key: '<=', name: '小于等于' },
	],
});

// 当前条件是否为发起人字段
const isRootField = computed(() => props.condition.key === 'root');

// 发起人当前选择的判断维度，默认 user
const currentOrgType = computed(() => props.condition.orgType || 'user');

// 监听条件键值变化，清空关系和值字段，并确保OrgSelector的值为数组
watchImmediate(
	() => props.condition.key,
	(newKey, oldKey) => {
		// 当条件字段发生改变时（不是初始化），清空选择关系和条件值
		if (oldKey !== undefined && newKey !== oldKey) {
			props.condition.expression = '';
			props.condition.value = '';
			// 切换字段时重置维度
			if (newKey === 'root') {
				props.condition.orgType = 'user';
			} else {
				props.condition.orgType = undefined;
			}
		}

		// 确保OrgSelector的值始终为数组
		if (formIdObj.value[newKey]?.type === 'OrgSelector') {
			if (!props.condition.value || !Array.isArray(props.condition.value)) {
				props.condition.value = [];
			}
		}
	}
);

// 监听发起人判断维度变化，切换维度时清空已选值
watch(
	() => props.condition.orgType,
	(newType, oldType) => {
		if (oldType !== undefined && newType !== oldType) {
			props.condition.value = [];
		}
	}
);
</script>

<template>
	<div>
		<el-select v-model="condition.key" placeholder="选择表单" style="width: 100%">
			<el-option v-for="f in formList" :key="f.field" :label="f.title || f.name" :value="f.field" />
		</el-select>

		<el-select v-model="condition.expression" placeholder="选择关系" style="width: 100%; margin-top: 20px">
			<el-option
				v-for="f in formIdObj[condition.key]?.type ? expression[formIdObj[condition.key].type] : []"
				:key="f.key"
				:label="f.name"
				:value="f.key"
			/>
		</el-select>

		<el-input
			v-model="condition.value"
			v-if="formIdObj[condition.key]?.type === 'input' || formIdObj[condition.key]?.type === 'textarea'"
			style="margin-top: 20px"
			placeholder="条件值"
		></el-input>

		<el-input-number
			v-model="condition.value"
			v-if="formIdObj[condition.key]?.type === 'Money' || formIdObj[condition.key]?.type === 'inputNumber'"
			placeholder="条件值"
			style="width: 100%; margin-top: 20px"
			controls-position="right"
		/>

		<el-date-picker
			value-format="YYYY-MM-DD"
			type="date"
			class="formDate"
			v-model="condition.value"
			v-if="formIdObj[condition.key]?.type === 'datePicker'"
			placeholder="条件值"
			style="width: 100%; margin-top: 20px"
		/>

		<el-select
			v-model="conditionSelectVal"
			v-if="formIdObj[condition.key]?.type === 'SingleSelect'"
			style="width: 100%; margin-top: 20px"
			multiple
			collapse-tags
			collapse-tags-tooltip
			placeholder="请选择值"
		>
			<el-option v-for="item in formIdObj[condition.key]?.props?.options || []" :key="item.key" :label="item.value" :value="item.key" />
		</el-select>
		<!-- 发起人字段：判断维度选择 -->
		<el-select
			v-if="isRootField"
			v-model="condition.orgType"
			placeholder="选择判断维度"
			style="width: 100%; margin-top: 20px"
		>
			<el-option v-for="item in orgDimensionOptions" :key="item.value" :label="item.label" :value="item.value" />
		</el-select>

		<!-- 发起人字段：根据维度显示对应选择器 -->
		<div v-if="isRootField" style="margin-top: 20px">
			<select-show
				v-if="currentOrgType === 'user'"
				v-model:orgList="condition.value"
				type="user"
				:multiple="true"
			></select-show>
			<select-show
				v-if="currentOrgType === 'dept'"
				v-model:orgList="condition.value"
				type="dept"
				:multiple="true"
			></select-show>
			<select-show
				v-if="currentOrgType === 'role'"
				v-model:orgList="condition.value"
				type="role"
				:multiple="true"
			></select-show>
			<select-show
				v-if="currentOrgType === 'post'"
				v-model:orgList="condition.value"
				type="post"
				:multiple="true"
			></select-show>
		</div>

		<!-- 非发起人的 OrgSelector 字段 -->
		<div v-if="!isRootField && formIdObj[condition.key]?.type === 'OrgSelector' && formIdObj[condition.key]?.props?.type === 'user'" style="margin-top: 20px">
			<select-show
				v-model:orgList="condition.value"
				type="user"
				:multiple="true"
			></select-show>
		</div>
		<div v-if="!isRootField && formIdObj[condition.key]?.type === 'OrgSelector' && formIdObj[condition.key]?.props?.type === 'dept'" style="margin-top: 20px">
			<select-show
				v-model:orgList="condition.value"
				type="dept"
				:multiple="true"
			></select-show>
		</div>
	</div>
</template>

<style scoped>
:deep(.formDate div.el-input__wrapper) {
	width: 100% !important;
}
:deep(.formDate) {
	width: 100% !important;
}
</style>
