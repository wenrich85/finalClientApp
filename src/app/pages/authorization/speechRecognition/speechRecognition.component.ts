import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core'
import { SpeechRecognitionService } from '../../../services/speechRecognition.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VoterVerificationService } from '../../../../app/services/voterVerificationService';

@Component({
    selector: 'speech-recognition',
    templateUrl: './speechRecognition.component.html'
})

export class SpeechRecognition implements OnInit {
    isRecording = false;
    recordedTime;
    blob;
    blobUrl;
    base64;
    @Output('processSpeech') processSpeech: EventEmitter<any> = new EventEmitter();
    @Input() bioAuthInfo

    audioInfo = {
        "soundData": '',
        "speechData": ''

    }


    constructor(private audioRecordingService: SpeechRecognitionService, private sanitizer: DomSanitizer, private vvs: VoterVerificationService) {
        this.audioRecordingService.recordingFailed().subscribe(() => {
            this.isRecording = false;
        },
            error => console.log('oops', error));

        this.audioRecordingService.getRecordedTime().subscribe((time) => {
            this.recordedTime = time;
        },
            error => console.log('oops', error));

        this.audioRecordingService.getRecordedBlob().subscribe((data) => {
            this.blob = data.blob
            this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
            this.audioInfo.soundData = this.blobUrl
        },
            error => console.log('oops', error));
    }

    ngOnInit() {
        console.log(this.bioAuthInfo)
    }

    startRecording() {
        if (!this.isRecording) {
            this.isRecording = true;
            this.audioRecordingService.startRecording();
        }
    }

    abortRecording() {
        if (this.isRecording) {
            this.isRecording = false;
            this.audioRecordingService.abortRecording();
        }
    }

    stopRecording() {
        if (this.isRecording) {
            this.audioRecordingService.stopRecording();
            this.isRecording = false;
        }
    }

    clearRecordedData() {
        this.blob = null;
        this.blobUrl = null;
    }

    async submitRecording() {
        await this.convertBlobToB64()

    }

    async convertBlobToB64() {
        var reader = new FileReader();
        await reader.readAsDataURL(this.blob)
        reader.onloadend = () => {
            if (reader.result) {
                this.processSpeech.emit(reader.result.toString());
                console.log('Submitted')
            }
        };
    }

   getBioAuth(action, speech) {
        this.bioAuthInfo.action = action
        this.bioAuthInfo.speechData = this.formatBase64(speech)
        console.log(this.bioAuthInfo.speechData)
        try{
        this.vvs.bioAuth(this.bioAuthInfo)
        .subscribe(
            res => {if (res){
                console.log("Responding");
                if (res.action === 6010 || res.action === 6011) {
                    

                }
            }
            },
            error => console.log('oops', error)
        )
        }catch(e){
            console.error(e)

        }

    }

    formatBase64(string) {
        return string.substring(string.indexOf(',') + 1)
    }

    ngOnDestroy(): void {
        this.abortRecording();
    }
}
