import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() message: string = '';
  @Input() type: string = 'primary';

  constructor() {}

  ngOnInit(): void {}

  closeAlert() {
    this.close.emit();
  }
}
