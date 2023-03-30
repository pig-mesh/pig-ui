<template>
	<div class="layout-padding">
		<splitpanes>
			<pane size="15">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<query-tree :placeholder="$t('common.queryDeptTip')" :query="deptData.queryList" @node-click="handleNodeClick">
							<!-- 没有数据权限提示 -->
							<template #default="{ node, data }">
								<el-tooltip v-if="data.isLock" class="item" effect="dark" :content="$t('sysuser.noDataScopeTip')" placement="right-start">
									<span>{{ node.label }} <SvgIcon name="ele-Lock" /></span>
								</el-tooltip>
								<span v-if="!data.isLock">{{ node.label }}</span>
							</template>
						</query-tree>
					</el-scrollbar>
				</div>
			</pane>
			<pane class="ml8">
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('sysuser.username')" prop="username">
								<el-input v-model="state.queryForm.username" :placeholder="$t('sysuser.inputUsernameTip')" clearable style="width: 240px" />
							</el-form-item>
							<el-form-item :label="$t('sysuser.phone')" prop="phone">
								<el-input v-model="state.queryForm.phone" :placeholder="$t('sysuser.inputPhoneTip')" clearable style="width: 240px" />
							</el-form-item>
							<el-form-item>
								<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button v-auth="'sys_user_add'" class="ml10" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
								{{ $t('common.addBtn') }}
							</el-button>
							<el-button plain v-auth="'sys_user_add'" class="ml10" icon="upload-filled" type="primary" @click="excelUploadRef.show()">
								{{ $t('common.importBtn') }}
							</el-button>

							<el-button
								plain
								v-auth="'sys_user_del'"
								:disabled="multiple"
								class="ml10"
								icon="Delete"
								type="primary"
								@click="handleDelete(selectObjs)"
							>
								{{ $t('common.delBtn') }}
							</el-button>

							<right-toolbar
								v-model:showSearch="showSearch"
								:export="true"
								@exportExcel="exportExcel"
								@queryTable="getDataList"
								class="ml10 mr20"
								style="float: right"
							/>
						</div>
					</el-row>
					<el-table
						v-loading="state.loading"
						:data="state.dataList"
						@selection-change="handleSelectionChange"
						border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column :selectable="handleSelectable" align="center" type="selection" width="50" />
						<el-table-column :label="$t('sysuser.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('sysuser.username')" prop="username" fixed="left" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.name')" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.phone')" prop="phone" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.post')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.postList" :key="index" type="success">{{ item.postName }} </el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.role')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.roleList" :key="index" type="success">{{ item.roleName }} </el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.lockFlag')" show-overflow-tooltip>
							<template #default="scope">
								<dict-tag :options="lock_flag" :value="scope.row.lockFlag"></dict-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.createTime')" prop="createTime" show-overflow-tooltip width="180"></el-table-column>
						<el-table-column :label="$t('common.action')" width="160" fixed="right">
							<template #default="scope">
								<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary" @click="userDialogRef.openDialog(scope.row.userId)">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-tooltip :content="$t('sysuser.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
									<span style="margin-left: 12px">
										<el-button
											icon="delete"
											v-auth="'sys_user_del'"
											:disabled="scope.row.userId === '1'"
											text
											type="primary"
											@click="handleDelete([scope.row.userId])"
											>{{ $t('common.delBtn') }}
										</el-button>
									</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle"></pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" @refresh="getDataList(false)" />

		<upload-excel
			ref="excelUploadRef"
			:title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import"
			@refreshDataList="getDataList"
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
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 部门树使用的数据
const deptData = reactive({
	queryList: (name: String) => {
		return depttree({
			deptName: name,
		});
	},
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
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
	selectObjs.value.push(...objs.map((val: any) => val.userId));
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
</script>
