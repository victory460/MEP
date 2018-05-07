import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { CoreModule } from './core/core.module';
import { SettingsModule } from '../pages/settings/settings.module';
import { InstrumentPanelModule } from '../pages/test-chart-ctrls/test-chart-ctrls.module';
import { DeviceManagerPageModule } from '../pages/device-manager-page/device-manager-page.module';
import { BodePageModule } from '../pages/bode/bode.module';
import { BodeModalPageModule } from '../pages/bode-modal/bode-modal.module';

//Services
import { CommandUtilityService } from '../services/device/command-utility.service';
import { FileUploadModule } from "ng2-file-upload";
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule }from '@angular/platform-browser';
import { HttpModule }from   '@angular/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        HttpModule,
        BrowserAnimationsModule,
        BrowserModule,
        CoreModule,
        FileUploadModule,
        SettingsModule,
        InstrumentPanelModule,
        DeviceManagerPageModule,
        BodePageModule,
        BodeModalPageModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [CommandUtilityService]
})
export class AppModule { }
