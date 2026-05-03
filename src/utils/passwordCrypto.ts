import { sm4 } from 'sm-crypto';
import other from '/@/utils/other';

const AES = 'AES';
const SM4 = 'SM4';
/** SM4 密钥必须为 32 位 HEX 字符（解码后为 16 字节），与后端约束保持一致 */
const SM4_HEX_KEY_PATTERN = /^[0-9a-fA-F]{32}$/;

/** 读取登录密码加密算法，未配置时默认 AES，保留向下兼容 */
const getPasswordEncryptType = () => (import.meta.env.VITE_PWD_ENC_TYPE || AES).toUpperCase();

/** 读取登录密码加密密钥（明文配置在 .env，不参与构建混淆） */
const getPasswordEncryptKey = () => import.meta.env.VITE_PWD_ENC_KEY;

/**
 * 登录密码加密，需要与后端 `security.encode-type` / `security.encode-key` 保持一致。
 *
 * - AES：等价于 `other.encryption`，使用 16 字符 UTF-8 密钥、CFB/NoPadding，IV 等于密钥；
 * - SM4：使用 sm-crypto，要求密钥为 32 位 HEX 字符串。
 *
 * @param password 用户输入的明文密码
 * @returns 加密后的密文（AES 为 base64，SM4 为 hex）
 * @throws Error 当 SM4 密钥格式非法或加密类型不支持时抛出
 */
export function encryptPassword(password: string): string {
	const encryptType = getPasswordEncryptType();
	const encryptKey = getPasswordEncryptKey();

	if (encryptType === AES) {
		return other.encryption(password, encryptKey);
	}

	if (encryptType === SM4) {
		if (!SM4_HEX_KEY_PATTERN.test(encryptKey)) {
			throw new Error('SM4 password encryption key must be 32 hex characters');
		}
		return sm4.encrypt(password, encryptKey);
	}

	throw new Error(`Unsupported password encryption type: ${encryptType}`);
}
