export interface Product {
  name: string;
  type: string;
  price: number;
}

export function fetchProducts() {
  return new Promise<Product[]>((resolve) =>
    fetch("./products.json")
      .then((data) => data.json())
      .then((result) => {
        resolve(result);
      })
  );
}
