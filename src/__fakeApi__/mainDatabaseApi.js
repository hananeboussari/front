import { subDays, subHours } from 'date-fns';

const now = new Date();

class MainDatabasesApi {
  getMainDatabases() {
    const mainDatabases = [
      {
        _id: '61e1e6feed41fdc9636147f1',
        customerId: "23576 CAD",
        customerIdShort: 23576,
        devise: "CAD",
        customerName: "GAUDREAU ENVIRONNEMENT INC.",
        productDescription: "JOURNALIER (TM)",
        productNumber: "400-80",
        quantity: 37.3,
        quantityInKg: 37300,
        price: 0,
        date: "2021-12-22T05:00:00.000+00:00",
        productType: "Sables revalorisés (TM)",
        priceConverted: 0,
        financialYear: "2021-2022",
        financialPeriod: "09 DECEMBRE",
        year: 2021,
        month: 12,
        semester: 2,
        day: 22,
        longCode: "23576 CAD400-80",
        environnmentNumber: null,
        format: "Vrac",
        __v: 0
      }
    ];

    return Promise.resolve(mainDatabases);
  }
}

export const mainDatabaseApi = new MainDatabasesApi();
