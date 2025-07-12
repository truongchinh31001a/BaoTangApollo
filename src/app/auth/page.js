
// import GoogleOAuthProvider from "../components/auth/GoogleOAuthProvider";

import AuthenticationTab from "@/components/auth/AuthenticationTab";

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* <GoogleOAuthProvider/> */}
      <AuthenticationTab/>
    </div>
  );
}
