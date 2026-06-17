import { create } from 'zustand';
import api from '../api/axiosInstance';

export const useUploadStore = create((set, get) => ({
  queue: [], // { id, name, progress, status: 'idle' | 'uploading' | 'completed' | 'failed' }

  addToQueue: (item) => set((state) => ({ queue: [...state.queue, item] })),

  updateProgress: (id, progress) => set((state) => ({
    queue: state.queue.map((item) =>
      item.id === id ? { ...item, progress, status: progress === 100 ? 'completed' : 'uploading' } : item
    ),
  })),

  updateStatus: (id, status) => set((state) => ({
    queue: state.queue.map((item) =>
      item.id === id ? { ...item, status } : item
    ),
  })),

  clearQueue: () => set({ queue: [] }),

  uploadFile: async (file, folderId = null) => {
    const id = Math.random().toString(36).substring(7);
    const newItem = { id, name: file.name, progress: 0, status: 'uploading' };
    
    get().addToQueue(newItem);

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          get().updateProgress(id, percentCompleted);
        },
      });

      get().updateStatus(id, 'completed');
      return response.data.data;
    } catch (error) {
      get().updateStatus(id, 'failed');
      console.error('File upload failed:', error.message);
      return null;
    }
  },
}));
