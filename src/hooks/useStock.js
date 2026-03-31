import { useState, useEffect } from "react";
import { API_URL } from "../constants";

/**
 * Stock hook — temps réel via l'API eWheel (endpoint stock).
 * Charge le stock une seule fois, cache en mémoire.
 */
export function useStock() {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stock`);
        if (res.ok) {
          const json = await res.json();
          const map = {};
          for (const item of json.data || []) {
            map[item.reference] = { inStock: item.inStock, stock: item.stock };
          }
          setStockData(map);
        }
      } catch (err) {
        console.error("Stock fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const getStock = (reference) => {
    if (!reference) return { inStock: true, stock: -1 };
    // Try exact ref, then without -parent suffix
    const ref = reference.replace("-parent", "");
    const data = stockData[ref] || stockData[reference];
    if (data) return data;
    // Fallback: assume in stock if not loaded yet
    return { inStock: true, stock: -1 };
  };

  return { getStock, loading };
}
