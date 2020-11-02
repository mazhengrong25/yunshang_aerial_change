<!--
 * @Description: 公共航变动态库
 * @Author: wish.WuJunLong
 * @Date: 2020-10-27 09:59:47
 * @LastEditTime: 2020-10-28 14:12:12
 * @LastEditors: wish.WuJunLong 
-->
<template>
  <div class="dynamic_library">
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
      <a-button>重<span>新</span>匹配采用</a-button>
      <a-button>解析PNR编码</a-button>
      <a-button @click="openModal('add')">+<span>新</span>增</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="dataList"
        rowKey="keyID"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="openModal('edit', record)"
              >修改</a-tag
            >
          </template>
        </a-table-column>
        <a-table-column title="内容">
          <template slot-scope="record">
            <p class="show_tag">查看</p>
          </template>
        </a-table-column>
        <a-table-column
          key="airlineCode"
          title="航司"
          data-index="airlineCode"
        />
        <a-table-column title="航变类型">
          <template slot-scope="record">
            {{
              record.changeType === "YW"
                ? "航班延误"
                : record.changeType === "TQ"
                ? "航班提前"
                : record.changeType === "QX"
                ? "航班取消"
                : record.changeType
            }}
          </template>
        </a-table-column>
        <a-table-column title="子类型">
          <template slot-scope="record">
            {{
              record.subtype === "Y"
                ? "航班取消有保护"
                : record.subtype === "N"
                ? "航班取消无保护"
                : record.subtype
            }}
          </template>
        </a-table-column>
        <a-table-column title="航班号">
          <template slot-scope="record">
            <p><span>原</span>{{ record.oFlightNumber }}</p>
            <p><span>新</span>{{ record.nFlightNumber }}</p>
          </template>
        </a-table-column>
        <a-table-column title="起飞时间">
          <template slot-scope="record">
            <p><span>原</span>{{ record.oDepartureTime?$moment(record.oDepartureTime).format("YYYY-MM-DD HH:mm:ss"): '' }}</p>
            <p><span>新</span>{{ record.nDepartureTime?$moment(record.nDepartureTime).format("YYYY-MM-DD HH:mm:ss"): '' }}</p>
          </template>
        </a-table-column>
        <a-table-column title="到达时间">
          <template slot-scope="record">
            <p><span>原</span>{{ record.oArriveTime?$moment(record.oArriveTime).format("YYYY-MM-DD HH:mm:ss"): '' }}</p>
            <p><span>新</span>{{ record.nArriveTime?$moment(record.nArriveTime).format("YYYY-MM-DD HH:mm:ss"): '' }}</p>
          </template>
        </a-table-column>
        <a-table-column title="航程三字码">
          <template slot-scope="record">
            <p>
              <span>原</span>{{ record.oFromCityCode }}{{ record.oToCityCode }}
            </p>
            <p>
              <span>新</span>{{ record.fromCityCode }}{{ record.toCityCode }}
            </p>
          </template>
        </a-table-column>
        <a-table-column title="航程名称">
          <template slot-scope="record">
            <p><span>原</span>{{ record.fromCity }} - {{ record.toCity }}</p>
            <p><span>新</span>{{ record.oFromCity }} - {{ record.oToCity }}</p>
          </template>
        </a-table-column>
        <a-table-column
          key="sourceName"
          title="来源渠道"
          data-index="sourceName"
        />
        <a-table-column title="采用状态">
          <template slot-scope="record">
            {{
              record.adopt === 0
                ? "未采用"
                : record.adopt === 1
                ? "已采用"
                : record.adopt === -1
                ? "无航变"
                : record.adopt
            }}
          </template>
        </a-table-column>
        <a-table-column key="addTime" title="入库时间" data-index="addTime" />
        <a-table-column title="来源信息">
          <template slot-scope="record">
            <a-tooltip placement="bottomLeft">
              <template slot="title" v-if="record.sign">
                {{ record.sign }}
              </template>
              <p :class="['show_tag', { no_message: !record.sign }]">查看</p>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="航程类型">
          <template slot-scope="record">
            {{
              record.voyageChangeType === 1
                ? "直飞对直飞"
                : record.voyageChangeType === 2
                ? "直飞变中转"
                : record.voyageChangeType === 3
                ? "中转转直飞"
                : record.voyageChangeType
            }}
          </template>
        </a-table-column>
      </a-table>
      <div class="table_pagination">
        <a-pagination
          @change="jumpPagination"
          @showSizeChange="editPageSize"
          v-model="current"
          :total="currentTotal"
          show-size-changer
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
      filter_type: undefined,
      filter_source: undefined,
      filter_profilt: undefined,

      dataList: [], // 数据列表

      selectedRowKeys: [], // 选中数据列表

      current: 1, // 页面下标
      currentTotal: 0, // 数据总数

      dictonaryList: [], // 来源渠道
    };
  },
  methods: {
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getData();
        this.getDictonaryList();
      });
    },
    getData() {
      let data = {
        pageNo: this.current,
        pageSize: 10,
        queryInfo: {
          profitCenterCode: "",
          msgSource: "",
          type: "",
          adopt: "",
          voyageCode: "",
          flihtNumber: "",
          upDeportDate: "",
          downDeportDate: "",
          upAddDate: "",
          downAddDate: "",
          sign: "",
        },
      };
      this.$axios.post("api/FlightChange/GetPage", data).then((res) => {
        console.log(res);
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
            this.$forceUpdate();
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
    // 筛选搜索按钮
    filterBtn() {},
    // 弹窗
    openModal() {},

    // 分页器跳转
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
.dynamic_library {
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
      padding: 0 13px;
      min-width: 80px;
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
    p {
      margin-bottom: 0;
      &:not(:last-child){
        margin-bottom: 8px;
      }
      span {
        width: 17px;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        border: 1px solid #ccc;
        border-radius: 2px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }
    }
    .show_tag {
      font-size: 12px;
      font-weight: 400;
      color: #0070e2;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
      &.no_message {
        cursor: default;
        color: #999;
        &:hover {
          text-decoration: none;
        }
      }
    }
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