import React from 'react';
import { useUploadStore } from '../../store/uploadStore';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';

export default function UploadQueue() {
  const { queue, clearQueue } = useUploadStore();

  if (queue.length === 0) return null;

  const activeCount = queue.filter(item => item.status === 'uploading').length;

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white border border-border-subtle rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col font-inter">
      <div className="px-4 py-3 bg-heading-text text-white flex items-center justify-between">
        <span className="font-plus-jakarta font-medium text-sm">
          {activeCount > 0 ? `Uploading ${activeCount} file(s)...` : 'Uploads completed'}
        </span>
        <button onClick={clearQueue} className="text-secondary-text hover:text-white transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto p-3 space-y-3">
        {queue.map((item) => (
          <div key={item.id} className="flex flex-col gap-1.5 border-b border-border-subtle pb-2 last:border-b-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium truncate text-body-text">{item.name}</span>
              <div className="shrink-0">
                {item.status === 'uploading' && (
                  <span className="text-xs font-semibold text-orange-primary flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {item.progress}%
                  </span>
                )}
                {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-success" />}
                {item.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
              </div>
            </div>
            {item.status === 'uploading' && (
              <div className="w-full bg-surface-muted h-1 rounded-full overflow-hidden">
                <div className="bg-orange-primary h-full transition-all" style={{ width: `${item.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
