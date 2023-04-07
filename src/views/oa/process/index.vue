<template>
	<div class="layout-padding">
		<el-card class="layout-padding-auto" shadow="hover">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('process.category')" prop="category">
						<el-input :placeholder="$t('process.inputCategoryTip')" style="max-width: 180px" v-model="state.queryForm.category" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary" v-auth="'oa_process_view'">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'oa_process_del'">
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
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="$t('process.index')" type="index" width="60" />
				<el-table-column :label="$t('process.processonDefinitionId')" prop="processonDefinitionId" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('process.name')" prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('process.key')" prop="key" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('process.category')" prop="category" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('process.revision')" prop="revision" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('process.status')" prop="suspend" show-overflow-tooltip>
					<template #default="scope">
						<span v-if="scope.row.suspend"><el-tag type="danger">挂起</el-tag></span>
						<span v-else><el-tag>有效</el-tag></span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('process.deploymentTime')" prop="deploymentTime" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ parseTime(scope.row.deploymentTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button icon="picture" @click="handleView(scope.row)" text type="primary">流程图 </el-button>
						<el-button icon="VideoPause" @click="handleStatus(scope.row, 'suspend')" text type="primary" v-if="!scope.row.suspend">失效 </el-button>
						<el-button icon="VideoPlay" @click="handleStatus(scope.row, 'active')" text type="primary" v-if="scope.row.suspend">激活 </el-button>
						<el-button icon="delete" @click="handleDelete([scope.row.processonDefinitionId])" text type="primary" v-auth="'oa_process_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</el-card>

		<el-dialog title="流程图" v-model="showPicDialog">
			<img :src="actPicUrl" style="width: 100%" />
		</el-dialog>
	</div>
</template>

<script lang="ts" name="model" setup>
import { ComponentInternalInstance } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, status } from '/@/api/oa/process';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';

// 引入组件
const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 定义变量内容
const showPicDialog = ref(false);
const queryRef = ref();
const showSearch = ref(true);
// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);
// 流程图URL
const actPicUrl = ref('');

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		category: '',
	},
	pageList: fetchList, // H
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	selectObjs.value.push(...objs.map((val: any) => val.processonDefinitionId));
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

//查看流程图
const handleView = (row: any) => {
	let url =
		proxy.baseURL +
		`/act/process/resource/${row.deploymentId}/${
			row.processonDefinitionId
		}/image?access_token=${Session.getToken()}&TENANT-ID=${Session.getTenant()}`;
	actPicUrl.value = other.adaptationUrl(url);
	showPicDialog.value = true;
};

// 失效
const handleStatus = async (row, type) => {
	try {
		await useMessageBox().confirm('是否将此流程设置为 ' + type);
	} catch {
		return;
	}

	try {
		await status(row.processonDefinitionId, type);
		getDataList();
		useMessage().success(t('common.optSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
