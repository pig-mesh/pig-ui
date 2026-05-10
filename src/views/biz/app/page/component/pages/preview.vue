<template>
	<div class="flex flex-col h-full">
		<!-- 手机预览区（自动缩放适配高度） -->
		<div ref="phoneAreaRef" class="flex-1 flex items-start justify-center py-4 px-4 overflow-hidden">
			<div :style="{ transform: `scale(${phoneScale})`, transformOrigin: 'top center' }">
				<!-- 手机外壳容器 -->
				<div class="relative">
					<!-- 手机外壳装饰 -->
					<div class="absolute -inset-3 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-[2.8rem] shadow-2xl"></div>

					<!-- 手机屏幕区域 - iPhone 17 比例 -->
					<div class="relative bg-[#f8f8f8] dark:bg-[var(--next-color-disabled)] w-[360px] h-[770px] rounded-[2.5rem] shadow-xl overflow-hidden border-[6px] border-gray-800 dark:border-black">
						<!-- 动态岛 (Dynamic Island) -->
						<div class="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[32px] bg-black rounded-full z-50 flex items-center justify-center gap-2">
							<div class="w-2.5 h-2.5 bg-gray-800 rounded-full ring-1 ring-gray-700"></div>
						</div>

						<!-- 内容区域 -->
						<div class="relative w-full h-full pt-12 pb-[60px] text-[#333] dark:text-[var(--next-color-white)] overflow-hidden">
							<div
								v-for="(widget, index) in pageData"
								:key="widget.id"
								class="relative"
								:class="{
									'cursor-pointer': !widget?.disabled,
								}"
								@click="handleClick(widget, index)"
							>
								<!-- 选中/未选中边框 -->
								<div
									class="absolute inset-0 z-[100] pointer-events-none"
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

						<!-- Tabbar 固定层 -->
						<div
							v-if="tabbarPreviewList.length"
							class="absolute bottom-0 left-0 right-0 z-40 h-[60px] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
						>
							<div
								v-for="(item, index) in tabbarPreviewList"
								:key="item.previewKey"
								class="relative flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer"
								:class="index === safeSelectedTabbarIndex ? 'text-primary' : 'text-gray-600 dark:text-gray-400'"
								@click.stop="handleTabbarClick(index)"
							>
								<div v-if="index === safeSelectedTabbarIndex" class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"></div>
								<span class="app-wot-icon text-xl" :class="`wd-icon-${getTabbarIcon(item, index === safeSelectedTabbarIndex)}`" />
								<div class="text-xs leading-none">{{ item.name || '导航' }}</div>
							</div>
						</div>
					</div>

					<!-- 侧边按钮装饰 -->
					<div class="absolute w-1 h-12 bg-gray-700 rounded-l -right-1 top-20 dark:bg-gray-800"></div>
					<div class="absolute w-1 h-16 bg-gray-700 rounded-l -right-1 top-36 dark:bg-gray-800"></div>
					<div class="absolute w-1 h-8 bg-gray-700 rounded-r -left-1 top-24 dark:bg-gray-800"></div>
				</div>
			</div>
		</div>

		<!-- 底部按钮区域（不随手机缩放） -->
		<div class="flex-shrink-0 flex justify-center px-4 pb-4">
			<div class="w-[360px] border-t border-gray-200 dark:border-gray-700 pt-4">
				<slot name="footer" />
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import widgets from '../widgets';
import '../wot-icon-style.scss';

interface TabbarPreviewItem {
	id?: number;
	localKey?: string;
	name?: string;
	selected?: string;
	unselected?: string;
}

const props = defineProps({
	pageData: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
	modelValue: {
		type: Number,
		default: 0,
	},
	tabbarList: {
		type: Array as PropType<TabbarPreviewItem[]>,
		default: () => [],
	},
	selectedTabbarIndex: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits<{
	(event: 'update:modelValue', value: number): void;
	(event: 'select-widget', value: number): void;
	(event: 'select-tabbar', value: number): void;
}>();

const PHONE_HEIGHT = 770;
const phoneAreaRef = ref<HTMLElement | null>(null);
const phoneScale = ref(1);

useResizeObserver(phoneAreaRef, ([entry]) => {
	phoneScale.value = Math.min(1, entry.contentRect.height / PHONE_HEIGHT);
});

const tabbarPreviewList = computed(() =>
	props.tabbarList.map((item, index) => ({
		...item,
		previewKey: item.id ?? item.localKey ?? `tabbar-preview-${index}`,
	}))
);

const safeSelectedTabbarIndex = computed(() => {
	const lastIndex = tabbarPreviewList.value.length - 1;
	if (lastIndex < 0) return -1;
	return Math.min(Math.max(props.selectedTabbarIndex, 0), lastIndex);
});

const getTabbarIcon = (item: TabbarPreviewItem, active: boolean) => (active ? item.selected : item.unselected) || item.unselected || item.selected || 'apps';

const handleClick = (widget: any, index: number) => {
	if (widget.disabled) return;
	emit('update:modelValue', index);
	emit('select-widget', index);
};

const handleTabbarClick = (index: number) => {
	if (index < 0 || index >= tabbarPreviewList.value.length) return;
	emit('select-tabbar', index);
};
</script>
