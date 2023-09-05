<template>
	<div>
		<div class="container-div">
			<el-card class="box-card" style="padding-right: 10%; padding-left: 10%">
				<el-form ref="ruleForm" :model="form" :rules="rules" label-position="top" status-icon label-width="120px" @submit.prevent>
					<el-form-item :label="$t('flow.logo')" prop="logo">
						<upload-img v-model:imageUrl="form.logo"  height="100px" width="100px">
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
import selectShow from '/@/views/flow/workflow/components/dialog/selectAndShow.vue';
import { queryGroupList } from '/@/api/flow/group';

const { proxy } = getCurrentInstance();

const validate = (f) => {
	proxy.$refs.ruleForm.validate((valid, fields) => {
		var arr = [];
		if (!valid) {
			for (var err in fields) {
				arr.push(fields[err][0].message);
			}
		}

		f(valid, arr);
	});
};

// 暴露方法和属性给父组件
defineExpose({ validate });
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请填写名称', trigger: 'blur' },
		{ min: 2, max: 10, message: '2-10个字符', trigger: 'blur' },
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

import { useRoute } from 'vue-router';

const route = useRoute();

const groupList = ref<GroupVO[]>([]);

onMounted(() => {
	queryGroupList().then(({ data }) => {
		groupList.value = data;
	});
});

watch(
	() => props.groupId,
	(val) => {
		if (!!val) {
			form.value.groupId = parseInt(val);
		}
	}
);

let props = defineProps({
	groupId: {
		type: Number,
		default: undefined,
	},
});

import { reactive, ref, computed } from 'vue';

import { useFlowStore } from '../workflow/stores/flow';
import { GroupVO } from '/@/api/flow/group/types';

let flowStore = useFlowStore();

var form = computed(() => {
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
