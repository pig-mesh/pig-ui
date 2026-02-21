<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 顶部操作栏 -->
			<div class="flex items-center justify-between px-5 py-3 mb-2 h-15">
				<div class="flex-1"></div>

				<!-- 步骤导航 -->
				<div class="flex-2 text-center max-w-[600px]">
					<span v-for="(step, index) in steps" :key="index" class="inline-block px-5 py-2.5 cursor-pointer"
						:class="{ 'border-b-2 border-primary text-primary': activeStep === index }"
						@click="activeStep = index">
						<span
							class="mr-1.5 inline-block w-6 h-6 text-base font-normal text-center leading-6 border rounded-full"
							:class="[activeStep === index ? 'bg-primary text-white' : 'border-current']">
							{{ index + 1 }}
						</span>
						<span class="text-lg font-medium">{{ $t(step.title) }}</span>
					</span>
				</div>

				<!-- 发布按钮 -->
				<div class="flex items-center justify-end flex-1">
					<el-button type="primary" @click="publish">{{ $t('flow.publish') }}</el-button>
				</div>
			</div>

			<!-- 内容区域 -->
			<el-scrollbar class="h-[calc(100vh-120px)]">
				<step1 v-show="activeStep === 0" :groupId="paramGroupId" ref="step1Ref" />
				<step2 v-show="activeStep === 1" ref="step2Ref" />
				<step3 v-show="activeStep === 2" :nodeConfigObj="step3NodeConfig" ref="step3Ref" />
			</el-scrollbar>

			<!-- 校验对话框 -->
			<el-dialog v-model="validateDialogShow" :title="$t('flow.processCheck')">
				<el-steps :active="validateFlowStep" finish-status="success" simple class="mt-5">
					<el-step :title="$t('flow.basicInformation')" />
					<el-step :title="$t('flow.formDesign')" />
					<el-step :title="$t('flow.processDesign')" />
				</el-steps>

				<div class="text-center">
					<!-- 校验成功 -->
					<el-result v-if="validateFlowStep === 3" icon="success" :title="$t('flow.checkSuccess')"
						:sub-title="$t('flow.checkSubSuccess')">
						<template #extra>
							<el-button type="primary" :loading="isSubmitting" @click="submitFlow">{{ $t('flow.submit')
							}}</el-button>
						</template>
					</el-result>

					<!-- 校验中 -->
					<el-result
						v-if="validateErrMsg.length === 0 && validateDialogShow && validatingShow && validateFlowStep < 3"
						:title="$t('flow.checkIng')" :sub-title="$t('flow.checkSubIng')">
						<template #icon>
							<span class="inline-block w-25 h-25" v-loading="true"></span>
						</template>
					</el-result>

					<!-- 校验失败 -->
					<el-result v-if="validateErrMsg.length > 0" icon="error" title="检查失败">
						<template #sub-title>
							<div v-for="item in validateErrMsg" :key="item" class="text-red-500">
								<el-icon>
									<WarnTriangleFilled />
								</el-icon>
								{{ item }}
							</div>
						</template>
						<template #extra>
							<el-button type="primary" @click="gotoEdit">{{ $t('common.editBtn') }}</el-button>
						</template>
					</el-result>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { WarnTriangleFilled } from '@element-plus/icons-vue';
import { addFlow, getFlowDetail } from '/@/api/flow/flow';
import { useUserInfo } from '/@/stores/userInfo';
import other from '/@/utils/other';
import FcDesigner from 'form-create-designer';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { BpmModelFormType } from '../form/const/constants';
import { useFlowStore } from '../workflow/stores/flow';
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';

const store = useFlowStore();
const route = useRoute();
const router = useRouter();

// 步骤组件引用
const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();

// 步骤配置
const steps = [{ title: 'flow.basicInformation' }, { title: 'flow.formDesign' }, { title: 'flow.processDesign' }];

// 校验相关状态
const validateErrMsg = ref<string[]>([]);
const activeStep = ref(0);
const validateFlowStep = ref(0);
const validateDialogShow = ref(false);
const validatingShow = ref(false);
const isSubmitting = ref(false);

// 初始化参数
const paramGroupId = ref();
const step3NodeConfig = ref({});

/**
 * 处理校验错误
 */
const handleValidateError = (errors: unknown) => {
	validatingShow.value = false;
	validateErrMsg.value = Array.isArray(errors) ? errors : [String(errors)];
};

