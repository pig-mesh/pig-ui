<template>
	<div @mouseenter="inPopover = true" @mouseleave="inPopover = false">
		<el-popover
			placement="top"
			v-model:visible="visible"
			:width="width"
			trigger="contextmenu"
			class="popover-input"
			:teleported="teleported"
			:persistent="false"
			popper-class="!p-0"
		>
			<div class="flex p-3" @click.stop="">
				<div class="popover-input__input mr-[10px] flex-1">
					<el-select class="flex-1" :size="size" v-if="type == 'select'" v-model="inputValue" :teleported="teleported">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-input
						v-else
						v-model.trim="inputValue"
						:maxlength="maxlength"
						:show-word-limit="showLimit"
						:type="type"
						:size="size"
						clearable
						:placeholder="placeholder"
					/>
				</div>
				<div class="flex-none popover-input__btns">
					<el-button link @click="close">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button type="primary" :size="size" @click="handleConfirm">{{ $t('common.confirmButtonText') }}</el-button>
				</div>
			</div>
			<template #reference>
				<div class="inline" @click.stop="handleOpen">
					<slot></slot>
				</div>
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core';
import type { PropType } from 'vue';

const props = defineProps({
	modelValue: {
		type: String,
	},
	type: {
		type: String,
		default: 'text',
	},
	width: {
		type: [Number, String],
		default: '300px',
	},
	placeholder: String,
	disabled: {
		type: Boolean,
		default: false,
	},
	options: {
		type: Array as PropType<any[]>,
		default: () => [],
	},
	size: {
		type: String as PropType<'default' | 'small' | 'large'>,
		default: 'default',
	},
	limit: {
		type: Number,
		default: 200,
	},
	showLimit: {
		type: Boolean,
		default: false,
	},
	teleported: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits(['confirm', 'update:modelValue']);

const visible = ref(false);
const inPopover = ref(false);
const inputValue = ref();
const handleConfirm = () => {
	close();
	emit('confirm', inputValue.value);
	emit('update:modelValue', inputValue.value);
};

const handleOpen = () => {
	if (props.disabled) {
		return;
	}
	visible.value = true;
	inputValue.value = '';
};

const close = () => {
	visible.value = false;
};

watch(
	() => inputValue.value,
	(value) => {
		emit('update:modelValue', value);
	},
	{
		immediate: true,
	}
);

useEventListener(document.documentElement, 'click', () => {
	if (inPopover.value) return;
	close();
});
</script>

<style scoped lang="scss"></style>
