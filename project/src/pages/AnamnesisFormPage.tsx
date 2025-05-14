import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '../stores/patientStore';
import AnamnesisForm from '../components/anamnesis/AnamnesisForm';
import { AlertCircle } from 'lucide-react';

/**
 * Anamnesis form page component
 * Container for the anamnesis form with patient loading logic
 */
const AnamnesisFormPage: React.FC = () => {
  const { patientId, id: anamnesisId } = useParams();
  const navigate = useNavigate();
  
  const { fetchPatients, getPatientById, patients, isLoading } = usePatientStore();
  const [patient, setPatient] = useState<ReturnType<typeof getPatientById>>();
  
  // Load patient data
  useEffect(() => {
    if (patients.length === 0) {
      fetchPatients();
    } else if (patientId) {
      setPatient(getPatientById(patientId));
    }
  }, [fetchPatients, getPatientById, patientId, patients]);
  
  // Handle successful save
  const handleSaveSuccess = () => {
    navigate('/anamnesis-history');
  };
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }
  
  if (!patient && patientId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-md">
        <AlertCircle className="mb-4 h-12 w-12 text-error-500" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Paciente não encontrado</h2>
        <p className="mb-6 text-center text-gray-600">
          Não foi possível encontrar o paciente solicitado. Verifique se o ID está correto.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          Voltar para Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {anamnesisId ? 'Editar Anamnese' : 'Nova Anamnese'}
        </h1>
      </div>
      
      {patient && (
        <AnamnesisForm
          patientId={patient.id}
          patientName={patient.name}
          anamnesisId={anamnesisId}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default AnamnesisFormPage;