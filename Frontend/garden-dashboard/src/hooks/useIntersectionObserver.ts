import { useEffect, useState } from "react";

export function useIntersectionObserver(targetId: string) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-20% 0px -20% 0px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return isVisible;
}
