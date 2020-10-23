<template>
  <div class="header">
    <div class="header_logo" @click="jumpIndex()">
      <img class="logo" src="../assets/logo.png" alt="" />
      <div class="logo_name">航变管理系统</div>
    </div>
    <div class="header_nav">
      <div class="nav_list active">
        <a-dropdown :trigger="['click']">
          <div class="list_name" @click="(e) => e.preventDefault()">
            基础信息管理 <a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <div>数据字典管理</div>
            </a-menu-item>
            <a-menu-item>
              <div>来源所属利润中心管理</div>
            </a-menu-item>
            <a-menu-item>
              <div>订单匹配规则管理</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="nav_list">
        <a-dropdown :trigger="['click']">
          <div class="list_name" @click="(e) => e.preventDefault()">
            公共航变动态库 <a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <div>数据字典管理</div>
            </a-menu-item>
            <a-menu-item>
              <div>来源所属利润中心管理</div>
            </a-menu-item>
            <a-menu-item>
              <div>订单匹配规则管理</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="nav_list">
        <a-dropdown :trigger="['click']">
          <div class="list_name" @click="(e) => e.preventDefault()">
            航变通知旅客 <a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <div>数据字典管理</div>
            </a-menu-item>
            <a-menu-item>
              <div>来源所属利润中心管理</div>
            </a-menu-item>
            <a-menu-item>
              <div>订单匹配规则管理</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <div class="header_user">
      <a-tooltip>
        <div class="user_info">欢迎您，畅游世界李汶科</div>
        <template slot="title">畅游国内李汶科</template>
      </a-tooltip>

      <div class="user_loginout">退出</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 跳转主页
    jumpIndex() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: #222631;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  padding: 0 15px;
  .header_logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    .logo {
      height: 40px;
      width: 120px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .logo_name {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 3px;
      margin-left: 20px;
    }
  }

  .header_nav {
    display: flex;
    align-items: center;
    .nav_list {
      padding: 0 13px 0 21px;
      height: 30px;
      
      border-radius: 15px;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 35px;
      }
      &.active{
        background: rgba(255, 255, 255, 0.12);
        .list_name{
          color: #fff;
        }
      }
      .list_name {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #a4b6c5;
        width: 100%;
        height: 100%;
        &.ant-dropdown-open {
          i {
            transform: rotate(180deg);
          }
        }
        i {
          margin-left: 8px;
          transition: all 0.3s;
        }
      }
    }
  }

  .header_user {
    display: flex;
    align-items: center;
    .user_info {
      font-size: 14px;
      font-weight: 400;
      color: #a4b6c5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 125px;
      margin-right: 16px;
    }
    .user_loginout {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 30px;
      background: #0070e2;
      border-radius: 15px;
      cursor: pointer;
      &::before {
        content: "";
        display: inline-flex;
        background: url("../assets/loginout.png") no-repeat center center;
        background-size: contain;
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>