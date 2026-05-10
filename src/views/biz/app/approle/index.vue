<script lang="ts" name="appRoleTabbar" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList } from '/@/api/app/approle';
import type { AppRoleTabbarRole } from '/@/api/app/approle';
import { useI18n } from 'vue-i18n';

const RoleTabbarDialog = defineAsyncComponent(() => import('./role-tabbar-dialog.vue'));
const { t } = useI18n();

const roleTabbarDialogRef = ref();
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		roleName: '',
	},
	pageList: fetchList,
	isPage: false,
});

const { getDataList, tableStyle } = useTable(state);

const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

const openRoleTabbarDialog = (row: AppRoleTabbarRole) => {
	roleTabbarDialogRef.value?.openDialog(row.roleId, row.roleName);
};
</script>

<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch" class="ml10">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item :label="$t('approle.roleName')" prop="roleName">
						<el-input v-model="state.queryForm.roleName" :placeholder="$t('approle.inputRoleNameTip')" class="!w-[180px]" />
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
				<div class="mb8 flex w-full items-center">
					<right-toolbar v-model:showSearch="showSearch" class="ml-auto mr5" @queryTable="getDataList" />
				</div>
			</el-row>

			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				border
				class="w-full"
				row-key="roleId"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column :label="$t('approle.index')" type="index" width="80" />
				<el-table-column :label="$t('approle.roleName')" prop="roleName" show-overflow-tooltip />
				<el-table-column :label="$t('approle.roleCode')" prop="roleCode" show-overflow-tooltip />
				<el-table-column :label="$t('approle.roleDesc')" prop="roleDesc" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="160" fixed="right">
					<template #default="scope">
						<el-button icon="setting" text type="primary" v-auth="'app_role_tabbar_edit'" @click="openRoleTabbarDialog(scope.row)">
							{{ t('approle.tabbarTip') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<RoleTabbarDialog ref="roleTabbarDialogRef" @refresh="getDataList" />
	</div>
</template>
