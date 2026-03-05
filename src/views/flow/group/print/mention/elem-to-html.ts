import { MentionElement } from './mention-element';

/**
 * mention 元素序列化为 HTML
 * 输出格式：<span data-w-e-type="mention" data-value="form.userName" data-label="用户名">@用户名</span>
 */
function mentionToHtml(elem: MentionElement): string {
	const { value, label, category } = elem;
	return `<span data-w-e-type="mention" data-value="${value}" data-label="${label}" data-category="${category}">@${label}</span>`;
}

export const mentionToHtmlConf = {
	type: 'mention',
	elemToHtml: mentionToHtml,
};
