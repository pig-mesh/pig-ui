<template>
	<div class="material">
		<div class="material__left">
			<div class="flex-1 min-h-0">
				<el-scrollbar>
					<div class="pt-4 material-left__content p-b-4">
						<el-tree
							ref="treeRef"
							node-key="id"
							:data="cateLists"
							empty-text="''"
							:highlight-current="true"
							:expand-on-click-node="false"
							:current-node-key="cateId"
							@node-click="handleCatSelect"
						>
							<template v-slot="{ data }">
								<div class="flex items-center flex-1 min-w-0 pr-4">
									<img class="w-[20px] h-[16px] mr-3" src="/@/assets/icon_folder.png" />
									<span class="flex-1 mr-2 truncate">
										{{ data.name }}
									</span>
									<el-dropdown v-if="data.id > 0" :hide-on-click="false">
										<span class="muted m-r-10">···</span>
										<template #dropdown>
											<el-dropdown-menu>
												<popover-input
													@confirm="handleEditCate($event, data.id)"
													size="default"
													:value="data.name"
													width="400px"
													:limit="20"
													show-limit
													teleported
												>
													<div>
														<el-dropdown-item> {{ $t('material.addGroup') }} </el-dropdown-item>
													</div>
												</popover-input>
												<div @click="handleDeleteCate(data.id)">
													<el-dropdown-item>{{ $t('material.delGroup') }}</el-dropdown-item>
												</div>
											</el-dropdown-menu>
										</template>
									</el-dropdown>
								</div>
							</template>
						</el-tree>
					</div>
				</el-scrollbar>
			</div>

			<div class="flex justify-center p-2 border-t border-br">
				<popover-input @confirm="handleAddCate" size="default" width="400px" :limit="20" show-limit teleported>
					<el-button> {{ $t('material.addGroup') }} </el-button>
				</popover-input>
			</div>
		</div>
		<div class="flex flex-col material__center">
			<div class="flex operate-btn">
				<div class="flex flex-1">
					<el-button icon="folder-add" type="primary" class="ml10" v-auth="'sys_file_del'" @click="visibleUpload = true"
						>{{ $t('material.uploadFileTip') }}
					</el-button>

					<el-button v-if="mode == 'page'" :disabled="!select.length" @click.stop="batchFileDelete()"> {{ $t('common.delBtn') }} </el-button>

					<popup v-if="mode == 'page'" class="ml-3" @confirm="batchFileMove" :disabled="!select.length" :title="$t('material.moveBtn')">
						<template #trigger>
							<el-button :disabled="!select.length">{{ $t('material.moveBtn') }}</el-button>
						</template>

						<div>
							<span class="mr-5">移动文件至</span>
							<el-select v-model="moveId" placeholder="请选择">
								<template v-for="item in cateLists" :key="item.id">
									<el-option v-if="item.id !== ''" :label="item.name" :value="item.id"></el-option>
								</template>
							</el-select>
						</div>
					</popup>
				</div>
				<el-input class="mr-16 ml-80" :placeholder="$t('file.inputfileNameTip')" v-model="fileParams.original" @keyup.enter="refresh">
					<template #append>
						<el-button @click="refresh">
							<template #icon>
								<el-icon><Search /></el-icon>
							</template>
						</el-button>
					</template>
				</el-input>
				<div class="flex items-center ml-2">
					<el-tooltip :content="$t('material.list')" placement="top">
						<div
							class="list-icon"
							:class="{
								select: listShowType == 'table',
							}"
							@click="listShowType = 'table'"
						>
							<el-icon><Expand /></el-icon>
						</div>
					</el-tooltip>
					<el-tooltip :content="$t('material.grid')" placement="top">
						<div
							class="list-icon"
							:class="{
								select: listShowType == 'normal',
							}"
							@click="listShowType = 'normal'"
						>
							<el-icon><Menu /></el-icon>
						</div>
					</el-tooltip>
				</div>
			</div>
			<div class="mt-3" v-if="mode == 'page'">
				<el-checkbox :disabled="!pager.lists.length" v-model="isCheckAll" @change="selectAll" :indeterminate="isIndeterminate">
					{{ $t('material.allCheck') }}
				</el-checkbox>
			</div>
			<div class="flex flex-col flex-1 min-h-0 mb-1 material-center__content">
				<el-scrollbar v-if="pager.lists.length" v-show="listShowType == 'normal'">
					<ul class="flex flex-wrap mt-4 file-list">
						<li class="file-item-wrap" v-for="item in pager.lists" :key="item.id" :style="{ width: fileSize }">
							<del-wrap @close="batchFileDelete([item.id])">
								<file-item :uri="getFileUri(item)" :file-size="fileSize" :type="type" @click="selectFile(item)">
									<div class="item-selected" v-if="isSelect(item.id)">
										<el-icon class="el-input__icon"><Check /></el-icon>
									</div>
								</file-item>
							</del-wrap>
							<div class="flex items-center justify-center mt-2">
								{{ item.original }}
							</div>
							<div class="flex items-center justify-center operation-btns">
								<popover-input
									@confirm="handleFileRename($event, item.id)"
									size="default"
									:value="item.name"
									width="400px"
									:limit="50"
									show-limit
									teleported
								>
									<el-button type="primary" link> {{ $t('material.rename') }} </el-button>
								</popover-input>
								<el-button type="primary" link @click="handleDownFile(item)" v-if="type === 'file'"> {{ $t('material.download') }} </el-button>
								<el-button type="primary" link @click="handlePreview(getFileUri(item))" v-else> {{ $t('material.view') }} </el-button>
							</div>
						</li>
					</ul>
				</el-scrollbar>

				<el-table
					ref="tableRef"
					class="mt-4"
					v-show="listShowType == 'table'"
					:data="pager.lists"
					width="100%"
					height="100%"
					size="large"
					@row-click="selectFile"
				>
					<el-table-column width="55">
						<template #default="{ row }">
							<el-checkbox :modelValue="isSelect(row.id)" @change="selectFile(row)" />
						</template>
					</el-table-column>
					<el-table-column label="图片" width="100">
						<template #default="{ row }">
							<file-item :uri="getFileUri(row)" file-size="50px" :type="type"></file-item>
						</template>
					</el-table-column>
					<el-table-column label="名称" min-width="100" show-overflow-tooltip>
						<template #default="{ row }">
							<el-link @click.stop="handlePreview(getFileUri(row))" :underline="false">
								{{ row.original }}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="上传时间" min-width="100" />
					<el-table-column label="操作" width="150" fixed="right">
						<template #default="{ row }">
							<div class="inline-block">
								<popover-input
									@confirm="handleFileRename($event, row.id)"
									size="default"
									:value="row.name"
									width="400px"
									:limit="50"
									show-limit
									teleported
								>
									<el-button type="primary" link> 重命名 </el-button>
								</popover-input>
							</div>
							<div class="inline-block">
								<el-button type="primary" link @click.stop="handlePreview(getFileUri(row))"> 查看 </el-button>
							</div>
							<div class="inline-block">
								<el-button type="primary" link @click.stop="batchFileDelete([row.id])"> 删除 </el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>

				<div class="flex items-center justify-center flex-1" v-if="!pager.lists.length">{{ $t('el.transfer.noData') }}~</div>
			</div>
			<div>
				<pagination v-bind="pager" @change="getFileList" layout="total, prev, pager, next, jumper" />
			</div>
		</div>
		<div class="material__right" v-if="mode == 'picker'">
			<div class="flex flex-wrap justify-between p-2">
				<div class="flex items-center sm">
					已选择 {{ select.length }}
					<span v-if="limit">/{{ limit }}</span>
				</div>
				<el-button type="primary" link @click="clearSelect">清空</el-button>
			</div>
			<div class="flex-1 min-h-0">
				<el-scrollbar class="ls-scrollbar">
					<ul class="flex flex-col select-lists p-t-3">
						<li class="mb-4" v-for="item in select" :key="item.id">
							<div class="select-item">
								<del-wrap @close="cancelSelete(item.id)">
									<file-item :uri="item.uri" file-size="100px" :type="type"></file-item>
								</del-wrap>
							</div>
						</li>
					</ul>
				</el-scrollbar>
			</div>
		</div>
		<preview v-model="showPreview" :url="previewUrl" :type="type" />
	</div>

	<el-dialog :title="$t('material.uploadFileTip')" v-model="visibleUpload" :close-on-click-modal="false" draggable>
		<upload-file @change="refresh" v-if="props.type === 'image'" :data="{ groupId: cateId, type: typeValue }" :fileType="['png', 'jpg', 'jpeg']" />

		<upload-file @change="refresh" v-if="props.type === 'video'" :data="{ groupId: cateId, type: typeValue }" :fileType="['mp4']" />

		<upload-file
			@change="refresh"
			v-if="props.type === 'file'"
			:data="{ cid: cateId, type: typeValue }"
			:fileType="['doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx']"
		/>
	</el-dialog>
