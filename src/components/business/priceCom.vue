<template>
  <div class="priceBox">
    <div class="priceTop">
      <div class="priceTit" :class="{'priceTit1':titFlag}" @click="titFlag = !titFlag">
        <div class="priceTits">
          <img src="@/assets/img/szIcon.png" alt="" class="icon">
          <p>选择开单系统：</p>
          <div class="priImgs">
              <img :src="arrImg[item].imgUrl" v-for="item,index in checkList.slice(0,5)" :style="{'marginLeft': `-10px`}" :key="index" alt="">
              <div class="priDy" v-if="checkList.length>5">
                +{{ checkList.length - 5 }}
              </div>
              <p v-if="checkList.length==0">
                暂未选择系统
              </p>
          </div>
          <img src="@/assets/img/iconX.png" alt="" class="xlIcon">
        </div>
        <div class="priceTitCont" @click.stop="">
          <el-checkbox-group v-model="checkList">
            <div class="priceTitItem" :class="{'priceTitItem1': checkList.includes(index)}" @click="priBtn(index)" v-for="item,index in arrImg" :key="index">
              <img :src="item.imgUrl" alt="">
              <p>{{item.name}}</p>
              <el-checkbox :value="index" @click.stop=""/>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="priTab">
        <div class="priTabBtn" @click="tabsIndex=1" :class="{'priTabBtns': tabsIndex==1}">
          单个
        </div>
        <div class="priTabBtn" @click="tabsIndex=2" :class="{'priTabBtns': tabsIndex==2}">
          批量
        </div>
      </div>
      <div class="priFroms" v-show="tabsIndex==1">
        <div class="priLef">
          <p>收件地址</p>
          <el-input
            v-model="input"
            class="inClass"
            style="width: 550px;"
            placeholder="请输入地址"
            clearable
          />
        </div>
        <div class="priRig">
          <p>结算重量（Kg）</p>
          <el-input
            class="inClass"
            v-model="input"
            style="width: 150px;"
            placeholder="请输入"
            clearable
          />
        </div>
      </div>
      <div v-show="tabsIndex==2">
        <div class="priPlFrom">
          <p>智能解析</p>
          <el-input
            v-model="txt"
            maxlength="2000"
            style="width: 710px;"
            rows="5"
            placeholder="请输入收件地址和结算重量，如：安徽省亳州市谯城区万达B座写字楼1602室20.5"
            show-word-limit
            resize="none"
            type="textarea"
          />
          <div class="priPlTable">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="address" label="收件地址" />
              <el-table-column prop="num" label="结算重量（Kg）"/>
            </el-table>
          </div>
        </div>
      </div>
      <div class="priBtn">
        智能比价
        <img src="@/assets/img/btns.png" alt="" class="prizIcon">
      </div>

    </div>
    <div class="priceBot" :style="{'marginTop': tabsIndex==1?'-330px':'-64px'}">
      <div v-if="tabsIndex==1" class="dgBox">
        <div class="expreDeliverItem" v-for="item,index in 9" :key="index">
          <div class="experImg">
            <img src="" alt="">
          </div>
          <div class="experInfo">
            <div class="experInfoTit">
              <span>安能物流</span>
              <div class="experInfoStatus">
                Mini小件
              </div>
              <div class="experInfoStatus experInfoStatus1">
                预计2天到达
              </div>
            </div>
            <div class="experInfoTip">
              <span>安徽省亳州市</span>
            </div>
          </div>
          <div class="experRig">
            <div class="experRigBtn" v-if="listIndex==item">
              去录单
            </div>
            <p v-if="listIndex!=item">
              总成本
              <i>￥</i>
              <span>16.5</span>
            </p>
          </div>
          <div class="experStatusBox" v-if="listIndex!=item">
            <div class="experStatus">
              <img src="@/assets/img/zkdda.png" alt="">
            </div>
            <div class="experStatus">
              <img src="@/assets/img/zdjia.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabsIndex==2">
        <div class="plList" >
          <div class="plItem" v-for="item,index in 4" :key="index">
            <div class="plTit">
              <div class="plDz">
                地址1
              </div>
              <p>安徽省亳州市谯城区星光大厦1802室<span>59.8Kg</span></p>
            </div>
            <div class="plKys">
              <div class="plKyItem" v-for="i,s in 8" :key="s">
                <div class="plKyDj">
                  最低价
                </div>
                <div class="plKyDay">
                  <img src="@/assets/img/sdIcon.png" alt="">
                  <p>最快到达 | 预计2天到达</p>
                </div>
                <div class="plKyTop">
                  <div class="plKyMoney">
                    <p>总成本</p>
                    <h2>
                      <span>￥</span>
                      16.5
                    </h2>
                  </div>
                  <div class="plKyStatus">
                    Mini小件
                  </div>
                </div>
                <div class="plKyBot">
                  <img src="@/assets/img/a@2x.png" alt="">
                  <div class="plKyRig">
                    <h2>安能物流</h2>
                    <p>安徽省亳州市</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { ref, reactive } from 'vue'
  import a from '@/assets/img/a@2x.png';
  import b from '@/assets/img/b@2x.png';
  import c from '@/assets/img/c@2x.png';
  import d from '@/assets/img/d@2x.png';
  import e from '@/assets/img/e@2x.png';
  import f from '@/assets/img/f@2x.png';
  import g from '@/assets/img/g@2x.png';

  const input = ref('')
  const txt = ref('')
  const titFlag = ref(false)
  let checkList = ref([])
  const tabsIndex = ref(2)
  const listIndex = ref(2)
  const tableData = reactive([{
    address: '安徽省亳州市谯城区星光大厦1802室',
    num: '59.8',
  },{
    address: '安徽省亳州市谯城区星光大厦1802室',
    num: '59.8',
  },{
    address: '安徽省亳州市谯城区星光大厦1802室',
    num: '59.8',
  },{
    address: '安徽省亳州市谯城区星光大厦1802室',
    num: '59.8',
  }])
  const arrImg = reactive([{
    name: '十九里镇一部',
    imgUrl: a,
  },{
    name: '太安堂二部',
    imgUrl: b,
  },{
    name: '中通快运十盒站',
    imgUrl: c,
  },{
    name: '壹米滴答康美站',
    imgUrl: d,
  },{
    name: '太安堂二部',
    imgUrl: e,
  },{
    name: '快运十盒站',
    imgUrl: f,
  },{
    name: '康美站康美站康美站',
    imgUrl: g,
  },])
  
  function priBtns(e) {
    checkList.value = e
    console.log(checkList.value,66666)
  }
  function priBtn(index:number) {
    if(checkList.value.includes(index)){
      checkList.value.splice(checkList.value.indexOf(index),1)
    }else{
      checkList.value.push(index)
    }
    console.log(checkList,7777)
  }

