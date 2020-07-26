import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private apiPi: ApiServiceService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  onSubmit() {
    const itEmail = this.loginForm.value.username;
    const itPass = this.loginForm.value.password;
    console.log("send Login Api = " + itEmail + " , " + itPass);
    this.performLogin(itEmail, itPass)
  }

  performLogin(u, p) {
    console.log("will call api login");
    this.apiPi.postLogin(u, p).subscribe(res => {
      console.log("response DAta = " + res);
      if (res != null) {
        const user : UserModel = res.data;
        if (user !=  null) {
          localStorage.setItem('userData', JSON.stringify(user))
          localStorage.setItem('isConnectUser', 'True')
          this.router.navigate(['/users'])
        } else {
          console.log("User not found please verify your inputs")
        }
      }
    })
  }
}
