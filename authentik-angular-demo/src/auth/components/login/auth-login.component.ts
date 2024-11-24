import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [],
  template: `
    <div
      class="container mx-auto p-8 flex justify-center items-center h-screen"
    >
      <div class="text-center">
        <div class="flex justify-center mt-4">
          <progress class="progress progress-error w-56"></progress>
        </div>

        <p class="text-sm mt-4 text-base-content">
          {{ infoMessage }}
        </p>
      </div>
    </div>
  `,
})
export class AuthLogin implements OnInit {
  infoMessage = 'Loading...';

  constructor() {}

  ngOnInit(): void {}
}
