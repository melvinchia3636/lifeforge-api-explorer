import { useEffect, useState } from "react";
import PathEntry from "./PathEntry";
import { Icon } from "@iconify/react/dist/iconify.js";

export interface RouteDocs {
  summary: string;
  description: string;
  access: "public" | "protected" | "private";
  params: {
    name: string;
    type: string;
    required: boolean | string;
    options?: string[];
    must_exist?: boolean;
    description: string;
  }[];
  query: {
    name: string;
    type: string;
    required: boolean | string;
    options?: string[];
    must_exist?: boolean;
    description: string;
  }[];
  body: {
    name: string;
    type: string;
    required: boolean | string;
    options?: string[];
    must_exist?: boolean;
    description: string;
  }[];
  response: {
    status: number;
    description: string;
    body: string;
  };
}

interface Route {
  method: string;
  path: string;
  description?: string;
  docs: RouteDocs | null;
}

const ApiExplorer = () => {
  const [routes, setRoutes] = useState<Record<string, Route[]>>({});

  useEffect(() => {
    fetch(import.meta.env.VITE_API_HOST).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        if (data.state === "success") setRoutes(data.data);
      }
    });
  }, []);

  return (
    <main className="bg-zinc-950 w-full h-dvh text-zinc-100 font-[Urbanist] flex">
      {JSON.stringify(routes) !== "{}" ? (
        <>
          <aside className="w-1/3 flex flex-col p-8 border-r-2 border-zinc-800/50">
            <div className="flex items-center justify-between mb-6">
              <h1 className="flex items-center gap-2 whitespace-nowrap text-2xl tracking-wider font-bold text-zinc-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="text-4xl text-lime-500 iconify iconify--tabler"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m11.414 10l-7.383 7.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0L14.414 13m3.707 2.293l2.586-2.586a1 1 0 0 0 0-1.414l-7.586-7.586a1 1 0 0 0-1.414 0L9.121 6.293a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0"
                  />
                </svg>
                <div>
                  LifeForge
                  <span className="text-3xl text-lime-500 pl-0.5">.</span> API
                </div>
              </h1>
              <a
                href="https://github.com/melvinchia3636/lifeforge-api"
                target="_blank"
                className="p-2 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/50 transition-all"
              >
                <Icon icon="uil:github" className="size-7" />
              </a>
            </div>
            <search className="w-full flex items-center p-3 rounded-md bg-zinc-900/50 text-zinc-100 border-2 border-zinc-800/50">
              <Icon icon="tabler:search" className="size-6 text-zinc-500" />
              <input
                type="text"
                placeholder={`Search in ${
                  Object.values(routes).flat().length
                } routes...`}
                className="w-full bg-transparent font-medium tracking-wide focus:outline-none placeholder:text-zinc-500 pl-2"
              />
            </search>
            <div className="space-y-8 mt-6 pt-6 overflow-auto">
              {Object.entries(routes).map(([route, paths]) => (
                <div key={route}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg tracking-widest uppercase">
                      {route
                        .split("-")
                        .map((e) => (e ? e[0].toUpperCase() + e.slice(1) : "/"))
                        .join(" ")}
                    </h2>
                    <span className="text-zinc-500 font-medium tracking-wide">
                      {paths.length} routes
                    </span>
                  </div>
                  {paths.map(({ method, path }) => (
                    <div key={`${route}-${method}-${path}`} className="h-10">
                      <span
                        className={`font-semibold tracking-wide ${
                          {
                            GET: "text-green-500",
                            POST: "text-blue-500",
                            PATCH: "text-yellow-500",
                            PUT: "text-orange-500",
                            DELETE: "text-red-500",
                          }[method]
                        }`}
                      >
                        {method}
                      </span>
                      <span className="ml-2 tracking-wide text-zinc-500">
                        {path}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>
          <section className="p-12 w-full overflow-auto">
            <div className="flex items-center">
              <Icon icon="mynaui:api" className="size-16 text-lime-500" />
              <div className="-mt-4">
                <h1 className="text-4xl font-semibold tracking-wide ml-4">
                  <span className="font-bold">Lifeforge</span>
                  <span className="text-lime-500 text-6xl pl-1">. </span>
                  API Explorer
                </h1>
                <p className="text-lg mt-1 text-zinc-500 ml-4">
                  The documentation for all the available routes in the
                  Lifeforge API.
                </p>
              </div>
            </div>
            {Object.entries(routes).map(([route, paths]) => (
              <div className="mt-16" key={route}>
                <h2 className="text-3xl font-semibold mb-4 tracking-wider relative after:absolute after:top-1/2 after:-translate-y-1/2 pl-5 after:left-0 after:w-1 after:h-10 after:rounded-full after:bg-lime-500">
                  {route
                    .split("-")
                    .map((e) => (e ? e[0].toUpperCase() + e.slice(1) : "/"))
                    .join(" ")}
                </h2>
                <div className="space-y-3 mt-8">
                  {paths.map(({ method, path, docs }) => (
                    <PathEntry
                      key={`${route}-${method}-${path}`}
                      method={method}
                      path={path}
                      docs={docs}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon
            icon="svg-spinners:180-ring"
            className="size-10 text-zinc-500"
          />
        </div>
      )}
    </main>
  );
};

export default ApiExplorer;
