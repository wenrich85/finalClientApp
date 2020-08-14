import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { VoterVerificationService } from '../../../../app/services/voterVerificationService';

@Component({
    selector: 'mobile-verification',
    templateUrl: './mobileVerification.component.html'
})

export class MobileVerification implements OnInit {
    constructor(private fb: FormBuilder, private vvs: VoterVerificationService) { }
    @Output('mobileVerificationResponse') mobileVerificationResponse: EventEmitter<any> = new EventEmitter();

    @Input() prereg;

    OTPType = ''

    mobileVerificationForm = this.fb.group({
        mobileCode: ['', Validators.required]
    });

    ngOnInit() {
        if (this.prereg.action === 6001 || this.prereg.action === 9001) {
            this.OTPType = 'Mobile OTP'
        } else { this.OTPType = ' Mailed OTP' }
    }

    async onSubmit() {

        if (!this.mobileVerificationForm.valid) {
            return;
        }
        this.prereg.message = this.mobileVerificationForm.value.mobileCode
        this.mobileVerificationForm.reset()

        if (this.prereg.action === 6001 || this.prereg.action === 9001) {
            this.prereg.action = 5001
            console.log(this.prereg)
            await this.vvs.getPreRegInfo(this.prereg)
            await this.vvs.preRegistrant
                .subscribe(res => {
                    console.log(res)
                    if (res.action === 6002 || res.action === 9001) {
                        this.prereg = res
                        console.log(res)
                        this.mobileVerificationResponse.emit(res)
                        return
                    }

                })

            return
        } else if (this.prereg.action === 6003) {
            this.prereg.action = 5002
            console.log(this.prereg)
            await this.vvs.getPreRegInfo(this.prereg)
            await this.vvs.preRegistrant
                .subscribe(res => {
                    console.log(res);
                     
                    this.prereg = res
                })
            this.mobileVerificationResponse.emit(this.prereg)

        }

    }
}
