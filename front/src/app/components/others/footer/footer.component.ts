import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faQuran, faDragon } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'footer',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  faQuran = faQuran;
  faDragon = faDragon
}