import { GitHubBrandIcon } from '@/components/icons/platform/GitHubBrandIcon';
import { ProjectCardList } from '@/components/modules/projects/ProjectCardList';
import { projectList } from '~/index';
import { getUserLocale } from '@/lib/getLocale';
import localeValues from '@/locale';

export default function Projects() {
  const lang = getUserLocale();
  const projectsLocale = localeValues[lang].projects;

  return (
    <div>
      <header className="prose prose-p:my-2 font-mono">
        <h1 className=" flex items-center">
          {projectsLocale.projects}
          <a
            href="https://github.com/coderz-w"
            className="ml-2 inline-flex !text-inherit"
            target="_blank"
            aria-label="view on GitHub"
            rel="noopener noreferrer"
          >
            <GitHubBrandIcon />
          </a>
        </h1>
      </header>

      <main className="mt-10 flex w-full flex-col">
        <ProjectCardList data={projectList} />
      </main>
    </div>
  );
}
