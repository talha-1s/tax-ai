export const FileList = ({
  files,
  isParsing,
}: {
  files: File[];
  isParsing: boolean;
}) => {
  return (
    <ul className="space-y-2">
      {files.map((file, i) => (
        <li key={i} className="bg-white p-2 rounded shadow text-sm">
          {file.name} —{' '}
          {file.name.endsWith('.csv')
            ? isParsing
              ? 'Parsing...'
              : 'Parsed ✅'
            : 'Stored for AI processing'}
        </li>
      ))}
    </ul>
  );
};
