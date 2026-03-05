<template>
	<el-dialog v-model="visible" title="编辑打印模板" width="80%" :close-on-click-modal="false" destroy-on-close>
		<div v-loading="loading" class="flex gap-4 min-h-[540px]">
			<!-- 左侧：编辑器区域 -->
			<div ref="editorAreaRef" class="relative flex-1">
				<div class="flex flex-col border border-gray-200 dark:border-gray-700 h-[500px] relative z-10">
					<Toolbar class="border-b border-gray-200 dark:border-gray-700" :editor="editorRef" mode="default" />
					<Editor class="flex-1 overflow-y-auto" mode="default" :defaultConfig="editorConfig" v-model="editorHtml" @onCreated="handleCreated" />
				</div>
				<!-- @ 弹出菜单 -->
				<div
					v-if="showMentionDropdown"
					ref="mentionDropdownRef"
					class="absolute z-[1100] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-2 w-[320px] max-h-[300px]"
					:style="{ left: mentionPosition.left + 'px', top: mentionPosition.top + 'px' }"
				>
					<div class="px-2 py-1 mb-1 text-xs text-gray-500 dark:text-gray-400">关键词：{{ mentionSearch || '全部变量' }}（↑/↓ 选择，Enter 插入）</div>
					<div class="overflow-y-auto max-h-60">
						<div
							v-for="(item, index) in filteredMentionList"
							:key="item.value"
							:class="[
								'flex justify-between px-2 py-1.5 cursor-pointer rounded',
								index === activeMentionIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
							]"
							@mouseenter="activeMentionIndex = index"
							@mousedown.prevent="insertMention(item)"
						>
							<span class="text-sm">{{ item.label }}</span>
							<span class="text-xs text-gray-500 dark:text-gray-400">{{ item.value }}</span>
						</div>
						<div v-if="filteredMentionList.length === 0" class="py-2 text-sm text-center text-gray-500 dark:text-gray-400">无匹配变量</div>
					</div>
				</div>
			</div>

			<!-- 右侧：变量面板 -->
			<div class="pl-4 border-l border-gray-200 w-65 dark:border-gray-700">
				<h4 class="mb-2 text-base font-medium">可用变量</h4>
				<VariablePanel :variables="variableGroups" @select="insertMention" />
			</div>
		</div>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import '@wangeditor-next/editor/dist/css/style.css';
import { Boot, IDomEditor } from '@wangeditor-next/editor';
import { Toolbar, Editor } from '@wangeditor-next/editor-for-vue';
import mentionModule from './mention/index';
import type { MentionElement } from './mention/index';
import VariablePanel, { type VariableItem } from './VariablePanel.vue';
import { usePrintTemplate, getProcessVariables, parseFormVariables, getApprovalVariables, flattenProcessNodes } from './usePrintTemplate';
import { getFlowDetail } from '/@/api/flow/flow';
import { useMessage } from '/@/hooks/message';
import { useVModel, onClickOutside, useEventListener } from '@vueuse/core';

// 注册 mention 模块（全局只注册一次）
let mentionRegistered = false;
if (!mentionRegistered) {
	Boot.registerModule(mentionModule);
	mentionRegistered = true;
}

const props = defineProps<{
	modelValue: boolean;
	flowId: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', val: boolean): void;
}>();

const visible = useVModel(props, 'modelValue', emit);
const message = useMessage();

const { loadTemplate, saveTemplate } = usePrintTemplate();
const loading = ref(false);
const saving = ref(false);
const editorRef = shallowRef<IDomEditor>();
const editorHtml = ref('');
const editorAreaRef = ref<HTMLElement>();

// 编辑器配置
const editorConfig = {
	placeholder: '请输入打印模板内容，可输入 @选择变量并插入',
	MENU_CONF: {},
};

// 变量相关
const allVariables = ref<VariableItem[]>([]);
const variableGroups = computed(() => [
	{ category: 'process', title: '流程信息', items: allVariables.value.filter((v) => v.category === 'process') },
	{ category: 'form', title: '表单数据', items: allVariables.value.filter((v) => v.category === 'form') },
	{ category: 'approval', title: '审批数据', items: allVariables.value.filter((v) => v.category === 'approval') },
]);

// @ 下拉菜单
const showMentionDropdown = ref(false);
const mentionSearch = ref('');
const activeMentionIndex = ref(0);
const mentionPosition = reactive({ left: 0, top: 0 });
const mentionDropdownRef = ref<HTMLElement>();
const editorContainerRef = shallowRef<HTMLElement | null>(null);

// 关闭 @ 下拉菜单的处理函数（需要在外部定义以便正确移除监听器）
const closeMentionMenu = () => {
	showMentionDropdown.value = false;
	mentionSearch.value = '';
	activeMentionIndex.value = 0;
};

