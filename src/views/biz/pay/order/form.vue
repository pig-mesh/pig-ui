<template>
	<el-dialog :close-on-click-modal="false" :title="form.goodsOrderId ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('order.goodsId')" prop="goodsId">
						<el-input :placeholder="t('order.inputGoodsIdTip')" v-model="form.goodsId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('order.goodsName')" prop="goodsName">
						<el-input :placeholder="t('order.inputGoodsNameTip')" v-model="form.goodsName" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('order.amount')" prop="amount">
						<el-input :placeholder="t('order.inputAmountTip')" v-model="form.amount" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('order.userId')" prop="userId">
						<el-input :placeholder="t('order.inputUserIdTip')" v-model="form.userId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('order.status')" prop="status">
						<el-select :placeholder="t('order.inputStatusTip')" v-model="form.status">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('order.payOrderId')" prop="payOrderId">
						<el-input :placeholder="t('order.inputPayOrderIdTip')" v-model="form.payOrderId" />
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

<script lang="ts" name="PayGoodsOrderDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/pay/goods';
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
	goodsOrderId: '',
	goodsId: '',
	goodsName: '',
	amount: '',
	userId: '',
	status: '',
	payOrderId: '',
});
const dictType = ref([
	{
		label: '处理失败',
		value: '-1',
	},
	{
		label: '订单生成',
		value: '0',
	},
	{
		label: '支付成功',
		value: '1',
	},
	{
		label: '处理完成',
		value: '2',
	},
]);
// 定义校验规则
const dataRules = ref({
	goodsName: [{ required: true, message: '商品名字不能为空', trigger: 'blur' }],
	amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.goodsOrderId = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取payGoodsOrder信息
	if (id) {
		form.goodsOrderId = id;
		getpayGoodsOrderData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.goodsOrderId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.goodsOrderId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

/**
 * 根据 ID 获取商品支付订单数据并初始化表单。
 * @param {string} id - 要查询的商品支付订单 ID。
 * @returns {Promise<void>} - 初始化表单的 Promise 实例。
 */
const getpayGoodsOrderData = async (id: string): Promise<void> => {
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
