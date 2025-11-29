import { X, Check } from "lucide-react";

export default function ProblemSolution() {
  const problems = [
    "Calls going to voicemail after 6pm",
    "Missing leads while on job sites",
    "Potential customers calling competitors who answer first",
    "Seasonal rush overwhelming phone lines",
    "Lost revenue from missed estimate requests",
  ];

  const solutions = [
    "AI answers every call, 24/7/365",
    "Captures leads even when you're busy",
    "Instant response = more booked appointments",
    "Scales during peak season automatically",
    "Never miss another revenue opportunity",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Are You Losing Customers to Voicemail?
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
                Studies show that 80% of callers won't leave a voicemail, and
                67% will call a competitor if you don't answer. Every missed
                call is potential revenue walking out the door.
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
                Our AI receptionist answers every single call with a natural,
                human-sounding voice. It books appointments, answers questions,
                and captures contact information—even at 2 AM. Your customers
                get instant service, and you get more revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-slate-600 mb-4">
            Ready to stop losing leads to voicemail?
          </p>
          <p className="text-3xl font-bold text-slate-900">
            Let's turn missed calls into{" "}
            <span className="text-primary-600">booked jobs</span>
          </p>
        </div>
      </div>
    </section>
  );
}
