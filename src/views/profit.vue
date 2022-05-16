<!--
 * @Description: 来源所属利润中心管理
 * @Author: wish.WuJunLong
 * @Date: 2020-10-27 09:59:47
 * @LastEditTime: 2020-10-28 14:12:12
 * @LastEditors: wish.WuJunLong 
-->
<template>
  <div class="profit">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">来源类型</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_from.Source"
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
        <div class="list_title">具体来源</div>
        <div class="list_selece">
          <a-input
            v-model="filter_from.Sign"
            allowClear
            placeholder="手机号/邮箱"
          />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">利润中心</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_from.ProfitCenterCode"
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

      <a-button class="filter_btn" type="primary" @click="getdata"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button @click="openProfitModal('add')">+新增</a-button>
      <a-button @click="dataStatusBtn(true)">批量启用</a-button>
      <a-button @click="dataStatusBtn(false)">批量停用</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        rowKey="id"
        :data-source="profitData"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="openProfitModal('edit', record)"
              >修改</a-tag
            >
          </template>
        </a-table-column>
        <a-table-column
          key="sourceName"
          title="来源类型"
          data-index="sourceName"
        />
        <a-table-column key="sign" title="具体来源" data-index="sign">
        </a-table-column>
        <a-table-column title="利润中心">
          <template slot-scope="text, record">
            {{ record.profitCenterName }}
          </template>
        </a-table-column>
        <a-table-column key="action" title="启用/停用">
          <template slot-scope="text, record">
            <a-switch
              v-model="record.isEnable"
              checked-children="启用"
              un-checked-children="停用"
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
      :title="modalTitle"
      :visible="profitVisible"
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
              <div class="item_title">来源类型</div>
              <div class="item_input">
                <a-select
                  v-model="modalForm.Source"
                  placeholder="请选择"
                  allowClear
                  style="width: 240px"
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
                  mode="multiple"
                  v-model="modalForm.ProfitCenterCode"
                  style="width: 100%"
                  placeholder="请选择"
                  @change="handleChange"
                  :maxTagCount="1"
                  allowClear
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
              <div class="item_title">具体来源</div>
              <div class="item_input">
                <a-input-group compact>
                  <a-select @change="openEmailModal" v-model="emailModalStatus">
                    <a-select-option value="0"> 手机 </a-select-option>
                    <a-select-option value="1"> 邮箱 </a-select-option>
                  </a-select>
                  <a-input
                    v-model="modalForm.Sign"
                    style="width: 73%"
                    placeholder="请输入"
                    allowClear
                  />
                </a-input-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 多选框  邮箱-->
    <a-modal
      :title="modalTitle"
      :visible="emailVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      :width="1040"
    >
      <div class="email_list">
        <div class="header_box">
          <div class="email_box">
            <div class="box_item">
              <div class="email_title_box">配置状态</div>
              <div class="email_item_box">
                <a-switch
                  checked-children="启用"
                  un-checked-children="停用"
                  v-model="modalForm.isEnable"
                />
              </div>
            </div>
          </div>

          <div class="email_box">
            <div class="box_item">
              <div class="email_title_box">来源类型</div>
              <div class="email_item_box">
                <a-select
                  v-model="modalForm.Source"
                  placeholder="请选择"
                  allowClear
                  style="width: 100%"
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

            <div class="box_item">
              <div class="email_title_box">利润中心</div>
              <div class="email_item_box">
                <a-select
                  mode="multiple"
                  v-model="modalForm.ProfitCenterCode"
                  style="width: 100%"
                  placeholder="请选择"
                  @change="handleChange"
                  allowClear
                  :maxTagCount="1"
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

            <div class="box_item">
              <div class="email_title_box">具体来源</div>
              <div class="email_item_box">
                <a-input-group compact>
                  <a-select @change="openEmailModal" v-model="emailModalStatus">
                    <a-select-option value="0"> 手机 </a-select-option>
                    <a-select-option value="1"> 邮箱 </a-select-option>
                  </a-select>
                  <a-input
                    v-model="modalForm.Sign"
                    style="width: 73%"
                    placeholder="请输入"
                    allowClear
                  />
                </a-input-group>
              </div>
            </div>
          </div>
        </div>

        <div class="email_box">
          <div class="item_box">
            <div class="email_title_box">端口</div>
            <div class="email_item_box">
              <a-input allowClear v-model="mailForm.port"></a-input>
            </div>
          </div>

          <div class="item_box">
            <div class="email_title_box">SLL</div>
            <div class="email_item_box">
              <a-input allowClear v-model="mailForm.ssl"></a-input>
            </div>
          </div>

          <div class="item_box">
            <div class="email_title_box">地址</div>
            <div class="email_item_box">
              <a-input allowClear v-model="mailForm.address"></a-input>
            </div>
          </div>
        </div>

        <div class="email_box">
          <div class="item_box">
            <div class="email_title_box">协议</div>
            <div class="email_item_box">
              <a-input allowClear v-model="mailForm.protocol"></a-input>
            </div>
          </div>

          <div class="item_box">
            <div class="email_title_box">秘匙</div>
            <div class="email_item_box">
              <a-input allowClear v-model="mailForm.password"></a-input>
            </div>
          </div>
          <div class="item_box"></div>
        </div>

        <div class="email_box tamplate_box">
          <div class="item_box">
            <div class="email_title_box">模板</div>
            <div class="email_item_box">
              <div
                class="email_card"
                v-for="(item, index) in templateList"
                :key="index"
              >
                <div class="card_title">模板名称：{{ item.readerName }}</div>
                <div class="card_title">
                  发件人域：{{ String(item.domains) }}
                </div>
                <div class="card_title">
                  发件人地址正则：{{ item.fromExpression }}
                </div>
                <div class="card_title">
                  主题正则：{{ item.subjectExpression }}
                </div>
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
      filter_from: {}, // 筛选

      profitData: [], // 利润中心数据

      dictonaryList: [], // 来源渠道

      profitCenterList: [], // 部门列表

      selectedRowKeys: [], // 表格多选列表

      current: 1, // 分页index
      currentTotal: 0, // 页面数据总数
      currentSize: 10, // 分页数量

      profitVisible: false, // 新增/编辑弹窗
      modalTitle: "新增", // 弹窗标题
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {}, // 数据详情
      mailForm: {}, // 邮件数据

      emailVisible: false, // 多选框 邮箱弹窗

      emailModalStatus: "0", // 弹窗类型

      templateList: [], // 模板列表
    };
  },
  methods: {
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getdata();
        this.getDictonaryList();
        this.getProfitCenter();
        this.getTemplateList();
      });
    },
    getdata() {
      let data = {
        PageNo: this.current,
        PageSize: this.currentSize,
        QueryInfo: this.filter_from,
      };
      this.$axios
        .post("/api/configureprofitcenterInfo/getpage", data)
        .then((res) => {
          if (res.data.isSuccess) {
            this.profitData = res.data.value.datas;
            this.current = res.data.value.pageNo;
            this.currentTotal = res.data.value.totalCount;
            if (this.dictonaryList.length > 0) {
              this.profitData.forEach((item) => {
                this.dictonaryList.forEach((oitem) => {
                  if (item.source === oitem.value) {
                    console.log(oitem);
                    item["sourceName"] = oitem.name;
                  }
                });
              });
              this.$forceUpdate();
            }
          }
        });
    },

    // 获取模板列表
    getTemplateList() {
      this.$axios.get("api/basetemplate/getemailreaders").then((res) => {
        if (res.data.isSuccess) {
          this.templateList = res.data.value;
        }
      });
    },

    // 批量启用停用数据列表
    dataStatusBtn(type) {
      // this.selectedRowKeys
      let data = {};
      this.$axios.post("", data).then((res) => {
        if (res.data.isSuccess) {
          this.$message.success(res.data.msg);
          this.getdata();
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
            this.profitData.forEach((item) => {
              this.dictonaryList.forEach((oitem) => {
                if (item.source === oitem.value) {
                  console.log(oitem);
                  item["sourceName"] = oitem.name;
                }
              });
            });
            this.$forceUpdate();
          }
        });
    },

    // 获取部门列表
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

    // 表格修改按钮
    editTable(val) {
      console.log(val);
    },
    // 表格多选
    onSelectChange(val) {
      this.selectedRowKeys = val;
    },

    // 新增/修改弹窗
    openProfitModal(type, val) {
      this.profitVisible = true;
      this.visibleType = type;
      this.confirmLoading = false;

      console.log(val);

      if (type === "add") {
        this.modalTitle = "新增";
        this.modalForm = {};
      } else {
        this.modalTitle = "编辑";
        this.modalForm = {
          isEnable: val.isEnable,
          Source: val.source,
          Sign: val.sign,
          ProfitCenterCode:
            val.profitCenterCode.indexOf(",") > 0
              ? val.profitCenterCode.split(",")
              : val.profitCenterCode,
          // SignInfo: "mock",
        };
        this.emailModalStatus = val.sign.indexOf("@") > 0 ? "1" : "0";
        console.log(this.modalForm);
      }
    },

    // 弹窗提交按钮
    submitBtn() {
      this.confirmLoading = true;

      let newData = JSON.parse(JSON.stringify(this.modalForm));

      if (newData.ProfitCenterCode) {
        if (newData.ProfitCenterCode.length > 0) {
          newData["ProfitCenterName"] = [];
          newData.ProfitCenterCode.forEach((item) => {
            this.profitCenterList.forEach((oitem) => {
              if (item === oitem.code) {
                newData.ProfitCenterName.push(oitem.name);
              }
            });
          });
        }
      }

      newData["ProfitCenterCode"] = newData.ProfitCenterCode
        ? String(newData.ProfitCenterCode)
        : "";
      newData["ProfitCenterName"] = newData.ProfitCenterName
        ? String(newData.ProfitCenterName)
        : "";
      let data = {
        isEnable: newData.isEnable ? true : false,
        Source: newData.Source,
        Sign: newData.Sign,
        ProfitCenterName: newData.ProfitCenterName,
        ProfitCenterCode: newData.ProfitCenterCode,
        SignInfo: JSON.stringify(this.mailForm) !== '{}'?JSON.stringify(this.mailForm): '',
        Readers: [],
      };

      console.log(data);

      this.$axios
        .post("/api/ConfigureProfitCenterInfo/Save", data)
        .then((res) => {
          this.confirmLoading = false;
          if (res.data.isSuccess) {
            this.$message.success(res.data.msg);
            this.cancelBtn();
            this.getdata();
          }
        });
    },
    // 弹窗关闭按钮
    cancelBtn() {
      this.profitVisible = false;
      this.emailVisible = false;
    },

    // 利润多选  选择器
    handleChange(value) {
      console.log(`selected ${value}`);
    },

    // 多选框选择邮箱弹出弹框
    openEmailModal(type) {
      console.log(type);
      this.emailModalStatus = type;
      if (type === "0") {
        this.profitVisible = true;
        this.emailVisible = false;
      } else {
        this.profitVisible = false;
        this.emailVisible = true;
      }
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
// 新增弹窗
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

// 邮箱新增弹窗
.email_list {
  .email_item {
    margin-left: 8px;
  }
  .header_box {
    border-bottom: 1px solid rgba(223, 223, 223, 1);
    margin-bottom: 16px;
    .email_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .box_item {
        display: flex;
        align-items: center;
        flex: 1;
        &:not(:last-child) {
          margin-right: 21px;
        }
        .email_title_box {
          margin-right: 8px;
        }
        .email_item_box {
          flex: 1;
        }
      }
    }
  }
  .email_box {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .item_box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 3;
      &:not(:last-child) {
        margin-right: 21px;
      }
      .email_title_box {
        margin-right: 8px;
      }
      .email_item_box {
        flex: 1;
        /deep/.ant-select-enabled {
          height: 32px;
          overflow: hidden;
        }
      }
    }

    &.tamplate_box {
      .item_box {
        align-items: flex-start;
        .email_item_box {
          border: 1px solid #cccccc;
          padding: 16px 12px;
          overflow-y: scroll;
          border-radius: 2px;
          height: 232px;
          background: #f1f3f5;
          overflow-y: auto;
          .email_card {
            &:not(:last-child) {
              padding-bottom: 8px;
              margin-bottom: 8px;
              border-bottom: 1px solid #dfdfdf;
            }
          }
        }
      }
    }

    .email_title_box {
      text-align: right;
      min-width: 30px;
      flex-shrink: 0;
    }
  }
}
</style>