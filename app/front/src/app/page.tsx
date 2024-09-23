export default async function Home() {
  try {
    const res = await fetch("http://BEALYBACK:8080/", { cache: "no-store" });
    const json = await res.json();
    console.log("====================================");
    console.log(json.message);
    console.log("====================================");
  } catch (e) {
    console.log(e);
    return <div>Error</div>;
  }

  return (
    <div>
      <img
        src="https://cdn.bealy.io/icons/bealyFavicon512.png"
        alt="Logo"
        width={50}
        height={50}
      />
    </div>
  );
}
