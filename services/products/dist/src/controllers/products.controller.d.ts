import { ProductsService } from '../products/products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(data: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        categoryid: number;
        sellerid: number;
    }): Promise<{
        name: string;
        productid: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryid: number;
        sellerid: number;
        image: Uint8Array | null;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        isactive: boolean | null;
        createdate: Date | null;
        updateat: Date | null;
        brand: string | null;
        condition: number | null;
    }>;
    findAll(): Promise<{
        name: string;
        productid: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryid: number;
        sellerid: number;
        image: Uint8Array | null;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        isactive: boolean | null;
        createdate: Date | null;
        updateat: Date | null;
        brand: string | null;
        condition: number | null;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        productid: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryid: number;
        sellerid: number;
        image: Uint8Array | null;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        isactive: boolean | null;
        createdate: Date | null;
        updateat: Date | null;
        brand: string | null;
        condition: number | null;
    } | null>;
    update(id: number, data: Partial<{
        name: string;
        description?: string;
        price: number;
        stock: number;
    }>): Promise<{
        name: string;
        productid: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryid: number;
        sellerid: number;
        image: Uint8Array | null;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        isactive: boolean | null;
        createdate: Date | null;
        updateat: Date | null;
        brand: string | null;
        condition: number | null;
    }>;
    remove(id: number): Promise<{
        name: string;
        productid: number;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryid: number;
        sellerid: number;
        image: Uint8Array | null;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        isactive: boolean | null;
        createdate: Date | null;
        updateat: Date | null;
        brand: string | null;
        condition: number | null;
    }>;
}
