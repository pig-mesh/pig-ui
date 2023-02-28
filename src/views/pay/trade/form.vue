<template>
    <el-dialog :close-on-click-modal="false" :title="form.orderId ? $t('common.editBtn') : $t('common.addBtn')"
               draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef"
                 v-loading="loading">
            <el-row :gutter="24">
                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelId')" prop="channelId">
                        <el-input :placeholder="t('trade.inputChannelIdTip')" v-model="form.channelId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.amount')" prop="amount">
                        <el-input :placeholder="t('trade.inputAmountTip')" v-model="form.amount"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.currency')" prop="currency">
                        <el-input :placeholder="t('trade.inputCurrencyTip')" v-model="form.currency"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.status')" prop="status">
                        <el-input-number :max="1000" :min="1" :placeholder="t('trade.inputStatusTip')"
                                         v-model="form.status"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.clientIp')" prop="clientIp">
                        <el-input :placeholder="t('trade.inputClientIpTip')" v-model="form.clientIp"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.device')" prop="device">
                        <el-input :placeholder="t('trade.inputDeviceTip')" v-model="form.device"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.subject')" prop="subject">
                        <el-input :placeholder="t('trade.inputSubjectTip')" v-model="form.subject"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.body')" prop="body">
                        <el-input :placeholder="t('trade.inputBodyTip')" v-model="form.body"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.extra')" prop="extra">
                        <el-input :placeholder="t('trade.inputExtraTip')" v-model="form.extra"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelMchId')" prop="channelMchId">
                        <el-input :placeholder="t('trade.inputChannelMchIdTip')" v-model="form.channelMchId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelOrderNo')" prop="channelOrderNo">
                        <el-input :placeholder="t('trade.inputChannelOrderNoTip')" v-model="form.channelOrderNo"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.errCode')" prop="errCode">
                        <el-input :placeholder="t('trade.inputErrCodeTip')" v-model="form.errCode"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.errMsg')" prop="errMsg">
                        <el-input :placeholder="t('trade.inputErrMsgTip')" v-model="form.errMsg"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.param1')" prop="param1">
                        <el-input :placeholder="t('trade.inputParam1Tip')" v-model="form.param1"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.param2')" prop="param2">
                        <el-input :placeholder="t('trade.inputParam2Tip')" v-model="form.param2"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.notifyUrl')" prop="notifyUrl">
                        <el-input :placeholder="t('trade.inputNotifyUrlTip')" v-model="form.notifyUrl"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.notifyCount')" prop="notifyCount">
                        <el-input-number :max="1000" :min="1" :placeholder="t('trade.inputNotifyCountTip')"
                                         v-model="form.notifyCount"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.lastNotifyTime')" prop="lastNotifyTime">
                        <el-input-number :max="1000" :min="1" :placeholder="t('trade.inputLastNotifyTimeTip')"
                                         v-model="form.lastNotifyTime"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.expireTime')" prop="expireTime">
                        <el-input-number :max="1000" :min="1" :placeholder="t('trade.inputExpireTimeTip')"
                                         v-model="form.expireTime"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.paySuccTime')" prop="paySuccTime">
                        <el-input-number :max="1000" :min="1" :placeholder="t('trade.inputPaySuccTimeTip')"
                                         v-model="form.paySuccTime"></el-input-number>
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

<script lang="ts" name="PayTradeOrderDialog" setup>
    // 定义子组件向父组件传值/事件
    import {useMessage} from "/@/hooks/message";
    import {addObj, getObj, putObj} from '/@/api/pay/trade'
    import {useI18n} from "vue-i18n"

    const emit = defineEmits(['refresh']);

    const {t} = useI18n();

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
    });

    // 定义校验规则
    const dataRules = ref({})

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
            // 更新
            if (form.orderId) {
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