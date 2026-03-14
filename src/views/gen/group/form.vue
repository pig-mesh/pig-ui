<template>
	<el-dialog v-model="visible" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-form-item :label="t('group.groupName')" prop="actualGroupName">
				<el-input v-model="form.actualGroupName" :placeholder="t('group.inputGroupNameTip')">
					<template #prepend>
						<el-select v-model="form.tableType" placeholder="选择表类型" style="width: 100px">
							<el-option label="单表" value="单表" />
							<el-option label="主子表" value="主子表" />
							<el-option label="树形表" value="树形表" />
						</el-select>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('group.templateType')" prop="templateId">
				<el-select v-model="form.templateId" :placeholder="$t('group.selectType')" clearable multiple>
					<el-option v-for="item in templateData" :key="item.id" :label="item.templateName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item :label="t('group.groupDesc')" prop="groupDesc">
				<el-input type="textarea" maxlength="100" :rows="5" v-model="form.groupDesc" :placeholder="t('group.inputGroupDescTip')" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="GenGroupDialog" setup>
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/gen/group';
import { useI18n } from 'vue-i18n';
import { list as templateList } from '/@/api/gen/template';
const emit = defineEmits(['refresh']);
const { t } = useI18n();
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const templateData = ref<any[]>([]);

// 提交表单数据
const form = reactive({
	id: '',
	groupName: '',
	groupDesc: '',
	templateId: [] as string[],
	tableType: '单表', // 默认选择单表
	actualGroupName: '', // 用户实际输入的分组名称
	putList: [],
});

// 定义校验规则
const dataRules = ref({
	actualGroupName: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }],
	templateId: [{ required: true, message: '模板不能为空', trigger: 'blur' }],
});

const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value.resetFields();
	});

	// 如果有 id 参数，获取 genGroup 信息
	if (id) {
		form.id = id;
		getgenGroupData(id);
	} else {
		// 新增时重置字段
		form.tableType = '单表';
		form.actualGroupName = '';
	}

	// 获取模板信息
	getTemplateData();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		// 组合 groupName：tableType + 用户输入
		const submitForm = {
			...form,
			groupName: form.tableType + form.actualGroupName
		};
		form.id ? await putObj(submitForm) : await addObj(submitForm);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getgenGroupData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
		
		// 解析 groupName，提取前缀和实际名称
		const groupName = res.data.groupName || '';
		const tableTypes = ['单表', '主子表', '树形表'];
		let foundPrefix = '';
		let actualName = groupName;
		
		// 查找匹配的前缀
		for (const prefix of tableTypes) {
			if (groupName.startsWith(prefix)) {
				foundPrefix = prefix;
				actualName = groupName.substring(prefix.length);
				break;
			}
		}
		
		form.tableType = foundPrefix || '单表';
		form.actualGroupName = actualName;
		
		form.templateId = res.data.templateList
			? res.data.templateList.map((item: any) => item.id)
			: [];
	});
};

// 角色数据
const getTemplateData = () => {
	templateList().then((res) => {
		templateData.value = res.data;
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
