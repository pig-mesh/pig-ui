<template>
	<el-dialog title="选择图文" v-model="visible" :close-on-click-modal="false" draggable width="80%">
		<div v-if="objData.type === 'image'">
			<div class="waterfall" v-loading="state.loading">
				<div class="waterfall-item" v-for="item in state.dataList" :key="item.mediaId">
					<img class="material-img" :src="item.url" />
					<p class="item-name">{{ item.name }}</p>
					<el-row class="ope-row">
						<el-button type="success" @click="selectMaterial(item)"
							>选择
							<el-icon class="el-icon--right"></el-icon>
						</el-button>
					</el-row>
				</div>
			</div>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>
		<div v-else-if="objData.type === 'voice'">
			<!-- 列表 -->
			<el-table v-loading="state.loading" :data="state.dataList">
				<el-table-column label="编号" align="center" prop="mediaId" />
				<el-table-column label="文件名" align="center" prop="name" />
				<el-table-column label="语音" align="center" prop="url"> </el-table-column>
				<el-table-column label="上传时间" align="center" prop="createTime" width="180">
					<template v-slot="scope">
						<span>{{ parseTime(scope.row.createTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
					<template v-slot="scope">
						<el-button icon="el-icon-circle-plus" @click="selectMaterial(scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>
		<div v-else-if="objData.type === 'video'">
			<!-- 列表 -->
			<el-table v-loading="state.loading" :data="state.dataList">
				<el-table-column label="编号" align="center" prop="mediaId" />
				<el-table-column label="文件名" align="center" prop="name" />
				<el-table-column label="标题" align="center" prop="title" />
				<el-table-column label="介绍" align="center" prop="introduction" />
				<el-table-column label="视频" align="center" prop="url"> </el-table-column>
				<el-table-column label="上传时间" align="center" prop="createTime" width="180">
					<template v-slot="scope">
						<span>{{ parseTime(scope.row.createTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
					<template v-slot="scope">
						<el-button @click="selectMaterial(scope.row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>
		<div v-else-if="objData.type === 'news'">
			<div class="waterfall" v-loading="state.loading">
				<template v-for="item in state.dataList">
					<div v-if="item.content && item.content.newsItem" class="waterfall-item" :key="item.id">
						<wx-news :obj-data="item.content.newsItem"></wx-news>
						<el-row class="ope-row">
							<el-button type="success" @click="selectMaterial(item)"> 选择<el-icon class="el-icon--right" /> </el-button>
						</el-row>
					</div>
				</template>
			</div>
			<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="wx-material-select">
import { defineEmits } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getPage } from '/@/api/mp/wx-material';
const WxNews = defineAsyncComponent(() => import('../wx-news/index.vue'));

const emit = defineEmits(['selectMaterial']);

const objData = reactive({
	repType: '',
	accountId: '',
	type: '',
});

const visible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: '',
		appId: '',
	},
	pageList: getPage,
	createdIsNeed: false,
	props: {
		item: 'items',
		totalCount: 'totalCount',
	},
});

const { getDataList, currentChangeHandle, sizeChangeHandle } = useTable(state);

const selectMaterial = (item: any) => {
	visible.value = false;
	emit('selectMaterial', item, objData.accountId);
};

const openDialog = (data: any) => {
	state.queryForm.type = data.type;
	state.queryForm.appId = data.accountId;
	objData.type = data.type;
	objData.accountId = data.accountId;
	visible.value = true;
	getDataList();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
/*瀑布流样式*/
.waterfall {
	width: 100%;
	column-gap: 10px;
	column-count: 5;
	margin: 0 auto;
}
.waterfall-item {
	padding: 10px;
	margin-bottom: 10px;
	break-inside: avoid;
	border: 1px solid #eaeaea;
}
.material-img {
	width: 100%;
}
p {
	line-height: 30px;
}
@media (min-width: 992px) and (max-width: 1300px) {
	.waterfall {
		column-count: 3;
	}
	p {
		color: red;
	}
}
@media (min-width: 768px) and (max-width: 991px) {
	.waterfall {
		column-count: 2;
	}
	p {
		color: orange;
	}
}
@media (max-width: 767px) {
	.waterfall {
		column-count: 1;
	}
}
/*瀑布流样式*/
</style>
