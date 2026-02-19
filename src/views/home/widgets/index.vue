<!--
	基于 SCUI 重构适配 vite 加载和适配相关业务页面。https://gitee.com/lolicode/scui/tree/master/src/views/home
 -->
<template>
	<div>
		<div :class="['widgets-home', customizing ? 'customizing' : '']" ref="main">
			<div class="widgets-content">
				<div class="widgets-top">
					<div class="flex justify-end custom_btn">
						<el-button v-if="customizing" type="primary" round @click="save">{{ t('home.widgets.done') }}</el-button>
						<el-button v-else type="primary" round @click="custom">{{ t('home.widgets.customize') }}</el-button>
					</div>
				</div>
				<div class="widgets" ref="widgets">
					<div class="widgets-wrapper">
						<div v-if="nowCompsList.length <= 0" class="p-5 text-center no-widgets">
							<el-empty :description="t('home.widgets.emptyDashboard')" :image-size="200"></el-empty>
						</div>
						<el-row :gutter="2">
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
									class="draggable-box"
								>
									<template #item="{ element }">
										<div class="widgets-item">
											<component :is="allComps[element as keyof typeof allComps]"></component>
											<div v-if="customizing" class="customize-overlay">
												<el-button class="close" type="danger" plain icon="Close" size="small" @click="remove(element)"></el-button>
												<label v-if="allComps[element as keyof typeof allComps]">
													<el-icon v-if="allComps[element as keyof typeof allComps].icon">
														<component :is="allComps[element as keyof typeof allComps].icon" />
													</el-icon>
													{{ allComps[element as keyof typeof allComps].title }}
												</label>
											</div>
										</div>
									</template>
								</draggable>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>
			<div v-if="customizing" class="widgets-aside">
				<el-container>
					<el-header>
						<div class="widgets-aside-title">{{ t('home.widgets.addWidget') }}</div>
						<div class="widgets-aside-close" @click="close()">
							<el-icon><Close /></el-icon>
						</div>
					</el-header>
					<el-header style="height: auto">
						<div class="p-3 selectLayout">
							<div class="selectLayout-item item01" :class="{ active: grid.layout.join(',') === '12,6,6' }" @click="setLayout([12, 6, 6])">
								<el-row :gutter="2">
									<el-col :span="7"><span></span></el-col>
									<el-col :span="7"><span></span></el-col>
									<el-col :span="10"><span></span></el-col>
								</el-row>
							</div>
							<div class="selectLayout-item item02" :class="{ active: grid.layout.join(',') === '24,16,8' }" @click="setLayout([24, 16, 8])">
								<el-row :gutter="2">
									<el-col :span="24"><span></span></el-col>
									<el-col :span="16"><span></span></el-col>
									<el-col :span="8"><span></span></el-col>
								</el-row>
							</div>
							<div class="selectLayout-item item03" :class="{ active: grid.layout.join(',') === '24' }" @click="setLayout([24])">
								<el-row :gutter="2">
									<el-col :span="24"><span></span></el-col>
									<el-col :span="24"><span></span></el-col>
									<el-col :span="24"><span></span></el-col>
								</el-row>
							</div>
						</div>
					</el-header>
					<el-main class="nopadding">
						<div class="widgets-list">
							<div v-if="myCompsList.length <= 0" class="p-5 text-center widgets-list-nodata">
								<el-empty :description="t('home.widgets.allAdded')" :image-size="100"></el-empty>
							</div>
							<div v-for="item in myCompsList" :key="item.title" class="widgets-list-item">
								<div class="item-logo">
									<el-icon>
										<component :is="item.icon" />
									</el-icon>
								</div>
								<div class="item-info">
									<h2>{{ item.title }}</h2>
									<p>{{ item.description }}</p>
								</div>
								<div class="item-actions">
									<el-button type="primary" icon="el-icon-plus" size="small" @click="push(item)"></el-button>
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

interface WidgetComponent {
	title: string;
	icon: Component | string;
	description: string;
	[key: string]: any;
}

interface WidgetListItem {
	key: string;
	title: string;
	icon: Component | string;
	description: string;
	disabled?: boolean;
}

const { t } = useI18n();

const defaultGrid = ref({
	layout: [7, 7, 10],
	copmsList: [
		['current-user', 'flow-data', 'audit-log', 'sys-log-line'],
		['news', 'sys-log', 'demo-chart1'],
		['calendar', 'favorite-menu', 'favorite-flow', 'demo-chart2'],
	],
});

const customizing = ref(false);
const widgets = ref();
const widgetsKey = ref('widgets');
const grid = ref(JSON.parse(JSON.stringify(defaultGrid.value)));

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

const nowCompsList = computed(() => grid.value.copmsList.flat());

const custom = (): void => {
	customizing.value = true;
};

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

const push = (item: WidgetListItem): void => {
	grid.value.copmsList[0].push(item.key);
};

const remove = (itemKey: string): void => {
	grid.value.copmsList = grid.value.copmsList.map((obj: string[]) => obj.filter((o: string) => o !== itemKey));
};

const save = (): void => {
	customizing.value = false;
	Local.set(widgetsKey.value, JSON.stringify(grid.value));
};

const backDefaul = (): void => {
	customizing.value = false;
	grid.value = defaultGrid.value;
	Local.remove(widgetsKey.value);
	window.location.reload();
};

