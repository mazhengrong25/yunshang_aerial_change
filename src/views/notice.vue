<!--
 * @Author: mzr
 * @Date: 2020-10-30 14:13:41
 * @LastEditTime: 2020-11-03 15:47:28
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
          <a-range-picker :size="size" style="width:346px"/>
        </div>
      </div>
      <!-- <div class="filter_list">
        <div class="list_title">
          <a-button class="filter_btn" type="primary">搜索</a-button>
        </div>
      </div> -->
     
    </div>


    <div class="table_tool">
      <a-button  icon="download">导出报表</a-button>
      <a-button @click="openPromptModal()">着重标记</a-button>
      <a-button>批量处理</a-button>
    </div>

    <!-- 滑动导航栏 -->
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="待处理"></a-tab-pane>
      <a-tab-pane key="2" tab="本人锁定"></a-tab-pane>
      <a-tab-pane key="3" tab="处理中" />
      <a-tab-pane key="4" tab="已处理" />
      <a-tab-pane key="5" tab="通知失败" />
    </a-tabs>

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
                <a-button type="link" @click="opendetailModal()">航班取消</a-button>
            </template>
        </a-table-column>
        <a-table-column key="number" title="航班号" data-index="type">
          <template slot-scope="record">
            <p><span>原</span></p>
            <p><span>新</span></p>
          </template>
        </a-table-column>
        <a-table-column key="start_time" title="起飞时间" data-index="value">
          <template slot-scope="record">
            <p><span>原</span></p>
            <p><span>新</span></p>
          </template>
        </a-table-column>
        <a-table-column key="end_time" title="到达时间" data-index="isEnable">
          <template slot-scope="record">
            <p><span>原</span></p>
            <p><span>新</span></p>
          </template>
        </a-table-column>
        <a-table-column key="name" title="航程名称" data-index="isEnable">
          <template slot-scope="record">
            <p><span>原</span></p>
            <p><span>新</span></p>
          </template>
        </a-table-column>
        <a-table-column key="shop" title="店铺/单号" data-index="isEnable">
          <template slot-scope="record">
            <p>去哪儿</p>
            <p>ysh201021173102866001</p>
          </template>
        </a-table-column>
        <a-table-column key="pnr" title="PNR" data-index="isEnable" />
        <a-table-column key="passenger" title="乘客" data-index="isEnable">
          <template slot-scope="record">
            <p><a-checkbox @change="onChange">张三</a-checkbox></p>
            <span><img src="../assets/xing.png"></img></span> 
          </template>
        </a-table-column>
        <a-table-column key="state" title="状态" data-index="isEnable">
            <template slot-scope="record">
                <a-button type="link" @click="openStateModal()">待处理</a-button>
            </template>
        </a-table-column>
        <a-table-column key="tic_number" title="票号" data-index="tic_number" />
        <a-table-column key="office" title="OfficeNo" data-index="office" />
        <a-table-column key="contact" title="联系方式" data-index="contact">
            <template slot-scope="record">
                <a-button type="link" @click="openPassengerModal()">15123826971</a-button>
            </template>
        </a-table-column>
        <a-table-column key="notice" title="通知" data-index="notice" />
        <a-table-column key="come" title="入库" data-index="come" />
        <a-table-column key="operate" title="操作" data-index="operate">
            <template slot-scope="record">
                <a-tag color="#FB9826"  @click="openLogModal()">日志</a-tag>
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

    <!-- 日志 模态框 -->
    <a-modal
      :title="logTitle"
      :visible="logVisible"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1000px">
      
      <!-- <div class="nav">
          <div class="tags"></div>
          <div class="text">日志信息</div>
          <div class="number">2</div>
          <div></div>
      </div>
      
      <div class="nav">
          <div class="tags"></div>
          <div class="text">备注信息</div>
          <div class="number">0</div>
      </div>

      <div class="nav">
          <div class="tags"></div>
          <div class="text">附件信息</div>
          <div class="number">0</div>
      </div> -->
      <a-collapse accordion>
        <a-collapse-panel key="1" header="This is panel header 1">
          <p>{{ text }}</p>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
          <p>{{ text }}</p>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="This is panel header 3">
          <p>{{ text }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>

    <!-- 联系人信息 模态框 -->
    <a-modal
      :title="passengerTitle"
      :visible="passVisble"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn">

      <div class="passenger_main">
          <div class="modal_item">
              <div class="item_title">乘客姓名</div>
              <div class="item_input">
                  <a-input placeholder="请输入" />
              </div>
          </div>
          <div class="modal_item">
              <div class="item_title">乘客称谓</div>
              <div class="item_input">
                  <a-input placeholder="请输入" />
              </div>
          </div>

          <div class="modal_item">
              <div class="item_title">电话号码</div>
              <div class="item_input">
                  <a-input placeholder="请输入" />
              </div>
          </div>
          <div class="modal_item">
              <div class="item_title">手机号</div>
              <div class="item_input">
                  <a-input placeholder="请输入" />
              </div>
          </div>

          <div class="modal_item">
              <div class="item_title">微信号</div>
              <div class="item_input">
                  <a-input placeholder="请输入" />
              </div>
          </div>
          <div class="modal_item">
              <div class="item_title">电子邮箱</div>
              <div class="item_input">
                  <a-input placeholder="请输入" />
              </div>
          </div>
      </div>
    </a-modal>

    <!-- 着重标记 模态框-->
    <a-modal
      :title="markTitle"
      :visible="markVisble"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
    >
      <div class="prompt">请选择需要标记的信息</div>
    </a-modal>

    <!-- 状态 模态框-->
    <a-modal
      :title="stateTitle"
      :visible="stateVisble"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1000px"
    >
      <div class="nav">
          <div class="tags"></div>
          <div class="text">选择需要通知的客人与通知方式</div>
      </div>
      <div class="level">
        <div class="name">是否通知</div>
        <div class="name_type">
            <a-radio-group name="radioGroup" :default-value="1">
              <a-radio :value="1">电话</a-radio>
              <a-radio :value="2">短信</a-radio>
              <a-radio :value="3">电子邮件</a-radio>
              <a-radio :value="4">QQ/QQ群</a-radio>
              <a-radio :value="5">接口对接</a-radio>
              <a-radio :value="6">平台录入</a-radio>
              <a-radio :value="7">无需通知</a-radio>
            </a-radio-group>
        </div>
      </div>
      <div class="level">
        <div class="name">是否通知</div>
        <div class="name_type">
            <a-radio-group name="radioGroup" :default-value="1">
              <a-radio :value="1">有效通知（客人已确认）</a-radio>
              <a-radio :value="2">无效通知（未联系上客人等原因）</a-radio>
            </a-radio-group>
        </div>
      </div>
      <div class="table_nav">
          <a-table
            bordered
            size="small"
            :data-source="stateData"
            rowKey="id"
            :rowSelection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="false"
          >
              <a-table-column key="name" title="姓名" data-index="name" />
              <a-table-column key="notice" title="是否已通知" data-index="notice" />
              <a-table-column key="phone" title="联系方式" data-index="phone" />
              <a-table-column key="detail" title="详情" data-index="detail">
                  <template slot-scope="record">
                      <a-button type="link">航变详情</a-button>
                  </template>     
              </a-table-column>
          </a-table>
      </div>

      <div class="nav">
          <div class="tags"></div>
          <div class="text">添加备注</div>
      </div>
      <div class="level">
        <div class="name">备注内容</div>
        <div class="name_type">
            <a-input style="width: 846px; height:96px" placeholder="请输入" />
        </div>
      </div>
      
      <div class="nav">
          <div class="tags"></div>
          <div class="text">上传附件</div>
      </div>
      <div class="level">
        <div class="seq">
          <div class="name">附件名称+附件格式（上传后显示）</div>
          <div class="name_type">
              <a-input style="width: 500px; height:34px" placeholder="添加该附件描述" />
          </div>
          <div class="name">
            <a-button>上传附件</a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 航班类型 模态框 -->
    <a-modal
      :title="detailTitle"
      :visible="detailVisble"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1000px"
    >
      <div class="nav">
          <div class="tags"></div>
          <div class="text">原始信息</div>
      </div>
      <div class="level">
        <div class="name">原始信息</div>
        <div class="name_type">
              <a-card style="width: 800px">
                <p>内容</p>
              </a-card>
        </div>
      </div>

      <div class="nav">
          <div class="tags"></div>
          <div class="text">航变信息</div>
      </div>
      <div class="table_nav">
          <a-table
            bordered
            size="middle"
            :data-source="flightData"
            rowKey="id"
            :pagination="false"
          >
              <a-table-column key="operate" title="操作" data-index="operate">
                <template slot-scope="record">
                    <a-tag color="#FB9826"  @click="openEditModal()">修改</a-tag>
                </template>
              </a-table-column>
              <a-table-column key="type" title="航变类型" data-index="type" />
              <a-table-column key="flight_no" title="原航班号" data-index="flight_no" />
              <a-table-column key="new_no" title="新航班号" data-index="new_no">
                  <template slot-scope="record">
                      <a-button type="link">航变详情</a-button>
                  </template>     
              </a-table-column>
              <a-table-column key="old_start" title="原起飞时间" data-index="old_start" />
              <a-table-column key="new_start" title="新起飞时间" data-index="new_start" />
              <a-table-column key="old_end" title="原到达时间" data-index="old_end" />
              <a-table-column key="new_end" title="新到达时间" data-index="new_end" />
              <a-table-column key="message" title="航程信息" data-index="message" />
          </a-table>
      </div>
  
      <div class="nav">
          <div class="tags"></div>
          <div class="text">关联信息</div>
      </div>
      <div class="table_nav">
          <a-table
            bordered
            size="middle"
            :data-source="relateData"
            rowKey="id"
            :pagination="false"
          >
              <a-table-column key="contact" title="联系人" data-index="contact"/>
              <a-table-column key="phone" title="联系人手机号" data-index="phone" />
              <a-table-column key="channel" title="来源渠道" data-index="channel" />
              <a-table-column key="order_no" title="外部订单号" data-index="order_no" />  
              <a-table-column key="sy_no" title="胜意订单号" data-index="sy_no" />
              <a-table-column key="PNR" title="PNR" data-index="PNR" />
              <a-table-column key="order_depart" title="订票部门" data-index="order_depart" />
              <a-table-column key="order_time" title="订票时间" data-index="order_time" />
              <a-table-column key="ticket_depart" title="出票部门" data-index="ticket_depart" />
              <a-table-column key="ticket_time" title="出票时间" data-index="ticket_time" />
              <a-table-column key="arrt_depart" title="归属部门" data-index="arrt_depart" />
          </a-table>
      </div>
    
      <div class="nav">
          <div class="tags"></div>
          <div class="text">乘客信息及处理状态</div>
      </div>
      <div class="table_nav">
          <a-table
            bordered
            size="middle"
            :data-source="relateData"
            rowKey="id"
            :pagination="false"
          >
              <a-table-column key="contact" title="处理状态" data-index="contact"/>
              <a-table-column key="phone" title="乘客姓名" data-index="phone" />
              <a-table-column key="channel" title="票号" data-index="channel" />
              <a-table-column key="order_no" title="手机号" data-index="order_no" />  
              <a-table-column key="sy_no" title="电话号码" data-index="sy_no" />
              <a-table-column key="PNR" title="微信号码" data-index="PNR" />
              <a-table-column key="order_depart" title="电子邮箱" data-index="order_depart" />
              <a-table-column key="order_time" title="通知次数" data-index="order_time" />
              <a-table-column key="ticket_depart" title="有效通知" data-index="ticket_depart" />
              <a-table-column key="ticket_time" title="日志信息" data-index="ticket_time" />
        
          </a-table>
      </div>
    </a-modal>

    <!-- 航班类型 - 修改 模态框 -->
    <a-modal
      :title="detailTitle"
      :visible="editVisble"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1000px"
    >
      <div class="nav">
          <div class="tags"></div>
          <div class="text">原始信息</div>
      </div>
      <div class="level">
        <div class="name">原始信息</div>
        <div class="name_type">
            <a-card style="width: 800px">
              <p>内容</p>
            </a-card>
        </div>
      </div>

      <div class="nav">
          <div class="tags"></div>
          <div class="text">航变信息</div>
      </div>
      <div class="table_nav">
          <a-table
            bordered
            size="small"
            :data-source="flightData"
            rowKey="id"
            :pagination="false"
          >
              <a-table-column key="operate" title="操作" data-index="operate">
                <template slot-scope="record">
                    <a-tag color="#FB9826"  @click="openEditModal()">修改</a-tag>
                </template>
              </a-table-column>
              <a-table-column key="type" title="航变类型" data-index="type" />
              <a-table-column key="flight_no" title="原航班号" data-index="flight_no" />
              <a-table-column key="new_no" title="新航班号" data-index="new_no">
                  <template slot-scope="record">
                      <a-button type="link">航变详情</a-button>
                  </template>     
              </a-table-column>
              <a-table-column key="old_start" title="原起飞时间" data-index="old_start" />
              <a-table-column key="new_start" title="新起飞时间" data-index="new_start" />
              <a-table-column key="old_end" title="原到达时间" data-index="old_end" />
              <a-table-column key="new_end" title="新到达时间" data-index="new_end" />
              <a-table-column key="message" title="航程信息" data-index="message" />
          </a-table>
      </div>
     
      <div class="nav">
          <div class="tags"></div>
          <div class="text">修改航变信息</div>
      </div>
      <div class="flight_level">
        <div class="flight_name">航变类型</div>
        <div class="flight_name_type">
            <a-select
              placeholder="请输入"
              option-filter-prop="children"
              style="width: 168px"
              @change="handleChange"
            >
              <a-select-option value="1">航班延误</a-select-option>
              <a-select-option value="2">航班取消</a-select-option>
            </a-select>
        </div>
      </div>
      
      <div class="flight_level">
        <div class="flight_name">取消保护</div>
        <div class="flight_name_type">
            <a-select
              
              placeholder="请输入"
              option-filter-prop="children"
              style="width: 168px"
              @change="handleChange"
            >
              <a-select-option value="1">取消有保护</a-select-option>
              <a-select-option value="2">取消有保护</a-select-option>
            </a-select>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">原航班号</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">G54973</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">新航班号</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">G54973</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">原起飞</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">2020-10-23 13:40</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">新起飞</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">2020-10-23 13:40</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">原到达</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">2020-10-23 13:40</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">新到达</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">2020-10-23 13:40</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">起飞城市</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">重庆</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">起飞三字码</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">CKG</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">到达城市</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">延安</a-input>
        </div>
      </div>

      <div class="flight_level">
        <div class="flight_name">到达三字码</div>
        <div class="flight_name_type">
            <a-input style="width: 168px">ENY</a-input>
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

      noticeData: [], // 表格数据
      stateData: [],
      flightData: [],
      relateData: [],
      selectedRowKeys: [], // 表格多选列表

      current: 1, // 分页index
      currentTotal: 1, // 页面数据总数

      logVisible: false, // 新增/编辑弹窗
      passVisble: false,
      markVisble: false,
      stateVisble: false,
      detailVisble: false,
      editVisble: false,
      logTitle: "日志/备注/附件信息情况", // 弹窗标题
      passengerTitle: '乘机人信息',
      markTitle: '提示',
      stateTitle: '处理信息',
      detailTitle: '信息通知详情',
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

    // 滑动导航栏 
    callback(key) {
      console.log(key);
    },

    // 日志弹窗
    openLogModal() {
      this.logVisible = true;
    },

    // 添加乘机人弹窗
    openPassengerModal() {
      this.passVisble = true;
    },

    // 着重标记弹窗
    openPromptModal(){
      this.markVisble = true;
    },

    // 状态弹窗
    openStateModal() {
      this.stateVisble = true;
    },

    // 航班类型
    opendetailModal() {
      this.detailVisble = true;
    },

    // 航班类型 - 修改
    openEditModal() {
      this.editVisble = true;
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
      this.logVisible = false;
      this.passVisble = false;
      this.markVisble = false;
      this.stateVisble = false;
      this.detailVisble = false;
      this.editVisble = false;
    },

  },

   mounted() {

    for (let i = 0; i < 10; i++) {
      this.noticeData.push({
        tic_number: "6665477585110",
        notice: "0次",
        office: "CKG177",
        contact: '15123826971',
      });
    }

     for (let i = 0; i < 4; i++) {
      this.stateData.push({
        tic_number: "6665477585110",
        notice: "未通知",
        phone: '15123826971',
        name: '马冬梅'
      });
    }

    for (let i = 0; i < 2; i++) {
      this.flightData.push({
        type: "航班取消无保护",
        flight_no: "CA1904",
        new_no: 'CA1904',
        old_start: '2020-10-25 11:45',
        new_start: '2020-10-25 11:45',
        old_end: '2020-10-25 11:45',
        new_end: '2020-10-25 11:45',
        message: "西安-杭州（XIYHGH)"
      });
    }

    for (let i = 0; i < 2; i++) {
      this.relateData.push({
        contact: "权志龙",
        phone: "15123826971",
        channel: '乔兴企管',
        name: '马冬梅',
        order_no: '748348535070201021',
        sy_no: '748348535070201021',
        PNR:'JS052F',
        order_depart:'差旅事业部',
        order_time: '2020-10-25 11:45',
        ticket_depart:'差旅事业部',
        ticket_time:'2020-10-25 11:45',
        arrt_depart: '差旅事业部'
      });
    }
  },
  
}
</script>

