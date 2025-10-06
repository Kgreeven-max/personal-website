'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Award, Briefcase, Code2 } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const skills = [
    'Python',
    'TensorFlow',
    'PyTorch',
    'Scikit-learn',
    'Deep Learning',
    'Neural Networks',
    'Computer Vision',
    'NLP',
    'Cybersecurity',
    'CompTIA Security+',
    'Docker',
    'React',
    'Next.js',
    'TypeScript',
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Title */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
          >
            Focused on solutions engineering for digital platforms, applying machine learning techniques, and building internal tools that drive innovation and efficiency.
          </motion.p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Education */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg card-hover"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="ml-4 text-xl font-semibold">Education</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>MS Data Science</strong> (In Progress)<br />
                Machine Learning Emphasis<br />
                <strong>MBA</strong> - Data Analytics<br />
                <strong>BS</strong> - Computer Science & Cybersecurity
              </p>
            </motion.div>

            {/* Certification */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg card-hover"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="ml-4 text-xl font-semibold">Certifications</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>CompTIA Security+</strong><br />
                Issued March 2022<br />
                Cybersecurity fundamentals and best practices
              </p>
            </motion.div>

            {/* Experience */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg card-hover"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="ml-4 text-xl font-semibold">Experience</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Cal Coast Credit Union</strong><br />
                San Diego Metropolitan Area<br />
                Financial technology and security
              </p>
            </motion.div>
          </div>

          {/* Skills Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-4 text-2xl font-semibold">Technical Skills</h3>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* GitHub Activity */}
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-2xl font-semibold text-center mb-8">GitHub Activity</h3>
            <div className="flex flex-col items-center gap-6">
              <img
                src="https://github-readme-stats.vercel.app/api?username=Kgreeven-max&show_icons=true&theme=transparent&hide_border=true&title_color=3b82f6&icon_color=f59e0b&text_color=6b7280&bg_color=00000000"
                alt="GitHub Stats"
                className="w-full max-w-md"
              />
              <img
                src="https://github-readme-streak-stats.herokuapp.com/?user=Kgreeven-max&theme=transparent&hide_border=true&ring=3b82f6&fire=f59e0b&currStreakLabel=6b7280&background=00000000"
                alt="GitHub Streak"
                className="w-full max-w-md"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
