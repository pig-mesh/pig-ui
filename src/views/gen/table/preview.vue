<template>
	<el-dialog title="代码预览" v-model="visible" width="90%" top="3vh" append-to-body :close-on-click-modal="false">
		<el-row :gutter="20">
			<el-col :span="6">
				<el-card :gutter="12" shadow="hover" v-loading="loading">
					<el-scrollbar height="calc(100vh - 300px)">
						<el-tree
							ref="treeRef"
							node-key="id"
							:data="preview.fileTree"
							:expand-on-click-node="false"
							highlight-current
							@node-click="handleNodeClick"
						/>
					</el-scrollbar>
				</el-card>
			</el-col>
			<el-col :span="18">
				<el-tabs v-model="preview.activeName">
					<el-tab-pane
						v-for="item in previewCodegen"
						:label="item.codePath.substring(item.codePath.lastIndexOf('/') + 1)"
						:name="item.codePath"
						:key="item.codePath"
					>
						<highlightjs autodetect :code="item.code" />
					</el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>
	</el-dialog>
</template>
<script setup lang="ts" name="preview">
import { useGeneratorPreviewApi } from '/@/api/gen/table';
import { handleTree } from '/@/utils/other';

const visible = ref(false);
// ======== 显示页面 ========
const preview = reactive({
	open: false,
	titel: '代码预览',
	fileTree: [],
	activeName: '',
});

const previewCodegen = ref([]);
const fileTreeOriginal = ref([] as any[]);

const openDialog = async (id: string) => {
	await getGenCodeFile(id);
	visible.value = true;
};

const loading = ref(false);

const getGenCodeFile = (id: string) => {
	loading.value = true;
	fileTreeOriginal.value = [];
	useGeneratorPreviewApi(id)
		.then((res: any) => {
			previewCodegen.value = res;
			for (let index in res) {
				fileTreeOriginal.value.push(res[index].codePath);
			}
			// 默认选中第一个 选项卡
			preview.activeName = res[0].codePath;
			const files = handleFiles(fileTreeOriginal);
			preview.fileTree = handleTree(files, 'id', 'parentId', 'children', '/');
		})
		.finally(() => {
			loading.value = false;
		});
};

const handleNodeClick = async (data: any, node: any) => {
	if (node && !node.isLeaf) {
		return false;
	}
	preview.activeName = data.id;
};

/**
 * 生成 files 目录
 * @param fileTreeOriginal
 * @returns {*[]}
 */
const handleFiles = (fileTreeOriginal: any) => {
	const exists = {};
	const files = [] as any[];

	// 遍历每个元素
	for (const data of fileTreeOriginal.value) {
		let paths = [];
		if (data.includes('\\')) {
			paths = data.split('\\');
		} else {
			paths = data.split('/');
		}
		let fullPath = ''; // 从头开始的路径，用于生成 id
		// 遍历每个 path， 拼接成树
		for (let i = 0; i < paths.length; i++) {
			// 已经添加到 files 中，则跳过
			const oldFullPath = fullPath;
			// 下面的 replaceAll 的原因，是因为上面包处理了，导致和 tabs 不匹配，所以 replaceAll 下
			fullPath = fullPath.length === 0 ? paths[i] : fullPath.replaceAll('.', '/') + '/' + paths[i];
			if (exists[fullPath]) {
				continue;
			}
			// 添加到 files 中
			exists[fullPath] = true;
			files.push({
				id: fullPath,
				label: paths[i],
				parentId: oldFullPath || '/',
				templateName: data.k,
			});
		}
	}
	return files;
};

defineExpose({
	openDialog,
});
</script>
