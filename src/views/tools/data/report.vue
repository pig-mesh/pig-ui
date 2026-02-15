<template>
	<div class="layout-padding">
    <iframe :src="src" class="iframe" />
	</div>
</template>

<script lang="ts" name="modelView" setup>
import { Session } from '/@/utils/storage';
import { watchImmediate } from '@vueuse/core';

const route = useRoute();
const src = ref('');

const init = () => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	src.value = baseURL + `/gv?token=${token}&TENANT-ID=${tenantId}`;
};

watchImmediate(route, init);
</script>

<style lang="scss" scoped>
.iframe {
	width: 100%;
	height: 80vh;
	border: 0;
	overflow: hidden;
	box-sizing: border-box;
}
</style>
