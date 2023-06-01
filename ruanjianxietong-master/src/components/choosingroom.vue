<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="srName" label="自习室名称"  width="180" />
    <el-table-column prop="srCapacity" label="自习室容量"  width="180" />
    <el-table-column prop="srOpenTime" label="自习室开启时间" :formatter="stateFormat_StartTime" />
    <el-table-column prop="srCloseTime" label="自习室关闭时间" :formatter="stateFormat_EndTime"/>
    <el-table-column prop="srIsAvailable" :formatter="stateFormat_available" label="自习室是否可用" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="medium" @click="handleClick(scope)"
            >查看教室座位</el-button> 
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'history',
  data() {
    return {
      total:0,
      tableData:[
          {
            srName: '2016-05-03',
            srCapacity: 'Tom',
            srOpenTime: 'No. 189, Grove St, Los Angeles',
            srCloseTime:'canceled',
            srIsAvailable:'JA',
          },
]
    };
  },
  methods:{
    //借助moment.js进行转换
      stateFormat_available(row, column) {
            if (row.srIsAvailable) {
              return '可使用';
            }
            return '不可使用';
          }, 
      stateFormat_StartTime(row, column) {
            if (row.srOpenTime) {
              var dateValue1 = this.$moment(row.srOpenTime).format('YYYY-MM-DD HH:mm:ss');
              return dateValue1;
            }
            return ''
          },    
      stateFormat_EndTime(row, column) {
            if (row.srCloseTime) {
              var dateValue1 = this.$moment(row.srCloseTime).format('YYYY-MM-DD HH:mm:ss');
              return dateValue1;
            }
            return ''
          }, 
      handleClick(row){
            console.log(row.row)
            window.localStorage.setItem('srId',row.row.srId)
            setTimeout("window.location.href='choosingseat'",0);
      },
  },
  mounted() {
    this.$axios({
              method: 'post',
              url: '/api/study_rooms/available',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            }).then((response) => {
                console.log(response);
                // console.log(response.status);
                
                if(response.data.status == "success") {
                    this.tableData = response.data.data
                }
                else {
                  this.$message({
                    message: "获取教室信息失败",
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
