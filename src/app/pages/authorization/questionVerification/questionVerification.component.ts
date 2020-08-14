import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { PreRegInfo } from '../../../../app/models/preRegInfo';
import { VoterVerificationService } from '../../../../app/services/voterVerificationService';
import { QuestionResponse } from '../../../models/questionResponse';

@Component({
    selector: 'question-verification',
    templateUrl: './questionVerification.component.html'
})

export class QuestionVerification implements OnInit {
    constructor(private fb: FormBuilder, private vvs: VoterVerificationService) {
        
    }

    @Output('questionResponse') questionResponse: EventEmitter<any> = new EventEmitter();
    @Input() prereg: PreRegInfo;

    retrieveMailedOTP = false
    questions: QuestionResponse
    showForm: boolean = true;
    showNextSteps: boolean = false;
    showRequiredMessage: boolean = false;
    nextStepMessage: string = "";
    creditFileQuestionsForm = this.fb.group({
        question1: ['', Validators.required],
        question2: ['', Validators.required],
        question3: ['', Validators.required],
        question4: ['', Validators.required],
        question5: ['', Validators.required]
    });

    ngOnInit() {
        this.vvs.getQuestions()
            .subscribe(res => this.questions = res)
            console.log(this.prereg)
        
    }

    async onSubmit() {
        if (!this.creditFileQuestionsForm.valid) {
            this.showRequiredMessage = true;
            return;
        }

        this.questions.questions[0].answer = parseInt(this.creditFileQuestionsForm.value.question1);
        this.questions.questions[1].answer = parseInt(this.creditFileQuestionsForm.value.question2);
        this.questions.questions[2].answer = parseInt(this.creditFileQuestionsForm.value.question3);
        this.questions.questions[3].answer = parseInt(this.creditFileQuestionsForm.value.question4);
        this.questions.questions[4].answer = parseInt(this.creditFileQuestionsForm.value.question5);

        await this.vvs.creditFileAuth(this.questions)
            .subscribe(ans =>
                {
                    if(ans.action === 6007){
                        this.showRequiredMessage = false;
                        this.showForm = false;
                        this.showNextSteps = true;
                        this.nextStepMessage = `Your credit files questions have
                        been submitted and are correct. Please wait for One Time 
                        Code to be mailed to your home address with next steps`;
                         this.retrieveMailedOTP = true
                        return
                    }
                    this.showRequiredMessage = false;
                    this.showForm = false;
                    this.showNextSteps = true;
                    this.nextStepMessage = `Unfortunately we couldn't verify your
                    identity with the responses that you provide. Please come see
                    us in person to register.`
                    return

            })
        
        
    }


    getMailedOTP(){
        this.questionResponse.emit(5008)
    }



}
