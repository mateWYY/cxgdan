<template>
    <div class="common-layout">
      <headers></headers>
      <div class="comBox">
        <div class="comLeft">
          <side queryType="docum"></side>
        </div>
        
        <div class="comRight">
            <RouterView></RouterView>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import headers from '@/components/headers/headers.vue'
    import side from '@/components/side/side.vue'
  </script>
  
  <style scoped lang='scss'>
    body{
      background: #FAFAFA;
    }
    .comBox{
      width: calc(100vw - 120px);
      margin: 0 auto;
      margin-top: 20px;
      display: flex;
      .comLeft{
        width: 260px;
        margin-right: 20px;
      }
      .comRight{
        width: calc(100vw - 400px);

      }
    }
  </style>