import type { FormEvent, TextareaHTMLAttributes } from "react";
import { useState, useEffect } from "react";

type comment = { id: number | undefined, name: string, body: string };

export default function CommentsPage() {
  const [comments, setComments] = useState<comment[]>([]);
  const [addComment, setAddComment] = useState<comment>({ id: undefined, name: '', body: '' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addComment }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchData();
    }
    catch (err) {
      console.log(err);
    }
  }

  const fetchData = async () => {
    try {
      const response: any = await fetch('http://127.0.0.1:3001/api/comments', { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setComments(data.results);

    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="panel">
      <h2>Comments</h2>
      <p className="intro">Read and add comments for the lab exercise.</p>

      <div className="comments-list" aria-live="polite">
        {comments.map(c => (
          <div key={c.id}>
            <strong>{c.name}</strong>
            <p dangerouslySetInnerHTML={{ __html: c.body }} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="author">Name</label>
        <input id="author" name="author" type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddComment((current) => ({ ...current, name: e.target.value }))} value={addComment.name} />

        <label htmlFor="comment">Comment</label>
        <textarea id="comment" name="comment" rows={5} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddComment((current) => ({ ...current, body: e.target.value }))} value={addComment.body} />

        <button type="submit">Post comment</button>
      </form>
    </section>
  );
}
