<template>
  <div class="avue-logo">
    <transition name="fade">
      <span v-if="getScreen(isCollapse)"
            class="avue-logo_subtitle"
            key="0">
        {{website.logo}}
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="getScreen(!isCollapse)">
        <span class="avue-logo_title"
              key="1">{{website.indexTitle}} </span>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data () {
    return {};
  },
  created () { },
  computed: {
    ...mapGetters(["isCollapse"])
  },
  methods: {}
};
</script>