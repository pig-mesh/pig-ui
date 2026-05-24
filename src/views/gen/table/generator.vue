<template>
	<el-form :model="dataForm" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
		<el-row>
			<el-col :span="24" class="mb20">
				<el-form-item label="代码风格" prop="style">
					<el-select v-model="dataForm.style">
						<el-option :key="index" :label="item.groupName" :value="item.id"
							v-for="(item, index) in groupDataList"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<!-- 特殊模板配置按钮 -->
			<el-col :span="24" class="mb20" v-if="showChildTableButton || showTreeTableButton || showLeftTreeRightTableButton">
				<el-form-item label="表配置">
					<div class="flex gap-2">
						<el-button v-if="showChildTableButton" plain icon="Search"
							@click="openChildTableConfigDialog">子表</el-button>
						<el-tag v-if="showChildTableButton && childForm?.childTableName" type="info" class="ml-1">{{ childForm.childTableName }}</el-tag>
						<el-button v-if="showTreeTableButton" plain icon="Connection"
							@click="openTreeTableConfigDialog">树表</el-button>
						<el-tag v-if="showTreeTableButton && treeForm?.parentField" type="info" class="ml-1">{{ treeForm.parentField }}</el-tag>
						<el-button v-if="showLeftTreeRightTableButton" plain @click="openLeftTreeRightTableConfigDialog">左树右表</el-button>
						<el-tag v-if="showLeftTreeRightTableButton && leftTreeRightTableForm?.childTableName" type="info" class="ml-1">{{ leftTreeRightTableForm.childTableName }}</el-tag>
						<child-table-config v-if="showChildTableButton" v-model="childForm" ref="childTableRef" />
						<tree-table-config v-if="showTreeTableButton" v-model="treeForm" ref="treeTableRef" />
						<tree-table-config-dialog v-if="showLeftTreeRightTableButton" v-model="leftTreeRightTableForm" ref="leftTreeRightTableRef" />
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="mb20">
				<el-form-item label="注释" prop="tableComment">
					<el-input placeholder="说明" v-model="dataForm.tableComment"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item label="类名" prop="className">
					<el-input placeholder="类名" v-model="dataForm.className"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="mb20">
				<el-form-item label="作者" prop="author">
					<el-input placeholder="默认作者" v-model="dataForm.author"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item label="项目包名" prop="packageName">
					<el-input placeholder="项目包名" v-model="dataForm.packageName"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="mb20">
				<el-form-item prop="moduleName">
					<template #label>
						<span>模块名</span>
						<tip content="所属微服务模块名称，对应微服务路由前缀" />
					</template>
					<el-input placeholder="模块名" v-model="dataForm.moduleName"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item prop="functionName">
					<template #label>
						<span>功能名</span>
						<tip content="对应生成的Controller @RequestMapping 请求路径" />
					</template>
					<el-input placeholder="功能名" v-model="dataForm.functionName"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="mb20">
				<el-form-item prop="syncMenuId">
					<template #label>
						所属菜单
						<tip :content="`生成的 【${dataForm.tableComment}管理】菜单挂载在哪个目录下 `" />
					</template>
					<el-tree-select filterable v-model="dataForm.syncMenuId" :data="menuData"
						:render-after-expand="false" :props="{ value: 'id', label: 'name', children: 'children' }"
						class="w100" clearable check-strictly :placeholder="$t('sysmenu.inputParentIdTip')">
					</el-tree-select>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item prop="syncRoute">
					<template #label>
						同步路由
						<tip :content="`微服务架构下会自动创建一条【/${dataForm.moduleName}】的网关路由，存在则跳过`" />
					</template>
					<el-radio-group v-model="dataForm.syncRoute">
						<el-radio value="0">手动添加</el-radio>
						<el-radio value="1">自动创建</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="mb20">
				<el-form-item label="表单布局" prop="formLayout">
					<el-radio-group v-model="dataForm.formLayout">
						<el-radio :value="1">一列</el-radio>
						<el-radio :value="2">两列</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item label="生成方式" prop="generatorType">
					<el-radio-group v-model="dataForm.generatorType">
						<el-radio value="1">路径写出</el-radio>
						<el-radio value="0">ZIP</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item prop="backendPath" v-if="dataForm.generatorType === '1'">
					<template #label>
						<span>后端路径</span>
						<tip content="后端模块biz所在文件全路径比如：D:\data\pigx\pigx-upms\pigx-upms-biz" />
					</template>
					<el-input placeholder="后端生成路径" v-model="dataForm.backendPath"></el-input>
				</el-form-item>
				<el-form-item prop="frontendPath" v-if="dataForm.generatorType === '1'">
					<template #label>
						<span>前端路径</span>
						<tip content="前端所在文件全路径比如：D:\data\pigx-ui" />
					</template>
					<el-input placeholder="前端生成路径" v-model="dataForm.frontendPath"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script lang="ts" setup>
