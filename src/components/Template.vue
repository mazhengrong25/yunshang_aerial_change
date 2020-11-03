<!--
 * @Author: your name
 * @Date: 2020-10-23 14:32:43
 * @LastEditTime: 2020-10-27 13:38:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \positiond:\aerial\yunshang_aerial_change\src\components\Template.vue
-->
<template>
  <div class="template">
    <div class="title">
      <div class="title_name">{{templateTile}}</div>
      <div class="select_user">
        <a-select default-value="0" @change="handleChange">
          <a-select-option value="0"> 畅游国内 </a-select-option>
          <a-select-option value="1"> 畅游国际 </a-select-option>
          <a-select-option value="2"> 国际正航 </a-select-option>
        </a-select>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>

export default {
  data() {
    return {
      templateTile: ''
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
  created(){
    console.log(this.$route)
    this.templateTile = this.$route.name
  }
};
</script>

<style lang="less" scoped>
.template {
  background: #ffffff;
  height: 100%;
  margin: 16px;
  .title {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 20px;
    .title_name {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .select_user {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      background: #f1f3f5;
      opacity: 1;
      border-radius: 17px;
      /deep/.ant-select-selection {
        border: none;
        width: 160px;
        height: 32px;
        background: #f1f3f5;
        border-radius: 17px;
        .ant-select-selection__rendered {
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
