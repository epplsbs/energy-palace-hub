import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import ImageResizer from '@/lib/imageUtils';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  maxSizeKB?: number;
  accept?: string;
  bucket?: string;
  folder?: string;
  placeholder?: string;
}

const ImageUpload = ({
  onImageUploaded,
  currentImageUrl,
  maxSizeKB = 200,
  accept = 'image/*',
  bucket = 'gallery',
  folder = 'images',
  placeholder = 'Upload an image or enter URL'
}: ImageUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl || '');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = ImageResizer.validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Show initial progress
      setUploadProgress(20);

      // Resize the image
      const resizedFile = await ImageResizer.resizeImage(file, {
        maxSizeKB,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.9,
        format: 'jpeg'
      });

      setUploadProgress(60);

      // Create preview
      const previewUrl = URL.createObjectURL(resizedFile);
      setPreviewUrl(previewUrl);

      setUploadProgress(80);

      // Upload to Supabase
      const uploadedUrl = await ImageResizer.uploadToSupabase(resizedFile, bucket, folder);

      setUploadProgress(100);

      // Show success message with file size info
      const originalSize = ImageResizer.formatFileSize(file.size);
      const resizedSize = ImageResizer.formatFileSize(resizedFile.size);

      toast({
        title: "Upload Successful",
        description: `Image resized from ${originalSize} to ${resizedSize} and uploaded successfully`,
      });

      onImageUploaded(uploadedUrl);
      setUrlInput(uploadedUrl);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    setPreviewUrl(urlInput);
    onImageUploaded(urlInput);
    
    toast({
      title: "URL Added",
      description: "Image URL has been set successfully",
    });
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUrlInput('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Image URL
        </Button>
      </div>

      {mode === 'upload' ? (
        <div>
          <Label>Upload Image (Will be resized to ~{maxSizeKB}KB)</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image File
                </>
              )}
            </Button>
          </div>
          
          {uploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-1">
                {uploadProgress < 20 && "Preparing..."}
                {uploadProgress >= 20 && uploadProgress < 60 && "Resizing image..."}
                {uploadProgress >= 60 && uploadProgress < 80 && "Creating preview..."}
                {uploadProgress >= 80 && uploadProgress < 100 && "Uploading..."}
                {uploadProgress === 100 && "Complete!"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Label>Image URL</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={uploading}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={uploading || !urlInput.trim()}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Preview</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                toast({
                  title: "Image Error",
                  description: "Failed to load image preview",
                  variant: "destructive",
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
