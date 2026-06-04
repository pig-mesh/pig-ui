# 验证码组件

> 当前 `boot4` 分支基于 Vue 3.5 + Element Plus 2.13 开发，验证码组件对接 Spring Boot 4 后端的行为验证码、数学图形验证码和短信验证码发送接口。

<p align="center">
 <img src="https://img.shields.io/badge/Pig%20UI-4.0-success.svg" alt="Pig UI">
 <img src="https://img.shields.io/badge/Vue-3.5-blue.svg" alt="Vue">
 <img src="https://img.shields.io/badge/Element%20Plus-2.13-blue.svg" alt="Element Plus">
 <img src="https://img.shields.io/badge/Vite-5.4-blue.svg" alt="Vite">
 <img src="https://img.shields.io/badge/TypeScript-4.9-blue.svg" alt="TypeScript">
</p>

## 组件说明

`src/components/Verifition` 提供登录、注册、找回密码、修改手机号和消息发送等场景需要的验证码能力。

| 组件 | 角色 | 适用场景 |
| --- | --- | --- |
| `Verify.vue` | 行为验证码弹窗 | 站点配置为 `blockPuzzle` 或 `clickWord` 时使用 |
| `MathCaptcha.vue` | 数学图形验证码弹窗 | 站点配置为 `math` 时使用，或在短信、邮件发送前做二次校验 |
| `SmsCodeButton.vue` | 短信验证码按钮 | 登录、注册、找回密码、修改手机号等发送短信验证码场景 |

三类组件职责保持拆分：`Verify.vue` 与 `MathCaptcha.vue` 只负责展示和返回验证码结果，不直接调用业务接口；`SmsCodeButton.vue` 负责读取站点配置、选择验证码类型、调用短信发送接口并管理 60 秒倒计时。

## 核心依赖

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| Pig UI | 4.0.0 | 当前前端工程版本 |
| Vue | 3.5.34 | 组件运行框架 |
| Element Plus | 2.13.7 | 弹窗、按钮、输入框等基础组件 |
| Vite | 5.4.21 | 本地开发与构建 |
| TypeScript | 4.9.5 | 类型约束 |
| Pinia | 2.0.36 | 读取站点验证码配置 |
| VueUse | 10.11.1 | `SmsCodeButton` 倒计时管理 |

## 验证码类型

验证码类型来自 `src/stores/siteConfig.ts` 的 `CaptchaType` 枚举：

| 值 | 说明 | 使用组件 |
| --- | --- | --- |
| `clickWord` | 点选文字验证码 | `Verify.vue` |
| `blockPuzzle` | 滑块拼图验证码 | `Verify.vue` |
| `math` | 数学图形验证码 | `MathCaptcha.vue` |
| `none` | 关闭登录验证码 | 登录页按业务逻辑处理；短信按钮会兜底为 `clickWord` |

`SmsCodeButton.vue` 会读取 `useSiteConfig().siteConfig.captchaType`。当配置值不是 `clickWord`、`blockPuzzle` 或 `math` 时，组件会兜底使用 `clickWord`。

## 后端接口约定

数学验证码图片地址由 `MathCaptcha.vue` 根据前端运行模式自动拼接：

| 模式 | `VITE_IS_MICRO` | 图片地址前缀 |
| --- | --- | --- |
| 微服务 | 非 `false` | `/auth/code/image` |
| 单体 | `false` | `/admin/code/image` |

`MathCaptcha.vue` 和 `Verify.vue` 成功后统一返回：

```ts
{
	captchaVerification: string;
}
```

数学验证码的 `captchaVerification` 格式为：

```text
${randomStr}---${code}
```

短信验证码发送由 `SmsCodeButton.vue` 调用 `sendMobileCode`，请求参数包含：

| 参数 | 说明 |
| --- | --- |
| `mobile` | 目标手机号 |
| `registered` | 是否要求手机号已注册，注册场景传 `false` |
| `captchaType` | 当前验证码类型 |
| `captchaVerification` | 行为验证码或数学验证码返回的校验串 |

## MathCaptcha

`MathCaptcha.vue` 是数学图形验证码弹窗，对外暴露命令式 ref API。父组件通过 `show()`、`close()`、`refresh()` 控制弹窗，通过 `@success` 获取 `captchaVerification` 后自行调用业务接口。

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placeholder` | `string` | `''` | 输入框占位文案 |
| `emptyMessage` | `string` | `''` | 用户未输入验证码时的错误提示；为空时不提示 |
| `loading` | `boolean` | `false` | 确认按钮加载状态，由父组件请求状态驱动 |

### 暴露方法

| 方法 | 说明 |
| --- | --- |
| `show()` | 打开弹窗，并刷新验证码图片 |
| `close()` | 关闭弹窗 |
| `refresh()` | 重新生成 `randomStr`、清空输入并刷新图片 |

### 事件

| 事件 | 载荷 | 触发条件 |
| --- | --- | --- |
| `success` | `{ captchaVerification: string }` | 用户输入验证码并点击确认或按回车 |

### 使用示例

```vue
<template>
	<el-button @click="onSubmit">发送</el-button>

	<MathCaptcha
		ref="mathRef"
		:placeholder="t('sms.inputCaptchaTip')"
		:emptyMessage="t('sms.captchaRequired')"
		:loading="loading"
		@success="handleCaptchaSuccess"
	/>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { sendSms } from '/@/api/admin/message';
