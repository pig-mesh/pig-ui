import { DomEditor, IDomEditor } from '@wangeditor-next/editor';

/**
 * wangeditor plugin：将 mention 元素注册为 inline + void
 */
export function withMention<T extends IDomEditor>(editor: T): T {
	const { isInline, isVoid } = editor;
	const newEditor = editor;

	newEditor.isInline = (elem) => {
		const type = DomEditor.getNodeType(elem);
		if (type === 'mention') return true;
		return isInline(elem);
	};

	newEditor.isVoid = (elem) => {
		const type = DomEditor.getNodeType(elem);
		if (type === 'mention') return true;
		return isVoid(elem);
	};

	return newEditor;
}
