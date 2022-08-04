<template>
  <template v-for="item in menu">
    <el-menu-item v-if="validatenull(item[childrenKey]) && validRoles(item)"
                  :index="getPath(item)"
                  @click="open(item)"
                  :key="item[labelKey]">
      <i :class="item[iconKey]"></i>
      <template #title>
        <span :alt="item[pathKey]">{{getTitle(item)}}</span>
      </template>
    </el-menu-item>
    <el-sub-menu v-else-if="!validatenull(item[childrenKey])&&validRoles(item)"
                 :index="getPath(item)"
                 :key="item[labelKey]">
      <template #title>
        <i :class="item[iconKey]"></i>
        <span>{{getTitle(item)}}</span>
      </template>
      <template v-for="(child,cindex) in item[childrenKey]"
                :key="child[labelKey]">
        <el-menu-item :index="getPath(child)"
                      @click="open(child)"
                      v-if="validatenull(child[childrenKey])">
          <i :class="child[iconKey]"></i>
          <template #title>
            <span>{{getTitle(child)}}</span>
          </template>
        </el-menu-item>
        <sidebar-item v-else
                      :menu="[child]"
                      :key="cindex"></sidebar-item>
      </template>
    </el-sub-menu>
  </template>
</template>
<script>
import { mapGetters } from "vuex";
import { isURL, validatenull } from '@/util/validate'
import website from '@/config/website'
export default {
  name: "sidebarItem",
  data () {
    return {
      props: website.menu
    }
  },
  props: {
    menu: {
      type: Array
    }
  },
  created () { },
  mounted () { },
  computed: {
    ...mapGetters(["roles"]),
    labelKey () {
      return this.props.label
    },
    pathKey () {
      return this.props.path
    },
    queryKey () {
      return this.props.query
    },
    iconKey () {
      return this.props.icon
    },
    childrenKey () {
      return this.props.children
    },
    metaKey () {
      return this.props.meta
    },
    nowTagValue () { return this.$route.path }
  },
  methods: {
    getPath (item) {
      return item[this.pathKey] + ''
    },
    getTitle (item) {
      return this.$router.$avueRouter.generateTitle(
        item[this.labelKey],
        item.meta.i18n
      );
    },
    validRoles (item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull (val) {
      return validatenull(val);
    },
    open (item) {
      this.$router.push({
        path: item[this.pathKey],
        query: item[this.queryKey]
      });
    }
  }
};
</script>

