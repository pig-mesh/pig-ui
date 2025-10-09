<!--
	基于 SCUI 重构适配 vite 加载和适配相关业务页面。https://gitee.com/lolicode/scui/tree/master/src/views/home
 -->
<template>
	<div>
		<div :class="['flex flex-row flex-1 h-full', customizing ? 'lg:mr-[-360px] lg:w-full' : '']" ref="main">
			<div class="flex-1 overflow-auto overflow-x-hidden p-[5px]">
				<div class="flex justify-between items-center">
					<div class="flex justify-end absolute top-[10px] right-[10px] z-[9]">
						<el-button v-if="customizing" type="primary" round @click="save">{{ t('home.widgets.done') }}</el-button>
						<el-button v-else type="primary" round @click="custom">{{ t('home.widgets.customize') }}</el-button>
					</div>
				</div>
				<div :class="['origin-top-left transition-transform duration-150', customizing ? 'lg:pb-[10px] max-lg:scale-100' : '']" ref="widgets">
					<div class="widgets-wrapper">
						<div v-if="nowCompsList.length <= 0" :class="['p-5 text-center', customizing ? 'lg:hidden' : '']">
							<el-empty :description="t('home.widgets.emptyDashboard')" :image-size="200"></el-empty>
						</div>
						<el-row :gutter="0">
							<el-col v-for="(item, index) in grid.layout" v-bind:key="index" :md="item" :xs="24">
								<draggable
									v-model="grid.copmsList[index]"
									animation="200"
									handle=".customize-overlay"
									group="people"
									item-key="com"
									dragClass="aaaaa"
									force-fallback
									fallbackOnBody
									class="h-full w-full"
								>
									<template #item="{ element }">
										<div class="bg-[var(--el-bg-color-overlay)] border border-[var(--el-border-color-light)] shadow-sm rounded-lg mb-0 min-h-[100px] relative widgets-item">
											<component :is="allComps[element as keyof typeof allComps]"></component>
											<template v-if="customizing">
												<div class="absolute inset-0 z-[1] flex flex-col items-center justify-center cursor-move bg-[var(--el-bg-color)]/90">
													<el-button class="!absolute top-[15px] left-[15px]" type="danger" plain icon="Close" size="small" @click="remove(element)"></el-button>
													<template v-if="allComps[element as keyof typeof allComps]">
														<label class="bg-[var(--el-color-primary)] text-white h-10 px-[30px] rounded-[40px] text-lg flex items-center justify-center cursor-move">
															<el-icon v-if="(allComps[element as keyof typeof allComps] as any).icon" class="mr-[15px] text-2xl">
																<component :is="(allComps[element as keyof typeof allComps] as any).icon" />
															</el-icon>
															{{ (allComps[element as keyof typeof allComps] as any).title }}
														</label>
													</template>
												</div>
											</template>
										</div>
									</template>
								</draggable>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>
			<div v-if="customizing" class="w-[360px] max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-50 bg-[var(--el-bg-color)] shadow-sm rounded-lg mb-[5px] min-h-[100px] relative overflow-auto">
				<el-container>
					<el-header>
						<div class="text-sm flex items-center justify-center">{{ t('home.widgets.addWidget') }}</div>
						<div class="text-lg w-[30px] h-[30px] flex items-center justify-center rounded cursor-pointer hover:bg-black/10" @click="close()">
							<el-icon><Close /></el-icon>
						</div>
					</el-header>
					<el-header style="height: auto">
						<div class="p-3 w-full flex">
							<div
								class="w-[60px] h-[60px] border-2 p-[5px] cursor-pointer mr-[15px] transition-colors duration-200"
								:class="[
									grid.layout.join(',') === '12,6,6'
										? 'border-[var(--el-color-primary)]'
										: 'border-[var(--el-border-color-light)] hover:border-[var(--el-color-primary)]'
								]"
								@click="setLayout([12, 6, 6])"
							>
								<el-row :gutter="2">
									<el-col :span="7">
										<span
											class="block h-[46px]"
											:class="grid.layout.join(',') === '12,6,6' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
									<el-col :span="7">
										<span
											class="block h-[46px]"
											:class="grid.layout.join(',') === '12,6,6' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
									<el-col :span="10">
										<span
											class="block h-[46px]"
											:class="grid.layout.join(',') === '12,6,6' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
								</el-row>
							</div>
							<div
								class="w-[60px] h-[60px] border-2 p-[5px] cursor-pointer mr-[15px] transition-colors duration-200"
								:class="[
									grid.layout.join(',') === '24,16,8'
										? 'border-[var(--el-color-primary)]'
										: 'border-[var(--el-border-color-light)] hover:border-[var(--el-color-primary)]'
								]"
								@click="setLayout([24, 16, 8])"
							>
								<el-row :gutter="2">
									<el-col :span="24">
										<span
											class="block h-[14px] mb-[2px]"
											:class="grid.layout.join(',') === '24,16,8' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
									<el-col :span="16">
										<span
											class="block h-[30px]"
											:class="grid.layout.join(',') === '24,16,8' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
									<el-col :span="8">
										<span
											class="block h-[30px]"
											:class="grid.layout.join(',') === '24,16,8' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
								</el-row>
							</div>
							<div
								class="w-[60px] h-[60px] border-2 p-[5px] cursor-pointer mr-[15px] transition-colors duration-200"
								:class="[
									grid.layout.join(',') === '24'
										? 'border-[var(--el-color-primary)]'
										: 'border-[var(--el-border-color-light)] hover:border-[var(--el-color-primary)]'
								]"
								@click="setLayout([24])"
							>
								<el-row :gutter="2">
									<el-col :span="24">
										<span
											class="block h-[14px] mb-[2px]"
											:class="grid.layout.join(',') === '24' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
									<el-col :span="24">
										<span
											class="block h-[14px] mb-[2px]"
											:class="grid.layout.join(',') === '24' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
									<el-col :span="24">
										<span
											class="block h-[14px] mb-[2px]"
											:class="grid.layout.join(',') === '24' ? 'bg-[var(--el-color-primary)]' : 'bg-[var(--el-border-color-light)]'"
										></span>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-header>
					<el-main class="nopadding">
						<div class="widgets-list">
							<div v-if="myCompsList.length <= 0" class="p-5 text-center widgets-list-nodata">
								<el-empty :description="t('home.widgets.allAdded')" :image-size="100"></el-empty>
							</div>
							<div v-for="item in myCompsList" :key="item.title" class="flex flex-row p-[15px] items-center hover:bg-black/10">
								<div class="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-lg mr-[15px] text-[#6a8bad]">
									<el-icon>
										<component :is="item.icon" />
									</el-icon>
								</div>
								<div class="flex-1">
									<h2 class="text-base font-normal cursor-default">{{ item.title }}</h2>
									<p class="text-xs text-[#999] cursor-default">{{ item.description }}</p>
								</div>
								<div class="item-actions">
									<el-button type="primary" icon="Plus" size="small" @click="push(item)"></el-button>
								</div>
							</div>
						</div>
					</el-main>
					<el-footer style="height: 51px">
						<el-button size="small" @click="backDefaul()">{{ t('home.widgets.resetDefault') }}</el-button>
					</el-footer>
				</el-container>
			</div>
		</div>
	</div>
