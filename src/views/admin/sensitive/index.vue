<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item :label="t('sensitive.sensitiveWord')" prop="sensitiveWord">
            <el-input :placeholder="t('sensitive.inputSensitiveWordTip')" v-model="state.queryForm.sensitiveWord"/>
          </el-form-item>
          <el-form-item :label="t('sensitive.sensitiveType')" prop="sensitiveType">
            <el-radio-group v-model="state.queryForm.sensitiveType">
              <el-radio :label="item.value" v-for="(item, index) in sensitive_type" border :key="index">{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
                     v-auth="'admin_sysSensitiveWord_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
                     v-auth="'admin_sysSensitiveWord_del'" @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <el-button plain icon="Check" type="primary"
                     v-auth="'admin_sysSensitiveWord_del'" @click="matchDialogRef.openDialog()">
            {{ t('sensitive.matchTest') }}
          </el-button>
          <el-button plain @click="handleRefreshCache()" class="ml10" icon="refresh-left" type="primary">
            {{ $t('common.refreshCacheBtn') }}
          </el-button>

          <right-toolbar v-model:showSearch="showSearch" :export="'admin_sysSensitiveWord_export'"
                         @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border
                :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
                @selection-change="selectionChangHandle"
                @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column type="index" :label="t('sensitive.index')" width="40"/>
        <el-table-column prop="sensitiveWord" :label="t('sensitive.sensitiveWord')" show-overflow-tooltip/>
        <el-table-column prop="sensitiveType" :label="t('sensitive.sensitiveType')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="sensitive_type" :value="scope.row.sensitiveType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="t('sensitive.remark')" width="200" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'admin_sysSensitiveWord_edit'"
                       @click="formDialogRef.openDialog(scope.row.sensitiveId)">{{ $t('common.editBtn') }}
            </el-button>
            <el-button icon="delete" text type="primary" v-auth="'admin_sysSensitiveWord_del'"
                       @click="handleDelete([scope.row.sensitiveId])">{{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

    <!-- 匹配测试 -->
    <match-dialog ref="matchDialogRef" @refresh="getDataList(false)"/>
  </div>
</template>

<script setup lang="ts" name="systemSysSensitiveWord">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs, refreshObj } from '/@/api/admin/sensitive';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const MatchDialog = defineAsyncComponent(() => import('./match.vue'));

const { t } = useI18n();
const { sensitive_type } = useDict('sensitive_type');

const formDialogRef = ref();
const matchDialogRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const selectObjs = ref<string[]>([]);
/** 无选中项时为 true，禁用批量删除按钮 */
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } =
	useTable(state);

const resetQuery = (): void => {
	queryRef.value?.resetFields();
	selectObjs.value = [];
	getDataList();
};

const exportExcel = (): void => {
	downBlobFile(
		'/admin/sysSensitiveWord/export',
		{ ...state.queryForm, ids: selectObjs.value },
		'sysSensitiveWord.xlsx'
	);
};

const selectionChangHandle = (objs: { sensitiveId: string }[]): void => {
	selectObjs.value = objs.map(({ sensitiveId }) => sensitiveId);
	multiple.value = !objs.length;
};

const handleDelete = async (ids: string[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleRefreshCache = async (): Promise<void> => {
	try {
		await refreshObj();
		getDataList();
		useMessage().success(t('common.refreshSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
