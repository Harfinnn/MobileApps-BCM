import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAppConfig } from '../data/AppConfigRepository';
import { saveAppConfig, getAppConfig } from '../core/storage/appStorage';

interface AppConfig {
  mla_logo?: string;
  mla_nama_aplikasi?: string;
  mla_versi?: string;
  mla_keterangan?: string;
  mla_fitur?: string[] | string;
  mla_warna?: string;
  mla_nama_perusahaan?: string;
  mla_tahun?: string;
  mla_sign?: string;
}

interface AppConfigContextType {
  config: AppConfig | null;
  refreshConfig: () => Promise<void>;
}

const AppConfigContext = createContext<AppConfigContextType | null>(null);

export const AppConfigProvider = ({ children }: any) => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  const loadConfig = async () => {
    try {
      const local = await getAppConfig();
      if (local) {
        setConfig({ ...local });
      }

      const apiData: AppConfig = await fetchAppConfig();

      if (apiData) {
        setConfig(prev => ({
          ...(prev ?? {}),
          ...apiData,
        }));

        await saveAppConfig(apiData);
      }
    } catch (error) {
      console.log('LOAD CONFIG ERROR', error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        config,
        refreshConfig: loadConfig,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used inside AppConfigProvider');
  }
  return context;
};