</template>

<script lang="ts" setup>
const Popup = defineAsyncComponent(() => import('/@/components/Popup/index.vue'));
const PopoverInput = defineAsyncComponent(() => import('/@/components/PopoverInput/index.vue'));
import { useCate, useFile } from './hook';
import FileItem from './file.vue';
import Preview from './preview.vue';
import type { Ref } from 'vue';
import other from '/@/utils/other';
const props = defineProps({
	fileSize: {
		type: String,
		default: '100px',
	},
	limit: {
		type: Number,
		default: 1,
	},
	type: {
		type: String,
		default: 'image',
	},
	mode: {
		type: String,
		default: 'picker',
	},
	pageSize: {
		type: Number,
		default: 15,
	},
});
const emit = defineEmits(['change']);
const { limit } = toRefs(props);
const typeValue = computed<number>(() => {
	switch (props.type) {
		case 'image':
			return 10;
		case 'video':
			return 20;
		case 'file':
			return 30;
		default:
			return 0;
	}
});
const visible: Ref<boolean> = ref(false);
const visibleUpload: Ref<boolean> = ref(false);
const previewUrl = ref('');
const showPreview = ref(false);
const { treeRef, cateId, cateLists, handleAddCate, handleEditCate, handleDeleteCate, getCateLists, handleCatSelect } = useCate(typeValue.value);

