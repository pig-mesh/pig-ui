<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <!-- 搜索条件区域 -->
      <el-row shadow="hover" v-show="showSearch" class="ml-2.5">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="申请人" prop="username">
            <el-input placeholder="请输入申请人" v-model="state.queryForm.username" clearable />
          </el-form-item>
          <el-form-item label="请假类型" prop="leaveType">
            <el-select v-model="state.queryForm.leaveType" placeholder="请选择请假类型" clearable>
              <el-option label="事假" :value="1" />
              <el-option label="病假" :value="2" />
              <el-option label="年假" :value="3" />
              <el-option label="调休" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="请假结果" prop="leaveStatus">
            <el-select v-model="state.queryForm.leaveStatus" placeholder="请选择请假结果" clearable>
              <el-option label="待审批" :value="0" />
              <el-option label="进行中" :value="1" />
              <el-option label="已结束" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!-- 操作按钮区域 -->
      <el-row>
        <div class="mb-2 w-full">
          <el-button 
            icon="folder-add" 
            type="primary" 
            class="ml-2.5"
            @click="handleCreate"
            v-auth="'flow_bpmOaLeave_add'"
          >
            新增
          </el-button>

          <el-button 
            plain 
            :disabled="multiple" 
            icon="Delete" 
            type="primary"
            v-auth="'flow_bpmOaLeave_del'" 
            @click="handleDelete(selectObjs)"
          >
            删除
          </el-button>
          <right-toolbar
            v-model:showSearch="showSearch"
            :export="'flow_bpmOaLeave_export'"
            @exportExcel="exportExcel"
            class="ml-2.5 mr-5 float-right"
            @queryTable="getDataList"
          />
        </div>
      </el-row>

      <!-- 数据表格区域 -->
      <el-table 
        :data="state.dataList" 
        v-loading="state.loading" 
        border 
        :cell-style="tableStyle.cellStyle" 
        :header-cell-style="tableStyle.headerCellStyle"
        @selection-change="selectionChangHandle"
        @sort-change="sortChangeHandle"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" label="#" width="60" />
        <el-table-column 
          prop="username" 
          label="申请人" 
          show-overflow-tooltip
        />
        <el-table-column 
          prop="leaveType" 
          label="请假类型" 
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-tag type="primary" size="small">
              {{ getTypeLabel(scope.row.leaveType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          prop="leaveReason" 
          label="请假原因" 
          show-overflow-tooltip
        />
        <el-table-column 
          prop="startTime" 
          label="开始时间" 
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ parseDate(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="endTime" 
          label="结束时间" 
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ parseDate(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="leaveDay" 
          label="请假天数" 
          show-overflow-tooltip
        />
        <el-table-column 
          prop="leaveStatus" 
          label="请假结果" 
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-tag 
              :type="scope.row.leaveStatus === 2 ? 'success' : scope.row.leaveStatus === 1 ? 'warning' : 'info'" 
              size="small"
            >
              {{ getStatusLabel(scope.row.leaveStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          prop="processInstanceId" 
          label="流程实例" 
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              icon="view" 
              text 
              type="primary" 
              @click="handleDetail(scope.row.id)"
            >
              详情
            </el-button>
            <el-button 
              icon="edit-pen" 
              text 
              type="primary" 
              v-auth="'flow_bpmOaLeave_edit'"
              @click="handleEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button 
              icon="delete" 
              text 
              type="primary" 
              v-auth="'flow_bpmOaLeave_del'" 
              @click="handleDelete([scope.row.id])"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination 
        @size-change="sizeChangeHandle" 
        @current-change="currentChangeHandle" 
        v-bind="state.pagination" 
      />
    </div>

    <!-- 编辑、新增弹窗已移除，改为路由跳转 -->


  </div>
</template>

<script setup lang="ts" name="systemOaLeave">
// ========== 导入声明 ==========
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/flow/oaLeave";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from '/@/hooks/dict';
import { useRouter } from 'vue-router';

// ========== 路由实例 ==========
const router = useRouter();

// ========== 格式化函数 ==========
const getTypeLabel = (type: number | string) => {
  const typeMap: Record<string, string> = {
    '1': '事假',
    '2': '病假', 
    '3': '年假',
    '4': '调休'
  };
  return typeMap[String(type)] || String(type);
};

const getStatusLabel = (status: number | string) => {
  const statusMap: Record<string, string> = {
    '0': '待审批',
    '1': '进行中',
    '2': '已结束'
  };
  return statusMap[String(status)] || String(status) || '待审批';
};

// ========== 组件引用 ==========

const queryRef = ref();               // 查询表单引用

// ========== 响应式数据 ==========
const showSearch = ref(true);         // 是否显示搜索区域
const selectObjs = ref([]) as any;    // 表格多选数据
const multiple = ref(true);           // 是否多选

// ========== 表格状态 ==========
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    username: '',        // 申请人
    leaveType: '',       // 请假类型
    leaveStatus: ''      // 请假结果
  },    
  descs: ['create_time'],
  pageList: fetchList // 分页查询方法
});

// ========== Hook引用 ==========
// 表格相关Hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state);

// ========== 方法定义 ==========
/**
 * 新增操作
 */
const handleCreate = () => {
  router.push({
    path: '/flow/oaLeave/create',
    query: { tagsViewName: '新增', class: 'w-full lg:max-w-[50%] mx-auto px-4 py-6' },
  });
};

/**
 * 详情操作
 * @param id 查看的数据ID
 */
const handleDetail = (id: string) => {
  router.push({
    path: '/flow/oaLeave/detail',
    query: { id, tagsViewName: '详情', class: 'w-full lg:max-w-[50%] mx-auto px-4 py-6' }
  });
};

/**
 * 编辑操作
 * @param id 编辑的数据ID
 */
const handleEdit = (id: string) => {
  router.push({
    path: '/flow/oaLeave/create',
    query: { id, tagsViewName: '编辑', class: 'w-full lg:max-w-[50%] mx-auto px-4 py-6' }
  });
};

/**
 * 重置查询条件
 */
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields();
  // 手动清空查询表单
  state.queryForm = {
    username: '',
    leaveType: '',
    leaveStatus: ''
  };
  // 清空多选
  selectObjs.value = [];
  // 重新查询
  getDataList();
};

/**
 * 导出Excel文件
 */
const exportExcel = () => {
  downBlobFile(
    '/flow/bpmOaLeave/export',
    { ...state.queryForm, ids: selectObjs.value },
    'oaLeave.xlsx'
  );
};

/**
 * 表格多选事件处理
 * @param objs 选中的数据行
 */
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id);
  multiple.value = !objs.length;
};

/**
 * 删除数据处理
 * @param ids 要删除的数据ID数组
 */
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
