import { Injectable } from '@angular/core';
import {ProjectClient} from "./ProjectClient";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private projectClient: ProjectClient) { }
}
