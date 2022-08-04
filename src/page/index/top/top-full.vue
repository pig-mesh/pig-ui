<template>
  <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
     @click="handleScreen"></i>
</template>
<script>
import { mapGetters } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/index";
export default {
  computed: {
    ...mapGetters(["isFullScren"])
  },
  mounted () {
    listenfullscreen(this.setScreen);
  },
  methods: {
    setScreen () {
      this.$store.commit("SET_FULLSCREN");
    },
    handleScreen () {
      fullscreenToggel();
    },
  }
}
</script>