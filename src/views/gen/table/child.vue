<template>
	<el-dialog :close-on-click-modal="false" title="子表配置" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" ref="dataFormRef">
			<el-row :gutter="35">
				<el-col :span="8">
					<el-form-item prop="childTableName">
						<template #label> 子表名<tip content="关联表的子表，例如一对多中的存储多信息的表" /> </template>
						<el-select placeholder="请选择子表" v-model="form.childTableName" filterable @change="getChildTableColumnList">
							<el-option :key="item.tableName" :label="item.tableName" :value="item.tableName" v-for="item in childTableList"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item prop="mainField">
						<template #label> 主表字段<tip content="一般为主表的主键字段" /> </template>
						<el-select placeholder="请选关联字段" v-model="form.mainField" filterable>
							<el-option :key="item.columnName" :label="item.columnName" :value="item.columnName" v-for="item in mainTableColumnList"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item prop="childField">
						<template #label> 子表字段<tip content="子表中对应主表主键的关联字段" /> </template>
						<el-select placeholder="请选关联字段" v-model="form.childField" filterable>
							<el-option :key="item.columnName" :label="item.columnName" :value="item.columnName" v-for="item in childTableColumnList"> </el-option>
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
<script setup lang="ts" name="child">
import {useListTableApi, useListTableColumnApi, useSyncTableApi} from '/@/api/gen/table';
import {useMessage} from "/@/hooks/message";

const emit = defineEmits(['update:modelValue']);

defineProps({
	modelValue: Object,
});

const visible = ref(false);
const dataFormRef = ref();
const form = reactive({
	childTableName: '',
	mainField: '',
	childField: '',
});

const dataRules = ref({
	childTableName: [{ required: true, message: '请选择子表', trigger: 'blur' }],
	mainField: [{ required: true, message: '请选择关联字段', trigger: 'blur' }],
	childField: [{ required: true, message: '请选择关联字段', trigger: 'blur' }],
});

const childTableList = ref();
const childTableColumnList = ref();
const mainTableColumnList = ref();
const currentDsName = ref('');

// 打开弹窗
const openDialog = (row: any) => {
	currentDsName.value = row.dsName;
	visible.value = true;

	getAllTable(row.dsName);
	getAllField(row.dsName, row.tableName);
	if (row.childTableName) {
		form.childTableName = row.childTableName;
		form.mainField = row.mainField;
		form.childField = row.childField;
	}
};

// 获取当前数据下的所有表
const getAllTable = (dsName: string) => {
	useListTableApi(dsName).then((res) => {
		childTableList.value = res.data;
	});
};

// 获取对应表的所有字段
const getAllField = (dsName: string, tableName: string) => {
	useListTableColumnApi(dsName, tableName).then((res) => {
		mainTableColumnList.value = res.data;
	});
};

// 获取子表的全部字段
const getChildTableColumnList = (val: string) => {
	form.childField = '';
	useListTableColumnApi(currentDsName.value, val).then((res) => {
		childTableColumnList.value = res.data;
	});
};

// 确认提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
  // 同步子表数据
  useSyncTableApi(currentDsName.value,form.childTableName).then(() => {
    useMessage().success('子表信息同步成功')
  });

	visible.value = false;
};

// 清空子表配置，后台当单表处理
const onClear = () => {
	form.childTableName = '';
	form.mainField = '';
	form.childField = '';
	visible.value = false;
};

watch(
	() => form,
	(val) => {
		emit('update:modelValue', val);
	},
	{ deep: true, immediate: true }
);

onMounted(() => {});

// 暴露变量
defineExpose({
	openDialog,
});
</script>
