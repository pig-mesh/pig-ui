<template>
	<div class="w-full overflow-x-hidden">
		<el-scrollbar style="height: 700px; overflow-x: hidden;">
			<el-form label-width="70px" class="w-full max-w-full mr-8">
				<el-form-item label="是否启用">
					<el-radio-group v-model="content.enabled">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="菜单设置">
					<div class="flex-1 w-full overflow-x-hidden">
						<div class="mb-4 form-tips">最多可添加10个，建议图片尺寸：100px*100px</div>
						<el-scrollbar style="height: 500px; overflow-x: hidden;">
							<AddNav v-model="content.data" />
						</el-scrollbar>
					</div>
				</el-form-item>
			</el-form>
		</el-scrollbar>
	</div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type options from './options';
import AddNav from '../../add-nav.vue';
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

<style lang="scss" scoped></style>
