import { Component } from '@angular/core';

@Component({
  selector: 'app-needs-permission',
  standalone: true,
  template: `
    <h1>Needs Permission</h1>
    <p>You can see this page only with the <b>read:title-details</b> permission.</p>
  `,
})
export class NeedsPermissionComponent {

}
