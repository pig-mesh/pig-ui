<template>
	<div class="flex flex-col border border-br" :style="styles">
		<Toolbar class="border-b border-br" :editor="editorRef" :mode="mode" />
		<Editor
			class="flex-1 overflow-y-auto"
			:mode="mode"
			:defaultConfig="state.editorConfig"
			v-model="state.editorVal"
			@onCreated="handleCreated"
			@onChange="handleChange"
		/>
	</div>
</template>

<script setup lang="ts" name="wngEditor">
import '@wangeditor/editor/dist/css/style.css';
import { reactive, shallowRef, watch, onBeforeUnmount, CSSProperties } from 'vue';
// @ts-ignore
import { IDomEditor } from '@wangeditor/editor';
import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
const { proxy } = getCurrentInstance();

// 定义父组件传过来的值
const props = defineProps({
	// 是否禁用
	disable: {
		type: Boolean,
		default: () => false,
	},
	// 内容框默认 placeholder
	placeholder: {
		type: String,
		default: () => '请输入内容...',
	},
	// https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F
	// 模式，可选 <default|simple>，默认 default
	mode: {
		type: String,
		default: () => 'default',
	},
	// 高度
	height: {
		type: String,
		default: () => '310',
	},
	// 宽度
	width: {
		type: String,
		default: () => 'auto',
	},
	// 双向绑定，用于获取 editor.getHtml()
	getHtml: String,
	// 双向绑定，用于获取 editor.getText()
	getText: String,
	uploadFileUrl: {
		type: String,
		default: `/admin/sys-file/upload`,
	},
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:getHtml', 'update:getText']);

// 定义上传需要的请求头信息
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});

// 定义上传需要的字段信息
const uploadAttr = reactive({
	fieldName: 'file',
	server: proxy.baseURL + props.uploadFileUrl,
	headers: headers,
	customInsert(res, insertFn) {
		insertFn(proxy.baseURL + res.data.url);
	},
});

const editorRef = shallowRef();
const state = reactive({
	editorConfig: {
		placeholder: props.placeholder,
		MENU_CONF: {
			uploadImage: uploadAttr,
			uploadVideo: uploadAttr,
		},
	},
	editorVal: props.getHtml,
});

const styles = computed<CSSProperties>(() => ({
	height: other.addUnit(props.height),
	width: other.addUnit(props.width),
}));

// 编辑器回调函数
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor;
};

// 编辑器内容改变时
const handleChange = (editor: IDomEditor) => {
	emit('update:getHtml', editor.getHtml());
	emit('update:getText', editor.getText());
};

// 页面销毁时
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});

// 监听是否禁用改变
watch(
	() => props.disable,
	(bool) => {
		const editor = editorRef.value;
		if (editor == null) return;
		bool ? editor.disable() : editor.enable();
	},
	{
		deep: true,
	}
);
// 监听双向绑定值改变，用于回显
watch(
	() => props.getHtml,
	(val) => {
		state.editorVal = val;
	},
	{
		deep: true,
	}
);
</script>
