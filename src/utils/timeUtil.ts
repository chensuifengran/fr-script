
const sleep = async (ms: number = 1000) => {
  const count = parseInt("" + ms / 1000);
  const remainder = ms % 1000;
  if (count === 0) {
    return new Promise<void>((res) => {
      const t = setTimeout(() => {
        clearTimeout(t);
        res();
      }, ms);
    });
  } else {
    let isBreak = false;
    for (let i = 0; i < count; i++) {
      await new Promise<void>((res) => {
        const t = setTimeout(() => {
          clearTimeout(t);
          res();
        }, 1000);
      });
      //@ts-ignore
      if (window[CORE_NAMESPACES] && window[CORE_NAMESPACES]?.isStop) {
        isBreak = true;
        break;
      }
    }
    if (!isBreak) {
      return new Promise<void>((res) => {
        const t = setTimeout(() => {
          clearTimeout(t);
          res();
        }, remainder);
      });
    }
  }
};
export const timeUtil = {
  sleep,
};
