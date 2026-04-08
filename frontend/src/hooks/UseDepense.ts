import { useEffect, useState } from "react";
import { getDepenses } from "../api/DepenseApi";
import type { Depense } from "../interfaces";

export default function useDepense() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // have to only get info from the enveloppe, not all depenses
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDepenses();
        setDepenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { depenses, loading, error };
}
