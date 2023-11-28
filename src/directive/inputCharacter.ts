import { Directive } from 'vue'

const Regcharacter: Directive = {
    mounted(el: HTMLFormElement) {
        let regRule = (window as any).tszfRegular || /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g
        let maxlength = 5
        let inputEl: HTMLFormElement = el.querySelector('.el-input__inner') || el.querySelector('.el-textarea__inner') || el
        let canReg = true
        let regValue = function () {
            if (canReg) {
                inputEl.value = inputEl.value.replace(/\s/g, '')
                let val = inputEl.value
                // console.log(inputEl.value);
                inputEl.value = val.replace(regRule, '')
                // if (inputEl.className == 'el-input__inner' && inputEl.value.length > maxlength) {
                //     inputEl.value = inputEl.value.substr(0, maxlength)
                // }
            }

        }
        //刚输入中文时不进行验证，不然会出现一长串字符
        inputEl.addEventListener('compositionstart', function () {
            canReg = false
        })
        //中文输入完成后进行验证
        inputEl.addEventListener('compositionend', function () {
            canReg = true
        })
        inputEl.addEventListener('keyup', regValue)
    }
}
export default Regcharacter