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
						<el-button text type="danger" v-if="filterOwnToken(scope.row)">
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

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 查询表单引用
 */
const queryRef = ref();

/**
 * 是否显示搜索区域
 */
const showSearch = ref(true);

/**
 * 多选的令牌数组
 */
const selectObjs = ref<string[]>([]);

/**
 * 是否禁用批量下线按钮（无选中项时禁用）
 */
const multiple = ref(true);

/**
 * 表格状态配置
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		username: '',
	},
	pageList: fetchList,
});

/**
 * 表格相关钩子函数
 */
const { getDataList, currentChangeHandle, sortChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

/**
 * 清空搜索条件并重新查询
 */
const resetQuery = (): void => {
	queryRef.value?.resetFields();
	getDataList();
};

/**
 * 表格多选事件处理
 * @param objs - 选中的行对象数组
 */
const handleSelectionChange = (objs: { accessToken: string }[]): void => {
	selectObjs.value = objs.map(({ accessToken }) => accessToken);
	multiple.value = !objs.length;
};

/**
 * 强制用户下线（删除令牌）
 * @param accessTokens - 要删除的访问令牌数组
 */
const handleDelete = async (accessTokens: string[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('systoken.offlineConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(accessTokens);
		getDataList();
		useMessage().success(t('systoken.offlineSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 判断当前令牌是否为登录用户的令牌
 * @param row - 表格行数据
 * @returns 是否为当前用户的令牌
 */
const filterOwnToken = (row: any): boolean => {
	return Session.getToken() === row.accessToken;
};
</script>
