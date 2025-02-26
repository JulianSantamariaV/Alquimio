export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryid: number;
    sellerid: number;
    image?: string[];
    createdate: Date;
    brand?: string;
    condition?: number;
}
