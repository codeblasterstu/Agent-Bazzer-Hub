import { Layout } from "@/components/layout";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const submitContact = useSubmitContact();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      await submitContact.mutateAsync({ data: values });
      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit", err);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left: Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Let's start a <br/>
              <span className="gradient-text">conversation</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Have questions about enterprise deployment, custom agent training, or just want to say hi? Our human team is here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email Us</h4>
                  <p className="text-muted-foreground">hello@agentbazaar.io</p>
                  <p className="text-muted-foreground">support@agentbazaar.io</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Headquarters</h4>
                  <p className="text-muted-foreground">101 Cyberdyne Way, Suite 400<br/>San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Phone className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Call Us</h4>
                  <p className="text-muted-foreground">+1 (555) 019-2834</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/30 blur-[60px] rounded-full" />
            
            <h3 className="text-2xl font-display font-bold mb-6 relative z-10">Send a Message</h3>
            
            {success ? (
              <div className="h-64 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-emerald-400">Message Sent!</h4>
                <p className="text-muted-foreground mt-2">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name</label>
                    <input 
                      {...form.register("name")}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground"
                      placeholder="John Doe"
                    />
                    {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                    <input 
                      {...form.register("email")}
                      type="email"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground"
                      placeholder="john@example.com"
                    />
                    {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Subject</label>
                  <input 
                    {...form.register("subject")}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground"
                    placeholder="How can we help?"
                  />
                  {form.formState.errors.subject && <p className="text-xs text-destructive mt-1">{form.formState.errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Message</label>
                  <textarea 
                    {...form.register("message")}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground resize-none"
                    placeholder="Tell us about your project..."
                  />
                  {form.formState.errors.message && <p className="text-xs text-destructive mt-1">{form.formState.errors.message.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={submitContact.isPending}
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Ensure Check is imported correctly at the top
import { Check } from "lucide-react";
