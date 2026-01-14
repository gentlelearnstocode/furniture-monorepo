import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';

export const ProjectsSection = async () => {
  const allProjects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.isActive, true),
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    limit: 4,
    with: {
      image: true,
    },
  });

  if (allProjects.length === 0) return null;

  return (
    <section className='py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8'>
          <div className='max-w-2xl'>
            <span className='block text-[#7B0C0C] font-serif italic text-xl mb-4'>
              Our Portfolio
            </span>
            <h2 className='text-4xl md:text-6xl font-serif font-bold leading-tight text-gray-900'>
              Capturing Timeless <br /> Elegance in Every Project
            </h2>
          </div>
          <Link
            href='/projects'
            className='flex items-center text-sm font-semibold tracking-wider uppercase border-b border-gray-900/20 pb-2 hover:border-gray-900 transition-colors text-gray-900'
          >
            View All Projects
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {allProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className='group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
            >
              <div className='relative aspect-[4/5] overflow-hidden'>
                {project.image ? (
                  <Image
                    src={project.image.url}
                    alt={project.title}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                  />
                ) : (
                  <div className='absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400'>
                    No Image
                  </div>
                )}
                <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                  {project.title}
                </h3>
                <span className='inline-flex items-center text-sm font-semibold text-[#7B0C0C]'>
                  View Project
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
