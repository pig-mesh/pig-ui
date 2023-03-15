<template>
	<el-dialog :close-on-click-modal="false" :title="form.leaveId ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('leave.username')" prop="username">
						<el-input :placeholder="t('leave.inputUsernameTip')" disabled v-model="form.username" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('leave.days')" prop="days">
						<el-input-number :max="1000" :min="1" :placeholder="t('leave.inputDaysTip')" v-model="form.days"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('leave.leaveTime')" prop="leaveTime">
						<el-date-picker
							:placeholder="t('leave.inputLeaveTimeTip')"
							:value-format="dateTimeStr"
							type="datetime"
							v-model="form.leaveTime"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('leave.content')" prop="content">
						<editor :placeholder="t('leave.inputContentTip')" v-model:get-html="form.content" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="OaLeaveBillDialog" setup>
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '../../../api/oa/leave-bill';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	leaveId: '',
	username: '',
	days: 0,
	content: '',
	leaveTime: '',
});

// 定义校验规则
const dataRules = ref({
	username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
	days: [{ required: true, message: '请假天数不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '事由不能为空', trigger: 'blur' }],
	leaveTime: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.leaveId = '';

	// 重置表单数据

	nextTick(() => {
		dataFormRef.value.resetFields();
	});

	// 获取oaLeaveBill信息
	if (id) {
		form.leaveId = id;
		getoaLeaveBillData(id);
	} else {
		form.username = useUserInfo().userInfos.user.username;
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		form.leaveId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.leaveId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 初始化表单数据
const getoaLeaveBillData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
