export interface CountyBallot {
    precintBallots: PrecintBallot[]
    electionDate : Date;
    isComplete : boolean;
    isApproved : boolean;
    creator: string;
    approver: string;
    lastModifiedDt: Date;
    approvalDate: Date;
}

export interface PrecintBallot {
    precintName: string;
    precintId: string;
    seats: Seat[]
}

export class Seat {
    seatName: string;
    candidates: Candidate[]
}

export class Candidate {
    candidateName: string;
    party: string;
}

export class CompleteBallot{
    precintId: string;
    electionDate : Date;
    isComplete : boolean;
    isApproved : boolean;
    creator: string;
    approver: string;
    lastModifiedDt: Date;
    approvalDate: Date;
    seats: Seat[];
    county: string;
    state: string;
    status: number;
    message: string;  

}