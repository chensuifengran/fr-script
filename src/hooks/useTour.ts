import { useLocalStorageState } from "vue-hooks-plus";
export type TourStep = {
  title: string;
  description: string;
  target?: string;
  preventNext?: boolean;
  preventPrevious?: boolean;
  onShow?: () => void;
};
export type TourStepName = {
  scriptList: boolean;
  scriptEditor: boolean;
  scriptSetting: boolean;
  scriptRunConsole: boolean;
  apiTest: boolean;
  codeSnippetList: boolean;
  setting: boolean;
  about: boolean;
};
export type TourStepNames = keyof TourStepName;
export type TourInfo = {
  [key in TourStepNames]: {
    step: number;
    touring: boolean;
    steps: TourStep[];
    preventPrevious: boolean;
    preventNext: boolean;
    doneSteps: number[];
  };
};
const [firstTime, setfirstTime] = useLocalStorageState<TourStepName>(
  "firstTime",
  {
    defaultValue: {
      scriptList: true,
      scriptEditor: true,
      scriptSetting: true,
      scriptRunConsole: true,
      apiTest: true,
      codeSnippetList: true,
      setting: true,
      about: true,
    },
  }
);
const tourInfo = reactive<TourInfo>({
  scriptList: {
    step: 0,
    touring: false,
    steps: tourSteps.scriptList,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  scriptEditor: {
    step: 0,
    touring: false,
    steps: tourSteps.scriptEditor,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  scriptSetting: {
    step: 0,
    touring: false,
    steps: tourSteps.scriptSetting,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  scriptRunConsole: {
    step: 0,
    touring: false,
    steps: tourSteps.scriptRunConsole,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  apiTest: {
    step: 0,
    touring: false,
    steps: tourSteps.apiTest,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  codeSnippetList: {
    step: 0,
    touring: false,
    steps: tourSteps.codeSnippetList,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  setting: {
    step: 0,
    touring: false,
    steps: tourSteps.setting,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
  about: {
    step: 0,
    touring: false,
    steps: tourSteps.about,
    preventPrevious: false,
    preventNext: false,
    doneSteps: <number[]>[],
  },
});
const currentTourName = ref<TourStepNames>("scriptList");
const showTour = () => {
  if (tourInfo[currentTourName.value]?.steps.length) {
    tourInfo[currentTourName.value].step = 0;
    nextTick(() => (tourInfo[currentTourName.value].touring = true));
  } else {
    ElMessage.warning("当前页面暂未无引导");
  }
};

export const useTour = () => {
  return {
    firstTime,
    setfirstTime,
    tourInfo,
    currentTourName,
    showTour,
  };
};
