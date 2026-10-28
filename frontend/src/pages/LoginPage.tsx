import type { FormEvent } from "react";
import React, { useState, useEffect } from "react";

export default function LoginPage() {
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://127.0.0.1:3001/api/me/", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("not logged in");
        return res.json();
      })
      .then(user => {
        setUserName(user.user.username);
        setIsLogged(true);
      })
      .catch(() => {
        setIsLogged(false);
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO: Add the login request and response handling for the exercise.
    try {

      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: {
          username,
          password,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else {
        setIsLogged(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async function logOut(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // TODO: Add the login request and response handling for the exercise.
    try {
      const response = await fetch('http://127.0.0.1:3001/api/logout', {
        method: 'GET',
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else {
        setIsLogged(false);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="panel">
      {!isLogged ? <>
        <h2>Login</h2>
        <p className="intro">Sign in with a lab account.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} value={username} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />

          <button type="submit">Sign in</button>
        </form>
      </>
        :
        <div className="output" aria-live="polite">
          <div>Welcome {username}!</div>
          <div>You Logged</div>
          <button onClick={(e) => logOut(e)}>Logout</button>
        </div>
      }
    </section>
  );
}