import { useMessage } from '/@/hooks/message';
import { CaptchaType } from '/@/stores/siteConfig';

const MathCaptcha = defineAsyncComponent(() => import('/@/components/Verifition/MathCaptcha.vue'));

const { t } = useI18n();
const mathRef = ref();
const loading = ref(false);

const onSubmit = () => {
	mathRef.value?.show();
};

const handleCaptchaSuccess = async (params: { captchaVerification: string }) => {
	try {
		loading.value = true;
		const { ok, msg } = await sendSms({
			captchaType: CaptchaType.Math,
			captchaVerification: params.captchaVerification,
		});

		if (ok) {
			useMessage().success('发送成功');
			mathRef.value?.close();
			return;
		}

		useMessage().error(msg);
		mathRef.value?.refresh();
	} catch (error: any) {
		useMessage().error(error?.msg || error?.message);
		mathRef.value?.refresh();
	} finally {
		loading.value = false;
	}
};
</script>
```

## SmsCodeButton

`SmsCodeButton.vue` 是短信验证码发送按钮，内部完成前置表单校验、验证码弹窗选择、短信发送和倒计时。

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mobile` | `string` | - | 目标手机号 |
| `registered` | `boolean` | `true` | 是否要求手机号已注册 |
| `textKey` | `string` | `'mobile'` | i18n 文案命名空间前缀 |
| `validate` | `() => Promise<unknown> \| unknown` | - | 点击按钮前执行的表单校验函数 |

按钮的 `class`、`size`、`type` 等额外属性会透传到内部 `el-button`。

### i18n 文案

调用方需要在对应 i18n 文件中提供以下 key：

| key | 说明 |
| --- | --- |
| `${textKey}.codeText` | 按钮默认文案 |
| `${textKey}.seconds` | 倒计时后缀 |
| `${textKey}.sendSuccess` | 发送成功提示 |
| `${textKey}.sendFailed` | 发送失败兜底提示 |
| `${textKey}.codeRequired` | 数学验证码为空时的错误提示 |

项目已有 `mobile.*` 和 `register.*` 两套文案，分别用于登录类页面和注册页。

### 使用示例

登录、找回密码、修改手机号等场景可使用默认 `textKey="mobile"`：

```vue
<template>
	<el-form-item prop="code">
		<div class="flex gap-3">
			<el-input v-model="loginForm.code" placeholder="请输入验证码" />
			<SmsCodeButton
				:mobile="loginForm.mobile"
				:validate="() => loginFormRef?.validateField('mobile')"
				class="w-[120px] h-11"
			/>
		</div>
	</el-form-item>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import SmsCodeButton from '/@/components/Verifition/SmsCodeButton.vue';

const loginFormRef = ref();
const loginForm = reactive({ mobile: '', code: '' });
</script>
```

注册页需要允许未注册手机号，并切换注册页文案：

```vue
<SmsCodeButton
	:mobile="state.ruleForm.phone"
	:registered="false"
	:validate="() => dataFormRef?.validateField('phone')"
	text-key="register"
	class="w-[120px] h-11"
/>
```

### 行为流程

| 步骤 | 组件行为 |
| --- | --- |
| 点击按钮 | 调用 `validate()`；校验失败时退出 |
| 站点配置为 `clickWord` 或 `blockPuzzle` | 打开 `Verify.vue` 行为验证码 |
| 站点配置为 `math` | 打开 `MathCaptcha.vue` 数学验证码 |
| 验证完成 | 调用 `sendMobileCode` 发送短信 |
| 发送成功 | 关闭数学验证码弹窗并开始 60 秒倒计时 |
| 发送失败 | 数学验证码场景自动刷新图片，等待用户重试 |

## Verify.vue

`Verify.vue` 是行为验证码入口组件，按 `captchaType` 分发到滑块拼图或点选文字组件。

| `captchaType` | 内部组件 | 说明 |
| --- | --- | --- |
| `blockPuzzle` | `VerifySlide` | 滑块拼图验证码 |
| `clickWord` | `VerifyPoints` | 点选文字验证码 |

纯前置校验场景可以直接使用 `Verify.vue`，例如登录密码模式下的反爬虫校验：

```vue
<template>
	<Verify ref="verifyRef" mode="pop" :captchaType="captchaType" @success="handleVerifySuccess" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { CaptchaType, useSiteConfig } from '/@/stores/siteConfig';

const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));
const { siteConfig } = storeToRefs(useSiteConfig());

const verifyRef = ref();
const captchaType = computed(() => siteConfig.value.captchaType || CaptchaType.ClickWord);

const handleVerifySuccess = (params: { captchaVerification: string }) => {
	// 继续提交登录或其他业务请求。
};
</script>
```

## 接入约定

- 业务请求由父组件持有，展示组件只返回 `captchaVerification`。
- 短信验证码场景优先使用 `SmsCodeButton.vue`，不要在页面里重复实现倒计时和验证码类型选择。
- 数学验证码失败后应调用 `refresh()`，避免用户继续提交旧图片验证码。
- 需要直接使用行为验证码时，只给 `Verify.vue` 传 `clickWord` 或 `blockPuzzle`。
- 路径名 `Verifition` 为历史目录名，新增引用继续沿用 `/@/components/Verifition/...`，不要另建同义目录。
