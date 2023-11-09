<template>
	<div class="system-user-dialog-container">
		<el-dialog v-model="visible" :close-on-click-modal="false" :title="dataForm.userId ? $t('common.editBtn') : $t('common.addBtn')" draggable>
			<el-form ref="dataFormRef" v-loading="loading" :model="dataForm" :rules="dataRules" label-width="90px">
				<el-row :gutter="20">
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.username')" prop="username">
							<el-input v-model="dataForm.username" :disabled="dataForm.userId !== ''" :placeholder="$t('appuser.inputUserNameTip')"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.password')" prop="password">
							<el-input v-model="dataForm.password" :placeholder="$t('appuser.inputPasswordTip')" clearable type="password"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.name')" prop="name">
							<el-input v-model="dataForm.name" :placeholder="$t('appuser.inputNameTip')" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.phone')" prop="phone">
							<el-input v-model="dataForm.phone" :placeholder="$t('appuser.inputPhoneTip')" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.role')" prop="role">
							<el-select v-model="dataForm.role" :placeholder="$t('appuser.inputRoleTip')" class="w100" clearable multiple>
								<el-option v-for="item in roleData" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.email')" prop="email">
							<el-input v-model="dataForm.email" :placeholder="$t('appuser.inputEmailTip')" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.nickname')" prop="nickname">
							<el-input v-model="dataForm.nickname" :placeholder="$t('appuser.inputNickNameTip')" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.lockFlag')" prop="lockFlag">
							<el-radio-group v-model="dataForm.lockFlag">
								<el-radio v-for="(item, index) in lock_flag" :key="index" :label="item.value" border>{{ item.label }} </el-radio>
							</el-radio-group>
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
	</div>
</template>

<script lang="ts" name="systemUserDialog" setup>
import { addObj, getObj, putObj, validatePhone, validateUsername } from '/@/api/app/appuser';
import { list as roleList } from '/@/api/app/approle';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

const { t } = useI18n();

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// @ts-ignore
const { lock_flag } = useDict('lock_flag');

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const roleData = ref<any[]>([]);
const loading = ref(false);

const dataForm = reactive({
	userId: '',
	username: '',
	password: '' as String | undefined,
	salt: '',
	wxOpenid: '',
	qqOpenid: '',
	lockFlag: '0',
	phone: '' as String | undefined,
	deptId: '',
	roleList: [],
	postList: [],
	nickname: '',
	name: '',
	email: '',
	post: [] as string[],
	role: [] as string[],
});

const dataRules = ref({
	username: [
		{ required: true, message: '用户名不能为空', trigger: 'blur' },
		{ min: 3, max: 20, message: '用户名称长度必须介于 3 和 20 之间', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateUsername(rule, value, callback, dataForm.userId !== '');
			},
			trigger: 'blur',
		},
	],

	password: [
		{ required: true, message: '密码不能为空', trigger: 'blur' },
		{
			min: 6,
			max: 20,
			message: '用户密码长度必须介于 6 和 20 之间',
			trigger: 'blur',
		},
	],
	name: [
		{ required: true, message: '姓名不能为空', trigger: 'blur' },
		{ validator: rule.chinese, trigger: 'blur' },
	],
	role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
	phone: [
		{ required: true, message: '手机号不能为空', trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validatePhone(rule, value, callback, dataForm.userId !== '');
			},
			trigger: 'blur',
		},
	],
	email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
	nickname: [{ required: true, message: '姓名不能为空', nickname: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	dataForm.userId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value.resetFields();
	});

	// 修改获取用户信息
	if (id) {
		dataForm.userId = id;
		getUserData(id);
	}
	getRoleData();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		const { userId, phone, password } = dataForm;

		if (userId) {
			// 清除占位符，避免提交错误的数据
			if (phone?.includes('*')) dataForm.phone = undefined;
			if (password?.includes('******')) dataForm.password = undefined;

			loading.value = true;
			await putObj(dataForm);
			useMessage().success(t('common.editSuccessText'));
			visible.value = false; // 关闭弹窗
			emit('refresh');
		} else {
			loading.value = true;
			await addObj(dataForm);
			useMessage().success(t('common.addSuccessText'));
			visible.value = false; // 关闭弹窗
			emit('refresh');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
// 初始化用户信息数据
const getUserData = async (id: string) => {
	loading.value = true;

	try {
		const { data } = await getObj(id);
		Object.assign(dataForm, data);
		dataForm.password = '******';
		if (data.roleList) {
			dataForm.role = data.roleList.map((item: any) => item.roleId);
		}
	} finally {
		loading.value = false;
	}
};

// 角色数据
const getRoleData = () => {
	roleList().then((res) => {
		roleData.value = res.data;
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
