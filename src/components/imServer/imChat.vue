<!-- 聊天记录 -->
<template>
    <div class="imChat-wrapper">
        <!-- 头部 -->
        <header class="imChat-header">
            <span class="name">{{storeSelectedChatEn.clientChatName}}({{storeSelectedChatEn.phoneNum ? storeSelectedChatEn.phoneNum : '未绑定号码'}})</span>
            <span class="time">{{getAccessTimeStr(storeSelectedChatEn.accessTime)}}</span>
            <span v-show="storeSelectedChatEn.state==='on' " class="on-line">进行中</span>
            <span v-show="storeSelectedChatEn.state==='off' " class="off-line ">已关闭</span>
        </header>
        <main class="imChat-main">
            <!-- 聊天框区域 -->
            <common-chat ref="common_chat" :chatInfoEn="storeSelectedChatEn" :oprRoleName="'server'" @sendMsg="sendMsg" @moreMsg="moreMsg"></common-chat>
        </main>
    </div>
</template>

<script>
import commonChat from '@/components/common/common_chat.vue';
import swal from 'sweetalert2';

export default {
    components: {
        commonChat: commonChat
    },
    data() {
        return {};
    },
    computed: {
        storeSelectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        },
        storeHaveNewMsgDelegate() {
            return this.$store.imServerStore.getters.haveNewMsgDelegate;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        }
    },
    watch: {
        storeSelectedChatEn(value) {
            this.$refs.common_chat.goEnd();
        },
        storeHaveNewMsgDelegate(value) {
            this.$refs.common_chat.goEnd();
        }
    },
    methods: {
        /**
         * 发送消息
         * @param {Object} rs 回调对象
         */
        sendMsg: function(rs) {
            var msg = rs.msg;
            msg.role = 'server';
            msg.avatar = this.storeServerChatEn.avatar;
            // 1.socket发送消息
            this.$store.imServerStore.dispatch('sendMsg', {
                clientChatId: this.storeSelectedChatEn.clientChatId,
                serverChatId: this.storeServerChatEn.serverChatId,
                sessionId: this.storeSelectedChatEn.sessionId,
                msg: msg
            });

            // 2.附加到此chat对象的msg集合里
            // this.$store.imServerStore.dispatch('addChatMsg', {
            //     clientChatId: this.storeSelectedChatEn.clientChatId,
            //     msg: msg,
            //     successCallback: function() {
            //         rs.successCallbcak && rs.successCallbcak();
            //     }
            // });
        },

        /**
         * 查看更多聊天记录
         */
        moreMsg: function({sessionId, failCallback, successCallback}) {
            this.$http.post('/serverApi/moreMsg', {openId: this.storeSelectedChatEn.clientChatId, sessionId}).then(({success, errMsg, data}) => {
                if (!success) {
                    failCallback && failCallback()
                    swal({
                        title: '获取记录失败!',
                        text: errMsg,
                        type: 'error',
                        confirmButtonClass: 'el-button el-button--danger',
                        confirmButtonText: 'OK',
                        buttonsStyling: false
                    })
                } else {
                    this.$store.imServerStore.commit('addSessions', {
                        sessionList: [data],
                        serverName: data.serverUserName
                    });
                    successCallback && successCallback()
                }
            }).catch(error => {
                swal({
                    title: '获取记录失败!',
                    text: error.errMsg || '未知错误',
                    type: 'error',
                    confirmButtonClass: 'el-button el-button--danger',
                    confirmButtonText: 'OK',
                    buttonsStyling: false
                })
                failCallback && failCallback()
            })
        },

        goEnd: function() {
            this.$refs.common_chat.goEnd();
        },

        /**
         * 获取chat的访问时间
         * @param {Date} accessTime 问时间
         */
        getAccessTimeStr: function(accessTime) {
            return this.$ak.Utils.getDateTimeStr(accessTime, 'Y-m-d H:i:s');
        }
    },
    mounted() {}
};
</script>
<style lang="less">
.imChat-wrapper {
    .imChat-header {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        padding-left: 10px;
        border-bottom: 1px solid #e6e6e6;
        font-size: 16px;
        span {
            margin-right: 20px;
        }
        .on-line {
            color: #70ed3a;
        }
        .off-line {
            color: #bbbbbb;
        }
    }
    .imChat-main {
        height: calc(~'100% - 50px');
    }
}
</style>

