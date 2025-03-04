import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber,  IsInt, IsArray, IsIn, Min } from 'class-validator';

export class ProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1, {message : "El precio debe ser mayor a 0"})
    price: number;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1, {message : "El stock debe ser mayor a 0"})
    stock: number;
    
    @IsString()
    @IsIn(["1", "2", "3", "4"]) 
    condition: string;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1, {message : "La categoria no es valida"})
    categoryid: number;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1, {message : "El vendedor no es valido"})
    sellerid: number;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.map(String))
    image?: string[];

    @IsOptional()
    @IsString()
    brand?: string;

}