import { useDebounceFn, useLocalStorage, watchIgnorable, watchImmediate } from '@vueuse/core';
import { putObj, useTableApi } from '/@/api/gen/table';
import { list as groupList } from '/@/api/gen/group';
import { Local } from '/@/utils/storage';
import { rule } from '/@/utils/validate';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { checkVersion, online } from '/@/api/gen/template';
import mittBus from '/@/utils/mitt';
import { pageList } from '/@/api/admin/menu';
import Tip from '/@/components/Tip/index.vue';

const ChildTableConfig = defineAsyncComponent(() => import('./child.vue'));
const TreeTableConfig = defineAsyncComponent(() => import('./tree.vue'));
const TreeTableConfigDialog = defineAsyncComponent(() => import('./treeTable.vue'));

const props = defineProps({
	tableName: {
		type: String,
	},
	dsName: {
		type: String,
	},
});

const isMicro = import.meta.env.VITE_IS_MICRO;
const route = useRoute();
const loading = ref(false);
const dataFormRef = ref();
const childTableRef = ref();
const createDefaultChildForm = () => ({
	childTableName: '',
	mainField: '',
	childField: '',
});
const childForm = ref(createDefaultChildForm());
const treeTableRef = ref();
const createDefaultTreeForm = () => ({
	parentField: '',
	nameField: '',
});
const treeForm = ref(createDefaultTreeForm());
const leftTreeRightTableRef = ref();
const createDefaultLeftTreeRightTableForm = () => ({
	childTableName: '',
	childField: '',
	parentField: '',
	nameField: '',
});
const leftTreeRightTableForm = ref(createDefaultLeftTreeRightTableForm());
const tableNameStr = ref('');
const createDefaultDataForm = () => ({
	id: '',
	generatorType: '0',
	formLayout: 1,
	backendPath: '',
	frontendPath: '',
	packageName: '',
	email: '',
	author: '',
	version: '',
	moduleName: '',
	functionName: '',
	className: '',
	tableComment: '',
	tableName: '' as string,
	dsName: '' as string,
	style: '', //  默认风格 element-plus
	childTableName: '',
	mainField: '',
	childField: '',
	syncRoute: '0',
	syncMenuId: '',
	parentField: '',
	nameField: '',
});
const dataForm = reactive(createDefaultDataForm());

type GeneratorBaseInfoDraft = {
	generatorType: string;
	formLayout: number;
	backendPath: string;
	frontendPath: string;
	packageName: string;
	author: string;
	moduleName: string;
	functionName: string;
	className: string;
	tableComment: string;
	style: string;
	syncRoute: string;
	syncMenuId: string;
};

type SharedGeneratorBaseInfoDraft = Pick<GeneratorBaseInfoDraft, 'backendPath' | 'frontendPath' | 'packageName' | 'author'>;
type ScopedGeneratorBaseInfoDraft = Omit<GeneratorBaseInfoDraft, keyof SharedGeneratorBaseInfoDraft>;

type ChildTableDraft = {
	childTableName: string;
	mainField: string;
	childField: string;
};

type TreeTableDraft = {
	parentField: string;
	nameField: string;
};

type LeftTreeRightTableDraft = {
	childTableName: string;
	childField: string;
	parentField: string;
	nameField: string;
};

