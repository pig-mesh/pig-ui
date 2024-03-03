<template>
  <div class="z-[1000]" v-if="getThemeConfig.isChat">
    <button id="open-chat"
            @click="chatContainer = !chatContainer"
            class="fixed mb-16 mr-4 bottom-4 right-4 inline-flex bg-primary items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
            type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed">
      <svg xmlns=" http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="text-white block border-gray-200 align-middle">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" class="border-gray-200">
        </path>
      </svg>
    </button>
    <div v-show="chatContainer" class="fixed bottom-24 right-4 w-96 mb-12">
      <div class="bg-gray-100 shadow-md rounded-lg max-w-lg w-full">
        <div class="p-4 border-b bg-primary text-white rounded-t-lg flex justify-between items-center">
          <p class="text-lg font-semibold">AI 助手</p>
          <button @click="chatContainer = false"
                  class="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div ref="chatboxRef" class="p-4 h-96 overflow-y-auto">
          <!-- Chat messages will be displayed here -->
          <div v-for="message in messageList">
            <div class="mb-2 text-right" v-if="message.inputMessage">
              <p class="bg-blue-500 text-white rounded-lg py-2 px-4 inline-block">{{ message.inputMessage }}</p>
            </div>
            <div class="mb-2" v-if="message.botMessage">
              <p class="bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block">{{ message.botMessage }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 border-t flex">
          <input v-model="userInput" ref="userInputRef" type="text" :placeholder="$t('chat.inputPlaceholder')"
                 :readonly="readonly"
                 class="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button @click="sendMessage"
                  class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">{{ $t('chat.send') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="chat">
import {onKeyStroke} from '@vueuse/core'
import {turbo} from "/@/components/Chat/chat";
import {useThemeConfig} from "/@/stores/themeConfig";
import {AxiosResponse} from "axios";

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const {themeConfig} = storeToRefs(storesThemeConfig);

// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value;
});

interface Message {
  inputMessage?: string;
  botMessage?: string;
}

const messageList = ref<Message[]>([{botMessage: '您好！我是通用大模型，请问有什么可以帮助您？'}]);
const chatContainer = ref(false)
const userInput = ref("")
const userInputRef = ref()
const chatboxRef = ref()
const readonly = ref(false)

// watch 判断 messageList 长度是否变化
watch(() => messageList.value.length, (newLength, oldLength) => {
  if (newLength !== oldLength) {
    setTimeout(() => {
      chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight;
    }, 500);
  }
});

// 发送消息
const sendMessage = () => {
  const userMessage = userInput.value;
  if (userMessage.trim() !== "") {
    readonly.value = true
    messageList.value.push({inputMessage: userMessage, botMessage: "正在处理，请等待..."});
    turbo(userInput.value).then((response: any) => {
      if (response) {
        messageList.value[messageList.value.length - 1].botMessage = response
      } else {
        messageList.value[messageList.value.length - 1].botMessage = "输出数据可能包含不适当内容"
      }
    }).finally(() => {
      readonly.value = false
    })
    userInput.value = "";
  }
};

// 监听回车键事件
onKeyStroke('Enter', (e) => {
  sendMessage()
}, {target: userInputRef})
</script>
