import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballotService';

@Component({
    selector: 'election-results',
    templateUrl: './electionResults.component.html'
})

export class ElectionResults implements OnInit{
    constructor(private ballotS:BallotService ){ }


     results;
     district = 981;
    

    async ngOnInit(){
        // await this.ballotS.getBallot(7112020, this.district, 2)
        await this.ballotS.ballots.subscribe(ballot => {
            this.results = ballot;
            console.log(this.results)
            this.district = this.results.precintId
    })
}


}
