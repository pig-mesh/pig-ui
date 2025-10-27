import {createI18n} from 'vue-i18n';
import pinia from '/@/stores/index';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {info} from '/@/api/admin/i18n';

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

// 定义变量内容
const messages: Record<string, any> = {};
const element = {en: enLocale, 'zh-cn': zhcnLocale};
const itemize = {en: [] as any[], 'zh-cn': [] as any[]};
const modules: Record<string, any> = import.meta.glob('./**/*.ts', {eager: true});
const pages: Record<string, any> = import.meta.glob('./../../**/**/**/i18n/*.ts', {eager: true});

// 对自动引入的 modules 进行分类 en、zh-cn、zh-tw
function processModules(modules: Record<string, any>, target: Record<string, any[]>) {
    for (const path in modules) {
        const key = path.match(/(\S+)\/(\S+).ts/);
        if (key && key[2] && target[key[2]]) {
            target[key[2]].push(modules[path].default);
        }
    }
}

processModules(modules, itemize);
processModules(pages, itemize);

// 合并数组对象（非标准数组对象，数组中对象的每项 key、value 都不同）
function mergeArrObj<T extends Record<string, any[]>>(list: T, key: keyof T): Record<string, any> {
    if (!list[key] || !Array.isArray(list[key])) {
        return {};
    }

    return list[key].reduce((acc: Record<string, any>, current: Record<string, any>) => {
        return { ...acc, ...current };
    }, {});
}

for (const key in itemize) {
    const elementConfig = element[key as keyof typeof element];
    messages[key] = {
        name: key,
        el: elementConfig?.el || {},
        ...mergeArrObj(itemize, key as keyof typeof itemize),
    };
}

// 读取 pinia 默认语言
const stores = useThemeConfig(pinia);
const {themeConfig} = storeToRefs(stores);

// 导出语言国际化
export const i18n = createI18n({
    legacy: false,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    locale: themeConfig.value.globalI18n,
    fallbackLocale: zhcnLocale.name,
    messages,
});

await fetchI18n()

// 远程获取i18n
async function fetchI18n() {
    try {
        const infoI18n = await info();
        const messageLocal: Record<string, any> = {};
        const itemizeLocal = {en: [] as any[], 'zh-cn': [] as any[]};

        // 添加数据存在性检查
        if (infoI18n?.data?.data) {
            if (infoI18n.data.data['zh-cn']) {
                itemizeLocal['zh-cn'].push(...infoI18n.data.data['zh-cn']);
            }
            if (infoI18n.data.data.en) {
                itemizeLocal.en.push(...infoI18n.data.data.en);
            }
        }

        for (const key in itemizeLocal) {
            messageLocal[key] = {
                name: key,
                ...mergeArrObj(itemizeLocal, key as keyof typeof itemizeLocal),
            };
        }

        // 安全地合并本地化消息
        if (messageLocal['zh-cn']) {
            i18n.global.mergeLocaleMessage('zh-cn', messageLocal['zh-cn']);
        }
        if (messageLocal['en']) {
            i18n.global.mergeLocaleMessage('en', messageLocal['en']);
        }

        i18n.global.locale.value = themeConfig.value.globalI18n;
    } catch (error) {
        console.error('Failed to fetch i18n data:', error);
        // 静默失败，不影响应用启动
    }
}
