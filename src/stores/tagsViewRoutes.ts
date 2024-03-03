import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import { useMessage } from '/@/hooks/message';
import { useThemeConfig } from '/@/stores/themeConfig';
import { i18n } from '/@/i18n/index';

/**
 * TagsView 路由列表
 * @methods setTagsViewRoutes 设置 TagsView 路由列表
 * @methods setCurrenFullscreen 设置开启/关闭全屏时的 boolean 状态
 */
export const useTagsViewRoutes = defineStore('tagsViewRoutes', {
	state: (): TagsViewRoutesState => ({
		tagsViewRoutes: [],
		isTagsViewCurrenFull: false,
		favoriteRoutes: [],
	}),
	actions: {
		async setTagsViewRoutes(data: Array<string>) {
			this.tagsViewRoutes = data;
		},
		setCurrenFullscreen(bool: Boolean) {
			Session.set('isTagsViewCurrenFull', bool);
			this.isTagsViewCurrenFull = bool;
		},
		async setFavoriteRoutes(item) {
			const storesThemeConfig = useThemeConfig();
			const { themeConfig } = storeToRefs(storesThemeConfig);
			// 判断已经存储的长度,如果超过主题设置则警告
			if (this.favoriteRoutes.length > themeConfig.value.quickLinkNum) {
				useMessage().error(i18n.global.t('tagsView.favoriteMax'))
				return
			}
			this.favoriteRoutes.unshift(item);
		},
		async delFavoriteRoutes(item) {
			this.favoriteRoutes.splice(this.favoriteRoutes.indexOf(item), 1);
		},
	},
	persist: {
		enabled: true,
		strategies: [
			{
				key: 'tagsViewRoutes', //自定义 Key值
				storage: localStorage, // 选择存储方式
			},
		],
	},
});
