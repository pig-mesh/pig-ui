<template>
  <div class="avue-logo">
    <transition name="fade">
      <span
        v-if="getScreen(isCollapse)"
        key="0"
        class="avue-logo_subtitle">
        {{ website.logo }}
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="getScreen(!isCollapse)">
        <span
          key="1"
          class="avue-logo_title">{{ website.indexTitle }} </span>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'logo',
  computed: {
    ...mapGetters(['isCollapse'])
  }
}
</script>
