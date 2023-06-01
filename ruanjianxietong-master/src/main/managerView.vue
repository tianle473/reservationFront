<template>
  <!-- 其他组件或元素 -->
  <h1 class="header">管理员系统</h1>

  <el-container class="layout-container-demo" style="height: auto">
    <el-aside width="300px">
      <el-col style="width:100% ;">
        <h5 class="mb-2">选择自习室</h5>
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-menu-item index="主页" @click="show_main_page">

            主页
          </el-menu-item>
          <el-menu-item v-for="item, index in availableRoom" :key="index" :index="index" @click="show_table_page(index)">
            <el-switch v-model="item.srIsAvailable" style="margin-right:8px ;" />
            {{ item.srName }}
          </el-menu-item>

          <!-- <el-menu-item v-for="index in rooms_num" :key="index" :index="/room${index}">
      自习室{{index}} 
  </el-menu-item> -->
        </el-menu>
      </el-col>
    </el-aside>

    <el-container>

      <el-main v-if="main_page_available">
        <h1 style="text-align: left">预约情况总览</h1>
        <hr class="my-divider">
        <el-container v-for="item, index in availableRoom" :key="index" :index="index">
          <el-main>
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="text" style="text-align: center;margin-bottom: 10px;">{{ item.srName }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="2">
                <div class="text" style="text-align: center">今日预约情况</div>
              </el-col>
              <el-col :span="10">
                <el-progress :percentage="availableRoom[index].today_rate" :text-inside="true" :stroke-width="26" />
              </el-col>
              <el-col :span="2">
                <div class="text" style="text-align: center;">7日内预约情况</div>
              </el-col>
              <el-col :span="10">
                <el-progress :percentage="availableRoom[index].seven_rate" :text-inside="true" :stroke-width="26" />
              </el-col>
            </el-row>

          </el-main>
        </el-container>
        <br>
        <h1 style="text-align: left">批量管理</h1>
        <hr class="my-divider">
        <el-container>
          <el-main direction="vertical">
            <el-row>
              <el-col :span="2">
                <div class="text" style="text-align: right ;font-size: 14px; line-height: 30px;">设置开放时间：</div>
              </el-col>
              <el-col :span="6" style="margin-bottom: 15px;">
                <el-time-picker v-model="available_time" is-range range-separator="To" start-placeholder="Start time"
                  end-placeholder="End time" style="display:flex;align-content:flex-start ;" />
              </el-col>
              <el-col :span="4">
                <el-button @click="set_available_time()">应用于全部自习室</el-button>
              </el-col>

            </el-row>
            <el-row style="margin-bottom: 15px;">
              <el-col :span="2">
                <div class="text" style="text-align:  right ;font-size: 14px; line-height: 30px;">设置自习室可用性：</div>
              </el-col>
              <el-col :span="4">
                <el-cascader v-model="rooms_available_current_option" :options="rooms_available_options"
                  style="display:flex;align-content:flex-start ;" />
              </el-col>
              <el-col :span="3">
                <el-button @click="set_all_rooms_available(rooms_available_current_option)">应用于全部自习室</el-button>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="2">
                <div class="text" style="text-align:  right ;font-size: 14px; line-height: 30px;">设置最长预约时间：</div>
              </el-col>
              <el-col :span="4">
                <el-input-number v-model="spParameterValue" :min="1" :max="10" @change="changespParameterValue()"
                  style="display:flex;align-content:flex-start ;" />

              </el-col>


            </el-row>
          </el-main>

        </el-container>
      </el-main>
      <el-main v-if="data_page_available">
        <el-container>
          <el-main>
            <el-row>
              <el-col :span="2">
                <div class="text" style="text-align: right ;font-size: 14px; line-height: 30px;">开放时间：</div>
              </el-col>
              <el-col :span="6" style="margin-bottom: 15px;">
                <el-time-picker v-model="available_time_local" is-range range-separator="To"
                  start-placeholder="Start time" end-placeholder="End time"
                  style="display:flex;align-content:flex-start ;" />
              </el-col>
              <el-col :span="3">
                <el-button @click="set_available_time_local(room_id)">应用于自习室</el-button>
              </el-col>

            </el-row>

          </el-main>
        </el-container>
        <el-scrollbar>
          <el-table :data="tableData">

            <el-table-column prop="ID" label="座位号" width="140" sortable />
            <el-table-column prop="seatIsNearPower" label="是否靠近电源" width="150" sortable />
            <el-table-column prop="seatIsAvailable" label="是否可用" width="120" sortable />
            <el-table-column prop="openTimeStr" label="今日预约率">
              <template #default="scope">
                <el-progress :percentage="scope.row.seven_rate" :text-inside="true" :stroke-width="26" />
              </template>
            </el-table-column>
            <el-table-column prop="openTimeStr" label="7日预约率">
              <template #default="scope">
                <el-progress :percentage="scope.row.today_rate" :text-inside="true" :stroke-width="26" />
              </template>
            </el-table-column>


            <el-table-column fixed="right" label="Operations" width="240"
              style=" justify-content: center;align-items: center;">
              <template #default="scope" style=" justify-content: center;align-items: center;">
                <el-row>
                  <el-button round @click="update_availability(scope.row.seatID, scope.row.seatIsAvailable)"
                    style="justify-content: center;align-items: center">{{
                      button_text[(scope.row.seatIsAvailable.toString())] }}</el-button>
                  <el-button round @click="show_dialog(scope.row.seatID)"
                    style="justify-content: center;align-items: center">查看详细</el-button>
                </el-row>

              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="dialogVisible" title="详细信息" width="1100" destroy-on-close>

    <el-table :data="dialogTable">
      <el-table-column prop="rsvUserId" label="用户ID" width="100" style="text-align: left;" sortable />
      <el-table-column prop="rsvStatus" label="状态" width="100" style="text-align: left;" sortable />
      <el-table-column prop="rsvStartTime" label="开始时间" width="300" style="text-align: left;" sortable />
      <el-table-column prop="rsvEndTime" label="结束时间" width="300" style="text-align: left;" sortable />
      <el-table-column prop="rsvCheckInLocation" label="签到位置" width="150" style="text-align: left;" sortable />
      <el-table-column prop="rsvCheckInTime" label="签到时间" width="150" style="text-align: left;" sortable />
    </el-table>


  </el-dialog>
</template>



<script>

import { ref } from 'vue'


const startTime = ref('')
const endTime = ref('')
function findComplementRanges(ranges, total) {
  // Sort the ranges by start time.
  ranges.sort((a, b) => a.start - b.start);
  // Initialize variables.
  const complementRanges = [];
  let lastEnd = total.start;

  // Iterate over the ranges.
  for (const range of ranges) {
    if (range.start > lastEnd && range.start < total.end) {
      // There is a gap between the last range and this range.
      complementRanges.push({ "start": new Date(lastEnd), "end": range.start });
    }
    lastEnd = Math.max(lastEnd, range.end);
  }

  // Check for a gap between the last range and the end of the total range.
  if (lastEnd < total.end) {
    complementRanges.push({ "start": new Date(lastEnd), "end": total.end });
  }

  return complementRanges;
}
function calculateOccupancyRate(totalStartTime, totalEndTime, timeRanges) {



  // 计算总时间范围的时长（单位：毫秒）
  const totalTimeRange = totalEndTime - totalStartTime;

  // 计算重叠时间总和（单位：毫秒）
  let totalOverlap = 0;

  // 遍历每个时间范围计算重叠时间
  for (let i = 0; i < timeRanges.length; i++) {
    const timeRange = timeRanges[i];
    const start = timeRange.start;
    const end = timeRange.end;
    // 确保时间范围与总时间范围有重叠
    if (start < totalEndTime && end > totalStartTime) {
      // 计算重叠时间
      const overlapStart = start < totalStartTime ? totalStartTime : start;

      const overlapEnd = end > totalEndTime ? totalEndTime : end;
      const overlap = overlapEnd - overlapStart;
      totalOverlap += overlap;
    }


  }



  // 计算占用率（保留两位小数）
  const occupancyRate = (totalOverlap / totalTimeRange) * 100;
  return occupancyRate;
}


export default {
  name: 'managerView',
  components: {
  },
  created() {
    this.current_room_index = 1
    console.log("created")
    this.getAvailableRoomsAndSeat()
    this.getspParameterValue()
    this.show_main_page()

  },
  data() {
    return {
      rooms_num: 3,
      current_room_index: 1,
      tableData: [],
      seatInfo: [],
      availableRoom: [],
      date: new Date(),
      startTime: '',
      endTime: '',

      //页面控制参数
      main_page_available: false,
      data_page_available: true,
      spParameterValue: 1,

      //主页面参数
      available_time: ref < [Date, Date] > ([
        new Date(),
        new Date(),
      ]),
      available_time_local: [
        new Date(),
        new Date(),
      ],
      rooms_available_current_option: null,
      rooms_available_options: [
        { value: true, label: '可用' },
        { value: false, label: '不可用' }
      ],

      //table页面参数
      room_id: "",
      button_text: {
        "是": "关闭",
        "否": "开启"
      },
      dialogVisible: false,
      dialogTable: []
    };

  },
  watch: {
  },
  methods: {
    updateTableData(room_id) {
      if (this.seatInfo.length == 0) {
        return
      }
      console.log("updateTableData")
      this.room_id = room_id
      this.tableData = []
      let info = this.seatInfo[room_id]
      let seatIsNearPower = ""
      let seatIsAvailable = ""

      for (let item of info) {
        let ID = item.seatNumber
        if (item.seatIsNearPower) {
          seatIsNearPower = "是"
        } else {
          seatIsNearPower = "否"
        }
        if (item.seatIsAvailable) {
          seatIsAvailable = "是"
        } else {
          seatIsAvailable = "否"
        }
        //根据已预定时间表求可预定时间表
        //初始化总时间范围
        let now = new Date()

        let target = new Date(now)
        target.setDate(target.getDate() + 7); //最多预约7天内时间
        const total = { "start": now, "end": target };
        //读入已预定时间表
        let ranges = []
        for (let tr of item.reservations) {
          let s = new Date(tr.rsvStartTime)
          let e = new Date(tr.rsvEndTime)
          ranges.push({ "start": s, "end": e })
        }
        const complementRanges = findComplementRanges(ranges, total);

        let openTimeStr = []
        for (let i = 0; i < complementRanges.length; i++) {

          openTimeStr.push(complementRanges[i].start.toLocaleString() + "-" + complementRanges[i].end.toLocaleString())

        }
        this.tableData.push(
          {
            "seatID": item.seatId,
            "ID": ID,
            "seatIsAvailable": seatIsAvailable,
            "seatIsNearPower": seatIsNearPower,
            "openTimeStr": openTimeStr,
            "complementRanges": complementRanges,
            "seatStudyRoomId": item.seatStudyRoomId,
            "seven_rate": item.seven_rate,
            "today_rate": item.today_rate

          }

        )
      }
    },
    getSeatInfo() {
      for (var j = 0; j < this.availableRoom.length; j++) {
        let index = j
        let r = this.availableRoom[j]

        let srid = r.srId

        this.$axios({
          method: 'post',
          url: '/api/study_rooms/seats',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            "srId": srid
          }
        }).then((response) => {
          console.log(response);

          let d = response.data.data;
          let total_today_rate = 0.0
          let total_seven_rate = 0.0
          for (var i = 0; i < d.length; i++) {
            let item = d[i]
            let start = new Date()
            let end = new Date(start)
            start.setHours(0, 0)


            end.setHours(23, 59)
            // end.setDate(end.getDate() + 7); //最多预约7天内时间
            //读入已预定时间表
            let ranges = []
            for (var k = 0; k < item.reservations.length; k++) {
              let tr = item.reservations[k]
              let s = new Date(tr.rsvStartTime)
              let e = new Date(tr.rsvEndTime)
              ranges.push({ "start": s, "end": e })
            }
            let today_rate = calculateOccupancyRate(start, end, ranges);

            end.setDate(end.getDate() + 7);
            let seven_rate = calculateOccupancyRate(start, end, ranges);
            item.today_rate = today_rate
            item.seven_rate = seven_rate
            total_today_rate = total_today_rate + today_rate
            total_seven_rate = total_seven_rate + seven_rate
            d[i] = item
          }

          this.availableRoom[index].today_rate = total_today_rate / d.length
          this.availableRoom[index].seven_rate = total_seven_rate / d.length
          // console.log(this.availableRoom[j].today_rate)


          this.seatInfo.push(d);
          console.log(this.seatInfo)
        })
          .catch(function (error) {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              console.log(error.response);
              console.log('getSeatInfo错误');
            }
          })
      }

    },
    show_main_page() {
      this.main_page_available = true
      this.data_page_available = false
    },
    show_table_page(room_id) {
      this.main_page_available = false
      this.data_page_available = true
      this.updateTableData(room_id)
    },
    set_room_available(room, set_available) {
      ///todo  发送信息到后端
      let dateString = room.srOpenTime;
      let parts = dateString.split(/[- :]/); // 使用正则表达式进行拆分

      // 注意：在构造 Date 对象时，月份是从 0 开始计数的，所以需要将月份减 1
      let now = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);

      console.log(now)
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      let seconds = now.getSeconds().toString().padStart(2, '0');
      const srOpenTime = `1970-01-01 ${hours}:${minutes}:${seconds}`;
      dateString = room.srCloseTime;
      parts = dateString.split(/[- :]/); // 使用正则表达式进行拆分

      // 注意：在构造 Date 对象时，月份是从 0 开始计数的，所以需要将月份减 1
      now = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);

      hours = now.getHours().toString().padStart(2, '0');
      minutes = now.getMinutes().toString().padStart(2, '0');
      seconds = now.getSeconds().toString().padStart(2, '0');
      const srCloseTime = `1970-01-01 ${hours}:${minutes}:${seconds}`;
      this.$axios({
        method: 'post',
        url: '/api/study_rooms/update_availability',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          "token": window.localStorage.getItem("token"),
          "srId": room.srId,
          "srOpenTime": srOpenTime,
          "srEndTime": srCloseTime,
          "srIsAvailable": set_available[0]
        }
      }).then((response) => {
        this.$message({
          message: `${room.srName} 设置成功`,
          type: "success",
          duration: 3000

        })

      })
        .catch(function (error) {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response);
            console.log('getAvailableRoomsAndSeat错误');
          }
        })
    },
    set_all_rooms_available(set_available) {
      if (set_available != null) {
        for (let i = 0; i < this.availableRoom.length; i++) {
          this.set_room_available(this.availableRoom[i], set_available)

          this.availableRoom[i].srIsAvailable = set_available[0]
        }
      } else {
        this.$message({
          message: "请选择可用性",
          type: "success",
          duration: 3000

        })
      }
    },
    getAvailableRoomsAndSeat() {
      // console.dir(this.availableRoom)
      //let response  = { "status": "success", "data": [ { "srId": 1, "srName": "自习室1", "srCapacity": 30,"srOpenTime": "08:00:00", "srCloseTime": "22:00:00", "srIsAvailable": true }, {"srId": 2, "srName": "自习室2", "srCapacity": 40, "srOpenTime": "08:00:00","srCloseTime": "22:00:00", "srIsAvailable": true },{"srId": 3, "srName": "自习室3", "srCapacity": 40, "srOpenTime": "08:00:00","srCloseTime": "22:00:00", "srIsAvailable": false   }]}.data
      this.$axios({
        method: 'get',
        url: '/api/study_rooms/available',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        console.log(response)
        this.availableRoom = response.data.data;
        console.log(this.availableRoom)
        this.getSeatInfo()

      })
        .catch(function (error) {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response);
            console.log('getAvailableRoomsAndSeat错误');
          }
        })
      // this.getSeatInfo()
      // console.dir(this.availableRoom)
    },
    show_main_page() {
      this.main_page_available = true
      this.data_page_available = false
    },
    show_table_page(room_id) {
      this.main_page_available = false
      this.data_page_available = true
      this.updateTableData(room_id)
      let srOpenTime = this.availableRoom[room_id].srOpenTime
      let srCloseTime = this.availableRoom[room_id].srCloseTime

      let parts = srOpenTime.split(/[- :]/); // 使用正则表达式进行拆分
      // 注意：在构造 Date 对象时，月份是从 0 开始计数的，所以需要将月份减 1
      let date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
      console.log(this.available_time_local)
      this.available_time_local[0] = date
      parts = srCloseTime.split(/[- :]/);
      date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
      this.available_time_local[1] = date
    },


    // set_all_available_time()
    // {
    //   let now = this.available_time
    //   if(now== false){
    //     this.$message({
    //         message: "请输出时间范围",
    //         type: "success",
    //         duration: 3000

    //       })
    //       return
    //   }
    //   for (let i = 0; i < this.availableRoom.length; i++) {
    //       this.set_room_available(, now)
    //     }
    // },
    set_available_time() {
      let now = this.available_time
      if (now == false) {
        this.$message({
          message: `请选择时间段`,
          type: "success",
          duration: 3000

        })
        return
      }
      console.log(now)
      let hours = now[0].getHours().toString().padStart(2, '0');
      let minutes = now[0].getMinutes().toString().padStart(2, '0');
      let seconds = now[0].getSeconds().toString().padStart(2, '0');
      const srOpenTime = `1970-01-01 ${hours}:${minutes}:${seconds}`;
      hours = now[1].getHours().toString().padStart(2, '0');
      minutes = now[1].getMinutes().toString().padStart(2, '0');
      seconds = now[1].getSeconds().toString().padStart(2, '0');
      const srCloseTime = `1970-01-01 ${hours}:${minutes}:${seconds}`;

      for (let i = 0; i < this.availableRoom.length; i++) {
        let room = this.availableRoom[i]
        this.availableRoom[i].srOpenTime = srOpenTime
        this.availableRoom[i].srCloseTime = srCloseTime
        console.log(window.localStorage.getItem("token"))
        console.log(room.srId)
        console.log(srOpenTime)
        console.log(room.srIsAvailable)

        this.$axios({
          method: 'post',
          url: '/api/study_rooms/update_availability',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            "token": window.localStorage.getItem("token"),
            "srId": room.srId,
            "srOpenTime": srOpenTime,
            "srEndTime": srCloseTime,
            "srIsAvailable": room.srIsAvailable
          }
        }).then((response) => {
          this.$message({
            message: `${room.srName}修改成功`,
            type: "success",
            duration: 3000

          })

        })
          .catch(function (error) {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              console.log(error.response);
              console.log('set_available_time错误');
            }
          })
      }
    },
    set_available_time_local(room_id) {
      let now = this.available_time_local
      if (now == false) {
        this.$message({
          message: `请选择时间段`,
          type: "success",
          duration: 3000

        })
        return
      }
      console.log(now)
      let hours = now[0].getHours().toString().padStart(2, '0');
      let minutes = now[0].getMinutes().toString().padStart(2, '0');
      let seconds = now[0].getSeconds().toString().padStart(2, '0');
      const srOpenTime = `1970-01-01 ${hours}:${minutes}:${seconds}`;
      hours = now[1].getHours().toString().padStart(2, '0');
      minutes = now[1].getMinutes().toString().padStart(2, '0');
      seconds = now[1].getSeconds().toString().padStart(2, '0');
      const srCloseTime = `1970-01-01 ${hours}:${minutes}:${seconds}`;


      let room = this.availableRoom[room_id]
      this.availableRoom[room_id].srOpenTime = srOpenTime
      this.availableRoom[room_id].srCloseTime = srCloseTime

      this.$axios({
        method: 'post',
        url: '/api/study_rooms/update_availability',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          "token": window.localStorage.getItem("token"),
          "srId": room.srId,
          "srOpenTime": srOpenTime,
          "srEndTime": srCloseTime,
          "srIsAvailable": room.srIsAvailable
        }
      }).then((response) => {
        this.$message({
          message: `${room.srName}修改成功`,
          type: "success",
          duration: 3000

        })

      })
        .catch(function (error) {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response);
            console.log('set_available_time错误');
          }
        })

    }
    ,
    show_dialog(ID) {
      this.dialogVisible = true
      let exp = null
      for (let i of this.seatInfo) {
        for (let j of i)
          if (j.seatId == ID) {
            exp = j
            break
          }
      }
      console.log(exp.reservations)
      this.dialogTable = exp.reservations


    },
    update_availability(id, available) {
      let isAvailable = Boolean()

      if (available == "是") {
        isAvailable = false
      } else {
        isAvailable = true
      }
      console.log(typeof (id))
      console.log(isAvailable)
      this.$axios({
        method: 'post',
        url: '/api/seat/update_availability',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          "token": window.localStorage.getItem("token"),
          "seatId": id,
          "isAvailable": isAvailable
        }
      }).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 3000

        })
        this.seatInfo = []
        this.getSeatInfo()
        for (var k = 0; k < this.tableData.length; k++) {
          if (this.tableData[k].seatID == id) {
            if (isAvailable == true) {
              this.tableData[k].seatIsAvailable = "是"
            } else {
              this.tableData[k].seatIsAvailable = "否"
            }


          }
        }


      })
        .catch(function (error) {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response);
            console.log('update_availability错误');
          }
        })


    },
    getspParameterValue() {

      this.$axios.get('/api/system_parameters/show', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          "token": window.localStorage.getItem("token")
        }
      })
        .then((response) => {

          this.spParameterValue = Number.parseInt(response.data.systemParameters[0].spParameterValue)
          //console()
        })
        .catch(function (error) {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response);
            console.log(error.response.status);
            console.log(window.localStorage.getItem("token"))
            console.log('错误');
          }
        })


    },
    changespParameterValue() {

      ///todo 发送后端
      this.$axios({
        method: 'post',
        url: '/api/system_parameters/update',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          "token": window.localStorage.getItem("token"),
          "spId": 1,
          "spParameterValue": this.spParameterValue.toString()
        }
      }).then((response) => {

        if (response.data.status == "success") {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 3000
          })
        } else {
          this.$message({
            message: "修改失败",
            type: "error",
            duration: 3000
          })
        }
      })
        .catch(function (error) {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response);
            console.log(error.response.status);
            console.log('错误');
          }
        })
    }
  }
}

</script>


<style>
.my-divider {
  height: 1px;
  background-color: rgb(190, 187, 187);

}

.header {
  background-color: rgb(76, 76, 219);
  color: white;
  text-align: center;
  padding: 30px;
}
</style>

