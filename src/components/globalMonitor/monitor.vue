<template>
  <div class="monitBox" :class="!qjFlag?'monitBox1':''">
    <div class="monitIcons" @click="iconFn">
        <div class="monIcon">
            <img src="@/assets/img/jk_icon.png" alt="">
        </div>
        <div class="monIconDian" v-show="xxFlag"></div>
    </div>
    <el-button @click="adds">add</el-button>
    <div class="monCont" :class="qjFlag?'monCont1':''">
            <div class="monContTit">
                <div class="monLef">
                    <img src="@/assets/img/jk_xicon.png" alt="">
                    <span>后台进程监控</span>
                </div>
                <div class="monRig" @click="qjFlag=false">
                    <img src="@/assets/img/jk_z.png" alt="">
                    <span>收起</span>
                </div>
            </div>
            <div class="monContList">
                <el-scrollbar height="200px">
                    <div v-for="item in count" :key="item" class="monContItem">
                        <div class="monContItemLef">
                            <img src="@/assets/img/jk_y.png" alt="">
                            <span>十九里镇一部</span>
                            <p>正在启动数据同步</p>
                        </div>
                        <div class="monContItemRig">
                            3/21 15:36
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
  </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue'

    const count = ref(8)
    const qjFlag = ref(false)
    const xxFlag = ref(false)
    function adds() {
        count.value++
        if(qjFlag.value == false) {
            xxFlag.value = true
        }
    }
    function iconFn() {
        qjFlag.value = !qjFlag.value
        if(qjFlag.value){
            xxFlag.value = false
        }
    }

</script>

<style scoped lang='scss'>
    .monitBox{
        position: fixed;
        left: 11px;
        bottom: 100px;
        z-index: 999;
        transition: all 1s;
        .monitIcons{
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.9);
            box-shadow: 0px 3px 15px 0px rgba(0,0,0,0.16);
            border-radius: 50%;
            border: 1px solid #CCCCCC;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            cursor: pointer;
            .monIcon{
                width: 30px;
                img{
                    width: 100%;
                }
            }
            .monIconDian{
                width: 8px;
                height: 8px;
                background: #FF5411;
                border-radius: 50%;
                position: absolute;
                top: 4px;
                right: 6px;
            }
        }
        .monCont{
            background: rgba(255,255,255);
            box-shadow: 0px 3px 15px 0px rgba(0,0,0,0.16);
            box-sizing: border-box;
            height: 0;
            width: 322px;
            transition: all .5s;
            overflow: hidden;
            .monContTit{
                height: 29px;
                background: #F0F0F0;
                padding: 0 15px;
                display: flex;
                align-items: center;
                font-size: 12px;
                color: #555555;
                display: flex;
                justify-content: space-between;
                .monLef{
                    display: flex;
                    align-items: center;
                    img{
                        width: 11px;
                        margin-top: 2px;
                        margin-right: 6px;
                    }
                }
                .monRig{
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    img{
                        width: 6px;
                        margin-top: 2px;
                        margin-right: 4px;
                    }
                }
            }
            .monContList{
                .monContItem{
                    display: flex;
                    align-items: center;
                    height: 28px;
                    justify-content: space-between;
                    padding: 0 15px;
                    .monContItemRig{
                        display: flex;
                        align-items: center;
                        font-weight: 400;
                        font-size: 12px;
                        color: #888888;
                    }
                    .monContItemLef{
                        display: flex;
                        align-items: center;
                        font-weight: 400;
                        font-size: 12px;
                        color: #888888;
                        img{
                            width: 3px;
                            margin-right: 5px;
                        }
                        span{
                            margin-right: 18px;
                            position: relative;
                            &::before{
                                content: "";
                                position: absolute;
                                width: 1px;
                                height: 10px;
                                background: #e5e5e5;
                                right: -9px;
                                top: 50%;
                                transform: translateY(-50%);
                            }
                        }
                    }
                }
            }
        }
        .monCont1{
            height: 240px;
            margin-top: 20px;
            border: 1px solid #CCCCCC;
            .monContTit{
            }
        }
    }
    .monitBox1{
        width: 60px;
    }
</style>