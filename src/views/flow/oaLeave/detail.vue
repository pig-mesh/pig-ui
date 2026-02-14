<template>
      <div class="layout-padding-auto layout-padding-view ">
   <el-card shadow="hover" header="请假申请详情" :class="className" v-loading="loading">
        <template #header>
          <span>请假申请详情</span>
        </template>
        
        <el-descriptions :column="1" border>
          <el-descriptions-item label="申请人用户名">
            {{ detailData.username }}
          </el-descriptions-item>
          <el-descriptions-item label="请假类型">
            <el-tag :type="getTypeTagType(detailData.leaveType)">
              {{ getTypeLabel(detailData.leaveType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="请假原因">
            <div class="whitespace-pre-wrap break-words">{{ detailData.leaveReason }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ parseTime(detailData.startTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ parseTime(detailData.endTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="请假天数">
            <el-tag type="info">{{ detailData.leaveDay }} 天</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="请假状态">
            <el-tag :type="getStatusTagType(detailData.leaveStatus)">
              {{ getStatusLabel(detailData.leaveStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="流程实例编号">
            {{ detailData.processInstanceId || '暂无' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      </div>
</template>

<script setup lang="ts" name="OaLeaveDetail">
// ========== 1. 导入语句 ==========
import { useMessage } from "/@/hooks/message";
import { getObj } from '/@/api/flow/oaLeave';
import { useRoute } from 'vue-router';

// ========== 2. Props 定义 ==========
interface Props {
  id?: string;
  businessKey?: string;
  processInstanceId?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: true
});

// ========== 3. 响应式数据定义 ==========
const loading = ref(false);
const route = useRoute();
const className = ref(route.query.class as string);
const detailData = ref({
  id: '',
  username: '',
  leaveType: '',
  leaveReason: '',
  startTime: '',
  endTime: '',
  leaveDay: 0,
  leaveStatus: '',
  processInstanceId: '',
});

// ========== 4. 方法定义 ==========
// 获取详情数据
const getDetailData = async (id?: string, processInstanceId?: string) => {
  try {
    loading.value = true;
    const { data } = await getObj({ id, processInstanceId });
    // 直接将第一条数据赋值给详情数据
    Object.assign(detailData.value, data[0]);
  } catch (error) {
    useMessage().error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 获取请假类型标签
const getTypeLabel = (type: number | string) => {
  const typeMap: Record<string, string> = {
    '1': '事假',
    '2': '病假', 
    '3': '年假',
    '4': '调休'
  };
  return typeMap[String(type)] || String(type);
};

// 获取请假类型标签类型
const getTypeTagType = (type: number | string) => {
  const typeMap: Record<string, string> = {
    '1': 'warning',
    '2': 'danger',
    '3': 'success', 
    '4': 'info'
  };
  return typeMap[String(type)] || 'primary';
};

// 获取状态标签
const getStatusLabel = (status: number | string) => {
  const statusMap: Record<string, string> = {
    '0': '待审批',
    '1': '进行中',
    '2': '已结束'
  };
  return statusMap[String(status)] || String(status) || '待审批';
};

// 获取状态标签类型
const getStatusTagType = (status: number | string) => {
  const statusMap: Record<string, string> = {
    '0': 'warning',
    '1': 'success',
    '2': 'danger',
    '3': 'info'
  };
  return statusMap[String(status)] || 'warning';
};



// ========== 5. 生命周期 ==========
onMounted(() => {
  // 优先使用 props 中的 id 或 businessKey，如果没有则使用路由参数
  const id = props.id || (route.query.id as string);
  const processInstanceId = props.processInstanceId;
  if (id || processInstanceId) {
    getDetailData(id,processInstanceId);
  } else {
    useMessage().error('缺少必要的参数');
  }
});
</script>
