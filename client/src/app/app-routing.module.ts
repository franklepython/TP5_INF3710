import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { EspeceComponent } from "./espece/espece.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "especes", component: EspeceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