const close = (): void => {
	customizing.value = false;
};

onMounted(() => {
	const data = useUserInfo().userInfos;
	widgetsKey.value = `${window.location.host}-${data.user.userId}-widgets`;
	const savedGrid = Local.get(widgetsKey.value);
	grid.value = savedGrid ? JSON.parse(savedGrid) : defaultGrid.value;
});
</script>
<style scoped lang="scss">
.custom_btn {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 9;
}

.widgets-home {
	display: flex;
	flex-direction: row;
	flex: 1;
	height: 100%;
}

.widgets-content {
	flex: 1;
	overflow: auto;
	overflow-x: hidden;
	padding: 3px;
}

.widgets-aside {
	width: 360px;
	background: var(--el-bg-color-overlay);
	border-left: 1px solid var(--el-border-color-lighter);
	border-radius: 12px;
	margin-bottom: 5px;
	min-height: 100px;
	position: relative;
	overflow: auto;
}

.widgets-aside-title {
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.widgets-aside-title i {
	margin-right: 10px;
	font-size: 18px;
}

.widgets-aside-close {
	font-size: 18px;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.15s ease;
}

.widgets-aside-close:hover {
	background: rgba(180, 180, 180, 0.1);
}

.widgets-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.widgets-top-title {
	font-size: 18px;
	font-weight: bold;
}

.widgets {
	transform-origin: top left;
	transition: transform 0.15s;
}

.draggable-box {
	height: 100%;
	width: 100%;
}

.customizing .widgets-wrapper {
	margin-right: -360px;
	width: 100%;
}

.customizing .widgets-wrapper .el-col {
	padding-bottom: 10px;
}

.customizing .widgets-wrapper .draggable-box {
	border: 1px dashed var(--el-color-primary);
	padding: 15px;
}

.customizing .widgets-wrapper .no-widgets {
	display: none;
}

.widgets-item {
	background: var(--el-bg-color-overlay);
	border: 1px solid var(--el-border-color-lighter);
	border-radius: 12px;
	margin-bottom: 2px;
	min-height: 100px;
	position: relative;
	transition: box-shadow 0.2s ease, border-color 0.2s ease;

	&:hover {
		border-color: var(--el-border-color-light);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}
}

.widgets-item > :deep(div) {
	border-radius: 12px;
}

/* Ensure components inside widgets-item are not creating extra margins or borders if not needed */
.widgets-item > :deep(.el-card) {
	border: none !important;
	box-shadow: none !important;
}

.customize-overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.9);
	cursor: move;
}

.customize-overlay label {
	background: var(--el-color-primary);
	color: #fff;
	height: 40px;
	padding: 0 30px;
	border-radius: 40px;
	font-size: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: move;
}

.customize-overlay label i {
	margin-right: 15px;
	font-size: 24px;
}

.customize-overlay .close {
	position: absolute;
	top: 15px;
	left: 15px;
}

.widgets-list-item {
	display: flex;
	flex-direction: row;
	padding: 15px;
	align-items: center;
}

.widgets-list-item .item-logo {
	width: 40px;
	height: 40px;
	border-radius: 10px;
	background: rgba(180, 180, 180, 0.08);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	margin-right: 15px;
	color: var(--el-color-primary);
}

.widgets-list-item .item-info {
	flex: 1;
}

.widgets-list-item .item-info h2 {
	font-size: 15px;
	font-weight: 500;
	cursor: default;
}

.widgets-list-item .item-info p {
	font-size: 12px;
	color: #999;
	cursor: default;
}

.widgets-list-item:hover {
	background: rgba(180, 180, 180, 0.06);
	border-radius: 8px;
}

.widgets-wrapper .sortable-ghost {
	opacity: 0.5;
}

.selectLayout {
	width: 100%;
	display: flex;
}

.selectLayout-item {
	width: 60px;
	height: 60px;
	border: 2px solid var(--el-border-color-lighter);
	padding: 5px;
	cursor: pointer;
	margin-right: 15px;
	border-radius: 8px;
	transition: border-color 0.15s ease;
}

.selectLayout-item span {
	display: block;
	background: var(--el-border-color-lighter);
	height: 46px;
	border-radius: 3px;
}

.selectLayout-item.item02 span {
	height: 30px;
}

.selectLayout-item.item02 .el-col:nth-child(1) span {
	height: 14px;
	margin-bottom: 2px;
}

.selectLayout-item.item03 span {
	height: 14px;
	margin-bottom: 2px;
}

.selectLayout-item:hover {
	border-color: var(--el-color-primary);
}

.selectLayout-item.active {
	border-color: var(--el-color-primary);
}

.selectLayout-item.active span {
	background: var(--el-color-primary);
}

.dark {
	.widgets-aside {
		background: var(--el-bg-color-overlay);
		border-left-color: var(--el-border-color);
	}

	.customize-overlay {
		background: rgba(21, 32, 43, 0.9);
	}
}

@media (max-width: 992px) {
	.customizing .widgets {
		transform: scale(1) !important;
	}
	.customizing .widgets-aside {
		width: 100%;
		position: absolute;
		top: 50%;
		right: 0;
		bottom: 0;
	}
	.customizing .widgets-wrapper {
		margin-right: 0;
	}
}
</style>
