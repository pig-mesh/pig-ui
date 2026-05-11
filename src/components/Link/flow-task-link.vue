<template>
	<div class="flow-task-link mt-[30px]">
		<div class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">流程任务</div>
		<div class="flex flex-wrap">
			<div
				v-for="item in flowTaskLinks"
				:key="item.name"
				class="link-item border border-br px-5 py-[5px] rounded-[3px] cursor-pointer mr-[10px] mb-[10px]"
				:class="{
					'border-primary text-primary': modelValue.path == item.path && modelValue.name == item.name,
				}"
				@click="handleSelect(item)"
			>
				{{ item.name }}
			</div>
		</div>
		<div class="form-tips">维护我的、待办、抄送、已办四个流程任务入口</div>
	</div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { FLOW_TASK_LINKS, type Link } from '.';

defineProps({
	modelValue: {
		type: Object as PropType<Link>,
		default: () => ({}),
	},
});

const emit = defineEmits<{
	(event: 'update:modelValue', value: Link): void;
}>();

const flowTaskLinks = FLOW_TASK_LINKS;

const handleSelect = (value: Link) => {
	emit('update:modelValue', value);
};
</script>
