import { useEffect, useState } from "react";
import { getEnveloppe } from "../api/api";
import type { Enveloppe } from "../interfaces/interfaces";

export function useEnveloppes() {
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEnveloppe();
        setEnveloppes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { enveloppes, loading, error };
}
