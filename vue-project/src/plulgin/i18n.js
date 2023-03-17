export default {
    install:(app,options)=>{
        // 插件代码
        //使用: {{ $translate('gretting.hello') }}
        app.config.globalProperties.$translate= (key) => {
            return key.split('.').reduce((o,i) => { 
                if(o) return o[i]
            },options)
        }
        app.provide('i18n',options)
        console.log(app,options);
    }
}