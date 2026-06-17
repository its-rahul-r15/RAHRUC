const sharp = require('sharp');

class ThumbnailService {
  async generateImageThumbnail(buffer) {
    try {
      return await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch (error) {
      console.error('Failed to generate image thumbnail:', error.message);
      return null;
    }
  }

  async getMetadata(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      return { width: null, height: null };
    }
  }
}

module.exports = new ThumbnailService();
