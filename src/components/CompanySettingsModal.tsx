import React, { useState, useRef } from 'react';
import { X, Building, MapPin, Phone, Mail, FileText, Palette, Upload, RotateCcw, Globe, CreditCard } from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';

interface CompanySettingsModalProps {
  onClose: () => void;
}

const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({ onClose }) => {
  const { companySettings, updateCompanySettings, resetCompanySettings, uploadLogo } = useCompany();
  const [activeTab, setActiveTab] = useState<'basic' | 'fiscal' | 'branding'>('basic');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBasicInfoChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      updateCompanySettings({
        basicInfo: {
          ...companySettings.basicInfo,
          address: {
            ...companySettings.basicInfo.address,
            [addressField]: value
          }
        }
      });
    } else if (field.startsWith('contact.')) {
      const contactField = field.split('.')[1];
      updateCompanySettings({
        basicInfo: {
          ...companySettings.basicInfo,
          contact: {
            ...companySettings.basicInfo.contact,
            [contactField]: value
          }
        }
      });
    } else {
      updateCompanySettings({
        basicInfo: {
          ...companySettings.basicInfo,
          [field]: value
        }
      });
    }
  };

  const handleFiscalInfoChange = (field: string, value: any) => {
    updateCompanySettings({
      fiscalInfo: {
        ...companySettings.fiscalInfo,
        [field]: value
      }
    });
  };

  const handleBrandingChange = (field: string, value: any) => {
    updateCompanySettings({
      branding: {
        ...companySettings.branding,
        [field]: value
      }
    });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      await uploadLogo(file);
    } catch (error) {
      alert('Erro ao fazer upload da logo. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar todas as configurações da empresa para os valores padrão?')) {
      resetCompanySettings();
    }
  };

  const tabs = [
    { id: 'basic', label: 'Dados Básicos', icon: Building },
    { id: 'fiscal', label: 'Informações Fiscais', icon: FileText },
    { id: 'branding', label: 'Identidade Visual', icon: Palette }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-xl">
          <h2 className="text-2xl font-bold flex items-center">
            <Building className="h-6 w-6 mr-2" />
            Configurações da Empresa
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Restaurar padrões"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar com abas */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Conteúdo das abas */}
          <div className="flex-1 p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Dados Básicos da Empresa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razão Social
                    </label>
                    <input
                      type="text"
                      value={companySettings.basicInfo.name}
                      onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      value={companySettings.basicInfo.tradeName}
                      onChange={(e) => handleBasicInfoChange('tradeName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={companySettings.basicInfo.cnpj}
                      onChange={(e) => handleBasicInfoChange('cnpj', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inscrição Estadual
                    </label>
                    <input
                      type="text"
                      value={companySettings.basicInfo.ie}
                      onChange={(e) => handleBasicInfoChange('ie', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inscrição Municipal
                    </label>
                    <input
                      type="text"
                      value={companySettings.basicInfo.im}
                      onChange={(e) => handleBasicInfoChange('im', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                    Endereço
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.zipCode}
                        onChange={(e) => handleBasicInfoChange('address.zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="00000-000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.state}
                        onChange={(e) => handleBasicInfoChange('address.state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.city}
                        onChange={(e) => handleBasicInfoChange('address.city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.street}
                        onChange={(e) => handleBasicInfoChange('address.street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.number}
                        onChange={(e) => handleBasicInfoChange('address.number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.complement}
                        onChange={(e) => handleBasicInfoChange('address.complement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.address.neighborhood}
                        onChange={(e) => handleBasicInfoChange('address.neighborhood', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Contato */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-amber-600" />
                    Informações de Contato
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.contact.phone}
                        onChange={(e) => handleBasicInfoChange('contact.phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="(00) 0000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.contact.mobile}
                        onChange={(e) => handleBasicInfoChange('contact.mobile', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={companySettings.basicInfo.contact.email}
                        onChange={(e) => handleBasicInfoChange('contact.email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="contato@empresa.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="text"
                        value={companySettings.basicInfo.contact.website}
                        onChange={(e) => handleBasicInfoChange('contact.website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="www.empresa.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fiscal' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Informações Fiscais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regime Tributário
                    </label>
                    <select
                      value={companySettings.fiscalInfo.taxRegime}
                      onChange={(e) => handleFiscalInfoChange('taxRegime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="simples">Simples Nacional</option>
                      <option value="lucro_presumido">Lucro Presumido</option>
                      <option value="lucro_real">Lucro Real</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNAE Principal
                    </label>
                    <input
                      type="text"
                      value={companySettings.fiscalInfo.cnae}
                      onChange={(e) => handleFiscalInfoChange('cnae', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="0000-0/00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inscrição Estadual
                    </label>
                    <input
                      type="text"
                      value={companySettings.fiscalInfo.stateRegistration}
                      onChange={(e) => handleFiscalInfoChange('stateRegistration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inscrição Municipal
                    </label>
                    <input
                      type="text"
                      value={companySettings.fiscalInfo.municipalRegistration}
                      onChange={(e) => handleFiscalInfoChange('municipalRegistration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                    Contribuições
                  </h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={companySettings.fiscalInfo.icmsContributor}
                        onChange={(e) => handleFiscalInfoChange('icmsContributor', e.target.checked)}
                        className="mr-3 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Contribuinte de ICMS</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={companySettings.fiscalInfo.issContributor}
                        onChange={(e) => handleFiscalInfoChange('issContributor', e.target.checked)}
                        className="mr-3 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Contribuinte de ISS</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={companySettings.fiscalInfo.pisCofinsTaxpayer}
                        onChange={(e) => handleFiscalInfoChange('pisCofinsTaxpayer', e.target.checked)}
                        className="mr-3 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Contribuinte de PIS/COFINS</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Identidade Visual</h3>
                
                {/* Logo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-amber-600" />
                    Logotipo
                  </h4>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {companySettings.branding.logo ? (
                        <img
                          src={companySettings.branding.logo}
                          alt="Logo da empresa"
                          className="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-white"
                        />
                      ) : (
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{isUploading ? 'Enviando...' : 'Escolher Logo'}</span>
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 5MB
                      </p>
                      {companySettings.branding.logo && (
                        <button
                          onClick={() => handleBrandingChange('logo', '')}
                          className="text-red-600 text-sm mt-2 hover:underline"
                        >
                          Remover logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cores */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-amber-600" />
                    Paleta de Cores
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor Primária
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={companySettings.branding.primaryColor}
                          onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={companySettings.branding.primaryColor}
                          onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="#8B4513"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor Secundária
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={companySettings.branding.secondaryColor}
                          onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={companySettings.branding.secondaryColor}
                          onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="#DAA520"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor de Destaque
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={companySettings.branding.accentColor}
                          onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={companySettings.branding.accentColor}
                          onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="#228B22"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview das cores */}
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Pré-visualização</h5>
                    <div className="flex space-x-4">
                      <div 
                        className="w-16 h-16 rounded-lg border border-gray-300 flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: companySettings.branding.primaryColor }}
                      >
                        Primária
                      </div>
                      <div 
                        className="w-16 h-16 rounded-lg border border-gray-300 flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: companySettings.branding.secondaryColor }}
                      >
                        Secundária
                      </div>
                      <div 
                        className="w-16 h-16 rounded-lg border border-gray-300 flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: companySettings.branding.accentColor }}
                      >
                        Destaque
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsModal;