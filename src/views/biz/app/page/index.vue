<template>
	<div class="layout-padding decoration-pages min-w-[1100px]">
		<el-card shadow="never" class="!border-none flex-1 flex" :body-style="{ flex: 1 }">
			<div class="flex items-start h-full">
				<Menu v-model="activeMenu" :menus="menus" />
				<preview v-model="selectWidgetIndex" :pageData="getPageData">
					<template #footer>
						<div class="flex justify-center mt-4">
							<el-button type="primary" @click="setData">保存</el-button>
						</div>
					</template>
				</preview>
				<attr-setting class="flex-1" :widget="getSelectWidget" />
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="decorationPages">
import Menu from './component/pages/menu.vue';
import Preview from './component/pages/preview.vue';
import AttrSetting from './component/pages/attr-setting.vue';
import widgets from './component/widgets';
import { getObj, putObj } from '/@/api/app/page';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
enum pagesTypeEnum {
	HOME = '1',
	USER = '2',
	SERVICE = '3',
}

const generatePageData = (widgetNames: string[]) => {
	return widgetNames.map((widgetName) => {
		const options = {
			id: other.getNonDuplicateID(),
			...(widgets[widgetName]?.options() || {}),
		};
		return options;
	});
};

const menus: Record<
	string,
	{
		id: number;
		name: string;
		pageData: any[];
	}
> = reactive({
	[pagesTypeEnum.HOME]: {
		id: 1,
		pageType: 1,
		name: '首页装修',
		pageData: generatePageData(['search', 'banner', 'nav', 'news']),
	},
	[pagesTypeEnum.USER]: {
		id: 2,
		pageType: 2,
		name: '个人中心',
		pageData: generatePageData(['user-info', 'my-service', 'user-banner']),
	},
	[pagesTypeEnum.SERVICE]: {
		id: 3,
		pageType: 3,
		name: '客服设置',
		pageData: generatePageData(['customer-service']),
	},
});

const activeMenu = ref('1');
const selectWidgetIndex = ref(-1);
const getPageData = computed(() => {
	return menus[activeMenu.value]?.pageData ?? [];
});
const getSelectWidget = computed(() => {
	return menus[activeMenu.value]?.pageData[selectWidgetIndex.value] ?? '';
});

const getData = async () => {
	const { data } = await getObj(activeMenu.value);
	menus[String(data.id)].pageData = JSON.parse(data.pageData);
};

const setData = async () => {
	await putObj({
		...menus[activeMenu.value],
		pageData: JSON.stringify(menus[activeMenu.value].pageData),
	});
	getData();
	useMessage().success('保存成功');
};
watch(
	activeMenu,
	() => {
		selectWidgetIndex.value = getPageData.value.findIndex((item) => !item.disabled);
		getData();
	},
	{
		immediate: true,
	}
);
</script>
<style lang="scss" scoped>
.decoration-pages {
	min-height: calc(100vh - var(--navbar-height) - 80px);
	@apply flex flex-col;
}

.el-menu {
	width: 15% !important;
}
</style>
