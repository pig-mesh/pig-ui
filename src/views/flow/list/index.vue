<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="mt-4 ml-8">
				<el-form :model="queryForm" ref="queryRef" :inline="true" @keyup.enter="handleQuery">
					<el-form-item label="流程名称" prop="flowName">
						<el-input placeholder="请输入流程名称" v-model="queryForm.flowName" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="handleQuery">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<el-tabs tab-position="left" class="mt-4 ml-8">
				<el-tab-pane :label="item.name" v-for="item in successGroupList" :key="item.name">
					<div class="flex flex-col">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							<div
								v-for="(flow, index1) in item.items"
								:key="index1"
								class="relative flex items-start p-4 shadow-lg bg-white rounded-xl dark:bg-slate-800 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200"
							>
								<div class="flex items-center justify-center w-12 h-12 ml-4 border border-blue-100 rounded-full bg-blue-50 dark:bg-slate-700 dark:border-slate-600 overflow-hidden shrink-0">
									<img v-if="flow.logo" :src="flow.logo.includes('http') ? flow.logo : baseURL + flow.logo" class="w-full h-full object-cover" />
									<el-icon v-else :size="24" class="text-blue-400"><Promotion /></el-icon>
								</div>
								<div class="ml-4">
									<h2 class="font-semibold dark:text-slate-200">{{ flow.name }}</h2>
									<p class="mt-2 text-sm text-gray-500 dark:text-slate-400">
										<el-link @click="startProcess(flow)" type="primary">发起流程</el-link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
			<start ref="startRef"></start>
		</div>
	</div>
</template>

<script lang="ts" setup name="flowList">
import { queryMineStartGroupFlowList } from '/@/api/flow/group';
import { GroupVO } from '/@/api/flow/group/types';
import { Promotion } from '@element-plus/icons-vue';
import Start from '/@/views/flow/form/tools/startFlow.vue';

const startRef = ref();
const queryRef = ref();
const successGroupList = ref<GroupVO[]>([]);
const queryForm = reactive({ flowName: '' });

const handleQuery = async () => {
	const { data } = await queryMineStartGroupFlowList('0');
	successGroupList.value = queryForm.flowName
		? data.map(({ items, ...rest }) => ({
				...rest,
				items: items?.filter(({ formName }) => formName?.includes(queryForm.flowName)),
			}))
		: data;
};

const resetQuery = () => {
	queryRef.value.resetFields();
	handleQuery();
};

const startProcess = (flow: any) => {
	startRef.value.handle(flow);
};

const route = useRoute();

onMounted(() => {
	handleQuery();
	const flowId = route.query.flowId as string | undefined;
	if (flowId) {
		startProcess({ flowId });
	}
});
</script>
