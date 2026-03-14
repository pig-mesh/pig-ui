<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
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
								<query-tree ref="dictTreeRef" :query="state.queryList" @node-click="handleNodeClick" :placeholder="t('sysdict.searchPlaceholder')">
									<template #default="{ data }">
										<span class="custom-tree-node">
											<span class="label">{{ data.description }}</span>
											<span class="code">{{ data.dictType }}</span>
											<span class="do">
												<el-button-group>
													<el-button icon="edit" size="small" @click.stop="dicDialogRef.openDialog(data.id)"></el-button>
													<el-tooltip :content="t('sysdict.deleteDisabledTip')" :disabled="data.systemFlag === '0'" placement="top">
														<span style="margin-left: 12px">
															<el-button
																:disabled="data.systemFlag !== '0'"
																icon="delete"
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
					<pane>
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

/**
 * 异步组件引入
 */
const DicDialog = defineAsyncComponent(() => import('./form.vue'));
const DictItemDialog = defineAsyncComponent(() => import('./dictItem/index.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 字典对话框引用
 */
const dicDialogRef = ref();

/**
 * 字典树引用
 */
const dictTreeRef = ref();

/**
 * 字典项对话框引用
 */
const dictItemDialogRef = ref();

/**
 * 组件状态
 */
const state = reactive({
	/**
	 * 查询表单参数
	 */
	queryForm: {},
	/**
	 * 查询列表方法
	 * @param name - 搜索关键词（字典项或名称）
	 * @returns 字典列表数据
	 */
	queryList: (name?: string) => {
		return fetchList({ name });
	},
});

/**
 * 导出Excel文件
 */
const exportExcel = (): void => {
	downBlobFile('/admin/dict/export', state.queryForm, 'dict.xlsx');
};

/**
 * 刷新字典缓存
 */
const handleRefreshCache = async (): Promise<void> => {
	try {
		await refreshCache();
		useMessage().success(t('sysdict.refreshCacheSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 点击树节点，打开字典项列表
 * @param data - 树节点数据
 */
const handleNodeClick = (data: any): void => {
	dictItemDialogRef.value.open(data);
};

/**
 * 刷新树并选中指定节点
 * @param data - 需要选中的节点数据
 */
const handleRefreshTree = async (data: any): Promise<void> => {
	await dictTreeRef.value.getdeptTree();
	// 选择当前编辑、新增的节点
	handleNodeClick(data);
};

/**
 * 删除字典
 * @param ids - 字典ID数组
 */
const handleDelete = async (ids: string[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		useMessage().success(t('common.delSuccessText'));
		await dictTreeRef.value.getdeptTree();
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
