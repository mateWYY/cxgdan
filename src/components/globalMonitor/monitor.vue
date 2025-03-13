<template>
  <div class="monitBox" :class="!qjFlag?'monitBox1':''">
    <div class="monitIcons hoverOpic" @click="iconFn">
        <div class="monIcon">
            <img src="@/assets/img/jk_icon.png" alt="">
        </div>
        <div class="monIconDian" v-show="xxFlag"></div>
    </div>
    <!-- <el-button @click="adds">add</el-button> -->
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
            <div class="monContList" ref="scrollableDiv">
                <div class="scrollableDiv">
                    <div v-for="(item,index) in count" :key="index" class="monContItem">
                        <div class="monContItemLef">
                            <img src="@/assets/img/jk_y.png" alt="">
                            <span>{{item.name}}</span>
                            <p :class="item.syncStatus.includes('成功') || item.syncStatus.includes('完成')?'p1':item.syncStatus.includes('失败')?'p2':''">{{item.syncStatus}}</p>
                        </div>
                        <div class="monContItemRig">
                            {{moment(item.lastSyncDate).format('MM/DD HH:MM')}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script setup lang='ts'>
    import { ref, nextTick,onMounted, onUnmounted } from 'vue'

    const qjFlag = ref(false)
    const xxFlag = ref(false)
   
    // 通信链接
    const ws = ref(null);
    const url = 'ws://10.250.251.192:8888/my-websocket';

    onMounted(() => {
        connectWebSocket()
    });
    console.log()
    function connectWebSocket() {
        ws.value = new WebSocket(url);
        ws.value.onopen = () => {
            console.log('成功连接');
        };
        ws.value.onmessage = (event) => {
            const data = event.data;
            if(qjFlag.value == false) {
                xxFlag.value = true
            }
            try {
                let item = JSON.parse(data)
                count.value.push(item)
            }catch(err) {
                console.log(err)
            }
            nextTick().then(() => {
                scrollToBottom()
            })
            console.log(data)
            // ws.value.push(data); // 假设服务器发送的是JSON格式的数据
        };
        ws.value.onerror = (error) => {
            console.log('Error:', error);
            // reconnectWebSocket()
        };
        ws.value.onclose = () => {
            console.log('已断开连接');
            reconnectWebSocket()
        };
    }
    const RECONNECT_INTERVAL = 5000; // 重连间隔时间，5秒
    let isReconnecting = false;
    function reconnectWebSocket() {
        isReconnecting = true; // 设置重连中状态
        setTimeout(() => {
            connectWebSocket(); // 延时后重新尝试连接
        }, RECONNECT_INTERVAL);
    }
    onUnmounted(() => {
        if (ws.value) {
            ws.value.close(); // 关闭WebSocket连接
        }
    });
    const count = ref([])
    const scrollableDiv = ref(null);
    const scrollToBottom = () => {
        if (scrollableDiv.value) {
            scrollableDiv.value.scrollTop = scrollableDiv.value.scrollHeight;
        }
    };
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
                overflow-y: auto;
                height: 200px;
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
                        .p1{
                            color: #28A745;
                        }
                        .p2{
                            color: #DC3545;
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