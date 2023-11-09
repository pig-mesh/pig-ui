<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('appuser.username')" prop="username">
						<el-input :placeholder="$t('appuser.inputUserNameTip')" @keyup.enter="getDataList" clearable v-model="state.queryForm.username" />
					</el-form-item>
					<el-form-item :label="$t('appuser.phone')" prop="phone">
						<el-input :placeholder="$t('appuser.inputPhoneTip')" @keyup.enter="getDataList" clearable v-model="state.queryForm.phone" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="userDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary" v-auth="'app_appuser_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain @click="excelUploadRef.show()" class="ml10" icon="upload-filled" type="primary" v-auth="'app_appuser_export'">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button plain :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'app_appuser_del'">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'app_appuser_export'"
						@exportExcel="exportExcel"
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
        row-key="userId"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="$t('appuser.index')" type="index" width="60" />
				<el-table-column :label="$t('appuser.username')" prop="username" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('appuser.nickname')" prop="nickname" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('appuser.avatar')" prop="avatar" show-overflow-tooltip>
					<template #default="scope">
						<div style="display: flex; justify-content: center">
							<ImageUpload v-model:imageUrl="scope.row.avatar" height="50px" width="50px" disabled />
						</div>
					</template>
				</el-table-column>
				<el-table-column :label="$t('appuser.role')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag :key="index" v-for="(item, index) in scope.row.roleList">{{ item.roleName }} </el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('appuser.lockFlag')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="lock_flag" :value="scope.row.lockFlag"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('appuser.createTime')" prop="createTime" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" @click="userDialogRef.openDialog(scope.row.userId)" text type="primary" v-auth="'app_appuser_edit'">
							{{ $t('common.editBtn') }}
						</el-button>
						<el-button icon="delete" @click="handleDelete([scope.row.userId])" text type="primary" v-auth="'app_appuser_del'">
							{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"> </pagination>
		</div>
		<user-form @refresh="getDataList()" ref="userDialogRef" />

		<upload-excel
			:title="$t('appuser.importUserTip')"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			temp-url="/admin/sys-file/local/file/appuser.xlsx"
			url="/admin/appuser/import"
		/>
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { delObj, fetchList } from '/@/api/app/appuser';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));

const { lock_flag } = useDict('lock_flag');
const { t } = useI18n();

// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);

// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		username: '',
		phone: '',
	},
	pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/app/appuser/export',Object.assign( state.queryForm,{ids:selectObjs}), 'users.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { userId: string }[]) => {
	selectObjs.value = objs.map(({ userId }) => userId);
	multiple.value = !objs.length;
};

// 删除用户
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
</script>
