<template>
    <el-dialog :close-on-click-modal="false" :title="$t('trade.refundBtn')" draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
            <el-row :gutter="24">

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.orderId')" prop="orderId">
                        <el-input :placeholder="t('trade.inputOrderIdTip')" v-model="form.orderId" disabled />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelId')" prop="channelId">
                        <el-input :placeholder="t('trade.inputChannelIdTip')" v-model="form.channelId" disabled />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelMchId')" prop="channelMchId">
                        <el-input :placeholder="t('trade.inputChannelMchIdTip')" v-model="form.channelMchId" disabled />
                    </el-form-item>
                </el-col>


                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelOrderNo')" prop="channelOrderNo">
                        <el-input :placeholder="t('trade.inputChannelOrderNoTip')" v-model="form.channelOrderNo" disabled />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.body')" prop="body">
                        <el-input :placeholder="t('trade.inputBodyTip')" v-model="form.body" disabled />
                    </el-form-item>
                </el-col>


                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.amount')" prop="amount">
                        <el-input :placeholder="t('trade.inputAmountTip')" v-model="form.amount" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="mb20">
                    <el-form-item :label="t('refund.remark')" prop="remark">
                        <el-input :placeholder="t('refund.inputRemarkTip')" v-model="form.remark" />
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

<script lang="ts" name="PayRefundOrderDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from "/@/hooks/message";
import { getObj } from '/@/api/pay/trade'
import { useRefundApi } from '/@/api/pay/refund'
import { useI18n } from "vue-i18n"

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
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
    remark: ''
});

// 定义校验规则
const dataRules = ref({
    refundAmount: [{ required: true, message: '退款金额不能为空', trigger: 'blur' }],
    remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
})

// 打开弹窗
const openDialog = (id: string) => {
    visible.value = true
    form.orderId = ''

    // 重置表单数据
    if (dataFormRef.value) {
        dataFormRef.value.resetFields()
    }

    // 获取payTradeOrder信息
    if (id) {
        form.orderId = id
        getpayTradeOrderData(id)
    }
};

// 提交
const onSubmit = () => {
    dataFormRef.value.validate((valid: boolean) => {
        if (!valid) {
            return false
        }
        loading.value = true
        useRefundApi({ payOrderId: form.orderId, refundAmount: form.amount, remark: form.remark, channelId: form.channelId }).then(() => {
            useMessage().success(t('common.addSuccessText'))
            visible.value = false // 关闭弹窗
            emit('refresh')
        }).catch((err: any) => {
            useMessage().error(err.msg)
        }).finally(() => {
            loading.value = false
        })
    })
}

// 初始化表单数据
const getpayTradeOrderData = (id: string) => {
    // 获取数据
    loading.value = true
    getObj(id).then((res: any) => {
        Object.assign(form, res.data)
    }).finally(() => {
        loading.value = false
    })
};

// 暴露变量
defineExpose({
    openDialog
});
</script>