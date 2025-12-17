<template>
	<div class="layout-padding min-w-[800px] h-[calc(100vh-var(--navbar-height)-80px)] flex flex-col overflow-x-hidden">
		<el-card shadow="never" class="!border-none flex-1 h-full dark:bg-gray-800" :body-style="{ height: '100%' }">
			<div class="flex items-start w-full h-full min-w-0 gap-6">
				<!-- Mobile Preview Section -->
				<div class="flex flex-col items-center flex-shrink-0 ml-16">
					<!-- 手机预览容器 -->
					<div class="relative">
						<!-- 手机外壳装饰 -->
						<div
							class="absolute -inset-3 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-[2.5rem] shadow-2xl">
						</div>

						<!-- 手机屏幕区域 -->
						<div
							class="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 w-[360px] h-[640px] rounded-[2rem] shadow-xl overflow-hidden border-8 border-gray-800 dark:border-black">
							<!-- 顶部刘海 -->
							<div
								class="absolute top-0 z-50 flex items-center justify-center w-32 h-6 gap-2 -translate-x-1/2 bg-gray-800 left-1/2 dark:bg-black rounded-b-2xl">
								<div class="w-12 h-1 bg-gray-700 rounded-full dark:bg-gray-800"></div>
								<div class="w-2 h-2 bg-gray-700 rounded-full dark:bg-gray-800"></div>
							</div>

							<!-- 屏幕内容区域 -->
							<div class="relative w-full h-full pt-6 pb-[60px] flex items-center justify-center">
								<div class="text-center text-gray-400 dark:text-gray-600">
									<el-icon class="mb-2 text-6xl">
										<Monitor />
									</el-icon>
									<div class="text-sm">预览区域</div>
								</div>
							</div>

							<!-- Tabbar 预览 -->
							<div
								class="absolute bottom-0 w-full h-[60px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 flex shadow-lg">
								<div v-for="(item, index) in tabbar.list" :key="index"
									class="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 cursor-pointer hover:bg-primary/5"
									:class="{ 'bg-primary/10': index === 0 }">
									<!-- 图标 -->
									<div
										class="flex items-center justify-center w-6 h-6 mb-1 transition-transform duration-300 hover:scale-110">
										<img v-if="item.unselected" class="object-contain w-full h-full"
											:src="item.unselected.includes('http') ? item.unselected : baseURL + item.unselected"
											alt="" />
										<el-icon v-else class="text-xl text-gray-400">
											<Grid />
										</el-icon>
									</div>
									<!-- 名称 -->
									<div class="text-[11px] font-medium transition-colors duration-300"
										:class="index === 0 ? 'text-primary' : 'text-gray-600 dark:text-gray-400'">
										{{ item.name || '导航' }}
									</div>
								</div>
							</div>
						</div>

						<!-- 侧边按钮装饰 -->
						<div class="absolute w-1 h-12 bg-gray-700 rounded-l -right-1 top-20 dark:bg-gray-800"></div>
						<div class="absolute w-1 h-16 bg-gray-700 rounded-l -right-1 top-36 dark:bg-gray-800"></div>
						<div class="absolute w-1 h-8 bg-gray-700 rounded-r -left-1 top-24 dark:bg-gray-800"></div>
					</div>

					<!-- 预览标签 -->
					<div
						class="px-4 py-2 mt-4 border rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 border-primary/20 dark:border-primary/30">
						<div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
							<el-icon class="text-primary">
								<View />
							</el-icon>
							<span class="font-medium">实时预览</span>
						</div>
					</div>
				</div>

				<!-- Form Section -->
				<div class="flex flex-col flex-1 w-full max-h-full min-w-0 ml-16">
					<!-- 标题 -->
					<div class="flex-shrink-0 mb-6">
						<div class="flex items-center gap-3 mb-4">
							<div
								class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20">
								<el-icon class="text-xl text-primary">
									<Setting />
								</el-icon>
							</div>
							<div>
								<div class="text-lg font-semibold text-gray-900 dark:text-gray-100">底部导航设置</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">配置应用底部导航栏</div>
							</div>
						</div>
					</div>

					<!-- 表单区域 - 可滚动 -->
					<div class="flex-1 min-h-0 pr-2 overflow-x-hidden overflow-y-auto">
						<el-form label-width="80px" class="w-full max-w-full mr-6">
							<!-- 导航列表 -->
							<draggable class="mb-6 space-y-4" v-model="tabbar.list" animation="300"
								draggable=".draggable" itemKey="index" :move="onMove" handle=".drag-handle">
								<template v-slot:item="{ element, index }">
									<del-wrap @close="handleDelete(index)" class="w-full"
										:class="{ draggable: index != 0 }">
										<div class="relative w-full p-5 transition-all duration-300 border-2 group rounded-xl"
											:class="index === 0
												? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/20'
												: 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5'">
											<!-- 拖拽手柄 (仅非首页显示) -->
											<div v-if="index !== 0"
												class="absolute transition-opacity duration-200 -translate-y-1/2 opacity-0 cursor-move drag-handle left-2 top-1/2 group-hover:opacity-100">
												<el-icon class="text-lg text-gray-400 dark:text-gray-500">
													<DCaret />
												</el-icon>
											</div>

											<!-- 序号标识 -->
											<div class="absolute flex items-center justify-center w-8 h-8 rounded-full shadow-md -top-3 -left-3"
												:class="index === 0 ? 'bg-primary text-white' : 'bg-gray-500 text-white'">
												<span class="text-sm font-bold">{{ index + 1 }}</span>
											</div>

											<!-- 首页标识 -->
											<div v-if="index === 0"
												class="absolute px-3 py-1 text-xs font-medium text-white rounded-full shadow-md -top-3 -right-3 bg-gradient-to-r from-primary to-primary/80">
												首页
											</div>

											<div :class="index !== 0 ? 'ml-6' : ''">
												<!-- 导航图标 -->
												<el-form-item label="导航图标" class="!mb-4">
													<div class="flex gap-4">
														<!-- 未选中图标 -->
														<div class="flex-1">
															<div
																class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
																<el-icon class="mr-1">
																	<Picture />
																</el-icon>未选中
															</div>
															<upload-img v-model:imageUrl="element.unselected"
																height="64px" width="64px"
															/>
														</div>
														<!-- 选中图标 -->
														<div class="flex-1">
															<div
																class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
																<el-icon class="mr-1">
																	<Picture />
																</el-icon>选中
															</div>
															<upload-img v-model:imageUrl="element.selected"
																height="64px" width="64px"
																/>
														</div>
													</div>
												</el-form-item>

												<!-- 导航名称 -->
												<el-form-item label="导航名称" class="!mb-4">
													<el-input v-model="element.name" placeholder="请输入导航名称" clearable
														maxlength="4" show-word-limit class="!w-full">
														<template #prefix>
															<el-icon class="text-gray-400">
																<Edit />
															</el-icon>
														</template>
													</el-input>
												</el-form-item>

												<!-- 链接地址 -->
												<el-form-item label="链接地址" class="!mb-0">
													<link-picker v-model="element.link" :disabled="index == 0"
														class="!w-full" />
													<div v-if="index === 0"
														class="mt-1 text-xs text-gray-500 dark:text-gray-400">
														<el-icon>
															<Lock />
														</el-icon> 首页链接不可修改
													</div>
												</el-form-item>
											</div>
										</div>
									</del-wrap>
								</template>
							</draggable>
						</el-form>
					</div>

					<!-- 底部操作区域 - 固定在底部 -->
					<div
						class="flex-shrink-0 pt-4 pr-8 bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
						<!-- 操作按钮 -->
						<div class="flex items-center gap-3">
							<!-- 保存按钮 -->
							<el-button type="primary" @click="setData"
								class="!px-6 !py-2 !rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
								:icon="Check">
								保存导航
							</el-button>

							<!-- 添加按钮 -->
							<el-button v-if="tabbar.list?.length < max" type="primary" @click="handleAdd" plain
								class="!px-6 !py-2 !rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
								:icon="Plus">
								添加导航
							</el-button>

							<!-- 计数显示 -->
							<div class="ml-auto text-sm text-gray-500 dark:text-gray-400">
								已添加 <span class="font-semibold text-primary">{{ tabbar.list?.length || 0 }}</span> / {{
									max }} 个
							</div>
						</div>

						<!-- 达到上限提示 -->
						<el-alert v-if="tabbar.list?.length >= max" type="warning" :closable="false"
							class="!rounded-lg !mt-3">
							<template #title>
								<span class="text-sm">已达到导航数量上限（{{ max }} 个）</span>
							</template>
						</el-alert>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="decorationTabbar">
import { fetchList, putObj } from '/@/api/app/tabbar';
import Draggable from 'vuedraggable';
import { useMessage } from '/@/hooks/message';
import { Plus, Check } from '@element-plus/icons-vue';
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
</script>
