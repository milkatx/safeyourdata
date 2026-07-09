import { UNKNOWN } from "@/lib/plugins";

export function DetailSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-16">
      <h2
        id={`${id}-heading`}
        className="m-0 border-b border-[#363636] pb-3 text-[1.7rem] font-medium tracking-[-0.02em]"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function UnknownValue() {
  return <span className="text-[#757575] italic">Unknown — not yet reviewed</span>;
}

export function Value({ value }: { value: string }) {
  if (value === UNKNOWN) return <UnknownValue />;
  return <span>{value}</span>;
}

export function ListValue({ items }: { items: string[] }) {
  if (items.length === 0) return <UnknownValue />;
  return (
    <ul className="m-0 list-none p-0">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Definition-list rows in the table voice of the original project. */
export function DataList({
  rows,
}: {
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="m-0">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="grid grid-cols-1 gap-1 border-b border-[#363636] py-4 last:border-b-0 sm:grid-cols-[14rem_1fr] sm:gap-6"
        >
          <dt className="text-[#757575]">{label}</dt>
          <dd className="m-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
