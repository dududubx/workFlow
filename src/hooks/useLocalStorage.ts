
import { Ref, onMounted, ref } from 'vue'

export async function watchStorage(key):Promise<Ref<string>>{
    return new Promise((resolve) => {
        onMounted(() => {
            let val = ref('')
            window.addEventListener('setItemEvent', (e) => {
                if(e['key'] == key && e['newValue']){
                    val.value = e['newValue'] 
                }
                resolve(
                    val
                )
            })
        })
       
    })
    
}