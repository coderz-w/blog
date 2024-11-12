export function MaterialSymbolsProgressActivity(props: { progress: number }) {
  const offset = 87.92 * ((100 - props.progress) / 100);

  return (
    <svg style={{ transform: 'rotate(-90deg)' }} width="1em" height="1em" viewBox="0 0 36 36">
      {/* 第一圈 */}
      <circle r="14" cx="18" cy="18" fill="transparent" stroke="#e0e0e0" strokeWidth="4"></circle>
      {/* 第二圈，进度条 */}
      <circle
        r="14"
        cx="18"
        cy="18"
        fill="transparent"
        stroke="var(--accent-color)"
        strokeWidth="4"
        strokeDasharray="87.92"
        strokeDashoffset={`${offset}`}
      ></circle>
    </svg>
  );
}
