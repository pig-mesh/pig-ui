<template>
	<el-drawer v-model="visible" title="日程管理" size="80%" @close="handleClose">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="t('schedule.date')" prop="date">
						<el-date-picker
							type="date"
							:placeholder="t('schedule.inputDateTip')"
							v-model="state.queryForm.date"
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
				<el-table-column prop="type" :label="t('schedule.type')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="schedule_type" :value="scope.row.type"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="state" :label="t('schedule.state')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="schedule_status" :value="scope.row.state"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="date" :label="t('schedule.date')" show-overflow-tooltip />
				<el-table-column prop="time" :label="t('schedule.time')" show-overflow-tooltip />
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
const { schedule_type, schedule_status } = useDict('schedule_type', 'schedule_status');
const emit = defineEmits(['refresh']);
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义变量内容
const formDialogRef = ref();
const visible = ref(false);

// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	createdIsNeed: false,
	pageList: fetchList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value?.resetFields();
	state.queryForm.date = '';
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/job/schedule/export', state.queryForm, 'schedule.xlsx');
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
		await delObjs(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//关闭日程刷新首页日程数据
const handleClose = () => {
	emit('refresh');
};

const open = (row: any) => {
	state.queryForm.date = row.date;
	getDataList();
	visible.value = true;
};

// 暴露变量
defineExpose({
	open,
});
</script>
