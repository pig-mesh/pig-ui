<template>
	<div class="home-card-item-title">{{ $t('home.quickNavigationToolsTip') }}</div>
	<div class="home-monitor">
		<div class="flex-warp" v-if="favoriteRoutes.length > 0">
			<div class="flex-warp-item" v-for="(v, k) in favoriteRoutes" :key="k">
				<div class="flex-warp-item-box">
					<div class="flex-margin">
						<i :class="v.meta.icon"></i>
						<el-tag :key="v.path" @click="HandleRoute(v)" class="mx-1" closable :type="v.path" @close="handleCloseFavorite(v)">{{
							$t(v.name)
						}}</el-tag>
					</div>
				</div>
			</div>
		</div>
		<el-empty :description="$t('home.addFavoriteRoutesTip')" v-else />
	</div>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

const router = useRouter();
const storesTagsViewRoutes = useTagsViewRoutes();
const { favoriteRoutes } = storeToRefs(storesTagsViewRoutes);

const HandleRoute = (item: any) => {
	router.push(item.path);
};

const handleCloseFavorite = (item: any) => {
	storesTagsViewRoutes.delFavoriteRoutes(item);
};
</script>
