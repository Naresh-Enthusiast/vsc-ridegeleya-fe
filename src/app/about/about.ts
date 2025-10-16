import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {

  techStack: string[] = [
    'Angular',
    'TypeScript',
    'RxJS',
    'Tailwind CSS',
    'Node.js',
    'MongoDB',
    'WebSocket',
    'Docker'
  ];

  teamMembers = [
    {
      id: 1,
      name: 'Your Name',
      role: 'Full Stack Developer',
      roleColor: '#06b6d4'
    },
    {
      id: 2,
      name: 'Teammate',
      role: 'UI/UX Designer',
      roleColor: '#a855f7'
    },
    {
      id: 3,
      name: 'Team Lead',
      role: 'Product Manager',
      roleColor: '#ec4899'
    }
  ];

  missionVision = [
    {
      type: 'mission',
      icon: '🌍',
      title: 'Our Mission',
      description: 'To empower everyday commuters with a smarter, greener, and cost-effective way to travel across India — connecting communities through technology and trust.',
      color: '#06b6d4'
    },
    {
      type: 'vision',
      icon: '🚀',
      title: 'Our Vision',
      description: 'To revolutionize urban and intercity transport by creating India\'s most reliable real-time ride-sharing ecosystem for both passengers and publishers.',
      color: '#a855f7'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.initializeAnimations();
  }

  /**
   * Initialize scroll-based animations
   */
  private initializeAnimations(): void {
    if (typeof window !== 'undefined') {
      const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe all animated elements
      const animatedElements = document.querySelectorAll('.card, .tech-tag, .team-member');
      animatedElements.forEach(el => observer.observe(el));
    }
  }

  /**
   * Handle tech tag click event
   */
  onTechTagClick(tech: string): void {
    console.log(`Selected technology: ${tech}`);
    // Add your logic here (e.g., filter, navigate, etc.)
  }

  /**
   * Handle team member click event
   */
  onTeamMemberClick(member: any): void {
    console.log(`Selected team member: ${member.name}`);
    // Add your logic here (e.g., show modal, navigate to profile, etc.)
  }

  /**
   * Smooth scroll to section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}