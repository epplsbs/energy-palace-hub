interface ResizeOptions {
  maxSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

export class ImageResizer {
  private static createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private static calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };
    
    // Calculate aspect ratio
    const aspectRatio = width / height;
    
    // Resize based on constraints
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }

  private static async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private static canvasToBlob(
    canvas: HTMLCanvasElement, 
    format: string, 
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        format,
        quality
      );
    });
  }

  static async resizeImage(file: File, options: ResizeOptions = {}): Promise<File> {
    const {
      maxSizeKB = 200,
      maxWidth = 1920,
      maxHeight = 1080,
      quality: initialQuality = 0.9,
      format = 'jpeg'
    } = options;

    // Load the original image
    const img = await this.loadImage(file);
    
    // Calculate new dimensions
    const { width, height } = this.calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      maxWidth,
      maxHeight
    );

    // Create canvas and draw resized image
    const canvas = this.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw the image
    ctx.drawImage(img, 0, 0, width, height);

    // Binary search for optimal quality
    let quality = initialQuality;
    let minQuality = 0.1;
    let maxQuality = 0.95;
    let attempts = 0;
    const maxAttempts = 10;

    const mimeType = `image/${format}`;
    const targetSizeBytes = maxSizeKB * 1024;

    while (attempts < maxAttempts) {
      const blob = await this.canvasToBlob(canvas, mimeType, quality);
      
      if (blob.size <= targetSizeBytes) {
        // Size is acceptable, create and return the file
        const timestamp = Date.now();
        const extension = format === 'jpeg' ? 'jpg' : format;
        const fileName = `resized_${timestamp}.${extension}`;
        
        return new File([blob], fileName, { type: mimeType });
      }
      
      // Size is too large, reduce quality
      maxQuality = quality;
      quality = (minQuality + quality) / 2;
      attempts++;
      
      // If quality gets too low, reduce dimensions instead
      if (quality < 0.3 && attempts < maxAttempts - 2) {
        const newWidth = Math.round(width * 0.8);
        const newHeight = Math.round(height * 0.8);
        const newCanvas = this.createCanvas(newWidth, newHeight);
        const newCtx = newCanvas.getContext('2d');
        
        if (newCtx) {
          newCtx.imageSmoothingEnabled = true;
          newCtx.imageSmoothingQuality = 'high';
          newCtx.drawImage(img, 0, 0, newWidth, newHeight);
          canvas.width = newWidth;
          canvas.height = newHeight;
          canvas.getContext('2d')?.drawImage(newCanvas, 0, 0);
        }
        
        quality = 0.8; // Reset quality for smaller dimensions
        minQuality = 0.1;
        maxQuality = 0.95;
      }
    }

    // If we couldn't reach target size, return the last attempt
    const finalBlob = await this.canvasToBlob(canvas, mimeType, quality);
    const timestamp = Date.now();
    const extension = format === 'jpeg' ? 'jpg' : format;
    const fileName = `resized_${timestamp}.${extension}`;
    
    return new File([finalBlob], fileName, { type: mimeType });
  }

  static async uploadToSupabase(file: File, bucket: string, folder?: string): Promise<string> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB max original size

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: 'Image file size must be less than 50MB'
      };
    }

    return { valid: true };
  }
}

export default ImageResizer;
