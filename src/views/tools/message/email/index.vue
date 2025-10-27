<template>
	<div>
		<el-row v-show="showSearch">
			<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
				<el-form-item :label="t('email.configName')" prop="configName">
					<el-input :placeholder="t('email.inputConfigNameTip')" v-model="state.queryForm.configName" />
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
				<el-button
					icon="folder-add"
					type="primary"
					class="ml10"
					@click="formDialogRef.openDialog()"
					v-auth="'sys_message_add'"
				>
					{{ $t('common.addBtn') }}
				</el-button>
				<el-button
					plain
					:disabled="multiple"
					icon="Delete"
					type="primary"
					v-auth="'sys_message_del'"
					@click="handleDelete(selectObjs)"
				>
					{{ $t('common.delBtn') }}
				</el-button>
				<right-toolbar
					v-model:showSearch="showSearch"
					:export="'admin_sysMessage_export'"
					@exportExcel="exportExcel"
					class="ml10 mr20"
					style="float: right"
					@queryTable="getDataList"
				></right-toolbar>
			</div>
		</el-row>
		<el-table
			:data="state.dataList"
			v-loading="state.loading"
			border
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			@selection-change="selectionChangHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column type="selection" width="40" align="center" />
			<el-table-column type="index" label="#" width="40" />
			<el-table-column prop="configName" :label="t('email.configName')" show-overflow-tooltip />
			<el-table-column prop="configKey" :label="t('email.configKey')" show-overflow-tooltip />
			<el-table-column prop="configValue.supplier" :label="t('email.smtpServer')" show-overflow-tooltip>
				<template #default="scope">
					{{ JSON.parse(scope.row.configValue).smtpServer }}
				</template>
			</el-table-column>
			<el-table-column prop="configStatus" :label="t('email.configStatus')" show-overflow-tooltip width="100">
				<template #default="scope">
					<dict-tag :options="yes_no_type" :value="scope.row.configStatus"></dict-tag>
				</template>
			</el-table-column>
			<el-table-column :label="$t('common.action')" width="300">
				<template #default="scope">
					<el-button icon="view" text type="primary" v-auth="'sys_message_edit'" @click="senderDialogRef.openDialog(scope.row.id)"
						>{{ t('email.test') }}
					</el-button>
					<el-button icon="edit-pen" text type="primary" v-auth="'sys_message_edit'" @click="formDialogRef.openDialog(scope.row.id)"
						>{{ $t('common.editBtn') }}
					</el-button>
					<el-button icon="delete" text type="primary" v-auth="'sys_message_del'" @click="handleDelete([scope.row.id])"
						>{{ $t('common.delBtn') }}
					</el-button>
					<el-button icon="Tickets" text type="primary" v-auth="'sys_message_del'" @click="handleLog"
						>{{ t('email.log') }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
		<sender-dialog ref="senderDialogRef" />
	</div>
</template>

<script setup lang="ts" name="systemEmailMessage">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/admin/config';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

/**
 * 异步组件引入
 */
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const SenderDialog = defineAsyncComponent(() => import('./sender.vue'));

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 是否/否 字典
 */
const { yes_no_type } = useDict('yes_no_type');

/**
 * 表单对话框引用
 */
const formDialogRef = ref();

/**
 * 发送测试对话框引用
 */
const senderDialogRef = ref();

/**
 * 查询表单引用
 */
const queryRef = ref();

/**
 * 是否显示搜索区域
 */
const showSearch = ref(true);

/**
 * 多选选中的对象ID数组
 */
const selectObjs = ref<string[]>([]);

/**
 * 是否禁用批量删除按钮
 */
const multiple = ref(true);

/**
 * 表格状态数据
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		/** 配置类型：email */
		configType: 'email',
		/** 业务名称 */
		configName: '',
	},
	pageList: fetchList,
});

/**
 * 表格 Hook
 */
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } =
	useTable(state);

/**
 * 重置查询条件
 */
const resetQuery = (): void => {
	// 清空搜索条件
	queryRef.value?.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

/**
 * 导出 Excel
 */
const exportExcel = (): void => {
	downBlobFile('/admin/sysMessage/export', Object.assign(state.queryForm, { ids: selectObjs }), 'sysMessage.xlsx');
};

/**
 * 多选变更事件处理
 * @param objs - 选中的对象数组
 */
const selectionChangHandle = (objs: { id: string }[]): void => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

/**
 * 删除操作
 * @param ids - 要删除的ID数组
 */
const handleDelete = async (ids: string[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('email.confirmDelete'));
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success(t('email.deleteSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 路由实例
 */
const router = useRouter();

/**
 * 跳转到日志页面
 */
const handleLog = (): void => {
	router.push({ path: '/admin/log/index', query: { serviceId: 'email' } });
};
</script>
