import { getPrintTemplate, savePrintTemplate, getFlowDetail } from '/@/api/flow/flow';
import { detail } from '/@/api/flow/processInstance';
import { getProcessStatusLabel } from '/@/views/flow/task/composables/flowStatus';
import { formatStartNodeShow } from '/@/api/flow/task';
import type { VariableItem } from './VariablePanel.vue';
import type { ProcessInstanceRow, ApprovalNode } from '/@/api/flow/processInstance';
import { useTimeoutFn } from '@vueuse/core';

/**
 * HTML 特殊字符转义，防止 XSS 和渲染异常
 */
function escapeHtml(str: string): string {
	if (typeof str !== 'string') str = String(str ?? '');
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * 从 formItems JSON 解析表单字段列表，生成变量定义
 */
export function parseFormVariables(formItemsJson: string): VariableItem[] {
	try {
		const rules = JSON.parse(formItemsJson);
		const items: VariableItem[] = [];
		const extract = (list: any[]) => {
			for (const rule of list) {
				if (rule.field && rule.title) {
					items.push({
						value: `form.${rule.field}`,
						label: rule.title,
						category: 'form',
					});
				}
				if (rule.children && Array.isArray(rule.children)) {
					extract(rule.children);
				}
			}
		};
		extract(Array.isArray(rules) ? rules : []);
		return items;
	} catch {
		return [];
	}
}

/**
 * 构建流程信息固定变量
 */
export function getProcessVariables(): VariableItem[] {
	return [
		{ value: 'process.name', label: '流程名称', category: 'process' },
		{ value: 'process.createTime', label: '发起时间', category: 'process' },
		{ value: 'process.endTime', label: '结束时间', category: 'process' },
		{ value: 'process.status', label: '流程状态', category: 'process' },
		{ value: 'process.starterName', label: '发起人', category: 'process' },
	];
}

/**
 * 将流程定义的树形节点结构展平为扁平数组
 */
export function flattenProcessNodes(nodes: any[]): any[] {
	const result: any[] = [];
	const traverse = (nodeList: any[]) => {
		for (const node of nodeList) {
			result.push(node);
			if (node.children) traverse(Array.isArray(node.children) ? [node.children] : []);
			if (node.branch) traverse(node.branch);
		}
	};
	traverse(nodes);
	return result;
}

/**
 * 构建审批数据变量（根据流程节点信息动态生成）
 * type 0=发起人, type 1=审批人, type 2=抄送
 * 支持扁平数组（formatStartNodeShow 返回）和树形结构（流程定义 process JSON）
 */
export function getApprovalVariables(nodes: ApprovalNode[]): VariableItem[] {
	const items: VariableItem[] = [];
	let index = 0;
	for (const node of nodes) {
		if (node.type === 0 || node.type === 1 || node.type === 2) {
			items.push(
				{ value: `approval.${index}.assigneeName`, label: `${node.name}-处理人`, category: 'approval' },
				{ value: `approval.${index}.completeTime`, label: `${node.name}-处理时间`, category: 'approval' },
				{ value: `approval.${index}.comment`, label: `${node.name}-意见`, category: 'approval' }
			);
			index++;
		}
	}
	items.push({ value: 'approval.allComments', label: '全部审批意见（表格）', category: 'approval' });
	return items;
}

/**
 * 根据流程实例详情 + 审批节点数据，构建变量值映射表
 */
export function buildVariableData(
	row: ProcessInstanceRow,
	formData: Record<string, any>,
	approvalNodes: ApprovalNode[]
): Record<string, string> {
	const data: Record<string, string> = {};

	// 流程信息
	data['process.name'] = row.name || '';
	data['process.createTime'] = row.createTime || '';
	data['process.endTime'] = row.endTime || '';
	data['process.status'] = getProcessStatusLabel(row);

	// 发起人：优先从审批节点 type=0 的 userVoList 中获取
	const starterNode = approvalNodes.find((n) => n.type === 0);
	data['process.starterName'] = starterNode?.userVoList?.[0]?.name || row.starterName || '';

	// 表单数据
	for (const [key, val] of Object.entries(formData)) {
		data[`form.${key}`] = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
	}

	// 审批数据（扁平数组遍历，type 0=发起人, 1=审批人, 2=抄送）
	let index = 0;
	for (const node of approvalNodes) {
		if (node.type === 0 || node.type === 1 || node.type === 2) {
			const user = node.userVoList?.[0];
			data[`approval.${index}.assigneeName`] = user?.name || '';
			data[`approval.${index}.completeTime`] = user?.showTime || '';
			data[`approval.${index}.comment`] = user?.approveDesc || '';
			index++;
		}
	}

	// 全部审批意见表格 HTML
	let allComments = '<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%"><thead><tr><th>节点</th><th>处理人</th><th>时间</th><th>意见</th></tr></thead><tbody>';
	for (const node of approvalNodes) {
		if (node.type === 0 || node.type === 1 || node.type === 2) {
			const users = node.userVoList || [];
			for (const u of users) {
				allComments += `<tr><td>${escapeHtml(node.name)}</td><td>${escapeHtml(u.name || '')}</td><td>${escapeHtml(u.showTime || '')}</td><td>${escapeHtml(u.approveDesc || '')}</td></tr>`;
			}
		}
	}
	allComments += '</tbody></table>';
	data['approval.allComments'] = allComments;

	return data;
}

/**
 * 渲染模板：将 mention span 替换为实际数据值
 * 注意：allComments 的值本身是安全的 HTML 表格，不做二次转义
 */
export function renderTemplate(html: string, data: Record<string, string>): string {
	return html.replace(
		/<span[^>]*data-w-e-type="mention"[^>]*data-value="([^"]*)"[^>]*>[^<]*<\/span>/g,
		(_, key) => {
			const val = data[key] ?? '';
			// allComments 已经是安全构建的 HTML 表格，不转义
			if (key === 'approval.allComments') return val;
			return escapeHtml(val);
		}
	);
}

