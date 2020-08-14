import { Routes } from "@angular/router";

import { LayoutComponent } from "./layout/layout.component";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "authorize",
    pathMatch: "full"
  },
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./layout/layout.module#LayoutModule"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "authorize"
  }
];
