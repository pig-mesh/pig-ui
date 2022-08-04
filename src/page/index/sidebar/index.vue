<template>
  <el-scrollbar class="avue-menu">
    <div v-if="menu&&menu.length==0&&!isHorizontal"
         class="avue-sidebar--tip">{{$t('menuTip')}}</div>
    <el-menu unique-opened
             :default-active="nowTagValue"
             :mode="setting.sidebar"
             :collapse="getScreen(isCollapse)">
      <sidebar-item :menu="menu"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import sidebarItem from "./sidebarItem.vue";
export default {
  name: "sidebar",
  components: { sidebarItem },
  inject: ["index"],
  created () {
    this.index.openMenu()
  },
  computed: {
    ...mapGetters(["isHorizontal", "setting", "menu", "tag", "isCollapse", "menuId"]),
    nowTagValue () { return this.$route.path; }
  }
};
</script>
<style lang="scss" scoped>
</style>

