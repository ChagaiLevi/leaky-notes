import type { FormEvent } from "react";

export default function SearchPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Add the product search request and response handling.
  }

  return (
    <section className="panel">
      <h2>Product search</h2>
      <p className="intro">Search the dummy product catalog.</p>

      <form className="inline-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="query">Search term</label>
          <input id="query" name="q" type="search" />
        </div>
        <button type="submit">Search</button>
      </form>

      <ul className="results-list" aria-live="polite">
        {/* TODO: Render product search results here. */}
      </ul>
    </section>
  );
}
