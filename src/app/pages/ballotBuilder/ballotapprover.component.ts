import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-notify'
import { BallotService } from 'app/services/ballotService';
import { VoterVerificationService } from 'app/services/voterVerificationService';


@Component({
    selector: 'ballot-approver',
    templateUrl: 'ballotapprover.component.html'
})

export class BallotApprover implements OnInit{

    constructor(private ballotServ: BallotService, private vvs: VoterVerificationService){}
    isApprover = true
    ballot
    showballot
    approver={
        "mobileNo": 0,
        "stateId": 0,
        "action": 5003,
        "message":''

    }



    async ngOnInit(){

        console.log('test')
       
        await this.ballotServ.ballots.subscribe(bal =>
            {
                this.ballot = bal
                this.showballot = true
                // console.log(this.showballot)
                console.log(this.ballot)
            })

    }


        //Save the Current Ballot to the DB - Ballot Builder
        ApproveBallot() {
            $[`notify`]({message: 'Ballot Approved'}, {type: 'success'});
            //this.router.navigate(["/authorize"]);//Send Somewhere?
            this.ballot.isComplete = true
            this.ballot.isApproved = true
            this.ballot.status = 7002; //working status
            this.ballotServ.submitBallot(this.ballot)

        }
    
        //Send the Current Ballot for Approval - Ballot Builder
        RejectBallot() {
            $[`notify`]({message: 'Ballot Rejected'}, {type: 'danger'});
            //this.router.navigate(["/authorize"]);//Send Somewhere?
            this.ballot.isComplete = false
            this.ballot.isApproved = false;
            this.ballot.status =  7004; //approved
            this.ballotServ.submitBallot(this.ballot)
            console.log(this.ballot)
        }
}