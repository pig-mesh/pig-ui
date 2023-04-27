<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('systoken.username')" prop="username">
						<el-input :placeholder="$t('systoken.inputUsernameTip')" v-model="state.queryForm.username"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_user_del'">
						{{ $t('systoken.offlineBtn') }}
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
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="$t('systoken.index')" type="index" width="60" />
				<el-table-column :label="$t('systoken.username')" prop="username" show-overflow-tooltip width="150"></el-table-column>
				<el-table-column :label="$t('systoken.clientId')" prop="clientId" show-overflow-tooltip width="100"></el-table-column>
				<el-table-column :label="$t('systoken.accessToken')" prop="accessToken" show-overflow-tooltip>
					<template #default="scope">
						<el-button link type="danger" v-if="filterOwnToken(scope.row)">
							{{ scope.row.accessToken }}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column :label="$t('systoken.expiresAt')" prop="expiresAt" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="100">
					<template #default="scope">
						<el-button icon="delete" @click="handleDelete([scope.row.accessToken])" size="small" text type="primary" v-auth="'sys_user_del'">
							{{ $t('systoken.offlineBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"> </pagination>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList } from '/@/api/admin/token';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { Session } from '/@/utils/storage';

const { t } = useI18n();
// 定义变量内容
const queryRef = ref();
const showSearch = ref(true);
// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		username: '',
	},
	pageList: fetchList,
});
const { getDataList, currentChangeHandle, sortChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

// 多选事件
const handleSelectionChange = (objs: { accessToken: string }[]) => {
	selectObjs.value = objs.map(({ accessToken }) => accessToken);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (accessTokens: string[]) => {
	try {
		await useMessageBox().confirm(t('systoken.offlineConfirmText'));
	} catch {
		return; // 取消删除则直接跳过此方法
	}

	try {
		await delObj(accessTokens);
		getDataList();
		useMessage().success(t('systoken.offlineSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 判断当前token 是否和登录token一致
const filterOwnToken = (row: any) => {
	return Session.getToken() === row.accessToken;
};
</script>
