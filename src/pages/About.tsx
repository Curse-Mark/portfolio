import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Certification } from '@/lib/types';
import { ExternalLink, GraduationCap, Award, AlignCenterVertical as Certificate, ChevronRight, Briefcase, Book } from 'lucide-react';

export default function About() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        setCertifications(data || []);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCertifications();
  }, []);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-brand-50 via-white to-brand-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div ref={containerRef} className="space-y-16">
          {/* Header Section */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block p-2 bg-brand-100 rounded-full mb-6">
              <Briefcase className="h-8 w-8 text-brand-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Me</h1>
            <p className="text-xl text-gray-600">
              Transforming financial insights into strategic business success
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Section */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-brand-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
                alt="Professional headshot"
                className="relative rounded-lg shadow-xl w-full h-auto transform transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </motion.div>

            {/* Content Sections */}
            <div className="space-y-12">
              {/* Bio Section */}
              <motion.div
                variants={fadeInUpVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose max-w-none"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-100 rounded-full">
                      <Book className="h-5 w-5 text-brand-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Biography</h2>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700">
                    I am a dedicated Commerce & Accounting professional with a passion
                    for financial analysis and strategic planning. With a strong
                    foundation in business principles and accounting practices, I strive
                    to deliver exceptional results in every project I undertake.
                  </p>
                </div>
              </motion.div>

              {/* Education Section */}
              <motion.div
                variants={fadeInUpVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-100 rounded-full">
                    <GraduationCap className="h-5 w-5 text-brand-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="space-y-6">
                  <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-200 hover:before:bg-brand-400 before:rounded-full before:transition-colors">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      Bachelor of Commerce
                      <ChevronRight className="h-4 w-4 text-brand-600" />
                    </h3>
                    <p className="text-gray-600 mt-1">
                      University Name • 2019 - 2023
                    </p>
                  </div>
                  <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-200 hover:before:bg-brand-400 before:rounded-full before:transition-colors">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      Professional Certification
                      <ChevronRight className="h-4 w-4 text-brand-600" />
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Accounting Institute • 2023
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Certifications Section */}
              <motion.div
                variants={fadeInUpVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-100 rounded-full">
                    <Certificate className="h-5 w-5 text-brand-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        variants={fadeInUpVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        className="group"
                      >
                        <div className="relative pl-6 py-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-200 group-hover:before:bg-brand-400 before:rounded-full before:transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                                {cert.title}
                                <ChevronRight className="h-4 w-4 text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {cert.issuer} • {new Date(cert.date).toLocaleDateString()}
                              </p>
                            </div>
                            {cert.credential_url && (
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-600 hover:text-brand-700 transition-colors p-2 rounded-full hover:bg-brand-50 group-hover:scale-110 transform transition-transform"
                              >
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
