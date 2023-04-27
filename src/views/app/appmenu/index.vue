<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('appmenu.name')" prop="menuName">
						<el-input :placeholder="$t('appmenu.inputMenuNameTip')" style="max-width: 180px" v-model="state.queryForm.menuName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="menuDialogRef.openDialog('add')" class="ml10" icon="folder-add" type="primary" v-auth="'sys_menu_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_post_del'">
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
				:data="state.dataList"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				@selection-change="handleSelectionChange"
				row-key="path"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="$t('appmenu.name')" prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('appmenu.sortOrder')" prop="sortOrder" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('appmenu.path')" prop="path" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('appmenu.menuType')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.menuType === '0'">页面</el-tag>
						<el-tag type="success" v-if="scope.row.menuType === '2'">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('appmenu.visible')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="info" v-if="scope.row.visible === '0'">关闭</el-tag>
						<el-tag type="success" v-if="scope.row.visible === '1'">开启</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('appmenu.permission')" :show-overflow-tooltip="true" prop="permission"></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="250">
					<template #default="scope">
						<el-button icon="add" @click="menuDialogRef.openDialog('add', scope.row)" text type="primary" v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button icon="edit-pen" @click="menuDialogRef.openDialog('edit', scope.row)" text type="primary" v-auth="'sys_menu_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button icon="delete" @click="handleDelete([scope.row.id])" text type="primary" v-auth="'sys_menu_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<MenuDialog @refresh="getDataList()" ref="menuDialogRef" />
	</div>
</template>

<script lang="ts" name="systemMenu" setup>
import { delObj, pageList } from '/@/api/app/appmenu';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
const showSearch = ref(true);
const queryRef = ref();
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 定义变量内容
const menuDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList, // H
	queryForm: {
		menuName: '',
	},
	isPage: false,
});

const { getDataList, tableStyle } = useTable(state);

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
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
