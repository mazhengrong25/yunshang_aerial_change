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
            <a-select-option
              v-for="(item, index) in dictonaryList"
              :key="index"
              :value="item.value"
            >
              {{ item.name }}
            </a-select-option>
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
            <a-select-option
              v-for="(item, index) in profitCenterList"
              :key="index"
              :value="item.code"
            >
              {{ item.name }}
            </a-select-option>
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
            <a-select-option value="All"> 匹配及关联 </a-select-option>
            <a-select-option value="ProfitCenter">
              利润中心匹配
            </a-select-option>
            <a-select-option value="ByCondition">
              条件匹配及关联
            </a-select-option>
            <a-select-option value="ByConditionAndCenter">
              利润中心及条件匹配
            </a-select-option>
            <a-select-option value="Default"> 匹配关联不通知 </a-select-option>
          </a-select>
        </div>
      </div>

      <a-button class="filter_btn" type="primary" @click="filterBtn"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button @click="openRuleModal('add', {})">+新增</a-button>
      <a-button @click="batchBtn(true)">批量启用</a-button>
      <a-button @click="batchBtn(false)">批量停用</a-button>
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
            <a-tag color="#FB9826" @click="openRuleModal('edit', record)"
              >修改</a-tag
            >
          </template>
        </a-table-column>
        <a-table-column key="sourceName" title="来源渠道" data-index="sourceName" />
        <a-table-column
          key="profitCenterName"
          title="利润中心"
          data-index="profitCenterName"
        />
         <a-table-column title="规则">
          <template slot-scope="text, record">
            {{ record.rule === 'All' ? "匹配及关联" : 
            record.rule === 'ProfitCenter' ? "利润中心匹配" : 
            record.rule === 'ByCondition' ? "条件匹配及关联（及票号、PNR或外部订单号）" :
            record.rule === 'ByConditionAndCenter' ? "利润中心及条件匹配（及票号、PNR或外部订单号）" :
            record.rule === 'Default' ? "匹配关联不通知" : record.rule}}
          </template>
        </a-table-column>
        <a-table-column title="是否通知">
          <template slot-scope="text, record">
            {{ record.isNotice ? "是" : "否" }}
          </template>
        </a-table-column>

        <a-table-column key="action" title="启用/停用">
          <template slot-scope="text, record">
            <a-switch
              :defaultChecked="record.isEnable"
              checked-children="启用"
              un-checked-children="停用"
              @click="isEnableData(record)"
            />
          </template>
        </a-table-column>
      </a-table>
      <div class="table_pagination">
        <a-pagination
          @change="jumpPagination"
          @showSizeChange="editPageSize"
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
      :title="modalTitle + '规则'"
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
                  v-model="modalForm.isEnable"
                  checked-children="启用"
                  un-checked-children="停用"
                />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">来源渠道</div>
              <div class="item_input">
                <a-select
                  v-model="modalForm.source"
                  placeholder="请选择"
                  allowClear
                  style="width: 240px"
                  :disabled="rule_visible_type === 'edit'"
                >
                  <a-select-option
                    v-for="(item, index) in dictonaryList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">利润中心</div>
              <div class="item_input">
                <a-select
                  v-model="modalForm.profitCenterCode"
                  placeholder="请选择"
                  allowClear
                  style="width: 240px"
                  :disabled="rule_visible_type === 'edit'"
                >
                  <a-select-option
                    v-for="(item, index) in profitCenterList"
                    :key="index"
                    :value="item.code"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">规则</div>
              <div class="item_input">
                <a-select
                  v-model="modalForm.rule"
                  placeholder="请选择"
                  allowClear
                  style="width: 240px"
                >
                  <a-select-option value="All"> 匹配及关联 </a-select-option>
                  <a-select-option value="ProfitCenter">
                    利润中心匹配
                  </a-select-option>
                  <a-select-option value="ByCondition">
                    条件匹配及关联
                  </a-select-option>
                  <a-select-option value="ByConditionAndCenter">
                    利润中心及条件匹配
                  </a-select-option>
                  <a-select-option value="Default">
                    匹配关联不通知
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">是否通知</div>
              <div class="item_input">
                <a-radio-group v-model="modalForm.isNotice" defaultValue="1">
                  <a-radio value="0"> 是 </a-radio>
                  <a-radio value="1"> 否 </a-radio>
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

      dictonaryList: [], // 字典列表

      current: 1, // 分页index
      currentSize: 10,
      currentTotal: 1, // 页面数据总数

      ruleVisible: false, // 新增/编辑弹窗
      modalTitle: "新增", // 弹窗标题
      rule_visible_type: "add", // 弹窗状态
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {},

      value: 1, //弹窗 是否通知
    };
  },
  methods: {
    // 获取token
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getData();
        this.getDictonaryList();
        this.getProfitCenter();
      });
    },

    // 获取规则列表
    getData() {
      let data = {
        PageNo: this.current,
        PageSize: this.currentSize,
        QueryInfo: {
          Source: this.filter_channel,
          profitCenterCode: this.filter_profit,
          rule: this.filter_rule,
        },
      };
      this.$axios
        .post("api/ConfigureProfitCenterRuleInfo/getpage", data)
        .then((res) => {
          if (res.data.isSuccess) {
            this.ruleData = res.data.value.datas;
            this.current = res.data.value.pageNo;
            this.currentTotal = res.data.value.totalCount;
            if(this.dictonaryList.length > 0){
              this.ruleData.forEach(item =>{
              this.dictonaryList.forEach(oitem =>{
                if(item.source === oitem.value){
                console.log(oitem)
                  item['sourceName'] = oitem.name
                }
              })
            })
            this.$forceUpdate()
            }
          }
        });
        
    },

    // 获取来源渠道
    getDictonaryList() {
      let data = {
        type: "Source",
      };
      this.$axios
        .get("api/datadictitem/getListbytype", { params: data })
        .then((res) => {
          console.log(res);
          if (res.data.isSuccess) {
            this.dictonaryList = res.data.value;
            this.ruleData.forEach(item =>{
              this.dictonaryList.forEach(oitem =>{
                if(item.source === oitem.value){
                console.log(oitem)
                  item['sourceName'] = oitem.name
                }
              })
            })
            this.$forceUpdate()
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
          if (res.data.isSuccess) {
            this.profitCenterList = res.data.value;
          }
        });
    },

    // 批量开关
    batchBtn(type) {
      let data = [];
      this.selectedRowKeys.forEach((item) => {
        data.push({
          ID: item,
          IsEnable: type,
        });
      });

      this.$axios.post("api/ConfigureProfitCenterRuleInfo/BatchUpdateState", data).then((res) => {
        if (res.data.isSuccess) {
          this.$message.success(res.data.msg);
          this.getData();
        }
      });
    },

    // 跳转页面
    jumpPagination(page) {
      this.current = page;
      this.getData();
    },

    // 修改页面显示条数
    editPageSize(page, size) {
      this.currentSize = size;
      this.getData();
    },

    // 搜索按钮
    filterBtn() {
      this.getData();
    },
    // 表格多选
    onSelectChange(val) {
      console.log(val);
      this.selectedRowKeys = val;
    },

    // 单条数据停用启用
    isEnableData(val) {
      let data = [
        {
          ID: val.id,
          IsEnable: !val.isEnable,
        },
      ];
      this.$axios
        .post("api/ConfigureProfitCenterRuleInfo/BatchUpdateState", data)
        .then((res) => {
          this.$message.success(res.data.msg);
          this.getData();
        });
    },

    // 新增/修改弹窗
    openRuleModal(type, val) {
      console.log(val);
      this.ruleVisible = true;
      this.confirmLoading = false;
      this.rule_visible_type = type;
      this.modalTitle = type === "add" ? "新增" : "编辑";
      if (type === "add") {
        this.modalForm = {};
        this.modalTitle = "新增";
      } else {
        let editData = JSON.parse(JSON.stringify(val));
        editData.isNotice = editData.isNotice ? "0" : "1";
        console.log(editData);
        this.modalForm = editData;
        this.modalTitle = "编辑";
      }
    },

    // 弹窗提交按钮
    submitBtn() {
      this.confirmLoading = true;
      console.log(this.modalForm);
      // setTimeout(() => {
      //   this.confirmLoading = false;
      //   this.cancelBtn();
      //   this.$message.success("保存成功");
      // }, 1000);
      let profitCenterName;
      this.profitCenterList.forEach((item) => {
        if (item.code === this.modalForm.profitCenterCode) {
          profitCenterName = item.name;
        }
      });
      let data = {
        Source: this.modalForm.source,
        Rule: this.modalForm.rule,
        ProfitCenterName: profitCenterName,
        ProfitCenterCode: this.modalForm.profitCenterCode,
        IsEnable: this.modalForm.isEnable,
        IsNotice: this.modalForm.isNotice === "0" ? true : false,
      };
      let url;
      if (this.rule_visible_type === "add") {
        url = "api/ConfigureProfitCenterRuleInfo/save";
      } else {
        url = "api/ConfigureProfitCenterRuleInfo/Update";
        data["ID"] = this.modalForm.id;
      }

      console.log(data);
      this.$axios.post(url, data).then((res) => {
        console.log(res);
        if (res.data.isSuccess) {
          this.$message.success(res.data.msg);
          this.confirmLoading = false;
          this.ruleVisible = false;
          this.getData();
        }
      });
    },
    // 弹窗关闭按钮
    cancelBtn() {
      this.ruleVisible = false;
    },
  },
  created() {
    this.getToken();
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
        width: 70px;
        text-align: right;
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