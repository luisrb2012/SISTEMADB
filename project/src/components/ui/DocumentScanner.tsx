import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface DocumentScannerProps {
  onDocumentCaptured: (file: File) => void;
  className?: string;
}

/**
 * Document scanner component that allows capturing documents
 * using device camera or file upload
 */
const DocumentScanner: React.FC<DocumentScannerProps> = ({ onDocumentCaptured, className = '' }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  // Process the selected or captured file
  const processFile = (file: File) => {
    // Create a preview URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Pass the file to the parent component
    onDocumentCaptured(file);
  };
  
  // Start camera capture
  const startCapture = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsCapturing(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Não foi possível acessar a câmera. Verifique se deu permissão para o uso da câmera.');
    }
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'document-scan.jpg', { type: 'image/jpeg' });
            processFile(file);
            stopCapture();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };
  
  // Stop camera capture
  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };
  
  // Clear the captured image
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`rounded-md border border-gray-300 bg-white p-4 ${className}`}>
      <div className="mb-4 flex justify-between">
        <h3 className="text-sm font-medium text-gray-700">Digitalizar Documento</h3>
        {previewUrl && (
          <button
            type="button"
            onClick={clearImage}
            className="text-error-600 hover:text-error-700"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Preview Area */}
      {previewUrl ? (
        <div className="mb-4 overflow-hidden rounded-md border border-gray-200">
          <img 
            src={previewUrl} 
            alt="Documento digitalizado" 
            className="h-auto w-full max-w-full object-contain"
          />
        </div>
      ) : isCapturing ? (
        <div className="relative mb-4">
          <video
            ref={videoRef}
            className="h-auto w-full rounded-md"
            autoPlay
            playsInline
            muted
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      ) : (
        <div className="mb-4 flex h-40 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-center text-sm text-gray-500">
            Clique nos botões abaixo para capturar um documento
          </p>
        </div>
      )}
      
      {/* Control Buttons */}
      <div className="flex space-x-2">
        {isCapturing ? (
          <>
            <button
              type="button"
              onClick={captureImage}
              className="flex-1 rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Capturar
            </button>
            <button
              type="button"
              onClick={stopCapture}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startCapture}
              className="flex-1 flex items-center justify-center rounded-md bg-secondary-600 px-3 py-2 text-sm font-medium text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <Camera size={18} className="mr-1" />
              Câmera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Upload size={18} className="mr-1" />
              Arquivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentScanner;