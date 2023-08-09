<template>
	<div class="layout-padding">
    <iframe :src="src" class="iframe" v-if="isMicro === 'true'" />
    <span v-else>单体架构暂不支持大屏设计器</span>
	</div>
</template>

<script lang="ts" name="modelView" setup>
import { Session } from '/@/utils/storage';
const { proxy } = getCurrentInstance();
const route = useRoute();
const src = ref('');
const isMicro = import.meta.env.VITE_IS_MICRO;

watch([route], () => {
	init();
});

onMounted(() => {
	init();
});

const init = () => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	src.value = proxy.baseURL + `/gv?token=${token}&TENANT-ID=${tenantId}`;
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
