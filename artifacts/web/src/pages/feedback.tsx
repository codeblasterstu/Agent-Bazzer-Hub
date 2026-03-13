import { useListFeedback, useListAgents } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquareQuote, Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export default function Feedback() {
  // Poll every 5 seconds for real-time updates
  const { data: feedbackList, isLoading } = useListFeedback(undefined, {
    query: { refetchInterval: 5000 }
  });
  const { data: agents } = useListAgents();

  const getAgentName = (agentId: number) => {
    return agents?.find(a => a.id === agentId)?.name || `Agent #${agentId}`;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
            <MessageSquareQuote className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Live <span className="gradient-text">Feedback Feed</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time reviews and experiences from our community of businesses using AgentBazaar AI workers.
          </p>
        </div>

        <div className="relative">
          {/* Neon line connecting timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent opacity-30 md:left-1/2 md:-ml-px hidden sm:block" />

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-panel h-32 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : !feedbackList?.length ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No feedback available yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {/* Sort by newest first assuming IDs increment */}
                {[...feedbackList].sort((a,b) => b.id - a.id).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`relative flex flex-col sm:flex-row gap-6 items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-8 md:left-1/2 -ml-2.5 w-5 h-5 rounded-full bg-background border-2 border-primary z-10 shadow-[0_0_10px_rgba(168,85,247,0.8)] hidden sm:block mt-6" />

                    {/* Content Card */}
                    <div className={`w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] glass-card rounded-2xl p-6 relative group hover:border-primary/40`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-foreground text-lg">{item.userName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'}`} />
                          ))}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed">"{item.comment}"</p>

                      <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-muted-foreground block">Reviewed Agent</span>
                          <Link href={`/agents/${item.agentId}`} className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {getAgentName(item.agentId)}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
