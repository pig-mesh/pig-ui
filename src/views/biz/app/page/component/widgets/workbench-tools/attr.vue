<template>
	<div>
		<el-scrollbar style="height: 700px">
			<el-form label-width="70px">
				<el-form-item label="是否启用">
					<el-radio-group v-model="content.enabled">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="标题">
					<el-input class="!w-[400px]" v-model="content.title" placeholder="请输入标题" />
				</el-form-item>
				<el-form-item label="副标题">
					<el-input class="!w-[400px]" v-model="content.subtitle" placeholder="请输入副标题" />
				</el-form-item>
				<el-form-item label="工具设置">
					<div class="flex-1">
						<div class="mb-4 form-tips">最多可添加6个，建议图标尺寸：32px*32px</div>
						<el-scrollbar style="height: 500px">
							<AddWorkbenchItem v-model="content.data" :max="6" :show-badge="true" />
						</el-scrollbar>
					</div>
				</el-form-item>
			</el-form>
		</el-scrollbar>
	</div>
</template>
<script lang="ts" setup>
import type options from './options';
import AddWorkbenchItem from '../../add-workbench-item.vue';
type OptionsType = ReturnType<typeof options>;
defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
});
</script>