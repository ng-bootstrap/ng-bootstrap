export declare class Trigger {
    open: string;
    close: string;
    constructor(open: string, close?: string);
    isManual(): boolean;
}
export declare function parseTriggers(triggers: string, aliases?: {
    hover: string[];
}): Trigger[];
export declare function listenToTriggers(renderer: any, nativeElement: any, triggers: string, openFn: any, closeFn: any, toggleFn: any): () => void;
