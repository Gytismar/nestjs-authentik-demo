import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';

export interface ErrorPageProps {
  errorCode: string;
  errorMessage: string;
  infoMessage: string;
  redirectAfter: number;
  redirectTo: string;
}

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  template: `
    <div
      class="container mx-auto p-8 flex justify-center items-center h-screen"
    >
      <div class="text-center">
        <h1 class="text-9xl font-bold text-error">{{ errorCode }}</h1>
        <p class="text-2xl mt-2 text-base-content">{{ errorMessage }}</p>

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
export class ErrorPageComponent implements OnInit {
  errorCode = '';
  errorMessage = '';
  infoMessage = '';
  private redirectAfter = 0;
  private redirectTo = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.data
      .pipe(map((data) => data as ErrorPageProps))
      .subscribe(
        (data: {
          errorCode: string;
          errorMessage: string;
          infoMessage: string;
          redirectAfter: number;
          redirectTo: string;
        }) => {
          this.errorCode = data.errorCode;
          this.errorMessage = data.errorMessage;
          this.infoMessage = data.infoMessage;
          this.redirectAfter = data.redirectAfter;
          this.redirectTo = data.redirectTo;

          if (this.redirectAfter && this.redirectTo) {
            setTimeout(() => {
              this.router.navigate([this.redirectTo]);
            }, this.redirectAfter);
          }
        }
      );
  }
}