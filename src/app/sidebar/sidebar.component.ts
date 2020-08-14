import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  // {
  //   path: "/dashboard",
  //   title: "Administration",
  //   icon: "nc-bank",
  //   class: ""
  // },
  //{ path: "/monitor", title: "Monitor", icon: "nc-sound-wave", class: "" },
  { path: "/authorize", title: "Login/Create Account", icon: "nc-bank", class:""},
  { path: "/help", title: "Help", icon: "", class:""},
  //{ path: "/registration",  title: "Registration", icon: "", class:""},
  //{ path: "/vote",  title: "Vote", icon: "", class:""}
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html"
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
}
