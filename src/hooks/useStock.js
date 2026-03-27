/**
 * Stock hook — désactivé temporairement.
 * L'API eWheel ne fournit pas encore le stock réel.
 * Retourne toujours inStock: true (données statiques de bikes.js).
 * TODO: réactiver quand eWheel aura l'endpoint stock.
 */
export function useStock() {
  const getStock = () => {
    return { inStock: true, stock: -1 };
  };

  return { getStock, loading: false };
}
