<template>
	<div class="system-role-dialog-container">
		<el-dialog width="30%" v-model="state.dialog.isShowDialog" :close-on-click-modal="false" draggable>
			<template #header>
				<div class="flex items-center justify-between">
					<div>{{ state.dialog.title }}</div>
					<div class="flex mr-16">
            <el-checkbox :label="$t('common.expand')" @change="handleExpand"/>
            <el-checkbox :label="$t('common.selectAll')" @change="handleSelectAll"/>
					</div>
				</div>
			</template>
			<el-scrollbar class="h-[400px] sm:h-[600px]">
				<el-tree
					v-loading="loading"
					ref="menuTree"
					:data="state.treeData"
					:default-checked-keys="state.checkedKeys"
					:check-strictly="!checkStrictly"
					:props="state.defaultProps"
					class="filter-tree"
					node-key="id"
					highlight-current
					show-checkbox
				/>
			</el-scrollbar>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="state.dialog.isShowDialog = false">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="role-permession">
import { fetchRoleTree, permissionUpd } from '/@/api/admin/role';
import { pageList } from '/@/api/admin/menu';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import other from '/@/utils/other';
import { CheckboxValueType } from 'element-plus';

const { t } = useI18n();

const menuTree = ref();
const checkStrictly = ref(true);
const loading = ref(false);

const state = reactive({
	checkedKeys: [] as any[],
	treeData: [] as any[],
	defaultProps: {
		label: 'name',
		value: 'id',
	},
	roleId: '',
	dialog: {
		isShowDialog: false,
		title: '分配权限',
		submitTxt: '更新',
	},
});

const checkedKeys: Ref<any[]> = ref([]);

// 打开弹窗
const openDialog = (row: any) => {
	state.checkedKeys = [];
	state.treeData = [];
	checkedKeys.value = [];
	state.roleId = row.roleId;
	loading.value = true;
	fetchRoleTree(row.roleId)
		.then((res) => {
			checkedKeys.value = res.data;
			return pageList();
		})
		.then((r) => {
			state.treeData = r.data;
			state.checkedKeys = other.resolveAllEunuchNodeId(state.treeData, checkedKeys.value, []);
		})
		.finally(() => {
			loading.value = false;
		});
	state.dialog.isShowDialog = true;
};

const handleExpand = (check: CheckboxValueType) => {
	const treeList = state.treeData;
	for (let i = 0; i < treeList.length; i++) {
		//@ts-ignore
		menuTree.value.store.nodesMap[treeList[i].id].expanded = check;
	}
};

const handleSelectAll = (check: CheckboxValueType) => {
	if (check) {
		menuTree.value?.setCheckedKeys(state.treeData.map((item) => item.id));
	} else {
		menuTree.value?.setCheckedKeys([]);
	}
};

// 提交授权数据
const onSubmit = () => {
	const menuIds = menuTree.value.getCheckedKeys().join(',').concat(',').concat(menuTree.value.getHalfCheckedKeys().join(','));
	loading.value = true;
	permissionUpd(state.roleId, menuIds)
		.then(() => {
			state.dialog.isShowDialog = false;
			useMessage().success(t('common.editSuccessText'));
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
