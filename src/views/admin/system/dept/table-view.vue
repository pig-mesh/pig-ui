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
import { BasicTableProps, useTable } from '/@/hooks/table';
import { deptTree, delObj } from '/@/api/admin/dept';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const DeptForm = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();

/** 表格引用 */
const tableRef = ref();

/** 部门对话框引用 */
const deptDialogRef = ref();

/** 是否展开所有节点 */
const isExpand = ref(false);

/**
 * 查询部门树方法
 * @param {Object} params - 查询参数
 * @returns {Promise<any>} 部门树数据
 */
const queryDeptTree = (params?: any) => {
	return deptTree(params);
};

/**
 * 表格状态配置
 * @property {Function} pageList - 分页查询API
 * @property {Object} queryForm - 查询表单
 * @property {string} queryForm.deptName - 部门名称
 * @property {boolean} isPage - 是否分页（false表示树形结构不分页）
 * @property {string[]} descs - 降序排序字段
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: queryDeptTree,
	queryForm: {
		deptName: '',
	},
	isPage: false,
	descs: ['create_time'],
});

/** 表格相关操作 */
const { getDataList, tableStyle } = useTable(state);

/**
 * 展开/折叠部门树
 * @description 切换所有节点的展开/折叠状态
 */
const handleExpand = async () => {
	isExpand.value = !isExpand.value;
	const { data } = await deptTree();
	toggleExpand(data, isExpand.value);
};

/**
 * 递归切换节点展开/折叠状态
 * @param {Array} children - 子节点数组
 * @param {boolean} unfold - 是否展开（true=展开，false=折叠）
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
 * 删除部门
 * @param {Object} row - 当前行数据
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

/**
 * 新增部门
 * @description 打开新增部门弹窗
 */
const handleAdd = () => {
	deptDialogRef.value.openDialog('add');
};

// 暴露变量
defineExpose({
	handleAdd,
	state,
	getDataList,
	handleExpand,
});
</script>
