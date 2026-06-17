class StorageProvider {
  async upload(buffer, filename, mimeType) {
    throw new Error('Method upload(buffer, filename, mimeType) must be implemented');
  }
  async getDownloadStream(fileId, range) {
    throw new Error('Method getDownloadStream(fileId, range) must be implemented');
  }
  async delete(chatId, messageId) {
    throw new Error('Method delete(chatId, messageId) must be implemented');
  }
}

module.exports = StorageProvider;
