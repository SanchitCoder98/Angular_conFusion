import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Feedback } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  feedback = null;

  constructor(private restangular: Restangular) {}

  submitFeedback(newFeedback: Feedback)
  {
    let Basefeedback = this.restangular.all('feedback');
    Basefeedback.getList().subscribe(feedback => { this.feedback = feedback; });
    Basefeedback.post(newFeedback);
  }

}
