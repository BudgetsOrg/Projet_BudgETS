import { useEffect, useState } from "react";
import { getObjectif } from "../api/ObjectifApi";
import type { Objectif } from "../interfaces";

export function useObjectif(refreshKey: number = 0) {
  const [objectifs, setObjectif] = useState<Objectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getObjectif();
        setObjectif(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refreshKey]);

  return { objectifs, loading, error };
}
