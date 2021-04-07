<template>
  <div class="login-container">
    <!--
      el-form 表单组件
        每个表单项都必须使用 el-form-item组件包裹
    -->
    <!--
        配置form表单验证
        1.必须给el-form组件绑定model为表单数据对象
        2.给需要验证的表单项el-form-item绑定prop属性
          注意：prop属性需要指定表单对象中的数据名称
        3.通过el-form组件的rules属性配置验证规则

        手动触发表单验证：
          1.给el=form 设置 ref 起个名字(随便起名，不要重复即可)
          2.通过 ref 获取 el-form 组件，调用组件的validate进行校验
       -->
    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
    >
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">
          我已阅读并同意用户协议和隐私条款
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onLogin"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },

      // checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登陆的loading状态
      formRules: { // 表单验证规则配置
        // 要验证的数据名称：规则列表
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            required: true,
            // message: '请勾选同意用户协议',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onLogin () {
      // 获取表单数据(根据接口要求绑定数据)
      // const user = this.user
      // 表单验证
      // validate 方法是异步的
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }
        // 验证通过，请求登录
        this.login()
      })
    },

    login () {
      // 开启登陆中 loading...
      this.loginLoading = true
      // 对于代码中的请求操作
      // 1.接口请求可能需要重用
      // 2.实际工作中，接口非常容易变动。盖起来麻烦
      // 建议：把所有的请求都封装成函数，然后统一的组织到模块中进行管理
      // 这样做的好处是：管理维护更方便，也好重用
      login(this.user)
        .then((res) => {
          console.log(res)
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          // 关闭loading
          this.loginLoading = false
          // 将接口返回的用户相关数据存储到本地存储，方便应用中的数据共享
          // 本地存储只能存储字符串
          // 如果需要存储对象、数组类型的数据，则把它们转为ISON格式字符串进行存储
          window.localStorage.setItem('user', JSON.stringify(res.data.data))
          // 跳转到首页
          this.$router.push({
            name: 'home'
          })
        })
        .catch((err) => {
          console.log('登陆失败', err)
          this.$message.error('登陆失败，手机号或验证码错误')
        })
      // 关闭loading
      this.loginLoading = false
      // 处理后端响应结果
      // 成功：xxx
      // 失败：xxx
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('./bck.jpg') no-repeat;
  background-size: cover; // 背景填充模式
  .login-head {
    width: 250px;
    height: 60px;
    background: url('./logo.jpg') no-repeat;
    padding-bottom: 20px;
  }
}
.login-form {
  background-color: #fff;
  padding: 15px 50px;
  min-width: 200px;
  .login-btn {
    width: 100%;
  }
}
</style>
