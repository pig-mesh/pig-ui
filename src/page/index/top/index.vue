<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div
        v-if="setting.collapse&&!isHorizontal"
        class="avue-breadcrumb"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]">
        <i class="icon-navicon" @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show">
        <top-menu></top-menu>
      </div>
    </div>
    <div class="top-bar__right">
      <div v-if="setting.lock" class="top-bar__item">
        <top-lock></top-lock>
      </div>
      <div v-if="setting.fullscren" class="top-bar__item">
        <top-full></top-full>
      </div>
      <div v-if="setting.debug" class="top-bar__item">
        <top-logs></top-logs>
      </div>
      <div class="top-user">
        <img class="top-bar__img" :src="userInfo.avatar ? baseUrl + userInfo.avatar : '/img/head.png'">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo.username }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/">{{ $t('navbar.dashboard') }}</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/info/index">{{ $t('navbar.userinfo') }}</router-link>
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">{{ $t('navbar.logOut') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <top-setting></top-setting>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import topLock from './top-lock.vue'
import topMenu from './top-menu.vue'
import topLogs from './top-logs.vue'
import topFull from './top-full.vue'
import topSetting from '../setting.vue'

export default {
  name: 'top',
  components: {
    topLock,
    topMenu,
    topLogs,
    topFull,
    topSetting
  },
  computed: {
    ...mapGetters([
      'setting',
      'userInfo',
      'tagWel',
      'tagList',
      'isCollapse',
      'tag',
      'logsLen',
      'logsFlag',
      'isHorizontal'
    ])
  },
  methods: {
    setCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    logout() {
      this.$confirm(this.$t('logoutTip'), this.$t('tip'), {
        confirmButtonText: this.$t('submitText'),
        cancelButtonText: this.$t('cancelText'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
