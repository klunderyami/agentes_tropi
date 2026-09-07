'use client';
import { useEffect, useState } from 'react';

/**
 * `true` una vez que el componente se montó en el cliente.
 * Se usa para diferir texto dependiente del reloj (timeAgo, fecha) y evitar
 * mismatches de hidratación con el HTML prerenderizado.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}