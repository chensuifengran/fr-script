const info = reactive({
    title: '风染脚本',
    showContentType:'app-name',
    apiTest:{
        searchValue:'',
        openOutput:false,
    }
});


export const useAutoTitleBar = ()=>{
    return {
        info
    }
}