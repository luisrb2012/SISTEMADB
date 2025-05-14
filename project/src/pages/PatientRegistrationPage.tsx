import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore, Patient } from '../stores/patientStore';
import { Save, User, X } from 'lucide-react';

/**
 * Patient registration page component
 * Handles creation and editing of patient records
 */
const PatientRegistrationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    getPatientById, 
    addPatient, 
    updatePatient, 
    isLoading 
  } = usePatientStore();
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    birthDate: '',
    gender: 'male',
    phone: '',
    email: '',
  });
  
  const [error, setError] = useState('');
  
  // Load patient data if editing
  useEffect(() => {
    if (id) {
      const patient = getPatientById(id);
      if (patient) {
        setFormData({
          patientId: patient.patientId,
          name: patient.name,
          birthDate: patient.birthDate,
          gender: patient.gender,
          phone: patient.phone || '',
          email: patient.email || '',
        });
      } else {
        setError('Paciente não encontrado');
      }
    }
  }, [id, getPatientById]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (id) {
        // Update existing patient
        await updatePatient(id, formData);
      } else {
        // Create new patient
        await addPatient(formData as Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving patient:', err);
      setError('Ocorreu um erro ao salvar o paciente. Por favor, tente novamente.');
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
        </h1>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-error-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-error-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                      <User className="h-6 w-6 text-primary-600" />
                    </span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                      Informações do Paciente
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {id 
                        ? 'Atualize as informações do paciente conforme necessário.'
                        : 'Preencha os dados para cadastrar um novo paciente no sistema.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  ID do Paciente
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Número de identificação"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Sexo
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="(xx) xxxxx-xxxx"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationPage;