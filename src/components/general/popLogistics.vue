<template>
  <view v-if="flag">
    <div class="popBox">
        <div class="popTit">
            <span>
                物流动态
            </span>
            <img src="@/assets/img/wliuIcon.png" @click="flag=false" alt="">
        </div>
        <div class="popTip">
            <p class="tip1">运单号：8975453542322</p>
            <p>寄件网点：江西赣州商贸城公司</p>
        </div>
        <div class="popCont">
            <el-timeline style="max-width: 600px">
                <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="activity.type"
                :color="activity.color"
                :hollow="activity.hollow"
                >
                <template #default>
                    <h2>
                        <span>派件中</span>
                        2024-12-31 16:30:04
                    </h2>
                    <p>【曲靖沾益网点】已进行【问题】扫描，原因是【客户要求暂放】</p>
                </template>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
  </view>
</template>

<script setup lang='ts'>
    import type { TimelineItemProps } from 'element-plus'
    import { ref,reactive } from 'vue';

    interface ActivityType extends Partial<TimelineItemProps> {
    content: string
    }
    let flag = ref(false)
    defineExpose({
        flag
    })
    const activities = [
        {
            content: '派件中 2024-12-31 16:30:04',
            timestamp: '2018-04-12 20:46',
            type: 'primary',
            color: '#FF5411',
        },
        {
            content: 'Custom color',
            hollow: true,
            timestamp: '2018-04-03 20:46',
        },
        {
            content: 'Custom size',
            timestamp: '2018-04-03 20:46',
            hollow: true,
        },
        {
            content: 'Custom hollow',
            timestamp: '2018-04-03 20:46',
            hollow: true,

        },
        {
            content: 'Default node',
            timestamp: '2018-04-03 20:46',
            hollow: true,
        },
        {
            content: 'Default node',
            timestamp: '2018-04-03 20:46',
            hollow: true,
        },
        {
            content: 'Default node',
            timestamp: '2018-04-03 20:46',
            hollow: true,
        },
        {
            content: 'Default node',
            timestamp: '2018-04-03 20:46',
            hollow: true,
        },
        {
            content: 'Default node',
            timestamp: '2018-04-03 20:46',
            hollow: true,
        },
    ]
</script>

<style scoped lang='scss'>
    view{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(#000,0.4);
        z-index: 999;
        .popBox{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 550px;
            height: 609px;
            background: #FFFFFF;
            border-radius: 3px;
            .popTit{
                height: 45px;
                padding: 0 20px;
                display: flex;
                align-items: center;
                font-weight: bold;
                font-size: 14px;
                color: #181818;
                justify-content: space-between;
                img{
                    width: 14px;
                    height: 14px;
                    cursor: pointer;
                }
            }
            .popTip{
                height: 70px;
                background: #FAFAFA;
                padding: 0 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 14px;
                color: #666666;
                .tip1{
                    margin-bottom: 10px;
                }
            }
            .popCont{
                padding: 21px 52px 31px 40px;
                box-sizing: border-box;
                height: calc(100% - 115px);
                overflow: auto;
                ::v-deep .el-timeline-item__tail{
                    border-left: 1px dashed var(--el-timeline-node-color);
                    left: 5px;
                }
                h2{
                    color: #FF5411;
                    font-size: 12px;
                    margin-bottom: 11px;
                    span{
                        font-size: 14px;
                    }
                }
                p{
                    font-weight: 400;
                    font-size: 14px;
                }
            }
        }
    }
</style>