import React from 'react';
import Image from 'next/image';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';

export const ProjectsSection = async () => {
  const allProjects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.isActive, true),
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    with: {
      image: true,
    },
  });

  if (allProjects.length === 0) return null;

  return (
    <section className='py-24 bg-black text-white overflow-hidden'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8'>
          <div className='max-w-2xl'>
            <span className='block text-[#7B0C0C] font-serif italic text-xl mb-4'>
              Our Portfolio
            </span>
            <h2 className='text-4xl md:text-6xl font-serif font-bold leading-tight'>
              Capturing Timeless <br /> Elegance in Every Project
            </h2>
          </div>
          <button className='flex items-center text-sm font-semibold tracking-wider uppercase border-b border-white/20 pb-2 hover:border-white transition-colors'>
            View All Projects
            <ArrowRight className='ml-2 h-4 w-4' />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {allProjects.map((project, index) => (
            <div key={project.id} className={`group relative ${index % 2 === 1 ? 'md:mt-24' : ''}`}>
              <div className='relative aspect-[4/5] overflow-hidden rounded-sm mb-6'>
                {project.image ? (
                  <Image
                    src={project.image.url}
                    alt={project.title}
                    fill
                    className='object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, 50vw'
                  />
                ) : (
                  <div className='absolute inset-0 bg-white/10' />
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                <div className='absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700'>
                  <p className='text-sm font-serif italic text-white/80 mb-2'>Project Showcase</p>
                  <h3 className='text-3xl font-serif font-bold'>{project.title}</h3>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-xl md:text-2xl font-serif font-medium text-white/90 group-hover:text-white transition-colors'>
                  {project.title}
                </h3>
                <div className='h-px flex-grow mx-6 bg-white/10 group-hover:bg-white/30 transition-colors' />
                <span className='text-sm font-light text-white/50 group-hover:text-[#7B0C0C] transition-colors'>
                  Explore
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
