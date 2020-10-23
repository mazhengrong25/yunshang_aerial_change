<template>
  <div id="app">
    <div id="header-template">
      <header-template />
    </div>
    <main-template>
      <div id="router-main">
        <slot>
           <router-view />
        </slot>
      </div>
    </main-template>
  </div>
</template>

<script>
export default {
  components: {
    headerTemplate: () => import("@/components/Header"),
    mainTemplate: () => import("@/components/Template"),
  },
};
</script>

<style lang="less" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f4f6fa;
  #header-template {
    flex-shrink: 0;
  }
  #router-main {
    overflow-y: auto;
    min-height: 500px;
  }
}
</style>
