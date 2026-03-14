<template>
	<div>
		<el-row v-show="showSearch">
			<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
				<el-form-item :label="t('internal.title')" prop="title">
					<el-input :placeholder="t('internal.inputTitleTip')" v-model="state.queryForm.title" />
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
			<el-table-column prop="category" :label="t('internal.category')" show-overflow-tooltip width="100">
				<template #default="scope">
					<dict-tag :options="message_type" :value="scope.row.category"></dict-tag>
				</template>
			</el-table-column>
			<el-table-column prop="title" :label="t('internal.title')" show-overflow-tooltip />
			<el-table-column prop="allFlag" :label="t('internal.allFlag')" show-overflow-tooltip>
				<template #default="scope">
					<dict-tag :options="yes_no_type" :value="scope.row.allFlag"></dict-tag>
				</template>
			</el-table-column>
			<el-table-column prop="sendFlag" :label="t('internal.sendFlag')" show-overflow-tooltip>
				<template #default="scope">
					<dict-tag :options="yes_no_type" :value="scope.row.sendFlag"></dict-tag>
				</template>
			</el-table-column>
			<el-table-column prop="sort" :label="t('internal.sort')" show-overflow-tooltip />
			<el-table-column :label="$t('common.action')" width="300">
				<template #default="scope">
					<el-button icon="view" text type="primary" @click="contentRef.openDialog(scope.row)"
						>{{ t('internal.detail') }}
					</el-button>
					<el-button
						icon="BellFilled"
						text
						type="primary"
						v-auth="'sys_message_edit'"
						v-if="scope.row.sendFlag !== '1'"
						@click="handleSend(scope.row.id)"
						>{{ t('internal.send') }}
					</el-button>
					<el-button
						icon="edit-pen"
						text
						type="primary"
						v-auth="'sys_message_edit'"
						v-if="scope.row.sendFlag === '0'"
						@click="formDialogRef.openDialog(scope.row.id)"
						>{{ $t('common.editBtn') }}
					</el-button>
					<el-button icon="delete" text type="primary" v-auth="'sys_message_del'" @click="handleDelete([scope.row.id])"
						>{{ $t('common.delBtn') }}
					</el-button>
					<el-button
						icon="List"
						text
						type="primary"
						v-auth="'sys_message_edit'"
						v-if="scope.row.sendFlag === '1'"
						@click="receiveRef.openDialog(scope.row.id)"
						>{{ t('internal.receiveStatus') }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

		<!-- 消息内容 -->
		<news-content ref="contentRef" />

		<!-- 接收列表 -->
		<receive ref="receiveRef" />
	</div>
</template>

<script setup lang="ts" name="systemSysMessage">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList, sendObj } from '/@/api/admin/message';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const Receive = defineAsyncComponent(() => import('./receive.vue'));
const NewsContent = defineAsyncComponent(() => import('/@/views/home/news/content.vue'));

const { t } = useI18n();
const { message_type, yes_no_type } = useDict('message_type', 'yes_no_type');
const formDialogRef = ref();
const queryRef = ref();
const receiveRef = ref();
const contentRef = ref();
const showSearch = ref(true);
const selectObjs = ref<string[]>([]);
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } =
	useTable(state);

const resetQuery = (): void => {
	queryRef.value?.resetFields();
	selectObjs.value = [];
	getDataList();
};

const exportExcel = (): void => {
	downBlobFile('/admin/sysMessage/export', { ...state.queryForm, ids: selectObjs.value }, 'sysMessage.xlsx');
};

const selectionChangHandle = (objs: { id: string }[]): void => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

const handleDelete = async (ids: string[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('internal.confirmDelete'));
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success(t('internal.deleteSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleSend = async (id: string): Promise<void> => {
	try {
		await useMessageBox().confirm(t('internal.confirmSend'));
	} catch {
		return;
	}

	try {
		await sendObj({ id: id });
		getDataList();
		useMessage().success(t('internal.sendSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>

