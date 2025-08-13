import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

// React 19 호환 Toast UI Editor 래퍼 (products 전용)
const ToastEditor = forwardRef(function ToastEditor(
  {
    height = '500px',
    initialEditType = 'wysiwyg',
    previewStyle = 'vertical',
    initialValue = '',
    hooks = {},
    usageStatistics = false,
    language,
    toolbarItems,
    ...rest
  },
  ref
) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    instanceRef.current = new Editor({
      el: containerRef.current,
      height,
      initialEditType,
      previewStyle,
      initialValue,
      hooks,
      usageStatistics,
      language,
      toolbarItems,
      ...rest,
    });

    return () => {
      try { instanceRef.current?.destroy?.(); } catch (_) {}
      instanceRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getInstance: () => instanceRef.current,
  }));

  return <div ref={containerRef} />;
});

export default ToastEditor;
