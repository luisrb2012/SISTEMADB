import { create } from 'zustand';

export interface Patient {
  id: string;
  patientId: string; // ID do paciente (número de identificação)
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientState {
  patients: Patient[];
  todayAppointments: Patient[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPatients: () => Promise<void>;
  fetchTodayAppointments: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Patient>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<Patient>;
  getPatientById: (id: string) => Patient | undefined;
}

// Mock data for development
const mockPatients: Patient[] = [
  {
    id: '1',
    patientId: 'PAT-001',
    name: 'Ana Silva',
    birthDate: '1985-04-12',
    gender: 'female',
    phone: '(11) 98765-4321',
    email: 'ana.silva@example.com',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    patientId: 'PAT-002',
    name: 'Carlos Oliveira',
    birthDate: '1972-08-22',
    gender: 'male',
    phone: '(11) 91234-5678',
    email: 'carlos.oliveira@example.com',
    createdAt: '2023-01-16T14:45:00Z',
    updatedAt: '2023-01-16T14:45:00Z',
  },
  {
    id: '3',
    patientId: 'PAT-003',
    name: 'Mariana Costa',
    birthDate: '1990-11-30',
    gender: 'female',
    phone: '(11) 99876-5432',
    email: 'mariana.costa@example.com',
    createdAt: '2023-01-17T09:15:00Z',
    updatedAt: '2023-01-17T09:15:00Z',
  },
];

/**
 * Patient store using Zustand 
 * Manages patient data and related operations
 */
export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  todayAppointments: [],
  isLoading: false,
  error: null,
  
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real implementation, this would be an API call
      // For demonstration, using mock data with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ patients: mockPatients, isLoading: false });
    } catch (error) {
      console.error('Error fetching patients:', error);
      set({ 
        error: 'Falha ao carregar lista de pacientes',
        isLoading: false 
      });
    }
  },
  
  fetchTodayAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to get today's appointments
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ 
        todayAppointments: mockPatients.slice(0, 2),
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      set({ 
        error: 'Falha ao carregar agenda do dia',
        isLoading: false 
      });
    }
  },
  
  addPatient: async (patientData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to add patient
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPatient: Patient = {
        ...patientData,
        id: `${Date.now()}`, // Generate a temporary ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        patients: [...state.patients, newPatient],
        isLoading: false
      }));
      
      return newPatient;
    } catch (error) {
      console.error('Error adding patient:', error);
      set({ 
        error: 'Falha ao adicionar paciente',
        isLoading: false 
      });
      throw error;
    }
  },
  
  updatePatient: async (id, patientData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to update patient
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedPatient: Patient | undefined;
      
      set(state => {
        const updatedPatients = state.patients.map(patient => {
          if (patient.id === id) {
            updatedPatient = {
              ...patient,
              ...patientData,
              updatedAt: new Date().toISOString(),
            };
            return updatedPatient;
          }
          return patient;
        });
        
        return {
          patients: updatedPatients,
          isLoading: false
        };
      });
      
      if (!updatedPatient) {
        throw new Error('Patient not found');
      }
      
      return updatedPatient;
    } catch (error) {
      console.error('Error updating patient:', error);
      set({ 
        error: 'Falha ao atualizar paciente',
        isLoading: false 
      });
      throw error;
    }
  },
  
  getPatientById: (id) => {
    return get().patients.find(patient => patient.id === id);
  },
}));