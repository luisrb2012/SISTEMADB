import React, { useState } from 'react';
import { useAnamnesisStore } from '../../stores/anamnesisStore';
import VoiceDictation from '../ui/VoiceDictation';
import DocumentScanner from '../ui/DocumentScanner';
import SignatureCapture from '../ui/SignatureCapture';
import { PlusCircle, MinusCircle, Save } from 'lucide-react';

interface AnamnesisFormProps {
  patientId: string;
  patientName: string;
  anamnesisId?: string;
  onSave: () => void;
}

const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ 
  patientId, 
  patientName, 
  anamnesisId,
  onSave 
}) => {
  const { currentAnamnesis, fetchAnamnesisById, addAnamnesis, updateAnamnesis, isLoading } = useAnamnesisStore();
  
  // Form state
  const [formData, setFormData] = useState({
    // Avaliação Inicial
    hasConsent: false,
    hasIdentificationTag: false,
    
    // Condição do Paciente
    patientCondition: {
      walking: false,
      walkingWithHelp: false,
      wheelchair: false,
      stretcher: false,
      sitting: false,
      accompaniedBy: '',
      oriented: false,
      confused: false,
      anxious: false,
      calm: false,
      phobic: false
    },
    
    // Informações Dentárias
    hasDentalProsthesis: false,
    
    // Exames Anteriores
    previousExams: {
      has: false,
      description: ''
    },
    
    // Antecedentes Pessoais
    personalHistory: {
      hasHAS: false,
      hasDM: false,
      hasAnxietyDepression: false,
      hasCardiopathy: false,
      hasAsthma: false,
      hasIRC: false,
      hasCholesterol: false,
      hasThyroid: false,
      otherConditions: ''
    },
    
    // Medicações
    medications: {
      using: false,
      description: ''
    },
    
    // Alergias
    allergies: {
      has: false,
      description: '',
      unknown: false
    },
    
    // Preparo para Exame
    examPreparation: {
      done: false,
      fasting: false,
      fastingHours: '',
    },
    
    // Sala de Exames
    examRoom: {
      preExam: {
        time: '',
        bloodPressure: '',
        heartRate: '',
        o2Saturation: ''
      },
      venousPuncture: {
        location: '',
        scalpCatheter: {
          size: '',
          used: false
        },
        abocathCatheter: {
          size: '',
          used: false
        },
        valvedExtender: {
          used: false
        }
      }
    },
    
    // Pós Exame
    postExam: {
      endTime: '',
      peripheralAccessRemoved: false,
      vitals: {
        time: '',
        bloodPressure: '',
        heartRate: '',
        o2Saturation: ''
      }
    },
    
    // Relatório
    reports: [{
      dateTime: '',
      description: ''
    }],
    
    // Assinaturas
    signatures: {
      patient: '',
      professional: {
        signature: '',
        method: 'drawing' as 'drawing' | 'govbr'
      }
    }
  });

  // Load existing anamnesis data if editing
  React.useEffect(() => {
    if (anamnesisId) {
      fetchAnamnesisById(anamnesisId).then(anamnesis => {
        if (anamnesis) {
          setFormData(anamnesis.data);
        }
      });
    }
  }, [anamnesisId, fetchAnamnesisById]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle nested object changes
  const handleNestedChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Handle signature capture
  const handleSignatureCapture = (dataUrl: string, method: 'drawing' | 'govbr', type: 'patient' | 'professional') => {
    if (type === 'patient') {
      setFormData(prev => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          patient: dataUrl
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          professional: {
            signature: dataUrl,
            method
          }
        }
      }));
    }
  };

  // Add report entry
  const addReport = () => {
    setFormData(prev => ({
      ...prev,
      reports: [
        ...prev.reports,
        { dateTime: '', description: '' }
      ]
    }));
  };

  // Handle report changes
  const handleReportChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      reports: prev.reports.map((report, i) => 
        i === index ? { ...report, [field]: value } : report
      )
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (anamnesisId) {
        await updateAnamnesis(anamnesisId, {
          ...formData,
          patientId
        });
      } else {
        await addAnamnesis({
          ...formData,
          patientId,
          createdBy: '1', // Using a hardcoded user ID for demo
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving anamnesis:', error);
      alert('Erro ao salvar anamnese. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avaliação Inicial */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Avaliação Inicial</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.hasConsent}
                onChange={(e) => handleNestedChange('hasConsent', '', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Termo de consentimento preenchido e assinado</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.hasIdentificationTag}
                onChange={(e) => handleNestedChange('hasIdentificationTag', '', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Possui etiqueta de identificação</span>
            </label>
          </div>
        </div>
      </div>

      {/* Condição do Paciente */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Condição do Paciente</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.walking}
                onChange={(e) => handleNestedChange('patientCondition', 'walking', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Deambulando</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.walkingWithHelp}
                onChange={(e) => handleNestedChange('patientCondition', 'walkingWithHelp', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Deambulando com auxílio</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.wheelchair}
                onChange={(e) => handleNestedChange('patientCondition', 'wheelchair', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Cadeira de rodas</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.stretcher}
                onChange={(e) => handleNestedChange('patientCondition', 'stretcher', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Maca</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.oriented}
                onChange={(e) => handleNestedChange('patientCondition', 'oriented', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Orientado(a)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.confused}
                onChange={(e) => handleNestedChange('patientCondition', 'confused', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Confuso</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.anxious}
                onChange={(e) => handleNestedChange('patientCondition', 'anxious', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Ansioso(a)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.calm}
                onChange={(e) => handleNestedChange('patientCondition', 'calm', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Calmo(a)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.patientCondition.phobic}
                onChange={(e) => handleNestedChange('patientCondition', 'phobic', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Fóbico(a)</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Acompanhado(a) por:
          </label>
          <input
            type="text"
            value={formData.patientCondition.accompaniedBy}
            onChange={(e) => handleNestedChange('patientCondition', 'accompaniedBy', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Prótese Dentária */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Prótese Dentária</h2>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.hasDentalProsthesis}
              onChange={(e) => handleNestedChange('hasDentalProsthesis', '', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Possui prótese dentária</span>
          </label>
        </div>
      </div>

      {/* Exames Anteriores */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Exames Anteriores</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.previousExams.has}
                onChange={(e) => handleNestedChange('previousExams', 'has', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Possui exames anteriores</span>
            </label>
          </div>

          {formData.previousExams.has && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quais exames:
              </label>
              <input
                type="text"
                value={formData.previousExams.description}
                onChange={(e) => handleNestedChange('previousExams', 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Antecedentes Pessoais */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Antecedentes Pessoais</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasHAS}
                onChange={(e) => handleNestedChange('personalHistory', 'hasHAS', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>HAS</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasDM}
                onChange={(e) => handleNestedChange('personalHistory', 'hasDM', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>DM</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasAnxietyDepression}
                onChange={(e) => handleNestedChange('personalHistory', 'hasAnxietyDepression', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Ansiedade/Depressão</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasCardiopathy}
                onChange={(e) => handleNestedChange('personalHistory', 'hasCardiopathy', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Cardiopatia</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasAsthma}
                onChange={(e) => handleNestedChange('personalHistory', 'hasAsthma', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Asma</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasIRC}
                onChange={(e) => handleNestedChange('personalHistory', 'hasIRC', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>IRC</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasCholesterol}
                onChange={(e) => handleNestedChange('personalHistory', 'hasCholesterol', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Colesterol</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.personalHistory.hasThyroid}
                onChange={(e) => handleNestedChange('personalHistory', 'hasThyroid', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Tireoide</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Outros:
          </label>
          <input
            type="text"
            value={formData.personalHistory.otherConditions}
            onChange={(e) => handleNestedChange('personalHistory', 'otherConditions', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Medicações */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Medicações</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.medications.using}
                onChange={(e) => handleNestedChange('medications', 'using', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Faz uso de medicações</span>
            </label>
          </div>

          {formData.medications.using && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quais medicações:
              </label>
              <input
                type="text"
                value={formData.medications.description}
                onChange={(e) => handleNestedChange('medications', 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Alergias */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Alergias</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allergies.has}
                onChange={(e) => handleNestedChange('allergies', 'has', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Possui alergias</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allergies.unknown}
                onChange={(e) => handleNestedChange('allergies', 'unknown', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Desconhece</span>
            </label>
          </div>

          {formData.allergies.has && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quais alergias:
              </label>
              <input
                type="text"
                value={formData.allergies.description}
                onChange={(e) => handleNestedChange('allergies', 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preparo para Exame */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Preparo para Exame</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.examPreparation.done}
                onChange={(e) => handleNestedChange('examPreparation', 'done', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Realizou preparo para o exame</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.examPreparation.fasting}
                onChange={(e) => handleNestedChange('examPreparation', 'fasting', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Está em jejum</span>
            </label>

            {formData.examPreparation.fasting && (
              <div className="flex items-center space-x-2">
                <span>Desde:</span>
                <input
                  type="text"
                  value={formData.examPreparation.fastingHours}
                  onChange={(e) => handleNestedChange('examPreparation', 'fastingHours', e.target.value)}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="horas"
                />
                <span>horas</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sala de Exames */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Sala de Exames</h2>
        
        <div className="space-y-6">
          {/* Pré-exame */}
          <div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">Pré-exame</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  value={formData.examRoom.preExam.time}
                  onChange={(e) => handleNestedChange('examRoom', 'preExam', {
                    ...formData.examRoom.preExam,
                    time: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">P.A.</label>
                <input
                  type="text"
                  value={formData.examRoom.preExam.bloodPressure}
                  onChange={(e) => handleNestedChange('examRoom', 'preExam', {
                    ...formData.examRoom.preExam,
                    bloodPressure: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">F.C.</label>
                <input
                  type="text"
                  value={formData.examRoom.preExam.heartRate}
                  onChange={(e) => handleNestedChange('examRoom', 'preExam', {
                    ...formData.examRoom.preExam,
                    heartRate: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sat. O²</label>
                <input
                  type="text"
                  value={formData.examRoom.preExam.o2Saturation}
                  onChange={(e) => handleNestedChange('examRoom', 'preExam', {
                    ...formData.examRoom.preExam,
                    o2Saturation: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Punção Venosa */}
          <div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">Punção Venosa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Localização</label>
                <input
                  type="text"
                  value={formData.examRoom.venousPuncture.location}
                  onChange={(e) => handleNestedChange('examRoom', 'venousPuncture', {
                    ...formData.examRoom.venousPuncture,
                    location: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cateter Scalp</label>
                  <select
                    value={formData.examRoom.venousPuncture.scalpCatheter.size}
                    onChange={(e) => handleNestedChange('examRoom', 'venousPuncture', {
                      ...formData.examRoom.venousPuncture,
                      scalpCatheter: {
                        ...formData.examRoom.venousPuncture.scalpCatheter,
                        size: e.target.value,
                        used: e.target.value !== ''
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Não utilizado</option>
                    <option value="19">nº19</option>
                    <option value="21">nº21</option>
                    <option value="23">nº23</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cateter Abocath</label>
                  <select
                    value={formData.examRoom.venousPuncture.abocathCatheter.size}
                    onChange={(e) => handleNestedChange('examRoom', 'venousPuncture', {
                      ...formData.examRoom.venousPuncture,
                      abocathCatheter: {
                        ...formData.examRoom.venousPuncture.abocathCatheter,
                        size: e.target.value,
                        used: e.target.value !== ''
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Não utilizado</option>
                    <option value="20">nº20</option>
                    <option value="22">nº22</option>
                    <option value="24">nº24</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.examRoom.venousPuncture.valvedExtender.used}
                    onChange={(e) => handleNestedChange('examRoom', 'venousPuncture', {
                      ...formData.examRoom.venousPuncture,
                      valvedExtender: {
                        used: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Extensor valvulado</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pós Exame */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pós Exame</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Término do exame</label>
              <input
                type="time"
                value={formData.postExam.endTime}
                onChange={(e) => handleNestedChange('postExam', 'endTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.postExam.peripheralAccessRemoved}
                  onChange={(e) => handleNestedChange('postExam', 'peripheralAccessRemoved', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Sacado acesso venoso periférico</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">Sinais Vitais</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  value={formData.postExam.vitals.time}
                  onChange={(e) => handleNestedChange('postExam', 'vitals', {
                    ...formData.postExam.vitals,
                    time: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">P.A.</label>
                <input
                  type="text"
                  value={formData.postExam.vitals.bloodPressure}
                  onChange={(e) => handleNestedChange('postExam', 'vitals', {
                    ...formData.postExam.vitals,
                    bloodPressure: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">F.C.</label>
                <input
                  type="text"
                  value={formData.postExam.vitals.heartRate}
                  onChange={(e) => handleNestedChange('postExam', 'vitals', {
                    ...formData.postExam.vitals,
                    heartRate: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sat. O²</label>
                <input
                  type="text"
                  value={formData.postExam.vitals.o2Saturation}
                  onChange={(e) => handleNestedChange('postExam', 'vitals', {
                    ...formData.postExam.vitals,
                    o2Saturation: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relatório */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Relatório</h2>
          <button
            type="button"
            onClick={addReport}
            className="flex items-center rounded-md bg-primary-50 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100"
          >
            <PlusCircle size={16} className="mr-1" />
            Adicionar Entrada
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.reports.map((report, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data/Hora</label>
                <input
                  type="datetime-local"
                  value={report.dateTime}
                  onChange={(e) => handleReportChange(index, 'dateTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  value={report.description}
                  onChange={(e) => handleReportChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assinaturas */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Assinaturas</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">Assinatura do Paciente</h3>
            <SignatureCapture
              onSignatureCapture={(dataUrl, method) => handleSignatureCapture(dataUrl, method, 'patient')}
            />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">Assinatura do Profissional</h3>
            <SignatureCapture
              onSignatureCapture={(dataUrl, method) => handleSignatureCapture(dataUrl, method, 'professional')}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Salvar Anamnese
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AnamnesisForm;