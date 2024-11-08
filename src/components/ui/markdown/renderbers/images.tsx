import Image from 'next/image';

// https://github.com/vercel/next.js/discussions/18474
export const MarkdownImage = (props: { src: string; alt?: string }) => {
  return (
    <span className=" relative w-full border-none">
      <Image
        width={0}
        height={0}
        sizes="100vw"
        src={props.src}
        alt={props.alt ?? 'image'}
        className=" w-full h-auto rounded-md"
      />
    </span>
  );
};
