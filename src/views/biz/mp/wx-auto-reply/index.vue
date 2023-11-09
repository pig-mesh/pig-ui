<template>
	<div class="layout-padding">
		<splitpanes>
			<pane size="20">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<query-tree class="mt10" :query="deptData.queryList" @node-click="handleNodeClick" placeholder="请输入微信公众号名称" />
					</el-scrollbar>
				</div>
			</pane>
			<pane size="80">
				<div class="layout-padding-auto layout-padding-view">
					<el-tabs v-model="type" @tab-click="handleClick">
						<el-tab-pane name="1" label="1">
							<template #label>关注时回复</template>
							<el-row>
								<div class="mb8" style="width: 100%">
									<el-button class="ml10" icon="folder-add" type="primary" @click="handleAdd">
										{{ $t('common.addBtn') }}
									</el-button>
								</div>
							</el-row>
							<el-table v-loading="state.loading" :data="state.dataList" style="width: 100%" max-height="600px" @sort-change="sortChangeHandle">
								<el-table-column label="序号" type="index" width="60" />
								<el-table-column label="回复消息类型" prop="repType" show-overflow-tooltip>
									<template #default="scope">
										<dict-tag :options="dicDataRepType" :value="scope.row.repType"></dict-tag>
									</template>
								</el-table-column>
								<el-table-column label="操作" prop="action" show-overflow-tooltip>
									<template #default="scope">
										<el-button link icon="el-icon-edit" @click="handleEdit(scope.row)">编辑 </el-button>
										<el-button link icon="el-icon-delete" @click="handleDel(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="2" label="2">
							<template #label>消息回复</template>
							<el-row>
								<div class="mb8" style="width: 100%">
									<el-button class="ml10" icon="folder-add" type="primary" @click="handleAdd">
										{{ $t('common.addBtn') }}
									</el-button>
								</div>
							</el-row>
							<el-table v-loading="state.loading" :data="state.dataList" style="width: 100%" max-height="600px" @sort-change="sortChangeHandle">
								<el-table-column label="序号" type="index" width="60" />
								<el-table-column label="请求消息类型" prop="reqType" show-overflow-tooltip>
									<template #default="scope">
										<dict-tag :options="dicDataReqType" :value="scope.row.reqType"></dict-tag>
									</template>
								</el-table-column>
								<el-table-column label="回复消息类型" prop="repType" show-overflow-tooltip>
									<template #default="scope">
										<dict-tag :options="dicDataRepType" :value="scope.row.repType"></dict-tag>
									</template>
								</el-table-column>
								<el-table-column label="操作" prop="action" show-overflow-tooltip>
									<template #default="scope">
										<el-button icon="el-icon-edit" link @click="handleEdit(scope.row)">编辑 </el-button>
										<el-button icon="el-icon-delete" link @click="handleDel(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="3" label="3">
							<template #label>关键词回复</template>
							<el-row>
								<div class="mb8" style="width: 100%">
									<el-button class="ml10" icon="folder-add" type="primary" @click="handleAdd">
										{{ $t('common.addBtn') }}
									</el-button>
								</div>
							</el-row>
							<el-table
								v-loading="state.loading"
								:data="state.dataList"
								style="width: 100%"
								max-height="600px"
								@sort-change="sortChangeHandle"
								border
								:cell-style="tableStyle.cellStyle"
								:header-cell-style="tableStyle.headerCellStyle"
							>
								<el-table-column label="序号" type="index" width="60" />
								<el-table-column label="关键词" prop="reqKey" show-overflow-tooltip> </el-table-column>
								<el-table-column label="匹配类型" prop="repMate" show-overflow-tooltip>
									<template #default="scope">
										<dict-tag :options="dicRepMate" :value="scope.row.repMate"></dict-tag>
									</template>
								</el-table-column>
								<el-table-column label="匹配类型" prop="repMate" show-overflow-tooltip>
									<template #default="scope">
										<dict-tag :options="dicDataRepType" :value="scope.row.repType"></dict-tag>
									</template>
								</el-table-column>
								<el-table-column label="操作" prop="action" show-overflow-tooltip>
									<template #default="scope">
										<el-button icon="el-icon-edit" link @click="handleEdit(scope.row)">编辑 </el-button>
										<el-button icon="el-icon-delete" link @click="handleDel(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
					</el-tabs>
				</div>
			</pane>
		</splitpanes>
		<el-dialog :title="handleType === 'add' ? '新增回复消息' : '修改回复消息'" v-model="dialog1Visible" width="50%">
			<el-form label-width="100px">
				<el-form-item v-if="type === '2'" label="请求消息类型">
					<el-select v-model="objData.reqType" placeholder="请选择">
						<template v-for="item in dicDataReqType">
							<el-option v-if="item.value !== 'event'" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
							</el-option>
						</template>
					</el-select>
				</el-form-item>
				<el-form-item v-if="type === '3'" label="匹配类型">
					<el-select v-model="objData.repMate" placeholder="请选择" style="width: 100px">
						<el-option v-for="item in dicRepMate" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="type === '3'" label="关键词">
					<el-input v-model="objData.reqKey" placeholder="请输入内容" clearable></el-input>
				</el-form-item>
				<el-form-item label="回复消息">
					<WxReply v-if="hackResetWxReplySelect" :obj-data="objData"></WxReply>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialog1Visible = false">取 消</el-button>
				<el-button type="primary" @click="handleSubmit">确 定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="wx-auto-reply">
