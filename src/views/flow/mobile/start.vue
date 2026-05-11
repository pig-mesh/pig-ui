<script setup lang="ts" name="flowMobileStart">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NextLoading } from '/@/utils/loading';
import FormCreate from '/@/views/flow/workflow/components/FormCreate.vue';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';
import { showMobileSuccessConfirm } from './mobileSuccessConfirm';
import { useMobileStartFlow } from './useMobileStartFlow';
import { useMobileRouteQuery } from './useMobileRouteQuery';

const router = useRouter();
const { getQueryValue } = useMobileRouteQuery();

const flowId = computed(() => getQueryValue('flowId', 'flow_id', 'id'));

function goBack() {
	if (window.history.length > 1) {
		router.back();
		return;
	}
	router.replace('/home');
}

async function handleOperationSubmitted(message: string) {
	await showMobileSuccessConfirm(message);
	goBack();
}

const {
	loading,
	submitLoading,
	pageError,
	currentFlow,
	fApi,
	formData,
	formOption,
	rule,
	dynamicFormComponent,
	selectUserNodeId,
	flowNodeFormatRef,
	handleBusinessFormChange,
	loadFlow,
	submitProcess,
} = useMobileStartFlow({
	flowId: () => flowId.value,
	onSubmitted: handleOperationSubmitted,
});

onMounted(() => {
	loadFlow();
	NextLoading.done();
});
</script>

<template>
	<div class="h-screen h-[100dvh] overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
		<div class="mx-auto flex h-full w-full max-w-[430px] flex-col">
			<main class="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-3">
				<el-alert v-if="pageError" :title="pageError" type="error" show-icon :closable="false">
					<template #default>
						<el-button class="mt-3" size="small" type="primary" @click="loadFlow">重试</el-button>
					</template>
				</el-alert>

				<div v-else-if="loading" class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
					<el-skeleton :rows="6" animated />
				</div>

				<template v-else>
					<section class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
						<div class="mb-4">
							<h2 class="text-base font-bold text-slate-950 dark:text-white">申请信息</h2>
							<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">请按要求填写表单内容</p>
						</div>
						<el-form
							label-position="top"
							class="[&_.el-form-item]:mb-[18px] [&_.el-form-item\_\_label]:pb-1.5 [&_.el-form-item\_\_label]:font-semibold [&_.el-form-item\_\_label]:text-slate-700 dark:[&_.el-form-item\_\_label]:text-slate-200 [&_.el-input\_\_wrapper]:rounded-[14px] [&_.el-input\_\_wrapper]:shadow-[0_0_0_1px_rgb(226_232_240)_inset] dark:[&_.el-input\_\_wrapper]:shadow-[0_0_0_1px_rgb(51_65_85)_inset] [&_.el-textarea\_\_inner]:rounded-[14px] [&_.el-textarea\_\_inner]:shadow-[0_0_0_1px_rgb(226_232_240)_inset] dark:[&_.el-textarea\_\_inner]:shadow-[0_0_0_1px_rgb(51_65_85)_inset] [&_.el-select\_\_wrapper]:rounded-[14px] [&_.el-select\_\_wrapper]:shadow-[0_0_0_1px_rgb(226_232_240)_inset] dark:[&_.el-select\_\_wrapper]:shadow-[0_0_0_1px_rgb(51_65_85)_inset]"
						>
							<div v-if="!dynamicFormComponent">
								<FormCreate :rule="rule" v-model="formData" v-model:api="fApi" :option="formOption" />
							</div>
							<component
								:is="dynamicFormComponent.component"
								v-else
								v-bind="dynamicFormComponent.props"
								@update:modelValue="handleBusinessFormChange"
							/>
						</el-form>
					</section>

					<section class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
						<div class="flex items-center justify-between gap-3 mb-4">
							<div>
								<h2 class="text-base font-bold text-slate-950 dark:text-white">审批人</h2>
								<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">选择后进入对应审批节点</p>
							</div>
							<span class="px-3 py-1 text-xs font-semibold text-blue-600 rounded-full bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300">必填</span>
						</div>
						<FlowNodeFormat ref="flowNodeFormatRef" :selectUserNodeId="selectUserNodeId" :flow-id="currentFlow?.flowId" :form-data="formData" />
					</section>
				</template>
			</main>

			<footer
				class="shrink-0 border-t border-slate-200/80 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
			>
				<div class="mx-auto flex max-w-[430px] gap-3">
					<el-button
						class="!h-11 flex-1 !rounded-2xl"
						size="large"
						type="primary"
						:loading="submitLoading"
						:disabled="loading || !!pageError"
						@click="submitProcess"
						>提交申请</el-button
					>
				</div>
			</footer>
		</div>
	</div>
</template>
