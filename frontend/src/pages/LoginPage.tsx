import type { FormEvent } from "react";

export default function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Add the login request and response handling for the exercise.
  }

  return (
    <section className="panel">
      <h2>Login</h2>
      <p className="intro">Sign in with a lab account.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />

        <button type="submit">Sign in</button>
      </form>

      <div className="output" aria-live="polite">
        {/* TODO: Render the login result here. */}
      </div>
    </section>
  );
}
