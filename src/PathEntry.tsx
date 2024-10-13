import React, { useState } from "react";
import { RouteDocs } from "./App";
import { Icon } from "@iconify/react/dist/iconify.js";

function PathEntry({
  method,
  path,
  docs,
}: {
  method: string;
  path: string;
  docs: RouteDocs | null;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className={`${
          {
            GET: "bg-green-500/5",
            POST: "bg-blue-500/5",
            PATCH: "bg-yellow-500/5",
            PUT: "bg-orange-500/5",
            DELETE: "bg-red-500/5",
          }[method]
        } ${
          {
            GET: "text-green-100/70",
            POST: "text-blue-100/70",
            PATCH: "text-yellow-100/70",
            PUT: "text-orange-100/70",
            DELETE: "text-red-100/70",
          }[method]
        } rounded-md p-2 w-full`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`text-lg tracking-widest rounded-sm font-semibold py-2 w-24 text-center ${
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
            </div>
            {docs?.access && (
              <Icon
                icon={
                  {
                    public: "tabler:lock-open",
                    protected: "tabler:lock",
                    private: "tabler:lock",
                  }[docs.access]
                }
                className="size-5"
              />
            )}
            <div className="text-lg tracking-wide">{path}</div>
          </div>
          <div className="flex items-center gap-4 mr-2">
            {docs?.summary && (
              <div className={` tracking-wide`}>{docs.summary}</div>
            )}
            {docs !== null && (
              <span className={`p-2 rounded-md `}>
                <Icon icon="tabler:chevron-down" className="size-5" />
              </span>
            )}
          </div>
        </div>
      </button>
      {docs !== null && (
        <div
          className={`${
            expanded ? "mt-2 py-6 h-[calc-size(auto)]" : "mt-0 py-0 h-0"
          } px-6 bg-zinc-900/50 overflow-hidden rounded-md space-y-8 transition-all`}
        >
          {docs.description && (
            <section>
              <h2 className="text-xl font-semibold tracking-wider text-zinc-10 mb-4">
                Description
              </h2>
              <p className="text-zinc-500">{docs.description}</p>
            </section>
          )}
          {(
            [
              ["params", "Parameters"],
              ["query", "Query Parameters"],
              ["body", "Request Body"],
            ] as const
          ).map(
            ([key, title]) =>
              docs[key].length > 0 && (
                <section>
                  <h2 className="text-xl tracking-wider font-semibold text-zinc-10 mb-4">
                    {title}
                  </h2>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-zinc-800 text-zinc-500">
                        <th className="px-2 py-2 text-left">Name</th>
                        <th className="px-2 py-2">Type</th>
                        <th className="px-2 py-2">Options</th>
                        <th className="px-2 py-2">Required</th>
                        <th className="px-2 py-2 whitespace-nowrap">
                          Must Exist In DB
                        </th>
                        <th className="px-2 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {docs[key].map((item, i) => (
                        <tr key={i}>
                          <td className="px-2 py-2">{item.name}</td>
                          <td className="px-2 py-2 text-center">
                            <code>{item.type}</code>
                          </td>
                          <td className="px-2 py-2 text-center">
                            {item.options?.length ? (
                              item.options.join(", ")
                            ) : (
                              <span className="text-zinc-500">N/A</span>
                            )}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {item.required ? (
                              <span className="inline-flex flex-col items-center justify-center gap-2">
                                <Icon
                                  icon="tabler:check"
                                  className="size-5 text-green-500"
                                />
                                {typeof item.required === "string" && (
                                  <span className="text-center text-zinc-500">
                                    ({item.required})
                                  </span>
                                )}
                              </span>
                            ) : (
                              <Icon
                                icon="tabler:minus"
                                className="size-5 text-zinc-500 inline-block"
                              />
                            )}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {item.must_exist ? (
                              <Icon
                                icon="tabler:check"
                                className="size-5 text-green-500 inline-block"
                              />
                            ) : (
                              <Icon
                                icon="tabler:minus"
                                className="size-5 text-zinc-500 inline-block"
                              />
                            )}
                          </td>
                          <td className="px-2 py-2 text-zinc-500">
                            {item.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )
          )}
          {docs.response && (
            <section>
              <h2 className="text-xl tracking-wider font-semibold text-zinc-10 mb-4">
                Response
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-lg tracking-wide">
                  <code>{docs.response.status}</code>
                </div>
                <div className="text-zinc-500 tracking-wide">
                  {docs.response.description} -{" "}
                  <code>{docs.response.body}</code>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default PathEntry;
