<!--
  CodeEditor 代码编辑器组件
  基于 CodeMirror 实现的代码编辑器，支持多种语言高亮、主题切换、只读模式等功能

  使用示例：
  <CodeEditor v-model="code" mode="javascript" theme="darcula" :height="400" />
-->
<template>
	<!-- 编辑器容器，使用动态高度 -->
	<div ref="container" class="code-editor" :style="{ height: _height }">
		<!-- 复制按钮：悬浮在编辑器右上角 -->
		<div
			v-if="showCopyBtn"
			class="absolute z-10 transition-all cursor-pointer top-2 right-2 text-white/60 hover:text-white"
			@click="copy(contentValue)"
			:title="copied ? '已复制' : '复制'"
		>
			<el-icon :size="16">
				<!-- 根据复制状态切换图标 -->
				<Check v-if="copied" />
				<DocumentCopy v-else />
			</el-icon>
		</div>
		<!-- CodeMirror 将替换此 textarea 元素 -->
		<textarea ref="textarea" v-model="contentValue"></textarea>
	</div>
</template>

<script>
import { markRaw } from 'vue';
import { useClipboard } from '@vueuse/core'; // VueUse 剪贴板 hook
import { DocumentCopy, Check } from '@element-plus/icons-vue'; // Element Plus 图标

// CodeMirror 核心库及样式
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

// 主题样式：idea（亮色）、darcula（暗色）
import 'codemirror/theme/idea.css';
import 'codemirror/theme/darcula.css';

// 插件：当前行高亮
import 'codemirror/addon/selection/active-line';

// 语言模式：Velocity 模板、Shell 脚本、C/Java/Go 等类 C 语言
import 'codemirror/mode/velocity/velocity';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/clike/clike';

export default {
	components: {
		DocumentCopy,
		Check,
	},

	/**
	 * setup 钩子：初始化剪贴板功能
	 * @returns {Object} copy - 复制函数，copied - 复制状态（2秒后自动重置）
	 */
	setup() {
		const { copy, copied } = useClipboard();
		return { copy, copied };
	},

	props: {
		/**
		 * 编辑器内容，支持 v-model 双向绑定
		 */
		modelValue: {
			type: String,
			default: '',
		},
		/**
		 * 代码语言模式
		 * 可选值：go, javascript, shell, velocity, text/x-java 等
		 * @see https://codemirror.net/5/mode/
		 */
		mode: {
			type: String,
			default: 'go',
		},
		/**
		 * 编辑器高度
		 * 支持数字（自动添加 px）或字符串（如 '100%'、'50vh'）
		 */
		height: {
			type: [String, Number],
			default: 300,
		},
		/**
		 * CodeMirror 额外配置项
		 * 支持 showCopy: true 显示复制按钮
		 * @see https://codemirror.net/5/doc/manual.html#config
		 */
		options: {
			type: Object,
			default: () => ({}),
		},
		/**
		 * 编辑器主题
		 * 可选值：idea（亮色）、darcula（暗色）
		 */
		theme: {
			type: String,
			default: 'idea',
		},
		/**
		 * 是否只读模式
		 */
		readOnly: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			contentValue: this.modelValue || '', // 编辑器内容副本
			coder: null, // CodeMirror 实例
			resizeObserver: null, // 容器尺寸变化监听器
		};
	},

	computed: {
		/**
		 * 计算高度样式值
		 * 如果是数字则添加 px 单位，字符串直接使用
		 */
		_height() {
			return typeof this.height === 'number' ? this.height + 'px' : this.height;
		},
		/**
		 * 是否显示复制按钮
		 */
		showCopyBtn() {
			return this.options?.showCopy || false;
		},
	},

	watch: {
		/**
		 * 监听外部传入值的变化
		 * 同步更新 CodeMirror 编辑器内容
		 */
		modelValue(val) {
			const value = val || '';
			this.contentValue = value;
			// 避免重复设置相同内容导致的光标位置问题
			if (this.coder && value !== this.coder.getValue()) {
				this.coder.setValue(value);
			}
		},
	},

	mounted() {
		this.initCodeMirror(); // 初始化 CodeMirror 编辑器
		this.setupResizeObserver(); // 设置容器尺寸监听
	},

	beforeUnmount() {
		// 组件销毁前断开尺寸监听，防止内存泄漏
		this.resizeObserver?.disconnect();
	},

	methods: {
		/**
		 * 刷新编辑器布局
		 * 供外部通过 ref 调用，解决编辑器在弹窗等动态容器中渲染不正确的问题
		 */
		refresh() {
			this.coder?.refresh();
		},

		/**
		 * 初始化 CodeMirror 编辑器
		 * 将 textarea 元素替换为功能完整的代码编辑器
		 */
		initCodeMirror() {
			// 合并默认配置和用户自定义配置
			const options = {
				theme: this.theme, // 主题
				styleActiveLine: true, // 高亮当前行
				lineNumbers: true, // 显示行号
				lineWrapping: false, // 不自动换行
				tabSize: 4, // Tab 宽度
				indentUnit: 4, // 缩进单位
				indentWithTabs: true, // 使用 Tab 缩进
				mode: this.mode, // 语言模式
				readOnly: this.readOnly, // 只读模式
				...this.options, // 用户自定义配置（优先级最高）
			};

			// 使用 markRaw 包装，避免 Vue 对 CodeMirror 实例进行响应式代理
			// 这可以提升性能并避免潜在的兼容性问题
			this.coder = markRaw(CodeMirror.fromTextArea(this.$refs.textarea, options));

			// 设置初始内容
			if (this.contentValue) {
				this.coder.setValue(this.contentValue);
			}

			// 监听编辑器内容变化，同步到组件数据并触发 v-model 更新
			this.coder.on('change', (coder) => {
				this.contentValue = coder.getValue();
				this.$emit('update:modelValue', this.contentValue);
			});

			// 初始刷新：延迟确保 DOM 完全渲染后再刷新编辑器布局
			// 解决编辑器在某些情况下初始渲染不正确的问题
			this.$nextTick(() => {
				this.coder?.refresh();
			});
		},

		/**
		 * 设置容器尺寸变化监听器
		 * 当容器大小改变时自动刷新编辑器布局
		 * 适用于弹窗、折叠面板等动态布局场景
		 */
		setupResizeObserver() {
			// 兼容性检查：部分旧浏览器不支持 ResizeObserver
			if (typeof ResizeObserver === 'undefined' || !this.$refs.container) {
				return;
			}

			// 创建监听器，尺寸变化时刷新编辑器
			this.resizeObserver = new ResizeObserver(() => {
				this.coder?.refresh();
			});

			// 开始监听容器元素
			this.resizeObserver.observe(this.$refs.container);
		},
	},
};
</script>

<style scoped>
/* 编辑器容器样式 */
.code-editor {
	font-size: 14px;
	border: 1px solid #ddd;
	line-height: 150%;
	position: relative; /* 为复制按钮定位提供参考 */
}

/* 深度选择器：穿透 scoped 样式，设置 CodeMirror 高度自适应 */
.code-editor:deep(.CodeMirror) {
	height: 100%;
}
</style>