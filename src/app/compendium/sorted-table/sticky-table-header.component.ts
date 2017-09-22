import {
    AfterViewChecked,
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Input,
    EventEmitter,
    ElementRef,
    OnInit,
    OnDestroy,
    Renderer2,
} from '@angular/core';

import { Observable } from 'Rxjs/Observable';
import { Subscription } from 'Rxjs/Subscription';

import { PositionEdges } from './position-edges';
import { PositionEdgesService } from './position-edges.service';

@Component({
    selector: 'table.app-sticky-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>
    `
})
export class StickyTableHeaderComponent implements OnInit, OnDestroy, AfterViewChecked {
    @Input() borderWidth = 1;

    private subscriptions: Subscription[] = [];
    private prevHeight: 0;
    private _edges: PositionEdges;

    constructor(
        private elementRef: ElementRef,
        private changeDetector: ChangeDetectorRef,
        private renderer: Renderer2,
        private edgesService: PositionEdgesService,
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.edgesService.parentEdges.subscribe(edges => {
                this.edges = edges;
                this.changeDetector.markForCheck();
            }));
    }

    ngOnDestroy() {
        for (const subcription of this.subscriptions) {
            subcription.unsubscribe();
        }
    }

    ngAfterViewChecked() {
        const height = this.elementRef.nativeElement.clientHeight;

        if (this.prevHeight !== height) {
            this.prevHeight = height;
            this.edgesService.nextEdges(this.edges);
        }
    }

    get edges(): PositionEdges {
        return Object.assign({}, this._edges, {
            top: this._edges.top + this.elementRef.nativeElement.clientHeight + this.borderWidth
        });
    }

    @Input() set edges(edges: PositionEdges) {
        this._edges = edges;
        this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${edges.top}px`);
    }
}
