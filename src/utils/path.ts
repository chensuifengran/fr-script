import { DialogFilter, open,save } from '@tauri-apps/api/dialog';
import { appDataDir,basename,join as pJoin,resolve as pResolve} from '@tauri-apps/api/path';


const selectFile = async (filters?:DialogFilter[]) => {
    const appGSStore = useAppGlobalSettings();
    const result = await open({
        multiple: false,
        filters,
        directory: false,
        defaultPath:appGSStore.envSetting.workDir || await appDataDir()
    }) as string;
    return result;
}
const selectDir = async () => {
    const appGSStore = useAppGlobalSettings();
    const result = await open({
        multiple: false,
        directory: true,
        defaultPath:appGSStore.envSetting.workDir || await appDataDir()
    }) as string;
    return result;
}
const saveFile = async (targetPath:string) => {
    const result = await save({
        defaultPath:targetPath
    }) as string;
    return result;
}
const join = async (path:string, addPath:string)=>{
    const mod = addPath.includes('\\');
    let paths = [];
    if(mod){
        paths = addPath.split('\\');
    }else if(addPath.includes('/')){
        paths = addPath.split('/');
    }else{
        paths = [addPath];
    }
    return await pJoin(path, ...paths);
}
const resolve = async (path:string, addPath:string)=>{
    const mod = addPath.includes('\\');
    let paths = [];
    if(mod){
        paths = addPath.split('\\');
    }else if(addPath.includes('/')){
        paths = addPath.split('/');
    }else{
        paths = [addPath];
    }
    return await pResolve(path, ...paths);
}
export const pathUtils = {
    selectFile,
    selectDir,
    saveFile,
    basename,
    join,
    resolve
}