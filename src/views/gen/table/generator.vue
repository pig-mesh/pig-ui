<template>
	<el-form :model="dataForm" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="代码风格" prop="style">
					<el-select v-model="dataForm.style">
						<el-option :key="index" :label="item.groupName" :value="item.id" v-for="(item, index) in groupDataList"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="表名" prop="tableName">
					<div style="display: flex; width: 100%">
						<el-input disabled placeholder="表名" :value="tableNameStr" style="flex-grow: 1; margin-right: 10px"></el-input>
						<el-button 
							v-if="showChildTableButton" 
							plain 
							icon="Search" 
							@click="childTableRef.openDialog(dataForm)" 
							style="margin-right: 10px"
						> 
							子表
						</el-button>
						<el-button 
							v-if="showTreeTableButton" 
							plain 
							icon="Connection" 
							@click="treeTableRef.openDialog(dataForm)"
						> 
							树表
						</el-button>
						<!-- 配置子表 -->
						<child-table-config v-if="showChildTableButton" v-model="childForm" ref="childTableRef" />
						<!-- 配置树表 -->
						<tree-table-config v-if="showTreeTableButton" v-model="treeForm" ref="treeTableRef" />
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="注释" prop="tableComment">
					<el-input placeholder="说明" v-model="dataForm.tableComment"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="类名" prop="className">
					<el-input placeholder="类名" v-model="dataForm.className"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="作者" prop="author">
					<el-input placeholder="默认作者" v-model="dataForm.author"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="项目包名" prop="packageName">
					<el-input placeholder="项目包名" v-model="dataForm.packageName"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item prop="moduleName">
					<template #label>
						<span>模块名</span>
						<tip content="所属微服务模块名称，对应微服务路由前缀" />
					</template>
					<el-input placeholder="模块名" v-model="dataForm.moduleName"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
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
			<el-col :span="12" class="mb20">
				<el-form-item prop="syncMenuId">
					<template #label>
						所属菜单
						<tip :content="`生成的 【${dataForm.tableComment}管理】菜单挂载在哪个目录下 `" />
					</template>
					<el-tree-select
						filterable
						v-model="dataForm.syncMenuId"
						:data="menuData"
						:render-after-expand="false"
						:props="{ value: 'id', label: 'name', children: 'children' }"
						class="w100"
						clearable
						check-strictly
						:placeholder="$t('sysmenu.inputParentIdTip')"
					>
					</el-tree-select>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item prop="syncRoute">
					<template #label>
						同步路由
						<tip :content="`微服务架构下会自动创建一条【/${dataForm.moduleName}】的网关路由，存在则跳过`" />
					</template>
					<el-radio-group v-model="dataForm.syncRoute">
						<el-radio border label="0">手动添加</el-radio>
						<el-radio border label="1">自动创建</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="表单布局" prop="formLayout">
					<el-radio-group v-model="dataForm.formLayout">
						<el-radio border :label="1">一列</el-radio>
						<el-radio border :label="2">两列</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="生成方式" prop="generatorType">
					<el-radio-group v-model="dataForm.generatorType">
						<el-radio border label="1">自定义路径</el-radio>
						<el-radio border label="0">ZIP 压缩包</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-form-item prop="backendPath" v-if="dataForm.generatorType === '1'">
					<template #label>
						<span>后端生成路径</span>
						<tip content="后端模块biz所在文件全路径比如：D:\data\pig\pig-upms\pig-upms-biz" />
					</template>
					<el-input placeholder="后端生成路径" v-model="dataForm.backendPath"></el-input>
				</el-form-item>
				<el-form-item prop="frontendPath" v-if="dataForm.generatorType === '1'">
					<template #label>
						<span>前端生成路径</span>
						<tip content="前端所在文件全路径比如：D:\data\pig-ui" />
					</template>
					<el-input placeholder="前端生成路径" v-model="dataForm.frontendPath"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script lang="ts" setup>
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

const props = defineProps({
	tableName: {
		type: String,
	},
	dsName: {
		type: String,
	},
});

const isMicro = import.meta.env.VITE_IS_MICRO;
const emit = defineEmits(['refreshDataList']);
const route = useRoute();
const visible = ref(false);
const loading = ref(false);
const dataFormRef = ref();
const childTableRef = ref();
const childForm = ref();
const treeTableRef = ref();
const treeForm = ref();
const tableNameStr = ref('');
const dataForm = reactive({
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
	syncRoute: '0',
	syncMenuId: '',
	parentField: '',
	nameField: '',
});

const groupDataList = ref<Array<{ id: string; groupName: string }>>([]);

// 计算当前选择的模板类型
const currentTemplateType = computed(() => {
	if (!dataForm.style) return '';
	const selectedGroup = groupDataList.value.find(group => group.id === dataForm.style);
	return selectedGroup?.groupName || '';
});

// 判断是否显示子表按钮
const showChildTableButton = computed(() => {
	return currentTemplateType.value.includes('主子表');
});

// 判断是否显示树表按钮
const showTreeTableButton = computed(() => {
	return currentTemplateType.value.includes('树形表');
});
const getTable = (dsName: string, tableName: string) => {
	loading.value = true;
	useTableApi(dsName, tableName)
		.then((res) => {
			Object.assign(dataForm, res.data);
			let list = res.data.groupList;
			dataForm.style = list[0]?.id;

			// 如果是保存路径的形式，有限使用本地配置项
			const frontendPath = Local.get('frontendPath');
			const backendPath = Local.get('backendPath');

			if (frontendPath && backendPath) {
				dataForm.frontendPath = frontendPath;
				dataForm.backendPath = backendPath;
			}
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
		{ validator: rule.letter, trigger: 'blur' },
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

// 保存
const submitHandle = async () => {
	try {
		const valid = await dataFormRef.value.validate(); // 表单校验
		if (!valid) return false;

		loading.value = true;
		
		// 根据模板类型决定提交哪些配置数据
		const submitData = { ...dataForm };
		if (showChildTableButton.value && childForm.value) {
			Object.assign(submitData, childForm.value);
		}
		if (showTreeTableButton.value && treeForm.value) {
			Object.assign(submitData, treeForm.value);
		}
		
		await putObj(submitData);
		visible.value = false;
		emit('refreshDataList');
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
		console.error('检查版本失败', error);
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

watch(
	() => [childForm, treeForm, currentTemplateType],
	() => {
		const { childTableName } = childForm.value || {};
		const { parentField, nameField } = treeForm.value || {};
		
		let nameStr = props.tableName || '';
		
		// 只有当对应的按钮显示时才显示相关信息
		if (showChildTableButton.value && childTableName) {
			nameStr += ` + ${childTableName}`;
		}
		if (showTreeTableButton.value && parentField && nameField) {
			nameStr += ` (树表: ${parentField}/${nameField})`;
		}
		
		tableNameStr.value = nameStr;
	},
	{ deep: true, immediate: true }
);

onMounted(() => {
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}
	dataForm.id = '';
	dataForm.tableName = String(props.tableName);
	dataForm.dsName = String(props.dsName);

	getTable(dataForm.dsName, dataForm.tableName);
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
