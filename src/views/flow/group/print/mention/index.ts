import { IModuleConf } from '@wangeditor-next/editor';
import { renderMentionConf } from './render-elem';
import { mentionToHtmlConf } from './elem-to-html';
import { parseMentionHtmlConf } from './parse-html';
import { withMention } from './plugin';

/**
 * wangeditor mention 模块
 * 必须在创建编辑器之前注册，且只能注册一次
 */
const mentionModule: Partial<IModuleConf> = {
	editorPlugin: withMention,
	renderElems: [renderMentionConf],
	elemsToHtml: [mentionToHtmlConf],
	parseElemsHtml: [parseMentionHtmlConf],
};

export default mentionModule;
export type { MentionElement } from './mention-element';
