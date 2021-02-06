import { AuthService } from './../../services/auth.service';
import { UsuarioModel } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme: boolean = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
   }

   onSummit(registroForm: NgForm){
     if(registroForm.invalid) return;

     this.authService.registrarUsuario(this.usuario).subscribe(response => {
      console.log(response);
      if(this.recordarme){
        localStorage.setItem('email', this.usuario.email);
      }
      this.router.navigateByUrl('/home');
     },(err) => {
      console.log(err.error.error.message)
     });
   }


}
