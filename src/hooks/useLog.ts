export type LogOutputType = {
  id: string;
  time: string;
  log: string;
  type: "success" | "danger" | "info" | "warning" | "loading";
  timestamp: number;
};
const logOutput = reactive<LogOutputType[]>([]);
const clearLogOutput = () => {
  const { notify } = eventUtil;
  logOutput.splice(0, logOutput.length);
  notify.clear();
};

export const useLog = () => ({
  logOutput,
  clearLogOutput,
});
