<template>
	<el-drawer v-model="visible" :title="$t('sysrole.widget.drawerTitle', { name: roleName })" size="800px" destroy-on-close>
		<div class="flex h-full gap-4 p-4">
			<!-- 左侧：组件勾选列表 -->
			<div class="w-[260px] flex-shrink-0 border rounded-lg overflow-hidden flex flex-col">
				<div class="p-3 border-b">
					<div class="mb-2 text-sm font-medium text-gray-600">{{ $t('sysrole.widget.availableComponents') }}</div>
					<el-input v-model="searchKeyword" :placeholder="$t('sysrole.widget.searchPlaceholder')" clearable size="small" prefix-icon="Search" />
				</div>
				<div class="flex-1 overflow-auto">
				<div v-for="item in filteredCompsList" :key="item.key" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
					<el-checkbox v-model="item.checked" @change="onCheckChange" />
					<el-icon class="text-primary"><component :is="item.icon" /></el-icon>
					<div>
						<div class="text-sm font-medium">{{ item.title }}</div>
						<div class="text-xs text-gray-400">{{ item.description }}</div>
					</div>
				</div>
				</div>
			</div>

			<!-- 右侧：布局预览 -->
			<div class="flex flex-col flex-1 overflow-hidden">
				<!-- 布局选择 -->
				<div class="flex gap-3 mb-4">
					<div
						v-for="opt in layoutOptions"
						:key="opt.key"
						class="relative p-1 transition-all border-2 rounded-lg cursor-pointer w-14 h-14"
						:class="activeLayoutKey === opt.key
							? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
							: 'border-gray-200 bg-white hover:border-gray-400'"
						@click="setLayout(opt.cols)"
					>
						<el-row :gutter="1" class="h-full">
							<el-col v-for="(span, i) in opt.spans" :key="i" :span="span">
								<div
									class="h-full transition-colors rounded"
									:class="activeLayoutKey === opt.key ? 'bg-primary' : 'bg-gray-200'"
								/>
							</el-col>
						</el-row>
						<!-- 选中勾 -->
						<el-icon
							v-if="activeLayoutKey === opt.key"
							class="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px]"
						>
							<Check />
						</el-icon>
					</div>
				</div>

				<!-- 拖拽预览 -->
				<div class="flex-1 overflow-auto">
					<el-row :gutter="4">
						<el-col v-for="(colSize, index) in grid.layout" :key="index" :md="colSize" :xs="24">
							<draggable
								v-model="grid.copmsList[index]"
								animation="200"
								:group="{ name: 'widgets', pull: true, put: true }"
								item-key="element"
								class="min-h-[120px] border-2 border-dashed border-gray-200 rounded-lg p-2"
							>
								<template #item="{ element }">
									<div class="relative flex items-center gap-2 px-3 py-2 mb-2 bg-white border rounded-lg shadow-sm cursor-move group">
										<el-icon class="text-primary"><component :is="allComps[element]?.icon" /></el-icon>
										<span class="text-sm">{{ allComps[element]?.title }}</span>
										<el-icon
											class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
											@click.stop="removeFromLayout(element)"
										>
											<Close />
										</el-icon>
									</div>
								</template>
							</draggable>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>

		<template #footer>
			<el-button @click="resetToDefault">{{ $t('sysrole.widget.resetDefault') }}</el-button>
			<el-button @click="toggleVisible(false)">{{ $t('common.cancelButtonText') }}</el-button>
			<el-button type="primary" :loading="saving" @click="handleSave">{{ $t('common.confirmButtonText') }}</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="RoleWidgetConfig">
import draggable from 'vuedraggable';
import { useToggle, computedEager } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import allComps from '/@/views/home/widgets/components/index';
import { getRoleWidget, saveRoleWidget } from '/@/api/admin/role';
import { useMessage } from '/@/hooks/message';

const { t } = useI18n();
const { success, error } = useMessage();

const [visible, toggleVisible] = useToggle(false);
const saving = ref(false);
const roleId = ref<number | null>(null);
const roleName = ref('');

const layoutOptions = [
	{
		key: '7,7,10',
		cols: [7, 7, 10],
			spans: [8, 8, 8],
			defaultComps: [
				['current-user', 'sys-log-line'],
				['news', 'sys-log', 'device-distribution'],
				['calendar', 'favorite-menu', 'popular-pages'],
			],
		},
	{
		key: '24,16,8',
		cols: [24, 16, 8],
			spans: [24, 16, 8],
			defaultComps: [
				['current-user'],
				['news', 'sys-log', 'sys-log-line', 'device-distribution'],
				['calendar', 'favorite-menu', 'popular-pages'],
			],
		},
	{
			key: '24',
			cols: [24],
			spans: [24],
			defaultComps: [['current-user', 'news', 'sys-log', 'sys-log-line', 'device-distribution', 'calendar', 'favorite-menu', 'popular-pages']],
		},
	];

