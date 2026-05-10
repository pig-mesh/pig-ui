<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" width="600" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-form-item label="名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number :min="1" :max="1000" v-model="form.sort" placeholder="请输入排序"></el-input-number>
			</el-form-item>
			<el-form-item label="是否显示" prop="isShow">
				<el-radio-group v-model="form.isShow">
					<el-radio :value="Number(item.value)" v-for="(item, index) in yes_no_type" border :key="index">{{ item.label }} </el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="AppArticleCategoryDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/app/appArticleCategory';

const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const { yes_no_type } = useDict('yes_no_type');

const form = reactive({
	id: '',
	name: '',
	sort: 0,
	isShow: 1,
});

const dataRules = ref({
	name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
	isShow: [{ required: true, message: '是否显示', trigger: 'blur' }],
});

const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		getappArticleCategoryData(id);
	}
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getappArticleCategoryData = (id: string) => {
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

defineExpose({
	openDialog,
});
</script>
