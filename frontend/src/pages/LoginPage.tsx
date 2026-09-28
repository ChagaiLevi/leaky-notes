import type { FormEvent, InputEvent } from "react";
import React, { useState } from "react";

export default function LoginPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Add the login request and response handling for the exercise.
    try {
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: {
          username,
          password,
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

  return (
    <section className="panel">
      <h2>Login</h2>
      <p className="intro">Sign in with a lab account.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} value={username} />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />

        <button type="submit">Sign in</button>
      </form>

      <div className="output" aria-live="polite">
        {/* TODO: Render the login result here. */}
      </div>
    </section>
  );
}
