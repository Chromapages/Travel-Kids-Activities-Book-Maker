import React, { useState } from 'react';
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const PricingPage: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const tiers = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for trying out the magic.',
            features: [
                '5 Destinations',
                '10 Pages per book',
                'Standard Templates',
                '1 Kid Profile'
            ],
            notIncluded: [
                'AI Art Generation',
                'Custom Instructions',
                'PDF Export',
                'Priority Support'
            ],
            cta: 'Start for Free',
            popular: false
        },
        {
            name: 'Explorer',
            price: isAnnual ? '$9.99' : '$14.99',
            period: '/mo',
            description: 'For the frequent little traveler.',
            features: [
                'Unlimited Destinations',
                '42 Pages per book',
                'AI Art Generation',
                'Custom Instructions',
                'PDF Export',
                '1 Kid Profile'
            ],
            notIncluded: [
                'Priority Support',
                'Multiple Kid Profiles'
            ],
            cta: 'Get Explorer',
            popular: true
        },
        {
            name: 'Family',
            price: isAnnual ? '$19.99' : '$24.99',
            period: '/mo',
            description: 'The ultimate adventure pack.',
            features: [
                'Unlimited Destinations',
                '42 Pages per book',
                'AI Art Generation',
                'Custom Instructions',
                'PDF Export',
                '5 Kid Profiles',
                'Priority Support'
            ],
            notIncluded: [],
            cta: 'Get Family',
            popular: false
        }
    ];

    const faqs = [
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
        },
        {
            question: "What is included in the AI Art Generation?",
            answer: "Our AI Art Generation creates unique, custom coloring pages based on your specific destination and child's interests, making every book truly one-of-a-kind."
        },
        {
            question: "How do I download the books?",
            answer: "With the Explorer and Family plans, you can export your activity books as high-quality PDFs, ready for printing at home or your local print shop."
        },
        {
            question: "Is there a limit to how many books I can create?",
            answer: "On our paid plans (Explorer and Family), you can create an unlimited number of activity books!"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Choose the perfect plan for your little explorer. No hidden fees, cancel anytime.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="w-16 h-8 bg-indigo-600 rounded-full p-1 relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                        Yearly <span className="text-emerald-600 text-xs font-medium ml-1">(Save 20%)</span>
                    </span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {tiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`relative bg-white rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-2
              ${tier.popular
                                ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50/50'
                                : 'border border-slate-200 shadow-lg'}`}
                    >
                        {tier.popular && (
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <h3 className="text-2xl font-medium text-slate-900 mb-2">{tier.name}</h3>
                        <p className="text-slate-500 text-sm mb-6">{tier.description}</p>

                        <div className="flex items-baseline mb-8">
                            <span className="text-4xl font-light text-slate-900">{tier.price}</span>
                            {tier.period && <span className="text-slate-500 ml-1">{tier.period}</span>}
                        </div>

                        <button
                            className={`w-full py-3 px-6 rounded-xl font-medium text-lg mb-8 transition-all duration-200 transform hover:scale-[1.02]
              ${tier.popular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {tier.cta}
                        </button>

                        <ul className="space-y-4">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-slate-600 text-sm">{feature}</span>
                                </li>
                            ))}
                            {tier.notIncluded.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 opacity-50">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                                        <X className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-slate-500 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-medium text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-600">Have questions? We're here to help.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-normal text-slate-900">{faq.question}</span>
                                {openFaq === index ? (
                                    <ChevronUp className="w-5 h-5 text-indigo-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
