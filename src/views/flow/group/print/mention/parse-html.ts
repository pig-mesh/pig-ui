import { MentionElement } from './mention-element';

/**
 * 从 HTML 解析回 mention 元素
 */
function parseMentionHtml(domElem: Element): MentionElement {
	const value = domElem.getAttribute('data-value') || '';
	const label = domElem.getAttribute('data-label') || '';
	const category = domElem.getAttribute('data-category') || 'process';

	return {
		type: 'mention',
		value,
		label,
		category,
		children: [{ text: '' }],
	};
}

export const parseMentionHtmlConf = {
	selector: 'span[data-w-e-type="mention"]',
	parseElemHtml: parseMentionHtml,
};
