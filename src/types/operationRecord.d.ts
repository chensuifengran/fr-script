declare type SaveConfigForm = {
  name: string;
  description: string;
  prefix: string;
  code: string;
};
declare type CaptureOptions = {
  merge_mouse_options?: {
    merge: boolean;
    max_interval_ms: number;
    merge_drag: boolean;
  };
  merge_key_options?: {
    merge_repeat: boolean;
    repeat_max_interval_ms: number;
    merge_press_release: boolean;
    press_release_max_interval_ms: number;
  };
};
declare type CaptureSettingForm = {
  [K in keyof CaptureOptions]-?: CaptureOptions[K] extends undefined
    ? never
    : CaptureOptions[K];
} & {
  generateComment: boolean;
  hiddenWindowBeforeRunning: boolean;
};
