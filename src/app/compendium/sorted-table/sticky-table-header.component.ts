import {
    AfterViewChecked,
    Component,
    ChangeDetectionStrategy,
    Input,
    EventEmitter,
    ElementRef,
    OnInit,
    OnDestroy,
    Renderer2,
    ViewChild,
} from '@angular/core';

import { Observable } from 'Rxjs/Observable';
import { Subscription } from 'Rxjs/Subscription';

import { PositionEdges } from './position-edges';
import { PositionEdgesService } from './position-edges.service';

@Component({
    selector: 'app-sticky-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table #stickyHeader class="position-sticky">
            <ng-content></ng-content>
        </table>
    `
})
export class StickyTableHeaderComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('stickyHeader') stickyHeader: ElementRef;
    @Input() borderWidth = 1;

    private subscriptions: Subscription[] = [];
    private prevHeight: 0;
    private _edges: PositionEdges;

    constructor(
        private renderer: Renderer2,
        private edgesService: PositionEdgesService,
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.edgesService.parentEdges.subscribe(edges => {
                this.edges = edges;
            }));
    }

    ngOnDestroy() {
        for (const subcription of this.subscriptions) {
            subcription.unsubscribe();
        }
    }

    ngAfterViewChecked() {
        const height = this.stickyHeader.nativeElement.clientHeight;

        if (this.prevHeight !== height) {
            this.prevHeight = height;
            this.edgesService.nextEdges(this.edges);
        }
    }

    get edges(): PositionEdges {
        return Object.assign({}, this._edges, {
            top: this._edges.top + this.stickyHeader.nativeElement.clientHeight + this.borderWidth
        });
    }

    @Input() set edges(edges: PositionEdges) {
        this._edges = edges;
        this.renderer.setStyle(this.stickyHeader.nativeElement, 'top', `${edges.top}px`);
    }
}
