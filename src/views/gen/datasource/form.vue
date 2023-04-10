<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('datasourceconf.dsType')" prop="dsType">
						<el-select v-model="form.dsType" :placeholder="t('datasourceconf.inputdsTypeTip')">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in ds_type"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('datasourceconf.name')" prop="name">
						<el-input v-model="form.name" :placeholder="t('datasourceconf.inputnameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('datasourceconf.username')" prop="username">
						<el-input v-model="form.username" :placeholder="t('datasourceconf.inputusernameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('datasourceconf.password')" prop="password">
						<el-input v-model="form.password" :placeholder="t('datasourceconf.inputpasswordTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('datasourceconf.confType')" prop="confType">
						<el-radio-group v-model="form.confType">
							<el-radio :label="Number(item.value)" v-for="(item, index) in ds_config_type" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="form.confType === 0 && form.dsType === 'mssql'">
					<el-form-item :label="t('datasourceconf.instance')" prop="instance">
						<el-input v-model="form.instance" :placeholder="t('datasourceconf.inputinstanceTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="form.confType === 0">
					<el-form-item :label="t('datasourceconf.port')" prop="port">
						<el-input-number v-model="form.port" :placeholder="t('datasourceconf.inputportTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="form.confType === 0">
					<el-form-item :label="t('datasourceconf.host')" prop="host">
						<el-input v-model="form.host" :placeholder="t('datasourceconf.inputhostTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="form.confType === 0">
					<el-form-item :label="t('datasourceconf.dsName')" prop="dsName">
						<el-input v-model="form.dsName" :placeholder="t('datasourceconf.inputdsNameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20" v-if="form.confType === 1">
					<el-form-item :label="t('datasourceconf.url')" prop="url">
						<el-input v-model="form.url" type="textarea" :placeholder="t('datasourceconf.inputurlTip')" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemDatasourceConfDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/gen/datasource';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典处理
const { ds_config_type, ds_type } = useDict('ds_config_type', 'ds_type');

// 提交表单数据
const form = reactive({
	id: '',
	name: '',
	url: '',
	username: '',
	password: ('' as string) || undefined,
	createTime: '',
	updateTime: '',
	dsType: '',
	confType: 0,
	dsName: '',
	instance: '',
	port: 0,
	host: '',
});

/**
 *
 * @param {校验数据源名} rule
 * @param {*} value
 * @param {*} callback
 */
const validateDsName = (_rule, value, callback) => {
	var re = /(?=.*[a-z])(?=.*_)/;
	if (value && !re.test(value)) {
		callback(new Error('数据源名称不合法, 组名_数据源名形式'));
	} else {
		callback();
	}
};

// 定义校验规则
const dataRules = ref({
	name: [
		{ required: true, message: '别名不能为空', trigger: 'blur' },
		{ validator: validateDsName, trigger: 'blur' },
	],
	url: [{ required: true, message: 'jdbcurl不能为空', trigger: 'blur' }],
	username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
	dsType: [{ required: true, message: '数据库类型不能为空', trigger: 'blur' }],
	confType: [{ required: true, message: '配置类型不能为空', trigger: 'blur' }],
	dsName: [{ required: true, message: '数据库名称不能为空', trigger: 'blur' }],
	instance: [{ required: true, message: '实例不能为空', trigger: 'blur' }],
	port: [{ required: true, message: '端口不能为空', trigger: 'blur' }],
	host: [{ required: true, message: '主机不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取DatasourceConf信息
	if (id) {
		form.id = id;
		await getDatasourceConfData(id);
		// 修改密码时候，原密码打码
		form.password = '********';
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	form.password = form.password?.includes('******') ? undefined : form.password;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
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
const getDatasourceConfData = (id: string) => {
	// 获取数据
	return getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
