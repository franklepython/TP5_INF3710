import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { EspeceoiseauComponent } from "./especeoiseau/especeoiseau.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "especeoiseaux", component: EspeceoiseauComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
