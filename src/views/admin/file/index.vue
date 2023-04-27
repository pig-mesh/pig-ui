<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('file.fileName')" prop="original">
						<el-input v-model="state.queryForm.original" :placeholder="$t('file.inputoriginalTip')" clearable @keyup.enter="getDataList" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="Search" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button formDialogRef icon="folder-add" type="primary" class="ml10" v-auth="'sys_file_del'" @click="formDialogRef.openDialog()">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button :disabled="multiple" icon="Delete" type="primary" class="ml10" v-auth="'sys_file_del'" @click="handleDelete(selectObjs)">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				@selection-change="handleSelectionChange"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" :label="t('file.index')" width="80" />
				<el-table-column prop="fileName" :label="t('file.fileName')" show-overflow-tooltip />
				<el-table-column prop="bucketName" :label="t('file.bucketName')" show-overflow-tooltip />
				<el-table-column prop="original" :label="t('file.original')" show-overflow-tooltip />
				<el-table-column prop="type" :label="t('file.type')" show-overflow-tooltip />
				<el-table-column prop="fileSize" :label="t('file.fileSize')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="t('file.createTime')" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="200">
					<template #default="scope">
						<el-button icon="delete" text type="primary" v-auth="'sys_file_del'" @click="handleDelete([scope.row.id])">{{
							$t('common.delBtn')
						}}</el-button>
						<el-button icon="download" type="primary" text @click="download(scope.row)">{{ $t('common.download') }}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemSysFile">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObj } from '/@/api/admin/file';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { downBlobFile } from '/@/utils/other';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();

// 定义变量内容
const queryRef = ref();
const formDialogRef = ref();
// 搜索变量
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 文件下载
const download = (row: any) => {
	downBlobFile('/admin/sys-file/' + row.bucketName + '/' + row.fileName, null, row.fileName);
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
