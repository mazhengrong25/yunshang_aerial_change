<!--
 * @Description: 公共航变动态库
 * @Author: wish.WuJunLong
 * @Date: 2020-10-27 09:59:47
 * @LastEditTime: 2020-11-04 11:30:34
 * @LastEditors: Please set LastEditors
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
            v-model="filter_from.msgSource"
          >
            <a-select-option :value="item.value" v-for="(item, index) in dictonaryList" :key="index"> {{item.name}} </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">航变类型</div>
        <div class="list_selece">
          <a-select
            style="width: 120px"
            placeholder="请选择"
            allowClear
            v-model="filter_from.type"
          >
             <a-select-option value="YW"> 航班延误 </a-select-option>
                <a-select-option value="TQ"> 航班提前 </a-select-option>
                <a-select-option value="QX"> 航班取消 </a-select-option>
                <a-select-option value="BG"> 航班变更 </a-select-option>
                <a-select-option value="DD"> 航班待定 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="filter_list">
        <div class="list_title">采用状态</div>
        <div class="list_selece">
          <a-select
            style="width: 120px"
            placeholder="请选择"
            allowClear
            v-model="filter_from.adopt"
          >
            <a-select-option value="0"> 未采用 </a-select-option>
            <a-select-option value="1"> 已采用 </a-select-option>
          </a-select>
        </div>
      </div>

      <div class="filter_list">
        <div class="list_title">航程代码</div>
        <div class="list_selece">
          <a-input
            allowClear
            style="width: 160px"
            v-model="filter_from.voyageCode"
            placeholder="请输入"
          />
        </div>
      </div>

      <div class="filter_list">
        <div class="list_title">航班号</div>
        <div class="list_selece">
          <a-input
            allowClear
            style="width: 160px"
            v-model="filter_from.flihtNumber"
            placeholder="请输入"
          />
        </div>
      </div>

      <div class="filter_list">
        <div class="list_title">
          <a-select
            style="width: 80px"
            defaultValue="0"
            class="phone_select"
          >
            <a-select-option value="0"> 手机号 </a-select-option>
            <a-select-option value="1"> 邮箱 </a-select-option>
          </a-select>
        </div>
        <div class="list_selece">
          <a-input
            allowClear
            style="width: 160px"
            v-model="filter_from.sign"
            placeholder="下拉：手机号/邮箱"
          />
        </div>
      </div>

      <div class="filter_list">
        <div class="list_title">原起飞时间</div>
        <div class="list_selece">
          <a-range-picker v-model="filter_from.depDate" :placeholder="['起飞最早', '起飞最晚']"/>
        </div>
      </div>

      <div class="filter_list">
        <div class="list_title">入库时间</div>
        <div class="list_selece">
          <a-range-picker v-model="filter_from.addDate" :placeholder="['入库最早', '入库最晚']"/>
        </div>
      </div>

      <a-button class="filter_btn" type="primary" @click="filterBtn"
        >搜索</a-button
      >
    </div>

    <div class="table_tool">
      <a-button @click="matchingAdopted()">重新匹配采用</a-button>
      <a-button @click="openPnrCodeModal()">解析PNR编码</a-button>
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
          type: 'radio',
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
            <a-tooltip
              placement="bottomLeft"
              arrow-point-at-center
              autoAdjustOverflow
            >
              <template slot="title" v-if="record.messageText">
                {{ record.messageText }}
              </template>
              <p :class="['show_tag', { no_message: !record.messageText }]">
                查看
              </p>
            </a-tooltip>
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
                : record.changeType === "BG"
                ? "航班变更"
                : record.changeType === "DD"
                ? "航班待定"
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
                record.oArriveTime
                  ? $moment(record.oArriveTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </p>
            <p>
              <span>新</span
              >{{
                record.nArriveTime
                  ? $moment(record.nArriveTime).format("YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </p>
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
        <a-table-column title="入库时间">
          <template slot-scope="record">
            {{
              record.addTime
                ? $moment(record.addTime).format("YYYY-MM-DD HH:mm:ss")
                : ""
            }}
          </template>
        </a-table-column>

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

    <a-modal
      :title="modalTitle + '航变信息'"
      :visible="modalStatus"
      :confirm-loading="confirmLoading"
      centered
      @ok="submitBtn"
      @cancel="cancelBtn"
      width="1120"
      :footer="null"
    >
      <div class="modal_main">
        <div class="modal_list">
          <div class="modal_item" style="flex: 1">
            <div class="item_title">原始信息</div>
            <div class="item_input" style="flex: 1">
              <a-textarea
                class="input_textarea"
                placeholder="请输入"
                :rows="6"
                allowClear
                v-model="modalObject.messageText"
                :disabled="modal_type === 'edit'"
              />
            </div>
          </div>
        </div>

        <div class="modal_list">
          <div class="modal_item">
            <div class="item_title">航变来源</div>
            <div class="item_input">
              <a-select
                v-model="modalObject.msgSource"
                placeholder="请选择"
                allowClear
                style="width: 240px"
                :disabled="modal_type === 'edit'"
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
            <div class="item_title">所属部门</div>
            <div class="item_input">
              <a-select
                v-model="modalObject.affiliationDept"
                placeholder="请选择"
                allowClear
                style="width: 240px"
                :disabled="modal_type === 'edit'"
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
            <div class="item_title">航空公司</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.airlineCode"
                allowClear
                placeholder="航司二字码"
              />
            </div>
          </div>
        </div>

        <div class="modal_list">
          <div class="modal_item">
            <div class="item_title">原出发地</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.oFromCity"
                allowClear
                placeholder="例：重庆"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">原目的地</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.oToCity"
                allowClear
                placeholder="例：重庆"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新出发地</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.fromCity"
                allowClear
                placeholder="例：重庆"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新目的地</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.toCity"
                allowClear
                placeholder="例：重庆"
              />
            </div>
          </div>
        </div>

        <div class="modal_list">
          <div class="modal_item">
            <div class="item_title">原出发地码</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.oFromCityCode"
                allowClear
                placeholder="原出发地三字码"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">原目的地码</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.oToCityCode"
                allowClear
                placeholder="原目的地三字码"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新出发地码</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.fromCityCode"
                allowClear
                placeholder="新出发地三字码"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新目的地码</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.toCityCode"
                allowClear
                placeholder="新目的地三字码"
              />
            </div>
          </div>
        </div>

        <div class="modal_list">
          <div class="modal_item">
            <div class="item_title">航变类型</div>
            <div class="item_input">
              <a-select
                v-model="modalForm.changeType"
                placeholder="请选择"
                allowClear
                style="width: 240px"
              >
                <a-select-option value="YW"> 航班延误 </a-select-option>
                <a-select-option value="TQ"> 航班提前 </a-select-option>
                <a-select-option value="QX"> 航班取消 </a-select-option>
                <a-select-option value="BG"> 航班变更 </a-select-option>
                <a-select-option value="DD"> 航班待定 </a-select-option>
              </a-select>
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">子类型</div>
            <div class="item_input">
              <a-select
                v-model="modalForm.subtype"
                placeholder="请选择"
                allowClear
                style="width: 240px"
              >
                <a-select-option value="Y"> 航班取消有保护 </a-select-option>
                <a-select-option value="N"> 航班取消无保护 </a-select-option>
              </a-select>
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">原航班号</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.oFlightNumber"
                allowClear
                placeholder="请输入"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新航班号</div>
            <div class="item_input">
              <a-input
                v-model="modalForm.nFlightNumber"
                allowClear
                placeholder="请输入"
              />
            </div>
          </div>
        </div>

        <div class="modal_list">
          <div class="modal_item">
            <div class="item_title">原起飞时间</div>
            <div class="item_input">
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="modalForm.oDepartureTime"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">原到达时间</div>
            <div class="item_input">
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="modalForm.oArriveTime"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新起飞时间</div>
            <div class="item_input">
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="modalForm.nDepartureTime"
              />
            </div>
          </div>

          <div class="modal_item">
            <div class="item_title">新到达时间</div>
            <div class="item_input">
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-model="modalForm.nArriveTime"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="moadl_footer">
        <div class="footer_box" v-if="modal_type === 'add'">
          <a-button @click="cancelBtn">取消</a-button>
          <a-button :loading="confirmLoading" @click="submitBtn" type="primary"
            >新增</a-button
          >
        </div>
        <div class="footer_box" v-if="modal_type === 'edit'">
          <a-button
            :loading="confirmLoading"
            @click="submitBtn"
            type="primary"
            class="edit_btn"
            >修改</a-button
          >
          <a-button
            :loading="confirmLoading"
            @click="submitReturnBtn"
            type="primary"
            >修改并重新匹配采用</a-button
          >
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="showPnrCode"
      title="解析PNR编码"
      :footer="null"
      :width="1120"
      :confirmLoading="pnrLoading"
    >
      <div class="pnr_code">
        <div class="pnr_title">
          <div class="title_message">
            注：请务必完全按照PNR的格式粘贴，以便系统准确解析
          </div>
          <div class="open_example">查看示例</div>
        </div>
        <div class="pnr_main">
          <div class="mian_title">导入PNR</div>
          <div class="main_input">
            <a-textarea v-model="pnrCode" />
          </div>
        </div>
        <div class="pnr_footer">
          <a-button type="primary" class="pnr_reset" @click="resetPnrCode()"
            >重置</a-button
          >

          <div class="footer_box">
            <a-button type="primary" class="pnr_submit" @click="submitPnrCode()">解析PNR编码</a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal v-model="showPnrStatus" :footer="null">
      <div class="show_pnr_status">
        <div class="status_icon">
          <img v-if="pnrStatus" src="@/assets/true.png" alt="" />
          <img v-else src="@/assets/false.png" alt="" />
        </div>
        <div class="pnr_message">{{pnrStatus?'PNR编码解析成功!':'PNR编码解析失败!'}}</div>

        <div class="pnr_status_footer">
          <a-button type="primary" v-if="pnrStatus" @click="closePnrStatus()">确定</a-button>
          <a-button v-if="!pnrStatus" @click="closePnrStatus()">关闭</a-button>
          <a-button type="primary" v-if="!pnrStatus" @click="returnShowPnrCode()">重新导入</a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model="showPrompt"
      title="提示"
      @ok="submitPrompt"
      :confirmLoading="prometLoading"
    >
      <div class="show_prompt">
        <p>是否确定将选择的航变信息重新采用匹配乘机人？</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter_from: {}, // 头部搜索栏

      dataList: [], // 数据列表

      selectedRowKeys: [], // 选中数据列表

      current: 1, // 页面下标
      currentSize: 10, // 页面数据条数
      currentTotal: 0, // 数据总数

      dictonaryList: [], // 来源渠道

      profitCenterList: [], // 部门列表

      modalTitle: "新增", // 弹窗标题
      modalStatus: false, // 显示隐藏弹窗
      confirmLoading: false, // 弹窗加载动画

      modal_type: "add",

      modalObject: {}, // 弹窗数据
      modalForm: {}, // 弹窗列表数据

      showPrompt: false, // 提示弹窗
      prometLoading: false, // 提示弹窗确认按钮加载

      showPnrCode: false, // pnr解析弹窗
      pnrLoading: false, // pnr解析弹窗提交加载

      pnrCode: "", // pnr数据
      pnrStatus: false,  // pnr解析状态

      showPnrStatus: false, // pnr状态弹窗

    };
  },
  methods: {
    getToken() {
      this.$axios.get("api/token/authenticate").then((res) => {
        this.$axios.defaults.headers.Authorization = "Bearer " + res.data.token;
        this.getData();
        this.getDictonaryList();
        this.getProfitCenter();
      });
    },
    getData() {
      let data = {
        pageNo: this.current,
        pageSize: this.currentSize,
        queryInfo: {
          profitCenterCode: this.filter_from.profitCenterCode,
          msgSource: this.filter_from.msgSource,
          type: this.filter_from.type,
          adopt: this.filter_from.adopt,
          voyageCode: this.filter_from.voyageCode,
          flihtNumber: this.filter_from.flihtNumber,
          upDeportDate: this.filter_from.depDate?this.filter_from.depDate.length>0?this.$moment(this.filter_from.depDate[0]).format("YYYY-MM-DD"):'':'',
          downDeportDate: this.filter_from.depDate?this.filter_from.depDate.length>0?this.$moment(this.filter_from.depDate[1]).format("YYYY-MM-DD"):'':'',
          upAddDate: this.filter_from.addDate?this.filter_from.addDate.length>0?this.$moment(this.filter_from.addDate[0]).format("YYYY-MM-DD"):'':'',
          downAddDate: this.filter_from.addDate?this.filter_from.addDate.length>0?this.$moment(this.filter_from.addDate[1]).format("YYYY-MM-DD"):'':'',
          sign: this.filter_from.sign,
        },
      };
      console.log(this.filter_from)
      console.log(data)
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

    // 表格多选
    onSelectChange(val) {
      console.log(val);
      this.selectedRowKeys = val;
    },
    // 筛选搜索按钮
    filterBtn() {
      this.getData()
    },
    // 弹窗
    openModal(type, val) {
      this.confirmLoading = false;
      this.modalStatus = true;
      this.modal_type = type;
      if (type === "edit") {
        this.modalTitle = "编辑";
        let editData = JSON.parse(JSON.stringify(val));
        editData.nArriveTime = editData.nArriveTime
          ? this.$moment(editData.nArriveTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
        editData.nDepartureTime = editData.nDepartureTime
          ? this.$moment(editData.nDepartureTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
        editData.oArriveTime = editData.oArriveTime
          ? this.$moment(editData.oArriveTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
        editData.oDepartureTime = editData.oDepartureTime
          ? this.$moment(editData.oDepartureTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
        this.modalObject = {
          messageText: editData.messageText,
          affiliationDept: editData.affiliationDept,
          msgSource: editData.msgSource,
          parseFlag: editData.parseFlag,
        };
        this.modalForm = editData;
        console.log(editData);
      } else {
        this.modalTitle = "新增";
        this.modalObject = {};
        this.modalForm = {};
      }
    },

    // 弹窗提交
    submitBtn(editType) {
      this.confirmLoading = true;
      console.log(this.modalObject, this.modalForm);

      let data;
      let url;
      let newData = JSON.parse(JSON.stringify(this.modalForm));
      newData.nArriveTime = newData.nArriveTime
        ? this.$moment(newData.nArriveTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      newData.nDepartureTime = newData.nDepartureTime
        ? this.$moment(newData.nDepartureTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      newData.oArriveTime = newData.oArriveTime
        ? this.$moment(newData.oArriveTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      newData.oDepartureTime = newData.oDepartureTime
        ? this.$moment(newData.oDepartureTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      if (this.modal_type === "add") {
        url = "/api/FlightChange/HandleInsertFlight";
        newData["keyId"] = "0";
        newData["originId"] = 0;

        data = {
          messageText: this.modalObject.messageText,
          affiliationDept: this.modalObject.affiliationDept,
          msgSource: this.modalObject.msgSource,
          parseFlag: 1,
          flightInfoInputs: [newData],
        };
      } else {
        url = "/api/FlightChange/Update";

        data = {
          updateType: editType ? 2 : 1,
          flightInfoInput: {
            keyId: String(newData.keyID),
            originId: newData.originalInfoID,
            airlineCode: newData.airlineCode,
            changeType: newData.changeType,
            subtype: newData.subtype,
            oFlightNumber: newData.oFlightNumber,
            oToCity: newData.oToCity,
            oFromCity: newData.oFromCity,
            oToCityCode: newData.oToCityCode,
            oFromCityCode: newData.oFromCityCode,
            oDepartureTime: newData.oDepartureTime,
            oArriveTime: newData.oArriveTime,
            nFlightNumber: newData.nFlightNumber,
            nDepartureTime: newData.nDepartureTime,
            nArriveTime: newData.nArriveTime,
            fromCityCode: newData.fromCityCode,
            toCityCode: newData.toCityCode,
            fromCity: newData.fromCity,
            toCity: newData.toCity,
          },
        };
      }

      console.log(data);
      this.$axios.post(url, data).then((res) => {
        this.confirmLoading = false;
        if (res.data.isSuccess) {
          this.$message.success(res.data.msg);
          this.cancelBtn();
          this.getData();
        }
      });
    },

    // 修改并重新采用
    submitReturnBtn() {
      this.submitBtn(2);
    },

    // 重新采用匹配
    matchingAdopted() {
      if (this.selectedRowKeys.length > 0) {
        this.showPrompt = true;
      } else {
        return this.$message.warning("请选择数据后再进行操作");
      }
    },

    // 提示弹窗提交
    submitPrompt() {
      this.prometLoading = true;
      let data = {
        flightKeyId: String(this.selectedRowKeys),
      };
      this.$axios
        .get("/api/FlightChange/MatchingAdopted", { params: data })
        .then((res) => {
          this.prometLoading = false;
          if (res.data.isSuccess) {
            this.$message.success(res.data.msg);
            this.showPrompt = false;
            this.getData();
          }
        });
    },

    // 打开pnr弹窗
    openPnrCodeModal(){
      this.showPnrCode = true
      this.pnrCode = "";
    },

    // 解析pnr编码
    submitPnrCode() {
      if(!this.pnrCode){
        return this.$message.warning('请填写数据后再进行提交')
      }

      let data = {
        PnrContent: this.pnrCode
      }
      this.$axios.post('/api/ExternalAPI/PnrParser',data)
        .then(res =>{
          this.showPnrStatus = res.data.isSuccess
          this.showPnrStatus = true
          this.showPnrCode = false
        })
    },

    // 重置pnr
    resetPnrCode() {
      this.pnrCode = "";
    },

    // 重新打开pnr弹窗
    returnShowPnrCode(){
      this.showPnrCode = true
      this.showPnrStatus = false
    },

    // 关闭pnr提示弹窗
    closePnrStatus(){
      this.showPnrStatus = false
    },

    // 弹窗取消
    cancelBtn() {
      this.modalStatus = false;
      this.confirmLoading = false;
    },

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
    flex-wrap: wrap;
    padding: 0 16px;
    margin-bottom: 8px;
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
        width: 80px;
        text-align: right;
        .phone_select{
          /deep/.ant-select-selection{
            border: none;
            box-shadow: none;
            &:hover{
              border: none;
              box-shadow: none;
            }
          }
        }
      }
      .list_selece {
        min-width: 160px;
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
      margin-bottom: 8px;
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

.modal_main {
  .modal_list {
    display: flex;
    align-items: center;
    .modal_item {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      .item_title {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        margin-right: 8px;
        width: 70px;
        text-align: right;
        flex-shrink: 0;
      }
      .item_input {
        min-width: 240px;
        flex-shrink: 0;
        /deep/textarea {
          resize: none;
        }
        .ant-calendar-picker {
          width: 100%;
        }
      }
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
  }
}
.moadl_footer {
  width: 100%;
  padding: 30px 0 24px;
  .footer_box {
    display: flex;
    align-items: center;
    justify-content: center;
    .ant-btn {
      min-width: 90px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 400;
      border-radius: 17px;
      padding: 0 20px;
      &.ant-btn-primary {
        color: #ffffff;
      }
      &.edit_btn {
        border-color: #fb9826;
        background-color: #fb9826;
      }
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}

.pnr_code {
  padding: 0 16px 0 80px;
  .pnr_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .title_message {
      font-size: 14px;
      font-weight: 400;
      color: #ff0000;
    }
    .open_example {
      font-size: 14px;
      font-weight: 400;
      color: #0070e2;
      cursor: not-allowed;
    }
  }
  .pnr_main {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    .mian_title {
      position: absolute;
      left: -70px;
    }
    .main_input {
      flex: 1;
      height: 272px;
      /deep/textarea {
        resize: none;
        height: 100%;
        background-color: #222631;
        font-size: 12px;
        font-weight: 400;
        color: #ded47b;
        &:focus {
          border-color: #ded47b;
          box-shadow: 0 0 0 2px rgba(255, 201, 24, 0.2);
        }
        &:hover {
          border-color: #ded47b;
        }
      }
    }
  }
  .pnr_footer {
    .pnr_reset {
      width: 80px;
      height: 30px;
      background-color: rgba(0, 112, 226, 0.2);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-size: 12px;
      font-weight: 400;
      color: #0070e2;
    }
    .footer_box {
      margin-top: 100px;
      padding-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      .pnr_submit {
        min-width: 168px;
        height: 34px;
        background-color: #0070e2;
        border-color: #0070e2;
        opacity: 1;
        border-radius: 17px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.show_pnr_status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .status_icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 24px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .pnr_message {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
  }
  .pnr_status_footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 38px;
    padding-bottom: 24px;
    .ant-btn {
      min-width: 90px;
      height: 34px;
      border-radius: 17px;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      font-size: 14px;
      font-weight: 400;
      &:not(:last-child){
        margin-right: 16px;
      }
    }
  }
}
</style>