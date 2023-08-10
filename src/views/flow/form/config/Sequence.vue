<script setup lang="ts">
let props = defineProps({
	id: {
		type: String,
		default: '',
	},
});

import { useFlowStore } from '../../workflow/stores/flow';

let flowStore = useFlowStore();

var config = computed(() => {
	let step2 = flowStore.step2;
	var idObjList = step2.filter((res) => res.id === props.id);
	if (idObjList.length > 0) {
		return idObjList[0];
	}

	let list = step2.filter((res) => res.type === 'Layout');
	for (var item of list) {
		let value = item.props.value;
		var valueList = value.filter((res) => res.id === props.id);
		if (valueList.length > 0) {
			return valueList[0];
		}
	}

	return undefined;
});

computed(() => {
	return config.value?.placeholder;
});
</script>

<template>
	<div>
		<el-form-item :label="$t('flow.servicePrefix')">
			<el-input :placeholder="$t('flow.servicePrefixTips')" v-model="config.props.prefix" />
		</el-form-item>
	</div>
</template>
