import { NoteMarkdown } from '../notes/[nid]/pageExtra';

import content from '~/introduction.md';

export default function About() {
  return (
    <div>
      <header className="prose font-mono !mb-2">
        <h2>关于我</h2>
      </header>

      <main className="flex w-full flex-col with-indent with-serif prose relative max-w-full">
        <NoteMarkdown text={content} />
      </main>
    </div>
  );
}
