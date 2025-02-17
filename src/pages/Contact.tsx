import { motion } from 'framer-motion';
import { Instagram, Mail, Linkedin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { ContactForm } from '@/lib/types';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/your-handle',
    icon: Instagram,
    color: 'hover:text-pink-600 hover:scale-110',
  },
  {
    name: 'Email',
    url: 'mailto:your.email@example.com',
    icon: Mail,
    color: 'hover:text-red-600 hover:scale-110',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/your-profile',
    icon: Linkedin,
    color: 'hover:text-blue-700 hover:scale-110',
  },
  {
    name: 'Phone',
    url: 'tel:+1234567890',
    icon: Phone,
    color: 'hover:text-green-600 hover:scale-110',
  },
];

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<ContactForm> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    // Here you would typically send the data to your backend
    console.log('Form submitted:', data);
    toast.success('Message sent successfully!');
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Get in Touch</h1>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            Feel free to reach out through any of the following platforms or fill
            out the contact form below. I'm always open to discussing new
            opportunities and collaborations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 ${link.color}`}
              >
                <link.icon className="h-8 w-8 mb-4" />
                <span className="text-lg font-medium">{link.name}</span>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6">Contact Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-green-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
