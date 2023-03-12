<template>
	<div></div>
</template>
<script setup lang="ts" name="check-token">
import { checkToken } from '/@/api/login';

const refreshLock = ref(false);
const refreshTime = ref();

onMounted(() => {
	refreshToken();
});

const refreshToken = () => {
	refreshTime.value = setInterval(() => {
		checkToken(refreshTime.value, refreshLock.value);
	}, 60000);
};
</script>
