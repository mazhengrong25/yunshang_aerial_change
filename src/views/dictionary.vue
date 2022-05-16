<!--
 * @Description: 数据字典
 * @Author: wish.WuJunLong
 * @Date: 2020-10-27 09:59:47
 * @LastEditTime: 2020-11-04 10:57:00
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="profit">
    <div class="filter_header">
      <div class="filter_list">
        <div class="list_title">字典类型</div>
        <div class="list_selece">
          <a-input
            allowClear
            style="width: 160px"
            v-model="input_type"
            placeholder="请输入"
          />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">字典名称</div>
        <div class="list_selece">
          <a-input
            allowClear
            style="width: 160px"
            v-model="input_name"
            placeholder="请输入"
          />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">字典值</div>
        <div class="list_selece">
          <a-input
            allowClear
            style="width: 160px"
            v-model="input_value"
            placeholder="请输入"
          />
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
      <a-button @click="openDictionModal('add',{})">+新增</a-button>
      <a-button @click="batchBtn(true)">批量启用</a-button>
      <a-button @click="batchBtn(false)">批量停用</a-button>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="dictionData"
        rowKey="id"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="openDictionModal('edit', record)"
              >修改</a-tag
            >
          </template>
        </a-table-column>
        <a-table-column key="name" title="字典名称" data-index="name" />
        <a-table-column key="type" title="字典类型" data-index="type" />
        <a-table-column key="value" title="字典值" data-index="value" />
        <a-table-column key="isEnable" title="启用/停用" data-index="isEnable">
          <template slot-scope="text, record">
            <a-switch
              v-model="record.isEnable"
              checked-children="启用"
              un-checked-children="停用"
              @change="editTableStatus(record)"
            />
          </template>
        </a-table-column>
      </a-table>
      <div class="table_pagination">
        <a-pagination
          @change="jumpPagination"
          @showSizeChange="editPageSize"
          v-model="page"
          show-size-changer
          :total="currentTotal"
        />
        <div class="datas_total">
          共 <span>{{ currentTotal }}</span> 条记录
        </div>
      </div>
    </div>

    <a-modal
      :title="modalTitle + '字典'"
      :visible="dictionVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      style="width: 440px"
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
                <a-input v-model="modalForm.input_name" placeholder="请输入" />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">字典类型</div>
              <div class="item_input">
                <a-input :disabled="diction_visible_type === 'edit'" v-model="modalForm.input_type" placeholder="请输入" />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">字典值</div>
              <div class="item_input">
                <a-input :disabled="diction_visible_type === 'edit'" v-model="modalForm.input_value" placeholder="请输入" />
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
      filter_use: undefined, // 筛选是否启用
      filter_profilt: undefined, // 筛选利润中心

      dictionData: [], // 表格数据
      selectedRowKeys: [], // 表格多选列表

      dictionVisible: false, // 新增/编辑弹窗
      modalTitle: "新增", // 弹窗标题
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {},
      input_name: "", // 字典名称
      input_type: "", // 字典类型
      input_value: "", // 字典值
      filter_use: undefined,

      value: "",

      diction_visible_type: "add", // 弹窗类型 add新增， edit编辑

      page: 1, // 页码
      pageSize: 10, //  页面数据条数
      currentTotal: 0, // 数据总条数
    };
  },
  methods: {
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getdata();
      });
    },

    // 获取字典列表
    getdata() {
      let data = {
        PageNo: this.page,
        PageSize: this.pageSize,
        QueryInfo: {
          Type: this.input_type,
          Name: this.input_name,
          Value: this.input_value,
          IsEnable: this.filter_use
            ? this.filter_use === "0"
              ? true
              : false
            : null,
        },
      };
      this.$axios.post("/api/datadictitem/getpage", data).then((res) => {
        console.log("字典", res);
        if (res.data.isSuccess) {
          this.dictionData = res.data.value.datas;
          this.PageNo = res.data.value.pageNo;
          this.currentTotal = res.data.value.totalCount;
        }
      });
    },

    // 批量开起
    batchBtn(type) {
      let data = {
        IsEnable: type,
        IDs: this.selectedRowKeys,
      };
      this.$axios.post("api/datadictitem/updatestate", data).then((res) => {
        if (res.data.isSuccess) {
          this.$message.success(res.data.msg);
          this.getdata();
        }
        console.log(res);
      });
    },

    // 跳转页面
    jumpPagination(page) {
      this.page = page;
      this.getdata();
    },

    // 修改页面显示条数
    editPageSize(page, size) {
      this.pageSize = size;
      this.getdata();
    },

    // 字典列表启动停用
    editTableStatus(val) {
      let data = {
        IsEnable: val.isEnable,
        IDs: [val.id],
      };
      this.$axios.post("api/datadictitem/updatestate", data).then((res) => {
        if (res.data.isSuccess) {
          this.$message.success(res.data.msg);
          this.getdata();
        }
        console.log(res);
      });
    },

    // 搜索按钮
    filterBtn() {
      console.log(this.filter_use);
      this.getdata();
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
    openDictionModal(type, val) {
      this.confirmLoading = false;
      this.dictionVisible = true;
      this.diction_visible_type = type;
      this.modalTitle = type === 'edit'?'编辑':'新增'
      console.log(val);
      let editData = JSON.parse(JSON.stringify(val));
      this.modalForm = {
        input_type: editData.type,
        input_name: editData.name,
        input_value: editData.value,
        action: editData.isEnable,
        id: String(editData.id)
      };
    },

    // 弹窗提交按钮
    submitBtn() {
      this.confirmLoading = true;

      let data = {
        Type: this.modalForm.input_type, //类型：String  必有字段  备注：字典类型
        Name: this.modalForm.input_name, //类型：String  必有字段  备注：字典名称
        Value: this.modalForm.input_value, //类型：String  必有字段  备注：字典值
        IsEnable: this.modalForm.action, //类型：Boolean  必有字段  备注：是否启用
      };

      if(this.diction_visible_type === "edit"){
        data['ID'] = this.modalForm.id
      }

      let url =
        this.diction_visible_type === "add"
          ? "/api/datadictitem/save"
          : "/api/datadictitem/update";

      this.$axios.post(url, data).then((res) => {
        if (res.data.isSuccess) {
          this.cancelBtn();
          this.$message.success(res.data.msg);
          this.getdata();
          this.confirmLoading = false;
        }
      });
    },
    // 弹窗关闭按钮
    cancelBtn() {
      this.dictionVisible = false;
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

    .ant-table-body > tbody.ant-table-tbody > tr.ant-table-row :hover {
      background: #0070e2;
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

.table_main {
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #0070e2;
    opacity: 0.1;
  }
}
</style>
