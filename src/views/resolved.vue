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

      <a-button class="filter_btn" type="primary" @click="getdata"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button>批量停用</a-button>
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
        <a-table-column
          key="upAddTime"
          title="入库时间"
          data-index="upAddTime"
        ></a-table-column>
        <a-table-column
          key="profitCenterCode"
          title="所属航司"
          data-index="profitCenterCode"
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
        <a-table-column
          key="ParseFlag"
          title="解析状态"
          data-index="ParseFlag"
        ></a-table-column>
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
    };
  },
  methods: {
    // 获取token
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getdata();
      });
    },

    // 获取列表数据
    getdata() {
      let data = {
        pageNo: 1,
        pageSize: 10,
        queryInfo: {
          profitCenterCode: "",
          msgSource: "",
          ParseFlag: "",
          messageText: "",
          upAddTime: "",
          downAddTime: "",
          sign: "",
        },
      };
      this.$axios.post("/api/Origin/GetPage", data).then((res) => {
        if (res.data.isSuccess) {
          this.dataList = res.data.value.datas;
          this.current = res.data.value.pageNo;
          this.currentTotal = res.data.value.totalCount;

          this.dataList.forEach((item) => {
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

    // 表格多选
    onSelectChange(val) {
      this.selectedRowKeys = val;
    },

    // 解析数据
    dataParsing(val) {},

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
</style>