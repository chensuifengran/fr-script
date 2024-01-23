const info = reactive({
    title: '风染脚本',
    showContentType:'app-name',
    apiTest:{
        searchValue:'',
        openOutput:false,
    }
});
const windowInnerWidth = ref(window.innerWidth || 0);
let syncTimer:any = null;
const syncWindowInnerWidth = (width:number)=>{
    syncTimer && clearTimeout(syncTimer);
    syncTimer = setTimeout(()=>{
        windowInnerWidth.value = width;
        clearTimeout(syncTimer);
    },100)
}
const clickMinimize = ref(false);
const needSyncLastData = ref(false);
export const useAutoTitleBar = ()=>{
    return {
        info,
        windowInnerWidth,
        syncWindowInnerWidth,
        clickMinimize,
        needSyncLastData
    }
}