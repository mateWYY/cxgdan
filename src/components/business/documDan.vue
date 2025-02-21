

<template>
    <div class="queryBox">
      <div class="querTit">
            异常运单数据
      </div>
      <div class="querTop">
        <div class="querItem">
            <img src="@/assets/img/zu1.png" class="img1" alt="">
            <div class="querRig">
                <p>应发未发</p>
                <h2>26</h2>
            </div>
        </div>
        <div class="querItem">
            <img src="@/assets/img/zu2.png" class="img2" alt="">
            <div class="querRig">
                <div class="querP">
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="货物分成多个批次进行装载和运输"
                        placement="bottom"
                    >
                        <img src="@/assets/img/tips.png" alt="">
                    </el-tooltip>
                    <p>分批配载</p>
                </div>
                <h2>12</h2>
            </div>
        </div>
        <div class="querItem">
            <img src="@/assets/img/zu3.png" class="img3" alt="">
            <div class="querRig">
                <p>分拨滞留</p>
                <h2>8</h2>
            </div>
        </div>
        <div class="querItem">
            <img src="@/assets/img/zu4.png" class="img4" alt="">
            <div class="querRig">
                <p>超时未到</p>
                <h2>32</h2>
            </div>
        </div>
        <div class="querItem">
            <img src="@/assets/img/zu5.png" class="img5" alt="">
            <div class="querRig">
                <p>超时未送</p>
                <h2>3</h2>
            </div>
        </div>
        <div class="querItem">
            <img src="@/assets/img/zu6.png" class="img6" alt="">
            <div class="querRig">
                <p>异常签收</p>
                <h2>0</h2>
            </div>
        </div>
      </div>
      <div class="documCont">
        <div class="documTit">
            实时运单数据
        </div>
        <div class="documPot">
            <div class="documPotItem" :class="{'documPotItemActive': documFlag==0}" @click="documFlag = 0">
                全部
            </div>
            <div class="documPotItem" :class="{'documPotItemActive': documFlag==1}" @click="documFlag = 1">
                正常转运中
            </div>
            <div class="documPotItem" :class="{'documPotItemActive': documFlag==2}" @click="documFlag = 2">
                正常签收
            </div>
            <div class="documPotItem" :class="{'documPotItemActive': documFlag==3}" @click="documFlag = 3">
                异常单
            </div>
            <div class="documPotItem" :class="{'documPotItemActive': documFlag==4}" @click="documFlag = 4">
                特别关注
            </div>
        </div>
      </div>
      <div class="sxBox">
          <div class="sxTj">
              <div class="sxLeft">
                <el-input
                    v-model="text1"
                    style="width: 260px;height: 72px;"
                    :rows="3"
                    type="textarea"
                    resize="none"
                    placeholder="输入单号进行查询
