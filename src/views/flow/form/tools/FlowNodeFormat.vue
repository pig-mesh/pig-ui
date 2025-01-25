<script setup lang="ts">
import selectShow from '/@/components/OrgSelector/index.vue';

interface UserVo {
	id: string;
	name: string;
	showTime: string | null;
	avatar: string | null;
	approveDesc: string | null;
	operType: string | null;
	status: number | null;
}

interface FlowNode {
	id: string;
	userVoList: UserVo[] | null;
	placeholder: string | null;
	status: number;
	name: string;
	type: number;
	selectUser: boolean | null;
	multiple: boolean | null;
	children: FlowNode[] | null;
	branch: FlowNode[];
}

const props = defineProps<{
	nodeUser: Record<string, any>;
	row: FlowNode[];
	disableSelect: boolean;
}>();

// Create a map to store active tabs for each node
const activeTabsMap = ref<Map<string, string>>(new Map());

// Function to get/set active tab
function getNodeActiveTab(node: FlowNode): string {
	if (!activeTabsMap.value.has(node.id)) {
		// Initialize with computed default value
		const activeIndex = node.branch.findIndex((branch) => branch.children?.some((child) => child.status !== 0));
		activeTabsMap.value.set(node.id, activeIndex >= 0 ? String(activeIndex) : '0');
	}
	return activeTabsMap.value.get(node.id) || '0';
}

// Add function to get branch label
function getBranchLabel(node: FlowNode, index: number): string {
	return node.placeholder || `分支${index + 1}`;
}

import { Check, Plus, Refresh } from '@element-plus/icons-vue';
</script>

<template>
	<div class="p-3">
		<el-timeline :reverse="false">
			<el-timeline-item
				v-for="(node, index) in row"
				:key="index"
				size="large"
				:color="node.status != 2 ? (node.status == 1 ? 'var(--el-color-warning)' : 'var(--el-color-success)') : 'var(--el-color-primary)'"
				:icon="node.status == 2 ? Check : node.status == 1 ? Plus : Refresh"
			>
				<!-- Node Title Section -->
				<div :class="['text-sm font-medium mb-3', { 'text-red-500': node.selectUser && (!nodeUser[node.id] || nodeUser[node.id]?.length == 0) }]">
					{{ node.name }}
					<span v-if="node.placeholder" class="ml-1 text-gray-500">[{{ node.placeholder }}]</span>
				</div>

				<!-- User Avatar List Section -->
				<div v-if="node.userVoList?.length" class="flex flex-wrap gap-2 mb-3">
					<div v-for="(item1, index1) in node.userVoList" :key="index1" class="w-10 text-center">
						<div class="flex flex-col items-center">
							<upload-img v-model:image-url="item1.avatar" width="30px" height="30px"></upload-img>
							<div class="mt-1 w-full text-xs truncate">{{ item1.name }}</div>
						</div>
					</div>
				</div>

				<!-- Comments Section -->
				<div v-for="(item1, index1) in node.userVoList" :key="'comment-' + index1">
					<div v-if="item1.approveDesc" class="mb-3">
						<div class="flex gap-2 items-center mb-2">
							<div class="w-10 text-center">
								<upload-img v-model:image-url="item1.avatar" disabled width="30px" height="30px"></upload-img>
							</div>
							<div class="text-xs">
								<span class="font-medium">{{ item1.name }}</span>
								<span class="ml-1 text-gray-500">(添加了评论) {{ item1.showTime }}</span>
							</div>
						</div>
						<div class="p-3 text-sm bg-gray-50 rounded">{{ item1.approveDesc }}</div>
					</div>
				</div>

				<!-- User Selection Section -->
				<div v-if="node.selectUser">
					<select-show :disabled="disableSelect" v-model:orgList="nodeUser[node.id]" type="user" :multiple="node.multiple"></select-show>
				</div>

				<!-- Branch Tabs Section -->
				<el-tabs
					v-if="node.branch.length > 0"
					type="border-card"
					:model-value="getNodeActiveTab(node)"
					@update:model-value="(val) => activeTabsMap.set(node.id, val)"
					class="mt-4"
				>
					<el-tab-pane v-for="(node1, index1) in node.branch" :label="getBranchLabel(node1, index1)" :name="String(index1)" :key="index1">
						<div class="p-2">
							<flow-node-format :node-user="nodeUser" :disableSelect="disableSelect" :row="node1.children"></flow-node-format>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<style lang="scss" scoped>
/* Only keep styles that can't be achieved with Tailwind */
:deep(.el-tabs__header) {
	@apply mb-3;
}
</style>
