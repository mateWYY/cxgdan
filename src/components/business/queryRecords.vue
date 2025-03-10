

  <template>
  <div class="queryBox">
    <div class="querTit">
        查询记录
    </div>
    <div class="sxBox">
        <div class="sxTj">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="物流品牌：">
                    <el-select
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        v-model="formInline.user"
                        placeholder="请选择"
                        style="width:160px"
                        clearable
                    >
                        <el-option :label="item.name" :value="item.name" v-for="item in arrImg"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询结果：">
                    <el-select
                        v-model="formInline.region"
                        placeholder="请选择"
                        style="width:160px"
                        clearable
                    >
                        <el-option :label="item.name" :value="item.name" v-for="item in tabSxs"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询时间：">
                    <el-date-picker
                        v-model="times"
                        type="daterange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :default-value="[new Date(), new Date()]"
                    />
                </el-form-item>
            </el-form>
        </div>
        <div class="sxBtns">
            <div class="sxBtn sxBtn1">查询</div>
            <div class="sxBtn">重置</div>
            <div class="sxBtn">导出</div>
        </div>
    </div>
    <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        v-if="tableData.length"
        style="width: 100%;height: calc(100% - 178px);"
        ref="multipleTableRef"
    >
        <!-- <el-table-column type="selection" :selectable="selectable" width="55" /> -->
        <el-table-column label="查询地址" fixed width="294" >
            <template #default="{row}">
                <div class="adrBox">
                    <span>{{ row.adress }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="status" fixed label="查询结果" width="180" >
            <template #default="scope">
                <div class="tableStatus">
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="盲区 (大雪导致路面冰冻，高速封路，末端积压。) "
                        placement="right"
                    >
                        <div class="tableBtn tableBtn1">
                            盲区
                        </div>
                    </el-tooltip>
                    <div class="tableBtn tableBtn2">
                        正常
                    </div>
                    <div class="tableBtn tableBtn3">
                        加收
                    </div>
                    <div class="tableBtn tableBtn4">
                        自提
                    </div>
                    <el-tooltip
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
                    </el-tooltip>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="amount1" fixed label="物流品牌" width="160">
            <template #default="scope">
                <div class="tabelWls">
                    <img src="@/assets/img/a.png" alt="">
                    <span>安能物流</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="amount2" label="加收信息"  width="140"/>
        <el-table-column prop="amount3" label="自提信息"  width="140"/>
        <el-table-column prop="amount4" label="派件网点"  width="140"/>
        <el-table-column prop="amount5" label="网点电话"  width="140"/>
        <el-table-column prop="amount6" label="网点地址"  width="340" />
    </el-table>
    <div class="sxFot">
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
  </div>
</template>

<script setup lang='ts'>
    import { ref,reactive } from 'vue';
    import a from '@/assets/img/a.png';
    import b from '@/assets/img/b.png';
    import c from '@/assets/img/c.png';
    import d from '@/assets/img/d.png';
    import e from '@/assets/img/e.png';
    import f from '@/assets/img/f.png';
    const formInline = ref({
        user: '',
        region: '',
        date: '',
    })
    let nums = ref(2)

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

    const objectSpanMethod = ({
        rowIndex,
        columnIndex,
        }) => {
        if (columnIndex === 0) {
            if (rowIndex % 4 === 0) {
            return {
                rowspan: 4,
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
                    i.fjIndeterFlag = false
                    i.fjCheckFlag = true
                    i.checkFlag = true
                }

            })
        }else{
            if(val){
                tableData.value.map(i => {
                    if(item.id == i.id){
                        i.fjIndeterFlag = false
                        i.fjCheckFlag = true
                        i.checkFlag = true
                    }
                })
            }else{
                tableData.value.map(i => {
                    if(item.id == i.id){
                        i.fjIndeterFlag = false
                        i.fjCheckFlag = false
                        i.checkFlag = false
                    }
                })
            }
        }
        qxCheckFn()
    }
  
    let tableData = ref([{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'1',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        checkFlag: false,
        fjCheckFlag: false,
        fjIndeterFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'1',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        checkFlag: false,
        fjIndeterFlag: false,
        fjCheckFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'2',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        fjCheckFlag: false,
        checkFlag: false,
        fjIndeterFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'2',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        fjCheckFlag: false,
        checkFlag: false,
        fjIndeterFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'3',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        checkFlag: false,
        fjCheckFlag: false,
        fjIndeterFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'3',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        checkFlag: false,
        fjCheckFlag: false,
        fjIndeterFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'4',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        checkFlag: false,
        fjCheckFlag: false,
        fjIndeterFlag: false,
    },{
        adress: '黑龙江省哈尔滨市宾县满井镇',
        status: 1,
        id:'4',
        amount1: '1',
        amount2: '丰台宛平城s',
        amount3: '丰台宛平城s',
        amount4: '丰台宛平城s',
        amount5: '13856855668',
        amount6: '安徽省亳州市谯城区超级物流园2区302',
        fjCheckFlag: false,
        checkFlag: false,
        fjIndeterFlag: false,
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
    },])
</script>

<style scoped lang='scss'>
 ::v-deep .el-select-dropdown__item.is-selected{
    color: #FF5411;
  }
    .queryBox{
        background: #FFFFFF;
        box-shadow: 0px 3px 15px 0px rgba(145,145,145,0.15);
        border-radius: 12px;
        padding: 0 20px;
        height: calc(100vh - 104px);
        .querTit{
            height: 50px;
            line-height: 50px;
            padding: 0 2px;
            font-weight: bold;
            font-size: 18px;
            color: #222222;
            border-bottom: 1px solid #EDEDED;
        }
        .sxFot{
            display: flex;
            align-items: center;
            height: 60px;
            justify-content: flex-end;
        }
        .sxBox{
            height: 68px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .sxTj{
                ::v-deep .el-form-item{
                    margin-bottom: 0;
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
        flex-wrap: wrap;
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
  
</style>