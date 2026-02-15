<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="form.jobId ? $t('common.editBtn') : $t('common.addBtn')" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.jobName')" prop="jobName">
						<el-input v-model="form.jobName" :placeholder="t('job.inputjobNameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.jobGroup')" prop="jobGroup">
						<el-input v-model="form.jobGroup" :placeholder="t('job.inputjobGroupTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.jobType')" prop="jobType">
						<el-select v-model="form.jobType" :placeholder="t('job.jobType')">
							<el-option v-for="(item, index) in job_type" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20" v-if="['1'].includes(form.jobType)">
					<el-form-item :label="t('job.jobType1ClassName')" prop="className">
						<el-input v-model="form.className" :placeholder="t('job.inputclassNameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="['2'].includes(form.jobType)">
					<el-form-item :label="t('job.jobType2ClassName')" prop="className">
						<el-input v-model="form.className" :placeholder="t('job.inputBeanNameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="['1', '2'].includes(form.jobType)">
					<el-form-item :label="t('job.jobType1MethodName')" prop="methodName">
						<el-input v-model="form.methodName" :placeholder="t('job.inputmethodNameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="['3'].includes(form.jobType)">
					<el-form-item :label="t('job.jobType3ExecutePath')" prop="executePath">
						<el-input v-model="form.executePath" :placeholder="t('job.inputexecutePathTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="['4'].includes(form.jobType)">
					<el-form-item :label="t('job.jobType4ExecutePath')" prop="executePath">
						<el-input v-model="form.executePath" :placeholder="t('job.inputexecutePathTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item prop="methodParamsValue">
						<template #label> {{ t('job.methodParamsValue') }} <tip :content="t('job.singleParam')" /></template>
						<el-input v-model="form.methodParamsValue" :placeholder="t('job.inputmethodParamsValueTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.cronExpression')" prop="cronExpression">
						<crontab clearable v-model="form.cronExpression"></crontab>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.misfirePolicy')" prop="misfirePolicy">
						<el-select v-model="form.misfirePolicy" :placeholder="t('job.inputmisfirePolicyTip')">
							<el-option v-for="(item, index) in misfire_policy" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('job.remark')" prop="remark">
						<el-input v-model="form.remark" :placeholder="t('job.inputremarkTip')" type="textarea" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button formDialogRef @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button formDialogRef type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SysJobDialog" setup>
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateJob } from '/@/api/daemon/job';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);
const Crontab = defineAsyncComponent(() => import('/@/components/Crontab/index.vue'));

const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const { misfire_policy, job_type } = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');

const form = reactive({
	jobId: '',
	jobName: '',
	jobGroup: '',
	jobType: '',
	executePath: '',
	className: '',
	methodName: '',
	methodParamsValue: '',
	cronExpression: '',
	misfirePolicy: '',
	jobStatus: '',
	jobExecuteStatus: '',
	remark: '',
});

const dataRules = reactive({
	jobName: [{ required: true, message: t('job.jobNameRequired'), trigger: 'blur' }],
	jobGroup: [{ required: true, message: t('job.jobGroupRequired'), trigger: 'blur' }],
	jobType: [{ required: true, message: t('job.jobTypeRequired'), trigger: 'blur' }],
	cronExpression: [{ required: true, message: t('job.cronExpressionRequired'), trigger: 'blur' }],
	misfirePolicy: [{ required: true, message: t('job.misfirePolicyRequired'), trigger: 'blur' }],
	executePath: [{ required: true, message: t('job.executePathRequired'), trigger: 'blur' }],
	className: [
		{ required: true, message: t('job.classNameRequired'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateJob(rule, value, callback, form);
			},
			trigger: 'blur',
		},
	],
	methodName: [
		{ required: true, message: t('job.methodNameRequired'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateJob(rule, value, callback, form);
			},
			trigger: 'blur',
		},
	],
	methodParamsValue: [
		{
			validator: (rule: any, value: any, callback: any) => {
				validateJob(rule, value, callback, form);
			},
			trigger: 'blur',
		},
	],
});

const openDialog = async (id: string) => {
	visible.value = true;
	form.jobId = '';

	await nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.jobId = id;
		await getsysJobData(id);
	}
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.jobId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.jobId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(t('job.jobInitException'));
	} finally {
		loading.value = false;
	}
};

const getsysJobData = async (id: string) => {
	try {
		const { data } = await getObj(id);
		Object.assign(form, data);
	} catch (error: any) {
		useMessage().error(t('job.fetchJobDataFailed'));
	}
};

defineExpose({
	openDialog,
});
</script>
