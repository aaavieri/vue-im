<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {}
    },
    computed: {
    },
    watch: {},
    methods: {},
    // beforeDestroy() {
    //     clearInterval(this.interval)
    // }
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
