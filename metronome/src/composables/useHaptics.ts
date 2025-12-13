export const useHaptics = () => {
  const pulse = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  return { pulse };
};
