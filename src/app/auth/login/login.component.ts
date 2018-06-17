import { Component, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { log } from 'util';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterContainerComponent, ToasterModule, ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'auth-login',
  template: `
    <toaster-container [toasterconfig]="config"></toaster-container>
    <div *ngIf="onLoginForm && currentUser == undefined">
      <div class="modal-header">
        <span>登入</span>
        <button class="close" aria-label="Close" (click)="closeModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form name="loginForm" (ngSubmit)="login()" #f="ngForm" novalidate>
      <div class="modal-body">
        <div class="input-group">
          <input name="email" type="email" placeholder="電郵" class="form-control" [(ngModel)]="inputLoginEmail" required/>
        </div>
        <br/>
        <div class="input-group">
          <input name="password" type="password" placeholder="密碼" class="form-control" [(ngModel)]="inputLoginPassword" required/>
        </div>
        
      </div>
      <div class="modal-footer">
        <a href="javascript:;" (click)="goToPasswordReset()">忘記密碼？</a>
        <button class="btn btn-md btn-hero-secondary btn-demo" (click)="goToRegister()">註冊帳號</button>
        <button class="btn btn-md btn-danger">登入</button>
      </div>
      </form>
    </div>


    <div *ngIf="onRegisterForm && currentUser == undefined">
      <div class="modal-header">
        <span>註冊</span>
        <button class="close" aria-label="Close" (click)="closeModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form name="loginForm" (ngSubmit)="register()" #f="ngForm" novalidate>
      <div class="modal-body">
        <div class="input-group">
          <input name="email" type="email" placeholder="電郵" class="form-control" [(ngModel)]="inputRegisterEmail" required/>
        </div>
        <br/>
        <div class="input-group">
          <input name="password" type="password" placeholder="密碼" class="form-control" [(ngModel)]="inputRegisterPassword" required/>
        </div>
      </div>
      <div class="modal-footer">
        <a href="javascript:;" (click)="goToLogin()">< 登入</a>
        <button class="btn btn-md btn-success">註冊</button>
      </div>
      </form>
    </div>


    <div *ngIf="onPasswordResetFrom && currentUser == undefined">
      <div class="modal-header">
        <span>忘記密碼</span>
        <button class="close" aria-label="Close" (click)="closeModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form name="passwordResetForm" (ngSubmit)="passwordReset()" #f="ngForm" novalidate>
      <div class="modal-body">
        <div class="input-group">
          <input name="email" type="email" placeholder="電郵" class="form-control" [(ngModel)]="inputPasswordResetEmail" required/>
        </div>
      </div>
      <div class="modal-footer">
        <a href="javascript:;" (click)="goToLogin()">< 登入</a>
        <button class="btn btn-md btn-hero-secondary btn-demo">重設密碼</button>
      </div>
      </form>
    </div>

    
    <div *ngIf="currentUser != undefined">
      <button class="btn btn-md btn-hero-secondary btn-demo" (click)="logout()">登出</button>
    </div>
  `,
  
})

export class LoginComponent {

  modalHeader: string;
  fruit: Observable<any[]>;
  public inputLoginEmail: string = '';
  public inputLoginPassword: string = '';
  public inputRegisterEmail: string;
  public inputRegisterPassword: string;
  public inputPasswordResetEmail: string;
  private currentUser: firebase.User;

  onLoginForm = true;
  onRegisterForm = false;
  onPasswordResetFrom = false;
  constructor(private activeModal: NgbActiveModal, private db: AngularFirestore, private auth: AngularFireAuth, private toasterService: ToasterService, private changeDetectorRef: ChangeDetectorRef) {
  //   let ref = db.collection('fruit').doc('apple').ref;
  //   ref.get().then(function(doc) {
  //     if (doc.exists) {
  //         console.log("Document data:", doc.data());
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //     }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  // });
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      this.currentUser = user;
      console.log('[DEBUG]', 'User singed in with a saved authenication state');
      changeDetectorRef.detectChanges();
    }
  });
  }
  
  config: ToasterConfig;

  position = 'toast-top-full-width';
  animationType = 'slideUp';
  title = 'HI there!';
  content = `I'm cool toaster!`;
  timeout = 30000;
  toastsLimit = 5;
  type = 'default';

  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;

  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = ['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
  positions: string[] = ['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center',
    'toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];

  makeToast() {
    this.showToast(this.type, this.title, this.content);
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig(
    {
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit,
      showCloseButton: true
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  clearToasts() {
    this.toasterService.clear();
  }
  login(){
    if(this.inputLoginEmail == undefined || this.inputLoginPassword == undefined){
      this.showToast('warning', '警告', '電郵／密碼不能留空');
      return;
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return firebase.auth().signInWithEmailAndPassword(this.inputLoginEmail, this.inputLoginPassword)    .then((data) => {
        this.currentUser = this.auth.auth.currentUser;
        if (this.currentUser.emailVerified == false){
          this.currentUser.sendEmailVerification();
          this.showToast('warning', '閣下的電郵還未認證，認證連結已重新發送到閣下電郵。', '');
        }
        else{
          this.showToast('success', '登入成功', '');
          this.activeModal.close();
        }
  
        
        
  
      })
      .catch((error) => {
        this.showToast('error', '登入錯誤', error.message)
      });
    })

  }

  register(){
    if(this.inputRegisterEmail == undefined || this.inputRegisterPassword == undefined){
      this.showToast('warning', '警告', '電郵／密碼不能留空');
      return;
    }
    this.auth.auth.createUserWithEmailAndPassword(this.inputRegisterEmail, this.inputRegisterPassword)
    .then((data) => {
      this.currentUser = this.auth.auth.currentUser;
      this.currentUser.sendEmailVerification();
      this.showToast('success', '註冊成功，認證連結已發送到閣下電郵。', '');
    })
    .catch((error) => {
      this.showToast('error', '註冊錯誤', error.message)
    })
  }

  passwordReset(){
    if(this.inputPasswordResetEmail == undefined){
      this.showToast('warning', '警告', '電郵不能留空');
      return;
    }
    this.auth.auth.sendPasswordResetEmail(this.inputPasswordResetEmail)
    .then((data) => {
      this.showToast('success', '重設電郵己發至 '+this.inputPasswordResetEmail+'，請查看閣下郵箱。', '')
    })
    .catch((error) => {
      this.showToast('error', '錯誤', error.message)
    })
  }

  logout(){
    console.log("[DEBUG] User attempts to log out");
    firebase.auth().signOut()
    .then(() =>{
      this.currentUser = undefined;
      console.log("[DEBUG] User has logged out successfully");
      this.showToast('success', '你已成功登出','');
      this.changeDetectorRef.detectChanges();
    })
    .catch((error) => {
      this.showToast('error', '錯誤', error.message)
      console.log("[DEBUG] Singout Error:",error.message);
    })
    
  }
  closeModal() {
    this.activeModal.close();
  }

  goToLogin(){
    this.onLoginForm = true;
    this.onRegisterForm = false;
    this.onPasswordResetFrom = false;
  }

  goToRegister(){
    this.onLoginForm = false;
    this.onRegisterForm = true;
    this.onPasswordResetFrom = false;
  }

  goToPasswordReset(){
    this.onLoginForm = false;
    this.onRegisterForm = false;
    this.onPasswordResetFrom = true;
  }
}