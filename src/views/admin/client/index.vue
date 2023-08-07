<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('client.clientId')" prop="clientId">
						<el-input :placeholder="$t('client.clientId')" style="max-width: 180px" v-model="state.queryForm.clientId" />
					</el-form-item>
					<el-form-item :label="$t('client.clientSecret')" prop="clientSecret">
						<el-input :placeholder="$t('client.clientSecret')" style="max-width: 180px" v-model="state.queryForm.clientSecret" />
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
					<el-button v-auth="'sys_client_add'" @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button v-auth="'sys_client_del'" plain @click="handleRefreshCache()" class="ml10" icon="refresh-left" type="primary">
						{{ $t('common.refreshCacheBtn') }}
					</el-button>

					<el-button plain :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_client_del'">
						{{ $t('common.delBtn') }}
					</el-button>

					<right-toolbar
						:export="'sys_client_del'"
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
        row-key="id"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('client.index')" type="index" width="60" />
				<el-table-column :label="t('client.clientId')" prop="clientId" show-overflow-tooltip />
				<el-table-column :label="t('client.clientSecret')" prop="clientSecret" show-overflow-tooltip />
				<el-table-column :label="t('client.scope')" prop="scope" show-overflow-tooltip />
				<el-table-column :label="t('client.authorizedGrantTypes')" prop="authorizedGrantTypes" show-overflow-tooltip width="400px">
					<template #default="scope">
						<dict-tag :options="grant_types" :value="scope.row.authorizedGrantTypes" />
					</template>
				</el-table-column>
				<el-table-column :label="t('client.accessTokenValidity')" prop="accessTokenValidity" show-overflow-tooltip />
				<el-table-column :label="t('client.refreshTokenValidity')" prop="refreshTokenValidity" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" @click="formDialogRef.openDialog(scope.row.clientId)" text type="primary" v-auth="'sys_client_add'"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button icon="delete" @click="handleDelete([scope.row.id])" text type="primary" v-auth="'sys_client_del'">
							{{ $t('common.delBtn') }}
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

<script lang="ts" name="systemSysOauthClientDetails" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, refreshCache } from '/@/api/admin/client';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义查询字典

const { grant_types } = useDict('grant_types');
// 定义变量内容
const formDialogRef = ref();
const queryRef = ref();
// 搜索变量
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['id'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 删除缓存
const handleRefreshCache = () => {
	refreshCache().then(() => {
		useMessage().success('同步成功');
	});
};

const resetQuery = () => {
	queryRef.value.resetFields();
	// state.queryForm = {};
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/client/export', Object.assign(state.queryForm,{ids:selectObjs}), 'client.xlsx');
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
