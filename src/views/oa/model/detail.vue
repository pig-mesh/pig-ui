<template>
	<div class="layout-padding">
		<el-scrollbar class="main">
			<iframe :src="src" class="iframe" />
		</el-scrollbar>
	</div>
</template>

<script lang="ts" name="modelView" setup>
import { Session } from '/@/utils/storage';

const route = useRoute();

const src = ref('');

watch([route], () => {
	init();
});

onMounted(() => {
	init();
});

const init = () => {
	const token = Session.getToken();
	window.sessionStorage.setItem('token', JSON.stringify(token));
	src.value = '/admin/modeler.html?modelId=' + route.query.id;
};
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
