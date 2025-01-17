import { Injectable, NgZone } from "@angular/core";
import { Observable, Subscriber } from "rxjs";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { environment } from "../environments/environment";

export interface Message {
    type: string;
    item: Item;
}
export interface Item {
  Name: string,
  Value: number
}

@Injectable({
    providedIn: 'root'
})
export class EventSourceService {
    private eventSource?: EventSource | null;

    constructor(private zone: NgZone) {}

    connectToServerSentEvents(url: string, eventNames: string[] = []): Observable<Message> {
        // this.eventSource = this.getEventSource(url, options);
        const self = this;
        return new Observable((subscriber: Subscriber<Message>) => {
            fetchEventSource(url, {
                headers: {
                    Authorization: environment.userType
                },
                onerror(error) {
                    self.zone.run(() => subscriber.error(error));
                },
                onmessage(msg) {
                    if(eventNames.findIndex(n => n === msg.event) > -1) {
                        console.log(`New ${msg.event} received`);
                        const item: Item = JSON.parse(msg.data);
                        self.zone.run(() => subscriber.next({
                            type: msg.event.toLowerCase(),
                            item
                        }));
                    }
                },
            })});
 
        // return new Observable((subscriber: Subscriber<Message>) => {
        //     if(this.eventSource != null) {
        //         this.eventSource.onerror = error => {
        //             this.zone.run(() => subscriber.error(error));
        //         };
        //         this.eventSource.addEventListener('Information', (event) => {
        //             console.log("New information received");
        //             const item: Item = JSON.parse(event.data);
        //             this.zone.run(() => subscriber.next({
        //                 type: "information",
        //                 item
        //             }));
        //         })
        //         this.eventSource.addEventListener('Warning', (event) => {
        //             console.log("New warning received");
        //             const item: Item = JSON.parse(event.data);
        //             this.zone.run(() => subscriber.next({
        //                 type: "warning",
        //                 item
        //             }));
        //         })
        //         // captures everything
        //         // this.eventSource.onmessage = (event) => {
        //         //     const item: Item = JSON.parse(event.data);
        //         //     console.log("New item received:", JSON.stringify(event));
        //         //     this.zone.run(() => subscriber.next(item));
        //         // };
        //     }
        // });
    }

    close(): void {
        if (!this.eventSource) {
            return;
        }
 
        this.eventSource.close();
        this.eventSource = null;
    }
}