<!-- 会话记录 -->
<template>
    <div class="imRecord-wrapper">
        <header class="header">
            <div class="kf-info-wrapper">
                <img class="kf-avatar" :src="storeServerChatEn.avatar" />
                <span class="kf-name position-h-v-mid">{{storeServerChatEn.serverChatName}}</span>
            </div>
            <div class="client-info-wrapper">
                <!--<p>-->
                    <!--<i class="fa fa-user on-line"></i>{{storeCurrentChatEnlist.length}}-->
                <!--</p>-->
                <i class="fa fa-user on-line"></i>{{storeCurrentChatEnlist.length}}
                <el-button icon="el-icon-search" style="border: 0" circle @click="doSearch"/>
            </div>
        </header>
        <main class="main">
            <div v-if="storeCurrentChatEnlist.length>0" class="item-list">
                <div class="item" v-for="(tmpEn, index) in storeCurrentChatEnlist" :key="index" @click="selectChat(tmpEn)" v-bind:class="{ active: selectedChatEn!=null && tmpEn.clientChatId==selectedChatEn.clientChatId}">
                    <!--<div class="followicon-wrapper">-->
                        <!--<i class="iconfont icon-zhidingwujiaoxing position-h-v-mid" :class="{ active: tmpEn.isFollow}" @click.stop="toggleFollowIcon(tmpEn)"></i>-->
                    <!--</div>-->
                    <!-- 客户端头像 -->
                    <div class="platicon-wrapper">
                        <img v-if="tmpEn.avatar" class="kf-img position-h-v-mid" :src="tmpEn.avatar">
                        <div v-else class="header-img position-h-v-mid" :class="getBgClass(tmpEn.clientChatName)">{{tmpEn.clientChatName.substr(0,1)}}</div>
                    </div>
                    <div class="info-wrapper">
                        <p class="first-p">
                            <span class="name">{{tmpEn.clientChatName}}</span>
                            <span class="lastMsgTime">{{getLastMsgTimeStr(tmpEn.lastMsgTime)}}</span>
                        </p>
                        <p class="second-p">
                            <span class="lastMsgContent" v-html="tmpEn.lastMsgContent"></span>
                            <el-badge class="newMsgCount" :value="tmpEn.newMsgCount" :max="99" v-show="tmpEn.newMsgCount>0"></el-badge>
                        </p>
                    </div>
                    <div class="followicon-wrapper">
                        <el-button size="small" type="success" class="download-button" icon="el-icon-download" circle @click="download(tmpEn)" />
                    </div>
                </div>
            </div>
            <div v-else-if="storeCurrentChatEnlist.length === 0" class="empty-wrapper">
                <div class="content">
                    <i class="iconfont fa fa-commenting-o"></i>
                    <p class="title">当前没有会话</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import swal from 'sweetalert2'
export default {
    data() {
        return {};
    },
    computed: {
        selectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        },
        // 当前会话列表
        storeCurrentChatEnlist() {
            return this.$store.imServerStore.getters.currentChatEnlist;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        }
    },
    watch: {},
    methods: {

        download: function (en) {
            swal({
                title: `下载客户【${en.clientChatName}】的记录`,
                input: 'radio',
                inputOptions: {
                    0: '仅限本客服',
                    1: '全体客服'
                },
                inputValidator: (value) => {
                    if (!value) {
                        return '您需要选择下载范围'
                    }
                }
            }).then(({value = -1}) => {
                if (value === -1) {
                    return
                }
                this.$http({
                    url: `serverApi/download/${value}/${this.storeServerChatEn.channelId}/${en.clientChatId}`,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then(({data, headers: {filename}}) => {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                })
            })
        },
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
                        console.log(data)
                    }
                })
            })
        },
        /**
         * 选中当前列表的chat
         * @param {Object} en call实体类
         */
        selectChat: function(en) {
            this.$store.imServerStore.dispatch('selectChat', { clientChatId: en.clientChatId });
            this.$emit('selectedChat', {}); // 事件上传
        },

        /**
         * 设置关注
         */
        toggleFollowIcon: function(en) {
            en.isFollow = !en.isFollow;
            // 排序
            this.$store.imServerStore.commit('sortCurrentChatEnlist', {});
        },

        /**
         * 获取背景class
         * @param {string} clientChatName 姓名
         */
        getBgClass: function(clientChatName) {
            var rs = clientChatName.charCodeAt(0) % 5;
            return 'bg' + rs;
        },

        /**
         * 返回chat对象的最后一次消息时间
         * @param {String|Date} sValue 传入的时间字符串
         */
        getLastMsgTimeStr: function(sValue) {
            if (sValue == null) {
                return '';
            }
            var rs = this.$ak.Utils.getDateTimeStr(sValue, 'H:i:s');
            return rs;
        }
    }
};
</script>

