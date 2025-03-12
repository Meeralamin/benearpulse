import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  Award,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react";

const AffiliateProgram = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Earn Money with Our Affiliate Program
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join our affiliate program and earn commissions by referring
              parents to our child monitoring solution.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <a href="#join">Become an Affiliate</a>
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Become an Affiliate?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BenefitCard
                icon={<DollarSign className="h-10 w-10 text-blue-600" />}
                title="Generous Commissions"
                description="Earn 30% commission on every subscription sale you refer for the first year."
              />

              <BenefitCard
                icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
                title="Recurring Revenue"
                description="Earn commissions on subscription renewals for as long as the customer remains active."
              />

              <BenefitCard
                icon={<Gift className="h-10 w-10 text-blue-600" />}
                title="Bonuses & Incentives"
                description="Unlock special bonuses when you reach sales milestones and performance targets."
              />

              <BenefitCard
                icon={<Users className="h-10 w-10 text-blue-600" />}
                title="Growing Market"
                description="Tap into the expanding market of parents concerned about their children's safety."
              />

              <BenefitCard
                icon={<Award className="h-10 w-10 text-blue-600" />}
                title="Quality Product"
                description="Promote a trusted solution that genuinely helps parents and children stay connected."
              />

              <BenefitCard
                icon={<Zap className="h-10 w-10 text-blue-600" />}
                title="Easy to Promote"
                description="Access marketing materials, landing pages, and support to maximize your success."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200"></div>

                {/* Timeline items */}
                <TimelineItem
                  number="1"
                  title="Sign Up"
                  description="Complete our affiliate application form. We'll review your application and get back to you within 48 hours."
                  isLeft={true}
                />

                <TimelineItem
                  number="2"
                  title="Get Your Unique Link"
                  description="Once approved, you'll receive your unique affiliate link and access to our affiliate dashboard."
                  isLeft={false}
                />

                <TimelineItem
                  number="3"
                  title="Promote ParentConnect"
                  description="Share your affiliate link on your website, blog, social media, or directly with your audience."
                  isLeft={true}
                />

                <TimelineItem
                  number="4"
                  title="Earn Commissions"
                  description="When someone signs up through your link and becomes a paying customer, you earn a commission."
                  isLeft={false}
                />

                <TimelineItem
                  number="5"
                  title="Get Paid"
                  description="Receive your earnings via PayPal, bank transfer, or other payment methods on a monthly basis."
                  isLeft={true}
                  isLast={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Commission Structure */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Commission Structure
            </h2>

            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard Program</TabsTrigger>
                  <TabsTrigger value="premium">Premium Program</TabsTrigger>
                </TabsList>
                <TabsContent value="standard" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                          Standard Affiliate Program
                        </h3>
                        <p className="text-gray-600">
                          Our standard program is open to everyone and offers
                          competitive commission rates.
                        </p>

                        <div className="mt-6 border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Plan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Commission Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Duration
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Basic Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  20%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  First 12 months
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Family Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  25%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  First 12 months
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Premium Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  30%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  First 12 months
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  All Renewals
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  10%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Lifetime
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="premium" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                          Premium Affiliate Program
                        </h3>
                        <p className="text-gray-600">
                          Our premium program is for high-performing affiliates
                          and offers enhanced commission rates.
                        </p>

                        <div className="mt-6 border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Plan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Commission Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Duration
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Basic Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  30%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  First 12 months
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Family Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  35%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  First 12 months
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Premium Plan
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  40%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  First 12 months
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  All Renewals
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  15%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  Lifetime
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                          <p className="text-blue-700 text-sm">
                            <strong>Note:</strong> Premium program eligibility
                            requires at least 10 active referred subscriptions
                            or $1,000 in monthly referred revenue.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Join Now Section */}
        <section id="join" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join our affiliate program today and start earning commissions by
              promoting a product that helps keep children safe.
            </p>

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Apply to Become an Affiliate
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out our application form and we'll get back to you within
                48 hours.
              </p>

              <Button asChild size="lg" className="w-full">
                <Link to="/affiliate-application">Apply Now</Link>
              </Button>

              <p className="mt-4 text-sm text-gray-500">
                Already an affiliate?{" "}
                <Link
                  to="/affiliate-login"
                  className="text-blue-600 hover:underline"
                >
                  Log in to your dashboard
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              <FaqItem
                question="Who can join the affiliate program?"
                answer="Our affiliate program is open to bloggers, content creators, influencers, and anyone with an audience of parents or guardians who might benefit from our child monitoring solution."
              />

              <FaqItem
                question="How and when do I get paid?"
                answer="Payments are processed monthly for all commissions that have cleared the 30-day refund period. We offer payment via PayPal, direct bank transfer, or other payment methods with a minimum payout threshold of $50."
              />

              <FaqItem
                question="Do you provide marketing materials?"
                answer="Yes! We provide a variety of marketing materials including banners, email templates, product images, and pre-written content that you can use to promote our service effectively."
              />

              <FaqItem
                question="How do you track referrals?"
                answer="We use reliable tracking software that places cookies with a 90-day attribution window. This means if someone clicks your link and purchases within 90 days, you'll receive credit for the sale."
              />

              <FaqItem
                question="Can I promote the service on multiple websites?"
                answer="Yes, you can promote our service on multiple websites that you own. However, each website should be disclosed during the application process for approval."
              />

              <FaqItem
                question="What is not allowed in the affiliate program?"
                answer="We prohibit spam, misleading claims, trademark bidding, and any illegal or unethical promotion methods. Please review our full affiliate terms for complete details."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const BenefitCard = ({
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

const TimelineItem = ({
  number,
  title,
  description,
  isLeft,
  isLast = false,
}: {
  number: string;
  title: string;
  description: string;
  isLeft: boolean;
  isLast?: boolean;
}) => {
  return (
    <div
      className={`flex items-center justify-between mb-8 ${!isLast ? "md:mb-16" : "md:mb-0"}`}
    >
      <div
        className={`w-full md:w-5/12 ${isLeft ? "md:order-1" : "md:order-2"}`}
      >
        <div
          className={`p-6 bg-white rounded-lg shadow-sm ${isLeft ? "md:mr-8" : "md:ml-8"}`}
        >
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      <div className="hidden md:flex md:order-2 md:w-2/12 justify-center">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
          {number}
        </div>
      </div>

      <div
        className={`w-full md:w-5/12 ${isLeft ? "md:order-3" : "md:order-1"}`}
      ></div>

      {/* Mobile number indicator */}
      <div className="flex md:hidden absolute left-0 mt-1">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
          {number}
        </div>
      </div>
    </div>
  );
};

const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="text-blue-600">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateProgram;
