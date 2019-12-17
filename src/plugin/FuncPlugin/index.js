import crypto from 'crypto'

const Func = {
    dateFormat: (date, fmt) => {
        if (!date) return ''
        if (typeof date === 'number') date = new Date(date)
        let attributes = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "S": date.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
        for (let attr in attributes)
            if (new RegExp(`(${attr})`).test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (attributes[attr]) : (("00" + attributes[attr]).substr(("" + attributes[attr]).length)))
            }
        return fmt
    },
    strToDate: (str) => new Date(str.replace('T', ' ').replace(/-/g, '/')), //=> 2015/02/24 00:00:00,
    transferToMsg: ({message, messageType, type, ...other}) => {
        let contentType = 'text'
        switch (messageType) {
            case 2:
                contentType = 'image'
                break
            case 3:
                contentType = 'sound'
                break
        }
        return Object.assign({
            contentType,
            content: message,
            role: type === 0 ? 'client' : 'server'
        }, other)
    },
    md5 (str) {
        str = str || ''
        let md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    },
    getType (obj) {
        let type = Object.prototype.toString.call(obj)
        return /object\s(.*)]/.exec(type)[1]
    },
    isType (obj, type) {
        obj = this.getType(obj).toLowerCase()
        return obj === type
    },
    deepCopy (src) {
        // 若不是对象类型或是null类型，直接输出
        if (typeof src !== 'object' || src === null) {
            return src
        }

        let i;
        // 根据目标是Array类型还是object来设置目标参数的类型
        let target = this.isType(src, 'array') ? [] : {};
        for (i in src) {
            // 判断当前复制的对象是否为对象类型数据
            if (typeof src[i] === 'object') {
                target[i] = this.deepCopy(src[i]);
            } else {
                target[i] = src[i]
            }
        }
        return target
    },
    deepAssign (target) {
        let sources = Array.prototype.slice.apply(arguments).slice(1)
        // 若不是对象类型或是null类型，直接输出
        if (typeof target !== 'object' || target === null || sources.length === 0) {
            return target
        }

        let source, index
        for (index in sources) {
            source = sources[index]
            if (!source || !this.isType(source, 'object')) {
                continue
            }
            let key
            for (key in source) {
                // if (!source[key]) {
                //   continue
                // }
                if (typeof source[key] === 'object') {
                    target[key] = this.deepCopy(source[key])
                } else {
                    target[key] = source[key]
                }
            }
        }
        return target
    }
}

const FuncPlugin = {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          func: Func
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$func', {
      get () {
        return this.$root.func
      }
    })
  }
}

export {Func}
export default FuncPlugin
