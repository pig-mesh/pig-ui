<template>
	<el-card class="box-card" style="height: 100%">
		<template #header>
			<div class="card-header">
				<span>{{ $t('home.quickNavigationToolsTip') }}</span>
			</div>
		</template>
		<el-row :gutter="10" v-if="favoriteRoutes.length > 0">
			<el-col :span="6" :key="shortcut.id" v-for="shortcut in favoriteRoutes">
				<shortcutCard :icon="shortcut.meta?.icon" :label="shortcut.name" @click="handleRoute(shortcut.path)" />
			</el-col>
		</el-row>
		<el-empty :description="$t('home.addFavoriteRoutesTip')" v-else />
	</el-card>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import shortcutCard from '/@/components/ShortcutCard/index.vue';

const router = useRouter();
const storesTagsViewRoutes = useTagsViewRoutes();
const { favoriteRoutes } = storeToRefs(storesTagsViewRoutes);

const handleRoute = (path: string) => {
	router.push(path);
};

const handleCloseFavorite = (item: any) => {
	storesTagsViewRoutes.delFavoriteRoutes(item);
};
</script>
