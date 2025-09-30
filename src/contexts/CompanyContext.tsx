import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CompanySettings {
  basicInfo: {
    name: string;
    tradeName: string;
    cnpj: string;
    ie: string;
    im: string;
    address: {
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    contact: {
      phone: string;
      mobile: string;
      email: string;
      website: string;
    };
  };
  fiscalInfo: {
    taxRegime: 'simples' | 'lucro_presumido' | 'lucro_real';
    icmsContributor: boolean;
    issContributor: boolean;
    pisCofinsTaxpayer: boolean;
    cnae: string;
    municipalRegistration: string;
    stateRegistration: string;
  };
  branding: {
    logo: string; // Base64 ou URL
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

interface CompanyContextType {
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  resetCompanySettings: () => void;
  uploadLogo: (file: File) => Promise<string>;
}

const defaultCompanySettings: CompanySettings = {
  basicInfo: {
    name: 'CARNEVALLI ESQUADRIAS LTDA',
    tradeName: 'Carnevalli Esquadrias',
    cnpj: '88.235.288/0001-24',
    ie: '0850011930',
    im: '',
    address: {
      street: 'BUARQUE DE MACEDO',
      number: '2735',
      complement: 'PAVILHÃO',
      neighborhood: 'CENTRO',
      city: 'Nova Prata',
      state: 'RS',
      zipCode: '95320-000',
      country: 'Brasil'
    },
    contact: {
      phone: '(54) 3242-2072',
      mobile: '(54) 99999-9999',
      email: 'carnevalli.esquadrias@gmail.com',
      website: 'www.carnevalli.com.br'
    }
  },
  fiscalInfo: {
    taxRegime: 'simples',
    icmsContributor: true,
    issContributor: true,
    pisCofinsTaxpayer: false,
    cnae: '1622-9/00',
    municipalRegistration: '',
    stateRegistration: '0850011930'
  },
  branding: {
    logo: '',
    primaryColor: '#8B4513',
    secondaryColor: '#DAA520',
    accentColor: '#228B22'
  }
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(defaultCompanySettings);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCompanySettings({ ...defaultCompanySettings, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações da empresa:', error);
      }
    }
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
  }, [companySettings]);

  const updateCompanySettings = (newSettings: Partial<CompanySettings>) => {
    setCompanySettings(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...newSettings.basicInfo },
      fiscalInfo: { ...prev.fiscalInfo, ...newSettings.fiscalInfo },
      branding: { ...prev.branding, ...newSettings.branding }
    }));
  };

  const resetCompanySettings = () => {
    setCompanySettings(defaultCompanySettings);
    localStorage.removeItem('companySettings');
  };

  const uploadLogo = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        updateCompanySettings({
          branding: {
            ...companySettings.branding,
            logo: base64
          }
        });
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <CompanyContext.Provider value={{
      companySettings,
      updateCompanySettings,
      resetCompanySettings,
      uploadLogo
    }}>
      {children}
    </CompanyContext.Provider>
  );
};