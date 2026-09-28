import type { FormEvent } from "react";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [search, setSearch] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:3001/api/products', {
        method: 'GET',
        headers: {
          search,
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    catch (err) {
      console.log(err);
    }
  }


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
        {/* TODO: Render product search results here. */}
      </ul>
    </section>
  );
}