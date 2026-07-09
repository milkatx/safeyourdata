"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Plugin } from "@/lib/plugins";
import { RiskBadge, VerificationBadge } from "./Badges";

const FILTER_CATEGORIES = [
  "platform",
  "category",
  "risk",
  "verification",
  "pricing",
  "developer",
] as const;

type FilterCategory = (typeof FILTER_CATEGORIES)[number];

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  platform: "Platform",
  category: "Category",
  risk: "Risk",
  verification: "Verification",
  pricing: "Pricing",
  developer: "Developer",
};

type ActiveFilters = Record<FilterCategory, string[]>;

function pluginValue(plugin: Plugin, category: FilterCategory): string {
  switch (category) {
    case "platform":
      return plugin.platform;
    case "category":
      return plugin.category;
    case "risk":
      return plugin.riskLevel;
    case "verification":
      return plugin.verificationStatus;
    case "pricing":
      return plugin.pricing;
    case "developer":
      return plugin.developer;
  }
}

function emptyFilters(): ActiveFilters {
  return {
    platform: [],
    category: [],
    risk: [],
    verification: [],
    pricing: [],
    developer: [],
  };
}

function filtersFromParams(params: URLSearchParams): ActiveFilters {
  const filters = emptyFilters();
  for (const category of FILTER_CATEGORIES) {
    const value = params.get(category);
    if (value) filters[category] = value.split(",").filter(Boolean);
  }
  return filters;
}

/** Keep search + filter state in the URL so views are shareable. */
function syncUrl(query: string, filters: ActiveFilters) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  for (const category of FILTER_CATEGORIES) {
    const values = filters[category];
    if (values.length > 0) params.set(category, values.join(","));
  }
  const search = params.toString();
  window.history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  );
}

