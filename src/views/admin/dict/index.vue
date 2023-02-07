<template>
		<el-card shadow="hover" class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('post.postName')" prop="postName">
            <el-input  :placeholder="$t('post.inputpostNameTip')" v-model="state.queryForm.postName"
                       style="max-width: 180px" />
          </el-form-item>
          <el-form-item class="ml2">
            <el-button  icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh"  @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button  icon="folder-add" type="primary" class="ml10" @click="dicDialogRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button  :disabled="multiple" icon="Delete" type="primary" class="ml10"
                      v-auth="'sys_dict_del'" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
			<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="dictType" label="类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="systemFlag" label="字典类型" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dict_type" :value="scope.row.systemFlag"></dict-tag>
          </template>
        </el-table-column>
				<el-table-column prop="remarks" label="备注信息" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>

				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button   text type="primary" @click="onOpenEditDic('edit', scope.row)">修改</el-button>
						<el-button   text type="primary" @click="onOpenEditDic('edit', scope.row)">修改</el-button>
						<el-button   text type="primary" @click="showDictITem(scope.row)">字典项</el-button>
					</template>
				</el-table-column>
			</el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</el-card>
		<DicDialog ref="dicDialogRef" @refresh="getDataList()" />
  <dict-item-dialog ref="dictItemDialogRef"></dict-item-dialog>

</template>

<script setup lang="ts" name="systemDic">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList,delObj} from "/@/api/admin/dict";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from "/@/hooks/dict";
import {useI18n} from "vue-i18n";
const { dict_type } = useDict('dict_type')
// 引入组件
const DicDialog = defineAsyncComponent(() => import('./form.vue'));
const DictItemDialog = defineAsyncComponent(() => import('./dictItem/index.vue'))
const { t }  = useI18n()
// 定义变量内容
const dicDialogRef = ref();
const dictItemDialogRef = ref()
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([])
const multiple = ref(true)


const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList
})
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
} = useTable(state)

// 打开修改字典弹窗
const onOpenEditDic = (type: string, row: any) => {
	dicDialogRef.value.openDialog(type, row);
};

const showDictITem = (row: any) => {
  dictItemDialogRef.value.open(row)
}


// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields()
  getDataList()
}
// 删除操作
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach((val: any) => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(t('common.delConfirmText') + row.postId)
      .then(() => {
        delObj(row.postId).then(() => {
          getDataList();
          useMessage().success(t('common.delSuccessText'));
        }).catch((err: any) => {
          useMessage().error(err.msg)
        })
      })
};
</script>
