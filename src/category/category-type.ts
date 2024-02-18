
export interface PriceConfigration {
    [key: string]: {
        priceType: 'base' | 'aditional'
        availableOptions: string[]
    }
}

export interface Attribute {
    name: string;
    widgetType: 'radio' | 'switch'
    defaultValue: string;
    availableOptions: string[]
}
export interface CategoryType {
    name: string;
    priceConfigration: PriceConfigration;
    attributes: Attribute[]

}