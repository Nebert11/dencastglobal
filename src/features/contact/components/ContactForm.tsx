import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { submitContactMessage } from '@/services/supabase.service';
import type { ContactFormData } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const SERVICE_OPTIONS = [
  'Documentary Production',
  'Livestreaming & Events',
  'Photography',
  'Videography',
  'Brand Strategy',
  'Creative Media',
  'Drone Services',
  'Corporate Communications',
  'Commercial Productions',
  'Digital Content Creation',
  'Other / Not Sure',
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required';
  } else if (values.message.trim().length < 20) {
    errors.message = 'Please provide a bit more detail (at least 20 characters)';
  }

  return errors;
}

// ─── Input component ──────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="text-[#D72638] ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="text-[#D72638] text-xs flex items-center gap-1"
      >
        <AlertCircle size={11} />
        {error}
      </motion.p>
    )}
  </div>
);

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
    hasError
      ? 'border-[#D72638] focus:ring-[#D72638]/25'
      : 'border-slate-200 focus:border-[#0056A6] focus:ring-[#0056A6]/15'
  }`;

// ─── ContactForm ──────────────────────────────────────────────────────────────

interface ContactFormProps {
  /** Optional CSS class on the form wrapper */
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const [values, setValues] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues(v => ({ ...v, [field]: e.target.value }));
    if (touched[field]) {
      // Re-validate on change after first blur
      const newErrors = validateForm({ ...values, [field]: e.target.value });
      setErrors(newErrors);
    }
  };

  const blur = (field: keyof FormState) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    const newErrors = validateForm(values);
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields touched
    setTouched({ name: true, email: true, message: true });
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitStatus('loading');

    const payload: ContactFormData = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      subject: values.subject.trim() || undefined,
      message: values.message.trim(),
      service_interest: values.serviceInterest || undefined,
    };

    const result = await submitContactMessage(payload);

    if (result.status === 'success') {
      setSubmitStatus('success');
      setValues({ name: '', email: '', phone: '', company: '', serviceInterest: '', subject: '', message: '' });
      setTouched({});
      setErrors({});
    } else {
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-16 px-8 bg-white rounded-2xl border border-slate-100"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3">Message Sent!</h3>
        <p className="text-slate-600 mb-8 max-w-sm leading-relaxed">
          Thank you for reaching out. Our team will review your message and get back to you promptly.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="px-6 py-2.5 bg-[#0056A6] text-white rounded-xl text-sm font-semibold hover:bg-[#004a8f] transition-colors"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Name */}
        <Field label="Full Name" required error={touched.name ? errors.name : undefined}>
          <input
            type="text"
            value={values.name}
            onChange={set('name')}
            onBlur={blur('name')}
            placeholder="John Doe"
            className={inputClass(!!touched.name && !!errors.name)}
          />
        </Field>

        {/* Email */}
        <Field label="Email Address" required error={touched.email ? errors.email : undefined}>
          <input
            type="email"
            value={values.email}
            onChange={set('email')}
            onBlur={blur('email')}
            placeholder="john@company.com"
            className={inputClass(!!touched.email && !!errors.email)}
          />
        </Field>

        {/* Phone */}
        <Field label="Phone Number">
          <input
            type="tel"
            value={values.phone}
            onChange={set('phone')}
            placeholder="+254-721-710-397"
            className={inputClass(false)}
          />
        </Field>

        {/* Company */}
        <Field label="Company / Organisation">
          <input
            type="text"
            value={values.company}
            onChange={set('company')}
            placeholder="Your Company Ltd."
            className={inputClass(false)}
          />
        </Field>
      </div>

      {/* Service Interest */}
      <div className="mt-5">
        <Field label="Service Interest">
          <select
            value={values.serviceInterest}
            onChange={set('serviceInterest')}
            className={`${inputClass(false)} appearance-none`}
          >
            <option value="">Select a service...</option>
            {SERVICE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Subject */}
      <div className="mt-5">
        <Field label="Subject">
          <input
            type="text"
            value={values.subject}
            onChange={set('subject')}
            placeholder="Brief subject of your enquiry"
            className={inputClass(false)}
          />
        </Field>
      </div>

      {/* Message */}
      <div className="mt-5">
        <Field label="Message" required error={touched.message ? errors.message : undefined}>
          <textarea
            value={values.message}
            onChange={set('message')}
            onBlur={blur('message')}
            placeholder="Tell us about your project, goals, and any specific requirements..."
            rows={6}
            className={`${inputClass(!!touched.message && !!errors.message)} resize-none`}
          />
        </Field>
      </div>

      {/* Error banner */}
      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          Something went wrong sending your message. Please try again or email us directly.
        </motion.div>
      )}

      {/* Submit */}
      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center"
          loading={submitStatus === 'loading'}
          rightIcon={<Send size={16} />}
        >
          Send Message
        </Button>
        <p className="mt-3 text-xs text-slate-400 text-center">
          We typically respond promptly during business days.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
