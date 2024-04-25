import nifti_backend = require("src/datasource/nifti/backend.ts");
import {
  GET_NIFTI_VOLUME_INFO_RPC_ID,
  VolumeSourceParameters,
} from "#src/datasource/nifti/base.js";
import zarr_base = require("src/datasource/zarr/base.ts")

//Call to registerPromiseRPC and passing nifti_volume_rpc_id to transform it
var nifti = new nifti_backend.registerPromiseRPC(GET_NIFTI_VOLUME_INFO_RPC_ID);

//Getting zarr_volume_rpc_id
var GET_ZARR_VOLUME_INFO_RPC_ID =new zarr_base.RPC_ID;

//Call to registerPromiseRPC and passing zarr_volume_rpc_id to transform it
var zarr = new nifti_backend.registerPromiseRPC(GET_ZARR_VOLUME_INFO_RPC_ID);
