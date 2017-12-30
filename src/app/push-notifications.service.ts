import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class PushNotificationsService {

  public PERMISSION_DEFAULT = 'default';
  public PERMISSION_GRANTED = 'granted';
  public PERMISSION_DENIED = 'denied';

  constructor() {
    if (!environment.oneSignal.enabled) {
      return;
    }
    OneSignal.push(['init', {
      appId: environment.oneSignal.appId,
      autoRegister: false
    }]);
  }

  isSupported(): boolean {
    return OneSignal.isPushNotificationsSupported();
  }

  getPermission(): Promise<string> {
    if (!environment.oneSignal.enabled) {
      return Promise.resolve(this.PERMISSION_DEFAULT);
    }

    return OneSignal.getNotificationPermission()
      .then(permission => {
        return permission;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  isEnabled(): Promise<boolean> {
    return OneSignal.isPushNotificationsEnabled()
      .then(isEnabled => {
        return isEnabled;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  register(): void {
    if (!environment.oneSignal.enabled) {
      return;
    }
    OneSignal.push(() => OneSignal.registerForPushNotifications());
  }

  setUser(id: string): void {
    if (!environment.oneSignal.enabled) {
      return;
    }
    OneSignal.push(['sendTag', 'user_id', id]);
    OneSignal.push(['setSubscription', true]);
  }

  enableNotifications(): void {
    if (!environment.oneSignal.enabled) {
      return;
    }

    OneSignal.push(['setSubscription', true]);
  }

  disableNotifications(): void {
    if (!environment.oneSignal.enabled) {
      return;
    }

    OneSignal.push(['setSubscription', false]);
  }

}
