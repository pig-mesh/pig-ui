<script setup lang="ts">
import selectShow from '/@/views/flow/workflow/components/dialog/selectAndShow.vue';

let props = defineProps({
	nodeUser: {
		type: Object,
		dafault: () => {},
	},
	row: {
		type: Array,
		dafault: () => [],
	},
	disableSelect: {
		type: Boolean,
		default: false,
	},
});
const { proxy } = getCurrentInstance();

import { Check, Plus, Refresh } from '@element-plus/icons-vue';
</script>

<template>
	<div style="padding: 10px">
		<el-timeline :reverse="false">
			<el-timeline-item
				v-for="(node, index) in row"
				:key="index"
				size="large"
				:color="node.status != 2 ? (node.status == 1 ? 'pink' : 'green') : 'blue'"
				:icon="node.status == 2 ? Check : node.status == 1 ? Plus : Refresh"
			>
				<template v-if="node.selectUser && (!nodeUser[node.id] || nodeUser[node.id]?.length == 0)">
					<p style="color: red">
						{{ node.name }}
						<template v-if="node.placeholder && node.placeholder.length > 0">[{{ node.placeholder }}]</template>
					</p>
				</template>
				<template v-else>
					<p>
						{{ node.name }}
						<template v-if="node.placeholder && node.placeholder.length > 0">[{{ node.placeholder }}]</template>
					</p>
				</template>
				<!--					渲染用户头像列表-->
				<div v-if="node.userVoList && node.userVoList.length > 0" style="display: flex; flex-direction: row; flex-wrap: wrap">
					<div
						class="box-card"
						v-for="(item1, index1) in node.userVoList"
						:key="index1"
						style="margin-bottom: 10px; border: 0px solid red; width: 40px; text-align: center"
					>
						<div class="node-show">
							<div style="overflow: hidden">
								<div class="d1">
									<div>
										<upload-img v-model:image-url="item1.avatar" width="30px" height="30px"></upload-img>
									</div>
									<div style="font-size: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center">
										{{ item1.name }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!--					渲染审批评论-->
				<template v-for="(item1, index1) in node.userVoList" :key="index1">
					<template v-if="item1.approveDesc?.length > 0">
						<div style="display: flex; flex-direction: row">
							<div style="width: 40px; text-align: center">
								<upload-img v-model:image-url="item1.avatar" disabled width="30px" height="30px"></upload-img>
							</div>
							<div style="height: 40px; line-height: 40px; font-size: 10px">
								{{ item1.name }}
							</div>
							<div style="height: 40px; line-height: 40px; font-size: 10px">(添加了评论)</div>
						</div>
						<div class="box-card" style="margin-bottom: 10px; padding: 5px; background-color: var(--el-fill-color-light)">
							{{ item1.approveDesc }}
						</div>
					</template>
				</template>

				<!--					选择用户-->
				<template v-if="node.selectUser">
					<select-show :disabled="disableSelect" v-model:orgList="nodeUser[node.id]" type="user" :multiple="node.multiple"></select-show>
				</template>

				<el-tabs v-if="node.branch.length > 0" type="border-card">
					<el-tab-pane v-for="(node1, index1) in node.branch" :label="'分支' + (index1 + 1)" :name="index1 + ''" :key="index1">
						<template v-if="node1.placeholder && node1.placeholder.length > 0">[{{ node1.placeholder }}]</template>
						<div style="padding: 0px 5px">
							<flow-node-format :node-user="nodeUser" :disableSelect="disableSelect" :row="node1.children"></flow-node-format>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>
