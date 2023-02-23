<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
          <el-row v-show="showSearch" class="mb8">
            <el-form :model="state.queryForm" ref="queryRef" :inline="true">
              <el-form-item :label="$t('appuser.username')" prop="username">
                <el-input v-model="state.queryForm.username" :placeholder="$t('appuser.inputUsernameTip')" clearable
                  style="width: 240px" @keyup.enter="getDataList" />
              </el-form-item>
              <el-form-item :label="$t('appuser.phone')" prop="phone">
                <el-input v-model="state.queryForm.phone" :placeholder="$t('appuser.inputPhoneTip')" clearable
                  style="width: 240px" @keyup.enter="getDataList" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
                <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <div class="mb8" style="width: 100%">
              <el-button icon="folder-add" type="primary" class="ml10" @click="userDialogRef.openDialog()"
                v-auth="'sys_user_add'">
                {{ $t('common.addBtn') }}
              </el-button>
              <el-button icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()"
                v-auth="'sys_user_add'">
                {{ $t('common.importBtn') }}
              </el-button>
              <el-button icon="Download" type="primary" class="ml10" @click="exportExcel" v-auth="'sys_user_export'">
                {{ $t('common.exportBtn') }}
              </el-button>
              <el-button :disabled="multiple" icon="Delete" type="primary" class="ml10" v-auth="'sys_user_del'"
                @click="handleDelete(selectObjs)">
                {{ $t('common.delBtn') }}
              </el-button>
              <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                @queryTable="getDataList"></right-toolbar>
            </div>
          </el-row>
          <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" :label="$t('appuser.index')" width="80" />
            <el-table-column prop="username" :label="$t('appuser.username')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" :label="$t('appuser.name')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" :label="$t('appuser.phone')" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('appuser.role')" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-for="(item, index) in scope.row.roleList" type="success" :key="index">{{ item.roleName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('appuser.lockFlag')" show-overflow-tooltip>
              <template #default="scope">
                <dict-tag :options="lock_flag" :value="scope.row.lockFlag"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('appuser.createTime')"
              show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('common.action')" width="150">
              <template #default="scope">
                <el-button   text type="primary" @click="userDialogRef.openDialog(scope.row.userId)"
                  v-auth="'sys_user_edit'"> {{
                    $t('common.editBtn')
                  }}
                </el-button>
                <el-button   text type="primary" @click="handleDelete([scope.row.userId])" v-auth="'sys_user_del'">
                  {{ $t('common.delBtn') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination">
          </pagination>

        </el-card>
    <user-form ref="userDialogRef" @refresh="getDataList()" />

    <upload-excel ref="excelUploadRef" :title="$t('appuser.importUserTip')" url="/admin/user/import"
      temp-url="/admin/sys-file/local/file/user.xlsx" @refreshDataList="getDataList" />
  </div>
</template>

<script setup lang="ts" name="systemUser">
import { fetchList, delObj } from '/@/api/app/appuser'
import { BasicTableProps, useTable } from '/@/hooks/table'
import { useDict } from '/@/hooks/dict'
import { useMessage, useMessageBox } from '/@/hooks/message'
import { useI18n } from 'vue-i18n'

// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));

const { lock_flag } = useDict('lock_flag')
const { t } = useI18n()

// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true)


// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    username: '',
    phone: ''
  },
  pageList: fetchList
});


//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  downBlobFile
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields()
  getDataList()
}


// 多选事件
const handleSelectionChange = (objs: any) => {
  selectObjs.value = []
  objs.forEach((val: any) => {
    selectObjs.value.push(val.userId)
  });
  multiple.value = !objs.length
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/appuser/export', state.queryForm, 'users.xlsx')
}

// 删除用户
const handleDelete = (ids: string[]) => {
  useMessageBox().confirm(t('common.delConfirmText')).then(() => {
    // 删除用户的接口
    delObj(ids).then(() => {
      getDataList();
      useMessage().success(t('common.delSuccessText'))
    }).catch(err => {
      useMessage().error(err.msg)
    })
  })
};
</script>
