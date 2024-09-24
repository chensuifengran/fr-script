import { useLocalStorageState } from "vue-hooks-plus";
export type MockScriptListItem = ScriptItemType & {
  content?: string;
};
export type MockCodeSnippet = CodeSnippet & {
  content?: string;
};
const [list, setList] = useLocalStorageState<MockScriptListItem[]>(
  "mockScriptList",
  {
    defaultValue: [],
  }
);
const [codeList, setCodeList] = useLocalStorageState<MockCodeSnippet[]>(
  "mockCodeSnippetList",
  {
    defaultValue: [],
  }
);
const mockScriptList = ref<MockScriptListItem[]>(
  JSON.parse(JSON.stringify(list.value)) || []
);
const mockCodeSnippetList = ref<MockCodeSnippet[]>(
  JSON.parse(JSON.stringify(codeList.value)) || []
);
watch(
  mockScriptList,
  () => {
    setList(mockScriptList.value);
  },
  {
    deep: true,
  }
);
watch(
  mockCodeSnippetList,
  () => {
    setCodeList(mockCodeSnippetList.value);
  },
  {
    deep: true,
  }
);

export const usePlayMock = () => {
  return {
    mockScriptList,
    mockCodeSnippetList,
  };
};
