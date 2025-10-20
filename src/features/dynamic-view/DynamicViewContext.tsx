import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ViewConfig, GenericItem } from './types';

interface DynamicViewContextProps {
  config: ViewConfig;
  data: GenericItem[];
  getFieldDef: (fieldId: string) => ViewConfig['fields'][number] | undefined;
}

const DynamicViewContext = createContext<DynamicViewContextProps | null>(null);

interface DynamicViewProviderProps {
  viewConfig: ViewConfig;
  data: GenericItem[];
  children: ReactNode;
}

export function DynamicViewProvider({ viewConfig, data, children }: DynamicViewProviderProps) {
  const fieldDefsById = useMemo(() => {
    return new Map(viewConfig.fields.map(field => [field.id, field]));
  }, [viewConfig.fields]);

  const getFieldDef = (fieldId: string) => {
    return fieldDefsById.get(fieldId);
  };

  const value = useMemo(() => ({
    config: viewConfig,
    data,
    getFieldDef,
  }), [viewConfig, data, getFieldDef]);

  return (
    <DynamicViewContext.Provider value={value}>
      {children}
    </DynamicViewContext.Provider>
  );
}

export function useDynamicView() {
  const context = useContext(DynamicViewContext);
  if (!context) {
    throw new Error('useDynamicView must be used within a DynamicViewProvider');
  }
  return context;
}