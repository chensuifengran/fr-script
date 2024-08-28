export const computePosition = async (x: number, y: number) => {
  const targetPos = {
    x,
    y,
  };
  if (window[CORE_NAMESPACES]?.Mouse?.__NS_DATA__) {
    const baseSize = window[CORE_NAMESPACES].Mouse.__NS_DATA__?.baseSize;
    const randomOffset =
      window[CORE_NAMESPACES].Mouse.__NS_DATA__?.randomOffset;
    const { width, height } = await invokeBaseApi.getScreenSize();
    if (baseSize !== undefined) {
      targetPos.x = Math.round((targetPos.x * baseSize[0]) / width);
      targetPos.y = Math.round((targetPos.y * baseSize[1]) / height);
    }
    if (randomOffset !== undefined) {
      const [lX, hX] = randomOffset[0]; //x轴最小偏移和最大偏移，可能为负数
      if (!(lX === 0 && hX === 0)) {
        targetPos.x += Math.round(lX + Math.random() * (hX - lX));
      }
      const [lY, hY] = randomOffset[1]; //y轴最小偏移和最大偏移，可能为负数
      if (!(lY === 0 && hY === 0)) {
        targetPos.y += Math.round(lY + Math.random() * (hY - lY));
      }
    }
  }
  return targetPos;
};
