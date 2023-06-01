<template>
<div id="main">
    <!-- 菜单栏 -->
    <Layout >
        <div style="border-bottom:20px solid #E1E2E6;">
            <el-header id="header" style="text-align:left">
                <label to="/welcome" style="font-weight:bold; color:#204A90;font-size:1.1rem; cursor:pointer">
                    图书馆选座系统
                </label>
                <img @click="logout" style="width:20px;height:20px;cursor:pointer" src="../assets/形状10.png" alt="">
            </el-header>
        </div>
        
        <Layout id="ly" >
            <el-container>
            <el-aside hide-trigger class="trigger" style="border-right:15px solid #E1E2E6;width:15%;height:650px;">
                 <el-menu :theme="theme3" active-name="1" style="color:#1F3F62!important">
                    <el-menu-item index="1" to="/choosingroom">
                    <el-icon><setting /></el-icon>
                    <router-link style="color:#204A90;text-decoration:none;font-weight:bold;font-size:17px;display:inline-block;height:inherit; width: 100%;" to="/choosingroom">座位选择</router-link>
                    </el-menu-item>

                    <el-menu-item index="2" to="/signin">
                    <el-icon><setting /></el-icon>
                    <router-link style="color:#204A90;text-decoration:none;font-weight:bold;font-size:17px;display:inline-block;height:inherit; width: 100%;" to="/signin">座位签到</router-link>
                    </el-menu-item>

                    <el-menu-item index="3" to="/history">
                    <el-icon><setting /></el-icon>
                    <router-link style="color:#204A90;text-decoration:none;font-weight:bold;font-size:17px;display:inline-block;height:inherit; width: 100%;" to="/history">预约历史</router-link>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 右侧内容栏控制 -->
            <el-main>
                <Content >
                <transition
                mode="out-in"
                name="fade"
                >
                    <router-view style="height:35rem;background-color: #fff;overflow-x:hidden;overflow-y:auto"></router-view>
                </transition>
                </Content>
            </el-main>
            </el-container>
            
            
        </Layout>
    </Layout>
    
</div>
  
</template>

<script >
// import sourcemanagement from '../components/source-management'
// import welcome from '../components/welcome'
// import datasearch from '../components/datasearch'
// import datapush from '../components/datapush'
// import columnsetting from '../components/columnsetting'
// import usersetting from '../components/columnsetting'
// import authsetting from '../components/authsetting'
// import securesetting from '../components/securesetting'
// import departmentsetting from '../components/departmentsetting'
import choosingseat from '../components/choosingseat'
import signin from '../components/signin.vue'
import history from '../components/history'

export default {
  data () {
    return {
                theme3: 'dark',
                id: 0,
        }
  },

  components: {
      choosingseat,
      signin,
      history,
  },

  computed: {

  },

  created:function(){
        // var node = document.getElementById('lay');
        // node.style.height = '700px'
        // console.log('height:' + document.body.clientWidth)
        localStorage.setItem("id", "0");
        console.log(localStorage.getItem("id"))
        
  },

  mounted() {
    //   var layout = document.getElementById('ly');
      console.log('get');
    //   div.style.cssText = 'height:800px'
  },

  methods: {
      back(){
            this.id = 0;
            this.$nextTick(() => {
                this.active = '2-1';
                this.$refs.menu.updateActiveName();
        });
      
      },
      logout(){
            this.$message({
                  message: "登出成功",
                  type: "success",
                  duration: 3000
                });
            window.sessionStorage.setItem("token",null);
                // window.sessionStorage.setItem("mobile",this.loginform.mobile);
            window.localStorage.setItem("user_id",null);
            setTimeout("window.location.href='/#/'",1000);
      },
  },
}
</script>

<style scoped>

#main{
    padding: 0;
    margin: 0;
    background-color: #fff;
}

.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

#header{
   background-color: #F1F8FF;
   display: flex;
   justify-content: space-between;
   align-items:center
}

.fade-enter-active {
  animation: fadeIn 0s;
}
.fade-leave-active {
  animation: fadeOut 0s;
}

.trigger{
     color:#1F3F62!important
}

#ly{
    height:35rem;
}
</style>