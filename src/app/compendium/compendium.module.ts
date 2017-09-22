import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

// Demons, Skills and Settings
import { StickyTableHeaderComponent } from './sorted-table/sticky-table-header.component';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { CompendiumComponent } from './compendium.component';

import {
    DemonListComponent,
    DemonListContainerComponent,
    DemonTableHeaderComponent,
    DemonTableRowComponent
} from './demon-list.component';

import {
    SkillListComponent,
    SkillListContainerComponent,
    SkillTableHeaderComponent,
    SkillTableRowComponent
} from './skill-list.component';

import { FusionSettingsComponent } from './fusion-settings.component';

// Demon Entry
import {
    DemonEntryComponent,
    DemonEntryContainerComponent
} from './demon-entry/demon-entry.component';

import {
    DemonSkillsComponent
} from './demon-entry/demon-skills.component';

import {
    FusionTableRowComponent,
    FusionTableHeaderComponent,
    FusionTableComponent
} from './demon-entry/fusion-table.component';

import {
    SpecialReverseFusionTableComponent,
    ExceptionReverseFusionTableComponent,
    ReverseFusionTableComponent
} from './demon-entry/reverse-fusion-table.component';

import {
    ForwardFusionTableComponent
} from './demon-entry/forward-fusion-table.component';

// Services
import { CurrentDemonService } from './services/current-demon.service';
import { FusionDataService } from './services/fusion-data.service';
import { PositionEdgesService } from './sorted-table/position-edges.service';

@NgModule({
    imports: [
        BrowserModule,
        CompendiumRoutingModule
    ],
    declarations: [
        CompendiumComponent,
        StickyTableHeaderComponent,
        // Demon List
        DemonListComponent,
        DemonListContainerComponent,
        DemonTableHeaderComponent,
        DemonTableRowComponent,
        // Skill List
        SkillListComponent,
        SkillListContainerComponent,
        SkillTableHeaderComponent,
        SkillTableRowComponent,
        // Demon Skills
        DemonSkillsComponent,
        // Fusion Tables
        FusionTableRowComponent,
        FusionTableHeaderComponent,
        FusionTableComponent,
        // Reverse FusionTables
        SpecialReverseFusionTableComponent,
        ExceptionReverseFusionTableComponent,
        ReverseFusionTableComponent,
        // Other Components
        ForwardFusionTableComponent,
        DemonEntryComponent,
        DemonEntryContainerComponent,
        FusionSettingsComponent
    ],
    providers: [
        Title,
        CurrentDemonService,
        FusionDataService
    ]
})
export class CompendiumModule { }