</template>

<script lang="ts" name="widgets" setup>
import draggable from 'vuedraggable';
import allComps from './components/index';
import { Local } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

/**
 * 部件组件接口定义
 */
interface WidgetComponent {
	title: string;
	icon: Component | string;
	description: string;
	[key: string]: any;
}

/**
 * 部件列表项接口定义
 */
interface WidgetListItem {
	key: string;
	title: string;
	icon: Component | string;
	description: string;
	disabled?: boolean;
}

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 默认布局配置
 */
const defaultGrid = ref({
	layout: [7, 7, 10],
	copmsList: [
		['current-user', 'flow-data', 'audit-log', 'sys-log-line'],
		['news', 'sys-log', 'demo-chart1'],
		['calendar', 'favorite-menu', 'favorite-flow', 'demo-chart2'],
	],
});

/**
 * 是否处于自定义模式
 */
const customizing = ref(false);

/**
 * 部件容器元素引用
 */
const widgets = ref();

/**
 * 本地存储键名
 */
const widgetsKey = ref('widgets');

/**
 * 当前网格布局配置
 */
const grid = ref(JSON.parse(JSON.stringify(defaultGrid.value)));

/**
 * 所有可用部件列表（标记已添加的部件为禁用状态）
 */
const allCompsList = computed(() => {
	const list: WidgetListItem[] = [];
	for (const [key, compDetails] of Object.entries(allComps as Record<string, WidgetComponent>)) {
		list.push({ key, title: compDetails.title, icon: compDetails.icon, description: compDetails.description });
	}

	const myCopmsList = grid.value.copmsList.flat();
	list.forEach((comp: WidgetListItem) => {
		const existingItem = myCopmsList.find((item: string) => item === comp.key);
		comp.disabled = !!existingItem;
	});

	return list;
});

