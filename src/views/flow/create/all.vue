<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- Header Bar -->
			<div class="flex justify-between items-center px-5 py-3 mb-2 h-15">
				<div class="flex-1"></div>

				<!-- Steps Navigation -->
				<div class="flex-2 text-center max-w-[600px]">
					<span
						v-for="(step, index) in steps"
						:key="index"
						class="inline-block px-5 py-2.5 cursor-pointer"
						:class="{ 'border-b-2 border-primary text-primary': activeStep === index }"
						@click="activeStep = index"
					>
						<span
							class="mr-1.5 inline-block w-6 h-6 text-base font-normal text-center leading-[22px] border rounded-full"
							:class="[activeStep === index ? 'bg-primary text-white' : 'border-current']"
						>
							{{ index + 1 }}
						</span>
						<span class="text-lg font-medium">{{ $t(step.title) }}</span>
					</span>
				</div>

				<!-- Publish Button -->
				<div class="flex flex-1 justify-end items-center">
					<el-button type="primary" @click="publish">{{ $t('flow.publish') }}</el-button>
				</div>
			</div>

			<!-- Content Area -->
			<el-scrollbar class="h-[calc(100vh-20px)]">
				<step1 v-show="activeStep === 0" :groupId="paramGroupId" ref="step1Ref" />
				<step2 v-show="activeStep === 1" ref="step2Ref" />
				<step3 v-show="activeStep === 2" :nodeConfigObj="step3NodeConfig" ref="step3Ref" />
			</el-scrollbar>

			<!-- Validation Dialog -->
			<el-dialog v-model="validateDialogShow" :title="$t('flow.processCheck')">
				<el-steps :active="validateFlowStep" finish-status="success" simple class="mt-5">
					<el-step :title="$t('flow.basicInformation')" />
					<el-step :title="$t('flow.formDesign')" />
					<el-step :title="$t('flow.processDesign')" />
				</el-steps>

				<div class="text-center">
					<!-- Success Result -->
					<el-result v-if="validateFlowStep === 3" icon="success" :title="$t('flow.checkSuccess')" :sub-title="$t('flow.checkSubSuccess')">
						<template #extra>
							<el-button type="primary" :loading="isSubmitting" @click="submitFlow">{{ $t('flow.submit') }}</el-button>
						</template>
					</el-result>

					<!-- Loading Result -->
					<el-result
						v-if="validateErrMsg.length === 0 && validateDialogShow && validatingShow && validateFlowStep < 3"
						:title="$t('flow.checkIng')"
						:sub-title="$t('flow.checkSubIng')"
					>
						<template #icon>
							<span class="inline-block w-25 h-25" v-loading="true"></span>
						</template>
					</el-result>

					<!-- Error Result -->
					<el-result v-if="validateErrMsg.length > 0" icon="error" title="检查失败">
						<template #sub-title>
							<div v-for="item in validateErrMsg" :key="item" class="text-red-500">
								<el-icon><WarnTriangleFilled /></el-icon>
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
import { addFlow } from '/@/api/flow/flow';
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';
import { useFlowStore } from '../workflow/stores/flow';
import { LocationQuery, LocationQueryValue, useRouter } from 'vue-router';
import FcDesigner from 'form-create-designer';

let store = useFlowStore();
const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();

const validateErrMsg = ref([]);

const activeStep = ref(0);
const validateFlowStep = ref(0);
const validateDialogShow = ref(false);
const validatingShow = ref(false);
const isSubmitting = ref(false);

const gotoEdit = () => {
	activeStep.value = validateFlowStep.value;
	validateDialogShow.value = false;
};
const publish = (t) => {
	validateErrMsg.value = [];

	validateFlowStep.value = 0;
	validateDialogShow.value = true;
	validatingShow.value = true;

	setTimeout(function () {
		checkStep1();
	}, 500);
};
import { useRoute } from 'vue-router';
import { getFlowDetail } from '/@/api/flow/flow';
import { useUserInfo } from '/@/stores/userInfo';
import other from '/@/utils/other';
import { BpmModelFormType } from '../form/const/constants';