import { fetchAccountList } from '/@/api/mp/wx-account';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getPage, delObj, addObj, putObj } from '/@/api/mp/wx-auto-reply';

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const WxReply = defineAsyncComponent(() => import('/@/components/Wechat/wx-reply/index.vue'));

// 点击树
const handleNodeClick = (node: any) => {
	accountId.value = node.appid;
	state.queryForm.appId = accountId.value;
	getDataList();
};

const dicDataRepType = ref([
	{
		label: '文本',
		value: 'text',
	},
	{
		label: '图片',
		value: 'image',
	},
	{
		label: '语音',
		value: 'voice',
	},
	{
		label: '视频',
		value: 'video',
	},
	{
		label: '图文',
		value: 'news',
	},
]);

const dicDataReqType = ref([
	{
		value: 'text',
		label: '文本',
	},
	{
		value: 'image',
		label: '图片',
	},
	{
		value: 'voice',
		label: '语音',
	},
	{
		value: 'video',
		label: '视频',
	},
	{
		value: 'shortvideo',
		label: '小视频',
	},
	{
		value: 'location',
		label: '地理位置',
	},
	{
		value: 'link',
		label: '链接消息',
	},
	{
		value: 'event',
		label: '事件推送',
	},
]);

const dicRepMate = ref([
	{
		value: '1',
		label: '全匹配',
	},
	{
		value: '2',
		label: '半匹配',
	},
]);

const deptData = reactive({
	queryList: (name: string) => {
		return fetchAccountList({
			name: name,
		});
	},
});

const accountId = ref();

const type = ref('1');

const handleClick = (e: any) => {
	type.value = e.paneName;
	state.queryForm.type = type.value;
	state.queryForm.appId = accountId.value;
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: '1',
		appId: '',
	},
	pageList: getPage,
	createdIsNeed: false,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, tableStyle } = useTable(state);

const dialog1Visible = ref(false);

const handleType = ref('add');

const hackResetWxReplySelect = ref(true);

const objData = ref() as any;

const handleEdit = (row: any) => {
	hackResetWxReplySelect.value = false;
	nextTick(() => {
		hackResetWxReplySelect.value = true;
	});
	handleType.value = 'edit';
	dialog1Visible.value = true;

	if (row.content && typeof row.content === 'string') {
		row.content = JSON.parse(row.content);
	}
	objData.value = Object.assign({}, row);
};

const handleDel = (row) => {
	useMessageBox()
		.confirm('是否确认删除此数据?')
		.then(() => {
			delObj(row.id).then(() => {
				useMessage().success('删除成功');
				getDataList();
			});
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

const handleSubmit = () => {
	if (objData.repType === 'news') {
		objData.content = JSON.stringify(objData.content);
	}
	if (handleType.value === 'add') {
		addObj(
			Object.assign(
				{
					type: type.value,
					appId: accountId.value,
				},
				objData.value
			)
		)
			.then(() => {
				useMessage().success('添加成功');
				getDataList();
				dialog1Visible.value = false;
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	}
	if (handleType.value === 'edit') {
		putObj(objData.value)
			.then(() => {
				useMessage().success('修改成功');
				getDataList();
				dialog1Visible.value = false;
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	}
};

const handleAdd = () => {
	hackResetWxReplySelect.value = false; //销毁组件
	nextTick(() => {
		hackResetWxReplySelect.value = true; //重建组件
	});
	handleType.value = 'add';
	dialog1Visible.value = true;
	objData.value = {
		repType: 'text',
		appId: accountId.value,
	};
};
</script>

<style scoped></style>
