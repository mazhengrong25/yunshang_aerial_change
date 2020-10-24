<template>
  <div class="index">
    <a-spin size="large" tip="正在进入航变管理系统 ..." />
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    // 获取登录权限
    getUserAuth(){
      setTimeout(() =>{
        this.$router.push('/profit')
      },1000)
    },
  },
  mounted(){
    this.getUserAuth()
  },
}
</script>

<style>
  .index{
    position: absolute;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>