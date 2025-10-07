'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink } from 'lucide-react';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      title: 'Transaction Categorization API',
      description: 'Started with a problem: categorizing thousands of bank transactions by hand was eating up hours every week. Built an API using Phi-4 running locally (via llama.cpp, no cloud needed). Added DuckDB to cache common patterns so repeat transactions come back instantly. The multi-tier setup checks cache first, then hits the model only when needed. Result: what used to take hours now takes seconds, hitting 90-95% accuracy on most transaction types. Response times range from 5ms for cached items to about 500ms for new patterns.',
      tags: ['Python', 'FastAPI', 'Phi-4 14B', 'DuckDB', 'llama.cpp', 'Cloudflare'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Web Testing Automation',
      description: 'Clicking through the same test scenarios every release was mind-numbing and time-consuming. Built this with Playwright to record my actions visually using codegen, then replay them automatically. Added real-time uptime monitoring to catch issues before they become problems. The whole setup runs tests while I work on other stuff, saving probably 5-6 hours a week of repetitive manual testing. Works across different browsers including WebKit/Safari which can be tricky.',
      tags: ['Python', 'Playwright', 'Automation', 'Testing', 'Node.js'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Self-Hosted LLM API',
      description: 'Got tired of paying per API call - costs add up fast when you are experimenting. Set up my own LLM infrastructure using LiteLLM to make it OpenAI-compatible, so existing code works without changes. Built a Streamlit dashboard to track costs and usage patterns in real-time. Runs through Cloudflare tunnels for secure remote access. The whole thing handles me and a couple teammates using it concurrently without issues. Added rate limiting and cost tracking to avoid surprises.',
      tags: ['Python', 'LiteLLM', 'DuckDB', 'Streamlit', 'FastAPI'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Internal Knowledge Chatbot',
      description: 'Constantly looking up the same information in documentation was slowing everything down. Built a chatbot that understands context and remembers conversations. Uses basic NLP to parse questions and PostgreSQL to handle session state. Nothing fancy - just containerized with Docker for easy deployment and scaled to handle multiple users. Saved a ton of time not having to dig through docs for common questions.',
      tags: ['Python', 'NLP', 'API', 'Docker', 'PostgreSQL'],
      github: '#contact',
      demo: '#contact',
      gradient: 'from-orange-500 to-red-500',
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
          Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Things I have built to solve real problems. Mostly focused on making repetitive work less painful.
        </motion.p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
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
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
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
          Built these to solve real problems I ran into. Want to know more about how any of these work?{' '}
          <a href="#contact" className="text-primary-600 dark:text-primary-400 hover:underline">
            Get in touch
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
