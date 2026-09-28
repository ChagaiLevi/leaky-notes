import type { FormEvent } from "react";

export default function CommentsPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Add the comment submission request and response handling.
  }

  return (
    <section className="panel">
      <h2>Comments</h2>
      <p className="intro">Read and add comments for the lab exercise.</p>

      <div className="comments-list" aria-live="polite">
        {/* TODO: Fetch and render comments here. */}
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="author">Name</label>
        <input id="author" name="author" type="text" />

        <label htmlFor="comment">Comment</label>
        <textarea id="comment" name="comment" rows={5} />

        <button type="submit">Post comment</button>
      </form>
    </section>
  );
}
