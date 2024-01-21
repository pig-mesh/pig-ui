<script lang="ts">
export default {
	title: '常用功能',
	icon: 'Star',
	description: '常用功能收藏',
};
</script>
<template>
	<Shortcut :title="$t('home.quickNavigationToolsTip')" :empty-description="$t('home.addFavoriteRoutesTip')" type="menu"></Shortcut>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
const Shortcut = defineAsyncComponent(() => import('/@/views/home/shortcut/index.vue'));
</script>
