<!--
 * @Author: your name
 * @Date: 2020-10-30 14:13:41
 * @LastEditTime: 2020-10-30 16:44:17
 * @LastEditors: Please set LastEditors
 * @Description: 航变通知
 * @FilePath: \positiond:\aerial\yunshang_aerial_change\src\views\changeNotice.vue
-->

<template>
  <div class="notice">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">订单来源</div>
        <div class="list_selece">
            <a-select
            placeholder="请选择"
            option-filter-prop="children"
            style="width: 160px"
            @change="handleChange"
            >
            <a-select-option value="0">来源1</a-select-option>
            <a-select-option value="1">来源2</a-select-option>
            </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">航变类型</div>
        <div class="list_selece">
            <a-select
            placeholder="请选择"
            option-filter-prop="children"
            style="width: 160px"
            @change="handleChange"
            >
            <a-select-option value="0">所有航变</a-select-option>
            <a-select-option value="1">航变延误</a-select-option>
            <a-select-option value="2">航变提前</a-select-option>
            <a-select-option value="3">航变取消</a-select-option>
            </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">是否有效</div>
        <div class="list_selece">
            <a-select
            placeholder="请选择"
            option-filter-prop="children"
            style="width: 160px"
            @change="handleChange"
            >
            <a-select-option value="0">有效</a-select-option>
            <a-select-option value="1">无效</a-select-option>
            </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">是否标记</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            placeholder="请选择"
          >
            <a-select-option value="0"> 标记 </a-select-option>
            <a-select-option value="1"> 未标记 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">
            <a-input-group compact>
                <a-select default-value="0">
                    <a-select-option value="0">航程代码</a-select-option>
                    <a-select-option value="1">航班号</a-select-option>
                    <a-select-option value="2">PNR编码</a-select-option>
                    <a-select-option value="3">机票票号</a-select-option>
                    <a-select-option value="4">外部订单号</a-select-option>
                </a-select>
                <a-input style="width: 160px" default-value="请输入" />
            </a-input-group>
        </div>
      </div>
       <div class="filter_list">
        <div class="list_title">OfficeNo</div>
        <div class="list_selece">
            <a-input-search placeholder="请输入" style="width: 160px" @search="onSearch" />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">原起飞日期</div>
        <div class="list_selece">
          <!-- <a-range-picker :size="size" /> -->
        </div>
      </div>
      <a-button class="filter_btn" type="primary">搜索</a-button>
    </div>

    <div class="table_tool">
      <a-button  icon="download">导出报表</a-button>
      <a-button>着重标记</a-button>
      <a-button>批量处理</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="noticeData"
        rowKey="id"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column key="detail" title="航变详情">
            <template slot-scope="record">
                <a-button type="link">查看</a-button>
            </template>
        </a-table-column>
        <a-table-column key="type" title="航变类型" data-index="name">
            <template slot-scope="record">
                <a-button type="link">航班取消</a-button>
            </template>
        </a-table-column>
        <a-table-column key="number" title="航班号" data-index="type" />
        <a-table-column key="start_time" title="起飞时间" data-index="value" />
        <a-table-column key="end_time" title="到达时间" data-index="isEnable" />
        <a-table-column key="name" title="航程名称" data-index="isEnable" />
        <a-table-column key="shop" title="店铺/单号" data-index="isEnable" />
        <a-table-column key="pnr" title="PNR" data-index="isEnable" />
        <a-table-column key="passenger" title="乘客" data-index="isEnable" />
        <a-table-column key="state" title="状态" data-index="isEnable">
            <template slot-scope="record">
                <a-button type="link">待处理</a-button>
            </template>
        </a-table-column>
        <a-table-column key="tic_number" title="票号" data-index="tic_number" />
        <a-table-column key="office" title="OfficeNo" data-index="office" />
        <a-table-column key="contact" title="联系方式" data-index="contact" />
        <a-table-column key="notice" title="通知" data-index="notice" />
        <a-table-column key="come" title="入库" data-index="come" />
        <a-table-column key="operate" title="操作" data-index="operate">
            <template slot-scope="record">
                <a-tag color="#FB9826">日志</a-tag>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter_use: undefined, // 筛选是否启用
      filter_profilt: undefined, // 筛选利润中心

      noticeData: [], // 表格数据
      selectedRowKeys: [], // 表格多选列表

      current: 1, // 分页index
      currentTotal: 1, // 页面数据总数

      dictionVisible: false, // 新增/编辑弹窗
      modalTitle: "新增字典", // 弹窗标题
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {
        action: false,
      },
      action: false,
      input_name:'',  // 字典名称
      input_type:'', // 字典类型
      input_value:'', // 字典值

      value: "",
    };
  },
  methods: {
    // 下拉框
    handleChange(value) {
      console.log(`selected ${value}`);
    },

    // 输入框  搜索
    onSearch(value) {
      console.log(value);
    },

     // 表格多选
    onSelectChange(val) {
      console.log(val);
      this.selectedRowKeys = val;
    },
  },

   mounted() {

    for (let i = 0; i < 10; i++) {
      this.noticeData.push({
        tic_number: "6665477585110",
        notice: "0次",
        office: "CKG177"
      });
    }
  },
  
}
</script>

<style lang="less" scoped>
.notice {
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
    display: flex;
    justify-content: flex-end;
    .ant-btn {
      width: 104px;
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

    .ant-table-body > tbody.ant-table-tbody > tr.ant-table-row :hover {
        background: #0070E2; 
        // opacity: 0.1;
    }

    // .ant-table-tbody > tr:hover:not(.ant-table-row) > td { background: white; }
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

.table_main{

    .ant-table-tbody > tr.ant-table-row:hover > td{
        background: #0070E2; 
        opacity: 0.1;
    }
}
</style>

