import { create } from 'zustand';

export type ExamType = 'tomography' | 'resonance' | 'other';

export interface Allergy {
  type: string;
  reaction: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface MetallicDevice {
  type: string;
  location: string;
  yearImplanted?: string;
}

export interface DiseaseHistory {
  condition: string;
  diagnosisYear?: string;
  treatment?: string;
}

export interface Anamnesis {
  id: string;
  patientId: string;
  examType: ExamType;
  examSubtype?: string;
  medications: Medication[];
  allergies: Allergy[];
  contrastAllergy: boolean;
  diseaseHistory: DiseaseHistory[];
  metallicDevices: MetallicDevice[];
  pacemaker: boolean;
  claustrophobia: boolean;
  lastMenstruation?: string;
  pregnancy: boolean;
  consentSigned: boolean;
  signatureDataUrl?: string;
  signatureGovBr?: boolean;
  additionalNotes: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AnamnesisState {
  anamneses: Anamnesis[];
  currentAnamnesis: Anamnesis | null;
  filteredAnamneses: Anamnesis[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAnamnesis: () => Promise<void>;
  fetchAnamnesisById: (id: string) => Promise<Anamnesis | null>;
  fetchAnamnesisForPatient: (patientId: string) => Promise<Anamnesis[]>;
  addAnamnesis: (anamnesis: Omit<Anamnesis, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Anamnesis>;
  updateAnamnesis: (id: string, data: Partial<Anamnesis>) => Promise<Anamnesis>;
  filterAnamnesis: (filter: { 
    dateRange?: { start: string, end: string }, 
    examType?: ExamType,
    patientName?: string 
  }) => void;
}

// Mock data for development
const mockAnamneses: Anamnesis[] = [
  {
    id: '1',
    patientId: '1',
    examType: 'tomography',
    examSubtype: 'Crânio',
    medications: [
      { name: 'Atenolol', dosage: '50mg', frequency: '1x ao dia' }
    ],
    allergies: [
      { type: 'Medicamento', reaction: 'Dipirona - Urticária' }
    ],
    contrastAllergy: false,
    diseaseHistory: [
      { condition: 'Hipertensão', diagnosisYear: '2018', treatment: 'Medicamentoso' }
    ],
    metallicDevices: [],
    pacemaker: false,
    claustrophobia: false,
    pregnancy: false,
    consentSigned: true,
    signatureDataUrl: 'data:image/png;base64,mockSignatureData',
    additionalNotes: 'Paciente relata dores de cabeça frequentes nos últimos 3 meses.',
    attachments: ['documento1.pdf'],
    createdBy: '1',
    createdAt: '2023-05-10T11:30:00Z',
    updatedAt: '2023-05-10T11:30:00Z',
  },
  {
    id: '2',
    patientId: '2',
    examType: 'resonance',
    examSubtype: 'Coluna Lombar',
    medications: [
      { name: 'Omeprazol', dosage: '20mg', frequency: '1x ao dia' },
      { name: 'Ibuprofeno', dosage: '600mg', frequency: 'Quando necessário' }
    ],
    allergies: [],
    contrastAllergy: false,
    diseaseHistory: [
      { condition: 'Hérnia de disco', diagnosisYear: '2020', treatment: 'Fisioterapia' }
    ],
    metallicDevices: [
      { type: 'Placa ortopédica', location: 'Tornozelo direito', yearImplanted: '2019' }
    ],
    pacemaker: false,
    claustrophobia: true,
    pregnancy: false,
    consentSigned: true,
    signatureGovBr: true,
    additionalNotes: 'Paciente relata dor irradiada para perna direita.',
    attachments: ['pedido_medico.pdf', 'exame_anterior.pdf'],
    createdBy: '1',
    createdAt: '2023-05-12T14:45:00Z',
    updatedAt: '2023-05-12T14:45:00Z',
  }
];

/**
 * Anamnesis store using Zustand
 * Manages anamnesis data and related operations
 */
export const useAnamnesisStore = create<AnamnesisState>((set, get) => ({
  anamneses: [],
  currentAnamnesis: null,
  filteredAnamneses: [],
  isLoading: false,
  error: null,
  
  fetchAnamnesis: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to fetch anamnesis records
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ 
        anamneses: mockAnamneses,
        filteredAnamneses: mockAnamneses,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching anamnesis:', error);
      set({ 
        error: 'Falha ao carregar registros de anamnese',
        isLoading: false 
      });
    }
  },
  
  fetchAnamnesisById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to fetch anamnesis by ID
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const anamnesis = mockAnamneses.find(a => a.id === id) || null;
      set({ 
        currentAnamnesis: anamnesis,
        isLoading: false 
      });
      
      return anamnesis;
    } catch (error) {
      console.error('Error fetching anamnesis by ID:', error);
      set({ 
        error: 'Falha ao carregar registro de anamnese',
        isLoading: false 
      });
      return null;
    }
  },
  
  fetchAnamnesisForPatient: async (patientId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to fetch anamnesis for a patient
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const patientAnamneses = mockAnamneses.filter(a => a.patientId === patientId);
      set({ isLoading: false });
      
      return patientAnamneses;
    } catch (error) {
      console.error('Error fetching anamnesis for patient:', error);
      set({ 
        error: 'Falha ao carregar histórico de anamnese do paciente',
        isLoading: false 
      });
      return [];
    }
  },
  
