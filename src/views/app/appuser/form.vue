<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.userId ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<el-row :gutter="20">
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.username')" prop="username">
							<el-input :disabled="dataForm.userId !== ''" placeholder="请输入用户名" v-model="dataForm.username"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.password')" prop="password">
							<el-input clearable placeholder="请输入密码" type="password" v-model="dataForm.password"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.name')" prop="name">
							<el-input clearable placeholder="请输入姓名" v-model="dataForm.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.phone')" prop="phone">
							<el-input clearable placeholder="请输入手机号" v-model="dataForm.phone"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.role')" prop="role">
							<el-select class="w100" clearable multiple placeholder="请选择角色" v-model="dataForm.role">
								<el-option :key="item.roleId" :label="item.roleName" :value="item.roleId" v-for="item in roleData" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.email')" prop="email">
							<el-input clearable placeholder="请输入邮箱" v-model="dataForm.email"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.nickname')" prop="nickname">
							<el-input clearable placeholder="请输入昵称" v-model="dataForm.nickname"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('appuser.lockFlag')" prop="lockFlag">
							<el-radio-group v-model="dataForm.lockFlag">
								<el-radio :key="index" :label="item.value" border v-for="(item, index) in lock_flag">{{ item.label }} </el-radio>
							</el-radio-group>
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
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: '请输入正确的手机号码',
			trigger: 'blur',
		},
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
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 修改获取用户信息
	if (id) {
		dataForm.userId = id;
		getUserData(id);
	}
	getRoleData();
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
		// 更新方法
		if (dataForm.userId) {
			if (dataForm.phone && dataForm.phone.indexOf('*') >= 0) {
				dataForm.phone = undefined;
			}
			if (dataForm.password && dataForm.password.indexOf('******') >= 0) {
				dataForm.password = undefined;
			}
			putObj(dataForm)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		} else {
			// 新增方法
			if (dataForm.phone && dataForm.phone.indexOf('*') > 0) {
				dataForm.phone = undefined;
			}
			addObj(dataForm)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		}
	});
};

// 初始化部门数据
const getUserData = (id: string) => {
	// 获取部门数据
	loading.value = true;
	getObj(id)
		.then((res) => {
			Object.assign(dataForm, res.data);
			dataForm.password = '******';
			if (res.data.roleList) {
				dataForm.role = [];
				res.data.roleList.map((item: any) => {
					dataForm.role.push(item.roleId);
				});
			}
		})
		.finally(() => {
			loading.value = false;
		});
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
