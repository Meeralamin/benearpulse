import { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ChildRoute from "./components/ChildRoute";
import ChildLogin from "./components/ChildLogin";
import routes from "tempo-routes";
import migrateDatabase from "./lib/migrate-database";
import migratePricingPlans from "./lib/migrate-database-pricing";
import LandingPage from "./components/landing/LandingPage";

// Lazy load components for better performance
const AdminLoginForm = lazy(() => import("./components/auth/AdminLoginForm"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const UsersManagement = lazy(
  () => import("./components/admin/UsersManagement"),
);
const PricingPlans = lazy(
  () => import("./components/subscription/PricingPlans"),
);
const CheckoutForm = lazy(
  () => import("./components/subscription/CheckoutForm"),
);
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const RegisterForm = lazy(() => import("./components/auth/RegisterForm"));
const RegisterSuccess = lazy(() => import("./pages/RegisterSuccess"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AffiliateProgram = lazy(() => import("./pages/AffiliateProgram"));

function App() {
  // Run database migration on app start
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const result = await migrateDatabase();
        console.log("Database setup result:", result);

        // After database is set up, migrate pricing plans
        const pricingResult = await migratePricingPlans();
        console.log("Pricing plans setup result:", pricingResult);
      } catch (error) {
        console.error("Failed to set up database:", error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Home />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/register-success" element={<RegisterSuccess />} />

          {/* Child routes */}
          <Route path="/child" element={<ChildLogin />} />
          <Route path="/child/dashboard" element={<ChildRoute />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginForm />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />

          {/* Subscription routes */}
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/subscribe/:planId" element={<CheckoutForm />} />

          {/* Legal and info pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/affiliate-program" element={<AffiliateProgram />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
