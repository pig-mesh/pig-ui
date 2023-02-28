<template>
  <div class="news-home">
    <div v-for="(news, index) in props.objData" :key="index" class="news-div">
      <a v-if="index===0" target="_blank" :href="news.url">
        <div class="news-main">
          <div class="news-content">
            <img class="material-img" :src="news.thumbUrl" width="280px" height="120px" />
            <div class="news-content-title">
              <span>{{ news.title }}</span>
            </div>
          </div>
        </div>
      </a>
      <a v-if="index>0" target="_blank" :href="news.url">
        <div class="news-main-item">
          <div class="news-content-item">
            <div class="news-content-item-title">{{ news.title }}</div>
            <div class="news-content-item-img">
              <img class="material-img" :src="news.thumbUrl" height="100%" />
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts" name="wx-news">

const props = defineProps({
  objData: {
    type: Array,
    default: () => []
  }
})

</script>

<style scoped>

</style>
