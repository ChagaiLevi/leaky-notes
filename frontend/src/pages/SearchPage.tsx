import type { FormEvent } from "react";
import { useState, useEffect } from "react";
type product = { id: string | undefined, name: string, description: string };

export default function SearchPage() {
  const [products, setProducts] = useState<product[]>([]);
  const [search, setSearch] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/products?search=${encodeURIComponent(search)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.results);
    }
    catch (err) {
      console.log(err);
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/products');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.results);

    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // TODO: Add the product search request and response handling.

  return (
    <section className="panel">
      <h2>Product search</h2>
      <p className="intro">Search the dummy product catalog.</p>

      <form className="inline-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="query">Search term</label>
          <input id="query" name="q" type="search" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} value={search} />
        </div>
        <button type="submit">Search</button>
      </form>

      <ul className="results-list" aria-live="polite">

        {products.map((product) => (
          <div key={product.id}>
            <strong>{product.name}</strong>
            <p dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        ))}
      </ul>
    </section>
  );
}