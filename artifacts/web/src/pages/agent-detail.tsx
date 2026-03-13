import { useRoute, Link } from "wouter";
import { useGetAgent, useListFeedback, useCreateFeedback } from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-provider";
import { Layout } from "@/components/layout";
import { Bot, Star, CheckCircle2, ShoppingCart, MessageSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export default function AgentDetail() {
  const [, params] = useRoute("/agents/:id");
  const agentId = parseInt(params?.id || "0");
  const { user, getAuthHeaders } = useAuth();
  
  const { data: agent, isLoading, isError } = useGetAgent(agentId, { query: { enabled: !!agentId }});
  const { data: feedback, refetch: refetchFeedback } = useListFeedback({ agentId }, { query: { enabled: !!agentId }});
  
  const createFeedback = useCreateFeedback({ request: { headers: getAuthHeaders() } });
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const onSubmitReview = async (values: z.infer<typeof reviewSchema>) => {
    if (!user) return;
    try {
      await createFeedback.mutateAsync({
        data: {
          agentId,
          userName: user.name,
          rating: values.rating,
          comment: values.comment,
        }
      });
      setReviewSuccess(true);
      form.reset();
      await refetchFeedback();
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !agent) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Agent Not Found</h2>
            <p className="text-muted-foreground mt-2">The agent you are looking for does not exist.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 border-b border-white/5">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Left: Image/Avatar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/3 shrink-0"
            >
              <div className="aspect-square rounded-3xl glass-panel relative overflow-hidden flex items-center justify-center group border-glow">
                {agent.imageUrl ? (
                  <img src={agent.imageUrl} alt={agent.name} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-50" />
                )}
                <Bot className="w-32 h-32 text-white relative z-10 drop-shadow-2xl" />
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 pt-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-semibold tracking-wide uppercase">
                  {agent.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{agent.rating.toFixed(1)}</span>
                  <span className="text-sm text-yellow-400/60 ml-1">({agent.reviewCount})</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{agent.name}</h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {agent.description}
              </p>

              <div className="flex flex-wrap items-end gap-6 mb-10 pb-10 border-b border-white/10">
                <div>
                  <span className="block text-sm text-muted-foreground mb-1">Pricing</span>
                  <div className="text-4xl font-display font-bold text-foreground">
                    ${agent.price}<span className="text-xl text-muted-foreground font-sans font-normal">/mo</span>
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  {/* Fake Buy Button - redirects to contact */}
                  <Link 
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Purchase License</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-display">Key Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agent.features?.length ? agent.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" /><span className="text-muted-foreground">Autonomous task execution</span></div>
                      <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" /><span className="text-muted-foreground">API Integrations ready</span></div>
                      <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" /><span className="text-muted-foreground">24/7 Availability</span></div>
                      <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" /><span className="text-muted-foreground">Customizable logic paths</span></div>
                    </>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Details & Reviews */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-display font-bold mb-6">About {agent.name}</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {agent.longDescription || `${agent.name} is a state-of-the-art AI agent designed specifically for the ${agent.category} domain. Built on advanced neural architectures, it is capable of reasoning, planning, and executing complex workflows without human intervention.
                
                By integrating seamlessly into your existing systems via secure APIs, this agent can drastically reduce operational overhead. It learns from its environment, adapting to your specific business rules and security requirements. 
                
                Deployment takes less than 10 minutes, and the agent begins delivering ROI on day one.`}
              </p>
            </div>
          </div>

          {/* Reviews Sidebar */}
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold">Customer Reviews</h3>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {!feedback || feedback.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first!</p>
                ) : (
                  feedback.map((item) => (
                    <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-foreground">{item.userName}</span>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-current' : 'text-white/20'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.comment}</p>
                      <span className="text-xs text-muted-foreground/50">{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Write Review Form */}
            <div className="glass-panel rounded-2xl p-6">
              <h4 className="font-display font-bold mb-4">Write a Review</h4>
              {user ? (
                <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => form.setValue("rating", num)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star className={`w-6 h-6 ${form.watch("rating") >= num ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Comment</label>
                    <textarea
                      {...form.register("comment")}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
                      placeholder="Share your experience..."
                    />
                    {form.formState.errors.comment && (
                      <p className="text-destructive text-xs mt-1">{form.formState.errors.comment.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={createFeedback.isPending}
                    className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {createFeedback.isPending ? "Submitting..." : "Submit Review"}
                  </button>
                  {reviewSuccess && (
                    <p className="text-emerald-400 text-sm text-center">Review posted successfully!</p>
                  )}
                </form>
              ) : (
                <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-muted-foreground mb-4">You must be logged in to leave a review.</p>
                  <Link href="/login" className="text-primary font-medium hover:underline">Log in here</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
