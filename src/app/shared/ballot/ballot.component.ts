import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BallotService } from '../../services/ballotService';
import * as $ from 'jquery';
import 'bootstrap-notify'
import { VoterVerificationService } from 'app/services/voterVerificationService';

@Component({
    selector: 'ballot',
    templateUrl: 'ballot.component.html'
})

export class Ballot implements OnInit {
    ballot;
    public isVoting = false;
    public isCreator = false;
    public isApprover = false;
    public demStrPartyVote = false;
    public repStrPartyVote = false;
    totalTimeRemaining: number = 300;
    minutes: number = 4;
    seconds: number = 59;
    interval;

    voted = {
        "mobileNo": "string",
        "stateId": "string",
        "action": 0,
        "precintName": "string",
        "precintId": 0,
        "electionDate": 0,
        "votes": [

        ]
    }

    confirmationVote = [];
    stageVotes = []

    voteSelction(vote) {
        this.voted.votes.push(vote)
    }

    constructor(private router: Router,
        private ballotS: BallotService,
        private elRef: ElementRef,
        private vvs: VoterVerificationService,) { }


    //Intialize the Canidate Array and Set the Precinct
    //Need to insert the Precinct from the user 
    ngOnInit() {
        this.vvs.preRegistrant.subscribe(res => { console.log(res) })
        //Decide if Voting Page      
        console.log(this.elRef.nativeElement.parentElement.nodeName);
        if (this.elRef.nativeElement.parentElement.nodeName === 'VOTE-CMP') {
            console.log("Voter Page");
            this.isVoting = true;
            this.startTimer();
        }
        else if (this.elRef.nativeElement.parentElement.nodeName === 'BALLOT-COMPILER') {
            console.log("Ballot Creator Page");
            this.isCreator = true;
        }
        else {
            console.log("Ballot Approver Page");
            this.isApprover = true;
        }

        this.ballotS.ballots.subscribe(ballot => {
            this.ballot = ballot;
            console.log(this.ballot)
        })
        // this.populateTestDate();        
    }


