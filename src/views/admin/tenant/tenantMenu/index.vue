<template>
	<el-drawer v-model="visible" title="租户套餐" size="80%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="tenantMenuDialogRef.openDialog()" v-auth="'admin_systenantmenu_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<right-toolbar :search="false" class="ml10" style="float: right; margin-right: 20px" @queryTable="getDataList"></right-toolbar>
				</div>
			</el-row>
			<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%">
				<el-table-column type="index" :label="$t('tenantmenu.index')" width="80" />
				<el-table-column prop="name" :label="$t('tenantmenu.name')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('tenantmenu.status')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="status_type" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" :label="$t('tenantmenu.createTime')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button text type="primary" @click="tenantMenuDialogRef.openDialog(scope.row.id)" v-auth="'admin_systenantmenu_edit'">
							{{ $t('common.editBtn') }}
						</el-button>
						<el-button text type="primary" @click="handleDelete(scope.row)" v-auth="'admin_systenantmenu_del'">
							{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"> </pagination>
			<tenant-menu-dialog ref="tenantMenuDialogRef" @refresh="getDataList"></tenant-menu-dialog>
		</div>
	</el-drawer>
</template>

<script setup lang="ts" name="tenant-menu">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObj } from '/@/api/admin/tenant-menu';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
const TenantMenuDialog = defineAsyncComponent(() => import('./form.vue'));

const { t } = useI18n();
const { status_type } = useDict('status_type');
const visible = ref(false);
const tenantMenuDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: fetchList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle } = useTable(state);

/**
 * 处理删除事件。
 * @param {Object} row - 要删除的数据行对象。
 */
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(row.id);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const open = () => {
	visible.value = true;
};

// 暴露变量
defineExpose({
	open,
});
</script>

<style scoped></style>
