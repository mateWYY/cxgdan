<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useExpreListStore } from '@/store/store'
import monitor from '@/components/globalMonitor/monitor.vue'
const expreData = useExpreListStore()
expreData.getList()
</script>

<template>
  <div>
    <monitor/>
    <RouterView />
  </div>
</template>

<style lang='scss' scoped>
  ::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner,::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      border-color: #FF5411; /* 例如，设置为红色 */
      background: #FF5411;
  }
  ::v-deep .el-table__body tr.hover-row.current-row>td.el-table__cell,
  ::v-deep  .el-table__body tr.hover-row.el-table__row--striped.current-row>td.el-table__cell, 
  ::v-deep  .el-table__body tr.hover-row.el-table__row--striped>td.el-table__cell, 
  ::v-deep  .el-table__body tr.hover-row>td.el-table__cell,
  ::v-deep  .el-table__body tr>td.hover-cell,
  ::v-deep .hhhh{
    background: #FFF9F6;
  }
  ::v-deep .el-pager li.is-active,::v-deep .el-pager li:hover{
    color: #FF5411;
  }
 
 
  ::v-deep .el-select__wrapper.is-focused,::v-deep .el-range-editor.is-active,::v-deep .el-range-editor.is-active:hover,::v-deep .el-input__wrapper.is-focus{
    box-shadow: 0 0 0 1px #FF5411 inset;
  }
  ::v-deep .el-button:hover{
    background-color: rgba(255,84,17, .1);
    border-color: #FF5411;
    color: #FF5411 ;
  }
   ::v-deep .el-button--primary{
    background-color: #FF5411;
    border-color: #FF5411;
   }
   ::v-deep .el-button--primary:hover{
    background-color: rgba(255,84,17, .8);
    border-color: rgba(255,84,17, .8);
    color: #fff ;
  }
  ::v-deep .hoverOpic{
    &:hover{
      opacity: .8;
    }
  }
</style>
