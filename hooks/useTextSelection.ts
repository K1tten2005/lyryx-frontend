import { useState, useEffect, useCallback, RefObject } from 'react';

interface SelectionData {
  text: string;
  startIndex: number;
  endIndex: number;
  rect: DOMRect | null;
  relativeRect: { top: number; left: number; bottom: number; right: number } | null;
  lastRelativeRect: { top: number; left: number; bottom: number; right: number } | null;
}

export function useTextSelection(containerRef: RefObject<HTMLElement>) {
  const [selection, setSelection] = useState<SelectionData | null>(null);

  const getOffsetInContainer = useCallback((node: Node, offset: number) => {
    const container = containerRef.current;
    if (!container) return offset;
    
    let totalOffset = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode === node) {
        return totalOffset + offset;
      }
      totalOffset += currentNode.textContent?.length || 0;
      currentNode = walker.nextNode();
    }
    
    return -1;
  }, [containerRef]);

  const handleSelection = useCallback((e?: MouseEvent) => {
    const container = containerRef.current;
    // Delay slightly to ensure selection is fully updated
    setTimeout(() => {
      const sel = window.getSelection();
      
      // Only update if we have a non-collapsed selection
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        return;
      }

      const range = sel.getRangeAt(0);
      
      // Check if selection is within the container
      if (container && !container.contains(range.commonAncestorContainer)) {
        return;
      }

      const text = sel.toString();
      const startIndex = getOffsetInContainer(range.startContainer, range.startOffset);
      const endIndex = getOffsetInContainer(range.endContainer, range.endOffset);

      if (startIndex === -1 || endIndex === -1) {
        return;
      }

      const rect = range.getBoundingClientRect();
      const clientRects = range.getClientRects();
      const lastRect = clientRects.length > 0 ? clientRects[clientRects.length - 1] : rect;
      
      let relativeRect = null;
      let lastRelativeRect = null;
      
      if (container) {
        const containerRect = container.getBoundingClientRect();
        relativeRect = {
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left,
          bottom: rect.bottom - containerRect.top,
          right: rect.right - containerRect.left,
        };
        lastRelativeRect = {
          top: lastRect.top - containerRect.top,
          left: lastRect.left - containerRect.left,
          bottom: lastRect.bottom - containerRect.top,
          right: lastRect.right - containerRect.left,
        };
      }

      setSelection({
        text,
        startIndex,
        endIndex,
        rect,
        relativeRect,
        lastRelativeRect,
      });
    }, 10);
  }, [containerRef, getOffsetInContainer]);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      handleSelection(e);
    };

    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleSelection]);

  return { selection, setSelection, handleSelection };
}
