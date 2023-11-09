<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="t('appsocial.type')" class="ml2" prop="type">
						<el-select :placeholder="t('appsocial.inputTypeTip')" v-model="state.queryForm.type">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in app_social_type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" formDialogRef icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }} </el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						@click="formDialogRef.openDialog()"
						class="ml10"
						formDialogRef
						icon="folder-add"
						type="primary"
						v-auth="'app_social_details_add'"
					>
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button
						plain
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
						class="ml10"
						formDialogRef
						icon="Delete"
						type="primary"
						v-auth="'app_social_details_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'app_social_details_del'"
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
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('appsocial.index')" type="index" width="60" />
				<el-table-column :label="t('appsocial.type')" prop="type" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="app_social_type" :value="scope.row.type"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('appsocial.remark')" prop="remark" show-overflow-tooltip />
				<el-table-column :label="t('appsocial.appId')" prop="appId" show-overflow-tooltip />
				<el-table-column :label="t('appsocial.appSecret')" prop="appSecret" show-overflow-tooltip />
				<el-table-column :label="t('appsocial.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" @click="formDialogRef.openDialog(scope.row.id)" text type="primary" v-auth="'app_social_details_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button icon="delete" @click="handleDelete([scope.row.id])" text type="primary" v-auth="'app_social_details_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="systemAppSocialDetails" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList } from '/@/api/app/appsocial';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义查询字典

const { app_social_type } = useDict('app_social_type');
// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: '',
	},
	pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/app/appsocial/export', state.queryForm, 'appsocial.xlsx');
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