export default function Directory({ plugins }: { plugins: Plugin[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<ActiveFilters>(() =>
    filtersFromParams(searchParams)
  );
  const [openCategory, setOpenCategory] = useState<FilterCategory | null>(null);

  useEffect(() => {
    syncUrl(query, filters);
  }, [query, filters]);

  const options = useMemo(() => {
    const result = {} as Record<FilterCategory, string[]>;
    for (const category of FILTER_CATEGORIES) {
      const values = new Set(plugins.map((p) => pluginValue(p, category)));
      result[category] = Array.from(values).sort();
    }
    return result;
  }, [plugins]);

  const visiblePlugins = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plugins.filter((plugin) => {
      if (q) {
        const haystack = [
          plugin.name,
          plugin.platform,
          plugin.developer,
          plugin.category,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return FILTER_CATEGORIES.every((category) => {
        const active = filters[category];
        return active.length === 0 || active.includes(pluginValue(plugin, category));
      });
    });
  }, [plugins, query, filters]);

  const toggleFilter = (category: FilterCategory, value: string) => {
    setFilters((current) => {
      const values = current[category].includes(value)
        ? current[category].filter((v) => v !== value)
        : [...current[category], value];
      return { ...current, [category]: values };
    });
  };

  const clearFilters = () => {
    setFilters(emptyFilters());
    setQuery("");
  };

  const activeCount = FILTER_CATEGORIES.reduce(
    (sum, category) => sum + filters[category].length,
    0
  );

  const closeFilter = () => setOpenCategory(null);

  return (
    <div id="directory">
      <div
        className={openCategory ? "filterIsOpen" : ""}
        onClick={openCategory ? closeFilter : undefined}
      >
        <div className="pt-16">
          <label htmlFor="search" className="sr-only">
            Search plugins
          </label>
          <input
            id="search"
            type="search"
            className="searchInput"
            placeholder="Search by name, platform, developer or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#757575]">
          <span>Filter by</span>
          {FILTER_CATEGORIES.map((category) => {
            const count = filters[category].length;
            return (
              <button
                key={category}
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 font-[inherit] text-sm text-white transition-colors hover:text-[#757575]"
                aria-pressed={count > 0}
                onClick={() => setOpenCategory(category)}
              >
                {CATEGORY_LABELS[category]}
                {count > 0 ? ` (${count})` : ""} <FilterSVG />
              </button>
            );
          })}
          {(activeCount > 0 || query) && (
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0 font-[inherit] text-sm text-[#757575] transition-colors hover:text-white"
              onClick={clearFilters}
            >
              Clear all
            </button>
          )}
        </div>

        <PluginTable
          plugins={visiblePlugins}
          onOpenFilter={setOpenCategory}
          onRowNavigate={(slug) => router.push(`/plugins/${slug}`)}
        />
      </div>

      <AnimatePresence>
        {openCategory ? (
          <FilterSidebar
            categoryName={CATEGORY_LABELS[openCategory]}
            options={options[openCategory]}
            active={filters[openCategory]}
            onToggle={(value) => toggleFilter(openCategory, value)}
            onClose={closeFilter}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PluginTable({
  plugins,
  onOpenFilter,
  onRowNavigate,
}: {
  plugins: Plugin[];
  onOpenFilter: (category: FilterCategory) => void;
  onRowNavigate: (slug: string) => void;
}) {
  const tableHeaderRef = useRef<HTMLTableSectionElement>(null);

  // Sticky header on scroll, ported from the original project.
  useEffect(() => {
    const header = tableHeaderRef.current;
    if (!header) return;
    const sticky = header.getBoundingClientRect().top + 40;
    const onScroll = () => {
      if (window.scrollY > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <table className="large mt-10" cellSpacing="0">
      <thead ref={tableHeaderRef}>
        <tr>
          <td>Name</td>
          <td
            className="dn w-[15%] cursor-pointer"
            onClick={() => onOpenFilter("platform")}
          >
            Platform <FilterSVG />
          </td>
          <td
            className="dn w-[18%] cursor-pointer"
            onClick={() => onOpenFilter("developer")}
          >
            Developer <FilterSVG />
          </td>
          <td
            className="w-[14%] cursor-pointer"
            onClick={() => onOpenFilter("risk")}
          >
            Risk <FilterSVG />
          </td>
          <td
            className="w-[16%] cursor-pointer"
            onClick={() => onOpenFilter("verification")}
          >
            Verification <FilterSVG />
          </td>
          <td className="dn w-[12%]">Reviewed</td>
          <td className="w-8 text-right"></td>
        </tr>
      </thead>
      <tbody>
        {plugins.length === 0 ? (
          <tr className="cursor-default hover:bg-transparent">
            <td colSpan={7} className="py-8 text-[1.1rem] text-[#757575]">
              No plugins match. Try clearing filters, or{" "}
              <Link href="/submit" className="link">
                submit a plugin
              </Link>{" "}
              for review.
            </td>
          </tr>
        ) : (
          plugins.map((plugin) => (
            <tr key={plugin.slug} onClick={() => onRowNavigate(plugin.slug)}>
              <td>
                <Link
                  href={`/plugins/${plugin.slug}`}
                  className="block w-full py-[0.6em] text-inherit"
                  onClick={(e) => e.stopPropagation()}
                >
                  {plugin.name}
                  <span className="mt-1 block text-sm text-[#757575]">
                    {plugin.description}
                  </span>
                </Link>
              </td>
              <td className="dn text-[1.1rem]">{plugin.platform}</td>
              <td className="dn text-[1.1rem]">{plugin.developer}</td>
              <td>
                <RiskBadge level={plugin.riskLevel} />
              </td>
              <td>
                <VerificationBadge status={plugin.verificationStatus} />
              </td>
              <td className="dn text-[1rem] text-[#757575]">
                {plugin.reviewedAt}
              </td>
              <td className="text-right">→</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

const sidebarAnimation = {
  hidden: { x: "120%" },
  show: {
    x: "0%",
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
};

/** Right-hand filter overlay, ported from the original project's Filter component. */
function FilterSidebar({
  categoryName,
  options,
  active,
  onToggle,
  onClose,
}: {
  categoryName: string;
  options: string[];
  active: string[];
  onToggle: (value: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      variants={sidebarAnimation}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="fixed top-0 right-0 z-10 h-screen w-full max-w-[420px] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Filter by ${categoryName}`}
    >
      <div className="min-h-screen w-full bg-white p-10 text-black">
        <button
          type="button"
          aria-label="Close filter"
          className="block h-6 w-6 cursor-pointer border-none bg-transparent p-0"
          onClick={onClose}
        >
          <CloseSVG />
        </button>
        <h3 className="mt-16 font-medium">{categoryName}</h3>

        {options.map((option) => {
          const isActive = active.includes(option);
          return (
            <button
              key={option}
              type="button"
              className="my-[0.1rem] flex w-full cursor-pointer items-center justify-between border-none bg-transparent p-0 text-left font-[inherit] text-[1.7rem] font-medium"
              aria-pressed={isActive}
              onClick={() => onToggle(option)}
            >
              {option}
              <span className={`check ${isActive ? "active" : ""} h-[1.7rem] w-[1.7rem]`}>
                <CheckSVG />
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function FilterSVG() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
      aria-hidden="true"
    >
      <path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CheckSVG() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseSVG() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
