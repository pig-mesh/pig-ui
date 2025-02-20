<template>
	<div class="z-[1000]" v-if="getThemeConfig.isChat">
		<button
			id="open-chat"
			@click="chatContainer = !chatContainer"
			class="inline-flex fixed right-4 bottom-4 justify-center items-center p-0 m-0 mr-4 mb-16 w-16 h-16 text-sm font-medium leading-5 normal-case bg-none rounded-full border border-gray-200 cursor-pointer dark:border-gray-600 bg-primary dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 disabled:pointer-events-none disabled:opacity-50"
			type="button"
			aria-haspopup="dialog"
			aria-expanded="false"
			data-state="closed"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="30"
				height="40"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="block text-white align-middle"
			>
				<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
			</svg>
		</button>
		<div v-show="chatContainer" class="fixed bottom-24 right-4 w-[600px] mb-12">
			<div class="w-full bg-white rounded-lg shadow-lg dark:bg-gray-800">
				<div
					class="flex justify-between items-center p-4 text-white rounded-t-lg border-b border-gray-200 dark:border-gray-600 bg-primary dark:bg-gray-700"
				>
					<p class="text-lg font-semibold">{{ t('chat.title') }}</p>
					<div class="flex items-center space-x-2">
						<button
							@click="clearChat"
							class="flex justify-center items-center w-6 h-6 text-gray-300 focus:outline-none hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
							:title="t('chat.clearChat')"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</button>
						<button
							@click="chatContainer = false"
							class="flex justify-center items-center w-6 h-6 text-gray-300 focus:outline-none hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
				</div>
				<div class="h-[650px] overflow-y-auto p-4 space-y-4" ref="chatboxRef">
					<!-- Messages -->
					<div v-for="(message, index) in messageList" :key="index" class="space-y-2">
						<!-- User Message -->
						<div v-if="message.inputMessage" class="flex justify-end">
							<div class="bg-primary text-white rounded-lg py-2 px-4 max-w-[80%]">
								<p>{{ message.inputMessage }}</p>
							</div>
						</div>

						<!-- AI Response -->
						<div v-if="message.botMessage || message.reasoningChain || message.isTyping" class="flex flex-col space-y-2">
							<!-- Reasoning Chain (Collapsible) -->
							<div v-if="message.reasoningChain" class="overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-700">
								<div
									class="flex justify-between items-center p-2 transition-colors cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
									@click="toggleReasoning(index)"
								>
									<div class="flex items-center space-x-2">
										<svg
											:class="{ 'rotate-90': !isReasoningCollapsed[index] }"
											class="w-4 h-4 transition-transform duration-200"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="9 18 15 12 9 6"></polyline>
										</svg>
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											<template v-if="message.isTyping">{{ t('chat.thinking') }}</template>
											<template v-else>{{ t('chat.thinkingCompleted') }} ({{ t('chat.thinkingTime') }} {{ getThinkingTime(index) }})</template>
										</span>
									</div>
								</div>
								<div
									v-show="!isReasoningCollapsed[index]"
									class="p-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
								>
									<div class="whitespace-pre-wrap">{{ message.reasoningChain }}</div>
								</div>
							</div>

							<!-- Bot Message -->
							<div class="rounded-lg p-4 max-w-[80%] bg-gray-100 dark:bg-gray-700">
								<div class="max-w-none prose dark:prose-invert">
									<div v-html="marked.parse(message.botMessage || '')"></div>
									<div v-if="message.isTyping" class="typing-indicator">
										<span></span>
										<span></span>
										<span></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex items-center p-4 space-x-2 border-t border-gray-200 dark:border-gray-600">
					<button
						@click="toggleWebAccess"
						class="flex relative justify-center items-center w-10 h-10 text-gray-400 bg-gray-100 rounded-md transition-colors group dark:bg-gray-700 dark:text-gray-400"
						:class="{
							'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light-3': isWebEnabled,
						}"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
							/>
						</svg>
						<div
							class="absolute bottom-full left-1/2 invisible px-3 py-2 mb-2 text-sm text-white whitespace-nowrap bg-gray-800 rounded-lg opacity-0 transition-all duration-200 -translate-x-1/2 group-hover:opacity-100 group-hover:visible"
						>
							{{ isWebEnabled ? t('chat.webSearchEnabled') : t('chat.webSearchDisabled') }}
							<div class="absolute top-full left-1/2 -mt-1 border-4 border-transparent -translate-x-1/2 border-t-gray-800"></div>
						</div>
					</button>
					<input
						v-model="userInput"
						ref="userInputRef"
						type="text"
						:placeholder="t('chat.inputPlaceholder')"
						:readonly="readonly"
						class="px-3 py-2 w-full text-gray-900 bg-gray-50 rounded-l-md border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<button
						@click="sendMessage"
						class="px-4 py-2 text-white rounded-r-md transition duration-300 disabled:opacity-50 bg-primary hover:bg-primary-focus dark:bg-primary-light-3 dark:hover:bg-primary-light-5"
						:disabled="readonly"
					>
						{{ t('chat.send') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="chat">
import { onKeyStroke } from '@vueuse/core';
import request from '/@/utils/request';
import { useThemeConfig } from '/@/stores/themeConfig';
import { marked } from 'marked';
import { nextTick } from 'vue';
import { Session } from '/@/utils/storage';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useI18n } from 'vue-i18n';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

interface Message {
	inputMessage?: string;
	botMessage?: string;
	reasoningChain?: string;
	startTime?: number;
	endTime?: number;
	isTyping?: boolean;
}

const messageList = ref<Message[]>([{ botMessage: t('chat.welcome') }]);
const chatContainer = ref(false);
const userInput = ref('');
const userInputRef = ref();
const chatboxRef = ref();
const readonly = ref(false);
const controller = ref<AbortController | null>(null);
const isReasoningCollapsed = ref<Record<number, boolean>>({});
const isWebEnabled = ref(false);

// 监听消息变化，自动滚动
watch([() => messageList.value.length, () => messageList.value[messageList.value.length - 1]?.botMessage], () => {
	nextTick(() => {
		if (chatboxRef.value) {
			chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight;
		}
	});
});

/**
 * 从会话存储中获取访问令牌
 * @returns {string} 访问令牌
 */
const token = computed(() => {
	return Session.getToken();
});
/**
 * 从会话存储中获取访问租户
 * @returns {string} 租户
 */
const tenant = computed(() => {
	return Session.getTenant();
});

// 解析SSE返回的数据
function parseSSEResponse(data: string) {
	try {
		const parsed = JSON.parse(data);

		// 处理结束信号
		if (parsed.choices?.[0]?.finish_reason === 'stop') {
			return {
				isFinished: true,
				content: '',
				reasoning: '',
			};
		}

		const delta = parsed.choices?.[0]?.delta;
		if (!delta) {
			return null;
		}

		// 分别获取思维链和回答内容
		return {
			reasoning: delta.reasoning_content || '',
			content: delta.content || '',
		};
	} catch (e) {
		return null;
	}
}

// 切换推理过程的显示/隐藏
const toggleReasoning = (index: number) => {
	isReasoningCollapsed.value[index] = !isReasoningCollapsed.value[index];
};

// 计算思考时间
const getThinkingTime = (index: number) => {
	const message = messageList.value[index];
	if (message.startTime && message.endTime) {
		const duration = message.endTime - message.startTime;
		return `${Math.round(duration / 1000)} 秒`;
	}
	return '计算中...';
};

// 切换联网状态
const toggleWebAccess = () => {
	isWebEnabled.value = !isWebEnabled.value;
};

// 发送消息
const sendMessage = async () => {
	const userMessage = userInput.value;
	if (userMessage.trim() === '') return;

	// 如果存在之前的请求，中止它
	if (controller.value) {
		controller.value.abort();
	}

	readonly.value = true;
	const newMessage: Message = {
		inputMessage: userMessage,
		botMessage: '',
		reasoningChain: '',
		startTime: Date.now(),
		endTime: undefined,
		isTyping: true,
	};
	messageList.value.push(newMessage);
	// 默认折叠推理过程
	isReasoningCollapsed.value[messageList.value.length - 1] = false;

	// 创建新的 AbortController
	controller.value = new AbortController();

	try {
		const fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.value}`,
				'TENANT-ID': tenant.value,
			},
			body: JSON.stringify({
				message: userMessage,
				webSearch: isWebEnabled.value,
			}),
			signal: controller.value.signal,
			async onopen(response: Response) {
				if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
					return; // 连接成功
				}
				throw new Error(`Failed to connect: ${response.status} ${response.statusText}`);
			},
			onmessage(event: { data: string }) {
				const parsed = parseSSEResponse(event.data);
				if (!parsed) return;

				const lastMessage = messageList.value[messageList.value.length - 1];

				// 直接更新内容，不需要缓冲
				if (parsed.content) {
					if (!lastMessage.botMessage) {
						lastMessage.botMessage = '';
					}
					lastMessage.botMessage += parsed.content;
				}
				if (parsed.reasoning) {
					if (!lastMessage.reasoningChain) {
						lastMessage.reasoningChain = '';
					}
					lastMessage.reasoningChain += parsed.reasoning;
				}

				// 处理结束信号
				if (parsed.isFinished) {
					lastMessage.endTime = Date.now();
					lastMessage.isTyping = false;
					// 完成后折叠推理过程
					isReasoningCollapsed.value[messageList.value.length - 1] = true;
				}
			},
			onclose() {
				// 连接正常关闭
				readonly.value = false;
			},
			onerror(error: Error) {
				// 处理错误
				const lastMessage = messageList.value[messageList.value.length - 1];
				lastMessage.endTime = Date.now();
				lastMessage.isTyping = false;
				if (!lastMessage.botMessage) {
					lastMessage.botMessage = t('chat.connectionError');
				}
				// 发生错误时折叠推理过程
				isReasoningCollapsed.value[messageList.value.length - 1] = true;
				readonly.value = false;
				throw error; // 重试或中止
			},
		};

		await fetchEventSource(`${request.defaults.baseURL}/admin/ai/chat`, fetchOptions);
	} catch (error: unknown) {
		if (error instanceof Error && error.name === 'AbortError') {
			// 请求被中止，不需要特殊处理
			return;
		}
	} finally {
		// 清空输入
		userInput.value = '';
		readonly.value = false;
	}
};

// 监听回车键事件
onKeyStroke(
	'Enter',
	() => {
		sendMessage();
	},
	{ target: userInputRef }
);

// 清空会话
const clearChat = () => {
	// 保留初始欢迎消息
	messageList.value = [{ botMessage: t('chat.welcome') }];
	// 重置所有状态
	isReasoningCollapsed.value = {};
	readonly.value = false;
	userInput.value = '';

	// 如果存在进行中的请求，中止它
	if (controller.value) {
		controller.value.abort();
		controller.value = null;
	}
};
</script>

<style scoped>
.prose {
	max-width: none;
}

.prose-invert {
	--tw-prose-body: theme('colors.gray.300');
	--tw-prose-headings: theme('colors.white');
	--tw-prose-links: theme('colors.primary.light-3');
	--tw-prose-bold: theme('colors.white');
	--tw-prose-counters: theme('colors.gray.400');
	--tw-prose-bullets: theme('colors.gray.400');
	--tw-prose-quotes: theme('colors.gray.100');
	--tw-prose-quote-borders: theme('colors.gray.700');
	--tw-prose-captions: theme('colors.gray.400');
	--tw-prose-code: theme('colors.white');
	--tw-prose-pre-code: theme('colors.gray.100');
	--tw-prose-pre-bg: theme('colors.gray.900');
	--tw-prose-hr: theme('colors.gray.700');
}

.typing-indicator {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 4px 8px;
}

.typing-indicator span {
	width: 4px;
	height: 4px;
	border-radius: 50%;
	animation: typing 1s infinite;
}

:deep(.dark) .typing-indicator span {
	background-color: #9ca3af;
}

:deep(.light) .typing-indicator span {
	background-color: #666;
}

.typing-indicator span:nth-child(2) {
	animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes typing {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-4px);
	}
}
</style>
