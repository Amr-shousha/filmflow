import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export function useSplitTextAnimation() {
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    // split text
    splitRef.current = new SplitType(textRef.current, {
      types: "chars",
    });

    // animate ON MOUNT
    animationRef.current = gsap.from(splitRef.current.chars, {
      x: 150,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.04,
    });

    return () => {
      splitRef.current?.revert(); // ✅ correct
      animationRef.current?.kill();
    };
  }, []);

  return { textRef };
}
