<template>
	<div class="layout-padding min-w-[1100px] h-[calc(100vh-var(--navbar-height)-80px)] flex flex-col overflow-x-hidden">
		<el-card shadow="never" class="!border-none flex-1 flex" :body-style="{ flex: 1 }">
			<div class="flex items-stretch h-full gap-4 w-full min-w-0">
				<Menu v-model="activeMenu" :menus="menus" class="!w-[15%] flex-shrink-0 h-full" />
				<Preview
					v-model="selectWidgetIndex"
					:pageData="getPageData"
					:tabbarList="tabbarList"
					:selectedTabbarIndex="selectedTabbarIndex"
					class="flex-shrink-0 h-full"
					@select-widget="handleSelectWidget"
					@select-tabbar="handleSelectTabbar"
				>
					<template #footer>
						<div class="flex justify-center mt-4">
							<el-button type="primary" @click="setData">保存</el-button>
						</div>
					</template>
				</Preview>
				<AttrSetting v-if="selectedTarget === 'widget'" class="flex-1 min-w-0 h-full" :widget="getSelectWidget" />
				<TabbarSetting v-else v-model="tabbarList" class="flex-1 min-w-0 h-full" @saved="getData" />
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="decorationPages">
import Menu from './component/pages/menu.vue';
import Preview from './component/pages/preview.vue';
import AttrSetting from './component/pages/attr-setting.vue';
import TabbarSetting from './component/tabbar-setting.vue';
import widgets from './component/widgets';
import { getObj, putObj } from '/@/api/app/page';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
enum pagesTypeEnum {
	HOME = '1',
	USER = '2',
	SERVICE = '3',
	WORKBENCH = '4',
}

const generatePageData = (widgetNames: string[]) => {
	return widgetNames.map((widgetName) => ({
		id: other.getNonDuplicateID(),
		...(widgets[widgetName]?.options() || {}),
	}));
};

const menus: Record<
	string,
	{
		pageType: number;
		name: string;
		pageData: any[];
	}
> = reactive({
	[pagesTypeEnum.HOME]: {
		pageType: 1,
		name: '首页装修',
		pageData: generatePageData(['search', 'banner', 'nav', 'news']),
	},
	[pagesTypeEnum.USER]: {
		pageType: 2,
		name: '个人中心',
		pageData: generatePageData(['user-info', 'my-service', 'user-banner']),
	},
	[pagesTypeEnum.SERVICE]: {
		pageType: 3,
		name: '客服设置',
		pageData: generatePageData(['customer-service']),
	},
	[pagesTypeEnum.WORKBENCH]: {
		pageType: 4,
		name: '工作台',
		pageData: generatePageData(['workbench-shortcuts']),
	},
});

type SelectedTarget = 'widget' | 'tabbar';
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

interface AppDecorateData {
	pageType?: number;
	pageData?: string;
	tabbar?: TabbarItem[];
}

const WORKBENCH_SHORTCUT_COLORS = ['#0045d3', '#ea580c', '#2563eb', '#16a34a'];

const activeMenu = ref('1');
const selectWidgetIndex = ref(-1);
const selectedTarget = ref<SelectedTarget>('widget');
const selectedTabbarIndex = ref(0);
const tabbarList = ref<TabbarItem[]>([]);
const pageLoadFailed = ref(false);
let pageLoadSeq = 0;
const getPageData = computed(() => {
	return menus[activeMenu.value]?.pageData ?? [];
});
const getSelectWidget = computed(() => {
	return menus[activeMenu.value]?.pageData[selectWidgetIndex.value] ?? '';
});
const resetSelectWidgetIndex = () => {
	selectWidgetIndex.value = getPageData.value.findIndex((item) => !item.disabled);
};

const parseLink = (link: TabbarItem['link']) => {
	if (!link) return {};
	if (typeof link !== 'string') return link;
	try {
		return JSON.parse(link);
	} catch {
		return link;
	}
};

const normalizeTabbarItem = (item: TabbarItem): TabbarItem => ({
	...item,
	link: parseLink(item.link),
	loginFlag: item.loginFlag ?? (item.id === 1 || item.name === '首页' ? '0' : '1'),
});

const clampSelectedTabbarIndex = () => {
	const lastIndex = tabbarList.value.length - 1;
	if (lastIndex < 0) {
		selectedTabbarIndex.value = 0;
		return;
	}
	selectedTabbarIndex.value = Math.min(Math.max(selectedTabbarIndex.value, 0), lastIndex);
};

