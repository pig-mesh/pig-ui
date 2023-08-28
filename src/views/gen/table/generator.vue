<template>
	<el-form :model="dataForm" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
		<el-row>
			<el-col :span="12" class="mb20">
				<el-row>
					<el-col :span="20">
						<el-form-item label="表名" prop="tableName">
							<el-input disabled placeholder="表名" :value="tableNameStr"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-button plain icon="Search" class="ml10" @click="childTableRef.openDialog(dataForm)"> 子表 </el-button>
						<!-- 配置子表 -->
						<child-table-config v-model="childForm" ref="childTableRef" />
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="说明" prop="tableComment">
					<el-input placeholder="说明" v-model="dataForm.tableComment"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="类名" prop="className">
					<el-input placeholder="类名" v-model="dataForm.className"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="作者" prop="author">
					<el-input placeholder="默认作者" v-model="dataForm.author"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="项目包名" prop="packageName">
					<el-input placeholder="项目包名" v-model="dataForm.packageName"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="模块名" prop="moduleName">
					<el-input placeholder="模块名" v-model="dataForm.moduleName"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12" class="mb20">
				<el-form-item label="功能名" prop="functionName">
					<el-input placeholder="功能名" v-model="dataForm.functionName"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" class="mb20">
				<el-form-item label="代码风格" prop="style">
					<el-select v-model="dataForm.style">
						<el-option :key="index" :label="item.groupName" :value="item.id" v-for="(item, index) in groupDataList"></el-option>
					</el-select>
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
				<el-form-item label="后端生成路径" prop="backendPath" v-if="dataForm.generatorType === '1'">
					<el-input placeholder="后端生成路径" v-model="dataForm.backendPath"></el-input>
				</el-form-item>
				<el-form-item label="前端生成路径" prop="frontendPath" v-if="dataForm.generatorType === '1'">
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

const ChildTableConfig = defineAsyncComponent(() => import('./child.vue'));

const props = defineProps({
	tableName: {
		type: String,
	},
	dsName: {
		type: String,
	},
});

const emit = defineEmits(['refreshDataList']);
const visible = ref(false);
const loading = ref(false);
const dataFormRef = ref();
const childTableRef = ref();
const childForm = ref();
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
});

const groupDataList = ref([]);
const getTable = (dsName: string, tableName: string) => {
	loading.value = true;
	useTableApi(dsName, tableName)
		.then((res) => {
			Object.assign(dataForm, res.data);
			let list = res.data.groupList;
			dataForm.style = list[0].id;

			// 如果是保存路径的形式，有限使用本地配置项
			const frontendPath = Local.get('frontendPath');
			const backendPath = Local.get('backendPath');

			if (frontendPath && backendPath) {
				dataForm.frontendPath = frontendPath;
				dataForm.backendPath = backendPath;
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

const dataRules = ref({
	tableName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	tableComment: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	className: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	packageName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	author: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	moduleName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	functionName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	generatorType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	formLayout: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	backendPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	frontendPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	style: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
});

// 保存
const submitHandle = async () => {
	try {
		await dataFormRef.value.validate();
		loading.value = true;
		await putObj(Object.assign(dataForm, childForm.value));
		visible.value = false;
		emit('refreshDataList');
		return dataForm;
	} catch {
		return Promise.reject();
	} finally {
		//保存路径至Local 中方便下次使用
		if (dataForm.generatorType === "1") {
			Local.set('frontendPath', dataForm.frontendPath);
			Local.set('backendPath', dataForm.backendPath);
		}
		loading.value = false;
	}
};

const genGroupList = () => {
	groupList().then((res) => {
		groupDataList.value = res.data;
	});
};

watch(
	() => childForm,
	() => {
		const { childTableName } = childForm.value || {};
		tableNameStr.value = childTableName ? `${props.tableName} + ${childTableName}` : props.tableName;
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
