import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Shield, Video, Bell, Lock, Users, Clock } from "lucide-react";
import Footer from "./Footer";
import Header from "./Header";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              No Longer Away
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Stay connected with your child anytime, anywhere with our secure
              live video monitoring solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                <Link to="/register">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
              >
                <Link to="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=800&q=80"
              alt="Parent and child video call"
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Video className="h-10 w-10 text-blue-600" />}
              title="Real-time Video Connection"
              description="Instantly connect to your child's device with high-quality video streaming, even when the app is running in the background."
            />

            <FeatureCard
              icon={<Bell className="h-10 w-10 text-blue-600" />}
              title="Background Activation"
              description="Our app uses push notifications to activate the connection immediately, ensuring you can check on your child at any time."
            />

            <FeatureCard
              icon={<Lock className="h-10 w-10 text-blue-600" />}
              title="Privacy Controls"
              description="Clear visual indicators when monitoring is active and optional privacy mode for appropriate situations."
            />

            <FeatureCard
              icon={<Shield className="h-10 w-10 text-blue-600" />}
              title="Secure Connection"
              description="End-to-end encrypted WebRTC connections ensure your video streams remain private and secure."
            />

            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="Multiple Device Support"
              description="Monitor multiple children's devices from a single parent account with our family-friendly plans."
            />

            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="Activity Logging"
              description="Comprehensive logs of all monitoring sessions for transparency and accountability."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Register & Setup</h3>
              <p className="text-gray-600">
                Create your parent account and generate unique device IDs for
                your children's devices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Install & Connect</h3>
              <p className="text-gray-600">
                Install the app on your child's device and enter the device ID
                to connect it to your account.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Monitor Anytime</h3>
              <p className="text-gray-600">
                Use your parent dashboard to initiate secure video connections
                whenever you need to check in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Parents Say
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This app gives me peace of mind when my kids are with the babysitter. I can check in discreetly and know they're safe."
              author="Sarah M."
              role="Mother of two"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
            />

            <TestimonialCard
              quote="The instant connection feature is amazing. No matter where I am, I can see what my child is doing in seconds."
              author="Michael T."
              role="Father of three"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
            />

            <TestimonialCard
              quote="I appreciate the privacy features. My teenager knows when I'm checking in, which builds trust while keeping them safe."
              author="Jennifer K."
              role="Mother of a teenager"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Stay Connected?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of parents who trust our app to keep their children
            safe and connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Affiliate Program Banner */}
      <section className="py-10 bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">Become an Affiliate</h3>
          <p className="mb-6">
            Earn commissions by referring other parents to our monitoring
            solution.
          </p>
          <Button asChild variant="outline">
            <Link to="/affiliate-program">Learn More</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({
  quote,
  author,
  role,
  avatar,
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt={author}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{quote}"</p>
    </div>
  );
};

export default LandingPage;
