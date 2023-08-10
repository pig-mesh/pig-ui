<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="mt-4 ml-8">
				<div class="flex justify-start">
					<el-button class="button" @click.stop="toCreateFlow(undefined)" type="primary" :icon="Plus">{{ $t('flow.creationProcess') }} </el-button>
					<popover-input @confirm="addGroupInputBlur" class="ml-4">
						<template #default>
							<el-button :icon="Plus">{{ $t('flow.creationGroup') }}</el-button>
						</template>
					</popover-input>
				</div>
			</el-row>

			<el-tabs class="mt-4 ml-8" @tab-click="handleTabClick">
				<el-tab-pane :label="item.groupName" v-for="item in successGroupList" :key="item.id">
					<template #label>
						<div class="card-header">
							<span>{{ item.groupName }}</span>
							<span>
								<el-tooltip effect="dark" content="删除" placement="top">
									<el-button text :icon="Delete" @click.stop="deleteGroup(item.id)" circle />
								</el-tooltip>
							</span>
						</div>
					</template>

					<el-table
						:data="state.dataList"
						style="width: 100%"
						border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="flowId" label="#" width="250" />
						<el-table-column prop="logo" :label="$t('flow.logo')" width="80" show-overflow-tooltip>
							<template #default="{ row }">
								<upload-img disabled v-model:imageUrl="row.logo" width="50px" height="50px"></upload-img>
							</template>
						</el-table-column>
						<el-table-column prop="name" :label="$t('flow.name')" show-overflow-tooltip>
							<template #default="{ row }">
								{{ row.name }}
								<el-tag v-if="row.stop" type="danger">已停用</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" :label="$t('flow.createTime')" show-overflow-tooltip></el-table-column>
						<el-table-column prop="rangeShow" :label="$t('flow.scopeOfUse')" show-overflow-tooltip>
							<template #default="{ row }">
								{{ row.rangeShow && row.rangeShow.length > 0 ? row.rangeShow : $t('flow.allUser') }}
							</template>
						</el-table-column>
						<el-table-column :label="$t('common.action')" width="200">
							<template #default="{ row }">
								<el-tooltip effect="dark" content="编辑" placement="top">
									<el-button text @click="toEditFlow(row)" :icon="Edit" circle />
								</el-tooltip>
								<el-tooltip effect="dark" content="复制" placement="top">
									<el-button text @click="toCopyFlow(row)" :icon="DocumentCopy" circle />
								</el-tooltip>

								<el-tooltip v-if="!row.stop" effect="dark" content="停用" placement="top">
									<el-button @click="showDisableConfirm(row)" text :icon="Hide" circle />
								</el-tooltip>

								<el-tooltip v-else effect="dark" content="启用" placement="top">
									<el-button @click="showEnableConfirm(row)" text :icon="View" circle />
								</el-tooltip>

								<el-tooltip effect="dark" content="删除" placement="top">
									<el-button text @click="showDeleteConfirm(row)" :icon="Delete" circle />
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup name="flowGroup">
import { Plus, Delete, Edit, DocumentCopy, Hide, View } from '@element-plus/icons-vue';
import { addGroup, delGroup, queryGroupList, queryGroupFlowList } from '/@/api/flow/group';
import { disableFlow, enableFlow, deleteFlow } from '/@/api/flow/flow';
import { GroupVO } from '/@/api/flow/group/types';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';

// 默认查询
const handleQueryFlowPage = (params: any) => {
	if (successGroupList && !state.queryForm.groupId) {
		params.groupId = successGroupList.value[0].id;
	}
	return queryGroupFlowList(params);
};

// 定义基础表格相关的状态及方法
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		groupId: '',
	},
	pagination: {
		size: 5,
		current: 1,
	},
	createdIsNeed: false,
	pageList: handleQueryFlowPage,
	descs: ['updated'],
});

const { getDataList, sizeChangeHandle, currentChangeHandle, tableStyle } = useTable(state);

// 异步加载PopoverInput组件
const PopoverInput = defineAsyncComponent(() => import('/@/components/PopoverInput/index.vue'));

// 存储成功的分组列表
const successGroupList = ref<GroupVO[]>([]);

// 失去焦点时触发新增分组名称
const addGroupInputBlur = (groupName: string) => {
	if (!groupName) {
		return;
	}
	addGroup({ groupName: groupName }).then(() => {
		ElMessage.success('新增成功');
		handleQuery();
	});
};

// 切换查询
const handleTabClick = (pane?: any) => {
	if (successGroupList) {
		state.queryForm.groupId = successGroupList.value[pane.paneName].id;
	}
	getDataList();
};

// 路由实例
const router = useRouter();

// 跳转到创建流程页
const toCreateFlow = (id) => {
	let to = '/flow/create/all';
	if (id) {
		to = to + '?groupId=' + id;
	}
	router.push(to);
};

// 跳转到编辑流程页
const toEditFlow = (flow) => {
	let to = '/flow/create/all?flowId=' + flow.flowId;
	router.push(to);
};

// 跳转到复制流程页
const toCopyFlow = (flow) => {
	let to = '/flow/create/all?cp=1&flowId=' + flow.flowId;
	router.push(to);
};

// 显示停用确认弹窗
const showDisableConfirm = (flow) => {
	ElMessageBox.confirm('确定要停用该流程吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		disableFlow(flow.flowId).then((res) => {
			handleQuery();
		});
	});
};

// 显示启用确认弹窗
const showEnableConfirm = (flow) => {
	ElMessageBox.confirm('确定要启用该流程吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		enableFlow(flow.flowId).then((res) => {
			handleQuery();
		});
	});
};

// 显示删除确认弹窗
const showDeleteConfirm = (flow) => {
	ElMessageBox.confirm('确定要删除该流程吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		deleteFlow(flow.flowId).then((res) => {
			handleQuery();
		});
	});
};

// 组件挂载后执行查询操作
onMounted(() => {
	handleQuery();
});

// 查询分组列表
const handleQuery = () => {
	queryGroupList().then((res) => {
		const { data } = res;
		successGroupList.value = data;
		if (data.length > 0) {
			getDataList();
		}
	});
};

// 删除分组
const deleteGroup = async (id) => {
	state.queryForm.groupId = id;
	await getDataList();
	// 获取当前
	if (state.pagination?.total > 0) {
		ElMessage.warning('删除失败,存在可用流程');
		return;
	}

	delGroup(id).then(() => {
		ElMessage.success('删除成功');
		handleQuery();
	});
};
</script>
<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item {
	display: flex;
	flex-direction: row;
	height: 60px;
	padding-top: 5px;
	margin-bottom: 10px;

	> div:nth-child(2) > div:first-child {
		font-size: 15px;
		height: 30px;
		font-weight: bolder;
		line-height: 30px;
	}

	> div:nth-child(2) > div:last-child {
		font-size: 12px;
		height: 20px;
		line-height: 20px;
	}
}

.box-card {
	width: 80%;
	margin-left: 10%;
	margin-top: 10px;
}
.menu-right {
	width: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
