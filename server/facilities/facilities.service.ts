import { Injectable } from '@nestjs/common';
import { DbService } from '../database/db.service.js';

@Injectable()
export class FacilitiesService {
    constructor(private readonly db: DbService) {}

    getAllFacilities() {
        return this.db.facilities.map((fac) => {
            const unitsInFac = this.db.inventory.filter(
                (u) => u.facilityId === fac.id,
            );
            return {
                ...fac,
                totalUnitsInStock: unitsInFac.length,
                availableUnits: unitsInFac.filter(
                    (u) => u.status === 'Available',
                ).length,
            };
        });
    }

    getEquipment() {
        return this.db.equipment;
    }
}
