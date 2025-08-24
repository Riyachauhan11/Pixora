"use client";

import { Github, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-slate-900 text-center border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Let’s Connect
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Have questions or ideas? I’d love to hear from you. Reach out anytime!
        </p>

        <div className="flex justify-center gap-6 mb-12">
          <a
            href="https://github.com/Riyachauhan11"
            target="_blank"
            className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
          >
            <Github size={20} /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/riya-chauhan-6b0872272/"
            target="_blank"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition"
          >
            <Linkedin size={20} /> LinkedIn
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Copyright
        </p>
      </div>
    </section>
  );
};

export default Contact;
