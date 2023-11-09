<template>
	<el-image :style="styles" v-bind="props" :src="src.includes('http') ? src : baseURL + src">
		<template #placeholder>
			<div class="image-slot"></div>
		</template>
		<template #error>
			<div class="image-slot">
				<el-icon><Picture /></el-icon>
			</div>
		</template>
	</el-image>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { imageProps } from 'element-plus';
import other from '/@/utils/other';
const props = defineProps({
	width: {
		type: [String, Number],
		default: 'auto',
	},
	height: {
		type: [String, Number],
		default: 'auto',
	},
	radius: {
		type: [String, Number],
		default: 0,
	},
	...imageProps,
});

const styles = computed<CSSProperties>(() => {
	return {
		width: other.addUnit(props.width),
		height: other.addUnit(props.height),
		borderRadius: other.addUnit(props.radius),
	};
});
</script>

<style lang="scss" scoped>
.el-image {
	display: block;
	.image-slot {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background: #fafafa;
		color: #909399;
	}
}
</style>
