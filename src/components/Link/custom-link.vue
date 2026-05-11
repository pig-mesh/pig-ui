<template>
	<div class="custom-link mt-[30px]">
		<div class="flex flex-wrap items-center">
			自定义链接
			<div class="ml-4 flex-1 min-w-[100px]">
				<el-input :model-value="modelValue.path" placeholder="请输入 http:// 或 https:// 开头的链接地址" @input="handleInput" />
			</div>
		</div>
		<div class="form-tips">自定义链接仅用于外部网页，请填写完整的 http:// 或 https:// 地址</div>
	</div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { LinkTypeEnum, type Link } from '.';

defineProps({
	modelValue: {
		type: Object as PropType<Link>,
		default: () => ({}),
	},
});
const emit = defineEmits<{
	(event: 'update:modelValue', value: Link): void;
}>();

const handleInput = (value: string) => {
	emit('update:modelValue', {
		path: value,
		type: LinkTypeEnum.CUSTOM_LINK,
	});
};
</script>
