import { PRICING_PLANS } from "@/lib/constants/landing"

export function Pricing() {
  return (
    <section
      id="pricing"
      className="px-4 pb-32"
    >
      <div className="max-w-7xl mx-auto border border-white/[0.06] rounded-[32px] bg-[#0b0b0d] p-6 sm:p-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-green-400 text-xs tracking-[0.25em] uppercase font-medium mb-4">
            Tarifs
          </p>

          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-white mb-5">
            Simple et transparent
          </h2>

          <p className="text-white/45 text-lg leading-relaxed">
            Commencez gratuitement. Évoluez avec votre élevage.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`
                rounded-3xl
                border
                p-8
                flex flex-col
                ${
                  plan.featured
                    ? "border-green-400/30 bg-green-400/[0.03]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }
              `}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 bg-green-400/10 text-green-400 text-sm px-3 py-1 rounded-full">
                    ● Le plus populaire
                  </span>
                </div>
              )}

              {/* Name */}
              <h3 className="text-2xl font-medium text-white mb-4">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-end gap-2 mb-4">
                <span className="text-6xl font-medium text-white leading-none">
                  {plan.price}
                </span>

                <span className="text-white/35 pb-2">
                  {plan.unit}
                </span>
              </div>

              {/* Desc */}
              <p className="text-white/40 leading-relaxed mb-8">
                {plan.desc}
              </p>

              {/* Divider */}
              <div className="border-t border-white/[0.06] mb-8" />

              {/* Features */}
              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`
                        w-5 h-5
                        rounded-full
                        flex items-center justify-center
                        text-[10px]
                        ${
                          feature.included
                            ? "bg-green-400/15 text-green-400"
                            : "bg-white/[0.05] text-white/20"
                        }
                      `}
                    >
                      ✓
                    </div>

                    <span
                      className={
                        feature.included
                          ? "text-white/70"
                          : "text-white/20"
                      }
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`
                  h-14
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  ${
                    plan.featured
                      ? "bg-green-400 text-green-950 hover:bg-green-300"
                      : "bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.06]"
                  }
                `}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}