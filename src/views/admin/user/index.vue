<template>
	<div class="layout-padding">
		<el-row :gutter="10">
			<el-col :span="4" :xs="24">
				<el-card class="layout-padding-auto" shadow="hover">
					<query-tree :placeholder="$t('common.queryDeptTip')" :query="deptData.queryList" @node-click="handleNodeClick">
						<template #default="{ node, data }">
							<el-tooltip v-if="data.isLock" class="item" effect="dark" content="无数据权限" placement="right-start">
								<span>{{ node.label }} <SvgIcon name="ele-Lock"></SvgIcon></span>
							</el-tooltip>
							<span v-if="!data.isLock">{{ node.label }}</span>
						</template>
					</query-tree>
				</el-card>
			</el-col>
			<el-col :span="20" :xs="24">
				<div class="layout-padding-auto layout-padding-view">
					<el-row class="mb8" v-show="showSearch">
						<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
							<el-form-item :label="$t('sysuser.username')" prop="username">
								<el-input :placeholder="$t('sysuser.inputUsernameTip')" clearable style="width: 240px" v-model="state.queryForm.username" />
							</el-form-item>
							<el-form-item :label="$t('sysuser.phone')" prop="phone">
								<el-input :placeholder="$t('sysuser.inputPhoneTip')" clearable style="width: 240px" v-model="state.queryForm.phone" />
							</el-form-item>
							<el-form-item>
								<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
								<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button @click="userDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary" v-auth="'sys_user_add'">
								{{ $t('common.addBtn') }}
							</el-button>
							<el-button @click="excelUploadRef.show()" class="ml10" icon="upload-filled" type="primary" v-auth="'sys_user_add'">
								{{ $t('common.importBtn') }}
							</el-button>
							<el-button @click="exportExcel" class="ml10" icon="Download" type="primary" v-auth="'sys_user_export'">
								{{ $t('common.exportBtn') }}
							</el-button>
							<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_user_del'">
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
					<el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%" v-loading="state.loading">
						<el-table-column :selectable="handleSelectable" align="center" type="selection" width="50" />
						<el-table-column :label="$t('sysuser.index')" type="index" width="80" />
						<el-table-column :label="$t('sysuser.username')" prop="username" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.name')" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.phone')" prop="phone" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.post')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag :key="index" type="success" v-for="(item, index) in scope.row.postList">{{ item.postName }} </el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.role')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag :key="index" type="success" v-for="(item, index) in scope.row.roleList">{{ item.roleName }} </el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.lockFlag')" show-overflow-tooltip>
							<template #default="scope">
								<dict-tag :options="lock_flag" :value="scope.row.lockFlag"></dict-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.createTime')" prop="createTime" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('common.action')" width="150">
							<template #default="scope">
								<el-button @click="userDialogRef.openDialog(scope.row.userId)" text type="primary" v-auth="'sys_user_edit'">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-tooltip :content="$t('sysuser.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
									<span style="margin-left: 12px">
										<el-button
											:disabled="scope.row.userId === '1'"
											@click="handleDelete([scope.row.userId])"
											text
											type="primary"
											v-auth="'sys_user_del'"
											>{{ $t('common.delBtn') }}
										</el-button>
									</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>

					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"> </pagination>
				</div>
			</el-col>
		</el-row>

		<user-form @refresh="getDataList(false)" ref="userDialogRef" />

		<upload-excel
			:title="$t('sysuser.importUserTip')"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import"
		/>
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { delObj, pageList } from '/@/api/admin/user';
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
