import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import ScrawledText from '@/components/ScrawledText';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <div ref={containerRef} className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-brand-50/50 to-white" />
      
      <motion.div 
        style={{ y, opacity }}
        className="relative pt-20 pb-40"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="relative">
                  <span className="text-brand-600">John Doe's</span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute left-0 right-0 -bottom-3"
                  >
                    <ScrawledText 
                      text=""
                      className="w-full text-brand-500"
                      position="below"
                    />
                  </motion.div>
                </span>
                {' '}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent"
                >
                  Portfolio
                </motion.span>
              </h1>
            </motion.div>
            <motion.p 
              className="text-xl sm:text-2xl text-brand-700 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              I'm a passionate Commerce & Accounting professional with expertise in
              financial analysis, strategic planning, and business development.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-brand-600 hover:bg-brand-700 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/about">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-brand-200 hover:bg-brand-50 text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]) }}
      />
    </div>
  );
}
