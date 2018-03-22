import { Component } from '@angular/core';
import { MotionService } from './motion.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private motionService: MotionService) {
    
  }
}
