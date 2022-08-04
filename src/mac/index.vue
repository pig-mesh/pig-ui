<template>
  <div class="mac_bg"></div>
  <div class="desktop">
    <div class="top">
      <el-dropdown trigger="click">
        <div class="logo"><i class="iconfont icon-pingguo"></i></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div>{{userInfo.username}}</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <top-lock text="锁定屏幕"></top-lock>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="switchTheme">退出主题</div>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">{{$t('navbar.logOut')}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="space"></div>
      <div class="status">
        <div class="audio"><i class="iconfont icon-changyongtubiao-xianxingdaochu-zhuanqu-39"></i></div>
        <div class="datetime">{{timeString}}</div>
        <div class="notification"><i class="iconfont icon-changyongtubiao-xianxingdaochu-zhuanqu-25"></i></div>
      </div>
    </div>
    <div class="body">
      <div class="desktop-app">
        <template v-for="item in deskTopAppList"
                  :key="item.key">
          <div class="app-item"
               @click="openApp(item)"
               v-if="!item.hideInDesktop">
            <div class="icon"
                 :style="{backgroundColor:item.iconBgColor,color:item.iconColor}"><i class="iconfont"
                 :class="item[iconKey]"></i></div>
            <div class="title">{{item[labelKey]}}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <div class="space"></div>
      <div class="dock">
        <template v-for="item in openAppList"
                  :key="item.key">
          <div class="item"
               @click="openApp(item)">
            <i :style="{backgroundColor:item.iconBgColor,color:item.iconColor}"
               class="iconfont"
               :class="item[iconKey]"></i>
            <small style="margin-top:5px;font-size:10px">{{item[labelKey]}}</small>
          </div>
        </template>
      </div>
      <div class="space"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { $Mode } from './mode/index'
import index from '@/mixins/index'
import topLock from '@/page/index/top/top-lock.vue'
export default {
  mixins: [index],
  components: {
    topLock
  },
  data () {
    return {
      app: false,
      timeString: ""
    }
  },
  computed: {
    ...mapGetters(["menu", "tagList", "tag", "userInfo", "isMacOs"]),
    labelKey () {
      return this.website.menu.label
    },
    pathKey () {
      return this.website.menu.path
    },
    hrefKey () {
      return this.website.menu.href
    },
    childrenKey () {
      return this.website.menu.children
    },
    queryKey () {
      return this.website.menu.query
    },
    iconKey () {
      return this.website.menu.icon
    },
    menuList () {
      let result = []
      const findMenu = (list) => {
        list.forEach(ele => {
          if (ele[this.childrenKey] && ele[this.childrenKey].length !== 0) {
            findMenu(ele[this.childrenKey])
          } else {
            result.push(ele)
          }
        })
      }
      findMenu(this.menu);
      return result
    },
    deskTopAppList () {
      return this.menuList
    },
    openAppList () {
      return []
    },
  },
  created () {
    this.startTimer()
    this.$store.dispatch("GetMenu")
  },
  methods: {
    switchTheme () {
      this.$store.commit('SET_THEME_NAME', '')
      location.reload();
    },
    logout () {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push({ path: "/login" });
      });
    },
    startTimer () {
      setInterval(() => {
        this.timeString = this.$dayjs().format('YYYY年MM月DD日 HH:mm')
      }, 1000)
    },
    openApp (item) {
      $Mode({
        title: item[this.labelKey],
        path: item[this.hrefKey] ? item[this.hrefKey] : item[this.pathKey]
      })
    }
  }
}
</script>
<style>
.top .el-dropdown {
  color: white !important;
  height: 100% !important;
}
</style>
<style scoped>
.desktop {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: white;
  overflow: hidden;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
}

.top {
  height: 28px;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  padding: 0px 5px;
  z-index: 100;
}

.space {
  flex-grow: 1;
}

.logo {
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0px 15px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo .el-select {
  position: absolute;
  opacity: 0;
}

.logo:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logo .iconfont {
  font-size: 16px;
  margin-top: -3px;
}

.menu .item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.status {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.audio .iconfont,
.notification .iconfont {
  font-size: 20px;
}

.datetime,
.audio,
.notification {
  cursor: pointer;
  padding: 0px 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.datetime:hover,
.audio:hover,
.notification:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.body {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
}

.footer {
  position: fixed;
  left: 5px;
  right: 5px;
  bottom: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  z-index: 100;
}

.footer .dock {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  flex-direction: row;
  display: flex;
  padding: 2px;
}

.dock .item {
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.dock .dot {
  width: 3px;
  height: 3px;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  bottom: 0px;
  border-radius: 5px;
  display: inline-block;
  font-size: 0;
}

.dock .item .iconfont {
  cursor: pointer;
  border-radius: 20px;
  padding: 2px;
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  height: 30px;
  width: 30px;
  text-align: center;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, margin 0.3s;
}

.dock .item:hover .iconfont {
  transform: scale(2) translateY(-10px);
  margin: 0px 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.dock .nearby .iconfont {
  transform: scale(1.6) translateY(-8px);
  margin: 0px 12px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.dock .nearby1 .iconfont {
  transform: scale(1.2) translateY(-6px);
  margin: 0px 9px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.dock .nearby2 .iconfont {
  transform: scale(1.1) translateY(-5px);
  margin: 0px 7px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.desktop-app {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 20px;
  flex-wrap: wrap-reverse;
}

.app-item {
  margin: 5px 10px;
  padding: 5px;
  flex-direction: column;
  text-align: center;
  text-shadow: 0px 0px 2px rgb(0 0 0 / 50%);
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid transparent;
}

.app-item .icon {
  border-radius: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-item .iconfont {
  font-size: 36px;
}

.app-item .title {
  font-size: 12px;
  width: 50px;
  margin-top: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.app-item:hover {
  border: 2px solid rgba(255, 255, 255, 0.5);
}
</style>