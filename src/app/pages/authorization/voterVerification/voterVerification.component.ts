import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { FormBuilder, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { VoterVerificationService } from 'app/services/voterVerificationService';
import { PreRegInfo } from 'app/models/preRegInfo';
import * as $ from 'jquery';
import 'bootstrap-notify'

@Component({
    selector: 'voter-verification',
    templateUrl: './voterVerification.component.html'
})

export class VoterVerification implements OnInit{
    constructor(private fb: FormBuilder, private vvs: VoterVerificationService) { }
    @Output('voterIsRegistered') voterIsRegistered: EventEmitter<PreRegInfo> = new EventEmitter();

    ngOnInit(){
      
    }

    voterVerificationForm = this.fb.group({
        phoneNumber: ['', Validators.required],
        stateId: ['', Validators.required],
        recaptcha: [null, Validators.required]
    });

    preReg={
        mobileNo: '',
        stateId: '',
        action: 0,
        status: 0,
        role: 0,
        message: null

    }
    showRequiredMessage: boolean = false;

    siteKey = "6Lc6kwEVAAAAABYqeOkugVG2usNCwFh340PkZGUH"

    //Drivers license Formatting. Do we need Custom Validation for each state?
    //https://ntsi.com/drivers-license-format/
    isFieldValid(field: string) {
        return !this.voterVerificationForm.get(field).valid && this.voterVerificationForm.get(field).touched;

    }

    onSubmit() {
        this.showRequiredMessage = false;
        
        if (!this.voterVerificationForm.valid) {
            Object.keys(this.voterVerificationForm.controls).forEach(field => {
                const control = this.voterVerificationForm.get(field);
                control.markAsTouched({ onlySelf: true });

                //Display the Input Error Message to the User
                this.displayInputErrorMessage(control);
            });

            this.showRequiredMessage = true;
            return;
        }

        this.preReg = {
            mobileNo: this.voterVerificationForm.value.phoneNumber,
            stateId: this.voterVerificationForm.value.stateId,
            action: 5003,
            status: 0,
            role: 1,
            message: null

        }

        this.voterIsRegistered.emit(this.preReg);

        



        //Call Service HERE
        //If successful call the voterIsRegistered() parent method like seen below. 
        //If invalid display error message on front end: "Your information was invalid. Please try again."

    }
    //Display the Input Error Message to the User
    displayInputErrorMessage(control: AbstractControl) {
        //Valid Input - No Error Message
        if (control.valid)
            return;

        //Input is not Valid, Display Error Message
        switch (control) {
            case this.voterVerificationForm.controls.phoneNumber:
                $[`notify`]({ message: 'Please enter a valid 10-Digit Phone Number' }, { type: 'danger' });
                break;

            case this.voterVerificationForm.controls.stateId:
                $[`notify`]({ message: 'Please enter a valid 10-Digit State ID Number' }, { type: 'danger' });
                break;

            case this.voterVerificationForm.controls.recaptcha:
                $[`notify`]({ message: 'Please Complete the Recaptcha' }, { type: 'danger' });
                break;

        }

    }


}
