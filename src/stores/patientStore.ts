import { create } from 'zustand';
import prisma from '../lib/prisma';

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
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
  searchResults: Patient[];
  
  // Actions
  fetchPatients: () => Promise<void>;
  fetchTodayAppointments: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Patient>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<Patient>;
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  todayAppointments: [],
  searchResults: [],
  isLoading: false,
  error: null,
  
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const patients = await prisma.patient.findMany({
        orderBy: { createdAt: 'desc' }
      });
      set({ patients, isLoading: false });
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const appointments = await prisma.patient.findMany({
        where: {
          createdAt: {
            gte: today
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      set({ todayAppointments: appointments, isLoading: false });
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
      const newPatient = await prisma.patient.create({
        data: patientData
      });
      
      set(state => ({
        patients: [newPatient, ...state.patients],
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
      const updatedPatient = await prisma.patient.update({
        where: { id },
        data: patientData
      });
      
      set(state => ({
        patients: state.patients.map(p => p.id === id ? updatedPatient : p),
        isLoading: false
      }));
      
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
  
  searchPatients: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const results = await prisma.patient.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { patientId: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { name: 'asc' }
      });
      
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      console.error('Error searching patients:', error);
      set({
        error: 'Falha ao pesquisar pacientes',
        isLoading: false
      });
    }
  }
}));