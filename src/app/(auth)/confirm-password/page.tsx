import ConfirmPassword from "@/components/auth/ConfirmPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Password",
  description: "Confirm Password page",
};

const ConfirmPasswordPage = () => {
  return (
    <>
      <ConfirmPassword />
    </>
  );
};

export default ConfirmPasswordPage;
