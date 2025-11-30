import { X, Check } from "lucide-react";

export default function ProblemSolution() {
  const problems = [
    "Buying stale lead lists with 30% contact rates",
    "Manually researching and qualifying prospects",
    "Cold outreach that gets ignored or marked spam",
    "Hiring SDRs that churn in 6 months",
    "Scaling client acquisition without scaling costs",
  ];

  const solutions = [
    "Fresh, verified data with 85%+ contact rates",
    "AI pre-qualifies prospects before you call",
    "Human-sounding outreach that books meetings",
    "AI that works 24/7 without turnover",
    "Pay per lead or per meeting, not per seat",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Tired of Lead Gen That Doesn't Deliver?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* The Problem */}
          <div>
            <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              The Problem
            </div>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border border-red-100"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                    <X className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-slate-700 font-medium">{problem}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-slate-800 font-semibold mb-2">
                The Reality:
              </p>
              <p className="text-slate-600">
                Most agencies spend 60%+ of their time on prospecting instead
                of closing. Bad data and manual outreach kill margins and
                prevent scale.
              </p>
            </div>
          </div>

          {/* The Solution */}
          <div>
            <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              The Solution
            </div>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-primary-50 border border-primary-100"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-slate-700 font-medium">{solution}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-l-4 border-primary-600 rounded-lg">
              <p className="text-slate-800 font-semibold mb-2">
                The Result:
              </p>
              <p className="text-slate-600">
                Verified leads delivered on demand. AI outreach that sounds
                human and books qualified meetings. Your team focuses on
                closing deals, not chasing prospects.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-slate-600 mb-4">
            Ready to scale your client acquisition?
          </p>
          <p className="text-3xl font-bold text-slate-900">
            Let's turn cold lists into{" "}
            <span className="text-primary-600">qualified meetings</span>
          </p>
        </div>
      </div>
    </section>
  );
}
