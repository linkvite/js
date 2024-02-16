
export type Highlight = {
    _id?: string; // mongo id
    id: string; // uuid
    type: string;
    note?: string;
    owner: string;
    bookmark: string;
    body: HighlightBody[];
    target: HighlightTarget;
}

type HighlightBody = {
    type: string;
    value: string;
    purpose: string;
}

type HighlightTarget = {
    selector: HighlightTargetSelector[];
}

type HighlightTargetSelector = {
    type: string;
    exact?: string;
    start?: number;
    end?: number;
}
