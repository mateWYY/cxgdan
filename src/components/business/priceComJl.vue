<template>
    <div class="queryBox" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="documCont">
        <div class="documTit">
            比价历史记录
        </div>
      </div>
      <div class="sxBox">
        <div class="sxTox">
            <el-form ref="ruleFormRef" :model="forms" label-width="auto">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="比价地址：">
                            <el-input clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="比价时间段：" prop="latestSignTimes">
                            <el-date-picker
                                value-format="YYYY-MM-DD HH:mm:ss"
                                v-model="forms.latestSignTimes"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <div class="sxBtns">
                            <div class="sxBtn sxBtn1 hoverOpic" @click="cxFn">查询</div>
                            <div class="sxBtn hoverOpic" @click="czBtn(ruleFormRef)">重置</div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
      </div>
      <el-table
          :data="tableData"
          :style="{'width': '100%','height': 'calc(100% - 227px)'}"
          ref="multipleTableRef"
      >
          <!-- <el-table-column type="selection" :selectable="selectable" width="55" /> -->
          <template #empty>
            <el-empty description="暂无信息"></el-empty>
          </template>
          <el-table-column label="运单号" width="230" >
              <template #default="{row}">
                  <div class="adrBox">
                        <span>{{ row.waybillNumber }}</span>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="status" label="物流动态" width="370">
              <template #default="scope">
                  <div class="tableStatus">
                        <div class="tableStatusLef">
                            <div class="tableBtn tableBtn2" v-if="scope.row.logisticsStatus=='正常转运'">
                                正常
                            </div>
                            <div class="tableBtn tableBtn3" v-else-if="scope.row.logisticsStatus=='无效订单'||scope.row.logisticsStatus=='派送延误'||scope.row.logisticsStatus=='超时未到'||scope.row.logisticsStatus=='分拨滞留'||scope.row.logisticsStatus=='分批配载'||scope.row.logisticsStatus=='开单未发'">
                                {{scope.row.logisticsStatus}}
                            </div>
                            <div class="tableBtn tableBtn4" v-else-if="scope.row.logisticsStatus=='已签收'">
                                {{scope.row.logisticsStatus}}
                            </div>
                            <template v-else>
                                <div class="tableBtn tableBtn1" v-if="scope.row.logisticsStatus">
                                    {{ scope.row.logisticsStatus }}
                                </div>
                            </template>
                        </div>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="amount1" label="寄件网点" width="220">
              <template #default="scope">
                  <div class="tabelWls">
                      <img :src="imgTypeFn(scope.row.logisticsType)" alt="">
                      <span>{{scope.row.sendingSite}}</span>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="latestSignTimeStr" label="最晚签收时间"  width="260"/>
          <el-table-column prop="deliveryMethod" label="送货方式"  width="120"/>
          <el-table-column prop="hasIssue" label="问题件"  width="120">
            <template #default="scope">
                <el-tooltip
                    v-if="scope.row.hasIssue"
                    class="box-item"
                    effect="dark"
                    :content="scope.row.issueInfo"
                    placement="right"
                >
                    <div class="documBox">
                        有
                    </div>
                </el-tooltip>
                <div class="documBox1" v-else>
                    无
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="senderName" label="寄件人"  width="120"/>
      </el-table>
      <div class="sxFot" v-if="tableData.length">
          <el-pagination
              v-model:current-page="sendData.page"
              v-model:page-size="sendData.pageSize"
              :size="size"
              :disabled="disabled"
              :background="background"
              layout="prev, pager, next, jumper, sizes"
              :total="tatals"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
      </div>
      <popLogistics v-if="popFlag" ref="popis" :wldtInData="wldtInData" @gbBtns="gbBtns"></popLogistics>
    </div>
  </template>
  
  <script setup lang='ts'>
      import { ref, watch } from 'vue';
      import popLogistics from '@/components/general/popLogistics.vue';
      import service  from '@/utils/http.ts';
      import { ElMessage, ElMessageBox } from 'element-plus'
      import { useExpreListStore } from '@/store/store'
      import { dataBox } from 'js-tool-big-box';
      const expreList = useExpreListStore()
      let zkFlag = ref(false)
  
      let fullscreenLoading = ref(false)
      let logisticsStatus = ref('')
      let ydStatus = ref('')
      let forms = ref({
        waybillNumber: '',
        latestSignTimes: [],
        recipientName: '',
        senderName: '',
        sendingSite: '',
      })
      let sendData = ref({
        page: 1,
        pageSize: 10,
      })
      let tatals = ref(0)
      let ruleFormRef = ref() 
      let tableData = ref([])
      let checkList = ref([])
      // 重置
      function czBtn(ruleFormRef) {
        forms.value.waybillNumber = ''
        sendData.value.page = 1
        ruleFormRef.resetFields();
      }
      // 查询
      function cxFn() {
        sendData.value.page = 1
        getGendanList()
      }
      // 收件人 寄件人 列表
      let jproList = ref([])
      let sproList = ref([])
      function getPre() {
        service.get('/getSenderName').then(res => {
            if(res.code == 200){
                console.log(res)
                jproList.value = res.senderNames
                sproList.value = res.recipientName
            }
        })
      }
      getPre()
      // 跟单列表
      function getGendanList(names) {
        console.log(forms.value,7778888)
        console.log(ydStatus.value,666666)
        console.log(logisticsStatus.value,555555)
        let specialAttention = ''
        let logisticsStatuss = ''
        if(typeof names == 'string'){
            logisticsStatus.value = names
            ydStatus.value = ''
            logisticsStatuss = names
        }else{
            logisticsStatus.value = ''
            if(ydStatus.value == '特别关注'){
                logisticsStatuss = ''
                specialAttention = '1'
            }else if(ydStatus.value == '正常转运中'){
                logisticsStatuss = '正常转运'
            }else if(ydStatus.value == '正常签收'){
                logisticsStatuss = '已签收'
            }else{
                logisticsStatuss = ydStatus.value
            }
        }
        let {latestSignTimes,...formDatas} = forms.value
        let startDateStr = ''
        let endDateStr = ''
        if(latestSignTimes){
            startDateStr = latestSignTimes[0]
            endDateStr = latestSignTimes[1]
        }else{
            startDateStr = ''
            endDateStr = ''
        }
        fullscreenLoading.value = true
        service.get('/getSendingPackageOrderWithFilters', {
            params: {
                specialAttention,
                logisticsStatus: logisticsStatuss,
                startDateStr,
                endDateStr,
                ...formDatas,
                ...sendData.value,
            }
        }).then(res => {
            fullscreenLoading.value = false
            zkFlag.value = false
            if(res.code == 200){
                // logisticsStatus.value = ''
                console.log(res)
                tatals.value = res.totalElements
                res.data.forEach(item => {
                    item.checkFlag = false
                })
                tableData.value = res.data
                qxChecks.value.qxCheckVal = false
                qxChecks.value.qxCheckIntVal = false
            }
        })
      }
      getGendanList()
      let ycydData = ref({})
      // 异常运单数据
      function getYcydFn() {
        service.get('/getLogisticsTypeCounts').then(res => {
            if(res.code == 200){
                console.log(res)
                ycydData.value = res.data
            }
        })
      }
      getYcydFn()
      // 弹窗
      let wldtInData = ref({})
      let popis = ref(null)
      let popFlag = ref(false)
      function gbBtns(val) {
        popFlag.value = val
      }
      const size = ref('default')
      const background = ref(false)
      const disabled = ref(false)
      const handleSizeChange = (val: number) => {
          console.log(`${sendData.value.pageSize} items per page`)
          getGendanList()
      }
      const handleCurrentChange = (val: number) => {
          console.log(`current page: ${sendData.value.page}`)
          getGendanList()
      }
      let qxChecks = ref({
          qxCheckVal: false,
          qxCheckIntVal: false,
      })
  </script>
  
  <style scoped lang='scss'>
  
  .adrBox{
    display: flex;
    align-items: center;
  }
  ::v-deep .el-select-dropdown__item.is-selected{
      color: #FF5411;
    }
      .queryBox{
          background: #FFFFFF;
          box-shadow: 0px 3px 15px 0px rgba(145,145,145,0.15);
          border-radius: 12px;
          padding: 13px 20px 0;
          min-width: 1250px;
          height: calc(100vh - 104px);
          box-sizing: border-box;
          .sxFot{
              display: flex;
              align-items: center;
              height: 60px;
              justify-content: end;
          }
          .documCont{
            margin-bottom: 8px;
            .documTit{
                font-weight: bold;
                font-size: 18px;
                color: #222222;
                margin-bottom: 17px;
                height: 38px;
                line-height: 38px;
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
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              .sxTox{
                flex: 1;
                height: 73px;
              }
              .sxTj{
                display: flex;
                padding: 10px 10px 10px;
                position: relative;
                left: -10px;
                
                  ::v-deep .el-form-item{
                      margin-bottom: 0;
                  }
                  .sxLeft{

                  }
                  .sxRight{
                    flex: 1;
                  }
              }
              .sxTj1{
                z-index: 999;
                background: #FFFFFF;
                box-shadow: 2px 3px 15px 0px rgba(51,52,52,0.2);
                border-radius: 6px;
              }
              .sxZK{
                display: flex;
                height: 73px;
                align-items: center;
                font-size: 14px;
                color: #999999;
                cursor: pointer;
                margin-right: 26px;
                img{
                    width: 11px;
                    height: 11px;
                    margin-right: 4px;
                }

              }
              .sxBtns{
                    align-items: center;
                  display: flex;
                  justify-content: end;
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
          justify-content: space-between;
          .tableStatusLef{
            display: flex;
            align-items: center;
            flex: 1;
          }
          .tableStatusLef1{
            justify-content: center;
          }
            .tableConts{
                width: 264px;
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
              padding: 0 6px;
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
              margin-left: 10px;
          }
          .tableBtn3{
              background: rgba(#FD7E14, .2);
              color: #FD7E14;
          }
          .tableBtn4{
              background: rgba(#3B7DDD, .2);
              color: #3B7DDD;
              margin-left: 4px;
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
      .documBox1{
        width: 25px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #999999;
      }
    
  </style>