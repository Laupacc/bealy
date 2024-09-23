import Register from "../../components/all/Register";
import Login from "../../components/all/Login";
import { useRouter } from 'next/router';
export default function LoginPage() {
  return (
    <div>
      <Register />
      <Login />
    </div>
  );
}
