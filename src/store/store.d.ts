type GlobalSettings = {
    app:{
        dependentSerial: string[];
        editorTheme:{
            value: '跟随全局主题' | '明亮' | '暗黑';
            options: ["跟随全局主题", "明亮", "暗黑"];
        },
        state:{
            aside:{
                collapsed: boolean;
                currentItem: string;
            }
        }
    },
    envSetting:{
        workDir: string;
        screenshotSavePath: string;
        tempDrivePath: {
            value: string;
            options: string[];
        };
    },
    ocr:{
        value: 'GPU' | 'CPU';
        options: ["GPU", "CPU"];
        gpuMemory: number;
        inited: boolean;
    }
};