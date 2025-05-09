import { TVendor } from "./vendor.interface"
import { Vendor } from "./vendor.model"

const createVendorIntoDB = async ( payload:TVendor )=>{
    const result  = await Vendor.create(payload);
    return result;
};

export const VendorServices ={
    createVendorIntoDB
}