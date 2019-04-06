import {Component, OnInit} from '@angular/core';
import {AllRoutes} from "../../routing/AllRoutes";
import {ProjectService} from "../../lib/project/project.service";

@Component({
  selector: 'abc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  routes = AllRoutes;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
  }

  newProject() {
    this.projectService.createNewProject().subscribe();
  }

  closeProject() {
    window.close();
  }
}
