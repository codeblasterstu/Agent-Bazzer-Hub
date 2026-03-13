import { useState } from "react";
import { Link } from "wouter";
import { useListAgents } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ArrowRight, Activity, Code, PenTool, Database, MessageSquare, Bot, TrendingUp, Users, Zap, ChevronRight, Shield, Globe } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const { data: agents, isLoading } = useListAgents({ search, category });

  const categories = [
    { id: "", label: "All Agents", icon: Activity },
    { id: "Development", label: "Dev & Code", icon: Code },
    { id: "Creative", label: "Creative", icon: PenTool },
    { id: "Data", label: "Data Analysis", icon: Database },
    { id: "Support", label: "Customer Support", icon: MessageSquare },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/30 text-primary mb-8 animate-float">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium tracking-wide uppercase">New: Autonomous Workflow Agents</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hire <span className="gradient-text">Digital Workers</span> <br />
              For Your Business
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Browse our marketplace of specialized, autonomous AI agents ready to write code, analyze data, and scale your operations 24/7.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-card border border-white/10 rounded-2xl p-2 shadow-2xl">
                <Search className="w-6 h-6 text-muted-foreground ml-3" />
                <input
                  type="text"
                  placeholder="What task do you need automated?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none px-4 py-3 text-lg"
                />
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Find Agent
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-12 bg-background relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="sticky top-28 glass-panel rounded-2xl p-6">
                <h3 className="text-sm font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                        <span className="font-medium text-left flex-1">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Featured Agents</h2>
                <span className="text-sm text-muted-foreground">Showing {agents?.length || 0} results</span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass-card rounded-2xl h-[400px] animate-pulse bg-white/5" />
                  ))}
                </div>
              ) : agents?.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl">
                  <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No agents found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
                  <button 
                    onClick={() => {setSearch(""); setCategory("");}}
                    className="mt-6 text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {agents?.map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex flex-col bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50"
                      >
                        {/* Card Image Area */}
                        <div className="h-48 relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 p-6 flex items-center justify-center">
                          {agent.imageUrl ? (
                            <img src={agent.imageUrl} alt={agent.name} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-50 group-hover:scale-110 transition-transform duration-700" />
                          )}
                          <Bot className="w-20 h-20 text-white/80 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:text-white transition-colors" />
                          
                          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 z-10">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold">{agent.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-accent tracking-wider uppercase">{agent.category}</span>
                          </div>
                          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">{agent.name}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                            {agent.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Price</span>
                              <span className="font-display font-bold text-lg text-foreground">${agent.price}<span className="text-sm font-sans text-muted-foreground font-normal">/mo</span></span>
                            </div>
                            <Link 
                              href={`/agents/${agent.id}`}
                              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-colors"
                            >
                              <ArrowRight className="w-5 h-5 text-white" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
