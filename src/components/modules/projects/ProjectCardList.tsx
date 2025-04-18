'use client';

import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/helper';
import { ProjectModel } from '~/index';

export function ProjectCardList({ data }: { data: ProjectModel[] }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-6 lg:grid-cols-3">
      {data.map((projectModel) => (
        <ProjectCard key={projectModel.name} project={projectModel} />
      ))}
    </div>
  );
}

const ProjectCard = ({ project }: { project: ProjectModel }) => {
  return (
    <Link
      href={project.url}
      key={project.id}
      className="group flex shrink-0 grid-cols-[60px_2fr] flex-col items-center gap-4 md:grid"
    >
      <ProjectIcon
        className="size-16 group-hover:-translate-y-2 group-hover:shadow-out-sm md:size-auto"
        avatar={project.avatar}
        name={project.name}
      />
      <span className="flex shrink-0 grow flex-col gap-2 text-left">
        <h2 className="m-0 text-balance p-0 text-center font-medium md:text-left">
          {project.name}
        </h2>
        <span className="line-clamp-5 text-balance text-center text-sm md:line-clamp-4 md:text-left lg:line-clamp-2">
          {project.desc}
        </span>
      </span>
    </Link>
  );
};

const ProjectIcon = (props: { avatar?: string; name?: string; className?: string }) => {
  const { avatar, name, className } = props;

  return (
    <div
      className={cn(
        'project-icon flex shrink-0 grow items-center justify-center',
        avatar
          ? 'ring-2 ring-slate-200 dark:ring-neutral-800'
          : 'bg-slate-300 text-white dark:bg-neutral-800 text-3xl',
        'mask mask-squircle aspect-square transition-all duration-300',
        className,
      )}
    >
      {avatar ? (
        <Image
          src={avatar}
          height={64}
          width={64}
          alt={`Avatar of ${name}`}
          className="rounded-xl duration-300 transition-all aspect-square"
        />
      ) : (
        <> {name?.charAt(0).toUpperCase() || ''}</>
      )}
    </div>
  );
};
