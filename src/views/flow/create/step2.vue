<template>
	<div>
		<flow-form-designer ref="flowFormDesignerRef" />
	</div>
</template>

<script lang="ts" setup>
import FlowFormDesigner from '/@/views/flow/form/index.vue';

const flowFormDesignerRef = ref();

const validate = (f) => {
	flowFormDesignerRef.value.validate(f);
};

defineExpose({ validate });
</script>
