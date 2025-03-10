<template>
  <div class="headBox">
    <div class="icons">
      <img src="@/assets/img/LOGO@2x.png" alt="">
    </div>
    <div class="headRig">
      <div class="headtabs">
        <div class="headtab" v-for="(item,index) in arr" @click="tbFn(index)" :class="{'tabActive':tabFn.tabs==index}" :key="index">
          {{item}}
        </div>
      </div>
      <div class="moneyNum">
        <img src="@/assets/img/douIcon.png" class="mIcon" alt="">
        <span class="num1">2869</span>
        蜂蜜豆
        <div class="moneyNumBtn">
          充值
        </div>
      </div>
      <div class="infoBox">
        <img src="@/assets/img/icons.png" class="infoIcons" alt="">
        <span>疯狂的戴夫</span>
        <div class="infoIcon">
          <img src="@/assets/img/infoIcon.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { reactive,ref } from 'vue'
  import { useRouter  } from 'vue-router'
  const router = useRouter ();
  let arr = reactive(['首页','查地址','跟单','比价','录单','设置'])
  import { useTabStore } from '@/store/store'
  const tabFn = useTabStore()
  function tbFn(val:number) {
    tabFn.setTab(val)
    if(val==1){
      router.push({
        path: '/checkAddress/expDelivery',
      })
    }else if(val==2){
      router.push({
        path: '/documentation',
      })
    }else if(val == 3){
      router.push({
        path: '/priceCparison',
      })
    }
    
  } 

</script>

<style scoped lang='scss'>
  .headBox{
    height: 70px;
    background: #FFFFFF;
    box-shadow: 0px 2px 7px 0px rgba(145,145,145,0.15);
    padding: 0 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icons{
      height: 24px;
      img{
        height: 100%;
      }
    }
    .headRig{
      display: flex;
      .headtabs{
        display: flex;
        font-size: 18px;
        color: #222222;
        align-items: center;
        margin-right: 70px;
        .headtab{
          margin-right: 69px;
          cursor: pointer;
          &:last-child{
            margin-right: 0;
          }
        }
        .tabActive{
          color: #FF5411;
          position: relative;
          font-weight: bold;
          &::after{
            content: '';
            position: absolute;
            bottom: -9px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            background: #FF5411;
            border-radius: 2px;
          }
        }
      }
      .moneyNum{
        display: flex;
        align-items: center;
        padding: 0 25px 0 22px;
        font-size: 14px;
        color: #666666;
        line-height: 1;
        position: relative;
        &:after{
          content: '';
          position: absolute;
          width: 1px;
          height: 18px;
          background: #EDEDED;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        .mIcon{
          width: 28px;
        }
        span{
          color: #FF5411;
          vertical-align: bottom;
          margin-right: 4px;
          font-weight: bold;
        }
        .moneyNumBtn{
          width: 50px;
          height: 30px;
          background: linear-gradient(90deg, #FF5B2E, #FF8969);
          box-shadow: 0px 2px 5px 0px rgba(255,92,47,0.25);
          border-radius: 3px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          color: #FFFFFF;
          cursor: pointer;
          margin-left: 11px;
        }
      }
      .infoBox{
        display: flex;
        align-items: center;
        padding: 0 20px 0 25px;
        position: relative;
        cursor: pointer;
        &:after{
          content: '';
          position: absolute;
          width: 1px;
          height: 18px;
          background: #EDEDED;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        .infoIcons{
          width: 35px;
          height: 35px;
          margin-right: 9px;
        }
        span{
          font-size: 14px;
          color: #666666;
          margin: 0 5px 0 9px;
        }
        .infoIcon{
          display: flex;
          align-items: center;
          img{
            height: 7px;
          }
        }
      }
    }
  }
</style>