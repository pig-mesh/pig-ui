<template>
	<div class="layout-padding">
		<el-card class="layout-padding-auto">
			<el-row class="mb8 ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('leave.username')" prop="username">
						<el-input :placeholder="t('leave.inputUsernameTip')" style="max-width: 180px" v-model="state.queryForm.username" />
					</el-form-item>
					<el-form-item :label="t('leave.state')" class="ml2" prop="state">
						<el-select :placeholder="t('leave.inputStateTip')" v-model="state.queryForm.state">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in leave_status"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="ml2">
						<el-button @click="getDataList" formDialogRef icon="search" type="primary" v-auth="'oa_leave_bill_view'">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }} </el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="formDialogRef.openDialog()" class="ml10" formDialogRef icon="folder-add" type="primary" v-auth="'oa_leave_bill_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button @click="exportExcel" class="ml10" formDialogRef icon="Download" type="primary" v-auth="'oa_leave_bill_export'">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
						class="ml10"
						formDialogRef
						icon="Delete"
						type="primary"
						v-auth="'oa_leave_bill_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
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
			>
				<el-table-column align="center" type="selection" width="60" />
				<el-table-column :label="t('leave.index')" type="index" width="80" />
				<el-table-column :label="t('leave.leaveId')" prop="leaveId" show-overflow-tooltip />
				<el-table-column :label="t('leave.username')" prop="username" show-overflow-tooltip />
				<el-table-column :label="t('leave.days')" prop="days" show-overflow-tooltip />
				<el-table-column :label="t('leave.state')" prop="state" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="leave_status" :value="scope.row.state"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('leave.leaveTime')" prop="leaveTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button @click="handleSubmit(scope.row)" text type="primary" v-if="scope.row.state === '0'"> 提交 </el-button>
						<el-button @click="formDialogRef.openDialog(scope.row.leaveId)" text type="primary" v-auth="'oa_leave_bill_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button @click="handleDelete([scope.row.leaveId])" text type="primary" v-auth="'oa_leave_bill_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</el-card>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList(false)" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="systemOaLeaveBill" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, submit } from '/@/api/oa/leave-bill';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义查询字典

const { leave_status } = useDict('leave_status');
// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
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
	downBlobFile('/act/leave-bill/export', state.queryForm, 'leave.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	selectObjs.value.push(...objs.map((val: any) => val.leaveId));
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

/**
 * 提交表单数据。
 * @param {object} row 当前行数据。
 * @returns {void}
 */
const handleSubmit = async (row) => {
	try {
		await useMessageBox().confirm(t('common.optConfirmText'));
	} catch {
		return;
	}

	try {
		await submit(row.leaveId);
		getDataList();
		useMessage().success(t('common.optSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
