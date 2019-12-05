import axios from 'axios'
import { Loading } from 'element-ui'
import swal from 'sweetalert2'
const instance = axios.create({
  baseURL: '/backend'
})
instance.defaults.timeout = 5000

instance.addPersistentHeader = (name, value) => {
    instance.defaults.headers.common[name] = value
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  instance.loading = Loading.service({
    lock: true,
    text: 'Loading',
    body: true,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return config;
}, function (error) {
  // 对请求错误做些什么
  if (instance.loading) {
    instance.loading.close()
  }
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (instance.loading) {
    instance.loading.close()
  }
  return response.data;
}, function (error) {
  if (instance.loading) {
    instance.loading.close()
  }
  const {response: {data: {errMsg: message = '未知错误'}}} = error
  swal({
    title: '操作失败!',
    text: message,
    type: 'error',
    confirmButtonClass: 'el-button el-button--danger',
    confirmButtonText: 'OK',
    buttonsStyling: false
  })
  // 对响应错误做点什么
  return Promise.reject(error);
});

const HttpPlugin = {
  install (Vue) {
    instance.$vue = Vue
    Vue.mixin({
      data () {
        return {
          http: instance
        }
      }
    });

    Object.defineProperty(Vue.prototype, '$http', {
      get () {
        return this.$root.http
      }
    });
  }
}

export default HttpPlugin