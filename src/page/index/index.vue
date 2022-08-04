<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse,}">
    <div class="avue-layout"
         :class="{'avue-layout--horizontal':isHorizontal}">
      <div class="avue-sidebar"
           v-show="validSidebar">
        <!-- 左侧导航栏 -->
        <logo />
        <sidebar />
      </div>
      <div class="avue-main">
        <!-- 顶部导航栏 -->
        <top ref="top" />
        <!-- 顶部标签卡 -->
        <tags />
        <transition name="fade-scale">
          <search class="avue-view"
                  v-show="isSearch"></search>
        </transition>
        <!-- 主体视图层 -->
        <div id="avue-view"
             v-show="!isSearch"
             v-if="isRefresh">
          <router-view #="{ Component }">
            <keep-alive :include="$store.getters.tagsKeep">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
        <!-- <div class="avue-footer">
          <p class="copyright">© 2018-2021 Avue designed by smallwei</p>
        </div> -->
      </div>
    </div>

  </div>
</template>

<script>
import index from '@/mixins/index'
import { validatenull } from '@/util/validate'
import { mapGetters } from "vuex";
import tags from "./tags.vue";
import search from "./search.vue";
import logo from "./logo.vue";
import top from "./top/index.vue";
import sidebar from "./sidebar/index.vue";
export default {
  mixins: [index],
  components: {
    top,
    logo,
    tags,
    search,
    sidebar
  },
  name: "index",
  provide () {
    return {
      index: this
    };
  },
  computed: {
    ...mapGetters(["isHorizontal", "isRefresh", "isLock", "isCollapse", "isSearch", "menu"]),
    validSidebar () {
      return !((this.$route.meta || {}).menu == false || (this.$route.query || {}).menu == 'false')
    }
  },
  props: [],
  methods: {
    //打开菜单
    openMenu (item = {}) {
      this.$store.dispatch("GetMenu", item.id).then(data => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true);
        }
        //当点击顶部菜单做的事件
        if (!validatenull(item)) {
          let itemActive = {},
            childItemActive = 0;
          //vue-router路由
          if (item.path) {
            itemActive = item;
          } else {
            if (this.menu[childItemActive].length == 0) {
              itemActive = this.menu[childItemActive];
            } else {
              itemActive = this.menu[childItemActive].children[childItemActive];
            }
          }
          this.$store.commit('SET_MENUID', item);
          this.$router.push({
            path: itemActive.path
          });
        }

      });
    },
  }
};
</script>