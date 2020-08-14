import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { LayoutComponent } from './layout/layout.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

//Authorization
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { Authorization } from '../app/pages/authorization/authorization.component';
import { VoterVerification } from '../app/pages/authorization/voterVerification/voterVerification.component';
import { MobileVerification } from '../app/pages/authorization/mobileVerification/mobileVerification.component';
import { RegistrationComponent } from '../app/pages/authorization/registration/registration.component';
import { QuestionVerification } from '../app/pages/authorization/questionVerification/questionVerification.component';
import { AdminHome } from './pages/authorization/adminHome/adminHome.component';

//Facial Recognition
import { FacialRecognition } from '../app/pages/authorization/facialRecognition/facialRecognition.component';
import { FacialRecognitionService } from '../app/services/facialRecognition.service';
import { BrowserModule } from '@angular/platform-browser';
import { BoolToYesNoPipe } from './pipes/bool-to-yes-no.pipe';

//Ballot Handling
import { Ballot } from './shared/ballot/ballot.component';
import { BallotBuilder } from '../app/pages/ballotBuilder/ballotBuilder.component';
import { BallotCompiler } from '../app/pages/ballotBuilder/ballotcompiler.component';
import { VoteComponent } from './pages/vote/vote.component';
import { BallotApprover } from '../app/pages/ballotBuilder/ballotapprover.component';
import { ElectionResults } from './pages/electionResults/electionResults.component';
import { Help } from './shared/help/help.component';

//Speech Recognition
import { SpeechRecognition } from '../app/pages/authorization/speechRecognition/speechRecognition.component';
import { SpeechRecognitionService } from './services/speechRecognition.service';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    Authorization,
    VoterVerification,
    MobileVerification,
    RegistrationComponent,
    VoteComponent,
    QuestionVerification,
    BallotBuilder,
    Ballot,
    FacialRecognition,
    SpeechRecognition,
    BoolToYesNoPipe,
    BallotCompiler,
    BallotApprover,
    ElectionResults,
    AdminHome,
    Help
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    ReactiveFormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    HttpClientModule
  ],
  providers: [
    FacialRecognitionService,
    SpeechRecognitionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
