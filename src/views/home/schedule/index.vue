<template>
	<el-drawer v-model="visible" title="日程管理" size="80%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch" class="mb8">
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
					<el-form-item class="ml2">
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" formDialogRef @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						formDialogRef
						icon="folder-add"
						type="primary"
						class="ml10"
						@click="formDialogRef.openDialog(null, state.queryForm)"
						v-auth="'admin_schedule_add'"
					>
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button formDialogRef icon="Download" type="primary" class="ml10" @click="exportExcel" v-auth="'admin_schedule_export'">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button
						formDialogRef
						:disabled="multiple"
						icon="Delete"
						type="primary"
						class="ml10"
						v-auth="'admin_schedule_del'"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
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
			>
				<el-table-column type="selection" width="60" align="center" />
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
						<el-button text type="primary" v-auth="'admin_schedule_edit'" @click="formDialogRef.openDialog(scope.row.id)">{{
							$t('common.editBtn')
						}}</el-button>
						<el-button text type="primary" v-auth="'admin_schedule_del'" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}</el-button>
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

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	createdIsNeed: false,
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile } = useTable(state);

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
	downBlobFile('/admin/schedule/export', state.queryForm, 'schedule.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	objs.forEach((val: any) => {
		selectObjs.value.push(val.id);
	});
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = (ids: string[]) => {
	useMessageBox()
		.confirm(t('common.delConfirmText'))
		.then(() => {
			delObjs(ids)
				.then(() => {
					getDataList(false);
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
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
