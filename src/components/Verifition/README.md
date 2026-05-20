# Verifition 验证码组件

本目录提供验证码相关的三类组件，覆盖**行为验证**（滑动 / 点选）、**数学图形验证**和**短信验证码按钮**三种场景。

| 组件 | 角色 | 适用场景 |
| --- | --- | --- |
| `Verify.vue` | 行为验证码弹窗（滑动 / 点选） | 站点配置为 `blockPuzzle` 或 `clickWord` 时使用 |
| `MathCaptcha.vue` | 数学图形验证码弹窗 | 站点配置为 `Math` 时使用，或在 sender 类页面中作为发送前的二次校验 |
| `SmsCodeButton.vue` | 短信倒计时按钮 | 登录 / 注册 / 找回密码 / 修改手机号等需要发送短信验证码的场景 |

三者职责拆分清晰：`Verify` 与 `MathCaptcha` 是**展示层**，不包含业务调用；`SmsCodeButton` 在内部按站点配置自动挑选行为码或数学码，并完成短信发送流程。

---

## MathCaptcha 数学图形验证码

### 干啥的

封装数学图形验证码（图片 + 4 位输入）的弹窗组件，对外暴露**命令式 ref API**：父组件通过 `show()` / `close()` / `refresh()` 控制弹窗，通过 `@success` 事件拿到拼接好的 `captchaVerification` 字符串后自行调用业务接口。

它**不**调用任何业务接口，业务流程由父组件持有，便于在不同业务场景（短信发送、邮件发送、登录等）中复用。

### Props

| 名称 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `placeholder` | `string` | `''` | 输入框 placeholder，建议由调用方传入业务化文案 |
| `emptyMessage` | `string` | `''` | 用户点确认但未输入时的错误提示文案；为空时不展示错误，仍不 emit `success` |
| `loading` | `boolean` | `false` | 透传给确认按钮的 loading 状态；建议绑定父组件的请求 loading |

### 暴露方法

通过模板 ref 调用：

| 方法 | 说明 |
| --- | --- |
| `show()` | 打开弹窗，并自动调用一次 `refresh()` 重置图片 |
| `close()` | 关闭弹窗（保留输入框内容） |
| `refresh()` | 重新生成 `randomStr`、清空输入、刷新验证码图片 URL |

### 事件

| 事件 | 载荷 | 触发条件 |
| --- | --- | --- |
| `success` | `{ captchaVerification: string }` | 用户输入非空并点确认或按回车。`captchaVerification` 格式为 `${randomStr}---${code}` |

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
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { sendSms } from '/@/api/admin/message';
import { CaptchaType } from '/@/stores/siteConfig';

const MathCaptcha = defineAsyncComponent(() => import('/@/components/Verifition/MathCaptcha.vue'));

const { t } = useI18n();
const mathRef = ref();
const loading = ref(false);

