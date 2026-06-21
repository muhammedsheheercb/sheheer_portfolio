"use client";

import { useState, useRef } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setFormStatus("sending");
      setErrorMessage("");
      // Fallback: Simulate submission if key is not configured in local env
      console.warn("Web3Forms access key not found in environment variables. Running in simulation mode.");
      setTimeout(() => {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setCaptchaToken(null);
        setTimeout(() => setFormStatus("idle"), 4000);
      }, 1500);
      return;
    }

    if (!captchaToken) {
      setFormStatus("error");
      setErrorMessage("Please solve the hCaptcha challenge before submitting.");
      return;
    }

    setFormStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: "Portfolio Contact Form",
          subject: `New Message from ${formData.name} via Portfolio`,
          "h-captcha-response": captchaToken
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
        setTimeout(() => setFormStatus("idle"), 4000);
      } else {
        setFormStatus("error");
        setErrorMessage(result.message || "Failed to send message. Please try again.");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      }
    } catch (err) {
      setFormStatus("error");
      setErrorMessage("A network error occurred. Please try again later.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
      {/* Section Title */}
      <div className="flex flex-col gap-3 mb-16 text-center md:text-left">
        <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase self-center md:self-start">
          // 04 . GET IN TOUCH
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          Get In Touch
        </h2>
        <p className="text-zinc-400 max-w-lg text-sm">
          Have an exciting project or full-time opportunity? Fill out the form or reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Side: Contact Info */}
        <div className="md:col-span-5 space-y-8">
          <h3 className="font-display text-lg font-bold text-white mb-6 uppercase tracking-wider">
            Contact Information
          </h3>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400">
                <Mail size={16} />
              </span>
              <div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Email</p>
                <a
                  href="mailto:muhammedsheheercb@gmail.com"
                  className="text-zinc-300 hover:text-cyan-400 text-xs font-bold transition-colors break-all font-mono"
                >
                  muhammedsheheercb@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400">
                <Phone size={16} />
              </span>
              <div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Phone</p>
                <a
                  href="tel:+918086860867"
                  className="text-zinc-300 hover:text-cyan-400 text-xs font-bold transition-colors font-mono"
                >
                  +91 8086860867
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400">
                <MessageCircle size={16} />
              </span>
              <div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">WhatsApp</p>
                <a
                  href="https://wa.me/918086860867"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-cyan-400 text-xs font-bold transition-colors font-mono"
                >
                  +91 8086860867
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400">
                <MapPin size={16} />
              </span>
              <div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Location</p>
                <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider">
                  Thrissur, Kerala, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="md:col-span-7">
          <div className="rounded-2xl glass-panel p-6 border border-white/5 relative overflow-hidden">
            {formStatus === "success" ? (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <CheckCircle size={48} className="text-cyan-400 mb-4 animate-bounce" />
                <h4 className="font-display text-lg font-bold text-white mb-2 uppercase tracking-wide">Message Sent!</h4>
                <p className="text-zinc-400 text-xs max-w-xs leading-relaxed">
                  Thank you for reaching out. I will get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-zinc-950/40 border border-white/5 focus:border-cyan-400 focus:bg-zinc-950/80 text-zinc-200 text-xs outline-none transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-zinc-950/40 border border-white/5 focus:border-cyan-400 focus:bg-zinc-950/80 text-zinc-200 text-xs outline-none transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-zinc-950/40 border border-white/5 focus:border-cyan-400 focus:bg-zinc-950/80 text-zinc-200 text-xs outline-none transition-all duration-300 resize-none"
                    placeholder="Write your message details..."
                  />
                </div>

                {/* hCaptcha widget */}
                {process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY && (
                  <div className="flex justify-center py-2 overflow-hidden max-w-full">
                    <HCaptcha
                      sitekey="50b270fa-ee9b-4ec6-8a9d-3c83485b9f7e"
                      theme="dark"
                      onVerify={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => {
                        setCaptchaToken(null);
                        setFormStatus("error");
                        setErrorMessage("hCaptcha failed to load. Please try again.");
                      }}
                      ref={captchaRef}
                    />
                  </div>
                )}

                {/* Error message */}
                {formStatus === "error" && (
                  <p className="text-red-400 text-xs font-semibold tracking-wide text-center">
                    {errorMessage || "Failed to send message. Please try again."}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="w-full py-3 rounded-xl border border-cyan-400 bg-transparent hover:bg-cyan-400 hover:text-black disabled:opacity-50 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  {formStatus === "sending" ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
