<template>
	<div class="flex flex-col items-center mx-[30px] relative">
		<!-- 手机预览容器 -->
		<div class="relative">
			<!-- 手机外壳装饰 -->
			<div class="absolute -inset-3 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-[2.5rem] shadow-2xl"></div>

			<!-- 手机屏幕区域 -->
			<div class="relative bg-[#f8f8f8] dark:bg-[var(--next-color-disabled)] w-[360px] min-h-[640px] rounded-[2rem] shadow-xl overflow-hidden border-8 border-gray-800 dark:border-black">
				<!-- 顶部刘海 -->
				<div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 dark:bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2">
					<div class="w-12 h-1 bg-gray-700 dark:bg-gray-800 rounded-full"></div>
					<div class="w-2 h-2 bg-gray-700 dark:bg-gray-800 rounded-full"></div>
				</div>

				<!-- 内容区域 -->
				<div class="relative w-full pt-6 text-[#333] dark:text-[var(--next-color-white)]">
					<div
						v-for="(widget, index) in pageData"
						:key="widget.id"
						class="relative transition-all duration-200"
						:class="{
							'cursor-pointer': !widget?.disabled,
						}"
						@click="handleClick(widget, index)"
					>
						<!-- 选中/未选中边框 -->
						<div
							class="absolute inset-0 z-[100] pointer-events-none transition-all duration-200"
							:class="{
								'ring-2 ring-primary ring-inset shadow-lg shadow-primary/20': index == modelValue,
								'ring-1 ring-dashed ring-gray-300 dark:ring-gray-600 ring-inset': !widget?.disabled && index != modelValue,
							}"
						>
							<!-- 选中标识 -->
							<div
								v-if="index == modelValue"
								class="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full shadow-md z-10"
							>
								<el-icon><Check /></el-icon>
							</div>
						</div>

						<!-- 组件内容 -->
						<slot>
							<component
								:is="widgets[widget?.name]?.content"
								:content="widget.content"
								:styles="widget.styles"
								:key="widget.id"
							/>
						</slot>
					</div>
				</div>

				<!-- 底部按钮区域 -->
				<div class="sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4">
					<slot name="footer" />
				</div>
			</div>

			<!-- 侧边按钮装饰 -->
			<div class="absolute -right-1 top-20 w-1 h-12 bg-gray-700 dark:bg-gray-800 rounded-l"></div>
			<div class="absolute -right-1 top-36 w-1 h-16 bg-gray-700 dark:bg-gray-800 rounded-l"></div>
			<div class="absolute -left-1 top-24 w-1 h-8 bg-gray-700 dark:bg-gray-800 rounded-r"></div>
		</div>

		<!-- 预览标签 -->
		<div class="mt-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-lg border border-primary/20 dark:border-primary/30">
			<div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
				<el-icon class="text-primary"><View /></el-icon>
				<span class="font-medium">实时预览</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import widgets from '../widgets';
import type { PropType } from 'vue';

defineProps({
	pageData: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
	modelValue: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits<{
	(event: 'update:modelValue', value: number): void;
}>();

const handleClick = (widget: any, index: number) => {
	if (widget.disabled) return;
	emit('update:modelValue', index);
};
</script>