const applyTabbarData = (data?: TabbarItem[]) => {
	if (!Array.isArray(data)) {
		return;
	}
	tabbarList.value = data.map(normalizeTabbarItem);
	clampSelectedTabbarIndex();
};

const normalizeWorkbenchItem = (item: Record<string, any>, index: number) => ({
	...item,
	icon: item.icon || 'apps',
	name: item.name || item.title || item.text || item.label || '功能名称',
	link: item.link || {},
	color: item.color || WORKBENCH_SHORTCUT_COLORS[index % WORKBENCH_SHORTCUT_COLORS.length],
});

const normalizeWorkbenchPageData = (pageData: any[]) => {
	const shortcutWidget = pageData.find((item) => item?.name === 'workbench-shortcuts');
	const legacyNavWidget = pageData.find((item) => item?.name === 'nav');
	const sourceWidget = shortcutWidget || legacyNavWidget;
	const sourceData = Array.isArray(sourceWidget?.content?.data) ? sourceWidget.content.data : [];
	const normalizedShortcut = generatePageData(['workbench-shortcuts'])[0];

	normalizedShortcut.content = {
		...normalizedShortcut.content,
		...(shortcutWidget?.content || {}),
		enabled: shortcutWidget?.content?.enabled ?? legacyNavWidget?.content?.enabled ?? 1,
		data: sourceData.filter((item) => item && typeof item === 'object').map(normalizeWorkbenchItem),
	};

	return [normalizedShortcut];
};

const normalizeHomePageData = (pageData: any[]) => {
	const normalizedPageData = [...pageData];
	const existingWidgetNames = new Set(normalizedPageData.map((item) => item?.name));

	generatePageData(['news']).forEach((widget) => {
		if (!existingWidgetNames.has(widget.name)) {
			normalizedPageData.push(widget);
		}
	});

	return normalizedPageData;
};

const normalizePageData = (pageType: string, pageData: any[]) => {
	if (pageType === pagesTypeEnum.HOME) {
		return normalizeHomePageData(pageData);
	}

	if (pageType === pagesTypeEnum.WORKBENCH) {
		return normalizeWorkbenchPageData(pageData);
	}

	return pageData;
};

const getData = async () => {
	let data: AppDecorateData | undefined;
	const requestId = ++pageLoadSeq;
	const requestedPageType = activeMenu.value;
	pageLoadFailed.value = true;
	try {
		({ data } = await getObj(requestedPageType));
	} catch {
		if (requestId !== pageLoadSeq || requestedPageType !== activeMenu.value) return;
		pageLoadFailed.value = true;
		useMessage().error('页面数据获取失败');
		return;
	}

	if (requestId !== pageLoadSeq || requestedPageType !== activeMenu.value) return;
	applyTabbarData(data?.tabbar);

	if (!data?.pageType || String(data.pageType) !== requestedPageType || !data.pageData || !menus[requestedPageType]) {
		useMessage().error('页面数据格式异常');
		return;
	}

	try {
		const pageData = JSON.parse(data.pageData);
		if (Array.isArray(pageData) && pageData.length > 0) {
			if (requestId !== pageLoadSeq || requestedPageType !== activeMenu.value) return;
			menus[requestedPageType].pageData = normalizePageData(requestedPageType, pageData);
			resetSelectWidgetIndex();
			pageLoadFailed.value = false;
			return;
		}
		if (requestId !== pageLoadSeq || requestedPageType !== activeMenu.value) return;
		useMessage().error('页面数据格式异常');
	} catch {
		if (requestId !== pageLoadSeq || requestedPageType !== activeMenu.value) return;
		useMessage().error('页面数据格式异常');
	}
};

const setData = async () => {
	if (pageLoadFailed.value) {
		useMessage().error('页面数据未加载成功，请刷新后重试');
		return;
	}

	try {
		await putObj({
			...menus[activeMenu.value],
			pageData: JSON.stringify(menus[activeMenu.value].pageData),
		});
		await getData();
		useMessage().success('保存成功');
	} catch {
		useMessage().error('保存失败');
	}
};

const handleSelectWidget = (index: number) => {
	selectedTarget.value = 'widget';
	selectWidgetIndex.value = index;
};

const handleSelectTabbar = (index: number) => {
	selectedTarget.value = 'tabbar';
	selectedTabbarIndex.value = index;
};

watch(
	activeMenu,
	() => {
		selectedTarget.value = 'widget';
		resetSelectWidgetIndex();
		getData();
	},
	{
		immediate: true,
	}
);
</script>
