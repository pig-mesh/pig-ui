<template>
	<div>
		<template v-for="(item, index) in props.options">
			<template v-if="values.includes(item.value || item)">
				<span v-if="item.elTagType == 'default' || item.elTagType == ''" :key="index" :index="index" :class="item.elTagClass">{{
					item.label || item
				}}</span>
				<el-tag
					v-else
					:disable-transitions="true"
					:key="index * 2"
					:index="index"
					:type="item.elTagType === 'primary' ? '' : item.elTagType"
					:class="item.elTagClass"
					>{{ item.label || item }}</el-tag
				>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts" name="dict-tag">
import { computed } from 'vue';

const props = defineProps({
	// 数据
	options: {
		type: Array as any,
		default: null,
	},
	// 当前的值
	value: [Number, String, Array],
});

const values = computed(() => {
	if (props.value !== null && typeof props.value !== 'undefined') {
		return Array.isArray(props.value) ? props.value : [String(props.value)];
	} else {
		return [];
	}
});
</script>

<style scoped>
.el-tag + .el-tag {
	margin-left: 10px;
}
</style>