</script>

<style scoped lang='scss'>
  .priceBox{
    padding-bottom: 26px;
    .priceTop{
      height: 641px;
      background: url('@/assets/img/bjBg.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      overflow: hidden;
      
      .priceTit{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
      .priceTitCont{
        margin-top: 11px;
        display: none;
        &::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner{
            border-color: #FF5411; /* 例如，设置为红色 */
            background: #FF5411;
        }

        .priceTitItem{
          background: #fff;
          height: 35px;
          display: flex;
          align-items: center;
          padding: 0 21px 0 16px;
          cursor: pointer;
          &:hover{
            background: #FFF6F3;
          }
          img{
            width: 22px;
            height: 22px;
            border-radius: 50%;
            margin-right: 4px;
          }
          p{
            font-size: 14px;
            color: #666666;
            flex: 1;
          }
        }
        .priceTitItem1{
          p{
            color: #FF5411;
          }
        }
      }
      .priceTits{
        display: flex;
        height: 55px;
        background: #FFFFFF;
        border-radius: 12px 0px 24px 0px;
        border: 1px solid #FFFFFF;
        align-items: center;
        padding: 0 21px 0 19px;
        font-size: 14px;
        color: #333333;
        cursor: pointer;
        .xlIcon{
          width: 10px;
          transition: 0.5s;
        }
        .icon{
          width: 17px;
          height: 15px;
          margin-right: 4px;
        }
        .priImgs{
          padding: 0 12px 0 9px;
          display: flex;
          p{
            flex: 1;
          }
          img{
            width: 32px;
            height: 32px;
            box-sizing: border-box;
            border: 3px solid #fff;
            border-radius: 50%;
            position: relative;
          }
          .priDy{
            width: 32px;
            height: 32px;
            background: #FFE8DF;
            border-radius: 50%;
            border: 3px solid #FFFFFF;
            color: #FF5411;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            margin-left: -10px;
            position: relative;
            z-index: 1;
          }
        }
      }
      .priceTit1{
        background: #fcfcfc;
        .xlIcon{
          transform: rotate(180deg);
        }
        .priceTitCont{
          display: block;
        }
      }
      .priTab{
        margin: 40px auto 30px;
        width: 120px;
        height: 31px;
        background: #FFFFFF;
        box-shadow: 0px 3px 8px 0px rgba(3,0,0,0.05);
        border-radius: 16px;
        font-size: 14px;
        color: #666666;
        display: flex;
        cursor: pointer;
        .priTabBtn{
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .priTabBtns{
          background: linear-gradient(90deg, #FF5B2E, #FF8969);
          box-shadow: 0px 2px 5px 0px rgba(255,92,47,0.25);
          color: #FFFFFF;
          border-radius: 16px;
        }
      }
      .priPlFrom{
        width: 710px;
        margin: 0 auto;
        &::v-deep .el-textarea__inner{
          background: #FFFFFF;
          box-shadow: 0px 2px 15px 0px rgba(3,0,0,0.08);
          border-radius: 8px;
          border: 1px solid #FFFFFF;
        }
        p{
          font-size: 14px;
          color: #333333;
          padding-left: 1px;
          margin-bottom: 11px;
        }
        .priPlTable{
          padding: 14px 20px;
          background: rgba(255,255,255,0.7);
          box-shadow: 0px 2px 15px 0px rgba(3,0,0,0.08);
          border-radius: 8px;
          border: 1px solid #FFFFFF;
        }
      }
      .priFroms{
        display: flex;
        justify-content: center;
        p{
          font-size: 14px;
          color: #333333;
          padding-left: 1px;
          margin-bottom: 11px;
        }
        .inClass{
            background: #FFFFFF;
            box-shadow: 0px 2px 15px 0px rgba(3,0,0,0.08);
            border-radius: 8px;
            border: 1px solid #FFFFFF;
            height: 50px;
            &::v-deep .el-input__wrapper,.el-input__wrapper .is-focus{
              box-shadow: none;
            }
          }
        .priLef{
          margin-right: 10px;
        }
      }
      .priBtn{
          margin: 20px auto 0;
          width: 228px;
          height: 51px;
          background: linear-gradient(90deg, #FF5B2E, #FF8969);
          box-shadow: 0px 2px 5px 0px rgba(255,92,47,0.25);
          border-radius: 6px;
          font-weight: bold;
          font-size: 18px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          img{
            width: 13px;
            margin-left: 10px;
          }
        }
    }
    .priceBot{
      background: #FFFFFF;
      box-shadow: 0px 3px 15px 0px rgba(145,145,145,0.15);
      border-radius: 12px;
      position: relative;
      min-height: 429px;
      .plList{
        padding: 8px 0;
        .plItem{
          padding: 0 30px 10px;
          border-bottom: 1px solid #EDEDED;
          .plTit{
            height: 56px;
            display: flex;
            align-items: center;
            .plDz{
              padding: 0 6px;
              line-height: 17px;
              height: 17px;
              background: #EFEFEF;
              border-radius: 3px;
              font-size: 12px;
              color: #666666;
              margin-right: 6px;
            }
            p{
              font-weight: bold;
              font-size: 14px;
              color: #333333;
              span{
                margin-left: 10px;
                padding-left: 10px;
                position: relative;
                &::before{
                  content: "";
                  position: absolute;
                  width: 1px;
                  height: 11px;
                  background: #DBDBDB;
                  left: 0;
                  top: 50%;
                  transform: translateY(-50%);
                }
              }
            }
          }
          .plKys{
            display: flex;
            flex-wrap: wrap;
            .plKyItem{
              width: calc((100% - 60px) / 7);
              margin-right: 10px;
              margin-bottom: 10px;
              padding: 17px 16px;
              background: #FFFFFF;
              box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.08);
              border-radius: 10px;
              border: 1px solid #EDEDED;
              position: relative;
              &:nth-of-type(7n){
                margin-right: 0;
              }
              .plKyDj{
                position: absolute;
                top: 0;
                left: 0;
                width: 52px;
                height: 19px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                color: #FFFFFF;
                background: #FF5E31;
                border-radius: 10px 0px 10px 0px;
              }
              .plKyDay{
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(#28A745,.12);
                color: #28A745;
                display: flex;
                height: 20px;
                font-size: 12px;
                align-items: center;
                border-radius: 10px 10px 0px 0px;
                width: 150px;
                justify-content: center;
                box-sizing: border-box;
                img{
                  width: 9px;
                  height: 12px;
                  margin-right: 2px;
                }
              }
              .plKyBot{
                display: flex;
                align-items: center;
                margin: 12px 0;
                img{
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  margin-right: 6px;
                }
                .plKyRig{
                  font-size: 14px;
                  h2{
                    font-weight: bold;
                    color: #000000;
                    margin-bottom: 3px;
                  }
                  p{
                    color: #666666;
                  }
                }
              }
              .plKyTop{
                padding-bottom: 12px;
                border-bottom: 1px solid #EDEDED;
                display: flex;
                justify-content: space-between;
                .plKyStatus{
                  height: 20px;
                  padding: 0 5px 0 8px;
                  line-height: 20px;
                  font-size: 12px;
                  color: #666666;
                  background: #F4F4F4;
                  border-radius: 2px;
                }
                .plKyMoney{
                  padding: 8px 0 0 10px;
                  p{
                    font-size: 14px;
                    color: #666666;
                    margin-bottom: 4px;
                  }
                  h2{
                    color: #222222;
                    font-size: 20px;
                    font-weight: bold;
                    margin-left: -2px;
                    
                    span{
                      font-size: 14px;
                      margin-right: -6px;
                    }
                  }
                }
              }
            }
          }
        }

      }
      .dgBox{
        padding: 53px 50px;
        display: flex;
        flex-wrap: wrap;
      }
      .expreDeliverItem{
        display: flex;
        width: calc((100% - 40px) / 3);
        height: 90px;
        background: #FFFFFF;
        box-shadow: 0px 3px 15px 0px rgba(0,0,0,0.08);
        border-radius: 10px;
        margin-right: 20px;
        margin-bottom: 20px;
        position: relative;
        padding: 21px 20px 20px 21px;
        align-items: center;
        &:nth-of-type(3n){
          margin-right: 0;
        }
        .experRig{
          .experRigBtn{
            cursor: pointer;
            width: 70px;
            height: 30px;
            background: linear-gradient(90deg, #FF5B2E, #FF8969);
            box-shadow: 0px 2px 5px 0px rgba(255,92,47,0.25);
            border-radius: 3px;
            font-size: 14px;
            color: #FFFFFF;
            text-align: center;
            line-height: 30px;
            position: relative;
            z-index: 1;
          }
          p{
            font-size: 14px;
            color: #666666;
            margin-top: 26px;
            i{
              font-weight: bold;
              color: #222222;
            }
            span{
              font-weight: bold;
              font-size: 22px;
              color: #222222;
            }
          }
        }
        .experStatusBox{
          position: absolute;
          right: 11px;
          top: 0;
          display: flex;
          img{
            width: 60px;
            height: 39px;
            margin-left: 10px;
          }
        }
        .experImg{
          width: 50px;
          height: 50px;
          background: #000000;
          border-radius: 10px;
          margin-right: 10px;
        }
        .experInfo{
          flex: 1;
          .experInfoTit{
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 14px;
            color: #222222;
            margin-bottom: 9px;
            span{
              margin-right: 7px;
            }
            .experInfoStatus{
              padding: 5px 5px 4px 6px;
              border-radius: 2px;
              font-size: 12px;
              color: #FF5411;
              background: rgba(#FF5411,.12);
              margin-right: 5px;
            }
            .experInfoStatus1{
              color: #28A745;
              background: rgba(#28A745,.12);

            }
          }
          .experInfoTip{
            font-size: 14px;
            color: #666666;
          }
        }
      }
    }
  }
</style>