type GeneratorDraft = {
	baseInfo: ScopedGeneratorBaseInfoDraft;
	childTableConfig: ChildTableDraft;
	treeTableConfig: TreeTableDraft;
	leftTreeRightTableConfig: LeftTreeRightTableDraft;
};

const GENERATOR_DRAFT_CACHE_KEY = 'gen:table:generator:base-info';
const GENERATOR_SHARED_DRAFT_KEY = '__global__';
const generatorDraftCache = useLocalStorage<Record<string, Partial<GeneratorDraft> | GeneratorBaseInfoDraft | Partial<SharedGeneratorBaseInfoDraft>>>(GENERATOR_DRAFT_CACHE_KEY, {});

const groupDataList = ref<Array<{ id: string; groupName: string }>>([]);

// 计算当前选择的模板类型
const currentTemplateType = computed(() => {
	if (!dataForm.style) return '';
	const selectedGroup = groupDataList.value.find(group => group.id === dataForm.style);
	return selectedGroup?.groupName || '';
});

// 判断是否显示子表按钮
const showChildTableButton = computed(() => {
	return currentTemplateType.value.includes('主子');
});

// 判断是否显示树表按钮
const showTreeTableButton = computed(() => {
	return currentTemplateType.value.includes('树形');
});

// 判断是否显示左树右表配置按钮
const showLeftTreeRightTableButton = computed(() => {
	return currentTemplateType.value.includes('左树右表');
});

const getBaseInfoCacheId = (dsName: string, tableName: string) => {
	const currentDsName = String(dsName || '').trim();
	const currentTableName = String(tableName || '').trim();
	if (!currentDsName || !currentTableName) {
		return '';
	}
	return `${currentDsName}/${currentTableName}`;
};

const getSharedBaseInfoDraft = (): SharedGeneratorBaseInfoDraft => ({
	backendPath: dataForm.backendPath,
	frontendPath: dataForm.frontendPath,
	packageName: dataForm.packageName,
	author: dataForm.author,
});

const getScopedBaseInfoDraft = (): ScopedGeneratorBaseInfoDraft => ({
	generatorType: dataForm.generatorType,
	formLayout: dataForm.formLayout,
	moduleName: dataForm.moduleName,
	functionName: dataForm.functionName,
	className: dataForm.className,
	tableComment: dataForm.tableComment,
	style: dataForm.style,
	syncRoute: dataForm.syncRoute,
	syncMenuId: dataForm.syncMenuId,
});

const getGeneratorDraft = (): GeneratorDraft => ({
	baseInfo: getScopedBaseInfoDraft(),
	childTableConfig: { ...childForm.value },
	treeTableConfig: { ...treeForm.value },
	leftTreeRightTableConfig: { ...leftTreeRightTableForm.value },
});

const applySharedBaseInfoDraft = (draft?: Partial<SharedGeneratorBaseInfoDraft>) => {
	if (!draft) {
		return;
	}
	Object.assign(dataForm, draft);
};

const applyScopedBaseInfoDraft = (draft?: Partial<ScopedGeneratorBaseInfoDraft>) => {
	if (!draft) {
		return;
	}
	Object.assign(dataForm, draft);
};

const applyRelationConfigFromTable = (tableData?: Record<string, any>) => {
	Object.assign(childForm.value, createDefaultChildForm(), {
		childTableName: tableData?.childTableName || '',
		mainField: tableData?.mainField || '',
		childField: tableData?.childField || '',
	});
	Object.assign(treeForm.value, createDefaultTreeForm(), {
		parentField: tableData?.parentField || '',
		nameField: tableData?.nameField || '',
	});
	Object.assign(leftTreeRightTableForm.value, createDefaultLeftTreeRightTableForm(), {
		childTableName: tableData?.childTableName || '',
		childField: tableData?.childField || '',
		parentField: tableData?.parentField || '',
		nameField: tableData?.nameField || '',
	});
};

