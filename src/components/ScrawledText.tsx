import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  className?: string;
}

export default function ScrawledText({ text, className = '' }: Props) {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    // Create SVG paths for each character
    const createPaths = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.font = '60px "Dancing Script"';
      const newPaths: string[] = [];
      let x = 0;

      text.split('').forEach((char) => {
        const metrics = ctx.measureText(char);
        const width = metrics.width;
        
        // Create a wavy path for each character
        const path = `M ${x} 0 
                     Q ${x + width * 0.3} -10, ${x + width * 0.5} 0 
                     T ${x + width} 0`;
        newPaths.push(path);
        x += width;
      });

      setPaths(newPaths);
    };

    createPaths();
  }, [text]);

  return (
    <motion.div 
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
      <span className="opacity-0">{text}</span>
      <span className="absolute top-0 left-0">{text}</span>
    </motion.div>
  );
}
