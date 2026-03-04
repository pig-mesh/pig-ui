<template>
	<el-drawer
		v-model="visible"
		:append-to-body="true"
		title="触发器设置"
		:show-close="false"
		:size="600"
		:before-close="saveTrigger"
		@open="openEvent"
	>
		<div class="p-4">
			<!-- 请求地址 -->
			<h4 class="mb-3">请求地址</h4>
			<div class="mb-2 ml-4">
				<el-input v-model="triggerConfig.triggerConfig.url" placeholder="https://example.com/api/callback" clearable>
					<template #prepend>POST</template>
				</el-input>
				<div class="mt-1 text-xs text-gray-400">仅支持 POST 请求，通过请求体接收参数</div>
			</div>

			<el-divider />

			<!-- 请求头 -->
			<h4 class="mb-3">请求头</h4>
			<div class="ml-4">
				<div v-for="(item, index) in triggerConfig.triggerConfig.headers" :key="index" class="flex items-center gap-2 mb-2">
					<el-input v-model="item.key" placeholder="字段名" style="width: 120px" />
					<el-switch v-model="item.useForm" active-text="表单" inactive-text="" size="small" />
					<el-select v-if="item.useForm" v-model="item.formFieldId" placeholder="选择表单字段" style="width: 180px" @change="(val) => onFormFieldChange(item, val)">
						<el-option v-for="field in flatFormFields" :key="field.field" :label="field.title || field.name" :value="field.field" />
					</el-select>
					<el-input v-else v-model="item.value" placeholder="固定值" style="width: 180px" />
					<el-button type="danger" :icon="Delete" circle size="small" @click="triggerConfig.triggerConfig.headers.splice(index, 1)" />
				</div>
				<el-button type="primary" link @click="addHeader">+ 添加请求头</el-button>
			</div>

			<el-divider />

			<!-- 请求体 -->
			<h4 class="mb-3">请求体</h4>
			<div class="ml-4">
				<div v-for="(item, index) in triggerConfig.triggerConfig.body" :key="index" class="flex items-center gap-2 mb-2">
					<el-input v-model="item.key" placeholder="字段名" style="width: 120px" />
					<el-switch v-model="item.useForm" active-text="表单" inactive-text="" size="small" />
					<el-select v-if="item.useForm" v-model="item.formFieldId" placeholder="选择表单字段" style="width: 180px" @change="(val) => onFormFieldChange(item, val)">
						<el-option v-for="field in flatFormFields" :key="field.field" :label="field.title || field.name" :value="field.field" />
					</el-select>
					<el-input v-else v-model="item.value" placeholder="固定值" style="width: 180px" />
					<el-button type="danger" :icon="Delete" circle size="small" @click="triggerConfig.triggerConfig.body.splice(index, 1)" />
				</div>
				<el-button type="primary" link @click="addBody">+ 添加请求体</el-button>
			</div>

			<el-divider />

			<!-- 返回值映射 -->
			<h4 class="mb-3">返回值</h4>
			<div class="ml-4">
				<div class="mb-2 text-xs text-gray-400">HTTP 返回 200 即视为调用成功，响应体按 JSON 解析后进行字段映射：左侧表单表示要修改的表单值，右侧字段是指接口返回的 JSON 字段名</div>
				<div v-for="(item, index) in triggerConfig.triggerConfig.returnMapping" :key="index" class="flex items-center gap-2 mb-2">
					<el-select v-model="item.formFieldId" placeholder="选择表单字段" style="width: 180px" @change="(val) => onReturnFormFieldChange(item, val)">
						<el-option v-for="field in flatFormFields" :key="field.field" :label="field.title || field.name" :value="field.field" />
					</el-select>
					<span class="text-gray-400">=</span>
					<el-input v-model="item.responseKey" placeholder="接口返回字段名" style="width: 180px" />
					<el-button type="danger" :icon="Delete" circle size="small" @click="triggerConfig.triggerConfig.returnMapping.splice(index, 1)" />
				</div>
				<el-button type="primary" link @click="addReturnMapping">+ 添加返回值映射</el-button>
			</div>

			<el-divider />

			<!-- 异常处理 -->
			<h4 class="mb-3">返回值异常默认处理（错误码）</h4>
			<el-radio-group v-model="triggerConfig.triggerConfig.errorHandler" class="ml-4">
				<el-radio v-for="{ value, label } in errorHandlerTypes" :key="value" :value="value">{{ label }}</el-radio>
			</el-radio-group>
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';
import { errorHandlerTypes } from '../../utils/const';
import { useStore } from '../../stores/index';
import { useFlowStore } from '../../stores/flow';
import { flattenFormItems } from '../../utils';

const flowStore = useFlowStore();
const store = useStore();
const { setTriggerConfig, setTrigger } = store;

const triggerConfigData = computed(() => store.triggerConfigData);
const triggerDrawer = computed(() => store.triggerDrawer);

const visible = computed({
	get() {
		return triggerDrawer.value;
	},
	set() {
		closeDrawer();
	},
});

const triggerConfig = ref({
	triggerConfig: {
		url: '',
		headers: [],
		body: [],
		returnMapping: [],
		errorHandler: 'THROW',
	},
	error: true,
});

watch(triggerConfigData, (val) => {
	if (val.value) {
		triggerConfig.value = val.value;
		if (!triggerConfig.value.triggerConfig) {
			triggerConfig.value.triggerConfig = {
				url: '',
				headers: [],
				body: [],
				returnMapping: [],
				errorHandler: 'THROW',
			};
		}
	}
});

const step2FormList = computed(() => {
	const formRule = flowStore.step2.formRule || [];
	return flattenFormItems(formRule);
});

const flatFormFields = computed(() => {
	return step2FormList.value;
});

const openEvent = () => {};

const onFormFieldChange = (item: any, val: string) => {
	if (val) {
		const field = flatFormFields.value.find((f) => f.field === val);
		item.formFieldName = field?.title || field?.name || '';
	} else {
		item.formFieldName = null;
	}
};

const onReturnFormFieldChange = (item: any, val: string) => {
	if (val) {
		const field = flatFormFields.value.find((f) => f.field === val);
		item.formFieldName = field?.title || field?.name || '';
	} else {
		item.formFieldName = null;
	}
};

const addHeader = () => {
	triggerConfig.value.triggerConfig.headers.push({
		key: '',
		useForm: false,
		formFieldId: null,
		formFieldName: null,
		value: '',
	});
};

const addBody = () => {
	triggerConfig.value.triggerConfig.body.push({
		key: '',
		useForm: false,
		formFieldId: null,
		formFieldName: null,
		value: '',
	});
};

const addReturnMapping = () => {
	triggerConfig.value.triggerConfig.returnMapping.push({
		formFieldId: null,
		formFieldName: null,
		responseKey: '',
	});
};

const checkTrigger = () => {
	const config = triggerConfig.value.triggerConfig;
	if (!config || !config.url) return false;
	try {
		new URL(config.url);
		return true;
	} catch {
		return false;
	}
};

const saveTrigger = () => {
	triggerConfig.value.error = !checkTrigger();
	setTriggerConfig({
		value: triggerConfig.value,
		flag: true,
		id: triggerConfigData.value.id,
	});
	closeDrawer();
};

const closeDrawer = () => {
	setTrigger(false);
};
</script>
