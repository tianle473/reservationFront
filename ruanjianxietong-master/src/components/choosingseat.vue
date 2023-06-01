<template>
    <div id="main">
        <h1>
            座位选择
        </h1>
        <div class="legend">
            <div class="unreserved"></div>
            <span>未预约</span>
            <div class="reserved"></div>
            <span>已预约</span>
        </div>
        <div class="seats">
            <el-button class="seat" v-for="(item, index) in seatInfo" :key="index" :disabled="!item.seatIsAvailable"
                :type="item.seatIsAvailable ? 'primary' : 'default'" @click="chooseseat(item)">{{ item.seatNumber
                }}</el-button>
        </div>
        <div class="timeSelect">
            <div class="demonstration">请选择预约时间</div>
            <el-date-picker v-model="timeValue" type="datetimerange" range-separator="to" start-placeholder="Start date"
                end-placeholder="End date" @change="updateTime" />
        </div>
        <div class="reservation">
            <h3>预约座位:{{ selectId }}</h3>
            <el-button type="primary" style="margin:auto 0;"
                @click="reserve(selectId, rsvStartTime, rsvEndTime)">预约</el-button>
        </div>
        <el-button @click="test">test</el-button>
    </div>
</template>
<script >
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default ({

    name: 'choosingseat',
    setup() {
        //获取自习室Id
        let srId = window.localStorage.getItem('srId')
        // console.log(srId)
        let seatInfo = ref()
        //转换时间格式
        function newDate(time) {
            let date = new Date(time)
            let y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            let d = date.getDate()
            d = d < 10 ? '0' + d : d
            let h = date.getHours()
            h = h < 10 ? '0' + h : h
            let minute = date.getMinutes()
            minute = minute < 10 ? '0' + minute : minute
            let s = date.getSeconds()
            s = s < 10 ? '0' + s : s
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
        }
        //获取自习室座位信息
        axios({
            method: 'post',
            url: '/api/study_rooms/seats',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                srId: srId,
            }
        }).then((response) => {
            // console.log('response:', response)
            // console.log(response.status)
            if (response.data.status == "success") {
                console.log('获取自习室座位成功')
                seatInfo.value = response.data.data
                console.log(seatInfo.value)
            }
            else {
                console.log("失败")
            }
        }).catch(function (error) {
            if (error.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                console.log(error.response)
                console.log(error.response.status)
                console.log('错误')
                alert(error.response)
            } else {
                // Something happened in setting up the request that triggered an Error
                alert(error.response)
            }
            console.log(error.config)
        });
        //选中的座位号
        let selectId = ref()
        //预约起始日期时间
        const timeValue = ref('')
        let rsvStartTime = ''
        let rsvEndTime = ''
        //选择座位
        function chooseseat(seat) {
            selectId.value = seat.seatNumber
            console.log("选中座位", selectId.value)
        }
        //确定预约
        function reserve(selectId) {
            if (selectId && timeValue.value) {
                // console.log(rsvStartTime);
                // console.log(rsvEndTime);
                axios({
                    method: 'post',
                    url: '/api/reservations/seat',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        token: window.localStorage.getItem("token"),
                        rsvSeatId: seatInfo.value[selectId - 1].seatId,
                        rsvStartTime: newDate(rsvStartTime),
                        rsvEndTime: newDate(rsvEndTime),
                    }
                }).then((response) => {
                    // console.log('response:', response)
                    // console.log(response.status)
                    if (response.data.status == "success") {
                        console.log("预约成功");
                        ElMessage({
                            message: '预约成功',
                            type: 'success',
                        })
                        seatInfo.value[selectId - 1].seatIsAvailable = false
                        console.log(response.data);
                    }
                    else {
                        console.log("失败")
                    }
                })
            }
            else if (!selectId) {
                ElMessage({
                    message: '未选择座位',
                    type: 'error',
                })
            }
            else {
                ElMessage({
                    message: '未选择预约时间',
                    type: 'error',
                })
            }

        }
        //更新预约时间
        function updateTime() {
            if (timeValue.value != null) {
                rsvStartTime = timeValue.value[0]
                console.log('更新起始时间');
                rsvEndTime = timeValue.value[1]
                console.log('更新结束时间');
            }
            else {
                rsvStartTime = ''
                rsvEndTime = ''
            }
            // console.log(rsvStartTime)
            // console.log(rsvEndTime)
        }

        return { selectId, timeValue, timeValue, rsvStartTime, rsvEndTime, srId, seatInfo, chooseseat, reserve, updateTime }
    }
})
</script>

<style scoped>
.legend {
    display: flex;
    padding-left: 100px;
}

.unreserved {
    height: 20px;
    width: 20px;
    background-color: skyblue;
    border: 1px solid black;
}

.reserved {
    height: 20px;
    width: 20px;
    background-color: white;
    border: 1px solid black;
    margin-left: 30px;
}

.seats {
    display: flex;
    width: 1000px;
    margin: 100px auto;
    /* background-color: black; */
}

.seat {
    margin-right: 40px;
}

.timeSelect {
    height: 100px;
    width: 1000px;
    margin: 30px auto;
    /* background-color: black; */
}

.demonstration {
    margin-bottom: 30px;
}

.reservation {
    display: flex;
    width: 300px;
    justify-content: space-between;
    margin: 50px auto;
    /* background-color: black; */
}
</style>