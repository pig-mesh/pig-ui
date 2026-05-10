<script lang="ts" name="roleTabbarDialog" setup>
import { getAppTabbars, getRoleTabbars, updateRoleTabbars } from '/@/api/app/approle';
import type { AppTabbarItem } from '/@/api/app/approle';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);

const visible = shallowRef(false);
const loading = shallowRef(false);
const currentRoleId = shallowRef('');
const currentRoleName = shallowRef('');
const tabbarList = ref<AppTabbarItem[]>([]);
const selectedTabbarIds = ref<number[]>([]);

const normalizeTabbarIds = (data: unknown) =>
	Array.isArray(data) ? Array.from(new Set(data.map((id) => Number(id)).filter((id) => Number.isFinite(id)))) : [];

const getTabbarId = (tabbar?: AppTabbarItem) => {
	const tabbarId = Number(tabbar?.id);
	return Number.isFinite(tabbarId) ? tabbarId : undefined;
};

const isPublicTabbar = (tabbar?: AppTabbarItem) => tabbar?.loginFlag === '0';

const isSelected = (tabbar?: AppTabbarItem) => {
	const tabbarId = getTabbarId(tabbar);
	return tabbarId !== undefined && (isPublicTabbar(tabbar) || selectedTabbarIds.value.includes(tabbarId));
};

const toggleTabbar = (tabbar?: AppTabbarItem) => {
	const tabbarId = getTabbarId(tabbar);
	if (tabbarId === undefined || isPublicTabbar(tabbar)) return;

	const index = selectedTabbarIds.value.indexOf(tabbarId);
	if (index > -1) {
		selectedTabbarIds.value.splice(index, 1);
		return;
	}

	selectedTabbarIds.value.push(tabbarId);
};

const getAuthorizedTabbarIds = () => {
	return selectedTabbarIds.value.filter((tabbarId) => {
		const tabbar = tabbarList.value.find((item) => getTabbarId(item) === tabbarId);
		return tabbar && !isPublicTabbar(tabbar);
	});
};

const getTabbarData = async () => {
	const { data } = await getAppTabbars();
	tabbarList.value = Array.isArray(data) ? data : [];
};

const getRoleTabbarData = async (roleId: string) => {
	const { data } = await getRoleTabbars(roleId);
	selectedTabbarIds.value = normalizeTabbarIds(data);
};

const openDialog = async (roleId: string, roleName?: string) => {
	visible.value = true;
	currentRoleId.value = roleId;
	currentRoleName.value = roleName || '';
	selectedTabbarIds.value = [];

	try {
		loading.value = true;
		await Promise.all([getTabbarData(), getRoleTabbarData(roleId)]);
	} catch (err: any) {
		useMessage().error(err.msg || '获取数据失败');
	} finally {
		loading.value = false;
	}
};

const onSubmit = async () => {
	try {
		loading.value = true;
		await updateRoleTabbars({
			roleId: currentRoleId.value,
			tabbarIds: getAuthorizedTabbarIds(),
		});
		useMessage().success('Tabbar 授权成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg || '授权失败');
	} finally {
		loading.value = false;
	}
};

defineExpose({
	openDialog,
});
</script>

<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="$t('approle.tabbarDialogTitle')" width="720px" draggable>
		<div v-loading="loading">
			<div class="mb-4">
				<el-alert
					:title="currentRoleName ? `${currentRoleName} - ${$t('approle.tabbarDialogTip')}` : $t('approle.tabbarDialogTip')"
					type="info"
					:closable="false"
					show-icon
				/>
			</div>

			<div v-if="tabbarList.length > 0" class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
				<div
					v-for="item in tabbarList"
					:key="item.id"
					class="relative flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-3 transition-colors hover:border-primary hover:shadow-sm dark:border-gray-600 dark:bg-gray-800"
					:class="{
						'border-primary bg-blue-50 shadow-sm dark:bg-blue-900/20': isSelected(item),
						'cursor-pointer': !isPublicTabbar(item),
						'cursor-not-allowed': isPublicTabbar(item),
					}"
					@click="toggleTabbar(item)"
				>
					<el-checkbox class="mr-3" :model-value="isSelected(item)" :disabled="isPublicTabbar(item)" @click.stop @change="toggleTabbar(item)" />
					<div class="min-w-0 flex-1">
						<div class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.name }}</div>
						<div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
							{{ item.loginFlag === '0' ? '公开固定可见' : '登录后可授权' }}
						</div>
					</div>
				</div>
			</div>

			<div v-else class="py-10 text-center">
				<el-empty :description="$t('approle.emptyTabbar')" />
			</div>
		</div>

		<template #footer>
			<div class="flex justify-end gap-3">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" :disabled="loading" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>
