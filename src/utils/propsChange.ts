//子组件修改props数据触发父级进行数据更改，维护单项数据流
import { computed } from "vue";
const cacheMap = new WeakMap()
// const isObject = (obj:any) => obj != null && typeof obj == 'object' 
const proxyFun = (obj, propsName:string, emit:Function) => {
    return new Proxy(obj, {
        get(target, key){
            let res = Reflect.get(target, key)
            // if(isObject(res)){
            //    return proxyFun(res, propsName, emit)
            // }
            
            return res
            
        },
        set(target, key, value){
            emit('update:' + propsName, {
                ...target,
                [key]:value
            })
            return true
        }
    })
}
export default function changeProps(props:object, propsName:string, emit:Function) {
    return computed({
        get(){
            if(cacheMap.has(props[propsName])){
                return cacheMap.get(props[propsName])
            }
            const proxy = proxyFun(props[propsName], propsName, emit)
            cacheMap.set(props[propsName], proxy)
            return proxy
        },
        set(val){
            
            emit('update:' + propsName, val)
        }
    })
}