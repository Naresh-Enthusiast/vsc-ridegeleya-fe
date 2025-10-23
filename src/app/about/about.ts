import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    linkedin: string;
    twitter: string;
    email: string;
  };
}

@Component({
  selector: 'app-about-page',
  standalone: true,        // ✅ keep standalone
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements OnInit {
  isVisible = false;

  teamMembers: TeamMember[] = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 15+ years in tech and transportation',
      avatar: 'RK',
      social: { linkedin: '#', twitter: '#', email: 'rajesh@ridegeleya.com' }
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      bio: 'Tech expert specializing in AI and mobile applications',
      avatar: 'PS',
      social: { linkedin: '#', twitter: '#', email: 'priya@ridegeleya.com' }
    },
    {
      name: 'Amit Singh',
      role: 'Head of Operations',
      bio: 'Operations specialist ensuring smooth rides nationwide',
      avatar: 'AS',
      social: { linkedin: '#', twitter: '#', email: 'amit@ridegeleya.com' }
    },
    {
      name: 'Kavya Patel',
      role: 'Head of Safety',
      bio: 'Safety advocate ensuring secure journeys for all users',
      avatar: 'KP',
      social: { linkedin: '#', twitter: '#', email: 'kavya@ridegeleya.com' }
    }
  ];

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => this.isVisible = true, 50);
  }

  navigateHome(): void {
    window.location.href = '/';
  }
}
