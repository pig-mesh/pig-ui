import { h, VNode } from 'snabbdom';
import { IDomEditor } from '@wangeditor-next/editor';
import { MentionElement } from './mention-element';

/**
 * 渲染 mention 元素为蓝色标签
 */
function renderMention(elem: MentionElement, _children: VNode[] | null, _editor: IDomEditor): VNode {
	const { label } = elem;

	return h(
		'span',
		{
			props: { contentEditable: false },
			style: {
				display: 'inline-block',
				padding: '0 4px',
				margin: '0 2px',
				backgroundColor: '#e8f4fd',
				color: '#1890ff',
				borderRadius: '3px',
				fontSize: '13px',
				lineHeight: '22px',
				cursor: 'default',
				userSelect: 'none',
			},
		},
		[`@${label}`]
	);
}

export const renderMentionConf = {
	type: 'mention',
	renderElem: renderMention,
};
