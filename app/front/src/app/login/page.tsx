import Register from "../../components/all/Register";
import Login from "../../components/all/Login";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Link href="/main">
        <div className="relative group">
          <Image
            src="/images/hackernewslogo.png"
            alt="logo"
            width={300}
            height={300}
            className="mx-auto mb-10 group-hover:opacity-0"
            style={{ width: "auto" }}
            priority
          />
          <Image
            src="/images/hackernewslogoswap.png"
            alt="logo"
            width={300}
            height={300}
            className="mx-auto mb-10 absolute -top-0.5 left-0 opacity-0 group-hover:opacity-100"
            style={{ width: "auto" }}
            priority
          />
        </div>
      </Link>
      <div className="flex justify-center items-center">
        <Register />
        <Login />
      </div>
    </div>
  );
}