<style lang="less" scoped>
.notice {
  .filter_header {
    display: flex;
    flex-wrap: wrap;
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
    // margin-bottom: 18px;
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
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
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

    .ant-table-body > tbody.ant-table-tbody > tr.ant-table-row :hover {
        background: #0070E2; 
        // opacity: 0.1;
    }

    // .ant-table-tbody > tr:hover:not(.ant-table-row) > td { background: white; }
  }

}

.passenger_main {

    display: flex;
    flex-wrap: wrap;
    .modal_item {
      display: flex;
      align-items: center;
      .item_title {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        margin-right: 8px;
        text-align: right;
        width: 68px;
      }
      .item_input {
        width: 160px;
      }
      &:not(:last-child) {
        margin-bottom: 22px;
      }
  
    }
}

.prompt {

    text-align: center;
    font-weight: 400;
    line-height: 21px;
    color: #333333;
}

.nav {

  display: flex;
  flex-shrink: 0;
  height: 32px;
  margin: 16px 16px 16px;
  background-color: rgba(0, 112, 226, 0.1);
  .tags {
      width: 4px;
      height: 16px;
      background-color: #0070E2;
      margin-left: 16px;
      margin-top: 9px;
  }
  .text {
      
      font-size: 16px;
      margin-left: 10px;
      margin-top: 4px;
      font-weight: bold;
  }
  .number {
    width: 16px;
    height: 16px;
    background:rgba(255, 0, 0, 0.6);
    border-radius: 2px;
    color: #fff;
    margin-left: 10px;
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.table_nav {
  flex-shrink: 0;
  margin: 16px 16px 16px;
}
  
.level {

  display: flex;
  flex-wrap: wrap;
  .name {

    font-size: 14px;
    margin-left: 32px;
  }
  .name_type {

    font-weight: bold;
    padding-left: 5px;
  }
  .seq {
      width: 996px;
      margin: 16px 16px 16px;
      display: flex;
      height: 128px;
      border: 1px solid #DFDFDF;
      border-radius: 2px;
      .name {
        
        color: #333333;
        font-weight: 400;
        font-size: 14px;
        margin: 16px 16px 16px;
      }
      .name_type {
        margin: 16px 16px 16px;
        font-weight: bold;
        padding-left: 5px;
      }
  }
}&:not(:last-child) {
      margin-bottom: 10px;
}

.level {
  .ant-btn {
    border-radius: 15px;
    border: 1px solid #0070E2;
    color: #0070e2;
  }
}

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
}&:not(:last-child) {
      margin-bottom: 10px;
}
</style>

