<template>
	<div class="workbench-section bg-white p-4 mb-4">
		<div class="section-header flex items-center justify-between mb-3">
			<div class="flex items-center">
				<h3 class="text-lg font-medium text-gray-900">{{ content.title }}</h3>
				<div class="ml-2 text-sm text-gray-500">{{ content.subtitle }}</div>
			</div>
			<div class="expand-icon">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M6 12L10 8L6 4" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
		<div class="grid grid-cols-4 gap-3">
			<div v-for="(item, index) in content.data" :key="index" class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
				<div class="icon-wrapper mb-2">
					<decoration-img v-if="item.icon" width="24px" height="24px" :src="item.icon" alt="" />
					<div v-else class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="white">
							<path d="M8 1L8 15M1 8L15 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</div>
				</div>
				<span class="text-sm text-gray-700 text-center">{{ item.name }}</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import type options from './options';
import DecorationImg from '../../decoration-img.vue';
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

<style lang="scss" scoped>
.workbench-section {
	border-radius: 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
	border-bottom: 1px solid #f0f0f0;
	padding-bottom: 12px;
}

.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style> 