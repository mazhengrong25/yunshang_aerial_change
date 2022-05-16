<!--
 * @Author: mzr
 * @Date: 2020-10-30 14:13:41
 * @LastEditTime: 2020-11-03 18:59:49
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
            allowClear
            v-model="filter_from.orderSource"
            mode="multiple"
            :maxTagCount="1"
          >
            <a-select-option
              v-for="(item, index) in orderSourceList"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
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
            allowClear
            v-model="filter_from.type"
          >
            <a-select-option value="YW">航班延误</a-select-option>
            <a-select-option value="TQ">航班提前</a-select-option>
            <a-select-option value="QX">航班取消</a-select-option>
            <a-select-option value="BG">航班变更</a-select-option>
            <a-select-option value="DD">航班待定</a-select-option>
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
            allowClear
            v-model="filter_from.witting"
          >
            <a-select-option value="1">有效</a-select-option>
            <a-select-option value="0">无效</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">是否标记</div>
        <div class="list_selece">
          <a-select
            style="width: 160px"
            v-model="filter_from.flag"
            allowClear
            placeholder="请选择"
          >
            <a-select-option value="1"> 标记 </a-select-option>
            <a-select-option value="0"> 未标记 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">
          <a-select
            class="filter_select"
            v-model="filter_from.selectName"
            defaultValue="0"
          >
            <a-select-option value="0">航程代码</a-select-option>
            <a-select-option value="1">航班号</a-select-option>
            <a-select-option value="2">PNR编码</a-select-option>
            <a-select-option value="3">机票票号</a-select-option>
            <a-select-option value="4">外部订单号</a-select-option>
          </a-select>
          <a-input
            style="width: 160px"
            allowClear
            v-model="filter_from.selectMessage"
          />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">OfficeNo</div>
        <div class="list_selece">
          <a-input
            style="width: 160px"
            allowClear
            v-model="filter_from.officeNo"
          />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">原起飞日期</div>
        <div class="list_selece">
          <a-range-picker
            style="width: 346px"
            v-model="filter_from.flightDate"
          />
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">
          <a-button class="filter_btn" type="primary" @click="filterBtn()"
            >搜索</a-button
          >
        </div>
      </div>
    </div>

    <div class="table_tool">
      <div class="tool_nav">
        <div
          :class="['nav_list', { active: orderStatus === 0 }]"
          @click="dataStatusBtn(0)"
        >
          待处理
          <span>{{ dataNumber["status0"] }}</span>
        </div>
        <div
          :class="[
            'nav_list',
            { active: orderStatus === -1 || orderStatus === undefined },
          ]"
          @click="dataStatusBtn(-1)"
        >
          本人锁定
          <span>{{ dataNumber["status4"] || '获取中' }}</span>
        </div>
        <div
          :class="['nav_list', { active: orderStatus === 1 }]"
          @click="dataStatusBtn(1)"
        >
          处理中
          <span>{{ dataNumber["status1"] || '获取中' }}</span>
        </div>
        <div
          :class="['nav_list', { active: orderStatus === 2 }]"
          @click="dataStatusBtn(2)"
        >
          已处理
          <span>{{ dataNumber["status2"] || '获取中' }}</span>
        </div>
        <div
          :class="['nav_list', { active: orderStatus === 3 }]"
          @click="dataStatusBtn(3)"
        >
          通知失败
          <span>{{ dataNumber["status3"] || '获取中' }}</span>
        </div>
      </div>
      <div class="tool_box">
        <a-button icon="download" @click="$message.warning('开发中')"
          >导出报表</a-button
        >
        <a-button @click="openPromptModal()">着重标记</a-button>
        <a-button>批量处理</a-button>
      </div>
    </div>

    <div class="table_main">
      <a-table
        bordered
        size="middle"
        :data-source="noticeData"
        rowKey="keyID"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="false"
      >
        <a-table-column key="detail" title="航变详情">
          <template slot-scope="record"> 查看 </template>
        </a-table-column>
        <a-table-column title="航变类型">
          <template slot-scope="record">
            <div>
              {{
                record.changeType === "YW"
                  ? "航班延误"
                  : record.changeType === "TQ"
                  ? "航班提前"
                  : record.changeType === "QX"
                  ? "航班取消"
                  : record.changeType === "BG"
                  ? "航班变更"
                  : record.changeType === "DD"
                  ? "航班待定"
                  : record.changeType
              }}
            </div>
            <div>
              {{
                record.subtype === "Y"
                  ? "有保护"
                  : record.subtype === "N"
                  ? "无保护"
                  : record.subtype
              }}
            </div>
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
            <p>
              <span>原</span
              >{{
                record.oDepartureTime
                  ? $moment(record.oDepartureTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </p>
            <p>
              <span>新</span
              >{{
                record.nDepartureTime
                  ? $moment(record.nDepartureTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </p>
          </template>
        </a-table-column>
        <a-table-column title="到达时间">
          <template slot-scope="record">
            <p>
              <span>原</span
              >{{
                record.oArrTime
                  ? $moment(record.oArrTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </p>
            <p>
              <span>新</span
              >{{
                record.nArrTime
                  ? $moment(record.nArrTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </p>
          </template>
        </a-table-column>
        <a-table-column title="航程名称">
          <template slot-scope="record">
            <p><span>原</span>{{ record.oFromCity }} - {{ record.oToCity }}</p>
            <p><span>新</span>{{ record.fromCity }} - {{ record.toCity }}</p>
          </template>
        </a-table-column>
        <a-table-column title="店铺/单号">
          <template slot-scope="record">
            <p>{{ record.orderSource }}</p>
            <p>{{ record.outOrderID }}</p>
          </template>
        </a-table-column>
        <a-table-column key="pnr" title="PNR" data-index="pnr" />
        <a-table-column title="乘客">
          <template slot-scope="record">
            <p>
              <a-checkbox>{{
                record.passengerName
              }}</a-checkbox>
            </p>
            <div v-if="record.flag" class="flag_icon" @click="openPromptModal">
              <img src="../assets/xing.png" />
            </div>
          </template>
        </a-table-column>
        <a-table-column title="状态">
          <template slot-scope="record">
            {{
              record.optStatus === 0
                ? "待处理"
                : record.optStatus === 1
                ? "处理中"
                : record.optStatus === 2
                ? "已处理"
                : record.optStatus === 3
                ? "处理失败"
                : record.optStatus === 100
                ? "完结"
                : record.optStatus
            }}
          </template>
        </a-table-column>
        <a-table-column
          key="ticketNumber"
          title="票号"
          data-index="ticketNumber"
        />
        <a-table-column key="officeNo" title="OfficeNo" data-index="officeNo" />
        <a-table-column title="联系方式">
          <template slot-scope="record">
            {{ record.phoneNumber || record.mobilePhone }}
          </template>
        </a-table-column>
        <a-table-column title="通知">
          <template slot-scope="record">
            {{ record.notifyCount ? record.notifyCount : 0 }}次
          </template>
        </a-table-column>
        <a-table-column title="入库">
          <template slot-scope="record">
            {{
              record.addTime
                ? $moment(record.addTime).format("YYYY-MM-DD HH:mm:ss")
                : ""
            }}
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template slot-scope="record">
            <a-tag color="#FB9826" @click="openLogModal(record)">日志</a-tag>
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

    <!-- 日志 模态框 -->
    <a-modal
      title="日志/备注/附件信息情况"
      :visible="logVisible"
      centered
      width="1000px"
      :footer="null"
      @cancel="logVisible = false"
    >
      <div class="log_modal_main">
        <!-- 日志 -->
        <div class="nav_title">
          <div class="nav" @click="openNavMain('日志')">
            <div class="nav_title_left">
              <div class="tags"></div>
              <div class="text">日志信息</div>
              <div class="number">2</div>
            </div>
            <div :class="['operate', { active: navMainType === '日志' }]">
              <div class="action"></div>
              <div class="triangle"></div>
            </div>
          </div>
          <div class="nav_main" v-if="navMainType === '日志'">
            <div
              class="nav_table"
              v-for="(item, index) in logMessageList"
              :key="index"
            >
              <div class="nav_item">{{ item.msg }}</div>
              <div class="nav_item log_center">
                <a-tooltip autoAdjustOverflow placement="bottomLeft">
                  <template slot="title">
                    <span>{{ item.detailInfo }}</span>
                  </template>
                  <span class="log_center_text">{{ item.detailInfo }}</span>
                </a-tooltip>
              </div>
              <div class="nav_item">{{ item.operationTime }}</div>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <div class="nav_title">
          <div class="nav" @click="openNavMain('备注')">
            <div class="nav_title_left">
              <div class="tags"></div>
              <div class="text">备注信息</div>
              <div class="number">2</div>
            </div>

            <div :class="['operate', { active: navMainType === '备注' }]">
              <div class="action"></div>
              <div class="triangle"></div>
            </div>
          </div>
          <div class="nav_main" v-if="navMainType === '备注'">
            <div class="nav_table">
              <div class="nav_item">邮箱</div>
              <div class="nav_item">畅游国际平台（赵玲艺）导入</div>
              <div class="nav_item">2020-10-23 09:19:13</div>
            </div>
            <div class="nav_table">
              <div class="nav_item">锁定</div>
              <div class="nav_item">畅游国际平台（赵玲艺）导入</div>
              <div class="nav_item">2020-10-23 09:19:13</div>
            </div>
            <div class="nav_table">
              <div class="nav_item">邮箱</div>
              <div class="nav_item">畅游国际平台（赵玲艺）导入</div>
              <div class="nav_item">2020-10-23 09:19:13</div>
            </div>
          </div>
        </div>

        <!-- 附件 -->
        <div class="nav_title">
          <div class="nav" @click="openNavMain('附件')">
            <div class="nav_title_left">
              <div class="tags"></div>
              <div class="text">附件信息</div>
              <div class="number">2</div>
            </div>
            <div :class="['operate', { active: navMainType === '附件' }]">
              <div class="action"></div>
              <div class="triangle"></div>
            </div>
          </div>
          <div class="nav_main" v-if="navMainType === '附件'">3333</div>
        </div>
      </div>
    </a-modal>

    <!-- 联系人信息 模态框 -->
    <a-modal
      :title="passengerTitle"
      :visible="passVisble"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
    >
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

    <!-- 标记成功-->
    <a-modal
      :visible="markTrueModal"
      centered
      :footer="null"
      :closable="false"
      :width="248"
    >
      <div class="mark_true_modal">
        <div class="icon">
          <img src="@/assets/true.png" alt="" />
        </div>
        <div class="prompt">标记成功！</div>
      </div>
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
          <a-input style="width: 846px; height: 96px" placeholder="请输入" />
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
            <a-input
              style="width: 500px; height: 34px"
              placeholder="添加该附件描述"
            />
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
              <a-tag color="#FB9826" @click="openEditModal()">修改</a-tag>
            </template>
          </a-table-column>
          <a-table-column key="type" title="航变类型" data-index="type" />
          <a-table-column
            key="flight_no"
            title="原航班号"
            data-index="flight_no"
          />
          <a-table-column key="new_no" title="新航班号" data-index="new_no">
            <template slot-scope="record">
              <a-button type="link">航变详情</a-button>
            </template>
          </a-table-column>
          <a-table-column
            key="old_start"
            title="原起飞时间"
            data-index="old_start"
          />
          <a-table-column
            key="new_start"
            title="新起飞时间"
            data-index="new_start"
          />
          <a-table-column
            key="old_end"
            title="原到达时间"
            data-index="old_end"
          />
          <a-table-column
            key="new_end"
            title="新到达时间"
            data-index="new_end"
          />
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
          <a-table-column key="contact" title="联系人" data-index="contact" />
          <a-table-column key="phone" title="联系人手机号" data-index="phone" />
          <a-table-column key="channel" title="来源渠道" data-index="channel" />
          <a-table-column
            key="order_no"
            title="外部订单号"
            data-index="order_no"
          />
          <a-table-column key="sy_no" title="胜意订单号" data-index="sy_no" />
          <a-table-column key="PNR" title="PNR" data-index="PNR" />
          <a-table-column
            key="order_depart"
            title="订票部门"
            data-index="order_depart"
          />
          <a-table-column
            key="order_time"
            title="订票时间"
            data-index="order_time"
          />
          <a-table-column
            key="ticket_depart"
            title="出票部门"
            data-index="ticket_depart"
          />
          <a-table-column
            key="ticket_time"
            title="出票时间"
            data-index="ticket_time"
          />
          <a-table-column
            key="arrt_depart"
            title="归属部门"
            data-index="arrt_depart"
          />
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
          <a-table-column key="contact" title="处理状态" data-index="contact" />
          <a-table-column key="phone" title="乘客姓名" data-index="phone" />
          <a-table-column key="channel" title="票号" data-index="channel" />
          <a-table-column key="order_no" title="手机号" data-index="order_no" />
          <a-table-column key="sy_no" title="电话号码" data-index="sy_no" />
          <a-table-column key="PNR" title="微信号码" data-index="PNR" />
          <a-table-column
            key="order_depart"
            title="电子邮箱"
            data-index="order_depart"
          />
          <a-table-column
            key="order_time"
            title="通知次数"
            data-index="order_time"
          />
          <a-table-column
            key="ticket_depart"
            title="有效通知"
            data-index="ticket_depart"
          />
          <a-table-column
            key="ticket_time"
            title="日志信息"
            data-index="ticket_time"
          />
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
              <a-tag color="#FB9826" @click="openEditModal()">修改</a-tag>
            </template>
          </a-table-column>
          <a-table-column key="type" title="航变类型" data-index="type" />
          <a-table-column
            key="flight_no"
            title="原航班号"
            data-index="flight_no"
          />
          <a-table-column key="new_no" title="新航班号" data-index="new_no">
            <template slot-scope="record">
              <a-button type="link">航变详情</a-button>
            </template>
          </a-table-column>
          <a-table-column
            key="old_start"
            title="原起飞时间"
            data-index="old_start"
          />
          <a-table-column
            key="new_start"
            title="新起飞时间"
            data-index="new_start"
          />
          <a-table-column
            key="old_end"
            title="原到达时间"
            data-index="old_end"
          />
          <a-table-column
            key="new_end"
            title="新到达时间"
            data-index="new_end"
          />
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
      filter_from: {
        selectName: "0",
      }, // 筛选

      orderStatus: 0, // 列表状态
      userSelf: false, // 本人锁定

      filterData: {
        optStatus: 0,
        isSelf: false,
        userNum: "",
        profitCenterCode: "",
        orderSource: "",
        type: "",
        witting: "",
        flag: "",
        voyageCode: "",
        flihtNumber: "",
        upDeportDate: "",
        downDeportDate: "",
        pnrCode: "",
        ticketNumber: "",
        outOrderId: "",
        officeNo: "",
      }, // 筛选处理数据

      dataNumber: {}, // 数据数量获取

      logMessageList: [], // 日志列表
      logLoading: false, // 日志按钮加载

      noticeData: [], // 表格数据
      stateData: [],
      flightData: [],
      relateData: [],
      selectedRowKeys: [], // 表格多选列表

      orderSourceList: [], // 订单来源列表

      current: 1, // 分页index
      currentTotal: 0, // 页面数据总数
      currentSize: 10, // 页面数据条数

      logVisible: false, // 新增/编辑弹窗
      passVisble: false,
      markVisble: false,
      stateVisble: false,
      detailVisble: false,
      editVisble: false,
      passengerTitle: "乘机人信息",
      markTitle: "提示",
      stateTitle: "处理信息",
      detailTitle: "信息通知详情",
      confirmLoading: false, // 确定按钮加载动画

      modalForm: {
        action: false,
      },
      action: false,
      input_name: "", // 字典名称
      input_type: "", // 字典类型
      input_value: "", // 字典值

      value: "",

      navMainType: "日志", // 日志  备注  附件信息

      markTrueModal: false, // 标记成功
    };
  },
  methods: {
    // 获取token
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getdata();
        this.getOrderSource();
        this.getDataNumber();
      });
    },

    filter(arr, param) {
      if (Array.isArray(arr)) {
        let temp = [];
        let newArr = arr.reduce((acc, cur) => {
          if (temp.indexOf(cur[param]) === -1) {
            temp.push(cur[param]);
            acc.push(cur);
            return acc;
          } else {
            console.log(acc);
            return acc;
          }
        }, []);

        let isDuplicate = newArr.length === arr.length;

        return { newArr, isDuplicate };
      }
    },

    // 获取各状态数据数量  0:待处理(默认)；1:处理中；2:已处理；3：处理失败 100:完结
    getDataNumber() {
      let newStatus = {}
      for (let i = 0; i < 5; i++) {
        let data = {
          OptStatus: i === 4 ? -1 : i,
        };
        this.$axios
          .get("/api/FLIFOtoClient/GetCountByOptStatus", { params: data })
          .then((res) => {
            newStatus["status" + i] = res.data.value;
          });
      }
      this.$nextTick(() =>{
        this.dataNumber = newStatus
      })
      this.$forceUpdate();
    },

    // 获取列表数据
    getdata() {
      let data = {
        PageNo: this.current,
        PageSize: this.currentSize,
        QueryInfo: this.filterData,
      };
      this.$axios.post("/api/FLIFOtoClient/GetPage", data).then((res) => {
        if (res.data.isSuccess) {
          let newDataList = res.data.value.datas;

          let titleData = [];
          let dataId = "";

          // newDataList.forEach((item, index) => {
          //   dataId = item.correlativeOID;
          // });
          // console.log(this.filter(newDataList, 'correlativeOID'))

          this.noticeData = newDataList;
          this.current = res.data.value.pageNo;
          this.currentTotal = res.data.value.totalCount;

          // console.log(this.noticeData);

          // if (this.dictonaryList.length > 0) {
          //   this.profitData.forEach((item) => {
          //     this.dictonaryList.forEach((oitem) => {
          //       if (item.source === oitem.value) {
          //         console.log(oitem);
          //         item["sourceName"] = oitem.name;
          //       }
          //     });
          //   });
          //   this.$forceUpdate();
          // }
        }
      });
    },

    // 获取订单来源
    getOrderSource() {
      this.$axios.get("api/FLIFOtoClient/GetOrderSourceList").then((res) => {
        if (res.data.isSuccess) {
          this.orderSourceList = res.data.value;
        }
      });
    },

    // 订单状态切换
    dataStatusBtn(type) {
      if (type === -1) {
        this.userSelf = true;
        this.orderStatus = undefined;
        this.filterData['isSelf'] = true
        this.filterData['optStatus'] = undefined
      } else {
        this.orderStatus = type;
        this.userSelf = false;
        this.filterData['isSelf'] = false
        this.filterData['optStatus'] = type
      }

      this.getdata();
    },

    // 搜索数据处理
    filterBtn() {
      console.log(this.filter_from);
      this.filterData = {
        optStatus: this.orderStatus,
        isSelf: this.userSelf,
        userNum: "",
        profitCenterCode: "",
        orderSource: String(this.filter_from.orderSource),
        type: this.filter_from.type,
        witting: this.filter_from.witting,
        flag: this.filter_from.flag,
        voyageCode:
          this.filter_from.selectName === "0"
            ? this.filter_from.selectMessage
            : "",
        flihtNumber:
          this.filter_from.selectName === "1"
            ? this.filter_from.selectMessage
            : "",
        upDeportDate: this.filter_from.flightDate
          ? this.filter_from.flightDate.length > 0
            ? this.$moment(this.filter_from.flightDate[0]).format("YYYY-MM-DD")
            : ""
          : "",
        downDeportDate: this.filter_from.flightDate
          ? this.filter_from.flightDate.length > 0
            ? this.$moment(this.filter_from.flightDate[1]).format("YYYY-MM-DD")
            : ""
          : "",
        pnrCode:
          this.filter_from.selectName === "2"
            ? this.filter_from.selectMessage
            : "",
        ticketNumber:
          this.filter_from.selectName === "3"
            ? this.filter_from.selectMessage
            : "",
        outOrderId:
          this.filter_from.selectName === "4"
            ? this.filter_from.selectMessage
            : "",
        officeNo: this.filter_from.officeNo,
      };

      this.getdata();
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

    // 表格多选
    onSelectChange(val) {
      console.log(val);
      this.selectedRowKeys = val;
    },

    // 日志弹窗
    openLogModal(val) {
      console.log(val.toClientMID);
      if (this.logLoading) {
        return this.$message.warning("日志获取中");
      }
      this.logLoading = true;
      let data = {
        // Id: val.toClientMID,
        Id: "TC20110300089",
        logFrom: "信息通知模块",
        ApplicationName: "FlightChange",
      };
      this.$axios
        .get("api/ExternalAPI/GetLogInfo", { params: data })
        .then((res) => {
          this.logLoading = false;
          if (res.data.isSuccess) {
            this.logMessageList = res.data.data;
            this.logVisible = true;
          }
        });
    },

    // 添加乘机人弹窗
    openPassengerModal() {
      this.passVisble = true;
    },

    // 着重标记弹窗
    openPromptModal() {
      if (this.selectedRowKeys.length < 0) {
        this.markVisble = true;
      }

      let selectList = [];
      this.noticeData.forEach((item) => {
        this.selectedRowKeys.forEach((oitem) => {
          if (item.keyID === oitem) {
            selectList.push(item.toClientMID);
          }
        });
      });

      let data = {
        ids: selectList,
      };
      this.$axios.post("/api/FLIFOtoClient/SetFlag", data).then((res) => {
        if (res.data.isSuccess) {
          this.getdata();
          this.markTrueModal = true;
          // this.$message.success(res.data.msg);
          setTimeout(() => {
            this.markTrueModal = false;
          }, 1500);
        }
      });
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
      
    },

    // 日志  备注  附件信息 点击展开收起
    openNavMain(type) {
      this.navMainType = type;
    },
  },

  created() {
    this.getToken();
  },
};
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
      margin-bottom: 14px;
      .list_title {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        margin-right: 8px;
        .filter_select {
          /deep/.ant-select-selection {
            border: none;
            box-shadow: none;
          }
        }
      }
      .list_selece {
        min-width: 160px;
        /deep/.ant-select-selection {
          min-width: 160px;
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid #d9e1ea;
    margin-bottom: 16px;
    .tool_nav {
      display: inline-flex;
      align-items: center;
      .nav_list {
        width: 120px;
        height: 40px;
        border: 1px solid #d9e1ea;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-bottom: none;
        cursor: pointer;
        position: relative;
        &.active {
          &::before {
            content: "";
            position: absolute;
            top: -1px;
            left: -1px;
            width: calc(100% + 2px);
            height: 3px;
            background: #0070e2;
          }
          &::after {
            content: "";
            width: 100%;
            height: 1px;
            background: #fff;
            position: absolute;
            bottom: -1px;
            left: 0;
          }
        }
        &:not(:last-child) {
          border-right: none;
        }
        span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
          padding: 0 4px;
          height: 16px;
          background: rgba(255, 0, 0, 0.6);
          border-radius: 2px;
          font-size: 11px;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
    .tool_box {
      display: inline-flex;
      justify-content: flex-end;
      padding-bottom: 13px;
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
  }

  .table_main {
    .flag_icon {
      width: 15px;
      height: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }
    }
    p {
      margin-bottom: 0;
      &:not(:last-child) {
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

.log_modal_main {
  padding-bottom: 25px;
  .nav {
    display: flex;
    height: 32px;
    margin: 16px 0;
    justify-content: space-between;
    background-color: rgba(0, 112, 226, 0.1);
    padding: 0 16px;
    .nav_title_left {
      display: inline-flex;
      align-items: center;
      .tags {
        width: 4px;
        height: 16px;
        background-color: #0070e2;
      }
      .text {
        font-size: 16px;
        margin-left: 10px;
        font-weight: bold;
      }
      .number {
        width: 16px;
        height: 16px;
        background: rgba(255, 0, 0, 0.6);
        border-radius: 2px;
        color: #fff;
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }

    .operate {
      display: inline-flex;
      align-items: center;
      &.active {
        .action {
          &::after {
            content: "收起";
          }
        }
        .triangle {
          transform: rotate(180deg);
        }
      }
      .action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        &::after {
          content: "展开";
        }
        color: #0070e2;
      }

      .triangle {
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid #0070e2;
        transition: all 0.3s;
      }
    }
  }
  .nav_main {
    .nav_table {
      display: flex;
      justify-content: space-around;
      height: 40px;
    border-bottom: 1px solid #d9e1ea;
      .nav_item {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        &.log_center {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .log_center_text {
            width: 100%;
            overflow: hidden;
          }
        }
      }
    }
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
    border: 1px solid #dfdfdf;
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
}

.level {
  .ant-btn {
    border-radius: 15px;
    border: 1px solid #0070e2;
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
}

// 标记成功弹窗
.mark_true_modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 22px;
  .icon {
    width: 56px;
    height: 56px;
    margin-bottom: 13px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .prompt {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
  }
}
</style>