const {
	tableRef,
	listShowType,
	moveId,
	pager,
	fileParams,
	select,
	isCheckAll,
	isIndeterminate,
	getFileList,
	refresh,
	batchFileDelete,
	batchFileMove,
	selectFile,
	isSelect,
	clearSelect,
	cancelSelete,
	selectAll,
	handleFileRename,
} = useFile(cateId, typeValue, limit, props.pageSize);

/**
 * 获取数据
 */
const getData = async () => {
	await getCateLists();
	treeRef.value?.setCurrentKey(cateId.value);
	getFileList();
};

/**
 * 处理预览
 *
 * @param {string} url - 预览的URL
 */
const handlePreview = (url: string) => {
	previewUrl.value = url;
	showPreview.value = true;
};

/**
 * 处理下载文件
 *
 * @param {any} item - 文件项对象
 */
const handleDownFile = (item: any) => {
	other.downBlobFile(`/admin/sys-file/${item.bucketName}/${item.fileName}`, {}, item.original);
};

watch(
	visible,
	async (val: boolean) => {
		if (val) {
			getData();
		}
	},
	{
		immediate: true,
	}
);
watch(cateId, () => {
	fileParams.name = '';
	refresh();
});

watch(
	select,
	(val: any[]) => {
		emit('change', val);
		if (val.length == pager.lists.length && val.length !== 0) {
			isIndeterminate.value = false;
			isCheckAll.value = true;
			return;
		}
		if (val.length > 0) {
			isIndeterminate.value = true;
		} else {
			isCheckAll.value = false;
			isIndeterminate.value = false;
		}
	},
	{
		deep: true,
	}
);

const getFileUri = (item: any) => {
	return `/api/admin/sys-file/${item.bucketName}/${item.fileName}`;
};

onMounted(() => {
	props.mode == 'page' && getData();
});

defineExpose({
	clearSelect,
});
</script>

<style scoped lang="scss">
.material {
	@apply h-full min-h-0 flex flex-1;
	&__left {
		@apply border-r border-br flex flex-col w-[200px];
		:deep(.el-tree-node__content) {
			height: 36px;
		}
	}
	&__center {
		flex: 1;
		min-width: 0;
		min-height: 0;
		padding: 16px 16px 0;
		.list-icon {
			border-radius: 3px;
			display: flex;
			padding: 5px;
			cursor: pointer;
			&.select {
				@apply text-primary bg-primary-light-8;
			}
		}
		.file-list {
			.file-item-wrap {
				margin-right: 16px;
				line-height: 1.3;
				cursor: pointer;
				.item-selected {
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border-radius: 4px;
					background-color: rgba(0, 0, 0, 0.5);
					box-sizing: border-box;
				}
				.operation-btns {
					height: 28px;
					visibility: hidden;
				}
				&:hover .operation-btns {
					visibility: visible;
				}
			}
		}
	}
	&__right {
		@apply border-l border-br flex flex-col;
		width: 130px;
		.select-lists {
			padding: 10px;

			.select-item {
				width: 100px;
				height: 100px;
			}
		}
	}
}
</style>
