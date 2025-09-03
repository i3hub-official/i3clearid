// app/page.tsx (Home)
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-6">
      <div className="p-6 rounded-lg ring-1 ring-gray-200 bg-white">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-gray-700">
          Verify your National Identification Number (NIN), submit IPE status,
          and print verification pages.
        </p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Link
            className="block p-4 rounded-lg ring-1 ring-gray-200 hover:bg-gray-50"
            href="/verify"
          >
            NIN Verification
          </Link>
          <Link
            className="block p-4 rounded-lg ring-1 ring-gray-200 hover:bg-gray-50"
            href="/print"
          >
            Print Slip
          </Link>
          <Link
            className="block p-4 rounded-lg ring-1 ring-gray-200 hover:bg-gray-50"
            href="/ipe"
          >
            Submit IPE
          </Link>
        </div>
      </div>
    </div>
  );
}
