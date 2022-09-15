import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'
const common = {
  state: {
    language: getStore({ name: 'language' }) || 'zh-cn',
    isCollapse: false,
    isFullScren: false,
    isMenu: true,
    isSearch: false,
    isRefresh: true,
    isLock: getStore({ name: 'isLock' }),
    lockPasswd: getStore({ name: 'lockPasswd' }) || '',
    website: website,
    setting: website.setting,
    likeTopMenuId: undefined
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu;
    },
    SET_IS_REFRESH: (state, refresh) => {
      state.isRefresh = refresh;
    },
    SET_IS_SEARCH: (state, search) => {
      state.isSearch = search;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: 'themeName',
        content: state.themeName,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      });
      removeStore({
        name: 'isLock',
        type: 'session'
      });
    },
    LIKE_TOP_MENUID: (state, obj) => {
      if (obj.id === undefined) {
        obj.id = getStore({ name: 'LIKE_TOP_MENUID' })
      }

      state.likeTopMenuId = obj.id
      setStore({
        name: 'LIKE_TOP_MENUID',
        content: state.likeTopMenuId,
        type: 'session'
      })
    },
    REMOVE_LIKE_TOP_MENUID: (state) => {
      state.likeTopMenuId = undefined
      removeStore({
        name: 'LIKE_TOP_MENUID',
        type: 'session'
      })
    }
  }
}
export default common
