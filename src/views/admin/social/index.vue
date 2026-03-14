<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item :label="t('social.type')" class="ml2" prop="type">
						<el-select v-model="state.queryForm.type" :placeholder="t('social.inputTypeTip')">
							<el-option v-for="(item, index) in social_type" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button formDialogRef icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button v-auth="'sys_social_details_add'" class="ml10" icon="folder-add" type="primary" @click="formDialogRef.openDialog()">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button
						v-auth="'sys_social_details_del'"
						:disabled="multiple"
						class="ml10"
						icon="Delete"
						type="primary"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'sys_social_details_del'"
						@exportExcel="exportExcel"
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				style="width: 100%"
        row-key="id"
				@selection-change="handleSelectionChange"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('social.index')" type="index" width="60" />
				<el-table-column :label="t('social.type')" prop="type" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="social_type" :value="scope.row.type"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('social.remark')" prop="remark" show-overflow-tooltip />
				<el-table-column :label="t('social.appId')" prop="appId" show-overflow-tooltip />
				<el-table-column :label="t('social.appSecret')" prop="appSecret" show-overflow-tooltip />
				<el-table-column :label="t('social.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" v-auth="'sys_social_details_edit'" text type="primary" @click="formDialogRef.openDialog(scope.row.id)"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button icon="delete" v-auth="'sys_social_details_del'" text type="primary" @click="handleDelete([scope.row.id])"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script lang="ts" name="systemAppSocialDetails" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList } from '/@/api/admin/social';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 社交登录类型字典
 */
const { social_type } = useDict('social_type');

/**
 * 表单对话框引用
 */
const formDialogRef = ref();

/**
 * 查询表单引用
 */
const queryRef = ref();

/**
 * 是否显示搜索区域
 */
const showSearch = ref(true);

/**
 * 多选的对象ID数组
 */
const selectObjs = ref<string[]>([]);

/**
 * 是否禁用批量删除按钮（无选中项时禁用）
 */
const multiple = ref(true);

/**
 * 表格状态配置
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

/**
 * 表格相关钩子函数
 */
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

/**
 * 清空搜索条件并重新查询
 */
const resetQuery = (): void => {
	queryRef.value.resetFields();
	getDataList();
};

/**
 * 导出Excel文件
 */
const exportExcel = (): void => {
	downBlobFile('/admin/social/export', { ...state.queryForm, ids: selectObjs.value }, 'social.xlsx');
};

/**
 * 表格多选事件处理
 * @param objs - 选中的行对象数组
 */
const handleSelectionChange = (objs: { id: string }[]): void => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

/**
 * 删除社交登录配置
 * @param ids - 要删除的ID数组
 */
const handleDelete = async (ids: string[]): Promise<void> => {
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
