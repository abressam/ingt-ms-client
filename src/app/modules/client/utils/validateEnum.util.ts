import { HttpException, HttpStatus } from '@nestjs/common';

export function validateEnumKey<T>(value: any, enumType: T): void {
    const validKeys = Object.keys(enumType) as Array<keyof T>;

    if (!validKeys.includes(value)) {
        const validValues = validKeys.join(', ');
        throw new HttpException(`Invalid value provided. Valid values are: ${validValues}.`, HttpStatus.BAD_REQUEST);
    }
}
