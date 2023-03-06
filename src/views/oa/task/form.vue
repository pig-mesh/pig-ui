<template>
    <el-dialog :close-on-click-modal="false" :title="form.taskId ? $t('common.editBtn') : $t('common.addBtn')"
               draggable v-model="visible">
        <el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef"
                 v-loading="loading">
            <el-row :gutter="24">
                <el-col :span="24" class="mb20">
                    <el-form-item :label="t('leave.username')" prop="username">
                        <el-input :placeholder="t('leave.inputUsernameTip')" disabled v-model="form.username"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('leave.days')" prop="days">
                        <el-input-number :max="1000" :min="1" :placeholder="t('leave.inputDaysTip')" disabled
                                         v-model="form.days"></el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" class="mb20">
                    <el-form-item :label="t('leave.leaveTime')" prop="leaveTime">
                        <el-date-picker :placeholder="t('leave.inputLeaveTimeTip')" :value-format="dateTimeStr"
                                        disabled
                                        type="datetime" v-model="form.leaveTime"></el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="24" class="mb20">
                    <el-form-item :label="t('task.content')" prop="content">
                        <div v-html="form.content"></div>
                    </el-form-item>
                </el-col>

                <el-col :span="24" class="mb20">
                    <el-form-item :label="t('task.comment')" prop="comment">
                        <editor :placeholder="t('task.inputCommentTip')" v-model:get-html="form.comment"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button :key="flag" @click="handleTask(flag)" type="primary"
                   v-for="flag in form.flagList">{{ flag }}
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" name="OaLeaveBillDialog" setup>
    import {useMessage} from "/@/hooks/message";
    import {doTask, fetchDetail} from '/@/api/oa/task'
    import {useI18n} from "vue-i18n"
    import {useUserInfo} from "/@/stores/userInfo";
    import {rule} from "/@/utils/validate";

    const emit = defineEmits(['refresh']);


    const {t} = useI18n();

    // 定义变量内容
    const dataFormRef = ref();
    const visible = ref(false)
    const loading = ref(false)

    // 提交表单数据
    const form = reactive({
        taskId: '',
        taskName: '',
        username: '',
        comment: '',
        days: 0,
        content: '',
        createTime: '',
        time: '',
        flagList: [],
        taskFlag: '',
    });

    // 定义校验规则
    const dataRules = ref({
        comment: [{required: true, message: '批注不能为空', trigger: 'blur'}],
        username: [{required: true, message: '用户不能为空', trigger: 'blur'}],
        days: [{required: true, message: '请假天数不能为空', trigger: 'blur'},
            {validator: rule.number, trigger: 'blur'}],
        leaveTime: [{required: true, message: '请假时间不能为空', trigger: 'blur'}],
        content: [{required: true, message: '事由不能为空', trigger: 'blur'}],
    })

    // 打开弹窗
    const openDialog = (id: string) => {
        visible.value = true
        form.taskId = ''

        // 重置表单数据
        if (dataFormRef.value) {
            dataFormRef.value.resetFields()
        }

        // 获取oaLeaveBill信息
        if (id) {
            form.taskId = id
            getTaskById(id)
        } else {
            form.username = useUserInfo().userInfos.user.username
        }
    };

    // 提交
    const handleTask = (result) => {
        dataFormRef.value.validate((valid: boolean) => {
            if (!valid) {
                return false
            }
            loading.value = true
            form.taskFlag = result
            doTask(form).then(() => {
                useMessage().success(t('common.optSuccessText'))
                visible.value = false
                emit('refresh')
            })
        })
    }

    // 初始化表单数据
    const getTaskById = (id: string) => {
        // 获取数据
        loading.value = true
        fetchDetail(id).then((res: any) => {
            Object.assign(form, res.data)
            form.comment = res.data.comment ? res.data.comment : ''
        }).catch((err) => {
            useMessage().error('操作失败')
        }).finally(() => {
            loading.value = false
        })
    };

    // 暴露变量
    defineExpose({
        openDialog
    });
</script>