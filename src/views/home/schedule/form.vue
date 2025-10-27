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

/**
 * 定义组件事件
 */
const emit = defineEmits(['refresh']);

/**
 * 日程类型和状态字典
 */
const { schedule_type, schedule_status } = useDict('schedule_type', 'schedule_status');

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 表单引用
 */
const dataFormRef = ref();

/**
 * 对话框显示状态
 */
const visible = ref(false);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 表单数据
 */
const form = reactive({
	id: '',
	title: '',
	scheduleType: 'record',
	scheduleState: '0',
	content: '',
	scheduleTime: '',
	scheduleDate: '',
});

/**
 * 表单验证规则
 */
const dataRules = ref({
	title: [{ required: true, message: t('schedule.titleRequired'), trigger: 'blur' }],
	scheduleType: [{ required: true, message: t('schedule.typeRequired'), trigger: 'blur' }],
	scheduleState: [{ required: true, message: t('schedule.stateRequired'), trigger: 'blur' }],
	content: [{ required: true, message: t('schedule.contentRequired'), trigger: 'blur' }],
	scheduleTime: [{ required: true, message: t('schedule.timeRequired'), trigger: 'blur' }],
	scheduleDate: [{ required: true, message: t('schedule.dateRequired'), trigger: 'blur' }],
});

/**
 * 打开对话框
 * @param id - 日程ID，为空时为新增模式
 * @param row - 行数据，可能包含日期等信息
 */
const openDialog = (id: string, row: any): void => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => dataFormRef.value?.resetFields());

	if (row?.date) {
		form.date = row.date;
	}

	// 获取日程详情
	if (id) {
		form.id = id;
		getScheduleData(id);
	}
};

/**
 * 提交表单
 */
const onSubmit = async (): Promise<void> => {
	// 验证表单是否符合规则
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

/**
 * 获取日程详情数据
 * @param id - 日程ID
 */
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

/**
 * 暴露方法供父组件调用
 */
defineExpose({ openDialog });
</script>
