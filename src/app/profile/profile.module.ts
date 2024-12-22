import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { CirclePlus, CircleUserRound, LucideAngularModule, Luggage } from 'lucide-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    LucideAngularModule.pick({
          Luggage,
          CirclePlus,
          CircleUserRound,
        }),
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
