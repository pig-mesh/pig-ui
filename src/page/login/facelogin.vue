<template>
  <basic-video ref="video"
               :width="350">
  </basic-video>
</template>

<script>
import { mapGetters } from "vuex";
import basicVideo from '@/components/basic-video/main.vue'
export default {
  components: {
    basicVideo
  },
  data () {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      }

    }
  },
  created () {
    setTimeout(() => {
      this.handleLogin()
    }, 6000)
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  methods: {
    handleLogin () {
      this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
        this.$router.push({ path: this.tagWel.value });
      });
    }
  }
}
</script>

<style>
</style>