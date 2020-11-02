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
            style="width: 160px"
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
            style="width: 160px"
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
      <a-button @click="openProfitModal('add')">+新增</a-button>
      <a-button>批量启用</a-button>
      <a-button>批量停用</a-button>
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
            <a-tag color="#FB9826" @click="openProfitModal('edit')">修改</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="type" title="来源类型" data-index="type" />
        <a-table-column key="source" title="具体来源" data-index="source">

          <!-- <a-tooltip placement="bottom">
            <template slot-scope="text, record">
              <span>{{ record.phone }}</span>
            </template>
          </a-tooltip> -->
          <!-- <a-tooltip placement="bottom">
            <template slot-scope="text, record">
              <span>prompt text</span>
            </template>
            <a-button type="link">
             {{ record.phone}}
            </a-button>
          </a-tooltip> -->
          <!-- <template slot-scope="text, record">
            <a-button type="link">
             {{ record.phone}}
            </a-button>
          </template> -->
        </a-table-column>
        <a-table-column
          key="profitCenter"
          title="利润中心"
          data-index="profitCenterName"
          
        >
          {{this.profitData.profit_name}}
        </a-table-column>
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
          :total="profitData.length"
        />
        <div class="datas_total">
          共 <span>{{ profitData.length }}</span> 条记录
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
                  v-model="modalForm.action"
                  checked-children="启用"
                  un-checked-children="停用"
                />
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">来源类型</div>
              <div class="item_input">
                <a-select
                  placeholder="请选择"
                  allowClear
                  style="width:240px"
                >
                  <a-select-option value="0"> 数据字典1 </a-select-option>
                  <a-select-option value="1"> 数据字典2 </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">利润中心</div>
              <div class="item_input">
                <a-select
                  mode="multiple"
                  :default-value="['a1', 'b2']"
                  style="width: 100%"
                  placeholder="请选择"
                  @change="handleChange"
                >
                  <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                    {{ (i + 9).toString(36) + i }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="modal_item">
              <div class="item_title">具体来源</div>
              <div class="item_input">
                <a-input-group compact>
                  <a-select default-value="0">
                    <a-select-option value="0">
                      手机
                    </a-select-option>
                    <a-select-option value="1" @click="openEmailModal('email')">
                      邮箱
                    </a-select-option>
                  </a-select>
                  <a-input style="width: 73%" default-value="请输入" allowClear/>
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
    width="1040px"
    >

    <div class="email_list">

        <div class="email_box">
          <div class="email_title">配置状态</div>
          <div class="email_item">
              <a-switch checked-children="启用" un-checked-children="停用" default-checked />
          </div>
        </div>

        <div class="email_box">

          <div class="email_title_box">来源类型</div>
          <div class="email_item_box">
              <a-select
                placeholder="请选择"
                style="width: 240px"
                @change="handleChange"
              >
                <a-select-option value="0">
                  数据字典1
                </a-select-option>
                <a-select-option value="1">
                  数据字典2
                </a-select-option>
              </a-select>
          </div>

          <div class="email_title_box">利润中心</div>
          <div class="email_item_box">
              <a-select
                mode="multiple"
                :default-value="['a1', 'b2']"
                style="width: 240px"
                placeholder="请选择"
                @change="handleChange"
              >
                <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                  {{ (i + 9).toString(36) + i }}
                </a-select-option>
              </a-select>
          </div>


          <div class="email_title_box">具体来源</div>
          <div class="email_item_box">
              <a-input-group compact>
                  <a-select default-value="0">
                    <a-select-option value="0">
                      手机
                    </a-select-option>
                    <a-select-option value="1">
                      邮箱
                    </a-select-option>
                  </a-select>
                  <a-input style="width: 73%" default-value="请输入" allowClear/>
              </a-input-group>
          </div>

        </div>


        <div class="email_box">

          <div class="email_title_box">端口</div>
          <div class="email_item_box">
              <a-input style="width:260px"></a-input>
          </div>

          <div class="email_title_box">SLL</div>
          <div class="email_item_box">
              <a-input style="width:260px"></a-input>
          </div>


          <div class="email_title_box">地址</div>
          <div class="email_item_box">
              <a-input style="width:260px"></a-input>
          </div>

        </div>

        <div class="email_box">

          <div class="email_title_box">协议</div>
          <div class="email_item_box">
              <a-input style="width:260px"></a-input>
          </div>

          <div class="email_title_box">秘匙</div>
          <div class="email_item_box">
              <a-input style="width:260px"></a-input>
          </div>

        </div>

        <div class="email_box">

          <div class="email_title_box">模板</div>
          <div class="email_item_box">
              <div class="email_card">
                 <div class="card_title">模板名称:</div>
                 <div class="card_title">发件人域:</div>
                 <div class="card_title">发件人地址正则:</div>
                 <div class="card_title">主题正则:</div>
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
      filter_type: undefined, // 筛选来源类型
      filter_source: undefined, // 筛选具体来源
      filter_profilt: undefined, // 筛选利润中心

      profitFrom: {},

      profitData: [],  // 利润中心数据
        
      
      selectedRowKeys: [], // 表格多选列表

      current: 1, // 分页index

      profitVisible: false, // 新增/编辑弹窗
      modalTitle: "新增", // 弹窗标题
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {
        action: false,
      },
      value:'',

      emailVisible: false, // 多选框 邮箱弹窗
    };
  },
  methods: {
    getToken(){
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getdata()
      });
    },
    getdata(){
      let data ={
          profit_name:this.profitFrom.profitCenterName
      }
      this.$axios.post('/api/configureprofitcenterInfo/getpage',data)
      .then(res =>{
          if(res.data.isSuccess){
            this.profitData = res.data.value.datas
          }
      })
      .catch(res => {
        console.log(res)
      })
    },

    // 搜索按钮
    filterBtn() {
      console.log(this.filter_type, this.filter_source, this.filter_profilt);
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
    openProfitModal(type) {
      this.profitVisible = true;
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
      this.profitVisible = false;
      this.emailVisible = false;
    },

    // 利润多选  选择器
    handleChange(value) {
       console.log(`selected ${value}`);
    },

    // 多选框选择邮箱弹出弹框
    openEmailModal(type) {
        this.profitVisible = false;
        this.emailVisible = true;
    }
  },
  created() {
    this.getToken()
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

// 邮箱新增弹窗
.email_list {
  
  .email_item {
    margin-left: 8px;
  }
  .email_box {
    display: flex;
    
   
    .email_item_box {
      margin-left: 8px;
      margin-right: 21px;
      
      .email_card{
        width: 935px;
        height: 232px;
        padding: 16px 12px ;
        background: #F1F3F5; 
        overflow-y:scroll;
  
      }
    }
  }
}
</style>