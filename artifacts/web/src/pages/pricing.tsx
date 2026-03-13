import { Layout } from "@/components/layout";
import { Check, Zap, Rocket, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "29",
      description: "Perfect for exploring AI automation for individual tasks.",
      icon: Zap,
      features: [
        "1 Active Agent Instance",
        "1,000 Task Executions/mo",
        "Standard API Access",
        "Community Support",
        "Basic Analytics"
      ],
      popular: false,
      color: "from-blue-500 to-cyan-400"
    },
    {
      name: "Pro",
      price: "99",
      description: "For professionals and small teams scaling operations.",
      icon: Rocket,
      features: [
        "5 Active Agent Instances",
        "10,000 Task Executions/mo",
        "Advanced API Integration",
        "Priority Email Support",
        "Custom Workflows",
        "Advanced Analytics Dashboard"
      ],
      popular: true,
      color: "from-primary to-accent"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated infrastructure for large-scale deployments.",
      icon: Shield,
      features: [
        "Unlimited Agent Instances",
        "Unlimited Executions",
        "On-Premises Deployment Option",
        "24/7 Dedicated Support",
        "Custom Agent Training",
        "SLA Guarantee",
        "Dedicated Account Manager"
      ],
      popular: false,
      color: "from-slate-400 to-slate-200"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Transparent pricing for <br/>
            <span className="gradient-text">the future of work</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you need a single helper or an entire digital workforce, we have a plan that scales with your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div 
                key={tier.name}
                className={`relative rounded-3xl glass-panel p-8 transition-transform duration-300 hover:-translate-y-2 ${
                  tier.popular ? "border-primary/50 shadow-2xl shadow-primary/20 md:scale-105 z-10 bg-card/80" : "border-white/10"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${tier.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-display font-bold">
                      {tier.price !== "Custom" ? `$${tier.price}` : tier.price}
                    </span>
                    {tier.price !== "Custom" && <span className="text-muted-foreground mb-1">/mo</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 ${tier.popular ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/register"
                  className={`block w-full py-4 text-center rounded-xl font-bold transition-all duration-300 ${
                    tier.popular 
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40" 
                      : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