<style lang="less">
.imRecord-wrapper {
    width: 100%;
    height: 550px;
    overflow: hidden;
    border: 0px;
    & > .header {
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #e6e6e6;
        .kf-info-wrapper {
            position: relative;
            width: 150px;
            height: 50px;
            padding: 0 20px;
            .kf-avatar {
                width: 50px;
                height: 50px;
            }
            .kf-name {
                font-size: 12px;
            }
        }
        .client-info-wrapper {
            p:first-child {
                margin-bottom: 5px;
            }
            .fa {
                margin-right: 10px;
            }
        }
    }
    & > .main {
        height: calc(~'100% - 50px');
        position: relative;
        .item-list {
            height: calc(~'100% - 46px');
            overflow-y: auto;
            .item {
                position: relative;
                height: 63px;
                padding: 0px;
                border-bottom: 1px solid #e6e6e6;
                cursor: pointer;
                &.active,
                &:hover {
                    background-color: #0095ff;
                    .info-wrapper .first-p .name,
                    .info-wrapper .second-p .lastMsgContent,
                    .info-wrapper .first-p .lastMsgTime {
                        color: #eaf4fb;
                    }
                    .iconfont {
                        display: initial !important;
                    }
                }
                .followicon-wrapper {
                    position: relative;
                    float: left;
                    width: 25px;
                    height: 100%;
                    .iconfont {
                        display: none;
                        font-size: 12px;
                        color: #eaf4fb;
                        &.active {
                            display: initial;
                            color: #f9ce1d;
                        }
                    }
                }
                .platicon-wrapper {
                    position: relative;
                    float: left;
                    width: 50px;
                    height: 100%;
                    .header-img {
                        padding: 10px;
                        font-size: 16px;
                        color: #fff;
                        border-radius: 50%;
                        &.bg0 {
                            background-color: #ef7777;
                        }
                        &.bg1 {
                            background-color: #00bcd4;
                        }
                        &.bg2 {
                            background-color: #009688;
                        }
                        &.bg3 {
                            background-color: #ffc107;
                        }
                        &.bg4 {
                            background-color: #ff5722;
                        }
                    }
                    .kf-img {
                        width: 40px;
                        height: 40px;
                    }
                }
                .info-wrapper {
                    position: relative;
                    float: left;
                    width: 185px;
                    padding-top: 5px;
                    padding-left: 5px;
                    .first-p {
                        clear: both;
                        padding-top: 11px;
                        .name {
                            display: inline-block;
                            float: left;
                            width: 50%;
                            font-size: 14px;
                            color: #3e3e3e;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            text-align: left;
                            font-weight: bolder;
                        }
                        .lastMsgTime {
                            float: right;
                            font-size: 12px;
                            color: #8d8d8d;
                        }
                    }
                    .second-p {
                        clear: both;
                        padding-top: 5px;
                        line-height: 1.2;
                        .lastMsgContent {
                            display: inline-block;
                            width: 150px;
                            margin-top: 3px;
                            font-size: 12px;
                            color: #8d8d8d;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            text-align: left;
                            overflow: hidden;
                        }
                        .newMsgCount {
                            position: relative;
                            top: -3px;
                            float: right;
                            .el-badge__content {
                                border: 1px solid #ffffff00;
                            }
                        }
                    }
                    .third-p {
                        clear: both;
                        padding-top: 11px;
                        .name {
                            display: inline-block;
                            float: left;
                            width: 50%;
                            font-size: 14px;
                            color: #3e3e3e;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            text-align: left;
                            font-weight: bolder;
                        }
                        .lastMsgTime {
                            float: right;
                            font-size: 12px;
                            color: #8d8d8d;
                        }
                    }
                }
            }
        }
        .empty-wrapper {
            font-size: 16px;
            color: #3e3e3e;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .content {
                width: 170px;
                height: 200px;
                margin: 0px auto;
                text-align: center;
                color: #867c7c;
                .iconfont {
                    font-size: 90px;
                }
                .title {
                    margin-top: 25px;
                }
            }
        }
    }
}
.download-button {
    position: absolute;
    top: 50%;
    transform: translate(20%, -50%);
    /*border: 0;*/
}
/*.kf-img {*/
    /*width: 40px;*/
    /*height: 40px;*/
/*}*/
</style>
