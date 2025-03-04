import { IsString, IsOptional, IsNumber, Min, IsInt, IsIn, IsArray } from "class-validator";
import { Transform } from "class-transformer";

export class ServiceDto {
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


}