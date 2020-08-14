import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FacialRecognitionResponse } from '../models/face.model';

@Injectable()
export class FacialRecognitionService {
  constructor(private httpClient: HttpClient) { }

  verifyUserFace(faceIdLive: string, faceIdDatabase: string) {
    var myHeaders = new Headers();
    myHeaders.append("Ocp-Apim-Subscription-Key", environment.faceSubsciptionKey);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({ "faceId1": faceIdLive, "faceId2": faceIdDatabase });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    return fetch("https://eastus.api.cognitive.microsoft.com/face/v1.0/verify", requestOptions)
      .then(response => response.text())
  }

  scanImage(base64Image: string) {
    const headers = this.getHeaders(environment.faceSubsciptionKey, 'application/octet-stream');
    const params = this.getParams();
    const blob = this.makeblob(base64Image);

    return this.httpClient.post<FacialRecognitionResponse>(
      environment.endpoint + environment.detect,
      blob,
      {
        params,
        headers,
      }
    );
  }

  private makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  private getHeaders(subscriptionKey: string, contentType: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/octet-stream');
    headers = headers.set('Ocp-Apim-Subscription-Key', subscriptionKey);

    return headers;
  }

  private getParams() {
    const httpParams = new HttpParams()
      .set('returnFaceId', 'true')
      .set('returnFaceLandmarks', 'false')
      .set(
        'returnFaceAttributes',
        'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
      );

    return httpParams;
  }
}
