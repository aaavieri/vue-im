<template>
    <div class="page" :style="backStyle">
        <!--登陆界面start-->
        <div class="login-container">
            <h3>欢迎登陆</h3>
            <!--账号-->
            <div class="login_input">
                <div class='icon'>
                    <img alt="" src='../../assets/img/user_icon_copy.png'>
                </div>
                <input class="custom_input" id="login_id_input" type="text" placeholder="用户账号" />
                <div class='validation'>
                    <img alt="" src='../../assets/img/tick.png'>
                </div>
            </div>

            <!--密码-->
            <div class="login_input">
                <div class='icon'>
                    <img alt="" src='../../assets/img/lock_icon_copy.png'>
                </div>
                <input class="custom_input" id="password_input" type="password" placeholder="用户密码" />
                <div class='validation'>
                    <img alt="" src='../../assets/img/tick.png'>
                </div>
            </div>

            <!--验证码-->
            <p id="nowlogin">正在加载验证码......</p>
            <!--<div class="login_input">-->
            <!--<div class='icon'>-->
            <!--<img alt="" src='img/key.png'>-->
            <!--</div>-->
            <!--<input class="custom_input" type="text" placeholder="验证码" />-->
            <!--<div class='validation'>-->
            <!--<img alt="" src='img/tick.png'>-->
            <!--</div>-->
            <!--</div>-->


            <!--登陆按钮-->
            <div class="login_submit">
                <input type='button' id="login_btn" value='登录'>
            </div>


            <div class="to_register_btn">
                <h5>前往注册</h5>
            </div>
            <div class="find_password_btn">
                <h5>忘记密码</h5>
            </div>


        </div>
        <!--登陆界面end-->

        <!-- 注册界面 start -->

        <div class="register-container">
            <h3>欢迎注册livechat</h3>
            <!--账号-->
            <div class="register_input">
                <div class='icon'>
                    <img alt="" src='../../assets/img/user_icon_copy.png'>
                </div>
                <input class="custom_input" id="reg_loginid_input" type="text" placeholder="用户账号" />
                <div class='validation'>
                    <img alt="" src='../../assets/img/tick.png'>
                </div>
                <div class="tip_div">
                    <h5>账号已被注册</h5>
                </div>
            </div>

            <!--密码-->
            <div class="register_input">
                <div class='icon'>
                    <img alt="" src='../../assets/img/lock_icon_copy.png'>
                </div>
                <input class="custom_input" id="reg_password_input" type="password" placeholder="用户密码" />
                <div class='validation'>
                    <img alt="" src='../../assets/img/tick.png'>
                </div>

                <div class="tip_div">
                    <h5>密码不规范</h5>
                </div>

            </div>
            <!--确认密码-->
            <div class="register_input">
                <div class='icon'>
                    <img alt="" src='../../assets/img/lock_icon_copy.png'>
                </div>
                <input class="custom_input" id="reg_repeat_password_input" type="password" placeholder="确认密码" />
                <div class='validation'>
                    <img alt="" src='../../assets/img/tick.png'>
                </div>

                <div class="tip_div">
                    <h5>两次密码不一致</h5>
                </div>

            </div>

            <!--用户昵称-->
            <div class="register_input">
                <div class='icon'>
                    <img alt="" src='img/key.png'>
                </div>
                <input class="custom_input" id="reg_nickname" type="text" placeholder="用户昵称" />
                <div class='validation'>
                    <img alt="" src='../../assets/img/tick.png'>
                </div>

                <div class="tip_div">
                    <h5>请输入用户昵称</h5>
                </div>
            </div>


            <!--注册按钮-->
            <div class="register_submit">
                <input type='button' id="register_btn" value='注册'>
            </div>


            <div class="to_login_btn">
                <h5>前往登陆</h5>
            </div>
            <div class="find_password_btn">
                <h5>忘记密码</h5>
            </div>


        </div>

        <!-- 注册界面 end -->

        <!--找回密码界面 start-->
        <div class="find_password-container">
            <h3>施工中，敬请期待</h3>

            <div class="to_login_btn">
                <h5>前往登陆</h5>
            </div>
            <div class="to_register_btn">
                <h5>前往注册</h5>
            </div>


        </div>
        <!--找回密码界面 end-->
    </div>
</template>

<script>
    export default {
        name: 'login',
        computed: {
            backStyle () {
                const imgUrl = require('../../assets/img/Starry.jpg')
                return {
                    background: `url(${imgUrl})`
                }
            },
        }
    }
</script>

