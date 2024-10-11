import { nanoid } from "nanoid";
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
    defaultValue: [
      {
        id: nanoid(),
        name: "layout_test 超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超长的标题",
        savePath: "内部存储",
        version: "v12.2.0",
        description: "这是一个演示脚本",
        setting: {
          autoImportLastRunConfig: true,
          targetAdbDevice: "",
          targetApp: "",
          autoStartTargetApp: false,
          excludeDevice: [],
        },
        content: PLAY_MOCK_SCRIPT,
      },
    ],
  }
);
const [codeList, setCodeList] = useLocalStorageState<MockCodeSnippet[]>(
  "mockCodeSnippetList",
  {
    defaultValue: [
      {
        id: nanoid(),
        name: "logtype",
        filePath: "内部存储",
        description: "编辑器输入logtype以插入本片段",
        prefix: "logtype",
        content: `["loading", "success", "danger", "warning", "info"]`,
      },
    ],
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
