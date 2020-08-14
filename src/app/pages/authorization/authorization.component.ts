import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { PreRegInfo } from '../../models/preRegInfo';
import { QuestionResponse } from 'app/models/questionResponse';
import * as $ from 'jquery';
import 'bootstrap-notify';
import { VoterVerificationService } from 'app/services/voterVerificationService';

@Component({
    selector: 'authorization',
    templateUrl: './authorization.component.html'
})

export class Authorization implements OnInit {
    constructor(private router: Router, private vvs: VoterVerificationService) { }

    @ViewChild('alert', { static: true }) alert: ElementRef;
    public displayVoterVerification: boolean = true;
    public displayMobileVerification: boolean = false;
    public displayFacialRecognition: boolean = false;
    public displaySpeechRecognition: boolean = false;
    public displayRegistration: boolean = false;
    public displayCreditQuestions: boolean = false;
    public displayBioInfo: boolean = false;
    public displayAdminHome: boolean = false;
    public preReg;
    public mobPreReg: PreRegInfo;
    public title = 'Authorization'

    bioAuthInfo = {
        "mobileNo": "",
        "stateId": "",
        "status": 0,
        "role": 0,
        "action": 0,
        "message": '',
        "speechData": '',
        "faceData": '',
        "stateIdData": ''
    }

    routes = {
        reg: '/registration',
        vote: '/vote'
    }

    async ngOnInit() {
        this.title = "Login"

        await this.vvs.preRegistrant
            .subscribe(res => {
                console.log(res)
                this.preReg = res
            })
        if (!this.preReg) {
            this.displayVoterVerification = true
        }
    }

    showAlert() {
        this.alert.nativeElement.classList.add('show');
    }

    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }

    questionRouter(response: QuestionResponse) {
        console.log(response.mobileNo)
    }

    errorNotifications(message: string) {
        $[`notify`]({

            message: message
        },
            {
                // settings
                type: 'danger'
            });
    }

    async voterVerificationResponse(res) {
        await this.vvs.getPreRegInfo(res)
        await this.vvs.preRegistrant
            .subscribe(pre => {
                if (pre) {
                    if (pre.action !== 5003) {
                        this.preReg = pre
                        this.checkStatusCode()
                        this.displayBioInfo = true;
                        this.bioAuthInfo.mobileNo = this.preReg.mobileNo
                        this.bioAuthInfo.stateId = this.preReg.stateId
                        this.bioAuthInfo.status = this.preReg.status
                        this.bioAuthInfo.role = this.preReg.role
                    }
                }

            })
    }

    mobileVerificationResponse(res) {
        if (res.action !== 5001) {
            this.preReg = res
            this.checkStatusCode()
        }
    }

    facialRecognitionResponse(resp) {
        this.bioAuthInfo.faceData = this.formatBase64(resp.faceData)
        this.preReg = resp;
        this.clearDisplay();
        this.displaySpeechRecognition = true;
        this.title = "Speech Recognition";
        this.bioAuthInfo.status = resp.status;
    }

    async processSpeechResponse(resp) {
        if (this.bioAuthInfo.status === 1001) {
            this.bioAuthInfo.action = 5010
            this.bioAuthInfo.speechData = this.formatBase64(resp)
            this.clearDisplay()
            await this.vvs.bioAuth(this.bioAuthInfo)
            this.vvs.bioAuthResp.subscribe(
                res => {
                    this.preReg = res
                    this.displayRegistration = true
                })


        } else if (resp.status === 1002) {
            this.bioAuthInfo.action = 5011
            this.bioAuthInfo.speechData = this.formatBase64(resp)
            this.clearDisplay()
            await this.vvs.bioAuth(this.bioAuthInfo)
            this.vvs.bioAuthResp
                .subscribe(res => {
                    this.preReg = resp
                    this.displayMobileVerification = true
                })


        } else if (resp.status === 1003) {
            this.bioAuthInfo.action = 5011
            this.bioAuthInfo.speechData = this.formatBase64(resp)
            this.clearDisplay()
            await this.vvs.bioAuth(this.bioAuthInfo)
            this.vvs.bioAuthResp
                .subscribe(res => {
                    this.preReg = resp
                    this.router.navigate([this.routes.vote])
                })
        }
    }

    async registrationResponse(qd) {


        if (qd) {
            console.log('here')
            await this.vvs.creditFile(qd)
            await this.vvs.getQuestions()
                .subscribe(res => console.log(res))
            this.clearDisplay()
            this.displayCreditQuestions = true

        }

    }

    async questionResponse(res) {
        this.preReg.action = 5004
        await this.vvs.getPreRegInfo(this.preReg)
        await this.vvs.preRegistrant
            .subscribe(res => {
                this.clearDisplay()
                console.log(res)
                console.log(this.preReg.action)
                if (res.action === 6003) {

                    this.preReg = res
                    this.displayMobileVerification = true
                    console.log(res.message)
                }

            })
    }

    formatBase64(string) {
        return string.substring(string.indexOf(',') + 1)
    }

    checkStatusCode() {
        let denialReasons = {
            1000: 'Your account is locked until ' + this.preReg.message,
            1004: 'Our records indicate that you have voted. ',
            1006: 'Your account was not found.'
        }
        if (denialReasons[this.preReg.status]) {
            this.clearDisplay()
            this.title = denialReasons[this.preReg.status]
            return
        }
        this.checkActionCode()
    }

    checkActionCode() {
        switch (this.preReg.action) {
            case 6010:
                if (this.preReg.status === 1001) {
                    this.displayRegistration = true
                    break;
                }
                break;
            case 6001:
                this.clearDisplay()
                this.title = "OTP Verification"
                this.displayMobileVerification = true
                break;
            case 6002:
                this.clearDisplay()
                this.title = "Facial Recognition"
                this.displayFacialRecognition = true
                break;
            case 6011:
                if (this.preReg.status === 1002) {
                    this.preReg.action = 6003
                    this.clearDisplay()
                    this.displayMobileVerification = true
                    break;
                } else if (this.preReg.status === 1003) {
                    this.router.navigate([this.routes.vote])
                    break;
                }
                break;
            case 6004:
                if (this.preReg.role === 0)
                {
                    this.router.navigate([this.routes.vote])
                    break;
                }
                this.clearDisplay()
                this.displayAdminHome = true
                
            case 9001:
                this.otpErrorResponse()
                break;
            case 9003:
                this.otpErrorResponse()
                break;
        }
    }

    clearDisplay() {
        this.displayVoterVerification = false
        this.displayMobileVerification = false
        this.displayFacialRecognition = false
        this.displaySpeechRecognition = false;
        this.displayRegistration = false;
        this.displayCreditQuestions = false;
        this.displaySpeechRecognition = false;
    }

    otpErrorResponse() {

        if (typeof (this.preReg.message) === "string") {
            this.errorNotifications('OTP was incorrect you have used ' + this.preReg.message + ' of 3 attempts')
            this.displayMobileVerification = true
            return
        }
        this.errorNotifications('Your account is locked until ' + this.preReg.message.toString())
    }
}