/**
 * 使用隐藏 iframe 执行打印
 */
export function printHtml(html: string): void {
	const iframe = document.createElement('iframe');
	iframe.style.position = 'fixed';
	iframe.style.left = '-9999px';
	iframe.style.top = '-9999px';
	iframe.style.width = '0';
	iframe.style.height = '0';
	document.body.appendChild(iframe);

	const doc = iframe.contentDocument || iframe.contentWindow?.document;
	if (!doc) {
		document.body.removeChild(iframe);
		return;
	}

	doc.open();
	doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
		body { font-family: "Microsoft YaHei", sans-serif; padding: 20px; color: #333; }
		table { border-collapse: collapse; width: 100%; margin: 10px 0; }
		th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
		th { background-color: #f5f5f5; }
		@media print { body { padding: 0; } }
	</style></head><body>${html}</body></html>`);
	doc.close();

	iframe.contentWindow?.focus();
	iframe.contentWindow?.print();

	// 使用 useTimeoutFn 自动清理定时器
	useTimeoutFn(() => {
		if (document.body.contains(iframe)) {
			document.body.removeChild(iframe);
		}
	}, 1000);
}

/**
 * usePrintTemplate composable
 * 提供模板编辑和打印执行的完整逻辑
 */
export function usePrintTemplate() {
	const loading = ref(false);

	/**
	 * 加载打印模板
	 */
	const loadTemplate = async (flowId: string): Promise<string> => {
		const res = await getPrintTemplate(flowId);
		return res.data || '';
	};

	/**
	 * 保存打印模板
	 */
	const saveTemplate = async (flowId: string, printTemplate: string) => {
		await savePrintTemplate({ flowId, printTemplate });
	};

	/**
	 * 加载流程定义中的表单字段（用于构建变量列表）
	 */
	const loadFormVariables = async (flowId: string): Promise<VariableItem[]> => {
		const res = await getFlowDetail(flowId);
		const formItemsJson = res.data?.formItems || '[]';
		return parseFormVariables(formItemsJson);
	};

	/**
	 * 执行打印：获取模板 + 详情数据 + 审批数据 → 渲染 → 打印
	 */
	const executePrint = async (row: ProcessInstanceRow) => {
		loading.value = true;
		try {
			// 并行获取模板和流程详情
			const [templateRes, detailRes] = await Promise.all([
				getPrintTemplate(row.flowId),
				detail({ processInstanceId: row.processInstanceId }),
			]);

			const templateHtml = templateRes.data;
			if (!templateHtml) {
				throw new Error('该流程未配置打印模板');
			}

			const detailData = detailRes.data;
			const formData = detailData.formData ? JSON.parse(detailData.formData) : {};

			// 获取审批节点数据
			const approvalRes = await formatStartNodeShow({
				flowId: row.flowId,
				processInstanceId: row.processInstanceId,
				paramMap: {},
			});
			const approvalNodes = approvalRes.data || [];

			// 合并行数据和详情数据
			const mergedRow = { ...row, ...detailData };

			// 构建变量值映射
			const variableData = buildVariableData(mergedRow, formData, approvalNodes);

			// 渲染并打印
			const renderedHtml = renderTemplate(templateHtml, variableData);
			printHtml(renderedHtml);
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		loadTemplate,
		saveTemplate,
		loadFormVariables,
		executePrint,
	};
}
