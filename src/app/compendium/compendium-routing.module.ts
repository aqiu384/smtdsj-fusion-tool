import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent } from './compendium.component';
import { DemonListContainerComponent } from './demon-list.component';
import { SkillListContainerComponent } from './skill-list.component';
import { FusionSettingsComponent } from './fusion-settings.component';
import { DemonEntryContainerComponent } from './demon-entry/demon-entry.component';
import { ReverseFusionTableComponent } from './demon-entry/reverse-fusion-table.component';
import { ForwardFusionTableComponent } from './demon-entry/forward-fusion-table.component';

const compendiumRoutes: Routes = [
    { path: '', redirectTo: 'demons', pathMatch: 'full' },
    {
        path: '',
        component: CompendiumComponent,
        children: [
            {
                path: 'demons/:demonName',
                component: DemonEntryContainerComponent,
                children: [
                    {
                        path: 'reverse-fusions',
                        component: ReverseFusionTableComponent
                    },
                    {
                        path: 'forward-fusions',
                        component: ForwardFusionTableComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'reverse-fusions',
                        pathMatch: 'full'
                    }
                ]
            },
            {
                path: 'demons',
                component: DemonListContainerComponent
            },
            {
                path: 'skills',
                component: SkillListContainerComponent
            },
            {
                path: 'settings',
                component: FusionSettingsComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'demons',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [ RouterModule.forChild(compendiumRoutes) ],
    exports: [ RouterModule ]
})
export class CompendiumRoutingModule { }
