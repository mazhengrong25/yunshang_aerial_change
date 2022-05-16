<template>
  <div class="resolved">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">来源类型</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
            allowClear
            v-model="filter_from.msgSource"
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
            v-model="filter_from.sign"
            allowClear
            placeholder="手机号/邮箱"
          />
        </div>
      </div>

      <a-button class="filter_btn" type="primary" @click="getdata"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button @click="openParseFlagModal">无需解析</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        rowKey="keyID"
        :data-source="dataList"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="dataParsing(record)">解析</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          key="messageText"
          title="内容"
          data-index="messageText"
          width="40%"
        />
        <a-table-column
          key="sourceName"
          title="来源渠道"
          data-index="sourceName"
        ></a-table-column>
        <a-table-column title="入库时间">
          <template slot-scope="text, record">
            {{
              record.addTime
                ? $moment(record.addTime).format("YYYY-MM-DD HH:mm:ss")
                : ""
            }}
          </template>
        </a-table-column>
        <a-table-column
          key="affiliationName"
          title="所属航司"
          data-index="affiliationName"
        ></a-table-column>
        <a-table-column
          key="pnr"
          title="PNR编码"
          data-index="pnr"
        ></a-table-column>
        <a-table-column
          key="correlativeOID"
          title="外部订单号"
          data-index="correlativeOID"
        ></a-table-column>
        <a-table-column title="解析状态">
          <template slot-scope="text, record">
            {{
              record.parseFlag === 0
                ? "待解析"
                : record.parseFlag === 1
                ? "自动解析成功"
                : record.parseFlag === 2
                ? "人工解析成功"
                : record.parseFlag === -1
                ? "解析失败"
                : record.parseFlag === -2
                ? "无关联订单"
                : record.parseFlag === -3
                ? "无需解析"
                : record.parseFlag
            }}
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

    <!-- 解析 模态框 -->
    <a-modal
      title="手工解析航变信息"
      :visible="parseVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1100px"
    >
      <div class="parse_title">
        <p>
          {{flightForm.messageText}}
        </p>
      </div>
      <div class="parse_middle">
        <div class="parse_item">航变来源</div>
        <div class="parse_select">
          <a-select
            placeholder="请输入"
            style="width: 432px"
            v-model="flightForm.msgSource"
          >
            <a-select-option value="0">手工录入</a-select-option>
            <a-select-option value="1">手工录入</a-select-option>
          </a-select>
        </div>
        <div class="parse_item">所属部门</div>
        <div class="parse_select">
          <a-select
            placeholder="请输入"
            style="width: 432px"
            v-model="flightForm.affiliationDept"
          >
            <a-select-option value="0">畅游国内</a-select-option>
            <a-select-option value="1">畅游国内</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="parse_seg">
        <div class="flight_level">
          <div class="flight_name">航空公司</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.airlineCode" placeholder="航司二字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原出发地</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.oFromCity" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原目的地</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.oToCity" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新出发地</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.fromCity" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新目的地</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.toCity" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原出发地码</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.oFromCityCode" placeholder="原出发地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原目的地码</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.oToCityCode" placeholder="原目的地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新出发地码</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.fromCityCode" placeholder="新出发地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新目的地码</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" v-model="flightForm.toCityCode" placeholder="新目的地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">航变类型</div>
          <div class="flight_name_type">
            <a-select
              placeholder="请选择"
              style="width: 168px"
              v-model="flight_type"
            >
              <a-select-option value="0">航变取消</a-select-option>
              <a-select-option value="1">航变取消</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">子类型</div>
          <div class="flight_name_type">
            <a-select
              placeholder="请选择"
              style="width: 168px"
              v-model="child_type"
            >
              <a-select-option value="0">航班取消无保护</a-select-option>
              <a-select-option value="1">航班取消无保护</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原航班号</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" placeholder="请输入" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新航班号</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" placeholder="请输入" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新目的地</div>
          <div class="flight_name_type">
            <a-input style="width: 168px" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原起飞时间</div>
          <div class="flight_name_type">
            <a-date-picker style="width: 168px" placeholder="起飞时间" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原到达时间</div>
          <div class="flight_name_type">
            <a-date-picker style="width: 168px" placeholder="到达时间" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新起飞时间</div>
          <div class="flight_name_type">
            <a-date-picker style="width: 168px" placeholder="起飞时间" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新到达时间</div>
          <div class="flight_name_type">
            <a-date-picker style="width: 168px" placeholder="到达时间" />
          </div>
        </div>
      </div>

      <div class="parse_add" @click="addSegment()">再加一段</div>
    </a-modal>

    <!-- 无需解析-->
    <a-modal
      title="提示"
      :visible="parseFlagModal"
      centered
      :width="440"
      :confirm-loading="parseFlagLoading"
      @ok="parseFlagSubmit"
      @cancel="parseFlagModal = false"
    >
      <div class="parse_flag_main">
        <div>是否确定将选择的航变信息设置为无需解析？</div>
        <p>一旦设置成功，该航变信息将不再关联显示！</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [], // 数据列表
      current: 1, // 页面下标
      currentTotal: 0, // 页面数据总数
      currentSize: 10, // 页面数据条数

      filter_from: {}, // 筛选条件

      dictonaryList: [], // 来源渠道

      selectedRowKeys: [], // 表格多选列表

      parseVisible: false, // 新增/编辑弹窗

      parseTitle: "",
      confirmLoading: false, // 确定按钮加载动画
      flightForm: {}, // 解析数据


      profitCenterList: [], // 利润中心列表

      parseFlagModal: false, // 无需解析弹窗
      parseFlagLoading: false, // 无需解析按钮状态
    };
  },
  methods: {
    // 获取token
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getdata();
        this.getDictonaryList();
      });
    },

    // 获取列表数据
    getdata() {
      let data = {
        pageNo: this.current,
        pageSize: this.currentSize,
        queryInfo: this.filter_from,
      };
      this.$axios.post("/api/Origin/GetPage", data).then((res) => {
        if (res.data.isSuccess) {
          this.dataList = res.data.value.datas;
          this.current = res.data.value.pageNo;
          this.currentTotal = res.data.value.totalCount;

          if (this.dictonaryList.length > 0) {
            this.dataList.forEach((item) => {
              this.dictonaryList.forEach((oitem) => {
                if (item.msgSource === oitem.value) {
                  console.log(oitem);
                  item["sourceName"] = oitem.name;
                }
              });
            });
          }

          this.$forceUpdate();
          console.log(this.dataList);
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
            this.dataList.forEach((item) => {
              this.dictonaryList.forEach((oitem) => {
                if (item.msgSource === oitem.value) {
                  console.log(oitem);
                  item["sourceName"] = oitem.name;
                }
              });
            });
            this.$forceUpdate();
          }
        });
    },

    // 表格多选
    onSelectChange(val) {
      this.selectedRowKeys = val;
    },

    // 无需解析弹窗
    openParseFlagModal() {
      if (this.selectedRowKeys.length < 1) {
        return this.$message.warning("请至少选择一条数据");
      }
      this.parseFlagModal = true;
    },
    // 无需解析提交数据
    parseFlagSubmit() {
      this.parseFlagLoading = true
      let data = {
        type: "batch",
        originIds: this.selectedRowKeys,
      };
      this.$axios.post('api/Origin/UpdateParseFlag',data)
        .then(res =>{
          this.parseFlagLoading = false
          if(res.data.isSuccess){
            this.$message.success(res.data.msg)
            this.parseFlagModal = false;
            this.getdata()
          }
        })
    },

    // 解析数据
    dataParsing(val) {
      this.parseVisible = true;
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
      this.parseVisible = false;
    },

    // 跳转页面
    jumpPagination(page) {
      this.current = page;
      this.getdata();
    },

    // 修改页面显示条数
    editPageSize(page, size) {
      this.currentSize = size;
      this.getdata();
    },
  },
  created() {
    this.getToken();
  },
};
</script>

<style lang="less" scoped>
.resolved {
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

.parse_title {
  display: flex;
  height: 72px;
  border-radius: 2px;
  border: 1px solid #d9e1ea;
  background: #f1f3f5;
  p {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
  }
}
.parse_middle {
  display: flex;
  margin: 25px 25px;
  .parse_select {
    margin-right: 13px;
  }
}
.parse_seg {
  height: 304px;
  border-radius: 2px;
  background: #f9f9f9;

  .flight_level {
    display: inline-flex;
    align-items: center;
    .flight_name {
      font-size: 13px;
      color: #333333;
      font-weight: 400;
      margin-left: 32px;
      width: 70px;
      text-align: right;
    }
    .flight_name_type {
      font-weight: bold;
      padding-left: 5px;
    }
  }
}
.parse_add {
  color: #0070e2;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.parse_flag_main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  div {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 18px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: #ff0000;
  }
}
</style>