<style scoped>
.page {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-size: 16px;
    /*background-repeat: no-repeat;*/
    /*background-position: left top;*/
    /*background-color: #242645;*/
    color: #fff;
    font-family: 'Source Sans Pro';
    background-size: 100%;
    overflow: hidden;
}
body ::-webkit-input-placeholder {
    color: #4E546D;
}
input:-ms-input-placeholder{
    color: #CECFD2;opacity:1;
}

input::-webkit-input-placeholder{
    color: #CECFD2;opacity:1;
}

.find_password-container,
.login-container,
.register-container{
    position: absolute;
    /*top: 100px;*/
    left: 0;
    right: 0;
    margin: auto;
    top: 0;
    bottom: 0;

    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    background: #35394a;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
    /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='rgba(53, 57, 74, 0)', endColorstr='rgb(0, 0, 0)',GradientType=1 );
    width: 240px;
    height: 350px;
    padding: 50px 40px 40px 40px;

    /*transition: all 2s;*/
    /*-webkit-transition: all 2s;*/
}

.register-container,
.find_password-container{
    display: none;
}

.login_input,
.register_input{
    width: 100%;
    height: 40px;
    position: relative;
    /*margin-top: 15px;*/
}

.custom_input{
    color: #afb1be;
    width: 170px;
    margin-top: -2px;
    background: rgba(57, 61, 82, 0);
    left: 0;
    padding: 10px 35px;
    border-top: 2px solid rgba(57, 61, 82, 0);
    border-bottom: 2px solid rgba(57, 61, 82, 0);
    border-right: none;
    border-left: none;
    outline: none;
    font-family: 'Gudea', sans-serif;
    box-shadow: none;
}

/*左部图标*/
.icon{
    position: absolute;
    z-index: 1;
    left: 10px;
    top: 9px;
    opacity: .5;
}
/*右部打钩小图标*/
.validation{
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 8px;
    opacity: 0;
}

/*登陆按钮 start*/
.login_submit,
.register_submit{
    position: relative;
    top: 17px;
    left: 0;
    width: 80%;
    right: 0;
    margin: auto;
}
.login_submit input,
.register_submit input{
    border-radius: 50px;
    background: transparent;
    padding: 10px 50px;
    border: 2px solid #4FA1D9;
    color: #4FA1D9;
    text-transform: uppercase;
    font-size: 11px;
    -webkit-transition-property: background,color;
    transition-property: background,color;
    -webkit-transition-duration: .2s;
    transition-duration: .2s;
}
.login_submit input:focus,
.register_submit input:focus{
    box-shadow: none;
    outline: none;
}
.login_submit input:hover,
.register_submit input:hover {
    color: white;
    background: #4FA1D9;
    cursor: pointer;
    -webkit-transition-property: background,color;
    transition-property: background,color;
    -webkit-transition-duration: .2s;
    transition-duration: .2s;
}
/*登陆按钮 end*/

.find_password-container > .to_login_btn,
.register-container > .to_login_btn,
.login-container > .to_register_btn{
    position: absolute;
    bottom: 0px;
    right: 20px;
    cursor: pointer;
    color: #CECFD2;
    opacity:1;
}

.find_password-container > .to_register_btn,
.register-container > .find_password_btn,
.login-container > .find_password_btn{
    position: absolute;
    bottom: 0px;
    left: 20px;
    cursor: pointer;
    color: #CECFD2;
    opacity:1;
}

.to_login_btn:hover,
.to_register_btn:hover,
.find_password_btn:hover{
    color: #FFFFFF;
    text-decoration: underline;
}
.tip_div{
    position: absolute;
    /*width: 100%;*/
    width: 150px;
    top: 9px;
    right: -200px;
    text-align: left;
    /*margin-left: -40px;*/
    /*opacity: 0;*/
    display: none;
}
.tip_div h5{
    margin: 0;
    /*text-align: center;*/
}
#nowlogin{
    position: relative;
    font-size: 11px;
    width: 240px;
    color: white !important;
}
.geetest_holder.geetest_wind{
    position: relative !important;
    width: 240px !important;
    min-width: 200px !important;
    height: 40px !important;
    /*background-color: black !important;*/
    background: #35394a;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%) !important;
}
.geetest_holder.geetest_wind .geetest_btn{
    /*background: #000 !important;*/
    background: #35394a;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%) !important;
}
.geetest_holder.geetest_wind .geetest_radar_btn,
.geetest_holder.geetest_wind .geetest_success_btn{
    border: none !important;
    background: #000;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%) !important;
    /*opacity: 1 !important;*/
}

.geetest_holder.geetest_wind .geetest_radar_tip, .geetest_holder.geetest_wind .geetest_success_radar_tip{
    font-size: 12px !important;
    color: white !important;
}
.geetest_holder.geetest_mobile.geetest_ant.geetest_embed{
    background: #35394a;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%) !important;
}
</style>
