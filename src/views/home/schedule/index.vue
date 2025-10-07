<template>
	<el-drawer v-model="visible" title="日程管理" size="80%" @close="handleClose">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="t('schedule.date')" prop="scheduleDate">
						<el-date-picker
							type="date"
							:placeholder="t('schedule.inputDateTip')"
							v-model="state.queryForm.scheduleDate"
							:value-format="dateStr"
						></el-date-picker>
					</el-form-item>
					<el-form-item :label="$t('schedule.title')" prop="title">
						<el-input :placeholder="t('schedule.inputTitleTip')" v-model="state.queryForm.title" style="max-width: 180px" />
					</el-form-item>
					<el-form-item>
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" formDialogRef @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button formDialogRef icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog(null, state.queryForm)">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button formDialogRef :disabled="multiple" icon="Delete" type="primary" class="ml10" @click="handleDelete(selectObjs)">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="true"
						@exportExcel="exportExcel"
						v-model:showSearch="showSearch"
						class="ml10 mr20"
						style="float: right"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" :label="t('schedule.index')" width="80" />
				<el-table-column prop="title" :label="t('schedule.title')" show-overflow-tooltip />
				<el-table-column prop="scheduleType" :label="t('schedule.type')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="schedule_type" :value="scope.row.scheduleType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="scheduleState" :label="t('schedule.state')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="schedule_status" :value="scope.row.scheduleState"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="scheduleDate" :label="t('schedule.date')" show-overflow-tooltip />
				<el-table-column prop="scheduleTime" :label="t('schedule.time')" show-overflow-tooltip />
				<el-table-column prop="createBy" :label="t('schedule.createBy')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="t('schedule.createTime')" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" @click="formDialogRef.openDialog(scope.row.id)">{{ $t('common.editBtn') }}</el-button>
						<el-button icon="delete" text type="primary" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</el-drawer>
</template>

<script setup lang="ts" name="systemSysSchedule">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/admin/schedule';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import DictTag from '/@/components/DictTag/index.vue';

/**
 * 日程类型和状态字典
 */
const { schedule_type, schedule_status } = useDict('schedule_type', 'schedule_status');

/**
 * 定义组件事件
 */
const emit = defineEmits(['refresh']);

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 表单对话框引用
 */
const formDialogRef = ref();

/**
 * 抽屉显示状态
 */
const visible = ref(false);

/**
 * 查询表单引用
 */
const queryRef = ref();

/**
 * 是否显示搜索区域
 */
const showSearch = ref(true);

/**
 * 多选的日程ID数组
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
	createdIsNeed: false,
	pageList: fetchList,
});

/**
 * 表格相关钩子函数
 */
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

/**
 * 清空搜索条件并重新查询
 */
const resetQuery = (): void => {
	queryRef.value?.resetFields();
	state.queryForm.date = '';
	selectObjs.value = [];
	getDataList();
};

/**
 * 导出Excel文件
 */
const exportExcel = (): void => {
	downBlobFile('/job/schedule/export', state.queryForm, 'schedule.xlsx');
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
 * 删除日程
 * @param ids - 要删除的日程ID数组
 */
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

/**
 * 关闭抽屉时刷新首页日程数据
 */
const handleClose = (): void => {
	emit('refresh');
};

/**
 * 打开日程管理抽屉
 * @param row - 包含日期信息的行数据
 */
const open = (row: any): void => {
	state.queryForm.date = row.date;
	getDataList();
	visible.value = true;
};

/**
 * 暴露方法供父组件调用
 */
defineExpose({
	open,
});
</script>
