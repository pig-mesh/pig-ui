<template>
	<div class="layout-padding">
		<el-scrollbar class="main">
      <iframe :src="src" class="iframe"  />
		</el-scrollbar>
	</div>
</template>

<script lang="ts" name="modelView" setup>
import { Session } from '/@/utils/storage';

const route = useRoute();
const src = ref('');

const init = () => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	src.value = baseURL + `/jimu/jmreport/list?token=${tenantId}_${token}&tenantId=${tenantId}`;
};

watch(route, init, { immediate: true });
</script>

<style lang="scss" scoped>
.iframe {
	width: 100%;
	height: 100vh;
	border: 0;
	overflow: hidden;
	box-sizing: border-box;
}
</style>
