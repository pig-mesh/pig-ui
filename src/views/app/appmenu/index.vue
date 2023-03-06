<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div @keyup.enter="getDataList" class="mb15">
				<el-input :placeholder="$t('appmenu.inputNameTip')" style="max-width: 180px" v-model="state.queryForm.menuName"></el-input>
				<el-button @click="getDataList" class="ml10" icon="search" type="primary">
					{{ $t('common.queryBtn') }}
				</el-button>
				<el-button @click="onOpenAddMenu" class="ml10" icon="folder-add" type="primary" v-auth="'sys_menu_add'">
					{{ $t('common.addBtn') }}
				</el-button>
				<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_post_del'">
					{{ $t('common.delBtn') }}
				</el-button>
			</div>
			<el-table
				:data="state.dataList"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				@selection-change="handleSelectionChange"
				row-key="path"
				style="width: 100%"
				v-loading="state.loading"
			>
				<el-table-column align="center" type="selection" width="50" />
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
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button @click="onOpenAddMenu('add', scope.row)" text type="primary" v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button @click="onOpenEditMenu('edit', scope.row)" text type="primary" v-auth="'sys_menu_edit'">{{ $t('common.editBtn') }} </el-button>
						<el-button @click="handleDelete([scope.row.id])" text type="primary" v-auth="'sys_menu_del'">{{ $t('common.delBtn') }} </el-button>
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

// 定义变量内容
const menuDialogRef = ref<InstanceType<typeof MenuDialog>>();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList, // H
	queryForm: {
		menuName: '',
	},
	isPage: false,
});

// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 多选事件
const handleSelectionChange = (objs: any) => {
	selectObjs.value = [];
	objs.forEach((val: any) => {
		selectObjs.value.push(val.id);
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
					getDataList();
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};

const { getDataList } = useTable(state);

// 打开新增菜单弹窗
const onOpenAddMenu = (type: string, row: any) => {
	menuDialogRef.value.openDialog(type, row);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: any) => {
	menuDialogRef.value.openDialog(type, row);
};
</script>
