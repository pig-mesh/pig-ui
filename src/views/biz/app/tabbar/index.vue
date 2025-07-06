<template>
	<div class="layout-padding min-w-[800px] h-[calc(100vh-var(--navbar-height)-80px)] flex flex-col">
		<el-card shadow="never" class="!border-none flex-1 h-full dark:bg-gray-800" :body-style="{ height: '100%' }">
			<div class="flex items-start h-full">
				<!-- Mobile Preview Section -->
				<div class="w-[360px] h-[600px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 relative mx-[30px]">
					<!-- Tabbar Preview -->
					<div class="absolute bottom-0 w-full h-[50px] bg-white dark:bg-gray-600 border-2 border-primary flex">
						<div class="flex flex-col flex-1 justify-center items-center" v-for="(item, index) in tabbar.list" :key="index">
							<img class="w-[22px] h-[22px]" :src="item.unselected.includes('http') ? item.unselected: baseURL + item.unselected" alt="" />
							<div class="leading-3 text-[12px] mt-[4px] dark:text-gray-300">{{ item.name }}</div>
						</div>
					</div>
				</div>
				
				<!-- Form Section -->
				<div class="overflow-y-auto flex-1">
					<div class="flex items-center before:w-[3px] before:h-[14px] before:block before:bg-primary before:mr-2 dark:text-gray-200">
						底部导航设置
						<span class="form-tips ml-[10px] !mt-0 dark:text-gray-400"> 至少添加2个导航，最多添加5个导航 </span>
					</div>
					<el-form label-width="70px">
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

// Define types for better type safety
interface TabbarItem {
	id?: number;
	name: string;
	selected: string;
	unselected: string;
	link: Record<string, any>;
}

const max = 5;
const min = 2;
const tabbar = reactive<{ list: TabbarItem[] }>({
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
	try {
		const { data } = await fetchList();
		tabbar.list = data;
	} catch (error) {
		console.error('获取数据失败:', error);
		useMessage().error('获取数据失败');
	}
};

const setData = async () => {
	try {
		const data = toRaw(tabbar.list).map((item, index) => {
			return {
				...(item.id && { id: item.id }), // Only include id if it exists
				name: item.name,
				selected: item.selected,
				unselected: item.unselected,
				link: JSON.stringify(item.link), // 将link转为字符串
				sortOrder: index,
			};
		});
		await putObj(data);
		await getData();
		useMessage().success('保存成功');
	} catch (error) {
		console.error('保存失败:', error);
		useMessage().error('保存失败');
	}
};

// Initialize data
getData();

// Add this to handle baseURL
const baseURL = import.meta.env.VITE_APP_BASE_API || '';
</script>
