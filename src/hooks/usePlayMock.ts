import { useLocalStorageState } from "vue-hooks-plus";
export type MockScriptListItem = ScriptItemType & {
  content?: string;
};
const [list, setList] = useLocalStorageState<MockScriptListItem[]>(
  "mockScriptList",
  {
    defaultValue: [],
  }
);
const mockScriptList = ref<MockScriptListItem[]>(
  JSON.parse(JSON.stringify(list.value)) || []
);
watch(mockScriptList, () => {
  setList(mockScriptList.value);
},{
  deep: true
});

export const usePlayMock = () => {
  return {
    mockScriptList,
  };
};
