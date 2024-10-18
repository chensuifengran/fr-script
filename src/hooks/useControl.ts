import { useLocalStorageState } from "vue-hooks-plus";

const [controlCode, setControlCode] = useLocalStorageState<string>(
  "controlCode",
  {
    defaultValue: genControlCode(),
  }
);
const refreshCode = () => {
  setControlCode(genControlCode());
};
const updateCode = () => {
  ElMessageBox.prompt("请输入四位数字控制码", "控制码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^\d{4}$/,
    inputErrorMessage: "控制码格式错误",
  })
    .then(({ value }) => {
      ElMessage.success("控制码已更新");
      setControlCode(value);
    })
    .catch(() => {
      console.log("cancel");
    });
};
const [controlConf, setControlConf] = useLocalStorageState("controlConf", {
  defaultValue: {
    autoOnline: false,
    autoAsk: false,
  },
});
const autoOnline = computed({
  get: () => controlConf.value?.autoOnline,
  set: (value) =>
    setControlConf({
      autoAsk: controlConf.value?.autoAsk || false,
      autoOnline: value || false,
    }),
});
const autoAsk = computed({
  get: () => controlConf.value?.autoAsk,
  set: (value) =>
    setControlConf({
      autoOnline: controlConf.value?.autoOnline || false,
      autoAsk: value || false,
    }),
});
const closeAutoOnline = () => {
  setControlConf({
    autoAsk: controlConf.value?.autoAsk || false,
    autoOnline: false,
  });
};
const controlDeviceInfo = reactive({
  id: "",
  accessToken: "",
});
let unlisten: () => void = () => {};
watch(
  () => controlDeviceInfo.id,
  () => {
    if (controlDeviceInfo.id) {
      unlisten = useWss().onMsg((msg) => {
        if (msg.type === "COMMAND") {
          if (msg.command === "REQUEST_SCRIPT_LIST") {
            const scriptList = useListStore().scriptList.map((s) => {
              return {
                id: s.id,
                name: s.name,
                description: `[${s.version}]` + s.description,
              };
            });
            useWss().responseScriptList(scriptList);
            unlisten();
          }
        }
      });
    }
  }
);
export const useControl = () => {
  return {
    controlCode: controlCode as Ref<string>,
    refreshCode,
    updateCode,
    autoOnline,
    autoAsk,
    closeAutoOnline,
    controlDeviceInfo,
  };
};
