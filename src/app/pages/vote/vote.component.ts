import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballotService';

@Component({
    selector: 'vote-cmp',
    templateUrl: 'vote.component.html'
})

export class VoteComponent implements OnInit{
    constructor(private ballotS:BallotService ){ }

    ballot;
    

    async ngOnInit(){
        await this.ballotS.getBallot(7112020, 981, 2)
        await this.ballotS.ballots.subscribe(ballot => {
            this.ballot = ballot;
            console.log(this.ballot)
    })
}


}
