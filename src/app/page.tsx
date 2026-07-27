import { redirect } from "next/navigation";

export default function RootPage() {
  // Middleware guarantees only authenticated requests reach this point.
  redirect("/user-management");
}
