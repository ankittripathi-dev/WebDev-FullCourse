'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Nitish',
    role: 'Full Stack Developer',
    avatar: '/nitish.jpeg',
  },
  {
    name: 'Manas',
    role: 'Full Stack Developer',
    avatar: '/manas.jpeg',
  },
];

export function TeamSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section id="team" className="relative w-full overflow-hidden border-b bg-background py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] bg-primary/8 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute left-1/4 bottom-1/3 h-[500px] w-[500px] bg-blue-500/8 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Meet the Team
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            The passionate developers behind PDF Master, dedicated to making PDF management simple
            and secure.
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {teamMembers.map((member, index) => {
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative">
                <div className="relative flex flex-col items-center text-center border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center w-full">
                    {/* Avatar */}
                    <div className="mb-6 relative h-[350px] w-full overflow-hidden border-2 border-primary/10 bg-muted">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Name & Role */}
                    <div className="space-y-2">
                       <h3 className="text-3xl font-bold text-foreground tracking-tight">
                        {member.name}
                      </h3>
                      <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 border border-primary/20">
                         <span className="text-sm font-semibold text-primary">{member.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

