<template>
	<el-card class="h-[190px] box-card" :body-style="{ height: 'calc(100% - 50px)', padding: '12px 16px' }">
		<template #header>
			<div class="card-header">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">{{ props.title }}</span>
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
		default: 'menu',
	},
	emptyDescription: {
		type: String,
		default: '',
	},
});

const router = useRouter();
const storesTagsViewRoutes = useTagsViewRoutes();
const { favoriteRoutes } = storeToRefs(storesTagsViewRoutes);

const handleRoute = (path: string): void => {
	router.push(path);
};

const handleCloseFavorite = (item: any): void => {
	storesTagsViewRoutes.delFavoriteRoutes(item);
};

const showRoutes = computed(() => {
	if (props.type === 'flow') {
		return favoriteRoutes.value.filter((item) => item.path.includes('/flow/list/index?flowId'));
	}
	return favoriteRoutes.value.filter((item) => !item.path.includes('/flow/list/index?flowId'));
});
</script>
