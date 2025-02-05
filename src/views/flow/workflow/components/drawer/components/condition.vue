<script setup lang="ts">
import { useFlowStore } from '../../../stores/flow';
import { getCurrentInstance, computed, ref, watch } from 'vue';
import selectShow from '/@/components/OrgSelector/index.vue';
import other from '/@/utils/other';
import { PropType } from 'vue';

// 表单项接口定义
interface FormItem {
	id: string;
	field: string;
	name: string;
	type: string;
	props?: Record<string, any>;
	value?: any;
	title?: string;
	typeName?: string;
}

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
	return flowStore.step2 as FormItem[];
});

// 定义允许参与计算的表单类型
const allowedTypes = ['OrgSelector', 'input', 'textarea', 'inputNumber', 'datePicker'];

// 过滤并处理表单列表
const formList = computed(() => {
	const value = step2FormList.value;
	const $deepCopy = other.deepClone(value.filter((res: FormItem) => allowedTypes.includes(res.type)));

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

// 条件接口定义
interface Condition {
	key: string;
	value: any;
	keyType?: string;
	expression?: string;
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
		obj[item.field] = item;
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

// 监听条件键值变化，确保OrgSelector的值始终为数组
watch(
	() => props.condition.key,
	(newKey) => {
		if (formIdObj.value[newKey]?.type === 'OrgSelector') {
			if (!props.condition.value || !Array.isArray(props.condition.value)) {
				props.condition.value = [];
			}
		}
	},
	{ immediate: true }
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
		<div style="margin-top: 20px">
			<select-show
				v-if="formIdObj[condition.key]?.type === 'OrgSelector' && formIdObj[condition.key]?.props?.type === 'user'"
				v-model:orgList="condition.value"
				type="user"
				:multiple="true"
			></select-show>
		</div>
		<div style="margin-top: 20px">
			<select-show
				v-if="formIdObj[condition.key]?.type === 'OrgSelector' && formIdObj[condition.key]?.props?.type === 'dept'"
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
