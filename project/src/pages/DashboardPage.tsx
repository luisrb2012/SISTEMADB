import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarClock, 
  UserPlus, 
  ClipboardPlus,
  FileText,
  Search
} from 'lucide-react';
import { usePatientStore } from '../stores/patientStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Dashboard page component
 * Displays today's appointments and quick access actions
 */
const DashboardPage: React.FC = () => {
  const { todayAppointments, fetchTodayAppointments, isLoading } = usePatientStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTodayAppointments();
  }, [fetchTodayAppointments]);
  
  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          icon={<UserPlus size={24} />}
          title="Novo Paciente"
          description="Cadastrar um novo paciente no sistema"
          onClick={() => navigate('/patients/new')}
          color="bg-primary-50 text-primary-700"
        />
        <QuickAction
          icon={<ClipboardPlus size={24} />}
          title="Nova Anamnese"
          description="Iniciar um novo formulário de anamnese"
          onClick={() => {}} 
          color="bg-secondary-50 text-secondary-700"
          disabled={true}
          disabledText="Selecione um paciente primeiro"
        />
        <QuickAction
          icon={<Search size={24} />}
          title="Buscar Paciente"
          description="Pesquisar pacientes no sistema"
          onClick={() => {}}
          color="bg-accent-50 text-accent-700"
        />
        <QuickAction
          icon={<FileText size={24} />}
          title="Anamneses Recentes"
          description="Ver histórico de anamneses"
          onClick={() => navigate('/anamnesis-history')}
          color="bg-success-50 text-success-700"
        />
      </div>
      
      {/* Today's Appointments */}
      <div className="mb-6 flex items-center">
        <CalendarClock className="mr-2 h-5 w-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-800">Agenda do Dia</h2>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : (
          <>
            {todayAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Horário
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {todayAppointments.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {patient.patientId}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {/* For demo purposes, we'll use a random time */}
                          {format(new Date().setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60)), 'HH:mm', { locale: ptBR })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/anamnesis/new/${patient.id}`}
                              className="rounded bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200"
                            >
                              Anamnese
                            </Link>
                            <Link
                              to={`/patients/${patient.id}/edit`}
                              className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                            >
                              Editar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                Não há agendamentos para hoje.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
  disabledText?: string;
}

/**
 * Quick action card component for the dashboard
 */
const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  title,
  description,
  onClick,
  color,
  disabled = false,
  disabledText,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`group flex h-full cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
    >
      <div className={`mb-4 inline-flex rounded-full p-3 ${color}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{disabled && disabledText ? disabledText : description}</p>
    </button>
  );
};

export default DashboardPage;