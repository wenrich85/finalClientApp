import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap-notify'
import { BallotService } from 'app/services/ballotService';

@Component({
    selector: 'admin-home',
    templateUrl: './adminHome.component.html'
})

export class AdminHome implements OnInit {
    constructor(private fb: FormBuilder, private ballotS: BallotService, private router: Router) { }

    ballot;
    displayForm = true;

    date = 7112020;
    precinct = 981;

    async ngOnInit() {

    }

    AdminHomeForm = this.fb.group({
        eDate: ["", Validators.required],
        Precinct: ["", Validators.required],
    });

    async onSubmit(route) {
        
        if (!this.AdminHomeForm.valid) {
            Object.keys(this.AdminHomeForm.controls).forEach(field => {
                const control = this.AdminHomeForm.get(field);
                control.markAsTouched({ onlySelf: true });

                //Display the Input Error Message to the User
                this.displayInputErrorMessage(control);
            });
            return;
        }
        let raw =this.AdminHomeForm.getRawValue()
        await this.ballotS.getBallot(this.dateToInt(raw.eDate), raw.Precinct, 2)
        await this.ballotS.ballots
                    .subscribe(res =>   
                    {
                        console.log(res)
                        this.ballot = res
                        if(res.status === 7001)
                        {
                            this.router.navigate([route]) 
                        }
                    })

        //Decide where to go from there

    }
    
    BallotButton()
    {
        this.onSubmit('/ballot');
    }

    ResultsButton()
    {
        this.onSubmit('/results');
    }

    dateToInt(date){

        let dateArray = date.split("-")
        let newDate='';
       

        for(let i=2; i >= 0; i--){
            let tempHold = ''

            if(dateArray[i].charAt(0) === '0'){
                tempHold = dateArray[i].substring(1)
                newDate += tempHold
            }else{
                newDate += dateArray[i]
            }
            
            
        }
        return parseInt(newDate)

    }
    //Display the Input Error Message to the User
    displayInputErrorMessage(control: AbstractControl) {
        //Valid Input - No Error Message
        if (control.valid && control.touched)
            return;

        //Input is not Valid, Display Error Message
        switch (control) {
            case this.AdminHomeForm.controls.eDate:
                $[`notify`]({message: 'Please enter a valid date'}, {type: 'danger'});
                break;

            case this.AdminHomeForm.controls.Precinct:
                $[`notify`]({message: 'Please enter a valid precinct'}, {type: 'danger'});
                break;
        }

    }

}
