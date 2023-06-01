<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="rsvStartTime" label="预约开始时间" :formatter="stateFormat_rsvStartTime" width="180" />
    <el-table-column prop="rsvEndTime" label="预约结束时间" :formatter="stateFormat_rsvEndTime" width="180" />
    <el-table-column prop="rsvCheckInTime" label="签到时间" :formatter="stateFormat_rsvCheckInTime" />
    <el-table-column prop="rsvStatus" label="预约状态" />
    <el-table-column prop="rsvCheckInLocation" label="签到地点" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button link type="primary" size="medium" @click="addnew(scope)"
            >再次预约</el-button> 
      </template>
      <!-- 再次预约 -->
    
    </el-table-column>

    
  </el-table>
  <el-dialog
            title="再次预约"
            v-model="add"
            left
            width="50%"
            :append-to-body="true"
            style="margin-top:3%"
            >
            <el-form
                ref="loginformref"
                :hide-required-asterisk="true"
                style="text-align:left;"
            >
                 <el-form-item
                    prop="name"
                    label-width="100px"
                    class="passwordlist"
                    >
                    <div class="timeSelect">
                      <div class="demonstration">请选择预约时间</div>
                      <el-date-picker v-model="timeValue" type="datetimerange" range-separator="to" start-placeholder="Start date"
                          end-placeholder="End date" @change="updateTime" />
                  </div>
                </el-form-item>
             </el-form>

             <el-form
                    :hide-required-asterisk="true"
                    style="text-align:left;display:flex;justify-content:space-between;flex-direction:row-reverse"
                >
                        <el-row style="margin-right:5%">
                            <el-button @click="reserve" size='small' style="width:6rem" type="primary">预约</el-button>
                        </el-row>
            </el-form>
     </el-dialog>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'history',
  data() {
    return {
      total:0,
      add:0,
      tableData:[
          {
            rsvStartTime: '2016-05-03',
            rsvEndTime: 'Tom',
            rsvCheckInTime: 'No. 189, Grove St, Los Angeles',
            rsvStatus:'canceled',
            rsvCheckInLocation:'JA',
          },
        ],
      timeValue:ref(''),
      rsvStartTime:'',
      rsvEndTime:'',
      selectId:0,
    };
  },
  methods:{
    //借助moment.js进行转换
      addnew(row){
        this.add === true ? this.add=false:this.add=true;
        console.log(this.add)
        console.log(row)
        this.selectId = row.row.rsvSeatId
      },
      stateFormat_rsvStartTime(row, column) {
            if (row.rsvStartTime) {
              var dateValue1 = this.$moment(row.rsvStartTime).format('YYYY-MM-DD HH:mm:ss');
              return dateValue1;
            }
            return ''
          },    
      stateFormat_rsvEndTime(row, column) {
            if (row.rsvEndTime) {
              var dateValue1 = this.$moment(row.rsvEndTime).format('YYYY-MM-DD HH:mm:ss');
              return dateValue1;
            }
            return ''
          }, 
      stateFormat_rsvCheckInTime(row, column) {
            if (row.rsvCheckInTime) {
              var dateValue1 = this.$moment(row.rsvCheckInTime).format('YYYY-MM-DD HH:mm:ss');
              return dateValue1;
            }
            return ''
          }, 
      newDate(time) {
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
        },
      updateTime() {
            console.log('zzz')
            console.log(this.timeValue)
            if (this.timeValue != null) {
                this.rsvStartTime = this.timeValue[0]
                this.rsvEndTime = this.timeValue[1]
            }
            else {
                this.rsvStartTime = ''
                this.rsvEndTime = ''
            }
            console.log(this.rsvStartTime)
            console.log(this.rsvEndTime)
        },
      reserve() {
            if (this.selectId && this.timeValue) {
                console.log(this.rsvStartTime);
                console.log(this.rsvEndTime);
                this.$axios({
                    method: 'post',
                    url: '/api/reservations/seat',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        token: window.localStorage.getItem("token"),
                        rsvSeatId: this.selectId,
                        rsvStartTime: this.newDate(this.rsvStartTime),
                        rsvEndTime: this.newDate(this.rsvEndTime),
                    }
                }).then((response) => {
                    console.log('response:', response)
                    // console.log(response.status)
                    if (response.data.status == "success") {
                        console.log('成功')
                        console.log(response.data);
                        ElMessage({
                            message: '预约成功',
                            type: 'success',
                        })
                    }
                    else {
                        console.log("失败")
                        ElMessage({
                            message: '预约失败',
                            type: 'error',
                        })
                    }
                })
            }
            else if (!this.selectId) {
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

        },
      handleClick(row){
            console.log(row.row)
            this.$axios({
              method: 'post',
              url: '/api/reservations/seat',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                token:window.localStorage.getItem("token"),
                rsvSeatId:row.row.rsvSeatId,
                rsvStartTime:this.$moment(row.row.rsvStartTime).format('YYYY-MM-DD HH:mm:ss'),
                rsvEndTime:this.$moment(row.row.rsvEndTime).format('YYYY-MM-DD HH:mm:ss'),
              }
            }).then((response) => {
                console.log(response);
                // console.log(response.status);
                
                if(response.data.status == "success") {
                    
                }
                else {
                  this.$message({
                    message: "预约失败",
                    type: "error",
                    duration: 3000
                  });
                }
              })
              .catch(function (error) {
                if (error.response) {
                  // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log('错误');
                  alert(error.response)
                } else {
                  // Something happened in setting up the request that triggered an Error
                  alert(error.response)
                }
                  console.log(error.config);
              })
      },
  },
  mounted() {
    this.$axios({
              method: 'post',
              url: '/api/reservations/history',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                token:window.localStorage.getItem("token"),
                pageNum:1,
                pageSize:5
              }
            }).then((response) => {
                console.log(response);
                // console.log(response.status);
                
                if(response.data.status == "success") {
                    this.tableData = response.data.data.list
                    this.total = response.data.data.total
                }
                else {
                  this.$message({
                    message: "获取历史记录失败",
                    type: "error",
                    duration: 3000
                  });
                }
              })
              .catch(function (error) {
                if (error.response) {
                  // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                  console.log(error.response);
                  console.log(error.response.status);
                  console.log('错误');
                  alert(error.response)
                } else {
                  // Something happened in setting up the request that triggered an Error
                  alert(error.response)
                }
                  console.log(error.config);
              })
  }
};


</script>
