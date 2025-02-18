import other from './other';

// 从环境变量获取加密密钥
const ENCRYPTION_KEY = import.meta.env.VITE_PWD_ENC_KEY;
const ENCRYPTION_ENABLED = import.meta.env.VITE_API_ENC_ENABLED  === 'true' ?? false;

/**
 * 使用指定密钥加密数据
 * @param data - 需要加密的数据
 * @returns 加密后的数据，如果加密未启用则返回原始数据
 */
export function encrypt(data: any): string {
	if (!data) return '';
	if (!ENCRYPTION_ENABLED) return data;

	// 如果不是 number 或者 string 类型的数据，转为 JSON 字符串
	if (typeof data !== 'string' && typeof data !== 'number') {
		data = JSON.stringify(data);
	}

	return other.encryption(data, ENCRYPTION_KEY);
}

/**
 * 使用指定密钥解密数据
 * @param encryptedData - 需要解密的数据
 * @returns 解密后的数据，如果加密未启用则返回原始数据
 */
export function decrypt(encryptedData: string): any {
	if (!encryptedData) return null;
	if (!ENCRYPTION_ENABLED) return encryptedData;

	const decrypted = other.decryption(encryptedData, ENCRYPTION_KEY);
	try {
		return JSON.parse(decrypted);
	} catch {
		return decrypted;
	}
}

/**
 * 加密GET请求的参数
 * @param params - 需要加密的请求参数对象
 * @returns 加密并URL编码后的参数对象
 */
export function encryptRequestParams(params: Record<string, any>): Record<string, string> {
	if (!ENCRYPTION_ENABLED) return params;
	
	const encryptedParams: Record<string, string> = {};
	for (const [paramKey, value] of Object.entries(params)) {
		if (value != null) {
			const stringValue = value.toString();
			encryptedParams[paramKey] = ENCRYPTION_ENABLED ? encodeURIComponent(encrypt(stringValue)) : encodeURIComponent(stringValue);
		}
	}

	return encryptedParams;
}

/**
 * 将数据包装成加密信封格式
 * @param data - 需要加密的数据
 * @returns 如果加密启用则返回包含加密数据的信封对象 { encryption: string }，否则返回原始数据
 */
export function wrapEncryption(data: any): { encryption: string } | any {
	if (!ENCRYPTION_ENABLED) return data;

	return {
		encryption: encrypt(data),
	};
}
