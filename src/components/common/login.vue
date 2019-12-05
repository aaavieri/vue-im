<template lang="html">
    <div class="">
        <el-row>
            <el-col :span="10" :offset="7">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="用户登录" name="first">
                        <el-col >
                            <el-form :model="dynamicValidateForm" label-width="100px" ref="dynamicValidateForm">
                                <el-form-item
                                    prop="username"
                                    label="用户"
                                    :rules="rules.username"
                                >
                                    <el-input v-model="dynamicValidateForm.username"></el-input>
                                </el-form-item>
                                <el-form-item
                                    prop="password"
                                    label="密码"
                                    :rules = "rules.password"
                                >
                                    <el-input type="password" v-model="dynamicValidateForm.password"></el-input>
                                </el-form-item>
                                <el-button type="primary" @click="submitForm('dynamicValidateForm')">登录</el-button>
                                <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
                            </el-form>
                        </el-col>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import swal from 'sweetalert2'
    export default {
        name: 'login',
        data() {
            return {
                dynamicValidateForm: {
                    username: '',
                    password: ''
                },
                activeName: 'first',
                // 输入校验
                rules: {
                    username: {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    password: {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                }
            }
        },
        methods: {
            handleClick(tab, event) {},
            // 重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 登录
            submitForm(formName) {
                this.$http.post('/users/login', {
                    userId: this.dynamicValidateForm.username,
                    password: this.dynamicValidateForm.password
                }).then(({success, data, errMsg: text}) => {
                    if (!success) {
                        swal({
                            title: '登录失败!',
                            text,
                            type: 'error',
                            confirmButtonClass: 'el-button el-button--error',
                            confirmButtonText: 'OK',
                            buttonsStyling: false
                        })
                    } else {
                        this.$http.addPersistentHeader('token', data.token)
                        this.$store.imServerStore.commit('saveLoginUserInfo', data)
                        this.$router.push('/imServer')
                    }
                })
            }
        },
        computed: {
            storeServerChatEn() {
                return this.$store.imServerStore.getters.serverChatEn;
            }
        },
        created() {
            if (this.storeServerChatEn.login) {
                swal({
                    title: '提示!',
                    text: '您已经登录',
                    type: 'info',
                    confirmButtonClass: 'el-button el-button--primary',
                    confirmButtonText: 'OK',
                    buttonsStyling: false
                }).then(() => {
                    this.$router.forward();
                })
            }
        }
    }
</script>

<style scoped>

</style>
