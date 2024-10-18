import { type, version, hostname } from "@tauri-apps/plugin-os";
import { nanoid } from "nanoid";
import { useLocalStorageState } from "vue-hooks-plus";
const getTempId = async () => {
  const osType = type();
  const osVersion = version();
  const hostName = await hostname();
  const tempId = nanoid(4);
  return `${hostName}(${osType}-${osVersion}-${tempId})`;
};
const [tempDeviceId, setTempDeviceId] = useLocalStorageState<string>(
  "tempDeviceId",
  {
    defaultValue: "",
  }
);
if (tempDeviceId.value === "") {
  getTempId().then((id) => {
    setTempDeviceId(id);
  });
}
export default tempDeviceId as Ref<string>;
