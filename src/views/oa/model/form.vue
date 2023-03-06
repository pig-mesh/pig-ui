<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="35">
				<el-col :span="24" class="mb20">
					<el-form-item :label="$t('model.name')" prop="name">
						<el-input :placeholder="$t('model.inputNameTip')" clearable v-model="form.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="$t('model.key')" prop="key">
						<el-input :placeholder="$t('model.inputKeyTip')" clearable v-model="form.key" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="$t('model.category')" prop="category">
						<el-input :placeholder="$t('model.inputCategoryTip')" clearable v-model="form.category" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { addObj, getObj, putObj } from '/@/api/oa/model';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	key: '',
	name: '',
	category: '',
	desc: 'vvv',
});

// 定义校验规则
const dataRules = ref({
	key: [{ required: true, message: '模型表示不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
	category: [{ required: true, message: '模型分类不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	if (id) {
		form.id = id;
		getModelData(id);
	}
};
const getModelData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
		// 更新
		if (form.id) {
			loading.value = true;
			putObj(form)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				})
				.finally(() => {
					loading.value = false;
				});
		} else {
			loading.value = true;
			addObj(form)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				})
				.finally(() => {
					loading.value = false;
				});
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
