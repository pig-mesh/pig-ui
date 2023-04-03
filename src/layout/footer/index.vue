<template>
	<div class="layout-footer pb5">
		<div class="layout-footer-warp">
			<div class="mt5">{{ footerAuthor }}</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutFooter">
import { useThemeConfig } from '/@/stores/themeConfig';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
// 获取布局配置信息
const footerAuthor = computed(() => {
	return themeConfig.value.footerAuthor;
});
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;

	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 0.3s ease;
	}
}
</style>
