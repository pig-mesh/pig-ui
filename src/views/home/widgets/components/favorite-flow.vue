<script lang="ts">
export default {
	title: '常用流程',
	icon: 'Star',
	description: '常用流程收藏',
};
</script>
<template>
	<Shortcut :title="$t('home.quickNavigationFlowsTip')" :empty-description="$t('home.addFlowsRoutesTip')" type="flow"></Shortcut>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
import Shortcut from '/@/views/home/shortcut/index.vue';
</script>
