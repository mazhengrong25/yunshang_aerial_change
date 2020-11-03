<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-10-22 16:00:45
 * @LastEditTime: 2020-10-24 17:33:00
 * @LastEditors: wish.WuJunLong
-->
<template>
  <div id="app">
    <div id="header-template">
      <!-- <header-template /> -->
    </div>
    <main-template>
      <div id="router-main">
        <slot>
          <a-config-provider :locale="zhCN">
            <router-view />
          </a-config-provider>
        </slot>
      </div>
    </main-template>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/es/locale-provider/zh_CN";
export default {
  components: {
    headerTemplate: () => import("@/components/Header"),
    mainTemplate: () => import("@/components/Template"),
  },
  data() {
    return {
      zhCN,
    };
  },
};
</script>

<style lang="less">
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
    // min-height: 500px;
  }
}
// antdv 开关
.ant-switch {
  min-width: 64px !important;
  &.ant-switch-checked {
    background-color: #5ab957;
  }
}
// antdv 标签
.ant-tag {
  border-radius: 2px !important;
}
// antdv 分页器
.ant-pagination {
  .ant-pagination-item {
    min-width: 24px;
    height: 24px;
    line-height: 24px;
    // background: #0070e2;
    border-radius: 2px;
    border: 1px solid #dfdfdf;
    a {
      font-size: 12px;
      font-weight: 400;
      color: #333333;
    }
    &.ant-pagination-item-active {
      background: #0070e2;
      border-color: #0070e2;
      a {
        color: #fff;
      }
    }
  }
  .ant-pagination-prev,
  .ant-pagination-next {
    height: 25px;
    line-height: 25px;
    a {
      width: 45px;
      min-width: 45px;
      height: 25px;
      border-radius: 2px;
      line-height: 25px;
      border: 1px solid #0070e2;
      background: #0070e2;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      .anticon {
        display: none;
      }
    }
    &.ant-pagination-disabled {
      a {
        background: #fff;
        border-color: #dfdfdf;
        color: #333333;
      }
    }
  }
  .ant-pagination-prev {
    a {
      &::before {
        content: "上一页";
      }
    }
  }
  .ant-pagination-next {
    a {
      &::before {
        content: "下一页";
      }
    }
  }
  .ant-pagination-options {
    .ant-select-selection {
      width: 88px;
      height: 25px;
      border: 1px solid #dfdfdf;
      border-radius: 2px;
      .ant-select-selection__rendered {
        line-height: 25px;
        margin-left: 8px;
      }
    }
  }
}
// antdv 表格
.ant-table-body {
  table {
    border-radius: 0 !important;
    border-left: none !important;

    font-size: 12px;
    font-weight: 400;
    color: #333333;
    .ant-table-thead {
      th {
        border-radius: 0 !important;
        background: #ebeff4;
        padding: 5px 8px !important;
        &:last-child {
          border-right: none;
        }
      }
    }
    .ant-table-tbody {
      tr {
        &:nth-child(even) {
          background: #f5f7f9;
        }
        td {
          padding: 7px 8px !important;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
}
// antdv 弹窗
.ant-modal-root {
  .ant-modal-wrap {
    .ant-modal {
      .ant-modal-content {
        .ant-modal-close {
          .ant-modal-close-x {
            height: 47px;
            line-height: 47px;
            font-size: 14px;
          }
        }
        .ant-modal-header {
          padding: 12px 24px;
          background: #f1f3f5;
          border-radius: 5px 5px 0px 0px;
          border-bottom: none;
          .ant-modal-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: #333333;
          }
        }
        .ant-modal-body {
          padding: 26px 24px 0;
        }
        .ant-modal-footer {
          text-align: center;
          border-top: none;
          padding: 22px 0 24px;
          button + button {
            margin-left: 16px;
          }
          .ant-btn {
            width: 90px;
            height: 34px;
            background: #eaeaea;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            border: none;
            border-radius: 17px;
            &.ant-btn-primary {
              color: #ffffff;
              background: #0070e2;
            }
          }
        }
      }
    }
  }
}
.ant-tooltip{
  max-width: 600px !important;
}
</style>
