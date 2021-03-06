import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { baseURL } from '../shared/baseurl';
import { state, trigger, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],

  animations:[
    trigger('visibility', [
      state('shown', style({
          transform: 'scale(1.0)',
          opacity: 1
      })),
      state('hidden', style({
          transform: 'scale(0.5)',
          opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  comment: Comment;
  feedbackForm: FormGroup;
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  errMess: String;
  dishcopy = null;
  visibility = 'shown';
  
  formErrors = {
    'name': '',
    'comment': ''
  };

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
    },
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess.message);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id'])}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish ;this.setPrevNext(dish.id); this.visibility = 'shown' }, errmess => this.errMess = <any>errmess.message);
  }

  createForm()
  {
    this.feedbackForm = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2)]],
      rating:'5',
      comment:['', [Validators.required]]
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onSubmit() {
    //this.feedback = this.feedbackForm.value;
    this.comment = {
      rating: this.feedbackForm.value.rating,
      comment: this.feedbackForm.value.comment,
      author: this.feedbackForm.value.name,
      date: new Date().toISOString()
    }

    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save().subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.feedbackForm.reset({
      name:'',
      rating:'5',
      comment:''
    });
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

}
