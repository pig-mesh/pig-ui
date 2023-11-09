<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item :label="$t('wxAccountTag.tag')" prop="tag">
						<el-input v-model="state.queryForm.tag" :placeholder="t('wxAccountTag.inputTagTip')" style="max-width: 180px" />
					</el-form-item>
					<el-form-item :label="$t('wxAccountTag.wxAccountAppid')" prop="wxAccountAppid">
						<el-select v-model="state.queryForm.wxAccountAppid" :placeholder="t('wxAccountTag.inputWxAccountAppidTip')" clearable class="w100">
							<el-option v-for="item in accountList" :key="item.appid" :label="item.name" :value="item.appid" />
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
					<el-button
						v-auth="'mp_wx_account_tag_add'"
						class="ml10"
						formDialogRef
						icon="folder-add"
						type="primary"
						@click="formDialogRef.openDialog(null, state.queryForm.wxAccountAppid)"
					>
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button v-auth="'mp_wx_account_tag_export'" class="ml10" formDialogRef icon="Download" type="primary" @click="exportExcel">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button
						v-auth="'mp_wx_account_tag_del'"
						:disabled="multiple"
						class="ml10"
						formDialogRef
						icon="Delete"
						type="primary"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<el-button plain type="primary" icon="Sort" @click="asyncTag">同步</el-button>
					<right-toolbar
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
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('wxAccountTag.index')" type="index" width="60" />
				<el-table-column :label="t('wxAccountTag.tag')" prop="tag" show-overflow-tooltip />
				<el-table-column :label="t('wxAccountTag.wxAccountId')" prop="wxAccountId" show-overflow-tooltip />
				<el-table-column :label="t('wxAccountTag.wxAccountName')" prop="wxAccountName" show-overflow-tooltip />
				<el-table-column :label="t('wxAccountTag.wxAccountAppid')" prop="wxAccountAppid" show-overflow-tooltip />
				<el-table-column :label="t('wxAccountTag.tagId')" prop="tagId" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" @click="formDialogRef.openDialog(scope.row, state.queryForm.wxAccountAppid)">{{
							$t('common.editBtn')
						}}</el-button>
						<el-button icon="delete" text type="primary" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script lang="ts" name="systemWxAccountTag" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, getPage, sync } from '/@/api/mp/wx-account-tag';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { fetchAccountList } from '/@/api/mp/wx-account';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义查询字典

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
	pageList: getPage,
	createdIsNeed: false,
});

const accountList = ref([]);

const getAccountList = () => {
	fetchAccountList().then((res) => {
		accountList.value = res.data;
		if (accountList.value.length > 0) {
			state.queryForm.wxAccountAppid = accountList.value[0].appid;
			getDataList();
		}
	});
};

onMounted(() => {
	getAccountList();
});

watch(
	() => state.queryForm.wxAccountAppid,
	() => {
		getDataList();
	}
);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

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
	downBlobFile('/mp/wxAccountTag/export', state.queryForm, 'wxAccountTag.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = (ids: string[]) => {
	useMessageBox()
		.confirm(t('common.delConfirmText'))
		.then(() => {
			delObjs({
				ids: ids,
				wxAccountAppid: state.queryForm.wxAccountAppid,
			})
				.then(() => {
					getDataList();
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};

const asyncTag = () => {
	sync(state.queryForm.wxAccountAppid).then(() => {
		getDataList();
	});
};
</script>
