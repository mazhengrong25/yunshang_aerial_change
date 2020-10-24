<template>
  <div class="profit">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">来源类型</div>
        <div class="list_selece">
          <a-select
            style="width: 120px"
            placeholder="请选择"
            allowClear
            v-model="filter_type"
          >
            <a-select-option value="0"> 类型1 </a-select-option>
            <a-select-option value="1"> 类型2 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">具体来源</div>
        <div class="list_selece">
          <a-select
            style="width: 120px"
            placeholder="请选择"
            allowClear
            v-model="filter_source"
          >
            <a-select-option value="0"> 来源1 </a-select-option>
            <a-select-option value="1"> 来源2 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">利润中心</div>
        <div class="list_selece">
          <a-select
            style="width: 120px"
            placeholder="请选择"
            allowClear
            v-model="filter_profilt"
          >
            <a-select-option value="0"> 利润中心1 </a-select-option>
            <a-select-option value="1"> 利润中心2 </a-select-option>
          </a-select>
        </div>
      </div>

      <a-button class="filter_btn" type="primary" @click="filterBtn"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button>+新增</a-button>
      <a-button>批量启用</a-button>
      <a-button>批量停用</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="profitData"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="editTable(record)">修改</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="type" title="来源类型" data-index="type" />
        <a-table-column key="source" title="具体来源" data-index="source">
          <template slot-scope="text, record">
            <span>{{ record.phone }}</span>
          </template>
        </a-table-column>
        <a-table-column
          key="profitCenter"
          title="利润中心"
          data-index="profitCenter"
        />
        <a-table-column key="action" title="启用/停用">
          <template slot-scope="text, record">
            <a-switch
              v-model="record.action"
              checked-children="启用"
              un-checked-children="停用"
            />
          </template>
        </a-table-column>
      </a-table>
      <div class="table_pagination">
        <a-pagination :show-total="total => `共 ${total} 条记录`" v-model="current" show-size-changer :total="profitData.length" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter_type: undefined, // 筛选来源类型
      filter_source: undefined, // 筛选具体来源
      filter_profilt: undefined, // 筛选利润中心

      profitData: [], // 表格数据
      selectedRowKeys: [],

      current: 1,
    };
  },
  methods: {
    // 搜索按钮
    filterBtn() {
      console.log(this.filter_type, this.filter_source, this.filter_profilt);
    },

    // 表格修改按钮
    editTable(val) {
      console.log(val);
    },
    onSelectChange(val) {
      console.log(val);
      this.selectedRowKeys = val;
    },
  },
  mounted() {
    for (let i = 0; i < 22; i++) {
      this.profitData.push({
        key: i,
        type: "数据字典" + i,
        source: "具体来源" + i,
        phone: i,
        profitCenter: "利润中心" + i,
        action: i % 2 === 0,
      });
    }
  },
};
</script>

<style lang="less" scoped>
.profit {
  .filter_header {
    display: flex;
    align-items: center;
    padding: 0 16px;
    margin-bottom: 22px;
    .filter_list {
      display: inline-flex;
      align-items: center;
      margin-right: 40px;
      .list_title {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        margin-right: 8px;
      }
      .list_selece {
        width: 160px;
        /deep/.ant-select-selection {
          width: 160px;
          height: 34px;
          border: 1px solid #dfdfdf;
          border-radius: 2px;
          box-shadow: none;
        }
      }
    }
    .filter_btn {
      width: 90px;
      height: 34px;
      background: #0070e2;
      border-radius: 17px;
      border: none;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .table_tool {
    padding: 0 16px;
    margin-bottom: 18px;
    .ant-btn {
      width: 80px;
      height: 30px;
      border: 1px solid #0070e2;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 400;
      color: #0070e2;
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }

  .table_main {
    /deep/.ant-table-body {
      table {
        border-left: none;
        .ant-table-thead {
          th {
            border-radius: 0;
            background: #ebeff4;
            &:last-child {
              border-right: none;
            }
          }
        }
        .ant-table-tbody {
          tr {
            &:nth-child(even) {
              background: #f5f7f9;
              td {
              }
            }
            td {
              &:last-child {
                border-right: none;
              }
            }
          }
        }
      }
    }
    .table_pagination{
      text-align: right;
      margin: 32px 0;
      padding-right: 16px;
    }
  }
}

/deep/.ant-switch {
  min-width: 64px;
  &.ant-switch-checked {
    background-color: #5ab957;
  }
}
</style>