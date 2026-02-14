import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function Contact() {
    const { branding, contact, nonce } = useSettings();
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormInputs>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormInputs) => {
        setSubmitStatus({ type: null, message: '' });
        try {
            const response = await api.post('/mosque/v1/contact', data, {
                headers: {
                    'X-WP-Nonce': nonce
                }
            });
            setSubmitStatus({ type: 'success', message: response.data.message });
            reset();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
            setSubmitStatus({ type: 'error', message: errorMessage });
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Helmet>
                <title>Contact Us | {branding.mosqueName}</title>
            </Helmet>
            <h1 className="text-4xl font-bold text-center mb-12 font-serif text-primary">Contact Us</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info & Map */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Address</h3>
                                    <p className="text-gray-600">{contact.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-6 h-6 text-primary mr-4" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">{contact.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-6 h-6 text-primary mr-4" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">{contact.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Google Maps */}
                    <div className="bg-gray-100 h-80 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                        {contact.latitude && contact.longitude ? (
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                title="Mosque Location"
                                src={`https://maps.google.com/maps?q=${contact.latitude},${contact.longitude}&z=15&output=embed`}
                            ></iframe>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <MapPin className="w-12 h-12 mb-2 opacity-20" />
                                <p>Location coordinates not set in settings.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Send a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {submitStatus.type === 'success' && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                                <p className="text-sm font-medium">{submitStatus.message}</p>
                            </div>
                        )}

                        {submitStatus.type === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <p className="text-sm font-medium">{submitStatus.message}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                {...register('name')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                            <input
                                type="tel"
                                id="phone"
                                {...register('phone')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                {...register('message')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-3 border"
                            />
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