const route = useRoute();
onMounted(() => {
	const query: LocationQuery = route.query;

	const groupId = (query.groupId as LocationQueryValue) ?? '';
	const flowId = (query.flowId as LocationQueryValue) ?? '';
	const cp = (query.cp as LocationQueryValue) ?? '';

	if (groupId) {
		paramGroupId.value = groupId;
	}
	if (flowId) {
		getFlowDetail(flowId).then((res) => {
			var { data } = res;

			store.step1.adminList = JSON.parse(data.adminList);
			store.step1.name = data.name;
			store.step1.logo = data.logo;
			if (!cp || !(parseInt(cp) === 1)) {
				//复制
				store.step1.flowId = flowId;
			}
			store.step1.remark = data.remark;
			store.step1.groupId = data.groupId;
			// 解析 formConfig - 优先使用新的配置格式
			if (data.formConfig) {
				try {
					const formConfig = JSON.parse(data.formConfig);
					// 设置表单类型和相关配置
					store.step2.formType = formConfig.formType || BpmModelFormType.NORMAL;
					if (formConfig.formCustomCreatePath) {
						store.step2.formCustomCreatePath = formConfig.formCustomCreatePath;
					}
					if (formConfig.formCustomViewPath) {
						store.step2.formCustomViewPath = formConfig.formCustomViewPath;
					}
					if (formConfig.formId) {
						store.step2.formId = formConfig.formId;
					}
					if (formConfig.formRule) {
						store.step2.formRule = formConfig.formRule;
					}
					if (formConfig.formOption) {
						store.step2.formOption = formConfig.formOption;
					}
				} catch (error) {
					console.error('解析 formConfig 失败:', error);
				}
			}
			step3NodeConfig = JSON.parse(data.process);
		});
	} else {
		//新增
		let userId = useUserInfo().userInfos.user.userId;
		let name = useUserInfo().userInfos.user.username;
		let avatar = useUserInfo().userInfos.user.avatar;
		//清空 store 属性
		store.clearStep1();
		store.clearStep2();
		store.step1.adminList = [
			{
				id: userId,
				name: name,
				avatar: avatar,
				type: 'user',
			},
		];
	}
});

let step3NodeConfig = reactive({});

var paramGroupId = ref();

const checkStep1 = () => {
	step1Ref.value.validate(function (valid, arr) {
		if (valid) {
			validateFlowStep.value = 1;

			setTimeout(function () {
				checkStep2();
			}, 500);
		} else {
			validatingShow.value = false;
			//错误信息
			validateErrMsg.value = arr;
		}
	});
};
const checkStep2 = () => {
	step2Ref.value.validate(function (valid, arr) {
		if (valid) {
			setTimeout(function () {
				validateFlowStep.value = 2;
				checkStep3();
			});
		} else {
			validatingShow.value = false;
			//错误信息
			validateErrMsg.value = arr;
		}
	});
};

const checkStep3 = () => {
	setTimeout(function () {
		step3Ref.value.validate(function (valid, arr) {
			if (valid) {
				validateFlowStep.value = 3;
			} else {
				validatingShow.value = false;
				//错误信息
				validateErrMsg.value = arr;
			}
		});
	});
};
const router = useRouter();

const submitFlow = () => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;

	step3Ref.value
		.getProcessData()
		.then((processData: any) => {
			let step1 = store.step1;
			let step2 = store.step2;

			let flow = other.deepClone(step1);
			// 根据表单类型保存不同的数据格式
			if (step2.formType === BpmModelFormType.NORMAL) {
				// 动态表单：保存表单规则
				flow.formItems = JSON.stringify(step2.formRule || []);
			} else {
				// 自定义表单：保存空数组，表单信息在step2中
				flow.formItems = JSON.stringify([]);
				delete step2.formRule;
			}
			// 保存完整的表单设计数据
			flow.formConfig = JSON.stringify(step2);
			flow.process = JSON.stringify(processData);
			flow.adminList = JSON.stringify(step1.adminList);

			addFlow(flow)
				.then(() => {
					validateDialogShow.value = false;
					store.$reset();
					router.push('/flow/list/index');
				})
				.catch(() => {
					isSubmitting.value = false;
				});
		})
		.catch(() => {
			isSubmitting.value = false;
		});
};

// Add steps data
const steps = [{ title: 'flow.basicInformation' }, { title: 'flow.formDesign' }, { title: 'flow.processDesign' }];

// 监听 activeStep 变化，离开 step2 时自动保存
watch(activeStep, (newStep, oldStep) => {
	// 从 step2 (index=1) 切换到其他 step 时自动保存
	if (oldStep === 1 && newStep !== 1 && step2Ref.value) {
		step2Ref.value.saveFormDesign?.();
	}
});
</script>
