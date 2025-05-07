import { api } from '@/api/api';
import { Product } from '@/types/Product';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface ProductContextInterface {
  product: Product;
  createProduct: (data: Product) => Promise<AxiosResponse>;
  getProducts: () => Promise<AxiosResponse>;
  getProduct: (id: string) => Promise<AxiosResponse>;
  deleteProduct: (id: string) => Promise<AxiosResponse>;
  updateProduct: (id: string, data: Product) => Promise<AxiosResponse>;
}

const ProductContext = createContext<
  ProductContextInterface | undefined
>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {

  const product: Product = {
    name: '',
    description: ''
  }

  async function getProducts() {
    const response = await api.get('/product');
    return response;
  }

  async function getProduct(id: string) {
    const response = await api.get(`/product/${id}`);
    return response;
  }

  async function createProduct(data: Product) {
    const response = await api.post('/product', data);
    return response;
  }

  async function deleteProduct(id: string) {
    const response = await api.delete(`/product/${id}`);
    return response;
  }

  async function updateProduct(id: string, data: Product) {
    const response = await api.put(`/product/${id}`, data);
    return response;
  }

  return (
    <ProductContext.Provider
      value={{
        product,
        getProducts,
        createProduct,
        getProduct,
        deleteProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      'useProduct must be used within an ProductProvider',
    );
  }
  return context;
};
