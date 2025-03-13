<template>
  <div class="priceBox">
    <div class="priceTop">
      <div class="priceTit" :class="{'priceTit1':titFlag}" @click="titFlag = !titFlag">
        <div class="priceTits hoverOpic">
          <img src="@/assets/img/szIcon.png" alt="" class="icon">
          <p>选择开单系统：</p>
          <div class="priImgs">
              <img :src="imgTypeFn(expreList.onlineExpreList[checkList[item]].logisticsType)" v-for="item,index in checkList.slice(0,5)" :style="{'marginLeft': `-10px`}" :key="index" alt="">
              <div class="priDy" v-if="checkList.length>5">
                +{{ checkList.length - 5 }}
              </div>
              <p v-if="checkList.length==0">
                暂未选择系统
              </p>
          </div>
          <img src="@/assets/img/iconX.png" alt="" class="xlIcon">
        </div>
        <div class="priceTitCont" @click.stop="" v-if="titFlag" v-click-away="titFns">
          <el-checkbox-group v-model="checkList">
            <div class="priceTitItem" :class="{'priceTitItem1': checkList.includes(index)}" @click="priBtn(index)" v-for="item,index in expreList.onlineExpreList" :key="index">
              <img :src="imgTypeFn(item.logisticsType)" alt="">
              <p>{{item.name}}</p>
              <el-checkbox :value="index" @click.stop=""/>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="priTab">
        <div class="priTabBtn hoverOpic" @click="tabsIndex=1" :class="{'priTabBtns': tabsIndex==1}">
          单个
        </div>
        <div class="priTabBtn hoverOpic" @click="tabsIndex=2" :class="{'priTabBtns': tabsIndex==2}">
          批量
        </div>
      </div>
      <div class="priFroms" v-show="tabsIndex==1">
        <div class="priLef">
          <p>收件地址</p>
          <el-input
            v-model="infos"
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
            v-model="weights"
            style="width: 150px;"
            placeholder="请输入"
            clearable
          />
        </div>
      </div>
      <div v-show="tabsIndex==2">
        <div class="priPlFrom">
          <p>智能解析</p>
          <div class="priPlBoxs">
            <el-input
              v-model="txt"
              maxlength="2000"
              style="width: 710px;"
              rows="5"
              placeholder="请输入收件地址和结算重量，如：安徽省亳州市谯城区万达B座写字楼1602室20.5"
              resize="none"
              type="textarea"
            />
            <div class="priPlBtn hoverOpic" @click="priInput">
              智能解析
            </div>
          </div>
          <div class="priPlTable" v-if="priFlag">
            <el-table :data="tableData" style="width: 100%;height: 100%;" @row-click="rowBtn">
              <el-table-column prop="address" label="收件地址">
                <template #default="scope">
                  <div v-if="!scope.row.flags">
                    {{ scope.row.address }}
                  </div>
                  <div v-else>
                    <el-input v-model="scope.row.address" placeholder="请输入地址（Kg）" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="结算重量（Kg）">
                <template #default="scope">
                  <div v-if="!scope.row.flags">
                    {{ scope.row.num }}
                  </div>
                  <div v-else>
                    <el-input v-model="scope.row.num" placeholder="请输入重量（Kg）"/>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="priBtn hoverOpic" v-loading.fullscreen.lock="fullscreenLoading" @click="priceCompBtn">
        比价
        <img src="@/assets/img/btns.png" alt="" class="prizIcon">
      </div>
    </div>
    <div class="priceBot" :style="{'marginTop': tabsIndex==1 || !priFlag?'-315px':'-44px'}">
      <div v-if="tabsIndex==1" class="dgBox">
        <template v-if="priceData1.length">
          <div class="expreDeliverItem" v-for="item,index in priceData1[0]?.data" :key="index">
            <div class="expreZbox" v-if="item.priceType=='比价异常'">
              <img src="@/assets/img/gtan.png" alt="">
              {{ item.remark }}
            </div>
            <div class="experImg">
              <img :src="imgTypeFn(item.type)" alt="">
            </div>
            <div class="experInfo">
              <div class="experInfoTit">
                <!-- <span>{{item.type}}物流</span> -->
                <div class="experInfoStatus">
                  {{item.priceType}}
                </div>
                <!-- <div class="experInfoStatus experInfoStatus1">
                  预计2天到达
                </div> -->
              </div>
              <div class="experInfoTip">
                <span>{{item.name}}</span>
              </div>
            </div>
            <div class="experRig">
              <!-- <div class="experRigBtn" v-if="listIndex==item">
                去录单
              </div> -->
              <p>
                总成本
                <i>￥</i>
                <span>{{item.price}}</span>
              </p>
            </div>
            <div class="experStatusBox">
              <!-- <div class="experStatus">
                <img src="@/assets/img/zkdda.png" alt="">
              </div> -->
              <div class="experStatus" v-if="index==0">
                <img src="@/assets/img/zdjia.png" alt="">
              </div>
            </div>
          </div>
        </template>
        <div v-else class="priceCont">
          <el-empty description="暂无比价"></el-empty>
        </div>
      </div>
      <div v-if="tabsIndex==2">
        <div class="plList" :style="{'height': !priFlag?'calc(100vh - 430px)':''}">
          <template v-if="priceData2.length">
            <div class="plItem" v-for="item,index in priceData2" :key="index">
              <div class="plTit">
                <div class="plDz">
                  地址{{ index + 1 }}
                </div>
                <p>{{item.name}}<span>{{item.weight}}Kg</span></p>
              </div>
              <div class="plKys">
                <div class="plKyItem" v-for="i,s in item.data" :key="s">
                  <div class="expreZbox" v-if="i.priceType=='比价异常'">
                    <img src="@/assets/img/gtan.png" alt="">
                    {{ i.remark }}
                  </div>
                  <div class="plKyDj" v-if="s==0">
                    最低价
                  </div>
                  <!-- <div class="plKyDay">
                    <img src="@/assets/img/sdIcon.png" alt="">
                    <p>最快到达 | 预计2天到达</p>
                  </div> -->
                  <div class="plKyTop">
                    <div class="plKyMoney">
                      <p>总成本</p>
                      <h2>
                        <span>￥</span>
                        {{i.price}}
                      </h2>
                    </div>
                    <!-- <div class="plKyStatus">
                      {{i.priceType}}
                    </div> -->
                  </div>
                  <div class="plKyBot">
                    <img :src="imgTypeFn(i.type)" alt="">
                    <div class="plKyRig">
                      <span>{{i.priceType}}</span>
                      <p>{{i.name}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="priceCont">
            <el-empty description="暂无比价"></el-empty>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { ref, reactive } from 'vue'
  import { useExpreListStore } from '@/store/store'
  import service  from '@/utils/http.ts';
  import { ElMessage } from 'element-plus'
  const expreList = useExpreListStore()
  const infos = ref('')
  const weights = ref('')
  const priceData1 = ref([])
  const priceData2 = ref([])
  const txt = ref('')
  const titFlag = ref(false)
  const priFlag = ref(true)
  function titFns() {
    titFlag.value=false
  }
  let checkList = ref([])
  const tabsIndex = ref(1)
  const fullscreenLoading = ref(false)
  
  const tableData = ref([{
          info: '',
          weight: '',
          flags: true,
        }])
  function rowBtn(e) {
    console.log(e,444)
    e.flags = true
  }
  function priceCompBtn() {
    console.log(infos.value,weights.value,7777,checkList.value,)
    if(!checkList.value.length){
        ElMessage({
            message: '请选择开单系统~',
            type: 'warning',
            plain: true,
        })
        return
    }
    if(tabsIndex.value == 1){
      if(!infos.value){
        ElMessage({
            message: '请输入地址~',
            type: 'warning',
            plain: true,
        })
        return
    }
    if(!weights.value){
        ElMessage({
            message: '请输入结算重量~',
            type: 'warning',
            plain: true,
        })
        return
      }
      let selectedSites = checkList.value.map(item => {
        return expreList.onlineExpreList[item].account
      })
      fullscreenLoading.value = true
      service.post('intelligentCompare',{
        selectedSites,
        parsedResults:[{
          info: infos.value,
          weight: weights.value,
        }]
      }).then(res=> {
        fullscreenLoading.value = false
        priceData1.value = res.data
        console.log(res,9999)
      })
    }else{
      if(!priFlag.value){
        ElMessage({
            message: '请智能解析地址后，比价哦~',
            type: 'warning',
            plain: true,
        })
        return
      }
      if(!tableData.value.length){
        ElMessage({
            message: '请智能解析地址后，比价哦~',
            type: 'warning',
            plain: true,
        })
        return
      }
      let is = 0
      tableData.value.forEach(item => {
        console.log(typeof item.num)
        if(!item.address || item.num == 0){
          is = 1
        }
      })
      if(is) {
        ElMessage({
            message: '地址或重量不能为空哦，请填写后查询',
            type: 'warning',
            plain: true,
        })
        return
      }
      let selectedSites = checkList.value.map(item => {
        return expreList.onlineExpreList[item].account
      })
      let parsedResults = tableData.value.map(item => {
        return {
          info: item.address,
          weight: item.num,
        }
      })
      fullscreenLoading.value = true
      service.post('intelligentCompare',{
        selectedSites,
        parsedResults,
      }).then(res=> {
        fullscreenLoading.value = false
        if(res.code ==200){
          priFlag.value = false
          tableData.value = []
          priceData2.value = res.data
        }
      })
    }
  }
  function priInput() {
    if(txt.value!=''){
      fullscreenLoading.value = true
      setTimeout(() => {
        fullscreenLoading.value = false
      },500)
    }
    console.log(txt.value.split('\n'),9999)
    let adreArr = []
    if(txt.value){
      adreArr = txt.value.split('\n').map(item => {
        return {
          address: item.replace(getLastNumber(item),''),
          num: getLastNumber(item),
          flags: false,
        }
      }).filter(item => {
        return item.address != ''
      })
    }
    console.log(adreArr,2222222)
    tableData.value = adreArr
    priFlag.value = true
  }
  function getLastNumber(str) {
    const match = str.match(/(\d+\.?\d*)$/);
    return match?match[0]:'' // 如果找到数字，返回整数；否则返回null
  }
 
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
.priceCont{
  display: flex;
  width: 100%;
  justify-content: center;
}
  .priceBox{
    padding-bottom: 14px;
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
        .priPlBoxs{
          width: 710px;
          padding-right: 90px;
          box-sizing: border-box;
          position: relative;
          .priPlBtn{
            height: 26px;
            background: linear-gradient(90deg, #FF5B2E, #FF8969);
            border-radius: 6px;
            font-size: 14px;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 82px;
            cursor: pointer;
            position: absolute;
            bottom: 10px;
            right: 10px;
          }
        }
        .priPlTable{
          padding: 14px 20px;
          background: rgba(255,255,255,0.7);
          box-shadow: 0px 2px 15px 0px rgba(3,0,0,0.08);
          border-radius: 8px;
          height: 266px;
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
      min-height: 450px;

      .plList{
        padding: 8px 0;
        
        overflow-y: auto;
        box-sizing: border-box;
        .plItem{
          padding: 0 30px 10px;
          border-bottom: 1px solid #EDEDED;
          &:last-of-type{
            border-bottom: none;
          }
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
                  width: 40px;
                  height: 40px;
                  border-radius: 5px;
                  margin-right: 10px;
                }
                .plKyRig{
                  font-size: 14px;
                  flex: 1;
                  span{
                    margin-bottom: 6px;
                    height: 23px;
                    line-height: 23px;
                    padding: 0 8px;
                    background: linear-gradient(90deg, #FF5B2E, #FF8969);
                    box-shadow: 0px 2px 5px 0px rgba(255,92,47,0.25);
                    border-radius: 2px;
                    font-weight: bold;
                    font-size: 14px;
                    color: #FFFFFF;
                    display: inline-block;
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
        min-height: 450px;
        box-sizing: border-box;
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
        position: relative;
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
          margin-right: 10px;
          img{
            width: 50px;
            height: 50px;
            border-radius: 10px;
          }
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
              padding: 0 8px;
              font-size: 14px;
              height: 23px;
              line-height: 23px;
              color: #fff;
              margin-right: 5px;
              background: linear-gradient(90deg, #FF5B2E, #FF8969);
              box-shadow: 0px 2px 5px 0px rgba(255,92,47,0.25);
              border-radius: 2px;
            }
            .experInfoStatus1{
              color: #28A745;
              background: rgba(#28A745,.12);

            }
          }
          .experInfoTip{
            font-size: 14px;
            color: #666666;
            line-height: 1;
          }
        }
      }
    }
  }
  .expreZbox{
    width: 100%;        
    height: 100%;
    background: rgba(#fff,.95);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 14px;
    z-index: 99;
    img{
      width: 15px;
      height: 15px;
      margin-right: 6px;
    }
  }
</style>