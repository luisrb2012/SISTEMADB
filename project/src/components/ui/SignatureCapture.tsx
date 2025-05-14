import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Pen, RefreshCw } from 'lucide-react';

// Define GovBr icon component since it doesn't exist in lucide-react
const GovBr = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 7v10" />
    <path d="M7 12h10" />
  </svg>
);

interface SignatureCaptureProps {
  onSignatureCapture: (dataUrl: string, method: 'drawing' | 'govbr') => void;
  className?: string;
}

/**
 * Signature capture component with support for drawing signatures and gov.br integration
 */
const SignatureCapture: React.FC<SignatureCaptureProps> = ({ onSignatureCapture, className = '' }) => {
  const [signMethod, setSignMethod] = useState<'drawing' | 'govbr' | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  // Clear the signature
  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSigned(false);
    }
  };
  
  // Save the signature as data URL
  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.toDataURL('image/png');
      onSignatureCapture(dataUrl, 'drawing');
      setIsSigned(true);
    }
  };
  
  // Mock the gov.br integration (in real implementation, this would connect to the gov.br API)
  const signWithGovBr = () => {
    // Simulate gov.br authentication and signing process
    setTimeout(() => {
      // In a real implementation, this would receive a signature token from gov.br
      onSignatureCapture('gov.br-signature-token', 'govbr');
      setIsSigned(true);
      setSignMethod('govbr');
    }, 1500);
  };
  
  return (
    <div className={`rounded-md border border-gray-300 bg-white p-4 ${className}`}>
      <h3 className="mb-4 text-sm font-medium text-gray-700">Assinatura</h3>
      
      {/* Signature Method Selection */}
      {!signMethod && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSignMethod('drawing')}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Pen size={20} className="mr-2" />
            Desenhar Assinatura
          </button>
          
          <button
            type="button"
            onClick={() => setSignMethod('govbr')}
            className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <GovBr size={20} className="mr-2" />
            Assinar com gov.br
          </button>
        </div>
      )}
      
      {/* Drawing Signature */}
      {signMethod === 'drawing' && !isSigned && (
        <>
          <div className="mb-2 rounded-md border border-gray-300 bg-gray-50">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: 'signature-canvas w-full h-40',
                style: { backgroundColor: '#f9fafb' }
              }}
              penColor="black"
            />
          </div>
          
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <RefreshCw size={16} className="mr-1" />
              Limpar
            </button>
            <button
              type="button"
              onClick={saveSignature}
              className="flex-1 rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Confirmar Assinatura
            </button>
          </div>
        </>
      )}
      
      {/* Gov.br Signature */}
      {signMethod === 'govbr' && !isSigned && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <GovBr size={32} className="text-blue-600" />
          </div>
          <p className="mb-4 text-center text-sm text-gray-600">
            Você será redirecionado para o portal gov.br para realizar a assinatura digital.
          </p>
          <button
            type="button"
            onClick={signWithGovBr}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Continuar para gov.br
          </button>
        </div>
      )}
      
      {/* Signature Confirmation */}
      {isSigned && (
        <div className="flex flex-col items-center justify-center rounded-md bg-green-50 py-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mb-2 text-center text-sm font-medium text-green-800">
            Assinatura {signMethod === 'govbr' ? 'digital via gov.br' : ''} registrada com sucesso!
          </p>
          <button
            type="button"
            onClick={() => {
              setSignMethod(null);
              setIsSigned(false);
              if (sigCanvas.current) {
                sigCanvas.current.clear();
              }
            }}
            className="mt-2 text-xs font-medium text-green-600 hover:text-green-700"
          >
            Alterar método de assinatura
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureCapture;