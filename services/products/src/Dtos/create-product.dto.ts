import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate, IsInt, IsArray } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Transform(({value}) => Number(value))
    @IsNumber()
    price: number;

    @Transform(({ value }) => Number(value))
    @IsInt()
    stock: number;

    @Transform(({ value }) => Number(value))
    @IsInt()
    categoryid: number;

    @Transform(({ value }) => Number(value))
    @IsInt()
    sellerid: number;

    @IsOptional()
    @IsArray()
    @IsString()
    images?: string[];

    @IsOptional()
    @IsDate()
    createdate: Date;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsInt()
    condition?: number;
}
