import { DialogFilter, open,save } from '@tauri-apps/api/dialog';
import { appDataDir } from '@tauri-apps/api/path';
const appGSStore = useAppGlobalSettings();

const selectFile = async (filters?:DialogFilter[]) => {
    const result = await open({
        multiple: false,
        filters,
        directory: false,
        defaultPath:appGSStore.envSetting.workDir || await appDataDir()
    }) as string;
    return result;
}
const selectDir = async () => {
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
export const pathUtils = {
    selectFile,
    selectDir,
    saveFile
}