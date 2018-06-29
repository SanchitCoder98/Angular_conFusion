import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class LeaderService {

  constructor(private restangular: Restangular) { }

  getLeaders(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList();
  }

  getLeader(id: number): Observable<Leader>{
    return this.restangular.one('leaders',  id).get();
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.restangular.all('leaders').getList({featured: true}).pipe(map(leaders => leaders[0]));
  }
}
