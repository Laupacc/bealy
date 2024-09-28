import Register from "../../components/all/Register";
import Login from "../../components/all/Login";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image
        src="/images/hackernewslogo.png"
        alt="logo"
        width={300}
        height={300}
        className="mx-auto mb-20"
        style={{ width: "auto" }} 
        priority
      />
      <div className="flex justify-center items-center">
        <Register />
        <Login />
      </div>
    </div>
  );
}
