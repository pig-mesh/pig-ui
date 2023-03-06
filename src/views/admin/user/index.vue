<template>
	<div class="layout-padding">
		<el-row :gutter="20">
			<el-col :span="4" :xs="24">
				<el-card shadow="hover" class="layout-padding-auto">
					<query-tree @node-click="handleNodeClick" :placeholder="$t('common.queryDeptTip')" :query="deptData.queryList" />
				</el-card>
			</el-col>
			<el-col :span="20" :xs="24">
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch" class="mb8">
						<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
							<el-form-item :label="$t('sysuser.username')" prop="username">
								<el-input v-model="state.queryForm.username" :placeholder="$t('sysuser.inputUsernameTip')" clearable style="width: 240px" />
							</el-form-item>
							<el-form-item :label="$t('sysuser.phone')" prop="phone">
								<el-input v-model="state.queryForm.phone" :placeholder="$t('sysuser.inputPhoneTip')" clearable style="width: 240px" />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" icon="Search" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button icon="folder-add" type="primary" class="ml10" @click="userDialogRef.openDialog()" v-auth="'sys_user_add'">
								{{ $t('common.addBtn') }}
							</el-button>
							<el-button icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()" v-auth="'sys_user_add'">
								{{ $t('common.importBtn') }}
							</el-button>
							<el-button icon="Download" type="primary" class="ml10" @click="exportExcel" v-auth="'sys_user_export'">
								{{ $t('common.exportBtn') }}
							</el-button>
							<el-button :disabled="multiple" icon="Delete" type="primary" class="ml10" v-auth="'sys_user_del'" @click="handleDelete(selectObjs)">
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
					<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection" :selectable="handleSelectable" width="50" align="center" />
						<el-table-column type="index" :label="$t('sysuser.index')" width="80" />
						<el-table-column prop="username" :label="$t('sysuser.username')" show-overflow-tooltip></el-table-column>
						<el-table-column prop="name" :label="$t('sysuser.name')" show-overflow-tooltip></el-table-column>
						<el-table-column prop="phone" :label="$t('sysuser.phone')" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.post')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.postList" type="success" :key="index">{{ item.postName }} </el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.role')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.roleList" type="success" :key="index">{{ item.roleName }} </el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.lockFlag')" show-overflow-tooltip>
							<template #default="scope">
								<dict-tag :options="lock_flag" :value="scope.row.lockFlag"></dict-tag>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" :label="$t('sysuser.createTime')" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('common.action')" width="150">
							<template #default="scope">
								<el-button text type="primary" @click="userDialogRef.openDialog(scope.row.userId)" v-auth="'sys_user_edit'">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-tooltip :content="$t('sysuser.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
									<span style="margin-left: 12px">
										<el-button
											text
											type="primary"
											:disabled="scope.row.userId === '1'"
											v-auth="'sys_user_del'"
											@click="handleDelete([scope.row.userId])"
											>{{ $t('common.delBtn') }}
										</el-button>
									</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>

					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"> </pagination>
				</div>
			</el-col>
		</el-row>

		<user-form ref="userDialogRef" @refresh="getDataList(false)" />

		<upload-excel
			ref="excelUploadRef"
			:title="$t('sysuser.importUserTip')"
			url="/admin/user/import"
			temp-url="/admin/sys-file/local/file/user.xlsx"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { pageList, delObj } from '/@/api/admin/user';
import { depttree } from '/@/api/admin/dept';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

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
		deptId: '',
		username: '',
		phone: '',
	},
	pageList: pageList,
	descs: ['create_time'],
});

// 部门树使用的数据
const deptData = reactive({
	queryList: (name: String) => {
		return depttree({
			deptName: name,
		});
	},
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 点击树
const handleNodeClick = (e: any) => {
	state.queryForm.deptId = e.id;
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/user/export', state.queryForm, 'users.xlsx');
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.userId !== '1';
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	objs.forEach((val: any) => {
		selectObjs.value.push(val.userId);
	});
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = (ids: string[]) => {
	useMessageBox()
		.confirm(t('common.delConfirmText'))
		.then(() => {
			delObj(ids)
				.then(() => {
					getDataList(false);
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};

onMounted(() => {
	state.dataList;
});
</script>
