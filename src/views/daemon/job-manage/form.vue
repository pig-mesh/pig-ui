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

				<el-col :span="12" class="mb20" v-if="['3', '4'].includes(form.jobType)">
					<el-form-item :label="t('job.executePath')" prop="executePath">
						<el-input v-model="form.executePath" :placeholder="t('job.inputexecutePathTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20" v-if="['1', '2'].includes(form.jobType)">
					<el-form-item :label="t('job.className')" prop="className">
						<el-input v-model="form.className" :placeholder="t('job.inputclassNameTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20" v-if="['1', '2'].includes(form.jobType)">
					<el-form-item :label="t('job.methodName')" prop="methodName">
						<el-input v-model="form.methodName" :placeholder="t('job.inputmethodNameTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.methodParamsValue')" prop="methodParamsValue">
						<el-input v-model="form.methodParamsValue" :placeholder="t('job.inputmethodParamsValueTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('job.cronExpression')" prop="cronExpression">
						<crontab clearable @hide="popoverVis(false)" v-model="form.cronExpression"></crontab>
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
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/daemon/job';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);
const Crontab = defineAsyncComponent(() => import('/@/components/Crontab/index.vue'));

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典
const { misfire_policy, job_type } = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');

// 提交表单数据
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

const popoverVis = (bol: boolean) => {
	popoverVisible.value = bol;
};

const popoverVisible = ref(false);
// 定义校验规则
const dataRules = reactive({
	jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
	jobGroup: [{ required: true, message: '任务组名不能为空', trigger: 'blur' }],
	jobType: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
	cronExpression: [{ required: true, message: 'cron不能为空', trigger: 'blur' }],
	misfirePolicy: [{ required: true, message: '策略不能为空', trigger: 'blur' }],
	executePath: [{ required: true, message: '执行路径不能为空', trigger: 'blur' }],
	className: [{ required: true, message: '执行文件不能为空', trigger: 'blur' }],
	methodName: [{ required: true, message: '执行方法不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.jobId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取sysJob信息
	if (id) {
		form.jobId = id;
		getsysJobData(id);
	}
};

// 提交
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
		useMessage().error('任务初始化异常');
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getsysJobData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
