<template>
	<div class="layout-padding decoration-tabbar min-w-[800px] h-full">
		<el-card shadow="never" class="!border-none flex-1 h-full dark:bg-gray-800" :body-style="{ height: '100%' }">
			<div class="flex items-start h-full">
				<div class="pages-preview mx-[30px]">
					<div class="flex tabbar dark:bg-gray-700">
						<div class="flex flex-col flex-1 justify-center items-center tabbar-item" v-for="(item, index) in tabbar.list" :key="index">
							<img class="w-[22px] h-[22px]" :src="item.unselected.includes('http') ? item.unselected: baseURL + item.unselected" alt="" />
							<div class="leading-3 text-[12px] mt-[4px] dark:text-gray-300">{{ item.name }}</div>
						</div>
					</div>
				</div>
				<div class="overflow-y-auto flex-1">
					<div class="title flex items-center before:w-[3px] before:h-[14px] before:block before:bg-primary before:mr-2 dark:text-gray-200">
						底部导航设置
						<span class="form-tips ml-[10px] !mt-0 dark:text-gray-400"> 至少添加2个导航，最多添加5个导航 </span>
					</div>
					<el-form label-width="70px">
						<div class="mb-[18px]">
							<el-scrollbar class="h-[calc(100vh-300px)]">
								<draggable class="draggable" v-model="tabbar.list" animation="300" draggable=".draggable" itemKey="index" :move="onMove">
									<template v-slot:item="{ element, index }">
										<del-wrap @close="handleDelete(index)" class="max-w-[400px]" :class="{ draggable: index != 0 }">
											<div class="p-4 mt-4 w-full bg-fill-light">
												<el-form-item label="导航图标">
													<upload-img v-model:imageUrl="element.unselected" height="60px" width="60px" />
													<upload-img v-model:imageUrl="element.selected" height="60px" width="60px" class="ml-2" />
												</el-form-item>
												<el-form-item label="导航名称">
													<el-input v-model="element.name" placeholder="请输入名称" />
												</el-form-item>
												<el-form-item label="链接地址">
													<link-picker v-model="element.link" :disabled="index == 0" />
												</el-form-item>
											</div>
										</del-wrap>
									</template>
								</draggable>
							</el-scrollbar>
						</div>

						<el-form-item v-if="tabbar.list?.length < max" label-width="0">
							<el-button type="primary" @click="setData">保存导航</el-button>
							<el-button type="primary" @click="handleAdd"> 添加导航 </el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="decorationTabbar">
import { fetchList, putObj } from '/@/api/app/tabbar';
import Draggable from 'vuedraggable';
import { useMessage } from '/@/hooks/message';
const LinkPicker = defineAsyncComponent(() => import('/@/components/Link/picker.vue'));

const max = 5;
const min = 2;
const tabbar = reactive({
	list: [
		{
			name: '',
			selected: '',
			unselected: '',
			link: {},
		},
		{
			name: '',
			selected: '',
			unselected: '',
			link: {},
		},
	],
});

const handleAdd = () => {
	if (tabbar.list?.length < max) {
		tabbar.list.push({
			name: '',
			selected: '',
			unselected: '',
			link: {},
		});
	} else {
		useMessage().error(`最多添加${max}个`);
	}
};
const handleDelete = (index: number) => {
	if (tabbar.list?.length <= min) {
		return useMessage().error(`最少保留${min}个`);
	}
	tabbar.list.splice(index, 1);
};

const onMove = (e: any) => {
	if (e.relatedContext.index == 0) {
		return false;
	}
	return true;
};

const getData = async () => {
	const { data } = await fetchList();
	tabbar.list = data;
};
const setData = async () => {
	const data = toRaw(tabbar.list).map((item, index) => {
		return {
			id: item.id,
			name: item.name,
			selected: item.selected,
			unselected: item.unselected,
			link: JSON.stringify(item.link), // 将link转为字符串
      sortOrder: index,
		};
	});
	await putObj(data);
	getData();
	useMessage().success('保存成功');
};
getData();

// Add this to handle baseURL
const baseURL = import.meta.env.VITE_APP_BASE_API || '';
</script>
<style lang="scss" scoped>
.decoration-tabbar {
	height: calc(100vh - var(--navbar-height) - 80px);
	@apply flex flex-col;
	.pages-preview {
		@apply bg-gray-100 dark:bg-gray-700;
		width: 360px;
		height: 600px;
		@apply text-gray-800 dark:text-gray-200;
		position: relative;
		.tabbar {
			position: absolute;
			height: 50px;
			@apply bg-white dark:bg-gray-600;
			bottom: 0;
			width: 100%;
			border: 2px solid var(--el-color-primary);
		}
	}
}
</style>
