import { Component, OnDestroy } from '@angular/core';
import { Network } from '@ionic-enterprise/network-information/ngx';
import { Subject } from 'rxjs';
import { merge } from 'rxjs/observable/merge';
import { mapTo, takeUntil } from 'rxjs/operators';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage implements OnDestroy {
  private readonly _destroyed$ = new Subject<void>();

  connected?: boolean;

  get type() {
    return this._platform.is('cordova') ? this._network.type : null;
  }

  constructor(
    private readonly _platform: Platform,
    private readonly _network: Network,
  ) {
    if (this._platform.is('cordova')) {
      merge(
        this._network.onConnect().pipe(mapTo(true)),
        this._network.onDisconnect().pipe(mapTo(false)),
      ).pipe(
        takeUntil(this._destroyed$),
      ).subscribe(connected => this.connected = connected);
    }
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