    //Get the Precinct - Later add routing to grad for the user
    getPrecinct() {
        return 'West Chester';
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.totalTimeRemaining > 0) {
                this.totalTimeRemaining--;
                if (this.seconds > 0) {
                    this.seconds--;
                } else {
                    this.minutes--;
                    this.seconds = 59
                }

            } else {
                this.totalTimeRemaining = 300;
                $[`notify`]({ message: 'Time has expired. Try again.' }, { type: 'danger' });
                this.router.navigateByUrl('/authorize');
            }
        }, 1000)
    }

    stageVote(event, seatId, candidateId, firstName, lastName, seatName) {
        if (!this.isVoting) {
            console.log("Not voting - Ignore User Clicks");
            return;
        }

        if (this.repStrPartyVote || this.demStrPartyVote) {
            console.log("Straight Party Selected - Do not select any candidates");
            return;
        }

        let voteSelection = { "seatID": seatId, "candidateId": candidateId }
        let displayVote = { "name": firstName + " " + lastName, "seatName": seatName }
        for (let i = 0; i < this.confirmationVote.length; i++) {
            let vote = this.confirmationVote[i]
            if (vote.seatName === displayVote.seatName) {
                this.confirmationVote.splice(i, 1)
            }
        }
        this.confirmationVote.push(displayVote)

        for (let i = 0; i < this.stageVotes.length; i++) {
            // console.log(vote.seatID)
            let vote = this.stageVotes[i]
            if (vote.seatID === voteSelection.seatID) {
                if (vote.candidateId === voteSelection.candidateId) {
                    this.unselectCandidate(i)
                    this.classToggler(voteSelection.candidateId)
                    console.log(this.stageVotes)
                    return;
                }
                this.replaceSeat(i, voteSelection)
                this.classToggler(voteSelection.candidateId)
                console.log(this.stageVotes)
                return;
            }
        }
        this.stageVotes.push(voteSelection)

        this.classToggler(candidateId)
        console.log(this.stageVotes)
    }


    unselectCandidate(index) {
        console.log("Unselect Canidate - No Replacement")
        this.stageVotes.splice(index, 1)
    }

    replaceSeat(index, vote) {
        console.log("Previously Selected Candidate Replaced")
        this.classToggler(this.stageVotes[index].candidateId)
        this.stageVotes.splice(index, 1)
        this.stageVotes.push(vote)
    }

    replaceDisplayVote(index, vote) {
        console.log("Previously Selected Candidate Replaced")
        this.classToggler(this.stageVotes[index].candidateId)
        this.stageVotes.splice(index, 1)
        this.stageVotes.push(vote)
    }


    classToggler(id) {
        var element = document.getElementById(id);
        element.classList.toggle("canidateSelector")
    }

    //User Submits thier Vote
    SubmitVote() {
        let confirmation: string = "";

        for (let vote of this.confirmationVote) {
            console.log(name);
            confirmation = confirmation + vote.seatName + ": " + vote.name + "\n";
        }

        if (confirm("Are you sure you want to submit your ballot? \n" + confirmation)) {
            this.voted.votes = this.stageVotes
            console.log(this.voted)
            $[`notify`]({ message: 'Ballot Submitted Successfully' }, { type: 'success' });
            // this.router.navigate(["/authorize"]);//Send Back to the Authorize Page 
        }
    }

    //Save the Current Ballot to the DB - Creator
    SaveBallot() {
        $[`notify`]({ message: 'Ballot Saved Successfully' }, { type: 'success' });
        // this.ballotS.saveBallot(this.voted)
        this.ballot.status = 7005;
        this.ballotS.saveBallot(this.ballot)
        // this.router.navigate(["/authorize"]);//Send home
    }

    //Send the Current Ballot for Approval - Creator
    Approval() {
        $[`notify`]({ message: 'Ballot Submitted for Approval' }, { type: 'success' });
        this.ballot.status = 7005;
        this.ballot.isComplete = true
        this.ballotS.saveBallot(this.ballot)
        // this.router.navigate(["/authorize"]);

    }

    //Save the Current Ballot to the DB - Ballot Builder
    ApproveBallot() {
        $[`notify`]({ message: 'Ballot Approved' }, { type: 'success' });
        //this.router.navigate(["/authorize"]);//Send Somewhere?
    }

    //Send the Current Ballot for Approval - Ballot Builder
    RejectBallot() {
        $[`notify`]({ message: 'Ballot Rejected' }, { type: 'danger' });
        //this.router.navigate(["/authorize"]);//Send Somewhere?
    }

    // Straight Party Radio Button Events - only for Voter
    onRadioChange(value) {
        if (value == "dem") {
            this.demStrPartyVote = true;
            this.repStrPartyVote = false;
            this.removeCandidates()
            this.addAllCandidates("Democrat")
            console.log(this.stageVotes)
        }
        else if (value == "rep") {
            this.repStrPartyVote = true;
            this.demStrPartyVote = false;
            this.removeCandidates()
            this.addAllCandidates("Republican")
            console.log(this.stageVotes)
        }
        else {
            this.repStrPartyVote = false;
            this.demStrPartyVote = false;
            this.removeCandidates()
            console.log(this.stageVotes)
        }
        // console.log("Rep " + this.repStrPartyVote + "\nDem " + this.demStrPartyVote)
    }

    //Add all candiates of the same party to the staged votes
    addAllCandidates(Party) {
        for (let i = 0; i < this.ballot.seats.length; i++) {
            for (let j = 0; j < this.ballot.seats[i].candidates.length; j++) {
                if (this.ballot.seats[i].candidates[j].party == Party) {
                    this.stageVotes.push(this.ballot.seats[i].candidates[j]);
                }
            }
        }
    }

    classRemover(id) {
        var element = document.getElementById(id);
        element.classList.remove("canidateSelector")
    }

    removeCandidates() {
        for (let i = 0; i < this.stageVotes.length; i++) {
            this.classRemover(this.stageVotes[i].candidateId)

        }
        this.stageVotes = [];
    }

}
