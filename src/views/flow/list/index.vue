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
					<div style="display: flex; flex-direction: row; flex-wrap: wrap">
						<div v-for="(flow, index1) in item.items" :key="index1" class="item">
							<div class="f1">
								<upload-img v-model:imageUrl="flow.logo" disabled width="50px" height="50px"></upload-img>
							</div>
							<div class="f2">
								<div>{{ flow.name }}</div>
								<el-link @click="startProcess(flow)" type="primary">发起流程</el-link>
								<div></div>
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
	const res = await queryMineStartGroupFlowList(false);
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

// 页面加载完成后执行查询方法
onMounted(() => {
	handleQuery();
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