interface GridConfig {
	layout: number[];
	copmsList: string[][];
}

const grid = ref<GridConfig>({ layout: [7, 7, 10], copmsList: [[], [], []] });

interface CompItem {
	key: string;
	title: string;
	icon: any;
	description: string;
	checked: boolean;
}

const allCompsList = ref<CompItem[]>(
	Object.entries(allComps as Record<string, any>).map(([key, comp]) => ({
		key,
		title: comp.title,
		icon: comp.icon,
		description: comp.description,
		checked: false,
	}))
);

const checkedKeys = computed(() => allCompsList.value.filter((c) => c.checked).map((c) => c.key));

const searchKeyword = ref('');
const filteredCompsList = computed(() => {
	const kw = searchKeyword.value.trim().toLowerCase();
	if (!kw) return allCompsList.value;
	return allCompsList.value.filter((c) => c.title.toLowerCase().includes(kw));
});

// 缓存当前布局 key，模板中多处用到避免重复计算
const activeLayoutKey = computedEager(() => grid.value.layout.join(','));

// 用当前勾选组件 + 指定布局的 defaultComps 模板重新分配各列
const applyDefaultLayout = (opt: (typeof layoutOptions)[number], checked: Set<string>) => {
	grid.value.layout = opt.cols;
	grid.value.copmsList = opt.defaultComps.map((col) => col.filter((key) => checked.has(key)));
};

const onCheckChange = () => {
	// 移除布局中已取消勾选的组件
	grid.value.copmsList = grid.value.copmsList.map((col: string[]) => col.filter((key: string) => checkedKeys.value.includes(key)));
	// 将新勾选的组件追加到第一列
	const inLayout = grid.value.copmsList.flat();
	checkedKeys.value.forEach((key) => {
		if (!inLayout.includes(key)) {
			grid.value.copmsList[0].push(key);
		}
	});
};

const removeFromLayout = (key: string) => {
	grid.value.copmsList = grid.value.copmsList.map((col) => col.filter((k) => k !== key));
	const item = allCompsList.value.find((c) => c.key === key);
	if (item) item.checked = false;
};

const setLayout = (cols: number[]) => {
	const opt = layoutOptions.find((o) => o.cols.join(',') === cols.join(','))!;
	applyDefaultLayout(opt, new Set(checkedKeys.value));
};

const resetToDefault = () => {
	const allKeys = new Set(allCompsList.value.map((c) => c.key));
	allCompsList.value.forEach((c) => (c.checked = true));
	applyDefaultLayout(layoutOptions[0], allKeys);
};

const open = async (id: number, name: string) => {
	roleId.value = id;
	roleName.value = name;
	allCompsList.value.forEach((c) => (c.checked = false));

	try {
		const res = await getRoleWidget(id);
		if (res.data) {
			const keys: string[] = res.data.widgetKeys.split(',').filter(Boolean);
			allCompsList.value.forEach((c) => {
				c.checked = keys.includes(c.key);
			});
			if (res.data.layoutConfig) {
				// 有保存过的布局配置，直接恢复
				grid.value = JSON.parse(res.data.layoutConfig);
			} else {
				// 有勾选数据但无布局配置，用默认布局排布
				applyDefaultLayout(layoutOptions[0], new Set(keys));
			}
		} else {
			// 全新角色：按默认布局 + 全量组件预填
			const allKeys = new Set(allCompsList.value.map((c) => c.key));
			allCompsList.value.forEach((c) => (c.checked = true));
			applyDefaultLayout(layoutOptions[0], allKeys);
		}
	} catch (e) {
		error(t('sysrole.widget.loadError'));
	}
	toggleVisible(true);
};

const handleSave = async () => {
	saving.value = true;
	try {
		await saveRoleWidget({
			roleId: roleId.value!,
			widgetKeys: checkedKeys.value.join(','),
			layoutConfig: JSON.stringify(grid.value),
		});
		success(t('common.optSuccessText'));
		toggleVisible(false);
	} catch (e) {
		error(t('common.optFailText'));
	} finally {
		saving.value = false;
	}
};

defineExpose({ open });
</script>
