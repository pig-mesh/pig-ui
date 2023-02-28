<template>
    <el-dialog :close-on-click-modal="false" :title="form.refundOrderId ? $t('common.editBtn') : $t('common.addBtn')"
               draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef"
                 v-loading="loading">
            <el-row :gutter="24">
                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.payOrderId')" prop="payOrderId">
                        <el-input :placeholder="t('order.inputPayOrderIdTip')" v-model="form.payOrderId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelPayOrderNo')" prop="channelPayOrderNo">
                        <el-input :placeholder="t('order.inputChannelPayOrderNoTip')" v-model="form.channelPayOrderNo"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.mchId')" prop="mchId">
                        <el-input :placeholder="t('order.inputMchIdTip')" v-model="form.mchId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.mchRefundNo')" prop="mchRefundNo">
                        <el-input :placeholder="t('order.inputMchRefundNoTip')" v-model="form.mchRefundNo"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelId')" prop="channelId">
                        <el-input :placeholder="t('order.inputChannelIdTip')" v-model="form.channelId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.payAmount')" prop="payAmount">
                        <el-input :placeholder="t('order.inputPayAmountTip')" v-model="form.payAmount"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.refundAmount')" prop="refundAmount">
                        <el-input-number :max="1000" :min="1" :placeholder="t('order.inputRefundAmountTip')"
                                         v-model="form.refundAmount"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.currency')" prop="currency">
                        <el-input :placeholder="t('order.inputCurrencyTip')" v-model="form.currency"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.status')" prop="status">
                        <el-input-number :max="1000" :min="1" :placeholder="t('order.inputStatusTip')"
                                         v-model="form.status"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.result')" prop="result">
                        <el-input-number :max="1000" :min="1" :placeholder="t('order.inputResultTip')"
                                         v-model="form.result"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.clientIp')" prop="clientIp">
                        <el-input :placeholder="t('order.inputClientIpTip')" v-model="form.clientIp"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.device')" prop="device">
                        <el-input :placeholder="t('order.inputDeviceTip')" v-model="form.device"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.remark')" prop="remark">
                        <el-input :placeholder="t('order.inputRemarkTip')" v-model="form.remark"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelUser')" prop="channelUser">
                        <el-input :placeholder="t('order.inputChannelUserTip')" v-model="form.channelUser"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.username')" prop="username">
                        <el-input :placeholder="t('order.inputUsernameTip')" v-model="form.username"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelMchId')" prop="channelMchId">
                        <el-input :placeholder="t('order.inputChannelMchIdTip')" v-model="form.channelMchId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelOrderNo')" prop="channelOrderNo">
                        <el-input :placeholder="t('order.inputChannelOrderNoTip')" v-model="form.channelOrderNo"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelErrCode')" prop="channelErrCode">
                        <el-input :placeholder="t('order.inputChannelErrCodeTip')" v-model="form.channelErrCode"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.channelErrMsg')" prop="channelErrMsg">
                        <el-input :placeholder="t('order.inputChannelErrMsgTip')" v-model="form.channelErrMsg"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.extra')" prop="extra">
                        <el-input :placeholder="t('order.inputExtraTip')" v-model="form.extra"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.notifyUrl')" prop="notifyUrl">
                        <el-input :placeholder="t('order.inputNotifyUrlTip')" v-model="form.notifyUrl"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.param1')" prop="param1">
                        <el-input :placeholder="t('order.inputParam1Tip')" v-model="form.param1"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.param2')" prop="param2">
                        <el-input :placeholder="t('order.inputParam2Tip')" v-model="form.param2"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.expireTime')" prop="expireTime">
                        <el-date-picker :placeholder="t('order.inputExpireTimeTip')" :value-format="dateTimeStr"
                                        type="datetime" v-model="form.expireTime"></el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('order.refundSuccTime')" prop="refundSuccTime">
                        <el-date-picker :placeholder="t('order.inputRefundSuccTimeTip')" :value-format="dateTimeStr"
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
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    import {useMessage} from "/@/hooks/message";
    import {addObj, getObj, putObj} from '/@/api/pay/refund'
    import {useI18n} from "vue-i18n"

    const {t} = useI18n();

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