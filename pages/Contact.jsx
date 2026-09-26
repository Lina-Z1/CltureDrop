import '../styles/Contact.css';
import { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <>
            <div className="contact-hero">
                <div className="contact-hero-overlay">
                    <div className="container text-center">
                        <h1 className="contact-hero-title">Get In Touch</h1>
                        <p className="contact-hero-subtitle">Let us help plan your next adventure</p>
                    </div>
                </div>
            </div>

            <section className="contact-section">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-12">
                            <div className="contact-form-wrapper">
                                <h3 className="contact-form-title text-center">Send Message</h3>

                                {submitted && (
                                    <div className="alert alert-success">
                                        Thank you for your message! We'll get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Your Name *</label>
                                            <input
                                                type="text"
                                                className="form-control contact-input"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email Address *</label>
                                            <input
                                                type="email"
                                                className="form-control contact-input"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Subject *</label>
                                            <select
                                                className="form-select contact-input"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="Booking">Booking Inquiry</option>
                                                <option value="Destination">Destination Information</option>
                                                <option value="Group">Group Travel</option>
                                                <option value="Support">Customer Support</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Message *</label>
                                            <textarea
                                                className="form-control contact-textarea"
                                                name="message"
                                                rows="6"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="contact-submit-btn btn-dark">
                                                Send Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="contact-map-wrapper mt-5">
                        <h3 className="text-center mb-4">Find Us Here</h3>
                        <div className="contact-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb6d2c7%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
                                width="100%"
                                height="350"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Office Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contact;