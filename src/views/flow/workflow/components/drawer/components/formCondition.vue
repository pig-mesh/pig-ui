<script setup lang="ts">
import { PropType } from 'vue';

// 条件接口定义
interface Condition {
	key: string;
	value: any;
	expression?: string;
	fieldName?: string;
	fieldType?: string;
}

// 组件属性定义
let props = defineProps({
	condition: {
		type: Object as PropType<Condition>,
		default: () => ({}),
	},
});

// 表达式选项
const expressionOptions = [
	{ key: '==', name: '等于' },
	{ key: '!=', name: '不等于' },
	{ key: '>', name: '大于' },
	{ key: '>=', name: '大于等于' },
	{ key: '<', name: '小于' },
	{ key: '<=', name: '小于等于' },
	{ key: 'contain', name: '包含' },
	{ key: 'notcontain', name: '不包含' },
	{ key: 'in', name: '属于' },
	{ key: 'notin', name: '不属于' },
];

// 字段类型选项
const fieldTypeOptions = [
	{ key: 'string', name: '文本' },
	{ key: 'number', name: '数字' },
	{ key: 'date', name: '日期' },
	{ key: 'boolean', name: '布尔值' },
];

// 监听字段名变化，清空其他字段
watch(
	() => props.condition.key,
	(newKey, oldKey) => {
		if (oldKey !== undefined && newKey !== oldKey) {
			props.condition.expression = '';
			props.condition.value = '';
			props.condition.fieldType = '';
		}
	}
);

// 监听字段类型变化，清空值
watch(
	() => props.condition.fieldType,
	(newType, oldType) => {
		if (oldType !== undefined && newType !== oldType) {
			props.condition.value = '';
		}
	}
);
</script>

<template>
	<div>
		<el-input 
			v-model="condition.key" 
			placeholder="请输入字段名称（如：amount、status等）" 
			style="width: 100%"
		/>
		
		<el-input 
			v-model="condition.fieldName" 
			placeholder="请输入字段显示名称（如：金额、状态等）" 
			style="width: 100%; margin-top: 20px"
		/>

		<el-select 
			v-model="condition.fieldType" 
			placeholder="选择字段类型" 
			style="width: 100%; margin-top: 20px"
		>
			<el-option
				v-for="f in fieldTypeOptions"
				:key="f.key"
				:label="f.name"
				:value="f.key"
			/>
		</el-select>

		<el-select 
			v-model="condition.expression" 
			placeholder="选择关系" 
			style="width: 100%; margin-top: 20px"
		>
			<el-option
				v-for="f in expressionOptions"
				:key="f.key"
				:label="f.name"
				:value="f.key"
			/>
		</el-select>

		<!-- 根据字段类型显示不同的输入组件 -->
		<el-input
			v-if="condition.fieldType === 'string'"
			v-model="condition.value"
			placeholder="请输入条件值"
			style="width: 100%; margin-top: 20px"
		/>

		<el-input-number
			v-if="condition.fieldType === 'number'"
			v-model="condition.value"
			placeholder="请输入数值"
			style="width: 100%; margin-top: 20px"
			controls-position="right"
		/>

		<el-date-picker
			v-if="condition.fieldType === 'date'"
			v-model="condition.value"
			type="date"
			placeholder="请选择日期"
			value-format="YYYY-MM-DD"
			style="width: 100%; margin-top: 20px"
		/>

		<el-switch
			v-if="condition.fieldType === 'boolean'"
			v-model="condition.value"
			active-text="是"
			inactive-text="否"
			style="margin-top: 20px"
		/>
	</div>
</template>

<style scoped>
/* 组件样式 */
</style>
