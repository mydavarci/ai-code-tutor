import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CodeEditor({ value, onChange, disabled = false }: CodeEditorProps) {
  return (
    <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly: disabled,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
