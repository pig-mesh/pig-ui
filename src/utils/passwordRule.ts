import { PasswordRule } from '/@/stores/siteConfig';

/** 密码长度下限（位） */
const PASSWORD_RULE_MIN_LENGTH = 10;
/** 密码长度上限（位） */
const PASSWORD_RULE_MAX_LENGTH = 12;

/**
 * 允许使用的符号集合
 *
 * 注意：用于拼接进字符类 `[...]`，所以这里不要包含会改变字符类语义的字符
 * （如 `\`、`]`、`-` 不放在首尾等）。如需扩展企业策略可在此处增减。
 */
const PASSWORD_RULE_SYMBOLS = '!@#$%^&.*';

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

/** 规则下拉框展示文案的 i18n key */
const PASSWORD_RULE_KEYS: Record<PasswordRule, string> = {
	[PasswordRule.LetterNumber]: 'siteconfig.passwordRuleLetterNumber',
	[PasswordRule.LetterNumberSymbol]: 'siteconfig.passwordRuleLetterNumberSymbol',
	[PasswordRule.UpperLowerNumberSymbol]: 'siteconfig.passwordRuleUpperLowerNumberSymbol',
};

/** 规则校验失败时短描述的 i18n key（插入到 `passwordRuleValidateTip` 模板中） */
const PASSWORD_RULE_ERROR_KEYS: Record<PasswordRule, string> = {
	[PasswordRule.LetterNumber]: 'siteconfig.passwordRuleLetterNumberShort',
	[PasswordRule.LetterNumberSymbol]: 'siteconfig.passwordRuleLetterNumberSymbolShort',
	[PasswordRule.UpperLowerNumberSymbol]: 'siteconfig.passwordRuleUpperLowerNumberSymbolShort',
};

/**
 * 三种规则对应的校验正则
 *
 * 由 PASSWORD_RULE_SYMBOLS 与长度常量动态拼装，避免符号集和长度散落在多处。
 */
const PASSWORD_RULE_PATTERNS: Record<PasswordRule, RegExp> = {
	[PasswordRule.LetterNumber]: new RegExp(
		`^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{${PASSWORD_RULE_MIN_LENGTH},${PASSWORD_RULE_MAX_LENGTH}}$`,
	),
	[PasswordRule.LetterNumberSymbol]: new RegExp(
		`^(?=.*[A-Za-z])(?=.*\\d)(?=.*[${PASSWORD_RULE_SYMBOLS}])[A-Za-z\\d${PASSWORD_RULE_SYMBOLS}]{${PASSWORD_RULE_MIN_LENGTH},${PASSWORD_RULE_MAX_LENGTH}}$`,
	),
	[PasswordRule.UpperLowerNumberSymbol]: new RegExp(
		`^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[${PASSWORD_RULE_SYMBOLS}])[A-Za-z\\d${PASSWORD_RULE_SYMBOLS}]{${PASSWORD_RULE_MIN_LENGTH},${PASSWORD_RULE_MAX_LENGTH}}$`,
	),
};

/**
 * 将任意字符串归一化为合法的 PasswordRule 枚举值
 *
 * 后端可能下发空值或未知值，统一回退到默认规则 LetterNumber，避免校验时抛错。
 */
export const normalizePasswordRule = (rule?: string): PasswordRule => {
	if (Object.values(PasswordRule).includes(rule as PasswordRule)) {
		return rule as PasswordRule;
	}
	return PasswordRule.LetterNumber;
};

/**
 * 获取规则对应的展示文案（用于下拉框 label）
 *
 * @param rule 规则值，允许传 undefined（会回退默认规则）
 * @param t   vue-i18n 翻译函数
 */
export const getPasswordRuleLabel = (rule: string | undefined, t: TranslateFn) => {
	return t(PASSWORD_RULE_KEYS[normalizePasswordRule(rule)]);
};

/**
 * 拼装校验失败时的提示文案，形如「密码 10-12 位，包含 英文和数字」
 *
 * 长度从常量注入，避免文案与正则不一致。
 */
export const getPasswordRuleMessage = (rule: string | undefined, t: TranslateFn) => {
	return t('siteconfig.passwordRuleValidateTip', {
		rule: t(PASSWORD_RULE_ERROR_KEYS[normalizePasswordRule(rule)]),
		min: PASSWORD_RULE_MIN_LENGTH,
		max: PASSWORD_RULE_MAX_LENGTH,
	});
};

/**
 * 生成 el-select 选项数组（value + 已翻译的 label）
 */
export const getPasswordRuleOptions = (t: TranslateFn) => {
	return Object.values(PasswordRule).map((value) => ({
		value,
		label: getPasswordRuleLabel(value, t),
	}));
};

/**
 * 判断给定密码是否满足指定规则
 *
 * 不做空值校验，空值由调用方决定是否放行（通常通过 `required` 单独控制）。
 */
export const validatePasswordByRule = (password: string, rule?: string) => {
	return PASSWORD_RULE_PATTERNS[normalizePasswordRule(rule)].test(password);
};

/**
 * 生成可用于 el-form `validator` 的密码规则校验器
 *
 * 规则通过 getter 取值而不是直接传入，确保运行时拿到的是 store 中最新的
 * `passwordRule`；否则在表单挂载时捕获到的旧值会导致后台改完规则后前端
 * 仍按旧规则校验。
 *
 * 空值会被放行，由调用方用 `required` 规则单独覆盖「必填」语义。
 *
 * @param getRule 返回当前生效规则的 getter
 * @param t       vue-i18n 翻译函数
 */
export const createPasswordRuleValidator = (getRule: () => string | undefined, t: TranslateFn) => {
	return (_rule: any, value: string, callback: (error?: Error) => void) => {
		if (!value || validatePasswordByRule(value, getRule())) {
			callback();
			return;
		}
		callback(new Error(getPasswordRuleMessage(getRule(), t)));
	};
};
