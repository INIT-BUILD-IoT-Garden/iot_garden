import { useEffect, useState } from "react";

export function useIntersectionObserver(targetId: string, callback?: (isVisible: boolean) => void) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const newIsVisible = entry.isIntersecting;
        setIsVisible(newIsVisible);
        if (callback) callback(newIsVisible);
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: "-45% 0px -45% 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId, callback]);

  return isVisible;
}
