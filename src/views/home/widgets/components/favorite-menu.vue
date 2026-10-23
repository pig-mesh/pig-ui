<script lang="ts">
import { dashboardWidgets } from "/@/utils/dashboardWidgets";
export default dashboardWidgets["favorite-menu"];
</script>
<template>
	<Shortcut :title="$t('home.quickNavigationToolsTip')" :empty-description="$t('home.addFavoriteRoutesTip')" type="menu"></Shortcut>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
import Shortcut from '/@/views/home/shortcut/index.vue';
</script>
