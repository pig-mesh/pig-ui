<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('sysdict.dictType')" prop="dictType">
						<el-input :placeholder="$t('sysdict.inputDictTypeTip')" style="max-width: 180px" v-model="state.queryForm.dictType" />
					</el-form-item>
					<el-form-item :label="$t('sysdict.systemFlag')" prop="systemFlag">
						<el-select clearable v-model="state.queryForm.systemFlag">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="ml2">
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="dicDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'sys_dict_del'">
						{{ $t('common.delBtn') }}
					</el-button>
					<el-button @click="handleRefreshCache()" class="ml10" icon="refresh-left" type="primary">
						{{ $t('common.refreshCacheBtn') }}
					</el-button>
					<el-button @click="exportExcel" class="ml10" icon="Download" type="primary">
						{{ $t('common.exportBtn') }}
					</el-button>
					<right-toolbar
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>
			<el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%" v-loading="state.loading">
				<el-table-column :selectable="handleSelectable" align="center" type="selection" width="50"></el-table-column>
				<el-table-column :label="$t('sysdict.index')" type="index" width="80" />
				<el-table-column :label="$t('sysdict.dictType')" show-overflow-tooltip>
					<template #default="scope">
						<el-button @click="dictItemDialogRef.open(scope.row)" text type="primary">{{ scope.row.dictType }} </el-button>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysdict.description')" prop="description" show-overflow-tooltip sortable></el-table-column>
				<el-table-column :label="$t('sysdict.systemFlag')" prop="systemFlag" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="dict_type" :value="scope.row.systemFlag"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysdict.remarks')" prop="remarks" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysdict.createTime')" prop="createTime" show-overflow-tooltip sortable></el-table-column>
				<el-table-column :label="$t('common.action')" width="200">
					<template #default="scope">
						<el-button @click="dictItemDialogRef.open(scope.row)" text type="primary">{{ $t('sysdict.dictItem') }} </el-button>
						<el-button @click="dicDialogRef.openDialog(scope.row.id)" text type="primary">{{ $t('common.editBtn') }} </el-button>
						<el-tooltip :content="$t('sysdict.deleteDisabledTip')" :disabled="scope.row.systemFlag === '0'" placement="top">
							<span style="margin-left: 12px">
								<el-button :disabled="scope.row.systemFlag !== '0'" @click="handleDelete([scope.row.id])" text type="primary">
									{{ $t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<DicDialog @refresh="getDataList()" ref="dicDialogRef" />
		<dict-item-dialog ref="dictItemDialogRef"></dict-item-dialog>
	</div>
</template>

<script lang="ts" name="systemDic" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, refreshCache } from '/@/api/admin/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { downBlobFile } from '/@/utils/other';

const { dict_type } = useDict('dict_type');
// 引入组件
const DicDialog = defineAsyncComponent(() => import('./form.vue'));
const DictItemDialog = defineAsyncComponent(() => import('./dictItem/index.vue'));
const { t } = useI18n();
// 定义变量内容
const dicDialogRef = ref();
const dictItemDialogRef = ref();
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
const { getDataList, currentChangeHandle, sizeChangeHandle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
const exportExcel = () => {
	downBlobFile('/admin/dict/export', state.queryForm, 'dict.xlsx');
};

// 是否可以多选
const handleSelectable = (row: any) => {
	// 系统类不可多选删除
	return row.systemFlag !== '1';
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	objs.forEach((val: any) => {
		selectObjs.value.push(val.id);
	});
	multiple.value = !objs.length;
};

//刷新缓存
const handleRefreshCache = () => {
	refreshCache().then(() => {
		useMessage().success('同步成功');
	});
};

// 删除操作
const handleDelete = (ids: string[]) => {
	useMessageBox()
		.confirm(t('common.delConfirmText'))
		.then(() => {
			delObj(ids)
				.then(() => {
					getDataList();
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};
</script>
