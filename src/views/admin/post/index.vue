<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('post.postName')" prop="postName">
						<el-input :placeholder="$t('post.inputpostNameTip')" style="max-width: 180px" v-model="state.queryForm.postName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary" v-auth="'sys_post_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain @click="excelUploadRef.show()" class="ml10" icon="upload-filled" type="primary" v-auth="'sys_post_add'">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button plain :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_post_del'">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'sys_post_export'"
						@exportExcel="exportExcel"
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				style="width: 100%"
				v-loading="state.loading"
        row-key="postId"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('post.index')" type="index" width="60" />
				<el-table-column :label="t('post.postCode')" prop="postCode" show-overflow-tooltip />
				<el-table-column :label="t('post.postName')" prop="postName" show-overflow-tooltip />
				<el-table-column :label="t('post.postSort')" prop="postSort" show-overflow-tooltip />
				<el-table-column :label="t('post.remark')" prop="remark" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="200">
					<template #default="scope">
						<el-button icon="edit-pen" @click="formDialogRef.openDialog(scope.row.postId)" text type="primary" v-auth="'sys_post_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>

						<el-button icon="delete" @click="handleDelete([scope.row.postId])" text type="primary" v-auth="'sys_post_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
		<!-- 导入excel -->
		<upload-excel
			:title="$t('post.importPostTip')"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			temp-url="/admin/sys-file/local/file/post.xlsx"
			url="/admin/post/import"
		/>
	</div>
</template>

<script lang="ts" name="systemPost" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList } from '/@/api/admin/post';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();

// 定义变量内容
const formDialogRef = ref();
const excelUploadRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/post/export', Object.assign(state.queryForm,{ids:selectObjs}), 'post.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { postId: string }[]) => {
	selectObjs.value = objs.map(({ postId }) => postId);
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
