import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnamnesisStore } from '../stores/anamnesisStore';
import { usePatientStore } from '../stores/patientStore';
import { 
  Search, 
  Calendar,
  FileText,
  Filter,
  Download
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Anamnesis history page component
 * Displays a filterable list of anamnesis records
 */
const AnamnesisHistoryPage: React.FC = () => {
  const { fetchAnamnesis, filteredAnamneses, filterAnamnesis, isLoading } = useAnamnesisStore();
  const { fetchPatients, patients } = usePatientStore();
  
  // Filter state
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    examType: '',
    patientName: '',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Load anamnesis data
  useEffect(() => {
    fetchAnamnesis();
    if (patients.length === 0) {
      fetchPatients();
    }
  }, [fetchAnamnesis, fetchPatients, patients.length]);
  
  // Apply filters
  const applyFilters = () => {
    filterAnamnesis({
      dateRange: {
        start: filters.startDate,
        end: filters.endDate,
      },
      examType: filters.examType ? filters.examType as any : undefined,
      patientName: filters.patientName || undefined,
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      examType: '',
      patientName: '',
    });
    
    // Apply default filters
    filterAnamnesis({
      dateRange: {
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
      },
    });
  };
  
  // Get patient name from ID
  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente não encontrado';
  };
  
  // Get exam type display name
  const getExamTypeDisplay = (type: string): string => {
    const types: Record<string, string> = {
      'tomography': 'Tomografia',
      'resonance': 'Ressonância',
      'other': 'Outro',
    };
    return types[type] || type;
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-0">Histórico de Anamneses</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Filter size={16} className="mr-1" />
            Filtros
          </button>
          
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por paciente..."
              value={filters.patientName}
              onChange={handleFilterChange}
              name="patientName"
              className="block w-full rounded-md border-gray-300 pl-10 text-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <button
            onClick={applyFilters}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Buscar
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Final</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Exame</label>
              <select
                name="examType"
                value={filters.examType}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Todos</option>
                <option value="tomography">Tomografia</option>
                <option value="resonance">Ressonância</option>
                <option value="other">Outro</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="mr-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Limpar
            </button>
            <button
              onClick={applyFilters}
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
      
      {/* Results Table */}
      <div className="rounded-lg bg-white shadow-md">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredAnamneses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Exame
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Subtipo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAnamneses.map((anamnesis) => (
                      <tr key={anamnesis.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {format(new Date(anamnesis.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getPatientName(anamnesis.patientId)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                            {getExamTypeDisplay(anamnesis.examType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {anamnesis.examSubtype || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/anamnesis/${anamnesis.id}`}
                              className="rounded bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200"
                            >
                              <FileText size={14} className="mr-1 inline-block" />
                              Visualizar
                            </Link>
                            <button
                              className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                              onClick={() => {/* PDF Export Logic */}}
                            >
                              <Download size={14} className="mr-1 inline-block" />
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Nenhum registro de anamnese encontrado com os filtros selecionados.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnamnesisHistoryPage;