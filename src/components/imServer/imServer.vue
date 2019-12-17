<!-- im服务端入口 -->
<template>
    <div class="imServer-wrapper">
        <main class="imServer-main">
            <im-record class="item im-record" @selectedChat="selectedChat()"></im-record>
            <im-chat v-if="storeSelectedChatEn!=null" ref="im_chat" class="item im-chat"></im-chat>
        </main>
    </div>
</template>

<script >
import imRecord from './imRecord.vue';
import imChat from './imChat.vue';
import swal from 'sweetalert2';

export default {
    components: {
        imRecord: imRecord,
        imChat: imChat
    },
    data() {
        return {
            socket: null
        };
    },
    computed: {
        storeSelectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        }
    },
    watch: {},
    methods: {
        /**
         * 选中了会话
         */
        selectedChat: function() {}
    },
    created() {
    },
    mounted() {
        this.$http.post('users/checkLogin').then(({success, errMsg}) => {
            if (!success) {
                swal({
                    title: '错误!',
                    text: errMsg || '您尚未登录',
                    type: 'error',
                    confirmButtonClass: 'el-button el-button--danger',
                    confirmButtonText: 'OK',
                    buttonsStyling: false
                }).then(() => {
                    this.$router.push('/');
                })
            } else {
                this.$http.get('serverApi/getClientList').then(({success, errMsg, data: {sessionList, server}}) => {
                    if (!success) {
                        swal({
                            title: '获取用户列表失败!',
                            text: errMsg || '未知错误',
                            type: 'error',
                            confirmButtonClass: 'el-button el-button--danger',
                            confirmButtonText: 'OK',
                            buttonsStyling: false
                        })
                    } else {
                        this.$store.imServerStore.commit('saveUserInfo', server)
                        this.$store.imServerStore.commit('addSessions', {sessionList})
                        this.$store.imServerStore.dispatch('SERVER_ON');
                    }
                })
            }
        })
    },
    destroyed() {
        this.$store.imServerStore.dispatch('SERVER_OFF');
    }
};
</script>

<style lang="less">
@import '../../common/css/base.less';

.imServer-wrapper {
    #common-wrapper();
}

.imServer-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    .imServer-main {
        height: 100%;
        max-width: 100%;
        position: relative;
        & > .item {
            float: left;
            border-right: 1px solid #e6e6e6;
            height: 100%;
        }
        & > .im-record {
            width: 280px;
        }
        & > .im-chat {
            width: calc(~'99% - 280px');
        }
    }
}
</style>
