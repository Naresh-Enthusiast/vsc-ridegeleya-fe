// contact.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  @Input() isLoggedIn: boolean = false;
  @Input() user: any = null;
  @Output() navigateHome = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  isVisible = false;
  isSubmitting = false;
  submitted = false;

  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  };

  categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'safety', label: 'Safety Concerns' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'partnership', label: 'Business Partnership' }
  ];

  faqs = [
    {
      question: 'How do I book a ride?',
      answer: 'Simply enter your pickup and destination locations, select your preferred ride, and confirm your booking. It\'s that easy!'
    },
    {
      question: 'Is RideGeleya safe?',
      answer: 'Yes! All our drivers are background-verified, and we provide real-time tracking and emergency assistance features.'
    },
    {
      question: 'How do payments work?',
      answer: 'We support multiple payment methods including UPI, cards, and wallets. Payments are processed securely after your ride completion.'
    },
    {
      question: 'Can I cancel my ride?',
      answer: 'Yes, you can cancel your ride from the tracking page. Cancellation policies may apply depending on the timing.'
    }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 100);

    if (this.user) {
      this.formData.name = `${this.user.firstName} ${this.user.lastName}`;
      this.formData.email = this.user.email;
    }
  }

  onSubmit(): void {
    if (!this.isValidForm()) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.submitted = true;

      setTimeout(() => {
        this.resetForm();
      }, 3000);
    }, 2000);
  }

  isValidForm(): boolean {
    return !!(
      this.formData.name &&
      this.formData.email &&
      this.formData.subject &&
      this.formData.category &&
      this.formData.message
    );
  }

  resetForm(): void {
    this.submitted = false;
    this.formData = {
      name: this.user ? `${this.user.firstName} ${this.user.lastName}` : '',
      email: this.user?.email || '',
      subject: '',
      category: '',
      message: ''
    };
  }

  openLiveChat(): void {
    alert('Chat support would open here');
  }

  onNavigateHome(): void {
    this.navigateHome.emit();
  }
}