<template>
  <div class="layout-padding-auto layout-padding-view">
    <div :class="className">
      <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="24" :md="12" class="mt-8 md:mb-0">
            <el-form-item label="申请人" prop="username">
              <el-input v-model="formData.username" disabled placeholder="请输入申请人用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" class="mt-8 md:mb-0">
            <el-form-item label="请假天数" prop="leaveDay">
              <el-input-number disabled v-model="formData.leaveDay" :min="1" :max="365" :step="15" placeholder="请输入请假天数"
                class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="请假类型" class="mt-4" prop="leaveType">
          <el-select v-model="formData.leaveType" placeholder="请选择请假类型" clearable class="w-full">
            <el-option label="事假" :value="1" />
            <el-option label="病假" :value="2" />
            <el-option label="年假" :value="3" />
            <el-option label="调休" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="请假原因" prop="leaveReason">
          <el-input v-model="formData.leaveReason" type="textarea" :rows="3" placeholder="请输入请假原因" />
        </el-form-item>

        <el-row :gutter="20" class="flex-col md:flex-row">
          <el-col :span="24" :md="12" class="mb-8 md:mb-0">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="formData.startTime" type="datetime" placeholder="请选择开始时间"
                :value-format="dateTimeStr" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择结束时间"
                :value-format="dateTimeStr" class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="mt-6 text-center">
          <div class="flex items-center justify-center w-full gap-4">
            <el-button type="primary" @click="submitForm" :loading="formLoading" :disabled="formLoading">
              {{ isEdit ? '更新' : '提交申请' }}
            </el-button>
            <el-button @click="handleCancel">
              取消
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="OaLeaveCreate">
// ========== 1. 导入语句 ==========
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/flow/oaLeave';
import { useRouter, useRoute } from 'vue-router';
import { useUserInfo } from '/@/stores/userInfo';

// ========== 2. Props 定义 ==========
const props = defineProps<{
  flowHelper?: any;
  processInstanceId?: string;
  readonly?: boolean;
}>();

// ========== 3. 组件定义 ==========
const router = useRouter();
const route = useRoute();

// ========== 4. 响应式数据定义 ==========
// 基础响应式变量
const formRef = ref(); // 表单引用
const formLoading = ref(false); // 加载状态
const isEdit = ref(false); // 是否编辑模式
const className = ref(route.query.class as string);

// 表单数据对象
const formData = reactive({
  id: '', // 主键
  username: '', // 申请人用户名
  leaveType: '', // 请假类型
  leaveReason: '', // 请假原因
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  leaveDay: 0, // 请假天数
  leaveStatus: '0', // 请假结果
  processInstanceId: '', // 流程实例的编号
});

// ========== 4. 常量定义 ==========
const dateTimeStr = 'YYYY-MM-DD HH:mm:ss';

// ========== 5. 表单校验规则 ==========
const formRules = ref({
  username: [
    { required: true, message: '申请人用户名不能为空', trigger: 'blur' }
  ],
  leaveType: [
    { required: true, message: '请假类型不能为空', trigger: 'change' }
  ],
  leaveReason: [
    { required: true, message: '请假原因不能为空', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'change' }
  ],
  leaveDay: [
    { required: true, message: '请假天数不能为空', trigger: 'blur' },
    { type: 'number', min: 1, message: '请假天数至少为1天', trigger: 'blur' }
  ]
});

// ========== 6. 方法定义 ==========
// 获取详情数据（支持通过 id 或 processInstanceId 查询）
const getOaLeaveData = async (params: { id?: string; processInstanceId?: string }) => {
  try {
    formLoading.value = true;
    const { data } = await getObj(params);
    if (data?.length > 0) {
      Object.assign(formData, data[0]);
    }
  } catch (error) {
    useMessage().error('获取数据失败');
  } finally {
    formLoading.value = false;
  }
};

// 提交表单方法
const submitForm = async () => {
  formLoading.value = true; // 防止重复提交

  // 1. 表单校验
  const valid = await formRef.value.validate().catch(() => { });
  if (!valid) {
    formLoading.value = false;
    return false;
  }

  // 2. 审批人校验（使用父组件提供的方法）
  if (props.flowHelper && !props.flowHelper.validate()) {
    formLoading.value = false;
    return false;
  }

  try {
    // 3. 准备提交数据（合并流程数据）
    let submitData: Record<string, any> = { ...formData };

    if (props.flowHelper) {
      const flowData = props.flowHelper.getFlowData();
      submitData = {
        ...submitData,
        ...flowData  // 包含 flowParamMap（审批人信息）
      };
    }

    // 4. 根据是否有ID判断是新增还是修改
    if (isEdit.value) {
      await putObj(submitData);
      useMessage().success('修改成功');
    } else {
      await addObj(submitData);
      useMessage().success('申请提交成功');
    }

    // 5. 跳转回列表页
    if (!props.processInstanceId) {
      router.push('/flow/oaLeave/index');
    }
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    formLoading.value = false;
  }
};

// 取消操作
const handleCancel = () => {
  router.back();
};

// 计算请假天数
const calculateDays = () => {
  if (formData.startTime && formData.endTime) {
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    formData.leaveDay = diffDays;
  }
};

// ========== 7. 生命周期和监听器 ==========
// 监听时间变化，自动计算天数
watch([() => formData.startTime, () => formData.endTime], () => {
  calculateDays();
});

// 页面初始化
onMounted(() => {
  const id = route.query.id as string;

  if (id) {
    // 通过路由参数获取数据（常规编辑模式）
    isEdit.value = true;
    formData.id = id;
    getOaLeaveData({ id });
  } else if (props.processInstanceId) {
    // 通过 processInstanceId 获取数据（重新提交场景）
    isEdit.value = true;
    getOaLeaveData({ processInstanceId: props.processInstanceId });
  }

  // 设置默认申请人用户名
  if (!formData.username) {
    formData.username = useUserInfo().userInfos.user.username;
  }
});
</script>