换行可输入多个单号批量查询"
                />
              </div>
              <div class="sxRight">
                <el-form :model="forms" label-width="auto" style="max-width: 100%;padding: 0 20px;">
                    <el-row style="margin-bottom: 8px;">
                        <el-col :span="8">
                            <el-form-item label="最晚签收时间：">
                                <el-date-picker
                                v-model="forms.date1"
                                type="date"
                                placeholder="请选择"
                                style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="寄件网点：">
                                <el-select v-model="forms.region" placeholder="请选择">
                                    <el-option label="Zone one" value="shanghai" />
                                    <el-option label="Zone two" value="beijing" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="寄件人：">
                                <el-select v-model="forms.region" placeholder="请选择">
                                    <el-option label="Zone one" value="shanghai" />
                                    <el-option label="Zone two" value="beijing" />
                                </el-select> 
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="收件人：">
                                <el-select v-model="forms.region" placeholder="请选择">
                                    <el-option label="Zone one" value="shanghai" />
                                    <el-option label="Zone two" value="beijing" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物品名称：">
                                <el-input v-model="forms.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注：">
                                <el-input v-model="forms.name" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
              </div>
          </div>
          <div class="sxBtns">
              <div class="sxBtn sxBtn1">查询</div>
              <div class="sxBtn">重置</div>
              <div class="sxBtn">导出</div>
          </div>
      </div>
      <el-table
          :data="tableData"
          v-if="tableData.length"
          style="width: 100%;height: calc(100% - 178px);"
          ref="multipleTableRef"
      >
          <!-- <el-table-column type="selection" :selectable="selectable" width="55" /> -->
          <el-table-column label="运单号" width="230" >
              <template #default="{row}">
                  <div class="adrBox">
                        <el-checkbox :indeterminate="row.fjIndeterFlag" v-model="row.fjCheckFlag" @click.stop="" @change="headFlxChange(row,$event)"/>
                        <span>{{ row.adress }}</span>
                        <img src="@/assets/img/scang1.png" alt="">
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="status" label="物流动态">
              <template #default="scope">
                  <div class="tableStatus">
                      <!-- <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="盲区 (大雪导致路面冰冻，高速封路，末端积压。) "
                          placement="right"
                      >
                          <div class="tableBtn tableBtn1">
                              盲区
                          </div>
                      </el-tooltip> -->
                      <div class="tableBtn tableBtn2">
                          正常
                      </div>
                      <!-- <div class="tableBtn tableBtn3">
                          加收
                      </div>
                      <div class="tableBtn tableBtn4">
                          自提
                      </div> -->
                      <div class="tableConts">
                        <p>最新动态：2024-12-31 16:30:04 【曲靖沾益网点】 已进行【问题】扫描，原因是【客户要求暂放】</p>
                        <div class="tabBtns">
                            <div class="tabBtn tabBtn1" @click="wlBtn">
                                详情
                            </div>
                            <div class="tabBtn">
                                复制最新动态
                            </div>
                        </div>
                      </div>
                      <!-- <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="人工客服确认中，等待片刻刷新查看结果"
                          placement="right"
                      >
                          <div class="tableRgBtn" @click.stop="">
                              <img src="@/assets/img/rgIcon.png" alt="">
                              <p>人工客服确认中</p>
                              <span>刷新</span>
                          </div>
                      </el-tooltip> -->
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="amount1" label="寄件网点" width="260">
              <template #default="scope">
                  <div class="tabelWls">
                      <img src="@/assets/img/a@2x.png" alt="">
                      <span>江西赣州商贸城公司</span>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="amount2" label="最晚签收时间"  width="260"/>
          <el-table-column prop="amount3" label="送货方式"  width="120"/>
          <el-table-column prop="amount4" label="问题件"  width="120">
            <template #default="scope">
                <div class="documBox">
                    {{ scope.row.amount4 }}
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="amount5" label="寄件人"  width="120"/>
      </el-table>
      <div class="sxFot">
        <div class="sxFotLeft">
            <div class="xzbQx">
                <el-checkbox v-model="qxChecks.qxCheckVal" :indeterminate="qxChecks.qxCheckIntVal" @change="qxBtnFn"/>
                <p>
                    选择本页
                </p>
                <img src="@/assets/img/infoIcon.png" alt="">
            </div>
            <div class="xzbLeft">
                <p>已选 0 项</p>
                <div class="xzbBtn xzbBtn1">
                    <img src="@/assets/img/scang.png" alt="">
                    特别关注
                </div>
                <div class="xzbBtn xzbBtn2">
                    <img src="@/assets/img/scang2.png" alt="">
                    取消关注
                </div>
                <div class="xzbBtn">
                    物流加速
                </div>
                <div class="xzbBtn">
                    标记为已签收
                </div>
                <div class="xzbBtn">
                    删除
                </div>
            </div>
        </div>
          <el-pagination
              v-model:current-page="currentPage3"
              v-model:page-size="pageSize3"
              :size="size"
              :disabled="disabled"
              :background="background"
              layout="prev, pager, next, jumper"
              :total="1000"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
      </div>
      <popLogistics ref="popis"></popLogistics>
    </div>
  </template>
  
  <script setup lang='ts'>
      import { ref,reactive } from 'vue';
      import a from '@/assets/img/a@2x.png';
      import b from '@/assets/img/b@2x.png';
      import c from '@/assets/img/c@2x.png';
      import d from '@/assets/img/d@2x.png';
      import e from '@/assets/img/e@2x.png';
      import f from '@/assets/img/f@2x.png';
      import g from '@/assets/img/g@2x.png';
      import popLogistics from '@/components/general/popLogistics.vue';
      const formInline = ref({
          user: '',
          region: '',
          date: '',
      })
      let nums = ref(2)
      let documFlag = ref(0)
      let text1 = ref('')
      let forms = ref({
        name: '',
        region: '',
        date1: '',
        date2: '',
      })
      
      // 弹窗
      let popis = ref(null)
      function wlBtn() {
        popis.value.flag = true
      }

      const currentPage3 = ref(5)
      const pageSize3 = ref(100)
      const size = ref('default')
      const background = ref(false)
      const disabled = ref(false)
      const handleSizeChange = (val: number) => {
          console.log(`${val} items per page`)
      }
      const handleCurrentChange = (val: number) => {
          console.log(`current page: ${val}`)
      }
      let qxChecks = ref({
          qxCheckVal: false,
          qxCheckIntVal: false,
      })
  
      function qxCheckFn() {
          let num = 0
          tableData.value.map(item => {
              if(item.checkFlag){
                  num++
              }
          })
          if(num==0){
              qxChecks.value.qxCheckIntVal = false
              qxChecks.value.qxCheckVal = false
          }else if(num==tableData.value.length){
              qxChecks.value.qxCheckIntVal = false
              qxChecks.value.qxCheckVal = true
          }else{
              qxChecks.value.qxCheckIntVal = true
              qxChecks.value.qxCheckVal = false
          }
      }
      function headFlxChange(item,val) {
          if(item.fjIndeterFlag){
              tableData.value.map(i => {
                  if(item.id == i.id){
                      i.checkFlag = true
                  }
  
              })
          }else{
              if(val){
                  tableData.value.map(i => {
                      if(item.id == i.id){
                          i.checkFlag = true
                      }
                  })
              }else{
                  tableData.value.map(i => {
                      if(item.id == i.id){
                          i.checkFlag = false
                      }
                  })
              }
          }
          qxCheckFn()
      }
    
      let tableData = ref([{
          adress: '879879687685',
          status: 1,
          id:'1',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
          
          
      },{
          adress: '879879687685',
          status: 1,
          id:'1',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          
          checkFlag: false,
          
          
      },{
          adress: '879879687685',
          status: 1,
          id:'2',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
      },{
          adress: '879879687685',
          status: 1,
          id:'2',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
      },{
          adress: '879879687685',
          status: 1,
          id:'3',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
      },{
          adress: '879879687685',
          status: 1,
          id:'3',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
      },{
          adress: '879879687685',
          status: 1,
          id:'4',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
      },{
          adress: '879879687685',
          status: 1,
          id:'4',
          amount1: '1',
          amount2: '2024-05-12 12：53',
          amount3: '自提',
          amount4: '有',
          amount5: '赵若云',
          checkFlag: false,
      }])
      const times = ref('')
      let tabSxs = ref([{
          name: '盲区',
          flag: false
      },{
          name: '加收',
          flag: false
      },{
          name: '自提',
          flag: false
      },{
          name: '人工',
          flag: false
      },])
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
  </script>
  
  <style scoped lang='scss'>
  .adrBox{
    display: flex;
    align-items: center;
    span{
        margin-left: 26px;
    }
    img{
        width: 12px;
        height: 13px;
        margin-left: 6px;
        cursor: pointer;
    }
  }
   ::v-deep .el-select-dropdown__item.is-selected{
      color: #FF5411;
    }
      .queryBox{
          background: #FFFFFF;
          box-shadow: 0px 3px 15px 0px rgba(145,145,145,0.15);
          border-radius: 12px;
          padding: 13px 20px 0;
          height: calc(100vh - 300px);
          box-sizing: border-box;
          .querTit{
              height: 38px;
              line-height: 38px;
              padding: 0 2px;
              font-weight: bold;
              font-size: 18px;
              color: #222222;
          }
          .querTop{
            display: flex;
            margin-bottom: 32px;
            .querItem{
                width: calc((100% - 100px) / 6);
                display: flex;
                align-items: center;
                padding: 0 24px;
                cursor: pointer;
                height: 100px;
                background: linear-gradient(0deg, #FFF4EF, #FFFFFF);
                box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.06);
                border-radius: 3px;
                border: 2px solid #FFFFFF;
                justify-content: space-between;
                margin-right: 20px;
                &:last-of-type{
                    margin-right: 0;
                }
                &:hover{
                    background: #FFFFFF;
                    box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.06);
                    border: 2px solid #FFFFFF;
                }
                .img1{
                    width: 56px;
                    height: 57px;
                }
                .img2{
                    width: 59px;
                    height: 58px;
                }
                .img3{
                    width: 59px;
                    height: 56px;
                }
                .img4{
                    width: 69px;
                    height: 54px;
                }
                .img5{
                    width: 56px;
                    height: 59px;
                }
                .img6{
                    width: 55px;
                    height: 56px;
                }
                .querRig{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    .querP{
                        display: flex;
                        
                        img{
                            width: 12px;
                            height: 12px;
                            margin-right: 5px;
                            margin-top: 2px;
                        }
                    }
                }
                p{
                    font-size: 14px;
                    color: #333333;
                    margin-bottom: 14px;
                }
                h2{
                    font-size: 24px;
                    color: #FF5411;
                    font-weight: bold;
                }
            }
          }
          .sxFot{
              display: flex;
              align-items: center;
              height: 60px;
              justify-content: space-between;
              .sxFotLeft{
                display: flex;
                align-items: center;
              }
              .xzbQx{
                display: flex;
                align-items: center;
                padding-left: 10px;
                cursor: pointer;
                p{
                    color: #999999;
                    font-size: 12px;
                    margin-right: 5px;
                    margin-left: 7px;
                }
                img{
                    width: 9px;
                    margin-right: 20px;
                }
            }
            .xzbLeft{
                display: flex;
                align-items: center;
                font-size: 14px;
                height: 60px;
                color: #666666;
                p{
                    margin-right: 20px;
                }
                .xzbBtn{
                    height: 40px;
                    background: rgba(255,0,0,0);
                    border-radius: 3px;
                    border: 1px solid #DBDBDB;
                    cursor: pointer;
                    font-size: 14px;
                    color: #333333;
                    margin-right: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 18px;
                    img{
                        width: 12px;
                        height: 13px;
                        margin-right: 5px;
                    }
                }
                .xzbBtn1{
                    background: #FF5411;
                    color: #fff;
                }
                .xzbBtn2{
                    background: rgba(255,84,17,0);
                    border-radius: 3px;
                    border: 1px solid #FF5411;
                    color: #FF5411;
                }
            }
          }
          .documCont{
            margin-bottom: 18px;
            .documTit{
                font-weight: bold;
                font-size: 18px;
                color: #222222;
                margin-bottom: 17px;
            }
            .documPot{
                display: flex;
                .documPotItem{
                    font-weight: 400;
                    font-size: 14px;
                    color: #666666;
                    margin-right: 32px;
                    cursor: pointer;
                }
                .documPotItemActive{
                    color: #FF5411;
                    position: relative;
                    &::before{
                        content: "";
                        width: 70%;
                        height: 3px;
                        border-radius: 1px;
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #FF5411;
                    }
                }
            }
          }
          .sxBox{
              height: 68px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
              .sxTj{
                display: flex;
                flex: 1;
                  ::v-deep .el-form-item{
                      margin-bottom: 0;
                  }
                  .sxLeft{

                  }
                  .sxRight{
                    flex: 1;
                  }
              }
              .sxBtns{
                  display: flex;
                  .sxBtn{
                      width: 60px;
                      height: 32px;
                      background: rgba(255,0,0,0);
                      border-radius: 3px;
                      border: 1px solid #DBDBDB;
                      margin-left: 10px;
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 14px;
                      color: #333333;
                  }
                  .sxBtn1{
                      background: #FF5411;
                      border: 1px solid #FF5411;
                      color: #fff;
                  }
              }
          }
      }
      .tableStatus{
          display: flex;
          align-items: center;
            .tableConts{
                flex: 1;
                font-size: 12px;
                color: #666666;
                .tabBtns{
                    display: flex;
                    color: #FF7D5C;
                    .tabBtn{
                        cursor: pointer;
                    }
                    .tabBtn1{
                        margin-right: 19px;
                        position: relative;
                        &::before{
                            content: "";
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            right: -9px;
                            width: 1px;
                            height: 11px;
                            background: #DBDBDB;
                        }
                    }
                }
            }
          .tableBtn{
              width: 45px;
              height: 24px;
              margin-right: 14px;
              width: 45px;
              height: 24px;
              border-radius: 3px;
              text-align: center;
              line-height: 24px;
          }
          .tableBtn1{
              background: rgba(#DC3545, .2);
              color: #DC3545;
              cursor: pointer;
          }
          .tableBtn2{
              background: rgba(#28A745, .2);
              color: #28A745;
          }
          .tableBtn3{
              background: rgba(#FD7E14, .2);
              color: #FD7E14;
          }
          .tableBtn4{
              background: rgba(#3B7DDD, .2);
              color: #3B7DDD;
          }
          .tableRgBtn{
              display: flex;
              height: 24px;
              background: rgba(0,82,217,0);
              border-radius: 3px;
              border: 1px solid #DBDBDB;
              align-items: center;
              padding-left: 7px;
              cursor: pointer;
  
              img{
                  width: 12px;
                  height: 14px;
                  margin-right: 3px;
              }
              p{
                  font-size: 12px;
                  color: #666666;
                  margin-right: 6px;
              }
              span{
                  width: 34px;
                  height: 100%;
                  border-left: 1px solid #DBDBDB;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  color: #FF5411;
              }
          }
      }
      .tabelWls{
          display: flex;
          img{
              width: 28px;
              height: 28px;
              margin-right: 7px;
              border-radius: 50%;
          }
          span{
              font-size: 14px;
              color: #666666;
          }
      }
      .documBox{
        width: 25px;
        height: 24px;
        background: rgba(220,53,69,0.1);
        border-radius: 3px;
        border: 1px solid #DC3545;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #DC3545;
      }
    
  </style>