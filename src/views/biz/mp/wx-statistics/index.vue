<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<splitpanes>
				<pane size="20">
					<el-date-picker v-model="beginTime" placeholder="选择开始时间" @change="check" style="width: 50%"></el-date-picker>
					<el-date-picker v-model="endTime" style="width: 50%" placeholder="选择结束时间" @change="check"></el-date-picker>
					<div class="layout-padding-auto layout-padding-view">
						<el-scrollbar>
							<query-tree class="mt10" :query="deptData.queryList" @node-click="handleNodeClick" placeholder="请输入微信公众号名称" />
						</el-scrollbar>
					</div>
				</pane>
				<pane size="80" class="ml10">
					<splitpanes horizontal>
						<pane>
							<splitpanes>
								<pane>
									<div class="home-card-item">
										<div style="height: 100%" ref="userCumulateRef"></div>
									</div>
								</pane>
								<pane>
									<div class="home-card-item">
										<div style="height: 100%" ref="userShardRef"></div>
									</div>
								</pane>
							</splitpanes>
						</pane>
						<pane>
							<splitpanes>
								<pane>
									<div class="home-card-item">
										<div style="height: 100%" ref="upstreamMsgDistMonthRef"></div>
									</div>
								</pane>
								<pane>
									<div class="home-card-item">
										<div style="height: 100%" ref="interfaceSummaryRef"></div>
									</div>
								</pane>
							</splitpanes>
						</pane>
					</splitpanes>
				</pane>
			</splitpanes>
		</div>
	</div>
</template>

<script setup lang="ts" name="wx-statistics">
import { useMessage } from '/@/hooks/message';
import { fetchAccountList, fetchStatistics } from '/@/api/mp/wx-account';
import { markRaw } from 'vue';
import * as echarts from 'echarts';

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const beginTime = ref(new Date().getTime() - 3600 * 1000 * 24 * 7);
const endTime = ref(new Date().getTime() - 3600 * 1000 * 24);

const check = () => {
	const start = new Date(beginTime.value);
	const end = new Date(endTime.value);
	if (end.getTime() >= new Date().getTime()) {
		useMessage().error('统计结束日小于当前日期，请重新选择');
		return false;
	}

	if (end.getTime() - start.getTime() >= 3600 * 1000 * 24 * 7) {
		useMessage().error('时间间隔7天以内，请重新选择');
		return false;
	}
};

const accountId = ref();

// 点击树
const handleNodeClick = (node: any) => {
	accountId.value = node.appid;
	initdata();
};

const deptData = reactive({
	queryList: (name: string) => {
		return fetchAccountList({
			name: name,
		});
	},
});

const userCumulateRef = ref();

// 初始化折线图
const userCumulate = () => {
	const userCumulate = markRaw(echarts.init(userCumulateRef.value));
	const option = {
		title: {
			text: '用户分析数据',
		},
		xAxis: {
			type: 'category',
			data: LintData.value[0],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				type: 'line',
				data: LintData.value[1],
			},
		],
	};
	userCumulate.setOption(option);
};

const userShardRef = ref();

// 初始化折线图
const userShard = () => {
	const userShard = markRaw(echarts.init(userShardRef.value));
	const option = {
		title: {
			text: '接口分析数据',
		},
		xAxis: {
			type: 'category',
			data: LintData.value[2],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				type: 'line',
				data: LintData.value[3],
			},
		],
	};
	userShard.setOption(option);
};

const upstreamMsgDistMonthRef = ref();

// 初始化折线图
const upstreamMsgDistMonth = () => {
	const upstreamMsgDistMonth = markRaw(echarts.init(upstreamMsgDistMonthRef.value));
	const option = {
		title: {
			text: '消息分析数据',
		},
		xAxis: {
			type: 'category',
			data: LintData.value[4],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				type: 'line',
				data: LintData.value[5],
			},
		],
	};
	upstreamMsgDistMonth.setOption(option);
};

const interfaceSummaryRef = ref();

// 初始化折线图
const interfaceSummary = () => {
	const interfaceSummary = markRaw(echarts.init(interfaceSummaryRef.value));
	const option = {
		title: {
			text: '图文分享数据',
		},
		xAxis: {
			type: 'category',
			data: LintData.value[0],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				type: 'line',
				data: LintData.value[1],
			},
		],
	};
	interfaceSummary.setOption(option);
};

const LintData = ref([[], [], [], [], [], [], [], []]);

const initdata = () => {
	fetchStatistics({
		appId: accountId.value,
		interval: new Date(beginTime.value).getTime() + '-' + new Date(endTime.value).getTime(),
	})
		.then((res) => {
			LintData.value = res.data;
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			userCumulate();
			userShard();
			upstreamMsgDistMonth();
			interfaceSummary();
		});
};
</script>

<style scoped>
.home-card-item {
	width: 100%;
	height: 400px;
	border-radius: 4px;
	transition: all ease 0.3s;
	padding: 20px;
	overflow: hidden;
	background: var(--el-color-white);
	color: var(--el-text-color-primary);
	border: 1px solid var(--next-border-color-light);
}
</style>
