<template>
    <el-dialog :close-on-click-modal="false" :title="form.refundOrderId ? $t('common.editBtn') : $t('common.addBtn')"
        draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
            <el-row :gutter="24">
                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.payOrderId')" prop="payOrderId">
                        <el-input :placeholder="t('refund.inputPayOrderIdTip')" v-model="form.payOrderId" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelPayOrderNo')" prop="channelPayOrderNo">
                        <el-input :placeholder="t('refund.inputChannelPayOrderNoTip')" v-model="form.channelPayOrderNo" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.mchId')" prop="mchId">
                        <el-input :placeholder="t('refund.inputMchIdTip')" v-model="form.mchId" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.mchRefundNo')" prop="mchRefundNo">
                        <el-input :placeholder="t('refund.inputMchRefundNoTip')" v-model="form.mchRefundNo" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelId')" prop="channelId">
                        <el-input :placeholder="t('refund.inputChannelIdTip')" v-model="form.channelId" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.payAmount')" prop="payAmount">
                        <el-input :placeholder="t('refund.inputPayAmountTip')" v-model="form.payAmount" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.refundAmount')" prop="refundAmount">
                        <el-input-number :max="1000" :min="1" :placeholder="t('refund.inputRefundAmountTip')"
                            v-model="form.refundAmount"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.currency')" prop="currency">
                        <el-input :placeholder="t('refund.inputCurrencyTip')" v-model="form.currency" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.status')" prop="status">
                        <el-input-number :max="1000" :min="1" :placeholder="t('refund.inputStatusTip')"
                            v-model="form.status"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.status')" prop="status">
                        <el-select :placeholder="t('refund.inputStatusTip')" v-model="form.status">
                            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>


                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.result')" prop="result">
                        <el-select :placeholder="t('refund.inputResultTip')" v-model="form.result">
                            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictResult">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>


                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.clientIp')" prop="clientIp">
                        <el-input :placeholder="t('refund.inputClientIpTip')" v-model="form.clientIp" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.device')" prop="device">
                        <el-input :placeholder="t('refund.inputDeviceTip')" v-model="form.device" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.remark')" prop="remark">
                        <el-input :placeholder="t('refund.inputRemarkTip')" v-model="form.remark" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelUser')" prop="channelUser">
                        <el-input :placeholder="t('refund.inputChannelUserTip')" v-model="form.channelUser" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.username')" prop="username">
                        <el-input :placeholder="t('refund.inputUsernameTip')" v-model="form.username" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelMchId')" prop="channelMchId">
                        <el-input :placeholder="t('refund.inputChannelMchIdTip')" v-model="form.channelMchId" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelOrderNo')" prop="channelOrderNo">
                        <el-input :placeholder="t('refund.inputChannelOrderNoTip')" v-model="form.channelOrderNo" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelErrCode')" prop="channelErrCode">
                        <el-input :placeholder="t('refund.inputChannelErrCodeTip')" v-model="form.channelErrCode" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.channelErrMsg')" prop="channelErrMsg">
                        <el-input :placeholder="t('refund.inputChannelErrMsgTip')" v-model="form.channelErrMsg" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.extra')" prop="extra">
                        <el-input :placeholder="t('refund.inputExtraTip')" v-model="form.extra" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.notifyUrl')" prop="notifyUrl">
                        <el-input :placeholder="t('refund.inputNotifyUrlTip')" v-model="form.notifyUrl" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.param1')" prop="param1">
                        <el-input :placeholder="t('refund.inputParam1Tip')" v-model="form.param1" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.param2')" prop="param2">
                        <el-input :placeholder="t('refund.inputParam2Tip')" v-model="form.param2" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.expireTime')" prop="expireTime">
                        <el-date-picker :placeholder="t('refund.inputExpireTimeTip')" :value-format="dateTimeStr"
                            type="datetime" v-model="form.expireTime"></el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('refund.refundSuccTime')" prop="refundSuccTime">
                        <el-date-picker :placeholder="t('refund.inputRefundSuccTimeTip')" :value-format="dateTimeStr"
                            type="datetime" v-model="form.refundSuccTime"></el-date-picker>
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
import { useMessage } from "/@/hooks/message";
import { addObj, getObj, putObj } from '/@/api/pay/refund'
import { useI18n } from "vue-i18n"

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
    refundOrderId: '',
    payOrderId: '',
    channelPayOrderNo: '',
    mchId: '',
    mchRefundNo: '',
    channelId: '',
    payAmount: '',
    refundAmount: '',
    currency: '',
    status: '',
    result: '',
    clientIp: '',
    device: '',
    remark: '',
    channelUser: '',
    username: '',
    channelMchId: '',
    channelOrderNo: '',
    channelErrCode: '',
    channelErrMsg: '',
    extra: '',
    notifyUrl: '',
    param1: '',
    param2: '',
    expireTime: '',
    refundSuccTime: '',
});

// 定义校验规则
const dataRules = ref({})

// 打开弹窗
const openDialog = (id: string) => {
    visible.value = true
    form.refundOrderId = ''

    // 重置表单数据
    if (dataFormRef.value) {
        dataFormRef.value.resetFields()
    }

    // 获取payRefundOrder信息
    if (id) {
        form.refundOrderId = id
        getpayRefundOrderData(id)
    }
};
const dictType = ref([
    {
        label: '订单生成',
        value: '0'
    }, {
        label: '退款中',
        value: '1'
    }, {
        label: '退款成功',
        value: '2'
    },
    {
        label: '退款失败',
        value: '3'
    },
    {
        label: '业务处理完成',
        value: '4'
    },
])
const dictResult = ref([
    {
        label: '不确认结果',
        value: '0'
    }, {
        label: '等待手动处理',
        value: '1'
    }, {
        label: '确认成功',
        value: '2'
    },
    {
        label: '确认失败',
        value: '3'
    },
])

// 提交
const onSubmit = () => {
    dataFormRef.value.validate((valid: boolean) => {
        if (!valid) {
            return false
        }
        // 更新
        if (form.refundOrderId) {
            loading.value = true
            putObj(form).then(() => {
                useMessage().success(t('common.editSuccessText'))
                visible.value = false // 关闭弹窗
                emit('refresh')
            }).catch((err: any) => {
                useMessage().error(err.msg)
            }).finally(() => {
                loading.value = false
            })
        } else {
            loading.value = true
            addObj(form).then(() => {
                useMessage().success(t('common.addSuccessText'))
                visible.value = false // 关闭弹窗
                emit('refresh')
            }).catch((err: any) => {
                useMessage().error(err.msg)
            }).finally(() => {
                loading.value = false
            })
        }
    })
}

// 初始化表单数据
const getpayRefundOrderData = (id: string) => {
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