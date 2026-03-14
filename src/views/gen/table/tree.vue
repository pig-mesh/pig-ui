<template>
	<el-dialog :close-on-click-modal="false" title="树表配置" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" ref="dataFormRef">
			<el-row :gutter="35">
				<el-col :span="12">
					<el-form-item prop="parentField">
						<template #label> 父编号字段<tip content="树表结构中表示父级关系的字段，如parent_id" /> </template>
						<el-select placeholder="请选择父编号字段" v-model="form.parentField" filterable>
							<el-option :key="item" :label="item" :value="item" v-for="item in tableColumnList"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="nameField">
						<template #label> 树名称字段<tip content="树表结构中显示名称的字段，如name" /> </template>
						<el-select placeholder="请选择树名称字段" v-model="form.nameField" filterable>
							<el-option :key="item" :label="item" :value="item" v-for="item in tableColumnList"> </el-option>
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
<script setup lang="ts" name="tree">
import { useListTableColumnApi } from '/@/api/gen/table';
import { useMessage } from "/@/hooks/message";
import Tip from '/@/components/Tip/index.vue';

const emit = defineEmits(['update:modelValue']);

defineProps({
	modelValue: Object,
});

const visible = ref(false);
const dataFormRef = ref();
const form = reactive({
	parentField: '',
	nameField: '',
});

const dataRules = ref({
	parentField: [{ required: true, message: '请选择父编号字段', trigger: 'blur' }],
	nameField: [{ required: true, message: '请选择树名称字段', trigger: 'blur' }],
});

const tableColumnList = ref();
const currentDsName = ref('');
const currentTableName = ref('');

// 打开弹窗
const openDialog = (row: any) => {
	currentDsName.value = row.dsName;
	currentTableName.value = row.tableName;
	visible.value = true;

	getAllField(row.dsName, row.tableName);
	
	// 如果已有配置，回显数据
	if (row.parentField) {
		form.parentField = row.parentField;
		form.nameField = row.nameField;
	}
};

// 获取表的所有字段
const getAllField = (dsName: string, tableName: string) => {
	useListTableColumnApi(dsName, tableName).then((res) => {
		tableColumnList.value = res.data.map((item: any) => {
			return item.name;
		});
		
		// 检查是否有parent_id和name字段，如果有则自动设置为默认值
		const hasParentId = tableColumnList.value.includes('parent_id');
		const hasName = tableColumnList.value.includes('name');
		
		if (hasParentId && !form.parentField) {
			form.parentField = 'parent_id';
		}
		if (hasName && !form.nameField) {
			form.nameField = 'name';
		}
	});
};

// 确认提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	useMessage().success('树表配置成功');
	visible.value = false;
};

// 清空树表配置
const onClear = () => {
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