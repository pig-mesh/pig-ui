<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item :label="$t('fans.nickname')" prop="nickname">
						<el-input v-model="state.queryForm.nickname" style="max-width: 180px" :placeholder="$t('fans.inputNicknameTip')" />
					</el-form-item>
					<el-form-item :label="$t('fans.wxAccountName')" prop="wxAccountAppid">
						<el-select v-model="state.queryForm.wxAccountAppid" :placeholder="$t('fans.wxAccountName')" clearable class="w100">
							<el-option v-for="item in accountList" :key="item.appid" :label="item.name" :value="item.appid" />
						</el-select>
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
					<el-button type="primary" class="ml10" icon="Sort" @click="asyncFans" v-auth="'mp_wxaccountfans_sync'">同步</el-button>

					<right-toolbar
						:export="'mp_wxaccountfans_sync'"
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
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column :label="t('fans.index')" type="index" width="60" />
				<el-table-column :label="t('fans.openid')" prop="openid" show-overflow-tooltip />
				<el-table-column :label="t('fans.subscribeStatus')" prop="subscribeStatus" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="subscribe" :value="scope.row.subscribeStatus"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('fans.subscribeTime')" prop="subscribeTime" show-overflow-tooltip />
				<el-table-column :label="t('fans.nickname')" prop="nickname" show-overflow-tooltip />
				<el-table-column :label="t('fans.language')" prop="language" show-overflow-tooltip />
				<el-table-column :label="t('fans.isBlack')" prop="isBlack" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="blackList" :value="scope.row.isBlack"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('fans.tagIds')" prop="tagIds" show-overflow-tooltip>
					<template #default="scope">
						<span v-for="(tag, index) in scope.row.tagList" :key="index">
							<el-tag>{{ tag.tag }} </el-tag>&nbsp;&nbsp;
						</span>
					</template>
				</el-table-column>
				<el-table-column :label="t('fans.remark')" prop="remark" show-overflow-tooltip />
				<el-table-column :label="t('fans.wxAccountName')" prop="wxAccountName" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="250" fixed="right">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" @click="formDialogRef.openDialog(scope.row, state.queryForm.wxAccountAppid)"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button icon="delete" text type="primary" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }} </el-button>
						<el-button icon="CircleCheck" text type="primary" @click="handelUnBlack([scope.row.id])" v-if="scope.row.isBlack"> 取消拉黑 </el-button>
						<el-button icon="warning" text type="primary" @click="handelBlack([scope.row.id])" v-else> 拉黑 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
			<form-dialog ref="formDialogRef" @refresh="getDataList"></form-dialog>
		</div>
	</div>
</template>

<script lang="ts" name="systemWxAccountFans" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { black, delObjs, fetchList, sync, unblack } from '/@/api/mp/wx-account-fans';
import { fetchAccountList } from '/@/api/mp/wx-account';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';

const FormDialog = defineAsyncComponent(() => import('./form.vue'));

const { subscribe } = useDict('subscribe');

// 引入组件
const { t } = useI18n();
// 定义查询字典
const blackList = ref([
	{
		label: '是',
		value: '1',
	},
	{
		label: '否',
		value: '0',
	},
]);

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	createdIsNeed: false,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

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

watch(
	() => state.queryForm.wxAccountAppid,
	() => {
		getDataList();
	}
);

const asyncFans = () => {
	if (state.queryForm.wxAccountAppid) {
		sync(state.queryForm.wxAccountAppid).then(() => {
			useMessage().success('已开始从微信同步粉丝信息，建议等待后查询');
			getDataList();
		});
	} else {
		useMessage().error('请选择公众号');
	}
};

onMounted(() => {
	getAccountList();
});

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
	downBlobFile('/mp/fans/export', state.queryForm, 'fans.xlsx');
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

const handelBlack = (ids: string[]) => {
	useMessageBox()
		.confirm('是否要拉黑用户')
		.then(() => {
			black(ids, state.queryForm.wxAccountAppid)
				.then(() => {
					getDataList();
					useMessage().success('拉黑用户成功');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};

const handelUnBlack = (ids: string[]) => {
	useMessageBox()
		.confirm('是否要取消拉黑用户')
		.then(() => {
			unblack(ids, state.queryForm.wxAccountAppid)
				.then(() => {
					getDataList();
					useMessage().success('设置成功');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};
</script>
