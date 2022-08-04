<template>
  <div class="execution">
    <basic-container>
      <div class="header">
        <p class="header__title">{{ name }}</p>
        <el-button
          class="header__btn"
          type="primary"
          @click="breaks">关闭返回列表
        </el-button>
      </div>
    </basic-container>

    <el-scrollbar class="main">
      <iframe
        :src="src"
        class="iframe"/>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      name: '',
      src: '',
    }
  },
  watch: {
    $route () {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.id = this.$route.params.id
      this.name = this.$route.query.name
      this.src = this.actUrl + this.id
    },
    breaks() {
      this.$router.$avueRouter.closeTag()
      this.$router.push({ path: '/activiti/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .execution {
    height: 99%;

    .header {
      position: relative;
      display: flex;
      align-items: center;

      &__title {
        font-size: 22px;
      }

      &__btn {
        position: absolute;
        right: 10px;
      }
    }

    .main {
      margin: 0 auto;
      width: 99%;
      height: calc(100% - 100px);
      background-color: #fff;
      padding: 20px;
      border-radius: 3px;
      box-sizing: border-box;
    }
  }
  .iframe {
    width: 100%;
    height: 100%;
    border: 0;
    overflow: hidden;
    box-sizing: border-box;
  }

</style>
