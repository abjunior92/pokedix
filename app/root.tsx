import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches
} from "@remix-run/react";

import styles from "./styles/tailwind.css";

import { ChevronLeftIcon, HomeIcon } from "@heroicons/react/solid";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Pokémon App!",
  "og:image": "https://poke-dix.netlify.app/preview.png",
  "og:title": "Pokémon App!",
  "og:url": "https://poke-dix.netlify.app/",
  "og:description": "A simple Pokédex app built with Remix JS",
  "og:type": "website",
  "og:image:alt": "Pokémon App!",
  "twitter:card": "summary_large_image",
  "twitter:title": "Pokémon App!",
  "twitter:url": "https://poke-dix.netlify.app/",
  "twitter:description": "A simple Pokédex app built with Remix JS",
  "twitter:image": "https://poke-dix.netlify.app/preview.png",
  "twitter:image:alt": "Pokémon App!",
  "twitter:creator": "Andrea Junior Berselli",
  viewport: "width=device-width,initial-scale=1",
  description: "A simple Pokédex app built with Remix JS"
});

function Document({
  children,
  title
}: {
  children: React.ReactNode | React.ReactNode[];
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 dark:bg-dark">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({
  children
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];

  const [theme, setTheme] = useState<string>();

  useEffect(() => {
    setDarkModeHandler();
    handleDarkMode();
  }, []);

  const setDarkModeHandler = () => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setTheme("Dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("Light");
    }
  };

  const handleDarkMode = () => {
    var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    var themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon"
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      themeToggleLightIcon?.classList.remove("hidden");
    } else {
      themeToggleDarkIcon?.classList.remove("hidden");
    }

    var themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn?.addEventListener("click", function () {
      // toggle icons inside button
      themeToggleDarkIcon?.classList.toggle("hidden");
      themeToggleLightIcon?.classList.toggle("hidden");

      // if set via local storage previously
      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
          setTheme("Dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
          setTheme("Light");
        }

        // if NOT set via local storage previously
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      }
    });
  };

  return (
    <div className="p-8 pb-2 mx-auto max-w-7xl">
      <div>
        <div className="flex items-center justify-between h-10">
          <nav className="sm:flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4" role={"list"}>
              <li>
                <div className="flex">
                  <Link to={"/"} className="breadcrumbs-link">
                    Home
                  </Link>
                </div>
              </li>
              {matches
                .filter(match => match.handle && match.handle.breadcrumb)
                .map((match, index) => (
                  <li key={index}>
                    <div className="breadcrumbs-link">
                      <ChevronLeftIcon
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />
                      {match.handle.breadcrumb(match.params)}
                    </div>
                  </li>
                ))}
            </ol>
          </nav>
          <div className="flex items-center space-x-2">
            {theme && (
              <span className="xs:hidden text-sm text-gray-900 dark:text-l-dark">{`${theme} mode`}</span>
            )}
            <button
              id="theme-toggle"
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-colors duration-500"
            >
              <svg
                id="theme-toggle-dark-icon"
                className="hidden w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
              <svg
                id="theme-toggle-light-icon"
                className="hidden w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2>{lastMatch?.handle?.title?.(lastMatch.params) ?? "Pokémon"}</h2>
          </div>
        </div>
      </div>

      <div className="">
        <div>{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Document title="PokèDix">
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div className="dark:text-s-dark">
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should check this!</p>
        </div>
      </Layout>
    </Document>
  );
}
