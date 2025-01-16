import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, SubscriptionLike, tap } from 'rxjs';
import { EventSourceService, Item, Message } from './event-source.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'serversideevents-ui';

  private readonly eventSourceSubscription: SubscriptionLike;

  warnings$ = new BehaviorSubject<Item[]>([
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
  ]);
  items$ = new BehaviorSubject<Item[]>([
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
    {
      Name: 'Name',
      Value: 0
    },
  ]);

  constructor(private eventSourceService: EventSourceService) {
    const url = 'http://localhost:5225/events';
    const eventNames = ['Information','Warning'];
    this.eventSourceSubscription = this.eventSourceService.connectToServerSentEvents(url, eventNames).pipe(
      tap( (data: Message) => {
        if(data.type == 'information') {
          const current = this.items$.value;
          current.push(data.item);
          if(current.length>10) {
            current.shift();
          }
          this.items$.next(current);
          return;
        }
        if(data.type == 'warning') {
          const current = this.warnings$.value;
          current.push(data.item);
          if(current.length>10) {
            current.shift();
          }
          this.warnings$.next(current);
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.eventSourceSubscription?.unsubscribe();
    this.eventSourceService.close();
}

}
