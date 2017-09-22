import {
    Component,
    ChangeDetectionStrategy,
    OnInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PositionEdges } from './sorted-table/position-edges';
import { PositionEdgesService } from './sorted-table/position-edges.service';
import { DemonListComponent } from './demon-list.component';

@Component({
    selector: 'app-demon-compendium',
    providers: [ PositionEdgesService ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="demon-compendium" [ngStyle]="{ marginLeft: 'auto', marginRight: 'auto', width: '1000px' }">
            <table class="app-sticky-table-header position-sticky">
                <thead>
                    <tr>
                        <th class="navbar"
                            routerLink="/demons"
                            routerLinkActive="active"
                            [style.width.%]="1"
                            [routerLinkActiveOptions]="{ exact: true }">
                            Demon List
                        </th>
                        <th class="navbar"
                            routerLink="/skills"
                            routerLinkActive="active"
                            [style.width.%]="1">
                            Skills List
                        </th>
                        <th class="navbar"
                            routerLink="/settings"
                            routerLinkActive="active"
                            [style.width.%]="1">
                            Fusion Settings
                        </th>
                    </tr>
                </thead>
            </table>
            <router-outlet></router-outlet>
            <div [style.textAlign]="'center'">
                <a href="https://www.youtube.com/watch?v=8eYf3OHqq9s">
                    https://www.youtube.com/watch?v=8eYf3OHqq9s
                </a>
            </div>
        </div>
    `
})
export class CompendiumComponent implements OnInit {
    parentEdges: Observable<PositionEdges>;

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);
            }
        });
    }
}
