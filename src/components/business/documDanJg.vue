<template>
    <div class="queryBox" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="documCont">
        <div class="documTit">
            实时运单数据
        </div>
        <div class="documPot">
            <div class="documPotItem hoverOpic" :class="{'documPotItemActive': ydStatus==''}" @click="ydFn('')">
                全部
            </div>
            <div class="documPotItem hoverOpic" :class="{'documPotItemActive': ydStatus=='正常转运中'}" @click="ydFn('正常转运中')">
                正常转运中
            </div>
            <div class="documPotItem hoverOpic" :class="{'documPotItemActive': ydStatus=='正常签收'}" @click="ydFn('正常签收')">
                正常签收
            </div>
            <div class="documPotItem hoverOpic" :class="{'documPotItemActive': ydStatus=='异常单'}" @click="ydFn('异常单')">
                异常单
            </div>
            <div class="documPotItem hoverOpic" :class="{'documPotItemActive': ydStatus=='特别关注'}" @click="ydFn('特别关注')">
                特别关注
            </div>
        </div>
      </div>
      <div class="sxBox">
        <div class="sxTox">
            <div class="sxTj" :class="zkFlag?'sxTj1':''">
              <div class="sxLeft">
                <el-input
                    v-model="forms.waybillNumber"
                    style="width: 260px;height: 72px;"
                    :rows="3"
                    type="textarea"
                    resize="none"
                    placeholder="输入单号进行查询
