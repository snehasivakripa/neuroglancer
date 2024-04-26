import nifti_backend = require("src/datasource/nifti/backend.ts");
import {
  GET_NIFTI_VOLUME_INFO_RPC_ID,
  VolumeSourceParameters,
} from "#src/datasource/nifti/base.js";
import zarr_base = require("src/datasource/zarr/base.ts")
import zarr_backend = require("src/datasource/zarr/backend.ts")
import type { VolumeChunk } from "#src/sliceview/volume/backend.js";




//Call to registerPromiseRPC and passing nifti_volume_rpc_id to transform it
const nifti = new nifti_backend.registerPromiseRPC(GET_NIFTI_VOLUME_INFO_RPC_ID);

//Getting zarr_volume_rpc_id
const GET_ZARR_VOLUME_INFO_RPC_ID =new zarr_base.RPC_ID;

//Call to registerPromiseRPC and passing zarr_volume_rpc_id to transform it
const zarr = new nifti_backend.registerPromiseRPC(GET_ZARR_VOLUME_INFO_RPC_ID);

//Call to class ZarrVolumeChunkSource
//Initializing parameter cancellation token
// Call to download function in zarr.backend.ts to convert to zarr format
const zarrVolumeChunkSource = new zarr_backend.ZarrVolumeChunkSource();
const cancellationToken = new CancellationTokenSource();
zarrVolumeChunkSource.download(VolumeChunk, cancellationToken);
