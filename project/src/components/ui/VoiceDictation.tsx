import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceDictationProps {
  onTextCaptured: (text: string) => void;
  className?: string;
}

/**
 * Voice dictation component that uses the Web Speech API
 * to transcribe speech to text
 */
const VoiceDictation: React.FC<VoiceDictationProps> = ({ onTextCaptured, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check if speech recognition is supported in the browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Initialize and handle speech recognition
  const toggleListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (isListening) {
      // Stop listening
      if (window.recognitionInstance) {
        window.recognitionInstance.stop();
        delete window.recognitionInstance;
      }
      setIsListening(false);
      return;
    }
    
    // Start listening
    setIsInitializing(true);
    const recognition = new SpeechRecognition();
    window.recognitionInstance = recognition;
    
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      
      if (event.results[last].isFinal) {
        onTextCaptured(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setIsInitializing(false);
      if (event.error === 'not-allowed') {
        alert('É necessário permitir o acesso ao microfone para utilizar o ditado por voz.');
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setIsInitializing(false);
    };
    
    recognition.onstart = () => {
      setIsListening(true);
      setIsInitializing(false);
    };
    
    recognition.start();
  }, [isListening, isSupported, onTextCaptured]);

  if (!isSupported) {
    return (
      <div className={`flex items-center text-sm text-error-600 ${className}`}>
        <MicOff className="mr-1 h-4 w-4" />
        Ditado por voz não suportado neste navegador
      </div>
    );
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isInitializing}
      className={`relative flex items-center justify-center rounded-md bg-white px-4 py-2 shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
        isListening ? 'border-primary-500 ring-2 ring-primary-500' : 'border border-gray-300'
      } ${className}`}
      title={isListening ? 'Parar ditado' : 'Iniciar ditado'}
    >
      {isInitializing ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-600" />
      ) : isListening ? (
        <Mic className="mr-2 h-5 w-5 text-primary-600" />
      ) : (
        <Mic className="mr-2 h-5 w-5 text-gray-600" />
      )}
      
      <span className="text-sm font-medium">
        {isInitializing ? 'Iniciando...' : isListening ? 'Ditando...' : 'Ditado por voz'}
      </span>
      
      {isListening && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-500"></span>
        </span>
      )}
    </button>
  );
};

// Extend the Window interface to include our recognitionInstance
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
    recognitionInstance?: any;
  }
}

export default VoiceDictation;