换行可输入多个单号批量查询"
                />
              </div>
              <div class="sxRight">
                <el-form ref="ruleFormRef" :model="forms" label-width="auto" style="max-width: 100%;padding-left: 20px;">
                    <el-row style="margin-bottom: 8px;">
                        <el-col :span="16">
                            <el-form-item label="最晚签收时间：" prop="latestSignTimes">
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
                        <el-col :span="8">
                            <el-form-item label="寄件网点：" prop="sendingSite">
                                <el-select v-model="forms.sendingSite" placeholder="请选择" clearable>
                                    <el-option :label="item.name" :value="item.name" v-for="(item,index) in expreList.onlineExpreList" :key="index"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :style="{'marginBottom': zkFlag?'8px':''}">
                        <el-col :span="8">
                            <el-form-item label="寄件人：" prop="senderName">
                                
                                <el-select
                                    v-model="forms.senderName"
                                    filterable
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                    v-for="(item,index) in jproList"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="收件人：" prop="recipientName">
                                <el-select
                                    v-model="forms.recipientName"
                                    filterable
                                    placeholder="请选择"
                                    clearable
                                >
                                    <el-option
                                    v-for="(item,index) in sproList"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物品名称：">
                                <el-input clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="zkFlag" style="position: relative;left: -312px;">
                        <el-col :span="8">
                            <el-form-item label="备注：">
                                <el-input clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
              </div>
          </div>
        </div>
        <div class="sxZK hoverOpic" @click="zkFlag=!zkFlag">
        <img src="@/assets/img/zkIcon.png" alt="">
        {{zkFlag?'收起':'展开'}}筛选
        </div>
        <div class="sxBtns">
            <div class="sxBtn sxBtn1 hoverOpic" @click="cxFn">查询</div>
            <div class="sxBtn hoverOpic" @click="czBtn(ruleFormRef)">重置</div>
            <div class="sxBtn hoverOpic" @click="expoBtn">导出</div>
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
                        <el-checkbox :indeterminate="row.fjIndeterFlag" v-model="row.checkFlag" @click.stop="" @change="headFlxChange(row,$event)"/>
                        <span>{{ row.waybillNumber }}</span>
                        <img src="@/assets/img/scang1.png" v-if="row.specialAttention-0" @click="gzBtns(0,row.waybillNumber)" alt="">
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
                      <div class="tableConts" v-if="scope.row.logisticsInfo">
                        <p>最新动态：{{JSON.parse(scope.row.logisticsInfo)[0].scanTime }} {{JSON.parse(scope.row.logisticsInfo)[0].waybillTrace}}</p>
                        <div class="tabBtns">
                            <div class="tabBtn tabBtn1" @click="wlBtn(scope.row)">
                                详情
                            </div>
                            <div class="tabBtn" @click.stop="go1Copy(scope.row)">
                                复制最新动态
                            </div>
                        </div>
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
        <div class="sxFotLeft">
            <div class="xzbQx">
                <el-checkbox v-model="qxChecks.qxCheckVal" :indeterminate="qxChecks.qxCheckIntVal" @change="qxBtnFn"/>
                <p>
                    选择本页
                </p>
                <img src="@/assets/img/infoIcon.png" alt="">
            </div>
            <div class="xzbLeft">
                <p>已选 {{checkList.length}} 项</p>
                <div class="xzbBtn xzbBtn1 hoverOpic" v-if="ydStatus != '特别关注'" @click="gzBtns(1)">
                    <img src="@/assets/img/scang.png" alt="">
                    特别关注
                </div>
                <div class="xzbBtn xzbBtn2 hoverOpic" v-if="ydStatus == '特别关注'" @click="gzBtns(0)">
                    <img src="@/assets/img/scang2.png" alt="">
                    取消关注
                </div>
                <div class="xzbBtn hoverOpic">
                    物流加速
                </div>
                <div class="xzbBtn hoverOpic" @click="yqsBtn">
                    标记为已签收
                </div>
                <div class="xzbBtn hoverOpic" @click="delBtn">
                    删除
                </div>
            </div>
        </div>
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
        import axios from 'axios';
      // 导出
        function expoBtn() {
            let specialAttention = ''
            let logisticsStatuss = ''
            if(logisticsStatus.value){
                ydStatus.value = ''
                logisticsStatuss = logisticsStatus.value
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
            axios({
                url: '/api/exportSendingPackageOrder',
                method: 'GET',
                responseType: 'blob',
                    params: {
                        specialAttention,
                        logisticsStatus: logisticsStatuss,
                        startDateStr,
                        endDateStr,
                        ...formDatas,
                    },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                    fullscreenLoading.value = false
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '跟单数据.xlsx');
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
      // 复制
      const go1Copy = (item)=>{
        const text = `最新动态：${JSON.parse(item.logisticsInfo)[0].scanTime } ${JSON.parse(item.logisticsInfo)[0].waybillTrace}`     
        dataBox.copyText(text, () => {
            ElMessage({           
                type: 'success',          
                message: '复制成功'      
            })  
        }, () => {  
            ElMessage({      
                type: 'error', 
                message: '复制异常，请尝试其他方式复制内容'
            })    
        })
    }
      // 标记已签收
      function yqsBtn(){
        console.log(checkList.value,8888)
        if(!checkList.value.length){
            ElMessage({
                message: '请勾选内容~',
                type: 'warning',
                plain: true,
            })
            return
        }
        fullscreenLoading.value = true
        let datas = JSON.parse(JSON.stringify(checkList.value))
        datas.forEach(item => {
            item.logisticsStatus = '已签收'
        })
        service.post('updateSendingPackageOrder', {
            sendingPackageOrders: datas,
        }).then(res=> {
            fullscreenLoading.value = false
            if(res.code == 200){
                ElMessage({
                    message: `标记成功`,
                    type: 'success',
                    plain: true,
                })
                getGendanList()
            }
        })
      }
      // 删除
      function delBtn(){
        console.log(checkList.value,9999)
        if(!checkList.value.length){
            ElMessage({
                message: '请勾选内容~',
                type: 'warning',
                plain: true,
            })
            return
        }
        ElMessageBox.confirm(
            '是否确认删除已勾选的运单?',
            '提示',
            {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            confirmButtonClass: 'delSty',
            cancelButtonClass: 'qxSty',
            type: 'warning',
            }
        ).then(() => {
                fullscreenLoading.value = true
                service.post('deleteSendingPackageOrder',{
                    sendingPackageOrders: checkList.value,
                }).then(res=> {
                    fullscreenLoading.value = false
                    if(res.code == 200){
                        ElMessage({
                            message: `删除成功`,
                            type: 'success',
                            plain: true,
                        })
                        getGendanList()
                    }
                })
            }).catch(() => {
            
        })
      }
      // 关注
      function gzBtns(type, waybillNumber) {
        console.log(checkList.value,77777)
        if(!waybillNumber&&!checkList.value.length){
            ElMessage({
                message: '请勾选内容~',
                type: 'warning',
                plain: true,
            })
            return
        }
        fullscreenLoading.value = true
        service.post('updateSpecialAttention',{
            waybillNumbers: waybillNumber?[waybillNumber]:checkList.value.map(item => item.waybillNumber),
            specialAttention: type,
        }).then(res=> {
            fullscreenLoading.value = false
            if(res.code == 200){
                ElMessage({
                    message: `${type==1?'关注':'取消'}成功`,
                    type: 'success',
                    plain: true,
                })
                getGendanList()
            }
        })
      }
        // 监听
        const stopWatch = watch(tableData,(newValue, OldValue) => {
            checkList.value = tableData.value.filter(item => {
                return item.checkFlag
            })
        }, { deep: true })
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
      // 运单切换
      function ydFn(ydName) {
        ydStatus.value = ydName
        sendData.value.page = 1
        getGendanList()
      }
      // 异常切换
      function tabFn(names) {
        czBtn(ruleFormRef.value)
        getGendanList(names)
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
      function wlBtn(item) {
        wldtInData.value = item
        console.log(wldtInData.value,777777)
        popFlag.value = true
      }
      function gbBtns(val) {
        popFlag.value = val
      }
      function qxBtnFn(e) {
        console.log(e,6666)
        qxChecks.value.qxCheckIntVal = false
        if(e) {
            // 全选
            tableData.value.map(item => {
                item.checkFlag = true
            })
        }else{
            // 取消
            tableData.value.map(item => {
                item.checkFlag = false
            })
        }
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
  
      function qxCheckFn() {
          let num = 0
          tableData.value.map(item => {
              if(item.checkFlag){
                  num++
              }
          })
          console.log(num,tableData.value,22222)
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
                  if(item.waybillNumber == i.waybillNumber){
                      i.checkFlag = true
                  }
              })
          }else{
              if(val){
                let is = 0
                  tableData.value.map(i => {
                      if(item.waybillNumber == i.waybillNumber){
                          i.checkFlag = true
                      }
                  })
              }else{
                  tableData.value.map(i => {
                      if(item.waybillNumber == i.waybillNumber){
                          i.checkFlag = false
                      }
                  })
              }
          }
          qxCheckFn()
      }
    
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
          min-width: 1250px;
          height: calc(100vh - 104px);
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
            .querItem2{
                background: #FFFFFF;
                box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.06);
                border: 2px solid #FFFFFF;
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
                    width: 80px;
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
                    padding: 0 12px;
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
                    height: 73px;
                    align-items: center;
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