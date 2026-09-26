export type PartyType="Customer"|"Supplier"|"Both";
export type Party={id:string;name:string;phone:string;address?:string;gstin?:string;type?:PartyType;openingBalance:number};
export type Item={id:string;name:string;sku:string;unit:string;salePrice:number;purchasePrice:number;taxRate:number;stock:number;lowStock:number};
export type InvoiceStatus="Paid"|"Partial"|"Unpaid";
export type Invoice={id:string;number:string;partyId:string;partyName:string;date:string;item:string;qty:number;rate:number;discount:number;total:number;paid:number;status:InvoiceStatus};
export type LedgerEntry={id:string;partyId:string;date:string;reference:string;description:string;type:"debit"|"credit";amount:number};
export type Customer={id:string;name:string;phone:string;address:string};