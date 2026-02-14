<template>
	<el-header class="layout-header" v-show="!isTagsViewCurrenFull">
		<NavBarsIndex />
	</el-header>
</template>

<script setup lang="ts" name="layoutHeader">
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

const NavBarsIndex = defineAsyncComponent(() => import('/@/layout/navBars/index.vue'));
const { isTagsViewCurrenFull } = storeToRefs(useTagsViewRoutes());
</script>
