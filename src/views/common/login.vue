<template>
  <div class="login-wrapper">
    <div class="login-content">
      <div class="login-top">
        <div class="login-text">登录</div>
        <div class="login-title">
          <span class="title-text">组件管理中心</span>
        </div>
      </div>
      <div class="login-main">
        <el-form :model="dataForm" :rules="dataFormRules" ref="dataFormRef">
          <el-form-item prop="loginname" style="margin-bottom: 32px;">
            <el-input v-model="dataForm.loginname" placeholder="账号" size="large" autocomplete="new-password">
              <template #prefix>
                <el-icon class="el-input__icon"><user></user></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-bottom: 32px;">
            <el-input v-model="dataForm.password" type="password" placeholder="密码" size="large" autocomplete="new-password">
              <template #prefix>
                <el-icon class="el-input__icon"><lock></lock></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="dataSubmitHandle()" size="large" type="primary" style="width: 100%; margin-top: 20px;">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/login-api'
import { ElMessage } from 'element-plus'
import { addDynamicMenuRoutes } from '@/router'

export default {
  name: 'login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const dataForm = reactive({
      loginname: undefined,
      password: undefined
    })

    const dataFormRules =  {
      loginname: [{ required: true, message: '请输入账号', target: 'blue' }],
      password: [{ required: true, message: '请输入密码', target: 'blue' }]
    }

    const authorityRouteListComputed =  computed({
      get: () => store.state.user.authorityRouteList || sessionStorage.getItem('authorityRouteList')
    })

    const dataFormRef = ref()
    const dataSubmitHandle = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          loginApi(dataForm).then(({ code, data, message }) => {
            if (code === 200 || code === '200') {
              const { token, userData } = data
              const { uid, username, mobile } = JSON.parse(userData)
              store.commit('user/updateUserInfo', {
                userId: uid,
                userName: username,
                userPhone: mobile,
                userData: JSON.parse(userData)
              })
              sessionStorage.setItem('userId', uid)
              sessionStorage.setItem('userName', username)
              sessionStorage.setItem('userPhone', mobile)
              sessionStorage.setItem('token', token)
              sessionStorage.setItem('userData', userData)
              // 登录成功后拿到用户的角色信息、部门信息（后面的接口需要对应的部门信息）
              store.dispatch('user/initRoleListDataAction', uid).then((isSuccess) => {
                if (isSuccess) {
                  addDynamicMenuRoutes(authorityRouteListComputed.value)
                  router.replace({ name: 'overview-index' })
                }
              })
            } else {
              ElMessage.error(message)
            }
          })
        }
      })
    }

    return {
      dataForm,
      dataFormRef,
      dataFormRules,

      dataSubmitHandle
    }
  }
}
</script>

<style scoped lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-image: url(@/assets/img/img-bg.png);

  .login-content {
    position: relative;
    width: 500px;
    height: 418px;
    margin: 0 auto;
    border-radius: 12px;
    background-color: #FFFFFF;
    top: 50%;
    transform: translateY(-50%);

    .login-top {
      position: relative;
      top: -10%;
      width: 254px;
      height: 147px;
      margin: 0 auto;
      background-size: cover;
      background-image: url(@/assets/img/img-title.png);

      .login-text {
        position: relative;
        top: calc(100% - 44px);
        left: -64px;
        font-size: 24px;
        line-height: 24px;
        color: rgba(51, 51, 51, 1);
      }

      .login-title {
        display: flex;
        height: 32px;
        margin: 18px auto 0 auto;
        text-align: center;
        justify-content: center;

        .title-icon {
          height: 32px;
          line-height: 32px;
          font-size: 32px;
          color: rgba(255, 255, 255, 1);
        }

        .title-text {
          display: block;
          height: 32px;
          line-height: 32px;
          margin-left: 12px;
          color: rgba(255, 255, 255, 1);
          font-size: 24px;
        }
      }
    }
  }

  .login-main {
    position: relative;
    top: -10%;
    margin: 24px 40px;
  }
}
</style>
