import { CanActivateChild, CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
/*
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Verificar si el usuario está autenticado
    if (this.authService.isLoggedIn()) {
      return true; // Si el usuario está autenticado, permitir el acceso
    } else {
      // Si el usuario no está autenticado, redirigirlo a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}*/

@Injectable()
export class AuthGuard implements CanActivateChild {
    constructor(private router: Router, 
      private authService: AuthService, 
      //private store: Store<{ user: User }>
      ) { }

    canActivateChild() {
        const token = this.authService.getToken();

        if (token) {
            //this.store.dispatch(UserActions.addUser({ user: this.authService.getIdentity() as User }));
            return true;
        } else {
            sessionStorage.clear();
            this.router.navigate(['/login']);
            return false;
        }
    }
}