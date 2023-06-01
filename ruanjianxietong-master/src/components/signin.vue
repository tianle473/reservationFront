<template>
    <div id="main">
        <h1>
            座位签到
        </h1>
        <div class="reservationInfo">
            <el-table :data="reservationData" stripe fit table-layout="auto" style="margin: 30px auto;">
                <el-table-column prop="rsvId" label="预约号" width="auto" />
                <el-table-column prop="rsvSeatId" label="座位号" width="auto" />
                <el-table-column prop="rsvStartTime" label="开始时间" width="auto" />
                <el-table-column prop="rsvEndTime" label="结束时间" width="auto" />
                <el-table-column prop="rsvCheckInLocation" label="签到地点" width="auto" />
                <el-table-column prop="rsvStatus" label="签到状态" width="auto" />
                <el-table-column prop="rsvCheckInTime" label="签到时间" width="auto" />
                <el-table-column label="签到" width="auto">
                    <template #default="scope">
                        <el-button type="primary" @click="checkIn(scope.row)">签到</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script >
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import axios from 'axios'

export default {

    name: 'signin',

    setup() {
        //预约信息
        let reservationData = ref()
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
        //获取预约历史
        axios({
            method: 'post',
            url: '/api/reservations/history',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                token: window.localStorage.getItem("token"),
                pageNum: 1,
                pageSize: 5,
            }
        }).then((response) => {
            // console.log('response:', response)
            // console.log(response.status)
            if (response.data.status == "success") {
                console.log('获取预约历史成功')
                reservationData.value = response.data.data.list
                console.log(reservationData.value);
                //筛选未签到的预约
                reservationData.value = reservationData.value.filter(function (item) {
                    if(item.rsvStatus === "canceled"){
                        return item
                    }
                })
                //转换时间格式
                for (let i = 0; i < reservationData.value.length; i++) {
                    reservationData.value[i].rsvStartTime = newDate(reservationData.value[i].rsvStartTime)
                    reservationData.value[i].rsvEndTime = newDate(reservationData.value[i].rsvEndTime)
                }
                console.log(reservationData.value);
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
        //签到
        function checkIn(row) {
            console.log("签到");
            // console.log(row);
            axios({
                method: 'post',
                url: '/api/reservations/check_in',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    token: window.localStorage.getItem("token"),
                    rsvId: row.rsvId,
                    rsvCheckInLocation: row.rsvCheckInLocation,
                    rsvCheckInTime: newDate(new Date().getTime()),
                }
            }).then((response) => {
                console.log(response)
                // console.log(response.status)
                if (response.data.status == "success") {
                    console.log('签到成功')
                    ElMessage({
                        message: '签到成功',
                        type: 'success',
                    })
                }
                else {
                    console.log("签到失败")
                    ElMessage({
                        message: '签到失败',
                        type: 'error',
                    })
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
        }
        return { reservationData, checkIn }
    }
}
</script>

<style scoped>
.reservationInfo {
    margin: 20px auto;
}
</style>