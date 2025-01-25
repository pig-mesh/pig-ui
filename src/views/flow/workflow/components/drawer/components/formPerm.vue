<script setup lang="ts">
import { computed } from 'vue';
import { useFlowStore } from '/@/views/flow/workflow/stores/flow';

const props = defineProps({
	formPerm: {
		type: Object,
		default: () => {},
	},
	hideKey: {
		type: Array,
		default: () => [],
	},
});

interface FormItem {
	field: string;
	title?: string;
	required?: boolean;
	children?: FormItem[];
	[key: string]: any;
}

let flowStore = useFlowStore();

function flattenFormItems(items: FormItem[]): FormItem[] {
	const flattened: FormItem[] = [];

	items.forEach((item) => {
		if (item.children) {
			flattened.push(...flattenFormItems(item.children));
		} else if (item.field && item.title) {
			flattened.push(item);
		}
	});

	return flattened;
}

const step2FormList = computed(() => {
	const step2 = flowStore.step2;
	return flattenFormItems(step2);
});
</script>

<template>
	<div>
		<div style="display: flex; flex-direction: row; background-color: var(--el-fill-color-light)" effect="dark">
			<div class="f1">表单字段</div>
			<div class="f2">只读</div>
			<div class="f3">编辑</div>
			<div class="f4">隐藏</div>
		</div>

		<div v-if="step2FormList.length == 0">
			<el-empty description="暂无表单" />
		</div>
		<div v-for="item in step2FormList" :key="item.name">
			<div style="display: flex; flex-direction: row">
				<div class="f1">
					<span>{{ item.title }}123</span>
					<span v-if="item.required" style="color: #c75450"> * </span>
				</div>

				<el-radio-group v-model="formPerm[item.field]" size="large">
					<div class="f2">
						<el-radio size="large" label="R"><span></span></el-radio>
					</div>
					<div class="f3">
						<el-radio :disabled="!(hideKey.length == 0 || hideKey.indexOf('E') < 0)" size="large" label="E"><span></span> </el-radio>
					</div>
					<div class="f4">
						<el-radio size="large" label="H"><span></span></el-radio>
					</div>
				</el-radio-group>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.f1 {
	width: calc(100% - 80px - 80px - 80px);
	padding: 10px;
}

.f2 {
	width: 80px;
	padding: 10px;
}

.f3 {
	width: 80px;
	padding: 10px;
}

.f4 {
	width: 80px;
	padding: 10px;
}
</style>
