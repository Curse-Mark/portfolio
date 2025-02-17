import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  delay?: number;
  scrambleSpeed?: number;
}

const characters = 'abcdefghijklmnopqrstuvwxyz';

export default function TextScramble({ text, delay = 0, scrambleSpeed = 50 }: Props) {
  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef<number>();
  const frameRef = useRef(0);
  const originalTextRef = useRef(text);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentText = '';
      let finalizing = false;
      let finalizingIndex = 0;

      const animate = () => {
        if (finalizing) {
          if (finalizingIndex <= originalTextRef.current.length) {
            setDisplayText(
              originalTextRef.current.substring(0, finalizingIndex) +
              Array(originalTextRef.current.length - finalizingIndex)
                .fill(0)
                .map(() => characters[Math.floor(Math.random() * characters.length)])
                .join('')
            );
            finalizingIndex++;
          } else {
            cancelAnimationFrame(intervalRef.current!);
          }
        } else {
          currentText = Array(originalTextRef.current.length)
            .fill(0)
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join('');
          setDisplayText(currentText);
          frameRef.current++;

          if (frameRef.current > 10) {
            finalizing = true;
          }
        }
        intervalRef.current = requestAnimationFrame(animate);
      };

      intervalRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, [delay, scrambleSpeed]);

  return <span>{displayText || text}</span>;
}