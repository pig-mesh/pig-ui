<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.title')" prop="title">
						<el-input v-model="form.title" :placeholder="t('schedule.inputTitleTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.type')" prop="type">
						<el-select v-model="form.type" :placeholder="t('schedule.inputTypeTip')" clearable class="w100" default-first-option>
							<el-option v-for="item in schedule_type" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.state')" prop="state">
						<el-select v-model="form.state" :placeholder="t('schedule.inputStateTip')" clearable class="w100" default-first-option>
							<el-option v-for="item in schedule_status" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('schedule.date')" prop="date">
						<el-date-picker type="date" :placeholder="t('schedule.inputDateTip')" v-model="form.date" :value-format="dateStr"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('schedule.time')" prop="time">
						<el-time-picker v-model="form.time" arrow-control :placeholder="t('schedule.inputTimeTip')" :value-format="timeStr" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('schedule.content')" prop="content">
						<editor v-model:get-html="form.content" :placeholder="t('schedule.inputContentTip')" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysScheduleDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/admin/schedule';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
const emit = defineEmits(['refresh']);

const { schedule_type, schedule_status } = useDict('schedule_type', 'schedule_status');

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	title: '',
	type: 'record',
	state: '0',
	content: '',
	time: '',
	date: '',
});

// 定义校验规则
const dataRules = ref({
	title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '日程类型不能为空', trigger: 'blur' }],
	state: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
	time: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
	date: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string, row: any) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}
	if (row?.date) {
		form.date = row.date;
	}

	// 获取sysSchedule信息
	if (id) {
		form.id = id;
		getsysScheduleData(id);
	}
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
		// 更新
		if (form.id) {
			loading.value = true;
			putObj(form)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				})
				.finally(() => {
					loading.value = false;
				});
		} else {
			loading.value = true;
			addObj(form)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				})
				.finally(() => {
					loading.value = false;
				});
		}
	});
};

// 初始化表单数据
const getsysScheduleData = (id: string) => {
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
