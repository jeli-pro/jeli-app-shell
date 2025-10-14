import { createContext, useContext, ReactNode } from 'react';
import { useDataManagement } from '../hooks/useDataManagement.hook';

// The return type of useDataManagement is the shape of our context
type DataDemoContextType = ReturnType<typeof useDataManagement>;

const DataDemoContext = createContext<DataDemoContextType | null>(null);

export function DataDemoProvider({ children }: { children: ReactNode }) {
  const dataManagement = useDataManagement();
  return (
    <DataDemoContext.Provider value={dataManagement}>
      {children}
    </DataDemoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataDemo() {
  const context = useContext(DataDemoContext);
  if (!context) {
    throw new Error('useDataDemo must be used within a DataDemoProvider');
  }
  return context;
}