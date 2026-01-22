<template>
	<div class="flex flex-col items-center px-[16px] py-4 relative">
		<!-- 手机预览容器 -->
		<div class="relative">
			<!-- 手机外壳装饰 -->
			<div class="absolute -inset-3 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-[2.8rem] shadow-2xl"></div>

			<!-- 手机屏幕区域 - iPhone 17 比例 (149.6mm x 71.5mm = 2.09:1) -->
			<div class="relative bg-[#f8f8f8] dark:bg-[var(--next-color-disabled)] w-[360px] min-h-[770px] rounded-[2.5rem] shadow-xl overflow-hidden border-[6px] border-gray-800 dark:border-black">
				<!-- 动态岛 (Dynamic Island) -->
				<div class="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[32px] bg-black rounded-full z-50 flex items-center justify-center gap-2">
					<div class="w-2.5 h-2.5 bg-gray-800 rounded-full ring-1 ring-gray-700"></div>
				</div>

				<!-- 内容区域 -->
				<div class="relative w-full h-full pt-12 text-[#333] dark:text-[var(--next-color-white)] overflow-hidden">
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
								class="absolute z-10 flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full shadow-md -top-2 -right-2 bg-primary"
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
				<div class="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm dark:border-gray-700">
					<slot name="footer" />
				</div>
			</div>

			<!-- 侧边按钮装饰 -->
			<div class="absolute w-1 h-12 bg-gray-700 rounded-l -right-1 top-20 dark:bg-gray-800"></div>
			<div class="absolute w-1 h-16 bg-gray-700 rounded-l -right-1 top-36 dark:bg-gray-800"></div>
			<div class="absolute w-1 h-8 bg-gray-700 rounded-r -left-1 top-24 dark:bg-gray-800"></div>
		</div>

		<!-- 预览标签 -->
		<div class="px-4 py-2 mt-4 border rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 border-primary/20 dark:border-primary/30">
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


