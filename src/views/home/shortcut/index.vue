<template>
	<el-card class="h-[191px] box-card">
		<template #header>
			<div class="card-header">
				<span>{{ props.title }}</span>
			</div>
		</template>
		<el-row :gutter="10" v-if="showRoutes.length > 0">
			<el-col class="shortcutCard" :span="6" :key="shortcut.id" v-for="shortcut in showRoutes">
				<SvgIcon name="ele-Close" :size="12" class="shortcutCardClose" @click="handleCloseFavorite(shortcut)" />
				<shortcutCard :icon="shortcut.meta?.icon" :label="shortcut.name" @click="handleRoute(shortcut.path)" />
			</el-col>
		</el-row>
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
.shortcutCard {
	position: relative;

	.shortcutCardClose {
		position: absolute;
		top: 0;
		right: 30%;
		font-weight: 700;
		font-size: 20px;
		cursor: pointer;
		color: #6d6b6b;
	}
}
</style>
