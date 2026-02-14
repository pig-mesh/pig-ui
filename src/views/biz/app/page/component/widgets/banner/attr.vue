<template>
	<div class="w-full">
		<el-form label-width="80px" class="px-1 w-full">
				<!-- 是否启用 -->
				<el-form-item label="是否启用" v-if="type == 'mobile'" class="mb-6">
					<el-radio-group v-model="content.enabled" class="!flex gap-2">
						<el-radio :label="1" class="!mr-0" border>
							<span class="flex items-center gap-1">
								<el-icon><Check /></el-icon>
								开启
							</span>
						</el-radio>
						<el-radio :label="0" class="!mr-0" border>
							<span class="flex items-center gap-1">
								<el-icon><Close /></el-icon>
								停用
							</span>
						</el-radio>
					</el-radio-group>
				</el-form-item>

				<!-- 图片设置 -->
				<el-form-item label="图片设置" class="!mb-4">
					<div class="flex-1">
						<!-- 优化后的提示信息 -->
						<div class="flex items-start gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
							<el-icon class="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0"><InfoFilled /></el-icon>
							<div class="text-sm text-blue-700 dark:text-blue-300">
								<div class="font-medium mb-1">图片规格要求</div>
								<div>• 最多添加 <span class="font-semibold">5</span> 张图片</div>
								<div>• 建议尺寸：<span class="font-semibold">750px × 340px</span></div>
								<div>• 支持拖拽排序</div>
							</div>
						</div>

						<!-- 拖拽列表 -->
						<draggable
							class="space-y-3"
							v-model="content.data"
							item-key="index"
							animation="300"
							:component-data="{ name: 'fade' }"
						>
							<template v-slot:item="{ element: item, index }">
								<del-wrap :key="index" @close="handleDelete(index)" class="w-full">
									<div
										class="group relative flex items-center w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 cursor-move transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5"
									>
										<!-- 拖拽手柄 -->
										<div class="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
											<el-icon class="text-gray-400 dark:text-gray-500 text-lg">
												<DCaret />
											</el-icon>
										</div>

										<!-- 图片上传区域 -->
										<div class="ml-6 flex-shrink-0">
											<upload-img
												v-model:imageUrl="item.image"
												class="rounded-lg overflow-hidden shadow-sm ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-300 hover:ring-primary/50"
											/>
										</div>

										<!-- 表单区域 -->
										<div class="flex-1 ml-4 space-y-3 min-w-0">
											<el-form-item label="图片名称" class="!mb-0">
												<el-input
													v-model="item.name"
													placeholder="请输入图片名称"
													clearable
													class="transition-all duration-200 !w-full"
												>
													<template #prefix>
														<el-icon class="text-gray-400"><Picture /></el-icon>
													</template>
												</el-input>
											</el-form-item>

											<el-form-item class="!mb-0" label="跳转链接">
												<link-picker v-if="type == 'mobile'" v-model="item.link" class="!w-full" />
												<el-input
													v-if="type == 'pc'"
													placeholder="请输入跳转链接"
													v-model="item.link.path"
													clearable
													class="transition-all duration-200 !w-full"
												>
													<template #prefix>
														<el-icon class="text-gray-400"><Link /></el-icon>
													</template>
												</el-input>
											</el-form-item>
										</div>
									</div>
								</del-wrap>
							</template>
						</draggable>

						<!-- 空状态提示 -->
						<div
							v-if="content.data?.length === 0"
							class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/30 transition-colors"
						>
							<el-icon class="text-5xl text-gray-300 dark:text-gray-600 mb-3"><Picture /></el-icon>
							<div class="text-gray-500 dark:text-gray-400 text-sm">暂无图片，点击下方按钮添加</div>
						</div>
					</div>
				</el-form-item>

				<!-- 添加按钮 -->
				<el-form-item v-if="content.data?.length < limit" class="!mb-0">
					<el-button
						type="primary"
						@click="handleAdd"
						class="!px-6 !py-2 !rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
						:icon="Plus"
					>
						添加图片
					</el-button>
					<span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
						已添加 {{ content.data?.length || 0 }} / {{ limit }} 张
					</span>
				</el-form-item>

				<!-- 达到上限提示 -->
				<el-form-item v-else class="!mb-0">
					<el-alert
						type="warning"
						:closable="false"
						class="!rounded-lg"
					>
						<template #title>
							<span class="text-sm">已达到图片数量上限（{{ limit }} 张）</span>
						</template>
					</el-alert>
				</el-form-item>
			</el-form>
	</div>
</template>
<script lang="ts" setup>
import type options from './options';
import { useMessage } from '/@/hooks/message';
import Draggable from 'vuedraggable';
import { Plus } from '@element-plus/icons-vue';
const LinkPicker = defineAsyncComponent(() => import('/@/components/Link/picker.vue'));

const limit = 5;
type OptionsType = ReturnType<typeof options>;
const props = defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
	type: {
		type: String as PropType<'mobile' | 'pc'>,
		default: 'mobile',
	},
});

const handleAdd = () => {
	if (props.content.data?.length < limit) {
		props.content.data.push({
			image: '',
			name: '',
			link: {},
		});
	} else {
		useMessage().error(`最多添加${limit}张图片`);
	}
};
const handleDelete = (index: number) => {
	if (props.content.data?.length <= 1) {
		return useMessage().error('最少保留一张图片');
	}
	props.content.data.splice(index, 1);
};
</script>
