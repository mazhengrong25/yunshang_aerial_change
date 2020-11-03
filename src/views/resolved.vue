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
            <a-tag  color="#FB9826" @click="dataParsing(record)">解析</a-tag>
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

    <!-- 解析 模态框 -->
    <a-modal
      :title="parseTitle"
      :visible="parseVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1100px">
      
      <div class="parse_title"> 
          <p>
            【东海航空】尊敬的王文杰旅客，您预定的2020-10-21 15:30:00由郑州起飞到达深圳的DZ6220航班，
            因流量控制原因导致航班时刻调整，目前起飞时间预计为2020-10-21北京时间16:30:00。请您按照新的起飞时间国内航班提前120分钟，
            国际航班提前180分钟到达机场办理登机手续，东海航空祝您旅途愉快。
          </p>
      </div>
      <div class="parse_middle">
          <div class="parse_item">航变来源</div>
          <div class="parse_select">
              <a-select
                placeholder="请输入"
                style="width: 432px"
                v-model="flight_source"
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
               v-model="flight_depart"
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
              <a-input  style="width:168px" placeholder="航司二字码" />
          </div>
        </div>


        <div class="flight_level">
          <div class="flight_name">原出发地</div>
          <div class="flight_name_type">
              <a-input  style="width:168px" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原目的地</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新出发地</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新目的地</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原出发地码</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="原出发地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原目的地码</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="原目的地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新出发地码</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="新出发地三字码" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新目的地码</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="新目的地三字码" />
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
              <a-input style="width:168px" placeholder="请输入" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新航班号</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="请输入" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新目的地</div>
          <div class="flight_name_type">
              <a-input style="width:168px" placeholder="例：重庆" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原起飞时间</div>
          <div class="flight_name_type">
               <a-date-picker style="width:168px" placeholder="起飞时间" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">原到达时间</div>
          <div class="flight_name_type">
              <a-date-picker style="width:168px" placeholder="到达时间" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新起飞时间</div>
          <div class="flight_name_type">
              <a-date-picker style="width:168px" placeholder="起飞时间" />
          </div>
        </div>

        <div class="flight_level">
          <div class="flight_name">新到达时间</div>
          <div class="flight_name_type">
              <a-date-picker style="width:168px" placeholder="到达时间"/>
          </div>
        </div>



      </div>

      <div class="parse_add" @click="addSegment()">再加一段</div>
  
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

      parseTitle:'手工解析航变信息',
      confirmLoading: false, // 确定按钮加载动画
      flight_source:'',  // 航变来源
      flight_depart:'' , // 所属来源
      flight_type:'',  //航变类型 
      child_type:'', //子类型

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
  border: 1px solid #D9E1EA;
  background: #F1F3F5;
  .p{
    
      font-size: 12px;
      font-weight: 400;
      color: #333333;
  }
}
.parse_middle {
  display: flex;
  margin:25px 25px;
  .parse_select {
    margin-right: 13px
  }
}
.parse_seg {

  height: 304px; 
  border-radius: 2px;
  background: #F9F9F9;

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
}&:not(:last-child) {
      margin-bottom: 15px;
}
.parse_add {
  
  color: #0070E2;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

</style>