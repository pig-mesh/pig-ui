<script lang="ts" setup>
import { computed, defineAsyncComponent, nextTick, ref, shallowRef, toRaw, watch } from 'vue';
import type { PropType } from 'vue';
import { Check, Plus } from '@element-plus/icons-vue';
import Draggable from 'vuedraggable';
import { putObj } from '/@/api/app/tabbar';
import { useMessage } from '/@/hooks/message';
import WotIconPicker from './WotIconPicker.vue';

const LinkPicker = defineAsyncComponent(() => import('/@/components/Link/picker.vue'));

interface TabbarItem {
	id?: number;
	localKey?: string;
	name: string;
	selected: string;
	unselected: string;
	link: Record<string, any> | string;
	sortOrder?: number;
	loginFlag?: string;
}

const props = defineProps({
	modelValue: {
		type: Array as PropType<TabbarItem[]>,
		default: () => [],
	},
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: TabbarItem[]): void;
	(e: 'saved'): void;
}>();

const max = 5;
const min = 2;
const tabbarList = ref<TabbarItem[]>([]);
const syncingFromParent = ref(false);
const invalidLinkIndexes = shallowRef<number[]>([]);

const message = useMessage();

const createLocalKey = () => `tabbar-${Date.now()}-${Math.random()}`;

const defaultIconPairs = [
	{ selected: 'home-fill', unselected: 'home' },
	{ selected: 'book', unselected: 'book' },
	{ selected: 'user', unselected: 'user' },
];

const getDefaultIconPair = (item?: Partial<TabbarItem>, index = 0) => {
	if (item?.name === '首页') return defaultIconPairs[0];
	if (item?.name === '资讯') return defaultIconPairs[1];
	if (item?.name === '我的') return defaultIconPairs[2];
	return defaultIconPairs[index] || { selected: 'apps', unselected: 'apps' };
};

const createEmptyItem = (): TabbarItem => ({
	localKey: createLocalKey(),
	name: '',
	selected: 'apps',
	unselected: 'apps',
	link: {},
	loginFlag: '1',
});

const isValidLinkObject = (link: unknown) => {
	if (typeof link !== 'object' || link === null || Array.isArray(link)) {
		return false;
	}

	return Object.keys(link).length === 0 || 'type' in link;
};

const parseStringLink = (link: string) => {
	try {
		const parsedLink = JSON.parse(link);
		return isValidLinkObject(parsedLink) ? parsedLink : link;
	} catch {
		return link;
	}
};

const isInvalidLink = (link: TabbarItem['link']) => {
	const rawLink = toRaw(link);
	if (typeof rawLink === 'string') {
		if (!rawLink.trim()) {
			return false;
		}

		return typeof parseStringLink(rawLink) === 'string';
	}

	return !isValidLinkObject(rawLink);
};

const getInvalidLinkIndexes = (list: TabbarItem[]) =>
	list.reduce<number[]>((indexes, item, index) => {
		if (isInvalidLink(item.link)) {
			indexes.push(index);
		}
		return indexes;
	}, []);

const parseLink = (link: TabbarItem['link']) => {
	if (typeof link !== 'string') {
		return link === undefined ? {} : link;
	}

	if (!link.trim()) {
		return {};
	}

	return parseStringLink(link);
};

const cloneLink = (link: TabbarItem['link']) => {
	const rawLink = toRaw(link);
	if (typeof rawLink !== 'object' || rawLink === null) {
		return rawLink;
	}

	return JSON.parse(JSON.stringify(rawLink));
};

const toPlainItem = (item: TabbarItem): TabbarItem => ({
	...toRaw(item),
	link: cloneLink(item.link),
});

const normalizeItem = (item: TabbarItem, index = 0): TabbarItem => {
	const defaultIconPair = getDefaultIconPair(item, index);
	return {
		...item,
		name: item.name || '',
		selected: item.selected || defaultIconPair.selected,
		unselected: item.unselected || defaultIconPair.unselected,
		link: parseLink(item.link),
		loginFlag: item.loginFlag ?? (item.id === 1 || item.name === '首页' ? '0' : '1'),
		localKey: item.localKey || createLocalKey(),
	};
};

const getDragItemKey = (item: TabbarItem) => {
	if (!item.localKey) {
		item.localKey = createLocalKey();
	}

	return item.id || item.localKey || createLocalKey();
};

const currentCount = computed(() => tabbarList.value.length);

watch(
	() => props.modelValue,
	async (value) => {
		syncingFromParent.value = true;
		const normalizedList = (value || []).map((item, index) => normalizeItem(item, index));
		while (normalizedList.length < min) {
			normalizedList.push(createEmptyItem());
		}
		invalidLinkIndexes.value = getInvalidLinkIndexes(normalizedList);
		tabbarList.value = normalizedList;
		await nextTick();
		syncingFromParent.value = false;
	},
	{
		immediate: true,
		deep: true,
	}
);

watch(
	tabbarList,
	(value) => {
		if (syncingFromParent.value) {
			return;
		}
		invalidLinkIndexes.value = getInvalidLinkIndexes(value);
		emit('update:modelValue', value.map(toPlainItem));
	},
	{
		deep: true,
	}
);

const handleAdd = () => {
	if (tabbarList.value.length >= max) {
		message.error(`最多添加${max}个`);
		return;
	}

	tabbarList.value.push(createEmptyItem());
};

const handleDelete = (index: number) => {
	if (index === 0) {
		message.error('首页导航不可删除');
		return;
	}

	if (tabbarList.value.length <= min) {
		message.error(`最少保留${min}个`);
		return;
	}

	tabbarList.value.splice(index, 1);
};

