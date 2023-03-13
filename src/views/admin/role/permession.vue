<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" :close-on-click-modal="false" draggable>
			<el-tree
				v-loading="loading"
				ref="menuTree"
				:data="state.treeData"
				:default-checked-keys="state.checkedKeys"
				:check-strictly="false"
				:props="state.defaultProps"
				class="filter-tree"
				node-key="id"
				highlight-current
				show-checkbox
				default-expand-all
			/>

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

const { t } = useI18n();

const menuTree = ref();
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
			state.checkedKeys = resolveAllEunuchNodeId(state.treeData, checkedKeys.value, []);
		})
		.finally(() => {
			loading.value = false;
		});
	state.dialog.isShowDialog = true;
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

// 遍历节点
const resolveAllEunuchNodeId = (json: any[], idArr: any[], temp: any[]) => {
	for (let i = 0; i < json.length; i++) {
		const item = json[i];
		// 国际化
		item.name = t(item.name);
		// 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
		if (item.children && item.children.length !== 0) {
			resolveAllEunuchNodeId(item.children, idArr, temp);
		} else {
			temp.push(idArr.filter((id) => id === item.id));
		}
	}
	return temp;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
