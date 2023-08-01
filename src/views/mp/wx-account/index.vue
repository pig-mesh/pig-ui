<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item :label="$t('account.name')" prop="name">
						<el-input v-model="state.queryForm.name" :placeholder="t('account.inputNameTip')" style="max-width: 180px" />
					</el-form-item>
					<el-form-item :label="$t('account.account')" prop="account">
						<el-input v-model="state.queryForm.account" :placeholder="t('account.inputAccountTip')" style="max-width: 180px" />
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
					<el-button v-auth="'mp_wxaccount_add'" class="ml10" icon="folder-add" type="primary" @click="formDialogRef.openDialog()">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button
						plain
						v-auth="'mp_wxaccount_add'"
						class="ml10"
						icon="Delete"
						type="primary"
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'app_social_details_del'"
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
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="60" />
				<el-table-column :label="t('account.index')" type="index" width="60" />
				<el-table-column :label="t('account.name')" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('account.account')" prop="account" show-overflow-tooltip />
				<el-table-column :label="t('account.appid')" prop="appid" show-overflow-tooltip />
				<el-table-column :label="t('account.appsecret')" prop="appsecret" show-overflow-tooltip />
				<el-table-column :label="t('account.url')" prop="url" show-overflow-tooltip />
				<el-table-column :label="t('account.token')" prop="token" show-overflow-tooltip />
				<el-table-column :label="t('account.aeskey')" prop="aeskey" show-overflow-tooltip />
				<el-table-column :label="t('account.qrUrl')" prop="qrUrl" show-overflow-tooltip>
					<template #default="scope">
						<ImageUpload v-model:imageUrl="scope.row.qrUrl" height="80px" width="80px" disabled />
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="100" fixed="right">
					<template #default="scope">
						<el-dropdown>
							<span class="el-dropdown-link">
								更多功能
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item>
										<el-button icon="edit-pen" v-auth="'mp_wxaccount_edit'" text type="primary" @click="formDialogRef.openDialog(scope.row.id)"
											>{{ $t('common.editBtn') }}
										</el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button icon="delete" v-auth="'mp_wxaccount_del'" text type="primary" @click="handleDelete([scope.row.id])"
											>{{ $t('common.delBtn') }}
										</el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button icon="DArrowRight" v-auth="'mp_wxaccount_del'" text type="primary" @click="access(scope.row)">接入 </el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button icon="Grid" v-auth="'mp_wxaccount_del'" text type="primary" @click="generate(scope.row)">二维码 </el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button icon="refresh" v-auth="'mp_wxaccount_del'" text type="primary" @click="quota(scope.row)">quota </el-button>
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

		<el-dialog v-model="dialogFormVisible" title="接入">
			<el-input v-model="wxurl">
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
import other from '/@/utils/other';
const { proxy } = getCurrentInstance();
const { copyText } = commonFunction();
// 引入组件
const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
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
	downBlobFile('/mp/account/export', state.queryForm, 'account.xlsx');
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
			delObjs(ids)
				.then(() => {
					getDataList();
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};

const dialogFormVisible = ref(false);
const wxurl = ref();
const access = (row: any) => {
	dialogFormVisible.value = true;
	let url = '/mp/' + row.appid + '/portal';
	wxurl.value = row.url + proxy.baseURL + other.adaptationUrl(url);
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
		.catch(() => {
			useMessage().error('清空api的调用quota失败');
		});
};
</script>
