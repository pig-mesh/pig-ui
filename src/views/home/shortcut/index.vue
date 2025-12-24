<template>
	<el-card class="h-[191px] box-card" :body-style="{ height: 'calc(100% - 50px)', padding: '8px 12px' }">
		<template #header>
			<div class="card-header">
				<span>{{ props.title }}</span>
			</div>
		</template>
		<div class="h-full pr-1 -mr-1 overflow-y-auto" v-if="showRoutes.length > 0">
			<div class="grid grid-cols-6">
				<shortcutCard
					v-for="shortcut in showRoutes"
					:key="shortcut.id"
					:icon="shortcut.meta?.icon"
					:label="shortcut.meta?.title || shortcut.name"
					@click="handleRoute(shortcut.path)"
					@close="handleCloseFavorite(shortcut)"
				/>
			</div>
		</div>
		<el-empty :image-size="48" :description="props.emptyDescription" v-else />
	</el-card>
</template>

<script setup lang="ts" name="Shortcut">
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import shortcutCard from '/@/components/ShortcutCard/index.vue';

const props = defineProps({
	title: {
		type: String,
	},
	type: {
		type: String,
		default: true,
	},
  emptyDescription:{
    type: String,
    default: true,
  }
});

/**
 * 路由对象实例
 */
const router = useRouter();

/**
 * tagsView 路由列表 store 对象实例
 */
const storesTagsViewRoutes = useTagsViewRoutes();

/**
 * 收藏路由列表（响应式引用）
 */
const { favoriteRoutes } = storeToRefs(storesTagsViewRoutes);

/**
 * 点击快捷方式跳转到指定路由
 * @param path - 需要跳转的路径
 */
const handleRoute = (path: string): void => {
	router.push(path);
};

/**
 * 取消收藏路由
 * @param item - 需要删除的路由信息
 */
const handleCloseFavorite = (item: any): void => {
	storesTagsViewRoutes.delFavoriteRoutes(item);
};

/**
 * 根据类型过滤显示的路由列表
 * 流程类型显示流程路径，其他类型显示非流程路径
 */
const showRoutes = computed(() => {
	if (props.type === 'flow') {
		return favoriteRoutes.value.filter((item) => item.path.includes('/flow/list/index?flowId'));
	} else {
		return favoriteRoutes.value.filter((item) => !item.path.includes('/flow/list/index?flowId'));
	}
});
</script>

<style lang="scss" scoped>
/* Styles moved to ShortcutCard component */
</style>
