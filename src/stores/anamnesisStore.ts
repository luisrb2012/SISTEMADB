import { create } from 'zustand';
import prisma from '../lib/prisma';

export type ExamType = 'TOMOGRAPHY' | 'RESONANCE' | 'OTHER';

export interface Anamnesis {
  id: string;
  patientId: string;
  examType: ExamType;
  examSubtype?: string;
  hasConsent: boolean;
  hasIdentificationTag: boolean;
  patientCondition?: any;
  hasDentalProsthesis: boolean;
  previousExams?: any;
  personalHistory?: any;
  medications: any[];
  allergies: any[];
  contrastAllergy: boolean;
  examPreparation?: any;
  examRoom?: any;
  postExam?: any;
  reports: any[];
  patientSignature?: string;
  professionalSignature?: string;
  signatureMethod?: 'DRAWING' | 'GOVBR';
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface AnamnesisState {
  anamneses: Anamnesis[];
  currentAnamnesis: Anamnesis | null;
  filteredAnamneses: Anamnesis[];
  isLoading: boolean;
  error: string | null;
  
  fetchAnamnesis: () => Promise<void>;
  fetchAnamnesisById: (id: string) => Promise<Anamnesis | null>;
  fetchAnamnesisForPatient: (patientId: string) => Promise<Anamnesis[]>;
  addAnamnesis: (anamnesis: Omit<Anamnesis, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Anamnesis>;
  updateAnamnesis: (id: string, data: Partial<Anamnesis>) => Promise<Anamnesis>;
  filterAnamnesis: (filter: { 
    dateRange?: { start: string, end: string }, 
    examType?: ExamType,
    patientName?: string 
  }) => Promise<void>;
}

export const useAnamnesisStore = create<AnamnesisState>((set, get) => ({
  anamneses: [],
  currentAnamnesis: null,
  filteredAnamneses: [],
  isLoading: false,
  error: null,
  
  fetchAnamnesis: async () => {
    set({ isLoading: true, error: null });
    try {
      const anamneses = await prisma.anamnesis.findMany({
        include: {
          patient: true,
          patientCondition: true,
          previousExams: true,
          personalHistory: true,
          medications: true,
          allergies: true,
          examPreparation: true,
          examRoom: {
            include: {
              preExam: true,
              venousPuncture: true
            }
          },
          postExam: {
            include: {
              vitals: true
            }
          },
          reports: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      set({ 
        anamneses,
        filteredAnamneses: anamneses,
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
      const anamnesis = await prisma.anamnesis.findUnique({
        where: { id },
        include: {
          patient: true,
          patientCondition: true,
          previousExams: true,
          personalHistory: true,
          medications: true,
          allergies: true,
          examPreparation: true,
          examRoom: {
            include: {
              preExam: true,
              venousPuncture: true
            }
          },
          postExam: {
            include: {
              vitals: true
            }
          },
          reports: true
        }
      });
      
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
      const anamneses = await prisma.anamnesis.findMany({
        where: { patientId },
        include: {
          patient: true,
          patientCondition: true,
          previousExams: true,
          personalHistory: true,
          medications: true,
          allergies: true,
          examPreparation: true,
          examRoom: {
            include: {
              preExam: true,
              venousPuncture: true
            }
          },
          postExam: {
            include: {
              vitals: true
            }
          },
          reports: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      set({ isLoading: false });
      return anamneses;
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
      const newAnamnesis = await prisma.anamnesis.create({
        data: {
          ...anamnesisData,
          patientCondition: {
            create: anamnesisData.patientCondition
          },
          previousExams: {
            create: anamnesisData.previousExams
          },
          personalHistory: {
            create: anamnesisData.personalHistory
          },
          medications: {
            create: anamnesisData.medications
          },
          allergies: {
            create: anamnesisData.allergies
          },
          examPreparation: {
            create: anamnesisData.examPreparation
          },
          examRoom: {
            create: {
              preExam: {
                create: anamnesisData.examRoom?.preExam
              },
              venousPuncture: {
                create: anamnesisData.examRoom?.venousPuncture
              }
            }
          },
          postExam: {
            create: {
              ...anamnesisData.postExam,
              vitals: {
                create: anamnesisData.postExam?.vitals
              }
            }
          },
          reports: {
            create: anamnesisData.reports
          }
        },
        include: {
          patient: true,
          patientCondition: true,
          previousExams: true,
          personalHistory: true,
          medications: true,
          allergies: true,
          examPreparation: true,
          examRoom: {
            include: {
              preExam: true,
              venousPuncture: true
            }
          },
          postExam: {
            include: {
              vitals: true
            }
          },
          reports: true
        }
      });
      
      set(state => ({
        anamneses: [newAnamnesis, ...state.anamneses],
        filteredAnamneses: [newAnamnesis, ...state.filteredAnamneses],
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
      const updatedAnamnesis = await prisma.anamnesis.update({
        where: { id },
        data: {
          ...data,
          patientCondition: {
            update: data.patientCondition
          },
          previousExams: {
            update: data.previousExams
          },
          personalHistory: {
            update: data.personalHistory
          },
          medications: {
            deleteMany: {},
            create: data.medications
          },
          allergies: {
            deleteMany: {},
            create: data.allergies
          },
          examPreparation: {
            update: data.examPreparation
          },
          examRoom: {
            update: {
              preExam: {
                update: data.examRoom?.preExam
              },
              venousPuncture: {
                update: data.examRoom?.venousPuncture
              }
            }
          },
          postExam: {
            update: {
              ...data.postExam,
              vitals: {
                update: data.postExam?.vitals
              }
            }
          },
          reports: {
            deleteMany: {},
            create: data.reports
          }
        },
        include: {
          patient: true,
          patientCondition: true,
          previousExams: true,
          personalHistory: true,
          medications: true,
          allergies: true,
          examPreparation: true,
          examRoom: {
            include: {
              preExam: true,
              venousPuncture: true
            }
          },
          postExam: {
            include: {
              vitals: true
            }
          },
          reports: true
        }
      });
      
      set(state => ({
        anamneses: state.anamneses.map(a => a.id === id ? updatedAnamnesis : a),
        filteredAnamneses: state.filteredAnamneses.map(a => a.id === id ? updatedAnamnesis : a),
        isLoading: false
      }));
      
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
  
  filterAnamnesis: async (filter) => {
    set({ isLoading: true, error: null });
    try {
      const where: any = {};
      
      if (filter.dateRange) {
        where.createdAt = {
          gte: new Date(filter.dateRange.start),
          lte: new Date(filter.dateRange.end)
        };
      }
      
      if (filter.examType) {
        where.examType = filter.examType;
      }
      
      if (filter.patientName) {
        where.patient = {
          name: {
            contains: filter.patientName,
            mode: 'insensitive'
          }
        };
      }
      
      const filtered = await prisma.anamnesis.findMany({
        where,
        include: {
          patient: true,
          patientCondition: true,
          previousExams: true,
          personalHistory: true,
          medications: true,
          allergies: true,
          examPreparation: true,
          examRoom: {
            include: {
              preExam: true,
              venousPuncture: true
            }
          },
          postExam: {
            include: {
              vitals: true
            }
          },
          reports: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      set({ filteredAnamneses: filtered, isLoading: false });
    } catch (error) {
      console.error('Error filtering anamnesis:', error);
      set({
        error: 'Falha ao filtrar registros de anamnese',
        isLoading: false
      });
    }
  }
}));