const normalizeGeneratorDraft = (draft?: Partial<GeneratorDraft> | GeneratorBaseInfoDraft) => {
	if (!draft) {
		return {};
	}
	if ('baseInfo' in draft || 'childTableConfig' in draft || 'treeTableConfig' in draft || 'leftTreeRightTableConfig' in draft) {
		return draft as Partial<GeneratorDraft>;
	}
	return {
		baseInfo: draft as ScopedGeneratorBaseInfoDraft,
	};
};

const applyGeneratorDraft = (draft?: Partial<GeneratorDraft> | GeneratorBaseInfoDraft) => {
	const normalizedDraft = normalizeGeneratorDraft(draft);
	applyScopedBaseInfoDraft(normalizedDraft.baseInfo);
	if ('childTableConfig' in normalizedDraft) {
		Object.assign(childForm.value, createDefaultChildForm(), normalizedDraft.childTableConfig || {});
	}
	if ('treeTableConfig' in normalizedDraft) {
		Object.assign(treeForm.value, createDefaultTreeForm(), normalizedDraft.treeTableConfig || {});
	}
	if ('leftTreeRightTableConfig' in normalizedDraft) {
		Object.assign(leftTreeRightTableForm.value, createDefaultLeftTreeRightTableForm(), normalizedDraft.leftTreeRightTableConfig || {});
	}
};

const getLegacySharedBaseInfoDraft = (draft?: Partial<GeneratorDraft> | GeneratorBaseInfoDraft): Partial<SharedGeneratorBaseInfoDraft> => {
	const normalizedDraft = normalizeGeneratorDraft(draft);
	const baseInfo = normalizedDraft.baseInfo as Partial<GeneratorBaseInfoDraft> | undefined;
	if (!baseInfo) {
		return {};
	}

	return {
		backendPath: baseInfo.backendPath,
		frontendPath: baseInfo.frontendPath,
		packageName: baseInfo.packageName,
		author: baseInfo.author,
	};
};

const persistGeneratorDraft = () => {
	if (loading.value) {
		return;
	}

	const cacheId = getBaseInfoCacheId(dataForm.dsName, dataForm.tableName);
	if (!cacheId) {
		return;
	}

	generatorDraftCache.value = {
		...generatorDraftCache.value,
		[GENERATOR_SHARED_DRAFT_KEY]: getSharedBaseInfoDraft(),
		[cacheId]: getGeneratorDraft(),
	};
};

const clearGeneratorDraft = (dsName: string, tableName: string) => {
	const cacheId = getBaseInfoCacheId(dsName, tableName);
	if (!cacheId || !generatorDraftCache.value[cacheId]) {
		return;
	}

	const nextDraftMap = { ...generatorDraftCache.value };
	delete nextDraftMap[cacheId];
	generatorDraftCache.value = nextDraftMap;
};

const getTable = (dsName: string, tableName: string) => {
	loading.value = true;
	useTableApi(dsName, tableName)
		.then((res) => {
			ignoreDraftPersist(() => {
				Object.assign(dataForm, res.data);
				let list = res.data.groupList;
				dataForm.style = list[0]?.id;
				applyRelationConfigFromTable(res.data);

				// 如果是保存路径的形式，有限使用本地配置项
				const frontendPath = Local.get('frontendPath');
				const backendPath = Local.get('backendPath');

				if (frontendPath && backendPath) {
					dataForm.frontendPath = frontendPath;
					dataForm.backendPath = backendPath;
				}

				const currentDraft = generatorDraftCache.value[getBaseInfoCacheId(dsName, tableName)];
				const sharedDraft = generatorDraftCache.value[GENERATOR_SHARED_DRAFT_KEY] as Partial<SharedGeneratorBaseInfoDraft> | undefined;
				applySharedBaseInfoDraft(sharedDraft || getLegacySharedBaseInfoDraft(currentDraft));
				applyGeneratorDraft(currentDraft);
			});
		})
		.then(() => {
			if (isMicro === 'false') {
				dataForm.syncRoute = '0';
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

const dataRules = ref({
	tableName: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	tableComment: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	className: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	packageName: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	author: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: '必填项不能为空', trigger: 'blur' },
	],
	moduleName: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ pattern: /^[A-Za-z][A-Za-z0-9-]*$/, message: '必须以字母开头，只能包含字母、数字和中划线', trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	functionName: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
		{
			max: 50,
			message: '功能名不能超过50个字符',
			trigger: 'blur',
		},
	],
	generatorType: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	formLayout: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	backendPath: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	frontendPath: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: '必填项不能为空',
			trigger: 'blur',
		},
	],
	style: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
});

