import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BallotService } from '../../services/ballotService';
import { VoterVerificationService } from 'app/services/voterVerificationService';
import { take } from 'rxjs/operators';


@Component({
    selector: 'ballot-builder',
    templateUrl: 'ballotBuilder.component.html'
})

export class BallotBuilder implements OnInit {
    ballotForm: FormGroup;

    ballot;

    isDataAvailable = false;

    constructor(private formBuilder: FormBuilder, private ballotS: BallotService, private vvs: VoterVerificationService ) { }

    async ngOnInit() {
        //Initiates a ballot object using a date, ID & Role
        // await this.ballotS.getBallot(7112020, 100, 2)
        // Subscribe to ballot observable
        await this.ballotS.ballots.subscribe(ballot => {
            this.ballot = ballot;
            console.log(this.ballot)
        })
        await this.vvs.preRegistrantBSubject.
            subscribe(res => 
                console.log(res)
                )
            
        this.ballotForm = this.formBuilder.group({
            seatName:  ['', Validators.required],
            candidates: new FormArray([
            ])
        });

        this.listSeats
        
        
        //
        this.onAddCandidate();
        this.isDataAvailable = true;
    }

    get candidates() { return this.ballotForm.controls.candidates as FormArray; }

    onAddCandidate(){
        
        this.candidates.push(this.formBuilder.group({
            candidateId:[Math.floor(100 + Math.random() * 200)],
            cFirstName: ['', Validators.required],
            cLastName: ['', Validators.required],
            party: ['', [Validators.required]]
        }));
    }

    onReset(){
        this.ballotForm.reset();
        this.candidates.clear();
        this.onAddCandidate();
    }

    seatDict = {};

    listSeats(){
        for (let i = 0; i < this.ballot.seats.length; i++){
         
            if(!this.seatDict[this.ballot.seats[i].seatName]){
                this.seatDict[this.ballot.seats[i].seatName] = i 
            }
             
        }
    }

    onSubmit(){
       
        this.listSeats()

        
        let payLoad = JSON.parse(JSON.stringify(this.ballotForm.getRawValue()));
        payLoad['SeatID'] = Math.floor(100 + Math.random() * 900)
        console.log(payLoad)
        let index = this.seatDict[payLoad.seatName]
        if (index !== undefined){
            payLoad.candidates.forEach(candidate =>{
            this.ballot.seats[index].candidates.push(candidate)
            console.log(this.ballot.seats[index].candidates)
        })

            console.log(payLoad.seatName.toString())
            this.onReset();
            return

        }
        this.ballot.seats.push(payLoad)


        this.onReset();

            
            

      
            
       
        // console.log(this.ballot.seats)
    }
}
