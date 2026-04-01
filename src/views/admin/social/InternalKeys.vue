<template>
	<el-row class="ml10" v-show="showSearch">
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
			<el-form-item :label="$t('apikey.username')" prop="username">
				<el-input :placeholder="$t('apikey.inputUsernameTip')" v-model="state.queryForm.username" />
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }}</el-button>
				<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
			</el-form-item>
		</el-form>
	</el-row>
	<el-row>
		<div class="mb8" style="width: 100%">
			<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_social_details_del'">
				{{ $t('common.delBtn') }}
			</el-button>
			<right-toolbar @queryTable="getDataList" class="ml10" style="float: right; margin-right: 20px" v-model:showSearch="showSearch" />
		</div>
	</el-row>
	<el-table
		:data="state.dataList"
		@selection-change="handleSelectionChange"
		style="width: 100%"
		v-loading="state.loading"
		border
		:cell-style="tableStyle.cellStyle"
		:header-cell-style="tableStyle.headerCellStyle"
	>
		<el-table-column align="center" type="selection" width="40" />
		<el-table-column :label="$t('apikey.index')" type="index" width="60" />
		<el-table-column :label="$t('apikey.username')" prop="createBy" show-overflow-tooltip width="120" />
		<el-table-column :label="$t('apikey.name')" prop="name" show-overflow-tooltip width="150" />
		<el-table-column :label="$t('apikey.allowedIps')" prop="allowedIps" show-overflow-tooltip>
			<template #default="scope">
				{{ scope.row.allowedIps || $t('apikey.noLimit') }}
			</template>
		</el-table-column>
		<el-table-column :label="$t('apikey.expiresAt')" prop="expiresAt" width="170">
			<template #default="scope">
				{{ scope.row.expiresAt ? parseTime(scope.row.expiresAt) : $t('apikey.neverExpire') }}
			</template>
		</el-table-column>
		<el-table-column :label="$t('apikey.status')" prop="status" width="80">
			<template #default="scope">
				<el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
					{{ scope.row.status === '0' ? $t('apikey.enabled') : $t('apikey.disabled') }}
				</el-tag>
			</template>
		</el-table-column>
		<el-table-column :label="$t('apikey.lastUsedAt')" prop="lastUsedAt" width="170">
			<template #default="scope">
				{{ scope.row.lastUsedAt ? parseTime(scope.row.lastUsedAt) : $t('apikey.neverUsed') }}
			</template>
		</el-table-column>
		<el-table-column :label="$t('apikey.createTime')" prop="createTime" width="170" />
		<el-table-column :label="$t('common.action')" width="100">
			<template #default="scope">
				<el-button icon="Delete" @click="handleDelete([scope.row.id])" size="small" text type="primary" v-auth="'sys_social_details_del'">
					{{ $t('common.delBtn') }}
				</el-button>
			</template>
		</el-table-column>
	</el-table>
	<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
</template>

<script lang="ts" name="InternalKeys" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchApiKeyPage, deleteApiKeyBatch } from '/@/api/admin/apikey';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';

const { t } = useI18n();
const queryRef = ref();
const showSearch = ref(true);
const selectObjs = ref<number[]>([]);
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		username: '',
	},
	pageList: fetchApiKeyPage,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const resetQuery = (): void => {
	queryRef.value?.resetFields();
	getDataList();
};

const handleSelectionChange = (objs: { id: number }[]): void => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

const handleDelete = async (ids: number[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('apikey.deleteConfirm'));
	} catch {
		return;
	}
	try {
		await deleteApiKeyBatch(ids);
		getDataList();
		useMessage().success(t('apikey.deleteSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
