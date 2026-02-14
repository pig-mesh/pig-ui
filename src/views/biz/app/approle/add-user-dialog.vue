<template>
	<div class="system-user-dialog-container">
		<el-dialog v-model="visible" width="60%" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
			<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="state.queryForm.username" placeholder="请输入用户名" clearable />
				</el-form-item>
				<el-form-item>
					<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
					<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
				</el-form-item>
			</el-form>

			<el-table
				ref="tableRef"
				v-loading="state.loading"
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				style="width: 100%"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column label="#" type="index" width="60" />
				<el-table-column label="用户名" prop="username" show-overflow-tooltip />
				<el-table-column label="姓名" prop="name" show-overflow-tooltip />
				<el-table-column label="手机号" prop="phone" show-overflow-tooltip />
			</el-table>

			<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle" />

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog" size="default">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button type="primary" @click="onSubmit" size="default" :disabled="selectedUsers.length === 0">
						批量授权 ({{ selectedUsers.length }})
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="AddUserDialog">
import { batchAddObj } from '/@/api/app/appuserrole';
import { pageList } from '/@/api/admin/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['refresh']);

interface Props {
	roleId?: string;
}

const props = withDefaults(defineProps<Props>(), {
	roleId: '',
});

const queryRef = ref();
const tableRef = ref();
const visible = ref(false);
const selectedUsers = ref<any[]>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		username: '',
		phone: '',
	},
	pageList: pageList,
	isPage: true,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const openDialog = () => {
	visible.value = true;
	selectedUsers.value = [];
	queryRef.value?.resetFields();
	getDataList();
};

const closeDialog = () => {
	visible.value = false;
	selectedUsers.value = [];
	state.queryForm = {
		username: '',
		phone: '',
	};
};

const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

const handleSelectionChange = (selection: any[]) => {
	selectedUsers.value = selection;
};

const onSubmit = async () => {
	if (!props.roleId) {
		useMessage().error('请先选择角色');
		return;
	}

	if (selectedUsers.value.length === 0) {
		useMessage().error('请选择要插入的用户');
		return;
	}

	try {
		const userRoleList = selectedUsers.value.map(user => ({
			userId: user.userId,
			roleId: props.roleId
		}));

		await batchAddObj(userRoleList);

		useMessage().success(`成功为 ${selectedUsers.value.length} 个用户分配角色`);
		emit('refresh');
		closeDialog();
	} catch (err: any) {
		useMessage().error(err.msg || '批量插入失败');
	}
};

defineExpose({
	openDialog,
	closeDialog,
});
</script>

<style scoped lang="scss">
.system-user-dialog-container {
	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
}
</style> 