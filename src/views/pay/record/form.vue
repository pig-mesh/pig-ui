<template>
    <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')"
               draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef"
                 v-loading="loading">
            <el-row :gutter="24">
                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('record.notifyId')" prop="notifyId">
                        <el-input :placeholder="t('record.inputNotifyIdTip')" v-model="form.notifyId"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('record.request')" prop="request">
                        <el-input :placeholder="t('record.inputRequestTip')" v-model="form.request"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('record.response')" prop="response">
                        <el-input :placeholder="t('record.inputResponseTip')" v-model="form.response"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('record.orderNo')" prop="orderNo">
                        <el-input :placeholder="t('record.inputOrderNoTip')" v-model="form.orderNo"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('record.httpStatus')" prop="httpStatus">
                        <el-input :placeholder="t('record.inputHttpStatusTip')" v-model="form.httpStatus"/>
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

<script lang="ts" name="PayNotifyRecordDialog" setup>
    // 定义子组件向父组件传值/事件
    import {useMessage} from "/@/hooks/message";
    import {addObj, getObj, putObj} from '/@/api/pay/record'
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
        id: '',
        notifyId: '',
        request: '',
        response: '',
        orderNo: '',
        httpStatus: '',
    });

    // 定义校验规则
    const dataRules = ref({
        request: [{required: true, message: '${field.fieldComment}不能为空', trigger: 'blur'}],
        response: [{required: true, message: '${field.fieldComment}不能为空', trigger: 'blur'}],
        httpStatus: [{required: true, message: '${field.fieldComment}不能为空', trigger: 'blur'}]
    })

    // 打开弹窗
    const openDialog = (id: string) => {
        visible.value = true
        form.id = ''

        // 重置表单数据
        if (dataFormRef.value) {
            dataFormRef.value.resetFields()
        }

        // 获取payNotifyRecord信息
        if (id) {
            form.id = id
            getpayNotifyRecordData(id)
        }
    };

    // 提交
    const onSubmit = () => {
        dataFormRef.value.validate((valid: boolean) => {
            if (!valid) {
                return false
            }
            // 更新
            if (form.id) {
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
    const getpayNotifyRecordData = (id: string) => {
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