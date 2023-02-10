<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             :title="form.jobId ? $t('common.editBtn') : $t('common.addBtn')" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.jobName')" prop="jobName">
            <el-input v-model="form.jobName" :placeholder="t('job.inputjobNameTip')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.jobGroup')" prop="jobGroup">
            <el-input v-model="form.jobGroup" :placeholder="t('job.inputjobGroupTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.jobType')" prop="jobType">
            <el-select v-model="form.jobType" :placeholder="t('job.jobType')">
              <el-option v-for="(item, index) in job_type" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.executePath')" prop="executePath">
            <el-input v-model="form.executePath" :placeholder="t('job.inputexecutePathTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.className')" prop="className">
            <el-input v-model="form.className" :placeholder="t('job.inputclassNameTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.methodName')" prop="methodName">
            <el-input v-model="form.methodName" :placeholder="t('job.inputmethodNameTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.methodParamsValue')" prop="methodParamsValue">
            <el-input v-model="form.methodParamsValue" :placeholder="t('job.inputmethodParamsValueTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.cronExpression')" prop="cronExpression">
            <el-popover ref="cronPopover" :width="550" trigger="click" placement="left" :visible="popoverVisible">
              <template #default>
                <crontab @fill="changeCron" @hide="popoverVis(false)" :expression="form.cronExpression"></crontab>
              </template>

              <template #reference>
                <el-input v-model="form.cronExpression" :placeholder="t('job.inputcronExpressionTip')" @click="popoverVis(true)"/>
              </template>
            </el-popover>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('job.misfirePolicy')" prop="misfirePolicy">
            <el-select v-model="form.misfirePolicy" :placeholder="t('job.inputmisfirePolicyTip')">
              <el-option v-for="(item, index) in misfire_policy" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('job.remark')" prop="remark">
            <el-input v-model="form.remark" :placeholder="t('job.inputremarkTip')"  type="textarea"/>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button formDialogRef @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button formDialogRef type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysJobDialog" setup>
// 定义子组件向父组件传值/事件
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj} from '/@/api/daemon/job'
import {useI18n} from "vue-i18n"

const emit = defineEmits(['refresh']);
const Crontab = defineAsyncComponent(() => import('/@/components/Crontab/index.vue'))

const {t} = useI18n();

// 定义变量内容
const dataFormRef = ref();
const cronPopover = ref();
const visible = ref(false)
// 定义字典
const {job_status, job_execute_status,misfire_policy,job_type} = useDict('job_status', 'job_execute_status','misfire_policy','job_type')

// 提交表单数据
const form = reactive({
  jobId: '',
  jobName: '',
  jobGroup: '',
  jobType: '',
  executePath: '',
  className: '',
  methodName: '',
  methodParamsValue: '',
  cronExpression: '',
  misfirePolicy: '',
  jobStatus: '',
  jobExecuteStatus: '',
  remark: '',
});

const changeCron = (e: string) => {
  form.cronExpression = e
}

const popoverVis = (bol: boolean) => {
  popoverVisible.value = bol
}

const popoverVisible = ref(false)
// 定义校验规则
const dataRules = reactive({
  jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  jobGroup: [{ required: true, message: '任务组名不能为空', trigger: 'blur' }],
  jobType: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
  cronExpression: [{ required: true, message: 'cron不能为空', trigger: 'blur' }],
  misfirePolicy: [{ required: true, message: '策略不能为空', trigger: 'blur' }],

})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.jobId = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取sysJob信息
  if (id) {
    form.jobId = id
    getsysJobData(id)
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 更新
    if (form.jobId) {
      putObj(form).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    } else {
      addObj(form).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    }
  })
}

// 初始化表单数据
const getsysJobData = (id: string) => {
  // 获取数据
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
