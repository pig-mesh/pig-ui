<template>
  <router-view #="{ Component }">
    <keep-alive :include="$store.getters.tagsKeep">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>