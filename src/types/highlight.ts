import type { OBJECT_ID } from './generic';

export type Highlight = {
    /**
     * Mongo DB Object ID
     */
    _id: OBJECT_ID;

    /**
     * UUID V4
     * 
     * Recogito-js uses this as the ID for the highlight.
     */
    id: string;

    /**
     * From Recogito-js
     * 
     * But we only use "Annotation".
     */
    type: "Annotation";

    /**
     * A note for the highlight.
     * 
     * This is not the exact text that was highlighted.
     */
    note: string;

    /**
     * The user who created the highlight.
     */
    owner: OBJECT_ID;

    /**
     * The document that the highlight is in.
     */
    bookmark: OBJECT_ID;

    /**
     * Metadata about the highlight.
     */
    body: HighlightBody[];

    /**
     * Where the highlight is in the document.
     */
    target: HighlightTarget;
};

type HighlightBody = {
    type: string;
    value: string;
    purpose: string;
};

type HighlightTarget = {
    selector: HighlightTargetSelector[];
};

type HighlightTargetSelector = {
    type: string;
    exact?: string;
    start?: number;
    end?: number;
};
