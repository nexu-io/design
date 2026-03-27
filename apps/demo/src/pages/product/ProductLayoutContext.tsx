import { createContext, useContext } from "react";

export interface ProductLayoutContextValue {
  expandFileTree: () => void;
  openFile: (path: string) => void;
}

export const ProductLayoutContext = createContext<ProductLayoutContextValue>({
  expandFileTree: () => {},
  openFile: () => {},
});

export function useProductLayout() {
  return useContext(ProductLayoutContext);
}
