"use client";

import { useState } from "react";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/site";
import { ArrowRight } from "./Arrows";

const PLATFORMS = ["Figma", "FigJam", "Framer", "Other"] as const;

interface FormState {
  name: string;
  platform: string;
  url: string;
  reason: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  platform: "Figma",
  url: "",
  reason: "",
  notes: "",
};

function issueBody(form: FormState): string {
  return [
    `**Plugin name:** ${form.name}`,
    `**Platform:** ${form.platform}`,
    `**Plugin URL:** ${form.url}`,
    ``,
    `**Reason for request:**`,
    form.reason,
    ``,
    `**Notes:**`,
    form.notes || "—",
  ].join("\n");
}

export default function SubmitForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) =>
      setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      title: `Review request: ${form.name}`,
      body: issueBody(form),
      labels: "review-request",
    });
    window.open(`${GITHUB_URL}/issues/new?${params}`, "_blank", "noopener");
  };

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Review request: ${form.name || "plugin"}`
  )}&body=${encodeURIComponent(issueBody(form))}`;

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <Field label="Plugin name" htmlFor="name">
        <input
          id="name"
          className="searchInput text-[1.1rem]!"
          required
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Autoflow"
        />
      </Field>

      <Field label="Platform" htmlFor="platform">
        <select
          id="platform"
          className="searchInput cursor-pointer text-[1.1rem]!"
          value={form.platform}
          onChange={set("platform")}
        >
          {PLATFORMS.map((platform) => (
            <option key={platform} value={platform} className="bg-black">
              {platform}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Plugin URL" htmlFor="url">
        <input
          id="url"
          type="url"
          className="searchInput text-[1.1rem]!"
          required
          value={form.url}
          onChange={set("url")}
          placeholder="https://…"
        />
      </Field>

      <Field label="Reason for request" htmlFor="reason">
        <textarea
          id="reason"
          className="searchInput min-h-24 resize-y text-[1.1rem]!"
          required
          value={form.reason}
          onChange={set("reason")}
          placeholder="Why should this plugin be reviewed?"
        />
      </Field>

      <Field label="Notes (optional)" htmlFor="notes">
        <textarea
          id="notes"
          className="searchInput min-h-24 resize-y text-[1.1rem]!"
          value={form.notes}
          onChange={set("notes")}
          placeholder="Anything you already know about its data handling"
        />
      </Field>

      <button
        type="submit"
        className="mt-8 cursor-pointer border border-white bg-transparent px-8 py-3 font-[inherit] text-[1.1rem] font-medium text-white transition-colors hover:bg-white hover:text-black"
      >
        Open GitHub issue <ArrowRight />
      </button>

      <p className="mt-6 text-sm text-[#757575]">
        No GitHub account?{" "}
        <a href={mailtoHref} className="link">
          Email the request instead
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label htmlFor={htmlFor} className="mb-1 block text-sm text-[#757575]">
        {label}
      </label>
      {children}
    </div>
  );
}
