'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Brain, Shield, Bot, TrendingUp } from 'lucide-react';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      title: 'AI Transaction Categorization Gateway',
      description: 'High-performance API gateway with Phi-4 14B integration for intelligent financial transaction categorization. Features multi-tier processing pipeline with DuckDB caching, achieving 90-95% accuracy at 5ms-500ms response times.',
      icon: Brain,
      tags: ['Python', 'FastAPI', 'Phi-4 14B', 'DuckDB', 'llama.cpp', 'Cloudflare'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Automated Testing Platform',
      description: 'Production-ready test automation framework for web applications with real-time monitoring capabilities. Built to ensure application reliability and performance through comprehensive automated testing workflows.',
      icon: Shield,
      tags: ['Python', 'Playwright', 'Automation', 'Testing', 'Node.js'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'OpenAI-Compatible LLM API',
      description: 'Enterprise-grade API service with function calling, real-time analytics, and monitoring dashboard. Supports multiple concurrent users with rate limiting, cost tracking, and secure tunnel integration.',
      icon: Bot,
      tags: ['Python', 'LiteLLM', 'DuckDB', 'Streamlit', 'FastAPI'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-950" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Featured <span className="gradient-text">Projects</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Solutions engineering projects focused on digital platforms, machine learning integration, and internal tooling.
        </motion.p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />

                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-block p-3 bg-gradient-to-r ${project.gradient} rounded-lg mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span className="text-sm font-medium">Code</span>
                    </a>
                    <a
                      href={project.demo}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm font-medium">Demo</span>
                    </a>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 dark:text-gray-500 mt-12 italic"
        >
          These projects represent my focus on solutions engineering for digital platforms, machine learning applications, and internal tooling.{' '}
          <a href="#contact" className="text-primary-600 dark:text-primary-400 hover:underline">
            Get in touch
          </a>
          {' '}to learn more about my work.
        </motion.p>
      </div>
    </section>
  );
}
