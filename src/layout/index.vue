<template>
	<component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts" name="layout">
import { useThemeConfig } from '/@/stores/themeConfig';
import { Local } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';
import { useEventListener } from '@vueuse/core';

const layouts: Record<string, ReturnType<typeof defineAsyncComponent>> = {
	defaults: defineAsyncComponent(() => import('/@/layout/main/defaults.vue')),
	classic: defineAsyncComponent(() => import('/@/layout/main/classic.vue')),
	transverse: defineAsyncComponent(() => import('/@/layout/main/transverse.vue')),
	columns: defineAsyncComponent(() => import('/@/layout/main/columns.vue')),
};

const { themeConfig } = storeToRefs(useThemeConfig());

const onLayoutResize = () => {
	if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) {
		themeConfig.value.isCollapse = false;
		mittBus.emit('layoutMobileResize', { layout: 'defaults', clientWidth });
	} else {
		mittBus.emit('layoutMobileResize', {
			layout: Local.get('oldLayout') || themeConfig.value.layout,
			clientWidth,
		});
	}
};

onBeforeMount(() => {
	onLayoutResize();
});

useEventListener(window, 'resize', onLayoutResize);
</script>
