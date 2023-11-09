<template>
	<el-dialog :close-on-click-modal="false" :title="form.orderId ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.orderId')" prop="orderId">
						<el-input :placeholder="t('trade.inputOrderIdTip')" v-model="form.orderId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.channelId')" prop="channelId">
						<el-input :placeholder="t('trade.inputChannelIdTip')" v-model="form.channelId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.channelMchId')" prop="channelMchId">
						<el-input :placeholder="t('trade.inputChannelMchIdTip')" v-model="form.channelMchId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.channelOrderNo')" prop="channelOrderNo">
						<el-input :placeholder="t('trade.inputChannelOrderNoTip')" v-model="form.channelOrderNo" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.body')" prop="body">
						<el-input :placeholder="t('trade.inputBodyTip')" v-model="form.body" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.amount')" prop="amount">
						<el-input :placeholder="t('trade.inputAmountTip')" v-model="form.amount" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.currency')" prop="currency">
						<el-input :placeholder="t('trade.inputCurrencyTip')" v-model="form.currency" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.status')" prop="status">
						<el-select v-model="form.status" :placeholder="t('trade.inputStatusTip')">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.clientIp')" prop="clientIp">
						<el-input :placeholder="t('trade.inputClientIpTip')" v-model="form.clientIp" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('trade.paySuccTime')" prop="paySuccTime">
						<el-input :placeholder="t('trade.inputPaySuccTimeTip')" v-model="form.paySuccTime" />
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

<script lang="ts" name="PayTradeOrderDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/pay/trade';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	orderId: '',
	channelId: '',
	amount: '',
	currency: '',
	status: '',
	clientIp: '',
	device: '',
	subject: '',
	body: '',
	extra: '',
	channelMchId: '',
	channelOrderNo: '',
	errCode: '',
	errMsg: '',
	param1: '',
	param2: '',
	notifyUrl: '',
	notifyCount: '',
	lastNotifyTime: '',
	expireTime: '',
	paySuccTime: '',
});

// 定义校验规则
const dataRules = ref({});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.orderId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取payTradeOrder信息
	if (id) {
		form.orderId = id;
		getpayTradeOrderData(id);
	}
};

const dictType = ref([
	{
		label: '订单生成',
		value: '0',
	},
	{
		label: '支付中（未使用）',
		value: '1',
	},
	{
		label: '支付成功',
		value: '2',
	},
	{
		label: '业务处理完成',
		value: '3',
	},
]);

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.orderId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.orderId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getpayTradeOrderData = async (id: string) => {
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
