
<template>
  <div class="template">
    <div class="title">
      <div class="title_name">数据字典管理</div>
      <div class="select_user">
        <a-select default-value="0" @change="handleChange">
          <a-select-option value="0"> 畅游国内 </a-select-option>
          <a-select-option value="1"> 畅游国际 </a-select-option>
          <a-select-option value="2"> 国际正航 </a-select-option>
        </a-select>
      </div>
    </div>
    <!-- <slot></slot> -->
    <div class="item">
      <div class="item_name">
        <div>字典类型</div>
        <div class="item_input">
          <a-input placeholder="请输入" />
        </div>
      </div>
      <div class="item_name">
        <div>字典名称</div>
        <div class="item_input">
          <a-input placeholder="请输入" />
        </div>
      </div>
      <div class="item_name">
        <div>字典值</div>
        <div class="item_input">
          <a-input placeholder="请输入" />
        </div>
      </div>
      <div class="item_name">
        <div>是否启用</div>
        <div class="item_input">
          <a-select
            placeholder="请选择"
            style="width: 200px"
            @change="handleChange"
          >
            <a-select-option value="1">
              启用
            </a-select-option>
            <a-select-option value="2">
              停用
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="item_name">
        <div class="item_input">
          <a-button type="primary">
            搜索
          </a-button>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="action">
      <a-space :size="size">
        <a-button>+新增</a-button>
        <a-button>批量启用</a-button>
        <a-button>批量停用</a-button>
      </a-space>

      <a-table
        :columns="columns"
        :data-source="data"
        :row-selection="rowSelection"
        bordered
      >
        <span slot="tags">
          <a-tag color="#FB9826"></a-tag>
        </span>
        <span slot="switchs">
          <a-switch
            checked-children="启用"
            un-checked-children="停用"
            default-checked
          />
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "操作",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "tags" },
  },
  {
    title: "字典名称",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "字典类型",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "字典值",
    dataIndex: "dic",
    key: "dic",
  },
  {
    title: "启用/停用",
    // dataIndex: 'index',
    // key: 'index',
    scopedSlots: { customRender: "switchs" },
  },
];

const data = [];
for (let i = 0; i < 50; i++) {
  data.push({
    key: i.toString(),
    name: `修改`,
    age: 32,
    address: `London Park no. ${i}`,
    dic: 23,
    index: 235,
  });
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};
export default {
  data() {
    return {
      size: "small", //控制按钮间距
      data,
      columns,
      rowSelection,
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
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
  .item {
    padding: 0 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item_name {
      display: inline-flex;
      align-items: center;
      margin-bottom: 22px;
      font-weight: 400;
      font-size: 14px;
      &:not(:last-child) {
        margin-right: 47px;
      }
      .item_input {
        margin-left: 8px;
      }
      .ant-btn-primary {
        border-radius: 17px;
        width: 90px;
      }
    }
  }
  .action {
    // height: 100%;
    // .ant-table-thead > tr:nth-child(odd) {
    //   // background:rgba(235, 239, 244, 1);
    //   background-color: #0070E2;
    // }
    .ant-table > tr:nth-child(even) {
      background-color: #0070e2;
    }
    .ant-space {
      padding: 0 16px;
    }
    .ant-btn {
      border: 1px solid #0070e2;
      color: #0070e2;
      border-radius: 15px;
    }
    .ant-table-wrapper {
      padding-top: 20px;
    }
  }
}
</style>
