import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const RegisterSuccess = () => {
  const location = useLocation();
  const email = location.state?.email || "your account";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-500 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Registration Successful!
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Thank you for registering with Parent Monitor. Your account has
              been created successfully.
            </p>

            <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-4">
              <p>
                We've sent a verification email to <strong>{email}</strong>.
              </p>
              <p className="mt-2">
                Please check your inbox and follow the instructions to verify
                your account.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              If you don't see the email, please check your spam folder or
              contact support.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/login">Continue to Login</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterSuccess;
