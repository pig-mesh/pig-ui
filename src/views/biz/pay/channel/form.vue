<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('channel.appId')" prop="appId">
						<el-input :placeholder="t('channel.inputAppIdTip')" v-model="form.appId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('channel.channelId')" prop="state">
						<el-select v-model="form.channelId">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in channel_type"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('channel.channelName')" prop="channelName">
						<el-input :placeholder="t('channel.inputChannelNameTip')" v-model="form.channelName" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('channel.mchId')" prop="channelMchId">
						<el-input :placeholder="t('channel.inputMchIdTip')" v-model="form.channelMchId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('channel.state')" prop="state">
						<el-select v-model="form.state">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in status_type"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('channel.returnUrl')" prop="returnUrl">
						<el-input :placeholder="t('channel.inputReturnUrlTip')" v-model="form.returnUrl"> </el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('channel.notifyUrl')" prop="notifyUrl">
						<el-input :placeholder="t('channel.inputNotifyUrlTip')" v-model="form.notifyUrl"> </el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('channel.remark')" prop="remark">
						<el-input :placeholder="t('channel.inputRemarkTip')" :rows="2" type="textarea" v-model="form.remark" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('channel.param')" prop="param">
						<el-input :placeholder="t('channel.inputParamTip')" :rows="4" type="textarea" v-model="form.param" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="PayChannelDialog" setup>
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/pay/channel';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);

const { t } = useI18n();
const { status_type, channel_type } = useDict('status_type', 'channel_type');
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	mchId: '',
	channelId: '',
	channelName: '',
	channelMchId: '',
	returnUrl: '',
	notifyUrl: '',
	state: '0',
	param: '',
	remark: '',
	appId: '',
});

// 定义校验规则
const dataRules = ref({
	appId: [
		{ required: true, message: 'appId不能为空', trigger: 'blur' },
		{ validator: rule.letterAndNumber, trigger: 'blur' },
	],
	channelName: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }],

	channelMchId: [
		{ required: true, message: '商户ID不能为空', trigger: 'blur' },
		{ validator: rule.letterAndNumber, trigger: 'blur' },
	],
	state: [{ required: true, message: '状态不能为空', trigger: 'blur' }],

	returnUrl: [
		{ required: true, message: '前端回调不能为空', trigger: 'blur' },
		{ validater: rule.url, trigger: 'blur' },
	],

	notifyUrl: [{ required: true, message: '后端回调不能为空', trigger: 'blur' }],
	param: [{ required: true, message: '参数配置不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value.resetFields();
	});

	// 获取payChannel信息
	if (id) {
		form.id = id;
		getpayChannelData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
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
 * 根据 ID 获取支付通道数据并初始化表单。
 * @param {string} id - 要查询的支付通道 ID。
 * @returns {Promise<void>} - 初始化表单的 Promise 实例。
 */
const getpayChannelData = async (id: string): Promise<void> => {
	loading.value = true; // 显示加载状态

	try {
		const res = await getObj(id); // 执行查询操作
		Object.assign(form, res.data); // 将查询到的数据合并到表单中
	} catch (err) {
		useMessage().error('操作失败'); // 如果查询失败，则显示错误提示信息
	} finally {
		loading.value = false; // 结束加载状态
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