const filteredMentionList = computed(() => {
	const keyword = mentionSearch.value.toLowerCase();
	if (!keyword) return allVariables.value;
	return allVariables.value.filter((v) => v.label.toLowerCase().includes(keyword) || v.value.toLowerCase().includes(keyword));
});

watch(filteredMentionList, (list) => {
	if (!list.length) {
		activeMentionIndex.value = 0;
		return;
	}
	if (activeMentionIndex.value >= list.length) {
		activeMentionIndex.value = 0;
	}
});

const handleMentionKeydown = (event: KeyboardEvent) => {
	if (event.isComposing) return;

	if (!showMentionDropdown.value) {
		if (event.key === '@' || (event.shiftKey && event.key === '2')) {
			event.preventDefault();
			showMentionMenu();
		}
		return;
	}

	if (event.key === 'Escape') {
		event.preventDefault();
		closeMentionMenu();
		return;
	}

	if (event.key === 'Backspace') {
		event.preventDefault();
		mentionSearch.value = mentionSearch.value.slice(0, -1);
		return;
	}

	if (event.key === 'ArrowDown') {
		event.preventDefault();
		if (filteredMentionList.value.length) {
			activeMentionIndex.value = (activeMentionIndex.value + 1) % filteredMentionList.value.length;
		}
		return;
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault();
		if (filteredMentionList.value.length) {
			activeMentionIndex.value = (activeMentionIndex.value - 1 + filteredMentionList.value.length) % filteredMentionList.value.length;
		}
		return;
	}

	if (event.key === 'Enter') {
		event.preventDefault();
		const active = filteredMentionList.value[activeMentionIndex.value];
		if (active) insertMention(active);
		return;
	}

	if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
		event.preventDefault();
		mentionSearch.value += event.key;
	}
};

useEventListener(editorContainerRef, 'keydown', (event: KeyboardEvent) => {
	handleMentionKeydown(event);
});

// 编辑器创建回调
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor;
	editorContainerRef.value = (editor.getEditableContainer() as HTMLElement | null) ?? null;
};

// 点击下拉菜单外部关闭
onClickOutside(mentionDropdownRef, () => {
	closeMentionMenu();
});

// 显示 @ 下拉菜单
const showMentionMenu = () => {
	const domSelection = window.getSelection();
	if (!domSelection || domSelection.rangeCount === 0) return;

	const range = domSelection.getRangeAt(0);
	const rect = range.getBoundingClientRect();
	const editorRect = editorAreaRef.value?.getBoundingClientRect();
	if (!editorRect) return;

	const maxLeft = Math.max(editorRect.width - 320 - 8, 8);
	mentionPosition.left = Math.min(Math.max(rect.left - editorRect.left, 8), maxLeft);
	mentionPosition.top = Math.max(rect.bottom - editorRect.top + 4, 8);
	mentionSearch.value = '';
	activeMentionIndex.value = 0;
	showMentionDropdown.value = true;
};

// 插入 mention 变量节点
const insertMention = (item: VariableItem) => {
	const editor = editorRef.value;
	if (!editor) return;

	const mentionNode: MentionElement = {
		type: 'mention',
		value: item.value,
		label: item.label,
		category: item.category,
		children: [{ text: '' }],
	};

	editor.focus();
	editor.restoreSelection();
	editor.insertNode(mentionNode);
	editor.move(1); // 光标移到 mention 之后

	closeMentionMenu();
};

// 加载数据
watch(
	() => props.modelValue,
	async (val) => {
		if (!val || !props.flowId) return;
		loading.value = true;
		try {
			// 并行加载模板和流程详情（获取表单字段）
			const [templateHtml, flowRes] = await Promise.all([loadTemplate(props.flowId), getFlowDetail(props.flowId)]);

			editorHtml.value = templateHtml;

			// 构建变量列表
			const processVars = getProcessVariables();
			const formVars = parseFormVariables(flowRes.data?.formItems || '[]');

			// 审批变量：从流程定义 process JSON 中解析节点结构，展平后提取
			let approvalVars: VariableItem[] = [];
			try {
				const processJson = JSON.parse(flowRes.data?.process || '{}');
				const flatNodes = flattenProcessNodes(processJson.children ? [processJson] : []);
				approvalVars = getApprovalVariables(flatNodes);
			} catch {
				// 解析失败则不展示审批变量
			}

			allVariables.value = [...processVars, ...formVars, ...approvalVars];
		} catch (e) {
			message.error('加载打印模板失败');
		} finally {
			loading.value = false;
		}
	}
);

watch(
	() => props.modelValue,
	(val) => {
		if (!val) closeMentionMenu();
	}
);

// 保存
const handleSave = async () => {
	saving.value = true;
	try {
		await saveTemplate(props.flowId, editorHtml.value);
		message.success('打印模板保存成功');
		visible.value = false;
	} catch (e) {
		message.error('保存打印模板失败');
	} finally {
		saving.value = false;
	}
};

// 清理
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor) editor.destroy();
});
</script>