const hasChildTableConfig = computed(() => {
	const { childTableName, mainField, childField } = childForm.value || {};
	return Boolean(childTableName && mainField && childField);
});

const hasTreeTableConfig = computed(() => {
	const { parentField, nameField } = treeForm.value || {};
	return Boolean(parentField && nameField);
});

const hasLeftTreeRightTableConfig = computed(() => {
	const { childTableName, childField, parentField, nameField } = leftTreeRightTableForm.value || {};
	return Boolean(childTableName && childField && parentField && nameField);
});

const openChildTableConfigDialog = () => {
	childTableRef.value?.openDialog({
		...dataForm,
		...(childForm.value || {}),
	});
};

const openTreeTableConfigDialog = () => {
	treeTableRef.value?.openDialog({
		...dataForm,
		...(treeForm.value || {}),
	});
};

const openLeftTreeRightTableConfigDialog = () => {
	leftTreeRightTableRef.value?.openDialog({
		...dataForm,
		...(leftTreeRightTableForm.value || {}),
	});
};

const validateTemplateConfig = () => {
	if (showChildTableButton.value && !hasChildTableConfig.value) {
		useMessage().warning('当前模板为主子表，请先完成子表配置后再预览或生成');
		openChildTableConfigDialog();
		return false;
	}

	if (showTreeTableButton.value && !hasTreeTableConfig.value) {
		useMessage().warning('当前模板为树形表，请先完成树表配置后再预览或生成');
		openTreeTableConfigDialog();
		return false;
	}

	if (showLeftTreeRightTableButton.value && !hasLeftTreeRightTableConfig.value) {
		useMessage().warning('当前模板为左树右表，请先完成左树右表配置后再预览或生成');
		openLeftTreeRightTableConfigDialog();
		return false;
	}

	return true;
};

// 保存
const submitHandle = async () => {
	try {
		const valid = await dataFormRef.value.validate(); // 表单校验
		if (!valid) return false;
		if (!validateTemplateConfig()) {
			return Promise.reject();
		}

		loading.value = true;

		// 根据模板类型决定提交哪些配置数据
		const submitData = { ...dataForm };
		if (showChildTableButton.value && childForm.value) {
			Object.assign(submitData, childForm.value);
		}
		if (showTreeTableButton.value && treeForm.value) {
			Object.assign(submitData, treeForm.value);
		}
		if (showLeftTreeRightTableButton.value && leftTreeRightTableForm.value) {
			Object.assign(submitData, leftTreeRightTableForm.value, {
				mainField: '',
			});
		}

		await putObj(submitData);
		clearGeneratorDraft(dataForm.dsName, dataForm.tableName);
		return dataForm;
	} catch {
		return Promise.reject();
	} finally {
		//保存路径至Local 中方便下次使用
		if (dataForm.generatorType === '1') {
			Local.set('frontendPath', dataForm.frontendPath);
			Local.set('backendPath', dataForm.backendPath);
		}
		loading.value = false;
	}
};

/**
 * 获取风格列表
 */
const genGroupList = () => {
	groupList().then(({ data }) => {
		if (data && data.length > 0) {
			groupDataList.value = data.filter((group: { groupName: String }) => !group.groupName.includes('vform'));
		}
	});
};

/**
 * 检查模板版本
 */
const checkTemplateVersion = async () => {
	try {
		const { data } = await checkVersion();
		if (!data) {
			const shouldUpdate = await useMessageBox()
				.confirm('模板发现新版本，是否更新？')
				.catch(() => false);
			if (shouldUpdate) {
				await online();
				useMessage().success('更新成功');
				genGroupList();
			} else {
				mittBus.emit('onCurrentContextmenuClick', { contextMenuClickId: 1, ...route });
			}
		}
	} catch (error) {
		useMessage().error('检查模板版本失败');
	}
};

