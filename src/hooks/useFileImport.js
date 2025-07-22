import { useCallback } from 'react';

export default function useFileImport(onImport) {
  const handleImportFile = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let importedData;
        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(event.target.result);
        } else if (file.name.endsWith('.csv')) {
          if (typeof event.target.result !== 'string') {
            alert('CSV file could not be read. Please check the file.');
            return;
          }
          const [header, ...rows] = event.target.result.split('\n').map(r => r.trim()).filter(Boolean);
          const keys = header.split(',');
          importedData = rows.map(row => {
            const values = row.split(',');
            return keys.reduce((obj, key, i) => ({ ...obj, [key]: values[i] }), {});
          });
        }
        if (Array.isArray(importedData)) {
          onImport(importedData);
        }
      } catch {
        alert('Error importing file. Please check the file format.');
      }
    };
    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      alert('Unsupported file type. Please use .json or .csv');
    }
    e.target.value = '';
  }, [onImport]);
  return { handleImportFile };
} 