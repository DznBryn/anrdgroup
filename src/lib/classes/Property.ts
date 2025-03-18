import { ObjectId } from 'mongodb';

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PropertyFeatures {
  squareFeet: number;
  yearBuilt?: number;
  hasParking: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  petsAllowed: boolean;
  amenities: string[];
}

export interface PropertyFinancials {
  purchasePrice?: number;
  currentValue?: number;
  propertyTaxes?: number;
  insuranceCost?: number;
  maintenanceReserve?: number;
}

export interface PropertyTenant {
  tenantId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentDueDay: number;
  isActive: boolean;
}

export interface PropertyUnit {
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit: number;
  leaseTermMonths: number;
  leaseType: 'month-to-month' | 'lease';
  currentTenant?: PropertyTenant;
  previousTenants?: PropertyTenant[];
  isActive: boolean;
}

export type PropertyType = 
  | 'single-family' 
  | 'duplex' 
  | 'triplex' 
  | 'quadplex' 
  | 'multi-family' 
  | 'condo' 
  | 'townhouse' 
  | 'apartment-building' 
  | 'commercial';

export interface PropertyDocument {
  _id?: ObjectId;
  landlordId: string;
  address: PropertyAddress;
  features: PropertyFeatures;
  financials: PropertyFinancials;
  units: PropertyUnit[];
  propertyType?: PropertyType;
  images?: string[];
  documents?: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Property {
  _id?: ObjectId;
  landlordId: string;
  address: PropertyAddress;
  features: PropertyFeatures;
  financials: PropertyFinancials;
  units: PropertyUnit[];
  propertyType: PropertyType;
  images: string[];
  documents: string[];
  notes: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(propertyData: PropertyDocument) {
    this._id = propertyData._id;
    this.landlordId = propertyData.landlordId;
    this.address = propertyData.address;
    this.features = propertyData.features;
    this.financials = propertyData.financials;
    this.units = propertyData.units || [];
    this.propertyType = propertyData.propertyType || this.determinePropertyType();
    this.images = propertyData.images || [];
    this.documents = propertyData.documents || [];
    this.notes = propertyData.notes || '';
    this.isActive = propertyData.isActive;
    this.createdAt = propertyData.createdAt;
    this.updatedAt = propertyData.updatedAt;
  }

  private determinePropertyType(): PropertyType {
    const unitCount = this.units.length;
    
    if (unitCount === 0 || unitCount === 1) return 'single-family'; 
    if (unitCount === 2) return 'duplex';
    if (unitCount === 3) return 'triplex';
    if (unitCount === 4) return 'quadplex';
    if (unitCount > 4) return 'multi-family';
    
    return 'single-family'; // Default fallback
  }

  get fullAddress(): string {
    const { street, city, state, zipCode } = this.address;
    return `${street}, ${city}, ${state} ${zipCode}`;
  }

  get totalUnits(): number {
    return this.units.length;
  }

  get occupiedUnits(): number {
    return this.units.filter(unit => unit.currentTenant?.isActive).length;
  }

  get vacantUnits(): number {
    return this.totalUnits - this.occupiedUnits;
  }

  get occupancyRate(): number {
    if (this.totalUnits === 0) return 0;
    return (this.occupiedUnits / this.totalUnits) * 100;
  }

  get monthlyGrossIncome(): number {
    return this.units.reduce((total, unit) => total + unit.monthlyRent, 0);
  }

  get potentialMonthlyIncome(): number {
    return this.units.reduce((total, unit) => {
      if (unit.isActive) {
        return total + unit.monthlyRent;
      }
      return total;
    }, 0);
  }

  get annualGrossIncome(): number {
    return this.monthlyGrossIncome * 12;
  }

  get estimatedMonthlyExpenses(): number {
    const { propertyTaxes = 0, insuranceCost = 0, maintenanceReserve = 0 } = this.financials;
    return (propertyTaxes / 12) + (insuranceCost / 12) + (maintenanceReserve || 0);
  }

  get estimatedMonthlyNetIncome(): number {
    return this.monthlyGrossIncome - this.estimatedMonthlyExpenses;
  }

  get estimatedAnnualNetIncome(): number {
    return this.estimatedMonthlyNetIncome * 12;
  }

  get capRate(): number | null {
    if (!this.financials.currentValue || this.financials.currentValue === 0) return null;
    return (this.estimatedAnnualNetIncome / this.financials.currentValue) * 100;
  }

  get unitsWithExpiringLeases(): PropertyUnit[] {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return this.units.filter(unit => {
      if (!unit.currentTenant?.isActive) return false;
      
      const leaseEnd = new Date(unit.currentTenant.leaseEndDate);
      return leaseEnd <= thirtyDaysFromNow;
    });
  }

  getUnitByNumber(unitNumber: string): PropertyUnit | undefined {
    return this.units.find(unit => unit.unitNumber === unitNumber);
  }

  addUnit(unit: PropertyUnit): void {
    this.units.push(unit);
    this.propertyType = this.determinePropertyType();
    this.updatedAt = new Date();
  }

  updateUnit(unitNumber: string, updates: Partial<PropertyUnit>): boolean {
    const unitIndex = this.units.findIndex(unit => unit.unitNumber === unitNumber);
    if (unitIndex === -1) return false;
    
    this.units[unitIndex] = { ...this.units[unitIndex], ...updates };
    this.updatedAt = new Date();
    return true;
  }

  removeUnit(unitNumber: string): boolean {
    const initialLength = this.units.length;
    this.units = this.units.filter(unit => unit.unitNumber !== unitNumber);
    
    if (this.units.length !== initialLength) {
      this.propertyType = this.determinePropertyType();
      this.updatedAt = new Date();
      return true;
    }
    
    return false;
  }

  toDocument(): PropertyDocument {
    return this._id ? {
      _id: this._id,
      landlordId: this.landlordId,
      address: this.address,
      features: this.features,
      financials: this.financials,
      units: this.units,
      propertyType: this.propertyType,
      images: this.images,
      documents: this.documents,
      notes: this.notes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } : {
      landlordId: this.landlordId,
      address: this.address,
      features: this.features,
      financials: this.financials,
      units: this.units,
      propertyType: this.propertyType,
      images: this.images,
      documents: this.documents,
      notes: this.notes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