// 从后端获取菜单信息（含层级）
const menuData = reactive([] as any[]);
const getAllMenuData = () => {
	pageList({
		type: '0',
	}).then((res) => {
		let menu = {
			id: '-1',
			name: '根菜单',
			children: [],
		};
		menu.children = res.data;
		menuData.push(menu);
	});
};

watchImmediate(
	() => [
		props.tableName,
		childForm.value?.childTableName,
		treeForm.value?.parentField,
		treeForm.value?.nameField,
		leftTreeRightTableForm.value?.childTableName,
		leftTreeRightTableForm.value?.parentField,
		leftTreeRightTableForm.value?.nameField,
		showChildTableButton.value,
		showTreeTableButton.value,
		showLeftTreeRightTableButton.value,
	],
	() => {
		const { childTableName } = childForm.value || {};
		const { parentField, nameField } = treeForm.value || {};
		const {
			childTableName: leftTreeChildTableName,
			parentField: leftTreeParentField,
			nameField: leftTreeNameField,
		} = leftTreeRightTableForm.value || {};

		let nameStr = props.tableName || '';

		// 只有当对应的按钮显示时才显示相关信息
		if (showChildTableButton.value && childTableName) {
			nameStr += ` + ${childTableName}`;
		}
		if (showTreeTableButton.value && parentField && nameField) {
			nameStr += ` (树表: ${parentField}/${nameField})`;
		}
		if (showLeftTreeRightTableButton.value && leftTreeChildTableName) {
			nameStr += ` + ${leftTreeChildTableName}`;
		}
		if (showLeftTreeRightTableButton.value && leftTreeParentField && leftTreeNameField) {
			nameStr += ` (左树: ${leftTreeParentField}/${leftTreeNameField})`;
		}

		tableNameStr.value = nameStr;
	}
);

watchImmediate(
	() => [props.dsName, props.tableName],
	([dsName, tableName]) => {
		const currentDsName = String(dsName || '');
		const currentTableName = String(tableName || '');
		if (!currentDsName || !currentTableName) {
			return;
		}

		if (dataFormRef.value) {
			dataFormRef.value.resetFields();
			dataFormRef.value.clearValidate();
		}

		Object.assign(dataForm, createDefaultDataForm(), {
			dsName: currentDsName,
			tableName: currentTableName,
		});
		Object.assign(childForm.value, createDefaultChildForm());
		Object.assign(treeForm.value, createDefaultTreeForm());
		Object.assign(leftTreeRightTableForm.value, createDefaultLeftTreeRightTableForm());

		getTable(currentDsName, currentTableName);
	}
);

// 使用 watchIgnorable 和 useDebounceFn 优化草稿持久化
const { ignoreUpdates: ignoreDraftPersist } = watchIgnorable(
	() => [
		dataForm.dsName,
		dataForm.tableName,
		dataForm.generatorType,
		dataForm.formLayout,
		dataForm.backendPath,
		dataForm.frontendPath,
		dataForm.packageName,
		dataForm.author,
		dataForm.moduleName,
		dataForm.functionName,
		dataForm.className,
		dataForm.tableComment,
		dataForm.style,
		dataForm.syncRoute,
		dataForm.syncMenuId,
		childForm.value.childTableName,
		childForm.value.mainField,
		childForm.value.childField,
		treeForm.value.parentField,
		treeForm.value.nameField,
		leftTreeRightTableForm.value.childTableName,
		leftTreeRightTableForm.value.childField,
		leftTreeRightTableForm.value.parentField,
		leftTreeRightTableForm.value.nameField,
	],
	useDebounceFn(() => {
		persistGeneratorDraft();
	}, 300)
);

onMounted(() => {
	genGroupList();
	checkTemplateVersion();
	getAllMenuData();
});

defineExpose({
	submitHandle,
});
</script>
<style lang="scss" scoped>
.generator-code .el-dialog__body {
	padding: 15px 30px 0 20px;
}
</style>
