export const MarkdownImage = (props: { src: string; alt?: string }) => {
  return (
    <span className="flex w-full flex-col items-center border-none mdImg">
      <img src={props.src} alt={props.alt} loading="lazy" className="mx-auto w-[50%] rounded-md" />
      <span className=" w-full">居中文本</span>
    </span>
  );
};
