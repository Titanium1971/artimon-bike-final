import { useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://artimon-backend.onrender.com";

export function useStock() {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stock`);
        if (res.ok) {
          const data = await res.json();
          const stockMap = {};
          for (const bike of data.data || []) {
            stockMap[bike.reference] = {
              inStock: bike.inStock,
              stock: bike.stock,
            };
          }
          setStockData(stockMap);
        }
      } catch (e) {
        console.warn("Stock API unavailable, using defaults");
      } finally {
        setLoading(false);
      }
    }
    fetchStock();
  }, []);

  const getStock = (reference) => {
    if (stockData[reference]) return stockData[reference];
    return { inStock: true, stock: -1 }; // fallback
  };

  return { getStock, loading };
}
