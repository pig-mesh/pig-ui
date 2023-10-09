<template>
  <el-table
      ref="tableRef"
      :data="state.dataList"
      v-loading="state.loading"
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
      :cell-style="tableStyle.cellStyle"
      :header-cell-style="tableStyle?.headerCellStyle"
  >
    <el-table-column :label="$t('sysdept.name')" prop="name" width="400" show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('sysdept.weight')" prop="weight" show-overflow-tooltip width="80"></el-table-column>
    <el-table-column prop="createTime" :label="$t('sysdept.createTime')" show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('common.action')" show-overflow-tooltip width="250">
      <template #default="scope">
        <el-button text type="primary" icon="folder-add" @click="deptDialogRef.openDialog('add', scope.row?.id)"
                   v-auth="'sys_dept_add'">
          {{ $t('common.addBtn') }}
        </el-button
        >
        <el-button text type="primary" icon="edit-pen" @click="deptDialogRef.openDialog('edit', scope.row?.id)"
                   v-auth="'sys_dept_edit'">{{
            $t('common.editBtn')
          }}
        </el-button>
        <el-button text type="primary" icon="delete" @click="handleDelete(scope.row)" v-auth="'sys_dept_del'">
          {{ $t('common.delBtn') }}
        </el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <dept-form ref="deptDialogRef" @refresh="getDataList()"/>
</template>

<script setup lang="ts" name="systemDept">
import {BasicTableProps, useTable} from '/@/hooks/table';
import {deptTree, delObj} from '/@/api/admin/dept';
import {useMessage, useMessageBox} from '/@/hooks/message';
import {useI18n} from 'vue-i18n';

// 引入组件
const DeptForm = defineAsyncComponent(() => import('./form.vue'));
const {t} = useI18n();
// 定义变量内容
const tableRef = ref(); // 表格引用
const deptDialogRef = ref(); // 部门对话框引用
const excelUploadRef = ref(); // Excel上传引用
const showSearch = ref(true); // 是否显示搜索栏
const isExpand = ref(false); // 是否展开

/**
 * 查询部门树方法，返回 Promise 对象
 * @param params - 查询参数
 * @returns Promise&lt;any&gt;
 */
const queryDeptTree = (params?: any) => {
  return deptTree(params);
};

/**
 * 定义响应式表格数据
 */
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: queryDeptTree, // 页面列表数据
  queryForm: {
    deptName: '', // 部门名称
  },
  isPage: false, // 是否分页
  descs: ['create_time'], // 排序字段
});

/**
 * 使用 useTable 定义表格相关操作
 */
const {getDataList, tableStyle} = useTable(state);

/**
 * 展开/折叠部门树方法
 */
const handleExpand = async () => {
  isExpand.value = !isExpand.value;
  const dataList = await deptTree();
  toggleExpand(dataList.data, isExpand.value);
};

/**
 * 递归方法，用于展开/折叠部门树
 * @param children - 子节点
 * @param unfold - 是否展开
 */
const toggleExpand = (children: any[], unfold = true) => {
  for (const key in children) {
    tableRef.value?.toggleRowExpansion(children[key], unfold);
    if (children[key].children) {
      toggleExpand(children[key].children!, unfold);
    }
  }
};

/**
 * 删除当前行
 * @param row - 当前行数据
 */
const handleDelete = async (row: any) => {
  try {
    await useMessageBox().confirm(t('common.delConfirmText'));
  } catch {
    return;
  }

  try {
    await delObj(row.id);
    getDataList();
    useMessage().success(t('common.delSuccessText'));
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

const handleAdd = ()=>{
  deptDialogRef.value.openDialog('add')
}

/**
 * 暴露组件中的一些方法和变量
 */
defineExpose({
  handleAdd, // 新增时间
  state, // 响应式表格数据
  getDataList, // 获取列表数据方法
  handleExpand // 展开/折叠部门树方法
});
</script>
