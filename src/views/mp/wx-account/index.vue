<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch" class="mb8">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item :label="$t('account.name')" prop="name">
						<el-input v-model="state.queryForm.name" :placeholder="t('account.inputNameTip')" style="max-width: 180px" />
					</el-form-item>
					<el-form-item :label="$t('account.account')" prop="account">
						<el-input v-model="state.queryForm.account" :placeholder="t('account.inputAccountTip')" style="max-width: 180px" />
					</el-form-item>
					<el-form-item class="ml2">
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button formDialogRef icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button v-auth="'mp_wxaccount_add'" class="ml10" formDialogRef icon="folder-add" type="primary" @click="formDialogRef.openDialog()">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button v-auth="'mp_wxaccount_export'" class="ml10" formDialogRef icon="Download" type="primary" @click="exportExcel">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button
						v-auth="'mp_wxaccount_del'"
						:disabled="multiple"
						class="ml10"
						formDialogRef
						icon="Delete"
						type="primary"
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
				v-loading="state.loading"
				:data="state.dataList"
				style="width: 100%"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
			>
				<el-table-column align="center" type="selection" width="60" />
				<el-table-column :label="t('account.index')" type="index" width="80" />
				<el-table-column :label="t('account.name')" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('account.account')" prop="account" show-overflow-tooltip />
				<el-table-column :label="t('account.appid')" prop="appid" show-overflow-tooltip />
				<el-table-column :label="t('account.appsecret')" prop="appsecret" show-overflow-tooltip />
				<el-table-column :label="t('account.url')" prop="url" show-overflow-tooltip />
				<el-table-column :label="t('account.token')" prop="token" show-overflow-tooltip />
				<el-table-column :label="t('account.aeskey')" prop="aeskey" show-overflow-tooltip />
				<el-table-column :label="t('account.qrUrl')" prop="qrUrl" show-overflow-tooltip fixed="right" width="150px">
					<template #default="scope">
						<a target="_blank" :href="scope.row.qrUrl"><img :src="scope.row.qrUrl" style="width: 100px; height: auto" /></a>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="200" fixed="right">
					<template #default="scope">
						<el-button v-auth="'mp_wxaccount_edit'" text type="primary" @click="formDialogRef.openDialog(scope.row.id)">{{
							$t('common.editBtn')
						}}</el-button>
						<el-button v-auth="'mp_wxaccount_del'" text type="primary" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}</el-button>
						<el-button text type="primary" @click="access(scope.row, scope.index)">接入</el-button>
						<el-button text type="primary" @click="generate(scope.row, scope.index)">二维码</el-button>
						<el-button text type="primary" @click="quota(scope.row, scope.index)">quota</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

		<el-dialog v-model="dialogFormVisible" title="接入">
			<el-input v-model="wxurl" readonly>
				<template #append>
					<el-button @click="copyText(wxurl)">复制链接</el-button>
				</template>
			</el-input>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="systemWxAccount" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { clearQuota, delObjs, fetchList, generateQr } from '/@/api/mp/wx-account';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import commonFunction from '/@/utils/commonFunction';

const { copyText } = commonFunction();
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
	downBlobFile('/mp/account/export', state.queryForm, 'account.xlsx');
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

const dialogFormVisible = ref(false);
const wxurl = ref('');
const access = (row: any) => {
	dialogFormVisible.value = true;
	wxurl.value = row.url + '/mp/' + row.appid + '/portal';
};

const generate = (row: any) => {
	generateQr(row.appid)
		.then(() => {
			useMessage().success('获取成功');
			getDataList();
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

const quota = (row) => {
	clearQuota(row.appid)
		.then(() => {
			useMessage().success('清空api的调用quota成功');
		})
		.catch((err) => {
			useMessage().error('清空api的调用quota失败');
		});
};
</script>
