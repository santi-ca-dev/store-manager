import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase-service.service';
import { User } from '@supabase/supabase-js';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  imports: [CommonModule, RouterModule],
  styles: [
    `
    button {
      cursor: pointer;
    }
    `
  ]
})

export class NavComponent implements OnInit {
  toggleDarkMode() {
    document.body.classList.toggle('dark');
  }

  user: User | null = null;

  constructor(private supabaseService: SupabaseService, private router: Router, private authService: AuthService) {}

  get authServicePublic() {
    return this.authService;
  }

  ngOnInit(): void {
    this.supabaseService.user$.subscribe(user => {
      this.user = user;
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

}
