<template>
  <div class="expBox">
    <div class="expTop">
        <h2>地址轻松查，发货更便捷</h2>
        <div class="expCx">
            <div class="expPiLeft" :class="titFlag?'expPiLeft1':''" @click="titFlag = !titFlag">
                <div class="kdTip" v-if="checkList.length==0">
                    <span>选择物流品牌</span>
                    <img src="@/assets/img/infoIcon.png" alt="" class="xlIcon">
                </div>
                <div class="kdTip" v-if="checkList.length==1">
                    <div class="pinps">
                        <img :src="imgTypeFn(expreList.onlineExpreList[checkList[0]].logisticsType)" alt="">
                        <span :title="expreList.onlineExpreList[checkList[0]].logisticsType">{{expreList.onlineExpreList[checkList[0]].name}}</span>
                    </div>
                    <img src="@/assets/img/infoIcon.png" alt="" class="xlIcon">
                </div>
                <div class="kdTip" v-if="checkList.length>1">
                    <div class="pinpImgs">
                        <img :src="imgTypeFn(expreList.onlineExpreList[item].logisticsType)" alt="" v-for="item,index in checkList.slice(0,5)" :key="index">
                        <div class="priDy" v-if="checkList.length>5">
                            +{{ checkList.length - 5 }}
                        </div>
                    </div>
                </div>
                <div class="kdPinpList" @click.stop="" v-if="titFlag"  v-click-away="titFns">
                    <el-checkbox-group v-model="checkList">
                        <div class="kdPinpItem" :class="{'kdPinpItem1': checkList.includes(index)}" @click="priBtn(index)" v-for="item,index in expreList.onlineExpreList" :key="index">
                            <el-checkbox :value="index" @click.stop=""/>
                            <p :title="item.name">{{item.name}}</p>
                        </div>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="expPiCont">
                <img src="@/assets/img/sousuo.png" alt="" class="iconFn">
                <el-input
                    v-model="txt"
                    resize="none"
                    @input="searInFn"
                    rows="1"
                    style="margin-right: 10px; flex: 1;"
                    type="textarea"
                    placeholder="请输入要查询的地址，多条用换行隔开"
                />
                <el-popover placement="bottom" :visible="visible" :width="400" trigger="click">
                    <template #reference>
                        <div class="rgBox" @click="visible=!visible" :class="{'rgBox1': val}">
                            <img src="@/assets/img/wRgicon.png" v-show="!val" alt="">
                            <img src="@/assets/img/yRgicon.png" v-show="val" alt="">
                            <span>人工核实</span>
                        </div>
                    </template>
                    <template #default>
                        <div class="rgHz">
                            <el-switch
                                v-model="val"
                                style="margin-top: 10px;"
                                inline-prompt
                                active-text="关"
                                inactive-text="开"
                            />
                            <h2>当系统查询到不明地址是否需要人工核实？</h2>
                            <h3>开启后会将搜索到不明确的地址发送给人工客服确认</h3>
                            <p>人工查询费用30豆/条</p>
                            <div class="rgBot">
                                <div class="rgBtn" @click="visible=false">
                                    取消
                                </div>
                                <div class="rgBtn rgBtn1" @click="visible=false">
                                    确认
                                </div>
                            </div>
                        </div>
                    </template>
                </el-popover>
            </div>
            <div class="expPiBtn" v-loading.fullscreen.lock="fullscreenLoading" @click="searBtn" :loading="btnFlag">
                <span>立即查询</span>
                <img src="@/assets/img/ssIcon.png" alt="">
            </div>
            <div class="expPiBtn expPiBtn1" title="请清空地址后，再查询~" v-show="false">
                <span>查询完成</span>
                <img src="@/assets/img/wcheng.png" alt="">
            </div>
        </div>
    </div>
    <div class="expBot">
        <div class="expTit"
        >
            <p>共查询到<span>{{tabsData.length}}</span>条信息</p>
            <div class="expBtns">
                筛选：
                <div class="expBtn" :class="{'expBtn1': item.flag}" @click="tabFn(item)" v-for="item,index in tabSxs" :key="index">{{item.name}}</div>
            </div>
        </div>
        <el-table
            :data="tabsData"
            :span-method="objectSpanMethod"
            v-if="tabsData.length"
            style="width: 100%;height: calc(100% - 120px);"
             ref="multipleTableRef"
             row-key = 'ids'
            :row-class-name="item => {
                if(item.row.checkFlag){
                    return 'hhhh'
                }
            }"
            >
            <!-- @cell-click="cellBtn" -->
            <el-table-column fixed label="查询地址" width="294" >
                <template #default="{row}">
                    <div class="adrBox">
                        <el-checkbox :indeterminate="row.fjIndeterFlag" v-model="row.fjCheckFlag" @click.stop="" @change="headFlxChange(row,$event)"/>
                        <span>{{ row.content }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" fixed label="查询结果" width="120" >
                <template #default="scope">
                    <div class="tableStatus">
                        <el-checkbox style="margin-right: 10px;" v-if="!tabFlag" v-model="scope.row.checkFlag" @click.stop="" @change = "headItemChange(scope.row.id,$event)"/>
                        <el-tooltip
                            v-if="scope.row.queryResult=='盲区' || scope.row.queryResult=='不可以到'"
                            class="box-item"
                            effect="dark"
                            content="盲区 (大雪导致路面冰冻，高速封路，末端积压。) "
                            placement="right"
                        >
                            <div class="tableBtn tableBtn1">
                                盲区
                            </div>
                        </el-tooltip>
                        <div class="tableBtn tableBtn2" v-else-if="scope.row.queryResult=='可以到'">
                            正常
                        </div>
                        <div class="tableBtn tableBtn3" v-else-if="scope.row.queryResult=='加收'">
                            加收
                        </div>
                        <div class="tableBtn tableBtn4" v-else-if="scope.row.queryResult=='自提'">
                            自提
                        </div>
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            v-else-if="scope.row.queryResult=='转人工'"
                            content="人工客服确认中，等待片刻刷新查看结果"
                            placement="right"
                        >
                            <div class="tableRgBtn" @click.stop="">
                                <img src="@/assets/img/rgIcon.png" alt="">
                                <p>人工客服确认中</p>
                                <span>刷新</span>
                            </div>
                        </el-tooltip>
                        <div v-else>
                            {{ scope.row.queryResult }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="amount1" fixed label="物流品牌" width="160">
                <template #default="scope">
                    <div class="tabelWls">
                        <img :src="imgTypeFn(scope.row.type)" alt="">
                        <span>{{scope.row.type}}物流</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="additionalInfo" label="加收信息"  width="140">
                <template #default="scope">
                    <el-tooltip
                    v-if="scope.row.additionalInfo"
                    class="box-item"
                    effect="dark"
                    :content="scope.row.additionalInfo"
                    placement="right"
                >
                    <div class="txtPen">
                        {{scope.row.additionalInfo}}
                    </div>
                </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="pickupInfo" label="自提信息"  width="140">
                <template #default="scope">
                    <el-tooltip
                    v-if="scope.row.pickupInfo"
                    class="box-item"
                    effect="dark"
                    :content="scope.row.pickupInfo"
                    placement="right"
                >
                    <div class="txtPen">
                        {{scope.row.pickupInfo}}
                    </div>
                </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="deliveryPoint" label="派件网点"  width="140"/>
            <!-- <el-table-column prop="pointPhone" label="网点电话"  width="140">
                <template #default="scope">
                   <div v-html="scope.row.pointPhone?.replace(/,/g,'\n')"></div>
                </template>
            </el-table-column> -->
            <el-table-column prop="pointAddress" width="500" label="网点地址" >
                <template #default="scope">
                    <el-tooltip
                    v-if="scope.row.pointAddress"
                    class="box-item"
                    effect="dark"
                    :content="scope.row.pointAddress"
                    placement="right"
                >
                    <div class="txtPen">
                        {{scope.row.pointAddress}}
                    </div>
                </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="112">
                <template #default="scope">
                   <div class="czBtns" v-if="scope.row.queryResult!='请求繁忙，请稍后再试'">
                        <span class="dexBtn" @click.stop="">
                            详情
                        </span>
                        <span @click.stop="go1Copy(scope.row)">
                            复制
                        </span>
                   </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="expFoot" v-if="tabsData.length">
            <div class="xzbQx">
                <el-checkbox v-model="qxChecks.qxCheckVal" :indeterminate="qxChecks.qxCheckIntVal" @change="qxBtnFn"/>
                <p>
                    选择本页
                </p>
                <img src="@/assets/img/infoIcon.png" alt="">
            </div>
            <div class="xzbLeft">
                <p>已选 {{selectKeyFn.length}} 项</p>
                <div class="xzbBtn xzbBtn1" @click="go2Copy">
                    复制
                </div>
                <div class="xzbBtn" @click="expoBtn">
                    导出
                </div>
            </div>
        </div>
        <div class="expZwBox" v-if="!tabsData.length">
            <img src="@/assets/img/zwImg.png" alt="">
            <p>请在搜索框输入地址进行查询哦~</p>
        </div>
    </div>
  </div>
</template>

  <script setup lang='ts'>
    import { ref, reactive,computed  } from 'vue'
    import a from '@/assets/img/a.png';
    import b from '@/assets/img/b.png';
    import c from '@/assets/img/c.png';
    import d from '@/assets/img/d.png';
    import e from '@/assets/img/e.png';
    import f from '@/assets/img/f.png';
    import { useExpreListStore } from '@/store/store'
    const expreList = useExpreListStore()
    import service  from '@/utils/http.ts';
    import { ElMessage } from 'element-plus'
    import { dataBox } from 'js-tool-big-box';

    let txt = ref('')
    let pasteTxt = ref('哈哈哈哈')
    // 单个复制
    const go1Copy = (item)=>{
        const text = 
`查询地址： ${item.content}
查询结果: ${item.queryResult}
物流品牌: ${item.type}
加收信息：${item.additionalInfo || '无'}
自提信息：${item.pickupInfo || '无'}
网点信息ℹ
网点名称：${item.deliveryPoint || '无'}
网点地址：${item.pointAddress || '无'}`
// ${item.pointPhone?item.pointPhone.split(',').filter((t) => t !== "").map(i => {
// return `📞 ${i}
// `}).join(''):''}     
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
    // 批量复制
    const go2Copy =() =>{     
        const text = selectKeyFn.value.map(item => {
            if(item.queryResult=='请求繁忙，请稍后再试'){
                return ''
            }
return `查询地址： ${item.content}
查询结果: ${item.queryResult}
物流品牌: ${item.type}
加收信息：${item.additionalInfo || '无'}
自提信息：${item.pickupInfo || '无'}
网点信息ℹ
网点名称：${item.deliveryPoint || '无'}
网点地址：${item.pointAddress || '无'}
`
// ${item.pointPhone?item.pointPhone.split(',').filter((t) => t !== "").map(i => {
// return `📞 ${i}
// `}).join(''):''}
}).filter((t) => t!=="").join(`
`)    
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
    import axios from 'axios';

    let nums = ref(0)
    let val = ref(false)
    let titFlag = ref(false)
    function titFns() {
        titFlag.value = false
    }
    let visible = ref(false)
    let btnFlag = ref(true)
    let tabFlag = ref(false)
    let tabTxt = ref('')
    let checkList = ref([])
    let qxChecks = ref({
        qxCheckVal: false,
        qxCheckIntVal: false,
    })
    let tableData = ref([])
    let tabsData = computed(() => {
        console.log(tabTxt.value,tabFlag.value,77777)
        let arr =  tableData.value.filter(item => {
            if(tabTxt.value==''){
                return item
            }else{
                if(tabTxt.value.includes(item.queryResult)){
                    return item
                }
            }
        })
        return arr
    })
    let selectKeyFn = computed(() => {
        let arr =  []
        console.log(tableData.value,tabsData.value,2222)
        if(tabFlag.value){
            tabsData.value.forEach(item => {
                if(item.fjCheckFlag){
                    arr.push(item)
                }
            })
        }else{
            tabsData.value.forEach(item => {
                if(item.checkFlag){
                    arr.push(item)
                }
            })
        }
        return arr
    })
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
    function expoBtn() {
        console.log(selectKeyFn.value,2222)
        axios.post('/api/exportCheckAddress', {
            data: selectKeyFn.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'blob' // 确保响应类型正确
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '查地址数据.xlsx');
            document.body.appendChild(link);
            link.click();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
        // service.post('/exportCheckAddress',{
        //     data: selectKeyFn.value
        // }).then(res => {
        //     console.log(res)
        // })
    }
    // 筛选切换
    function tabFn(item) {
        item.flag = !item.flag
        let is = 0 
        let arr = []
        tabSxs.value.forEach(items => {
            if(items.flag){
                is=1
                let str = ''
                if(items.name=='盲区'){
                    str = items.name + '不可以到'
                }else{
                    str = items.name
                }
                arr.push(str)
            }
        });
        tabTxt.value =  arr.join(',')
        if(is){
            tabFlag.value = true
        }else{
            tabFlag.value = false
        }
        resetFn()
    } 
    // 选择重置
    function resetFn() {
        tableData.value.forEach(item => {
            item.checkFlag = false;
            item.fjCheckFlag = false;
            item.fjIndeterFlag = false;
        })
        qxChecks.value = {
            qxCheckVal: false,
            qxCheckIntVal: false,
        }
    }
    // 地址查询
    const fullscreenLoading = ref(false)
    function searBtn() {
        if(!checkList.value.length){
            ElMessage({
                message: '请选择您要搜索的物流品牌~',
                type: 'warning',
                plain: true,
            })
            return
        }
        if(!txt.value){
            ElMessage({
                message: '请输入您要查询的地址~',
                type: 'warning',
                plain: true,
            })
            return
        }
        btnFlag.value = true
        let selectedSites = checkList.value.map(item => {
            return expreList.onlineExpreList[item].account
        })
        fullscreenLoading.value = true
        if(selectedSites.length==1){
            tabFlag.value = true
        }else{
            tabFlag.value = false
        }
        
        console.log(selectedSites,txt.value,9999998)
        service.post('/checkAddress',{
            selectedSites,
            content: txt.value,
        }).then(res => {
            btnFlag.value = false
            fullscreenLoading.value = false
            console.log(res)
            if(res.code == 200){
                if(res.msg!='查询成功'){
                    ElMessage({
                        message: res.msg,
                        type: 'warning',
                        plain: true,
                    })
                }
                txt.value = ''
                let ids = 1
                let id = 1
                let idtxt = ''
                let num = 0
                let txts = ''
                res.data.forEach(item => {
                    item.checkFlag = false;
                    item.fjCheckFlag = false;
                    item.fjIndeterFlag = false;
                    item.deliveryPoint = item.deliveryPoint?.replace(/\n/g,'');
                    item.pointPhone = item.pointPhone?.replace(/\n/g,'');
                    item.ids = ids
                    if(idtxt==''||idtxt == item.content){
                        item.id = id;
                        idtxt = item.content
                    }else{
                        id++
                        item.id = id;
                        idtxt = item.content
                    }
                    ids++
                    if(txts==''||txts == item.content){
                        num++
                        txts = item.content
                    }
                });
                nums.value = num
                tableData.value = res.data
            }
        })
    }
    function searInFn() {
        if(txt.value==''){
            btnFlag.value = true
        }
    }

    const objectSpanMethod = ({
        rowIndex,
        columnIndex,
        }) => {
        if(tabFlag.value){
            return
        }
        if (columnIndex === 0) {
            if (rowIndex % nums.value === 0) {
            return {
                rowspan: nums.value,
                colspan: 1,
            }
            } else {
            return {
                rowspan: 0,
                colspan: 0,
            }
            }
        }
    }
    function qxBtnFn(e) {
        console.log(e,6666)
        qxChecks.value.qxCheckIntVal = false

        if(e) {
            // 全选
            tabsData.value.map(item => {
                item.fjIndeterFlag = false
                item.fjCheckFlag = true
                item.checkFlag = true
            })
        }else{
            // 取消
            tabsData.value.map(item => {
                item.fjIndeterFlag = false
                item.fjCheckFlag = false
                item.checkFlag = false
            })
        }
    }
    function qxCheckFn() {
        let num = 0
        tabsData.value.map(item => {
            if(item.checkFlag){
                num++
            }
        })
        if(num==0){
            qxChecks.value.qxCheckIntVal = false
            qxChecks.value.qxCheckVal = false
        }else if(num==tabsData.value.length){
            qxChecks.value.qxCheckIntVal = false
            qxChecks.value.qxCheckVal = true
        }else{
            qxChecks.value.qxCheckIntVal = true
            qxChecks.value.qxCheckVal = false
        }
    }
    function cellBtn(e) {
        console.log(e,99999)
        e.checkFlag = !e.checkFlag 
        let newArr = tabsData.value.filter(item => item.id == e.id)
        let n = 0
        for(let item of newArr){
            if(item.checkFlag){
                n++
            }
        }
        if(n==nums.value){
            tabsData.value.map(items => {
                if(items.id == e.id){
                    items.fjCheckFlag=true
                    items.fjIndeterFlag = false
                }
            })
        }else if(n==0){
            tabsData.value.map(items => {
                if(items.id == e.id){
                    items.fjCheckFlag=false
                    items.fjIndeterFlag = false
                }
            })
        }else{
            tabsData.value.map(items => {
                if(items.id == e.id){
                    items.fjCheckFlag=false
                    items.fjIndeterFlag = true
                }
            })
        }
        qxCheckFn()
    }
    function headFlxChange(item,val) {
        if(tabFlag.value) {
            // 无合并
            if(item.fjIndeterFlag){
                tabsData.value.map(i => {
                    if(item.ids == i.ids){
                        i.fjIndeterFlag = false
                        i.fjCheckFlag = true
                        i.checkFlag = true
                    }
                })
            }else{
                if(val){
                    tabsData.value.map(i => {
                        if(item.ids == i.ids){
                            i.fjIndeterFlag = false
                            i.fjCheckFlag = true
                            i.checkFlag = true
                        }
                    })
                }else{
                    tabsData.value.map(i => {
                        if(item.ids == i.ids){
                            i.fjIndeterFlag = false
                            i.fjCheckFlag = false
                            i.checkFlag = false
                        }
                    })
                }
            }
        }else{
            if(item.fjIndeterFlag){
                tabsData.value.map(i => {
                    if(item.id == i.id){
                        i.fjIndeterFlag = false
                        i.fjCheckFlag = true
                        i.checkFlag = true
                    }

                })
            }else{
                if(val){
                    tabsData.value.map(i => {
                        if(item.id == i.id){
                            i.fjIndeterFlag = false
                            i.fjCheckFlag = true
                            i.checkFlag = true
                        }
                    })
                }else{
                    tabsData.value.map(i => {
                        if(item.id == i.id){
                            i.fjIndeterFlag = false
                            i.fjCheckFlag = false
                            i.checkFlag = false
                        }
                    })
                }
            }
        }
        qxCheckFn()
    }
    function headItemChange(id,val) {
        if(val){
            // 选中
            let newArr = tabsData.value.filter(item => item.id == id)
            let n = 0
            for(let item of newArr){
                if(item.checkFlag){
                    n++
                }
            }
            if(n==nums.value){
                tabsData.value.map(items => {
                    if(items.id == id){
                        items.fjCheckFlag=true
                        items.fjIndeterFlag = false
                    }
                })
            }else{
                tabsData.value.map(items => {
                    if(items.id == id){
                        items.fjCheckFlag=false
                        items.fjIndeterFlag = true
                    }
                })
            }
        }else{
            // 取消选中
            let newArr = tabsData.value.filter(item => item.id == id)
            let n = 0
            for(let item of newArr){
                if(item.checkFlag){
                    n++
                }
            }
            if(n==0){
                tabsData.value.map(items => {
                    if(items.id == id){
                        items.fjCheckFlag=false
                        items.fjIndeterFlag = false
                    }
                })
            }else{
                tabsData.value.map(items => {
                    if(items.id == id){
                        items.fjCheckFlag=false
                        items.fjIndeterFlag = true
                    }
                })
            }
        }
        qxCheckFn()
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
       

    .txtPen{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .box-item{
        width: 150px !important;
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
    .adrBox{
        display: flex;
        align-items: center;
        span{
            margin-left: 10px;
        }
    }
    .tableStatus{
        display: flex;
        align-items: center;
        .tableBtn{
            width: 45px;
            height: 24px;
            margin-right: 5px;
            margin-bottom: 5px;
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
    .czBtns{
        span{
            cursor: pointer;
            &:hover{
                color: #FF5411;
            }
        }
        .dexBtn{
            position: relative;
            margin-right: 10px;
            &::before{
                content: "";
                position: absolute;
                width: 1px;
                height: 11px;
                background: #EDEDED;
                top: 50%;
                transform: translateY(-50%);
                right: -3px;
            }
        }
    }
    .expBot{
        margin-top: -49px;
        background: #FFFFFF;
        box-shadow: 0px 3px 15px 0px rgba(145,145,145,0.15);
        border-radius: 12px ;
        height: calc( 100vh - 325px);
        overflow: hidden;
        padding: 0 20px;
        .expFoot{
            display: flex;
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
                    width: 80px;
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
                }
                .xzbBtn1{
                    background: #FF5411;
                    color: #fff;
                }
            }
        }
        .expZwBox{
            margin: 70px auto 0;
            width: 210px;
            font-size: 14px;
            color: #999999;
            text-align: center;
            img{
                width: 175px;
                margin-bottom: 6px;
            }
            
        }
        .expTit{
            display: flex;
            align-items: center;
            height: 60px;
            padding-left: 7px;
            .expBtns{
                display: flex;
                font-size: 14px;
                color: #666666;
                align-items: center;
            }
            .expBtn{
                width: 50px;
                height: 32px;
                background: #FFFFFF;
                border-radius: 3px;
                border: 1px solid #DBDBDB;
                margin-right: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
            .expBtn1{
                border: 1px solid rgba(255,84,17,0.3);
                background: #FFF9F6;
                color: #FF5411;
            }
            p{
                color: #999999;
                font-size: 14px;
                padding-right: 11px;
                position: relative;
                margin-right: 11px;
                &::before{
                    content: "";
                    position: absolute;
                    width: 1px;
                    height: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #EDEDED;
                    right: 0;
                }
                span{
                    color: #333333;
                    margin: 0 4px;
                }
            }
        }
    }
    .expTop{
        height: 270px;
        background: url('@/assets/img/expBg.png') no-repeat;
        background-size: 100% 100%;
        border: 1px solid transparent;

        h2{
            margin: 45px 0 26px;
            font-weight: bold;
            font-size: 32px;
            color: #222222;
            text-align: center;
        }
        .expCx{
            display: flex;
            width: 860px;
            height: 71px;
            background: #FFFFFF;
            box-shadow: 0px 3px 15px 0px rgba(0,0,0,0.1);
            border-radius: 8px;
            align-items: center;
            margin: 0 auto;
            padding: 10px;
            position: relative;
            z-index: 20;
            .expPiCont{
                flex: 1;
                margin-right: 10px;
                display: flex;
                align-items: center;
                padding-left: 20px;
                .iconFn{
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                }
                &::v-deep .el-textarea__inner{
                    box-shadow: none;
                    border-radius: 8px;
                    border: 1px solid #FFFFFF;
                }
                
                .rgBox{
                    width: 60px;
                    height: 50px;
                    background: #fff;
                    border-radius: 6px;
                    border: 1px solid #D9D9D9;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    img{
                        width: 21px;
                        height: 17px;
                        margin-bottom: 5px;
                    }
                    span{
                        color: #999999;
                        font-size: 12px;
                    }
                }
                .rgBox1{
                    background: rgba(#FFE4DA,.4);
                    border: 1px solid #FF5411;
                    span{
                        color: #FF5D31;
                    }
                }
            }
            
            .expPiBtn{
                width: 150px;
                height: 51px;
                background: linear-gradient(90deg, #FF5B2E, #FF8969);
                box-shadow: 0px 5px 10px 0px rgba(255,92,47,0.35);
                border-radius: 6px;
                text-align: center;
                line-height: 51px;
                font-weight: bold;
                font-size: 18px;
                color: #fff;
                cursor: pointer;
                img{
                    width: 13px;
                    height: 12px;
                    margin-left: 7px;
                }
            }
            .expPiBtn1{
                opacity: 0.4;
                cursor: pointer;
                img{
                    width: 17px;
                    height: 11px;
                }
            }
            .expPiLeft{
                width: 180px;
                position: relative;
                display: flex;
                align-items: center;
                padding: 0 20px 0 7px;
                box-sizing: border-box;
                height: 100%;
                &::before{
                    content: "";
                    position: absolute;
                    width: 1px;
                    height: 17px;
                    background: #DBDBDB;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .kdPinpList{
                    background: #FFFFFF;
                    box-shadow: 0px 8px 15px 0px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    position: absolute;
                    top: 61px;
                    left: -10px;
                    width: calc(100% + 10px);
                    display: none;
                    .kdPinpItem{
                        height: 35px;
                        padding: 0 10px 0 22px;
                        display: flex;
                        align-items: center;
                        color: #666666;
                        font-size: 14px;
                        cursor: pointer;
                        &:hover{
                            background: #FFF6F3;
                        }
                        p{
                            white-space: nowrap; /* 防止文本换行 */
                            overflow: hidden; /* 隐藏溢出的内容 */
                            text-overflow: ellipsis; /* 显示省略号来代表被修剪的文本 */
                            width: 120px; /* 设置一个宽度，超出这个宽度的文本会被截断 */
                            line-height: 1;
                        }
                        &::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner{
                            border-color: #FF5411; /* 例如，设置为红色 */
                            background: #FF5411;
                        }
                    }
                    .kdPinpItem1{
                        p{
                            color: #FF5411;
                        }
                    }
                }
                .kdTip{
                    font-size: 14px;
                    color: #666666;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    .xlIcon{
                        width: 12px;
                        height: 7px;
                        transition: 0.5s;
                    }
                    .pinps{
                        display: flex;
                        font-size: 14px;
                        color: #666666;
                        align-items: center;
                        img{
                            width: 31px;
                            height: 31px;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            box-sizing: border-box;
                            margin-right: 6px;
                        }
                        span{
                            white-space: nowrap; /* 防止文本换行 */
                            overflow: hidden; /* 隐藏溢出的内容 */
                            text-overflow: ellipsis; /* 显示省略号来代表被修剪的文本 */
                            width: 100px; /* 设置一个宽度，超出这个宽度的文本会被截断 */
                            line-height: 1;
                        }

                    }
                    .pinpImgs{
                        display: flex;
                        margin-left: 10px;
                        img{
                            width: 31px;
                            height: 31px;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            box-sizing: border-box;
                            margin-left: -10px;
                        }
                        .priDy{
                            width: 31px;
                            height: 31px;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            box-sizing: border-box;
                            margin-left: -10px;
                            background: #FFE8DF;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #FF5411;
                        }
                    }
                }
            }
            .expPiLeft1{
                .kdPinpList{
                    display: block;
                }
                .xlIcon{
                    transform: rotate(180deg);
                }
            }
        }
    }
    .rgHz{
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 14px;
        /* 覆盖Element UI的el-switch激活状态颜色 */
        &::v-deep .el-switch.is-checked .el-switch__core {
            border-color: #FF5411; /* 激活边框颜色 */
            background-color: #FF5411; /* 激活背景颜色 */
        }
        
        /* 覆盖Element UI的el-switch未激活状态颜色 */
        // &::v-deep .el-switch__core {
        //     border-color: #ff4949; /* 未激活边框颜色 */
        //     background-color: #ff4949; /* 未激活背景颜色 */
        // }
        h2{
            font-weight: bold;
            color: #333333;
        }
        h3{
            color: #666666;
        }
        p{
            color: #FF5411;
            margin-bottom: 16px;
        }
        .rgBot{
            display: flex;
            justify-content: center;
            .rgBtn{
                width: 60px;
                height: 32px;
                background: rgba(255,0,0,0);
                border-radius: 3px;
                border: 1px solid #DBDBDB;
                font-size: 14px;
                color: #333333;
                cursor: pointer;
                text-align: center;
                line-height: 32px;
            }
            .rgBtn1{
                background: #FF5411;
                border: 1px solid #FF5411;
                border-radius: 3px;
                color: #FFFFFF;
                margin-left: 10px;
            }
        }
    }
 
</style>