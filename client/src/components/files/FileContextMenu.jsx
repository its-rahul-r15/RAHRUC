import React, { useEffect, useRef } from 'react';
import { Trash, Star, FolderInput, Edit2, RotateCcw, XCircle, Share2 } from 'lucide-react';

export default function FileContextMenu({ item, type, x, y, onClose, onRename, onMove, onStar, onDelete, onRestore, onShare, isTrashView }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const buttonStyle = "w-full text-left px-4 py-2 text-sm text-body-text hover:bg-surface-muted flex items-center gap-2 transition-colors cursor-pointer";

  return (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="absolute bg-white border border-border-subtle rounded-xl shadow-lg py-1 z-50 min-w-44 font-inter"
    >
      {isTrashView ? (
        <>
          <button onClick={() => { onRestore(item, type); onClose(); }} className={buttonStyle}>
            <RotateCcw className="w-4 h-4 text-green-success" />
            <span>Restore</span>
          </button>
          <button onClick={() => { onDelete(item, type, true); onClose(); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer">
            <XCircle className="w-4 h-4" />
            <span>Delete Forever</span>
          </button>
        </>
      ) : (
        <>
          <button onClick={() => { onRename(item, type); onClose(); }} className={buttonStyle}>
            <Edit2 className="w-4 h-4 text-secondary-text" />
            <span>Rename</span>
          </button>
          <button onClick={() => { onMove(item, type); onClose(); }} className={buttonStyle}>
            <FolderInput className="w-4 h-4 text-secondary-text" />
            <span>Move</span>
          </button>
          {type === 'file' && (
            <>
              <button onClick={() => { onStar(item); onClose(); }} className={buttonStyle}>
                <Star className={`w-4 h-4 ${item.isStarred ? 'fill-amber-warning text-amber-warning' : 'text-secondary-text'}`} />
                <span>{item.isStarred ? 'Unstar' : 'Star'}</span>
              </button>
              <button onClick={() => { onShare(item); onClose(); }} className={buttonStyle}>
                <Share2 className="w-4 h-4 text-secondary-text" />
                <span>Share Link</span>
              </button>
            </>
          )}
          <hr className="border-border-subtle my-1" />
          <button onClick={() => { onDelete(item, type, false); onClose(); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer">
            <Trash className="w-4 h-4" />
            <span>Move to Trash</span>
          </button>
        </>
      )}
    </div>
  );
}
