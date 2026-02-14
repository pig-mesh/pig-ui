<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item :label="t('area.pid')" prop="adcode">
            <china-area :type="3" :placeholder="t('area.inputPidByTip')" v-model="pid" :plus="true" @change="handleChange"/>
          </el-form-item>
          <el-form-item :label="t('area.name')" prop="name">
            <el-input :placeholder="t('area.inputNameByTip')" v-model="state.queryForm.name"/>
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
                     v-auth="'sys_sysArea_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
                     v-auth="'sys_sysArea_del'" @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'sys_sysArea_export'"
                         @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border
                :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
                @selection-change="selectionChangHandle"
                @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column type="index" label="#" width="40"/>
        <el-table-column prop="name" :label="t('area.name')" show-overflow-tooltip/>
        <el-table-column prop="adcode" :label="t('area.adcode')" show-overflow-tooltip/>
        <el-table-column prop="areaType" :label="t('area.areaType')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="area_type_dict" :value="scope.row.areaType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hot" :label="t('area.hot')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="yes_no_type" :value="scope.row.hot"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="areaStatus" :label="t('area.areaStatus')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="yes_no_type" :value="scope.row.areaStatus"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="areaSort" :label="t('area.areaSort')" width="100" sortable="custom"
                         show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'sys_sysArea_edit'"
                       @click="formDialogRef.openDialog(scope.row.id)">{{ $t('common.editBtn') }}
            </el-button>
            <el-button icon="delete" text type="primary" v-auth="'sys_sysArea_del'"
                       @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

  </div>
</template>

<script setup lang="ts" name="systemSysArea">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/admin/sysArea';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const ChinaArea = defineAsyncComponent(() => import('/@/components/ChinaArea/index.vue'));
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

const { yes_no_type } = useDict('yes_no_type');

const area_type_dict = [
	{ value: '0', label: t('area.country') },
	{ value: '1', label: t('area.province') },
	{ value: '2', label: t('area.city') },
	{ value: '3', label: t('area.county') },
	{ value: '4', label: t('area.street') },
];

const formDialogRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const selectObjs = ref<string[]>([]);
const multiple = ref(true);
const pid = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		adcode: '',
		name: '',
	},
	ascs: ['adcode'],
	pageList: fetchList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } =
	useTable(state);

const resetQuery = (): void => {
	queryRef.value?.resetFields();
	pid.value = '';
	selectObjs.value = [];
	getDataList();
};

const exportExcel = (): void => {
	downBlobFile('/admin/sysArea/export', { ...state.queryForm, ids: selectObjs.value }, 'sysArea.xlsx');
};

const selectionChangHandle = (objs: { id: string }[]): void => {
	selectObjs.value = objs.map(({ id }) => id);
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

const handleChange = (data: string): void => {
	state.queryForm.adcode = data.split(',').at(-1);
};
</script>
