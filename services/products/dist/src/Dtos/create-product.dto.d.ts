export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryid: number;
    sellerid: number;
    images?: string[];
    createdate: Date;
    brand?: string;
    condition?: number;
}
