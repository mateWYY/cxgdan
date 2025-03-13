<template>
  <el-dialog v-model="centerDialogVisible" width="500" center>
    <template #header>
      <div class="dialog-header">
        <p class="tcTit">{{ loginTxt? '重新登录': '请选择站点' }}</p>
      </div>
    </template>
    <div class="tcCont">
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px;"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          status-icon
        >
        <el-form-item label="站点类型" prop="type"  >
          <el-select v-model="ruleForm.type" placeholder="请选择站点" clearable>
            <el-option :label="item.name" :value="item.name" v-for="item,index in zdianArr" :key="index">
              <template #default>
                <div class="xlBox">
                  <img :src="imgTypeFn(item.name)" />
                  {{item.name}}
                </div>
              </template>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          登录
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div class="sideType" v-if="props.queryType=='pri'">
    <div class="sideTypeItem" @click="priTabsFn(0)" :class="{'sideTypeItem1':tabNum==0}">
      智能比价
    </div>
    <div class="sideTypeItem" @click="priTabsFn(1)" :class="{'sideTypeItem1':tabNum==1}">
      比价记录
    </div>
  </div>
  <div class="sideType" v-if="props.queryType=='exp'">
    <div class="sideTypeItem" @click="tabsFn(0)" :class="{'sideTypeItem1':tabNum==0}">
      直接查询
    </div>
    <div class="sideTypeItem" @click="tabsFn(1)" :class="{'sideTypeItem1':tabNum==1}">
      微信查询配置
    </div>
    <div class="sideTypeItem" @click="tabsFn(2)" :class="{'sideTypeItem1':tabNum==2}">
      查询记录
    </div>
  </div>
  <div class="sideType" v-if="props.queryType=='docum'">
    <div class="sideTypeItem" @click="documTabsFn(0)" :class="{'sideTypeItem1':tabNum==0}">
      出港跟单
    </div>
    <div class="sideTypeItem" @click="documTabsFn(1)" :class="{'sideTypeItem1':tabNum==1}">
      进港跟单
    </div>
    <div class="sideTypeItem" @click="documTabsFn(2)" :class="{'sideTypeItem1':tabNum==2}">
      跟单配置
    </div>
    <div class="sideTypeItem" @click="documTabsFn(3)" :class="{'sideTypeItem1':tabNum==3}">
      客户自助查询
    </div>
    <div class="sideTypeItem" @click="documTabsFn(4)" :class="{'sideTypeItem1':tabNum==4}">
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
      <div class="sideItem" v-for="(item,index) in expreList.expreList" @click="sideBtn(item)" :key="index">
        <img :src="imgTypeFn(item.logisticsType)" alt="">
        <p>
          {{item.name}}
        </p>
        <div class="sideBtn" :class="{'sideBtns': !item.loginStatus}">
          {{!item.loginStatus?'掉线':'在线'}}
        </div>
      </div>
    </div>
    <div class="sideAddBtn hoverOpic" @click="addzdFn" >
      <img src="@/assets/img/addIcon.png" alt="">
      添加更多站点
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { reactive,ref,unref } from 'vue'
  import { ElLoading } from 'element-plus'
  import { useExpreListStore } from '@/store/store'
  import { useRouter } from 'vue-router'

  import service  from '@/utils/http.ts';
  import a from '@/assets/img/a.png';
  import b from '@/assets/img/b.png';
  import c from '@/assets/img/c.png';
  import d from '@/assets/img/d.png';
  import e from '@/assets/img/e.png';
  import f from '@/assets/img/f.png';
  const expreList = useExpreListStore()
  const router = useRouter()
  const loginTxt = ref(false)
  const props = defineProps({
    queryType: {
      type: String,
      default: '',
    }
  })
  const ruleFormRef = ref(null)
  const ruleForm = reactive({
    type: '',
  })
  const rules = reactive({
    type: [
    {
      required: true,
      message: '站点类型不能为空',
      trigger: 'change',
    },
  ],})
  let zdianArr = [{
    name: '安能',
    imgUrl: a
  }, {
    name: '顺心',
    imgUrl: b
  }, {
    name: '百世',
    imgUrl: c
  }, {
    name: '韵达',
    imgUrl: d
  }, {
    name: '壹米',
    imgUrl: e
  }, {
    name: '中通',
    imgUrl: f
  }]
  let centerDialogVisible = ref(false)
  let tabNum = ref(0)
  import { ElMessage } from 'element-plus'
  function submitForm(formEl) {
    if (!formEl) return
    formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      const loading = ElLoading.service({
        lock: true,
        text: '正在登录中...请耐心等待',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      service.get('/LogisticsLogin', {
        params: {
          type: ruleForm.type
        }
      }).then(res => {
        loading.close()
        ElMessage({
          message: '登录成功',
          type: 'success',
          plain: true,
        })
        expreList.getList()
        centerDialogVisible.value = false
        console.log(res,99999)
        if(res.code == 200){
          service.post('/deliverySynchronization', JSON.stringify(res.data)).then(red => {
            console.log(red)
            if(red.code == 200){
              service.post('/getShippingDocument', JSON.stringify({
                user: res.data,
                sendingPackageOrders: red.data,
              })).then(datas => {
                console.log(datas)
              })
            }
          })
        }
        
      })
    } else {
      console.log('error submit!', fields)
    }
  })
  }
  function addzdFn() {
    loginTxt.value = false;
    if(unref(ruleFormRef)){
      unref(ruleFormRef).resetFields();
    }
    ruleForm.type = ''
    centerDialogVisible.value = true;
  }
  function sideBtn(item) {
    if(!item.loginStatus){
      loginTxt.value=true
      ruleForm.type = item.logisticsType
      centerDialogVisible.value = true
    }
  }
  function priTabsFn(val: number) {
    tabNum.value = val
    if(val == 0) {
      router.push({
          path: '/priceCparison/priceCom'
      })
    }
    if(val == 1) {
      router.push({
          path: '/priceCparison/priceComJl'
      })
    }
  }
  function documTabsFn(val: number) {
    tabNum.value = val
    if(val == 0) {
      router.push({
          path: '/documentation/documDan'
      })
    }
    if(val == 1) {
      router.push({
          path: '/documentation/documDanJg'
      })
    }
  }
  function tabsFn(val: number) {
    tabNum.value = val
    if(val == 0) {
      router.push({
          path: '/checkAddress/expDelivery'
      })
    }
    if(val == 2) {
      router.push({
          path: '/checkAddress/queryRecords'
      })
    }
  }
</script>

<style scoped lang='scss'>
.tcTit{
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  color: #181818;
}
.tcCont{
  padding: 30px 40px;
}
.xlBox{
  display: flex;
  align-items: center;
  img{
    width: 26px;
    height: 26px;
    margin-right: 6px;
    border-radius: 50%;
  }
}
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