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
      <a-button @click="openProfitModal('add')">+新增</a-button>
      <a-button>批量启用</a-button>
      <a-button>批量停用</a-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      filter_type: undefined,
      filter_source: undefined,
      filter_profilt: undefined,
    }
  },
  methods: {
    // 筛选搜索按钮
    filterBtn(){

    },
    // 弹窗
    openProfitModal(){},
  },
};
</script>

<style lang="less" scoped>
.dynamic_library {
}
</style>