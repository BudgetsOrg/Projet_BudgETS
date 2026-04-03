import { useEffect, useState } from "react";
import { getObjectif } from "../api/ObjectifApi";
import type { Objectif } from "../interfaces";
//TODO: streamline this hook with useQuery from react-query or similar library for better caching and error handling.

export function useObjectif() {
  const [objectifs, setObjectif] = useState<Objectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
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
  }, []);

  return { objectifs, loading, error };
}
