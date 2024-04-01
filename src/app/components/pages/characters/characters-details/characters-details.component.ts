import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-characters-details',
  templateUrl: './characters-details.component.html',
  styleUrls: ['./characters-details.component.scss']
})
export class CharactersDetailsComponent implements OnInit{

  constructor(private route: ActivatedRoute){
    this.route.params.pipe(
      take(1),
      tap(params => console.log(params))
    ).subscribe();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
