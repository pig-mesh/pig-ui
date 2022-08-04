import * as SockJS from 'sockjs-client'
import Stomp from 'stomp-websocket'
import {getStore} from "@/util/store"
import store from '@/store'
import {Notification} from 'element-ui'


/**
 * 链接后台的 websocket 服务
 * @param connectChannel 链接通道
 * @param targetChannel  目标订阅
 * @returns {*}
 */
export const connection = (connectChannel, targetChannel) => {
  const token = store.getters.access_token
  const TENANT_ID = getStore({name: 'tenantId'}) ? getStore({name: 'tenantId'}) : '1'
  const headers = {
    'TENANT-ID': TENANT_ID,
    'Authorization': 'Bearer ' + token
  }
  // 建立连接对象
  let socket = new SockJS(connectChannel)// 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
  // 获取STOMP子协议的客户端对象
  let stompClient = Stomp.over(socket)
  stompClient.debug = null

  // 向服务器发起websocket连接
  stompClient.connect(headers, () => {
    stompClient.subscribe(targetChannel, (msg) => { // 订阅服务端提供的某个topic;
      Notification({
        title: '消息提醒',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        message: msg.body + '请及时处理',
        offset: 60
      })
    })
  }, (err) => {
    console.log(err)
  })

  return stompClient
}
