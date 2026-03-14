<template>
	<el-dialog :title="$t('gen.batchGenBtn')" v-model="visible" :close-on-click-modal="false" width="600px">
		<el-form :model="form" ref="dataFormRef" label-width="120px">
			<el-form-item :label="$t('gen.author')" prop="author">
				<el-input v-model="form.author" :placeholder="$t('gen.inputAuthorTip')" />
			</el-form-item>
			<el-form-item :label="$t('gen.packageName')" prop="packageName">
				<el-input v-model="form.packageName" :placeholder="$t('gen.inputPackageNameTip')" />
			</el-form-item>
			<el-form-item :label="$t('gen.moduleName')" prop="moduleName">
				<el-input v-model="form.moduleName" :placeholder="$t('gen.inputModuleNameTip')" />
			</el-form-item>
			<el-form-item :label="$t('gen.style')" prop="style">
				<el-select v-model="form.style" :placeholder="$t('gen.inputStyleTip')">
					<el-option v-for="item in styleList" :key="item.id" :label="item.groupName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('gen.parentMenu')" prop="syncMenuId">
				<el-tree-select
					v-model="form.syncMenuId"
					:data="menuList"
					:props="{ value: 'id', label: 'name', children: 'children' }"
					value-key="id"
					placeholder="选择所属菜单"
					clearable
					check-strictly
					:render-after-expand="false"
					class="w100"
				/>
			</el-form-item>
			<el-form-item :label="$t('gen.formLayout')" prop="formLayout">
				<el-radio-group v-model="form.formLayout">
					<el-radio :label="1">{{ $t('gen.formLayoutOne') }}</el-radio>
					<el-radio :label="2">{{ $t('gen.formLayoutTwo') }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('gen.genType')" prop="generatorType">
				<el-radio-group v-model="form.generatorType">
					<el-radio label="0">{{ $t('gen.genTypeZip') }}</el-radio>
					<el-radio label="1">{{ $t('gen.genTypeCustom') }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="backendPath" v-if="form.generatorType === '1'">
				<template #label>
					<span>{{ $t('gen.backendPath') }}</span>
					<tip :content="$t('gen.backendPathTip')" />
				</template>
				<el-input :placeholder="$t('gen.inputBackendPathTip')" v-model="form.backendPath"></el-input>
			</el-form-item>
			<el-form-item prop="frontendPath" v-if="form.generatorType === '1'">
				<template #label>
					<span>{{ $t('gen.frontendPath') }}</span>
					<tip :content="$t('gen.frontendPathTip')" />
				</template>
				<el-input :placeholder="$t('gen.inputFrontendPathTip')" v-model="form.frontendPath"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="debouncedHandleSubmit" :loading="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/core';
import { groupList, useSyncTableApi, putObj, useGeneratorCodeApi } from '/@/api/gen/table';
import { pageList as menuListApi } from '/@/api/admin/menu';
import { downBlobFile } from '/@/utils/other';
import { Local } from '/@/utils/storage';

const { t } = useI18n();

// 基础状态变量
const visible = ref(false); // 对话框显示状态
const loading = ref(false); // 加载状态
const dataFormRef = ref(); // 表单引用

// 表单数据
const form = reactive({
	author: 'pig', // 作者
	packageName: 'com.pig4cloud.pig', // 包名
	moduleName: 'admin', // 模块名
	style: '', // 样式
	syncMenuId: '', // 同步菜单ID
	formLayout: 1, // 表单布局
	generatorType: '0', // 生成类型
	tableIds: [] as string[], // 表ID列表
	dsName: '', // 数据源名称
	frontendPath: '', // 前端路径
	backendPath: '', // 后端路径
});

// 数据存储
const styleList = ref<{ id: string; groupName: string }[]>([]); // 样式列表
const menuList = ref([]); // 菜单列表
const selectedTables = ref<any[]>([]); // 选中的表
const dsName = ref(''); // 数据源名称
const syncedTableMetas = ref<any[]>([]); // 同步后的表元数据

/**
 * 打开批量生成对话框
 * @param tables 选中的表列表
 * @param currentDsName 当前数据源名称
 */
const openDialog = async (tables: any[], currentDsName: string) => {
	// 初始化对话框状态
	visible.value = true;
	selectedTables.value = tables;
	dsName.value = currentDsName;
	syncedTableMetas.value = [];

	// 重置表单字段
	dataFormRef.value?.resetFields();

	// 设置动态表单值
	form.dsName = currentDsName;
	form.tableIds = tables.map((t) => t.id);

	// 同步表结构
	if (tables?.length > 0) {
		loading.value = true;
		ElMessage.info(t('gen.syncingTables'));

		try {
			// 并发同步所有选中的表
			const syncResults = await Promise.allSettled(
				tables.map((table) =>
					useSyncTableApi(currentDsName, table.name, true).then((response) => {
						// 只返回有效的表元数据
						return response.data?.id && response.data?.tableName ? response.data : null;
					})
				)
			);

			// 收集成功同步的表元数据
			syncedTableMetas.value = syncResults
				.filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled' && result.value !== null)
				.map((result) => result.value);

			// 显示同步结果
			if (syncedTableMetas.value.length > 0) {
				ElMessage.success(t('gen.allTablesSyncedSuccessfully'));
			}
		} finally {
			loading.value = false;
		}
	}

	// 加载本地存储的路径
	loadStoredPaths();

	// 获取分组和菜单列表
	await Promise.all([getGroupList(), getMenuList()]);
};

/**
 * 从本地存储加载路径配置
 */
const loadStoredPaths = () => {
	// 加载前端路径
	const localFrontendPath = Local.get('frontendPath');
	form.frontendPath = localFrontendPath || '';

	// 加载后端路径
	const localBackendPath = Local.get('backendPath');
	form.backendPath = localBackendPath || '';
};

// Watch for path changes and save to local storage
watch(
	() => form.frontendPath,
	(newVal) => {
		if (newVal) {
			Local.set('frontendPath', newVal);
		}
	}
);

watch(
	() => form.backendPath,
	(newVal) => {
		if (newVal) {
			Local.set('backendPath', newVal);
		}
	}
);

/**
 * 获取代码生成样式分组列表
 */
const getGroupList = async () => {
	const { data } = await groupList();
	styleList.value = data || [];

	// 设置默认样式
	if (data?.length > 0) {
		form.style = data[0].id;
	}
};

/**
 * 获取菜单列表
 */
const getMenuList = async () => {
	const { data } = await menuListApi();
	menuList.value = data || [];
};

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
	// 表单验证
	const valid = await dataFormRef.value.validate();
	if (!valid) return;

	// 确保有已同步的表
	if (!syncedTableMetas.value?.length) return;

	loading.value = true;

	try {
		// 更新表元数据并收集成功的表ID
		const putResults = await Promise.allSettled(syncedTableMetas.value.map((meta) => putObj({ id: meta.id, ...form }).then(() => meta.id)));

		// 筛选成功更新的表ID
		const tableIdsForGeneration = putResults
			.filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled' && Boolean(result.value))
			.map((result) => result.value);

		// 没有可生成的表，直接返回
		if (!tableIdsForGeneration.length) {
			return;
		}

		try {
			// 执行代码生成
			if (form.generatorType === '0') {
				// 生成ZIP下载
				const fileName = form.moduleName ? `${form.moduleName}.zip` : 'generated_code.zip';
				await downBlobFile(`/gen/generator/download?tableIds=${tableIdsForGeneration.join(',')}`, {}, fileName);
			} else {
				// 生成到指定路径
				await useGeneratorCodeApi(tableIdsForGeneration);
			}

			// 操作成功提示并关闭对话框
			ElMessage.success(t('common.optSuccessText'));
			visible.value = false;
		} catch (error) {
			ElMessage.error(t('gen.generationFailed'));
		}
	} finally {
		loading.value = false;
	}
};

const debouncedHandleSubmit = useDebounceFn(handleSubmit, 500);

// 向外暴露方法
defineExpose({
	openDialog,
});
</script>
