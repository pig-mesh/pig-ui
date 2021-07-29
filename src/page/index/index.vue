<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse}">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top/>
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <tags/>
        <!-- 主体视图层 -->
        <el-scrollbar>
          <keep-alive>
            <router-view class="avue-view"
                         v-if="$route.meta.$keepAlive"/>
          </keep-alive>
          <router-view class="avue-view"
                       v-if="!$route.meta.$keepAlive"/>
        </el-scrollbar>

      </div>
    </div>
    <div class="avue-shade"
         @click="showCollapse"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import top from './top/'
import sidebar from './sidebar/'
import admin from '@/util/admin'
import { validatenull } from '@/util/validate'
import { calcDate } from '@/util/date.js'
import { getStore } from '@/util/store.js'
import { checkToken } from '../../api/login'

export default {
  components: {
    top,
    tags,
    sidebar
  },
  name: 'index',
  data () {
    return {
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: '',
    }
  },
  created () {
    //实时检测刷新token
    this.refreshToken()
  },
  destroyed () {
    clearInterval(this.refreshTime)
  },
  mounted () {
    this.init()
  },
  computed: mapGetters(['userInfo', 'isLock', 'isCollapse', 'website']),
  props: [],
  methods: {
    showCollapse () {
      this.$store.commit('SET_COLLAPSE')
    },
    // 屏幕检测
    init () {
      this.$store.commit('SET_SCREEN', admin.getScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', admin.getScreen())
        }, 0)
      }
    },
    // 实时检测刷新token
    refreshToken () {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: 'access_token',
          debug: true,
        })

        if (validatenull(token)) {
          return
        }

        checkToken(token.content).then(response => {
          const expire = response && response.data && response.data.exp
          if (expire) {
            const expiredPeriod = expire * 1000 - new Date().getTime()
            console.log('当前token过期时间',expiredPeriod,'毫秒')
            // 小于半小时自动续约
            if (expiredPeriod <= 30 * 60 * 1000) {
              if (!this.refreshLock) {
                this.refreshLock = true
                this.$store
                  .dispatch('RefreshToken')
                  .catch(() => {
                    clearInterval(this.refreshTime)
                  })
                this.refreshLock = false
              }
            }
          }
        }).catch(error => {
          console.log(error)
        })
      }, 60000)
    }
  }
}
</script>
