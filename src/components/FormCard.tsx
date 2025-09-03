// components/FormCard.tsx
import { ReactNode } from "react";

export default function FormCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
