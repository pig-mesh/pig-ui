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
import * as echarts from 'echarts';

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const DAY_MS = 3600 * 1000 * 24;
const beginTime = ref(Date.now() - DAY_MS * 7);
const endTime = ref(Date.now() - DAY_MS);

const check = () => {
	const endMs = new Date(endTime.value).getTime();
	if (endMs >= Date.now()) {
		useMessage().error('统计结束日小于当前日期，请重新选择');
		return false;
	}

	if (endMs - new Date(beginTime.value).getTime() >= DAY_MS * 7) {
		useMessage().error('时间间隔7天以内，请重新选择');
		return false;
	}
};

const accountId = ref();

const handleNodeClick = (node: any) => {
	accountId.value = node.appid;
	initdata();
};

const deptData = reactive({
	queryList: (name?: string) => {
		return fetchAccountList({ name });
	},
});

const userCumulateRef = ref();
const userShardRef = ref();
const upstreamMsgDistMonthRef = ref();
const interfaceSummaryRef = ref();

const initLineChart = (elRef: any, title: string, xData: any[], yData: any[]) => {
	const chart = markRaw(echarts.init(elRef));
	chart.setOption({
		title: { text: title },
		xAxis: { type: 'category', data: xData },
		yAxis: { type: 'value' },
		series: [{ type: 'line', data: yData }],
	});
};

const lineData = ref([[], [], [], [], [], [], [], []]);

const initdata = () => {
	fetchStatistics({
		appId: accountId.value,
		interval: new Date(beginTime.value).getTime() + '-' + new Date(endTime.value).getTime(),
	})
		.then((res) => {
			lineData.value = res.data;
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			initLineChart(userCumulateRef.value, '用户分析数据', lineData.value[0], lineData.value[1]);
			initLineChart(userShardRef.value, '接口分析数据', lineData.value[2], lineData.value[3]);
			initLineChart(upstreamMsgDistMonthRef.value, '消息分析数据', lineData.value[4], lineData.value[5]);
			initLineChart(interfaceSummaryRef.value, '图文分享数据', lineData.value[0], lineData.value[1]);
		});
};

onMounted(async () => {
	const { data } = await deptData.queryList();
	if (data?.length > 0) {
		handleNodeClick(data[0]);
	}
});
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
