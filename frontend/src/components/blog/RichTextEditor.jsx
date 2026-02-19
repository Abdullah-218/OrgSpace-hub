import { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your content here...', className = '' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: 'Bold', className: 'font-bold' },
    { command: 'italic', icon: 'I', title: 'Italic', className: 'italic' },
    { command: 'underline', icon: 'U', title: 'Underline', className: 'underline' },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { command: 'formatBlock', icon: 'H1', title: 'Heading 1', value: 'h1' },
    { command: 'formatBlock', icon: 'H2', title: 'Heading 2', value: 'h2' },
    { command: 'createLink', icon: '🔗', title: 'Insert Link', needsPrompt: true },
  ];

  const handleButtonClick = (button) => {
    if (button.needsPrompt && button.command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) handleCommand(button.command, url);
    } else if (button.value) {
      handleCommand(button.command, button.value);
    } else {
      handleCommand(button.command);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleButtonClick(button)}
            title={button.title}
            className={`px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-200 transition-colors ${button.className || ''}`}
          >
            {button.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none prose prose-sm max-w-none"
        style={{ wordBreak: 'break-word' }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;


