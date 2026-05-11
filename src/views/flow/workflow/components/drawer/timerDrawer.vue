<template>
	<el-drawer
		v-model="visible"
		:append-to-body="true"
		title="延时器设置"
		:show-close="false"
		:size="500"
		:before-close="saveTimer"
		@open="openEvent"
	>
		<div class="p-4">
			<h4 class="mb-3">延时方式</h4>
			<el-radio-group v-model="timerConfig.timerConfig.timerType" class="ml-4" @change="timerTypeChange">
				<el-radio v-for="{ value, label } in timerTypes" :key="value" :value="value">{{ label }}</el-radio>
			</el-radio-group>

			<el-divider />

			<!-- 固定时长 -->
			<template v-if="timerConfig.timerConfig.timerType === 'DURATION'">
				<h4 class="mb-3">延时时间</h4>
				<div class="flex items-center gap-2 ml-4">
					<el-input-number
						v-model="timerConfig.timerConfig.duration.value"
						:min="1"
						:max="9999"
						:step="1"
						step-strictly
						size="default"
						style="width: 150px"
					/>
					<el-select v-model="timerConfig.timerConfig.duration.unit" style="width: 110px" size="default">
						<el-option v-for="{ value, label } in timeUnits" :key="value" :label="label" :value="value" />
					</el-select>
				</div>
			</template>

			<!-- 指定日期时间 -->
			<template v-if="timerConfig.timerConfig.timerType === 'DATETIME'">
				<h4 class="mb-3">指定日期时间</h4>
				<el-date-picker
					v-model="timerConfig.timerConfig.dateTime"
					type="datetime"
					placeholder="选择日期时间"
					class="ml-4"
					style="width: 280px"
					value-format="YYYY-MM-DDTHH:mm:ss"
				/>
			</template>

			<!-- 表单字段 -->
			<template v-if="timerConfig.timerConfig.timerType === 'FORM_FIELD'">
				<h4 class="mb-3">选择日期字段</h4>
				<el-select
					v-model="timerConfig.timerConfig.formFieldId"
					clearable
					class="ml-4"
					placeholder="请选择日期表单字段"
					style="width: 280px"
					@change="formFieldChange"
				>
					<el-option v-for="item in dateFormFields" :key="item.field" :label="item.title || item.name" :value="item.field" />
				</el-select>
			</template>
		</div>
	</el-drawer>
</template>
<script setup lang="ts">
import { timerTypes, timeUnits } from '../../utils/const';
import { useStore } from '../../stores/index';
import { useFlowStore } from '../../stores/flow';
import { flattenFormItems } from '../../utils';

const flowStore = useFlowStore();
const store = useStore();
const { setTimerConfig, setTimer } = store;

const timerConfigData = computed(() => store.timerConfigData);
const timerDrawer = computed(() => store.timerDrawer);

const visible = computed({
	get() {
		return timerDrawer.value;
	},
	set() {
		closeDrawer();
	},
});

const timerConfig = ref({
	timerConfig: {
		timerType: 'DURATION',
		duration: { value: 30, unit: 'MINUTE' },
		dateTime: null,
		formFieldId: null,
		formFieldName: null,
	},
	error: true,
});

watch(timerConfigData, (val) => {
	if (val.value) {
		timerConfig.value = val.value;
		if (!timerConfig.value.timerConfig) {
			timerConfig.value.timerConfig = {
				timerType: 'DURATION',
				duration: { value: 30, unit: 'MINUTE' },
				dateTime: null,
				formFieldId: null,
				formFieldName: null,
			};
		}
	}
});

const step2FormList = computed(() => {
	const formRule = flowStore.step2.formRule || [];
	return flattenFormItems(formRule);
});

const dateFormFields = computed(() => {
	return step2FormList.value.filter((item) => item.type === 'datePicker' || item.type === 'dateTimePicker' || item.type === 'timePicker');
});

const openEvent = () => {};

const timerTypeChange = () => {
	timerConfig.value.timerConfig.duration = { value: 30, unit: 'MINUTE' };
	timerConfig.value.timerConfig.dateTime = null;
	timerConfig.value.timerConfig.formFieldId = null;
	timerConfig.value.timerConfig.formFieldName = null;
};

const formFieldChange = (val: string) => {
	if (val) {
		const field = dateFormFields.value.find((item) => item.field === val);
		timerConfig.value.timerConfig.formFieldName = field?.title || field?.name || '';
	} else {
		timerConfig.value.timerConfig.formFieldName = null;
	}
};

const checkTimer = () => {
	const config = timerConfig.value.timerConfig;
	if (!config) return false;
	if (config.timerType === 'DURATION') {
		return config.duration && config.duration.value > 0;
	}
	if (config.timerType === 'DATETIME') {
		return !!config.dateTime;
	}
	if (config.timerType === 'FORM_FIELD') {
		return !!config.formFieldId;
	}
	return false;
};

const saveTimer = () => {
	timerConfig.value.error = !checkTimer();
	setTimerConfig({
		value: timerConfig.value,
		flag: true,
		id: timerConfigData.value.id,
	});
	closeDrawer();
};

const closeDrawer = () => {
	setTimer(false);
};
</script>
