import { type WebviewOptions, Webview } from "@tauri-apps/api/webview";
import {
  type WindowOptions,
  LogicalPosition,
  LogicalSize,
  PhysicalPosition,
  PhysicalSize,
  Window,
} from "@tauri-apps/api/window";
export type WinOpts = Omit<WebviewOptions, "x" | "y" | "width" | "height"> &
  WindowOptions;
const creatWindow = async (
  label: string,
  routePath: string,
  options?: WinOpts
) => {
  let targetWindow = await Window.getByLabel(label);
  const defaultOps: WinOpts = {
    fullscreen: false,
    resizable: true,
    title: label,
    decorations: false,
    transparent: true,
    width: 800,
    height: 600,
    dragDropEnabled: false,
    shadow: false,
  };
  if (!targetWindow) {
    if (!options) {
      options = defaultOps;
    } else {
      options = {
        ...defaultOps,
        ...options,
      };
    }
    targetWindow = new Window(label, {
      ...options,
      fullscreen: options.fullscreen,
      resizable: options.resizable,
      decorations: options.decorations,
      transparent: options.transparent,
      minWidth: options.minWidth,
      width: options.width,
      height: options.height,
      title: options.title,
      shadow: options.shadow,
    });
  }
  let targetWebView = await Webview.getByLabel(label);
  if (!targetWebView) {
    const urlPath = `./index.html/#${routePath}`;
    const url = new URL(urlPath, import.meta.url).href;
    targetWebView = new Webview(targetWindow, label, {
      url,
      x: 0,
      y: 0,
      width: options?.width || 800,
      height: options?.height || 600,
      dragDropEnabled: options?.dragDropEnabled || false,
      transparent: options?.transparent || true,
    });
  }
  return [targetWindow, targetWebView] as const;
};
const open = async (label: string, routePath: string, options?: WinOpts) => {
  try {
    let [targetWindow, targetWebView] = await creatWindow(
      label,
      routePath,
      options
    );
    let _isClosed = false;
    const isClosed = () => _isClosed;

    /**
     * Hide the window and the webview.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.hide();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */
    const hide = async () => {
      if (_isClosed) {
        console.error("hide fail: window is already closed");
        return;
      }
      (await Webview.getByLabel(label))?.hide();
      (await Window.getByLabel(label))?.hide();
    };
    /**
     * Show the window and the webview.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.show();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */
    const show = async () => {
      if (_isClosed) {
        console.error("show fail: window is already closed");
        return;
      }
      (await Webview.getByLabel(label))?.show();
      (await Window.getByLabel(label))?.show();
    };
    /**
     * Focus the window.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.focus();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */
    const focus = async () => {
      if (_isClosed) {
        console.error("focus fail: window is already closed");
        return;
      }
      (await Window.getByLabel(label))?.setFocus();
    };
    /**
     * Recreate the window and the webview.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.close();
     * // recreate the window and the webview
     * await webViewWindowUtil.recreate();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */
    const recreate = async () => {
      if (!_isClosed) {
        console.warn("recreate fail: window is already created");
        return;
      }
      const [newTargetWindow, newTargetWebView] = await creatWindow(
        label,
        routePath,
        options
      );
      targetWindow = newTargetWindow;
      targetWebView = newTargetWebView;
      _isClosed = false;
    };
    /**
     * Close the window and the webview.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.close();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */
    const close = async () => {
      if (_isClosed) {
        console.error("close fail: window is already closed");
        return;
      }
      try {
        // 似乎是tauri2.0的bug，详见：https://github.com/tauri-apps/tauri/issues/8928
        // await targetWebView.close();
        (await Window.getByLabel(label))?.close();
        _isClosed = true;
      } catch (error) {
        console.error("close error", error);
      }
    };
    /**
     * Whether the window should always be on top of other windows.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.mostTop(true);
     * ```
     *
     * @param enable Whether the window should always be on top of other windows or not.
     * @returns A promise indicating the success or failure of the operation.
     */
    const mostTop = async (enable: boolean = true) => {
      if (_isClosed) {
        console.error("mostTop fail: window is already closed");
        return;
      }
      (await Window.getByLabel(label))?.setAlwaysOnTop(enable);
    };
    /**
     * Whether the window should always be below other windows.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.mostBottom(true);
     * ```
     *
     * @param enable Whether the window should always be below other windows or not.
     * @returns A promise indicating the success or failure of the operation.
     */
    const mostBottom = async (enable: boolean = true) => {
      if (_isClosed) {
        console.error("mostBottom fail: window is already closed");
        return;
      }
      (await Window.getByLabel(label))?.setAlwaysOnBottom(enable);
    };
    /**
     * Set the size of the window and the webview.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.setSize({ width: 1000, height: 800 });
     * ```
     *
     * @param size The size of the window and the webview.
     * @returns A promise indicating the success or failure of the operation.
     */
    const setSize = async (size: LogicalSize | PhysicalSize) => {
      if (_isClosed) {
        console.error("setSize fail: window is already closed");
        return;
      }
      (await Window.getByLabel(label))?.setSize(size);
      (await Webview.getByLabel(label))?.setSize(size);
    };
    /**
     * Set the position of the window.
     * @example
     * ```typescript
     * const { open } = windowUtil;
     * const webViewWindowUtil = await open("myWindow", "/myWindow", { width: 800, height: 600 });
     * await webViewWindowUtil.setPos({ x: 100, y: 100 });
     * ```
     *
     * @param position The position of the window.
     * @returns A promise indicating the success or failure of the operation.
     */
    const setPos = async (position: PhysicalPosition | LogicalPosition) => {
      if (_isClosed) {
        console.error("setPos fail: window is already closed");
        return;
      }
      (await Window.getByLabel(label))?.setPosition(position);
    };
    return {
      hide,
      show,
      focus,
      recreate,
      close,
      isClosed,
      mostTop,
      mostBottom,
      setSize,
      setPos,
      getWindow: ()=>targetWindow,
      getWebview: ()=>targetWebView,
    };
  } catch (error) {
    console.error("openWindow error", error);
    return null;
  }
};
export type WebviewWindowUtil = Awaited<ReturnType<typeof open>>;
export const windowUtil = {
  open,
};
