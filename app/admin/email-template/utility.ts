export interface EmailTemplate {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    description: string
    template: string
}


export interface NewTemplate {
    id: string;
    description: string;
    template: string;
}
