<template>
	<div v-if="siteConfig.footer" class="fixed bottom-0 left-0 right-0 z-10 py-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-slate-900/50">
		<p class="text-sm font-light tracking-wide text-center text-gray-400 dark:text-slate-500" v-html="siteConfig.footer"></p>
	</div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '/@/stores/siteConfig';

const { siteConfig } = storeToRefs(useSiteConfig());
</script>
