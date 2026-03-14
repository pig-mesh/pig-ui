<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.title')" prop="title">
						<el-input v-model="form.title" :placeholder="t('schedule.inputTitleTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.type')" prop="scheduleType">
						<el-select v-model="form.scheduleType" :placeholder="t('schedule.inputTypeTip')" clearable default-first-option>
							<el-option v-for="item in schedule_type" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.state')" prop="scheduleState">
						<el-select v-model="form.scheduleState" :placeholder="t('schedule.inputStateTip')" clearable default-first-option>
							<el-option v-for="item in schedule_status" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('schedule.date')" prop="scheduleDate">
						<el-date-picker type="date" :placeholder="t('schedule.inputDateTip')" v-model="form.scheduleDate" :value-format="dateStr" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('schedule.time')" prop="scheduleTime">
						<el-time-picker v-model="form.scheduleTime" arrow-control :placeholder="t('schedule.inputTimeTip')" :value-format="timeStr" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.content')" prop="content">
						<editor v-model:get-html="form.content" :placeholder="t('schedule.inputContentTip')" :disable="form.id !== ''" v-if="visible" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysScheduleDialog">
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/admin/schedule';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';

const emit = defineEmits(['refresh']);
const { schedule_type, schedule_status } = useDict('schedule_type', 'schedule_status');
const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
	id: '',
	title: '',
	scheduleType: 'record',
	scheduleState: '0',
	content: '',
	scheduleTime: '',
	scheduleDate: '',
});

const dataRules = ref({
	title: [{ required: true, message: t('schedule.titleRequired'), trigger: 'blur' }],
	scheduleType: [{ required: true, message: t('schedule.typeRequired'), trigger: 'blur' }],
	scheduleState: [{ required: true, message: t('schedule.stateRequired'), trigger: 'blur' }],
	content: [{ required: true, message: t('schedule.contentRequired'), trigger: 'blur' }],
	scheduleTime: [{ required: true, message: t('schedule.timeRequired'), trigger: 'blur' }],
	scheduleDate: [{ required: true, message: t('schedule.dateRequired'), trigger: 'blur' }],
});

const openDialog = (id: string, row: any): void => {
	visible.value = true;
	form.id = '';

	nextTick(() => dataFormRef.value?.resetFields());

	if (row?.date) {
		form.scheduleDate = row.date;
	}

	if (id) {
		form.id = id;
		getScheduleData(id);
	}
};

const onSubmit = async (): Promise<void> => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		await (form.id ? putObj(form) : addObj(form));
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getScheduleData = async (id: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj(id);
		Object.assign(form, data);
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

defineExpose({ openDialog });
</script>
