export interface QuestionResponse{
    mobileNo: string;
    stateId: string;
    action: number;
    questions: Array<any>;

}

export interface QuestionDemographics{
    mobileNo: string;
    stateId: string;
    action: number;
    firstName: string;
    middleName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    county: string;
    state: string;
    zip: string;
    dob: string;
    ssn: string;

}

export interface Question{
    qNum: string;
    question: string;
    answer: number;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
}