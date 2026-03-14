import {createI18n} from 'vue-i18n';
import pinia from '/@/stores/index';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {Local, Session} from '/@/utils/storage';
import {info} from '/@/api/admin/i18n';
import {useMemoize, promiseTimeout} from '@vueuse/core';

// 定义语言国际化内容

/**
 * 说明：
 * 须在 pages 下新建文件夹（建议 `要国际化界面目录` 与 `i18n 目录` 相同，方便查找），
 * 注意国际化定义的字段，不要与原有的定义字段相同。
 * 1、/src/i18n/lang 下的 ts 为框架的国际化内容
 * 2、/src/i18n/pages 下的 ts 为各界面的国际化内容
 */

// element plus 自带国际化
import enLocale from 'element-plus/es/locale/lang/en';
import zhcnLocale from 'element-plus/es/locale/lang/zh-cn';

// 支持的语言类型
const SUPPORTED_LOCALES = ['en', 'zh-cn'] as const;
type LocaleKey = (typeof SUPPORTED_LOCALES)[number];

// 定义变量内容
const messages: Record<string, any> = {};
const element: Record<LocaleKey, any> = {en: enLocale, 'zh-cn': zhcnLocale};
const itemize: Record<LocaleKey, any[]> = {'en': [], 'zh-cn': []};
const modules: Record<string, any> = import.meta.glob('./**/*.ts', {eager: true});
const pages: Record<string, any> = import.meta.glob('./../../**/**/**/i18n/*.ts', {eager: true});

/** 对自动引入的 modules 按语言分类 */
function processModules(mods: Record<string, any>, target: Record<string, any[]>) {
    for (const path in mods) {
        const match = path.match(/\/(\w+(?:-\w+)?)\.ts$/);
        if (match?.[1] && target[match[1]]) {
            target[match[1]].push(mods[path].default);
        }
    }
}

processModules(modules, itemize);
processModules(pages, itemize);

/** 合并数组中的对象为单个对象 */
const mergeObjects = (arr: any[]) => Object.assign({}, ...arr);

// 构建各语言的消息对象
for (const locale of SUPPORTED_LOCALES) {
    messages[locale] = {
        name: locale,
        el: element[locale]?.el || {},
        ...mergeObjects(itemize[locale]),
    };
}

// 读取 pinia 默认语言
const stores = useThemeConfig(pinia);
const {themeConfig} = storeToRefs(stores);

// 导出语言国际化
export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    locale: themeConfig.value.globalI18n,
    fallbackLocale: zhcnLocale.name,
    messages,
});

const I18N_REMOTE_CACHE_PREFIX = 'i18nRemoteMessages:';
let remoteI18nLoadedKey = '';

/**
 * 获取当前加载状态的唯一标识
 * @returns 租户ID和Token组合的字符串
 */
function getCurrentLoadedKey() {
    return `${Session.getTenant()}:${Session.getToken() || ''}`;
}

/**
 * 远程 i18n 加载任务（带缓存和重试机制）
 * 使用 useMemoize 避免重复请求，相同参数只执行一次
 */
const ensureRemoteI18nTask = useMemoize(
    async (tenantId: string | number, token: string, retry: number) => {
        const loadedKey = `${tenantId}:${token}`;
        if (getCurrentLoadedKey() !== loadedKey) return false;

        // 优先从本地缓存加载，避免白屏
        loadRemoteMessagesFromCache(tenantId);

        // 重试机制：指数退避策略
        for (let attempt = 0; attempt <= retry; attempt++) {
            try {
                const messageLocal = await fetchRemoteI18nMessages();
                // 持久化到本地存储
                Local.set(getRemoteCacheKey(tenantId), messageLocal);

                // 二次校验：防止加载期间用户切换账号/租户
                if (getCurrentLoadedKey() === loadedKey) {
                    mergeRemoteMessages(messageLocal);
                    i18n.global.locale.value = themeConfig.value.globalI18n;
                    remoteI18nLoadedKey = loadedKey;
                }

                return true;
            } catch {
                // 失败后等待递增时间再重试（200ms, 400ms, 600ms...）
                if (attempt < retry) await promiseTimeout(200 * (attempt + 1));
            }
        }

        // 所有重试失败，清除缓存以便下次重新尝试
        ensureRemoteI18nTask.delete(tenantId, token, retry);
        return false;
    },
    {
        getKey: (tenantId, token, retry) => `${tenantId}:${token}:${retry}`,
    }
);

/**
 * 生成远程 i18n 缓存的存储 key
 * @param tenantId 租户ID
 */
function getRemoteCacheKey(tenantId: string | number) {
    return `${I18N_REMOTE_CACHE_PREFIX}${tenantId}`;
}

/**
 * 合并远程消息到 i18n 实例
 */
function mergeRemoteMessages(messageLocal: Record<string, any>) {
    for (const locale of SUPPORTED_LOCALES) {
        if (messageLocal[locale]) {
            i18n.global.mergeLocaleMessage(locale, messageLocal[locale]);
        }
    }
}

/**
 * 从本地存储加载远程 i18n 缓存
 * @param tenantId 租户ID，默认当前租户
 * @returns 是否成功加载
 */
function loadRemoteMessagesFromCache(tenantId: string | number = Session.getTenant()) {
    const cached = Local.get(getRemoteCacheKey(tenantId));
    if (!cached) return false;
    mergeRemoteMessages(cached);
    return true;
}

// 应用启动时优先加载本地缓存，避免网络抖动导致菜单出现 i18n key
loadRemoteMessagesFromCache();

/**
 * 从远程 API 获取并格式化 i18n 消息
 * @throws Error 当响应数据无效或为空时抛出错误
 */
async function fetchRemoteI18nMessages() {
    const {data} = await info();

    // 构建消息对象，将数组/对象统一转为合并后的对象
    const toArray = (v: unknown) => (Array.isArray(v) ? v : v && typeof v === 'object' ? [v] : []);
    const messageLocal: Record<string, any> = {};

    for (const locale of SUPPORTED_LOCALES) {
        if (data[locale]) {
            messageLocal[locale] = {name: locale, ...mergeObjects(toArray(data[locale]))};
        }
    }

    // 校验是否有有效内容
    const hasContent = SUPPORTED_LOCALES.some(
        (locale) => Object.keys(messageLocal[locale] || {}).length > 1
    );
    if (!hasContent) {
        throw new Error('Empty remote i18n payload');
    }

    return messageLocal;
}

/**
 * 确保远程 i18n 词条已加载（支持账号/租户切换 + 简单重试）
 * @description 动态菜单渲染前调用，避免出现 router.xxx 之类的 key
 */
export async function ensureRemoteI18nLoaded(options: { force?: boolean; retry?: number } = {}) {
    const tenantId = Session.getTenant();
    const token = Session.getToken() || '';
    const loadedKey = `${tenantId}:${token}`;
    if (!options.force && remoteI18nLoadedKey === loadedKey) return true;

    const retry = Math.max(0, options.retry ?? 1);
    if (options.force) ensureRemoteI18nTask.delete(tenantId, token, retry);
    return ensureRemoteI18nTask(tenantId, token, retry);
}
