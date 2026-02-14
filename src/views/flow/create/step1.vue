<template>
	<div>
		<div class="container-div">
			<el-card class="box-card" style="padding-right: 10%; padding-left: 10%">
				<el-form ref="ruleForm" :model="form" :rules="rules" label-position="top" status-icon label-width="120px" @submit.prevent>
					<el-form-item :label="$t('flow.logo')" prop="logo">
						<upload-img v-model:imageUrl="form.logo" height="100px" width="100px">
							<template #empty>
								<el-icon>
									<Avatar />
								</el-icon>
								<span>{{ $t('flow.logo') }}</span>
							</template>
						</upload-img>
					</el-form-item>
					<el-form-item :label="$t('flow.name')" prop="name">
						<el-input v-model="form.name" />
					</el-form-item>
					<el-form-item :label="$t('flow.flowId')" prop="flowId">
						<el-input v-model="form.flowId" :placeholder="$t('flow.flowIdTip')" :readonly="isEditMode" />
						<template #label>
							<span>{{ $t('flow.flowId') }}</span>
							<Tip :content="$t('flow.flowIdTip')" />
						</template>
					</el-form-item>
					<el-form-item :label="$t('flow.remark')" prop="remark">
						<el-input v-model="form.remark" />
					</el-form-item>
					<el-form-item :label="$t('flow.group')" prop="groupId">
						<el-select v-model="form.groupId" :placeholder="$t('flow.groupTips')">
							<el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('flow.admin')" prop="adminList">
						<select-show v-model:orgList="form.adminList" type="user" :multiple="false"></select-show>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import selectShow from '/@/components/OrgSelector/index.vue';
import { queryGroupList } from '/@/api/flow/group';
import { validateFlowId } from '/@/api/flow/flow';
import { useRoute } from 'vue-router';
import { useFlowStore } from '../workflow/stores/flow';
import { GroupVO } from '/@/api/flow/group/types';

const ruleForm = ref();

const validate = async (): Promise<void> => {
	return new Promise((resolve, reject) => {
		ruleForm.value.validate((valid: boolean, fields: any) => {
			if (valid) {
				resolve();
			} else {
				const arr: string[] = [];
				for (const err in fields) {
					arr.push(fields[err][0].message);
				}
				reject(arr);
			}
		});
	});
};

// 暴露方法和属性给父组件
defineExpose({ validate });

// 异步验证流程ID是否存在
const validateFlowIdAsync = async (_rule: any, value: string) => {
	// 如果是编辑模式，不验证
	if (isEditMode.value) {
		return;
	}

	// 如果为空或者不满足格式要求，跳过此验证（由其他规则处理）
	if (!value || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
		return;
	}

	const { data } = await validateFlowId(value);
	if (data !== true && data?.exists !== true) {
		throw new Error('流程ID不存在');
	}
};

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请填写名称', trigger: 'blur' },
		{ min: 2, max: 10, message: '2-10个字符', trigger: 'blur' },
	],
	flowId: [
		{ required: false, trigger: 'blur' },
		{
			pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
			message: '流程ID只能包含英文字母和数字，且必须以字母开头',
			trigger: 'blur'
		},
		{ min: 1, max: 50, message: '1-50个字符', trigger: 'blur' },
		{ validator: validateFlowIdAsync, trigger: 'blur' }
	],
	remark: [
		{ required: false, message: '请填写描述', trigger: 'blur' },
		{ min: 2, max: 20, message: '2-20个字符', trigger: 'blur' },
	],
	groupId: [
		{
			required: true,
			message: '请选择分组',
			trigger: 'change',
		},
	],
	logo: [
		{
			required: true,
			message: '请上传图标',
			trigger: 'change',
		},
	],
	adminList: [
		{
			required: true,
			message: '请选择管理员',
			trigger: 'change',
		},
	],
});

const props = defineProps({
	groupId: {
		type: String,
		default: undefined,
	},
});

const route = useRoute();
const groupList = ref<GroupVO[]>([]);

// 判断是否为编辑模式
const isEditMode = computed(() => {
	return !!route.params.flowId || !!route.query.flowId;
});

onMounted(() => {
	queryGroupList().then(({ data }) => {
		groupList.value = data;
		if (!form.value.groupId && data.length > 0) {
			form.value.groupId = data[0].id;
		}
	});
});

watch(
	() => props.groupId,
	(val) => {
		if (val !== undefined) {
			form.value.groupId = val;
		}
	}
);

const flowStore = useFlowStore();

const form = computed(() => {
	return flowStore.step1;
});
</script>
<style scoped>
.container-div {
	width: 800px;
	height: 100vh; /* Set the container height to 100% of the viewport height */
	margin-left: calc(50% - 400px);
	text-align: center;
}
</style>
