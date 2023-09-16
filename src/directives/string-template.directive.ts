import {
  Directive,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  Input,
  SimpleChange,
  ViewContainerRef,
  inject,
  EmbeddedViewRef,
} from '@angular/core';

@Directive({
  selector: '[stringTemplateOutlet]',
  exportAs: 'stringTemplateOutlet',
  standalone: true,
})
export class StringTemplateOutlet<_T = unknown> implements OnChanges {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<SafeAny>);

  @Input() stringTemplateOutletContext: SafeAny | null = null;
  @Input() stringTemplateOutlet: SafeAny | TemplateRef<SafeAny> = null;

  private context = new StringTemplateOutletContext();
  private embeddedViewRef: EmbeddedViewRef<SafeAny> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    const { stringTemplateOutlet, stringTemplateOutletContext } = changes;

    const shouldRecreateView = (): boolean => {
      let shouldOutletRecreate = false;

      if (stringTemplateOutlet) {
        if (stringTemplateOutlet.firstChange) {
          shouldOutletRecreate = true;
        } else {
          const isPreviousOutletTemplate =
            stringTemplateOutlet.previousValue instanceof TemplateRef;
          const isCurrentOutletTemplate =
            stringTemplateOutlet.currentValue instanceof TemplateRef;
          shouldOutletRecreate =
            isPreviousOutletTemplate || isCurrentOutletTemplate;
        }
      }

      const hasContextShapeChanged = (ctxChange: SimpleChange): boolean => {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});

        if (prevCtxKeys.length === currCtxKeys.length) {
          for (const propName of currCtxKeys) {
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };

      const shouldContextRecreate =
        stringTemplateOutlet &&
        hasContextShapeChanged(stringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };

    if (stringTemplateOutlet) {
      this.context.$implicit = stringTemplateOutlet.currentValue;
    }

    const recreateView = shouldRecreateView();

    if (recreateView) {
      /** recreate view when context shape or outlet change **/
      this.recreateView();
    } else {
      /** update context **/
      this.updateContext();
    }
  }

  private recreateView(): void {
    this.viewContainer.clear();

    const isTemplateRef = this.stringTemplateOutlet instanceof TemplateRef;
    const templateRef = (
      isTemplateRef ? this.stringTemplateOutlet : this.templateRef
    ) as SafeAny;

    this.embeddedViewRef = this.viewContainer.createEmbeddedView(
      templateRef,
      isTemplateRef ? this.stringTemplateOutletContext : this.context
    );
  }

  private updateContext(): void {
    const isTemplateRef = this.stringTemplateOutlet instanceof TemplateRef;
    const newCtx = isTemplateRef
      ? this.stringTemplateOutletContext
      : this.context;
    const oldCtx = this.embeddedViewRef!.context as SafeAny;

    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }
}

export class StringTemplateOutletContext {
  public $implicit: SafeAny;
}

export type SafeAny = any;
