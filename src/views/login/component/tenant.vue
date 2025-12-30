<template>
	<div></div>
</template>

<script setup lang="ts" name="tenant">
import { useTenant } from '/@/hooks/tenant';

const { init } = useTenant();

onMounted(() => init({ autoMatch: true }));
</script>
