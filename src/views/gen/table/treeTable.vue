<template>
	<el-dialog :close-on-click-modal="false" title="左树右表配置" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" ref="dataFormRef">
			<el-row :gutter="35">
				<el-col :span="12">
					<el-form-item prop="childTableName">
						<template #label>树表名称<tip content="左侧树所使用的表，例如类目表、组织表" /> </template>
						<el-select placeholder="请选择树表" v-model="form.childTableName" filterable @change="getTreeTableColumnList">
							<el-option :key="item" :label="item" :value="item" v-for="item in childTableList" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="childField">
						<template #label> 关联字段<tip content="右侧主表中关联左侧树节点的字段" /> </template>
						<el-select placeholder="请选择主表关联字段" v-model="form.childField" filterable>
							<el-option :key="item" :label="item" :value="item" v-for="item in mainTableColumnList" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mt-4">
					<el-form-item prop="parentField">
						<template #label>级联字段<tip content="树表结构中表示父级关系的字段，如 parent_id" /> </template>
						<el-select placeholder="请选择父编号字段" v-model="form.parentField" filterable>
							<el-option :key="item" :label="item" :value="item" v-for="item in childTableColumnList" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mt-4">
					<el-form-item prop="nameField">
						<template #label>标题字段<tip content="树表中用于展示名称的字段，如 name" /> </template>
						<el-select placeholder="请选择树名称字段" v-model="form.nameField" filterable>
							<el-option :key="item" :label="item" :value="item" v-for="item in childTableColumnList" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onClear">清空</el-button>
				<el-button @click="onSubmit" type="primary">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="leftTreeRightTable">
import { useListTableApi, useListTableColumnApi, useSyncTableApi } from '/@/api/gen/table';
import { useMessage } from '/@/hooks/message';
import Tip from '/@/components/Tip/index.vue';

const emit = defineEmits(['update:modelValue']);

defineProps({
	modelValue: Object,
});

const visible = ref(false);
const dataFormRef = ref();
const form = reactive({
	childTableName: '',
	childField: '',
	parentField: '',
	nameField: '',
});

const dataRules = ref({
	childTableName: [{ required: true, message: '请选择树表', trigger: 'blur' }],
	childField: [{ required: true, message: '请选择主表关联字段', trigger: 'blur' }],
	parentField: [{ required: true, message: '请选择父编号字段', trigger: 'blur' }],
	nameField: [{ required: true, message: '请选择树名称字段', trigger: 'blur' }],
});

const childTableList = ref<string[]>([]);
const childTableColumnList = ref<string[]>([]);
const mainTableColumnList = ref<string[]>([]);
const currentDsName = ref('');
const currentTableName = ref('');

const openDialog = (row: any) => {
	currentDsName.value = row.dsName;
	currentTableName.value = row.tableName;
	visible.value = true;

	getAllTable(row.dsName);
	getMainTableField(row.dsName, row.tableName);

	if (row.childTableName) {
		form.childTableName = row.childTableName;
		form.childField = row.childField;
		form.parentField = row.parentField;
		form.nameField = row.nameField;
		getTreeTableColumnList(row.childTableName);
	}
};

const getAllTable = (dsName: string) => {
	useListTableApi(dsName).then((res) => {
		childTableList.value = res.data
			.map((item: any) => item.name)
			.filter((name: string) => name !== currentTableName.value);
	});
};

const getMainTableField = (dsName: string, tableName: string) => {
	useListTableColumnApi(dsName, tableName).then((res) => {
		mainTableColumnList.value = res.data.map((item: any) => item.name);
	});
};

const getTreeTableColumnList = (tableName: string) => {
	form.parentField = '';
	form.nameField = '';
	useListTableColumnApi(currentDsName.value, tableName).then((res) => {
		childTableColumnList.value = res.data.map((item: any) => item.name);
		if (!form.parentField && childTableColumnList.value.includes('parent_id')) {
			form.parentField = 'parent_id';
		}
		if (!form.nameField && childTableColumnList.value.includes('name')) {
			form.nameField = 'name';
		}
	});
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	useSyncTableApi(currentDsName.value, form.childTableName).then(() => {
		useMessage().success('左树右表配置成功');
	});
	visible.value = false;
};

const onClear = () => {
	form.childTableName = '';
	form.childField = '';
	form.parentField = '';
	form.nameField = '';
	visible.value = false;
};

watch(
	() => form,
	(val) => {
		emit('update:modelValue', val);
	},
	{ deep: true, immediate: true }
);

defineExpose({
	openDialog,
});
</script>
