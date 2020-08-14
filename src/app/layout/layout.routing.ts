import { Routes } from "@angular/router";

import { Authorization } from 'app/pages/authorization/authorization.component';
import { RegistrationComponent } from '../pages/authorization/registration/registration.component';
import { QuestionVerification } from '../pages/authorization/questionVerification/questionVerification.component';
import { FacialRecognition } from '../pages/authorization/facialRecognition/facialRecognition.component';
import { SpeechRecognition } from '../pages/authorization/speechRecognition/speechRecognition.component';
import { AdminHome } from 'app/pages/authorization/adminHome/adminHome.component';
import { Help } from 'app/shared/help/help.component';

import { VoteComponent } from 'app/pages/vote/vote.component';
import { BallotBuilder } from '../pages/ballotBuilder/ballotBuilder.component';
import { BallotCompiler } from '../pages/ballotBuilder/ballotcompiler.component';
import { BallotApprover } from '../pages/ballotBuilder/ballotapprover.component'

import { ElectionResults } from 'app/pages/electionResults/electionResults.component';




export const LayoutRoutes: Routes = [
  { path: "authorize", component: Authorization },
  { path: "vote", component: VoteComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "question", component: QuestionVerification },
  { path: "ballot-builder", component: BallotBuilder },
  { path: "ballot", component: BallotCompiler },
  { path: "speech-recognition", component: SpeechRecognition },
  { path: "facial-recognition", component: FacialRecognition },
  { path: "ballot-approver", component: BallotApprover },
  { path: "results", component: ElectionResults },
  { path: "admin-home", component: AdminHome },
  { path: "help", component: Help },

];
