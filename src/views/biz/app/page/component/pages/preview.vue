<template>
	<div class="shadow mx-[30px] bg-[#f8f8f8] w-[360px] h-[585px] text-[#333] dark:bg-[var(--next-color-disabled)] dark:text-[var(--next-color-white)]">
		<div
			v-for="(widget, index) in pageData"
			:key="widget.id"
			class="relative"
			:class="{
				'cursor-pointer': !widget?.disabled,
			}"
			@click="handleClick(widget, index)"
		>
			<div
				class="absolute w-full h-full z-[100] border-dashed"
				:class="{
					'border-primary border-solid': index == modelValue,
					'border-[#dcdfe6] border-2 dark:border-[var(--next-border-color)]': !widget?.disabled && index != modelValue,
				}"
			></div>
			<slot>
				<component :is="widgets[widget?.name]?.content" :content="widget.content" :styles="widget.styles" :key="widget.id" />
			</slot>
		</div>
		<slot name="footer" />
	</div>
</template>
<script lang="ts" setup>
import widgets from '../widgets';
import type { PropType } from 'vue';

defineProps({
	pageData: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
	modelValue: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits<{
	(event: 'update:modelValue', value: number): void;
}>();

const handleClick = (widget: any, index: number) => {
	if (widget.disabled) return;
	emit('update:modelValue', index);
};
</script>


