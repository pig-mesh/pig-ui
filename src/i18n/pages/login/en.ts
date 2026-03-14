/**
 * Login module English language configuration
 */
export default {
	// Common login texts
	signInText: 'Welcome back!',
	browserMsgText: 'Tip: For best results, we recommend using Google Chrome, Microsoft Edge (version 80 or higher), or the 360 browser with speed mode enabled.',

	// Label texts
	label: {
		one1: 'Account login',
		two2: 'SMS login',
		three3: 'Social login',
		register: 'Create account',
	},

	// Link texts
	link: {
		one3: 'Third party login',
		two4: 'Links',
	},

	// Divider text
	divider: {
		or: 'OR'
	},

	// Password login texts
	password: {
		accountLabel: 'Username',
		passwordLabel: 'Password',
		codeLabel: 'Verification Code',
		accountPlaceholder1: 'Please enter username',
		accountPlaceholder2: 'Please enter password',
		accountPlaceholder3: 'Please enter the verification code',
		phonePlaceholder4: 'Please enter your phone number',
		accountBtnText: 'Sign In',
		resetBtnText: 'Reset',
		registerBtnText: 'Create account',
		mobileLogin: 'Mobile Login',
		forgetPassword: 'Forgot Password?',
		createAccount: 'Create Account',
		imageCodeTip: 'Please enter image verification code',
		readAccept: 'I have read and accept',
		agreement: 'I have read and accept',
		serviceAgreement: 'Terms of Service',
		and: 'and',
		privacyPolicy: 'Privacy Policy',
		oldPassword: 'Please enter old password',
		newPassword: 'Please enter new password',
		confirmPassword: 'Please confirm new password',
		backToLogin: 'Back to login',
	},

	// Mobile login texts
	mobile: {
		mobileLabel: 'Mobile Number',
		codeLabel: 'Verification Code',
		placeholder1: 'Please enter mobile number',
		placeholder2: 'Please enter verification code',
		signIn: 'Sign In',
		btnText: 'Sign in',
		backToLogin: 'Back to Password Login',
		createAccount: 'Create Account',
		mobileRequired: 'Please enter mobile number',
		codeRequired: 'Please enter verification code',
		codeLength: 'Verification code must be 4 digits',
		codeText: 'Get Code',
		seconds: 's',
		sendSuccess: 'Verification code sent successfully',
		sendFailed: 'Failed to send verification code',
		loginSuccess: 'Login successful',
		loginFailed: 'Login failed',
		mobileLogin: 'Mobile Login',
	},

	// Register texts
	register: {
		title: 'Create Account',
		username: 'Username',
		password: 'Password',
		confirmPassword: 'Confirm Password',
		mobile: 'Mobile Number',
		email: 'Email',
		submit: 'Register',
		backToLogin: 'Back to Login',
		passwordMismatch: 'Passwords do not match',
		registerSuccess: 'Registration successful',
		usernameEmpty: 'Username cannot be empty',
		usernameLength: 'Username length must be between 5 and 20 characters',
		phoneEmpty: 'Phone number cannot be empty',
		passwordEmpty: 'Password cannot be empty',
		passwordLength: 'Password length must be between 6 and 20 characters',
		passwordStrength: 'Password strength is too low',
		termsRequired: 'Please read and accept the terms',
		// Verification code
		codePlaceholder: 'Enter verification code',
		codeRequired: 'Please enter verification code',
		codeLength: 'Code must be 4 digits',
		codeText: 'Get Code',
		seconds: 's',
		sendSuccess: 'Code sent successfully',
		sendFailed: 'Failed to send code',
	},

	// Forget password texts
	forget: {
		title: 'Reset Password',
		resetPasswordTitle: 'Reset Password',
		resetPasswordTip: 'Please enter your mobile number and verification code to reset password',
		username: 'Username',
		mobile: 'Mobile Number',
		code: 'Verification Code',
		newPassword: 'New Password',
		confirmPassword: 'Confirm Password',
		submit: 'Reset Password',
		backToLogin: 'Back to Login',
		resetSuccess: 'Password reset successful',
		newPasswordPlaceholder: 'Please enter new password',
		confirmPasswordPlaceholder: 'Please confirm new password',
		passwordEmpty: 'Password cannot be empty',
		passwordLength: 'Password length must be between 6 and 20 characters',
		passwordRule: 'The two passwords do not match',
		passwordScore: 'Password strength is too low',
	},

	// Expire password texts
	expire: {
		title: 'Password Expired',
		tip: 'For account security, please reset your password',
		oldPassword: 'Please enter old password',
		newPassword: 'Please enter new password',
		confirmPassword: 'Please confirm new password',
		submit: 'Update Password',
		updateSuccess: 'Password updated successfully',
		passwordRule: 'The two passwords do not match',
		passwordScore: 'Password strength is too low',
		resetSuccess: 'Password reset successfully',
	},

	// QR code scan login texts
	scan: {
		text: 'Use your wechat device to scan and quickly log in or create an account',
		wechatApp: 'Scan with WeChat',
		appErrorTip: 'The login fails because the application is not configured',
	},

	// Social login texts
	social: {
		title: 'Social Login',
		wechat: 'WeChat',
		qq: 'QQ',
		weibo: 'Weibo',
		github: 'GitHub',
		gitee: 'Gitee',
		alipay: 'Alipay',
		baidu: 'Baidu',
	},

	// Social login platform texts
	socialLogin: {
		orContinueWith: 'Or continue with',
		wechatWork: 'WeCom',
		wechatWorkDesc: 'Scan with WeCom app',
		dingtalk: 'DingTalk',
		dingtalkDesc: 'Scan with DingTalk app',
		wechat: 'WeChat',
		wechatDesc: 'Scan with WeChat app',
		bindSuccess: 'Social account bound successfully',
		missingParams: 'Missing required parameters: code or state',
	},

	// Control component texts
	control: {
		theme: 'Theme',
		language: 'Language',
		fullscreen: 'Fullscreen',
		exitFullscreen: 'Exit Fullscreen',
		toggleLightMode: 'Switch to Light Mode',
		toggleDarkMode: 'Switch to Dark Mode',
	},

	// Verification texts
	verify: {
		imageCode: 'Please enter verification code',
	},

	// Validation messages
	validation: {
		usernameFormat: 'Username supports lowercase letters and numbers only',
		usernameExists: 'Username already exists',
		phoneExists: 'Phone number already exists',
	},

	// Error messages
	errors: {
		loginFailed: 'Login failed, please check your credentials',
		networkError: 'Network error, please try again',
		validationError: 'Please complete all required fields',
		unauthorized: 'Unauthorized access',
	},

	// Lock screen texts
	lockScreen: {
		slideToUnlock: 'Slide to unlock',
		enterPassword: 'Please enter password',
		passwordError: 'Password error',
		unlockSuccess: 'Unlock successful',
	},
};