const onMove = (e: any) => {
	return e.relatedContext.index !== 0;
};

const setData = async () => {
	if (tabbarList.value.length < min) {
		message.error(`最少保留${min}个`);
		return;
	}

	if (tabbarList.value.length > max) {
		message.error(`最多添加${max}个`);
		return;
	}

	invalidLinkIndexes.value = getInvalidLinkIndexes(tabbarList.value);
	if (invalidLinkIndexes.value.length > 0) {
		message.error('链接地址数据异常，请重新选择链接后保存');
		return;
	}

	try {
		const data = toRaw(tabbarList.value).map((item, index) => ({
			...(item.id && { id: item.id }),
			name: item.name,
			selected: item.selected,
			unselected: item.unselected,
			link: JSON.stringify(parseLink(item.link)),
			sortOrder: index,
			loginFlag: item.loginFlag ?? '1',
		}));

		await putObj(data);
		message.success('保存成功');
		emit('saved');
	} catch {
		message.error('保存失败');
	}
};
</script>

<template>
	<div
		class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full min-w-0"
	>
		<div
			class="flex-shrink-0 flex items-center px-5 py-4 text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800"
		>
			<div class="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-primary/10 dark:bg-primary/20 flex-shrink-0">
				<el-icon class="text-primary text-lg">
					<Setting />
				</el-icon>
			</div>

			<div class="flex-1 min-w-0">
				<div class="truncate">底部导航设置</div>
				<div class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">配置应用底部导航栏</div>
			</div>
		</div>

		<div class="flex-1 min-h-0 overflow-y-auto p-4 overflow-x-hidden w-full">
			<el-form class="w-full">
				<Draggable
					v-model="tabbarList"
					class="space-y-3 mb-4"
					animation="300"
					draggable=".draggable"
					:item-key="getDragItemKey"
					:move="onMove"
					handle=".drag-handle"
				>
					<template #item="{ element, index }">
						<del-wrap @close="handleDelete(index)" class="w-full" :class="{ draggable: index !== 0 }" :show-close="index !== 0">
							<div
								class="group relative w-full rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-primary/50"
							>
								<div
									v-if="index !== 0"
									class="drag-handle absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-40 transition-opacity group-hover:opacity-100"
								>
									<el-icon class="text-gray-400 dark:text-gray-500">
										<DCaret />
									</el-icon>
								</div>

								<div class="mb-2.5 flex items-center gap-2" :class="index !== 0 ? 'pl-5' : ''">
									<div class="flex min-w-0 flex-1 items-center gap-2">
										<span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold leading-5 text-white">
											{{ index + 1 }}
										</span>
										<span class="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{{ element.name || '未命名导航' }}</span>
										<span v-if="index === 0" class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">首页</span>
									</div>

									<div class="flex flex-shrink-0 items-center gap-2">
										<span class="text-xs font-medium text-gray-500 dark:text-gray-400">登录可见</span>
										<el-radio-group v-model="element.loginFlag" size="small">
											<el-radio-button value="0">公开</el-radio-button>
											<el-radio-button value="1">需登录</el-radio-button>
										</el-radio-group>
									</div>
								</div>

								<div class="space-y-3" :class="index !== 0 ? 'pl-5' : ''">
									<div class="grid grid-cols-[minmax(150px,190px)_minmax(0,1fr)] gap-3">
										<div class="min-w-0">
											<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
												<el-icon class="mr-1">
													<Edit />
												</el-icon>
												导航名称
											</div>
											<el-input v-model="element.name" placeholder="请输入导航名称" clearable maxlength="4" show-word-limit class="!w-full" />
										</div>

										<div class="min-w-0">
											<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
												<el-icon class="mr-1">
													<Link />
												</el-icon>
												链接地址
											</div>
											<LinkPicker v-model="element.link" :disabled="index === 0" class="!w-full" />
											<div v-if="index === 0" class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
												<el-icon class="mr-1"><Lock /></el-icon>
												首页链接不可修改
											</div>
										</div>
									</div>

									<div class="grid grid-cols-2 items-end gap-3">
										<div class="min-w-0">
											<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
												<el-icon class="mr-1"><Picture /></el-icon>
												未选图标
											</div>
											<WotIconPicker v-model="element.unselected" compact />
										</div>

										<div class="min-w-0">
											<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
												<el-icon class="mr-1"><Picture /></el-icon>
												选中图标
											</div>
											<WotIconPicker v-model="element.selected" compact />
										</div>
									</div>
								</div>
							</div>
						</del-wrap>
					</template>
				</Draggable>
			</el-form>
		</div>

		<div class="flex-shrink-0 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-3">
				<el-button type="primary" @click="setData" class="!px-6 !py-2 !rounded-lg" :icon="Check">保存导航</el-button>
				<el-button v-if="currentCount < max" type="primary" plain @click="handleAdd" class="!px-6 !py-2 !rounded-lg" :icon="Plus">添加导航</el-button>
				<div class="ml-auto text-sm text-gray-500 dark:text-gray-400">
					已添加 <span class="font-semibold text-primary">{{ currentCount }}</span> / {{ max }} 个
				</div>
			</div>

			<el-alert v-if="currentCount >= max" type="warning" :closable="false" class="!rounded-lg !mt-3">
				<template #title>
					<span class="text-sm">已达到导航数量上限（{{ max }} 个）</span>
				</template>
			</el-alert>
		</div>
	</div>
</template>
