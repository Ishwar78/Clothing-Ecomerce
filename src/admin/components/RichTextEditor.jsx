import React, { useRef, useEffect, useState } from 'react';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
  FiCode,
  FiEye
} from 'react-icons/fi';
import './RichTextEditor.css';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write content here...',
  minHeight = '180px',
  compact = false
}) {
  const editorRef = useRef(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  // Keep editor content in sync when value changes from outside (e.g. modal open / edit product)
  useEffect(() => {
    if (editorRef.current && !isCodeView) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setInternalValue(value || '');
  }, [value, isCodeView]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalValue(html);
      if (onChange) onChange(html);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  const executeCommand = (command, val = null) => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  const insertLink = () => {
    if (isCodeView) return;
    const url = prompt('Enter link URL (e.g. https://example.com):', 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const formatBlock = (tag) => {
    executeCommand('formatBlock', tag);
  };

  return (
    <div className={`rich-editor-wrapper ${compact ? 'compact' : ''}`}>
      {/* TOOLBAR */}
      <div className="rich-editor-toolbar">
        {/* Basic Styles */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn"
            title="Bold (Ctrl+B)"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
          >
            <FiBold />
          </button>
          <button
            type="button"
            className="tb-btn"
            title="Italic (Ctrl+I)"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
          >
            <FiItalic />
          </button>
          <button
            type="button"
            className="tb-btn"
            title="Underline (Ctrl+U)"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
          >
            <FiUnderline />
          </button>
        </div>

        {/* Headings */}
        {!compact && (
          <div className="toolbar-group">
            <button
              type="button"
              className="tb-btn text-btn"
              title="Heading 2"
              onMouseDown={(e) => { e.preventDefault(); formatBlock('<h2>'); }}
            >
              H2
            </button>
            <button
              type="button"
              className="tb-btn text-btn"
              title="Heading 3"
              onMouseDown={(e) => { e.preventDefault(); formatBlock('<h3>'); }}
            >
              H3
            </button>
            <button
              type="button"
              className="tb-btn text-btn"
              title="Normal Paragraph"
              onMouseDown={(e) => { e.preventDefault(); formatBlock('<p>'); }}
            >
              P
            </button>
          </div>
        )}

        {/* Lists */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn"
            title="Bullet List"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
          >
            <FiList />
          </button>
          <button
            type="button"
            className="tb-btn text-btn"
            title="Numbered List"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }}
          >
            1.
          </button>
        </div>

        {/* Text Align */}
        {!compact && (
          <div className="toolbar-group">
            <button
              type="button"
              className="tb-btn"
              title="Align Left"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyLeft'); }}
            >
              <FiAlignLeft />
            </button>
            <button
              type="button"
              className="tb-btn"
              title="Align Center"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyCenter'); }}
            >
              <FiAlignCenter />
            </button>
            <button
              type="button"
              className="tb-btn"
              title="Align Right"
              onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyRight'); }}
            >
              <FiAlignRight />
            </button>
          </div>
        )}

        {/* Colors */}
        <div className="toolbar-group colors-group">
          <button
            type="button"
            className="color-dot"
            style={{ backgroundColor: '#222222' }}
            title="Default Dark Text"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('foreColor', '#222222'); }}
          />
          <button
            type="button"
            className="color-dot"
            style={{ backgroundColor: '#e11b22' }}
            title="Brand Red"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('foreColor', '#e11b22'); }}
          />
          <button
            type="button"
            className="color-dot"
            style={{ backgroundColor: '#2563eb' }}
            title="Blue"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('foreColor', '#2563eb'); }}
          />
          <button
            type="button"
            className="color-dot"
            style={{ backgroundColor: '#16a34a' }}
            title="Green"
            onMouseDown={(e) => { e.preventDefault(); executeCommand('foreColor', '#16a34a'); }}
          />
        </div>

        {/* Link */}
        <div className="toolbar-group">
          <button
            type="button"
            className="tb-btn"
            title="Insert Link"
            onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
          >
            <FiLink />
          </button>
        </div>

        {/* View Toggle (Visual / Code) */}
        <div className="toolbar-group ml-auto">
          <button
            type="button"
            className={`tb-btn view-toggle ${isCodeView ? 'active' : ''}`}
            title={isCodeView ? 'Switch to Visual Editor' : 'Switch to HTML Code View'}
            onClick={() => setIsCodeView(!isCodeView)}
          >
            {isCodeView ? <FiEye /> : <FiCode />}
            <span style={{ fontSize: '11px', marginLeft: '4px' }}>
              {isCodeView ? 'Visual' : 'HTML'}
            </span>
          </button>
        </div>
      </div>

      {/* EDITOR BODY */}
      {isCodeView ? (
        <textarea
          className="rich-editor-textarea"
          value={internalValue}
          onChange={handleCodeChange}
          placeholder="Edit raw HTML code..."
          style={{ minHeight }}
        />
      ) : (
        <div
          ref={editorRef}
          className="rich-editor-content"
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight }}
        />
      )}
    </div>
  );
}
