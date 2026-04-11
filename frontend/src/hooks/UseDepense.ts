import { useEffect, useState } from "react";
import { getDepenses } from "../api/DepenseApi";
import type { Depense } from "../interfaces";

export default function useDepense(id_enveloppe: number) {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDepenses(id_enveloppe); 
        if (!Array.isArray(data)) {
          setDepenses([]);
          return;
        }
        setDepenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id_enveloppe) fetchData(); 
    else setLoading(false);
  }, [id_enveloppe]);

  return { depenses, loading, error };
}
