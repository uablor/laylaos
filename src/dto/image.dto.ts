// // src/modules/images/dto/create-image.dto.ts
// import { Transform } from 'class-transformer';
// import { IsString, IsOptional, IsArray } from 'class-validator';

// export class CreateImageDto {
//   @IsOptional()
//   @IsArray()
//   @Transform(({ value }) => {
//     try {
//       return typeof value === 'string' ? JSON.parse(value) : value;
//     } catch {
//       return [];
//     }
//   })
//   venueIds?: number[];

//   @IsOptional()
//   @IsArray()
//   @Transform(({ value }) => {
//     try {
//       return typeof value === 'string' ? JSON.parse(value) : value;
//     } catch {
//       return [];
//     }
//   })
//   entertainmentIds?: number[];
// }
