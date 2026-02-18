<!--
  DictTag 字典标签展示组件（全局注册）

  功能：根据字典选项数组和当前值，渲染对应的标签。
  支持 el-tag 样式（带颜色）和纯文本样式，用于表格列中展示字典值。

  用法示例：
  <dict-tag :options="status_type" :value="scope.row.status" />
  <dict-tag :options="log_type" :value="scope.row.logType" />

  其中 options 来自 useDict() hook，结构为：
  [{ label: '正常', value: '0', elTagType: 'success', elTagClass: '' }, ...]

  Props：
  - options : DictOption[] - 字典选项数组（由 useDict hook 或手动定义）
  - value   : string | number | array - 当前值，支持单值和多值
-->
<template>
	<div>
		<template v-for="(item, index) in options">
			<template v-if="values.includes(item.value || item)">
				<!-- 无标签样式或 default 类型：纯文本展示 -->
				<span v-if="!item.elTagType || item.elTagType === 'default'" :key="item.value ?? index" :class="item.elTagClass">
					{{ item.label || item }}
				</span>
				<!-- 其他类型：使用 el-tag 渲染带颜色的标签 -->
				<el-tag
					v-else
					:key="item.value ?? index"
					:disable-transitions="true"
					:type="item.elTagType === 'primary' ? '' : item.elTagType"
					:class="item.elTagClass"
				>
					{{ item.label || item }}
				</el-tag>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts" name="dict-tag">
import { computed, type PropType } from 'vue';

interface DictOption {
	label: string;
	value: string | number;
	/** el-tag 类型：primary / success / warning / danger / info / default */
	elTagType?: string;
	/** 自定义 CSS 类名 */
	elTagClass?: string;
}

const props = defineProps({
	/** 字典选项列表 */
	options: {
		type: Array as PropType<DictOption[]>,
		default: () => [],
	},
	/** 当前值，支持单值或数组 */
	value: {
		type: [Number, String, Array] as PropType<number | string | (string | number)[]>,
		default: undefined,
	},
});

/** 将 value 统一转为数组，便于模板中用 includes 匹配 */
const values = computed(() => {
	if (props.value == null) return [];
	return Array.isArray(props.value) ? props.value : [String(props.value)];
});
</script>

<style scoped>
.el-tag + .el-tag {
	margin-left: 10px;
}
</style>
