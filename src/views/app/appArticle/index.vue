<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="标题" prop="title">
						<el-input placeholder="请输入标题" v-model="state.queryForm.title" />
					</el-form-item>
					<el-form-item label="作者" prop="author">
						<el-input placeholder="请输入作者" v-model="state.queryForm.author" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button v-auth="'app_appArticle_add'" icon="folder-add" type="primary" class="ml10" @click="addOrUpdate()"> 新 增 </el-button>

					<el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'app_appArticle_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'app_appArticle_export'"
						@exportExcel="exportExcel"
						class="ml10 mr20"
						style="float: right"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" label="#" width="40" />
				<el-table-column prop="cname" label="分类" show-overflow-tooltip />
				<el-table-column prop="title" label="标题" show-overflow-tooltip />
				<el-table-column prop="author" label="作者" show-overflow-tooltip />
				<el-table-column prop="visit" label="浏览" show-overflow-tooltip />
				<el-table-column prop="sort" label="排序" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'app_appArticle_edit'" @click="addOrUpdate(scope.row.id)">编辑</el-button>
						<el-button icon="delete" text type="primary" v-auth="'app_appArticle_del'" @click="handleDelete([scope.row.id])">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemAppArticle">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/app/appArticle';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
// 定义查询字典

// 定义变量内容
const router = useRouter();
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value?.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/app/appArticle/export', state.queryForm, 'appArticle.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm('此操作将永久删除');
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 跳转发布页
const addOrUpdate = (id?: string) => {
	const tagsViewName = id ? `${t('article.edit')}:${id}` : t('article.add');
	router.push({
		path: '/app/appArticle/form',
		query: { id: id, tagsViewName: tagsViewName },
	});
};
</script>
