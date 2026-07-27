import type { TicketUser } from "../types";

export function TicketCreatorCard({ user }: { user: TicketUser }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ticket Creator</h3>
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
        <span className="h-12 w-12 shrink-0 rounded-full border-2 border-blue-500 bg-gray-200" />
        <div>
          <p className="text-sm text-gray-700">Code: {user.code || "N/A"}</p>
          <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-blue-700">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}
