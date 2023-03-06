## 全局组件

- 组件支持`四种`svg 图标
- `四种`图标均支持 color 和 size 属性，使用示例见下文：

```mermaid
# font-awesome的图标，使用 fa 作为前缀（带个空格）
<SvgIcon name="fa fa-pencil" />

# element-plus 的图标，使用 el-icon 作为前缀，图标名称请使用：首字母大写的驼峰语法
<SvgIcon name="ele-icon-Close" color="#8595F4" size="20" />

# 本地`/src/assets/icons`文件夹内的SVG图标，使用 local 作为前缀，文件名作为后缀
# 文件自动加载，新增请重新编译
<SvgIcon name="local-logo" />

# 阿里iconfont的图标，使用 iconfont 作为前缀（带个空格）
<SvgIcon name="iconfont icon-user" size="20" />
```

有时，Icon 组件会覆盖不了图标的原有颜色或大小，请检查 SVG 文件的源代码。

## 图标添加与配置

### 本地图标

1. 将 SVG 图标文件，放入本地`/src/assets/icons`文件夹，然后重新编译项目。
2. 系统会自动加载该目录下的所有图标文件备用，现在你可以使用`Icon`组件来显示图标了。
3. 示例：`<SvgIcon name="local-SVG的文件名" />`
4. 不建议在此文件夹放置`非常大、非常多`的文件，可能会影响系统加载速度，当确有此方面需求时，请将文件放置到其他位置，并单独导入和使用图标。

### font-awesome 图标

1. 此图标库目前 `pigx-ui` 已经默认加载。加载代码在 `/src/utils/setIconfont.ts`中的 cssUrls 中。
2. 你可以直接使用 font-awesome 4.7.0 的所有图标，这些图标可以在这里 https://fontawesome.com.cn/faicons/ 找到，当然你也可以直接使用图标选择器寻找图标。
3. 示例：<SvgIcon name="fa fa-pencil" />，注意图标名称一定是以 fa 加一个空格开头

### element-plus 图标

1. 此图标库目前 `pigx-ui` 已经默认加载，加载代码在 `/src/main.ts` 执行的 elementIcons 方法中。
2. 你可以直接使用 `element-plus/icons-vue ^2.0.10` 的所有图标，在使用 `element-plus` 图标时，请使用`ele` 作为前缀，图标名称请使用：首字母大写的驼峰语法。
3. 示例：<SvgIcon name="ele-RefreshRight" />

### iconfont 图标

1. 目前系统未使用任何 iconfont 图标，你可以获取 iconfont 图标库项目的 Font class 链接后，设置到 `/src/utils/setIconfont.ts` 中的 `cssUrls` 中，系统会自动加载链接中的所有图标以供使用。
2. 示例：`<SvgIcon name="iconfont icon-user" />`，注意图标名称一定是以 iconfont 加一个空格开头，以图标名称结尾。
