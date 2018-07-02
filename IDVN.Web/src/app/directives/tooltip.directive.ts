import { Directive, Input, OnInit, Renderer2, ElementRef } from '@angular/core';

@Directive({
    selector: '[tooltip]'
})

export class TooltipDirective implements OnInit {
    @Input() public tooltip: string;
    @Input() public placement: string = 'top';

    constructor(
        private renderer: Renderer2,
        private el: ElementRef) { }

    ngOnInit() {
        this.renderer.setAttribute(this.el.nativeElement, 'data-original-title', this.tooltip);
        this.renderer.setAttribute(this.el.nativeElement, 'rel', 'tooltip');
        this.renderer.setAttribute(this.el.nativeElement, 'data-placement', this.placement);
        ($(this.el.nativeElement) as any).tooltip();
    }
}
