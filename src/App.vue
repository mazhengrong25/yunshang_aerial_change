<template>
  <div id="app">
    <div id="header-template">
      <header-template />
    </div>
    <div id="router-main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    headerTemplate: () => import("@/components/Header"),
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
    height: 100%;
    background: #fff;
    margin: 16px;
    overflow-y: auto;
    min-height: 500px;
  }
}
</style>
