<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.userId ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<el-row :gutter="20">
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.username')" prop="username">
							<el-input :disabled="dataForm.userId !== ''" :placeholder="$t('sysuser.inputUsernameTip')" v-model="dataForm.username"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.password')" prop="password">
							<el-input clearable :placeholder="$t('sysuser.inputPasswordTip')" type="password" v-model="dataForm.password"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.name')" prop="name">
							<el-input clearable :placeholder="$t('sysuser.inputNameTip')" v-model="dataForm.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.phone')" prop="phone">
							<el-input clearable :placeholder="$t('sysuser.inputPhoneTip')" v-model="dataForm.phone"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.role')" prop="role">
							<el-select clearable multiple :placeholder="$t('sysuser.selectRole')" v-model="dataForm.role">
								<el-option :key="item.roleId" :label="item.roleName" :value="item.roleId" v-for="item in roleData" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.post')" prop="post">
							<el-select clearable multiple :placeholder="$t('sysuser.selectPost')" v-model="dataForm.post">
								<el-option :key="item.postId" :label="item.postName" :value="item.postId" v-for="item in postData" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.dept')" prop="deptId">
							<el-tree-select
								:data="deptData"
								:props="{ value: 'id', label: 'name', children: 'children' }"
								check-strictly
								class="w100"
								clearable
								:placeholder="$t('sysuser.selectDept')"
								v-model="dataForm.deptId"
							>
							</el-tree-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.email')" prop="email">
							<el-input clearable :placeholder="$t('sysuser.inputEmailTip')" v-model="dataForm.email"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.nickname')" prop="nickname">
							<el-input clearable :placeholder="$t('sysuser.inputNicknameTip')" v-model="dataForm.nickname"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.lockFlag')" prop="lockFlag">
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
					<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="systemUserDialog" setup>
import { addObj, getObj, putObj, validatePhone, validateUsername } from '/@/api/admin/user';
import { list as roleList } from '/@/api/admin/role';
import { list as postList } from '/@/api/admin/post';
import { deptTree } from '/@/api/admin/dept';
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
const deptData = ref<any[]>([]);
const roleData = ref<any[]>([]);
const postData = ref<any[]>([]);
const loading = ref(false);

const props = defineProps({
	deptId: {
		type: String,
		default: '',
	},
});

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
	// 用户名校验，不能为空 、长度 5-20、不能和已有数据重复
	username: [
		{ required: true, message: t('sysuser.usernameRequired'), trigger: 'blur' },
		{ min: 5, max: 20, message: t('sysuser.usernameLength'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateUsername(rule, value, callback, dataForm.userId !== '');
			},
			trigger: 'blur',
		},
	],
	password: [
		{ required: true, message: t('sysuser.passwordRequired'), trigger: 'blur' },
		{
			min: 6,
			max: 20,
			message: t('sysuser.passwordLength'),
			trigger: 'blur',
		},
	],
	// 姓名校验，不能为空、只能是中文
	name: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('sysuser.nameRequired'), trigger: 'blur' },
		{ validator: rule.chinese, trigger: 'blur' },
	],
	deptId: [{ required: true, message: t('sysuser.deptRequired'), trigger: 'blur' }],
	role: [{ required: true, message: t('sysuser.roleRequired'), trigger: 'blur' }],
	post: [{ required: true, message: t('sysuser.postRequired'), trigger: 'blur' }],
	// 手机号校验，不能为空、新增的时不能重复校验
	phone: [
		{ required: true, message: t('sysuser.phoneRequired'), trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validatePhone(rule, value, callback, dataForm.userId !== '');
			},
			trigger: 'blur',
		},
	],
	email: [
		{ type: 'email', message: t('sysuser.emailFormat'), trigger: ['blur', 'change'] },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	lockFlag: [{ required: true, message: t('sysuser.statusRequired'), trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: string) => {
	visible.value = true;
	dataForm.userId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 修改获取用户信息
	if (id) {
		dataForm.userId = id;
		await getUserData(id);
		dataForm.password = '******';
	}

	// 加载使用的数据
	getDeptData();
	getPostData();
	getRoleData();
};

// 提交
const onSubmit = async () => {
	// 立即设置 loading，防止重复点击
	if (loading.value) return;
	loading.value = true;
	
	try {
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) {
			loading.value = false;
			return false;
		}

		const { userId, phone, password } = dataForm;

		if (userId) {
			// 清除占位符，避免提交错误的数据
			if (phone?.includes('*')) dataForm.phone = undefined;
			if (password?.includes('******')) dataForm.password = undefined;

			await putObj(dataForm);
			useMessage().success(t('common.editSuccessText'));
			visible.value = false; // 关闭弹窗
			emit('refresh');
		} else {
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

/**
 * 从服务器获取用户数据
 *
 * @async
 * @param {string} id - 用户 ID
 * @return {Promise} - 包含用户数据的 Promise 对象
 */
const getUserData = async (id: string) => {
	try {
		loading.value = true;
		const { data } = await getObj(id);
		Object.assign(dataForm, data);
		if (data.roleList) {
			dataForm.role = data.roleList.map((item: { roleId: string }) => item.roleId);
		}
		if (data.postList) {
			dataForm.post = data.postList.map((item: { postId: string }) => item.postId);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化部门数据
const getDeptData = () => {
	// 获取部门数据
	deptTree().then((res) => {
		deptData.value = res.data;
		// 默认选择在树中选中的部门
		if (!dataForm.userId) {
			dataForm.deptId = props.deptId;
		}
	});
};

// 岗位数据
const getPostData = () => {
	postList().then((res) => {
		postData.value = res.data;
		// 默认选择第一个
		if (!dataForm.userId) {
			dataForm.post = [res.data[0].postId];
		}
	});
};
// 角色数据
const getRoleData = () => {
	roleList().then((res) => {
		roleData.value = res.data;
		// 默认选择第一个
		if (!dataForm.userId) {
			dataForm.role = [res.data[0].roleId];
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
