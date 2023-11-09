<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item :label="$t('wxFansMsg.appName')" prop="wxAccountAppid">
						<el-select v-model="state.queryForm.wxAccountAppid" :placeholder="$t('wxFansMsg.appName')" clearable class="w100">
							<el-option v-for="item in accountList" :key="item.appid" :label="item.name" :value="item.appid" />
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('wxFansMsg.nickName')" prop="nickName">
						<el-input v-model="state.queryForm.nickName" :placeholder="t('wxFansMsg.inputNickNameTip')" style="max-width: 180px" />
					</el-form-item>
					<el-form-item :label="$t('wxFansMsg.repType')" prop="repType">
						<el-select v-model="state.queryForm.repType" :placeholder="$t('wxFansMsg.repType')" clearable class="w100">
							<el-option v-for="item in repType" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button formDialogRef icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button v-auth="'mp_wxFansMsg_export'" class="ml10" formDialogRef icon="Download" type="primary" @click="exportExcel">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button
						v-auth="'mp_wxmsg_del'"
						:disabled="multiple"
						class="ml10"
						formDialogRef
						icon="Delete"
						type="primary"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				style="width: 100%"
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column :label="t('wxFansMsg.index')" type="index" width="60" />
				<el-table-column :label="t('wxFansMsg.appName')" prop="appName" show-overflow-tooltip />
				<el-table-column :label="t('wxFansMsg.repType')" prop="repType" show-overflow-tooltip />
				<el-table-column :label="t('wxFansMsg.nickName')" prop="nickName" show-overflow-tooltip />
				<el-table-column :label="t('wxFansMsg.openId')" prop="openId" show-overflow-tooltip />
				<el-table-column :label="t('wxFansMsg.repContent')" prop="repContent" show-overflow-tooltip>
					<template #default="scope">
						<div v-if="scope.row.repType === 'event' && scope.row.repEvent === 'subscribe'"><el-tag type="success">关注</el-tag></div>
						<div v-if="scope.row.repType === 'event' && scope.row.repEvent === 'unsubscribe'">
							<el-tag type="danger">取消关注</el-tag>
						</div>
						<div v-if="scope.row.repType === 'event' && scope.row.repEvent === 'CLICK'"><el-tag>点击菜单</el-tag>：【{{ scope.row.repName }}】</div>
						<div v-if="scope.row.repType === 'event' && scope.row.repEvent === 'VIEW'"><el-tag>点击菜单链接</el-tag>：【{{ scope.row.repUrl }}】</div>
						<div v-if="scope.row.repType === 'event' && scope.row.repEvent === 'scancode_waitmsg'">
							<el-tag>扫码结果：</el-tag>：【{{ scope.row.repContent }}】
						</div>
						<div v-if="scope.row.repType === 'text'">{{ scope.row.repContent }}</div>
						<div v-if="scope.row.repType === 'image'">
							<a target="_blank" :href="scope.row.repUrl"><img :src="scope.row.repUrl" style="width: 100px" /></a>
						</div>
						<div v-if="['video', 'voice', 'link', 'shortvideo'].includes(scope.row.repType)">
							<el-tag>链接</el-tag>：<a :href="scope.row.repUrl" target="_blank">{{ scope.row.repName }}</a>
						</div>
					</template>
				</el-table-column>
				<el-table-column :label="t('wxFansMsg.readFlag')" prop="readFlag" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="readFlag" :value="scope.row.readFlag"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('wxFansMsg.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="ChatSquare" link type="primary" @click="wxMsgDo(scope.row, scope.index)">消息</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>
		<wx-msg ref="WxmsgRef"></wx-msg>
	</div>
</template>

<script lang="ts" name="systemWxMsg" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList } from '/@/api/mp/wx-fans-msg';
import { useMessage } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { fetchAccountList } from '/@/api/mp/wx-account';

const WxMsg = defineAsyncComponent(() => import('/@/components/Wechat/wx-msg/index.vue'));

const { t } = useI18n();
// 定义查询字典

const { repType } = useDict('repType');

const readFlag = ref([
	{
		value: '1',
		label: '是',
	},
	{
		value: '0',
		label: '否',
	},
]);

const WxmsgRef = ref();

// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

const accountList = ref([]);

const getAccountList = () => {
	fetchAccountList()
		.then((res) => {
			accountList.value = res.data;
			if (accountList.value.length > 0) {
				state.queryForm.wxAccountAppid = accountList.value[0].appid;
				getDataList();
			}
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

watch(
	() => state.queryForm.wxAccountAppid,
	() => {
		getDataList();
	}
);

onMounted(() => {
	getAccountList();
});

// 导出excel
const exportExcel = () => {
	downBlobFile('/act/wxFansMsg/export', state.queryForm, 'wxFansMsg.xlsx');
};

const wxMsgDo = (row) => {
	WxmsgRef.value.openDialog({
		wxUserId: row.wxUserId,
		appId: row.appId,
	});
};
</script>
