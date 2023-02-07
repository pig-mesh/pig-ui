<template>
	<div class="system-dept-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
      <div class="mb15">
        <el-input size="default" placeholder="请输入部门名称" style="max-width: 180px" v-model="state.queryForm.deptName"> </el-input>
        <el-button size="default" icon="search" type="primary" class="ml10" @click="getDataList">
          查询
        </el-button>
        <el-button size="default" icon="folder-add" type="success" class="ml10" @click="deptDialogRef.openDialog('add');">
          新增菜单
        </el-button>
      </div>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="name" label="部门名称" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="weight" label="排序" show-overflow-tooltip width="80">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button   text type="primary" @click="onOpenAddDept('add',scope.row)">新增</el-button>
						<el-button   text type="primary" @click="onOpenEditDept('edit', scope.row)">修改</el-button>
						<el-button   text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<dept-form ref="deptDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemDept">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {depttree,delObj} from "/@/api/admin/dept";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useI18n} from "vue-i18n";

// 引入组件
const DeptForm = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n()

// 定义变量内容
const deptDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: depttree, // H
  queryForm: {
    deptName: ''
  },
  isPage: false
});


const {
  getDataList
} = useTable(state)

// 打开新增菜单弹窗
const onOpenAddDept = (type: string,row: any) => {
	deptDialogRef.value.openDialog(type,row?.id);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: any) => {
	deptDialogRef.value.openDialog(type, row.id);
};
// 删除当前行
const onTabelRowDel = (row: any) => {
  useMessageBox().confirm(`${t('common.delConfirmText')}：${row.name} ?`)
		.then(() => {
      delObj(row.id).then(() => {
        getDataList();
        useMessage().success('删除成功');
      }).catch(err => {
        useMessage().error(err.msg)
      })

		})
};
</script>
