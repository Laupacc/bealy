import { redirect } from "next/navigation";

export default async function Home() {
  try {
    const res = await fetch("http://BEALYBACK:8080/", { cache: "no-store" });
    const json = await res.json();
    console.log("====================================");
    console.log(json.message);
    console.log("====================================");
  } catch (e) {
    console.log(e);
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 text-red-700 font-sans">
        <div className="text-center p-6 border border-red-300 rounded bg-red-100">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="mt-2">Something went wrong. Please try again later.</p>
        </div>
      </div>
    );
  }

  redirect("/main");
}
