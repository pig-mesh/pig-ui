<template>
    <el-dialog :close-on-click-modal="false" :title="form.orderId ? $t('common.editBtn') : $t('common.addBtn')"
               draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef"
                 v-loading="loading">
            <el-row :gutter="24">

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.orderId')" prop="orderId">
                        <el-input :placeholder="t('trade.inputOrderIdTip')" v-model="form.orderId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.channelId')" prop="channelId">
                        <el-input :placeholder="t('trade.inputChannelIdTip')" v-model="form.channelId"/>
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
                    <el-form-item :label="t('trade.body')" prop="body">
                        <el-input :placeholder="t('trade.inputBodyTip')" v-model="form.body"/>
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
                        <el-select v-model="form.status" :placeholder="t('trade.inputStatusTip')">
                            <el-option :key="item.value" :label="item.label" :value="item.value"
                                       v-for="item in dictType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.clientIp')" prop="clientIp">
                        <el-input :placeholder="t('trade.inputClientIpTip')" v-model="form.clientIp"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('trade.paySuccTime')" prop="paySuccTime">
                            <el-input :placeholder="t('trade.inputPaySuccTimeTip')" v-model="form.paySuccTime"/>
                    </el-form-item>
                </el-col>



<!--                <el-col :span="12" class="mb20">-->
<!--                    <el-form-item :label="t('trade.paySuccTime')" prop="paySuccTime">-->
<!--                    <el-date-picker-->
<!--                            :label="t('trade.paySuccTime')"-->
<!--                            v-model="form.paySuccTime"-->
<!--                            type="datetime"-->
<!--                            :placeholder="t('trade.inputPaySuccTimeTip')"-->
<!--                            align="right"-->
<!--                            :picker-options="pickerOptions">-->
<!--                    </el-date-picker>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->

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

    const dictType = ref([
        {
            label: '订单生成',
            value: '0'
        }, {
            label: '支付中（未使用）',
            value: '1'
        }, {
            label: '支付成功',
            value: '2'
        },
        {
            label: '业务处理完成',
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