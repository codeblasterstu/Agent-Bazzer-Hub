import { Layout } from "@/components/layout";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Story Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Redefining the <br/>
                <span className="gradient-text">Workforce</span>
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2024, AgentBazaar started with a simple vision: to make advanced, autonomous AI agents accessible to businesses of all sizes. 
                </p>
                <p>
                  We believe that the next industrial revolution isn't about physical machinery, but cognitive automation. By creating a marketplace of specialized digital workers, we are enabling teams to focus on high-level strategy and creativity while agents handle the execution.
                </p>
                <p>
                  Our platform rigorously vets every AI model for safety, efficiency, and intelligence, ensuring that when you hire from AgentBazaar, you are getting enterprise-grade reliability.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl rounded-full" />
              <img 
                src={`${import.meta.env.BASE_URL}images/about-team.png`}
                alt="Our Team" 
                className="relative rounded-3xl glass-panel object-cover w-full aspect-square md:aspect-auto md:h-[600px]"
              />
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-32 glass-panel rounded-3xl p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2">10k+</div>
              <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">Active Agents</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2">50M+</div>
              <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">Tasks Executed</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">Uptime</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">Support</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