  addAnamnesis: async (anamnesisData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to add anamnesis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAnamnesis: Anamnesis = {
        ...anamnesisData,
        id: `${Date.now()}`, // Generate a temporary ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        anamneses: [...state.anamneses, newAnamnesis],
        filteredAnamneses: [...state.filteredAnamneses, newAnamnesis],
        isLoading: false
      }));
      
      return newAnamnesis;
    } catch (error) {
      console.error('Error adding anamnesis:', error);
      set({ 
        error: 'Falha ao adicionar registro de anamnese',
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateAnamnesis: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to update anamnesis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedAnamnesis: Anamnesis | undefined;
      
      set(state => {
        const updatedAnamneses = state.anamneses.map(anamnesis => {
          if (anamnesis.id === id) {
            updatedAnamnesis = {
              ...anamnesis,
              ...data,
              updatedAt: new Date().toISOString(),
            };
            return updatedAnamnesis;
          }
          return anamnesis;
        });
        
        const updatedFilteredAnamneses = state.filteredAnamneses.map(anamnesis => {
          if (anamnesis.id === id) {
            return {
              ...anamnesis,
              ...data,
              updatedAt: new Date().toISOString(),
            };
          }
          return anamnesis;
        });
        
        return {
          anamneses: updatedAnamneses,
          filteredAnamneses: updatedFilteredAnamneses,
          isLoading: false
        };
      });
      
      if (!updatedAnamnesis) {
        throw new Error('Anamnesis not found');
      }
      
      return updatedAnamnesis;
    } catch (error) {
      console.error('Error updating anamnesis:', error);
      set({ 
        error: 'Falha ao atualizar registro de anamnese',
        isLoading: false 
      });
      throw error;
    }
  },
  
  filterAnamnesis: (filter) => {
    const { anamneses } = get();
    
    let filtered = [...anamneses];
    
    // Filter by date range
    if (filter.dateRange) {
      const { start, end } = filter.dateRange;
      filtered = filtered.filter(anamnesis => {
        const createdAt = new Date(anamnesis.createdAt);
        return createdAt >= new Date(start) && createdAt <= new Date(end);
      });
    }
    
    // Filter by exam type
    if (filter.examType) {
      filtered = filtered.filter(anamnesis => anamnesis.examType === filter.examType);
    }
    
    // In a real application, this would query by patient name through an API
    // For now we'll simulate it with our limited data
    if (filter.patientName) {
      // This is just a placeholder since we don't have patient names in our store
      // In a real app, you would either join with patient data or query an API
    }
    
    set({ filteredAnamneses: filtered });
  }
}));