<template>
	<div class="shortcuts-section bg-white p-4 mb-4">
		<div class="grid grid-cols-4 gap-4">
			<div v-for="(item, index) in content.data" :key="index" class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
				<div class="icon-wrapper mb-3" :style="{ backgroundColor: item.color || '#007aff' }">
					<decoration-img v-if="item.icon" width="24px" height="24px" :src="item.icon" alt="" />
					<div v-else class="w-6 h-6 flex items-center justify-center">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="white">
							<path d="M8 1L8 15M1 8L15 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</div>
				</div>
				<span class="text-sm text-gray-700 text-center font-medium">{{ item.name }}</span>
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
.shortcuts-section {
	border-radius: 12px;
}

.icon-wrapper {
	width: 48px;
	height: 48px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.icon-wrapper:hover {
	transform: scale(1.05);
}
</style> 