import React from 'react';

type BlogPostCardProps = {
  title: string;
  date: string;
  readingTime: string;
  views: number;
  imageUrl: string;
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  date,
  readingTime,
  views,
  imageUrl,
}) => {
  return (
    <div className="relative group w-full max-w-md p-4 rounded-2xl overflow-hidden text-white shadow-lg">
      {/* 背景图像，只有在 hover 时模糊 */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center group-hover:blur-sm transition duration-300 ease-in-out"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* 半透明覆盖层 */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-300 ease-in-out" />

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        {/* 顶部头像 */}
        <div className="flex justify-start items-center mb-4">
          <img src="/path-to-avatar.png" alt="avatar" className="h-10 w-10 rounded-full" />
        </div>

        {/* 中间主要标题 */}
        <div className="flex-1 text-left">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </div>

        {/* 底部信息 */}
        <div className="text-sm mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-2">📅 {date}</span>
            <span>🖊 随笔</span>
          </div>
          <div className="flex items-center">
            <span className="mr-4">👁 {views}</span>
            <span>⏳ {readingTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
