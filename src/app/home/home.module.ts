import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { LucideAngularModule, Luggage, CirclePlus, CircleUserRound } from 'lucide-angular';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LucideAngularModule.pick({
      Luggage,
      CirclePlus,
      CircleUserRound,
    }),
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