/**
 * 校验第三步(流程设计)
 */
const checkStep3 = () => {
	setTimeout(async () => {
		try {
			await step3Ref.value.validate();
			validateFlowStep.value = 3;
		} catch (errors) {
			handleValidateError(errors);
		}
	});
};

/**
 * 校验第二步(表单设计)
 */
const checkStep2 = async () => {
	try {
		await step2Ref.value.validate();
		setTimeout(() => {
			validateFlowStep.value = 2;
			checkStep3();
		});
	} catch (errors) {
		handleValidateError(errors);
	}
};

/**
 * 校验第一步(基本信息)
 */
const checkStep1 = async () => {
	try {
		await step1Ref.value.validate();
		validateFlowStep.value = 1;
		setTimeout(() => checkStep2(), 500);
	} catch (errors) {
		handleValidateError(errors);
	}
};

/**
 * 跳转到错误步骤进行编辑
 */
const gotoEdit = () => {
	activeStep.value = validateFlowStep.value;
	validateDialogShow.value = false;
};

/**
 * 发布流程(触发校验流程)
 */
const publish = () => {
	validateErrMsg.value = [];
	validateFlowStep.value = 0;
	validateDialogShow.value = true;
	validatingShow.value = true;
	setTimeout(() => checkStep1(), 500);
};

/**
 * 提交流程数据
 */
const submitFlow = async () => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;

	try {
		// 获取流程设计数据
		const processData = await step3Ref.value.getProcessData();
		const { step1, step2 } = store;
		const flow = other.deepClone(step1);

		// 处理表单数据
		if (step2.formType === BpmModelFormType.NORMAL) {
			flow.formItems = FcDesigner.formCreate.toJson(step2.formRule || []);
		} else {
			flow.formItems = JSON.stringify([]);
			delete step2.formRule;
		}

		// 序列化配置数据
		flow.formConfig = FcDesigner.formCreate.toJson(step2);
		flow.process = FcDesigner.formCreate.toJson(processData);
		flow.adminList = FcDesigner.formCreate.toJson(step1.adminList);

		// 提交流程
		await addFlow(flow);
		validateDialogShow.value = false;
		store.$reset();
		router.push('/flow/list/index');
	} catch (error) {
		// 错误已由全局请求拦截器处理
	} finally {
		isSubmitting.value = false;
	}
};

onMounted(() => {
	const { query } = route;
	const groupId = (query.groupId as LocationQueryValue) ?? '';
	const flowId = (query.flowId as LocationQueryValue) ?? '';
	const cp = (query.cp as LocationQueryValue) ?? '';

	// 设置分组ID
	if (groupId) {
		paramGroupId.value = groupId;
	}

	// 编辑/复制模式:加载流程详情
	if (flowId) {
		getFlowDetail(flowId).then((res) => {
			const { data } = res;

			// 加载基本信息
			store.step1.adminList = JSON.parse(data.adminList);
			store.step1.name = data.name;
			store.step1.logo = data.logo;
			if (cp !== '1') {
				// cp=1 表示复制模式,不保留原flowId
				store.step1.flowId = flowId;
			}
			store.step1.remark = data.remark;
			store.step1.groupId = data.groupId;

			// 加载表单配置
			if (data.formConfig) {
				try {
					const formConfig = FcDesigner.formCreate.parseJson(data.formConfig);
					store.step2.formType = formConfig.formType || BpmModelFormType.NORMAL;
					const optionalFields = ['formCustomCreatePath', 'formCustomViewPath', 'formId', 'formRule', 'formOption'] as const;
					for (const field of optionalFields) {
						if (formConfig[field]) {
							store.step2[field] = formConfig[field];
						}
					}
				} catch (error) {
					console.error('解析 formConfig 失败:', error);
				}
			}

			// 加载流程设计
			step3NodeConfig.value = JSON.parse(data.process);
		});
	} else {
		// 新建模式:初始化管理员为当前用户
		const { userId, username, avatar } = useUserInfo().userInfos.user;
		store.clearStep1();
		store.clearStep2();
		store.step1.adminList = [{ id: userId, name: username, avatar, type: 'user' }];
	}
});

// 从 step2 切换到其他 step 时自动保存
watch(activeStep, (newStep, oldStep) => {
	if (oldStep === 1 && newStep !== 1 && step2Ref.value) {
		step2Ref.value.saveFormDesign?.();
	}
});
</script>
