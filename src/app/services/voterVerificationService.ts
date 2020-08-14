import { Injectable } from '@angular/core';
import { PreRegInfo } from '../models/preRegInfo'
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuestionDemographics, QuestionResponse } from 'app/models/questionResponse';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class VoterVerificationService {
    constructor(private http: HttpClient, private router: Router) { }

    baseURL = "https://e-vote-api.azurewebsites.net/";

    private preRegistrantStore
    private preRegistrantSubject = new Subject<PreRegInfo>()
    preRegistrant = this.preRegistrantSubject.asObservable()
    private bioAuthSubject = new Subject()
    bioAuthResp = this.bioAuthSubject.asObservable()
    preRegistrantBSubject = new BehaviorSubject("Empty")

    endpoint = {
        5001: 'api/voter/OtpAuth',
        5002: 'api/voter/OtpAuth',
        5003: 'api/voter/Status',
        5004: 'api/voter/Status',        
        5005: 'api/voter/CreditFile',
        5006: 'api/voter/Face', //Action_Get_Face_Id
        5007: 'api/voter/Face', //Action_Save_Face_Id
        5010: 'api/Voter/BioAuth',
        5011: 'api/Voter/BioAuth',
        6006: 'api/voter/CreditFileAuth'
    }



    private questions = new Subject<QuestionResponse>()

    validateQuestions(questions: QuestionResponse): Observable<PreRegInfo> {

        return null;
    }

    preRegGetter() {
       return  this.preRegistrantSubject
            .subscribe(ans => {
                return ans
            })
    }

    getQuestions(): Observable<QuestionResponse> {
        return this.questions.asObservable();
    }

    updateQuestions(questions: QuestionResponse) {
        this.questions.next(questions);
    }

    getPreRegInfo(voter): Observable<any> {

        var myHeaders = new HttpHeaders();
        myHeaders.set("Content-Type", "application/json");

        var raw = {
            "mobileNo": voter.mobileNo,
            "stateId": voter.stateId,
            "action": voter.action,
            "message": voter.message
        };

        var requestOptions = {
            headers: myHeaders
        };
        try {
            this.http.post<any>(this.baseURL + this.endpoint[voter.action], voter, requestOptions)
                .subscribe(res => {
                    this.preRegistrantSubject.next(res),
                    this.preRegistrantBSubject.next(res)
                },
                    error => console.log('oops', error))
        } catch (e) {
            console.log(e)
        }

        return this.http.post<any>(this.baseURL + this.endpoint[voter.action], raw, requestOptions)


    }

    creditFile(qd: QuestionDemographics): Observable<QuestionResponse> {

        var myHeaders = new HttpHeaders();
        myHeaders.set("Content-Type", "application/json");


        console.log(qd)

        var raw = { "mobileNo": qd.mobileNo, "stateId": qd.stateId, "action": qd.action, "firstName": qd.firstName, "middleName": qd.middleName, "lastName": qd.lastName, "streetAddress": qd.streetAddress, "city": qd.city, "county": qd.county, "state": qd.state, "zip": qd.zip, "dob": qd.dob, "ssn": qd.ssn };
        var requestOptions = {
            headers: myHeaders,
        }
        this.http.post<QuestionResponse>(this.baseURL + this.endpoint[qd.action], raw, requestOptions)
            .subscribe(res => { this.updateQuestions(res) },
                error => console.log('oops', error))
        console.log(this.questions)
        return this.questions
    }

    creditFileAuth(qr: QuestionResponse) {
        var myHeaders = new HttpHeaders();
        myHeaders.set("Content-Type", "application/json");
        var raw = {
            "mobileNo": qr.mobileNo,
            "stateId": qr.stateId,
            "questions": [
                {
                    "qNum": qr.questions[0].qNum,
                    "answer": qr.questions[0].answer
                },
                {
                    "qNum": qr.questions[1].qNum,
                    "answer": qr.questions[1].answer
                },
                {
                    "qNum": qr.questions[2].qNum,
                    "answer": qr.questions[2].answer
                },
                {
                    "qNum": qr.questions[3].qNum,
                    "answer": qr.questions[3].answer
                },
                {
                    "qNum": qr.questions[4].qNum,
                    "answer": qr.questions[4].answer
                }
            ]
        };

        var requestOptions = {
            headers: myHeaders,
        }

        return this.http.post<PreRegInfo>(this.baseURL + this.endpoint[qr.action], raw, requestOptions)



    }

    faceIdAuth(voter: PreRegInfo): Observable<PreRegInfo> {
        var myHeaders = new HttpHeaders();
        myHeaders.set("Content-Type", "application/json");

        var raw = {
            "mobileNo": voter.mobileNo,
            "stateId": voter.stateId,
            "action": voter.action,
            "message": voter.message
        };

        var requestOptions = {
            headers: myHeaders
        };

        this.http.post<PreRegInfo>(this.baseURL + this.endpoint[voter.action], raw, requestOptions)
            .subscribe(res => {
                this.preRegistrantStore = res
                this.preRegistrantSubject.next(this.preRegistrantStore)
            },
                error => console.log('oops', error))

        return this.http.post<PreRegInfo>(this.baseURL + this.endpoint[voter.action], raw, requestOptions)

    }

    bioAuth(bioObj): Observable<PreRegInfo> {
        var myHeaders = new HttpHeaders();
        myHeaders.set("Content-Type", "application/json");
        console.log(this.baseURL + this.endpoint[bioObj.action])
        console.log(bioObj)

        var requestOptions = {
            headers: myHeaders
        };

        try {
            this.http.post<PreRegInfo>(this.baseURL + this.endpoint[bioObj.action], bioObj, requestOptions)
                .subscribe(res => {
                    this.bioAuthSubject.next(res)
                    console.log(res)
                    return res
                },
                    error => console.log('oops', error)
                )
        } catch (e) {
            console.log(e)
        }
        return null
    }
}
