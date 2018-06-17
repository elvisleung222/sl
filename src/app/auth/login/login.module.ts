import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterContainerComponent, ToasterModule, ToasterService, ToasterConfig, Toast, BodyOutputType} from 'angular2-toaster';

@NgModule({
    imports: [FormsModule, CommonModule, ToasterModule.forRoot()],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    providers: [NgbActiveModal, AngularFirestore, AngularFireAuth, ToasterService],
  })

export class LoginModule {

}