const onSubmit = () => {
	// 业务表单校验通过后，打开数学验证码弹窗
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
		} else {
			useMessage().error(msg);
			mathRef.value?.refresh();
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		mathRef.value?.refresh();
	} finally {
		loading.value = false;
	}
};
</script>
```

### 父子职责约定

| 场景 | 子组件（MathCaptcha） | 父组件 |
| --- | --- | --- |
| 打开弹窗 | 由 `show()` 触发 | 调 `mathRef.value?.show()` |
| 用户提交输入 | 校验非空 → emit `success` | 收到事件后调业务接口 |
| 业务成功 | 等父组件调用 | 调 `mathRef.value?.close()` |
| 业务失败 | 等父组件调用 | 调 `mathRef.value?.refresh()` |
| 用户取消 | 自管理（关闭按钮） | 无需处理 |

记住一句话：**父持有业务流程主动权，子只管展示**。

---

## SmsCodeButton 短信倒计时按钮

### 干啥的

发送短信验证码场景下的"获取验证码"按钮。内部完成三件事：

1. **前置校验** — 调用父组件传入的 `validate` 函数（通常是 Element Plus 的 `validateField`）
2. **验证码挑选** — 根据站点配置 `siteConfig.captchaType` 自动选择行为验证（`Verify`）或数学验证（`MathCaptcha`）
3. **发送 + 倒计时** — 调用 `sendMobileCode` 接口；成功后启动 60 秒倒计时，倒计时期间按钮禁用

按钮文案、提示文案均通过 `textKey` 索引到 i18n 命名空间，支持登录 / 注册 / 找回密码等不同业务复用同一按钮组件。

### Props

| 名称 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `mobile` | `string` | — | 目标手机号 |
| `registered` | `boolean` | `true` | 是否要求手机号已注册（注册场景需传 `false`） |
| `textKey` | `string` | `'mobile'` | i18n 命名空间前缀，按钮文案走 `t('${textKey}.codeText')` 等 |
| `validate` | `() => Promise<unknown> \| unknown` | — | 点击按钮时的前置校验函数，校验失败应抛错或返回 reject |

按钮额外的 HTML 属性（`class`、`size`、`type` 等）通过 `inheritAttrs: false + v-bind="useAttrs()"` 透传到内部的 `el-button`。

### `textKey` 需要的 i18n key

调用方必须在 i18n 文件中提供以下 key：

| key | 用途 |
| --- | --- |
| `${textKey}.codeText` | 按钮默认文案，例如「获取验证码」 |
| `${textKey}.seconds` | 倒计时后缀，例如「秒」 |
| `${textKey}.sendSuccess` | 发送成功 toast |
| `${textKey}.sendFailed` | 发送失败 toast 兜底文案 |
| `${textKey}.codeRequired` | 数学验证码输入为空时的错误提示 |

项目已有 `mobile.*` 和 `register.*` 两套，分别用于登录类页面和注册页。

### 使用示例

**登录页 / 找回密码 / 修改手机号**（使用默认 `textKey="mobile"`）：

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
import SmsCodeButton from '/@/components/Verifition/SmsCodeButton.vue';

const loginFormRef = ref();
const loginForm = reactive({ mobile: '', code: '' });
</script>
```

**注册页**（需要 `registered=false` 且使用 `text-key="register"`）：

```vue
<SmsCodeButton
	:mobile="state.ruleForm.phone"
	:registered="false"
	:validate="() => dataFormRef?.validateField('phone')"
	text-key="register"
	class="w-[120px] h-11"
/>
```

### 行为说明

| 用户操作 | 组件行为 |
| --- | --- |
| 点击按钮 | 调 `validate()`；失败则静默退出（表单项自展示错误） |
| 站点配置为行为验证 | 弹出 `Verify` 滑动 / 点选弹窗 |
| 站点配置为数学验证 | 弹出 `MathCaptcha` 输入弹窗 |
| 验证完成 | 自动调 `sendMobileCode` 发送短信 |
| 发送成功 | 60 秒倒计时，倒计时期间按钮禁用 |
| 发送失败（数学码） | 自动刷新验证码图片，等待重试 |

### 不需要传什么

- 不需要传 `siteConfig.captchaType`：组件内部自动读取
- 不需要传 `MathCaptcha` 实例或行为验证组件实例：组件内部按需异步加载
- 不需要管理倒计时状态：内部用 `useIntervalFn` 自管理

---

## 与 Verify.vue 的关系

`Verify.vue` 是行为验证码（滑动 / 点选）的弹窗组件，命令式 ref API 形态（`show()` + `@success` 事件）。如果你的场景是**纯前置校验**（不发送短信）——例如登录密码模式下的反爬虫校验，直接独立使用 `Verify.vue`，不需要走 `SmsCodeButton`。

参考用法见 `views/login/component/password.vue`：

```vue
<template>
	<Verify ref="verifyref" mode="pop" :captchaType="captchaType" @success="handleVerifySuccess" />
</template>

<script setup lang="ts">
const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));
const verifyref = ref();
// 表单校验通过后调 verifyref.value.show()
</script>
```