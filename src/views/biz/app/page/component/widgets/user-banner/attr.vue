<template>
	<div class="w-full overflow-x-hidden">
		<el-scrollbar style="height: 550px; overflow-x: hidden;">
			<el-form label-width="70px" class="w-full max-w-full mr-8">
				<el-form-item label="是否启用">
					<el-radio-group v-model="content.enabled">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="图片设置">
					<div class="flex-1 w-full overflow-x-hidden">
						<div class="form-tips">最多添加5张，建议图片尺寸：750px*200px</div>
						<draggable class="draggable" v-model="content.data" item-key="index" animation="300">
							<template v-slot:item="{ element: item, index }">
								<del-wrap :key="index" @close="handleDelete(index)" class="w-full">
									<div class="flex items-center w-full p-4 mt-4 cursor-move bg-fill-light">
										<upload-img v-model:imageUrl="item.image" />
										<div class="flex-1 ml-3 min-w-0">
											<el-form-item label="图片名称">
												<el-input v-model="item.name" placeholder="请输入名称" class="!w-full" />
											</el-form-item>
											<el-form-item class="mt-[18px]" label="图片链接">
												<link-picker v-model="item.link" class="!w-full" />
											</el-form-item>
										</div>
									</div>
								</del-wrap>
							</template>
						</draggable>
					</div>
				</el-form-item>
				<el-form-item v-if="content.data?.length < limit">
					<el-button type="primary" @click="handleAdd">添加图片</el-button>
				</el-form-item>
			</el-form>
		</el-scrollbar>
	</div>
</template>
<script lang="ts" setup>
import type options from './options';
import { useMessage } from '/@/hooks/message';
import Draggable from 'vuedraggable';
import LinkPicker from '/@/components/Link/picker.vue';

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
