<template>
	<div class="layout-padding">
		<div class="layout-padding-view">
			<div class="titlebar">
				<div class="f1"></div>
				<div class="f2">
					<span class="center_t" effect="dark" :activeStep="activeStep == 0" @click="activeStep = 0">
						<span :activeStep="activeStep == 0">1</span>
						<span>{{ $t('flow.basicInformation') }}</span>
					</span>
					<span class="center_t" effect="dark" :activeStep="activeStep == 1" @click="activeStep = 1">
						<span :activeStep="activeStep == 1">2</span>
						<span>{{ $t('flow.formDesign') }}</span>
					</span>
					<span class="center_t" effect="dark" :activeStep="activeStep == 2" @click="activeStep = 2">
						<span :activeStep="activeStep == 2">3</span>
						<span>{{ $t('flow.processDesign') }}</span>
					</span>
				</div>
				<div class="f3">
					<el-button type="primary" @click="publish">{{ $t('flow.publish') }}</el-button>
				</div>
			</div>
			<el-scrollbar height="calc(100vh - 250px)">
				<step1 v-show="activeStep === 0" :groupId="paramGroupId" ref="step1Ref" />
				<step2 v-show="activeStep === 1" ref="step2Ref" />
				<step3 v-show="activeStep === 2" :nodeConfigObj="step3NodeConfig" ref="step3Ref" />
			</el-scrollbar>
			<!--			//验证每一步-->
			<el-dialog v-model="validateDialogShow" :title="$t('flow.processCheck')">
				<el-steps :active="validateFlowStep" finish-status="success" simple style="margin-top: 20px">
					<el-step :title="$t('flow.basicInformation')" />
					<el-step :title="$t('flow.formDesign')" />
					<el-step :title="$t('flow.processDesign')" />
				</el-steps>

				<div style="text-align: center">
					<el-result v-if="validateFlowStep == 3" icon="success" :title="$t('flow.checkSuccess')" :sub-title="$t('flow.checkSubSuccess')">
						<template #extra>
							<el-button type="primary" @click="submitFlow">{{ $t('flow.submit') }}</el-button>
						</template>
					</el-result>

					<el-result
						:title="$t('flow.checkIng')"
						:sub-title="$t('flow.checkSubIng')"
						v-if="validateErrMsg.length == 0 && validateDialogShow && validatingShow && validateFlowStep < 3"
					>
						<template #icon>
							<span v-loading="true" style="display: inline-block; border: 0px solid red; width: 100px; height: 100px"> </span>
						</template>
					</el-result>

					<el-result v-if="validateErrMsg.length > 0" icon="error" title="检查失败">
						<template #sub-title>
							<div v-for="item in validateErrMsg" :key="item">
								<el-text type="danger">
									<el-icon>
										<WarnTriangleFilled />
									</el-icon>
									{{ item }}
								</el-text>
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

let store = useFlowStore();
const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();

const validateErrMsg = ref([]);

const activeStep = ref(0);
const validateFlowStep = ref(0);
const validateDialogShow = ref(false);
const validatingShow = ref(false);

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
		//1
		checkStep1();
	}, 500);
};
import { useRoute } from 'vue-router';
import { getFlowDetail } from '/@/api/flow/flow';
import { useUserInfo } from '/@/stores/userInfo';
import other from '/@/utils/other';

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

			store.setStep2(JSON.parse(data.formItems));
			step3NodeConfig.value = JSON.parse(data.process);
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

const step3NodeConfig = ref();

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
	step3Ref.value.getProcessData().then((res) => {
		let step1 = store.step1;
		let step2 = store.step2;

		let flow = other.deepClone(step1);
		flow.formItems = JSON.stringify(step2);
		flow.process = JSON.stringify(res);
		flow.adminList = JSON.stringify(step1.adminList);

		addFlow(flow).then((res) => {
			validateDialogShow.value = false;
			store.$reset();
			router.push('/flow/list/index');
		});
	});
};
</script>
<style scoped lang="scss">
.f2-width {
	--f2-width: 600px;
}

.titlebar {
	padding-top: 10px;
	padding-bottom: 10px;
	height: 60px;
	flex-direction: row;
	margin-bottom: 40px;
	text-align: center;
}

.f1 {
	width: calc(100% / 2 - var(--f2-width) / 2);
}

.f2 {
	width: var(--f2-width);
	text-align: center;
}

.f3 {
	width: calc(100% / 2 - var(--f2-width) / 2);
	text-align: right;
	line-height: 46px;
	height: 46px;
	padding-right: 20px;
}

.center_t {
	cursor: pointer;
	padding: 10px 20px;
	display: inline-block;
}

.center_t span:first-child {
	margin-right: 6px;
	font-size: 16px;
	font-weight: 400;
	text-align: center;
	line-height: 22px;
	border: 1px solid;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	display: inline-block;
}

.center_t span:first-child[activeStep='true'] {
	color: white;
	background-color: var(--el-color-primary);
}

.center_t span:last-child {
	font-weight: 500;
	font-size: 18px;
}

.center_t[activeStep='true'] {
	border-bottom: 2px solid var(--el-color-primary);
	color: var(--el-color-primary);
}
</style>
