<template>
	<div class="px-3 pt-4 pb-7 bg-gray-50 dark:bg-gray-900/50">
		<!-- Hero 区域 -->
		<div class="relative min-h-[184px] mb-4 p-6 overflow-hidden border border-blue-200 dark:border-blue-800/50 rounded-xl bg-blue-100 dark:bg-blue-900/30">
			<div class="relative z-10">
				<div class="mb-1 flex items-center gap-2">
					<span class="rounded bg-primary px-2 py-0.5 text-xs font-bold leading-5 text-white">V 5.0.8</span>
					<span class="text-xs font-medium text-primary dark:text-blue-400">4月22日发布</span>
				</div>
				<div class="text-xl font-bold leading-7 text-primary dark:text-blue-300">
					智能文档、记录面聊
				</div>
				<div class="text-xl font-bold leading-7 text-primary dark:text-blue-300">
					聊天贴表情
				</div>
				<button type="button" class="mt-4 inline-flex h-9 items-center gap-2 rounded-full border-0 bg-primary px-4 text-xs font-semibold text-white">
					<span class="app-wot-icon wd-icon-play-circle text-base" />
					观看讲解
				</button>
			</div>
			<div class="absolute right-4 bottom-4 flex w-[116px] h-[76px] items-center justify-center rounded-xl bg-white/20 shadow-md">
				<span class="app-wot-icon wd-icon-file text-[44px] text-primary dark:text-blue-300" />
			</div>
		</div>

		<!-- 常用快捷方式 -->
		<div class="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/80">
			<div class="mb-5 flex items-center justify-between">
				<h3 class="m-0 text-base font-semibold text-gray-900 dark:text-gray-100">常用</h3>
				<span class="app-wot-icon wd-icon-more text-xl text-gray-400 dark:text-gray-500" />
			</div>
			<div class="grid grid-cols-4 gap-3">
				<div v-for="(item, index) in shortcutItems" :key="`${item.name}-${index}`" class="flex min-w-0 flex-col items-center gap-2">
					<div
						class="flex w-12 h-12 flex-none items-center justify-center rounded-2xl border border-solid text-current shadow-sm"
						:style="shortcutIconStyle(item)"
					>
						<decoration-img v-if="item.iconUrl" width="22px" height="22px" :src="item.iconUrl" alt="" />
						<span v-else class="app-wot-icon text-xl" :class="`wd-icon-${item.icon}`" />
					</div>
					<span class="w-full truncate text-center text-xs font-medium text-gray-700 dark:text-gray-300">{{ item.name }}</span>
				</div>
			</div>
		</div>

		<!-- 业务流程 -->
		<div class="mt-3 p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/80">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="m-0 text-base font-semibold text-gray-900 dark:text-gray-100">业务流程</h3>
				<span class="app-wot-icon wd-icon-arrow-right text-xl text-gray-400 dark:text-gray-500" />
			</div>
			<div class="space-y-3">
				<div
					v-for="flow in mockFlows"
					:key="flow.name"
					class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/60 last:border-b-0"
				>
					<div class="flex min-w-0 items-center gap-3">
						<div class="flex h-10 w-10 flex-none items-center justify-center rounded-full text-white" :class="flow.bg">
							<span class="app-wot-icon text-lg" :class="`wd-icon-${flow.icon}`" />
						</div>
						<div class="min-w-0">
							<div class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{{ flow.name }}</div>
							<div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ flow.desc }}</div>
						</div>
					</div>
					<span class="app-wot-icon wd-icon-arrow-right text-base text-gray-300 dark:text-gray-600 flex-none" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type options from './options';
import { computed } from 'vue';
import DecorationImg from '../../decoration-img.vue';
import '../../wot-icon-style.scss';

type OptionsType = ReturnType<typeof options>;
type RawRecord = Record<string, any>;

const props = defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
});

const DEFAULT_COLORS = ['#2563eb', '#d97706', '#4f46e5', '#15803d'];

const mockFlows = [
	{ name: '请假申请', desc: '年假 · 病假 · 调休', icon: 'calendar', bg: 'bg-blue-500' },
	{ name: '费用报销', desc: '差旅 · 餐饮 · 办公', icon: 'wallet', bg: 'bg-orange-500' },
	{ name: '合同审批', desc: '新签 · 续签 · 终止', icon: 'seal', bg: 'bg-purple-500' },
	{ name: '采购申请', desc: '物料 · 设备 · 服务', icon: 'cart', bg: 'bg-green-500' },
	{ name: '项目立项', desc: '内部 · 外包 · 联合', icon: 'flag', bg: 'bg-cyan-500' },
];

const isImageIcon = (icon = '') => {
	return /^(?:https?:|data:|blob:|file:|\/|static\/)|\.(?:png|jpe?g|gif|webp|svg)$/i.test(icon);
};

const normalizeHexColor = (color = '') => (/^#[0-9a-f]{6}$/i.test(color) ? color : DEFAULT_COLORS[0]);

const hexToRgba = (color: string, alpha: number) => {
	const hex = normalizeHexColor(color).slice(1);
	const value = Number.parseInt(hex, 16);
	const r = (value >> 16) & 255;
	const g = (value >> 8) & 255;
	const b = value & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const shortcutIconStyle = (item: { color: string }) => {
	const color = normalizeHexColor(item.color);
	return {
		color,
		backgroundColor: hexToRgba(color, 0.1),
		borderColor: hexToRgba(color, 0.18),
		boxShadow: `0 5px 12px ${hexToRgba(color, 0.08)}`,
	};
};

const shortcutItems = computed(() => {
	const data = Array.isArray(props.content?.data) ? props.content.data : [];
	return data
		.filter((item): item is RawRecord => item && typeof item === 'object')
		.map((item, index) => {
			const icon = item.icon || 'apps';
			return {
				name: item.name || item.title || item.text || item.label || '功能名称',
				icon,
				iconUrl: isImageIcon(icon) ? icon : '',
				color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
			};
		});
});
</script>
