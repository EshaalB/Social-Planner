import { useState, useCallback } from 'react';

export default function useToast(timeout = 3000) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), timeout);
  }, [timeout]);
  return { toast, showToast };
} 