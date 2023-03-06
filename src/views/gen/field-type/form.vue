<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fieldtype.columnType')" prop="columnType">
						<el-input v-model="form.columnType" :placeholder="t('fieldtype.inputcolumnTypeTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fieldtype.attrType')" prop="attrType">
						<el-input v-model="form.attrType" :placeholder="t('fieldtype.inputattrTypeTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fieldtype.packageName')" prop="packageName">
						<el-input v-model="form.packageName" :placeholder="t('fieldtype.inputpackageNameTip')" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false" formDialogRef>{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" formDialogRef>{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemFieldTypeDialog">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/gen/fieldtype';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	columnType: '',
	attrType: '',
	packageName: '',
	createTime: '',
});

// 定义校验规则
const dataRules = ref({
	columnType: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
	attrType: [{ required: true, message: '属性类型不能为空', trigger: 'blur' }],
	packageName: [{ required: true, message: '属性包名不能为空', trigger: 'blur' }],
	createTime: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取FieldType信息
	if (id) {
		form.id = id;
		getFieldTypeData(id);
	}
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}

		// 更新
		if (form.id) {
			putObj(form)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		} else {
			addObj(form)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		}
	});
};

// 初始化表单数据
const getFieldTypeData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
