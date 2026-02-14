<!--
  SelectResult 已选结果面板组件

  功能：展示用户在左侧面板中已选中的项目，按类型（角色/岗位/部门/用户）分组显示，
  每项可单独取消选中，也可点击顶部"清空"按钮全部清除。

  Props：
  - total : number - 已选项总数
  - list  : OrgDataGroup[] - 按类型分组的已选数据，每组包含 type、data、cancel 回调
-->
<template>
	<div class="w-full h-full flex flex-col  rounded-none overflow-hidden relative">
		<!-- 头部统计和清空按钮 -->
		<div class="flex items-center justify-between px-4">
			<div class="flex items-center gap-2">
				<el-icon class="text-base text-[#1d9bf0] animate-pulse"><Check /></el-icon>
				<span class="text-sm font-semibold">{{ t('orgSelecotr.selected') }}</span>
				<el-tag type="primary" size="small" class="!font-semibold !text-xs !h-5 !px-2 !rounded-full">{{ total }}</el-tag>
			</div>
			<el-button
				type="danger"
				size="small"
				text
				@click="emit('del')"
				:disabled="total === 0"
				class="px-3 py-1.5 h-7 text-xs rounded-md transition-all duration-300 bg-[rgba(244,33,46,0.1)] border border-[rgba(244,33,46,0.3)] text-[#f4212e] hover:bg-[rgba(244,33,46,0.2)] hover:border-[#f4212e] hover:text-[#f4212e] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(244,33,46,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
			>
				<el-icon class="mr-1 text-xs"><Delete /></el-icon>
				<span>{{ t('orgSelecotr.clearAll') }}</span>
			</el-button>
		</div>

		<!-- 已选项列表 -->
		<div class="flex-1 overflow-hidden flex flex-col">
			<!-- 空状态 -->
			<div v-if="total === 0" class="flex-1 flex flex-col items-center justify-center py-10 px-5 text-[var(--next-text-color-placeholder)]">
				<el-icon class="text-5xl mb-4 opacity-60 animate-bounce"><Box /></el-icon>
				<p class="text-sm m-0 text-[var(--next-text-color-placeholder)]">{{ t('orgSelecotr.noSelection') }}</p>
			</div>

			<div v-else class="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--next-border-color)] hover:scrollbar-thumb-[var(--next-text-color-regular)] scrollbar-thumb-rounded">
				<template v-for="{ type, data, cancel } in list" :key="type">
					<div class="mb-2">
						<div v-for="item in data" :key="item.id" class="mx-3 my-0.5 rounded-lg transition-all duration-300 relative hover:bg-[var(--next-color-hover)] hover:-translate-x-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] animate-[slideInRight_0.3s_ease-out]">
							<div class="flex items-center p-3 gap-3">
								<!-- 图标/头像区域：用户显示头像，其他类型显示对应图标 -->
								<template v-if="type === 'user'">
									<div class="w-8 h-8 rounded-full overflow-hidden transition-all duration-300 flex-shrink-0 flex items-center justify-center bg-[var(--next-color-hover)] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
										<upload-img v-model:image-url="item.avatar" disabled width="32px" height="32px" />
									</div>
								</template>
								<template v-else>
									<div class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0 bg-primary text-white">
										<el-icon class="text-base">
											<Share v-if="type === 'role'" />
											<Briefcase v-else-if="type === 'post'" />
											<Grid v-else />
										</el-icon>
									</div>
								</template>
								<!-- 名称和类型标签 -->
								<div class="flex-1 min-w-0">
									<div class="text-sm font-medium mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{{ getDisplayName(item, type) }}</div>
									<div class="text-xs opacity-80">{{ t(`orgSelecotr.${type}`) }}</div>
								</div>
								<!-- 取消按钮 -->
								<el-button
									size="small"
									text
									@click="cancel(item)"
									:icon="CircleClose"
									class="p-1 w-7 h-7 rounded-md transition-all duration-300 opacity-60 bg-transparent border-none hover:opacity-100 hover:bg-[rgba(244,33,46,0.1)] hover:text-[#f4212e] hover:scale-110 hover:animate-[shake_0.5s_ease-in-out]"
								/>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { CircleClose, Grid, Share, Briefcase, Check, Delete, Box } from '@element-plus/icons-vue';
import UploadImg from '/@/components/Upload/Image.vue';

const { t } = useI18n();

defineProps({
	total: {
		type: Number,
		default: 0,
	},
	list: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['del']);

/** 根据类型获取显示名称（角色/岗位有特殊字段名） */
const getDisplayName = (item, type) => {
	if (type === 'role') return item.name || item.roleName || t('orgSelecotr.unnamedRole');
	if (type === 'post') return item.name || item.postName || t('orgSelecotr.unnamedPost');
	return item.name;
};
</script>
