<template>
  <el-autocomplete class="top-search"
                   popper-class="my-autocomplete"
                   v-model="value"
                   :fetch-suggestions="querySearch"
                   :placeholder="$t('search')"
                   @select="handleSelect">

    <template #="{ item }">
      <i :class="[item[iconKey],'icon']"></i>
      <div class="name">{{ item[labelKey] }}</div>
      <div class="addr">{{ item[pathKey] }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      value: "",
      menuList: []
    };
  },
  created () {
    this.getMenuList();
  },

  watch: {
    menu () {
      this.getMenuList();
    }
  },
  computed: {
    labelKey () {
      return this.website.menu.label
    },
    pathKey () {
      return this.website.menu.path
    },
    iconKey () {
      return this.website.menu.icon
    },
    childrenKey () {
      return (
        this.website.menu.children
      );
    },
    ...mapGetters(["menu"])
  },
  methods: {
    getMenuList () {
      const findMenu = (list = []) => {
        for (let i = 0; i < list.length; i++) {
          const ele = Object.assign({}, list[i]);
          if (this.validatenull(ele[this.childrenKey])) {
            this.menuList.push(ele);
          } else {
            findMenu(ele[this.childrenKey]);
          }
        }
      };
      this.menuList = [];
      findMenu(this.menu);
    },
    querySearch (queryString, cb) {
      var restaurants = this.menuList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.label.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect (item) {
      this.value = "";
      this.$router.push({
        path: item[this.pathKey],
        query: item.query
      });
    }
  }
};
</script>

<style lang="scss">
.my-autocomplete {
  li {
    line-height: normal !important;
    padding: 7px !important;
    .icon {
      margin-right: 5px;
      display: inline-block;
      vertical-align: middle;
    }
    .name {
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
    .addr {
      padding-top: 5px;
      width: 100%;
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>