/**
 * 可添加的部件列表（未禁用且在支持列表中的部件）
 */
const myCompsList = computed(() => {
	const myGrid = [
		'calendar',
		'current-user',
		'news',
		'audit-log',
		'sys-log',
		'flow-data',
		'favorite-menu',
		'favorite-flow',
		'sys-log-line',
		'demo-chart1',
		'demo-chart2',
	];
	return allCompsList.value.filter((item: WidgetListItem) => !item.disabled && myGrid.includes(item.key));
});

/**
 * 当前已添加的部件列表
 */
const nowCompsList = computed(() => grid.value.copmsList.flat());

/**
 * 进入自定义模式
 */
const custom = (): void => {
	customizing.value = true;

	nextTick(() => {
		const oldWidth = widgets.value.offsetWidth;
		const scale = widgets.value.offsetWidth / oldWidth;
		widgets.value.style.transform = `scale(${scale})`;
	});
};

/**
 * 设置网格布局
 * @param layout - 布局配置数组
 */
const setLayout = (layout: Array<number>): void => {
	grid.value.layout = layout;
	if (layout.join(',') === '24') {
		if (grid.value.copmsList[1]) {
			grid.value.copmsList[0].push(...grid.value.copmsList[1]);
		}
		if (grid.value.copmsList[2]) {
			grid.value.copmsList[0].push(...grid.value.copmsList[2]);
		}
		grid.value.copmsList[1] = [];
		grid.value.copmsList[2] = [];
	}
};

/**
 * 添加部件到布局
 * @param item - 要添加的部件项
 */
const push = (item: WidgetListItem): void => {
	grid.value.copmsList[0].push(item.key);
};

/**
 * 从布局中移除部件
 * @param itemKey - 要移除的部件键名
 */
const remove = (itemKey: string): void => {
	grid.value.copmsList = grid.value.copmsList.map((obj: string[]) => obj.filter((o: string) => o !== itemKey));
};

/**
 * 保存布局配置到本地存储
 */
const save = (): void => {
	customizing.value = false;
	widgets.value.style.removeProperty('transform');
	Local.set(widgetsKey.value, JSON.stringify(grid.value));
};

/**
 * 恢复默认布局
 */
const backDefaul = (): void => {
	customizing.value = false;
	widgets.value.style.removeProperty('transform');
	grid.value = defaultGrid.value;
	Local.remove(widgetsKey.value);
	window.location.reload();
};

/**
 * 关闭自定义模式
 */
const close = (): void => {
	customizing.value = false;
	widgets.value.style.removeProperty('transform');
};

/**
 * 组件挂载时初始化布局
 */
onMounted(() => {
	const data = useUserInfo().userInfos;
	widgetsKey.value = `${window.location.host}-${data.user.userId}-widgets}`;
	const widgets = Local.get(widgetsKey.value);
	grid.value = widgets ? JSON.parse(widgets) : defaultGrid.value;
});
</script>

