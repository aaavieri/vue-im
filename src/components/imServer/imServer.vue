<!-- im服务端入口 -->
<template>
    <div class="imServer-wrapper">
        <main class="imServer-main">
            <im-record class="item im-record" @selectedChat="selectedChat()">
                <el-menu slot="header-right" class="menu el-menu-demo" default-active="1-1" mode="horizontal">
                    <el-submenu index="1-1">
                        <template slot="title"><i class="el-icon-menu"></i></template>
                        <el-menu-item index="2-1"><el-button size="medium" icon="el-icon-search" style="border: 0" @click="doSearch">搜索</el-button></el-menu-item>
                        <el-menu-item index="2-2">
                            <el-popover
                                placement="top"
                                width="160"
                                v-model="visible">
                                <p>这是一段内容这是一段内容确定删除吗？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
                                </div>
                                <el-button size="medium" slot="reference" icon="el-icon-search" style="border: 0" @click="doSearch">搜索</el-button>
                            </el-popover>
                        </el-menu-item>
                        <el-menu-item index="2-3"><el-button size="medium" icon="el-icon-close" style="border: 0" @click="logout">退出</el-button></el-menu-item>
                    </el-submenu>
                </el-menu>
            </im-record>
            <im-chat v-if="storeSelectedChatEn!=null" ref="im_chat" class="item im-chat"></im-chat>
        </main>
        <el-dialog title="搜索结果" :visible.sync="dialogTableVisible">
            <el-table :data="searchResult" height="500" border style="padding: 10px">
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary"
                                   size="mini" @click="getWholeSession(scope.row)">完整会话</el-button>
                    </template>
                </el-table-column>
                <el-table-column property="history.displayTime" label="消息时间" width="170"/>
                <!--<el-table-column property="client.userName" label="发送者" width="100"></el-table-column>-->
                <el-table-column
                    label="发送者"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.history.type === 0" style="margin-left: 10px">{{ scope.row.client.userName }}</span>
                        <span v-else>{{ storeServerChatEn.serverChatName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="消息内容"
                    width="250">
                    <template slot-scope="scope">
                        <span v-for="(message) in scope.row.history.messageList" :class="message.isDelimiter ? 'search-keyword' : ''">{{ message.content }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
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
            socket: null,
            dialogTableVisible: false,
            searchResult: []
        };
    },
    computed: {
        storeSelectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        },
        storeCurrentChatEnlist() {
            return this.$store.imServerStore.getters.currentChatEnlist;
        },
        serverUserToken() {
            return this.$store.imServerStore.getters.serverChatEn.serverChatToken;
        }
    },
    watch: {
        serverUserToken(value) {
            if (value) {
                this.$http.addPersistentHeader('token', value)
            }
        }
    },
    methods: {
        /**
         * 选中了会话
         */
        selectedChat: function() {},
        doSearch: function () {
            const inputOptions = ['<option value="0">全部客户</option>',
                ...this.storeCurrentChatEnlist.map(chat => `<option value="${chat.clientChatId}">客户【${chat.clientChatName}】</option>`)]
            swal({
                title: `搜索与客户沟通的记录`,
                html: `<span class="swal2-label">请输入关键字，若想搜索多个则用半角空格分开</span>
                    <input id="swal-input-keyword" class="swal2-input">
                    <select id="swal-select-openid" class="swal2-select" style="display: flex;">
                    ${inputOptions.join('\n')}
                    </select>`,
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        document.getElementById('swal-input-keyword').value,
                        document.getElementById('swal-select-openid').value
                    ]
                },
                inputValidator: (value) => {
                    if (!value) {
                        return '您需要选择查询范围'
                    }
                }
            }).then(({value = ['', -1]}) => {
                const [keyword, openId] = value
                if (openId === -1) {
                    return
                }
                this.$http.post('serverApi/searchHistory', {keyword, openId}).then(({success, errMsg, data}) => {
                    if (!success) {
                        swal({
                            title: '检索失败!',
                            text: errMsg,
                            type: 'error',
                            confirmButtonClass: 'el-button el-button--danger',
                            confirmButtonText: 'OK',
                            buttonsStyling: false
                        })
                    } else {
                        this.dialogTableVisible = true
                        this.searchResult = data
                    }
                })
            })
        },
        logout: function () {
            this.$http.post('users/logout', {serverUserId: this.storeServerChatEn.serverChatId}).then(({success, errMsg}) => {
                if (!success) {
                    swal({
                        title: '退出失败!',
                        text: errMsg || '未知错误',
                        type: 'error',
                        confirmButtonClass: 'el-button el-button--danger',
                        confirmButtonText: 'OK',
                        buttonsStyling: false
                    })
                } else {
                    swal({
                        title: '退出成功!',
                        text: '即将跳转登录页面',
                        type: 'success',
                        confirmButtonClass: 'el-button el-button--success',
                        confirmButtonText: 'OK',
                        buttonsStyling: false
                    }).then(() => this.$router.push('/login'))
                }
            })
        },
        getWholeSession: function ({history, client}) {
            const {historyId, sessionId} = history
            const chat = this.storeCurrentChatEnlist.find(chat => chat.msgList.find(msg => msg.historyId === historyId))
            const closeFunc = () => {
                this.dialogTableVisible = false
                if (this.$refs.im_chat) {
                    this.$refs.im_chat.$refs.common_chat.goHistoryById(historyId)
                }
            }
            if (chat) {
                this.$store.imServerStore.dispatch('selectChat', { clientChatId: chat.clientChatId });
                this.$nextTick(closeFunc)
            } else {
                this.$http.get(`serverApi/getSession/${sessionId}`).then(({success, errMsg, data: session}) => {
                    if (!success) {
                        swal({
                            title: '查看会话失败!',
                            text: errMsg,
                            type: 'error',
                            confirmButtonClass: 'el-button el-button--danger',
                            confirmButtonText: 'OK',
                            buttonsStyling: false
                        })
                    } else {
                        session.clientChatEn = {
                            clientChatId: client.openId,
                            clientChatName: client.userName
                        }
                        this.$store.imServerStore.commit('addSessions', {
                            sessionList: [session],
                            serverName: this.storeServerChatEn.serverChatName
                        })
                        this.$store.imServerStore.dispatch('selectChat', { clientChatId: session.clientChatEn.clientChatId });
                        this.$nextTick(closeFunc)
                    }
                })
            }
        },
    },
    created() {
    },
    mounted() {
        this.$http.get('serverApi/getInitData').then(({success, errMsg, data = {}}) => {
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
                const {sessionList, server} = data
                this.$store.imServerStore.commit('saveUserInfo', server)
                this.$store.imServerStore.commit('addSessions', {sessionList})
                this.$store.imServerStore.dispatch('SERVER_ON');
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
