<template>
	<div class="w-full overflow-x-hidden">
		<el-scrollbar style="height: 700px; overflow-x: hidden;">
			<el-form label-width="80px" class="px-1 w-full max-w-full mr-8">
				<!-- 标题名称 -->
				<el-form-item label="标题名称" class="mb-6">
					<el-input
						v-model="content.title"
						placeholder="请输入标题名称"
						clearable
						maxlength="20"
						show-word-limit
						class="!w-full transition-all duration-200"
					>
						<template #prefix>
							<el-icon class="text-gray-400"><Edit /></el-icon>
						</template>
					</el-input>
				</el-form-item>

				<!-- 菜单设置 -->
				<el-form-item label="菜单设置" class="!mb-0">
					<div class="flex-1 w-full">
						<AddNav v-model="content.data" />
					</div>
				</el-form-item>
			</el-form>
		</el-scrollbar>
	</div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type options from './options';
import AddNav from '../../add-nav.vue';
type OptionsType = ReturnType<typeof options>;
defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
});
</script>

<style lang="scss" scoped></style>
