<template>
  <el-menu class="top-menu"
           :default-active="activeIndex"
           mode="horizontal"
           text-color="#333">
    <el-menu-item v-for="(item,index) in items"
                  :key="index"
                  :index="item.id+''"
                  @click="openMenu(item)">
      <template #title>
        <i :class="item.source"></i>
        <span>{{item.name}}</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "top-menu",
  data () {
    return {
      activeIndex: "0",
      items: []
    };
  },
  inject: ["index"],
  created () {
    this.getMenu();
    this.getUserInfo()
  },
  computed: {
    ...mapGetters(["tagCurrent", "menu"])
  },
  methods: {
    openMenu (item) {
      this.index.openMenu(item)
    },
    getMenu () {
      this.$store.dispatch("GetTopMenu").then(res => {
        this.items = res;
      });
    },
    getUserInfo () {
      // 更新sessionStore 权限信息
      this.$store.dispatch('GetUserInfo')
    }
  }
};
</script>
