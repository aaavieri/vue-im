<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            interval: 0
        }
    },
    computed: {
        login() {
            return this.$store.imServerStore.getters.serverChatEn.login;
        }
    },
    watch: {
        login(value) {
            if (value) {
                this.refreshToken()
            }
        }
    },
    methods: {
        refreshToken() {
            this.interval = setInterval(() => {
                this.$http.post('serverApi/refreshToken').then(({data: {token} = {}}) => {
                    if (token) {
                        this.$http.addPersistentHeader('token', token)
                    }
                })
            }, 7000 * 1000)
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
};
</script>

<style>
#app {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-y: hidden;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
}
</style>
