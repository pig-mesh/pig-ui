<template>
	<div class="layout-padding">
		<splitpanes>
			<pane class="ml10">
				<splitpanes>
					<pane size="30">
						<div class="layout-padding-auto layout-padding-view">
							<el-row>
								<div class="mb8" style="width: 100%">
									<el-button @click="dicDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">
										{{ $t('common.addBtn') }}
									</el-button>
									<el-button plain @click="handleRefreshCache()" class="ml10" icon="refresh-left" type="primary">
										{{ $t('common.refreshCacheBtn') }}
									</el-button>
								</div>
							</el-row>
							<el-scrollbar>
								<query-tree ref="dictTreeRef" :query="state.queryList" @node-click="handleNodeClick" placeholder="请输入字典项或名称">
									<template #default="{ data }">
										<span class="custom-tree-node">
											<span class="label">{{ data.description }}</span>
											<span class="code">{{ data.dictType }}</span>
											<span class="do">
												<el-button-group>
													<el-button icon="el-icon-edit" size="small" @click.stop="dicDialogRef.openDialog(data.id)"></el-button>
													<el-tooltip :content="$t('sysdict.deleteDisabledTip')" :disabled="data.systemFlag === '0'" placement="top">
														<span style="margin-left: 12px">
															<el-button
																:disabled="data.systemFlag !== '0'"
																icon="el-icon-delete"
																size="small"
																@click.stop="handleDelete([data.id])"
															></el-button>
														</span>
													</el-tooltip>
												</el-button-group>
											</span>
										</span>
									</template>
								</query-tree>
							</el-scrollbar>
							<el-footer style="height: 40px; line-height: 40px">
								<el-button type="primary" size="small" icon="Download" style="width: 100%" @click="exportExcel">{{
									$t('common.exportBtn')
								}}</el-button>
							</el-footer>
						</div>
					</pane>
					<pane class="ml8">
						<DicDialog @refresh="handleRefreshTree" ref="dicDialogRef" />
						<dict-item-dialog ref="dictItemDialogRef"></dict-item-dialog>
					</pane>
				</splitpanes>
			</pane>
		</splitpanes>
	</div>
</template>

<script lang="ts" name="systemDic" setup>
import { delObj, fetchList, refreshCache } from '/@/api/admin/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { downBlobFile } from '/@/utils/other';

// 引入组件
const DicDialog = defineAsyncComponent(() => import('./form.vue'));
const DictItemDialog = defineAsyncComponent(() => import('./dictItem/index.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const { t } = useI18n();
// 定义变量内容
const dicDialogRef = ref();
const dictTreeRef = ref();
const dictItemDialogRef = ref();
const state = reactive({
	queryForm: {},
	queryList: (name?: string) => {
		return fetchList({
			name: name,
		});
	},
});

// 导出EXCEL
const exportExcel = () => {
	downBlobFile('/admin/dict/export', state.queryForm, 'dict.xlsx');
};

//刷新缓存
const handleRefreshCache = () => {
	refreshCache().then(() => {
		useMessage().success('同步成功');
	});
};

// 点击树
const handleNodeClick = (data: any) => {
	dictItemDialogRef.value.open(data);
};

// 刷新树
const handleRefreshTree = async (data: any) => {
	await dictTreeRef.value.getdeptTree();
	// 选择当前编辑、新增的节点
	handleNodeClick(data);
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		useMessage().success(t('common.delSuccessText'));
		dictTreeRef.value.getdeptTree();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>

<style scoped>
.menu:deep(.el-tree-node__label) {
	display: flex;
	flex: 1;
	height: 100%;
}
.custom-tree-node {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 24px;
	height: 100%;
}
.custom-tree-node .code {
	font-size: 12px;
	color: #999;
}
.custom-tree-node .do {
	display: none;
}
.custom-tree-node:hover .code {
	display: none;
}
.custom-tree-node:hover .do {
	display: inline-block;
}
</style>
