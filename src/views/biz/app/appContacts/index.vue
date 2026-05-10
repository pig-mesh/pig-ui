<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" :rules="queryRules" ref="queryRef" :inline="true" @keyup.enter="handleQuery">
      <el-form-item label="联系人" prop="contactName" >
        <el-input placeholder="请输入联系人" v-model="state.queryForm.contactName" clearable maxlength="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="contactPhone" >
        <el-input placeholder="请输入手机号" v-model="state.queryForm.contactPhone" clearable maxlength="11" />
      </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="handleQuery">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'app_appContacts_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
            v-auth="'app_appContacts_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'app_appContacts_export'"
                @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
            @queryTable="handleQuery"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border 
        :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
        @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" label="#" width="40" />
          <el-table-column prop="contactName" label="联系人"  show-overflow-tooltip/>
          <el-table-column prop="contactPhone" label="手机号"  show-overflow-tooltip/>
          <el-table-column prop="remark" label="备注"  show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'app_appContacts_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">编辑</el-button>
            <el-button icon="delete" text type="primary" v-auth="'app_appContacts_del'" @click="handleDelete([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

  </div>
</template>

<script setup lang="ts" name="systemAppContacts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/app/appContacts';
import { useMessage, useMessageBox } from '/@/hooks/message';

const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const selectObjs = ref([]) as any;
const multiple = ref(true);
const CONTACT_NAME_MAX_LENGTH = 50;
const MOBILE_REGEXP = /^1[3-9]\d{9}$/;

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList,
});

const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle,
} = useTable(state);

const getTrimmedValue = (value: unknown) => String(value ?? '').trim();

const hasControlChars = (value: string) =>
  Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127;
  });

const validateQueryName = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const nextValue = getTrimmedValue(value);
  if (!nextValue) {
    callback();
    return;
  }
  if (nextValue.length > CONTACT_NAME_MAX_LENGTH) {
    callback(new Error(`联系人不能超过${CONTACT_NAME_MAX_LENGTH}个字符`));
    return;
  }
  if (hasControlChars(nextValue)) {
    callback(new Error('联系人包含非法字符'));
    return;
  }
  callback();
};

const validateQueryPhone = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const nextValue = getTrimmedValue(value);
  if (!nextValue) {
    callback();
    return;
  }
  if (!MOBILE_REGEXP.test(nextValue)) {
    callback(new Error('手机号码格式有误'));
    return;
  }
  callback();
};

const queryRules = ref({
  contactName: [{ validator: validateQueryName, trigger: 'blur' }],
  contactPhone: [{ validator: validateQueryPhone, trigger: 'blur' }],
});

const normalizeQueryForm = () => {
  state.queryForm.contactName = getTrimmedValue(state.queryForm.contactName);
  state.queryForm.contactPhone = getTrimmedValue(state.queryForm.contactPhone);
};

const handleQuery = async () => {
  normalizeQueryForm();
  const valid = await queryRef.value?.validate().catch(() => false);
  if (valid === false) return;
  getDataList();
};

const resetQuery = () => {
  queryRef.value?.resetFields();
  selectObjs.value = [];
  getDataList();
};

const exportExcel = () => {
  downBlobFile('/app/appContacts/export', { ...state.queryForm, ids: selectObjs.value }, 'appContacts.xlsx');
};

const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id);
  multiple.value = !objs.length;
};

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
