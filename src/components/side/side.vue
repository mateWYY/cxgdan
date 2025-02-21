<template>
  <div class="sideType" v-if="props.queryType=='exp'">
    <div class="sideTypeItem" @click="tabNum=0" :class="{'sideTypeItem1':tabNum==0}">
      直接查询
    </div>
    <div class="sideTypeItem" @click="tabNum=1" :class="{'sideTypeItem1':tabNum==1}">
      微信查询配置
    </div>
    <div class="sideTypeItem" @click="tabNum=2" :class="{'sideTypeItem1':tabNum==2}">
      查询记录
    </div>
  </div>
  <div class="sideType" v-if="props.queryType=='docum'">
    <div class="sideTypeItem" @click="tabNum=0" :class="{'sideTypeItem1':tabNum==0}">
      出港跟单
    </div>
    <div class="sideTypeItem" @click="tabNum=1" :class="{'sideTypeItem1':tabNum==1}">
      跟单配置
    </div>
    <div class="sideTypeItem" @click="tabNum=2" :class="{'sideTypeItem1':tabNum==2}">
      客户自助查询
    </div>
    <div class="sideTypeItem" @click="tabNum=3" :class="{'sideTypeItem1':tabNum==3}">
      物流加速
    </div>
  </div>
  <div class="sideBox">
    <div class="sideTit">
      站点账号状态
    </div>
    <div class="sideTip">
      <img src="@/assets/img/tipIcon.png" class="tipIcon" alt="">
      <p>请保持各站点保持登录状态，否则数
        据将不能正确同步</p>
    </div>
    <div class="sideList">
      <div class="sideItem" v-for="(item,index) in arr" :key="index">
        <img :src="item.imgUrl" alt="">
        <p>
          {{item.name}}
        </p>
        <div class="sideBtn" :class="{'sideBtns': tabIndex==index}">
          {{tabIndex==index?'掉线':'在线'}}
        </div>
      </div>
    </div>
    <div class="sideAddBtn">
      <img src="@/assets/img/addIcon.png" alt="">
      添加更多站点
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { reactive,ref } from 'vue'
  import a from '@/assets/img/a@2x.png';
  import b from '@/assets/img/b@2x.png';
  import c from '@/assets/img/c@2x.png';
  import d from '@/assets/img/d@2x.png';
  const props = defineProps({
    queryType: {
      type: String,
      default: '',
    }
  })
  let tabNum = ref(0)
  let arr = reactive([{
    name: '十九里镇一部',
    imgUrl:a,
  },{
    name: '太安堂二部',
    imgUrl:b,
  },{
    name: '中通快运十河站阿萨德借记卡山莨菪碱',
    imgUrl:c,
  },{
    name: '壹米滴答康美站阿萨德借记卡山莨菪碱',
    imgUrl:d,
  },])
  let tabIndex = ref(2)
</script>

<style scoped lang='scss'>
  .sideType{
    background: #FFFFFF;
    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.08);
    border-radius: 12px;    
    padding: 20px;
    margin-bottom: 20px;
    .sideTypeItem{
      height: 45px;
      font-size: 16px;
      border-radius: 5px;
      padding-left: 23px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #666666;
    }
    .sideTypeItem1{
      color: #FF5411;
      background: rgba(#FF5411, .1);
      font-weight: bold;
      position: relative;
      &::before{
        content: "";
        position: absolute;
        width: 3px;
        height: 17px;
        left: 0;
        top: 50%;
        background: #FF5411;
        transform: translateY(-50%);
      }
    }
  }
  .sideBox{
    background: #FFFFFF;
    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.08);
    border-radius: 12px;
    padding: 0 20px 21px;
    .sideTit{
      width: 130px;
      height: 31px;
      margin: 0 auto 13px;
      font-size: 14px;
      color: #FF5411;
      text-align: center;
      line-height: 31px;
      background: linear-gradient(180deg, #FFFFFF, #FFEEE7);
      border-radius: 12px;
    }
    .sideTip{
      margin-bottom: 15px;
      display: flex;
      img{
        width: 13px;
        height: 13px;
        margin-right: 4px;
        margin-top: 3px;
      }
      p{
        flex: 1;
        line-height: 1.5;
        font-size: 12px;
        color: #666666;
      }
    }
    .sideList{
      .sideItem{
        display: flex;
        height: 46px;
        background: linear-gradient(0deg, #FFFFFF, #FFEEE7);
        border-radius: 5px;
        border: 1px solid #FFEEE7;
        align-items: center;
        padding: 9px 10px;
        margin-bottom: 10px;
        align-items: center;
        cursor: pointer;
        img{
          width: 28px;
          height: 28px;
          border-radius: 4px;
          margin-right: 9px;
        }
        p{
          flex: 1;
          max-width: 106px;
          white-space: nowrap; /* 防止文本换行 */
          overflow: hidden; /* 隐藏溢出的文本 */
          text-overflow: ellipsis; /* 显示省略号 */
          font-size: 14px;
          color: #666666;
        }
        .sideBtn{
          width: 44px;
          height: 19px;
          background: rgba(40,167,69,0.16);
          border-radius: 3px;
          font-size: 12px;
          color: #28A745;
          margin-left: 12px;
          text-align: center;
          line-height: 19px;
          padding-left: 8px;
          position: relative;
          &::before{
            content: "";
            position: absolute;
            width: 4px;
            height: 4px;
            background: url('@/assets/img/zxIcon.png') no-repeat;
            background-size: 100% 100%;
            top: 50%;
            transform: translateY(-50%);
            left: 7px;
          }
        }
        .sideBtns{
          background: rgba(220,53,69,0.16);
          color: #DC3545;
          &::before{
            content: "";
            position: absolute;
            width: 7px;
            height: 7px;
            background: url('@/assets/img/gbIcon.png') no-repeat;
            background-size: 100% 100%;
            top: 50%;
            transform: translateY(-45%);
            left: 5px;
          }
        }
      }
    }
    .sideAddBtn{
      width: 220px;
      height: 46px;
      background: linear-gradient(0deg, #FFFFFF, #FFEEE7);
      border-radius: 5px;
      border: 1px solid #FFEEE7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      img{
        width: 12px;
        height: 12px;
        margin-right: 6px;
      }
    }
  }
</style>