import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username!: string;
  password!: string;
  error!: string;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      
      (result) => {
        // Si el inicio de sesión es exitoso, redirige al usuario al menú principal
        this.router.navigate(['/menu']);
      },
      (error) => {
        // Si hay un error en el inicio de sesión, muestra un mensaje de error
        //this.error = "Error de inicio de sesión. Por favor, verifica tus credenciales.";
        this.router.navigate(['/map']);
      }
    );
  }
}
