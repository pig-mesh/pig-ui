<template>
	<el-dialog fullscreen title="代码预览" v-model="visible" width="90%" top="3vh" append-to-body :close-on-click-modal="false">
		<splitpanes>
			<pane size="25">
				<el-scrollbar height="calc(100vh - 100px)" class="mt20">
					<el-tree
						ref="treeRef"
						node-key="id"
						:data="preview.fileTree"
						:expand-on-click-node="false"
						highlight-current
						@node-click="handleNodeClick"
					/>
				</el-scrollbar>
			</pane>
			<pane>
				<el-tabs v-model="preview.activeName" @tab-click="handleTabClick">
					<el-tab-pane
						v-for="item in previewCodegen"
						:label="item.codePath.substring(item.codePath.lastIndexOf('/') + 1)"
						:name="item.codePath"
						:key="item.codePath"
					>
						<SvgIcon name="ele-CopyDocument" :size="25" class="copy_btn" @click="copyText(item.code)" />
					</el-tab-pane>
					<code-editor ref="codeEditorRef" theme="darcula" v-model="previewCodeStr" mode="go" readOnly height="calc(100vh - 100px)"></code-editor>
				</el-tabs>
			</pane>
		</splitpanes>
	</el-dialog>
</template>
<script setup lang="ts" name="preview">
import { useGeneratorPreviewApi } from '/@/api/gen/table';
import { handleTree } from '/@/utils/other';
import commonFunction from '/@/utils/commonFunction';
const CodeEditor = defineAsyncComponent(() => import('/@/components/CodeEditor/index.vue'));

const { copyText } = commonFunction();

const visible = ref(false);
// ======== 显示页面 ========
const preview = reactive({
	open: false,
	titel: '代码预览',
	fileTree: [],
	activeName: '',
});

const previewCodegen = ref([]);
const previewCodeStr = ref('');
const fileTreeOriginal = ref([] as any[]);

const openDialog = async (id: string) => {
	await getGenCodeFile(id);
	visible.value = true;
};

const loading = ref(false);
const codeEditorRef = ref();

/**
 * 获取特定资源的代码生成文件，显示在页面上。
 * @param id 需要渲染的资源 ID。
 */
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
			previewCodeStr.value = res[0].code;
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

	const filteredCode = previewCodegen.value.filter((code: any) => code.codePath === data.id);
	if (filteredCode.length > 0) {
		previewCodeStr.value = filteredCode[0].code;
	}
};

const handleTabClick = (item: any) => {
	const filteredCode = previewCodegen.value.filter((code: any) => code.codePath === item.paneName);
	if (filteredCode.length > 0) {
		previewCodeStr.value = filteredCode[0].code;
	}
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

<style scoped lang="scss">
.copy_btn {
	position: absolute;
	top: 10px;
	right: 20px;
	z-index: 9;
	color: white;
}
</style>
