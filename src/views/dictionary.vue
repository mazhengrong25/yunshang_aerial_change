<template>
  <div class="profit">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">字典类型</div>
        <div class="list_selece">
          <a-input style="width: 160px" placeholder="请输入" />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">字典名称</div>
        <div class="list_selece">
          <a-input style="width: 160px" placeholder="请输入" />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">字典值</div>
        <div class="list_selece">
          <a-input style="width: 160px" placeholder="请输入" />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">是否启用</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_use"
          >
            <a-select-option value="0"> 启用 </a-select-option>
            <a-select-option value="1"> 停用 </a-select-option>
          </a-select>
        </div>
      </div>
      <a-button class="filter_btn" type="primary" @click="filterBtn"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button @click="openDictionModal('add')">+新增</a-button>
      <a-button>批量启用</a-button>
      <a-button>批量停用</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="dictionData"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="openDictionModal('edit')">修改</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="name" title="字典名称" data-index="name" />
        <a-table-column key="type" title="字典类型" data-index="type" />
        <a-table-column
          key="value"
          title="字典值"
          data-index="value"
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
        <a-pagination
          v-model="current"
          show-size-changer
          :total="dictionData.length"
        />
        <div class="datas_total">
          共 <span>{{ dictionData.length }}</span> 条记录
        </div>
      </div>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="dictionVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      style="width:440px"
    >
      <div class="profit_modal_main">
        <div class="main_header">
          <div class="modal_list">
            <div class="modal_item">
              <div class="item_title">字典状态</div>
              <div class="item_input">
                <a-switch
                  v-model="modalForm.action"
                  checked-children="启用"
                  un-checked-children="停用"
                />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">字典名称</div>
              <div class="item_input">
                <a-input  placeholder="请输入" />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">字典类型</div>
              <div class="item_input">
                <a-input  placeholder="请输入" />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">字典值</div>
              <div class="item_input">
                <a-input  placeholder="请输入" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // filter_type: undefined, // 筛选来源类型
      filter_use: undefined, // 筛选是否启用
      filter_profilt: undefined, // 筛选利润中心

      dictionData: [], // 表格数据
      selectedRowKeys: [], // 表格多选列表

      current: 1, // 分页index

      dictionVisible: false, // 新增/编辑弹窗
      modalTitle: "新增字典", // 弹窗标题
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {
        action: false,
      },
      value:''
    };
  },
  methods: {
    // 搜索按钮
    filterBtn() {
      console.log( this.filter_use);
    },

    // 表格修改按钮
    editTable(val) {
      console.log(val);
    },
    // 表格多选
    onSelectChange(val) {
      console.log(val);
      this.selectedRowKeys = val;
    },

    // 新增/修改弹窗
    openDictionModal(type) {
      this.dictionVisible = true;
    },

    // 弹窗提交按钮
    submitBtn() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.confirmLoading = false;
        this.cancelBtn();
        this.$message.success("保存成功");
      }, 1000);
    },
    // 弹窗关闭按钮
    cancelBtn() {
      this.dictionVisible = false;
    },
  },
  mounted() {
    for (let i = 0; i < 22; i++) {
      this.dictionData.push({
        key: i,
        name: "字典1",
        type: "类型1",
        value: "123",
        action: '',
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
    .table_pagination {
      margin: 32px 0;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .datas_total {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        span {
          color: #333333;
        }
      }
    }
  }
}
.profit_modal_main {
    .main_header {
    }
    .modal_list {
      .modal_item {
        display: flex;
        align-items: center;
        padding:10px 68px;
        .item_title {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          margin-right: 8px;
        }
        .item_input{
            width: 240px;
        }&:not(:last-child) {
        margin-bottom: 5px;
        }
      }

    }
    .ant-modal-body {
      padding:68px;
    }
    .ant-modal-root {
      width:440px;
    }
}
</style>