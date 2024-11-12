import { AlertCircle, ShieldX } from 'lucide-react';

export const AccessDeniedTemplate = () => {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Main Content */}
        <div className="relative z-10">
          {/* Icon Container */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary rounded-full blur-md opacity-75 animate-pulse" />
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                <ShieldX className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Acesso Restrito
            </h2>

            <div className="space-y-2">
              <p className="text-gray-600">
                Você não tem permissão para acessar este módulo.
              </p>
              <p className="text-sm text-gray-500">
                Por favor, entre em contato com o administrador do sistema para solicitar acesso.
              </p>
            </div>

            {/* Warning Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-sm text-primary">
              <AlertCircle className="w-4 h-4" />
              <span>Acesso Negado</span>
            </div>
          </div>

          {/* Decorative Bottom Border */}
          <div className="mt-2 h-1 bg-gradient-to-r from-primary via-purple-400 to-primary" />
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedTemplate;