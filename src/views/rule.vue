<template>
  <div class="profit">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">来源渠道</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_channel"
          >
            <a-select-option value="0"> 渠道1 </a-select-option>
            <a-select-option value="1"> 渠道2 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">利润中心</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_profit"
          >
            <a-select-option v-for="(item, index) in profitCenterList" :key="index" :value="item.code"> {{item.name}} </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">规则</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_rule"
          >
            <a-select-option value="0"> 规则1 </a-select-option>
            <a-select-option value="1"> 规则2 </a-select-option>
          </a-select>
        </div>
      </div>

      <a-button class="filter_btn" type="primary" @click="filterBtn"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button @click="openRuleModal('add')">+新增</a-button>
      <a-button>批量启用</a-button>
      <a-button>批量停用</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="ruleData"
        rowKey="id"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="openRuleModal('edit')">修改</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="source" title="来源渠道" data-index="source" />
        <a-table-column
          key="profitCenterName"
          title="利润中心"
          data-index="profitCenterName"
        />
        <a-table-column key="rule" title="规则" data-index="rule" />
        <!-- <a-table-column key="IsNotice" title="是否通知" data-index="IsNotice" /> -->

        <a-table-column key="IsNotice" title="是否通知" data-index="IsNotice">
          <template slot-scope="text, record">
            {{ text ? "是" : "否" }}
          </template>
        </a-table-column>

        <a-table-column key="action" title="启用/停用">
          <template slot-scope="text, record">
            <a-switch
              :defaultChecked="record.isEnable === '1'"
              checked-children="启用"
              un-checked-children="停用"
              @click="isEnableData(record.isEnable, record)"
            />
          </template>
        </a-table-column>
      </a-table>
      <div class="table_pagination">
        <a-pagination
          v-model="current"
          show-size-changer
          :total="currentTotal"
        />
        <div class="datas_total">
          共 <span>{{ currentTotal }}</span> 条记录
        </div>
      </div>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="ruleVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
    >
      <div class="profit_modal_main">
        <div class="main_header">
          <div class="modal_list">
            <div class="modal_item">
              <div class="item_title">配置状态</div>
              <div class="item_input">
                <a-switch
                  v-model="modalForm.IsEnable"
                  checked-children="启用"
                  un-checked-children="停用"
                />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">来源渠道</div>
              <div class="item_input">
                <a-select placeholder="请选择" allowClear style="width: 240px">
                  <a-select-option value="mobile"> 手机号 </a-select-option>
                  <a-select-option value="Email"> 邮箱 </a-select-option>
                  <a-select-option value="sms"> 黑屏 </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">利润中心</div>
              <div class="item_input">
                <a-select placeholder="请选择" allowClear style="width: 240px">
                  <a-select-option value="0"> 利润中心1 </a-select-option>
                  <a-select-option value="1"> 利润中心2 </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">规则</div>
              <div class="item_input">
                <a-select placeholder="请选择" allowClear style="width: 240px">
                  <a-select-option value="0"> 规则1 </a-select-option>
                  <a-select-option value="1"> 规则2 </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">是否通知</div>
              <div class="item_input">
                <a-radio-group v-model="value" @change="onChange">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="2"> 否 </a-radio>
                </a-radio-group>
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
      filter_channel: undefined, // 筛选来源渠道
      filter_rule: undefined, // 筛选规则
      filter_profit: undefined, // 筛选利润中心

      ruleData: [], // 表格数据
      selectedRowKeys: [], // 表格多选列表

      profitCenterList: [], // 利润中心列表

      current: 1, // 分页index
      currentTotal: 1, // 页面数据总数

      ruleVisible: false, // 新增/编辑弹窗
      modalTitle: "新增规则", // 弹窗标题
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {
        action: false,
      },

      value: 1, //弹窗 是否通知
    };
  },
  methods: {
    // 获取规则列表
    getData() {
      let data = {
        PageNo: 1,
        PageSize: 10,
        QueryInfo: {
          Source: "mobile", //类型：String  必有字段  备注：来源渠道（如手机：mobile ，邮件：Email）
        },
      };
      this.$axios
        .post("api/ConfigureProfitCenterRuleInfo/getpage", data)
        .then((res) => {
          if (res.data.isSuccess) {
            this.ruleData = res.data.value.datas;
            this.current = res.data.value.pageCount;
            this.currentTotal = res.data.value.totalCount;
          }
        });
    },

    // 获取利润中心列表
    getProfitCenter() {
      let data = {
        messagetype: "yatp_get_profitCenter_tree_info",
      };
      this.$axios
        .get("/api/ExternalAPI/GetYatpProfitCenter", { params: data })
        .then((res) => {
          if(res.data.isSuccess){
            this.profitCenterList = res.data.value
          }
        });
    },

    // 搜索按钮
    filterBtn() {
      console.log(this.filter_channel, this.filter_rule, this.filter_profit);
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

    // 单条数据停用启用
    isEnableData(status, val) {
      console.log(status, val);
      let data = {
        ID: val.id,
        IsEnable: status === "1" ? 0 : 1,
      };
      this.$axios
        .post("api/ConfigureProfitCenterRuleInfo/BatchUpdateState", data)
        .then((res) => {
          console.log(res);
        });
    },

    // 新增/修改弹窗
    openRuleModal(type) {
      this.ruleVisible = true;
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
      this.ruleVisible = false;
    },

    // 弹窗中 是否通知点击
    onChange(e) {
      console.log("radio checked", e.target.value);
    },
  },
  created() {
    this.getData();
    this.getProfitCenter();
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
      padding: 10px 68px;
      .item_title {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        margin-right: 8px;
      }
      .item_input {
        width: 240px;
      }
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
  }
  .ant-modal-body {
    padding: 68px;
  }
  .ant-modal-root {
    width: 440px;
  }
}
</style>