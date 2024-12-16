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
								class="flex relative items-start p-4 bg-blue-50 rounded-xl shadow-lg dark:bg-slate-800 hover:scale-110 hover:shadow-lg"
							>
								<div class="flex justify-center items-center ml-8 w-12 h-12 bg-blue-50 rounded-full border border-blue-100 dark:bg-slate-700 dark:border-slate-600">
									<upload-img v-model:imageUrl="flow.logo" disabled width="50px" height="50px"></upload-img>
								</div>
								<div class="ml-8">
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
import Start from '/@/views/flow/form/tools/startFlow.vue';
import { LocationQuery, LocationQueryValue, useRoute } from 'vue-router';

// 定义引用
const startRef = ref();
const queryRef = ref();
const successGroupList = ref<GroupVO[]>([]);

// 定义响应式数据
const queryForm = reactive({
	flowName: '',
});

// 查询流程列表
const handleQuery = async () => {
	const res = await queryMineStartGroupFlowList('0');
	const { data } = res;

	// 根据用户输入的flowName进行过滤
	if (queryForm.flowName) {
		const filteredData = data.map(({ items, ...rest }) => ({
			...rest,
			items: items.filter(({ name }) => name.includes(queryForm.flowName)),
		}));

		successGroupList.value = filteredData;
	} else {
		successGroupList.value = data;
	}
};

// 清空搜索条件并执行查询方法
const resetQuery = () => {
	queryRef.value.resetFields();
	handleQuery();
};

// 发起流程
const startProcess = (flow: any) => {
	startRef.value.handle(flow);
};

const route = useRoute();
// 页面加载完成后执行查询方法
onMounted(() => {
	handleQuery();
	// 流程参数
	const query: LocationQuery = route.query;
	const flowId = (query.flowId as LocationQueryValue) ?? '';
	if (flowId) {
		startProcess({ flowId: flowId });
	}
});
</script>
<style scoped lang="scss">
.item {
	margin: 5px 20px;
	padding: 5px;
	padding-bottom: 0px;
	width: 260px;
	display: flex;
	flex-direction: row;
	border-radius: 5px;
	border: 1px solid var(--el-color-info);

	.f2 {
		font-weight: bolder;
		height: 50px;
		margin-left: 15px;
		width: 183px;
	}
}

.item:hover {
	border: 1px solid var(--el-color-primary);
}
</style>
